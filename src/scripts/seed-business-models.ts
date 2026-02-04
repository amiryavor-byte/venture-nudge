#!/usr/bin/env tsx

/**
 * Comprehensive Business Model Seeding
 * Seeds ALL models (general + degree-specific) with full business plans
 */

import { MODEL_TEMPLATES, generateBusinessPlan } from '../lib/business-model-templates';
import { DEGREE_SPECIFIC_TEMPLATES } from '../lib/degree-specific-templates';
import { ADDITIONAL_BUSINESS_MODELS } from '../lib/additional-business-models';
import { BusinessModelService } from '../lib/business-model-service';

async function main() {
    console.log('🌱 Seeding Comprehensive Business Model Encyclopedia...\n');

    try {
        const existingCount = await BusinessModelService.getCount();
        console.log(`📊 Current models in database: ${existingCount}\n`);

        // Combine all templates
        const allTemplates = [
            ...MODEL_TEMPLATES.map((t: any) => ({
                ...t,
                category: t.industry, // Default category to industry for existing models
                subcategory: deriveSubcategory(t),
                educationRecommended: ['Any'], // Default for general models
                licenseRequired: 'None', // Default for general models
            })),
            ...DEGREE_SPECIFIC_TEMPLATES,
            ...ADDITIONAL_BUSINESS_MODELS,
        ];

        console.log(`📝 Preparing to seed ${allTemplates.length} business models...\n`);
        console.log(`   - General models: ${MODEL_TEMPLATES.length}`);
        console.log(`   - Degree-specific models: ${DEGREE_SPECIFIC_TEMPLATES.length}`);
        console.log(`   - Additional industry models: ${ADDITIONAL_BUSINESS_MODELS.length}\n`);

        // Generate complete models
        const modelsToInsert = allTemplates.map((template: any) => {
            const { planParams, ...rest } = template;
            const businessPlan = generateBusinessPlan(planParams);

            // Generate related opportunities dynamically
            const relatedOpportunities = generateRelatedOpportunities(template);

            return {
                ...rest,
                businessPlan,
                relatedOpportunities,
                // Denormalized fields for quick AI queries
                executiveSummary: businessPlan.executiveSummary.keySummary,
                targetMarket: businessPlan.targetMarket,
                valueProposition: businessPlan.solution.uniqueValue,
                revenueModel: businessPlan.revenueModel,
                competitiveLandscape: businessPlan.competition,
                marketingStrategy: businessPlan.marketingStrategy,
                operationsOverview: businessPlan.operations,
                financialProjections: businessPlan.financials,
                riskAnalysis: businessPlan.risks,
                milestones: businessPlan.milestones,

                // Legacy fields (for backward compatibility)
                operationalGuide: {
                    steps: businessPlan.operations.keyProcesses,
                    technology: businessPlan.operations.technology,
                },
                keyMetrics: Object.keys(businessPlan.revenueModel.unitEconomics),
            };
        });

        // Clear existing and insert all (clean start with new schema)
        console.log('🔄 Creating fresh encyclopedia with new schema...\n');
        const created = await BusinessModelService.bulkCreate(modelsToInsert);

        console.log(`✅ Successfully created ${created.length} business models!\n`);

        // Show comprehensive statistics
        const newCount = await BusinessModelService.getCount();
        console.log(`📊 Total models in encyclopedia: ${newCount}\n`);

        // ============================================================
        // INDUSTRY BREAKDOWN
        // ============================================================
        console.log('📈 MODELS BY INDUSTRY:');
        console.log('━'.repeat(60));
        const byIndustry = created.reduce((acc: Record<string, number>, model: any) => {
            acc[model.industry] = (acc[model.industry] || 0) + 1;
            return acc;
        }, {});

        Object.entries(byIndustry)
            .sort((a, b) => b[1] - a[1])
            .forEach(([industry, count]) => {
                const bar = '█'.repeat(Math.floor((count as number) / 2));
                console.log(`${industry.padEnd(30)} ${String(count).padStart(3)} ${bar}`);
            });

        // ============================================================
        // CATEGORY BREAKDOWN
        // ============================================================
        console.log('\n📂 MODELS BY CATEGORY:');
        console.log('━'.repeat(60));
        const byCategory = created.reduce((acc: Record<string, number>, model: any) => {
            const cat = model.category || 'Uncategorized';
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        }, {});

        Object.entries(byCategory)
            .sort((a, b) => b[1] - a[1])
            .forEach(([category, count]) => {
                console.log(`  ✓ ${category}: ${count} models`);
            });

        // ============================================================
        // EDUCATION REQUIREMENTS
        // ============================================================
        console.log('\n🎓 MODELS BY EDUCATIONAL BACKGROUND:');
        console.log('━'.repeat(60));
        const byEducation = created.reduce((acc: Record<string, number>, model: any) => {
            const edu = model.educationRecommended || ['Any'];
            edu.forEach((degree: string) => {
                acc[degree] = (acc[degree] || 0) + 1;
            });
            return acc;
        }, {});

        Object.entries(byEducation)
            .sort((a, b) => b[1] - a[1])
            .forEach(([degree, count]) => {
                console.log(`  🎓 ${degree.padEnd(30)} ${count} models`);
            });

        // ============================================================
        // LICENSE REQUIREMENTS
        // ============================================================
        console.log('\n📜 LICENSE REQUIREMENTS:');
        console.log('━'.repeat(60));
        const licensedCount = created.filter((m: any) => m.licenseRequired && m.licenseRequired !== 'None').length;
        const noLicenseCount = created.length - licensedCount;
        console.log(`  ✓ No license required: ${noLicenseCount} models`);
        console.log(`  ✓ License required: ${licensedCount} models`);

        // ============================================================
        // COMPLEXITY DISTRIBUTION
        // ============================================================
        console.log('\n📊 COMPLEXITY DISTRIBUTION (1=easiest, 10=hardest):');
        console.log('━'.repeat(60));
        const byComplexity = created.reduce((acc: Record<number, number>, model: any) => {
            const complexity = model.complexity || 5;
            acc[complexity] = (acc[complexity] || 0) + 1;
            return acc;
        }, {});

        Object.entries(byComplexity)
            .sort((a, b) => Number(a[0]) - Number(b[0]))
            .forEach(([complexity, count]) => {
                const stars = '★'.repeat(Number(complexity));
                const bar = '▓'.repeat(Math.floor((count as number) / 2));
                console.log(`  ${stars.padEnd(12)} (${complexity}): ${String(count).padStart(3)} ${bar}`);
            });

        // ============================================================
        // STARTUP COST RANGES
        // ============================================================
        console.log('\n💰 STARTUP COST DISTRIBUTION:');
        console.log('━'.repeat(60));
        const costCategories = {
            'Under $10k': created.filter((m: any) => {
                const cost = m.startupCostRange || '';
                return cost.includes('$1k-') || cost.includes('$2k-') || cost.includes('$3k-') || cost.includes('$5k-');
            }).length,
            '$10k-$50k': created.filter((m: any) => {
                const cost = m.startupCostRange || '';
                return cost.includes('$10k-') || cost.includes('$15k-') || cost.includes('$20k-');
            }).length,
            '$50k-$100k': created.filter((m: any) => {
                const cost = m.startupCostRange || '';
                return cost.includes('$50k-') || cost.includes('$60k-') || cost.includes('$80k-');
            }).length,
            '$100k+': created.filter((m: any) => {
                const cost = m.startupCostRange || '';
                return cost.includes('$100k') || cost.includes('$150k') || cost.includes('$200k') || cost.includes('$300k') || cost.includes('$500k');
            }).length,
        };

        Object.entries(costCategories).forEach(([range, count]) => {
            const bar = '█'.repeat(Math.floor((count as number) / 3));
            console.log(`  ${range.padEnd(15)} ${String(count).padStart(3)} ${bar}`);
        });

        // ============================================================
        // PRACTICAL EXAMPLES
        // ============================================================
        console.log('\n💡 SAMPLE MODELS BY DEGREE:');
        console.log('━'.repeat(60));

        const degreeExamples = {
            'MBA': ['Management Consulting Firm', 'Business Brokerage', 'Corporate Training Company'],
            'Engineering': ['Technical Consulting (Software)', 'Product Development Firm (Hardware)', 'Engineering Services (Civil)'],
            'MD/DO': ['Telemedicine Platform (Specialist)', 'Medical Consulting & Expert Witness', 'Medical Device Sales Representative'],
            'JD': ['Legal Tech SaaS Platform', 'Contract Review Service', 'Compliance Consulting'],
            'Design': ['UX/UI Design Agency', 'Brand Identity Studio'],
            'Finance/CPA': ['Registered Investment Advisor (RIA)', 'Fractional CFO Service'],
        };

        Object.entries(degreeExamples).forEach(([degree, examples]) => {
            console.log(`\n  🎓 ${degree}:`);
            examples.forEach(name => {
                const model = created.find((m: any) => m.name === name);
                if (model) {
                    console.log(`     • ${name}`);
                    console.log(`       ${model.description}`);
                    console.log(`       💰 ${model.startupCostRange} | ⭐ Complexity: ${model.complexity}/10`);
                }
            });
        });

        console.log('\n' + '='.repeat(60));
        console.log('✨ Encyclopedia seeding complete!');
        console.log('='.repeat(60));
        console.log('\n💡 Next steps:');
        console.log('  1. Run `npm run db:studio` to browse all models');
        console.log('  2. Visit http://localhost:3000/admin/models to view in admin panel');
        console.log('  3. Test degree-based filtering in your AI agent\n');

    } catch (error) {
        console.error('\n❌ Error seeding models:', error);
        process.exit(1);
    }
}

// Helper to derive subcategory from existing model template
function deriveSubcategory(template: any): string {
    if (template.tags.includes('saas')) return 'SaaS';
    if (template.tags.includes('ecommerce')) return 'E-commerce';
    if (template.tags.includes('consulting')) return 'Consulting';
    if (template.tags.includes('agency')) return 'Agency';
    if (template.tags.includes('services')) return 'Services';
    if (template.tags.includes('retail')) return 'Retail';
    if (template.tags.includes('food')) return 'Food & Beverage';
    return template.industry;
}

// Helper to generate related opportunities for any business model
function generateRelatedOpportunities(template: any) {
    const name = template.name;
    const industry = template.industry;
    const subcategory = template.subcategory || deriveSubcategory(template);
    const tags = template.tags || [];

    // Extract cost for scaling down to part-time/entry level
    const fullCost = template.startupCostRange || '$10k-$50k';
    const partTimeCost = scaleDownCost(fullCost, 0.1); // 10% of full cost
    const entryLevelCost = scaleDownCost(fullCost, 0.05); // 5% of full cost

    const opportunities = {
        partTime: [] as any[],
        complementary: [] as any[],
        productized: [] as any[],
        entryLevel: [] as any[],
        niche: [] as any[],
    };

    // PART-TIME OPPORTUNITIES
    if (tags.includes('consulting') || tags.includes('services')) {
        opportunities.partTime.push({
            name: `Freelance ${name.split(' ')[0]} Consulting`,
            type: 'part-time',
            startupCost: partTimeCost,
            timeCommitment: '10-20 hrs/week',
            description: `Offer ${subcategory.toLowerCase()} services on evenings and weekends`,
        });
    } else if (tags.includes('saas') || tags.includes('software')) {
        opportunities.partTime.push({
            name: `${subcategory} Freelance Development`,
            type: 'part-time',
            startupCost: partTimeCost,
            timeCommitment: '10-15 hrs/week',
            description: 'Build custom solutions for clients part-time',
        });
    } else if (tags.includes('ecommerce') || tags.includes('retail')) {
        opportunities.partTime.push({
            name: `Weekend ${industry} Sales`,
            type: 'part-time',
            startupCost: partTimeCost,
            timeCommitment: '10-20 hrs/week',
            description: 'Run online store on nights and weekends',
        });
    } else {
        opportunities.partTime.push({
            name: `Part-Time ${industry} Services`,
            type: 'part-time',
            startupCost: partTimeCost,
            timeCommitment: '10-15 hrs/week',
            description: `Offer ${industry.toLowerCase()} services alongside your day job`,
        });
    }

    // COMPLEMENTARY SERVICES
    if (tags.includes('consulting')) {
        opportunities.complementary.push({
            name: `${industry} Training & Workshops`,
            type: 'complementary',
            startupCost: '$1k-$5k',
            description: 'Teach others your expertise through workshops',
        });
    } else if (tags.includes('saas') || tags.includes('software')) {
        opportunities.complementary.push({
            name: 'Implementation & Setup Services',
            type: 'complementary',
            startupCost: '$2k-$8k',
            description: 'Help clients integrate and configure solutions',
        });
    } else if (tags.includes('b2b')) {
        opportunities.complementary.push({
            name: `${industry} Consulting`,
            type: 'complementary',
            startupCost: '$1k-$10k',
            description: 'Strategic advice related to your core offering',
        });
    } else {
        opportunities.complementary.push({
            name: `${industry} Support Services`,
            type: 'complementary',
            startupCost: '$2k-$10k',
            description: 'Additional services that enhance your main offering',
        });
    }

    // PRODUCTIZED SERVICES
    if (tags.includes('saas') || tags.includes('software')) {
        opportunities.productized.push({
            name: 'Template & Plugin Marketplace',
            type: 'productized',
            startupCost: '$1k-$5k',
            description: 'Sell pre-built templates and extensions',
        });
    } else if (tags.includes('consulting') || tags.includes('services')) {
        opportunities.productized.push({
            name: 'Fixed-Price Service Packages',
            type: 'productized',
            startupCost: '$500-$3k',
            description: 'Standardized service offerings with fixed pricing',
        });
    } else if (tags.includes('education') || tags.includes('training')) {
        opportunities.productized.push({
            name: 'Online Course Creation',
            type: 'productized',
            startupCost: '$1k-$5k',
            description: 'Record and sell educational content',
        });
    } else {
        opportunities.productized.push({
            name: `${industry} Subscription Service`,
            type: 'productized',
            startupCost: '$2k-$10k',
            description: 'Recurring revenue packages for ongoing services',
        });
    }

    // ENTRY-LEVEL OPPORTUNITIES
    if (tags.includes('online') || tags.includes('saas')) {
        opportunities.entryLevel.push({
            name: 'Freelancer Platform Gigs',
            type: 'entry-level',
            startupCost: entryLevelCost,
            description: 'Start on Fiverr, Upwork, or similar platforms',
        });
    } else if (tags.includes('local') || tags.includes('retail')) {
        opportunities.entryLevel.push({
            name: 'Farmers Market / Pop-Up Stand',
            type: 'entry-level',
            startupCost: entryLevelCost,
            description: 'Test the market with minimal investment',
        });
    } else if (tags.includes('food') || tags.includes('catering')) {
        opportunities.entryLevel.push({
            name: 'Home-Based or Cottage Food',
            type: 'entry-level',
            startupCost: entryLevelCost,
            description: 'Start from home with minimal licensing',
        });
    } else {
        opportunities.entryLevel.push({
            name: `Simple ${industry} Service`,
            type: 'entry-level',
            startupCost: entryLevelCost,
            description: 'Simplified version to test demand and build experience',
        });
    }

    // NICHE SPECIALIZATIONS
    // Industry-specific niches
    if (industry === 'Technology') {
        opportunities.niche.push({
            name: `${subcategory} for Healthcare/Legal/Finance`,
            type: 'niche',
            startupCost: fullCost,
            description: 'Specialize in a regulated industry with higher margins',
        });
    } else if (industry === 'Professional Services') {
        opportunities.niche.push({
            name: `${subcategory} for Specific Industry`,
            type: 'niche',
            startupCost: fullCost,
            description: 'Focus on restaurants, real estate, or medical practices',
        });
    } else if (industry === 'E-commerce') {
        opportunities.niche.push({
            name: 'Niche Product Specialization',
            type: 'niche',
            startupCost: fullCost,
            description: 'Focus on pet products, eco-friendly, or luxury items',
        });
    } else if (industry === 'Healthcare') {
        opportunities.niche.push({
            name: 'Specialized Medical Service',
            type: 'niche',
            startupCost: fullCost,
            description: 'Focus on dermatology, mental health, or chronic care',
        });
    } else {
        opportunities.niche.push({
            name: `Premium ${industry} Service`,
            type: 'niche',
            startupCost: fullCost,
            description: 'Target luxury or high-end market segment',
        });
    }

    return opportunities;
}

// Helper to scale down costs for entry-level opportunities
function scaleDownCost(cost: string, multiplier: number): string {
    // Extract first number from cost range like "$10k-$50k"
    const match = cost.match(/\$(\d+)(k|K)?/);
    if (!match) return '$0-$1k';

    const value = parseInt(match[1]);
    const isK = match[2] && match[2].toLowerCase() === 'k';

    const baseValue = isK ? value * 1000 : value;
    const scaledValue = Math.floor(baseValue * multiplier);

    if (scaledValue < 500) {
        return `$0-$${Math.max(500, scaledValue)}`;
    } else if (scaledValue < 1000) {
        return `$${scaledValue}-$${scaledValue * 2}`;
    } else {
        const kValue = Math.floor(scaledValue / 1000);
        return `$${kValue}k-$${kValue * 2}k`;
    }
}

main();
