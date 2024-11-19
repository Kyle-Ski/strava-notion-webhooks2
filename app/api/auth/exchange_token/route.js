import { NextResponse } from 'next/server';
import { exchangeTokens } from '../../../../controllers/authController';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (code) {
    return await exchangeTokens(code);
  } else {
    return NextResponse.json({ message: "ERROR: request query code from strava not found." }, { status: 400 });
  }
}
