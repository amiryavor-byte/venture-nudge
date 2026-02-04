import { BusinessPlanData, AnyProjection } from '@/lib/business-plan-service';
import { TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
import { InlineEditableNumber } from './InlineEditableNumber';
import { Popover } from '@/components/ui/popover';
import { CalculationPopover } from './CalculationPopover';

interface FinancialsSectionProps {
    data: BusinessPlanData;
    onChange?: (data: BusinessPlanData) => void;
}

export function FinancialsSection({ data, onChange }: FinancialsSectionProps) {
    const formatCurrency = (amount: number) => {
        if (amount >= 1000000) {
            return `$${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
            return `$${(amount / 1000).toFixed(0)}K`;
        }
        return `$${amount.toFixed(0)}`;
    };

    const formatPercent = (value: number) => `${value}%`;

    // Auto-calculation handlers
    const handleClientCountChange = (index: number, newClientCount: number) => {
        if (!onChange || !data.projections) return;

        const updatedProjections = [...data.projections];
        const projection = updatedProjections[index];

        // Calculate revenue per user from existing data
        const revenuePerUser = projection.clientCount && projection.clientCount > 0
            ? projection.revenue / projection.clientCount
            : 0;

        // Recalculate revenue based on new user count
        const newRevenue = Math.round(revenuePerUser * newClientCount);

        // Keep margin constant, recalculate profit and expenses
        const margin = projection.revenue > 0
            ? projection.profit / projection.revenue
            : 0;
        const newProfit = Math.round(newRevenue * margin);
        const newExpenses = newRevenue - newProfit;

        updatedProjections[index] = {
            ...projection,
            clientCount: newClientCount,
            revenue: newRevenue,
            expenses: newExpenses,
            profit: newProfit,
        };

        onChange({ ...data, projections: updatedProjections });
    };

    const handleMarginChange = (index: number, newMarginPercent: number) => {
        if (!onChange || !data.projections) return;

        const updatedProjections = [...data.projections];
        const projection = updatedProjections[index];

        // Keep revenue constant, recalculate profit and expenses
        const newProfit = Math.round(projection.revenue * (newMarginPercent / 100));
        const newExpenses = projection.revenue - newProfit;

        updatedProjections[index] = {
            ...projection,
            profit: newProfit,
            expenses: newExpenses,
        };

        onChange({ ...data, projections: updatedProjections });
    };

    // Calculation breakdown helpers
    const getRevenuePopover = (proj: AnyProjection) => {
        const revenuePerUser = proj.clientCount && proj.clientCount > 0
            ? proj.revenue / proj.clientCount
            : 0;

        return (
            <CalculationPopover
                title="Revenue Calculation"
                formulas={[
                    `${proj.clientCount?.toLocaleString() || 0} users × $${Math.round(revenuePerUser)} per user = ${formatCurrency(proj.revenue)}`
                ]}
                breakdown={[
                    { label: 'User Count', value: proj.clientCount || 0, color: 'h-full bg-indigo-500' },
                    { label: 'Revenue per User', value: Math.round(revenuePerUser), color: 'h-full bg-purple-500' },
                ]}
                notes={[
                    'Revenue scales with user growth',
                    'Average revenue per user maintained across projections'
                ]}
            />
        );
    };

    const getExpensesPopover = (proj: AnyProjection) => {
        const expenseRatio = proj.revenue > 0
            ? (proj.expenses / proj.revenue) * 100
            : 0;

        return (
            <CalculationPopover
                title="Expenses Calculation"
                formulas={[
                    `${formatCurrency(proj.revenue)} × ${Math.round(expenseRatio)}% = ${formatCurrency(proj.expenses)}`,
                    `${formatCurrency(proj.revenue)} - ${formatCurrency(proj.profit)} = ${formatCurrency(proj.expenses)}`
                ]}
                breakdown={[
                    { label: 'Expenses', value: proj.expenses, color: 'h-full bg-red-500/70' },
                    { label: 'Profit', value: proj.profit, color: 'h-full bg-green-500' },
                ]}
                notes={[
                    `Expense Ratio: ${Math.round(expenseRatio)}%`,
                    'Lower expenses = higher profit margin'
                ]}
            />
        );
    };

    const getProfitPopover = (proj: AnyProjection, margin: number) => {
        return (
            <CalculationPopover
                title="Profit Calculation"
                formulas={[
                    `${formatCurrency(proj.revenue)} - ${formatCurrency(proj.expenses)} = ${formatCurrency(proj.profit)}`,
                    `${formatCurrency(proj.revenue)} × ${Math.round(margin)}% = ${formatCurrency(proj.profit)}`
                ]}
                breakdown={[
                    { label: 'Profit', value: proj.profit, color: 'h-full bg-green-500' },
                    { label: 'Expenses', value: proj.expenses, color: 'h-full bg-zinc-600' },
                ]}
                notes={[
                    `Profit Margin: ${Math.round(margin)}%`,
                    'Higher margin = more efficient operations'
                ]}
            />
        );
    };

    return (
        <div className="bg-zinc-900/20 rounded-2xl border border-white/5 overflow-hidden">
            <div className="bg-zinc-900/50 backdrop-blur-sm border-b border-white/10 p-6">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-500/20 border border-indigo-500/30 p-3 rounded-xl">
                        <BarChart3 className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-zinc-100">Financial Projections</h2>
                        <p className="text-sm text-zinc-400 mt-1">5-year growth projections</p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* 5-Year Projections Table */}
                {data.projections && data.projections.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-white/10">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-300">Year</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-300">Revenue</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-300">Expenses</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-300">Profit</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-300">Users</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-300">Margin</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.projections.map((proj: AnyProjection, idx: number) => {
                                    const margin = proj.revenue > 0 ? ((proj.profit / proj.revenue) * 100) : 0;
                                    return (
                                        <tr key={idx} className="border-b border-white/5 hover:bg-zinc-900/40 transition">
                                            <td className="py-3 px-4 font-medium text-zinc-200">{proj.year}</td>
                                            <td className="py-3 px-4 text-right font-semibold text-indigo-400">
                                                <Popover content={getRevenuePopover(proj)}>
                                                    <button className="hover:underline decoration-dotted cursor-help transition">
                                                        {formatCurrency(proj.revenue)}
                                                    </button>
                                                </Popover>
                                            </td>
                                            <td className="py-3 px-4 text-right text-zinc-300">
                                                <Popover content={getExpensesPopover(proj)}>
                                                    <button className="hover:underline decoration-dotted cursor-help transition">
                                                        {formatCurrency(proj.expenses)}
                                                    </button>
                                                </Popover>
                                            </td>
                                            <td className="py-3 px-4 text-right font-semibold text-indigo-300">
                                                <Popover content={getProfitPopover(proj, margin)}>
                                                    <button className="hover:underline decoration-dotted cursor-help transition">
                                                        {formatCurrency(proj.profit)}
                                                    </button>
                                                </Popover>
                                            </td>
                                            <td className="py-3 px-4 text-right text-zinc-300">
                                                {onChange ? (
                                                    <InlineEditableNumber
                                                        value={proj.clientCount || 0}
                                                        onSave={(newCount) => handleClientCountChange(idx, newCount)}
                                                        format="number"
                                                        className="text-zinc-300"
                                                    />
                                                ) : (
                                                    proj.clientCount?.toLocaleString() || 'N/A'
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                {onChange ? (
                                                    <InlineEditableNumber
                                                        value={Math.round(margin)}
                                                        onSave={(newMargin) => handleMarginChange(idx, newMargin)}
                                                        format="percent"
                                                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${margin >= 70 ? 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-300' :
                                                            margin >= 50 ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400' :
                                                                'bg-zinc-700/50 border border-zinc-600/50 text-zinc-400'
                                                            }`}
                                                    />
                                                ) : (
                                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${margin >= 70 ? 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-300' :
                                                        margin >= 50 ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400' :
                                                            'bg-zinc-700/50 border border-zinc-600/50 text-zinc-400'
                                                        }`}>
                                                        {formatPercent(Math.round(margin))}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-zinc-500 text-center py-8">
                        No financial projections available
                    </div>
                )}

                {/* Key Metrics Summary */}
                {data.projections && data.projections.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-white/10">
                        <h3 className="text-lg font-semibold text-zinc-100 mb-4">Growth Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-zinc-900/40 backdrop-blur-sm p-4 rounded-xl border border-white/5">
                                <div className="text-sm text-indigo-400 font-medium mb-1">Year 1 → Year 5 Revenue</div>
                                <div className="text-2xl font-bold text-zinc-100">
                                    {formatCurrency(data.projections[0].revenue)} → {formatCurrency(data.projections[data.projections.length - 1].revenue)}
                                </div>
                                <div className="text-xs text-indigo-300 mt-1">
                                    {Math.round((data.projections[data.projections.length - 1].revenue / data.projections[0].revenue - 1) * 100)}x growth
                                </div>
                            </div>
                            <div className="bg-zinc-900/40 backdrop-blur-sm p-4 rounded-xl border border-white/5">
                                <div className="text-sm text-indigo-400 font-medium mb-1">Year 5 Profit</div>
                                <div className="text-2xl font-bold text-zinc-100">
                                    {formatCurrency(data.projections[data.projections.length - 1].profit)}
                                </div>
                                <div className="text-xs text-indigo-300 mt-1">
                                    {Math.round((data.projections[data.projections.length - 1].profit / data.projections[data.projections.length - 1].revenue) * 100)}% margin
                                </div>
                            </div>
                            <div className="bg-zinc-900/40 backdrop-blur-sm p-4 rounded-xl border border-white/5">
                                <div className="text-sm text-indigo-400 font-medium mb-1">Year 5 Users</div>
                                <div className="text-2xl font-bold text-zinc-100">
                                    {data.projections[data.projections.length - 1].clientCount?.toLocaleString() || 'N/A'}
                                </div>
                                <div className="text-xs text-indigo-300 mt-1">
                                    Total user base
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
