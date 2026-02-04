'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Login failed');
                setLoading(false);
                return;
            }

            // Redirect based on role
            if (data.user.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            setLoading(false);
        }
    };

    const quickLogin = (demoEmail: string) => {
        setEmail(demoEmail);
        setPassword('demo123!');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
            {/* Decorative Background */}
            <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]" />
            </div>

            <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8">
                {/* Left: Login Form */}
                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-8">
                    <div className="mb-8">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-lg">V</div>
                            <span className="font-semibold text-lg tracking-tight">
                                VentureNudge<span className="text-indigo-400">.ai</span>
                            </span>
                        </Link>
                        <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
                        <p className="text-slate-400">Sign in to your account to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-semibold transition-all shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_0_60px_-10px_rgba(99,102,241,0.6)]"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-400">
                        Don't have an account?{' '}
                        <Link href="/get-started" className="text-indigo-400 hover:text-indigo-300">
                            Get started
                        </Link>
                    </div>
                </div>

                {/* Right: Demo Credentials */}
                <div className="bg-slate-900/30 border border-indigo-500/20 rounded-2xl p-8">
                    <div className="mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium uppercase tracking-wider mb-4">
                            📋 Test Accounts
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Demo Credentials</h2>
                        <p className="text-slate-400 text-sm">
                            All demo accounts use password: <code className="px-2 py-1 bg-slate-800 rounded text-indigo-300 font-mono">demo123!</code>
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Premium Account */}
                        <div className="p-4 bg-gradient-to-br from-purple-500/10 to-amber-500/10 border border-purple-500/20 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-purple-300">Premium Features</h3>
                                <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-amber-500 text-white text-xs font-bold rounded">PREMIUM</span>
                            </div>
                            <button
                                onClick={() => quickLogin('premium@venturenudge.com')}
                                className="w-full text-left p-2 bg-slate-800/50 rounded hover:bg-slate-800 transition-colors group"
                            >
                                <div className="text-sm text-slate-300 group-hover:text-white">premium@venturenudge.com</div>
                                <div className="text-xs text-slate-500">Full platform access • Unlimited AI credits</div>
                            </button>
                        </div>

                        {/* Admin Account */}
                        <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-indigo-300">Admin Access</h3>
                                <span className="px-2 py-1 bg-indigo-500 text-white text-xs font-bold rounded">ADMIN</span>
                            </div>
                            <button
                                onClick={() => quickLogin('admin@venturenudge.com')}
                                className="w-full text-left p-2 bg-slate-800/50 rounded hover:bg-slate-800 transition-colors group"
                            >
                                <div className="text-sm text-slate-300 group-hover:text-white">admin@venturenudge.com</div>
                                <div className="text-xs text-slate-500">User management • System settings</div>
                            </button>
                        </div>

                        {/* Basic Users */}
                        <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-slate-300">Basic Users</h3>
                                <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs font-bold rounded">BASIC</span>
                            </div>
                            <div className="space-y-2">
                                <button
                                    onClick={() => quickLogin('demo-user-1@venturenudge.com')}
                                    className="w-full text-left p-2 bg-slate-800/50 rounded hover:bg-slate-800 transition-colors group"
                                >
                                    <div className="text-sm text-slate-300 group-hover:text-white">demo-user-1@venturenudge.com</div>
                                    <div className="text-xs text-slate-500">Sarah Johnson • Web Developer</div>
                                </button>
                                <button
                                    onClick={() => quickLogin('demo-user-2@venturenudge.com')}
                                    className="w-full text-left p-2 bg-slate-800/50 rounded hover:bg-slate-800 transition-colors group"
                                >
                                    <div className="text-sm text-slate-300 group-hover:text-white">demo-user-2@venturenudge.com</div>
                                    <div className="text-xs text-slate-500">Michael Chen • Consultant</div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
                        <p className="text-xs text-slate-400 leading-relaxed">
                            💡 <strong className="text-slate-300">Tip:</strong> Click any account above to auto-fill the login form, then click "Sign in" to access the dashboard.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
