"use client";

import { useState, useEffect } from "react";
import { Loader2, Sparkles, AlertTriangle } from "lucide-react";
import { PDFDownloadButton } from './PDFDownloadButton';

interface CompetitorIntelligenceViewProps {
    competitorName: string;
    currentFeatures: string[];
    preloadedAnalysis?: string;
    onAnalysisComplete: (analysis: string, features?: string[], weaknesses?: string[]) => void;
}

export function CompetitorIntelligenceView({ competitorName, currentFeatures, preloadedAnalysis, onAnalysisComplete }: CompetitorIntelligenceViewProps) {
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!competitorName) {
            setAnalysis(null);
            return;
        }

        if (preloadedAnalysis && preloadedAnalysis.length > 0) {
            setAnalysis(preloadedAnalysis);
            setLoading(false);
        } else {
            // Auto-fetch if selected but no analysis exists
            fetchAnalysis();
        }
    }, [competitorName, preloadedAnalysis]);

    const fetchAnalysis = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/business-plan/competitor-analysis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    competitorName,
                    currentFeatures,
                    existingAnalysis: preloadedAnalysis // Pass dirty/short text if any
                })
            });
            const data = await res.json();
            if (data.analysis) {
                setAnalysis(data.analysis);
                // Pass back structured data if available
                onAnalysisComplete(data.analysis, data.features, data.weaknesses);
            } else {
                setAnalysis("Failed to retrieve intelligence.");
            }
        } catch (error) {
            console.error("Intelligence Fetch Error", error);
            setAnalysis("Connection to Intelligence Engine failed.");
        } finally {
            setLoading(false);
        }
    };

    if (!competitorName) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-12 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                <Sparkles className="w-12 h-12 mb-4 text-indigo-200" />
                <h3 className="text-lg font-medium text-gray-600">Select a Competitor</h3>
                <p className="text-sm">Choose a competitor from the list to view their deep dive intelligence report.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden relative">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                        <Sparkles className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{competitorName}</h2>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Intelligence Report</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {loading && <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />}
                    <PDFDownloadButton
                        targetId={`deep-dive-report-${competitorName.replace(/\s+/g, '-')}`}
                        fileName={`${competitorName}-Analysis`}
                        variant="icon"
                        label="Save PDF"
                    />
                </div>
            </div>

            {/* Content Area - Scrollable */}
            <div id={`deep-dive-report-${competitorName.replace(/\s+/g, '-')}`} className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: "#ffffff", color: "#374151" }}>

                {/* Benchmark Criteria Section (Added per user request) */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <details className="group">
                        <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-sm text-gray-600">
                            <span>🧠 Analyzed against {currentFeatures.length} Benchmark Features</span>
                            <span className="transition group-open:rotate-180">
                                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                            </span>
                        </summary>
                        <ul className="mt-3 text-xs text-gray-500 grid grid-cols-2 gap-2 pl-2">
                            {currentFeatures.map((f, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0"></span>
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </details>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                        <Loader2 className="w-8 h-8 animate-spin mb-4" style={{ color: "#4f46e5" }} />
                        <p className="font-medium animate-pulse" style={{ color: "#4b5563" }}>Running Deep Scan...</p>
                        <p className="text-xs mt-2" style={{ color: "#9ca3af" }}>Extracting pricing & features...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {analysis?.split(/(?=###)/g).map((section, i) => {
                            const cleanSection = section.trim();
                            if (!cleanSection) return null;

                            // Inline Hex Styles for PDF Stability
                            let cardStyle = { borderColor: "#e5e7eb", backgroundColor: "#ffffff", marginBottom: "1.5rem" };
                            let headerStyle = { backgroundColor: "#f9fafb", borderColor: "#e5e7eb", color: "#111827" };
                            let icon = "📌";

                            const lower = cleanSection.toLowerCase();
                            if (lower.includes("strength") || lower.includes("love")) {
                                cardStyle.borderColor = "#a7f3d0"; headerStyle.backgroundColor = "#ecfdf5"; headerStyle.borderColor = "#a7f3d0"; headerStyle.color = "#064e3b"; icon = "✅";
                            } else if (lower.includes("weakness") || lower.includes("fail")) {
                                cardStyle.borderColor = "#fecdd3"; headerStyle.backgroundColor = "#fff1f2"; headerStyle.borderColor = "#fecdd3"; headerStyle.color = "#881337"; icon = "⚠️";
                            } else if (lower.includes("strategy") || lower.includes("kill shot")) {
                                cardStyle.borderColor = "#c7d2fe"; headerStyle.backgroundColor = "#eef2ff"; headerStyle.borderColor = "#c7d2fe"; headerStyle.color = "#312e81"; icon = "🎯";
                            } else if (lower.includes("value prop")) {
                                cardStyle.borderColor = "#bfdbfe"; headerStyle.backgroundColor = "#eff6ff"; headerStyle.borderColor = "#bfdbfe"; headerStyle.color = "#1e3a8a"; icon = "💎";
                            }

                            const lines = cleanSection.split('\n');
                            const header = lines[0].replace(/###|\*\*/g, '').trim();
                            const body = lines.slice(1).join('\n').trim();

                            return (
                                <div key={i} className="rounded-xl border overflow-hidden shadow-sm" style={cardStyle}>
                                    <div className="px-4 py-3 border-b flex items-center gap-2" style={headerStyle}>
                                        <span className="text-lg">{icon}</span>
                                        <h3 className="font-bold m-0" style={{ color: headerStyle.color }}>{header || "Analysis"}</h3>
                                    </div>
                                    <div className="p-4" style={{ backgroundColor: "#ffffff", color: "#374151", fontSize: "0.875rem", lineHeight: "1.625", whiteSpace: "pre-wrap" }}>
                                        {body.split('\n').map((line, j) => (
                                            <div key={j} style={{ paddingLeft: line.trim().startsWith('-') ? "1rem" : "0", marginBottom: "0.5rem", display: line.trim().startsWith('-') ? "flex" : "block", alignItems: "flex-start" }}>
                                                {line.trim().startsWith('-') && <span style={{ marginRight: "0.5rem", color: "#9ca3af" }}>•</span>}
                                                <span>{line.replace(/^- /, '').replace(/\*\*/g, '')}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                        {!analysis && !loading && (
                            <div className="text-center p-8 text-gray-400 italic">
                                <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                No intelligence data found.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
