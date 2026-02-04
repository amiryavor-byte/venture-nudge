import { BusinessModelService } from '@/lib/business-model-service';
import { db } from '@/db';

async function seed() {
    console.log('Seeding business models...');

    const models = [
        {
            name: 'SaaS (Software as a Service)',
            industry: 'Technology',
            description: 'Software licensed on a subscription basis and centrally hosted.',
            operationalGuide: JSON.stringify({
                steps: [
                    'Develop MVP',
                    'Deploy to cloud',
                    'Acquire users via content marketing',
                    'Iterate based on feedback'
                ]
            }),
            keyMetrics: JSON.stringify(['MRR', 'ARR', 'Churn Rate', 'CAC', 'LTV']),
            isVerified: true
        },
        {
            name: 'Retail Store',
            industry: 'Retail',
            description: 'Physical location selling goods directly to consumers.',
            operationalGuide: JSON.stringify({
                steps: [
                    'Secure location',
                    'Source inventory',
                    'Hire staff',
                    'Grand opening marketing'
                ]
            }),
            keyMetrics: JSON.stringify(['Sales per sq ft', 'Inventory Turnover', 'Gross Margin', 'Foot Traffic']),
            isVerified: true
        },
        {
            name: 'E-commerce Dropshipping',
            industry: 'E-commerce',
            description: 'Selling products without holding inventory, shipping directly from supplier.',
            operationalGuide: JSON.stringify({
                steps: [
                    'Select niche',
                    'Find suppliers (AliExpress, etc.)',
                    'Build Shopify store',
                    'Run ads (FB/Instagram)'
                ]
            }),
            keyMetrics: JSON.stringify(['Conversion Rate', 'AOV', 'ROAS', 'Return Rate']),
            isVerified: true
        },
        {
            name: 'Consulting Agency',
            industry: 'Professional Services',
            description: 'Providing expert advice in a specific area to businesses or individuals.',
            operationalGuide: JSON.stringify({
                steps: [
                    'Define expertise',
                    'Build portfolio',
                    'Network and outreach',
                    'Deliver projects'
                ]
            }),
            keyMetrics: JSON.stringify(['Billable Hours', 'Utilization Rate', 'Client Satisfaction', 'Project Margin']),
            isVerified: true
        }
    ];

    for (const model of models) {
        const search = await BusinessModelService.search(model.name);
        // Exact match check because search uses partial match
        const exists = search.find(m => m.name === model.name);

        if (!exists) {
            await BusinessModelService.create(model);
            console.log(`Created ${model.name}`);
        } else {
            console.log(`Skipped ${model.name} (already exists)`);
        }
    }

    console.log('Done!');
    process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
