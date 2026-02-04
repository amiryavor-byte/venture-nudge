import { Popover } from '@/components/ui/popover';

export function ValuePropositionCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* AI-First Approach */}
            <Popover content={
                <div className="space-y-4">
                    <h4 className="text-2xl font-bold text-indigo-300">AI-First Approach</h4>

                    <img
                        src="/showcase/ai_chat.png"
                        alt="AI Chat Interface"
                        className="w-full rounded-lg border border-indigo-500/30"
                    />

                    <ul className="space-y-3 text-slate-300">
                        <li className="flex items-start gap-2">
                            <span className="text-indigo-400 font-bold">→</span>
                            <div>
                                <strong>3-Stage Intent Discovery:</strong> AI identifies business potential through conversational interviews
                            </div>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-indigo-400 font-bold">→</span>
                            <div>
                                <strong>SERP-Driven Market Analysis:</strong> Real-time competitive research via Google Search API
                            </div>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-indigo-400 font-bold">→</span>
                            <div>
                                <strong>12-Section Plan Generation:</strong> Mission, market, competition, pricing, operations, and more
                            </div>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-indigo-400 font-bold">→</span>
                            <div>
                                <strong>Continuous Refinement:</strong> Choose from GPT-4 or Claude Opus for ongoing plan improvements
                            </div>
                        </li>
                    </ul>

                    <div className="mt-4 p-4 bg-indigo-900/20 rounded-lg border border-indigo-500/20">
                        <p className="text-sm text-slate-300">
                            <strong className="text-indigo-300">Real-World Impact:</strong> AI guidance reduces plan creation time from weeks to hours while maintaining professional quality.
                        </p>
                    </div>
                </div>
            }>
                <div className="p-6 bg-slate-800/50 rounded-xl border border-white/5 hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/20 h-full">
                    <div className="text-4xl mb-4">🤖</div>
                    <h3 className="text-xl font-semibold mb-3">AI-First Approach</h3>
                    <p className="text-slate-400 mb-2">
                        Every feature powered by GPT-4/Claude. From discovery to financial modeling, AI guides every step.
                    </p>
                    <p className="text-xs text-indigo-400 mt-4 font-medium">✨ Click to see details</p>
                </div>
            </Popover>

            {/* Multi-Stream Revenue */}
            <Popover content={
                <div className="space-y-4">
                    <h4 className="text-2xl font-bold text-green-300">Multi-Stream Revenue Model</h4>

                    <img
                        src="/showcase/revenue_dashboard.png"
                        alt="Revenue Dashboard"
                        className="w-full rounded-lg border border-green-500/30"
                    />

                    <div className="space-y-3">
                        <div className="p-3 bg-slate-700/50 rounded-lg border border-green-500/20">
                            <p className="font-semibold text-white mb-1">💳 Subscriptions ($4.99/mo)</p>
                            <p className="text-sm text-slate-300">Core access to planning tools, encyclopedia, and basic features</p>
                        </div>
                        <div className="p-3 bg-slate-700/50 rounded-lg border border-blue-500/20">
                            <p className="font-semibold text-white mb-1">🤖 AI Credits (300% markup)</p>
                            <p className="text-sm text-slate-300">Average $15/user/month for plan generation, market analysis, and chat</p>
                        </div>
                        <div className="p-3 bg-slate-700/50 rounded-lg border border-orange-500/20">
                            <p className="font-semibold text-white mb-1">🏦 Affiliate Referrals (10% conversion)</p>
                            <p className="text-sm text-slate-300">150+ partner programs: banking, legal, insurance, software. Avg $400/referral</p>
                        </div>
                        <div className="p-3 bg-slate-700/50 rounded-lg border border-purple-500/20">
                            <p className="font-semibold text-white mb-1">🏷️ White-Label Licensing ($2K/mo)</p>
                            <p className="text-sm text-slate-300">Consultants rebrand the platform for their clients with custom domains</p>
                        </div>
                    </div>

                    <div className="mt-4 p-4 bg-green-900/20 rounded-lg border border-green-500/20">
                        <p className="text-sm text-slate-300">
                            <strong className="text-green-300">85% Profit Margins:</strong> Minimal hosting costs, automated operations, zero inventory
                        </p>
                    </div>
                </div>
            }>
                <div className="p-6 bg-slate-800/50 rounded-xl border border-white/5 hover:border-green-500/50 transition-all hover:shadow-lg hover:shadow-green-500/20 h-full">
                    <div className="text-4xl mb-4">💰</div>
                    <h3 className="text-xl font-semibold mb-3">Multi-Stream Revenue</h3>
                    <p className="text-slate-400 mb-2">
                        Subscriptions + AI credits + affiliate referrals + white-label licensing = 85% profit margins.
                    </p>
                    <p className="text-xs text-green-400 mt-4 font-medium">✨ Click to see details</p>
                </div>
            </Popover>

            {/* Network Effects */}
            <Popover content={
                <div className="space-y-4">
                    <h4 className="text-2xl font-bold text-purple-300">Network Effects</h4>

                    <img
                        src="/showcase/network_effects.png"
                        alt="Network Effects Diagram"
                        className="w-full rounded-lg border border-purple-500/30"
                    />

                    <p className="text-slate-300">Each new component strengthens the ecosystem:</p>

                    <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                            <div className="text-2xl">👥</div>
                            <div>
                                <p className="font-semibold text-white">More Users</p>
                                <p className="text-sm text-slate-400">→ More data for AI training → Better recommendations</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                            <div className="text-2xl">🔗</div>
                            <div>
                                <p className="font-semibold text-white">More Referrals</p>
                                <p className="text-sm text-slate-400">→ Higher partner commissions → Exclusive deals for users</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                            <div className="text-2xl">🏷️</div>
                            <div>
                                <p className="font-semibold text-white">More White-Label Partners</p>
                                <p className="text-sm text-slate-400">→ More user acquisition channels → Platform credibility</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                            <div className="text-2xl">💡</div>
                            <div>
                                <p className="font-semibold text-white">Better AI</p>
                                <p className="text-sm text-slate-400">→ More successful businesses → Positive testimonials → Viral growth</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
                        <p className="text-sm text-slate-300">
                            <strong className="text-purple-300">Compounding Value:</strong> Unlike traditional SaaS, each revenue stream reinforces the others.
                        </p>
                    </div>
                </div>
            }>
                <div className="p-6 bg-slate-800/50 rounded-xl border border-white/5 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/20 h-full">
                    <div className="text-4xl mb-4">🚀</div>
                    <h3 className="text-xl font-semibold mb-3">Network Effects</h3>
                    <p className="text-slate-400 mb-2">
                        More users → better AI → more referrals → more white-label partners → more leverage.
                    </p>
                    <p className="text-xs text-purple-400 mt-4 font-medium">✨ Click to see details</p>
                </div>
            </Popover>
        </div>
    );
}
