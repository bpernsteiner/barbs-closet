'use client';

import { ClothingItem } from '@/lib/types';
import { capitalize, daysSince } from '@/lib/utils';

interface Props {
  item: ClothingItem;
  onWear?: () => void;
  onDelete?: () => void;
  compact?: boolean;
}

export default function ClothingCard({ item, onWear, onDelete, compact }: Props) {
  const worn = daysSince(item.lastWorn);

  return (
    <div className="glass rounded-2xl overflow-hidden transition-all hover:shadow-md active:scale-[0.98]">
      <div className="aspect-square relative bg-lavender-light/30">
        {item.imageBase64 ? (
          <img
            src={item.imageBase64}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            👕
          </div>
        )}
        <span className="absolute top-2 left-2 glass-strong text-foreground text-[10px] font-medium px-2 py-0.5 rounded-full">
          {capitalize(item.category)}
        </span>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm truncate">{item.name}</h3>
        {!compact && (
          <>
            <div className="flex gap-1.5 mt-1 text-[11px] text-muted">
              <span>{capitalize(item.color)}</span>
              <span>·</span>
              <span>{capitalize(item.style)}</span>
            </div>
            <div className="flex gap-1.5 mt-0.5 text-[11px] text-muted">
              <span>Worn {item.wearCount}x</span>
              {worn !== null && <span>· {worn}d ago</span>}
            </div>
            <div className="flex gap-2 mt-2.5">
              {onWear && (
                <button
                  onClick={onWear}
                  className="flex-1 text-[11px] font-medium btn-pastel py-1.5 rounded-xl"
                >
                  Wear Today
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="text-[11px] text-muted hover:text-red-400 py-1.5 px-2 rounded-xl transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
