import { db } from './index';
import { affiliatePrograms } from './schema';

const recurringRevenueAffiliates = [
    // RECURRING SAAS TOOLS
    {
        id: crypto.randomUUID(),
        name: 'Calendly',
        category: 'productivity',
        description: 'Meeting scheduling automation for professionals and businesses',
        commissionType: 'recurring',
        commissionRate: '15% recurring for 12 months',
        commissionNotes: 'B2B-focused program, monthly payments via PartnerStack',
        estimatedCommissionValue: 18000, // $15/mo × 12 months = $180 avg
        tierRank: 1,
        signupUrl: 'https://calendly.com/affiliate',
        affiliateDashboardUrl: 'https://partnerstack.com',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://developer.calendly.com',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['small_business', 'growth_stage', 'enterprise']),
        recommendationTiming: 'during_setup',
        priority: 9,
        affiliateNetwork: 'PartnerStack',
        notes: 'REST API available. 90-day cookie. Paid via PayPal/Stripe through PartnerStack. Requires B2B platform for approval.'
    },
    {
        id: crypto.randomUUID(),
        name: 'Loom',
        category: 'communication',
        description: 'Async video messaging for teams - screen + camera recording',
        commissionType: 'recurring',
        commissionRate: '15% recurring for 12 months',
        commissionNotes: 'Paid for Business and Enterprise plan referrals',
        estimatedCommissionValue: 27000, // ~$225/yr avg
        tierRank: 2,
        signupUrl: 'https://www.loom.com/affiliates',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://dev.loom.com',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['technology', 'sales', 'support', 'remote_teams']),
        targetBusinessTypes: JSON.stringify(['startup', 'growth_stage']),
        recommendationTiming: 'during_setup',
        priority: 8,
        notes: 'API available for embedding. Great for remote teams. Recurring commission on Business tier.'
    },
    {
        id: crypto.randomUUID(),
        name: 'DocuSign',
        category: 'legal',
        description: 'eSignature and digital agreement management platform',
        commissionType: 'referral',
        commissionRate: '15% on first year subscription',
        commissionNotes: 'ISV/partner program - paid on first year only',
        estimatedCommissionValue: 45000, // $300/yr subscription = $45 commission
        tierRank: 1,
        signupUrl: 'https://www.docusign.com/partners',
        affiliateDashboardUrl: 'https://www.docusign.com/partners',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://developers.docusign.com',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['small_business', 'growth_stage', 'enterprise']),
        recommendationTiming: 'during_setup',
        priority: 9,
        notes: 'Comprehensive eSignature API. Partner program for ISVs. 15% first-year commission for referred paid plans.'
    },
    {
        id: crypto.randomUUID(),
        name: 'Zoom',
        category: 'communication',
        description: 'Video conferencing, webinars, and team chat platform',
        commissionType: 'recurring',
        commissionRate: '10-20% recurring',
        commissionNotes: 'Partner program with tiered commissions based on deal size',
        estimatedCommissionValue: 36000, // $300/yr × 12% = $36 avg
        tierRank: 1,
        signupUrl: 'https://explore.zoom.us/partner',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://developers.zoom.us',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['small_business', 'growth_stage', 'enterprise']),
        recommendationTiming: 'during_setup',
        priority: 9,
        affiliateNetwork: 'Direct',
        notes: 'Comprehensive video/meetings API. Partner program with recurring revenue share. Essential business tool.'
    },
    {
        id: crypto.randomUUID(),
        name: 'Miro',
        category: 'productivity',
        description: 'Collaborative online whiteboard platform for teams',
        commissionType: 'recurring',
        commissionRate: '20% recurring for 12 months',
        commissionNotes: 'Miro Partner Program',
        estimatedCommissionValue: 24000, // $100/yr × 20% = $20 × 12 = $240
        tierRank: 3,
        signupUrl: 'https://miro.com/partners/',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://developers.miro.com',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['technology', 'design', 'consulting', 'remote_teams']),
        targetBusinessTypes: JSON.stringify(['startup', 'growth_stage']),
        recommendationTiming: 'during_setup',
        priority: 7,
        notes: 'REST API + SDK available. Excellent for remote/hybrid teams. 20% recurring for year one.'
    },
];

async function seedRecurringRevenueAffiliates() {
    console.log('🌱 Seeding recurring revenue affiliate programs...\n');

    for (const affiliate of recurringRevenueAffiliates) {
        try {
            await db.insert(affiliatePrograms).values({
                ...affiliate,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            console.log(`✅ Added: ${affiliate.name} (${affiliate.category}) - ${affiliate.commissionRate}`);
        } catch (error) {
            console.error(`❌ Failed to add ${affiliate.name}:`, error);
        }
    }

    console.log(`\n🎉 Successfully seeded ${recurringRevenueAffiliates.length} recurring revenue programs!`);
    console.log('\n💰 Total Potential (if all convert): ~$1,500 in recurring first-year revenue per customer');
}

seedRecurringRevenueAffiliates().catch(console.error);
