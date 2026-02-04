'use client';

import { useState, useEffect, useRef } from 'react';

interface RichTextEditableProps {
    value: string;
    onSave: (val: string) => void;
    className?: string;
    placeholder?: string;
    maxLength?: number;
    multiline?: boolean;
}

export function RichTextEditable({
    value,
    onSave,
    className = '',
    placeholder = 'Click to edit...',
    maxLength,
    multiline = false
}: RichTextEditableProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [localValue, setLocalValue] = useState(value);
    const [isSaving, setIsSaving] = useState(false);
    const [showSaved, setShowSaved] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => setLocalValue(value), [value]);

    // Auto-resize textarea
    useEffect(() => {
        if (multiline && textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [localValue, multiline, isEditing]);

    const handleSave = async () => {
        setIsEditing(false);
        setIsSaving(true);

        try {
            await onSave(localValue);
            setShowSaved(true);
            setTimeout(() => setShowSaved(false), 2000);
        } finally {
            setIsSaving(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!multiline && e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            setLocalValue(value);
            setIsEditing(false);
        } else if ((e.metaKey || e.ctrlKey) && e.key === 's') {
            e.preventDefault();
            handleSave();
        }
    };

    const remainingChars = maxLength ? maxLength - localValue.length : null;
    const isNearLimit = maxLength && remainingChars !== null && remainingChars < 50;

    if (isEditing) {
        const baseInputClass = "w-full bg-zinc-900/50 border-b-2 border-indigo-500 focus:outline-none text-zinc-100 px-2 py-1 resize-none";

        return (
            <div className="relative">
                {multiline ? (
                    <textarea
                        ref={textareaRef}
                        autoFocus
                        className={`${baseInputClass} ${className}`}
                        value={localValue}
                        onChange={(e) => {
                            if (!maxLength || e.target.value.length <= maxLength) {
                                setLocalValue(e.target.value);
                            }
                        }}
                        onBlur={handleSave}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        rows={3}
                    />
                ) : (
                    <input
                        ref={inputRef}
                        autoFocus
                        className={`${baseInputClass} ${className}`}
                        value={localValue}
                        onChange={(e) => {
                            if (!maxLength || e.target.value.length <= maxLength) {
                                setLocalValue(e.target.value);
                            }
                        }}
                        onBlur={handleSave}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                    />
                )}

                {maxLength && (
                    <div className={`absolute -bottom-5 right-0 text-xs ${isNearLimit ? 'text-amber-400' : 'text-zinc-500'}`}>
                        {remainingChars} characters remaining
                    </div>
                )}

                <div className="text-xs text-zinc-500 mt-1">
                    Press <kbd className="px-1 py-0.5 bg-zinc-800 rounded text-zinc-400">Enter</kbd> to save, <kbd className="px-1 py-0.5 bg-zinc-800 rounded text-zinc-400">Esc</kbd> to cancel
                </div>
            </div>
        );
    }

    return (
        <div className="relative group">
            <div
                onClick={() => setIsEditing(true)}
                className={`cursor-text hover:bg-zinc-800/30 transition-colors rounded px-2 py-1 -mx-2 -my-1 ${className} ${!value ? 'text-zinc-500' : ''}`}
            >
                {value || placeholder}
            </div>

            {showSaved && (
                <div className="absolute -top-6 left-0 text-xs text-green-400 flex items-center gap-1 animate-fade-in">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Saved
                </div>
            )}

            {isSaving && (
                <div className="absolute -top-6 left-0 text-xs text-indigo-400">
                    Saving...
                </div>
            )}
        </div>
    );
}
