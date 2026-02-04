import { Calculator } from 'lucide-react';
import { BreakdownBar } from './BreakdownBar';

interface CalculationPopoverProps {
    title: string;
    formulas: string[];
    breakdown?: {
        label: string;
        value: number;
        color: string;
    }[];
    notes?: string[];
}

export function CalculationPopover({
    title,
    formulas,
    breakdown,
    notes
}: CalculationPopoverProps) {
    return (
        <div className="space-y-4">
            {/* Title */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <Calculator className="w-4 h-4 text-indigo-400" />
                <h4 className="font-semibold text-zinc-100">{title}</h4>
            </div>

            {/* Formulas */}
            <div className="space-y-2">
                {formulas.map((formula, i) => (
                    <div key={i} className="bg-zinc-800/50 rounded-lg p-3">
                        <div className="text-zinc-400 text-xs mb-1">
                            {i === 0 ? 'Formula:' : 'Alternative:'}
                        </div>
                        <div className="font-mono text-sm text-indigo-300">
                            {formula}
                        </div>
                    </div>
                ))}
            </div>

            {/* Visual Breakdown */}
            {breakdown && breakdown.length > 0 && (
                <div>
                    <div className="text-xs text-zinc-400 mb-2">Visual Breakdown:</div>
                    <BreakdownBar items={breakdown} />
                </div>
            )}

            {/* Additional Notes */}
            {notes && notes.length > 0 && (
                <div className="text-xs text-zinc-400 space-y-1">
                    {notes.map((note, i) => (
                        <div key={i}>• {note}</div>
                    ))}
                </div>
            )}
        </div>
    );
}
