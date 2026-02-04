"use client";

import React, { useState, useMemo } from 'react';
import { BusinessPlanData, RoadmapItem } from '@/lib/data/business-plan-service';
import { CURRENT_APP_FEATURES } from '@/lib/data/business-plan-constants';
import { Plus, Trash2, Edit2, AlertCircle, ArrowRight, Sparkles, Check } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ProductRoadmapSectionProps {
    data: BusinessPlanData;
    onChange: (newData: BusinessPlanData) => void;
}

export function ProductRoadmapSection({ data, onChange }: ProductRoadmapSectionProps) {
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<RoadmapItem>>({});

    // Ensure we are working with an array. If it's a string (legacy), we shouldn't really be here due to service migration,
    // but just in case, we wrap it.
    const roadmapItems: RoadmapItem[] = Array.isArray(data.productRoadmap)
        ? data.productRoadmap
        : [{ id: 'legacy', feature: "Legacy Roadmap", status: 'planned', description: data.productRoadmap as string }];

    const handleAddItem = (preset?: Partial<RoadmapItem>) => {
        const newItem: RoadmapItem = {
            id: uuidv4(),
            feature: preset?.feature || "New Feature",
            status: preset?.status || 'idea',
            quarter: preset?.quarter || "Q3 2026",
            description: preset?.description || "Description of the new feature...",
            source: preset?.source || 'manual'
        };
        onChange({ ...data, productRoadmap: [...roadmapItems, newItem] });
        setIsEditing(newItem.id);
        setEditForm(newItem);
    };

    const handleDelete = (id: string) => {
        onChange({ ...data, productRoadmap: roadmapItems.filter(i => i.id !== id) });
    };

    const startEdit = (item: RoadmapItem) => {
        setIsEditing(item.id);
        setEditForm({ ...item });
    };

    const saveEdit = () => {
        if (!isEditing) return;
        const updated = roadmapItems.map(item =>
            item.id === isEditing ? { ...item, ...editForm } as RoadmapItem : item
        );
        onChange({ ...data, productRoadmap: updated });
        setIsEditing(null);
    };

    const cancelEdit = () => {
        setIsEditing(null);
        setEditForm({});
    };

    // GAP ANALYSIS LOGIC
    // 1. Get all unique competitor features
    // 2. Filter out ones that are roughly in CURRENT_APP_FEATURES
    // 3. Filter out ones already in Roadmap
    const missingFeatures = useMemo(() => {
        const competitors = data.marketStats?.competitors || [];
        const allCompetitorFeatures = new Set<string>();

        competitors.forEach(comp => {
            comp.features.forEach(f => allCompetitorFeatures.add(f));
        });

        // "Our" features normalized
        const ourFeaturesNorm = CURRENT_APP_FEATURES.map(f => f.toLowerCase());
        const roadmapFeaturesNorm = roadmapItems.map(i => i.feature.toLowerCase());

        const gaps: { feature: string, foundIn: string[] }[] = [];

        // Tokenizer helper
        const getTokens = (str: string) => str.toLowerCase().split(/[^\w]+/).filter(t => t.length > 3);

        allCompetitorFeatures.forEach(feat => {
            const featLower = feat.toLowerCase();
            const featTokens = getTokens(feat);

            // Check if we have it (Fuzzy Token Match)
            const weHave = ourFeaturesNorm.some(our => {
                // 1. Direct substring match
                if (our.includes(featLower) || featLower.includes(our)) return true;

                // 2. Token overlap (if competitor feature has significant words that match ours)
                // e.g. "Staffing" matches "Smart Staff Scheduling" via "staff" stem check? 
                // Simpler: Check if ANY significant token from competitor feature exists in our feature
                return featTokens.some(t => our.includes(t));
            });

            // Check if it's already in roadmap
            const inRoadmap = roadmapFeaturesNorm.some(r => {
                if (r.includes(featLower) || featLower.includes(r)) return true;
                return featTokens.some(t => r.includes(t));
            });

            if (!weHave && !inRoadmap) {
                // Find who has it
                const foundIn = competitors.filter(c => c.features.includes(feat)).map(c => c.name);
                gaps.push({ feature: feat, foundIn });
            }
        });

        return gaps;
    }, [data.marketStats?.competitors, roadmapItems]);


    return (
        <section id="section-roadmap" className="mb-16 bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-purple-100 scroll-mt-24">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b-2 border-purple-100 flex items-center">
                <span className="bg-purple-100 text-purple-600 rounded-full w-10 h-10 flex items-center justify-center mr-4 text-xl">🗺️</span>
                Product Roadmap
            </h2>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Roadmap List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-700">Planned Features</h3>
                        <button
                            onClick={() => handleAddItem()}
                            className="flex items-center gap-2 text-purple-600 hover:bg-purple-50 px-3 py-1 rounded transition-colors text-sm font-medium"
                        >
                            <Plus className="w-4 h-4" /> Add Item
                        </button>
                    </div>

                    <div className="space-y-4">
                        {roadmapItems.map(item => (
                            <div key={item.id} className={`p-4 rounded-xl border transition-all ${isEditing === item.id ? 'border-purple-400 bg-purple-50/50 ring-2 ring-purple-100' : 'border-gray-100 bg-white hover:shadow-md'}`}>
                                {isEditing === item.id ? (
                                    <div className="space-y-3">
                                        <div className="flex gap-2">
                                            <input
                                                className="flex-1 px-3 py-2 rounded border border-gray-200 focus:outline-none focus:border-purple-400 font-bold"
                                                value={editForm.feature}
                                                onChange={e => setEditForm({ ...editForm, feature: e.target.value })}
                                                placeholder="Feature Name"
                                            />
                                            <select
                                                className="px-3 py-2 rounded border border-gray-200 focus:outline-none focus:border-purple-400 text-sm"
                                                value={editForm.status}
                                                onChange={e => setEditForm({ ...editForm, status: e.target.value as any })}
                                            >
                                                <option value="idea">Idea</option>
                                                <option value="planned">Planned</option>
                                                <option value="in-progress">In Progress</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                        </div>
                                        <input
                                            className="w-full px-3 py-2 rounded border border-gray-200 focus:outline-none focus:border-purple-400 text-sm"
                                            value={editForm.quarter}
                                            onChange={e => setEditForm({ ...editForm, quarter: e.target.value })}
                                            placeholder="Expected Release (e.g. Q3 2024)"
                                        />
                                        <textarea
                                            className="w-full px-3 py-2 rounded border border-gray-200 focus:outline-none focus:border-purple-400 text-sm h-20"
                                            value={editForm.description}
                                            onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                            placeholder="Description..."
                                        />
                                        <div className="flex justify-end gap-2 text-sm">
                                            <button onClick={cancelEdit} className="text-gray-500 hover:text-gray-700 px-3 py-1">Cancel</button>
                                            <button onClick={saveEdit} className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700">Save</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-start group">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-gray-800">{item.feature}</h4>
                                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${item.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    item.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                                        item.status === 'planned' ? 'bg-purple-100 text-purple-700' :
                                                            'bg-gray-100 text-gray-500'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                                {item.source === 'gap-analysis' && (
                                                    <span title="Added from Gap Analysis" className="bg-yellow-50 text-yellow-600 p-0.5 rounded">
                                                        <Sparkles className="w-3 h-3" />
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                                            <p className="text-xs text-purple-600 font-medium">{item.quarter}</p>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => startEdit(item)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Gap Analysis Sidebar */}
                <div className="lg:col-span-1 bg-yellow-50/50 border border-yellow-100 rounded-xl p-5 h-fit">
                    <div className="flex items-center gap-2 mb-4 text-yellow-800 font-bold">
                        <AlertCircle className="w-5 h-5" />
                        <h3>Missing Features</h3>
                    </div>

                    <div className="text-xs text-yellow-700 mb-4 opacity-80">
                        Features your competitors have that are missing from your current feature set and roadmap.
                    </div>

                    <div className="space-y-3">
                        {missingFeatures.length > 0 ? missingFeatures.map((gap, idx) => (
                            <div key={idx} className="bg-white p-3 rounded-lg border border-yellow-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="font-bold text-gray-800 text-sm mb-1">{gap.feature}</div>
                                <div className="text-xs text-gray-500 mb-2">
                                    Seen in: {gap.foundIn.join(', ')}
                                </div>
                                <button
                                    onClick={() => handleAddItem({
                                        feature: gap.feature,
                                        description: `Competitor parity feature. Implemented by ${gap.foundIn.join(', ')}.`,
                                        source: 'gap-analysis',
                                        status: 'idea'
                                    })}
                                    className="w-full flex items-center justify-center gap-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-xs font-bold py-1.5 rounded transition-colors"
                                >
                                    <Plus className="w-3 h-3" /> Add to Roadmap
                                </button>
                            </div>
                        )) : (
                            <div className="text-center py-8 text-gray-400 text-sm">
                                <Check className="w-8 h-8 mx-auto mb-2 text-green-400 opacity-50" />
                                No major gaps found!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
