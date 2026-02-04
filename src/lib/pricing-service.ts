import { db } from '@/db';
import { pricingConfig } from '@/db/schema';

export interface PricingTier {
    id: string;
    tier: string;
    priceInCents: number;
    displayPrice: string;
    billingPeriod?: string | null;
    features: string[];
    isActive: boolean;
    sortOrder: number;
}

export async function getAllPricing(): Promise<PricingTier[]> {
    const tiers = await db.query.pricingConfig.findMany({
        orderBy: (pricingConfig, { asc }) => [asc(pricingConfig.sortOrder)],
    });

    return tiers.map(tier => ({
        id: tier.id,
        tier: tier.tier,
        priceInCents: tier.priceInCents,
        displayPrice: tier.displayPrice,
        billingPeriod: tier.billingPeriod,
        features: (tier.features as string[]) || [],
        isActive: tier.isActive ?? true,
        sortOrder: tier.sortOrder ?? 0,
    }));
}

export async function getActivePricing(): Promise<PricingTier[]> {
    const allTiers = await getAllPricing();
    return allTiers.filter(tier => tier.isActive);
}

export async function seedDefaultPricing() {
    const existing = await db.query.pricingConfig.findMany();

    if (existing.length > 0) {
        console.log('Pricing already seeded');
        return;
    }

    const defaultPricing = [
        {
            id: 'one-time-download',
            tier: 'one_time',
            priceInCents: 29900, // $299
            displayPrice: '$299',
            billingPeriod: null,
            features: [
                'Complete investor-ready business plan',
                'Detailed 3-year financial projections',
                'In-depth competitive analysis',
                'Go-to-market strategy',
                'Single PDF download',
                'No ongoing updates',
            ],
            isActive: true,
            sortOrder: 2,
        },
        {
            id: 'monthly-subscription',
            tier: 'monthly',
            priceInCents: 499, // $4.99
            displayPrice: '$4.99',
            billingPeriod: 'month',
            features: [
                'Everything in one-time download',
                'Unlimited plan edits',
                'Continuous AI assistance',
                'Market data updates',
                'Business model encyclopedia access',
                'Cancel anytime',
            ],
            isActive: true,
            sortOrder: 1,
        },
        {
            id: 'annual-subscription',
            tier: 'annual',
            priceInCents: 4999, // $49.99
            displayPrice: '$49.99',
            billingPeriod: 'year',
            features: [
                'Everything in monthly plan',
                'Save 17% vs monthly ($59.88 value)',
                'Priority AI processing',
                'Early access to new features',
                'Advanced analytics (coming soon)',
            ],
            isActive: true,
            sortOrder: 0,
        },
    ];

    for (const pricing of defaultPricing) {
        await db.insert(pricingConfig).values(pricing);
    }

    console.log('Default pricing seeded successfully');
}
