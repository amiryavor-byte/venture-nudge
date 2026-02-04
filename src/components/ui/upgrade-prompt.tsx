'use client';

interface UpgradePromptProps {
    feature: string;
    description?: string;
    variant?: 'inline' | 'card';
}

export function UpgradePrompt({ feature, description, variant = 'inline' }: UpgradePromptProps) {
    const handleUpgrade = (type: 'subscription' | 'one-time') => {
        // TODO: Implement payment flow
        console.log(`Upgrade clicked: ${type}`);
        alert(`${type === 'one-time' ? 'One-time purchase' : 'Subscription'} coming soon!`);
    };

    if (variant === 'card') {
        return (
            <div className="border-2 border-dashed border-indigo-500/30 rounded-lg p-6 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 my-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        🔒 {feature}
                    </h3>
                    <span className="text-sm text-zinc-400 px-2 py-1 bg-zinc-800/50 rounded">
                        Free Plan
                    </span>
                </div>

                {description && (
                    <p className="text-sm text-zinc-300 mb-4">
                        {description}
                    </p>
                )}

                <div className="flex gap-3 flex-wrap">
                    <button
                        onClick={() => handleUpgrade('one-time')}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors"
                    >
                        Download Full Plan - $299
                    </button>
                    <button
                        onClick={() => handleUpgrade('subscription')}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors"
                    >
                        Subscribe - $4.99/mo
                    </button>
                </div>
            </div>
        );
    }

    // Inline variant (for smaller prompts within content)
    return (
        <div className="flex items-center gap-2 px-3 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-sm my-2">
            <span className="text-indigo-400">🔒</span>
            <span className="text-zinc-300 flex-1">
                <strong>Upgrade to unlock</strong> {feature}
            </span>
            <button
                onClick={() => handleUpgrade('subscription')}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded text-xs font-medium transition-colors"
            >
                Upgrade
            </button>
        </div>
    );
}
