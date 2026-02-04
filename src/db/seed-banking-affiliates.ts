import { db } from './index';
import { affiliatePrograms } from './schema';

const bankingAffiliates = [
    // Digital-Only Banks
    {
        id: crypto.randomUUID(),
        name: 'Bluevine',
        category: 'banking',
        description: 'Business banking with high-yield checking and lines of credit. Accountant Partner Program with tiered cash bonuses.',
        commissionType: 'fixed',
        commissionRate: 'Up to $300 per qualified referral (tiered)',
        commissionNotes: 'Accountant Partner Program. Tiered structure - more referrals = higher bonuses (up to $300/referral). Client must fund $1k and meet activity requirements.',
        estimatedCommissionValue: 20000, // $200 avg
        tierRank: 1,
        signupUrl: 'https://www.bluevine.com/partner-program/',
        affiliateDashboardUrl: 'https://www.bluevine.com/partners/dashboard',
        hasApi: true,
        apiIntegrationStatus: 'available',
        apiDocsUrl: 'https://developer.bluevine.com/',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['startup', 'solopreneur', 'growth_stage']),
        recommendationTiming: 'during_setup',
        priority: 9,
        notes: 'STRONG PROGRAM! Tiered up to $300/referral. High-yield checking (3.0% APY). Partner benefits include co-marketing and directory placement.',
    },
    {
        id: crypto.randomUUID(),
        name: 'Relay',
        category: 'banking',
        description: 'Free business banking designed for startups and small businesses. Multiple checking accounts, no fees.',
        commissionType: 'hybrid',
        commissionRate: 'Monthly commission + VIP support',
        commissionNotes: 'Active affiliate program for publishers, content creators, and consultants. No minimum requirements. Monthly payouts.',
        estimatedCommissionValue: 10000, // $100 avg (estimated)
        tierRank: 2,
        signupUrl: 'https://relayfi.com/affiliate',
        affiliateDashboardUrl: 'https://relayfi.com/affiliate/dashboard',
        hasApi: true,
        apiIntegrationStatus: 'available',
        apiDocsUrl: 'https://developer.relayfi.com/',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['startup', 'solopreneur']),
        recommendationTiming: 'during_setup',
        priority: 8,
        notes: 'Great for startups! No fees, unlimited checking accounts. Dedicated VIP support for affiliates. Editorial freedom.',
    },
    {
        id: crypto.randomUUID(),
        name: 'Found',
        category: 'banking',
        description: 'All-in-one business banking with bookkeeping and tax tools for solopreneurs and freelancers.',
        commissionType: 'percentage',
        commissionRate: '10-20% per referral (estimated)',
        commissionNotes: 'Digital banking platform with integrated tax tools. Targeting freelancers and solopreneurs.',
        estimatedCommissionValue: 5000, // $50 avg (estimated)
        tierRank: 3,
        signupUrl: 'https://found.com/affiliates',
        hasApi: false,
        apiIntegrationStatus: 'none',
        cookieDuration: 60,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['solopreneur', 'freelance']),
        recommendationTiming: 'during_setup',
        priority: 7,
        notes: 'Perfect for freelancers! Integrated bookkeeping and tax tools. Simplifies quarterly tax management.',
    },

    // Traditional Brick-and-Mortar Banks
    {
        id: crypto.randomUUID(),
        name: 'Chase Business Banking',
        category: 'banking',
        description: 'Comprehensive business banking from major national bank. Refer-A-Business program with $100 referral bonuses.',
        commissionType: 'fixed',
        commissionRate: '$100 per qualified business referral (up to $1,000/year)',
        commissionNotes: 'Refer-A-Business program. Referred business also gets $500 bonus. Must fund account and meet balance requirements.',
        estimatedCommissionValue: 10000, // $100 per referral
        tierRank: 1,
        signupUrl: 'https://www.chase.com/business/banking/refer-a-business',
        hasApi: false,
        apiIntegrationStatus: 'none',
        cookieDuration: 120,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['startup', 'growth_stage', 'enterprise']),
        recommendationTiming: 'during_setup',
        priority: 8,
        notes: 'MAJOR BANK! $100 referral bonus (max $1k/year). Referred business gets $500. Physical branches nationwide. Strong trust factor.',
    },
    {
        id: crypto.randomUUID(),
        name: 'Wise Business',
        category: 'banking',
        description: 'International business banking with multi-currency accounts. Great for businesses with global transactions.',
        commissionType: 'hybrid',
        commissionRate: 'Starting from $10, up to $63 for business customers',
        commissionNotes: 'Higher commission rates for business user referrals. Multi-currency support makes this attractive for international businesses.',
        estimatedCommissionValue: 3500, // $35 avg
        tierRank: 2,
        signupUrl: 'https://wise.com/invite/aff',
        affiliateDashboardUrl: 'https://wise.com/affiliates/dashboard',
        hasApi: true,
        apiIntegrationStatus: 'available',
        apiDocsUrl: 'https://api-docs.wise.com/',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['ecommerce', 'import_export', 'consulting', 'saas']),
        targetBusinessTypes: JSON.stringify(['startup', 'growth_stage']),
        recommendationTiming: 'growth_stage',
        priority: 7,
        notes: 'BEST FOR INTERNATIONAL! Multi-currency accounts. Low FX fees. API available. $10-63 commission based on user type.',
    },
];

async function seedBankingAffiliates() {
    console.log('🏦 Seeding additional banking affiliates...\n');

    for (const bank of bankingAffiliates) {
        try {
            await db.insert(affiliatePrograms).values({
                ...bank,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            console.log(`✅ Added: ${bank.name} (${bank.category})`);
        } catch (error) {
            console.error(`❌ Failed to add ${bank.name}:`, error);
        }
    }

    console.log(`\n🎉 Successfully seeded ${bankingAffiliates.length} banking affiliates!`);
    console.log('\n💰 Commission breakdown:');
    bankingAffiliates
        .sort((a, b) => b.estimatedCommissionValue - a.estimatedCommissionValue)
        .forEach(b => {
            const value = (b.estimatedCommissionValue / 100).toFixed(2);
            console.log(`  ${b.name}: $${value} avg - ${b.commissionRate}`);
        });

    console.log('\n📍 Bank Types:');
    console.log('  Digital-Only: Bluevine, Relay, Found, Wise Business');
    console.log('  Traditional: Chase Business Banking');
}

seedBankingAffiliates().catch(console.error);
