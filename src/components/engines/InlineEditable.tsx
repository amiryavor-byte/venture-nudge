import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils'; // Assuming you have a cn utility

interface InlineEditableProps {
    value: string;
    onSave: (newValue: string) => void;
    className?: string;
    readOnly?: boolean;
}

export const InlineEditable: React.FC<InlineEditableProps> = ({
    value,
    onSave,
    className,
    readOnly = false
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setTempValue(value);
    }, [value]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            // Auto-select all text to prevent concatenation
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setIsEditing(false);
            onSave(tempValue);
        } else if (e.key === 'Escape') {
            setIsEditing(false);
            setTempValue(value);
        }
    };

    const handleBlur = () => {
        setIsEditing(false);
        onSave(tempValue);
    };

    if (readOnly) {
        return <span className={className}>{value}</span>;
    }

    if (isEditing) {
        return (
            <input
                ref={inputRef}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                className={cn("bg-indigo-950/50 border border-indigo-500/50 rounded px-1 outline-none text-white w-full", className)}
            />
        );
    }

    return (
        <span
            onClick={() => setIsEditing(true)}
            className={cn("cursor-pointer hover:bg-white/5 rounded px-1 transition-colors border border-transparent hover:border-white/10", className)}
        >
            {value || <span className="text-gray-500 italic">Click to edit</span>}
        </span>
    );
};
