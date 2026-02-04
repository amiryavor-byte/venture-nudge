#!/usr/bin/env tsx

/**
 * Business Model Templates Generator
 * Generates complete business plans for each model category
 */

import type { BusinessPlanData } from '../lib/business-plan-schema';

// Helper to generate complete business plan quickly
export function generateBusinessPlan(params: {
    name: string;
    tagline: string;
    problem: string;
    solution: string;
    targetSegment: string;
    industry: string;
    startupCost: string;
    monthlyRevYear1: string;
    monthlyRevYear2: string;
    monthlyRevYear3: string;
    processes: string[];
    tech: string[];
}): BusinessPlanData {
    return {
        executiveSummary: {
            businessName: params.name,
            tagline: params.tagline,
            mission: `To ${params.solution.toLowerCase()} for ${params.targetSegment}`,
            vision: `Become a leading ${params.industry} business serving ${params.targetSegment}`,
            keySummary: `${params.name} ${params.solution.toLowerCase()} by addressing the key problem: ${params.problem}`,
        },
        problemStatement: {
            problem: params.problem,
            painPoints: ['High cost', 'Poor quality', 'Limited access', 'Time-consuming process'],
            currentSolutions: ['Traditional alternatives', 'DIY approaches', 'Competitor services'],
            marketGap: 'Lack of affordable, high-quality, accessible solution',
        },
        solution: {
            description: params.solution,
            uniqueValue: 'Better quality at lower cost with superior customer experience',
            keyFeatures: ['Easy to use', 'Affordable pricing', 'High quality', 'Fast delivery'],
        },
        targetMarket: {
            primarySegment: params.targetSegment,
            demographics: {
                age: '25-55',
                income: '$50k-$150k',
                geography: 'North America',
            },
            marketSize: {
                tam: '$10B',
                sam: '$1B',
                som: '$50M',
            },
            trends: ['Growing demand', 'Digital transformation', 'Convenience-focused consumers'],
        },
        competition: {
            directCompetitors: [
                { name: 'Competitor A', strengths: ['Established brand'], weaknesses: ['High prices'] },
                { name: 'Competitor B', strengths: ['Wide reach'], weaknesses: ['Poor quality'] },
            ],
            indirectCompetitors: ['DIY options', 'Generic alternatives'],
            competitiveAdvantage: 'Best value for money with superior customer service',
            barrierToEntry: 'Moderate - requires brand building and customer acquisition',
        },
        revenueModel: {
            type: 'subscription',
            pricingStrategy: 'Competitive pricing with tiered options',
            revenueStreams: [
                { name: 'Primary Service', description: 'Core offering', estimatedContribution: '80%' },
                { name: 'Add-ons', description: 'Premium features', estimatedContribution: '20%' },
            ],
            unitEconomics: {
                cac: '$200',
                ltv: '$2,000',
                grossMargin: '70%',
            },
        },
        marketingStrategy: {
            channels: [
                { name: 'Digital Marketing', budget: '$3k/mo', expectedResults: '100 leads/mo' },
                { name: 'Social Media', budget: '$2k/mo', expectedResults: '50 leads/mo' },
            ],
            customerAcquisition: 'Digital marketing, referrals, partnerships',
            retentionStrategy: 'Excellent service, loyalty programs, regular communication',
            brandPositioning: 'The trusted choice for quality and value',
        },
        operations: {
            businessModel: 'Standard business operations with focus on customer satisfaction',
            keyProcesses: params.processes,
            technology: params.tech,
            staffingRequirements: 'Start lean, scale with growth',
        },
        team: {
            founders: [
                { role: 'CEO', responsibilities: ['Strategy', 'Sales', 'Partnerships'] },
            ],
            keyHires: [
                { title: 'Operations Manager', timing: 'Month 6' },
                { title: 'Marketing Lead', timing: 'Month 9' },
            ],
        },
        financials: {
            startupCosts: {
                total: params.startupCost,
                breakdown: [
                    { category: 'Setup & Equipment', amount: String(parseInt(params.startupCost.replace(/[^0-9]/g, '')) * 0.4) },
                    { category: 'Marketing', amount: String(parseInt(params.startupCost.replace(/[^0-9]/g, '')) * 0.3) },
                    { category: 'Legal & Admin', amount: String(parseInt(params.startupCost.replace(/[^0-9]/g, '')) * 0.15) },
                    { category: 'Contingency', amount: String(parseInt(params.startupCost.replace(/[^0-9]/g, '')) * 0.15) },
                ],
            },
            monthlyOperatingCosts: '$8,000',
            projections: {
                year1: { revenue: params.monthlyRevYear1, expenses: String(parseInt(params.monthlyRevYear1.replace(/[^0-9]/g, '')) * 0.8), profit: String(parseInt(params.monthlyRevYear1.replace(/[^0-9]/g, '')) * 0.2) },
                year2: { revenue: params.monthlyRevYear2, expenses: String(parseInt(params.monthlyRevYear2.replace(/[^0-9]/g, '')) * 0.7), profit: String(parseInt(params.monthlyRevYear2.replace(/[^0-9]/g, '')) * 0.3) },
                year3: { revenue: params.monthlyRevYear3, expenses: String(parseInt(params.monthlyRevYear3.replace(/[^0-9]/g, '')) * 0.6), profit: String(parseInt(params.monthlyRevYear3.replace(/[^0-9]/g, '')) * 0.4) },
            },
            breakEvenAnalysis: 'Month 12-18',
        },
        risks: {
            marketRisks: [
                { risk: 'Market saturation', likelihood: 'medium', impact: 'medium', mitigation: 'Differentiation and niche focus' },
            ],
            operationalRisks: [
                { risk: 'Scaling challenges', likelihood: 'medium', impact: 'high', mitigation: 'Systematic processes and training' },
            ],
            financialRisks: [
                { risk: 'Cash flow issues', likelihood: 'medium', impact: 'high', mitigation: 'Conservative budgeting and reserves' },
            ],
        },
        milestones: [
            { phase: 'Launch', timing: 'Month 1-3', goals: ['Setup', 'First customers'], successMetrics: ['10 customers'] },
            { phase: 'Growth', timing: 'Month 4-12', goals: ['Scale operations'], successMetrics: ['100 customers', 'Break even'] },
            { phase: 'Expansion', timing: 'Year 2-3', goals: ['Market leadership'], successMetrics: ['1000+ customers', 'Profitability'] },
        ],
    };
}

export const MODEL_TEMPLATES = [
    // Technology/SaaS (15 models)
    {
        name: 'SaaS Project Management Tool',
        industry: 'Technology',
        description: 'Cloud-based project management for remote teams',
        tags: ['b2b', 'saas', 'subscription', 'remote-work'],
        startupCostRange: '$25k-$100k',
        timeToRevenue: '3-6 months',
        skillsRequired: ['software development', 'marketing'],
        complexity: 7,
        planParams: {
            name: 'TaskFlow Pro',
            tagline: 'Project management simplified',
            problem: 'Teams struggle with fragmented task management',
            solution: 'Unified project management platform',
            targetSegment: 'Mid-market companies (50-500 employees)',
            industry: 'Technology',
            startupCost: '$75,000',
            monthlyRevYear1: '$120,000',
            monthlyRevYear2: '$720,000',
            monthlyRevYear3: '$2,400,000',
            processes: ['User acquisition', 'Onboarding', 'Support', 'Development'],
            tech: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
        },
    },
    {
        name: 'SaaS CRM', industry: 'Technology', description: 'Customer relationship management for SMBs',
        tags: ['b2b', 'saas', 'crm'], startupCostRange: '$30k-$80k', timeToRevenue: '3-6 months',
        skillsRequired: ['software development', 'sales'], complexity: 7,
        planParams: { name: 'SimpleCRM', tagline: 'CRM that works for you', problem: 'Small businesses need simple CRM', solution: 'Lightweight, affordable CRM platform', targetSegment: 'Small service businesses', industry: 'Technology', startupCost: '$50,000', monthlyRevYear1: '$60,000', monthlyRevYear2: '$360,000', monthlyRevYear3: '$1,200,000', processes: ['Lead gen', 'Trial activation', 'Support'], tech: ['Next.js', 'PostgreSQL', 'AWS'] },
    },
    {
        name: 'Email Marketing Platform', industry: 'Technology', description: 'Email marketing automation for creators',
        tags: ['b2b', 'saas', 'marketing'], startupCostRange: '$40k-$120k', timeToRevenue: '4-8 months',
        skillsRequired: ['software development', 'marketing'], complexity: 8,
        planParams: { name: 'MailCraft', tagline: 'Email marketing made easy', problem: 'Creators need affordable email tools', solution: 'Simple email automation platform', targetSegment: 'Content creators and small businesses', industry: 'Technology', startupCost: '$80,000', monthlyRevYear1: '$100,000', monthlyRevYear2: '$600,000', monthlyRevYear3: '$2,000,000', processes: ['User acquisition', 'Email delivery', 'Analytics'], tech: ['React', 'Node.js', 'Redis', 'AWS SES'] },
    },
    {
        name: 'AI Chatbot SaaS', industry: 'Technology', description: 'AI-powered customer support chatbots',
        tags: ['b2b', 'saas', 'ai', 'support'], startupCostRange: '$50k-$150k', timeToRevenue: '6-12 months',
        skillsRequired: ['ai/ml', 'software development'], complexity: 9,
        planParams: { name: 'SupportAI', tagline: 'AI support that works', problem: 'Customer support is expensive', solution: 'AI-powered chatbot automation', targetSegment: 'E-commerce and SaaS companies', industry: 'Technology', startupCost: '$120,000', monthlyRevYear1: '$150,000', monthlyRevYear2: '$900,000', monthlyRevYear3: '$3,000,000', processes: ['Training AI models', 'Integration', 'Support'], tech: ['Python', 'TensorFlow', 'FastAPI', 'AWS'] },
    },
    {
        name: 'Video Conferencing Platform', industry: 'Technology', description: 'Secure video meetings for teams',
        tags: ['b2b', 'saas', 'video', 'remote-work'], startupCostRange: '$100k-$300k', timeToRevenue: '6-12 months',
        skillsRequired: ['software development', 'webrtc'], complexity: 9,
        planParams: { name: 'MeetSecure', tagline: 'Secure video meetings', problem: 'Privacy concerns in video calls', solution: 'End-to-end encrypted video platform', targetSegment: 'Privacy-conscious businesses', industry: 'Technology', startupCost: '$250,000', monthlyRevYear1: '$200,000', monthlyRevYear2: '$1,200,000', monthlyRevYear3: '$4,000,000', processes: ['Infrastructure management', 'Security', 'Support'], tech: ['WebRTC', 'Node.js', 'AWS', 'Encryption'] },
    },
    {
        name: 'Developer Tool SaaS', industry: 'Technology', description: 'API testing and monitoring platform',
        tags: ['b2b', 'saas', 'developer-tools'], startupCostRange: '$30k-$100k', timeToRevenue: '3-6 months',
        skillsRequired: ['software development'], complexity: 7,
        planParams: { name: 'APIWatch', tagline: 'Monitor your APIs', problem: 'Developers need API monitoring', solution: 'Real-time API testing platform', targetSegment: 'Software developers and teams', industry: 'Technology', startupCost: '$70,000', monthlyRevYear1: '$80,000', monthlyRevYear2: '$480,000', monthlyRevYear3: '$1,600,000', processes: ['Monitoring', 'Alerts', 'Reporting'], tech: ['Node.js', 'TimescaleDB', 'Redis'] },
    },
    {
        name: 'Team Collaboration Tool', industry: 'Technology', description: 'All-in-one workspace for teams',
        tags: ['b2b', 'saas', 'productivity'], startupCostRange: '$50k-$150k', timeToRevenue: '4-8 months',
        skillsRequired: ['software development', 'ux design'], complexity: 8,
        planParams: { name: 'WorkHub', tagline: 'One workspace for everything', problem: 'Too many disconnected tools', solution: 'Unified collaboration platform', targetSegment: 'Remote and hybrid teams', industry: 'Technology', startupCost: '$100,000', monthlyRevYear1: '$120,000', monthlyRevYear2: '$720,000', monthlyRevYear3: '$2,400,000', processes: ['Product development', 'User onboarding', 'Support'], tech: ['React', 'Node.js', 'MongoDB', 'AWS'] },
    },
    {
        name: 'HR Management Software', industry: 'Technology', description: 'HRIS for small and mid-sized companies',
        tags: ['b2b', 'saas', 'hr'], startupCostRange: '$60k-$180k', timeToRevenue: '6-12 months',
        skillsRequired: ['software development', 'hr knowledge'], complexity: 8,
        planParams: { name: 'PeopleHub', tagline: 'HR made simple', problem: 'HR processes are manual and messy', solution: 'Automated HR management system', targetSegment: 'SMBs with 10-500 employees', industry: 'Technology', startupCost: '$140,000', monthlyRevYear1: '$140,000', monthlyRevYear2: '$840,000', monthlyRevYear3: '$2,800,000', processes: ['Payroll', 'Benefits', 'Time tracking', 'Compliance'], tech: ['React', 'Node.js', 'PostgreSQL'] },
    },

    // E-commerce (10 models)
    {
        name: 'E-commerce Dropshipping', industry: 'E-commerce', description: 'Online store with dropshipping model',
        tags: ['ecommerce', 'dropshipping', 'online'], startupCostRange: '$2k-$10k', timeToRevenue: '1-3 months',
        skillsRequired: ['marketing', 'ecommerce'], complexity: 4,
        planParams: { name: 'TrendCart', tagline: 'Trending products delivered', problem: 'Finding quality trending products', solution: 'Curated dropshipping store', targetSegment: 'Online shoppers 18-35', industry: 'E-commerce', startupCost: '$5,000', monthlyRevYear1: '$60,000', monthlyRevYear2: '$360,000', monthlyRevYear3: '$1,200,000', processes: ['Product sourcing', 'Marketing', 'Customer service'], tech: ['Shopify', 'Facebook Ads', 'Email marketing'] },
    },
    {
        name: 'Subscription Box Service', industry: 'E-commerce', description: 'Curated monthly product subscriptions',
        tags: ['ecommerce', 'subscription', 'recurring'], startupCostRange: '$10k-$50k', timeToRevenue: '2-4 months',
        skillsRequired: ['marketing', 'curation'], complexity: 5,
        planParams: { name: 'CurateBox', tagline: 'Curated just for you', problem: 'Discovery of new products', solution: 'Monthly curated product boxes', targetSegment: 'Enthusiasts and hobbyists', industry: 'E-commerce', startupCost: '$30,000', monthlyRevYear1: '$120,000', monthlyRevYear2: '$720,000', monthlyRevYear3: '$2,400,000', processes: ['Curation', 'Fulfillment', 'Marketing'], tech: ['WooCommerce', 'CRM', 'Logistics software'] },
    },
    {
        name: 'Print-on-Demand Store', industry: 'E-commerce', description: 'Custom printed products with no inventory',
        tags: ['ecommerce', 'print-on-demand', 'creative'], startupCostRange: '$1k-$5k', timeToRevenue: '1-2 months',
        skillsRequired: ['design', 'marketing'], complexity: 3,
        planParams: { name: 'PrintNow', tagline: 'Your designs, our printing', problem: 'Hard to sell custom designs', solution: 'Print-on-demand marketplace', targetSegment: 'Designers and creators', industry: 'E-commerce', startupCost: '$3,000', monthlyRevYear1: '$36,000', monthlyRevYear2: '$216,000', monthlyRevYear3: '$720,000', processes: ['Design creation', 'Order fulfillment', 'Marketing'], tech: ['Printful', 'Shopify', 'Social media'] },
    },
    {
        name: 'Wholesale e-commerce', industry: 'E-commerce', description: 'Bulk product sales to retailers',
        tags: ['ecommerce', 'b2b', 'wholesale'], startupCostRange: '$50k-$200k', timeToRevenue: '3-6 months',
        skillsRequired: ['sales', 'logistics'], complexity: 7,
        planParams: { name: 'BulkBuy Pro', tagline: 'Wholesale made easy', problem: 'Retailers need reliable suppliers', solution: 'B2B wholesale marketplace', targetSegment: 'Small and medium retailers', industry: 'E-commerce', startupCost: '$150,000', monthlyRevYear1: '$300,000', monthlyRevYear2: '$1,800,000', monthlyRevYear3: '$6,000,000', processes: ['Sales', 'Warehousing', 'Shipping'], tech: ['Custom platform', 'ERP', 'Logistics'] },
    },
    {
        name: 'Online Marketplace', industry: 'E-commerce', description: 'Niche marketplace connecting buyers and sellers',
        tags: ['ecommerce', 'marketplace', 'platform'], startupCostRange: '$30k-$150k', timeToRevenue: '6-12 months',
        skillsRequired: ['software development', 'marketing'], complexity: 8,
        planParams: { name: 'NicheMart', tagline: 'Your niche marketplace', problem: 'Hard to find niche products', solution: 'Specialized marketplace platform', targetSegment: 'Niche buyers and sellers', industry: 'E-commerce', startupCost: '$100,000', monthlyRevYear1: '$150,000', monthlyRevYear2: '$900,000', monthlyRevYear3: '$3,000,000', processes: ['Seller onboarding', 'Marketing', 'Support'], tech: ['Next.js', 'Stripe', 'AWS'] },
    },

    // Service-Based (10 models)
    {
        name: 'Digital Marketing Agency', industry: 'Professional Services', description: 'Full-service digital marketing for SMBs',
        tags: ['services', 'agency', 'marketing'], startupCostRange: '$5k-$20k', timeToRevenue: '1-2 months',
        skillsRequired: ['marketing', 'sales'], complexity: 5,
        planParams: { name: 'GrowthWorks', tagline: 'Grow your business', problem: 'SMBs struggle with marketing', solution: 'Done-for-you marketing services', targetSegment: 'Small businesses', industry: 'Professional Services', startupCost: '$15,000', monthlyRevYear1: '$180,000', monthlyRevYear2: '$1,080,000', monthlyRevYear3: '$3,600,000', processes: ['Client acquisition', 'Campaign management', 'Reporting'], tech: ['Google Ads', 'Facebook Ads', 'Analytics'] },
    },
    {
        name: 'Business Consulting', industry: 'Professional Services', description: 'Management consulting for small businesses',
        tags: ['services', 'consulting', 'b2b'], startupCostRange: '$2k-$10k', timeToRevenue: '1 month',
        skillsRequired: ['business acumen', 'consulting'], complexity: 4,
        planParams: { name: 'BizAdvise Pro', tagline: 'Strategic guidance', problem: 'SMBs need strategic help', solution: 'Fractional consulting services', targetSegment: 'Small business owners', industry: 'Professional Services', startupCost: '$5,000', monthlyRevYear1: '$120,000', monthlyRevYear2: '$720,000', monthlyRevYear3: '$2,400,000', processes: ['Client engagement', 'Analysis', 'Recommendations'], tech: ['CRM', 'Project management'] },
    },
    {
        name: 'Virtual Assistant Agency', industry: 'Professional Services', description: 'Remote administrative support services',
        tags: ['services', 'virtual', 'assistant'], startupCostRange: '$3k-$15k', timeToRevenue: '1-2 months',
        skillsRequired: ['operations', 'customer service'], complexity: 4,
        planParams: { name: 'VirtualPro', tagline: 'Your remote team', problem: 'Businesses need flexible support', solution: 'Virtual assistant services', targetSegment: 'Busy professionals and SMBs', industry: 'Professional Services', startupCost: '$10,000', monthlyRevYear1: '$144,000', monthlyRevYear2: '$864,000', monthlyRevYear3: '$2,880,000', processes: ['Hiring VAs', 'Matching', 'Quality control'], tech: ['Project management', 'Communication tools'] },
    },
    {
        name: 'Web Development Agency', industry: 'Professional Services', description: 'Custom website development for businesses',
        tags: ['services', 'agency', 'web-dev'], startupCostRange: '$5k-$30k', timeToRevenue: '1-3 months',
        skillsRequired: ['web development', 'design'], complexity: 6,
        planParams: { name: 'WebCraft Studio', tagline: 'Websites that convert', problem: 'Businesses need modern websites', solution: 'Custom web development', targetSegment: 'SMBs and startups', industry: 'Professional Services', startupCost: '$20,000', monthlyRevYear1: '$180,000', monthlyRevYear2: '$1,080,000', monthlyRevYear3: '$3,600,000', processes: ['Sales', 'Design', 'Development', 'Launch'], tech: ['React', 'WordPress', 'Webflow'] },
    },
    {
        name: 'Bookkeeping Service', industry: 'Professional Services', description: 'Accounting and bookkeeping for small businesses',
        tags: ['services', 'finance', 'accounting'], startupCostRange: '$3k-$15k', timeToRevenue: '1-2 months',
        skillsRequired: ['accounting', 'bookkeeping'], complexity: 4,
        planParams: { name: 'BookKeep Pro', tagline: 'Your financial partner', problem: 'SMBs struggle with bookkeeping', solution: 'Affordable bookkeeping services', targetSegment: 'Small businesses', industry: 'Professional Services', startupCost: '$10,000', monthlyRevYear1: '$120,000', monthlyRevYear2: '$720,000', monthlyRevYear3: '$2,400,000', processes: ['Onboarding', 'Monthly reconciliation', 'Reporting'], tech: ['QuickBooks', 'Xero', 'Excel'] },
    },

    // Retail/Hospitality (8 models)
    {
        name: 'Specialty Coffee Shop', industry: 'Food & Beverage', description: 'Artisanal coffee shop with workspace',
        tags: ['retail', 'food', 'coffee', 'local'], startupCostRange: '$80k-$250k', timeToRevenue: '2-4 months',
        skillsRequired: ['hospitality', 'operations'], complexity: 6,
        planParams: { name: 'BeanHaven', tagline: 'Coffee and community', problem: 'Lack of quality coffee shops', solution: 'Premium coffee experience', targetSegment: 'Coffee enthusiasts and remote workers', industry: 'Food & Beverage', startupCost: '$150,000', monthlyRevYear1: '$240,000', monthlyRevYear2: '$1,440,000', monthlyRevYear3: '$4,800,000', processes: ['Sourcing', 'Preparation', 'Service'], tech: ['POS system', 'Inventory management'] },
    },
    {
        name: 'Food Truck', industry: 'Food & Beverage', description: 'Mobile food service with specialty cuisine',
        tags: ['retail', 'food', 'mobile'], startupCostRange: '$40k-$150k', timeToRevenue: '1-3 months',
        skillsRequired: ['culinary', 'operations'], complexity: 5,
        planParams: { name: 'Street Eats', tagline: 'Gourmet on wheels', problem: 'Limited quality street food', solution: 'Gourmet mobile cuisine', targetSegment: 'Food lovers and event attendees', industry: 'Food & Beverage', startupCost: '$100,000', monthlyRevYear1: '$180,000', monthlyRevYear2: '$1,080,000', monthlyRevYear3: '$3,600,000', processes: ['Prep', 'Service', 'Events'], tech: ['Mobile POS', 'Route planning'] },
    },
    {
        name: 'Boutique Retail Store', industry: 'Retail', description: 'Curated fashion and lifestyle products',
        tags: ['retail', 'fashion', 'local'], startupCostRange: '$30k-$100k', timeToRevenue: '2-3 months',
        skillsRequired: ['retail', 'merchandising'], complexity: 5,
        planParams: { name: 'Curated Style', tagline: 'Your style curator', problem: 'Generic fashion options', solution: 'Curated boutique experience', targetSegment: 'Fashion-conscious consumers', industry: 'Retail', startupCost: '$60,000', monthlyRevYear1: '$180,000', monthlyRevYear2: '$1,080,000', monthlyRevYear3: '$3,600,000', processes: ['Buying', 'Merchandising', 'Sales'], tech: ['POS', 'Inventory'] },
    },

    // Health/Wellness (5 models)
    {
        name: 'Fitness Studio', industry: 'Health & Wellness', description: 'Boutique fitness classes and training',
        tags: ['health', 'fitness', 'local'], startupCostRange: '$50k-$150k', timeToRevenue: '2-4 months',
        skillsRequired: ['fitness', 'operations'], complexity: 6,
        planParams: { name: 'FitCore Studio', tagline: 'Transform your fitness', problem: 'Boring gym experiences', solution: 'Engaging fitness classes', targetSegment: 'Health-conscious adults', industry: 'Health & Wellness', startupCost: '$100,000', monthlyRevYear1: '$180,000', monthlyRevYear2: '$1,080,000', monthlyRevYear3: '$3,600,000', processes: ['Class planning', 'Training', 'Membership'], tech: ['Booking system', 'CRM'] },
    },
    {
        name: 'Meal Prep Service', industry: 'Food & Beverage', description: 'Healthy meal delivery and prep',
        tags: ['health', 'food', 'delivery'], startupCostRange: '$20k-$80k', timeToRevenue: '1-3 months',
        skillsRequired: ['culinary', 'logistics'], complexity: 6,
        planParams: { name: 'FreshPrep', tagline: 'Healthy meals delivered', problem: 'No time for healthy cooking', solution: 'Pre-made healthy meal delivery', targetSegment: 'Busy health-conscious professionals', industry: 'Food & Beverage', startupCost: '$50,000', monthlyRevYear1: '$180,000', monthlyRevYear2: '$1,080,000', monthlyRevYear3: '$3,600,000', processes: ['Menu planning', 'Prep', 'Delivery'], tech: ['Ordering system', 'Route optimization'] },
    },
    {
        name: 'Online Wellness Coaching', industry: 'Health & Wellness', description: 'Virtual coaching for health and wellness',
        tags: ['health', 'online', 'coaching'], startupCostRange: '$2k-$10k', timeToRevenue: '1-2 months',
        skillsRequired: ['coaching', 'marketing'], complexity: 3,
        planParams: { name: 'WellPath', tagline: 'Your wellness journey', problem: 'Lack of personalized guidance', solution: 'Virtual wellness coaching', targetSegment: 'Health-focused individuals', industry: 'Health & Wellness', startupCost: '$5,000', monthlyRevYear1: '$72,000', monthlyRevYear2: '$432,000', monthlyRevYear3: '$1,440,000', processes: ['Client acquisition', 'Coaching sessions', 'Progress tracking'], tech: ['Video calls', 'Scheduling', 'CRM'] },
    },

    // Education (5 models)
    {
        name: 'Online Course Platform', industry: 'Education', description: 'Create and sell online courses',
        tags: ['education', 'online', 'courses'], startupCostRange: '$5k-$30k', timeToRevenue: '2-4 months',
        skillsRequired: ['subject expertise', 'content creation'], complexity: 5,
        planParams: { name: 'LearnCraft', tagline: 'Master new skills', problem: 'Expensive traditional education', solution: 'Affordable online courses', targetSegment: 'Lifelong learners', industry: 'Education', startupCost: '$20,000', monthlyRevYear1: '$120,000', monthlyRevYear2: '$720,000', monthlyRevYear3: '$2,400,000', processes: ['Course creation', 'Marketing', 'Student support'], tech: ['Teachable', 'Video hosting', 'LMS'] },
    },
    {
        name: 'Tutoring Service', industry: 'Education', description: 'Private tutoring for students',
        tags: ['education', 'tutoring', 'local'], startupCostRange: '$2k-$10k', timeToRevenue: '1 month',
        skillsRequired: ['teaching', 'subject expertise'], complexity: 3,
        planParams: { name: 'TutorPro', tagline: 'Academic excellence', problem: 'Students need personalized help', solution: 'Quality private tutoring', targetSegment: 'Students and parents', industry: 'Education', startupCost: '$5,000', monthlyRevYear1: '$72,000', monthlyRevYear2: '$432,000', monthlyRevYear3: '$1,440,000', processes: ['Student matching', 'Sessions', 'Progress reports'], tech: ['Scheduling', 'Payment processing'] },
    },

    // Real Estate (3 models)
    {
        name: 'Rental Arbitrage', industry: 'Real Estate', description: 'Short-term rental property management',
        tags: ['real-estate', 'rental', 'arbitrage'], startupCostRange: '$10k-$50k', timeToRevenue: '1-2 months',
        skillsRequired: ['property management', 'hospitality'], complexity: 6,
        planParams: { name: 'StayPro', tagline: 'Premium short-term rentals', problem: 'Underutilized rental properties', solution: 'Optimized short-term rentals', targetSegment: 'Travelers and business visitors', industry: 'Real Estate', startupCost: '$30,000', monthlyRevYear1: '$144,000', monthlyRevYear2: '$864,000', monthlyRevYear3: '$2,880,000', processes: ['Property sourcing', 'Marketing', 'Guest management'], tech: ['Airbnb', 'Property management software'] },
    },
    {
        name: 'Co-working Space', industry: 'Real Estate', description: 'Flexible workspace for freelancers and teams',
        tags: ['real-estate', 'coworking', 'local'], startupCostRange: '$50k-$200k', timeToRevenue: '3-6 months',
        skillsRequired: ['real estate', 'operations'], complexity: 7,
        planParams: { name: 'WorkSpace', tagline: 'Where work happens', problem: 'Expensive traditional office space', solution: 'Flexible coworking memberships', targetSegment: 'Freelancers and small teams', industry: 'Real Estate', startupCost: '$150,000', monthlyRevYear1: '$240,000', monthlyRevYear2: '$1,440,000', monthlyRevYear3: '$4,800,000', processes: ['Space management', 'Memberships', 'Events'], tech: ['Access control', 'Booking system'] },
    },

    // Creative/Media (3 models)
    {
        name: 'Podcast Production Agency', industry: 'Media & Entertainment', description: 'End-to-end podcast production services',
        tags: ['media', 'podcasting', 'creative'], startupCostRange: '$10k-$40k', timeToRevenue: '2-3 months',
        skillsRequired: ['audio production', 'marketing'], complexity: 5,
        planParams: { name: 'PodCraft', tagline: 'Your podcast partner', problem: 'Complex podcast production', solution: 'Done-for-you podcast services', targetSegment: 'Businesses and creators', industry: 'Media & Entertainment', startupCost: '$25,000', monthlyRevYear1: '$120,000', monthlyRevYear2: '$720,000', monthlyRevYear3: '$2,400,000', processes: ['Recording', 'Editing', 'Distribution'], tech: ['Audio software', 'Hosting platforms'] },
    },
    {
        name: 'Content Creation Agency', industry: 'Media & Entertainment', description: 'Video and content for brands',
        tags: ['media', 'content', 'video'], startupCostRange: '$15k-$60k', timeToRevenue: '2-4 months',
        skillsRequired: ['video production', 'storytelling'], complexity: 6,
        planParams: { name: 'ContentWorks', tagline: 'Stories that sell', problem: 'Brands need engaging content', solution: 'Professional content creation', targetSegment: 'Brands and businesses', industry: 'Media & Entertainment', startupCost: '$40,000', monthlyRevYear1: '$180,000', monthlyRevYear2: '$1,080,000', monthlyRevYear3: '$3,600,000', processes: ['Strategy', 'Production', 'Distribution'], tech: ['Video software', 'Project management'] },
    },
];
