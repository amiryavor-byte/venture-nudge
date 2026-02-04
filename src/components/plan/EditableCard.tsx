'use client';

import { useState, ReactNode } from 'react';
import { GripVertical, Star, Lock, LockOpen, Shield, Trash2 } from 'lucide-react';
import { RichTextEditable } from './RichTextEditable';

interface EditableCardProps {
    id: string;
    title: string;
    description?: string;
    category?: {
        label: string;
        color: string;
    };
    badge?: string;
    strength?: 1 | 2 | 3 | 4 | 5;
    defensibility?: 'low' | 'medium' | 'high';
    evidence?: string;
    isExpanded?: boolean;
    isDragging?: boolean;
    dragHandleProps?: any;
    onUpdate: (field: string, value: any) => void;
    onDelete?: () => void;
    children?: ReactNode;
}

export function EditableCard({
    id,
    title,
    description,
    category,
    badge,
    strength,
    defensibility,
    evidence,
    isExpanded: initialExpanded = false,
    isDragging = false,
    dragHandleProps,
    onUpdate,
    onDelete,
    children
}: EditableCardProps) {
    const [isExpanded, setIsExpanded] = useState(initialExpanded);

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                    <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${star <= rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-zinc-600'
                            }`}
                    />
                ))}
            </div>
        );
    };

    const renderDefensibilityIcon = (level?: string) => {
        if (level === 'high') {
            return <Shield className="w-4 h-4 text-green-400 fill-green-400/20" />;
        } else if (level === 'medium') {
            return <Lock className="w-4 h-4 text-amber-400" />;
        } else {
            return <LockOpen className="w-4 h-4 text-zinc-500" />;
        }
    };

    return (
        <div
            className={`group bg-zinc-900/40 backdrop-blur-sm border rounded-xl p-5 transition-all ${isDragging
                    ? 'border-indigo-500 shadow-[0_0_30px_-5px_rgba(99,102,241,0.5)] scale-105 rotate-2'
                    : isExpanded
                        ? 'border-indigo-500/30 shadow-[0_0_20px_-5px_rgba(99,102,241,0.2)]'
                        : 'border-white/5 hover:border-indigo-500/20'
                }`}
        >
            {/* Card Header */}
            <div className="flex items-start gap-3">
                {/* Drag Handle */}
                {dragHandleProps && (
                    <div
                        {...dragHandleProps}
                        className="cursor-grab active:cursor-grabbing flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <GripVertical className="w-5 h-5 text-zinc-500" />
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    {/* Top Row: Badge, Category, Indicators */}
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                        {badge && (
                            <div className="text-xs font-bold text-indigo-400">
                                {badge}
                            </div>
                        )}

                        {category && (
                            <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${category.color}`}
                            >
                                {category.label}
                            </span>
                        )}

                        {strength && (
                            <div className="flex items-center gap-1">
                                {renderStars(strength)}
                            </div>
                        )}

                        {defensibility && renderDefensibilityIcon(defensibility)}

                        <div className="ml-auto flex items-center gap-2">
                            {onDelete && (
                                <button
                                    onClick={onDelete}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-red-400"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}

                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="text-zinc-400 hover:text-indigo-400 transition-colors"
                            >
                                <svg
                                    className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Title */}
                    <RichTextEditable
                        value={title}
                        onSave={(val) => onUpdate('title', val)}
                        className="text-sm md:text-base font-semibold text-zinc-100 block"
                        maxLength={200}
                    />

                    {/* Expanded Content */}
                    {isExpanded && (
                        <div className="mt-4 space-y-4 animate-fadeIn">
                            {/* Description */}
                            <div>
                                <label className="text-xs font-medium text-zinc-500 mb-1 block">
                                    Description
                                </label>
                                <RichTextEditable
                                    value={description || ''}
                                    onSave={(val) => onUpdate('description', val)}
                                    className="text-sm text-zinc-300 leading-relaxed block"
                                    placeholder="Add a detailed description..."
                                    multiline
                                    maxLength={1000}
                                />
                            </div>

                            {/* Evidence */}
                            {evidence !== undefined && (
                                <div>
                                    <label className="text-xs font-medium text-zinc-500 mb-1 block">
                                        Evidence / Proof Points
                                    </label>
                                    <RichTextEditable
                                        value={evidence}
                                        onSave={(val) => onUpdate('evidence', val)}
                                        className="text-sm text-zinc-300 leading-relaxed block"
                                        placeholder="Add evidence or proof points..."
                                        multiline
                                        maxLength={500}
                                    />
                                </div>
                            )}

                            {/* Custom Children */}
                            {children}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
