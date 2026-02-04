
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI safely
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'dummy-key',
});

// Helper check for SerpApi
const HAS_SERPAPI = !!process.env.SERPAPI_KEY;

export async function POST(req: Request) {
    try {
        const { currentFeatures, focusArea } = await req.json();

        // 1. Search Logic
        let searchResults = [];
        if (HAS_SERPAPI) {
            const query = `top catering software competitors ${focusArea || 'event management'}`;
            const serpUrl = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${process.env.SERPAPI_KEY}&num=10`;
            const serpRes = await fetch(serpUrl);
            const serpData = await serpRes.json();

            searchResults = serpData.organic_results?.map((r: any) => ({
                title: r.title,
                snippet: r.snippet,
                link: r.link
            })) || [];
        } else {
            console.warn("No SERPAPI_KEY found, using mock search data.");
            searchResults = [
                { title: "Total Party Planner", snippet: "Catering software for event management and staffing." },
                { title: "Caterease", snippet: "The world's leading catering and event planning software." },
                { title: "Curate", snippet: "Catering and floral software for event professionals." },
                { title: "Flex Catering", snippet: "Web based catering software for kitchen management." }
            ];
        }

        // 2. AI Analysis Logic
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({
                error: "OPENAI_API_KEY missing",
                mock: true
            });
        }

        const prompt = `
        Analyze the catering software market based on these search results:
        ${JSON.stringify(searchResults)}

        And compare with OUR current live features:
        ${JSON.stringify(currentFeatures)}

        Return a JSON object with this EXACT structure (no markdown):
        {
            "competitors": [
                { "name": "Name", "marketShare": 1-100, "aiScore": 1-100 (Innovation Score), "features": ["Top 2 Features"], "weaknesses": ["Top 2 Weaknesses relative to us"] }
            ],
            "featureComparison": [
                { "feature": "AI Automation", "us": 0-100, "competitors": 0-100 (avg) },
                { "feature": "Kosher/Dietary Logic", "us": 0-100, "competitors": 0-100 },
                { "feature": "Mobile Workflow", "us": 0-100, "competitors": 0-100 },
                { "feature": "Price/Value", "us": 0-100, "competitors": 0-100 }
            ]
        }
        
        Focus on identifying if they have 'AI' features. Be realistic about our 'us' score - we are a new, nimble AI-native app, they are incumbents.
        `;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a strategic business analyst." }, { role: "user", content: prompt }],
            model: "gpt-4-turbo-preview", // or gpt-3.5-turbo if cost concern, but 4 is better for JSON
            response_format: { type: "json_object" },
        });

        const analysis = JSON.parse(completion.choices[0].message.content || "{}");

        return NextResponse.json(analysis);

    } catch (error) {
        console.error("Market Analysis Failed:", error);
        return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
    }
}
