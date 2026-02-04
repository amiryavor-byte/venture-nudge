'use client';

import { useState, ReactNode } from 'react';

interface PopoverProps {
    children: ReactNode;
    content: ReactNode;
    trigger?: 'click' | 'hover';
}

export function Popover({ children, content, trigger = 'click' }: PopoverProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleInteraction = () => {
        if (trigger === 'click') {
            setIsOpen(!isOpen);
        }
    };

    const handleMouseEnter = () => {
        if (trigger === 'hover') {
            setIsOpen(true);
        }
    };

    const handleMouseLeave = () => {
        if (trigger === 'hover') {
            setIsOpen(false);
        }
    };

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                onClick={handleInteraction}
                className="cursor-pointer"
            >
                {children}
            </div>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Popover Content */}
                    <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-3xl">
                        <div className="bg-slate-800 border border-indigo-500/30 rounded-xl p-6 shadow-2xl backdrop-blur-sm max-h-[80vh] overflow-y-auto">
                            {content}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
