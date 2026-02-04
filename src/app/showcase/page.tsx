'use client';

import { useState } from 'react';
import EarningsCalculator from '@/components/showcase/EarningsCalculator';
import FeatureShowcase from '@/components/showcase/FeatureShowcase';
import RoadmapTimeline from '@/components/showcase/RoadmapTimeline';
import { ValuePropositionCards } from '@/components/showcase/ValuePropositionCards';
import { FutureFeatures } from '@/components/showcase/FutureFeatures';
import { Button } from '@/components/ui/button';
import { Popover } from '@/components/ui/popover';

export default function ShowcasePage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'Amir') {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Incorrect password');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-slate-900 rounded-2xl p-8 border border-white/5">
                    <h1 className="text-2xl font-bold mb-6 text-white text-center">
                        Venture Nudge Showcase
                    </h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">
                                Enter Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                                placeholder="Password"
                            />
                            {error && (
                                <p className="mt-2 text-sm text-red-400">{error}</p>
                            )}
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-500"
                        >
                            Enter
                        </Button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Hero Section */}
            <section className="relative py-20 px-6 overflow-hidden">
                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium uppercase tracking-wider mb-6">
                        <span>AI-Powered Business Planning Platform</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent pb-2 mb-6">
                        Venture Nudge
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-8">
                        Turn business ideas into actionable plans with AI guidance, financial modeling, and an ecosystem of growth tools.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-indigo-400">100+</div>
                            <div className="text-sm text-slate-400">Features</div>
                        </div>
                        <div className="hidden md:block w-px h-12 bg-slate-700" />
                        <div className="text-center">
                            <div className="text-4xl font-bold text-indigo-400">150+</div>
                            <div className="text-sm text-slate-400">Business Models</div>
                        </div>
                        <div className="hidden md:block w-px h-12 bg-slate-700" />
                        <div className="text-center">
                            <div className="text-4xl font-bold text-indigo-400">89</div>
                            <div className="text-sm text-slate-400">Affiliate Programs</div>
                        </div>
                    </div>
                </div>

                {/* Background Decorations */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]" />
            </section>

            {/* Value Proposition */}
            <section className="py-16 px-6 bg-slate-900/50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                        Why Venture Nudge?
                    </h2>
                    <ValuePropositionCards />
                </div>
            </section>

            {/* Earnings Calculator */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                        Revenue Potential
                    </h2>
                    <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
                        Adjust the inputs below to see how Venture Nudge scales. Default values based on conservative market analysis.
                    </p>
                    <EarningsCalculator />
                </div>
            </section>

            {/* Features */}
            <section className="py-16 px-6 bg-slate-900/50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                        What's Already Built
                    </h2>
                    <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
                        100+ features across 10 major categories, all functional and ready for users.
                    </p>
                    <FeatureShowcase />
                </div>
            </section>

            {/* Screenshot Gallery - Existing Features */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                        See It In Action
                    </h2>
                    <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
                        Real screenshots from the live application
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="group relative overflow-hidden rounded-xl border border-white/5 hover:border-indigo-500/50 transition-colors">
                            <img
                                src="/showcase/homepage.png"
                                alt="Venture Nudge Homepage"
                                className="w-full h-auto transform group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 to-transparent p-4">
                                <h3 className="font-semibold text-white">Homepage</h3>
                                <p className="text-xs text-slate-400">Dark theme landing page</p>
                            </div>
                        </div>
                        <div className="group relative overflow-hidden rounded-xl border border-white/5 hover:border-indigo-500/50 transition-colors">
                            <img
                                src="/showcase/plan_editor.png"
                                alt="Business Plan Editor"
                                className="w-full h-auto transform group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 to-transparent p-4">
                                <h3 className="font-semibold text-white">Plan Editor</h3>
                                <p className="text-xs text-slate-400">12-section inline editing</p>
                            </div>
                        </div>
                        <div className="group relative overflow-hidden rounded-xl border border-white/5 hover:border-indigo-500/50 transition-colors">
                            <img
                                src="/showcase/admin_dashboard.png"
                                alt="Admin Dashboard"
                                className="w-full h-auto transform group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 to-transparent p-4">
                                <h3 className="font-semibold text-white">Admin Dashboard</h3>
                                <p className="text-xs text-slate-400">Full admin control panel</p>
                            </div>
                        </div>
                        <div className="group relative overflow-hidden rounded-xl border border-white/5 hover:border-indigo-500/50 transition-colors">
                            <img
                                src="/showcase/user_management.png"
                                alt="User Management"
                                className="w-full h-auto transform group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 to-transparent p-4">
                                <h3 className="font-semibold text-white">User Management</h3>
                                <p className="text-xs text-slate-400">Inline editing CRUD table</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Avatar Assistant Showcase */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium uppercase tracking-wider mb-4">
                            <span>🎤 New Revenue Stream</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Nudge AI Avatar Voice Assistant
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto mb-8">
                            Interactive 3D superhero avatar that helps users plan their business through natural voice conversations. Premium feature with usage-based pricing.
                        </p>
                    </div>

                    {/* Avatar Screenshots Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <div className="group relative overflow-hidden rounded-xl border border-white/5 hover:border-indigo-500/50 transition-colors">
                            <img
                                src="/showcase/nudge_avatar_main.png"
                                alt="Nudge Avatar Main Interface"
                                className="w-full h-auto transform group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 to-transparent p-4">
                                <h3 className="font-semibold text-white">Desktop Voice Interface</h3>
                                <p className="text-xs text-slate-400">Zoom-style layout with real-time transcription</p>
                            </div>
                        </div>
                        <div className="group relative overflow-hidden rounded-xl border border-white/5 hover:border-indigo-500/50 transition-colors">
                            <img
                                src="/showcase/nudge_avatar_closeup.png"
                                alt="Nudge Character Design"
                                className="w-full h-auto transform group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 to-transparent p-4">
                                <h3 className="font-semibold text-white">Nudge Superhero Avatar</h3>
                                <p className="text-xs text-slate-400">Friendly, professional AI business guide</p>
                            </div>
                        </div>
                        <div className="group relative overflow-hidden rounded-xl border border-white/5 hover:border-indigo-500/50 transition-colors">
                            <img
                                src="/showcase/nudge_avatar_mobile.png"
                                alt="Mobile Voice Interface"
                                className="w-full h-auto transform group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 to-transparent p-4">
                                <h3 className="font-semibold text-white">Mobile Experience</h3>
                                <p className="text-xs text-slate-400">Voice-first interface with mic controls</p>
                            </div>
                        </div>
                        <div className="group relative overflow-hidden rounded-xl border border-white/5 hover:border-indigo-500/50 transition-colors">
                            <img
                                src="/showcase/nudge_customization_studio.png"
                                alt="Avatar Customization Studio"
                                className="w-full h-auto transform group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 to-transparent p-4">
                                <h3 className="font-semibold text-white">Customization Studio</h3>
                                <p className="text-xs text-slate-400">AI-powered avatar personalization</p>
                            </div>
                        </div>
                    </div>

                    {/* Feature Highlights */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-900/50 rounded-xl p-6 border border-white/5">
                            <div className="text-3xl mb-3">🎯</div>
                            <h3 className="font-semibold text-white mb-2">Usage-Based Revenue</h3>
                            <p className="text-sm text-slate-400">
                                Cost-plus pricing model with admin-configurable markup. ~$0.02-0.05 per message at cost, charged at 130-150% markup depending on tier.
                            </p>
                        </div>
                        <div className="bg-slate-900/50 rounded-xl p-6 border border-white/5">
                            <div className="text-3xl mb-3">🎁</div>
                            <h3 className="font-semibold text-white mb-2">Free Trial Hook</h3>
                            <p className="text-sm text-slate-400">
                                Free users get 3 trial messages per week plus demo video. Drives conversions while controlling costs.
                            </p>
                        </div>
                        <div className="bg-slate-900/50 rounded-xl p-6 border border-white/5">
                            <div className="text-3xl mb-3">🎨</div>
                            <h3 className="font-semibold text-white mb-2">Customization Studio</h3>
                            <p className="text-sm text-slate-400">
                                Premium users can personalize Nudge's appearance and voice through an AI chatbot interface. Adds stickiness.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Future Features Gallery */}
            <section className="py-16 px-6 bg-slate-900/50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                        Coming Soon
                    </h2>
                    <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
                        Click any card to see detailed plans and mockups
                    </p>
                    <FutureFeatures />
                </div>
            </section>

            {/* Roadmap */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                        What's Coming Next
                    </h2>
                    <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
                        Strategic roadmap through Q4 2027, prioritizing revenue-generating features first.
                    </p>
                    <RoadmapTimeline />
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border-t border-white/5">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Build Together?
                    </h2>
                    <p className="text-xl text-slate-300 mb-8">
                        This is more than a business plan tool—it's an ecosystem that helps entrepreneurs succeed from idea to launch and beyond.
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <Button className="bg-indigo-600 hover:bg-indigo-500 px-8 py-6 text-lg">
                            Let's Talk About It
                        </Button>
                        <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-6 text-lg">
                            See the Live Demo
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
