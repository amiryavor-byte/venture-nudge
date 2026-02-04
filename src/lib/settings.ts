import { db } from '@/db';
import { appSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Get a setting value by key
 */
export async function getSettingValue(key: string): Promise<string | null> {
    try {
        const result = await db
            .select()
            .from(appSettings)
            .where(eq(appSettings.key, key))
            .limit(1);

        return result[0]?.value || null;
    } catch (error) {
        console.error(`Error fetching setting ${key}:`, error);
        return null;
    }
}

/**
 * Update a setting value
 */
export async function updateSetting(key: string, value: string): Promise<void> {
    try {
        const existing = await db
            .select()
            .from(appSettings)
            .where(eq(appSettings.key, key))
            .limit(1);

        if (existing.length > 0) {
            await db
                .update(appSettings)
                .set({ value, updatedAt: new Date() })
                .where(eq(appSettings.key, key));
        } else {
            await db.insert(appSettings).values({ key, value });
        }
    } catch (error) {
        console.error(`Error updating setting ${key}:`, error);
        throw error;
    }
}

/**
 * Get all settings as a key-value map
 */
export async function getAllSettings(): Promise<Record<string, string>> {
    try {
        const settings = await db.select().from(appSettings);
        return settings.reduce((acc, setting) => {
            acc[setting.key] = setting.value;
            return acc;
        }, {} as Record<string, string>);
    } catch (error) {
        console.error('Error fetching all settings:', error);
        return {};
    }
}
