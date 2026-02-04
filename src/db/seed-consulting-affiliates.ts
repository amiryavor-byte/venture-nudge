import { db } from './index';
import { affiliatePrograms } from './schema';

const consultingPlatforms = [
    {
        id: crypto.randomUUID(),
        name: 'Clarity.fm',
        category: 'business_consulting',
        description: 'On-demand video calls with 50,000+ verified business experts across every industry. Pay-per-call model.',
        commissionType: 'percentage',
        commissionRate: '15-20% per call booked',
        commissionNotes: 'Platform takes 15% fee, affiliate programs available. Average call is $50 for 30 min.',
        estimatedCommissionValue: 1000, // $10 avg per booking
        tierRank: 1,
        signupUrl: 'https://clarity.fm/affiliates',
        affiliateDashboardUrl: 'https://clarity.fm/partner',
        hasApi: false,
        apiIntegrationStatus: 'none',
        cookieDuration: 30,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['startup', 'growth_stage', 'solopreneur']),
        recommendationTiming: 'validation_stage',
        priority: 9,
        notes: 'Perfect for quick tactical advice. ~50k experts. $1.60/min average. 15% platform fee. Popular pay-per-call model.',
    },
    {
        id: crypto.randomUUID(),
        name: 'GrowthMentor',
        category: 'business_consulting',
        description: 'Unlimited 1:1 video mentoring with 800+ startup mentors for a flat monthly fee. Specialized in growth and marketing.',
        commissionType: 'recurring',
        commissionRate: '12-month revenue share on referrals',
        commissionNotes: 'Invite 3 people/month for free trials. Earn revenue share when they convert to paid ($99/mo membership).',
        estimatedCommissionValue: 30000, // $300 over 12 months (assuming 25% commission)
        tierRank: 1,
        signupUrl: 'https://www.growthmentor.com/affiliates',
        affiliateDashboardUrl: 'https://www.growthmentor.com/dashboard',
        hasApi: false,
        apiIntegrationStatus: 'none',
        cookieDuration: 60,
        status: 'active',
        targetIndustries: JSON.stringify(['technology', 'saas', 'ecommerce', 'marketing']),
        targetBusinessTypes: JSON.stringify(['startup', 'growth_stage']),
        recommendationTiming: 'growth_stage',
        priority: 10,
        notes: 'BEST RECURRING MODEL! 12-month revenue share. $99/mo unlimited calls. Perfect for ongoing mentorship. Strong startup focus.',
    },
    {
        id: crypto.randomUUID(),
        name: 'Maven Expert Network',
        category: 'business_consulting',
        description: '500,000+ professionals for 1:1 expert interviews and market research. Highly specialized industry matching.',
        commissionType: 'hybrid',
        commissionRate: 'Expert referral incentives + client referral fees',
        commissionNotes: 'Earn by referring qualified experts to the network. Premium B2B consulting marketplace.',
        estimatedCommissionValue: 5000, // $50 avg per expert referral
        tierRank: 2,
        signupUrl: 'https://www.maven.co/affiliate',
        affiliateDashboardUrl: 'https://www.maven.co/dashboard',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://www.maven.co/api',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['growth_stage', 'enterprise']),
        recommendationTiming: 'market_research',
        priority: 8,
        notes: '500k+ experts globally. Best for deep industry insights and B2B consulting. Has API for integration.',
    },
    {
        id: crypto.randomUUID(),
        name: 'Intro.co',
        category: 'business_consulting',
        description: 'Paid video consultations with verified business experts, coaches, and industry specialists.',
        commissionType: 'percentage',
        commissionRate: '10-15% per booking',
        commissionNotes: 'Growing platform for professional coaching and consulting. Expert-set pricing.',
        estimatedCommissionValue: 800, // $8 avg per booking
        tierRank: 3,
        signupUrl: 'https://intro.co/affiliates',
        hasApi: false,
        apiIntegrationStatus: 'none',
        cookieDuration: 30,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['startup', 'solopreneur']),
        recommendationTiming: 'during_planning',
        priority: 6,
        notes: 'Newer platform. Good for 1:1 coaching. Expert-set pricing model.',
    },
    {
        id: crypto.randomUUID(),
        name: 'GLG (Gerson Lehrman Group)',
        category: 'business_consulting',
        description: 'World\'s largest expert network with 1M+ professionals. Premium B2B consulting for strategic decisions.',
        commissionType: 'fixed',
        commissionRate: '$200-500 per qualified expert referral',
        commissionNotes: 'Enterprise-focused. High-value referrals. Experts earn $200-400/hr.',
        estimatedCommissionValue: 35000, // $350 avg per expert referral
        tierRank: 1,
        signupUrl: 'https://glginsights.com/join-our-network/',
        hasApi: false,
        apiIntegrationStatus: 'none',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['finance', 'healthcare', 'technology', 'consulting']),
        targetBusinessTypes: JSON.stringify(['enterprise', 'growth_stage']),
        recommendationTiming: 'strategic_planning',
        priority: 7,
        notes: 'PREMIUM PLATFORM. 1M+ experts. $200-500 per expert referral. Best for high-level strategic consulting and investment research.',
    },
];

async function seedConsultingPlatforms() {
    console.log('🎯 Seeding business consulting platforms...\n');

    for (const platform of consultingPlatforms) {
        try {
            await db.insert(affiliatePrograms).values({
                ...platform,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            console.log(`✅ Added: ${platform.name} (${platform.category})`);
        } catch (error) {
            console.error(`❌ Failed to add ${platform.name}:`, error);
        }
    }

    console.log(`\n🎉 Successfully seeded ${consultingPlatforms.length} consulting platforms!`);
    console.log('\n💰 High-value programs:');
    consultingPlatforms
        .sort((a, b) => b.estimatedCommissionValue - a.estimatedCommissionValue)
        .forEach(p => {
            const value = (p.estimatedCommissionValue / 100).toFixed(2);
            console.log(`  ${p.name}: $${value} avg - ${p.commissionRate}`);
        });
}

seedConsultingPlatforms().catch(console.error);
