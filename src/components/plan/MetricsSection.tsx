'use client';

import { useState, useMemo } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BusinessPlanData, KeyMetric } from '@/lib/business-plan-service';
import { EditableCard } from './EditableCard';
import { CategoryFilter } from './CategoryFilter';
import { BarChart3, Plus, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricsSectionProps {
    data: BusinessPlanData;
    onChange?: (data: BusinessPlanData) => void;
}

const CATEGORIES = [
    { id: 'growth', label: 'Growth', color: 'bg-green-600' },
    { id: 'financial', label: 'Financial', color: 'bg-emerald-600' },
    { id: 'operational', label: 'Operational', color: 'bg-blue-600' },
    { id: 'customer', label: 'Customer', color: 'bg-purple-600' },
    { id: 'product', label: 'Product', color: 'bg-amber-600' }
];

const TRACKING_FREQ = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
];

function SortableMetricCard({ metric, onUpdate, onDelete }: {
    metric: KeyMetric;
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
    } = useSortable({ id: metric.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const category = CATEGORIES.find(c => c.id === metric.category);

    // Calculate progress percentage
    const progress = metric.target > 0 ? (metric.current / metric.target) * 100 : 0;
    const isOnTrack = progress >= 50; // Simple heuristic
    const isAchieved = progress >= 100;

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <EditableCard
                id={metric.id}
                title={metric.name}
                description={metric.description}
                category={category}
                badge={`METRIC #${metric.order + 1}`}
                isDragging={isDragging}
                dragHandleProps={listeners}
                onUpdate={onUpdate}
                onDelete={onDelete}
            >
                {/* Progress Visualization */}
                <div className={`rounded-lg p-4 mb-4 border ${isAchieved
                        ? 'bg-green-500/10 border-green-500/30'
                        : isOnTrack
                            ? 'bg-blue-500/10 border-blue-500/30'
                            : 'bg-amber-500/10 border-amber-500/30'
                    }`}>
                    <div className="flex items-end justify-between mb-3">
                        <div>
                            <div className="text-xs text-zinc-500 mb-1">Current Value</div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={metric.current}
                                    onChange={(e) => onUpdate('current', parseFloat(e.target.value) || 0)}
                                    className={`bg-transparent text-3xl font-bold focus:outline-none w-32 ${isAchieved ? 'text-green-400' : isOnTrack ? 'text-blue-400' : 'text-amber-400'
                                        }`}
                                    placeholder="0"
                                />
                                <input
                                    type="text"
                                    value={metric.unit}
                                    onChange={(e) => onUpdate('unit', e.target.value)}
                                    className="bg-transparent text-sm text-zinc-400 focus:outline-none w-16"
                                    placeholder="unit"
                                />
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-xs text-zinc-500 mb-1">Target</div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={metric.target}
                                    onChange={(e) => onUpdate('target', parseFloat(e.target.value) || 0)}
                                    className="bg-transparent text-2xl font-bold text-zinc-300 focus:outline-none w-24 text-right"
                                    placeholder="0"
                                />
                                <span className="text-sm text-zinc-400">{metric.unit}</span>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-zinc-500">Progress</span>
                            <div className="flex items-center gap-1">
                                {isAchieved ? (
                                    <>
                                        <TrendingUp className="w-3 h-3 text-green-400" />
                                        <span className="font-bold text-green-400">Achieved! 🎉</span>
                                    </>
                                ) : isOnTrack ? (
                                    <>
                                        <TrendingUp className="w-3 h-3 text-blue-400" />
                                        <span className="font-bold text-blue-400">{progress.toFixed(1)}%</span>
                                    </>
                                ) : (
                                    <>
                                        <TrendingDown className="w-3 h-3 text-amber-400" />
                                        <span className="font-bold text-amber-400">{progress.toFixed(1)}%</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${isAchieved ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                                        isOnTrack ? 'bg-gradient-to-r from-blue-500 to-cyan-400' :
                                            'bg-gradient-to-r from-amber-500 to-orange-400'
                                    }`}
                                style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Deadline and Tracking */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-xs font-medium text-zinc-500 mb-2 block">
                            Target Date
                        </label>
                        <input
                            type="date"
                            value={metric.deadline}
                            onChange={(e) => onUpdate('deadline', e.target.value)}
                            className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-zinc-500 mb-2 block">
                            Track How Often?
                        </label>
                        <select
                            value={metric.trackingFrequency}
                            onChange={(e) => onUpdate('trackingFrequency', e.target.value)}
                            className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-indigo-500"
                        >
                            {TRACKING_FREQ.map(freq => (
                                <option key={freq.value} value={freq.value}>{freq.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Category Selection */}
                <div className="pt-4 border-t border-white/5">
                    <label className="text-xs font-medium text-zinc-500 mb-2 block">
                        Metric Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => onUpdate('category', cat.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${metric.category === cat.id
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

export function MetricsSection({ data, onChange }: MetricsSectionProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const metrics = data.keyMetrics || [];

    // Category counts
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        metrics.forEach((metric: KeyMetric) => {
            counts[metric.category] = (counts[metric.category] || 0) + 1;
        });
        return counts;
    }, [metrics]);

    // Filtered metrics
    const filteredMetrics = useMemo(() => {
        if (selectedCategory === 'all') return metrics;
        return metrics.filter((m: KeyMetric) => m.category === selectedCategory);
    }, [metrics, selectedCategory]);

    // Overall progress stats
    const achievedCount = metrics.filter((m: KeyMetric) => m.target > 0 && m.current >= m.target).length;
    const onTrackCount = metrics.filter((m: KeyMetric) => {
        const progress = m.target > 0 ? (m.current / m.target) * 100 : 0;
        return progress >= 50 && progress < 100;
    }).length;

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
            const oldIndex = metrics.findIndex((m: KeyMetric) => m.id === active.id);
            const newIndex = metrics.findIndex((m: KeyMetric) => m.id === over.id);

            const reordered = arrayMove(metrics, oldIndex, newIndex).map((m, idx) => ({
                ...m,
                order: idx
            }));

            onChange?.({
                ...data,
                keyMetrics: reordered
            });
        }
    };

    const handleAdd = () => {
        const newMetric: KeyMetric = {
            id: crypto.randomUUID(),
            name: 'New metric - click to edit',
            description: '',
            category: 'growth',
            unit: '%',
            current: 0,
            target: 100,
            deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
            trackingFrequency: 'monthly',
            order: metrics.length
        };

        onChange?.({
            ...data,
            keyMetrics: [...metrics, newMetric]
        });
    };

    const handleUpdate = (id: string, field: string, value: any) => {
        const updated = metrics.map((m: KeyMetric) =>
            m.id === id ? { ...m, [field]: value } : m
        );

        onChange?.({
            ...data,
            keyMetrics: updated
        });
    };

    const handleDelete = (id: string) => {
        const filtered = metrics.filter((m: KeyMetric) => m.id !== id);
        const reindexed = filtered.map((m, idx) => ({ ...m, order: idx }));

        onChange?.({
            ...data,
            keyMetrics: reindexed
        });
    };

    return (
        <div className="bg-zinc-900/20 rounded-2xl border border-white/5 overflow-hidden">
            {/* Header */}
            <div className="bg-zinc-900/50 backdrop-blur-sm border-b border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-500/20 border border-emerald-500/30 p-3 rounded-xl">
                            <BarChart3 className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-zinc-100">Key Metrics</h2>
                            <p className="text-sm text-zinc-400 mt-1">Track your most important numbers</p>
                        </div>
                    </div>
                    {onChange && (
                        <button
                            onClick={handleAdd}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors text-sm font-medium shadow-lg hover:shadow-emerald-500/25"
                        >
                            <Plus className="w-4 h-4" />
                            Add Metric
                        </button>
                    )}
                </div>

                {/* Summary Stats */}
                {metrics.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-zinc-800/30 rounded-lg p-4 border border-white/5">
                            <div className="text-xs text-zinc-500 mb-1">Total Metrics</div>
                            <div className="text-2xl font-bold text-zinc-200">{metrics.length}</div>
                        </div>
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                            <div className="text-xs text-green-400 mb-1">✓ Achieved</div>
                            <div className="text-2xl font-bold text-green-400">{achievedCount}</div>
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                            <div className="text-xs text-blue-400 mb-1">→ On Track</div>
                            <div className="text-2xl font-bold text-blue-400">{onTrackCount}</div>
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

                {/* Metrics List */}
                {filteredMetrics.length > 0 ? (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={filteredMetrics.map((m: KeyMetric) => m.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredMetrics.map((metric: KeyMetric) => (
                                    <SortableMetricCard
                                        key={metric.id}
                                        metric={metric}
                                        onUpdate={(field, value) => handleUpdate(metric.id, field, value)}
                                        onDelete={() => handleDelete(metric.id)}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                ) : (
                    <div className="bg-zinc-900/40 backdrop-blur-sm rounded-lg p-8 text-center border-2 border-dashed border-white/10">
                        <BarChart3 className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                        <p className="text-zinc-300 font-medium mb-1">No metrics being tracked</p>
                        <p className="text-sm text-zinc-400 mb-4">What numbers matter most to your success?</p>
                        {onChange && (
                            <button
                                onClick={handleAdd}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors text-sm font-medium shadow-lg hover:shadow-emerald-500/25"
                            >
                                <Plus className="w-4 h-4" />
                                Add First Metric
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
