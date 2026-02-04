export interface GlassmorphismTheme {
    id: string;
    name: string;
    description: string;
    colors: {
        primary: string;
        secondary: string;
        tertiary: string;
        accent: string;
        glassBackground: string;
        glassBorder: string;
        glowColor: string;
        textPrimary: string;
        textSecondary: string;
    };
}

export const GLASSMORPHISM_THEMES: GlassmorphismTheme[] = [
    {
        id: 'cosmic-purple',
        name: 'Cosmic Purple',
        description: 'Purple, pink, and blue cosmic gradient',
        colors: {
            primary: '#8b5cf6', // purple
            secondary: '#ec4899', // pink
            tertiary: '#3b82f6', // blue
            accent: '#a855f7', // bright purple
            glassBackground: 'rgba(139, 92, 246, 0.1)',
            glassBorder: 'rgba(168, 85, 247, 0.3)',
            glowColor: '#a855f7',
            textPrimary: '#ffffff',
            textSecondary: '#e0e7ff',
        },
    },
    {
        id: 'ocean-blue',
        name: 'Ocean Blue',
        description: 'Deep blue, cyan, and teal gradient',
        colors: {
            primary: '#0c4a6e', // deep blue
            secondary: '#06b6d4', // cyan
            tertiary: '#14b8a6', // teal
            accent: '#22d3ee', // bright cyan
            glassBackground: 'rgba(34, 211, 238, 0.1)',
            glassBorder: 'rgba(34, 211, 238, 0.3)',
            glowColor: '#22d3ee',
            textPrimary: '#ffffff',
            textSecondary: '#e0f2fe',
        },
    },
    {
        id: 'sunset-amber',
        name: 'Sunset Amber',
        description: 'Orange, red, and pink sunset gradient',
        colors: {
            primary: '#f97316', // orange
            secondary: '#dc2626', // red
            tertiary: '#ec4899', // pink
            accent: '#fb923c', // bright orange
            glassBackground: 'rgba(251, 146, 60, 0.1)',
            glassBorder: 'rgba(251, 146, 60, 0.3)',
            glowColor: '#fb923c',
            textPrimary: '#ffffff',
            textSecondary: '#fff7ed',
        },
    },
    {
        id: 'forest-green',
        name: 'Forest Green',
        description: 'Emerald, green, and teal forest gradient',
        colors: {
            primary: '#059669', // emerald
            secondary: '#10b981', // green
            tertiary: '#14b8a6', // teal
            accent: '#34d399', // bright green
            glassBackground: 'rgba(52, 211, 153, 0.1)',
            glassBorder: 'rgba(52, 211, 153, 0.3)',
            glowColor: '#34d399',
            textPrimary: '#ffffff',
            textSecondary: '#ecfdf5',
        },
    },
    {
        id: 'rose-gold',
        name: 'Rose Gold',
        description: 'Pink, gold, and peach luxury gradient',
        colors: {
            primary: '#f472b6', // pink
            secondary: '#f59e0b', // gold
            tertiary: '#fb923c', // peach
            accent: '#fbbf24', // bright gold
            glassBackground: 'rgba(251, 191, 36, 0.1)',
            glassBorder: 'rgba(251, 191, 36, 0.3)',
            glowColor: '#fbbf24',
            textPrimary: '#ffffff',
            textSecondary: '#fef3c7',
        },
    },
    {
        id: 'arctic-ice',
        name: 'Arctic Ice',
        description: 'Light blue, white, and cyan ice gradient',
        colors: {
            primary: '#bae6fd', // light blue
            secondary: '#e0f2fe', // pale cyan
            tertiary: '#67e8f9', // cyan
            accent: '#22d3ee', // bright cyan
            glassBackground: 'rgba(34, 211, 238, 0.1)',
            glassBorder: 'rgba(186, 230, 253, 0.5)',
            glowColor: '#67e8f9',
            textPrimary: '#ffffff',
            textSecondary: '#f0f9ff',
        },
    },
    {
        id: 'midnight',
        name: 'Midnight',
        description: 'Dark navy, black, and purple night gradient',
        colors: {
            primary: '#1e1b4b', // dark navy
            secondary: '#312e81', // navy
            tertiary: '#6b21a8', // dark purple
            accent: '#7c3aed', // bright purple
            glassBackground: 'rgba(124, 58, 237, 0.1)',
            glassBorder: 'rgba(124, 58, 237, 0.3)',
            glowColor: '#7c3aed',
            textPrimary: '#ffffff',
            textSecondary: '#ddd6fe',
        },
    },
    {
        id: 'aurora',
        name: 'Aurora',
        description: 'Northern lights multi-color gradient',
        colors: {
            primary: '#10b981', // green
            secondary: '#8b5cf6', // purple
            tertiary: '#06b6d4', // cyan
            accent: '#ec4899', // pink
            glassBackground: 'rgba(16, 185, 129, 0.1)',
            glassBorder: 'rgba(236, 72, 153, 0.3)',
            glowColor: '#10b981',
            textPrimary: '#ffffff',
            textSecondary: '#f0fdf4',
        },
    },
    {
        id: 'crimson',
        name: 'Crimson',
        description: 'Red, burgundy, and orange fire gradient',
        colors: {
            primary: '#dc2626', // red
            secondary: '#991b1b', // burgundy
            tertiary: '#ea580c', // orange
            accent: '#f87171', // bright red
            glassBackground: 'rgba(248, 113, 113, 0.1)',
            glassBorder: 'rgba(248, 113, 113, 0.3)',
            glowColor: '#f87171',
            textPrimary: '#ffffff',
            textSecondary: '#fef2f2',
        },
    },
    {
        id: 'monochrome',
        name: 'Monochrome',
        description: 'Grayscale with subtle blue accent',
        colors: {
            primary: '#6b7280', // gray
            secondary: '#9ca3af', // light gray
            tertiary: '#60a5fa', // subtle blue
            accent: '#93c5fd', // light blue
            glassBackground: 'rgba(147, 197, 253, 0.1)',
            glassBorder: 'rgba(156, 163, 175, 0.3)',
            glowColor: '#93c5fd',
            textPrimary: '#ffffff',
            textSecondary: '#f3f4f6',
        },
    },
];

export function getThemeById(id: string): GlassmorphismTheme | undefined {
    return GLASSMORPHISM_THEMES.find(theme => theme.id === id);
}

export function applyTheme(theme: GlassmorphismTheme) {
    const root = document.documentElement;

    // Set CSS variables
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-tertiary', theme.colors.tertiary);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--glass-bg', theme.colors.glassBackground);
    root.style.setProperty('--glass-border', theme.colors.glassBorder);
    root.style.setProperty('--glow-color', theme.colors.glowColor);
    root.style.setProperty('--text-primary', theme.colors.textPrimary);
    root.style.setProperty('--text-secondary', theme.colors.textSecondary);
}

// Map theme IDs to their preview images
export const THEME_PREVIEW_IMAGES: Record<string, string> = {
    'cosmic-purple': '/brain/chat_cosmic_purple.png',
    'ocean-blue': '/brain/chat_ocean_blue.png',
    'sunset-amber': '/brain/chat_sunset_amber.png',
    'forest-green': '/brain/chat_forest_green.png',
    'rose-gold': '/brain/chat_rose_gold.png',
    'arctic-ice': '/brain/chat_arctic_ice.png',
    'midnight': '/brain/chat_midnight.png',
    'aurora': '/brain/chat_aurora.png',
    'crimson': '/brain/chat_crimson.png',
    'monochrome': '/brain/chat_monochrome.png',
};
