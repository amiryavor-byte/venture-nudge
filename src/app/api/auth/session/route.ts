import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { db } from '@/db';
import { userProfiles } from '@/db/schema';
import { eq } from 'drizzle-orm';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('auth-token')?.value;

        if (!token) {
            return NextResponse.json({ user: null }, { status: 401 });
        }

        // Verify JWT token
        const { payload } = await jwtVerify(token, JWT_SECRET);

        // Fetch fresh user data
        const users = await db
            .select()
            .from(userProfiles)
            .where(eq(userProfiles.id, payload.userId as string));

        const user = users[0];

        if (!user) {
            return NextResponse.json({ user: null }, { status: 401 });
        }

        // Return user without password
        const { passwordHash, ...userWithoutPassword } = user;

        return NextResponse.json({ user: userWithoutPassword });
    } catch (error) {
        console.error('Session error:', error);
        return NextResponse.json({ user: null }, { status: 401 });
    }
}
