import { useState, useEffect } from 'react';

interface InlineEditableNumberProps {
    value: number;
    onSave: (value: number) => void;
    format?: 'number' | 'percent';
    className?: string;
    min?: number;
    max?: number;
}

export function InlineEditableNumber({
    value,
    onSave,
    format = 'number',
    className = '',
    min = 0,
    max = format === 'percent' ? 100 : Infinity
}: InlineEditableNumberProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [localValue, setLocalValue] = useState(value.toString());

    useEffect(() => {
        setLocalValue(value.toString());
    }, [value]);

    const formatDisplay = (val: number) => {
        if (format === 'percent') {
            return `${val}%`;
        }
        return val.toLocaleString();
    };

    const handleSave = () => {
        const parsed = parseFloat(localValue);
        if (!isNaN(parsed)) {
            const clamped = Math.max(min, Math.min(max, parsed));
            onSave(Math.round(clamped));
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setLocalValue(value.toString());
            setIsEditing(false);
        }
    };

    if (isEditing) {
        return (
            <input
                type="number"
                autoFocus
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                min={min}
                max={max}
                className="bg-zinc-800 border border-indigo-500 rounded px-2 py-1 text-right focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-24"
            />
        );
    }

    return (
        <span
            onClick={() => setIsEditing(true)}
            className={`cursor-pointer hover:bg-zinc-800/50 px-2 py-1 rounded transition ${className}`}
            title="Click to edit"
        >
            {formatDisplay(value)}
        </span>
    );
}
