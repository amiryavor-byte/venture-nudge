'use client';

import { useState, useMemo } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BusinessPlanData, Competitor } from '@/lib/business-plan-service';
import { structuredListUtils } from '@/lib/structured-list-utils';
import { Target, Plus, ExternalLink, GripVertical, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface CompetitiveSectionProps {
    data: BusinessPlanData;
    onChange?: (data: BusinessPlanData) => void;
}

// Market Position definitions
const MARKET_POSITIONS = [
    { id: 'leader', label: 'Leader', emoji: '👑', color: 'bg-red-600' },
    { id: 'challenger', label: 'Challenger', emoji: '⚔️', color: 'bg-orange-600' },
    { id: 'niche', label: 'Niche', emoji: '🎯', color: 'bg-blue-600' },
    { id: 'emerging', label: 'Emerging', emoji: '🌱', color: 'bg-green-600' }
] as const;

function SortableCompetitorCard({ competitor, onUpdate, onDelete }: {
    competitor: Competitor;
    onUpdate: (field: string, value: any) => void;
    onDelete: () => void;
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: competitor.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const position = MARKET_POSITIONS.find(p => p.id === competitor.marketPosition);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-zinc-900/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden transition-all ${isDragging ? 'opacity-50 scale-95' : 'hover:border-white/20'
                }`}
        >
            {/* Header */}
            <div className="p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-start justify-between gap-3">
                    {/* Drag Handle */}
                    <button
                        {...attributes}
                        {...listeners}
                        className="mt-1 text-zinc-600 hover:text-zinc-400 cursor-grab active:cursor-grabbing"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <GripVertical className="w-4 h-4" />
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {/* Position Badge & Threat Level */}
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className={`${position?.color} text-white text-xs font-bold px-2 py-1 rounded uppercase`}>
                                {position?.emoji} {position?.label}
                            </span>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map(level => (
                                    <span
                                        key={level}
                                        className={`text-xs ${level <= competitor.threatLevel ? 'text-yellow-400' : 'text-zinc-700'}`}
                                    >
                                        ★
                                    </span>
                                ))}
                                <span className="text-xs text-zinc-500 ml-1">
                                    Threat Level {competitor.threatLevel}/5
                                </span>
                            </div>
                        </div>

                        {/* Competitor Name */}
                        <h3 className="text-lg font-bold text-zinc-100 mb-1">{competitor.name}</h3>

                        {/* Target Market Preview */}
                        {competitor.targetMarket && (
                            <p className="text-sm text-zinc-400 line-clamp-1">
                                <span className="text-zinc-500">Target:</span> {competitor.targetMarket}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                            className="text-zinc-500 hover:text-red-400 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-zinc-500" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-zinc-500" />
                        )}
                    </div>
                </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
                <div className="px-4 pb-4 space-y-4 border-t border-white/5">
                    {/* Name Field */}
                    <div className="pt-4">
                        <label className="text-xs font-medium text-zinc-500 mb-2 block">
                            Competitor Name
                        </label>
                        <input
                            type="text"
                            value={competitor.name}
                            onChange={(e) => onUpdate('name', e.target.value)}
                            placeholder="e.g., LivePlan, Enloop, IdeaBuddy"
                            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>

                    {/* Market Position & Threat Level */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-zinc-500 mb-2 block">
                                Market Position
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {MARKET_POSITIONS.map(pos => (
                                    <button
                                        key={pos.id}
                                        onClick={() => onUpdate('marketPosition', pos.id)}
                                        className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${competitor.marketPosition === pos.id
                                            ? `${pos.color} border-white/20 text-white`
                                            : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                                            }`}
                                    >
                                        {pos.emoji} {pos.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-zinc-500 mb-2 block">
                                Threat Level
                            </label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(level => (
                                    <button
                                        key={level}
                                        onClick={() => onUpdate('threatLevel', level)}
                                        className={`flex-1 h-10 rounded-lg border transition-all ${competitor.threatLevel >= level
                                            ? 'bg-yellow-500 border-yellow-400 text-zinc-900 font-bold'
                                            : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:border-zinc-600'
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Target Market */}
                    <div>
                        <label className="text-xs font-medium text-zinc-500 mb-2 block">
                            Who do they serve?
                        </label>
                        <input
                            type="text"
                            value={competitor.targetMarket}
                            onChange={(e) => onUpdate('targetMarket', e.target.value)}
                            placeholder="e.g., Mid-market businesses, Startups, Enterprise"
                            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>

                    {/* Strengths */}
                    <div>
                        <label className="text-xs font-medium text-zinc-500 mb-2 block">
                            ✅ What makes them strong?
                        </label>
                        <textarea
                            value={competitor.strengths}
                            onChange={(e) => onUpdate('strengths', e.target.value)}
                            placeholder="e.g., 1000+ integrations, strong brand recognition, established market presence"
                            rows={3}
                            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-green-500 transition-colors resize-none"
                        />
                    </div>

                    {/* Weaknesses */}
                    <div>
                        <label className="text-xs font-medium text-zinc-500 mb-2 block">
                            ⚠️ Where are they weak?
                        </label>
                        <textarea
                            value={competitor.weaknesses}
                            onChange={(e) => onUpdate('weaknesses', e.target.value)}
                            placeholder="e.g., High pricing, complex user interface, slow innovation"
                            rows={3}
                            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                        />
                    </div>

                    {/* Our Advantage */}
                    <div>
                        <label className="text-xs font-medium text-zinc-500 mb-2 block">
                            💪 How do we beat them?
                        </label>
                        <textarea
                            value={competitor.ourAdvantage}
                            onChange={(e) => onUpdate('ourAdvantage', e.target.value)}
                            placeholder="e.g., AI-driven insights at half the price, simpler UX, faster implementation"
                            rows={3}
                            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                        />
                    </div>

                    {/* Pricing & Website */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-zinc-500 mb-2 block">
                                💵 Their Pricing
                            </label>
                            <input
                                type="text"
                                value={competitor.pricing || ''}
                                onChange={(e) => onUpdate('pricing', e.target.value)}
                                placeholder="e.g., $50/month, $600/year"
                                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-green-500 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium text-zinc-500 mb-2 block">
                                🌐 Website
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={competitor.website || ''}
                                    onChange={(e) => onUpdate('website', e.target.value)}
                                    placeholder="e.g., liveplan.com"
                                    className="flex-1 bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                                />
                                {competitor.website && (
                                    <a
                                        href={`https://${competitor.website.replace(/^https?:\/\//, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4 text-zinc-400" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export function CompetitiveSection({ data, onChange }: CompetitiveSectionProps) {
    const [selectedPosition, setSelectedPosition] = useState<string>('all');

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // Migrate legacy data if needed
    const competitors = useMemo(() => {
        if (data.competitors && data.competitors.length > 0) {
            return data.competitors;
        }
        // If no structured data, return empty array (user will add manually)
        return [];
    }, [data.competitors]);

    // Filter by market position
    const filteredCompetitors = useMemo(() => {
        if (selectedPosition === 'all') return competitors;
        return competitors.filter(c => c.marketPosition === selectedPosition);
    }, [competitors, selectedPosition]);

    // Sort by threat level (highest first)
    const sortedCompetitors = useMemo(() => {
        return [...filteredCompetitors].sort((a, b) => b.threatLevel - a.threatLevel);
    }, [filteredCompetitors]);

    // Summary stats
    const stats = useMemo(() => {
        const leaders = competitors.filter(c => c.marketPosition === 'leader').length;
        const challengers = competitors.filter(c => c.marketPosition === 'challenger').length;
        const highThreat = competitors.filter(c => c.threatLevel >= 4).length;

        return { leaders, challengers, highThreat };
    }, [competitors]);

    const handleAdd = () => {
        if (!onChange) return;

        const newCompetitor: Competitor = {
            id: `competitor-${Date.now()}`,
            name: 'New Competitor',
            marketPosition: 'challenger',
            threatLevel: 3,
            strengths: '',
            weaknesses: '',
            targetMarket: '',
            ourAdvantage: '',
            order: competitors.length
        };

        onChange({
            ...data,
            competitors: [...competitors, newCompetitor]
        });
    };

    const handleUpdate = (id: string, field: string, value: any) => {
        if (!onChange) return;

        const updated = competitors.map(comp =>
            comp.id === id ? { ...comp, [field]: value } : comp
        );

        onChange({
            ...data,
            competitors: updated
        });
    };

    const handleDelete = (id: string) => {
        if (!onChange) return;

        const updated = competitors.filter(comp => comp.id !== id);

        onChange({
            ...data,
            competitors: updated
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        if (!onChange) return;

        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = sortedCompetitors.findIndex(c => c.id === active.id);
        const newIndex = sortedCompetitors.findIndex(c => c.id === over.id);

        const reordered = arrayMove(sortedCompetitors, oldIndex, newIndex).map((comp, idx) => ({
            ...comp,
            order: idx
        }));

        onChange({
            ...data,
            competitors: reordered
        });
    };

    return (
        <div className="bg-zinc-900/20 rounded-2xl border border-white/5 overflow-hidden">
            {/* Header */}
            <div className="bg-zinc-900/50 backdrop-blur-sm border-b border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-500/20 border border-indigo-500/30 p-3 rounded-xl">
                            <Target className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-zinc-100">Competitive Analysis</h2>
                            <p className="text-sm text-zinc-400 mt-1">Map your competitive landscape</p>
                        </div>
                    </div>
                    {onChange && (
                        <button
                            onClick={handleAdd}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors text-sm font-medium shadow-lg hover:shadow-indigo-500/25"
                        >
                            <Plus className="w-4 h-4" />
                            Add Competitor
                        </button>
                    )}
                </div>

                {/* Summary Stats */}
                {competitors.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        <div className="bg-zinc-800/30 rounded-lg p-3 border border-white/5">
                            <div className="text-xs text-zinc-500 mb-1">Total</div>
                            <div className="text-2xl font-bold text-zinc-200">{competitors.length}</div>
                        </div>
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                            <div className="text-xs text-red-400 mb-1">👑 Leaders</div>
                            <div className="text-2xl font-bold text-red-400">{stats.leaders}</div>
                        </div>
                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                            <div className="text-xs text-orange-400 mb-1">⚔️ Challengers</div>
                            <div className="text-2xl font-bold text-orange-400">{stats.challengers}</div>
                        </div>
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                            <div className="text-xs text-yellow-400 mb-1">⚠️ High Threat</div>
                            <div className="text-2xl font-bold text-yellow-400">{stats.highThreat}</div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6">
                {/* Market Position Filter */}
                {competitors.length > 0 && (
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedPosition('all')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedPosition === 'all'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                    }`}
                            >
                                All ({competitors.length})
                            </button>
                            {MARKET_POSITIONS.map(pos => {
                                const count = competitors.filter(c => c.marketPosition === pos.id).length;
                                return (
                                    <button
                                        key={pos.id}
                                        onClick={() => setSelectedPosition(pos.id)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedPosition === pos.id
                                            ? `${pos.color} text-white`
                                            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                            }`}
                                    >
                                        {pos.emoji} {pos.label} ({count})
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Competitors List */}
                {sortedCompetitors.length > 0 ? (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={sortedCompetitors.map(c => c.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-4">
                                {sortedCompetitors.map((competitor) => (
                                    <SortableCompetitorCard
                                        key={competitor.id}
                                        competitor={competitor}
                                        onUpdate={(field, value) => handleUpdate(competitor.id, field, value)}
                                        onDelete={() => handleDelete(competitor.id)}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                ) : (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
                            <Target className="w-8 h-8 text-indigo-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-zinc-300 mb-2">
                            No competitors identified yet
                        </h3>
                        <p className="text-sm text-zinc-500 mb-6 max-w-md mx-auto">
                            Add competitors to track their strengths, weaknesses, and how you differentiate from them
                        </p>
                        {onChange && (
                            <button
                                onClick={handleAdd}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors font-medium"
                            >
                                <Plus className="w-5 h-5" />
                                Add First Competitor
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
