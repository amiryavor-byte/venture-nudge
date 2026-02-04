'use server'

import { db } from '@/db';
import { appSettings, userProfiles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

// --- USERS ---
export async function getUsers() {
    return await db.select().from(userProfiles);
}

// --- SETTINGS ---
export async function getSettings() {
    const settings = await db.select().from(appSettings);
    // Convert array to object for easier consumption
    return settings.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {} as Record<string, string | null>);
}

export async function updateSetting(key: string, value: string) {
    try {
        // Check if exists
        const existing = await db.select().from(appSettings).where(eq(appSettings.key, key)).get();

        if (existing) {
            await db.update(appSettings)
                .set({ value, updatedAt: new Date() })
                .where(eq(appSettings.key, key));
        } else {
            await db.insert(appSettings).values({
                id: uuidv4(),
                key,
                value,
                category: 'general'
            });
        }
        revalidatePath('/admin/settings');
        return { success: true };
    } catch (e) {
        return { error: String(e) };
    }
}
