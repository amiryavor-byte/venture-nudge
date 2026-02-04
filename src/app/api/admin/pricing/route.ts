import { NextResponse } from 'next/server';
import { db } from '@/db';
import { pricingConfig } from '@/db/schema';
import { getAllPricing, seedDefaultPricing } from '@/lib/pricing-service';
import { eq } from 'drizzle-orm';

// GET - Fetch all pricing (including inactive for admin)
export async function GET() {
    try {
        let tiers = await getAllPricing();

        // Seed default pricing if none exists
        if (tiers.length === 0) {
            await seedDefaultPricing();
            tiers = await getAllPricing();
        }

        return NextResponse.json({ tiers });
    } catch (error) {
        console.error('Failed to fetch pricing:', error);
        return NextResponse.json(
            { error: 'Failed to fetch pricing' },
            { status: 500 }
        );
    }
}

// PUT - Update pricing tiers
export async function PUT(req: Request) {
    try {
        const { tiers } = await req.json();

        if (!tiers || !Array.isArray(tiers)) {
            return NextResponse.json(
                { error: 'Invalid request body' },
                { status: 400 }
            );
        }

        // Update each tier
        for (const tier of tiers) {
            await db
                .update(pricingConfig)
                .set({
                    priceInCents: tier.priceInCents,
                    displayPrice: tier.displayPrice,
                    billingPeriod: tier.billingPeriod,
                    features: tier.features,
                    isActive: tier.isActive,
                    sortOrder: tier.sortOrder,
                    updatedAt: new Date(),
                })
                .where(eq(pricingConfig.id, tier.id));
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to update pricing:', error);
        return NextResponse.json(
            { error: 'Failed to update pricing' },
            { status: 500 }
        );
    }
}
