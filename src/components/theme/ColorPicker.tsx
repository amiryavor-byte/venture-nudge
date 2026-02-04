'use client';

import { useState } from 'react';

interface ColorPickerProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    description?: string;
}

export function ColorPicker({ label, value, onChange, description }: ColorPickerProps) {
    const [tempValue, setTempValue] = useState(value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempValue(e.target.value);
        onChange(e.target.value);
    };

    return (
        <div className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors">
            <div className="relative">
                <input
                    type="color"
                    value={tempValue}
                    onChange={handleChange}
                    className="w-12 h-12 rounded cursor-pointer border-2 border-zinc-700"
                />
            </div>

            <div className="flex-1">
                <label className="block text-sm font-medium text-white">
                    {label}
                </label>
                {description && (
                    <p className="text-xs text-zinc-400 mt-0.5">{description}</p>
                )}
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={tempValue}
                    onChange={(e) => {
                        setTempValue(e.target.value);
                        onChange(e.target.value);
                    }}
                    className="w-28 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded text-sm text-white font-mono focus:border-indigo-500 outline-none"
                    placeholder="#000000"
                />
            </div>
        </div>
    );
}
