'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GatePage() {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/verify-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key }),
    });

    if (res.ok) {
      router.push('/login');
      router.refresh();
    } else {
      setError('Invalid access key');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #fef7fb, #f0e4f7, #e8f4fd, #fef0e4)' }}>
      <div className="glass-strong rounded-3xl p-8 w-full max-w-sm text-center">
        <div className="text-5xl mb-4">👗</div>
        <h1 className="text-2xl font-bold mb-1">
          Barb&apos;s <span className="text-pink-dark">Closet</span>
        </h1>
        <p className="text-muted text-xs mb-6">Enter your access key to continue</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Access Key"
            className="w-full glass rounded-xl px-4 py-3 text-sm text-center
              focus:outline-none focus:ring-2 focus:ring-pink-dark/30
              placeholder:text-muted/50"
            autoFocus
          />
          {error && (
            <p className="text-red-400 text-xs">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading || !key}
            className="w-full btn-pastel py-3 rounded-xl font-medium text-sm
              disabled:opacity-40 transition-all"
          >
            {loading ? 'Verifying...' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  );
}
