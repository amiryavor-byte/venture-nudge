'use server';

import { db } from '@/db';
import { businessPlans } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { BusinessPlanData, DEFAULT_PLAN_DATA } from '@/lib/business-plan-service';

export async function getPlanData(planId: string): Promise<BusinessPlanData> {
    console.log('[getPlanData] Looking for plan:', planId);
    const plan = await db.query.businessPlans.findFirst({
        where: eq(businessPlans.id, planId)
    });

    console.log('[getPlanData] Found plan:', plan ? 'YES' : 'NO', plan?.id);
    if (!plan) throw new Error("Plan not found");

    // If we have the full JSON content stored, use it.
    // Otherwise, construct it from the separate columns (migration/compatibility mode).
    if (plan.content) {
        // Cast unknown json to BusinessPlanData (simulated)
        const content = plan.content as unknown as BusinessPlanData;

        // Merge with any column updates just in case columns are 'truth'
        return {
            ...DEFAULT_PLAN_DATA,
            ...content,
            missionStatement: plan.name || content.missionStatement,
            // If targetAudience was updated by AI Deep Dive, let's prioritize it if it has new content
            marketAnalysis: (plan.targetAudience?.length && plan.targetAudience.length > (content.marketAnalysis?.length || 0))
                ? plan.targetAudience
                : (content.marketAnalysis || DEFAULT_PLAN_DATA.marketAnalysis)
        };
    }

    // Fallback: Construct entirely from columns
    return {
        ...DEFAULT_PLAN_DATA,
        missionStatement: plan.name || "New Business",
        salesPitch: plan.solution || "", // Fixed: use 'solution' as 'description'/'salesPitch'
        marketAnalysis: plan.targetAudience || DEFAULT_PLAN_DATA.marketAnalysis,

        marketStats: {
            competitors: [],
            featureComparison: [],
            lastUpdated: new Date().toISOString()
        }
    };
}

export async function updatePlanData(planId: string, data: BusinessPlanData) {
    await db.update(businessPlans).set({
        name: data.missionStatement,
        targetAudience: data.marketAnalysis,
        solution: data.salesPitch,
        content: data // Save the full JSON blob
    }).where(eq(businessPlans.id, planId));

    return { success: true };
}
