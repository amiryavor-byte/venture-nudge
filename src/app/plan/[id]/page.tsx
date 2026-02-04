'use client';

import { useState, useEffect, use, useRef } from 'react';
import { MissionSection } from '@/components/plan/MissionSection';
import { CompetitiveSection } from '@/components/plan/CompetitiveSection';
import { MarketAnalysisSection } from '@/components/plan/MarketAnalysisSection';
import { PricingSection } from '@/components/plan/PricingSection';
import { FinancialsSection } from '@/components/plan/FinancialsSection';
import { RoadmapSection } from '@/components/plan/RoadmapSection';
import { MarketingSection } from '@/components/plan/MarketingSection';
import { MetricsSection } from '@/components/plan/MetricsSection';
import { RiskSection } from '@/components/plan/RiskSection';
import { RevenueStreamsSection } from '@/components/plan/RevenueStreamsSection';
import { LegalComplianceSection } from '@/components/engines/LegalComplianceSection';
import { BusinessPlanData, DEFAULT_PLAN_DATA } from '@/lib/business-plan-service';
import { Loader2, ArrowLeft, Undo, Redo } from 'lucide-react';
import Link from 'next/link';
import { getPlanData, updatePlanData } from '@/app/actions/plan-editor';

// Data adapter to convert 'BusinessPlanData' <-> SQLite 'businessPlans'
// We will need server actions for this.

export default function PlanEditorPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [data, setData] = useState<BusinessPlanData | null>(null);
    const [loading, setLoading] = useState(true);

    // Undo/Redo History
    const [history, setHistory] = useState<BusinessPlanData[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const isUndoRedoAction = useRef(false);

    useEffect(() => {
        loadPlan();
    }, [resolvedParams.id]);

    const loadPlan = async () => {
        try {
            // We'll create this action next
            const plan = await getPlanData(resolvedParams.id);
            setData(plan);
        } catch (e) {
            console.error(e);
            alert("Failed to load plan");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = async (newData: BusinessPlanData) => {
        setData(newData);

        // Add to history if not undo/redo action
        if (!isUndoRedoAction.current) {
            // Truncate forward history when making new change
            const newHistory = history.slice(0, historyIndex + 1);
            newHistory.push(newData);

            // Limit history to 50 states
            if (newHistory.length > 50) {
                newHistory.shift();
            } else {
                setHistoryIndex(historyIndex + 1);
            }

            setHistory(newHistory);
        }

        isUndoRedoAction.current = false;

        // Auto-save
        await updatePlanData(resolvedParams.id, newData);
    };

    const undo = () => {
        if (historyIndex > 0) {
            isUndoRedoAction.current = true;
            const previousData = history[historyIndex - 1];
            setHistoryIndex(historyIndex - 1);
            setData(previousData);
            updatePlanData(resolvedParams.id, previousData);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            isUndoRedoAction.current = true;
            const nextData = history[historyIndex + 1];
            setHistoryIndex(historyIndex + 1);
            setData(nextData);
            updatePlanData(resolvedParams.id, nextData);
        }
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Cmd/Ctrl + Z for undo
            if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undo();
            }
            // Cmd/Ctrl + Shift + Z for redo
            else if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
                e.preventDefault();
                redo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [historyIndex, history]);

    // Initialize history when data loads
    useEffect(() => {
        if (data && history.length === 0) {
            setHistory([data]);
            setHistoryIndex(0);
        }
    }, [data]);

    if (loading) return <div className="flex h-screen items-center justify-center bg-slate-950"><Loader2 className="animate-spin text-indigo-400" /></div>;
    if (!data) return <div className="flex h-screen items-center justify-center bg-slate-950 text-zinc-400">Plan not found</div>;

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-zinc-100">
            {/* Header */}
            <header className="bg-zinc-900/50 backdrop-blur-lg border-b border-white/5 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-zinc-400 hover:text-zinc-100">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="font-bold text-lg text-zinc-100">{data.missionStatement || "Untitled Plan"}</h1>
                        <span className="text-xs bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full uppercase font-bold">Draft</span>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Undo/Redo Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={undo}
                                disabled={historyIndex <= 0}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Undo (⌘Z)"
                            >
                                <Undo className="w-4 h-4" />
                                Undo
                            </button>
                            <button
                                onClick={redo}
                                disabled={historyIndex >= history.length - 1}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Redo (⌘⇧Z)"
                            >
                                <Redo className="w-4 h-4" />
                                Redo
                            </button>
                        </div>

                        <div className="text-sm text-zinc-500">
                            Autosaved
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">

                {/* === FOUNDATION === */}

                {/* 1. Mission Statement - Hero */}
                <MissionSection
                    data={data}
                    onChange={handleChange}
                />

                {/* === MARKET STRATEGY === */}

                {/* 2. Market Analysis & Target Segments */}
                <MarketAnalysisSection
                    data={data}
                    onChange={handleChange}
                />

                {/* 3. Competitive Advantage */}
                <CompetitiveSection
                    data={data}
                    onChange={handleChange}
                />

                {/* === BUSINESS MODEL === */}

                {/* 4. Revenue Streams */}
                <RevenueStreamsSection
                    data={data}
                    onChange={handleChange}
                />

                {/* 5. Pricing & Revenue Strategy */}
                <PricingSection
                    data={data}
                    onChange={handleChange}
                />

                {/* 6. Financial Projections */}
                <FinancialsSection data={data} onChange={handleChange} />

                {/* === EXECUTION === */}

                {/* 7. Product Roadmap */}
                <RoadmapSection
                    data={data}
                    onChange={handleChange}
                />

                {/* 8. Marketing Strategy */}
                <MarketingSection
                    data={data}
                    onChange={handleChange}
                />

                {/* 9. Key Metrics */}
                <MetricsSection
                    data={data}
                    onChange={handleChange}
                />

                {/* === RISK & COMPLIANCE === */}

                {/* 10. Risk Management */}
                <RiskSection
                    data={data}
                    onChange={handleChange}
                />

                {/* 11. Legal & Compliance */}
                <LegalComplianceSection
                    data={data}
                    onChange={handleChange}
                />

            </main>
        </div>
    );
}
