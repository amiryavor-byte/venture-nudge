import { db } from './index';
import { affiliatePrograms } from './schema';

const industrySpecificAffiliates = [
    // LEGAL TECH
    {
        id: crypto.randomUUID(),
        name: 'Clio',
        category: 'legal',
        description: 'Legal practice management software for law firms',
        commissionType: 'recurring',
        commissionRate: '20% recurring for 12 months',
        commissionNotes: 'Clio Partner Program - recurring commissions on subscriptions',
        estimatedCommissionValue: 40000, // ~$400/yr
        tierRank: 1,
        signupUrl: 'https://www.clio.com/partners/',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://docs.clio.com',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['legal']),
        targetBusinessTypes: JSON.stringify(['legal_practice']),
        recommendationTiming: 'legal_business',
        priority: 8,
        notes: 'Market leader in legal practice management. Comprehensive API. 20% recurring for year one.'
    },
    {
        id: crypto.randomUUID(),
        name: 'LegalZoom',
        category: 'legal',
        description: 'Legal services marketplace for businesses',
        commissionType: 'percentage',
        commissionRate: '15-25% of sale',
        commissionNotes: 'Varies by service type',
        estimatedCommissionValue: 7500, // $75 avg (on $300-500 services)
        tierRank: 2,
        signupUrl: 'https://www.legalzoom.com/affiliates',
        hasApi: false,
        apiIntegrationStatus: 'none',
        cookieDuration: 45,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['all']),
        recommendationTiming: 'formation',
        priority: 7,
        notes: 'Popular for LLC formation, trademarks, contracts. Complements existing Rocket Lawyer program.'
    },

    // HEALTHCARE
    {
        id: crypto.randomUUID(),
        name: 'SimplePractice',
        category: 'healthcare',
        description: 'Practice management for therapists, counselors, and mental health professionals',
        commissionType: 'fixed',
        commissionRate: '$100 per annual subscription',
        commissionNotes: 'Paid for annual plan subscriptions only',
        estimatedCommissionValue: 10000, // $100
        tierRank: 1,
        signupUrl: 'https://www.simplepractice.com/affiliates',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://developers.simplepractice.com',
        cookieDuration: 60,
        status: 'active',
        targetIndustries: JSON.stringify(['healthcare', 'mental_health']),
        targetBusinessTypes: JSON.stringify(['private_practice']),
        recommendationTiming: 'healthcare_setup',
        priority: 8,
        notes: 'Leading platform for mental health professionals. API available. $100 per annual subscriber.'
    },

    // REAL ESTATE
    {
        id: crypto.randomUUID(),
        name: 'Buildium',
        category: 'real_estate',
        description: 'Property management software for landlords and property managers',
        commissionType: 'fixed',
        commissionRate: '$150-$300 per customer',
        commissionNotes: 'Tiered based on property portfolio size',
        estimatedCommissionValue: 22500, // $225 avg
        tierRank: 1,
        signupUrl: 'https://www.buildium.com/partners/',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://api.buildium.com',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['real_estate', 'property_management']),
        targetBusinessTypes: JSON.stringify(['property_management']),
        recommendationTiming: 'real_estate_business',
        priority: 8,
        notes: 'Comprehensive property management API. High commission. Excellent for real estate investors/managers.'
    },
    {
        id: crypto.randomUUID(),
        name: 'AppFolio',
        category: 'real_estate',
        description: 'Cloud-based property management software',
        commissionType: 'fixed',
        commissionRate: '$200-$500 per customer',
        commissionNotes: 'Referral program - commission based on property count',
        estimatedCommissionValue: 35000, // $350 avg
        tierRank: 1,
        signupUrl: 'https://www.appfolio.com/partners',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://api.appfolio.com',
        cookieDuration: 120,
        status: 'active',
        targetIndustries: JSON.stringify(['real_estate', 'property_management']),
        targetBusinessTypes: JSON.stringify(['property_management', 'growth_stage']),
        recommendationTiming: 'real_estate_scaling',
        priority: 8,
        notes: 'Enterprise-grade property management. REST API. High-value referrals. 120-day cookie.'
    },

    // CONSTRUCTION
    {
        id: crypto.randomUUID(),
        name: 'Procore',
        category: 'construction',
        description: 'Construction management software for builders and contractors',
        commissionType: 'referral',
        commissionRate: 'Partner program - contact for rates',
        commissionNotes: 'Enterprise referral program with custom commission structure',
        estimatedCommissionValue: 100000, // Estimate $1,000+ for enterprise deals
        tierRank: 1,
        signupUrl: 'https://www.procore.com/partners',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://developers.procore.com',
        cookieDuration: 180,
        status: 'active',
        targetIndustries: JSON.stringify(['construction']),
        targetBusinessTypes: JSON.stringify(['construction', 'enterprise']),
        recommendationTiming: 'construction_business',
        priority: 9,
        notes: 'Market leader in construction tech. Comprehensive API. Enterprise-level commissions. Partner program application required.'
    },
    {
        id: crypto.randomUUID(),
        name: 'Buildertrend',
        category: 'construction',
        description: 'Construction management software for home builders and remodelers',
        commissionType: 'fixed',
        commissionRate: '$100-$200 per customer',
        commissionNotes: 'Referral program for residential construction',
        estimatedCommissionValue: 15000, // $150 avg
        tierRank: 2,
        signupUrl: 'https://buildertrend.com/affiliates/',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://api.buildertrend.com',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['construction', 'home_services']),
        targetBusinessTypes: JSON.stringify(['construction', 'small_business']),
        recommendationTiming: 'construction_business',
        priority: 7,
        notes: 'Focused on residential construction. API available. Solid commissions for small-to-mid-size builders.'
    },

    // EDUCATION & TRAINING
    {
        id: crypto.randomUUID(),
        name: 'LinkedIn Learning',
        category: 'education',
        description: 'Professional development and online training courses',
        commissionType: 'percentage',
        commissionRate: '30% of subscription (first month)',
        commissionNotes: 'Affiliate program for LinkedIn Learning subscriptions',
        estimatedCommissionValue: 1200, // $12 on $40/mo subscription
        tierRank: 1,
        signupUrl: 'https://affiliates.linkedin.com',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://developer.linkedin.com',
        cookieDuration: 30,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['all']),
        recommendationTiming: 'skill_development',
        priority: 6,
        notes: 'LinkedIn API available. Professional development essential for all businesses. Lower commission but high brand trust.'
    },
    {
        id: crypto.randomUUID(),
        name: 'Udemy Business',
        category: 'education',
        description: 'Corporate training and e-learning platform',
        commissionType: 'fixed',
        commissionRate: '$50-$150 per enterprise signup',
        commissionNotes: 'B2B program focused on team/company subscriptions',
        estimatedCommissionValue: 10000, // $100 avg
        tierRank: 2,
        signupUrl: 'https://business.udemy.com/partners/',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://www.udemy.com/developers/',
        cookieDuration: 45,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['growth_stage', 'enterprise']),
        recommendationTiming: 'team_training',
        priority: 6,
        notes: 'Udemy API for course integration. Focus on business/team subscriptions for higher commissions.'
    },

    // CYBERSECURITY
    {
        id: crypto.randomUUID(),
        name: 'LastPass Business',
        category: 'cybersecurity',
        description: 'Password management for teams and businesses',
        commissionType: 'recurring',
        commissionRate: '33% recurring for 12 months',
        commissionNotes: 'LogMeIn affiliate program - recurring commissions',
        estimatedCommissionValue: 16000, // ~$160/yr
        tierRank: 1,
        signupUrl: 'https://www.lastpass.com/affiliates',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://support.lastpass.com/help/lastpass-provisioning-api',
        cookieDuration: 120,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['small_business', 'growth_stage']),
        recommendationTiming: 'security_setup',
        priority: 8,
        notes: 'Essential security tool. 33% recurring is excellent. API for provisioning. 120-day cookie.'
    },
];

async function seedIndustrySpecificAffiliates() {
    console.log('🌱 Seeding industry-specific affiliate programs...\n');

    for (const affiliate of industrySpecificAffiliates) {
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

    console.log(`\n🎉 Successfully seeded ${industrySpecificAffiliates.length} industry-specific programs!`);
    console.log('\n🎯 Industries covered: Legal, Healthcare, Real Estate, Construction, Education, Cybersecurity');
}

seedIndustrySpecificAffiliates().catch(console.error);
