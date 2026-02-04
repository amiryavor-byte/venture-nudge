'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getRoleDisplayName, getRoleBadgeVariant, getFeatureLimits } from '@/lib/rbac';
import { Badge } from '@/components/ui/badge';

type User = {
    id: string;
    email: string;
    name: string;
    role: string;
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch session
        fetch('/api/auth/session')
            .then((res) => res.json())
            .then((data) => {
                if (data.user) {
                    setUser(data.user);
                } else {
                    router.push('/login');
                }
                setLoading(false);
            })
            .catch(() => {
                router.push('/login');
                setLoading(false);
            });
    }, [router]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const limits = getFeatureLimits(user.role);

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Sidebar */}
            <aside className="fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-white/5 flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-white/5">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-lg">
                            V
                        </div>
                        <span className="font-semibold text-lg tracking-tight">
                            VentureNudge<span className="text-indigo-400">.ai</span>
                        </span>
                    </Link>
                </div>

                {/* User Info */}
                <div className="p-4 border-b border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-semibold">
                            {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{user.name || 'User'}</div>
                            <div className="text-xs text-slate-400 truncate">{user.email}</div>
                        </div>
                    </div>
                    <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                        {getRoleDisplayName(user.role)}
                    </Badge>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    <NavLink href="/dashboard" icon="📊">
                        Overview
                    </NavLink>
                    <NavLink href="/dashboard/plans" icon="📝">
                        My Plans
                    </NavLink>
                    <NavLink href="/dashboard/chat" icon="💬">
                        AI Assistant
                    </NavLink>
                    {(user.role === 'premium' || user.role === 'admin') && (
                        <NavLink href="/dashboard/analytics" icon="📈">
                            Analytics
                        </NavLink>
                    )}
                    <NavLink href="/dashboard/settings" icon="⚙️">
                        Settings
                    </NavLink>

                    {/* Admin Link */}
                    {user.role === 'admin' && (
                        <>
                            <div className="pt-4 mt-4 border-t border-white/5">
                                <NavLink href="/admin" icon="🔧">
                                    Admin Dashboard
                                </NavLink>
                            </div>
                        </>
                    )}
                </nav>

                {/* AI Credits Footer */}
                <div className="p-4 border-t border-white/5 space-y-3">
                    {user.role === 'user' && (
                        <>
                            <div className="text-xs text-slate-400">
                                <div className="flex justify-between mb-1">
                                    <span>AI Credits</span>
                                    <span>{limits.aiCreditsPerMonth.toLocaleString()} / month</span>
                                </div>
                                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 w-2/3" />
                                </div>
                            </div>
                            <div className="text-xs text-slate-400">
                                <div className="flex justify-between mb-1">
                                    <span>Business Plans</span>
                                    <span>0 / {limits.maxBusinessPlans}</span>
                                </div>
                            </div>
                        </>
                    )}

                    <button
                        onClick={handleLogout}
                        className="w-full px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-left"
                    >
                        🚪 Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 min-h-screen">
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}

function NavLink({
    href,
    icon,
    children,
}: {
    href: string;
    icon: string;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
            <span>{icon}</span>
            <span>{children}</span>
        </Link>
    );
}
