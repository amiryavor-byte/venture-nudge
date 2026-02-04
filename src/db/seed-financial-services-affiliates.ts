import { db } from './index';
import { affiliatePrograms } from './schema';

const financialServicesAffiliates = [
    // FINANCIAL SERVICES - LOANS, INSURANCE, CREDIT
    {
        id: crypto.randomUUID(),
        name: 'Kabbage',
        category: 'business_financing',
        description: 'Business lines of credit and financing (American Express)',
        commissionType: 'fixed',
        commissionRate: '$50-$150 per funded customer',
        commissionNotes: 'Commission based on loan amount funded',
        estimatedCommissionValue: 10000, // $100 avg
        tierRank: 1,
        signupUrl: 'https://www.kabbage.com/partners',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://developer.kabbage.com',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['small_business', 'growth_stage']),
        recommendationTiming: 'funding_stage',
        priority: 8,
        notes: 'AmEx-owned. API for loan applications. Good for businesses needing working capital.'
    },
    {
        id: crypto.randomUUID(),
        name: 'Nav',
        category: 'business_credit',
        description: 'Business credit monitoring and financing marketplace',
        commissionType: 'fixed',
        commissionRate: '$15-$25 per qualified lead',
        commissionNotes: 'Lead generation program for credit monitoring signups',
        estimatedCommissionValue: 2000, // $20 avg
        tierRank: 3,
        signupUrl: 'https://www.nav.com/partners',
        hasApi: false,
        apiIntegrationStatus: 'none',
        cookieDuration: 45,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['small_business']),
        recommendationTiming: 'credit_building',
        priority: 6,
        notes: 'Lead gen program. Helps businesses monitor and build credit. Lower commission but high conversion.'
    },
    {
        id: crypto.randomUUID(),
        name: 'Hiscox',
        category: 'insurance',
        description: 'Small business insurance - liability, professional indemnity, cyber',
        commissionType: 'fixed',
        commissionRate: '$25-$75 per quote',
        commissionNotes: 'Lead generation - paid for qualified insurance quotes',
        estimatedCommissionValue: 5000, // $50 avg per quote
        tierRank: 1,
        signupUrl: 'https://www.hiscox.com/agents',
        hasApi: false,
        apiIntegrationStatus: 'none',
        cookieDuration: 30,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['small_business', 'solopreneur']),
        recommendationTiming: 'during_planning',
        priority: 7,
        notes: 'Insurance lead gen. Essential for business planning. Paid per quote, not just inquiry.'
    },
    {
        id: crypto.randomUUID(),
        name: 'Next Insurance',
        category: 'insurance',
        description: 'Instant small business insurance quotes and coverage',
        commissionType: 'fixed',
        commissionRate: '$15-$50 per policy',
        commissionNotes: 'Commission on sold policies',
        estimatedCommissionValue: 3500, // $35 avg
        tierRank: 2,
        signupUrl: 'https://www.nextinsurance.com/affiliates/',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://developers.nextinsurance.com',
        cookieDuration: 60,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['solopreneur', 'small_business']),
        recommendationTiming: 'during_planning',
        priority: 7,
        notes: 'API available for instant quotes. Modern, digital-first insurance. Quick signup.'
    },
    {
        id: crypto.randomUUID(),
        name: 'Fundbox',
        category: 'business_financing',
        description: 'Invoice financing and business lines of credit',
        commissionType: 'fixed',
        commissionRate: '$75-$200 per funded customer',
        commissionNotes: 'Higher commission for larger credit lines',
        estimatedCommissionValue: 12500, // $125 avg
        tierRank: 2,
        signupUrl: 'https://www.fundbox.com/partners',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://developer.fundbox.com',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['small_business', 'growth_stage']),
        recommendationTiming: 'cash_flow_needs',
        priority: 7,
        notes: 'API for credit applications. Great for businesses with invoicing/cash flow needs.'
    },
    {
        id: crypto.randomUUID(),
        name: 'OnDeck',
        category: 'business_financing',
        description: 'Small business loans and lines of credit',
        commissionType: 'fixed',
        commissionRate: '$100-$300 per funded loan',
        commissionNotes: 'Commission varies by loan size',
        estimatedCommissionValue: 20000, // $200 avg
        tierRank: 1,
        signupUrl: 'https://www.ondeck.com/partners',
        hasApi: false,
        apiIntegrationStatus: 'none',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['small_business', 'growth_stage']),
        recommendationTiming: 'expansion',
        priority: 8,
        notes: 'Well-established lender. Higher commissions. Good for businesses needing capital for growth.'
    },
];

async function seedFinancialServicesAffiliates() {
    console.log('🌱 Seeding financial services affiliate programs...\n');

    for (const affiliate of financialServicesAffiliates) {
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

    console.log(`\n🎉 Successfully seeded ${financialServicesAffiliates.length} financial services programs!`);
    console.log('\n💰 Total Potential: ~$500 per customer (financing + insurance leads)');
}

seedFinancialServicesAffiliates().catch(console.error);
