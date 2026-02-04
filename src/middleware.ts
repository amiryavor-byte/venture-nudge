import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

// Paths that require authentication
const protectedPaths = [
    '/dashboard',
    '/admin',
    '/plans',
    '/chat',       // AI chat requires authentication
    '/discovery',  // Onboarding flow requires authentication
    '/plan',       // Business plan editing requires authentication
];

// Paths that admins can access
const adminPaths = ['/admin'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if path requires authentication
    const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

    if (!isProtected) {
        return NextResponse.next();
    }

    // Get auth token from cookie
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
        // Redirect to login if no token
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
    }

    try {
        // Verify token
        const { payload } = await jwtVerify(token, JWT_SECRET);

        // Check admin-only routes
        const isAdminPath = adminPaths.some((path) => pathname.startsWith(path));

        if (isAdminPath && payload.role !== 'admin') {
            // Redirect non-admins away from admin routes
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        // Allow request to proceed
        return NextResponse.next();
    } catch (error) {
        // Invalid token - redirect to login
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
    }
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/admin/:path*',
        '/plans/:path*',
        '/chat/:path*',
        '/discovery/:path*',
        '/plan/:path*',
    ],
};
