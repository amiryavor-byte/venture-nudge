'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getRoleDisplayName, getRoleBadgeVariant } from '@/lib/rbac';

type User = {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
};

export default function SettingsPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/auth/session')
            .then((res) => res.json())
            .then((data) => {
                setUser(data.user);
                setLoading(false);
            });
    }, []);

    if (loading || !user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

            <div className="space-y-6">
                {/* Profile Section */}
                <div className="p-6 bg-slate-900/50 border border-white/5 rounded-2xl">
                    <h2 className="text-xl font-semibold mb-6">Profile Information</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Display Name
                            </label>
                            <input
                                type="text"
                                value={user.name || ''}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                placeholder="Your name"
                                disabled
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={user.email}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                disabled
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Account Type
                            </label>
                            <div>
                                <Badge variant={getRoleBadgeVariant(user.role)}>
                                    {getRoleDisplayName(user.role)}
                                </Badge>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Member Since
                            </label>
                            <div className="text-slate-400">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Button disabled>Save Changes</Button>
                        <p className="text-xs text-slate-500 mt-2">
                            Profile editing coming soon
                        </p>
                    </div>
                </div>

                {/* Password Section */}
                <div className="p-6 bg-slate-900/50 border border-white/5 rounded-2xl">
                    <h2 className="text-xl font-semibold mb-6">Password</h2>

                    <Button variant="outline" disabled>
                        Change Password
                    </Button>
                    <p className="text-xs text-slate-500 mt-2">
                        Password management coming soon
                    </p>
                </div>

                {/* Billing Section (if not admin) */}
                {user.role !== 'admin' && (
                    <div className="p-6 bg-slate-900/50 border border-white/5 rounded-2xl">
                        <h2 className="text-xl font-semibold mb-6">Billing & Subscription</h2>

                        <div className="mb-6">
                            <div className="text-sm text-slate-400 mb-2">Current Plan</div>
                            <div className="text-lg font-semibold">
                                {user.role === 'premium' ? 'Premium Plan' : 'Basic Plan'}
                            </div>
                        </div>

                        {user.role === 'user' && (
                            <Button className="bg-gradient-to-r from-purple-500 to-amber-500">
                                Upgrade to Premium
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
