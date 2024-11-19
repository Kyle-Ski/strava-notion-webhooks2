import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.BASE_URL;
  return NextResponse.json({
    message: "Hello from the root!",
    authRoutes: {
      exchangeTokens: {
        url: `${baseUrl}/api/auth/exchange_token`,
        example: "Callback URL for Strava to exchange tokens.",
      },
    },
    stravaRoutes: {
      deleteCurrentSubscription: `${baseUrl}/api/strava/delete`,
      deleteSubscriptionById: `${baseUrl}/api/strava/delete/SUBSCRIPTION_ID_TO_DELETE`,
      subscribeToWebhook: `${baseUrl}/api/strava/subscribe`,
      testStravaWebhookEvent: {
        url: `${baseUrl}/api/strava/webhook/STRAVA_EVENT_TO_TEST`,
        example: `${baseUrl}/api/strava/webhook/WeightTraining`,
      },
      validateStravaSubscription: `${baseUrl}/api/strava/webhook`,
      viewSubscriptions: `${baseUrl}/api/strava/view`,
    },
    notionRoutes: {
      testUpdateRelations: {
        url: `${baseUrl}/api/notion/test/relation/EVENT_TYPE`,
        example: `${baseUrl}/api/notion/test/relation/Run`,
      },
      testLogToNotion: {
        url: `${baseUrl}/api/notion/test/log/LOG_TITLE`,
        example: `${baseUrl}/api/notion/test/log-title-1`,
        additionalFunctionality: "You can include 'error' in the log title to test logNotionError().",
      },
    },
  });
}
