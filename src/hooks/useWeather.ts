'use client';

import { useState, useEffect } from 'react';
import { WeatherData } from '@/lib/types';

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `/api/weather?lat=${latitude}&lon=${longitude}`
          );
          if (!res.ok) throw new Error('Weather fetch failed');
          const data = await res.json();
          setWeather(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load weather');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Location access denied');
        setLoading(false);
      }
    );
  }, []);

  return { weather, loading, error };
}
