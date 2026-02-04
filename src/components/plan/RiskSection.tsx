'use client';

import { useState, useMemo } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BusinessPlanData, RiskItem } from '@/lib/business-plan-service';
import { EditableCard } from './EditableCard';
import { CategoryFilter } from './CategoryFilter';
import { AlertTriangle, Plus, Shield } from 'lucide-react';

interface RiskSectionProps {
    data: BusinessPlanData;
    onChange?: (data: BusinessPlanData) => void;
}

const CATEGORIES = [
    { id: 'market', label: 'Market Risk', color: 'bg-orange-600' },
    { id: 'financial', label: 'Financial', color: 'bg-red-600' },
    { id: 'operational', label: 'Operational', color: 'bg-amber-600' },
    { id: 'technical', label: 'Technical', color: 'bg-purple-600' },
    { id: 'legal', label: 'Legal/Compliance', color: 'bg-blue-600' },
    { id: 'competitive', label: 'Competitive', color: 'bg-pink-600' }
];

const PROBABILITY_LEVELS = [
    { value: 1, label: 'Very Low', desc: '10%', color: 'bg-emerald-600' },
    { value: 2, label: 'Low', desc: '25%', color: 'bg-green-600' },
    { value: 3, label: 'Medium', desc: '50%', color: 'bg-amber-600' },
    { value: 4, label: 'High', desc: '75%', color: 'bg-orange-600' },
    { value: 5, label: 'Very High', desc: '90%', color: 'bg-red-600' }
];

const IMPACT_LEVELS = [
    { value: 1, label: 'Minimal', desc: 'Minor inconvenience' },
    { value: 2, label: 'Low', desc: 'Some setbacks' },
    { value: 3, label: 'Moderate', desc: 'Significant impact' },
    { value: 4, label: 'High', desc: 'Major damage' },
    { value: 5, label: 'Critical', desc: 'Business threatening' }
];

const MITIGATION_STATUS = [
    { value: 'none', label: 'No Plan Yet', color: 'bg-gray-600' },
    { value: 'planned', label: 'Plan Ready', color: 'bg-blue-600' },
    { value: 'active', label: 'Actively Mitigating', color: 'bg-amber-600' },
    { value: 'resolved', label: 'Resolved', color: 'bg-green-600' }
];

function SortableRiskCard({ risk, onUpdate, onDelete }: {
    risk: RiskItem;
    onUpdate: (field: string, value: any) => void;
    onDelete: () => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: risk.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const category = CATEGORIES.find(c => c.id === risk.category);
    const riskScore = risk.probability * risk.impact;
    const severity = riskScore >= 20 ? 'CRITICAL' : riskScore >= 12 ? 'HIGH' : riskScore >= 6 ? 'MEDIUM' : 'LOW';
    const severityColor = riskScore >= 20 ? 'text-red-400' : riskScore >= 12 ? 'text-orange-400' : riskScore >= 6 ? 'text-amber-400' : 'text-green-400';
    const mitigationStatus = MITIGATION_STATUS.find(s => s.value === risk.mitigationStatus);

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <EditableCard
                id={risk.id}
                title={risk.name}
                description={risk.description}
                category={category}
                badge={mitigationStatus?.label || 'RISK'}
                isDragging={isDragging}
                dragHandleProps={listeners}
                onUpdate={onUpdate}
                onDelete={onDelete}
            >
                {/* Risk Score Matrix */}
                <div className={`rounded-lg p-4 mb-4 border ${riskScore >= 20 ? 'bg-red-500/10 border-red-500/30' :
                        riskScore >= 12 ? 'bg-orange-500/10 border-orange-500/30' :
                            riskScore >= 6 ? 'bg-amber-500/10 border-amber-500/30' :
                                'bg-green-500/10 border-green-500/30'
                    }`}>
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <div className="text-xs text-zinc-500 mb-1">Risk Severity</div>
                            <div className={`text-2xl font-bold ${severityColor}`}>
                                {severity}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-zinc-500 mb-1">Risk Score</div>
                            <div className={`text-3xl font-bold ${severityColor}`}>
                                {riskScore}
                                <span className="text-sm text-zinc-500">/25</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-zinc-900/50 rounded p-2">
                            <span className="text-zinc-500">Probability:</span> <span className="font-bold text-zinc-200">{risk.probability}/5</span>
                        </div>
                        <div className="bg-zinc-900/50 rounded p-2">
                            <span className="text-zinc-500">Impact:</span> <span className="font-bold text-zinc-200">{risk.impact}/5</span>
                        </div>
                    </div>
                </div>

                {/* Probability Assessment */}
                <div className="mb-4">
                    <label className="text-xs font-medium text-zinc-500 mb-2 block flex items-center gap-2">
                        <span>📊</span> How likely is this to happen?
                    </label>
                    <div className="grid grid-cols-5 gap-1">
                        {PROBABILITY_LEVELS.map(level => (
                            <button
                                key={level.value}
                                onClick={() => onUpdate('probability', level.value)}
                                className={`px-2 py-3 rounded-lg text-xs font-medium border transition-all ${risk.probability === level.value
                                        ? `${level.color} text-white shadow-lg scale-105`
                                        : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                                    }`}
                            >
                                <div>{level.value}</div>
                                <div className="text-[10px] mt-1 opacity-70">{level.desc}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Impact Assessment */}
                <div className="mb-4">
                    <label className="text-xs font-medium text-zinc-500 mb-2 block flex items-center gap-2">
                        <span>💥</span> If it happens, how bad would it be?
                    </label>
                    <div className="grid grid-cols-5 gap-1">
                        {IMPACT_LEVELS.map(level => (
                            <button
                                key={level.value}
                                onClick={() => onUpdate('impact', level.value)}
                                className={`px-2 py-3 rounded-lg text-xs font-medium border transition-all ${risk.impact >= level.value
                                        ? 'bg-red-600 text-white shadow-lg'
                                        : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                                    }`}
                                title={level.desc}
                            >
                                {level.value}
                            </button>
                        ))}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">
                        {IMPACT_LEVELS.find(l => l.value === risk.impact)?.desc || 'Select impact level'}
                    </div>
                </div>

                {/* Mitigation Plan */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
                    <label className="text-xs font-medium text-blue-400 mb-2 block flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5" /> How will you prevent/handle this?
                    </label>
                    <textarea
                        value={risk.mitigation}
                        onChange={(e) => onUpdate('mitigation', e.target.value)}
                        placeholder="Describe your mitigation strategy:&#10;• Preventive actions&#10;• Contingency plans&#10;• Response procedures"
                        rows={4}
                        className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700 rounded text-sm text-zinc-200 focus:outline-none focus:border-blue-500 resize-none"
                    />
                </div>

                {/* Status and Category */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div>
                        <label className="text-xs font-medium text-zinc-500 mb-2 block">
                            Mitigation Status
                        </label>
                        <div className="flex flex-col gap-2">
                            {MITIGATION_STATUS.map(status => (
                                <button
                                    key={status.value}
                                    onClick={() => onUpdate('mitigationStatus', status.value)}
                                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${risk.mitigationStatus === status.value
                                            ? `${status.color} text-white shadow-lg`
                                            : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                                        }`}
                                >
                                    {status.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-zinc-500 mb-2 block">
                            Risk Category
                        </label>
                        <select
                            value={risk.category}
                            onChange={(e) => onUpdate('category', e.target.value)}
                            className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-indigo-500"
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </EditableCard>
        </div>
    );
}

export function RiskSection({ data, onChange }: RiskSectionProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const risks = data.riskItems || [];

    // Category counts
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        risks.forEach((risk: RiskItem) => {
            counts[risk.category] = (counts[risk.category] || 0) + 1;
        });
        return counts;
    }, [risks]);

    // Filtered risks
    const filteredRisks = useMemo(() => {
        if (selectedCategory === 'all') return risks;
        return risks.filter((r: RiskItem) => r.category === selectedCategory);
    }, [risks, selectedCategory]);

    // Sort by risk score (descending) for display
    const sortedRisks = useMemo(() => {
        return [...filteredRisks].sort((a: RiskItem, b: RiskItem) => {
            const scoreA = a.probability * a.impact;
            const scoreB = b.probability * b.impact;
            return scoreB - scoreA;
        });
    }, [filteredRisks]);

    // Risk stats
    const criticalRisks = risks.filter((r: RiskItem) => r.probability * r.impact >= 20).length;
    const highRisks = risks.filter((r: RiskItem) => {
        const score = r.probability * r.impact;
        return score >= 12 && score < 20;
    }).length;
    const mitigatedRisks = risks.filter((r: RiskItem) => r.mitigationStatus === 'resolved').length;

    // Drag and drop sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = sortedRisks.findIndex((r: RiskItem) => r.id === active.id);
            const newIndex = sortedRisks.findIndex((r: RiskItem) => r.id === over.id);

            const reordered = arrayMove(risks, oldIndex, newIndex).map((r, idx) => ({
                ...r,
                order: idx
            }));

            onChange?.({
                ...data,
                riskItems: reordered
            });
        }
    };

    const handleAdd = () => {
        const newRisk: RiskItem = {
            id: crypto.randomUUID(),
            name: 'New risk - click to edit',
            description: '',
            category: 'market',
            probability: 3,
            impact: 3,
            mitigation: '',
            mitigationStatus: 'none',
            order: risks.length
        };

        onChange?.({
            ...data,
            riskItems: [...risks, newRisk]
        });
    };

    const handleUpdate = (id: string, field: string, value: any) => {
        const updated = risks.map((r: RiskItem) =>
            r.id === id ? { ...r, [field]: value } : r
        );

        onChange?.({
            ...data,
            riskItems: updated
        });
    };

    const handleDelete = (id: string) => {
        const filtered = risks.filter((r: RiskItem) => r.id !== id);
        const reindexed = filtered.map((r, idx) => ({ ...r, order: idx }));

        onChange?.({
            ...data,
            riskItems: reindexed
        });
    };

    return (
        <div className="bg-zinc-900/20 rounded-2xl border border-white/5 overflow-hidden">
            {/* Header */}
            <div className="bg-zinc-900/50 backdrop-blur-sm border-b border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-500/20 border border-red-500/30 p-3 rounded-xl">
                            <AlertTriangle className="w-6 h-6 text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-zinc-100">Risk Management</h2>
                            <p className="text-sm text-zinc-400 mt-1">Identify and mitigate potential threats</p>
                        </div>
                    </div>
                    {onChange && (
                        <button
                            onClick={handleAdd}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors text-sm font-medium shadow-lg hover:shadow-red-500/25"
                        >
                            <Plus className="w-4 h-4" />
                            Add Risk
                        </button>
                    )}
                </div>

                {/* Summary Stats */}
                {risks.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        <div className="bg-zinc-800/30 rounded-lg p-3 border border-white/5">
                            <div className="text-xs text-zinc-500 mb-1">Total Risks</div>
                            <div className="text-2xl font-bold text-zinc-200">{risks.length}</div>
                        </div>
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                            <div className="text-xs text-red-400 mb-1">🚨 Critical</div>
                            <div className="text-2xl font-bold text-red-400">{criticalRisks}</div>
                        </div>
                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                            <div className="text-xs text-orange-400 mb-1">⚠️ High</div>
                            <div className="text-2xl font-bold text-orange-400">{highRisks}</div>
                        </div>
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                            <div className="text-xs text-green-400 mb-1">✓ Mitigated</div>
                            <div className="text-2xl font-bold text-green-400">{mitigatedRisks}</div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6">
                {/* Category Filter */}
                <CategoryFilter
                    categories={CATEGORIES}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    counts={categoryCounts}
                />

                {/* Risks List */}
                {sortedRisks.length > 0 ? (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={sortedRisks.map((r: RiskItem) => r.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {sortedRisks.map((risk: RiskItem) => (
                                    <SortableRiskCard
                                        key={risk.id}
                                        risk={risk}
                                        onUpdate={(field, value) => handleUpdate(risk.id, field, value)}
                                        onDelete={() => handleDelete(risk.id)}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                ) : (
                    <div className="bg-zinc-900/40 backdrop-blur-sm rounded-lg p-8 text-center border-2 border-dashed border-white/10">
                        <AlertTriangle className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                        <p className="text-zinc-300 font-medium mb-1">No risks identified</p>
                        <p className="text-sm text-zinc-400 mb-4">What could go wrong with your business?</p>
                        {onChange && (
                            <button
                                onClick={handleAdd}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors text-sm font-medium shadow-lg hover:shadow-red-500/25"
                            >
                                <Plus className="w-4 h-4" />
                                Add First Risk
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
