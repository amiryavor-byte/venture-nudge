'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AvatarPricingPage() {
    const [settings, setSettings] = useState({
        proTierMarkup: 150,
        enterpriseMarkup: 130,
        sttCostPerMinute: 43,
        ttsCostPer1kChars: 1800,
        rtcCostPerMinute: 99,
        llmCostPerMessage: 200,
        freeTrialMessagesPerWeek: 3,
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/admin/avatar-pricing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });
            if (response.ok) {
                alert('Pricing settings saved successfully!');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Avatar Voice Pricing Configuration</h1>
                <p className="text-slate-400">
                    Configure markup percentages and cost estimates for the Nudge AI Avatar feature
                </p>
            </div>

            {/* Markup Settings */}
            <div className="bg-slate-900/50 rounded-xl p-6 border border-white/5 mb-6">
                <h2 className="text-xl font-semibold mb-4">Markup Settings</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Pro Tier Markup (%)
                        </label>
                        <input
                            type="number"
                            value={settings.proTierMarkup}
                            onChange={(e) => setSettings({ ...settings, proTierMarkup: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            {settings.proTierMarkup}% = {(settings.proTierMarkup / 100).toFixed(2)}x markup
                            (e.g., $0.02 cost → ${(0.02 * settings.proTierMarkup / 100).toFixed(3)} charge)
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Enterprise Tier Markup (%)
                        </label>
                        <input
                            type="number"
                            value={settings.enterpriseMarkup}
                            onChange={(e) => setSettings({ ...settings, enterpriseMarkup: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            Lower markup for volume customers
                        </p>
                    </div>
                </div>
            </div>

            {/* Cost Estimates */}
            <div className="bg-slate-900/50 rounded-xl p-6 border border-white/5 mb-6">
                <h2 className="text-xl font-semibold mb-4">Cost Estimates (for reference)</h2>
                <p className="text-sm text-slate-400 mb-4">
                    These are stored as integers (x10000) for precision. Update as API pricing changes.
                </p>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                STT Cost per Minute
                            </label>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-400">$</span>
                                <input
                                    type="number"
                                    step="0.0001"
                                    value={(settings.sttCostPerMinute / 10000).toFixed(4)}
                                    onChange={(e) => setSettings({ ...settings, sttCostPerMinute: Math.round(parseFloat(e.target.value) * 10000) })}
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                TTS Cost per 1K Chars
                            </label>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-400">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={(settings.ttsCostPer1kChars / 10000).toFixed(2)}
                                    onChange={(e) => setSettings({ ...settings, ttsCostPer1kChars: Math.round(parseFloat(e.target.value) * 10000) })}
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                RTC Cost per Minute
                            </label>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-400">$</span>
                                <input
                                    type="number"
                                    step="0.0001"
                                    value={(settings.rtcCostPerMinute / 10000).toFixed(4)}
                                    onChange={(e) => setSettings({ ...settings, rtcCostPerMinute: Math.round(parseFloat(e.target.value) * 10000) })}
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                LLM Cost per Message (avg)
                            </label>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-400">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={(settings.llmCostPerMessage / 10000).toFixed(2)}
                                    onChange={(e) => setSettings({ ...settings, llmCostPerMessage: Math.round(parseFloat(e.target.value) * 10000) })}
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Free Tier Settings */}
            <div className="bg-slate-900/50 rounded-xl p-6 border border-white/5 mb-6">
                <h2 className="text-xl font-semibold mb-4">Free Tier Limits</h2>
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Free Trial Messages per Week
                    </label>
                    <input
                        type="number"
                        value={settings.freeTrialMessagesPerWeek}
                        onChange={(e) => setSettings({ ...settings, freeTrialMessagesPerWeek: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                        Number of voice messages free users can send per week
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-indigo-600 hover:bg-indigo-500"
                >
                    {isSaving ? 'Saving...' : 'Save Settings'}
                </Button>
                <Link href="/admin/avatar-billing">
                    <Button variant="outline">
                        View Billing Dashboard →
                    </Button>
                </Link>
            </div>

            {/* Estimated Costs */}
            <div className="mt-8 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                <h3 className="font-semibold mb-2">💡 Estimated Cost per Message</h3>
                <div className="text-sm text-slate-300 space-y-1">
                    <p>Base cost: ~${((settings.sttCostPerMinute + settings.rtcCostPerMinute) / 10000 + (settings.ttsCostPer1kChars / 10000) * 0.2 + settings.llmCostPerMessage / 10000).toFixed(3)}</p>
                    <p>Pro tier charge: ~${(((settings.sttCostPerMinute + settings.rtcCostPerMinute) / 10000 + (settings.ttsCostPer1kChars / 10000) * 0.2 + settings.llmCostPerMessage / 10000) * (settings.proTierMarkup / 100)).toFixed(3)}</p>
                    <p className="text-xs text-slate-400">Assumes 1 min audio, 200 chars response</p>
                </div>
            </div>
        </div>
    );
}
