import { NextResponse } from 'next/server';
import fetch from 'node-fetch';
import { logNotionError } from '../../../utils/notionUtils';
import supabase from '@/app/utils/supabaseClient';

/**
 * Exchanges tokens from Strava's Oauth service, authorizing our app to access the user's data.
 * @param {string} code - Short-lived code from Strava used to get our tokens.
 */
export async function POST(req) {
  try {
    const { code } = await req.json();
    if (!code) {
      return NextResponse.json({ message: 'Error: Request body must include code.' }, { status: 400 });
    }

    const bodyParams = new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code',
    });

    const request = await fetch('https://www.strava.com/api/v3/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: bodyParams.toString(),
    });

    if (!request.ok) {
      throw new Error(`Failed to exchange tokens. Status: ${request.status}`);
    }

    const response = await request.json();

    // Store token information in Supabase
    const { data, error } = await supabase.from('tokens').insert([
      {
        user_id: response.athlete.id, // Assuming Strava returns a unique athlete ID
        access_token: response.access_token,
        refresh_token: response.refresh_token,
        expires_at: response.expires_at,
      },
    ]);

    if (error) {
      throw new Error(`Supabase insert error: ${error.message}`);
    }

    return NextResponse.json({
      message: 'Successfully exchanged tokens.',
      subscribeUrl: `${process.env.BASE_URL}/api/strava/subscribe`,
    });
  } catch (error) {
    console.error('Error exchanging tokens with Strava API:', error);
    logNotionError('Error exchanging tokens with Strava', error);
    return NextResponse.json({
      message: 'Error exchanging tokens with Strava API.',
      details: error.message,
    }, { status: 500 });
  }
}

/**
 * Fallback function for the "auth/" route.
 */
export async function GET() {
  return NextResponse.json({ message: 'Hello from the auth route' });
}
