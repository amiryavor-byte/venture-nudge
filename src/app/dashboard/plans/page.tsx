'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type BusinessPlan = {
    id: string;
    name: string;
    status: string;
    problem?: string;
    updatedAt: string;
};

export default function PlansPage() {
    const [plans, setPlans] = useState<BusinessPlan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Fetch user's business plans
        // fetch('/api/plans').then(res => res.json()).then(data => setPlans(data.plans));
        setLoading(false);
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">My Business Plans</h1>
                    <p className="text-slate-400">
                        Manage all your business ventures in one place
                    </p>
                </div>
                <Link href="/chat">
                    <Button className="bg-indigo-600 how:bg-indigo-500">
                        + Create New Plan
                    </Button>
                </Link>
            </div>

            {plans.length === 0 ? (
                <div className="p-16 bg-slate-900/50 border border-white/5 rounded-2xl text-center">
                    <div className="text-7xl mb-4">📋</div>
                    <h2 className="text-2xl font-bold mb-2">No business plans yet</h2>
                    <p className="text-slate-400 mb-6 max-w-md mx-auto">
                        Start your entrepreneurial journey by creating your first business plan with our AI assistant.
                    </p>
                    <Link href="/chat">
                        <Button className="bg-indigo-600 hover:bg-indigo-500">
                            Create Your First Plan
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className="p-6 bg-slate-900/50 border border-white/5 rounded-xl hover:border-indigo-500/30 transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-semibold">{plan.name}</h3>
                                        <Badge variant={plan.status === 'active' ? 'default' : 'secondary'}>
                                            {plan.status}
                                        </Badge>
                                    </div>
                                    {plan.problem && (
                                        <p className="text-slate-400 mb-3">{plan.problem}</p>
                                    )}
                                    <div className="text-sm text-slate-500">
                                        Last updated: {new Date(plan.updatedAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={`/plan/${plan.id}`}>
                                        <Button variant="outline" size="sm">
                                            View
                                        </Button>
                                    </Link>
                                    <Button variant="outline" size="sm">
                                        Edit
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
