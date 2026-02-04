/**
 * Seed script to populate affiliate programs database
 * Run this manually from the command line: node --loader ts-node/esm src/db/seed-affiliates.ts
 * Or add to package.json scripts
 */

import { db } from './index';
import { affiliatePrograms } from './schema';

const seedData = [
    // Banking
    {
        id: 'mercury-banking',
        name: 'Mercury',
        category: 'banking',
        description: 'Modern business banking built for startups',
        commissionType: 'fixed',
        commissionRate: '$200-500',
        commissionNotes: 'Commission varies based on business type and account activity',
        signupUrl: 'https://mercury.com/partners',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        cookieDuration: 30,
        status: 'active',
        targetIndustries: JSON.stringify(['technology', 'startups', 'remote']),
        targetBusinessTypes: JSON.stringify(['startup', 'tech', 'saas']),
        recommendationTiming: 'post_formation',
        priority: 9,
    },
    {
        id: 'novo-banking',
        name: 'Novo',
        category: 'banking',
        description: 'Free business banking for small businesses',
        commissionType: 'fixed',
        commissionRate: '$40-60',
        commissionNotes: 'Paid per approved account',
        signupUrl: 'https://novo.co/affiliates',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        cookieDuration: 30,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['solopreneur', 'freelancer', 'small_business']),
        recommendationTiming: 'post_formation',
        priority: 8,
    },

    // Accounting
    {
        id: 'quickbooks-online',
        name: 'QuickBooks Online',
        category: 'accounting',
        description: '#1 small business accounting software',
        commissionType: 'fixed',
        commissionRate: '$50-100',
        commissionNotes: 'Per new subscription',
        signupUrl: 'https://quickbooks.intuit.com/partners/',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['all']),
        recommendationTiming: 'during_planning',
        priority: 10,
    },

    // Legal
    {
        id: 'rocket-lawyer',
        name: 'Rocket Lawyer',
        category: 'legal',
        description: 'Affordable legal docs and attorney consultations',
        commissionType: 'percentage',
        commissionRate: '30%',
        commissionNotes: 'Up to $100 per referral',
        signupUrl: 'https://www.rocketlawyer.com/affiliates',
        hasApi: true,
        apiIntegrationStatus: 'none',
        cookieDuration: 30,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['all']),
        recommendationTiming: 'during_planning',
        priority: 7,
    },

    // Tax Software
    {
        id: 'turbotax',
        name: 'TurboTax',
        category: 'tax',
        description: '#1 tax filing software for individuals and businesses',
        commissionType: 'percentage',
        commissionRate: '10-15%',
        commissionNotes: 'Average $10-30 per sale',
        signupUrl: 'https://turbotax.intuit.com',
        hasApi: false,
        apiIntegrationStatus: 'none',
        cookieDuration: 30,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['solopreneur', 'small_business']),
        recommendationTiming: 'tax_season',
        priority: 6,
    },

    // POS Systems
    {
        id: 'square',
        name: 'Square',
        category: 'pos',
        description: 'Complete POS solution for retail and restaurants',
        commissionType: 'revenue_share',
        commissionRate: 'Revenue share',
        commissionNotes: 'Ongoing passive income from transaction fees',
        signupUrl: 'https://squareup.com/us/en/partnerships/affiliate',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['retail', 'food_service', 'services']),
        targetBusinessTypes: JSON.stringify(['retail', 'restaurant', 'physical_location']),
        recommendationTiming: 'pre_launch',
        priority: 8,
    },
    {
        id: 'toast',
        name: 'Toast',
        category: 'pos',
        description: 'Restaurant-specific POS and management',
        commissionType: 'fixed',
        commissionRate: '$1,000+',
        commissionNotes: 'High-value referral for restaurants',
        signupUrl: 'https://pos.toasttab.com/partners/refer-a-restaurant',
        hasApi: true,
        apiIntegrationStatus: 'none',
        cookieDuration: 90,
        status: 'active',
        phaseOutDate: '2027-03-31',
        replacedBy: 'Catering Management Suite',
        targetIndustries: JSON.stringify(['food_service', 'restaurant']),
        targetBusinessTypes: JSON.stringify(['restaurant', 'food_truck', 'catering']),
        recommendationTiming: 'pre_launch',
        priority: 10,
    },

    // E-commerce
    {
        id: 'shopify',
        name: 'Shopify',
        category: 'ecommerce',
        description: 'Leading e-commerce platform',
        commissionType: 'fixed',
        commissionRate: '200%',
        commissionNotes: '200% of first two monthly payments (up to $2,400)',
        signupUrl: 'https://www.shopify.com/affiliates',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        cookieDuration: 30,
        status: 'active',
        targetIndustries: JSON.stringify(['ecommerce', 'retail']),
        targetBusinessTypes: JSON.stringify(['ecommerce', 'online_store']),
        recommendationTiming: 'during_planning',
        priority: 9,
    },

    // HR/Payroll
    {
        id: 'gusto',
        name: 'Gusto',
        category: 'hr',
        description: 'All-in-one HR, payroll, and benefits',
        commissionType: 'fixed',
        commissionRate: '$100+',
        commissionNotes: 'Per referral',
        signupUrl: 'https://gusto.com/partners',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['has_employees']),
        recommendationTiming: 'first_hire',
        priority: 9,
    },

    // Shipping
    {
        id: 'shippo',
        name: 'Shippo',
        category: 'shipping',
        description: 'Multi-carrier shipping API',
        commissionType: 'fixed',
        commissionRate: '$60',
        commissionNotes: 'Per Pro Plan referral',
        signupUrl: 'https://goshippo.com/affiliates',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        cookieDuration: 120,
        status: 'active',
        targetIndustries: JSON.stringify(['ecommerce', 'retail']),
        targetBusinessTypes: JSON.stringify(['ecommerce', 'multi_carrier_shipping']),
        recommendationTiming: 'post_launch',
        priority: 7,
    },

    // Business Formation
    {
        id: 'zenbusiness',
        name: 'ZenBusiness',
        category: 'formation',
        description: 'Affordable business formation and compliance',
        commissionType: 'fixed',
        commissionRate: '$75-150',
        commissionNotes: 'Per sale, ongoing compliance services',
        signupUrl: 'https://www.zenbusiness.com/affiliates/',
        hasApi: false,
        apiIntegrationStatus: 'none',
        cookieDuration: 30,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['pre_formation']),
        recommendationTiming: 'during_planning',
        priority: 10,
    },

    // Project Management
    {
        id: 'monday',
        name: 'Monday.com',
        category: 'productivity',
        description: 'Flexible work management platform',
        commissionType: 'recurring',
        commissionRate: '50%',
        commissionNotes: '50% recurring for 12 months',
        signupUrl: 'https://monday.com/affiliates',
        hasApi: true,
        apiIntegrationStatus: 'planned',
        cookieDuration: 90,
        status: 'active',
        targetIndustries: JSON.stringify(['all']),
        targetBusinessTypes: JSON.stringify(['teams', 'project_based']),
        recommendationTiming: 'team_growth',
        priority: 8,
    },
];

async function seedAffiliates() {
    console.log('🌱 Seeding affiliate programs...');

    try {
        // Clear existing data (optional - comment out if you want to keep existing data)
        // await db.delete(affiliatePrograms);

        // Insert seed data
        for (const affiliate of seedData) {
            await db.insert(affiliatePrograms).values(affiliate);
            console.log(`✅ Added: ${affiliate.name}`);
        }

        console.log(`\n🎉 Successfully seeded ${seedData.length} affiliate programs!`);
    } catch (error) {
        console.error('❌ Error seeding affiliates:', error);
        process.exit(1);
    }
}

// Run the seed function
seedAffiliates();
