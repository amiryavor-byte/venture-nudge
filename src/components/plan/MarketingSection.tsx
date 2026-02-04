'use client';

import { useState, useMemo } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BusinessPlanData, MarketingChannel } from '@/lib/business-plan-service';
import { EditableCard } from './EditableCard';
import { CategoryFilter } from './CategoryFilter';
import { Megaphone, Plus, TrendingUp, DollarSign, Users } from 'lucide-react';

interface MarketingSectionProps {
    data: BusinessPlanData;
    onChange?: (data: BusinessPlanData) => void;
}

const CATEGORIES = [
    { id: 'paid', label: 'Paid Ads', color: 'bg-red-600' },
    { id: 'organic', label: 'Organic', color: 'bg-green-600' },
    { id: 'social', label: 'Social', color: 'bg-blue-600' },
    { id: 'content', label: 'Content', color: 'bg-purple-600' },
    { id: 'partnership', label: 'Partnership', color: 'bg-amber-600' },
    { id: 'events', label: 'Events', color: 'bg-pink-600' }
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
    'planned': { label: 'Planned', color: 'bg-gray-600/80' },
    'active': { label: 'Active', color: 'bg-green-600' },
    'paused': { label: 'Paused', color: 'bg-amber-600' },
    'completed': { label: 'Completed', color: 'bg-blue-600' }
};

const PRIORITY_LEVELS = [1, 2, 3, 4, 5];

function SortableMarketingCard({ channel, onUpdate, onDelete }: {
    channel: MarketingChannel;
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
    } = useSortable({ id: channel.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const category = CATEGORIES.find(c => c.id === channel.category);
    const statusBadge = STATUS_BADGES[channel.status] || STATUS_BADGES['planned'];

    // Calculate ROI
    const roi = channel.budget > 0 && channel.cac > 0
        ? ((channel.expectedReach * 50) - channel.budget) / channel.budget * 100
        : 0;

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <EditableCard
                id={channel.id}
                title={channel.name}
                description={channel.description}
                category={category}
                badge={statusBadge.label}
                isDragging={isDragging}
                dragHandleProps={listeners}
                onUpdate={onUpdate}
                onDelete={onDelete}
            >
                {/* Channel-specific metrics */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5 mb-4">
                    <div className="bg-zinc-800/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <DollarSign className="w-3.5 h-3.5 text-green-400" />
                            <span className="text-xs text-zinc-500">Budget</span>
                        </div>
                        <input
                            type="number"
                            value={channel.budget}
                            onChange={(e) => onUpdate('budget', parseFloat(e.target.value) || 0)}
                            className="w-full bg-transparent text-lg font-bold text-green-400 focus:outline-none"
                            placeholder="0"
                        />
                    </div>

                    <div className="bg-zinc-800/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-xs text-zinc-500">CAC</span>
                        </div>
                        <input
                            type="number"
                            value={channel.cac}
                            onChange={(e) => onUpdate('cac', parseFloat(e.target.value) || 0)}
                            className="w-full bg-transparent text-lg font-bold text-amber-400 focus:outline-none"
                            placeholder="0"
                        />
                    </div>

                    <div className="bg-zinc-800/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Users className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-xs text-zinc-500">Reach</span>
                        </div>
                        <input
                            type="number"
                            value={channel.expectedReach}
                            onChange={(e) => onUpdate('expectedReach', parseFloat(e.target.value) || 0)}
                            className="w-full bg-transparent text-lg font-bold text-blue-400 focus:outline-none"
                            placeholder="0"
                        />
                    </div>
                </div>

                {/* Calculated ROI */}
                {channel.budget > 0 && (
                    <div className={`rounded-lg p-3 mb-4 ${roi > 0 ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-400">Estimated ROI</span>
                            <div className="flex items-center gap-1">
                                <TrendingUp className={`w-4 h-4 ${roi > 0 ? 'text-green-400' : 'text-red-400'}`} />
                                <span className={`text-lg font-bold ${roi > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {roi.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Timeline */}
                <div className="mb-4">
                    <label className="text-xs font-medium text-zinc-500 mb-2 block">
                        Timeline
                    </label>
                    <input
                        type="text"
                        value={channel.timeline}
                        onChange={(e) => onUpdate('timeline', e.target.value)}
                        placeholder="e.g., Q1 2026, 3 months, Ongoing"
                        className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-indigo-500"
                    />
                </div>

                {/* Status and Priority */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div>
                        <label className="text-xs font-medium text-zinc-500 mb-2 block">
                            Status
                        </label>
                        <div className="flex flex-col gap-2">
                            {Object.entries(STATUS_BADGES).map(([key, { label, color }]) => (
                                <button
                                    key={key}
                                    onClick={() => onUpdate('status', key)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${channel.status === key
                                            ? `${color} text-white shadow-lg`
                                            : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-zinc-500 mb-2 block">
                            Priority (1-5)
                        </label>
                        <div className="flex gap-1">
                            {PRIORITY_LEVELS.map(level => (
                                <button
                                    key={level}
                                    onClick={() => onUpdate('priority', level)}
                                    className={`flex-1 h-8 rounded-lg border transition-all ${channel.priority >= level
                                            ? 'bg-indigo-600 border-indigo-500 text-white'
                                            : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:border-zinc-600'
                                        }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-2">
                        <label className="text-xs font-medium text-zinc-500 mb-2 block">
                            Category
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => onUpdate('category', cat.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${channel.category === cat.id
                                            ? `${cat.color} text-white shadow-lg`
                                            : 'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:border-zinc-600'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </EditableCard>
        </div>
    );
}

export function MarketingSection({ data, onChange }: MarketingSectionProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    const channels = data.marketingChannels || [];

    // Category counts
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        channels.forEach((channel: MarketingChannel) => {
            counts[channel.category] = (counts[channel.category] || 0) + 1;
        });
        return counts;
    }, [channels]);

    // Filtered channels
    const filteredChannels = useMemo(() => {
        return channels.filter((channel: MarketingChannel) => {
            const matchesCategory = selectedCategory === 'all' || channel.category === selectedCategory;
            const matchesStatus = selectedStatus === 'all' || channel.status === selectedStatus;
            return matchesCategory && matchesStatus;
        });
    }, [channels, selectedCategory, selectedStatus]);

    // Calculate totals
    const totalBudget = channels.reduce((sum: number, ch: MarketingChannel) => sum + ch.budget, 0);
    const totalReach = channels.reduce((sum: number, ch: MarketingChannel) => sum + ch.expectedReach, 0);
    const avgCAC = channels.length > 0
        ? channels.reduce((sum: number, ch: MarketingChannel) => sum + ch.cac, 0) / channels.length
        : 0;

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
            const oldIndex = channels.findIndex((ch: MarketingChannel) => ch.id === active.id);
            const newIndex = channels.findIndex((ch: MarketingChannel) => ch.id === over.id);

            const reordered = arrayMove(channels, oldIndex, newIndex).map((ch, idx) => ({
                ...ch,
                order: idx
            }));

            onChange?.({
                ...data,
                marketingChannels: reordered
            });
        }
    };

    const handleAdd = () => {
        const newChannel: MarketingChannel = {
            id: crypto.randomUUID(),
            name: 'New marketing channel - click to edit',
            description: '',
            category: 'paid',
            budget: 0,
            cac: 0,
            expectedReach: 0,
            timeline: 'Q1 2026',
            priority: 3,
            status: 'planned',
            order: channels.length
        };

        onChange?.({
            ...data,
            marketingChannels: [...channels, newChannel]
        });
    };

    const handleUpdate = (id: string, field: string, value: any) => {
        const updated = channels.map((ch: MarketingChannel) =>
            ch.id === id ? { ...ch, [field]: value } : ch
        );

        onChange?.({
            ...data,
            marketingChannels: updated
        });
    };

    const handleDelete = (id: string) => {
        const filtered = channels.filter((ch: MarketingChannel) => ch.id !== id);
        const reindexed = filtered.map((ch, idx) => ({ ...ch, order: idx }));

        onChange?.({
            ...data,
            marketingChannels: reindexed
        });
    };

    return (
        <div className="bg-zinc-900/20 rounded-2xl border border-white/5 overflow-hidden">
            {/* Header */}
            <div className="bg-zinc-900/50 backdrop-blur-sm border-b border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-pink-500/20 border border-pink-500/30 p-3 rounded-xl">
                            <Megaphone className="w-6 h-6 text-pink-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-zinc-100">Marketing Channels</h2>
                            <p className="text-sm text-zinc-400 mt-1">Customer acquisition strategy & budget allocation</p>
                        </div>
                    </div>
                    {onChange && (
                        <button
                            onClick={handleAdd}
                            className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-500 transition-colors text-sm font-medium shadow-lg hover:shadow-pink-500/25"
                        >
                            <Plus className="w-4 h-4" />
                            Add Channel
                        </button>
                    )}
                </div>

                {/* Summary Stats */}
                {channels.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-zinc-800/30 rounded-lg p-4 border border-white/5">
                            <div className="text-xs text-zinc-500 mb-1">Total Budget</div>
                            <div className="text-2xl font-bold text-green-400">${totalBudget.toLocaleString()}</div>
                        </div>
                        <div className="bg-zinc-800/30 rounded-lg p-4 border border-white/5">
                            <div className="text-xs text-zinc-500 mb-1">Expected Reach</div>
                            <div className="text-2xl font-bold text-blue-400">{totalReach.toLocaleString()}</div>
                        </div>
                        <div className="bg-zinc-800/30 rounded-lg p-4 border border-white/5">
                            <div className="text-xs text-zinc-500 mb-1">Avg CAC</div>
                            <div className="text-2xl font-bold text-amber-400">${avgCAC.toFixed(2)}</div>
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

                {/* Status Filter */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={() => setSelectedStatus('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedStatus === 'all'
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                : 'bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800 border border-white/5'
                            }`}
                    >
                        All Status
                    </button>
                    {Object.entries(STATUS_BADGES).map(([key, { label, color }]) => (
                        <button
                            key={key}
                            onClick={() => setSelectedStatus(key)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedStatus === key
                                    ? `${color} text-white shadow-lg`
                                    : 'bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800 border border-white/5'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Channels List */}
                {filteredChannels.length > 0 ? (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={filteredChannels.map((ch: MarketingChannel) => ch.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredChannels.map((channel: MarketingChannel) => (
                                    <SortableMarketingCard
                                        key={channel.id}
                                        channel={channel}
                                        onUpdate={(field, value) => handleUpdate(channel.id, field, value)}
                                        onDelete={() => handleDelete(channel.id)}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                ) : (
                    <div className="bg-zinc-900/40 backdrop-blur-sm rounded-lg p-8 text-center border-2 border-dashed border-white/10">
                        <Megaphone className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                        <p className="text-zinc-300 font-medium mb-1">No marketing channels defined</p>
                        <p className="text-sm text-zinc-400 mb-4">How will you reach your customers?</p>
                        {onChange && (
                            <button
                                onClick={handleAdd}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-500 transition-colors text-sm font-medium shadow-lg hover:shadow-pink-500/25"
                            >
                                <Plus className="w-4 h-4" />
                                Add First Channel
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
