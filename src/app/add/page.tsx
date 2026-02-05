'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/ImageUpload';
import { AnalysisResult, Category } from '@/lib/types';
import { compressImage, fileToBase64 } from '@/lib/utils';
import { addItem, generateId } from '@/lib/storage';

const categories: Category[] = ['tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories'];
const styles = ['casual', 'formal', 'sporty', 'bohemian', 'streetwear', 'elegant', 'business'];
const occasionOptions = ['work', 'casual', 'date night', 'workout', 'party', 'formal event', 'outdoor', 'travel'];

export default function AddItemPage() {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('tops');
  const [color, setColor] = useState('');
  const [texture, setTexture] = useState('');
  const [style, setStyle] = useState('casual');
  const [occasions, setOccasions] = useState<string[]>([]);

  async function handleImageSelected(file: File) {
    setError(null);
    const compressed = await compressImage(file);
    const fullBase64 = await fileToBase64(file);
    setPreview(compressed);
    setImageBase64(compressed);

    setAnalyzing(true);
    try {
      const res = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: fullBase64 }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Analysis failed');
      }
      const result: AnalysisResult = await res.json();
      setAnalysis(result);
      setName(result.name);
      setCategory(result.category);
      setColor(result.color);
      setTexture(result.texture);
      setStyle(result.style);
      setOccasions(result.occasions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  }

  function toggleOccasion(occ: string) {
    setOccasions((prev) =>
      prev.includes(occ) ? prev.filter((o) => o !== occ) : [...prev, occ]
    );
  }

  function handleSave() {
    if (!imageBase64 || !name) return;
    addItem({
      id: generateId(),
      name, imageBase64, category, color, texture, style, occasions,
      wearCount: 0, lastWorn: null, dateAdded: new Date().toISOString(),
    });
    router.push('/wardrobe');
  }

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold">
        Add to <span className="text-pink-dark">Closet</span>
      </h1>

      <ImageUpload onImageSelected={handleImageSelected} preview={preview} />

      {analyzing && (
        <div className="glass rounded-2xl p-6 text-center">
          <div className="animate-spin inline-block w-7 h-7 border-2 border-pink border-t-transparent rounded-full mb-2"></div>
          <p className="text-muted text-xs">AI is analyzing your clothing...</p>
        </div>
      )}

      {error && (
        <div className="glass rounded-2xl p-4 text-red-500 text-xs border border-red-200">
          {error}
        </div>
      )}

      {(analysis || preview) && !analyzing && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-muted mb-1 font-medium">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full glass rounded-xl px-3 py-2.5 text-sm"
              placeholder="e.g. Blue Denim Jacket"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted mb-1 font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full glass rounded-xl px-3 py-2.5 text-sm"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted mb-1 font-medium">Color</label>
              <input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full glass rounded-xl px-3 py-2.5 text-sm"
                placeholder="e.g. blue"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted mb-1 font-medium">Material</label>
              <input
                value={texture}
                onChange={(e) => setTexture(e.target.value)}
                className="w-full glass rounded-xl px-3 py-2.5 text-sm"
                placeholder="e.g. cotton"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1 font-medium">Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full glass rounded-xl px-3 py-2.5 text-sm"
              >
                {styles.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-muted mb-2 font-medium">Occasions</label>
            <div className="flex flex-wrap gap-2">
              {occasionOptions.map((occ) => (
                <button
                  key={occ}
                  onClick={() => toggleOccasion(occ)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    occasions.includes(occ)
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
            onClick={handleSave}
            disabled={!name || !imageBase64}
            className="w-full btn-pastel disabled:opacity-40 py-3 rounded-2xl font-medium text-sm"
          >
            Save to Closet ✨
          </button>
        </div>
      )}
    </div>
  );
}
