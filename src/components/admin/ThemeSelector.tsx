'use client';

import { useState, useEffect } from 'react';
import { GLASSMORPHISM_THEMES, GlassmorphismTheme, THEME_PREVIEW_IMAGES, applyTheme } from '@/lib/glassmorphism-themes';
import { Popover } from '@/components/ui/popover';

export function ThemeSelector() {
    const [selectedTheme, setSelectedTheme] = useState<string>('cosmic-purple');
    const [isSaving, setIsSaving] = useState(false);

    // Load current theme from settings on mount
    useEffect(() => {
        async function loadTheme() {
            try {
                const response = await fetch('/api/settings');
                const data = await response.json();
                if (data.glassmorphismTheme) {
                    setSelectedTheme(data.glassmorphismTheme);
                    const theme = GLASSMORPHISM_THEMES.find(t => t.id === data.glassmorphismTheme);
                    if (theme) {
                        applyTheme(theme);
                    }
                }
            } catch (error) {
                console.error('Failed to load theme:', error);
            }
        }
        loadTheme();
    }, []);

    const handleThemeSelect = async (themeId: string) => {
        setSelectedTheme(themeId);
        const theme = GLASSMORPHISM_THEMES.find(t => t.id === themeId);
        if (theme) {
            applyTheme(theme);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ glassmorphismTheme: selectedTheme }),
            });
        } catch (error) {
            console.error('Failed to save theme:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Glassmorphism Theme</h2>
                <p className="text-slate-400">Choose from 10 stunning color schemes. Click any theme to preview.</p>
            </div>

            {/* Theme Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {GLASSMORPHISM_THEMES.map((theme) => (
                    <Popover
                        key={theme.id}
                        content={
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-white">{theme.name}</h3>
                                <p className="text-slate-300">{theme.description}</p>
                                <img
                                    src={THEME_PREVIEW_IMAGES[theme.id]}
                                    alt={`${theme.name} preview`}
                                    className="w-full rounded-lg border border-white/10"
                                />
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleThemeSelect(theme.id);
                                    }}
                                    className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                                >
                                    Apply {theme.name}
                                </button>
                            </div>
                        }
                    >
                        <button
                            onClick={() => handleThemeSelect(theme.id)}
                            className={`
                relative group overflow-hidden rounded-xl border-2 transition-all h-32
                ${selectedTheme === theme.id
                                    ? 'border-white shadow-lg shadow-white/20 ring-2 ring-white/50'
                                    : 'border-white/10 hover:border-white/30'
                                }
              `}
                            style={{
                                background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary}, ${theme.colors.tertiary})`,
                            }}
                        >
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm group-hover:bg-black/30 transition-colors" />
                            <div className="relative h-full flex flex-col items-center justify-center p-3 text-center">
                                <div className="text-sm font-semibold text-white mb-1">{theme.name}</div>
                                <div className="text-xs text-white/80">{theme.description.split(' ').slice(0, 3).join(' ') + '...'}</div>
                                {selectedTheme === theme.id && (
                                    <div className="mt-2 flex items-center gap-1 text-xs text-white">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Active
                                    </div>
                                )}
                            </div>
                        </button>
                    </Popover>
                ))}
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                    {isSaving ? 'Saving...' : 'Save Theme'}
                </button>
            </div>
        </div>
    );
}
