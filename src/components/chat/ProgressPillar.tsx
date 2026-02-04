'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ProgressPillarProps {
    context: {
        businessName: string;
        problem: string;
        targetAudience: string;
        solution: string;
        monetization: string;
    };
}

export function ProgressPillar({ context }: ProgressPillarProps) {
    const [isHovered, setIsHovered] = useState(false);

    const steps = [
        { key: 'businessName', label: 'Business Name' },
        { key: 'problem', label: 'Problem' },
        { key: 'targetAudience', label: 'Target Audience' },
        { key: 'solution', label: 'Solution' },
        { key: 'monetization', label: 'Monetization' },
    ];

    const completedCount = steps.filter(step => !!context[step.key as keyof typeof context]).length;
    const progress = (completedCount / steps.length) * 100;

    return (
        <div
            className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex items-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Hover Details Panel (Slides out to the left) */}
            <motion.div
                initial={{ opacity: 0, x: 20, pointerEvents: 'none' }}
                animate={{
                    opacity: isHovered ? 1 : 0,
                    x: isHovered ? -20 : 20,
                    pointerEvents: isHovered ? 'auto' : 'none'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute right-[100%] mr-4 w-72 p-6 rounded-2xl bg-zinc-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50"
            >
                <h3 className="text-zinc-100 font-semibold mb-1">Canvas Progress</h3>
                <p className="text-xs text-zinc-400 mb-6 font-medium tracking-wide uppercase">
                    {completedCount} of {steps.length} Steps Completed
                </p>

                <div className="space-y-4">
                    {steps.map((step) => {
                        const isCompleted = !!context[step.key as keyof typeof context];
                        return (
                            <div key={step.key} className="flex items-center gap-3 group">
                                <div className={cn(
                                    "transition-colors duration-300",
                                    isCompleted ? "text-indigo-400" : "text-zinc-600 group-hover:text-zinc-500"
                                )}>
                                    {isCompleted ? <CheckCircle2 size={16} strokeWidth={2.5} /> : <Circle size={16} strokeWidth={2} />}
                                </div>
                                <span className={cn(
                                    "text-sm font-medium transition-colors duration-300",
                                    isCompleted ? "text-zinc-200" : "text-zinc-500"
                                )}>
                                    {step.label}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </motion.div>

            {/* The Main Pillar */}
            <div className="relative w-20 h-[600px] rounded-3xl bg-white/[0.02] backdrop-blur-md border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] flex flex-col items-center py-8 gap-4 overflow-hidden group hover:border-white/20 transition-colors duration-500">
                {/* Inner Glow / Lighting Source */}
                <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none" />

                {/* Branding Icon (Top) */}
                <div className="mb-auto p-3 rounded-xl bg-white/5 border border-white/10 shadow-inner">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                    </div>
                </div>

                {/* Vertical Progress Bars (The "Etchings") */}
                <div className="flex-1 flex flex-col justify-center gap-3 w-full px-6">
                    {steps.map((step, index) => {
                        const isCompleted = !!context[step.key as keyof typeof context];
                        return (
                            <div key={step.key} className="relative w-full h-1.5 rounded-full bg-zinc-800/50 overflow-hidden shadow-inner">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: isCompleted ? '100%' : '0%' }}
                                    transition={{ duration: 0.8, delay: index * 0.1 }}
                                    className={cn(
                                        "absolute inset-y-0 left-0 rounded-full",
                                        "bg-gradient-to-r from-indigo-500 to-blue-400",
                                        "shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                                    )}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Bottom stats */}
                <div className="mt-auto text-center">
                    <span className="text-2xl font-bold text-white tracking-tight">{Math.round(progress)}%</span>
                </div>
            </div>
        </div>
    );
}
