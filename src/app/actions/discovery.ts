'use server';

import { db } from '@/db';
import { userProfiles, skills, interests, businessConcepts, businessPlans } from '@/db/schema';
import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';

const ConceptSchema = z.object({
    name: z.string().describe('The name of the business concept'),
    description: z.string().describe('A 2-sentence description of the business'),
    fitReason: z.string().describe('Why this fits the user profile'),
    conceptType: z.enum(['service', 'product', 'digital']).describe('The category of the business')
});

const ConceptsResultSchema = z.object({
    concepts: z.array(ConceptSchema).length(3)
});

export async function submitDiscoveryProfile(data: {
    availableCapital: string;
    riskTolerance: 'low' | 'medium' | 'high';
    preferredTimeCommitment: 'full-time' | 'side-hustle';
    skills: string[];
    interests: string[];
    location?: string;
}) {
    const profileId = uuidv4();

    // Create Profile
    await db.insert(userProfiles).values({
        id: profileId,
        // For now, no userId until auth is strictly defined
        availableCapital: data.availableCapital,
        riskTolerance: data.riskTolerance,
        preferredTimeCommitment: data.preferredTimeCommitment,
        location: data.location || null,
    });

    // Add Skills
    if (data.skills.length > 0) {
        await db.insert(skills).values(
            data.skills.map(skill => ({
                id: uuidv4(),
                profileId: profileId,
                name: skill,
                level: 'intermediate' // Defaulting for simplicity in v1
            }))
        );
    }

    // Add Interests
    if (data.interests.length > 0) {
        await db.insert(interests).values(
            data.interests.map(interest => ({
                id: uuidv4(),
                profileId: profileId,
                name: interest
            }))
        );
    }

    return { success: true, profileId };
}

export async function generateConcepts(profileId: string) {
    // 1. Fetch Profile Data
    const profile = await db.query.userProfiles.findFirst({
        where: eq(userProfiles.id, profileId),
        with: {
            skills: true,
            interests: true
        }
    });

    if (!profile) {
        throw new Error('Profile not found');
    }

    console.log("FETCHED PROFILE:", JSON.stringify(profile, null, 2));

    /*
        // Import Tavily (Dynamic import to avoid build issues if missing)
        const { tavily } = await import('@tavily/core');
    */

    // 1.5. Fetch Local Market Data (if location provided)
    let marketContext = "";
    if (profile.location) {
        try {
            // Check for API key
            if (process.env.TAVILY_API_KEY) {
                const { tavily } = await import('@tavily/core');
                const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

                const query = `underserved business needs, missing franchises, and market gaps in ${profile.location} related to ${(profile as any).interests?.[0]?.name || 'general business'} and ${(profile as any).skills?.[0]?.name || 'entrepreneurship'}`;

                console.log("SEARCHING TAVILY:", query);
                const searchResult = await tvly.search(query, {
                    search_depth: "basic",
                    max_results: 5,
                    include_answer: true
                });

                marketContext = `
                MARKET INTELLIGENCE FOR ${profile.location}:
                - Tavily Summary: ${searchResult.answer}
                - Search Results: ${searchResult.results.map((r: any) => `- ${r.title}: ${r.content}`).join('\n')}
                
                CRITICAL INSTRUCTION: You MUST use this market intelligence to suggest businesses that specifically fill these identified gaps. Mention the gap in the 'fitReason'.
                `;
            } else {
                console.log("Skipping search: No TAVILY_API_KEY found");
            }
        } catch (err) {
            console.error("SEARCH FAILED:", err);
            // Continue without search context
        }
    }

    const prompt = `
    Generate 3 distinct business concepts for a user with the following profile:
    - Interests: ${(profile as any).interests.map((i: any) => i.name).join(', ')}
    - Skills: ${(profile as any).skills.map((s: any) => s.name).join(', ')}
    - Capital Available: ${profile.availableCapital}
    - Risk Tolerance: ${profile.riskTolerance}
    - Commitment: ${profile.preferredTimeCommitment}
    - Location: ${profile.location || 'Not specified'}

    ${marketContext}

    The concepts should be viable, realistic startup ideas that match their resources.
    If location data is present, specifically recommend franchises or business types that are under-represented in that area.
  `;

    // 2. Call AI
    try {
        const result = await generateObject({
            model: anthropic('claude-3-5-sonnet-latest'),
            schema: ConceptsResultSchema,
            prompt: prompt,
        });

        // 3. Save Concepts to DB
        const savedConcepts = [];
        for (const concept of result.object.concepts) {
            const id = uuidv4();
            await db.insert(businessConcepts).values({
                id: id,
                profileId: profile.id,
                name: concept.name,
                description: concept.description,
                fitReason: concept.fitReason,
                conceptType: concept.conceptType
            });
            savedConcepts.push({ ...concept, id });
        }

        return savedConcepts;
    } catch (error) {
        console.error("GENERATE CONCEPTS ERROR:", error);
        throw error;
    }
}

export async function submitManualConcept(data: {
    businessType: string;
    location: string;
}) {
    const profileId = uuidv4();

    // Create minimal profile for context
    await db.insert(userProfiles).values({
        id: profileId,
        location: data.location || null,
        availableCapital: 'Not specified',
        riskTolerance: 'medium',
        preferredTimeCommitment: 'full-time'
    });

    // Generate Concept Details using AI
    const prompt = `
    User wants to start a "${data.businessType}" in "${data.location}".
    
    Task:
    1. Create a catchy, modern Business Name for this.
    2. Write a professional 2-sentence description of what this business does and its value proposition.
    3. Explain why this specific business type serves a need in this location (Fit Reason).

    Output JSON keys: name, description, fitReason.
    `;

    const { object } = await generateObject({
        model: anthropic('claude-3-5-sonnet-latest'),
        schema: z.object({
            name: z.string(),
            description: z.string(),
            fitReason: z.string()
        }),
        prompt: prompt
    });

    const conceptId = uuidv4();
    const concept = {
        id: conceptId,
        profileId: profileId,
        name: object.name,
        description: object.description,
        fitReason: object.fitReason, // AI generated rationale
        conceptType: 'manual',
    };

    await db.insert(businessConcepts).values(concept);

    return [concept];
}

export async function createPlanFromConcept(conceptId: string) {
    // 1. Fetch Concept
    const concept = await db.query.businessConcepts.findFirst({
        where: eq(businessConcepts.id, conceptId),
        with: {
            profile: true
        }
    });

    if (!concept) throw new Error("Concept not found");

    // 2. Create Plan
    const planId = uuidv4();
    await db.insert(businessPlans).values({
        id: planId,
        name: concept.name,
        problem: "Identified Gap: " + concept.fitReason,
        solution: concept.description,
        targetAudience: `People in ${concept.profile?.location || 'target market'} interested in ${concept.name}`,
        status: 'draft'
    });

    return { success: true, planId };
}

export async function expandPlanSections(planId: string) {
    // 1. Fetch Plan Details (which has cloning data)
    const plan = await db.query.businessPlans.findFirst({
        where: eq(businessPlans.id, planId)
    });

    if (!plan) throw new Error("Plan not found");

    // 2. Determine Location & Context 
    // (In a real app, we'd fetch the Concept->Profile->Location chain here, but for now we'll infer it from the target audience/solution text if we didn't persist the origin conceptId strongly)
    // To be robust, let's assume the location is embedded in the Target Audience string we created: "People in Boston..."
    const targetAudience = plan.targetAudience || "";
    const name = plan.name;
    const solution = plan.solution;

    // 3. Perform Deep Dive Search (Simulated for speed, or real if keys exist)
    let marketData = "";
    if (process.env.TAVILY_API_KEY) {
        try {
            const { tavily } = await import('@tavily/core');
            const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
            const query = `competitors, pricing, and market demand for ${name} (${solution}) in ${targetAudience}`;
            console.log("DEEP DIVE SEARCH:", query);
            const search = await tvly.search(query, { max_results: 5 });
            marketData = JSON.stringify(search.results);
        } catch (e) {
            console.error("Deep dive search failed", e);
        }
    }

    // 4. Generate Sections using Claude
    const prompt = `
    You are an expert Business Consultant.
    We are refining a new business plan: "${name}".
    Description: ${solution}
    Context: ${targetAudience}
    
    Market Data Research: ${marketData}

    Task:
    1. Write a precise "Market Analysis" (2 paragraphs). Mention specific local competitors if found in research.
    2. Write a "Financial Projection" summary (1 paragraph). Estimate startup costs and revenue potential based on industry standards for this specific business type in this location.

    Output format: JSON { "marketAnalysis": "...", "financials": "..." }
    `;

    const { object } = await generateObject({
        model: anthropic('claude-3-5-sonnet-latest'),
        schema: z.object({
            marketAnalysis: z.string(),
            financials: z.string()
        }),
        prompt: prompt
    });

    // 5. Update Plan
    await db.update(businessPlans).set({
        // businessPlans schema doesn't have marketAnalysis column yet? 
        // Checking schema... it has 'problem', 'solution', 'monetization'.
        // We might need to repurpose fields or add new ones. 
        // For V1, let's append to 'targetAudience' or 'monetization' or create new columns.
        // Let's assume we want to update 'monetization' with the financials and 'targetAudience' with market analysis for now to avoid schema drift, OR better:
        // Actually, looking at schema.ts, we only have { problem, targetAudience, solution, monetization }.
        // Let's put Market Analysis into 'targetAudience' (append) and Financials into 'monetization'.
        targetAudience: `${plan.targetAudience}\n\n### Market Analysis\n${object.marketAnalysis}`,
        monetization: `${plan.monetization || ''}\n\n### Financial Projections\n${object.financials}`
    }).where(eq(businessPlans.id, planId));

    return { success: true };
}
