import { useState, useEffect } from 'react';

export function InlineEditable({ value, onSave, className }: { value: string, onSave: (val: string) => void, className?: string }) {
    const [isEditing, setIsEditing] = useState(false);
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => setLocalValue(value), [value]);

    if (isEditing) {
        return (
            <input
                autoFocus
                className="bg-transparent border-b border-indigo-500 focus:outline-none"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={() => { setIsEditing(false); onSave(localValue); }}
                onKeyDown={(e) => { if (e.key === 'Enter') { setIsEditing(false); onSave(localValue); } }}
            />
        )
    }

    return (
        <span onClick={() => setIsEditing(true)} className={`cursor-text hover:underline ${className}`}>
            {value}
        </span>
    );
}
