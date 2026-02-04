'use client';

import { PricingModal } from '@/components/pricing/PricingModal';

interface PaywallSectionProps {
    sectionName: string;
    description: string;
    previewContent?: React.ReactNode;
    children?: React.ReactNode;
}

export function PaywallSection({
    sectionName,
    description,
    previewContent,
    children
}: PaywallSectionProps) {
    const [showPricing, setShowPricing] = useState(false);

    const handleUpgrade = (tier: string) => {
        // TODO: Implement actual payment flow
        console.log('Selected tier:', tier);
        alert(`Payment for ${tier} tier coming soon!`);
    };

    return (
        <>
            <div className="relative">
                {/* Preview content (if provided) */}
                {previewContent && (
                    <div className="mb-4 opacity-60 pointer-events-none">
                        {previewContent}
                    </div>
                )}

                {/* Paywall Overlay */}
                <div className="relative border-2 border-dashed border-indigo-500/30 rounded-xl p-8 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent backdrop-blur-sm">
                    {/* Lock Icon */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-zinc-900 border-2 border-indigo-500/30 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>

                    <div className="text-center max-w-md mx-auto">
                        <h3 className="text-xl font-bold mb-2 mt-4">{sectionName}</h3>
                        <p className="text-zinc-400 text-sm mb-6">{description}</p>

                        <div className="flex gap-3 justify-center flex-wrap">
                            <button
                                onClick={() => setShowPricing(true)}
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
                            >
                                View Pricing Plans
                            </button>
                            <button
                                onClick={() => setShowPricing(true)}
                                className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-medium transition-colors"
                            >
                                Download for $299
                            </button>
                        </div>

                        <p className="text-xs text-zinc-500 mt-4">
                            Unlock this section and all premium features
                        </p>
                    </div>

                    {/* Optional: Show what's behind the paywall */}
                    {children && (
                        <div className="mt-6 pt-6 border-t border-zinc-700/50">
                            <div className="blur-sm opacity-30 select-none pointer-events-none">
                                {children}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <PricingModal
                isOpen={showPricing}
                onClose={() => setShowPricing(false)}
                onSelectTier={handleUpgrade}
            />
        </>
    );
}

import { useState } from 'react';
