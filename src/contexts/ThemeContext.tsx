'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface Theme {
    id: string;
    name: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        surface: string;
        surfaceHover: string;
        text: string;
        textSecondary: string;
        textMuted: string;
        border: string;
        divider: string;
        success: string;
        warning: string;
        error: string;
        info: string;
    };
    fonts: {
        heading: string;
        body: string;
        mono: string;
    };
}

interface ThemeContextValue {
    theme: Theme | null;
    refreshTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: null,
    refreshTheme: async () => { },
});

export function useTheme() {
    return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme | null>(null);

    const fetchActiveTheme = async () => {
        try {
            const response = await fetch('/api/theme');
            const data = await response.json();
            if (data.activeTheme) {
                setTheme(data.activeTheme);
                applyTheme(data.activeTheme);
            }
        } catch (error) {
            console.error('Failed to fetch theme:', error);
        }
    };

    const applyTheme = (theme: Theme) => {
        const root = document.documentElement;

        // Apply colors as CSS variables
        Object.entries(theme.colors).forEach(([key, value]) => {
            const cssVarName = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            root.style.setProperty(cssVarName, value);
        });

        // Apply fonts
        root.style.setProperty('--font-heading', theme.fonts.heading);
        root.style.setProperty('--font-body', theme.fonts.body);
        root.style.setProperty('--font-mono', theme.fonts.mono);
    };

    useEffect(() => {
        fetchActiveTheme();
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, refreshTheme: fetchActiveTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
