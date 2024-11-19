import { NextResponse } from 'next/server';
import { refreshStravaToken } from '../../../../middleware';
import { subscribeToWebhook } from '../../../../controllers/stravaController';

export async function POST(req) {
  try {
    const userId = req.query.user_id;

    // Ensure the token is refreshed before processing
    await refreshStravaToken(userId);

    // Proceed with subscribing to the webhook
    const response = await subscribeToWebhook();
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error subscribing to webhook:", error);
    return NextResponse.json({ message: "Failed to subscribe", error }, { status: 500 });
  }
}
