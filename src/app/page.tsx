'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWardrobe } from '@/hooks/useWardrobe';
import { useWeather } from '@/hooks/useWeather';
import WeatherBadge from '@/components/WeatherBadge';
import ClothingCard from '@/components/ClothingCard';

export default function Dashboard() {
  const { items, loaded } = useWardrobe();
  const { weather, loading: weatherLoading, error: weatherError } = useWeather();

  const stats = useMemo(() => {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const wornThisWeek = items.filter(
      (item) => item.lastWorn && new Date(item.lastWorn).getTime() > sevenDaysAgo
    );
    const recentlyAdded = [...items]
      .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
      .slice(0, 4);

    return {
      total: items.length,
      wornThisWeek: wornThisWeek.length,
      recentlyAdded,
    };
  }, [items]);

  if (!loaded) {
    return <div className="text-center py-12 text-muted text-sm">Loading...</div>;
  }

  return (
    <div className="space-y-5">
      {/* Logo + Hero */}
      <div className="text-center pt-4 pb-2">
        <div className="mx-auto w-16 h-16 mb-3">
          <Image src="/logo.svg" alt="Barb's Closet" width={64} height={64} />
        </div>
        <h1 className="text-2xl font-bold">
          Barb&apos;s <span className="text-pink-dark">Closet</span>
        </h1>
        <p className="text-muted text-xs mt-0.5">Your Personal Fashion Assistant</p>
      </div>

      {/* Weather */}
      <WeatherBadge weather={weather} loading={weatherLoading} error={weatherError} />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/wardrobe" className="glass rounded-2xl p-4 text-center active:scale-[0.97] transition-transform">
          <div className="text-2xl font-bold text-pink-dark">{stats.total}</div>
          <div className="text-[11px] text-muted">Total Items</div>
        </Link>
        <Link href="/analytics" className="glass rounded-2xl p-4 text-center active:scale-[0.97] transition-transform">
          <div className="text-2xl font-bold text-lavender">{stats.wornThisWeek}</div>
          <div className="text-[11px] text-muted">Worn This Week</div>
        </Link>
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="glass-strong rounded-2xl text-center py-10 px-6">
          <div className="text-5xl mb-3">🧥</div>
          <h2 className="text-lg font-semibold mb-1">Welcome!</h2>
          <p className="text-muted text-sm mb-5">Start by adding your first clothing item.</p>
          <Link
            href="/add"
            className="inline-block btn-pastel px-8 py-3 rounded-2xl font-medium text-sm"
          >
            Add Your First Item ✨
          </Link>
        </div>
      )}

      {/* Recently Added */}
      {stats.recentlyAdded.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Recently Added</h2>
            <Link href="/wardrobe" className="text-xs text-pink-dark font-medium">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {stats.recentlyAdded.map((item) => (
              <ClothingCard key={item.id} item={item} compact />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
