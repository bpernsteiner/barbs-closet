'use client';

import { useWardrobe } from '@/hooks/useWardrobe';
import Link from 'next/link';

export default function OutfitsPage() {
  const { items, loaded } = useWardrobe();

  if (!loaded) {
    return <div className="text-center py-12 text-muted text-sm">Loading...</div>;
  }

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold">
        Outfit <span className="text-pink-dark">Suggestions</span>
      </h1>

      <div className="glass-strong rounded-2xl text-center py-10 px-6">
        <p className="text-muted text-sm mb-4">AI outfit suggestions have been disabled.</p>
        <Link href="/wardrobe" className="inline-block btn-pastel px-6 py-3 rounded-2xl text-sm font-medium">
          View Wardrobe
        </Link>
      </div>
    </div>
  );
}
