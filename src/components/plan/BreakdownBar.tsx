interface BreakdownBarProps {
    items: {
        label: string;
        value: number;
        color: string;
    }[];
}

export function BreakdownBar({ items }: BreakdownBarProps) {
    const total = items.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="space-y-2">
            {items.map((item, i) => {
                const percentage = total > 0 ? (item.value / total) * 100 : 0;
                return (
                    <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span className="text-zinc-400">{item.label}</span>
                            <span className="text-zinc-300 font-medium">
                                ${item.value.toLocaleString()} ({Math.round(percentage)}%)
                            </span>
                        </div>
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className={item.color}
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
