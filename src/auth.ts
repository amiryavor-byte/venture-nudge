import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Apple from "next-auth/providers/apple"
import Credentials from "next-auth/providers/credentials"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/db"
import { userProfiles } from "@/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

// Get settings from database
async function getOAuthSettings() {
    const settings = await db.query.appSettings.findMany();
    return settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value || '';
        return acc;
    }, {} as Record<string, string>);
}

export const { handlers, auth, signIn, signOut } = NextAuth(async () => {
    const settings = await getOAuthSettings();

    return {
        adapter: DrizzleAdapter(db),
        providers: [
            // Email/Password Login
            Credentials({
                name: "credentials",
                credentials: {
                    email: { label: "Email", type: "email" },
                    password: { label: "Password", type: "password" },
                },
                async authorize(credentials) {
                    if (!credentials?.email || !credentials?.password) {
                        return null;
                    }

                    const users = await db
                        .select()
                        .from(userProfiles)
                        .where(eq(userProfiles.email, credentials.email.toString().toLowerCase()));

                    const user = users[0];

                    if (!user || !user.passwordHash) {
                        return null;
                    }

                    const passwordMatch = await bcrypt.compare(
                        credentials.password.toString(),
                        user.passwordHash
                    );

                    if (!passwordMatch) {
                        return null;
                    }

                    // Return user without password
                    const { passwordHash, ...userWithoutPassword } = user;
                    return userWithoutPassword;
                },
            }),

            // Google OAuth (enabled if credentials are configured)
            ...(settings.GOOGLE_CLIENT_ID && settings.GOOGLE_CLIENT_SECRET
                ? [
                    Google({
                        clientId: settings.GOOGLE_CLIENT_ID,
                        clientSecret: settings.GOOGLE_CLIENT_SECRET,
                    }),
                ]
                : []),

            // Apple Sign In (enabled if credentials are configured)
            ...(settings.APPLE_ID && settings.APPLE_SECRET
                ? [
                    Apple({
                        clientId: settings.APPLE_ID,
                        clientSecret: settings.APPLE_SECRET,
                    }),
                ]
                : []),
        ],
        session: {
            strategy: "jwt",
            maxAge: 7 * 24 * 60 * 60, // 7 days
        },
        pages: {
            signIn: "/login",
            error: "/login",
        },
        callbacks: {
            async jwt({ token, user, account }) {
                // Add role to token on sign in
                if (user) {
                    token.role = user.role;
                    token.id = user.id;
                }
                return token;
            },
            async session({ session, token }) {
                // Add role and id to session
                if (session.user) {
                    session.user.role = token.role as string;
                    session.user.id = token.id as string;
                }
                return session;
            },
            async signIn({ user, account, profile }) {
                // For OAuth providers, set default role if new user
                if (account?.provider !== "credentials" && user.id) {
                    const existingUsers = await db
                        .select()
                        .from(userProfiles)
                        .where(eq(userProfiles.id, user.id));

                    const existingUser = existingUsers[0];

                    if (!existingUser?.role) {
                        await db
                            .update(userProfiles)
                            .set({ role: 'user' })
                            .where(eq(userProfiles.id, user.id));
                    }
                }
                return true;
            },
        },
        secret: settings.NEXTAUTH_SECRET || process.env.JWT_SECRET,
    };
});
