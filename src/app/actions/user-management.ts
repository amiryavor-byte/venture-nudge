'use server'

import { db } from '@/db';
import { userProfiles } from '@/db/schema';
import { eq, or, like } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

// Type for user data without sensitive fields
export type SafeUser = {
    id: string;
    userId: string | null;
    email: string | null;
    name: string | null;
    role: string | null;
    isActive: boolean | null;
    availableCapital: string | null;
    riskTolerance: string | null;
    preferredTimeCommitment: string | null;
    location: string | null;
    createdAt: Date | null;
};

// Remove password hash from user data before sending to client
function sanitizeUser(user: any): SafeUser {
    const { passwordHash, discoveryProfile, ...safeUser } = user;
    return safeUser;
}

export async function getUsersWithSearch(query?: string) {
    let users;

    if (query && query.trim().length > 0) {
        const searchQuery = `%${query}%`;
        users = await db
            .select()
            .from(userProfiles)
            .where(
                or(
                    like(userProfiles.name, searchQuery),
                    like(userProfiles.email, searchQuery),
                    like(userProfiles.location, searchQuery),
                    like(userProfiles.userId, searchQuery)
                )
            );
    } else {
        users = await db.select().from(userProfiles);
    }

    // Remove sensitive fields
    return users.map(sanitizeUser);
}

export async function updateUser(id: string, data: Partial<SafeUser>) {
    try {
        // Remove any fields that shouldn't be updated this way
        const { id: _, createdAt: __, ...updateData } = data;

        await db
            .update(userProfiles)
            .set(updateData)
            .where(eq(userProfiles.id, id));

        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        console.error('Error updating user:', error);
        return { success: false, error: String(error) };
    }
}

export async function deleteUser(id: string) {
    try {
        await db.delete(userProfiles).where(eq(userProfiles.id, id));
        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        console.error('Error deleting user:', error);
        return { success: false, error: String(error) };
    }
}

export async function resetUserPassword(id: string, newPassword: string) {
    try {
        // Hash the password with bcrypt (10 salt rounds)
        const passwordHash = await bcrypt.hash(newPassword, 10);

        await db
            .update(userProfiles)
            .set({ passwordHash })
            .where(eq(userProfiles.id, id));

        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        console.error('Error resetting password:', error);
        return { success: false, error: String(error) };
    }
}

export async function createUser(data: {
    email: string;
    password: string;
    name: string;
    role?: string;
    location?: string;
    availableCapital?: string;
    riskTolerance?: string;
}) {
    try {
        // Hash the password
        const passwordHash = await bcrypt.hash(data.password, 10);

        const newUser = {
            id: uuidv4(),
            email: data.email,
            passwordHash,
            name: data.name,
            role: data.role || 'user',
            isActive: true,
            location: data.location || null,
            availableCapital: data.availableCapital || null,
            riskTolerance: data.riskTolerance || null,
            createdAt: new Date(),
        };

        await db.insert(userProfiles).values(newUser);

        revalidatePath('/admin/users');
        return { success: true, userId: newUser.id };
    } catch (error) {
        console.error('Error creating user:', error);
        return { success: false, error: String(error) };
    }
}

// Generate a secure random password
export async function generateSecurePassword(length: number = 16): Promise<string> {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    const allChars = lowercase + uppercase + numbers + symbols;
    let password = '';

    // Ensure at least one of each type
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
}
