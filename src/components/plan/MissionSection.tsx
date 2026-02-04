import { BusinessPlanData } from '@/lib/business-plan-service';
import { Target } from 'lucide-react';
import { InlineEditable } from '@/components/engines/InlineEditable';

interface MissionSectionProps {
    data: BusinessPlanData;
    onChange?: (data: BusinessPlanData) => void;
}

export function MissionSection({ data, onChange }: MissionSectionProps) {
    const handleChange = (newValue: string) => {
        if (onChange) {
            onChange({
                ...data,
                missionStatement: newValue
            });
        }
    };

    return (
        <div className="bg-zinc-900/20 rounded-2xl border border-white/5 p-8 md:p-12 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-500/20 border border-indigo-500/30 p-3 rounded-xl">
                    <Target className="w-6 h-6 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-zinc-100">Mission Statement</h2>
            </div>
            {onChange ? (
                <InlineEditable
                    value={data.missionStatement}
                    onSave={handleChange}
                    className="text-lg md:text-xl leading-relaxed font-medium text-zinc-200 block"
                />
            ) : (
                <p className="text-lg md:text-xl leading-relaxed font-medium text-zinc-200">
                    {data.missionStatement}
                </p>
            )}
        </div>
    );
}
