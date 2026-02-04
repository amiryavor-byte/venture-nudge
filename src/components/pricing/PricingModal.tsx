'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface PricingTier {
    id: string;
    tier: string;
    displayPrice: string;
    billingPeriod?: string | null;
    features: string[];
    priceInCents: number;
}

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectTier: (tier: string) => void;
}

export function PricingModal({ isOpen, onClose, onSelectTier }: PricingModalProps) {
    const [pricing, setPricing] = useState<PricingTier[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetchPricing();
        }
    }, [isOpen]);

    const fetchPricing = async () => {
        try {
            const response = await fetch('/api/pricing');
            const data = await response.json();
            setPricing(data.tiers || []);
        } catch (error) {
            console.error('Failed to fetch pricing:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTier = (tier: string) => {
        onSelectTier(tier);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative bg-zinc-900 rounded-xl shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Unlock Your Full Business Plan</h2>
                        <p className="text-zinc-400 mt-1">Choose the plan that works best for you</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Pricing Cards */}
                <div className="p-6">
                    {loading ? (
                        <div className="text-center py-12 text-zinc-400">Loading pricing...</div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-6">
                            {pricing.map((tier) => {
                                const isPopular = tier.tier === 'monthly';
                                const isOneTime = tier.tier === 'one_time';

                                return (
                                    <div
                                        key={tier.id}
                                        className={`relative rounded-lg border-2 p-6 ${isPopular
                                                ? 'border-indigo-500 bg-indigo-500/5'
                                                : 'border-zinc-800 bg-zinc-800/30'
                                            }`}
                                    >
                                        {isPopular && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 rounded-full text-xs font-semibold">
                                                MOST POPULAR
                                            </div>
                                        )}

                                        <div className="text-center mb-6">
                                            <h3 className="text-lg font-semibold capitalize mb-2">
                                                {tier.tier.replace('_', ' ')}
                                            </h3>
                                            <div className="flex items-baseline justify-center gap-1">
                                                <span className="text-4xl font-bold">{tier.displayPrice}</span>
                                                {tier.billingPeriod && (
                                                    <span className="text-zinc-400">/{tier.billingPeriod}</span>
                                                )}
                                            </div>
                                            {tier.tier === 'annual' && (
                                                <p className="text-sm text-green-400 mt-1">Save $9.89/year</p>
                                            )}
                                        </div>

                                        <ul className="space-y-3 mb-6">
                                            {tier.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm">
                                                    <span className="text-green-500 mt-0.5">✓</span>
                                                    <span className="text-zinc-300">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <button
                                            onClick={() => handleSelectTier(tier.tier)}
                                            className={`w-full py-3 rounded-lg font-semibold transition-all ${isPopular
                                                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                                                    : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                                                }`}
                                        >
                                            {isOneTime ? 'Download Now' : 'Get Started'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-zinc-800 text-center text-sm text-zinc-400">
                        <p>All plans include AI-powered business plan generation and editing.</p>
                        <p className="mt-2">Payments are secured by Stripe. Cancel anytime for subscriptions.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
