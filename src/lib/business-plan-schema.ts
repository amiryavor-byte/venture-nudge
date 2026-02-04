import { z } from 'zod';

/**
 * Comprehensive Business Plan Schema
 * Defines the canonical structure for all business model plans in the encyclopedia
 */

export const BusinessPlanSchema = z.object({
    // 1. Executive Summary
    executiveSummary: z.object({
        businessName: z.string(),
        tagline: z.string(),
        mission: z.string(),
        vision: z.string(),
        keySummary: z.string(), // 2-3 sentence overview
    }),

    // 2. Problem & Solution
    problemStatement: z.object({
        problem: z.string(),
        painPoints: z.array(z.string()),
        currentSolutions: z.array(z.string()),
        marketGap: z.string(),
    }),

    solution: z.object({
        description: z.string(),
        uniqueValue: z.string(),
        keyFeatures: z.array(z.string()),
    }),

    // 3. Market Analysis
    targetMarket: z.object({
        primarySegment: z.string(),
        demographics: z.record(z.string(), z.string()),
        marketSize: z.object({
            tam: z.string(), // Total addressable market
            sam: z.string(), // Serviceable addressable market
            som: z.string(), // Serviceable obtainable market
        }),
        trends: z.array(z.string()),
    }),

    // 4. Competitive Analysis
    competition: z.object({
        directCompetitors: z.array(z.object({
            name: z.string(),
            strengths: z.array(z.string()),
            weaknesses: z.array(z.string()),
        })),
        indirectCompetitors: z.array(z.string()),
        competitiveAdvantage: z.string(),
        barrierToEntry: z.string(),
    }),

    // 5. Revenue Model
    revenueModel: z.object({
        type: z.enum(['subscription', 'transaction', 'licensing', 'freemium', 'marketplace', 'advertising', 'hybrid', 'product_sales', 'service_fees']),
        pricingStrategy: z.string(),
        revenueStreams: z.array(z.object({
            name: z.string(),
            description: z.string(),
            estimatedContribution: z.string(), // percentage or amount
        })),
        unitEconomics: z.object({
            cac: z.string(), // Customer acquisition cost
            ltv: z.string(), // Lifetime value
            grossMargin: z.string(),
        }),
    }),

    // 6. Marketing & Sales
    marketingStrategy: z.object({
        channels: z.array(z.object({
            name: z.string(),
            budget: z.string(),
            expectedResults: z.string(),
        })),
        customerAcquisition: z.string(),
        retentionStrategy: z.string(),
        brandPositioning: z.string(),
    }),

    // 7. Operations
    operations: z.object({
        businessModel: z.string(), // How it runs day-to-day
        keyProcesses: z.array(z.string()),
        technology: z.array(z.string()),
        suppliers: z.array(z.string()).optional(),
        facilities: z.string().optional(),
        staffingRequirements: z.string().optional(),
    }),

    // 8. Team & Organization
    team: z.object({
        founders: z.array(z.object({
            role: z.string(),
            responsibilities: z.array(z.string()),
        })),
        keyHires: z.array(z.object({
            title: z.string(),
            timing: z.string(), // "Month 3", "Year 1"
            salary: z.string().optional(),
        })),
        advisors: z.array(z.string()).optional(),
    }),

    // 9. Financial Projections
    financials: z.object({
        startupCosts: z.object({
            total: z.string(),
            breakdown: z.array(z.object({
                category: z.string(),
                amount: z.string(),
                description: z.string().optional(),
            })),
        }),
        monthlyOperatingCosts: z.string(),
        projections: z.object({
            year1: z.object({
                revenue: z.string(),
                expenses: z.string(),
                profit: z.string(),
            }),
            year2: z.object({
                revenue: z.string(),
                expenses: z.string(),
                profit: z.string(),
            }),
            year3: z.object({
                revenue: z.string(),
                expenses: z.string(),
                profit: z.string(),
            }),
        }),
        breakEvenAnalysis: z.string(),
        assumptions: z.array(z.string()).optional(),
    }),

    // 10. Funding Requirements
    funding: z.object({
        required: z.string(),
        useOfFunds: z.array(z.object({
            category: z.string(),
            amount: z.string(),
            rationale: z.string(),
        })),
        fundingSources: z.array(z.string()), // e.g., "bootstrapped", "angel", "vc", "loans"
    }).optional(),

    // 11. Risks & Mitigation
    risks: z.object({
        marketRisks: z.array(z.object({
            risk: z.string(),
            likelihood: z.enum(['low', 'medium', 'high']),
            impact: z.enum(['low', 'medium', 'high']),
            mitigation: z.string(),
        })),
        operationalRisks: z.array(z.object({
            risk: z.string(),
            likelihood: z.enum(['low', 'medium', 'high']),
            impact: z.enum(['low', 'medium', 'high']),
            mitigation: z.string(),
        })),
        financialRisks: z.array(z.object({
            risk: z.string(),
            likelihood: z.enum(['low', 'medium', 'high']),
            impact: z.enum(['low', 'medium', 'high']),
            mitigation: z.string(),
        })),
    }),

    // 12. Milestones & Timeline
    milestones: z.array(z.object({
        phase: z.string(),
        timing: z.string(), // "Month 1-3", "Q2 2026"
        goals: z.array(z.string()),
        successMetrics: z.array(z.string()),
    })),
});

export type BusinessPlanData = z.infer<typeof BusinessPlanSchema>;

// Helper schema for model metadata
export const ModelMetadataSchema = z.object({
    tags: z.array(z.string()),
    startupCostRange: z.string(),
    timeToRevenue: z.string(),
    skillsRequired: z.array(z.string()),
    complexity: z.number().min(1).max(10),
});

export type ModelMetadata = z.infer<typeof ModelMetadataSchema>;
