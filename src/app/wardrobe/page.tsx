'use client';

import { useState, useMemo } from 'react';
import { useWardrobe } from '@/hooks/useWardrobe';
import ClothingCard from '@/components/ClothingCard';
import FilterBar from '@/components/FilterBar';
import { Category, ClothingItem } from '@/lib/types';
import Link from 'next/link';

export default function WardrobePage() {
  const { items, loaded, logWear, deleteItem } = useWardrobe();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [sortBy, setSortBy] = useState('dateAdded');

  const filteredItems = useMemo(() => {
    const filtered = selectedCategory === 'all'
      ? items
      : items.filter((item) => item.category === selectedCategory);

    return filtered.sort((a: ClothingItem, b: ClothingItem) => {
      switch (sortBy) {
        case 'mostWorn': return b.wearCount - a.wearCount;
        case 'leastWorn': return a.wearCount - b.wearCount;
        case 'name': return a.name.localeCompare(b.name);
        default: return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
    });
  }, [items, selectedCategory, sortBy]);

  if (!loaded) {
    return <div className="text-center py-12 text-muted text-sm">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold">
          Your <span className="text-pink-dark">Closet</span>
        </h1>
        <Link
          href="/add"
          className="btn-pastel px-4 py-2 rounded-xl text-xs font-medium"
        >
          + Add
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="glass-strong rounded-2xl text-center py-14 px-6">
          <div className="text-5xl mb-3">👗</div>
          <p className="text-muted text-sm mb-5">Your closet is empty!</p>
          <Link
            href="/add"
            className="inline-block btn-pastel px-6 py-3 rounded-2xl text-sm font-medium"
          >
            Add Your First Item ✨
          </Link>
        </div>
      ) : (
        <>
          <FilterBar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
          <div className="grid grid-cols-2 gap-3">
            {filteredItems.map((item) => (
              <ClothingCard
                key={item.id}
                item={item}
                onWear={() => logWear(item.id)}
                onDelete={() => deleteItem(item.id)}
              />
            ))}
          </div>
          {filteredItems.length === 0 && (
            <p className="text-center text-muted text-sm py-8">No items in this category.</p>
          )}
        </>
      )}
    </div>
  );
}
