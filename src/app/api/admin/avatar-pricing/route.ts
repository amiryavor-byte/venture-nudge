import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { avatarPricingSettings } from '@/db/schema';

export async function GET() {
    try {
        const settings = await db.select().from(avatarPricingSettings).limit(1);

        if (settings.length === 0) {
            // Return defaults if no settings exist
            return NextResponse.json({
                id: 'default',
                proTierMarkup: 150,
                enterpriseMarkup: 130,
                sttCostPerMinute: 43,
                ttsCostPer1kChars: 1800,
                rtcCostPerMinute: 99,
                llmCostPerMessage: 200,
                freeTrialMessagesPerWeek: 3,
            });
        }

        return NextResponse.json(settings[0]);
    } catch (error) {
        console.error('Error fetching avatar pricing settings:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Upsert settings (update or insert)
        const result = await db
            .insert(avatarPricingSettings)
            .values({
                id: 'default',
                ...body,
                updatedAt: new Date(),
            })
            .onConflictDoUpdate({
                target: avatarPricingSettings.id,
                set: {
                    ...body,
                    updatedAt: new Date(),
                },
            });

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        console.error('Error saving avatar pricing settings:', error);
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}
