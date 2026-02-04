'use client'

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditableCellProps {
    value: string | null;
    onSave: (newValue: string) => Promise<{ success: boolean }>;
    placeholder?: string;
    type?: 'text' | 'email';
    className?: string;
}

export function EditableCell({
    value,
    onSave,
    placeholder = 'Click to edit',
    type = 'text',
    className
}: EditableCellProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(value || '');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleSave = async () => {
        if (currentValue === (value || '')) {
            setIsEditing(false);
            return;
        }

        setIsSaving(true);
        setError(null);

        const result = await onSave(currentValue);

        setIsSaving(false);

        if (result.success) {
            setIsEditing(false);
        } else {
            setError('Failed to save');
            // Revert to previous value after showing error
            setTimeout(() => {
                setCurrentValue(value || '');
                setError(null);
            }, 2000);
        }
    };

    const handleBlur = () => {
        // Debounce the save to avoid triggering on click outside
        saveTimeoutRef.current = setTimeout(() => {
            if (isEditing) {
                handleSave();
            }
        }, 100);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setCurrentValue(value || '');
            setIsEditing(false);
            setError(null);
        }
    };

    const handleClick = () => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        setIsEditing(true);
    };

    if (isEditing) {
        return (
            <div className="relative">
                <Input
                    ref={inputRef}
                    type={type}
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className={cn(
                        'h-8 px-2 text-sm',
                        error && 'border-red-500',
                        className
                    )}
                    disabled={isSaving}
                />
                {isSaving && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                    </div>
                )}
                {error && (
                    <div className="absolute -bottom-5 left-0 text-xs text-red-500">
                        {error}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            onClick={handleClick}
            className={cn(
                'cursor-pointer rounded px-2 py-1 hover:bg-muted/50 transition-colors min-h-[32px] flex items-center',
                !value && 'text-muted-foreground italic',
                className
            )}
        >
            {value || placeholder}
        </div>
    );
}
