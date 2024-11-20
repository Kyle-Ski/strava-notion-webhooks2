import { NextResponse } from 'next/server';
import { updateNotionPage } from '../../../../utils/notionUtils';

/**
 * Fallback function for the "notion/" route.
 */
export async function GET() {
  const baseUrl = process.env.BASE_URL;
  return NextResponse.json({
    message: "Hello from the Notion route!",
    stravaRoutes: {
      deleteCurrentSubscription: `${baseUrl}/api/strava/delete`,
      deleteSubscriptionById: `${baseUrl}/api/strava/delete/SUBSCRIPTION_ID_TO_DELETE`,
      subscribeToWebhook: `${baseUrl}/api/strava/subscribe`,
      testStravaWebhookEvent: {
        url: `${baseUrl}/api/strava/test/webhook/STRAVA_EVENT_TO_TEST`,
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

/**
 * Tests logging something to the Notion error page.
 * @param {Object} req - Request object containing params.
 */
export async function POST(req) {
  try {
    const { logTitle } = await req.json();
    if (!logTitle) {
      return NextResponse.json({ message: 'Error: Request body must include logTitle.' }, { status: 400 });
    }

    let response;
    if (logTitle.includes("error")) {
      console.warn(`TEST ERROR: ${logTitle}`, "Here's a test error log in Notion for you")
      // response = await logNotionError(`TEST ERROR: ${logTitle}`, "Here's a test error log in Notion for you");
      response = true
      if (!response) {
        return NextResponse.json({ message: 'Error testing an error log to Notion.' }, { status: 500 });
      }
      console.log("Testing Notion Error Log", JSON.stringify(response));
      return NextResponse.json({ message: 'Test error log success!' });
    }
    console.log(`TEST TITLE: ${logTitle}`, "Here's a test log in Notion for you")
    // response = await logNotionItem(`TEST TITLE: ${logTitle}`, "Here's a test log in Notion for you");
    if (!response) {
      return NextResponse.json({ message: 'Error testing a log to Notion.' }, { status: 500 });
    }
    console.log("Testing Notion Log", JSON.stringify(response));
    return NextResponse.json({ message: 'Test log success!' });
  } catch (error) {
    console.error('Error testing Notion log:', error);
    // logNotionError('Error testing Notion log', error);
    return NextResponse.json({ message: 'Error testing Notion log.', details: error.message }, { status: 500 });
  }
}

/**
 * Tests updating a Notion relation.
 * @param {Object} req - Request object containing params.
 */
export async function PUT(req) {
  try {
    const { eventType } = await req.json();
    const eventTypeToTest = eventType || "WeightTraining";
    const response = await updateNotionPage("48402d5bf851432c862998c5aa2a5531", { type: eventTypeToTest });

    if (!response) {
      return NextResponse.json({ message: 'Unable to test updating a Notion relation.' }, { status: 500 });
    }
    return NextResponse.json({ message: 'Successfully tested updating Notion relations!' });
  } catch (error) {
    console.error('Error testing Notion relation update:', error);
    // logNotionError('Error testing Notion relation update', error);
    return NextResponse.json({ message: 'Error testing Notion relation update.', details: error.message }, { status: 500 });
  }
}
