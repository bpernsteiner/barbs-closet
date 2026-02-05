import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { key } = await request.json();
  const accessKey = (process.env.ACCESS_KEY || 'Pernsteiner123').trim();
  const inputKey = (key || '').trim();

  if (inputKey === accessKey) {
    const response = NextResponse.json({ success: true });
    response.cookies.set('barbs-access-key', 'granted', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });
    return response;
  }

  return NextResponse.json({ error: 'Invalid key' }, { status: 401 });
}
