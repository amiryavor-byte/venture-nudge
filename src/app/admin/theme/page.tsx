'use client';

// Force dynamic rendering - admin pages should not be statically generated
export const dynamic = 'force-dynamic';

import { Paintbrush } from 'lucide-react';
import { ThemeSelector } from '@/components/admin/ThemeSelector';

export default function AdminThemePage() {
    return (
        <div className="p-8 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold flex items-center gap-2 text-white mb-2">
                        <Paintbrush className="w-8 h-8 text-indigo-400" />
                        Theme & Styling
                    </h1>
                    <p className="text-slate-400">
                        Customize the visual appearance of your application with glassmorphism themes
                    </p>
                </div>

                {/* Theme Selector */}
                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-8 backdrop-blur-sm">
                    <ThemeSelector />
                </div>

                {/* Info Box */}
                <div className="mt-8 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-sm text-slate-300">
                    <p className="font-semibold text-indigo-300 mb-1">💡 About Glassmorphism Themes:</p>
                    <p>
                        Each theme features a unique color gradient with frosted glass effects, glowing particles, and modern aesthetics.
                        Changes apply site-wide across all pages including the dashboard, plan editor, and admin panel.
                    </p>
                </div>
            </div>
        </div>
    );
}
