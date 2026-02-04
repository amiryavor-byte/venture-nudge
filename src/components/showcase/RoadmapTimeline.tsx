'use client';

const roadmap = [
    {
        quarter: 'Q1 2026',
        features: [
            { name: 'AI Credit System', status: 'planned', description: '300% markup on AI usage' },
            { name: 'Stripe Integration', status: 'planned', description: 'Payment processing for credits' },
            { name: 'Usage Dashboard', status: 'planned', description: 'Track AI credit consumption' },
        ],
    },
    {
        quarter: 'Q2 2026',
        features: [
            { name: 'Top 5 Referrals', status: 'planned', description: 'Bizee, Mercury, Namecheap, LegalZoom, Hiscox' },
            { name: 'Webhook Tracking', status: 'planned', description: 'Automated conversion tracking' },
            { name: 'Referral Analytics', status: 'planned', description: 'Admin dashboard for performance' },
        ],
    },
    {
        quarter: 'Q3 2026',
        features: [
            { name: 'White-Label System', status: 'idea', description: 'Self-serve consultant portal' },
            { name: 'Custom Domains', status: 'idea', description: 'Deploy branded instances' },
            { name: '10+ New Partners', status: 'idea', description: 'Insurance, cards, accounting' },
        ],
    },
    {
        quarter: 'Q4 2026',
        features: [
            { name: 'Financial Enhancements', status: 'idea', description: 'Scenario planning, cap tables' },
            { name: 'Marketplace Beta', status: 'idea', description: 'Templates + consultant directory' },
            { name: 'Mobile MVP', status: 'idea', description: 'React Native app planning' },
        ],
    },
    {
        quarter: 'Q1 2027',
        features: [
            { name: 'iOS/Android Launch', status: 'idea', description: 'Full mobile experience' },
            { name: 'Voice Input', status: 'idea', description: 'AI chat via voice' },
            { name: 'Push Notifications', status: 'idea', description: 'Milestone reminders' },
        ],
    },
    {
        quarter: 'Q2 2027',
        features: [
            { name: 'B2B Partnerships', status: 'idea', description: 'Embed in banking/accounting apps' },
            { name: 'AI Pitch Decks', status: 'idea', description: 'Auto-generate investor presentations' },
            { name: 'Team Collaboration', status: 'idea', description: 'Multi-user real-time editing' },
        ],
    },
];

export default function RoadmapTimeline() {
    return (
        <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-indigo-600 via-purple-600 to-transparent" />

            <div className="space-y-12">
                {roadmap.map((quarter, quarterIndex) => (
                    <div key={quarter.quarter} className="relative">
                        {/* Quarter Marker */}
                        <div className="flex items-center justify-center mb-6">
                            <div className="bg-indigo-600 px-6 py-2 rounded-full text-sm font-semibold z-10">
                                {quarter.quarter}
                            </div>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {quarter.features.map((feature, featureIndex) => (
                                <div
                                    key={featureIndex}
                                    className="bg-slate-900/50 rounded-xl p-6 border border-white/5 hover:border-indigo-500/30 transition-colors"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <h4 className="font-semibold text-lg">{feature.name}</h4>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${feature.status === 'planned'
                                                ? 'bg-indigo-900/50 text-indigo-300'
                                                : 'bg-slate-800 text-slate-400'
                                            }`}>
                                            {feature.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-400">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
