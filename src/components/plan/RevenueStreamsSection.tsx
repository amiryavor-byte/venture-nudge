'use client';

import { useState, useMemo } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BusinessPlanData, RevenueStream } from '@/lib/business-plan-service';
import { EditableCard } from './EditableCard';
import { CategoryFilter } from './CategoryFilter';
import { DollarSign, Plus, TrendingUp } from 'lucide-react';

interface RevenueStreamsSectionProps {
    data: BusinessPlanData;
    onChange?: (data: BusinessPlanData) => void;
}

const CATEGORIES = [
    { id: 'direct', label: 'Direct Sales', color: 'bg-green-600' },
    { id: 'subscription', label: 'Subscription', color: 'bg-blue-600' },
    { id: 'advertising', label: 'Advertising', color: 'bg-purple-600' },
    { id: 'commission', label: 'Commission', color: 'bg-amber-600' },
    { id: 'licensing', label: 'Licensing', color: 'bg-pink-600' },
    { id: 'other', label: 'Other', color: 'bg-gray-600' }
];

const PRICING_MODELS = [
    'One-time purchase',
    'Monthly subscription',
    'Annual subscription',
    'Per-user pricing',
    'Usage-based',
    'Tiered pricing',
    'Freemium',
    'Commission (%)',
    'Revenue share',
    'Custom'
];

function SortableRevenueCard({ stream, onUpdate, onDelete }: {
    stream: RevenueStream;
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
    } = useSortable({ id: stream.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const category = CATEGORIES.find(c => c.id === stream.category);
    const projectedRevenue = (stream.averagePrice || 0) * (stream.expectedVolume || 0);
    const contributionPercent = stream.contributionPercent || 0;

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <EditableCard
                id={stream.id}
                title={stream.name}
                description={stream.description}
                category={category}
                badge={`${contributionPercent}% of Revenue`}
                isDragging={isDragging}
                dragHandleProps={listeners}
                onUpdate={onUpdate}
                onDelete={onDelete}
            >
                {/* Projected Revenue */}
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
                    <div className="text-xs text-zinc-500 mb-2">Projected Annual Revenue</div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-green-400">
                            ${projectedRevenue.toLocaleString()}
                        </span>
                        <span className="text-sm text-zinc-400">per year</span>
                    </div>
                    <div className="text-xs text-zinc-500 mt-2">
                        = ${(stream.averagePrice || 0).toLocaleString()} × {(stream.expectedVolume || 0).toLocaleString()} {stream.pricingModel.includes('subscription') ? 'subscribers' : 'sales'}
                    </div>
                </div>

                {/* Revenue Mix Contribution */}
                <div className="mb-4">
                    <label className="text-xs font-medium text-zinc-500 mb-2 block">
                        % of Total Revenue Mix
                    </label>
                    <div className="flex items-center gap-3">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={contributionPercent}
                            onChange={(e) => onUpdate('contributionPercent', parseFloat(e.target.value))}
                            className="flex-1"
                        />
                        <div className="text-2xl font-bold text-indigo-400 w-16 text-right">
                            {contributionPercent}%
                        </div>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mt-2">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                            style={{ width: `${contributionPercent}%` }}
                        />
                    </div>
                </div>

                {/* Pricing Model */}
                <div className="mb-4">
                    <label className="text-xs font-medium text-zinc-500 mb-2 block">
                        How do you charge?
                    </label>
                    <select
                        value={stream.pricingModel}
                        onChange={(e) => onUpdate('pricingModel', e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-indigo-500"
                    >
                        {PRICING_MODELS.map(model => (
                            <option key={model} value={model}>{model}</option>
                        ))}
                    </select>
                </div>

                {/* Pricing Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-xs font-medium text-zinc-500 mb-2 block">
                            Average Price Point
                        </label>
                        <div className="flex items-center gap-2 bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2">
                            <span className="text-green-400">$</span>
                            <input
                                type="number"
                                value={stream.averagePrice}
                                onChange={(e) => onUpdate('averagePrice', parseFloat(e.target.value) || 0)}
                                className="flex-1 bg-transparent text-sm text-zinc-200 focus:outline-none"
                                placeholder="99"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-zinc-500 mb-2 block">
                            Expected Volume/Year
                        </label>
                        <input
                            type="number"
                            value={stream.expectedVolume}
                            onChange={(e) => onUpdate('expectedVolume', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-indigo-500"
                            placeholder="1000"
                        />
                    </div>
                </div>

                {/* Category Selection */}
                <div className="pt-4 border-t border-white/5">
                    <label className="text-xs font-medium text-zinc-500 mb-2 block">
                        Revenue Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => onUpdate('category', cat.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${stream.category === cat.id
                                        ? `${cat.color} text-white shadow-lg`
                                        : 'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:border-zinc-600'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </EditableCard>
        </div>
    );
}

export function RevenueStreamsSection({ data, onChange }: RevenueStreamsSectionProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const streams = data.revenueStreams || [];

    // Category counts
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        streams.forEach((stream: RevenueStream) => {
            counts[stream.category] = (counts[stream.category] || 0) + 1;
        });
        return counts;
    }, [streams]);

    // Filtered streams
    const filteredStreams = useMemo(() => {
        if (selectedCategory === 'all') return streams;
        return streams.filter((s: RevenueStream) => s.category === selectedCategory);
    }, [streams, selectedCategory]);

    // Revenue stats
    const totalProjectedRevenue = streams.reduce((sum: number, s: RevenueStream) => {
        return sum + ((s.averagePrice || 0) * (s.expectedVolume || 0));
    }, 0);

    const totalContribution = streams.reduce((sum: number, s: RevenueStream) => {
        return sum + (s.contributionPercent || 0);
    }, 0);

    const contributionWarning = totalContribution !== 100;

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
            const oldIndex = streams.findIndex((s: RevenueStream) => s.id === active.id);
            const newIndex = streams.findIndex((s: RevenueStream) => s.id === over.id);

            const reordered = arrayMove(streams, oldIndex, newIndex).map((s, idx) => ({
                ...s,
                order: idx
            }));

            onChange?.({
                ...data,
                revenueStreams: reordered
            });
        }
    };

    const handleAdd = () => {
        const newStream: RevenueStream = {
            id: crypto.randomUUID(),
            name: 'New revenue stream - click to edit',
            description: '',
            category: 'direct',
            pricingModel: 'One-time purchase',
            averagePrice: 0,
            expectedVolume: 0,
            contributionPercent: 0,
            order: streams.length
        };

        onChange?.({
            ...data,
            revenueStreams: [...streams, newStream]
        });
    };

    const handleUpdate = (id: string, field: string, value: any) => {
        const updated = streams.map((s: RevenueStream) =>
            s.id === id ? { ...s, [field]: value } : s
        );

        onChange?.({
            ...data,
            revenueStreams: updated
        });
    };

    const handleDelete = (id: string) => {
        const filtered = streams.filter((s: RevenueStream) => s.id !== id);
        const reindexed = filtered.map((s, idx) => ({ ...s, order: idx }));

        onChange?.({
            ...data,
            revenueStreams: reindexed
        });
    };

    return (
        <div className="bg-zinc-900/20 rounded-2xl border border-white/5 overflow-hidden">
            {/* Header */}
            <div className="bg-zinc-900/50 backdrop-blur-sm border-b border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-500/20 border border-green-500/30 p-3 rounded-xl">
                            <DollarSign className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-zinc-100">Revenue Streams</h2>
                            <p className="text-sm text-zinc-400 mt-1">How you'll make money</p>
                        </div>
                    </div>
                    {onChange && (
                        <button
                            onClick={handleAdd}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors text-sm font-medium shadow-lg hover:shadow-green-500/25"
                        >
                            <Plus className="w-4 h-4" />
                            Add Stream
                        </button>
                    )}
                </div>

                {/* Summary Stats */}
                {streams.length > 0 && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <TrendingUp className="w-4 h-4 text-green-400" />
                                    <div className="text-xs text-green-400">Projected Annual Revenue</div>
                                </div>
                                <div className="text-3xl font-bold text-green-400">
                                    ${totalProjectedRevenue.toLocaleString()}
                                </div>
                            </div>

                            <div className={`rounded-lg p-4 border ${contributionWarning
                                    ? 'bg-amber-500/10 border-amber-500/20'
                                    : 'bg-blue-500/10 border-blue-500/20'
                                }`}>
                                <div className="text-xs text-zinc-400 mb-1">Revenue Mix Total</div>
                                <div className={`text-3xl font-bold ${contributionWarning ? 'text-amber-400' : 'text-blue-400'
                                    }`}>
                                    {totalContribution}%
                                </div>
                                {contributionWarning && (
                                    <div className="text-xs text-amber-400 mt-1">
                                        ⚠️ Should total 100%
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Visual Revenue Mix */}
                        <div>
                            <div className="text-xs text-zinc-500 mb-2">Revenue Mix Breakdown</div>
                            <div className="h-4 bg-zinc-800 rounded-full overflow-hidden flex">
                                {streams.map((stream: RevenueStream, idx: number) => {
                                    const category = CATEGORIES.find(c => c.id === stream.category);
                                    return (
                                        <div
                                            key={stream.id}
                                            className={`${category?.color || 'bg-gray-600'} transition-all hover:opacity-80`}
                                            style={{ width: `${stream.contributionPercent}%` }}
                                            title={`${stream.name}: ${stream.contributionPercent}%`}
                                        />
                                    );
                                })}
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {streams.map((stream: RevenueStream) => {
                                    const category = CATEGORIES.find(c => c.id === stream.category);
                                    return (
                                        <div key={stream.id} className="flex items-center gap-2 text-xs">
                                            <div className={`w-3 h-3 rounded-full ${category?.color}`} />
                                            <span className="text-zinc-400">{stream.name}</span>
                                            <span className="font-bold text-zinc-200">{stream.contributionPercent}%</span>
                                        </div>
                                    );
                                })}
                            </div>
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

                {/* Streams List */}
                {filteredStreams.length > 0 ? (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={filteredStreams.map((s: RevenueStream) => s.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredStreams.map((stream: RevenueStream) => (
                                    <SortableRevenueCard
                                        key={stream.id}
                                        stream={stream}
                                        onUpdate={(field, value) => handleUpdate(stream.id, field, value)}
                                        onDelete={() => handleDelete(stream.id)}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                ) : (
                    <div className="bg-zinc-900/40 backdrop-blur-sm rounded-lg p-8 text-center border-2 border-dashed border-white/10">
                        <DollarSign className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                        <p className="text-zinc-300 font-medium mb-1">No revenue streams defined</p>
                        <p className="text-sm text-zinc-400 mb-4">How will your business generate income?</p>
                        {onChange && (
                            <button
                                onClick={handleAdd}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors text-sm font-medium shadow-lg hover:shadow-green-500/25"
                            >
                                <Plus className="w-4 h-4" />
                                Add First Stream
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
