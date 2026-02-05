import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { imageBase64 } = await req.json();

  if (!imageBase64) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
  }

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
          content: [
            {
              type: 'text',
              text: `Analyze this clothing item image. Return ONLY a JSON object with these fields:
- "name": short descriptive name (e.g. "Blue Denim Jacket")
- "category": one of "tops", "bottoms", "dresses", "outerwear", "shoes", "accessories"
- "color": primary color (e.g. "blue", "black", "red")
- "texture": fabric/material (e.g. "cotton", "denim", "silk", "leather", "wool")
- "style": one of "casual", "formal", "sporty", "bohemian", "streetwear", "elegant", "business"
- "occasions": array of suitable occasions from ["work", "casual", "date night", "workout", "party", "formal event", "outdoor", "travel"]

Return ONLY the JSON, no markdown or explanation.`,
            },
            {
              type: 'image_url',
              image_url: { url: imageBase64 },
            },
          ],
        },
      ],
      max_tokens: 300,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    return NextResponse.json({ error: 'OpenAI API error', details: err }, { status: 500 });
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content || '';

  try {
    const cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
    const analysis = JSON.parse(cleaned);
    return NextResponse.json(analysis);
  } catch {
    return NextResponse.json({ error: 'Failed to parse AI response', raw: content }, { status: 500 });
  }
}
