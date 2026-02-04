import { anthropic } from '@ai-sdk/anthropic';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { db } from '@/db';
import { userProfiles } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const maxDuration = 30;

// Tier-aware system prompt
function getSystemPrompt(tier: string, context: any) {
    const tierInstructions = tier === 'free' ? `
## ⚠️ USER SUBSCRIPTION TIER: FREE

Generate a USEFUL but INCOMPLETE business plan:

### ✅ INCLUDE (Full Detail):
- Executive summary
- Problem statement and solution
- Basic target audience demographics
- High-level monetization approach
- Simplified 1-year financial projection (revenue and expenses only)

### ⚠️ LIMIT (Surface Level Only):
- Market sizing: Mention industry size but NOT detailed TAM/SAM/SOM breakdown
- Competitive analysis: List 2-3 competitors with basic info ONLY
- Financial projections: Year 1 high-level numbers ONLY (no detailed breakdowns)

### ❌ OMIT Entirely:
- Detailed 3-year financial model
- Customer acquisition cost (CAC) analysis
- Detailed go-to-market channels and strategies
- Operational roadmap with milestones
- Legal and regulatory deep-dive
- Detailed pricing strategy justification

### 💡 ADD UPGRADE PROMPTS:
After each limited or omitted section, add a note like:
"🔒 **Upgrade to Premium** to unlock [detailed market sizing/3-year financials/complete go-to-market strategy]"

Make the free plan valuable enough to show potential, but clearly incomplete for serious execution.
` : `
## ✅ USER SUBSCRIPTION TIER: PAID (${tier.toUpperCase()})

Generate a COMPLETE, INVESTOR-READY business plan:

### Include Everything:
- Full market sizing with TAM/SAM/SOM analysis
- Deep competitive analysis (5+ competitors with SWOT)
- Complete 3-year financial model with detailed assumptions
- Comprehensive go-to-market strategy with specific channels
- Operational roadmap with quarterly milestones
- Legal and regulatory requirements analysis
- Detailed pricing strategy with competitive justification
- Customer acquisition cost (CAC) and lifetime value (LTV) analysis
`;

    return `
You are an expert Strategic Business Consultant analyzing a business plan for: "${context?.businessName || 'Client'}".

${tierInstructions}

CURRENT MARKET INTELLIGENCE:
${JSON.stringify(context?.competitors || [])}

YOUR GOAL:
Answer the user's strategic questions based EXACTLY on this data.
If they ask about competitors, quote the data we have.
If they ask for strategy, synthesize the weaknesses of competitors to suggest a winning angle.

You have access to real-time search if you need to fetch NEW info not in the context.
`;
}

export async function POST(req: Request) {
    const { messages, context, userId } = await req.json();

    // Fetch user's subscription tier (default to 'free' if not found)
    let subscriptionTier = 'free';
    if (userId) {
        try {
            const user = await db.query.userProfiles.findFirst({
                where: eq(userProfiles.id, userId),
            });
            subscriptionTier = user?.subscriptionTier || 'free';
        } catch (error) {
            console.error('Failed to fetch user tier:', error);
        }
    }

    const systemPrompt = getSystemPrompt(subscriptionTier, context);

    const result = streamText({
        model: anthropic('claude-3-5-sonnet-latest'),
        system: systemPrompt,
        messages,
        tools: {
            searchMarket: tool({
                description: 'Search for live market data if the existing context is insufficient',
                parameters: z.object({
                    query: z.string().describe('The search query for market research')
                }),
                execute: async ({ query }) => {
                    if (!process.env.TAVILY_API_KEY) return "Search unavailable (No API Key)";
                    try {
                        const { tavily } = await import('@tavily/core');
                        const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
                        const search = await tvly.search(query, { max_results: 3, include_answer: true });
                        return `Tavily Search Results for "${query}":\n${JSON.stringify(search.results)}`;
                    } catch (e) {
                        return "Search failed";
                    }
                },
            }),
        },
    });

    return (result as any).toDataStreamResponse();
}
