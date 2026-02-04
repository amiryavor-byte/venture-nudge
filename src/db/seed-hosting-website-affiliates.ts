import { db } from './index';
import { affiliatePrograms } from './schema';

const hostingWebsiteAffiliates = [
    // WEB HOSTING & WEBSITE PLATFORMS
    {
        id: crypto.randomUUID(),
        name: 'Bluehost',
        category: 'hosting',
        description: 'Web hosting for WordPress and small business websites',
        commissionType: 'fixed',
        commissionRate: '$65-$150 per sale',
        commissionNotes: 'Base $65, up to $150 for high-volume affiliates',
        estimatedCommissionValue: 10000, // $100 avg
        tierRank: 1,
        signupUrl: 'https://www.bluehost.com/affiliates',
        cookieDuration: 30,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['solopreneur', 'small_business']),
        recommendationTiming: 'during_setup',
        priority: 8,
        hasApi: false,
        apiIntegrationStatus: 'none',
        notes: 'Popular hosting affiliate program. Payments within 45-70 days via PayPal. Volume bonuses available.'
    },
    {
        id: crypto.randomUUID(),
        name: 'WP Engine',
        category: 'hosting',
        description: 'Premium managed WordPress hosting',
        commissionType: 'fixed',
        commissionRate: '$200+ per sale (100% of first month)',
        commissionNotes: '$200 minimum or 100% of first month payment, whichever is higher. Lite plans: $100',
        estimatedCommissionValue: 25000, // $250 avg
        tierRank: 1,
        signupUrl: 'https://wpengine.com/affiliate/',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://wpengineapi.com',
        cookieDuration: 180,
        status: 'active',
        targetIndustries: JSON.stringify(['technology', 'ecommerce', 'publishing']),
        targetBusinessTypes: JSON.stringify(['small_business', 'growth_stage']),
        recommendationTiming: 'scaling',
        priority: 8,
        notes: '180-day cookie window. Premium hosting = premium commission. Also earn 35% on StudioPress themes. No recurring but high upfront.'
    },
    {
        id: crypto.randomUUID(),
        name: 'DigitalOcean',
        category: 'hosting',
        description: 'Cloud infrastructure for developers - VPS, Kubernetes, databases',
        commissionType: 'hybrid',
        commissionRate: '$25-$100 per referral + usage credits',
        commissionNotes: 'Referral bonus varies by plan type',
        estimatedCommissionValue: 5000, // $50 avg
        tierRank: 2,
        signupUrl: 'https://www.digitalocean.com/partners',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://docs.digitalocean.com/reference/api/',
        cookieDuration: 60,
        status: 'active',
        targetIndustries: JSON.stringify(['technology', 'saas']),
        targetBusinessTypes: JSON.stringify(['startup', 'growth_stage']),
        recommendationTiming: 'technical_setup',
        priority: 7,
        notes: 'Comprehensive cloud API. Developer-focused. Partner program includes referral bonuses + infrastructure credits.'
    },
    {
        id: crypto.randomUUID(),
        name: 'Cloudflare',
        category: 'hosting',
        description: 'CDN, security, and performance platform',
        commissionType: 'recurring',
        commissionRate: '15-20% recurring revenue share',
        commissionNotes: 'Partner program with recurring commissions on paid plans',
        estimatedCommissionValue: 30000, // $300/yr avg
        tierRank: 1,
        signupUrl: 'https://www.cloudflare.com/partners/',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://developers.cloudflare.com/api/',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['small_business', 'growth_stage', 'enterprise']),
        recommendationTiming: 'during_setup',
        priority: 8,
        notes: 'Powerful API for CDN/security. Partner program with recurring revenue. Essential for web applications.'
    },
    {
        id: crypto.randomUUID(),
        name: 'SiteGround',
        category: 'hosting',
        description: 'Web hosting with excellent WordPress support',
        commissionType: 'tiered',
        commissionRate: '$50-$100 per sale',
        commissionNotes: 'Tiered based on plan: StartUp $50, GrowBig $75, GoGeek $100',
        estimatedCommissionValue: 7500, // $75 avg
        tierRank: 3,
        signupUrl: 'https://www.siteground.com/affiliates',
        hasApi: false,
        apiIntegrationStatus: 'none',
        cookieDuration: 60,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['solopreneur', 'small_business']),
        recommendationTiming: 'during_setup',
        priority: 7,
        notes: 'Known for great support. 60-day cookie. Higher commissions for higher-tier plans.'
    },
    {
        id: crypto.randomUUID(),
        name: 'Wix',
        category: 'website_builder',
        description: 'Website builder and hosting platform',
        commissionType: 'fixed',
        commissionRate: '$100 per premium sale',
        commissionNotes: 'Paid for premium plan subscriptions',
        estimatedCommissionValue: 10000, // $100
        tierRank: 1,
        signupUrl: 'https://www.wix.com/about/affiliates',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://dev.wix.com',
        cookieDuration: 30,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['solopreneur', 'small_business']),
        recommendationTiming: 'during_setup',
        priority: 7,
        notes: 'Popular website builder. Velo API for developers. $100 per premium subscription.'
    },
    {
        id: crypto.randomUUID(),
        name: 'GoDaddy',
        category: 'hosting',
        description: 'Domain registration, hosting, and website services',
        commissionType: 'percentage',
        commissionRate: '10-40% of sale',
        commissionNotes: 'Varies by product: domains (10%), hosting (40%), website builder (30%)',
        estimatedCommissionValue: 5000, // $50 avg
        tierRank: 4,
        signupUrl: 'https://www.godaddy.com/affiliates',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://developer.godaddy.com',
        cookieDuration: 45,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['all']),
        recommendationTiming: 'during_setup',
        priority: 6,
        notes: 'Comprehensive domain/hosting API. Product-based commission tiers. 45-day cookie.'
    },
];

async function seedHostingWebsiteAffiliates() {
    console.log('🌱 Seeding hosting & website affiliate programs...\n');

    for (const affiliate of hostingWebsiteAffiliates) {
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

    console.log(`\n🎉 Successfully seeded ${hostingWebsiteAffiliates.length} hosting/website programs!`);
    console.log('\n💰 Total Potential: ~$700 per customer (across all hosting/website needs)');
}

seedHostingWebsiteAffiliates().catch(console.error);
