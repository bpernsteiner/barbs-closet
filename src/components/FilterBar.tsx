'use client';

import { Category } from '@/lib/types';
import { capitalize } from '@/lib/utils';

const categories: (Category | 'all')[] = ['all', 'tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories'];

interface Props {
  selectedCategory: Category | 'all';
  onCategoryChange: (cat: Category | 'all') => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export default function FilterBar({ selectedCategory, onCategoryChange, sortBy, onSortChange }: Props) {
  return (
    <div className="mb-5 space-y-3">
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'btn-pastel'
                : 'glass text-muted active:scale-95'
            }`}
          >
            {capitalize(cat)}
          </button>
        ))}
      </div>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="glass text-foreground text-xs rounded-xl px-3 py-2 w-full"
      >
        <option value="dateAdded">Recently Added</option>
        <option value="mostWorn">Most Worn</option>
        <option value="leastWorn">Least Worn</option>
        <option value="name">Name</option>
      </select>
    </div>
  );
}
