import { NextRequest, NextResponse } from 'next/server';
import { ClothingItem, WeatherData } from '@/lib/types';

export async function POST(req: NextRequest) {
  const { items, occasion, weather } = (await req.json()) as {
    items: ClothingItem[];
    occasion: string;
    weather: WeatherData | null;
  };

  if (!items || items.length === 0) {
    return NextResponse.json({ error: 'No wardrobe items provided' }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
  }

  const itemSummaries = items.map((item, i) => (
    `${i}: "${item.name}" - ${item.category}, ${item.color}, ${item.texture}, ${item.style} (worn ${item.wearCount}x)`
  )).join('\n');

  const weatherContext = weather
    ? `Current weather: ${Math.round(weather.temp)}°F, ${weather.description} in ${weather.city}.`
    : 'No weather data available.';

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `You are a personal fashion stylist. Suggest an outfit for the occasion: "${occasion}".

${weatherContext}

Available wardrobe items (index: description):
${itemSummaries}

Pick 2-4 items that work well together for this occasion and weather. Prefer items that haven't been worn recently.

Return ONLY a JSON object:
{
  "itemIndices": [0, 3, 5],
  "reasoning": "A brief explanation of why these items work together",
  "weatherAppropriate": true
}

Return ONLY the JSON, no markdown or explanation.`,
        },
      ],
      max_tokens: 300,
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'OpenAI API error' }, { status: 500 });
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content || '';

  try {
    const cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
    const suggestion = JSON.parse(cleaned);
    const selectedItems = suggestion.itemIndices
      .map((i: number) => items[i])
      .filter(Boolean);

    return NextResponse.json({
      items: selectedItems,
      occasion,
      reasoning: suggestion.reasoning,
      weatherAppropriate: suggestion.weatherAppropriate,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to parse AI response', raw: content }, { status: 500 });
  }
}
