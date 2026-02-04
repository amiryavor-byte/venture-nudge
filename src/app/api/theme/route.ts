import { NextResponse } from 'next/server';
import { getAllThemes, getActiveTheme, setActiveTheme, updateTheme } from '@/lib/theme-service';

export async function GET() {
    try {
        const themes = await getAllThemes();
        const activeTheme = await getActiveTheme();

        return NextResponse.json({
            themes,
            activeTheme,
        });
    } catch (error) {
        console.error('Failed to fetch themes:', error);
        return NextResponse.json(
            { error: 'Failed to fetch themes' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { action, themeId, updates } = body;

        if (action === 'setActive') {
            await setActiveTheme(themeId);
            return NextResponse.json({ success: true });
        }

        if (action === 'update') {
            await updateTheme(themeId, updates);
            return NextResponse.json({ success: true });
        }

        return NextResponse.json(
            { error: 'Invalid action' },
            { status: 400 }
        );
    } catch (error) {
        console.error('Failed to update theme:', error);
        return NextResponse.json(
            { error: 'Failed to update theme' },
            { status: 500 }
        );
    }
}
