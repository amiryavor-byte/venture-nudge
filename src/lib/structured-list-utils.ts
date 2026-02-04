import { v4 as uuidv4 } from 'uuid';

export interface BaseItem {
    id: string;
    order: number;
}

export interface StructuredListUtils {
    create<T extends BaseItem>(item: Omit<T, 'id' | 'order'>, items: T[]): T[];
    update<T extends BaseItem>(id: string, updates: Partial<T>, items: T[]): T[];
    delete<T extends BaseItem>(id: string, items: T[]): T[];
    reorder<T extends BaseItem>(fromIndex: number, toIndex: number, items: T[]): T[];
    filterByCategory<T extends BaseItem & { category?: string }>(category: string, items: T[]): T[];
    groupByCategory<T extends BaseItem & { category?: string }>(items: T[]): Map<string, T[]>;
    exportToCSV<T extends BaseItem>(items: T[], filename: string): void;
}

export const structuredListUtils: StructuredListUtils = {
    create<T extends BaseItem>(item: Omit<T, 'id' | 'order'>, items: T[]): T[] {
        const newItem = {
            ...item,
            id: uuidv4(),
            order: items.length
        } as T;
        return [...items, newItem];
    },

    update<T extends BaseItem>(id: string, updates: Partial<T>, items: T[]): T[] {
        return items.map(item =>
            item.id === id ? { ...item, ...updates } : item
        );
    },

    delete<T extends BaseItem>(id: string, items: T[]): T[] {
        const filtered = items.filter(item => item.id !== id);
        // Re-index order
        return filtered.map((item, index) => ({ ...item, order: index }));
    },

    reorder<T extends BaseItem>(fromIndex: number, toIndex: number, items: T[]): T[] {
        const result = Array.from(items);
        const [removed] = result.splice(fromIndex, 1);
        result.splice(toIndex, 0, removed);
        // Update order property
        return result.map((item, index) => ({ ...item, order: index }));
    },

    filterByCategory<T extends BaseItem & { category?: string }>(category: string, items: T[]): T[] {
        if (category === 'all') return items;
        return items.filter(item => item.category === category);
    },

    groupByCategory<T extends BaseItem & { category?: string }>(items: T[]): Map<string, T[]> {
        const groups = new Map<string, T[]>();
        items.forEach(item => {
            const category = item.category || 'uncategorized';
            if (!groups.has(category)) {
                groups.set(category, []);
            }
            groups.get(category)!.push(item);
        });
        return groups;
    },

    exportToCSV<T extends BaseItem>(items: T[], filename: string): void {
        if (items.length === 0) return;

        const headers = Object.keys(items[0]).join(',');
        const rows = items.map(item =>
            Object.values(item).map(val =>
                typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
            ).join(',')
        );

        const csv = [headers, ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }
};

// Migration utilities
export const migrationUtils = {
    parseTextToList(text: string): string[] {
        if (!text) return [];

        const lines = text.split('\n').filter(line => line.trim());
        const items: string[] = [];

        for (const line of lines) {
            const cleaned = line
                .replace(/^\d+\.\s*/, '') // Remove "1. "
                .replace(/^\*\*\d+\.\*\*\s*/, '') // Remove "**1.** "
                .replace(/^[-*•]\s*/, '') // Remove bullet points
                .replace(/^\*\*/, '') // Remove leading **
                .replace(/\*\*:?\s*$/, '') // Remove trailing **
                .replace(/^###\s*/, '') // Remove markdown headers
                .trim();

            if (cleaned && cleaned.length > 3) {
                items.push(cleaned);
            }
        }

        return items;
    },

    convertToStructured(text: string, defaultCategory: string = 'uncategorized'): any[] {
        const lines = this.parseTextToList(text);
        return lines.map((line, index) => ({
            id: uuidv4(),
            title: line,
            description: '',
            category: defaultCategory,
            order: index
        }));
    }
};
