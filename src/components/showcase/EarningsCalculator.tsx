'use client';

import { useState } from 'react';

export default function EarningsCalculator() {
    // Editable inputs with defaults from ROADMAP.md
    const [users, setUsers] = useState(1000);
    const [subscriptionPrice, setSubscriptionPrice] = useState(4.99);
    const [aiUsagePerUser, setAiUsagePerUser] = useState(15);
    const [referralConversion, setReferralConversion] = useState(10); // percentage
    const [avgReferralValue, setAvgReferralValue] = useState(400);
    const [whiteLabelClients, setWhiteLabelClients] = useState(5);
    const [whiteLabelPrice, setWhiteLabelPrice] = useState(2000);

    // Calculations
    const monthlySubscriptions = users * subscriptionPrice;
    const monthlyAI = users * aiUsagePerUser;
    const monthlyReferrals = (users * (referralConversion / 100) * avgReferralValue);
    const monthlyWhiteLabel = whiteLabelClients * whiteLabelPrice;
    const monthlyTotal = monthlySubscriptions + monthlyAI + monthlyReferrals + monthlyWhiteLabel;
    const annualTotal = monthlyTotal * 12;
    const netProfit = annualTotal * 0.85; // 85% margin

    return (
        <div className="bg-slate-900/50 rounded-2xl p-8 border border-white/5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4 text-indigo-400">Adjust Assumptions</h3>

                    {/* Active Users */}
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">
                            Active Users
                        </label>
                        <input
                            type="range"
                            min="100"
                            max="50000"
                            step="100"
                            value={users}
                            onChange={(e) => setUsers(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <input
                            type="number"
                            value={users}
                            onChange={(e) => setUsers(parseInt(e.target.value) || 0)}
                            className="mt-2 w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                        />
                    </div>

                    {/* Subscription Price */}
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">
                            Monthly Subscription ($)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={subscriptionPrice}
                            onChange={(e) => setSubscriptionPrice(parseFloat(e.target.value) || 0)}
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                        />
                    </div>

                    {/* AI Usage Per User */}
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">
                            Avg AI Usage Per User/Month ($)
                        </label>
                        <input
                            type="number"
                            step="1"
                            value={aiUsagePerUser}
                            onChange={(e) => setAiUsagePerUser(parseFloat(e.target.value) || 0)}
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                        />
                    </div>

                    {/* Referral Conversion */}
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">
                            Referral Conversion Rate (%)
                        </label>
                        <input
                            type="number"
                            step="1"
                            value={referralConversion}
                            onChange={(e) => setReferralConversion(parseFloat(e.target.value) || 0)}
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                        />
                    </div>

                    {/* Avg Referral Value */}
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">
                            Avg Referral Commission ($)
                        </label>
                        <input
                            type="number"
                            step="10"
                            value={avgReferralValue}
                            onChange={(e) => setAvgReferralValue(parseFloat(e.target.value) || 0)}
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                        />
                    </div>

                    {/* White Label Clients */}
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">
                            White-Label Clients
                        </label>
                        <input
                            type="number"
                            value={whiteLabelClients}
                            onChange={(e) => setWhiteLabelClients(parseInt(e.target.value) || 0)}
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                        />
                    </div>

                    {/* White Label Price */}
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">
                            White-Label Pricing ($)
                        </label>
                        <input
                            type="number"
                            step="100"
                            value={whiteLabelPrice}
                            onChange={(e) => setWhiteLabelPrice(parseFloat(e.target.value) || 0)}
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                        />
                    </div>
                </div>

                {/* Results */}
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4 text-indigo-400">Projected Revenue</h3>

                    {/* Monthly Breakdown */}
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-white/5">
                        <h4 className="text-lg font-semibold mb-4">Monthly Revenue</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Subscriptions</span>
                                <span className="font-semibold">${monthlySubscriptions.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">AI Usage</span>
                                <span className="font-semibold">${monthlyAI.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Referrals</span>
                                <span className="font-semibold">${monthlyReferrals.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">White-Label</span>
                                <span className="font-semibold">${monthlyWhiteLabel.toLocaleString()}</span>
                            </div>
                            <div className="border-t border-slate-700 pt-3 flex justify-between">
                                <span className="font-semibold">Total Monthly</span>
                                <span className="text-xl font-bold text-indigo-400">
                                    ${monthlyTotal.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Annual Summary */}
                    <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl p-6 border border-indigo-500/20">
                        <h4 className="text-lg font-semibold mb-4">Annual Projections</h4>
                        <div className="space-y-4">
                            <div>
                                <div className="text-sm text-slate-400 mb-1">Gross Revenue</div>
                                <div className="text-3xl font-bold text-white">
                                    ${annualTotal.toLocaleString()}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-slate-400 mb-1">Net Profit (85% margin)</div>
                                <div className="text-3xl font-bold text-indigo-400">
                                    ${netProfit.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Per User LTV */}
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-white/5">
                        <h4 className="text-lg font-semibold mb-2">Lifetime Value Per User</h4>
                        <div className="text-2xl font-bold text-indigo-400">
                            ${((annualTotal / users) || 0).toFixed(2)}
                        </div>
                        <div className="text-sm text-slate-400 mt-1">
                            First year revenue per active user
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Presets */}
            <div className="mt-8 pt-8 border-t border-slate-700">
                <h4 className="text-sm font-semibold text-slate-400 mb-4">Quick Scenarios</h4>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => {
                            setUsers(1000);
                            setSubscriptionPrice(4.99);
                            setAiUsagePerUser(15);
                            setReferralConversion(10);
                            setAvgReferralValue(400);
                            setWhiteLabelClients(5);
                            setWhiteLabelPrice(2000);
                        }}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
                    >
                        1K Users (Conservative)
                    </button>
                    <button
                        onClick={() => {
                            setUsers(10000);
                            setSubscriptionPrice(4.99);
                            setAiUsagePerUser(15);
                            setReferralConversion(10);
                            setAvgReferralValue(400);
                            setWhiteLabelClients(20);
                            setWhiteLabelPrice(5000);
                        }}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
                    >
                        10K Users (Growth)
                    </button>
                    <button
                        onClick={() => {
                            setUsers(500);
                            setSubscriptionPrice(4.99);
                            setAiUsagePerUser(10);
                            setReferralConversion(5);
                            setAvgReferralValue(300);
                            setWhiteLabelClients(2);
                            setWhiteLabelPrice(1000);
                        }}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
                    >
                        500 Users (Minimal)
                    </button>
                </div>
            </div>
        </div>
    );
}
