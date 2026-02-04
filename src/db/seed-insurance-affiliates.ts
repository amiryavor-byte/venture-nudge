import { db } from './index';
import { affiliatePrograms } from './schema';

const insuranceAffiliates = [
    // Top-Tier Insurance Affiliates
    {
        id: crypto.randomUUID(),
        name: 'Embroker',
        category: 'insurance',
        description: 'Commercial insurance brokerage for startups, tech companies, and professional services. Digital-first platform.',
        commissionType: 'fixed',
        commissionRate: '$250 per qualified signup',
        commissionNotes: 'High-value commission for every referral that signs up. 30-day cookie duration. Focuses on commercial insurance for modern businesses.',
        estimatedCommissionValue: 25000, // $250
        tierRank: 1,
        signupUrl: 'https://www.embroker.com/partners/',
        affiliateDashboardUrl: 'https://www.embroker.com/partners/dashboard',
        hasApi: true,
        apiIntegrationStatus: 'available',
        apiDocsUrl: 'https://developer.embroker.com/',
        cookieDuration: 30,
        status: 'active',
        targetIndustries: JSON.stringify(['technology', 'consulting', 'legal', 'saas']),
        targetBusinessTypes: JSON.stringify(['startup', 'growth_stage']),
        recommendationTiming: 'during_setup',
        priority: 10,
        notes: 'HIGHEST COMMISSION! $250 per signup. Perfect for startups and tech companies. Modern digital platform. Strong brand in tech sector.',
    },
    {
        id: crypto.randomUUID(),
        name: 'Policybee',
        category: 'insurance',
        description: 'Online business insurance broker with instant quotes and coverage across multiple policy types.',
        commissionType: 'fixed',
        commissionRate: 'Up to $40 per policy sold',
        commissionNotes: 'Commission paid for every policy sold through referral. Covers liability, professional indemnity, and more.',
        estimatedCommissionValue: 4000, // $40
        tierRank: 2,
        signupUrl: 'https://www.policybee.co.uk/affiliates',
        hasApi: false,
        apiIntegrationStatus: 'none',
        cookieDuration: 30,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['startup', 'solopreneur', 'growth_stage']),
        recommendationTiming: 'during_setup',
        priority: 7,
        notes: 'Up to $40 per policy. Quick online quotes. Wide range of business insurance types.',
    },
    {
        id: crypto.randomUUID(),
        name: 'Thimble',
        category: 'insurance',
        description: 'On-demand liability insurance for small businesses, freelancers, and self-employed professionals.',
        commissionType: 'fixed',
        commissionRate: '$30 per qualified lead',
        commissionNotes: 'No monthly earning limit. Great for freelancers and gig workers who need flexible insurance coverage.',
        estimatedCommissionValue: 3000, // $30
        tierRank: 2,
        signupUrl: 'https://www.thimble.com/partners',
        affiliateDashboardUrl: 'https://www.thimble.com/partners/dashboard',
        hasApi: false,
        apiIntegrationStatus: 'none',
        cookieDuration: 30,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['solopreneur', 'freelance']),
        recommendationTiming: 'during_setup',
        priority: 8,
        notes: '$30 per lead, no monthly cap. Perfect for freelancers! On-demand coverage by the job or month.',
    },
    {
        id: crypto.randomUUID(),
        name: 'Hiscox',
        category: 'insurance',
        description: 'Small business insurance specialist covering professional liability, general liability, and business owner policies.',
        commissionType: 'fixed',
        commissionRate: '$25 per qualified quote',
        commissionNotes: '7-day cookie duration. Strong brand in professional liability and E&O insurance.',
        estimatedCommissionValue: 2500, // $25
        tierRank: 2,
        signupUrl: 'https://www.hiscox.com/partners',
        hasApi: false,
        apiIntegrationStatus: 'none',
        cookieDuration: 7,
        status: 'active',
        targetIndustries: JSON.stringify(['consulting', 'legal', 'healthcare', 'technology']),
        targetBusinessTypes: JSON.stringify(['startup', 'solopreneur', 'growth_stage']),
        recommendationTiming: 'during_setup',
        priority: 7,
        notes: '$25 per qualified quote. Specializes in professional liability (E&O). Strong reputation in small business insurance.',
    },
    {
        id: crypto.randomUUID(),
        name: 'Simply Business',
        category: 'insurance',
        description: 'Online insurance brokerage platform serving 1,000+ professions with comprehensive small business coverage.',
        commissionType: 'percentage',
        commissionRate: '10% commission on sales',
        commissionNotes: '30-day cookie duration. Performance incentives available. Wide range of business insurance products.',
        estimatedCommissionValue: 5000, // $50 avg (estimated on $500 policy)
        tierRank: 2,
        signupUrl: 'https://www.simplybusiness.com/partners/',
        affiliateDashboardUrl: 'https://www.simplybusiness.com/partners/dashboard',
        hasApi: true,
        apiIntegrationStatus: 'available',
        cookieDuration: 30,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['startup', 'solopreneur', 'growth_stage']),
        recommendationTiming: 'during_setup',
        priority: 7,
        notes: '10% commission + performance bonuses. Serves 1,000+ professions. Comprehensive platform.',
    },
    {
        id: crypto.randomUUID(),
        name: 'Next Insurance',
        category: 'insurance',
        description: 'Digital-first small business insurance with instant quotes and coverage. Popular with contractors and service businesses.',
        commissionType: 'hybrid',
        commissionRate: 'Commission per lead/sale (vary by product)',
        commissionNotes: 'Fast-growing digital insurance platform. Strong in trades, contractors, and service industries.',
        estimatedCommissionValue: 3000, // $30 avg (estimated)
        tierRank: 2,
        signupUrl: 'https://www.nextinsurance.com/partners/',
        hasApi: true,
        apiIntegrationStatus: 'available',
        apiDocsUrl: 'https://developer.nextinsurance.com/',
        cookieDuration: 30,
        status: 'active',
        targetIndustries: JSON.stringify(['construction', 'trades', 'services', 'retail']),
        targetBusinessTypes: JSON.stringify(['startup', 'solopreneur']),
        recommendationTiming: 'during_setup',
        priority: 8,
        notes: 'Digital-first platform. Great for contractors and service businesses. Instant quotes and coverage.',
    },
    {
        id: crypto.randomUUID(),
        name: 'Insurance Protector',
        category: 'insurance',
        description: 'Independent insurance broker providing comprehensive business insurance solutions and advisors.',
        commissionType: 'percentage',
        commissionRate: '20% on initial sale + 10% on renewals',
        commissionNotes: 'Recurring commission structure! Earn 20% on first sale, then 10% on every renewal as long as customer stays.',
        estimatedCommissionValue: 8000, // $80 avg initial (estimated on $400 policy)
        tierRank: 1,
        signupUrl: 'https://www.insuranceprotector.com/affiliates',
        hasApi: false,
        apiIntegrationStatus: 'none',
        cookieDuration: 30,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['startup', 'growth_stage', 'enterprise']),
        recommendationTiming: 'during_setup',
        priority: 9,
        notes: 'RECURRING REVENUE! 20% initial + 10% renewals. Long-term passive income potential.',
    },
    {
        id: crypto.randomUUID(),
        name: 'CoverWallet',
        category: 'insurance',
        description: 'Business insurance platform (acquired by Aon) offering multiple policy types through a single digital platform.',
        commissionType: 'hybrid',
        commissionRate: 'Commission per sale (rates vary)',
        commissionNotes: 'Backed by major insurance broker Aon. Comprehensive coverage options for businesses of all sizes.',
        estimatedCommissionValue: 4000, // $40 avg (estimated)
        tierRank: 2,
        signupUrl: 'https://www.coverwallet.com/partners',
        hasApi: true,
        apiIntegrationStatus: 'available',
        cookieDuration: 30,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['startup', 'growth_stage', 'enterprise']),
        recommendationTiming: 'during_setup',
        priority: 7,
        notes: 'Owned by Aon (major broker). Strong credibility. Multiple insurance types on one platform.',
    },
    {
        id: crypto.randomUUID(),
        name: 'Pie Insurance',
        category: 'insurance',
        description: 'Workers\' compensation insurance for small businesses with a focus on fair pricing and digital experience.',
        commissionType: 'hybrid',
        commissionRate: 'Commission per policy (rates vary)',
        commissionNotes: 'Specializes in workers comp. Good for businesses with employees in construction, trades, and retail.',
        estimatedCommissionValue: 3500, // $35 avg (estimated)
        tierRank: 3,
        signupUrl: 'https://www.pieinsurance.com/partners',
        hasApi: false,
        apiIntegrationStatus: 'none',
        cookieDuration: 30,
        status: 'active',
        targetIndustries: JSON.stringify(['construction', 'trades', 'retail', 'manufacturing']),
        targetBusinessTypes: JSON.stringify(['startup', 'growth_stage']),
        recommendationTiming: 'growth_stage',
        priority: 6,
        notes: 'Workers comp specialist. Great for businesses hiring employees. Modern digital platform.',
    },
    {
        id: crypto.randomUUID(),
        name: 'Coterie Insurance',
        category: 'insurance',
        description: 'Small business insurance with instant quotes and coverage. Focuses on general liability and professional liability.',
        commissionType: 'hybrid',
        commissionRate: 'Commission per policy (rates vary)',
        commissionNotes: 'Fast-growing insurtech. Instant quotes and immediate coverage. User-friendly platform.',
        estimatedCommissionValue: 3000, // $30 avg (estimated)
        tierRank: 3,
        signupUrl: 'https://www.coterieinsurance.com/partners',
        hasApi: false,
        apiIntegrationStatus: 'none',
        cookieDuration: 30,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['startup', 'solopreneur']),
        recommendationTiming: 'during_setup',
        priority: 6,
        notes: 'Instant coverage. User-friendly platform. Good for quick insurance needs.',
    },
];

async function seedInsuranceAffiliates() {
    console.log('🛡️  Seeding business insurance affiliates...\\n');

    for (const insurance of insuranceAffiliates) {
        try {
            await db.insert(affiliatePrograms).values({
                ...insurance,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            console.log(`✅ Added: ${insurance.name} (${insurance.category})`);
        } catch (error) {
            console.error(`❌ Failed to add ${insurance.name}:`, error);
        }
    }

    console.log(`\\n🎉 Successfully seeded ${insuranceAffiliates.length} insurance affiliates!`);
    console.log('\\n💰 Commission breakdown:');
    insuranceAffiliates
        .sort((a, b) => b.estimatedCommissionValue - a.estimatedCommissionValue)
        .forEach(i => {
            const value = (i.estimatedCommissionValue / 100).toFixed(2);
            console.log(`  ${i.name}: $${value} avg - ${i.commissionRate}`);
        });

    console.log('\\n🎯 Insurance Types:');
    console.log('  General/Professional Liability: Hiscox, Simply Business, Coterie, Next Insurance');
    console.log('  Full-Service Brokers: Embroker, Insurance Protector, CoverWallet');
    console.log('  On-Demand/Freelancer: Thimble, Policybee');
    console.log('  Workers Comp Specialist: Pie Insurance');

    console.log('\\n🏆 Top Earners:');
    console.log('  1. Embroker: $250 per signup (highest!)');
    console.log('  2. Insurance Protector: 20% + 10% recurring (passive income!)');
    console.log('  3. Simply Business: 10% + performance bonuses');
}

seedInsuranceAffiliates().catch(console.error);
