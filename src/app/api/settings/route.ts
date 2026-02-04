import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { appSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
    try {
        // Get glassmorphism theme setting
        const settings = await db
            .select()
            .from(appSettings)
            .where(eq(appSettings.key, 'glassmorphism_theme'))
            .limit(1);

        const glassmorphismTheme = settings[0]?.value || 'cosmic-purple';

        return NextResponse.json({
            glassmorphismTheme,
        });
    } catch (error) {
        console.error('Failed to load settings:', error);
        return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { glassmorphismTheme } = await request.json();

        if (!glassmorphismTheme) {
            return NextResponse.json({ error: 'Missing glassmorphismTheme' }, { status: 400 });
        }

        // Upsert glassmorphism theme setting
        const existing = await db
            .select()
            .from(appSettings)
            .where(eq(appSettings.key, 'glassmorphism_theme'))
            .limit(1);

        if (existing.length > 0) {
            await db
                .update(appSettings)
                .set({
                    value: glassmorphismTheme,
                    updatedAt: new Date(),
                })
                .where(eq(appSettings.key, 'glassmorphism_theme'));
        } else {
            await db.insert(appSettings).values({
                id: crypto.randomUUID(),
                key: 'glassmorphism_theme',
                value: glassmorphismTheme,
                category: 'theme',
            });
        }

        return NextResponse.json({ success: true, glassmorphismTheme });
    } catch (error) {
        console.error('Failed to save settings:', error);
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}
