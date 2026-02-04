import { BusinessPlanData } from '@/lib/business-plan-service';
import { DollarSign, Plus } from 'lucide-react';
import { InlineEditable } from '@/components/engines/InlineEditable';
import { useState } from 'react';

interface PricingSectionProps {
    data: BusinessPlanData;
    onChange?: (data: BusinessPlanData) => void;
}

export function PricingSection({ data, onChange }: PricingSectionProps) {
    // Extract ALL pricing values from the data (with defaults)
    const [basePriceLow, setBasePriceLow] = useState(data.basePriceLow || 4.99);
    const [aiMarkup, setAiMarkup] = useState(300); // 300% markup
    const [referralLow, setReferralLow] = useState(300);
    const [referralHigh, setReferralHigh] = useState(500);
    const [whiteLabelLow, setWhiteLabelLow] = useState(99);
    const [whiteLabelHigh, setWhiteLabelHigh] = useState(25000);

    // Recalculate financials when ANY pricing changes
    const recalculateFinancials = (updates: Partial<{
        basePrice: number;
        aiMarkup: number;
        refLow: number;
        refHigh: number;
        wlLow: number;
        wlHigh: number;
    }>) => {
        if (!onChange || !data.projections) return;

        // Use updated or current values
        const newBasePrice = updates.basePrice ?? basePriceLow;
        const newAiMarkup = updates.aiMarkup ?? aiMarkup;
        const newRefLow = updates.refLow ?? referralLow;
        const newRefHigh = updates.refHigh ?? referralHigh;
        const newWlLow = updates.wlLow ?? whiteLabelLow;
        const newWlHigh = updates.wlHigh ?? whiteLabelHigh;

        // Calculate new projections
        const newProjections = data.projections.map((proj, idx) => {
            const year = idx + 1;
            const clientCount = proj.clientCount || 0;

            // Revenue calculation with ALL parameters:

            // 1. Base subscription revenue (monthly * 12 * users)
            const subscriptionRevenue = newBasePrice * 12 * clientCount;

            // 2. AI premium upgrades (assume 30% upgrade rate at custom markup)
            const aiRevenue = subscriptionRevenue * 0.3 * (newAiMarkup / 100);

            // 3. Referral revenue (assume 10% of users refer others)
            const avgReferralValue = (newRefLow + newRefHigh) / 2;
            const referralRevenue = clientCount * 0.1 * avgReferralValue;

            // 4. White label (grows with scale, uses white-label pricing range)
            const whiteLabelClients = Math.min(year, 10); // Caps at 10 enterprise clients
            const avgWhiteLabelValue = (newWlLow + newWlHigh) / 2;
            const whiteLabelRevenue = whiteLabelClients * avgWhiteLabelValue * 12; // Annual

            const revenue = subscriptionRevenue + aiRevenue + referralRevenue + whiteLabelRevenue;

            // Expenses scale with revenue but with improving margins
            const expenseRatio = Math.max(0.3, 0.7 - (year * 0.08)); // Improves 8% per year
            const expenses = revenue * expenseRatio;

            const profit = revenue - expenses;

            return {
                ...proj,
                revenue,
                expenses,
                profit
            };
        });

        onChange({
            ...data,
            basePriceLow: newBasePrice,
            basePriceHigh: newBasePrice,
            projections: newProjections
        });
    };

    const handlePricingChange = (field: string, value: number) => {
        const updates: any = {};

        switch (field) {
            case 'basePrice':
                setBasePriceLow(value);
                updates.basePrice = value;
                break;
            case 'aiMarkup':
                setAiMarkup(value);
                updates.aiMarkup = value;
                break;
            case 'referralLow':
                setReferralLow(value);
                updates.refLow = value;
                break;
            case 'referralHigh':
                setReferralHigh(value);
                updates.refHigh = value;
                break;
            case 'whiteLabelLow':
                setWhiteLabelLow(value);
                updates.wlLow = value;
                break;
            case 'whiteLabelHigh':
                setWhiteLabelHigh(value);
                updates.wlHigh = value;
                break;
        }

        recalculateFinancials(updates);
    };

    const handleTextChange = (newValue: string) => {
        if (onChange) {
            onChange({
                ...data,
                revenueStrategy: newValue
            });
        }
    };

    return (
        <div className="bg-zinc-900/20 rounded-2xl border border-white/5 overflow-hidden">
            <div className="bg-zinc-900/50 backdrop-blur-sm border-b border-white/10 p-6">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-500/20 border border-indigo-500/30 p-3 rounded-xl">
                        <DollarSign className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-zinc-100">Pricing & Revenue Strategy</h2>
                        <p className="text-sm text-zinc-400 mt-1">Multi-stream revenue model</p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Quick Stats - ALL EDITABLE */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {/* Base Tier */}
                    <div className="text-center bg-zinc-900/40 backdrop-blur-sm px-4 py-5 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-all group">
                        <div className="text-sm text-zinc-400 font-medium mb-2">Base Tier</div>
                        <div className="text-2xl font-bold text-indigo-400">
                            {onChange ? (
                                <div className="flex items-center justify-center gap-1">
                                    <span>$</span>
                                    <InlineEditable
                                        value={basePriceLow.toString()}
                                        onSave={(val) => handlePricingChange('basePrice', parseFloat(val) || 4.99)}
                                        className="inline-block text-center w-16 text-indigo-400"
                                    />
                                    <span>/mo</span>
                                </div>
                            ) : (
                                <span>${basePriceLow}/mo</span>
                            )}
                        </div>
                        {onChange && (
                            <div className="text-xs text-indigo-400 mt-1 opacity-0 group-hover:opacity-100 transition">Click to edit</div>
                        )}
                    </div>

                    {/* AI Markup - NOW EDITABLE */}
                    <div className="text-center bg-zinc-900/40 backdrop-blur-sm px-4 py-5 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-all group">
                        <div className="text-sm text-zinc-400 font-medium mb-2">AI Markup</div>
                        <div className="text-2xl font-bold text-indigo-400">
                            {onChange ? (
                                <div className="flex items-center justify-center gap-1">
                                    <InlineEditable
                                        value={aiMarkup.toString()}
                                        onSave={(val) => handlePricingChange('aiMarkup', parseFloat(val) || 300)}
                                        className="inline-block text-center w-16 text-indigo-400"
                                    />
                                    <span>%</span>
                                </div>
                            ) : (
                                <span>{aiMarkup}%</span>
                            )}
                        </div>
                        {onChange && (
                            <div className="text-xs text-indigo-400 mt-1 opacity-0 group-hover:opacity-100 transition">Click to edit</div>
                        )}
                    </div>

                    {/* Referral - NOW EDITABLE */}
                    <div className="text-center bg-zinc-900/40 backdrop-blur-sm px-4 py-5 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-all group">
                        <div className="text-sm text-zinc-400 font-medium mb-2">Referral/User</div>
                        <div className="text-lg font-bold text-indigo-400">
                            {onChange ? (
                                <div className="flex items-center justify-center gap-1">
                                    <span>$</span>
                                    <InlineEditable
                                        value={referralLow.toString()}
                                        onSave={(val) => handlePricingChange('referralLow', parseFloat(val) || 300)}
                                        className="inline-block text-center w-12 text-indigo-400"
                                    />
                                    <span>-</span>
                                    <InlineEditable
                                        value={referralHigh.toString()}
                                        onSave={(val) => handlePricingChange('referralHigh', parseFloat(val) || 500)}
                                        className="inline-block text-center w-12 text-indigo-400"
                                    />
                                </div>
                            ) : (
                                <span>${referralLow}-{referralHigh}</span>
                            )}
                        </div>
                        {onChange && (
                            <div className="text-xs text-indigo-400 mt-1 opacity-0 group-hover:opacity-100 transition">Click to edit</div>
                        )}
                    </div>

                    {/* White-Label - NOW EDITABLE */}
                    <div className="text-center bg-zinc-900/40 backdrop-blur-sm px-4 py-5 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-all group">
                        <div className="text-sm text-zinc-400 font-medium mb-2">White-Label</div>
                        <div className="text-lg font-bold text-indigo-400">
                            {onChange ? (
                                <div className="flex items-center justify-center gap-1 flex-wrap">
                                    <span>$</span>
                                    <InlineEditable
                                        value={whiteLabelLow.toString()}
                                        onSave={(val) => handlePricingChange('whiteLabelLow', parseFloat(val) || 99)}
                                        className="inline-block text-center w-12 text-indigo-400"
                                    />
                                    <span>-</span>
                                    <InlineEditable
                                        value={(whiteLabelHigh / 1000).toString()}
                                        onSave={(val) => handlePricingChange('whiteLabelHigh', parseFloat(val) * 1000 || 25000)}
                                        className="inline-block text-center w-10 text-indigo-400"
                                    />
                                    <span>K/mo</span>
                                </div>
                            ) : (
                                <span>${whiteLabelLow}-{whiteLabelHigh / 1000}K/mo</span>
                            )}
                        </div>
                        {onChange && (
                            <div className="text-xs text-indigo-400 mt-1 opacity-0 group-hover:opacity-100 transition">Click to edit</div>
                        )}
                    </div>
                </div>

                {/* Revenue Strategy Text - Editable */}
                {data.revenueStrategy ? (
                    <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-white/5 mt-6">
                        <h3 className="font-semibold text-zinc-100 mb-3">Revenue Strategy Details</h3>
                        {onChange ? (
                            <InlineEditable
                                value={data.revenueStrategy}
                                onSave={handleTextChange}
                                className="whitespace-pre-wrap text-zinc-300 leading-relaxed text-sm block"
                            />
                        ) : (
                            <div className="prose prose-invert prose-sm max-w-none">
                                <div className="whitespace-pre-wrap text-zinc-300 leading-relaxed">
                                    {data.revenueStrategy}
                                </div>
                            </div>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
