'use client';

import { useState, useMemo } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BusinessPlanData, RoadmapItem } from '@/lib/business-plan-service';
import { EditableCard } from './EditableCard';
import { CategoryFilter } from './CategoryFilter';
import { Map, Plus, Lightbulb } from 'lucide-react';

interface RoadmapSectionProps {
    data: BusinessPlanData;
    onChange?: (data: BusinessPlanData) => void;
}

// Category definitions for roadmap items
const CATEGORIES = [
    { id: 'feature', label: 'Feature', color: 'bg-blue-600' },
    { id: 'integration', label: 'Integration', color: 'bg-green-600' },
    { id: 'optimization', label: 'Optimization', color: 'bg-amber-600' },
    { id: 'research', label: 'Research', color: 'bg-purple-600' }
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
    'idea': { label: 'Idea', color: 'bg-gray-600/80' },
    'planned': { label: 'Planned', color: 'bg-indigo-600' },
    'in-progress': { label: 'In Progress', color: 'bg-blue-600' },
    'completed': { label: 'Completed', color: 'bg-green-600' }
};

const PRIORITY_LEVELS: Record<string, { label: string; color: string }> = {
    'low': { label: 'Low', color: 'text-zinc-500' },
    'medium': { label: 'Med', color: 'text-amber-500' },
    'high': { label: 'High', color: 'text-orange-500' },
    'critical': { label: 'Critical', color: 'text-red-500' }
};

function SortableRoadmapCard({ item, onUpdate, onDelete }: {
    item: RoadmapItem;
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
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const category = CATEGORIES.find(c => c.id === item.category);
    const statusBadge = STATUS_BADGES[item.status] || STATUS_BADGES['planned'];

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <EditableCard
                id={item.id}
                title={item.feature}
                description={item.description}
                category={category}
                badge={`${statusBadge.label} • ${item.quarter || 'Q1 2026'}`}
                isDragging={isDragging}
                dragHandleProps={listeners}
                onUpdate={onUpdate}
                onDelete={onDelete}
            >
                {/* Custom fields for roadmap items */}
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
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${item.status === key
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
                            Priority
                        </label>
                        <div className="flex flex-col gap-2">
                            {Object.entries(PRIORITY_LEVELS).map(([key, { label, color }]) => (
                                <button
                                    key={key}
                                    onClick={() => onUpdate('priority', key)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${item.priority === key
                                            ? 'bg-indigo-600 border-indigo-500 text-white'
                                            : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-2">
                        <label className="text-xs font-medium text-zinc-500 mb-2 block">
                            Quarter / Timeline
                        </label>
                        <input
                            type="text"
                            value={item.quarter || ''}
                            onChange={(e) => onUpdate('quarter', e.target.value)}
                            placeholder="e.g., Q2 2026"
                            className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    {item.effort !== undefined && (
                        <div className="col-span-2">
                            <label className="text-xs font-medium text-zinc-500 mb-2 block">
                                Effort (Story Points)
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 5, 8].map(points => (
                                    <button
                                        key={points}
                                        onClick={() => onUpdate('effort', points)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${item.effort === points
                                                ? 'bg-indigo-600 border-indigo-500 text-white'
                                                : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                                            }`}
                                    >
                                        {points}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="col-span-2">
                        <label className="text-xs font-medium text-zinc-500 mb-2 block">
                            Category
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => onUpdate('category', cat.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${item.category === cat.id
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

export function RoadmapSection({ data, onChange }: RoadmapSectionProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    // Get roadmap items
    const roadmapItems = Array.isArray(data.productRoadmap) ? data.productRoadmap : [];

    // Category counts
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        roadmapItems.forEach((item: RoadmapItem) => {
            if (item.category) {
                counts[item.category] = (counts[item.category] || 0) + 1;
            }
        });
        return counts;
    }, [roadmapItems]);

    // Filtered items
    const filteredItems = useMemo(() => {
        return roadmapItems.filter((item: RoadmapItem) => {
            const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
            const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
            return matchesCategory && matchesStatus;
        });
    }, [roadmapItems, selectedCategory, selectedStatus]);

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
            const oldIndex = roadmapItems.findIndex((item: RoadmapItem) => item.id === active.id);
            const newIndex = roadmapItems.findIndex((item: RoadmapItem) => item.id === over.id);

            const reordered = arrayMove(roadmapItems, oldIndex, newIndex).map((item, idx) => ({
                ...item,
                order: idx
            }));

            onChange?.({
                ...data,
                productRoadmap: reordered
            });
        }
    };

    const handleAdd = () => {
        const newItem: RoadmapItem = {
            id: crypto.randomUUID(),
            feature: 'New feature - click to edit',
            description: '',
            quarter: 'Q1 2026',
            status: 'planned',
            category: 'feature',
            priority: 'medium',
            effort: 3,
            order: roadmapItems.length
        };

        onChange?.({
            ...data,
            productRoadmap: [...roadmapItems, newItem]
        });
    };

    const handleUpdate = (id: string, field: string, value: any) => {
        const updated = roadmapItems.map((item: RoadmapItem) =>
            item.id === id ? { ...item, [field]: value } : item
        );

        onChange?.({
            ...data,
            productRoadmap: updated
        });
    };

    const handleDelete = (id: string) => {
        const filtered = roadmapItems.filter((item: RoadmapItem) => item.id !== id);
        const reindexed = filtered.map((item, idx) => ({ ...item, order: idx }));

        onChange?.({
            ...data,
            productRoadmap: reindexed
        });
    };

    return (
        <div className="bg-zinc-900/20 rounded-2xl border border-white/5 overflow-hidden">
            {/* Header */}
            <div className="bg-zinc-900/50 backdrop-blur-sm border-b border-white/10 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-500/20 border border-purple-500/30 p-3 rounded-xl">
                            <Map className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-zinc-100">Product Roadmap</h2>
                            <p className="text-sm text-zinc-400 mt-1">Feature timeline & milestones</p>
                        </div>
                    </div>
                    {onChange && (
                        <button
                            onClick={handleAdd}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors text-sm font-medium shadow-lg hover:shadow-purple-500/25"
                        >
                            <Plus className="w-4 h-4" />
                            Add Feature
                        </button>
                    )}
                </div>
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

                {/* Roadmap Items List */}
                {filteredItems.length > 0 ? (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={filteredItems.map((item: RoadmapItem) => item.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredItems.map((item: RoadmapItem) => (
                                    <SortableRoadmapCard
                                        key={item.id}
                                        item={item}
                                        onUpdate={(field, value) => handleUpdate(item.id, field, value)}
                                        onDelete={() => handleDelete(item.id)}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                ) : (
                    <div className="bg-zinc-900/40 backdrop-blur-sm rounded-lg p-8 text-center border-2 border-dashed border-white/10">
                        <Lightbulb className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                        <p className="text-zinc-300 font-medium mb-1">No roadmap features</p>
                        <p className="text-sm text-zinc-400 mb-4">Plan your features and milestones</p>
                        {onChange && (
                            <button
                                onClick={handleAdd}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors text-sm font-medium shadow-lg hover:shadow-purple-500/25"
                            >
                                <Plus className="w-4 h-4" />
                                Add First Feature
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
