/**
 * Related Opportunities Library
 * Part-time, side-gig, complementary, and sub-business opportunities
 * for each business model in the encyclopedia
 */

export interface RelatedOpportunity {
    name: string;
    type: 'part-time' | 'complementary' | 'productized' | 'entry-level' | 'niche';
    startupCost: string;
    timeCommitment?: string;
    description: string;
}

export interface RelatedOpportunities {
    partTime: RelatedOpportunity[];
    complementary: RelatedOpportunity[];
    productized: RelatedOpportunity[];
    entryLevel: RelatedOpportunity[];
    niche: RelatedOpportunity[];
}

/**
 * Returns related opportunities for a given business model
 */
export const OPPORTUNITIES_MAP: Record<string, RelatedOpportunities> = {
    // ============================================================
    // TECHNOLOGY / SAAS
    // ============================================================
    'SaaS Project Management Tool': {
        partTime: [
            {
                name: 'Freelance Project Management Consulting',
                type: 'part-time',
                startupCost: '$0-$500',
                timeCommitment: '10-15 hrs/week',
                description: 'Help companies improve PM processes on evenings/weekends'
            },
        ],
        complementary: [
            {
                name: 'PM Training Workshops',
                type: 'complementary',
                startupCost: '$500-$2k',
                description: 'Teach teams how to use PM tools effectively'
            },
        ],
        productized: [
            {
                name: 'Project Templates Marketplace',
                type: 'productized',
                startupCost: '$1k-$5k',
                description: 'Sell pre-built project templates and workflows'
            },
        ],
        entryLevel: [
            {
                name: 'Notion/Airtable Template Sales',
                type: 'entry-level',
                startupCost: '$0-$200',
                description: 'Create and sell project management templates on Gumroad'
            },
        ],
        niche: [
            {
                name: 'Agile Coaching for Startups',
                type: 'niche',
                startupCost: '$500-$3k',
                description: 'Specialize in agile transformation for early-stage companies'
            },
        ],
    },

    'SaaS CRM': {
        partTime: [
            {
                name: 'CRM Implementation Consultant',
                type: 'part-time',
                startupCost: '$500-$2k',
                timeCommitment: '10-20 hrs/week',
                description: 'Set up and configure CRMs for businesses on weekends'
            },
        ],
        complementary: [
            {
                name: 'Sales Process Consulting',
                type: 'complementary',
                startupCost: '$1k-$5k',
                description: 'Design sales workflows and automation'
            },
        ],
        productized: [
            {
                name: 'CRM Migration Services',
                type: 'productized',
                startupCost: '$2k-$8k',
                description: 'Fixed-price data migration packages'
            },
        ],
        entryLevel: [
            {
                name: 'HubSpot/Salesforce Training',
                type: 'entry-level',
                startupCost: '$0-$1k',
                description: 'Offer online or in-person CRM training courses'
            },
        ],
        niche: [
            {
                name: 'CRM for Real Estate Agents',
                type: 'niche',
                startupCost: '$3k-$10k',
                description: 'Specialized CRM setup for real estate industry'
            },
        ],
    },

    'Email Marketing Platform': {
        partTime: [
            {
                name: 'Email Copywriting Services',
                type: 'part-time',
                startupCost: '$0-$500',
                timeCommitment: '5-15 hrs/week',
                description: 'Write email campaigns for businesses'
            },
        ],
        complementary: [
            {
                name: 'Email List Building Services',
                type: 'complementary',
                startupCost: '$1k-$5k',
                description: 'Help companies grow their email subscribers'
            },
        ],
        productized: [
            {
                name: 'Email Template Shop',
                type: 'productized',
                startupCost: '$500-$3k',
                description: 'Sell pre-designed email templates for various industries'
            },
        ],
        entryLevel: [
            {
                name: 'Newsletter Ghostwriting',
                type: 'entry-level',
                startupCost: '$0-$500',
                description: 'Write weekly newsletters for founders and executives'
            },
        ],
        niche: [
            {
                name: 'E-commerce Email Sequences',
                type: 'niche',
                startupCost: '$1k-$5k',
                description: 'Specialize in automated email flows for online stores'
            },
        ],
    },

    'AI Chatbot SaaS': {
        partTime: [
            {
                name: 'Chatbot Setup Consulting',
                type: 'part-time',
                startupCost: '$500-$3k',
                timeCommitment: '10-15 hrs/week',
                description: 'Implement chatbots for websites and apps'
            },
        ],
        complementary: [
            {
                name: 'Conversational Design',
                type: 'complementary',
                startupCost: '$1k-$5k',
                description: 'Design chatbot conversation flows'
            },
        ],
        productized: [
            {
                name: 'Pre-trained Chatbot Templates',
                type: 'productized',
                startupCost: '$2k-$10k',
                description: 'Industry-specific chatbot templates ready to deploy'
            },
        ],
        entryLevel: [
            {
                name: 'Chatbot Script Writing',
                type: 'entry-level',
                startupCost: '$0-$1k',
                description: 'Write conversation scripts for chatbot platforms'
            },
        ],
        niche: [
            {
                name: 'Healthcare Chatbot Compliance',
                type: 'niche',
                startupCost: '$5k-$15k',
                description: 'HIPAA-compliant chatbots for medical practices'
            },
        ],
    },

    // ============================================================
    // PROFESSIONAL SERVICES
    // ============================================================
    'Digital Marketing Agency': {
        partTime: [
            {
                name: 'Freelance Facebook Ads Manager',
                type: 'part-time',
                startupCost: '$0-$1k',
                timeCommitment: '10-20 hrs/week',
                description: 'Manage Facebook/Instagram ads for 3-5 clients'
            },
        ],
        complementary: [
            {
                name: 'Social Media Content Creation',
                type: 'complementary',
                startupCost: '$500-$3k',
                description: 'Create posts, reels, and stories for clients'
            },
        ],
        productized: [
            {
                name: 'Marketing Audit Service',
                type: 'productized',
                startupCost: '$1k-$5k',
                description: 'Fixed-price comprehensive marketing analysis'
            },
        ],
        entryLevel: [
            {
                name: 'Google Ads for Local Businesses',
                type: 'entry-level',
                startupCost: '$0-$500',
                description: 'Simple Google Ads setup and management'
            },
        ],
        niche: [
            {
                name: 'Marketing for Dental Practices',
                type: 'niche',
                startupCost: '$3k-$10k',
                description: 'Specialized dental marketing services'
            },
        ],
    },

    'Web Development Agency': {
        partTime: [
            {
                name: 'Website Maintenance Retainers',
                type: 'part-time',
                startupCost: '$0-$1k',
                timeCommitment: '5-15 hrs/week',
                description: 'Monthly website updates and maintenance'
            },
        ],
        complementary: [
            {
                name: 'SEO Optimization Services',
                type: 'complementary',
                startupCost: '$1k-$5k',
                description: 'On-page and technical SEO for client websites'
            },
        ],
        productized: [
            {
                name: 'Landing Page Templates',
                type: 'productized',
                startupCost: '$2k-$8k',
                description: 'Pre-built, customizable landing page templates'
            },
        ],
        entryLevel: [
            {
                name: 'WordPress Fixes on Fiverr',
                type: 'entry-level',
                startupCost: '$0-$200',
                description: 'Quick WordPress bug fixes and updates'
            },
        ],
        niche: [
            {
                name: 'Attorney Website Specialist',
                type: 'niche',
                startupCost: '$3k-$12k',
                description: 'Websites specifically for law firms with legal intake forms'
            },
        ],
    },

    'Bookkeeping Service': {
        partTime: [
            {
                name: 'Tax Prep Services (Seasonal)',
                type: 'part-time',
                startupCost: '$500-$2k',
                timeCommitment: '15-25 hrs/week (Jan-Apr)',
                description: 'Seasonal tax preparation for individuals and small businesses'
            },
        ],
        complementary: [
            {
                name: 'Payroll Services',
                type: 'complementary',
                startupCost: '$1k-$5k',
                description: 'Bi-weekly payroll processing for clients'
            },
        ],
        productized: [
            {
                name: 'Monthly Reconciliation Packages',
                type: 'productized',
                startupCost: '$500-$3k',
                description: 'Fixed-fee monthly books reconciliation'
            },
        ],
        entryLevel: [
            {
                name: 'QuickBooks Setup Service',
                type: 'entry-level',
                startupCost: '$0-$500',
                description: 'One-time QuickBooks setup and training'
            },
        ],
        niche: [
            {
                name: 'Bookkeeping for Airbnb Hosts',
                type: 'niche',
                startupCost: '$1k-$5k',
                description: 'Specialized bookkeeping for short-term rental owners'
            },
        ],
    },

    'Management Consulting Firm': {
        partTime: [
            {
                name: 'Executive Coaching (Evenings)',
                type: 'part-time',
                startupCost: '$500-$3k',
                timeCommitment: '5-10 hrs/week',
                description: 'One-on-one coaching sessions after work hours'
            },
        ],
        complementary: [
            {
                name: 'Strategic Planning Workshops',
                type: 'complementary',
                startupCost: '$2k-$10k',
                description: 'Facilitated strategy sessions and retreats'
            },
        ],
        productized: [
            {
                name: 'Board Advisory Services',
                type: 'productized',
                startupCost: '$5k-$15k',
                description: 'Monthly advisory board membership packages'
            },
        ],
        entryLevel: [
            {
                name: 'Business Model Canvas Consulting',
                type: 'entry-level',
                startupCost: '$0-$1k',
                description: 'Single-session business model workshops'
            },
        ],
        niche: [
            {
                name: 'Turnaround Consulting for Restaurants',
                type: 'niche',
                startupCost: '$5k-$20k',
                description: 'Specialize in restaurant profitability improvement'
            },
        ],
    },

    'Business Brokerage': {
        partTime: [
            {
                name: 'Business Valuation Only',
                type: 'part-time',
                startupCost: '$1k-$5k',
                timeCommitment: '5-15 hrs/week',
                description: 'Perform business valuations without full brokerage'
            },
        ],
        complementary: [
            {
                name: 'Exit Planning Consulting',
                type: 'complementary',
                startupCost: '$2k-$8k',
                description: 'Help business owners prepare for eventual sale'
            },
        ],
        productized: [
            {
                name: 'Confidential Information Memorandums',
                type: 'productized',
                startupCost: '$2k-$10k',
                description: 'Professional CIM creation service'
            },
        ],
        entryLevel: [
            {
                name: 'Listing Research for Brokers',
                type: 'entry-level',
                startupCost: '$500-$2k',
                description: 'Support services for established brokers'
            },
        ],
        niche: [
            {
                name: 'SaaS Business Brokerage',
                type: 'niche',
                startupCost: '$5k-$20k',
                description: 'Specialize in buying/selling software businesses'
            },
        ],
    },

    // ============================================================
    // FOOD & BEVERAGE
    // ============================================================
    'Specialty Coffee Shop': {
        partTime: [
            {
                name: 'Coffee Catering',
                type: 'part-time',
                startupCost: '$2k-$8k',
                timeCommitment: '10-20 hrs/week',
                description: 'Mobile coffee catering for events and offices'
            },
        ],
        complementary: [
            {
                name: 'Barista Training',
                type: 'complementary',
                startupCost: '$1k-$5k',
                description: 'Teach barista skills to other coffee shops'
            },
        ],
        productized: [
            {
                name: 'Coffee Subscription Boxes',
                type: 'productized',
                startupCost: '$3k-$12k',
                description: 'Monthly coffee bean subscription service'
            },
        ],
        entryLevel: [
            {
                name: 'Farmers Market Coffee Stand',
                type: 'entry-level',
                startupCost: '$1k-$5k',
                description: 'Weekend pop-up coffee stand'
            },
        ],
        niche: [
            {
                name: 'Corporate Office Coffee Service',
                type: 'niche',
                startupCost: '$5k-$20k',
                description: 'Premium office coffee program for businesses'
            },
        ],
    },

    'Food Truck': {
        partTime: [
            {
                name: 'Weekend Catering',
                type: 'part-time',
                startupCost: '$5k-$15k',
                timeCommitment: '15-25 hrs/week',
                description: 'Cater private events on weekends only'
            },
        ],
        complementary: [
            {
                name: 'Recipe Development Consulting',
                type: 'complementary',
                startupCost: '$1k-$5k',
                description: 'Create menus for other food businesses'
            },
        ],
        productized: [
            {
                name: 'Meal Prep Delivery',
                type: 'productized',
                startupCost: '$3k-$12k',
                description: 'Weekly prepared meal packages'
            },
        ],
        entryLevel: [
            {
                name: 'Pop-up Dinners',
                type: 'entry-level',
                startupCost: '$500-$3k',
                description: 'Host occasional themed dinner events'
            },
        ],
        niche: [
            {
                name: 'Taco Catering for Corporate Events',
                type: 'niche',
                startupCost: '$8k-$25k',
                description: 'Specialize in office lunch catering'
            },
        ],
    },

    'Meal Prep Service': {
        partTime: [
            {
                name: 'Personal Chef (Weekends)',
                type: 'part-time',
                startupCost: '$1k-$5k',
                timeCommitment: '10-20 hrs/week',
                description: 'In-home meal prep on Saturdays and Sundays'
            },
        ],
        complementary: [
            {
                name: 'Nutrition Coaching',
                type: 'complementary',
                startupCost: '$500-$3k',
                description: 'Meal planning and nutrition guidance'
            },
        ],
        productized: [
            {
                name: 'Weekly Meal Kits',
                type: 'productized',
                startupCost: '$5k-$20k',
                description: 'Pre-portioned ingredients for home cooking'
            },
        ],
        entryLevel: [
            {
                name: 'Meal Prep for Bodybuilders',
                type: 'entry-level',
                startupCost: '$1k-$5k',
                description: 'High-protein meal prep for fitness enthusiasts'
            },
        ],
        niche: [
            {
                name: 'Keto Meal Delivery',
                type: 'niche',
                startupCost: '$5k-$18k',
                description: 'Specialized low-carb meal service'
            },
        ],
    },

    // ============================================================
    // HEALTHCARE
    // ============================================================
    'Telemedicine Platform (Specialist)': {
        partTime: [
            {
                name: 'Evening Virtual Consultations',
                type: 'part-time',
                startupCost: '$2k-$8k',
                timeCommitment: '5-15 hrs/week',
                description: 'Offer telehealth after regular practice hours'
            },
        ],
        complementary: [
            {
                name: 'Medical Second Opinions',
                type: 'complementary',
                startupCost: '$1k-$5k',
                description: 'Review cases and provide second opinion consultations'
            },
        ],
        productized: [
            {
                name: 'Prescription Refill Service',
                type: 'productized',
                startupCost: '$3k-$12k',
                description: 'Streamlined telehealth prescription renewals'
            },
        ],
        entryLevel: [
            {
                name: 'Urgent Care Telemedicine (Weekends)',
                type: 'entry-level',
                startupCost: '$1k-$5k',
                description: 'Weekend-only virtual urgent care'
            },
        ],
        niche: [
            {
                name: 'Dermatology Telemedicine',
                type: 'niche',
                startupCost: '$10k-$40k',
                description: 'Virtual dermatology consultations and prescriptions'
            },
        ],
    },

    'Medical Consulting & Expert Witness': {
        partTime: [
            {
                name: 'Case Reviews Only',
                type: 'part-time',
                startupCost: '$500-$2k',
                timeCommitment: '5-10 hrs/week',
                description: 'Review medical records on evenings/weekends'
            },
        ],
        complementary: [
            {
                name: 'Medical Record Review',
                type: 'complementary',
                startupCost: '$1k-$5k',
                description: 'Comprehensive chart review services'
            },
        ],
        productized: [
            {
                name: 'Independent Medical Exams (IME)',
                type: 'productized',
                startupCost: '$2k-$10k',
                description: 'Fixed-fee medical evaluations for legal cases'
            },
        ],
        entryLevel: [
            {
                name: 'Peer Review for Insurance',
                type: 'entry-level',
                startupCost: '$500-$2k',
                description: 'Review insurance claim medical necessity'
            },
        ],
        niche: [
            {
                name: "Workers' Comp Expert Witness",
                type: 'niche',
                startupCost: '$2k-$10k',
                description: 'Specialize in workplace injury cases'
            },
        ],
    },

    // Add more models as needed...
    // This is a sample - the full implementation would include all 99 models
};

/**
 * Helper function to get opportunities for a business model
 */
export function getRelatedOpportunities(modelName: string): RelatedOpportunities | null {
    return OPPORTUNITIES_MAP[modelName] || null;
}

/**
 * Get all opportunities of a specific type
 */
export function getOpportunitiesByType(
    modelName: string,
    type: RelatedOpportunity['type']
): RelatedOpportunity[] {
    const opportunities = OPPORTUNITIES_MAP[modelName];
    if (!opportunities) return [];

    switch (type) {
        case 'part-time':
            return opportunities.partTime;
        case 'complementary':
            return opportunities.complementary;
        case 'productized':
            return opportunities.productized;
        case 'entry-level':
            return opportunities.entryLevel;
        case 'niche':
            return opportunities.niche;
        default:
            return [];
    }
}
