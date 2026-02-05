'use client';

import { WeatherData } from '@/lib/types';

interface Props {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
}

export default function WeatherBadge({ weather, loading, error }: Props) {
  if (loading) {
    return (
      <div className="glass rounded-2xl p-4 animate-pulse">
        <div className="h-4 bg-lavender-light/50 rounded-full w-32"></div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="glass rounded-2xl p-3 text-muted text-xs text-center">
        {error || 'Weather unavailable'}
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-3 flex items-center gap-3">
      <img
        src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
        alt={weather.description}
        className="w-11 h-11"
      />
      <div className="flex-1">
        <div className="font-semibold text-sm">{Math.round(weather.temp)}&deg;F</div>
        <div className="text-[11px] text-muted capitalize">
          {weather.description} in {weather.city}
        </div>
      </div>
      <div className="text-[11px] text-muted">
        Feels {Math.round(weather.feelsLike)}&deg;
      </div>
    </div>
  );
}
