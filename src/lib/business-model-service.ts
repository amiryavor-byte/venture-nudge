import { db } from '@/db';
import { businessModelTemplates } from '@/db/schema';
import { eq, like, or, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export type BusinessModelTemplate = typeof businessModelTemplates.$inferSelect;
export type NewBusinessModelTemplate = typeof businessModelTemplates.$inferInsert;

export class BusinessModelService {
    static async getAll() {
        return await db
            .select()
            .from(businessModelTemplates)
            .orderBy(desc(businessModelTemplates.createdAt));
    }

    static async getById(id: string) {
        const results = await db
            .select()
            .from(businessModelTemplates)
            .where(eq(businessModelTemplates.id, id));
        return results[0] || null;
    }

    static async create(data: Omit<NewBusinessModelTemplate, 'id' | 'createdAt' | 'updatedAt'>) {
        const id = uuidv4();
        const newModel: NewBusinessModelTemplate = {
            ...data,
            id,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        await db.insert(businessModelTemplates).values(newModel);
        return newModel;
    }

    static async update(id: string, data: Partial<Omit<NewBusinessModelTemplate, 'id' | 'createdAt'>>) {
        const updateData = {
            ...data,
            updatedAt: new Date(),
        };

        const results = await db
            .update(businessModelTemplates)
            .set(updateData)
            .where(eq(businessModelTemplates.id, id))
            .returning();

        return results[0];
    }

    static async delete(id: string) {
        await db.delete(businessModelTemplates).where(eq(businessModelTemplates.id, id));
        return true;
    }

    static async search(query: string) {
        const searchQuery = `%${query}%`;
        return await db
            .select()
            .from(businessModelTemplates)
            .where(
                or(
                    like(businessModelTemplates.name, searchQuery),
                    like(businessModelTemplates.description, searchQuery),
                    like(businessModelTemplates.industry, searchQuery)
                )
            )
            .orderBy(desc(businessModelTemplates.createdAt));
    }

    /**
     * Advanced context-based search for AI agent recommendations
     */
    static async searchByContext(context: {
        industry?: string;
        budgetRange?: string;
        skills?: string[];
        complexity?: number;
        tags?: string[];
    }) {
        let query = db.select().from(businessModelTemplates);

        // Build WHERE conditions
        const conditions = [];

        if (context.industry) {
            conditions.push(like(businessModelTemplates.industry, `%${context.industry}%`));
        }

        if (context.budgetRange) {
            conditions.push(eq(businessModelTemplates.startupCostRange, context.budgetRange));
        }

        // Note: Tags and skills require JSON querying which SQLite handles differently
        // For now, we'll fetch all and filter in-memory for complex JSON queries
        const results = conditions.length > 0
            ? await query.where(or(...conditions))
            : await query;

        // Post-process filtering for JSON fields
        let filtered = results;

        if (context.tags && context.tags.length > 0) {
            filtered = filtered.filter(model => {
                const modelTags = model.tags as string[] | null;
                if (!modelTags) return false;
                return context.tags!.some(tag => modelTags.includes(tag));
            });
        }

        if (context.skills && context.skills.length > 0) {
            filtered = filtered.filter(model => {
                const requiredSkills = model.skillsRequired as string[] | null;
                if (!requiredSkills) return true; // No skills required = matches any
                return context.skills!.some(skill => requiredSkills.includes(skill));
            });
        }

        if (context.complexity !== undefined) {
            filtered = filtered.filter(model =>
                model.complexity !== null && model.complexity <= context.complexity!
            );
        }

        return filtered;
    }

    /**
     * Get models by specific tags
     */
    static async getByTags(tags: string[]): Promise<BusinessModelTemplate[]> {
        const all = await this.getAll();
        return all.filter(model => {
            const modelTags = model.tags as string[] | null;
            if (!modelTags) return false;
            return tags.some(tag => modelTags.includes(tag));
        });
    }

    /**
     * Get models by industry
     */
    static async getByIndustry(industry: string) {
        return await db
            .select()
            .from(businessModelTemplates)
            .where(like(businessModelTemplates.industry, `%${industry}%`))
            .orderBy(desc(businessModelTemplates.createdAt));
    }

    /**
     * Bulk create multiple models (for seeding)
     */
    static async bulkCreate(models: Omit<NewBusinessModelTemplate, 'id' | 'createdAt' | 'updatedAt'>[]) {
        const now = new Date();
        const modelsWithIds = models.map(model => ({
            ...model,
            id: uuidv4(),
            createdAt: now,
            updatedAt: now,
        }));

        await db.insert(businessModelTemplates).values(modelsWithIds);
        return modelsWithIds;
    }

    /**
     * Export all models to JSON
     */
    static async exportAllToJSON() {
        const models = await this.getAll();
        return JSON.stringify(models, null, 2);
    }

    /**
     * Import models from JSON
     */
    static async importFromJSON(jsonData: string) {
        const models = JSON.parse(jsonData);

        if (!Array.isArray(models)) {
            throw new Error('Invalid JSON: expected array of models');
        }

        // Remove id, createdAt, updatedAt from imported data
        const cleanedModels = models.map(({ id, createdAt, updatedAt, ...model }) => model);

        return await this.bulkCreate(cleanedModels);
    }

    /**
     * Get model count
     */
    static async getCount() {
        const models = await this.getAll();
        return models.length;
    }
}
