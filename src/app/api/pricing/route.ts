import { NextResponse } from 'next/server';
import { getActivePricing } from '@/lib/pricing-service';

export async function GET() {
    try {
        const tiers = await getActivePricing();
        return NextResponse.json({ tiers });
    } catch (error) {
        console.error('Failed to fetch pricing:', error);
        return NextResponse.json(
            { error: 'Failed to fetch pricing' },
            { status: 500 }
        );
    }
}
