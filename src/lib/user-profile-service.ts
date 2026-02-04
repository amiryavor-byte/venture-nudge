import { db } from '@/db';
import { userProfiles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { UserDiscoveryProfile } from '@/types/discovery';

export class UserProfileService {
    /**
     * Save or update user discovery profile data
     */
    static async saveDiscoveryProfile(
        userId: string,
        profileData: Partial<UserDiscoveryProfile>
    ): Promise<UserDiscoveryProfile> {
        // Get existing profile
        const existing = await this.getDiscoveryProfile(userId);

        // Deep merge the data
        const updated: UserDiscoveryProfile = {
            background: {
                ...existing?.background,
                ...profileData.background,
            },
            motivation: {
                ...existing?.motivation,
                ...profileData.motivation,
            },
            assessments: {
                ...existing?.assessments,
                ...profileData.assessments,
            },
            stage: profileData.stage || existing?.stage || 'background',
            completedAt: profileData.completedAt || existing?.completedAt,
            lastUpdated: new Date(),
        };

        // Find existing user profile record
        const userProfile = await db.query.userProfiles.findFirst({
            where: eq(userProfiles.userId, userId),
        });

        if (userProfile) {
            // Update existing
            await db.update(userProfiles)
                .set({ discoveryProfile: updated as any })
                .where(eq(userProfiles.id, userProfile.id));
        } else {
            // Create new profile
            await db.insert(userProfiles).values({
                id: crypto.randomUUID(),
                userId,
                discoveryProfile: updated as any,
            });
        }

        return updated;
    }

    /**
     * Get user discovery profile
     */
    static async getDiscoveryProfile(userId: string): Promise<UserDiscoveryProfile | null> {
        const profile = await db.query.userProfiles.findFirst({
            where: eq(userProfiles.userId, userId),
        });

        return (profile?.discoveryProfile as UserDiscoveryProfile) || null;
    }

    /**
     * Get current discovery stage for a user
     */
    static async getCurrentStage(userId: string): Promise<string> {
        const profile = await this.getDiscoveryProfile(userId);
        return profile?.stage || 'background';
    }
}
