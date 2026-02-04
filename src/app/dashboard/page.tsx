'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getFeatureLimits, canCreateBusinessPlan } from '@/lib/rbac';

type User = {
    id: string;
    email: string;
    name: string;
    role: string;
};

type BusinessPlan = {
    id: string;
    name: string;
    status: string;
    updatedAt: string;
};

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [plans, setPlans] = useState<BusinessPlan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch user and plans
        Promise.all([
            fetch('/api/auth/session').then((res) => res.json()),
            // fetch('/api/plans').then((res) => res.json()),
        ]).then(([sessionData]) => {
            setUser(sessionData.user);
            // setPlans(plansData.plans || []);
            setLoading(false);
        });
    }, []);

    if (loading || !user) {
        return <div>Loading...</div>;
    }

    const limits = getFeatureLimits(user.role);
    const canCreate = canCreateBusinessPlan(user.role, plans.length);

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {user.name || 'there'}! 👋
                </h1>
                <p className="text-slate-400">
                    Here's what's happening with your business ventures.
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Business Plans"
                    value={plans.length}
                    subtitle={`${limits.maxBusinessPlans === Infinity ? 'Unlimited' : `of ${limits.maxBusinessPlans} max`}`}
                    icon="📝"
                    gradient="from-blue-500/20 to-cyan-500/20"
                />
                <StatCard
                    title="AI Credits"
                    value={limits.aiCreditsPerMonth === Infinity ? '∞' : limits.aiCreditsPerMonth.toLocaleString()}
                    subtitle="Available this month"
                    icon="✨"
                    gradient="from-purple-500/20 to-pink-500/20"
                />
                <StatCard
                    title="Collaborators"
                    value={0}
                    subtitle="Coming soon"
                    icon="👥"
                    gradient="from-amber-500/20 to-orange-500/20"
                />
            </div>

            {/* Upgrade Banner (for basic users) */}
            {user.role === 'user' && (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-amber-500/10 border border-purple-500/20">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">
                                Upgrade to Premium
                            </h3>
                            <p className="text-slate-300 mb-4">
                                Unlock unlimited business plans, AI credits, advanced analytics, and white-label options.
                            </p>
                            <div className="flex gap-4">
                                <Button className="bg-gradient-to-r from-purple-500 to-amber-500 hover:from-purple-600 hover:to-amber-600">
                                    Upgrade Now
                                </Button>
                                <Button variant="outline" className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10">
                                    Learn More
                                </Button>
                            </div>
                        </div>
                        <div className="text-6xl">🚀</div>
                    </div>
                </div>
            )}

            {/* Recent Business Plans */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Recent Business Plans</h2>
                    <Link href="/dashboard/plans">
                        <Button variant="outline" size="sm">
                            View All
                        </Button>
                    </Link>
                </div>

                {plans.length === 0 ? (
                    <div className="p-12 bg-slate-900/50 border border-white/5 rounded-2xl text-center">
                        <div className="text-6xl mb-4">📋</div>
                        <h3 className="text-xl font-semibold mb-2">No business plans yet</h3>
                        <p className="text-slate-400 mb-6">
                            Create your first business plan to get started on your entrepreneurial journey.
                        </p>
                        {canCreate ? (
                            <Link href="/chat">
                                <Button className="bg-indigo-600 hover:bg-indigo-500">
                                    Create Your First Plan
                                </Button>
                            </Link>
                        ) : (
                            <div className="text-sm text-amber-400">
                                You've reached your plan limit. Upgrade to create more.
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {plans.map((plan) => (
                            <PlanCard key={plan.id} plan={plan} />
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <ActionCard
                        href="/chat"
                        icon="💬"
                        title="Chat with AI"
                        description="Get instant business advice"
                    />
                    <ActionCard
                        href="/admin/encyclopedia"
                        icon="📚"
                        title="Browse Models"
                        description="Explore business templates"
                    />
                    <ActionCard
                        href="/dashboard/analytics"
                        icon="📊"
                        title="View Analytics"
                        description={user.role === 'user' ? 'Premium feature' : 'Track your progress'}
                        disabled={user.role === 'user'}
                    />
                    <ActionCard
                        href="/dashboard/settings"
                        icon="⚙️"
                        title="Settings"
                        description="Manage your account"
                    />
                </div>
            </div>
        </div>
    );
}

function StatCard({
    title,
    value,
    subtitle,
    icon,
    gradient,
}: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: string;
    gradient: string;
}) {
    return (
        <div className={`p-6 rounded-2xl bg-gradient-to-br ${gradient} border border-white/5`}>
            <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{icon}</div>
                <div className="text-3xl font-bold">{value}</div>
            </div>
            <div className="text-lg font-semibold text-slate-200">{title}</div>
            <div className="text-sm text-slate-400">{subtitle}</div>
        </div>
    );
}

function PlanCard({ plan }: { plan: BusinessPlan }) {
    return (
        <Link
            href={`/plan/${plan.id}`}
            className="p-6 bg-slate-900/50 border border-white/5 rounded-xl hover:border-indigo-500/30 transition-colors group"
        >
            <h3 className="text-lg font-semibold mb-2 group-hover:text-indigo-400 transition-colors">
                {plan.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-slate-400">
                <span className="px-2 py-1 bg-slate-800 rounded text-xs">{plan.status}</span>
                <span>•</span>
                <span>{new Date(plan.updatedAt).toLocaleDateString()}</span>
            </div>
        </Link>
    );
}

function ActionCard({
    href,
    icon,
    title,
    description,
    disabled = false,
}: {
    href: string;
    icon: string;
    title: string;
    description: string;
    disabled?: boolean;
}) {
    const content = (
        <div
            className={`p-6 bg-slate-900/50 border border-white/5 rounded-xl ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-indigo-500/30 cursor-pointer'
                } transition-colors group`}
        >
            <div className="text-3xl mb-3">{icon}</div>
            <h3 className="text-lg font-semibold mb-1 group-hover:text-indigo-400 transition-colors">
                {title}
            </h3>
            <p className="text-sm text-slate-400">{description}</p>
        </div>
    );

    if (disabled) {
        return content;
    }

    return <Link href={href}>{content}</Link>;
}
