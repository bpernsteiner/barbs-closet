'use client';

import { useState } from 'react';
import { useWardrobe } from '@/hooks/useWardrobe';
import { useWeather } from '@/hooks/useWeather';
import WeatherBadge from '@/components/WeatherBadge';
import OutfitDisplay from '@/components/OutfitDisplay';
import { OutfitSuggestion } from '@/lib/types';
import Link from 'next/link';

const occasions = ['work', 'casual', 'date night', 'workout', 'party', 'formal event', 'outdoor', 'travel'];

export default function OutfitsPage() {
  const { items, loaded, logWear } = useWardrobe();
  const { weather, loading: weatherLoading, error: weatherError } = useWeather();
  const [selectedOccasion, setSelectedOccasion] = useState('casual');
  const [outfit, setOutfit] = useState<OutfitSuggestion | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateOutfit() {
    if (items.length < 2) return;
    setGenerating(true);
    setError(null);
    setOutfit(null);

    try {
      const res = await fetch('/api/suggest-outfit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, occasion: selectedOccasion, weather }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to generate outfit');
      }
      const suggestion: OutfitSuggestion = await res.json();
      setOutfit(suggestion);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setGenerating(false);
    }
  }

  function handleWearAll() {
    if (!outfit) return;
    outfit.items.forEach((item) => logWear(item.id));
    setOutfit({ ...outfit, reasoning: outfit.reasoning + ' ✅ Logged!' });
  }

  if (!loaded) {
    return <div className="text-center py-12 text-muted text-sm">Loading...</div>;
  }

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold">
        Outfit <span className="text-pink-dark">Suggestions</span>
      </h1>

      <WeatherBadge weather={weather} loading={weatherLoading} error={weatherError} />

      {items.length < 2 ? (
        <div className="glass-strong rounded-2xl text-center py-10 px-6">
          <p className="text-muted text-sm mb-4">Add at least 2 items to get suggestions.</p>
          <Link href="/add" className="inline-block btn-pastel px-6 py-3 rounded-2xl text-sm font-medium">
            Add Items ✨
          </Link>
        </div>
      ) : (
        <>
          <div>
            <label className="block text-xs text-muted mb-2 font-medium">What&apos;s the occasion?</label>
            <div className="flex flex-wrap gap-2">
              {occasions.map((occ) => (
                <button
                  key={occ}
                  onClick={() => setSelectedOccasion(occ)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedOccasion === occ
                      ? 'btn-pastel'
                      : 'glass text-muted active:scale-95'
                  }`}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generateOutfit}
            disabled={generating}
            className="w-full btn-pastel disabled:opacity-40 py-3 rounded-2xl font-medium text-sm"
          >
            {generating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                Styling...
              </span>
            ) : (
              'Generate Outfit 💅'
            )}
          </button>

          {error && (
            <div className="glass rounded-2xl p-4 text-red-500 text-xs border border-red-200">
              {error}
            </div>
          )}

          {outfit && <OutfitDisplay outfit={outfit} onWearAll={handleWearAll} />}
        </>
      )}
    </div>
  );
}
