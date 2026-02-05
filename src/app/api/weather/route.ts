import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get('lat');
  const lon = req.nextUrl.searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json({ error: 'lat and lon required' }, { status: 400 });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Weather API key not configured' }, { status: 500 });
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
  );

  if (!response.ok) {
    return NextResponse.json({ error: 'Weather API error' }, { status: 500 });
  }

  const data = await response.json();

  return NextResponse.json({
    temp: data.main.temp,
    feelsLike: data.main.feels_like,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    city: data.name,
  });
}
