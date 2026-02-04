import { db } from '@/db';
import { themeConfig } from '@/db/schema';
import { PRESET_THEMES } from './theme-presets';
import { eq } from 'drizzle-orm';

export interface Theme {
    id: string;
    name: string;
    isActive: boolean;
    isCustom: boolean;
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
    spacing?: { scale: number };
    borderRadius?: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
    shadows?: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
    images?: Record<string, string>;
}

export async function getAllThemes(): Promise<Theme[]> {
    const themes = await db.query.themeConfig.findMany();

    return themes.map(theme => ({
        id: theme.id,
        name: theme.name,
        isActive: theme.isActive ?? false,
        isCustom: theme.isCustom ?? false,
        colors: theme.colors as Theme['colors'],
        fonts: theme.fonts as Theme['fonts'],
        spacing: theme.spacing as Theme['spacing'],
        borderRadius: theme.borderRadius as Theme['borderRadius'],
        shadows: theme.shadows as Theme['shadows'],
        images: (theme.images as Theme['images']) || {},
    }));
}

export async function getActiveTheme(): Promise<Theme | null> {
    const theme = await db.query.themeConfig.findFirst({
        where: eq(themeConfig.isActive, true),
    });

    if (!theme) return null;

    return {
        id: theme.id,
        name: theme.name,
        isActive: true,
        isCustom: theme.isCustom ?? false,
        colors: theme.colors as Theme['colors'],
        fonts: theme.fonts as Theme['fonts'],
        spacing: theme.spacing as Theme['spacing'],
        borderRadius: theme.borderRadius as Theme['borderRadius'],
        shadows: theme.shadows as Theme['shadows'],
        images: (theme.images as Theme['images']) || {},
    };
}

export async function setActiveTheme(themeId: string): Promise<void> {
    // Deactivate all themes
    const allThemes = await getAllThemes();
    for (const theme of allThemes) {
        await db
            .update(themeConfig)
            .set({ isActive: false })
            .where(eq(themeConfig.id, theme.id));
    }

    // Activate selected theme
    await db
        .update(themeConfig)
        .set({ isActive: true, updatedAt: new Date() })
        .where(eq(themeConfig.id, themeId));
}

export async function seedDefaultThemes() {
    const existing = await db.query.themeConfig.findMany();

    if (existing.length > 0) {
        console.log('Themes already seeded');
        return;
    }

    console.log('Seeding default themes...');

    for (const preset of PRESET_THEMES) {
        await db.insert(themeConfig).values({
            id: preset.id,
            name: preset.name,
            isActive: preset.isActive,
            isCustom: preset.isCustom,
            colors: preset.colors,
            fonts: preset.fonts,
            spacing: preset.spacing,
            borderRadius: preset.borderRadius,
            shadows: preset.shadows,
            images: preset.images,
        });
    }

    console.log(`Seeded ${PRESET_THEMES.length} themes successfully`);
}

export async function updateTheme(themeId: string, updates: Partial<Theme>): Promise<void> {
    const updateData: any = { updatedAt: new Date() };

    if (updates.name) updateData.name = updates.name;
    if (updates.colors) updateData.colors = updates.colors;
    if (updates.fonts) updateData.fonts = updates.fonts;
    if (updates.spacing) updateData.spacing = updates.spacing;
    if (updates.borderRadius) updateData.borderRadius = updates.borderRadius;
    if (updates.shadows) updateData.shadows = updates.shadows;
    if (updates.images) updateData.images = updates.images;

    await db
        .update(themeConfig)
        .set(updateData)
        .where(eq(themeConfig.id, themeId));
}
