'use client';

interface Category {
    id: string;
    label: string;
    color: string;
}

interface CategoryFilterProps {
    categories: Category[];
    selectedCategory: string;
    onSelectCategory: (id: string) => void;
    counts?: Record<string, number>;
}

export function CategoryFilter({
    categories,
    selectedCategory,
    onSelectCategory,
    counts = {}
}: CategoryFilterProps) {
    const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);

    return (
        <div className="flex flex-wrap gap-2 mb-6">
            {/* All filter */}
            <button
                onClick={() => onSelectCategory('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === 'all'
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                        : 'bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800 border border-white/5'
                    }`}
            >
                All
                {totalCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                        {totalCount}
                    </span>
                )}
            </button>

            {/* Category filters */}
            {categories.map(category => {
                const count = counts[category.id] || 0;
                const isSelected = selectedCategory === category.id;

                return (
                    <button
                        key={category.id}
                        onClick={() => onSelectCategory(category.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isSelected
                                ? `${category.color} text-white shadow-lg`
                                : 'bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800 border border-white/5'
                            }`}
                    >
                        {category.label}
                        {count > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                                {count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
