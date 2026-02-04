import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';

// Helper check for Tavily (replacing SerpApi)
const HAS_TAVILY = !!process.env.TAVILY_API_KEY;

export async function POST(req: Request) {
    try {
        const { currentFeatures, focusArea, existingCompetitors } = await req.json();

        // 1. Search Logic (Using Tavily now)
        let searchResults = [];
        if (HAS_TAVILY) {
            const { tavily } = await import('@tavily/core');
            const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

            const query = `top competitors in ${focusArea || 'business landscape'} market share analysis features weaknesses`;
            const tvlyRes = await tvly.search(query, { max_results: 5, include_answer: true });

            searchResults = tvlyRes.results.map((r: any) => ({
                title: r.title,
                snippet: r.content,
                link: r.url
            }));
        } else {
            console.warn("No TAVILY_API_KEY found, using mock search data.");
            searchResults = [
                { title: "Competitor A", snippet: "Leading solution in the space." },
                { title: "Competitor B", snippet: "Affordable alternative for small businesses." }
            ];
        }

        // 2. AI Analysis Logic (Claude)
        const prompt = `
        Analyze the market based on these search results:
        ${JSON.stringify(searchResults)}

        Focus Area: ${focusArea}
        Existing Competitors (if any): ${JSON.stringify(existingCompetitors)}

        Return a JSON object with this EXACT structure:
        {
            "competitors": [
                { "name": "Name", "marketShare": 1-100, "aiScore": 1-100, "features": ["Top Feature"], "weaknesses": ["Weakness"] }
            ],
            "featureComparison": [
                { "feature": "Innovation", "us": 85, "competitors": 50 },
                { "feature": "Price", "us": 90, "competitors": 60 }
            ]
        }
        `;

        const { object } = await generateObject({
            model: anthropic('claude-3-5-sonnet-latest'),
            schema: z.object({
                competitors: z.array(z.object({
                    name: z.string(),
                    marketShare: z.number(),
                    aiScore: z.number(),
                    features: z.array(z.string()),
                    weaknesses: z.array(z.string())
                })),
                featureComparison: z.array(z.object({
                    feature: z.string(),
                    us: z.number(),
                    competitors: z.number()
                }))
            }),
            prompt: prompt
        });

        return NextResponse.json(object);

    } catch (error) {
        console.error("Market Analysis Failed:", error);
        return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
    }
}
