import { NextResponse } from 'next/server';

/**
 * API route to generate ephemeral tokens for OpenAI Realtime API
 * These tokens are used for WebRTC connections from the browser
 */
export async function GET() {
    const openaiKey = process.env.OPENAI_API_KEY;

    if (!openaiKey) {
        return NextResponse.json(
            { error: 'OpenAI API key not configured' },
            { status: 500 }
        );
    }

    try {
        // Create a new Realtime session with OpenAI
        const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openaiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-realtime-preview-2024-12-17',
                voice: 'alloy' // Default voice, can be customized later
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('OpenAI Realtime API error:', error);
            return NextResponse.json(
                { error: 'Failed to create Realtime session' },
                { status: response.status }
            );
        }

        const data = await response.json();

        return NextResponse.json({
            token: data.client_secret.value,
            expiresAt: data.client_secret.expires_at
        });
    } catch (error) {
        console.error('Error generating Realtime token:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
