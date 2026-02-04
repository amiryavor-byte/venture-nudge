import { v4 as uuidv4 } from 'uuid';

export interface BusinessPlanVersion {
    id: string;
    created_at: string;
    user: string;
    content: BusinessPlanData;
}

export interface RoadmapItem {
    id: string;
    feature: string;
    quarter?: string; // e.g. "Q2 2024"
    status: 'planned' | 'in-progress' | 'completed' | 'idea';
    description?: string;
    source?: 'manual' | 'gap-analysis';
}

export interface BusinessPlanData {
    missionStatement: string;
    amirRole: string;
    davidRole: string;
    shareAmir: number;
    shareDavid: number;

    // Core Business Context (Added for Gen-AI pivoting)
    problem?: string;
    solution?: string;
    targetAudience?: string;
    monetization?: string;

    // Financials
    projections: AnyProjection[];
    monthlyProjections: AnyProjection[];

    basePriceLow: number;
    basePriceHigh: number;
    featurePriceLow: number;
    featurePriceHigh: number;
    hourlyRate: number;

    clientsPerDev: number;
    devMonthlyCost: number;
    hostingCost: number;
    serverCost: number;

    // Strategy
    revenueStrategy?: string;
    buyoutClause?: string;

    // Exit Schedule
    exitSchedule: ExitScheduleRow[];

    // Workflow
    workflowSteps: WorkflowStep[];

    // Sales Pitch
    salesPitch: string;

    // New Sections
    marketAnalysis: string;
    competitiveAdvantage: string;
    productRoadmap: RoadmapItem[] | string; // Type union for migration support

    marketStats?: {
        competitors: Array<{
            name: string;
            marketShare: number;
            aiScore: number;
            features: string[];
            weaknesses: string[];
            detailedAnalysis?: string; // New field for batch storage
        }>;
        featureComparison: Array<{
            feature: string;
            us: number;
            competitors: number;
        }>;
        lastUpdated?: string;
        lastUpdated?: string;
    };

    // Phase 3: Legal & Operations
    legalStructure?: 'LLC' | 'Sole Proprietorship' | 'Corporation' | 'Partnership';
    legalNotes?: string;
    licenses?: Array<{
        name: string;
        status: 'needed' | 'in-progress' | 'acquired';
        notes?: string;
    }>;
    location?: {
        zipCode?: string;
        rentEstimate?: number;
        areaScore?: number;
    };
    buildOut?: Array<{
        item: string;
        category: 'equipment' | 'construction' | 'permit';
        estimatedCost: number;
        status: 'pending' | 'ordered' | 'installed';
    }>;
    softwareStack?: Array<{
        category: string;
        toolName: string;
        monthlyCost: number;
    }>;

    // Exit Strategy (legacy field, might be unused now but keeping for safety)
    exitStrategy?: any;
}

export interface AnyProjection {
    year: number;
    month: number;
    revenue: number;
    expenses: number;
    profit: number;
    clientCount: number;
    upgradeAdoption: number;
    [key: string]: any;
}

export interface ExitScheduleRow {
    year: string;
    amir: number;
    david: number;
    role: string;
}

export interface WorkflowStep {
    id: string;
    title: string;
    description: string;
}


export const DEFAULT_PLAN_DATA: BusinessPlanData = {
    missionStatement: "To revolutionize the catering industry with AI-driven operations.",
    amirRole: "Product Vision & Strategy",
    davidRole: "Operations & Sales",
    shareAmir: 51,
    shareDavid: 49,

    basePriceLow: 1000,
    basePriceHigh: 3000,
    featurePriceLow: 100,
    featurePriceHigh: 500,
    hourlyRate: 150,

    clientsPerDev: 10,
    devMonthlyCost: 5000,
    hostingCost: 100,
    serverCost: 500,

    revenueStrategy: "Focus on land-and-expand with premium AI features.",
    buyoutClause: "Standard buyout at 3x ARR.",

    exitSchedule: [
        { year: "Year 1", amir: 51, david: 49, role: "Full Time" },
        { year: "Year 2", amir: 51, david: 49, role: "Full Time" },
        { year: "Year 3", amir: 40, david: 60, role: "Advisory" },
        { year: "Year 4", amir: 20, david: 80, role: "Board Member" },
        { year: "Year 5", amir: 5, david: 95, role: "Silent Partner" }
    ],

    projections: Array.from({ length: 5 }).map((_, i) => ({
        year: new Date().getFullYear() + i,
        month: 0,
        revenue: 0,
        expenses: 0,
        profit: 0,
        clientCount: 0,
        upgradeAdoption: 0
    })),

    monthlyProjections: Array.from({ length: 60 }).map((_, i) => ({
        year: new Date().getFullYear() + Math.floor(i / 12),
        month: i + 1,
        revenue: 0,
        expenses: 0,
        profit: 0,
        clientCount: 5 + i, // Linear growth starting at 5
        upgradeAdoption: 10 // 10% adoption
    })),

    workflowSteps: [
        {
            id: '1',
            title: "Lead Generation & Sale",
            description: "David secures client deposit + signed contract."
        },
        {
            id: '2',
            title: "Hand-off to Technical",
            description: "David provides domain details & assets to Amir via portal."
        },
        {
            id: '3',
            title: "Deployment & Customization",
            description: "Amir deploys code + 10hrs custom styling/config."
        },
        {
            id: '4',
            title: "Training & Launch",
            description: "David performs final client training and handover."
        }
    ],
    salesPitch: "The Future of Catering",

    marketAnalysis: `### Target Market: Teaneck Radius (07666)
- **Primary Focus**: Jewish Caterers within 30-min drive of Teaneck, NJ.
- **Key Hubs**: Bergenfield, Englewood, Passaic, Monsey.
- **Ideal Customer Profile (ICP)**:
  - **High Volume**: 3-4 heavy event days/week (Shabbat + Sunday Weddings).
  - **Certification**: RCBC, OU, Star-K.
  - **Pain Points**: Managing mashgiach schedules, kashering mobile kitchens, "Friday Crunch".`,

    competitiveAdvantage: `### Why We Win ("The Moat")
- **Kosher-Native Logic**:
  - **Mashgiach Scheduling**: Automated supervisor tracking integrated with event timeline.
  - **Fleishig/Milchig Safety**: Digital tagging prevents menu conflicts (e.g., no dairy updates on a meat event).
  - **Shabbat Awareness**: "Friday Crunch" logistics that generic CRMs (Total Party Planner) miss completely.
  - **Local Trust**: Built by locals, for locals. Direct support in the same time zone/community.`,

    productRoadmap: [
        {
            id: '1',
            feature: "Menu Logistics Decoder",
            quarter: "Q2 2026",
            status: "planned",
            description: "AI scans PDF menus to highlight potential kashrut/logistical conflicts automatically."
        },
        {
            id: '2',
            feature: "Shabbat Crunch Simulator",
            quarter: "Q3 2026",
            status: "idea",
            description: "Forecasting tool to visualize staff/kitchen load for upcoming heavy weekends."
        },
        {
            id: '3',
            feature: "Kashrut Web Crawler",
            quarter: "Q4 2026",
            status: "idea",
            description: "Auto-verifies vendor/ingredient certification status against major kosher databases."
        }
    ],

    marketStats: {
        competitors: [
            { name: "Total Party Planner", marketShare: 35, aiScore: 10, features: ["Event Management", "Staffing"], weaknesses: ["No Kosher Support", "Old UI"] },
            { name: "Caterease", marketShare: 45, aiScore: 15, features: ["CRM", "Desktop App"], weaknesses: ["Expensive", "Legacy Codebase"] },
            { name: "Spoonfed", marketShare: 15, aiScore: 65, features: ["Online Ordering", "Drop-off Focus"], weaknesses: ["Limited Event Ops"] }
        ],
        featureComparison: [
            { feature: "AI Automation", us: 90, competitors: 20 },
            { feature: "Kosher Logic", us: 100, competitors: 5 },
            { feature: "Mobile Experience", us: 85, competitors: 60 },
            { feature: "Price Value", us: 95, competitors: 40 }
        ]
    }
};

const STORAGE_KEY = 'business_plan_v1';
const HISTORY_KEY = 'business_plan_history_v1';

export class BusinessPlanService {
    static async getLatest(): Promise<{ latest: BusinessPlanVersion | null; history: BusinessPlanVersion[] }> {
        if (typeof window === 'undefined') return { latest: null, history: [] };

        const latestJson = localStorage.getItem(STORAGE_KEY);
        const historyJson = localStorage.getItem(HISTORY_KEY);

        const latest = latestJson ? JSON.parse(latestJson) : null;
        const history = historyJson ? JSON.parse(historyJson) : [];

        // Simple validation/migration in case local storage has old schema
        if (latest && latest.content) {
            // Migration: productRoadmap string -> array
            if (typeof latest.content.productRoadmap === 'string') {
                latest.content.productRoadmap = [
                    {
                        id: uuidv4(),
                        feature: "Legacy Roadmap",
                        quarter: "Q1 2026",
                        status: "planned",
                        description: latest.content.productRoadmap
                    }
                ];
            }

            if (!latest.content.monthlyProjections) {
                latest.content = { ...DEFAULT_PLAN_DATA, ...latest.content };
                latest.content.monthlyProjections = DEFAULT_PLAN_DATA.monthlyProjections;
            }
        }

        return { latest, history };
    }

    static async saveVersion(user: string, data: BusinessPlanData): Promise<void> {
        if (typeof window === 'undefined') return;

        const version: BusinessPlanVersion = {
            id: uuidv4(),
            created_at: new Date().toISOString(),
            user,
            content: data
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(version));

        const historyJson = localStorage.getItem(HISTORY_KEY);
        const history = historyJson ? JSON.parse(historyJson) : [];
        const newHistory = [version, ...history].slice(0, 50);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    }
}

export function calculateExponentialGrowth(start: number, end: number, steps: number): { clientCount: number }[] {
    const results = [];
    if (start <= 0) start = 1; // Prevent division by zero or invalid log
    if (end <= 0) end = 1;

    // Calculate growth rate to reach end from start in (steps - 1) increments
    // start * (1+r)^(steps-1) = end
    // (1+r) = (end/start)^(1/(steps-1))

    // If steps is 1?
    if (steps <= 1) return [{ clientCount: end }];

    const rate = Math.pow(end / start, 1 / (steps - 1)) - 1;

    for (let i = 0; i < steps; i++) {
        const val = start * Math.pow(1 + rate, i);
        results.push({ clientCount: Math.round(val) });
    }
    return results;
}
