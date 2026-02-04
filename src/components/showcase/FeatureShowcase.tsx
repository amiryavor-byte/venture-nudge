'use client';

import { useState } from 'react';

const features = {
    'Core Planning': [
        'AI-Powered Chat Interface',
        'Intent Discovery Flow',
        'Business Concept Generation',
        'Market Analysis Generation',
        'Financial Projections Engine',
        '12-Section Plan Editor',
        'Inline Editing System',
        'PDF Export',
    ],
    'Encyclopedia': [
        '99+ Business Model Templates',
        'Part-Time Opportunity Variants',
        'Industry Filtering',
        'Complexity Scoring',
        'Cost Range Filtering',
        'Skills Matching',
        'AI Model Recommendations',
    ],
    'Authentication': [
        'Email/Password Auth',
        'Google OAuth',
        'Apple Sign In',
        '3-Tier RBAC (Basic/Premium/Admin)',
        'Protected Routes',
        'Session Management',
    ],
    'Admin Tools': [
        'User Management CRUD',
        'Inline User Editing',
        'Role Management',
        'Password Reset System',
        'Business Model Management',
        'Affiliate Program Dashboard',
        'Pricing Configuration',
        'Theme Management',
        'System Settings',
    ],
    'Monetization': [
        'Dynamic Pricing Tiers',
        '89 Affiliate Programs (32 Categories)',
        'Insurance Programs (12)',
        'Banking & Financial Services (10)',
        'Business Phone Systems (8)',
        'Productivity & SaaS Tools (20+)',
        'Industry-Specific Solutions (10+)',
        'Referral Tracking & Analytics',
        'Commission Management Dashboard',
        'Category-Based Filtering',
        'Stripe Integration Ready',
        'Subscription Management',
        'Usage-Based Avatar Billing',
        'Admin Pricing Configuration',
    ],
    'AI Avatar Assistant': [
        '3D Talking Nudge Avatar',
        'Real-Time Voice Conversations',
        'Speech-to-Text Integration',
        'Natural Text-to-Speech',
        'Lip-Sync Animation',
        'Avatar Customization Studio',
        'Voice Personality Selection',
        'Cost-Based Usage Tracking',
        'Admin Pricing Configuration',
        'Free Trial System (3 msgs/week)',
    ],
    'Advanced': [
        'Dynamic Theming System',
        '10+ Preset Themes',
        'Custom Theme Builder',
        'White-Label Ready',
        'Real-time Collaboration',
        'Auto-Save Versioning',
        'Advanced Analytics (Premium)',
    ],
};

export default function FeatureShowcase() {
    const [activeCategory, setActiveCategory] = useState('Core Planning');

    const totalFeatures = Object.values(features).reduce((sum, arr) => sum + arr.length, 0);

    return (
        <div className="space-y-8">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 justify-center">
                {Object.keys(features).map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === category
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Feature Grid */}
            <div className="bg-slate-900/50 rounded-2xl p-8 border border-white/5">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-semibold">{activeCategory}</h3>
                    <span className="text-sm text-slate-400">
                        {features[activeCategory as keyof typeof features].length} features
                    </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {features[activeCategory as keyof typeof features].map((feature, index) => (
                        <div
                            key={index}
                            className="p-4 bg-slate-800/50 rounded-lg border border-white/5 hover:border-indigo-500/30 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-2xl">✅</div>
                                <div className="text-sm text-slate-200">{feature}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Total Count */}
            <div className="text-center">
                <div className="text-4xl font-bold text-indigo-400 mb-2">{totalFeatures}+</div>
                <div className="text-slate-400">Total Features Implemented</div>
            </div>
        </div>
    );
}
