
"use client";

import React, { useMemo } from 'react';
import { BusinessPlanData } from '@/lib/data/business-plan-service';
import { CURRENT_APP_FEATURES } from '@/lib/data/business-plan-constants';
import { InlineEditable } from './InlineEditable';
import { Check, X, Shield, Zap, TrendingUp, AlertTriangle } from 'lucide-react';

interface CompetitiveAdvantageSectionProps {
    data: BusinessPlanData;
    onChange: (newData: BusinessPlanData) => void;
}

export function CompetitiveAdvantageSection({ data, onChange }: CompetitiveAdvantageSectionProps) {

    // Memoized comparison logic to determine our advantage vs competitors
    const featureComparisonMatrix = useMemo(() => {
        const competitors = data.marketStats?.competitors || [];

        return CURRENT_APP_FEATURES.map(feature => {
            const competitorSupport = competitors.map(comp => {
                // TOKEN-BASED MATCHING LOGIC
                // 1. Clean and tokenize the Core Feature (our feature)
                // Remove parentheticals for matching context: "Kosher Menu Logic (..." -> "Kosher Menu Logic"
                const coreClean = feature.split('(')[0].toLowerCase();
                const coreTokens = coreClean.split(' ').filter(t => t.length > 3); // Filter out checks like "and", "for"

                // Helper to check overlap against a list of text strings (competitor features/weaknesses)
                const checkOverlap = (targetList: string[] = []) => {
                    if (!targetList) return false;

                    return targetList.some(compFeature => {
                        const compClean = compFeature.toLowerCase();
                        // Direct fuzzy match
                        if (compClean.includes(coreClean) || coreClean.includes(compClean)) return true;

                        // Token match: Do they share at least one significant keyword?
                        // e.g. "Kosher" in "Kosher Menu" vs "Proper Kosher Support"
                        return coreTokens.some(token => compClean.includes(token));
                    });
                };

                const hasFeature = checkOverlap(comp.features);
                const isWeakness = checkOverlap(comp.weaknesses);

                return {
                    name: comp.name,
                    hasFeature,
                    isWeakness
                };
            });

            // "Us" score logic: We have all features in the core list by definition
            return {
                feature,
                us: true,
                competitorSupport
            };
        });
    }, [data.marketStats?.competitors]);


    return (
        <section id="section-advantage" className="mb-16 bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-orange-100 scroll-mt-24 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 opacity-40 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>

            <h2 className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b-2 border-orange-100 flex items-center relative z-10">
                <span className="bg-orange-100 text-orange-600 rounded-full w-10 h-10 flex items-center justify-center mr-4 text-xl">4</span>
                Competitive Advantage
            </h2>



            {/* Feature Comparison Matrix */}
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 text-gray-800 font-bold text-lg">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <h3>Feature Mastery Matrix</h3>
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm bg-white">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-4 py-3 sticky left-0 bg-gray-50 z-20">Core Feature</th>
                                <th className="px-4 py-3 text-center text-blue-700 bg-blue-50/50 border-x border-blue-100 font-bold">Us (Catering App)</th>
                                {data.marketStats?.competitors.map((comp, idx) => (
                                    <th key={idx} className="px-4 py-3 text-center max-w-[120px] truncate">{comp.name}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {featureComparisonMatrix.map((row, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-800 sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                        {row.feature}
                                    </td>
                                    <td className="px-4 py-3 text-center bg-blue-50/10 border-x border-blue-50">
                                        <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600">
                                            <Check className="w-4 h-4" />
                                        </div>
                                    </td>
                                    {row.competitorSupport.map((comp, cIdx) => (
                                        <td key={cIdx} className="px-4 py-3 text-center">
                                            {comp.hasFeature ? (
                                                <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600" title="Competitor has this feature">
                                                    <Check className="w-3 h-3" />
                                                </div>
                                            ) : comp.isWeakness ? (
                                                <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600" title="Identified Weakness">
                                                    <X className="w-3 h-3" />
                                                </div>
                                            ) : (
                                                <span className="text-gray-300">-</span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Legend */}
                <div className="mt-4 flex gap-6 text-xs text-gray-500 justify-end">
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Check className="w-3 h-3" /></div>
                        <span>Our Standard</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><Check className="w-3 h-3" /></div>
                        <span>Competitor Match</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center"><X className="w-3 h-3" /></div>
                        <span>Competitor Weakness</span>
                    </div>
                </div>

            </div>
        </section>
    );
}
