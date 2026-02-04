import { Popover } from '@/components/ui/popover';

export function FutureFeatures() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mobile App */}
            <Popover content={
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-2xl font-bold text-purple-300">iOS/Android App</h4>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-900/50 text-purple-300">
                            Q1 2027
                        </span>
                    </div>

                    <img
                        src="/showcase/mobile_app.png"
                        alt="Mobile App Mockup"
                        className="w-full rounded-lg border border-purple-500/30"
                    />

                    <div className="space-y-2">
                        <h5 className="font-semibold text-white">Features:</h5>
                        <ul className="space-y-2 text-slate-300 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400">•</span>
                                <span>Full business plan editor with inline editing</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400">•</span>
                                <span>Voice-to-text AI conversations for hands-free planning</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400">•</span>
                                <span>Push notifications for market trends and opportunities</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400">•</span>
                                <span>Offline mode for viewing and editing plans</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400">•</span>
                                <span>Mobile-optimized financial modeling with touch gestures</span>
                            </li>
                        </ul>
                    </div>

                    <div className="p-3 bg-purple-900/20 rounded-lg border border-purple-500/20">
                        <p className="text-sm text-slate-300">
                            <strong className="text-purple-300">Tech Stack:</strong> React Native with TEN Framework for multimodal AI interactions
                        </p>
                    </div>
                </div>
            }>
                <div className="group relative overflow-hidden rounded-xl border border-white/5 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer">
                    <img
                        src="/showcase/mobile_app.png"
                        alt="Mobile App Mockup"
                        className="w-full h-auto transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 to-transparent p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 rounded text-xs font-medium bg-purple-900/50 text-purple-300">
                                Q1 2027
                            </span>
                        </div>
                        <h3 className="font-semibold text-white">iOS/Android App</h3>
                        <p className="text-xs text-slate-400">Full mobile experience with voice AI</p>
                        <p className="text-xs text-purple-400 mt-2 font-medium">✨ Click to learn more</p>
                    </div>
                </div>
            </Popover>

            {/* 3D Multimodal Guide */}
            <Popover content={
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-2xl font-bold text-cyan-300">3D Multimodal Guide</h4>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-900/50 text-cyan-300">
                            Q3 2026
                        </span>
                    </div>

                    <img
                        src="/showcase/3d_guide.png"
                        alt="3D AI Guide"
                        className="w-full rounded-lg border border-cyan-500/30"
                    />

                    <div className="space-y-2">
                        <h5 className="font-semibold text-white">Capabilities:</h5>
                        <ul className="space-y-2 text-slate-300 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400">•</span>
                                <span>Realistic 3D avatar with natural voice synthesis</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400">•</span>
                                <span>Voice-to-voice conversations with low latency (~500ms)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400">•</span>
                                <span>Screen sharing and visual plan walkthroughs</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400">•</span>
                                <span>Emotional intelligence for motivation and encouragement</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400">•</span>
                                <span>Multi-language support with cultural awareness</span>
                            </li>
                        </ul>
                    </div>

                    <div className="p-3 bg-cyan-900/20 rounded-lg border border-cyan-500/20">
                        <p className="text-sm text-slate-300">
                            <strong className="text-cyan-300">Implementation:</strong> Agora TEN Framework for real-time multimodal AI with WebRTC
                        </p>
                    </div>
                </div>
            }>
                <div className="group relative overflow-hidden rounded-xl border border-white/5 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer">
                    <img
                        src="/showcase/3d_guide.png"
                        alt="3D AI Guide"
                        className="w-full h-auto transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 to-transparent p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 rounded text-xs font-medium bg-cyan-900/50 text-cyan-300">
                                Q3 2026
                            </span>
                        </div>
                        <h3 className="font-semibold text-white">3D Multimodal Guide</h3>
                        <p className="text-xs text-slate-400">Interactive AI advisor with voice</p>
                        <p className="text-xs text-cyan-400 mt-2 font-medium">✨ Click to learn more</p>
                    </div>
                </div>
            </Popover>

            {/* Investor Marketplace */}
            <Popover content={
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-2xl font-bold text-amber-300">Investor Marketplace</h4>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-900/50 text-amber-300">
                            Q4 2026
                        </span>
                    </div>

                    <img
                        src="/showcase/investor_marketplace.png"
                        alt="Investor Marketplace"
                        className="w-full rounded-lg border border-amber-500/30"
                    />

                    <div className="space-y-2">
                        <h5 className="font-semibold text-white">Platform Features:</h5>
                        <ul className="space-y-2 text-slate-300 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-amber-400">•</span>
                                <span>Pitch deck generation from business plans</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-400">•</span>
                                <span>Investor matching based on industry, stage, and amount</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-400">•</span>
                                <span>Due diligence document management</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-400">•</span>
                                <span>Virtual pitch rooms with recording and analytics</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-400">•</span>
                                <span>Deal flow tracking and investor CRM</span>
                            </li>
                        </ul>
                    </div>

                    <div className="p-3 bg-amber-900/20 rounded-lg border border-amber-500/20">
                        <p className="text-sm text-slate-300">
                            <strong className="text-amber-300">Monetization:</strong> 2% platform fee on successful funding rounds + premium listings
                        </p>
                    </div>
                </div>
            }>
                <div className="group relative overflow-hidden rounded-xl border border-white/5 hover:border-amber-500/50 transition-all hover:shadow-lg hover:shadow-amber-500/20 cursor-pointer">
                    <img
                        src="/showcase/investor_marketplace.png"
                        alt="Investor Marketplace"
                        className="w-full h-auto transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 to-transparent p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 rounded text-xs font-medium bg-amber-900/50 text-amber-300">
                                Q4 2026
                            </span>
                        </div>
                        <h3 className="font-semibold text-white">Investor Marketplace</h3>
                        <p className="text-xs text-slate-400">Connect businesses with funding</p>
                        <p className="text-xs text-amber-400 mt-2 font-medium">✨ Click to learn more</p>
                    </div>
                </div>
            </Popover>

            {/* White-Label Portal */}
            <Popover content={
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-2xl font-bold text-indigo-300">White-Label Portal</h4>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-900/50 text-indigo-300">
                            Q3 2026
                        </span>
                    </div>

                    <img
                        src="/showcase/white_label.png"
                        alt="White Label Portal"
                        className="w-full rounded-lg border border-indigo-500/30"
                    />

                    <div className="space-y-2">
                        <h5 className="font-semibold text-white">Customization Options:</h5>
                        <ul className="space-y-2 text-slate-300 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-400">•</span>
                                <span>Full branding: logo, colors, fonts, domain</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-400">•</span>
                                <span>Custom email templates and notifications</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-400">•</span>
                                <span>Partner management dashboard for consultants</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-400">•</span>
                                <span>Client usage analytics and reporting</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-400">•</span>
                                <span>Revenue sharing: partners keep 70% of subscription fees</span>
                            </li>
                        </ul>
                    </div>

                    <div className="p-3 bg-indigo-900/20 rounded-lg border border-indigo-500/20">
                        <p className="text-sm text-slate-300">
                            <strong className="text-indigo-300">Target Market:</strong> Business consultants, coaches, and incubators serving 10-100 clients
                        </p>
                    </div>
                </div>
            }>
                <div className="group relative overflow-hidden rounded-xl border border-white/5 hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/20 cursor-pointer">
                    <img
                        src="/showcase/white_label.png"
                        alt="White Label Portal"
                        className="w-full h-auto transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 to-transparent p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 rounded text-xs font-medium bg-indigo-900/50 text-indigo-300">
                                Q3 2026
                            </span>
                        </div>
                        <h3 className="font-semibold text-white">White-Label Portal</h3>
                        <p className="text-xs text-slate-400">Custom branding for consultants</p>
                        <p className="text-xs text-indigo-400 mt-2 font-medium">✨ Click to learn more</p>
                    </div>
                </div>
            </Popover>
        </div>
    );
}
