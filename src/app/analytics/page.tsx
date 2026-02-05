'use client';

import { useMemo } from 'react';
import { useWardrobe } from '@/hooks/useWardrobe';
import { capitalize, daysSince } from '@/lib/utils';
import Link from 'next/link';

export default function AnalyticsPage() {
  const { items, loaded } = useWardrobe();

  const stats = useMemo(() => {
    if (items.length === 0) return null;

    const categoryCount: Record<string, number> = {};
    items.forEach((item) => {
      categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
    });

    const totalWears = items.reduce((sum, item) => sum + item.wearCount, 0);
    const mostWorn = [...items].sort((a, b) => b.wearCount - a.wearCount).slice(0, 5);

    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const wornRecently = items.filter(
      (item) => item.lastWorn && new Date(item.lastWorn).getTime() > thirtyDaysAgo
    );
    const sustainabilityScore = Math.round((wornRecently.length / items.length) * 100);

    const forgotten = items.filter((item) => {
      const days = daysSince(item.lastWorn);
      return days === null || days > 60;
    });

    const maxCategory = Math.max(...Object.values(categoryCount));

    return { categoryCount, totalWears, mostWorn, sustainabilityScore, forgotten, maxCategory };
  }, [items]);

  if (!loaded) {
    return <div className="text-center py-12 text-muted text-sm">Loading...</div>;
  }

  if (!stats || items.length === 0) {
    return (
      <div className="glass-strong rounded-2xl text-center py-14 px-6 mt-8">
        <div className="text-5xl mb-3">📊</div>
        <p className="text-muted text-sm mb-5">Add items to see analytics.</p>
        <Link href="/add" className="inline-block btn-pastel px-6 py-3 rounded-2xl text-sm font-medium">
          Add Items ✨
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold">
        <span className="text-pink-dark">Analytics</span>
      </h1>

      {/* Top stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-2xl p-3 text-center">
          <div className="text-xl font-bold text-pink-dark">{items.length}</div>
          <div className="text-[10px] text-muted">Items</div>
        </div>
        <div className="glass rounded-2xl p-3 text-center">
          <div className="text-xl font-bold text-lavender">{stats.totalWears}</div>
          <div className="text-[10px] text-muted">Total Wears</div>
        </div>
        <div className="glass rounded-2xl p-3 text-center">
          <div className="text-xl font-bold text-mint">{stats.sustainabilityScore}%</div>
          <div className="text-[10px] text-muted">Reuse</div>
        </div>
      </div>

      {/* Sustainability Ring */}
      <div className="glass rounded-2xl p-5">
        <h2 className="text-sm font-semibold mb-3">♻️ Sustainability</h2>
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e0d4f5" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke="#e8a0bf" strokeWidth="3"
                strokeDasharray={`${stats.sustainabilityScore}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
              {stats.sustainabilityScore}%
            </div>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            {stats.sustainabilityScore >= 70
              ? 'Amazing! You\'re making great use of your wardrobe. 🌸'
              : stats.sustainabilityScore >= 40
              ? 'Try wearing some forgotten pieces to boost your score.'
              : 'Time to rediscover your closet! Many items are waiting. 💜'}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="glass rounded-2xl p-5">
        <h2 className="text-sm font-semibold mb-3">Categories</h2>
        <div className="space-y-2.5">
          {Object.entries(stats.categoryCount)
            .sort(([, a], [, b]) => b - a)
            .map(([cat, count]) => (
              <div key={cat} className="flex items-center gap-3">
                <span className="text-xs text-muted w-20">{capitalize(cat)}</span>
                <div className="flex-1 bg-lavender-light/30 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(count / stats.maxCategory) * 100}%`,
                      background: 'linear-gradient(135deg, #e8a0bf, #c8b6e2)',
                    }}
                  />
                </div>
                <span className="text-xs font-medium w-6 text-right">{count}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Most Worn */}
      <div className="glass rounded-2xl p-5">
        <h2 className="text-sm font-semibold mb-3">👑 Most Worn</h2>
        <div className="space-y-2.5">
          {stats.mostWorn.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              {item.imageBase64 && (
                <img src={item.imageBase64} alt="" className="w-8 h-8 rounded-lg object-cover" />
              )}
              <span className="text-xs flex-1 truncate">{item.name}</span>
              <span className="text-xs text-pink-dark font-semibold">{item.wearCount}x</span>
            </div>
          ))}
        </div>
      </div>

      {/* Forgotten */}
      {stats.forgotten.length > 0 && (
        <div className="glass rounded-2xl p-5 border border-peach/50">
          <h2 className="text-sm font-semibold mb-1">💤 Forgotten Items</h2>
          <p className="text-[10px] text-muted mb-3">Not worn in 60+ days</p>
          <div className="space-y-2.5">
            {stats.forgotten.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                {item.imageBase64 && (
                  <img src={item.imageBase64} alt="" className="w-8 h-8 rounded-lg object-cover" />
                )}
                <span className="text-xs flex-1 truncate">{item.name}</span>
                <span className="text-[10px] text-muted">
                  {item.lastWorn ? `${daysSince(item.lastWorn)}d` : 'Never'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
