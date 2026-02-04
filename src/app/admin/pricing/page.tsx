'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Save } from 'lucide-react';

interface PricingTier {
    id: string;
    tier: string;
    priceInCents: number;
    displayPrice: string;
    billingPeriod?: string | null;
    features: string[];
    isActive: boolean;
    sortOrder: number;
}

export default function AdminPricingPage() {
    const [pricing, setPricing] = useState<PricingTier[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPricing();
    }, []);

    const fetchPricing = async () => {
        try {
            const response = await fetch('/api/admin/pricing');
            const data = await response.json();
            setPricing(data.tiers || []);
        } catch (error) {
            console.error('Failed to fetch pricing:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateTier = (id: string, updates: Partial<PricingTier>) => {
        setPricing(prev => prev.map(tier =>
            tier.id === id ? { ...tier, ...updates } : tier
        ));
    };

    const updateFeature = (tierId: string, featureIndex: number, newValue: string) => {
        setPricing(prev => prev.map(tier => {
            if (tier.id === tierId) {
                const newFeatures = [...tier.features];
                newFeatures[featureIndex] = newValue;
                return { ...tier, features: newFeatures };
            }
            return tier;
        }));
    };

    const addFeature = (tierId: string) => {
        setPricing(prev => prev.map(tier => {
            if (tier.id === tierId) {
                return { ...tier, features: [...tier.features, ''] };
            }
            return tier;
        }));
    };

    const removeFeature = (tierId: string, featureIndex: number) => {
        setPricing(prev => prev.map(tier => {
            if (tier.id === tierId) {
                const newFeatures = tier.features.filter((_, idx) => idx !== featureIndex);
                return { ...tier, features: newFeatures };
            }
            return tier;
        }));
    };

    const savePricing = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/admin/pricing', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tiers: pricing }),
            });

            if (response.ok) {
                alert('Pricing updated successfully!');
            } else {
                alert('Failed to update pricing');
            }
        } catch (error) {
            console.error('Failed to save pricing:', error);
            alert('Failed to save pricing');
        } finally {
            setSaving(false);
        }
    };

    const formatPrice = (cents: number): string => {
        return `$${(cents / 100).toFixed(2)}`;
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="text-center text-zinc-400">Loading pricing...</div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2 text-white">
                            <DollarSign className="w-8 h-8 text-indigo-500" />
                            Pricing Configuration
                        </h1>
                        <p className="text-zinc-300 mt-2">
                            Manage subscription tiers and pricing displayed to users
                        </p>
                    </div>
                    <button
                        onClick={savePricing}
                        disabled={saving}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

                {/* Pricing Tiers */}
                <div className="grid gap-6">
                    {pricing.map((tier) => (
                        <div
                            key={tier.id}
                            className="bg-zinc-900 border border-zinc-800 rounded-lg p-6"
                        >
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Left Column: Basic Info */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-white">Tier Name</label>
                                        <input
                                            type="text"
                                            value={tier.tier}
                                            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg cursor-not-allowed text-white"
                                            disabled
                                        />
                                        <p className="text-xs text-zinc-500 mt-1">ID: {tier.id}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-white">Price (cents)</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                value={tier.priceInCents}
                                                onChange={(e) => updateTier(tier.id, {
                                                    priceInCents: parseInt(e.target.value) || 0,
                                                    displayPrice: formatPrice(parseInt(e.target.value) || 0)
                                                })}
                                                className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:border-indigo-500 outline-none"
                                            />
                                            <input
                                                type="text"
                                                value={tier.displayPrice}
                                                onChange={(e) => updateTier(tier.id, { displayPrice: e.target.value })}
                                                className="w-24 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:border-indigo-500 outline-none"
                                                placeholder="$4.99"
                                            />
                                        </div>
                                        <p className="text-xs text-zinc-500 mt-1">
                                            {tier.priceInCents} cents = {formatPrice(tier.priceInCents)}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-white">Billing Period</label>
                                        <select
                                            value={tier.billingPeriod || ''}
                                            onChange={(e) => updateTier(tier.id, {
                                                billingPeriod: e.target.value || null
                                            })}
                                            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:border-indigo-500 outline-none text-white"
                                        >
                                            <option value="">None (One-time)</option>
                                            <option value="month">Month</option>
                                            <option value="year">Year</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={tier.isActive}
                                                onChange={(e) => updateTier(tier.id, { isActive: e.target.checked })}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-sm text-white">Active</span>
                                        </label>

                                        <div className="flex-1">
                                            <label className="block text-sm mb-1">Sort Order</label>
                                            <input
                                                type="number"
                                                value={tier.sortOrder}
                                                onChange={(e) => updateTier(tier.id, {
                                                    sortOrder: parseInt(e.target.value) || 0
                                                })}
                                                className="w-20 px-3 py-1 bg-zinc-800 border border-zinc-700 rounded focus:border-indigo-500 outline-none text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Features */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-white">Features</label>
                                        <button
                                            onClick={() => addFeature(tier.id)}
                                            className="text-xs px-2 py-1 bg-indigo-600 hover:bg-indigo-500 rounded transition-colors"
                                        >
                                            + Add Feature
                                        </button>
                                    </div>

                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {tier.features.map((feature, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={feature}
                                                    onChange={(e) => updateFeature(tier.id, idx, e.target.value)}
                                                    className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded focus:border-indigo-500 outline-none text-sm text-white"
                                                    placeholder="Feature description"
                                                />
                                                <button
                                                    onClick={() => removeFeature(tier.id, idx)}
                                                    className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded text-sm transition-colors"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Info */}
                <div className="mt-8 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-sm text-zinc-300">
                    <p className="font-semibold text-indigo-300 mb-1">💡 Pro Tip:</p>
                    <p>Pricing changes take effect immediately for new customers. Existing subscriptions maintain their original pricing until renewal.</p>
                </div>
            </div>
        </div>
    );
}
