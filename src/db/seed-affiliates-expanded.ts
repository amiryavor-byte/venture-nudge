import { db } from './index';
import { affiliatePrograms } from './schema';

const expandedAffiliates = [
    // PAYMENT PROCESSING (3)
    {
        id: crypto.randomUUID(),
        name: 'Stripe',
        category: 'payment_processing',
        description: 'Complete payment processing platform with powerful APIs for online and in-person payments',
        commissionType: 'percentage',
        commissionRate: '0.1% of processing volume',
        commissionNotes: 'Partner program with tiered benefits based on referral volume',
        estimatedCommissionValue: 10000, // $100 average
        tierRank: 1,
        signupUrl: 'https://stripe.com/partners',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://stripe.com/docs/api',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['ecommerce', 'saas', 'marketplace', 'services']),
        targetBusinessTypes: JSON.stringify(['online_business', 'hybrid']),
        recommendationTiming: 'during_setup',
        priority: 9,
        notes: 'Most comprehensive API. Requires Stripe Verified Partner ($250/yr) for full benefits.'
    },
    {
        id: crypto.randomUUID(),
        name: 'Brex',
        category: 'business_credit',
        description: 'Business credit card and expense management for startups and growing companies',
        commissionType: 'hybrid',
        commissionRate: '$30 per activation + 0.6% monthly volume',
        commissionNotes: 'Tiered rewards based on referral volume',
        estimatedCommissionValue: 50000, // $500 avg (activation + volume)
        tierRank: 1,
        signupUrl: 'https://brex.com/affiliate',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        cookieDuration: 60,
        status: 'active',
        targetIndustries: JSON.stringify(['technology', 'saas', 'ecommerce']),
        targetBusinessTypes: JSON.stringify(['startup', 'growth_stage']),
        recommendationTiming: 'post_formation',
        priority: 8,
        notes: 'High-value program. Best for tech startups with $50k+ monthly spend.'
    },
    {
        id: crypto.randomUUID(),
        name: 'Ramp',
        category: 'business_credit',
        description: 'Corporate card and spend management platform',
        commissionType: 'fixed',
        commissionRate: '$250 per activation',
        estimatedCommissionValue: 25000, // $250
        tierRank: 2,
        signupUrl: 'https://ramp.com/partners',
        hasApi: true,
        apiIntegrationStatus: 'none',
        cookieDuration: 60,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['startup', 'growth_stage', 'enterprise']),
        recommendationTiming: 'post_formation',
        priority: 7
    },

    // ACCOUNTING (3)
    {
        id: crypto.randomUUID(),
        name: 'Xero',
        category: 'accounting',
        description: 'Cloud-based accounting software for small businesses',
        commissionType: 'fixed',
        commissionRate: '$10-240 per paid subscription',
        commissionNotes: 'Varies by plan and region',
        estimatedCommissionValue: 12000, // $120 average
        tierRank: 2,
        signupUrl: 'https://www.xero.com/us/partner/affiliate/',
        affiliateDashboardUrl: 'https://partnerstack.com',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://developer.xero.com',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        recommendationTiming: 'post_formation',
        priority: 8,
        notes: 'Managed through PartnerStack. Excellent API for dashboard integration.'
    },
    {
        id: crypto.randomUUID(),
        name: 'FreshBooks',
        category: 'accounting',
        description: 'Invoicing and accounting for service-based businesses',
        commissionType: 'fixed',
        commissionRate: 'Up to $200 per paid subscription',
        commissionNotes: 'Commission scales with subscription tier',
        estimatedCommissionValue: 15000, // $150 average
        tierRank: 3,
        signupUrl: 'https://www.freshbooks.com/affiliates',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://www.freshbooks.com/api',
        cookieDuration: 120,
        status: 'active',
        targetIndustries: JSON.stringify(['services', 'consulting', 'creative']),
        recommendationTiming: 'post_formation',
        priority: 7,
        notes: 'Managed through ShareASale. 120-day cookie.'
    },
    {
        id: crypto.randomUUID(),
        name: 'Bench',
        category: 'accounting',
        description: 'Full-service bookkeeping for small businesses',
        commissionType: 'percentage',
        commissionRate: '20-30% of first year revenue',
        estimatedCommissionValue: 80000, // $800 avg
        tierRank: 4,
        signupUrl: 'https://bench.co/affiliate',
        hasApi: false,
        cookieDuration: 60,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        recommendationTiming: 'growth_stage',
        priority: 6,
        notes: 'High commission due to expensive service ($300-500/mo).'
    },

    // CRM (4)
    {
        id: crypto.randomUUID(),
        name: 'HubSpot',
        category: 'crm',
        description: 'All-in-one CRM, marketing, and sales platform',
        commissionType: 'recurring',
        commissionRate: '15% recurring for 12 months',
        commissionNotes: 'Up to 30% for certified partners',
        estimatedCommissionValue: 50000, // $500 avg over 12 months
        tierRank: 1,
        signupUrl: 'https://www.hubspot.com/partners/affiliates',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://developers.hubspot.com',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['saas', 'services', 'ecommerce']),
        recommendationTiming: 'growth_stage',
        priority: 9,
        notes: 'Excellent recurring commission. Free CRM tier converts well.'
    },
    {
        id: crypto.randomUUID(),
        name: 'Salesforce',
        category: 'crm',
        description: 'Enterprise CRM and sales platform',
        commissionType: 'percentage',
        commissionRate: '10-20% of contract value',
        estimatedCommissionValue: 150000, // $1,500 avg (enterprise deals)
        tierRank: 2,
        signupUrl: 'https://www.salesforce.com/partners/',
        hasApi: true,
        apiIntegrationStatus: 'none',
        apiDocsUrl: 'https://developer.salesforce.com',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['enterprise', 'saas', 'technology']),
        targetBusinessTypes: JSON.stringify(['growth_stage', 'enterprise']),
        recommendationTiming: 'scaling',
        priority: 7,
        notes: 'Requires partner certification. Best for enterprise deals.'
    },
    {
        id: crypto.randomUUID(),
        name: 'Pipedrive',
        category: 'crm',
        description: 'Sales-focused CRM for small teams',
        commissionType: 'recurring',
        commissionRate: '33% recurring for 12 months',
        estimatedCommissionValue: 20000, // $200 over 12 months
        tierRank: 3,
        signupUrl: 'https://www.pipedrive.com/en/affiliate',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://developers.pipedrive.com',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        recommendationTiming: 'post_formation',
        priority: 7,
        notes: 'High recurring rate (33%). Great for small teams.'
    },
    {
        id: crypto.randomUUID(),
        name: 'Copper CRM',
        category: 'crm',
        description: 'CRM built for Google Workspace users',
        commissionType: 'recurring',
        commissionRate: '20% recurring for 12 months',
        estimatedCommissionValue: 15000, // $150 over 12 months
        tierRank: 4,
        signupUrl: 'https://www.copper.com/partnership',
        hasApi: true,
        apiIntegrationStatus: 'none',
        apiDocsUrl: 'https://developer.copper.com',
        cookieDuration: 60,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        recommendationTiming: 'post_formation',
        priority: 6,
        notes: 'Best for businesses using Google Workspace.'
    },

    // EMAIL MARKETING (3)
    {
        id: crypto.randomUUID(),
        name: 'ConvertKit',
        category: 'email_marketing',
        description: 'Email marketing for creators and course sellers',
        commissionType: 'recurring',
        commissionRate: '30% recurring forever',
        commissionNotes: 'Lifetime recurring commission!',
        estimatedCommissionValue: 100000, // $1,000 LTV (recurring forever)
        tierRank: 1,
        signupUrl: 'https://convertkit.com/affiliate',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://developers.convertkit.com',
        cookieDuration: 60,
        status: 'active',
        targetIndustries: JSON.stringify(['education', 'content', 'coaching']),
        recommendationTiming: 'growth_stage',
        priority: 10,
        notes: '30% FOREVER! Highest LTV. Excellent for content businesses.'
    },
    {
        id: crypto.randomUUID(),
        name: 'Mailchimp',
        category: 'email_marketing',
        description: 'Email marketing and automation platform',
        commissionType: 'percentage',
        commissionRate: '20-30% of contract value',
        estimatedCommissionValue: 15000, // $150 avg
        tierRank: 2,
        signupUrl: 'https://mailchimp.com/partner/',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://mailchimp.com/developer/',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        recommendationTiming: 'growth_stage',
        priority: 8
    },
    {
        id: crypto.randomUUID(),
        name: 'ActiveCampaign',
        category: 'email_marketing',
        description: 'Marketing automation with email, CRM, and sales',
        commissionType: 'recurring',
        commissionRate: '20-30% recurring for 12 months',
        estimatedCommissionValue: 40000, // $400 over 12 months
        tierRank: 3,
        signupUrl: 'https://www.activecampaign.com/partner/affiliate',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://developers.activecampaign.com',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['ecommerce', 'saas', 'services']),
        recommendationTiming: 'growth_stage',
        priority: 8,
        notes: 'Strong automation features. Good for ecommerce.'
    },

    // SHIPPING & LOGISTICS (2)
    {
        id: crypto.randomUUID(),
        name: 'ShipStation',
        category: 'shipping',
        description: 'Multi-carrier shipping software for ecommerce',
        commissionType: 'recurring',
        commissionRate: '20-30% recurring',
        estimatedCommissionValue: 10000, // $100 avg
        tierRank: 2,
        signupUrl: 'https://www.shipstation.com/partners/',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://www.shipstation.com/docs/api',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['ecommerce', 'retail']),
        recommendationTiming: 'post_revenue',
        priority: 7
    },
    {
        id: crypto.randomUUID(),
        name: 'Easyship',
        category: 'shipping',
        description: 'International shipping platform with pre-negotiated rates',
        commissionType: 'percentage',
        commissionRate: '10-15% revenue share',
        estimatedCommissionValue: 8000, // $80 avg
        tierRank: 3,
        signupUrl: 'https://www.easyship.com/partners',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://developers.easyship.com',
        cookieDuration: 60,
        status: 'active',
        targetIndustries: JSON.stringify(['ecommerce']),
        recommendationTiming: 'international_expansion',
        priority: 6
    },

    // MORE E-COMMERCE (2)
    {
        id: crypto.randomUUID(),
        name: 'WooCommerce',
        category: 'ecommerce',
        description: 'Open-source ecommerce plugin for WordPress',
        commissionType: 'percentage',
        commissionRate: '20% of referred sales',
        estimatedCommissionValue: 10000, // $100 avg
        tierRank: 2,
        signupUrl: 'https://woocommerce.com/affiliates/',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://woocommerce.github.io/woocommerce-rest-api-docs/',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['retail', 'ecommerce']),
        recommendationTiming: 'during_setup',
        priority: 7,
        notes: 'Free plugin, earn on hosting & extensions.'
    },
    {
        id: crypto.randomUUID(),
        name: 'BigCommerce',
        category: 'ecommerce',
        description: 'Enterprise ecommerce platform',
        commissionType: 'hybrid',
        commissionRate: '$1,500 per enterprise deal or 200% of monthly fee',
        estimatedCommissionValue: 150000, // $1,500 avg
        tierRank: 3,
        signupUrl: 'https://partners.bigcommerce.com',
        hasApi: true,
        apiIntegrationStatus: 'none',
        apiDocsUrl: 'https://developer.bigcommerce.com',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['retail', 'ecommerce']),
        targetBusinessTypes: JSON.stringify(['growth_stage', 'enterprise']),
        recommendationTiming: 'during_setup',
        priority: 6,
        notes: 'High commissions on enterprise deals.'
    },

    // PROJECT MANAGEMENT (3)
    {
        id: crypto.randomUUID(),
        name: 'Asana',
        category: 'productivity',
        description: 'Work management and collaboration platform',
        commissionType: 'recurring',
        commissionRate: '20% recurring for 12 months',
        estimatedCommissionValue: 15000, // $150 over 12 months
        tierRank: 2,
        signupUrl: 'https://asana.com/partners',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://developers.asana.com',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        recommendationTiming: 'team_growth',
        priority: 7
    },
    {
        id: crypto.randomUUID(),
        name: 'ClickUp',
        category: 'productivity',
        description: 'All-in-one productivity and project management',
        commissionType: 'recurring',
        commissionRate: '25% recurring for 12 months',
        estimatedCommissionValue: 18000, // $180 over 12 months
        tierRank: 3,
        signupUrl: 'https://clickup.com/affiliates',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://clickup.com/api',
        cookieDuration: 60,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        recommendationTiming: 'team_growth',
        priority: 7,
        notes: 'Fast-growing alternative with generous commission.'
    },
    {
        id: crypto.randomUUID(),
        name: 'Notion',
        category: 'productivity',
        description: 'Connected workspace for docs, wikis, and projects',
        commissionType: 'percentage',
        commissionRate: '$5-10 per signup',
        estimatedCommissionValue: 700, // $7 avg
        tierRank: 4,
        signupUrl: 'https://www.notion.so/affiliates',
        hasApi: true,
        apiIntegrationStatus: 'none',
        apiDocsUrl: 'https://developers.notion.com',
        cookieDuration: 30,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        recommendationTiming: 'during_setup',
        priority: 6,
        notes: 'Popular with startups. Lower commission but high conversion.'
    },

    // INDUSTRY-SPECIFIC: RESTAURANTS (3)
    {
        id: crypto.randomUUID(),
        name: 'Upserve',
        category: 'restaurant_pos',
        description: 'Restaurant POS and management platform',
        commissionType: 'fixed',
        commissionRate: '$500-1,000 per sale',
        estimatedCommissionValue: 75000, // $750 avg
        tierRank: 2,
        signupUrl: 'https://upserve.com/partners/',
        hasApi: true,
        apiIntegrationStatus: 'none',
        cookieDuration: 60,
        status: 'active',
        targetIndustries: JSON.stringify(['restaurant', 'food_service']),
        recommendationTiming: 'during_setup',
        priority: 8,
        notes: 'High commission. Lightspeed brand.'
    },
    {
        id: crypto.randomUUID(),
        name: 'OpenTable',
        category: 'restaurant_reservations',
        description: 'Restaurant reservation and table management',
        commissionType: 'fixed',
        commissionRate: '$100-200 per restaurant signup',
        estimatedCommissionValue: 15000, // $150 avg
        tierRank: 1,
        signupUrl: 'https://restaurant.opentable.com/partnerships/',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://platform.opentable.com',
        cookieDuration: 60,
        status: 'active',
        targetIndustries: JSON.stringify(['restaurant', 'hospitality']),
        recommendationTiming: 'post_launch',
        priority: 7
    },
    {
        id: crypto.randomUUID(),
        name: 'ChowNow',
        category: 'restaurant_online_ordering',
        description: 'Commission-free online ordering for restaurants',
        commissionType: 'fixed',
        commissionRate: '$100-300 per sale',
        estimatedCommissionValue: 20000, // $200 avg
        tierRank: 1,
        signupUrl: 'https://get.chownow.com/partners/',
        hasApi: true,
        apiIntegrationStatus: 'none',
        cookieDuration: 60,
        status: 'active',
        targetIndustries: JSON.stringify(['restaurant']),
        recommendationTiming: 'post_launch',
        priority: 7,
        notes: 'Popular alternative to third-party delivery apps.'
    },

    // INDUSTRY-SPECIFIC: FITNESS (2)
    {
        id: crypto.randomUUID(),
        name: 'Mindbody',
        category: 'fitness_management',
        description: 'Scheduling and business management for fitness and wellness',
        commissionType: 'fixed',
        commissionRate: '$200-400 per sale',
        estimatedCommissionValue: 30000, // $300 avg
        tierRank: 1,
        signupUrl: 'https://www.mindbodyonline.com/partnerships',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://developers.mindbodyonline.com',
        cookieDuration: 60,
        status: 'active',
        targetIndustries: JSON.stringify(['fitness', 'wellness', 'spa']),
        recommendationTiming: 'during_setup',
        priority: 8
    },
    {
        id: crypto.randomUUID(),
        name: 'Zen Planner',
        category: 'fitness_management',
        description: 'Member management for gyms and martial arts schools',
        commissionType: 'recurring',
        commissionRate: '20% recurring for 12 months',
        estimatedCommissionValue: 25000, // $250 over 12 months
        tierRank: 2,
        signupUrl: 'https://www.zenplanner.com/partners/',
        hasApi: true,
        apiIntegrationStatus: 'none',
        cookieDuration: 60,
        status: 'active',
        targetIndustries: JSON.stringify(['fitness', 'martial_arts']),
        recommendationTiming: 'during_setup',
        priority: 7
    },

    // INDUSTRY-SPECIFIC: HOME SERVICES (2)
    {
        id: crypto.randomUUID(),
        name: 'ServiceTitan',
        category: 'home_services',
        description: 'Complete business software for home service contractors',
        commissionType: 'fixed',
        commissionRate: '$1,000-2,000 per sale',
        estimatedCommissionValue: 150000, // $1,500 avg
        tierRank: 1,
        signupUrl: 'https://www.servicetitan.com/partnerships',
        hasApi: true,
        apiIntegrationStatus: 'none',
        apiDocsUrl: 'https://developer.servicetitan.io',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['hvac', 'plumbing', 'electrical', 'home_services']),
        targetBusinessTypes: JSON.stringify(['growth_stage', 'enterprise']),
        recommendationTiming: 'scaling',
        priority: 9,
        notes: 'Very high commission. Expensive software ($300-500/mo).'
    },
    {
        id: crypto.randomUUID(),
        name: 'Jobber',
        category: 'home_services',
        description: 'Field service management for home service businesses',
        commissionType: 'recurring',
        commissionRate: '20% recurring for 12 months',
        estimatedCommissionValue: 20000, // $200 over 12 months
        tierRank: 2,
        signupUrl: 'https://getjobber.com/affiliates/',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://developer.getjobber.com',
        cookieDuration: 60,
        status: 'active',
        targetIndustries: JSON.stringify(['home_services', 'landscaping', 'cleaning']),
        recommendationTiming: 'post_formation',
        priority: 7
    },

    // CLOUD STORAGE & COLLABORATION (2)
    {
        id: crypto.randomUUID(),
        name: 'Dropbox Business',
        category: 'cloud_storage',
        description: 'File storage and collaboration for teams',
        commissionType: 'fixed',
        commissionRate: '$125 per annual plan',
        estimatedCommissionValue: 12500, // $125
        tierRank: 1,
        signupUrl: 'https://www.dropbox.com/partners',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://www.dropbox.com/developers',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        recommendationTiming: 'team_growth',
        priority: 7
    },
    {
        id: crypto.randomUUID(),
        name: 'Google Workspace',
        category: 'productivity',
        description: 'Gmail, Drive, Docs, and collaboration tools for businesses',
        commissionType: 'percentage',
        commissionRate: '20% of first year',
        estimatedCommissionValue: 15000, // $150 avg (assuming $75/user/yr average)
        tierRank: 1,
        signupUrl: 'https://workspace.google.com/partners/',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://developers.google.com/workspace',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        recommendationTiming: 'during_setup',
        priority: 9,
        notes: 'Essential business tool with broad appeal.'
    },

    // BUSINESS COMMUNICATION (2)
    {
        id: crypto.randomUUID(),
        name: 'Slack',
        category: 'communication',
        description: 'Team messaging and collaboration platform',
        commissionType: 'recurring',
        commissionRate: '25% recurring for 12 months',
        estimatedCommissionValue: 25000, // $250 over 12 months
        tierRank: 1,
        signupUrl: 'https://slack.com/partners',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        apiDocsUrl: 'https://api.slack.com',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        recommendationTiming: 'team_growth',
        priority: 8
    },
    {
        id: crypto.randomUUID(),
        name: 'RingCentral',
        category: 'business_phone',
        description: 'Cloud business phone and video conferencing',
        commissionType: 'recurring',
        commissionRate: '20-30% recurring for 12 months',
        estimatedCommissionValue: 35000, // $350 over 12 months
        tierRank: 1,
        signupUrl: 'https://www.ringcentral.com/partner.html',
        hasApi: true,
        apiIntegrationStatus: 'none',
        apiDocsUrl: 'https://developers.ringcentral.com',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        recommendationTiming: 'during_setup',
        priority: 7
    },
];

async function seedExpandedAffiliates() {
    console.log('🌱 Seeding expanded affiliate programs...\n');

    for (const affiliate of expandedAffiliates) {
        try {
            await db.insert(affiliatePrograms).values({
                ...affiliate,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            console.log(`✅ Added: ${affiliate.name} (${affiliate.category})`);
        } catch (error) {
            console.error(`❌ Failed to add ${affiliate.name}:`, error);
        }
    }

    console.log(`\n🎉 Successfully seeded ${expandedAffiliates.length} new affiliate programs!`);
    console.log('\nTotal programs by category:');
    const categories = expandedAffiliates.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    Object.entries(categories).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
        console.log(`  ${cat}: ${count}`);
    });
}

seedExpandedAffiliates().catch(console.error);
