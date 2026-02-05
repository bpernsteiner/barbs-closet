'use client';

import { OutfitSuggestion } from '@/lib/types';
import ClothingCard from './ClothingCard';

interface Props {
  outfit: OutfitSuggestion;
  onWearAll?: () => void;
}

export default function OutfitDisplay({ outfit, onWearAll }: Props) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">
          For: <span className="text-pink-dark">{outfit.occasion}</span>
        </h3>
        {outfit.weatherAppropriate && (
          <span className="text-[10px] font-medium bg-mint/40 text-foreground px-2 py-0.5 rounded-full">
            ☀️ Weather-smart
          </span>
        )}
      </div>
      <p className="text-xs text-muted mb-4 leading-relaxed">{outfit.reasoning}</p>
      <div className="grid grid-cols-2 gap-3">
        {outfit.items.map((item) => (
          <ClothingCard key={item.id} item={item} compact />
        ))}
      </div>
      {onWearAll && (
        <button
          onClick={onWearAll}
          className="mt-4 w-full btn-pastel py-2.5 rounded-xl text-sm font-medium"
        >
          Wear This Outfit ✨
        </button>
      )}
    </div>
  );
}
