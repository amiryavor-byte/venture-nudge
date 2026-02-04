'use client';

import { useState, useMemo } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BusinessPlanData, MarketSegment, ValueProposition } from '@/lib/business-plan-service';
import { EditableCard } from './EditableCard';
import { CategoryFilter } from './CategoryFilter';
import { Target, Plus, Users, Lightbulb } from 'lucide-react';

interface MarketAnalysisSectionProps {
    data: BusinessPlanData;
    onChange?: (data: BusinessPlanData) => void;
}

const SEGMENT_PRIORITIES = [
    { id: 'primary', label: 'Primary Target', color: 'bg-green-600' },
    { id: 'secondary', label: 'Secondary Market', color: 'bg-blue-600' },
    { id: 'tertiary', label: 'Future Opportunity', color: 'bg-purple-600' }
];

function SortableSegmentCard({ segment, onUpdate, onDelete }: {
    segment: MarketSegment;
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
    } = useSortable({ id: segment.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const priority = SEGMENT_PRIORITIES.find(p => p.id === segment.priority);

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <EditableCard
                id={segment.id}
                title={segment.name}
                description={segment.description}
                category={priority}
                badge="TARGET SEGMENT"
                isDragging={isDragging}
                dragHandleProps={listeners}
                onUpdate={onUpdate}
                onDelete={onDelete}
            >
                {/* Market Size */}
                <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
                    <label className="text-xs font-medium text-zinc-400 mb-2 block">
                        Market Size (Total Addressable Market)
                    </label>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl text-green-400">$</span>
                        <input
                            type="number"
                            value={segment.size}
                            onChange={(e) => onUpdate('size', parseFloat(e.target.value) || 0)}
                            className="flex-1 bg-transparent text-2xl font-bold text-green-400 focus:outline-none"
                            placeholder="1000000"
                        />
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">
                        Estimated total revenue opportunity in this segment
                    </div>
                </div>

                {/* Demographics */}
                <div className="mb-4">
                    <label className="text-xs font-medium text-zinc-500 mb-2 block">
                        Who are they? (Demographics)
                    </label>
                    <input
                        type="text"
                        value={segment.demographics}
                        onChange={(e) => onUpdate('demographics', e.target.value)}
                        placeholder="e.g., Small business owners, 25-45, tech-savvy"
                        className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-indigo-500"
                    />
                </div>

                {/* Pain Points */}
                <div className="mb-4">
                    <label className="text-xs font-medium text-zinc-500 mb-2 block">
                        What problems do they have? (Pain Points)
                    </label>
                    <textarea
                        value={segment.painPoints?.join('\n') || ''}
                        onChange={(e) => onUpdate('painPoints', e.target.value.split('\n').filter(p => p.trim()))}
                        placeholder="One problem per line:&#10;• Struggling with manual processes&#10;• High costs&#10;• Lack of expertise"
                        rows={4}
                        className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 resize-none"
                    />
                </div>

                {/* Priority and Accessibility */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div>
                        <label className="text-xs font-medium text-zinc-500 mb-2 block">
                            Market Priority
                        </label>
                        <div className="flex flex-col gap-2">
                            {SEGMENT_PRIORITIES.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => onUpdate('priority', p.id)}
                                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${segment.priority === p.id
                                            ? `${p.color} text-white shadow-lg`
                                            : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                                        }`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-zinc-500 mb-2 block">
                            How easy to reach? (1-5)
                        </label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(score => (
                                <button
                                    key={score}
                                    onClick={() => onUpdate('accessibilityScore', score)}
                                    className={`flex-1 h-10 rounded-lg border transition-all flex items-center justify-center ${segment.accessibilityScore >= score
                                            ? 'bg-blue-600 border-blue-500 text-white'
                                            : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:border-zinc-600'
                                        }`}
                                >
                                    {score}
                                </button>
                            ))}
                        </div>
                        <div className="text-xs text-zinc-500 mt-1">
                            1 = Hard to reach, 5 = Easy to reach
                        </div>
                    </div>
                </div>
            </EditableCard>
        </div>
    );
}

function SortableValuePropCard({ prop, segments, onUpdate, onDelete }: {
    prop: ValueProposition;
    segments: MarketSegment[];
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
    } = useSortable({ id: prop.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const priority = prop.priority;
    const priorityColor = priority >= 4 ? 'text-red-400' : priority >= 3 ? 'text-amber-400' : 'text-blue-400';

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <EditableCard
                id={prop.id}
                title={prop.title}
                description=""
                badge={`VALUE PROP #${prop.order + 1}`}
                isDragging={isDragging}
                dragHandleProps={listeners}
                onUpdate={onUpdate}
                onDelete={onDelete}
            >
                {/* Problem → Solution → Benefit flow */}
                <div className="space-y-3">
                    {/* Pain Point */}
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                        <label className="text-xs font-medium text-red-400 mb-2 block flex items-center gap-2">
                            <span>😣</span> What problem does this solve?
                        </label>
                        <textarea
                            value={prop.painPoint}
                            onChange={(e) => onUpdate('painPoint', e.target.value)}
                            placeholder="e.g., Customers waste 10 hours/week on manual data entry"
                            rows={2}
                            className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700 rounded text-sm text-zinc-200 focus:outline-none focus:border-red-500 resize-none"
                        />
                    </div>

                    {/* Solution */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                        <label className="text-xs font-medium text-blue-400 mb-2 block flex items-center gap-2">
                            <span>💡</span> How do you solve it?
                        </label>
                        <textarea
                            value={prop.solution}
                            onChange={(e) => onUpdate('solution', e.target.value)}
                            placeholder="e.g., Our AI automates data entry with 99% accuracy"
                            rows={2}
                            className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700 rounded text-sm text-zinc-200 focus:outline-none focus:border-blue-500 resize-none"
                        />
                    </div>

                    {/* Benefit */}
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                        <label className="text-xs font-medium text-green-400 mb-2 block flex items-center gap-2">
                            <span>✨</span> What's the result/benefit?
                        </label>
                        <textarea
                            value={prop.benefit}
                            onChange={(e) => onUpdate('benefit', e.target.value)}
                            placeholder="e.g., Save 10 hours/week and reduce errors by 95%"
                            rows={2}
                            className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700 rounded text-sm text-zinc-200 focus:outline-none focus:border-green-500 resize-none"
                        />
                    </div>
                </div>

                {/* Evidence and Segment */}
                <div className="grid grid-cols-1 gap-4 pt-4 border-t border-white/5 mt-4">
                    <div>
                        <label className="text-xs font-medium text-zinc-500 mb-2 block">
                            Proof / Evidence (optional)
                        </label>
                        <input
                            type="text"
                            value={prop.evidence}
                            onChange={(e) => onUpdate('evidence', e.target.value)}
                            placeholder="e.g., Case study: Client X saved $50K/year"
                            className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-zinc-500 mb-2 block">
                            Which market segment is this for?
                        </label>
                        <select
                            value={prop.segment}
                            onChange={(e) => onUpdate('segment', e.target.value)}
                            className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-indigo-500"
                        >
                            <option value="">Select a segment...</option>
                            {segments.map(seg => (
                                <option key={seg.id} value={seg.name}>{seg.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-zinc-500 mb-2 block">
                            Importance (1-5)
                        </label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(level => (
                                <button
                                    key={level}
                                    onClick={() => onUpdate('priority', level)}
                                    className={`flex-1 h-8 rounded-lg border transition-all ${prop.priority >= level
                                            ? 'bg-indigo-600 border-indigo-500 text-white'
                                            : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:border-zinc-600'
                                        }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </EditableCard>
        </div>
    );
}

export function MarketAnalysisSection({ data, onChange }: MarketAnalysisSectionProps) {
    const [activeTab, setActiveTab] = useState<'segments' | 'valueprops'>('segments');
    const [selectedPriority, setSelectedPriority] = useState<string>('all');

    const segments = data.marketSegments || [];
    const valueProps = data.valuePropositions || [];

    // Drag and drop sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Segments handlers
    const handleSegmentDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = segments.findIndex((s: MarketSegment) => s.id === active.id);
            const newIndex = segments.findIndex((s: MarketSegment) => s.id === over.id);
            const reordered = arrayMove(segments, oldIndex, newIndex).map((s, idx) => ({ ...s, order: idx }));
            onChange?.({ ...data, marketSegments: reordered });
        }
    };

    const handleAddSegment = () => {
        const newSegment: MarketSegment = {
            id: crypto.randomUUID(),
            name: 'New market segment - click to edit',
            description: '',
            size: 0,
            demographics: '',
            painPoints: [],
            priority: 'primary',
            accessibilityScore: 3,
            order: segments.length
        };
        onChange?.({ ...data, marketSegments: [...segments, newSegment] });
    };

    const handleUpdateSegment = (id: string, field: string, value: any) => {
        const updated = segments.map((s: MarketSegment) => s.id === id ? { ...s, [field]: value } : s);
        onChange?.({ ...data, marketSegments: updated });
    };

    const handleDeleteSegment = (id: string) => {
        const filtered = segments.filter((s: MarketSegment) => s.id !== id);
        const reindexed = filtered.map((s, idx) => ({ ...s, order: idx }));
        onChange?.({ ...data, marketSegments: reindexed });
    };

    // Value Props handlers
    const handleValuePropDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = valueProps.findIndex((v: ValueProposition) => v.id === active.id);
            const newIndex = valueProps.findIndex((v: ValueProposition) => v.id === over.id);
            const reordered = arrayMove(valueProps, oldIndex, newIndex).map((v, idx) => ({ ...v, order: idx }));
            onChange?.({ ...data, valuePropositions: reordered });
        }
    };

    const handleAddValueProp = () => {
        const newProp: ValueProposition = {
            id: crypto.randomUUID(),
            title: 'New value proposition - click to edit',
            painPoint: '',
            solution: '',
            benefit: '',
            evidence: '',
            segment: '',
            priority: 3,
            order: valueProps.length
        };
        onChange?.({ ...data, valuePropositions: [...valueProps, newProp] });
    };

    const handleUpdateValueProp = (id: string, field: string, value: any) => {
        const updated = valueProps.map((v: ValueProposition) => v.id === id ? { ...v, [field]: value } : v);
        onChange?.({ ...data, valuePropositions: updated });
    };

    const handleDeleteValueProp = (id: string) => {
        const filtered = valueProps.filter((v: ValueProposition) => v.id !== id);
        const reindexed = filtered.map((v, idx) => ({ ...v, order: idx }));
        onChange?.({ ...data, valuePropositions: reindexed });
    };

    const filteredSegments = selectedPriority === 'all'
        ? segments
        : segments.filter((s: MarketSegment) => s.priority === selectedPriority);

    const totalMarketSize = segments.reduce((sum: number, s: MarketSegment) => sum + s.size, 0);

    return (
        <div className="bg-zinc-900/20 rounded-2xl border border-white/5 overflow-hidden">
            {/* Header */}
            <div className="bg-zinc-900/50 backdrop-blur-sm border-b border-white/10 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-cyan-500/20 border border-cyan-500/30 p-3 rounded-xl">
                            <Target className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-zinc-100">Market Analysis</h2>
                            <p className="text-sm text-zinc-400 mt-1">Target markets & value propositions</p>
                        </div>
                    </div>
                    {onChange && (
                        <button
                            onClick={activeTab === 'segments' ? handleAddSegment : handleAddValueProp}
                            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors text-sm font-medium shadow-lg hover:shadow-cyan-500/25"
                        >
                            <Plus className="w-4 h-4" />
                            {activeTab === 'segments' ? 'Add Segment' : 'Add Value Prop'}
                        </button>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mt-4">
                    <button
                        onClick={() => setActiveTab('segments')}
                        className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === 'segments'
                                ? 'bg-cyan-600 text-white shadow-lg'
                                : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800'
                            }`}
                    >
                        <Users className="w-4 h-4 inline mr-2" />
                        Target Segments ({segments.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('valueprops')}
                        className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === 'valueprops'
                                ? 'bg-cyan-600 text-white shadow-lg'
                                : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800'
                            }`}
                    >
                        <Lightbulb className="w-4 h-4 inline mr-2" />
                        Value Propositions ({valueProps.length})
                    </button>
                </div>

                {/* Summary for segments */}
                {activeTab === 'segments' && segments.length > 0 && (
                    <div className="mt-4 bg-zinc-800/30 rounded-lg p-4 border border-white/5">
                        <div className="text-xs text-zinc-500 mb-1">Total Market Opportunity (TAM)</div>
                        <div className="text-2xl font-bold text-cyan-400">${totalMarketSize.toLocaleString()}</div>
                    </div>
                )}
            </div>

            <div className="p-6">
                {/* Segments Tab */}
                {activeTab === 'segments' && (
                    <>
                        {/* Priority Filter */}
                        <CategoryFilter
                            categories={SEGMENT_PRIORITIES}
                            selectedCategory={selectedPriority}
                            onSelectCategory={setSelectedPriority}
                            counts={segments.reduce((acc: Record<string, number>, s: MarketSegment) => {
                                acc[s.priority] = (acc[s.priority] || 0) + 1;
                                return acc;
                            }, {})}
                        />

                        {filteredSegments.length > 0 ? (
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSegmentDragEnd}>
                                <SortableContext items={filteredSegments.map((s: MarketSegment) => s.id)} strategy={verticalListSortingStrategy}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {filteredSegments.map((segment: MarketSegment) => (
                                            <SortableSegmentCard
                                                key={segment.id}
                                                segment={segment}
                                                onUpdate={(field, value) => handleUpdateSegment(segment.id, field, value)}
                                                onDelete={() => handleDeleteSegment(segment.id)}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        ) : (
                            <div className="bg-zinc-900/40 backdrop-blur-sm rounded-lg p-8 text-center border-2 border-dashed border-white/10">
                                <Users className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                                <p className="text-zinc-300 font-medium mb-1">No market segments defined</p>
                                <p className="text-sm text-zinc-400 mb-4">Who are your ideal customers?</p>
                                {onChange && (
                                    <button onClick={handleAddSegment} className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors text-sm font-medium shadow-lg hover:shadow-cyan-500/25">
                                        <Plus className="w-4 h-4" />
                                        Add First Segment
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* Value Props Tab */}
                {activeTab === 'valueprops' && (
                    <>
                        {valueProps.length > 0 ? (
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleValuePropDragEnd}>
                                <SortableContext items={valueProps.map((v: ValueProposition) => v.id)} strategy={verticalListSortingStrategy}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {valueProps.map((prop: ValueProposition) => (
                                            <SortableValuePropCard
                                                key={prop.id}
                                                prop={prop}
                                                segments={segments}
                                                onUpdate={(field, value) => handleUpdateValueProp(prop.id, field, value)}
                                                onDelete={() => handleDeleteValueProp(prop.id)}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        ) : (
                            <div className="bg-zinc-900/40 backdrop-blur-sm rounded-lg p-8 text-center border-2 border-dashed border-white/10">
                                <Lightbulb className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                                <p className="text-zinc-300 font-medium mb-1">No value propositions defined</p>
                                <p className="text-sm text-zinc-400 mb-4">What unique value do you offer?</p>
                                {onChange && (
                                    <button onClick={handleAddValueProp} className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors text-sm font-medium shadow-lg hover:shadow-cyan-500/25">
                                        <Plus className="w-4 h-4" />
                                        Add First Value Prop
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
