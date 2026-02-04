'use server';

import { db } from '@/db';
import { affiliatePrograms, affiliateReferrals } from '@/db/schema';
import { eq, desc, and, like, inArray, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export type AffiliateProgram = typeof affiliatePrograms.$inferSelect;
export type NewAffiliateProgram = typeof affiliatePrograms.$inferInsert;

export interface AffiliateFilters {
    search?: string;
    category?: string;
    status?: string;
    hasApi?: boolean;
}

export interface AffiliateStats {
    totalPrograms: number;
    activePrograms: number;
    totalRevenue: number;
    totalConversions: number;
    topPerformers: Array<{
        name: string;
        revenue: number;
        conversions: number;
    }>;
}

/**
 * Get all affiliate programs with optional filtering
 */
export async function getAffiliatePrograms(filters?: AffiliateFilters): Promise<AffiliateProgram[]> {
    try {
        let query = db.select().from(affiliatePrograms);

        const conditions = [];

        if (filters?.search) {
            conditions.push(
                like(affiliatePrograms.name, `%${filters.search}%`)
            );
        }

        if (filters?.category) {
            conditions.push(eq(affiliatePrograms.category, filters.category));
        }

        if (filters?.status) {
            conditions.push(eq(affiliatePrograms.status, filters.status));
        }

        if (filters?.hasApi !== undefined) {
            conditions.push(eq(affiliatePrograms.hasApi, filters.hasApi));
        }

        if (conditions.length > 0) {
            query = query.where(and(...conditions)) as any;
        }

        const results = await query.orderBy(desc(affiliatePrograms.priority), affiliatePrograms.name);
        return results;
    } catch (error) {
        console.error('Error fetching affiliate programs:', error);
        return [];
    }
}

/**
 * Get a single affiliate program by ID
 */
export async function getAffiliateProgramById(id: string): Promise<AffiliateProgram | null> {
    try {
        const [program] = await db
            .select()
            .from(affiliatePrograms)
            .where(eq(affiliatePrograms.id, id))
            .limit(1);

        return program || null;
    } catch (error) {
        console.error('Error fetching affiliate program:', error);
        return null;
    }
}

/**
 * Create a new affiliate program
 */
export async function createAffiliateProgram(data: NewAffiliateProgram): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
        const id = crypto.randomUUID();

        await db.insert(affiliatePrograms).values({
            ...data,
            id,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        revalidatePath('/admin/affiliates');

        return { success: true, id };
    } catch (error) {
        console.error('Error creating affiliate program:', error);
        return { success: false, error: 'Failed to create affiliate program' };
    }
}

/**
 * Update an existing affiliate program
 */
export async function updateAffiliateProgram(
    id: string,
    data: Partial<NewAffiliateProgram>
): Promise<{ success: boolean; error?: string }> {
    try {
        await db
            .update(affiliatePrograms)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(affiliatePrograms.id, id));

        revalidatePath('/admin/affiliates');

        return { success: true };
    } catch (error) {
        console.error('Error updating affiliate program:', error);
        return { success: false, error: 'Failed to update affiliate program' };
    }
}

/**
 * Delete an affiliate program
 */
export async function deleteAffiliateProgram(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        await db
            .delete(affiliatePrograms)
            .where(eq(affiliatePrograms.id, id));

        revalidatePath('/admin/affiliates');

        return { success: true };
    } catch (error) {
        console.error('Error deleting affiliate program:', error);
        return { success: false, error: 'Failed to delete affiliate program' };
    }
}

/**
 * Bulk update status for multiple affiliates
 */
export async function bulkUpdateStatus(
    ids: string[],
    status: 'active' | 'inactive' | 'deprecated'
): Promise<{ success: boolean; error?: string }> {
    try {
        await db
            .update(affiliatePrograms)
            .set({
                status,
                updatedAt: new Date(),
            })
            .where(inArray(affiliatePrograms.id, ids));

        revalidatePath('/admin/affiliates');

        return { success: true };
    } catch (error) {
        console.error('Error bulk updating status:', error);
        return { success: false, error: 'Failed to update affiliate statuses' };
    }
}

/**
 * Get affiliate statistics for dashboard
 */
export async function getAffiliateStats(): Promise<AffiliateStats> {
    try {
        const allPrograms = await db.select().from(affiliatePrograms);

        const activePrograms = allPrograms.filter(p => p.status === 'active');

        const totalRevenue = allPrograms.reduce((sum, p) => sum + (p.totalRevenue || 0), 0);
        const totalConversions = allPrograms.reduce((sum, p) => sum + (p.totalConversions || 0), 0);

        // Get top 5 performers by revenue
        const topPerformers = allPrograms
            .filter(p => p.totalRevenue > 0)
            .sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0))
            .slice(0, 5)
            .map(p => ({
                name: p.name,
                revenue: p.totalRevenue || 0,
                conversions: p.totalConversions || 0,
            }));

        return {
            totalPrograms: allPrograms.length,
            activePrograms: activePrograms.length,
            totalRevenue,
            totalConversions,
            topPerformers,
        };
    } catch (error) {
        console.error('Error fetching affiliate stats:', error);
        return {
            totalPrograms: 0,
            activePrograms: 0,
            totalRevenue: 0,
            totalConversions: 0,
            topPerformers: [],
        };
    }
}

/**
 * Get all unique categories from affiliates
 */
export async function getAffiliateCategories(): Promise<string[]> {
    try {
        const programs = await db
            .select({ category: affiliatePrograms.category })
            .from(affiliatePrograms);

        const uniqueCategories = [...new Set(programs.map(p => p.category))].filter(Boolean);
        return uniqueCategories.sort();
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

/**
 * Get affiliate recommendations for AI agent
 * Returns active affiliates sorted by category, then by commission value (highest first)
 * This ensures AI suggests highest-earning options first while mentioning alternatives
 */
export async function getAffiliateRecommendations(category?: string): Promise<AffiliateProgram[]> {
    try {
        const conditions = [eq(affiliatePrograms.status, 'active')];

        if (category) {
            conditions.push(eq(affiliatePrograms.category, category));
        }

        const results = await db
            .select()
            .from(affiliatePrograms)
            .where(and(...conditions));

        // Sort by category, then by commission value (descending), then by tierRank, then by priority
        return results.sort((a, b) => {
            // First by category
            if (a.category !== b.category) {
                return a.category.localeCompare(b.category);
            }

            // Within category, sort by estimated commission value (highest first)
            const commissionDiff = (b.estimatedCommissionValue || 0) - (a.estimatedCommissionValue || 0);
            if (commissionDiff !== 0) return commissionDiff;

            // If same commission, sort by tier rank (1 = best)
            const tierDiff = (a.tierRank || 99) - (b.tierRank || 99);
            if (tierDiff !== 0) return tierDiff;

            // Finally by priority
            return (b.priority || 5) - (a.priority || 5);
        });
    } catch (error) {
        console.error('Error fetching affiliate recommendations:', error);
        return [];
    }
}
