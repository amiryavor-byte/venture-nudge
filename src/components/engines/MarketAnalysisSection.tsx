
"use client";

import { BusinessPlanData } from '@/lib/engines/business-plan-service';
import { InlineEditable } from './InlineEditable';
import { useState, useEffect, useRef } from 'react';
import { CompetitorIntelligenceView } from './CompetitorIntelligenceView';
import { ExternalLink, Search, TrendingUp, Loader2, AlertTriangle, RefreshCw, ChevronRight, BarChart3, CheckCircle2 } from 'lucide-react';
import { PDFDownloadButton } from './PDFDownloadButton';

interface MarketAnalysisSectionProps {
    data: BusinessPlanData;
    onChange: (newData: BusinessPlanData) => void;
}

import { CURRENT_APP_FEATURES } from '@/lib/engines/business-plan-constants';

// Generic loading messages
const FUNNY_MESSAGES = [
    "Infiltrating competitor strategy meetings... (just kidding)",
    "Analyzing pricing models with a magnifying glass...",
    "Comparing value propositions pixel by pixel...",
    "Consulting the oracle of market dominance...",
    "Calculating win probabilities...",
    "Finding the gaps in their armor...",
    "Measuring their moat depth...",
    "Reviewing customer sentiment analysis...",
    "Checking their digital footprint...",
    "Synthesizing strategic advantages..."
];

export function MarketAnalysisSection({ data, onChange }: MarketAnalysisSectionProps) {
    const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState("Initializing Landscape Scan...");

    const stats = data.marketStats || {
        competitors: [],
        featureComparison: [],
        lastUpdated: new Date().toISOString()
    };

    // Ref to track latest data for async operations (Fix Stale Closure)
    const dataRef = useRef(data);
    useEffect(() => { dataRef.current = data; }, [data]);

    const handleRunAnalysis = async () => {
        setAnalyzing(true);
        setProgress(5);
        setLoadingMessage("Scanning market landscape...");

        // Dynamic Focus Area based on User Input
        const focusQuery = data.solution || data.problem || "Emerging Business Trends";

        try {
            // Step 1: Broad Spectrum Analysis
            const res = await fetch('/api/business-plan/market-analysis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentFeatures: CURRENT_APP_FEATURES,
                    focusArea: focusQuery, // Dynamic Search
                    existingCompetitors: stats.competitors // Pass for incremental update
                })
            });
            const analysis = await res.json();

            if (!analysis.competitors) throw new Error("No competitors found");

            // --- SMART MERGE LOGIC (Fix "Less Competitors" Issue) ---
            // 1. Start with existing competitors to preserve manual entries/history
            const currentList = [...dataRef.current.marketStats?.competitors || []];

            // 2. Update or Append new ones from API
            analysis.competitors.forEach((newComp: any) => {
                const idx = currentList.findIndex(c => c.name.toLowerCase() === newComp.name.toLowerCase());
                if (idx !== -1) {
                    // Update existing (preserve detailedAnalysis if not provided)
                    // CRITICAL: Keep existing name casing to match selectedCompetitor state
                    currentList[idx] = {
                        ...currentList[idx],
                        ...newComp,
                        name: currentList[idx].name,
                        detailedAnalysis: currentList[idx].detailedAnalysis // Keep existing deep dive!
                    };
                } else {
                    // Add new
                    currentList.push(newComp);
                }
            });

            // Save the merged list immediately
            const interimData = {
                ...dataRef.current, // Use Ref for latest state
                marketStats: {
                    competitors: currentList,
                    featureComparison: analysis.featureComparison || [], // Ensure array for type safety
                    lastUpdated: new Date().toISOString()
                }
            };
            onChange(interimData); // <<-- SAVE POINT 1

            setProgress(30);

            // Step 2: Sequential Deep Dives (Only for those missing analysis or explicitly new)
            // We iterate over the *newly merged* list
            const total = currentList.length;

            for (let i = 0; i < total; i++) {
                const comp = currentList[i];

                // Skip if we already have a detailed analysis (Don't re-download unnecessarily)
                if (comp.detailedAnalysis && comp.detailedAnalysis.length > 50) {
                    continue;
                }

                // Update message randomly
                setLoadingMessage(FUNNY_MESSAGES[Math.floor(Math.random() * FUNNY_MESSAGES.length)] + ` (${comp.name})`);

                try {
                    const ddRes = await fetch('/api/business-plan/competitor-analysis', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            competitorName: comp.name,
                            currentFeatures: CURRENT_APP_FEATURES,
                            existingAnalysis: comp.detailedAnalysis // PASS OLD DATA TO API
                        })
                    });
                    const ddData = await ddRes.json();

                    if (ddData.analysis) {
                        currentList[i] = {
                            ...comp,
                            detailedAnalysis: ddData.analysis, // Update with new AI result
                            features: ddData.features || comp.features || [],
                            weaknesses: ddData.weaknesses || comp.weaknesses || []
                        };

                        // Incrementally Save using FRESH DATA from Ref
                        onChange({
                            ...dataRef.current, // CRITICAL: Read fresh state
                            marketStats: {
                                competitors: [...currentList], // Use our local mutated list which is consistent
                                featureComparison: dataRef.current.marketStats?.featureComparison || [],
                                lastUpdated: dataRef.current.marketStats?.lastUpdated
                            }
                        }); // <<-- SAVE POINT 2 (Incremental)
                    }
                } catch (e) {
                    // Fail gracefully, keep existing comp data (do nothing to array)
                    console.error(`Failed deep dive for ${comp.name}`, e);
                }

                setProgress(30 + Math.floor(((i + 1) / total) * 70));
            }

        } catch (error) {
            console.error("Analysis failed", error);
            alert("Failed to run AI Analysis. Check console.");
        } finally {
            setAnalyzing(false);
            setProgress(0);
        }
    };

    // Helper to update specific competitor field
    const updateCompetitor = (idx: number, field: string, val: any) => {
        const newComps = [...stats.competitors];
        const oldName = newComps[idx].name;

        newComps[idx] = { ...newComps[idx], [field]: val };
        onChange({ ...data, marketStats: { ...stats, competitors: newComps } });

        // If Renaming the currently selected competitor, update tracking state
        if (field === 'name' && oldName === selectedCompetitor) {
            setSelectedCompetitor(val);
        }
    };

    // Helper for multi-field update (from single view callback)
    const updateCompetitorFull = (idx: number, updates: Partial<typeof stats.competitors[0]>) => {
        const newComps = [...stats.competitors];
        newComps[idx] = { ...newComps[idx], ...updates };
        onChange({ ...data, marketStats: { ...stats, competitors: newComps } });
    };

    // Find the currently selected competitor object to pass its preloaded data
    const activeCompetitorData = stats.competitors.find(c => c.name === selectedCompetitor);

    return (
        <section id="section-market" className="mb-16 bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100 scroll-mt-24 relative overflow-hidden">
            {/* Design Elements matching Page Style */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 opacity-40 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>

            <h2 className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b-2 border-indigo-100 flex items-center justify-between relative z-10">
                <div className="flex items-center">
                    <span className="bg-indigo-100 text-indigo-600 rounded-full w-10 h-10 flex items-center justify-center mr-4 text-xl">3</span>
                    <span>Market Analysis & AI Intelligence</span>
                </div>

                {/* Dynamic Button / Progress Bar Area */}
                <div className="flex flex-col items-end min-w-[200px]">
                    <button
                        onClick={handleRunAnalysis}
                        disabled={analyzing}
                        className={`text-sm px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${analyzing ? 'bg-indigo-100 text-indigo-400 cursor-wait' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                            }`}
                    >
                        {analyzing ? (
                            <><span>🕵️</span> Scanning...</>
                        ) : (
                            <><span>🤖</span> Refresh Intel</>
                        )}
                    </button>
                    {analyzing && (
                        <div className="mt-2 w-full text-right">
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-1">
                                <div
                                    className="h-full bg-indigo-500 transition-all duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <span className="text-xs text-indigo-600 font-medium animate-pulse">{loadingMessage}</span>
                        </div>
                    )}
                </div>
            </h2>

            {/* MINI APP LAYOUT: Split Pane */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 h-[800px]">

                {/* Left Column: Competitor List (Navigation) */}
                <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 mb-2">
                        <div className="flex items-center gap-2 text-indigo-900 font-bold mb-1">
                            <TrendingUp className="w-4 h-4" />
                            <h3>Competitor Landscape</h3>
                        </div>
                        <p className="text-xs text-indigo-700/70">Select a competitor to view AI intelligence.</p>
                    </div>

                    {stats.competitors.length === 0 && (
                        <div className="text-center p-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            No competitors found. <br /> Run "Refresh Intel" to start.
                        </div>
                    )}

                    {stats.competitors.map((comp, idx) => {
                        const isSelected = selectedCompetitor === comp.name;
                        return (
                            <div
                                key={idx}
                                onClick={() => setSelectedCompetitor(comp.name)}
                                className={`cursor-pointer group relative p-4 rounded-xl border transition-all duration-200 ease-in-out ${isSelected
                                    ? 'bg-indigo-600 border-indigo-600 shadow-lg text-white scale-[1.02]'
                                    : 'bg-white border-gray-100 hover:border-indigo-200 hover:shadow-md hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                                        <InlineEditable
                                            value={comp.name}
                                            onSave={v => updateCompetitor(idx, 'name', v)}
                                            className={isSelected ? 'bg-transparent text-white' : ''}
                                        />
                                    </h4>
                                    <span className={`text-xs font-mono px-2 py-1 rounded-full ${isSelected ? 'bg-indigo-500 text-indigo-100' : 'bg-gray-100 text-gray-600'}`}>
                                        {comp.marketShare}% Share
                                    </span>
                                </div>

                                <div className="flex items-center justify-between mt-3 text-xs">
                                    <div className="flex flex-col">
                                        <span className={isSelected ? 'text-indigo-200' : 'text-gray-400'}>AI Threat Score</span>
                                        <span className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-gray-800'}`}>{comp.aiScore || 0}/100</span>
                                    </div>

                                    {/* Mini Bar Chart */}
                                    <div className="w-16 h-2 bg-gray-200/50 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${isSelected ? 'bg-white' : 'bg-indigo-500'}`}
                                            style={{ width: `${comp.aiScore || 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Right Column: Detailed Intelligence View */}
                <div className="lg:col-span-8 h-full min-h-[500px]">
                    <CompetitorIntelligenceView
                        competitorName={selectedCompetitor || ''}
                        currentFeatures={CURRENT_APP_FEATURES}
                        preloadedAnalysis={activeCompetitorData?.detailedAnalysis}
                        onAnalysisComplete={(info, features, weaknesses) => {
                            // Robust finding: Case Insensitive
                            const idx = stats.competitors.findIndex(c => c.name.toLowerCase() === (selectedCompetitor || '').toLowerCase());
                            if (idx !== -1) {
                                // Save to parent state immediately
                                const updates: any = { detailedAnalysis: info };
                                if (features) updates.features = features;
                                if (weaknesses) updates.weaknesses = weaknesses;
                                updateCompetitorFull(idx, updates);
                            }
                        }}
                    />
                </div>
            </div>
        </section>
    );
}
