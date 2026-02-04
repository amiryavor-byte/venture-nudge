import { db } from './index';
import { affiliatePrograms } from './schema';

const businessPhoneAffiliates = [
    // BUSINESS PHONE / VoIP SERVICES
    {
        id: crypto.randomUUID(),
        name: 'Nextiva',
        category: 'business_phone',
        description: 'Cloud-based business phone system with VoIP, video, and unified communications',
        commissionType: 'hybrid',
        commissionRate: '$100 per qualified lead + $100 per line sold',
        commissionNotes: 'Paid for both leads and sales. Lifetime account commissions.',
        estimatedCommissionValue: 50000, // $500 avg (5 lines typical)
        tierRank: 1,
        signupUrl: 'https://www.nextiva.com/partner-program',
        affiliateDashboardUrl: 'https://partnerstack.com',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://developers.nextiva.com',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['small_business', 'growth_stage']),
        recommendationTiming: 'during_setup',
        priority: 9,
        affiliateNetwork: 'PartnerStack / Impact',
        notes: 'REST API available. Strong CRM integrations. Managed through PartnerStack. 90-day cookie, commissions paid via PayPal/Stripe monthly.'
    },
    {
        id: crypto.randomUUID(),
        name: 'Dialpad',
        category: 'business_phone',
        description: 'AI-powered business phone system with voice intelligence and analytics',
        commissionType: 'tiered',
        commissionRate: '$100 demo gift card + $500-$5,000 per sale',
        commissionNotes: 'Gift card for demo completion, scaled commission based on seat count (11+ users required)',
        estimatedCommissionValue: 150000, // $1,500 avg
        tierRank: 2,
        signupUrl: 'https://www.dialpad.com/partners/',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://developers.dialpad.com',
        cookieDuration: 60,
        status: 'active',
        targetIndustries: JSON.stringify(['technology', 'sales', 'support']),
        targetBusinessTypes: JSON.stringify(['startup', 'growth_stage']),
        recommendationTiming: 'during_setup',
        priority: 8,
        notes: 'Comprehensive API for voice, SMS, analytics, contact center. Requires 12-month contract with 11+ users for commission. AI features are differentiator.'
    },
    {
        id: crypto.randomUUID(),
        name: '8x8',
        category: 'business_phone',
        description: 'Unified communications platform with voice, video, chat, and contact center',
        commissionType: 'tiered',
        commissionRate: 'Up to $15,000 per referral (ReferTo8 program)',
        commissionNotes: 'Paid after 90 days + one paid bill. Also has line-based program ($0.80-$80 per extension)',
        estimatedCommissionValue: 200000, // $2,000 avg
        tierRank: 3,
        signupUrl: 'https://www.8x8.com/partners',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://developer.8x8.com',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['growth_stage', 'enterprise']),
        recommendationTiming: 'scaling',
        priority: 7,
        affiliateNetwork: 'FlexOffers',
        notes: 'Enterprise-focused. Has Elevate Partner Program. API available for integrations. High commission but requires larger deals.'
    },
    {
        id: crypto.randomUUID(),
        name: 'Vonage Business',
        category: 'business_phone',
        description: 'Cloud communications with VoIP, SMS, video meetings, and team collaboration',
        commissionType: 'tiered',
        commissionRate: '$200-$10,000 based on lines activated',
        commissionNotes: '1-4 lines: $200, 5-9: $500, 10-24: $1,000, 25-49: $2,500, 50+: $5,000-$10,000',
        estimatedCommissionValue: 100000, // $1,000 avg
        tierRank: 4,
        signupUrl: 'https://www.vonage.com/business/partners/',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://developer.vonage.com',
        cookieDuration: 60,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['small_business', 'growth_stage', 'enterprise']),
        recommendationTiming: 'during_setup',
        priority: 7,
        affiliateNetwork: 'FlexOffers',
        notes: 'Visa rewards card payment. Requires W-9. Account active 90 days + 3 paid months before payout. Vonage API platform is very robust.'
    },
    {
        id: crypto.randomUUID(),
        name: 'GoToConnect',
        category: 'business_phone',
        description: 'Business phone system from GoTo (formerly Jive) with voice, SMS, and meetings',
        commissionType: 'hybrid',
        commissionRate: 'Commissions for leads, trials, and sales',
        commissionNotes: 'Also has referral partner program with one-time fees',
        estimatedCommissionValue: 50000, // $500 estimated avg
        tierRank: 5,
        signupUrl: 'https://www.goto.com/partners',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://developer.goto.com',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['small_business', 'mid_market']),
        recommendationTiming: 'during_setup',
        priority: 6,
        notes: 'Part of GoTo Partner Network. Dedicated affiliate team. Creative library for promotions. GoTo API available for integrations.'
    },
    {
        id: crypto.randomUUID(),
        name: 'Grasshopper',
        category: 'business_phone',
        description: 'Virtual phone system for entrepreneurs and small businesses (no desk phone required)',
        commissionType: 'fixed',
        commissionRate: '$100-$150 per sale',
        commissionNotes: 'Affiliate program pays $100-150 per customer signup on paid plan',
        estimatedCommissionValue: 12500, // $125 avg
        tierRank: 6,
        signupUrl: 'https://grasshopper.com/partners/',
        hasApi: false,
        apiIntegrationStatus: 'none',
        cookieDuration: 30,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['solopreneur', 'small_business']),
        recommendationTiming: 'during_setup',
        priority: 6,
        notes: 'Virtual phone only (no hardware). Best for solopreneurs and mobile workers. No API available. Monthly PayPal payments.'
    },
    {
        id: crypto.randomUUID(),
        name: 'Ooma Office',
        category: 'business_phone',
        description: 'Cloud-based business phone service for small businesses up to 20 users',
        commissionType: 'recurring',
        commissionRate: 'Category-leading residual compensation',
        commissionNotes: 'Residual payments + lucrative spiffs. Specific rates provided upon approval.',
        estimatedCommissionValue: 30000, // $300 estimated avg
        tierRank: 7,
        signupUrl: 'https://www.ooma.com/office-affiliate/',
        hasApi: true,
        apiIntegrationStatus: 'none',
        cookieDuration: 30,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['small_business']),
        recommendationTiming: 'during_setup',
        priority: 5,
        affiliateNetwork: 'FlexOffers',
        notes: 'Requires qualified customer to remain active for 90 days. Lead submission through affiliate portal. Has API but limited documentation.'
    },
];

async function seedBusinessPhoneAffiliates() {
    console.log('🌱 Seeding business phone affiliate programs...\n');

    for (const affiliate of businessPhoneAffiliates) {
        try {
            await db.insert(affiliatePrograms).values({
                ...affiliate,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            console.log(`✅ Added: ${affiliate.name} (${affiliate.category}) - API: ${affiliate.hasApi ? '✓' : '✗'}`);
        } catch (error) {
            console.error(`❌ Failed to add ${affiliate.name}:`, error);
        }
    }

    console.log(`\n🎉 Successfully seeded ${businessPhoneAffiliates.length} business phone affiliate programs!`);
    console.log('\n📊 API Availability:');
    const withApi = businessPhoneAffiliates.filter(p => p.hasApi).length;
    const withoutApi = businessPhoneAffiliates.filter(p => !p.hasApi).length;
    console.log(`  With API: ${withApi} programs`);
    console.log(`  Without API: ${withoutApi} programs`);

    console.log('\n🔗 Programs with APIs:');
    businessPhoneAffiliates
        .filter(p => p.hasApi)
        .forEach(p => console.log(`  - ${p.name}: ${p.apiDocsUrl}`));
}

seedBusinessPhoneAffiliates().catch(console.error);
