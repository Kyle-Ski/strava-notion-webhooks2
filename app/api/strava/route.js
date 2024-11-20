import { NextResponse } from 'next/server';
import FormData from 'form-data';
import { responseBuilder } from '@/app/utils/httpUtils';
import {
  logRequest,
  refreshStravaToken,
  handleStravaReauthorizationError,
  // logNotionError,
  // logNotionItem,
} from '@/app/utils/stravaHelpers';
import { getActivityById } from '@/app/utils/stravaUtils';
import {
  updateNotionPage,
  addNotionItem,
  deleteNotionPage,
  fmtNotionObject,
  getAllStravaPages,
} from '@/app/utils/notionUtils';

/**
 * Deletes a subscription by its ID.
 * @param {Object} req - Request object containing params.
 */
export async function DELETE(req) {
  try {
    logRequest(req);

    const { subscriptionId } = req.query;
    if (!subscriptionId) {
      return NextResponse.json(
        { message: 'Error: Request must include subscriptionId.' },
        { status: 400 }
      );
    }

    const body = new FormData();
    body.append('client_id', process.env.NEXT_PUBLIC_CLIENT_ID);
    body.append('client_secret', process.env.CLIENT_SECRET);
    const requestOptions = {
      body,
      method: 'DELETE',
    };

    const response = await responseBuilder(
      `https://www.strava.com/api/v3/push_subscriptions/${subscriptionId}`,
      `Error deleting subscription: ${subscriptionId}`,
      requestOptions
    );

    if (response.status !== 200) {
      throw new Error(`Error deleting subscription: ${response.status}`);
    }

    return NextResponse.json({ message: 'Subscription successfully deleted.' });
  } catch (error) {
    handleStravaReauthorizationError(error);
    console.error('Error deleting Strava subscription:', error);
    // await logNotionError('Error deleting Strava subscription', error);
    return NextResponse.json(
      { message: 'Error deleting Strava subscription.', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Handles the subscription webhook validation from Strava.
 * @param {Object} req - Request object containing params.
 */
export async function GET(req) {
  try {
    logRequest(req);

    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return NextResponse.json({ 'hub.challenge': challenge });
    } else {
      return NextResponse.json({ message: 'Forbidden.' }, { status: 403 });
    }
  } catch (error) {
    console.error('Error validating Strava subscription:', error);
    // await logNotionError('Error validating Strava subscription', error);
    return NextResponse.json(
      { message: 'Error validating Strava subscription.', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Receives webhook events from Strava and processes them accordingly.
 * @param {Object} req - Request object containing body and query params.
 */
export async function POST(req) {
  try {
    logRequest(req);

    const body = await req.json();
    console.log('Webhook event received!', body);
    // await logNotionItem('Webhook Event', {
    //   object_type: body?.object_type,
    //   aspect_type: body?.aspect_type,
    //   body: body,
    // });

    switch (body?.object_type) {
      case 'activity':
        switch (body?.aspect_type) {
          case 'create':
            return await createWebhookEvent(body);
          case 'update':
            return await updateWebhookEvent(body);
          case 'delete':
            await deleteNotionPage(body?.object_id);
            return NextResponse.json({ message: 'EVENT_RECEIVED' });
          default:
            console.warn('Unexpected Strava aspect_type', {
              aspect_type: body?.aspect_type,
            })
            // await logNotionError('Unexpected Strava aspect_type', {
            //   aspect_type: body?.aspect_type,
            // });
            return NextResponse.json({ message: 'EVENT_RECEIVED' });
        }
      default:
        console.warn('Unexpected Strava object_type', {
          object_type: body?.object_type,
        })
        // await logNotionError('Unexpected Strava object_type', {
        //   object_type: body?.object_type,
        // });
        return NextResponse.json({ message: 'EVENT_RECEIVED' });
    }
  } catch (error) {
    handleStravaReauthorizationError(error);
    console.error('Error processing Strava webhook event:', error);
    // await logNotionError('Error processing Strava webhook event', error);
    return NextResponse.json(
      { message: 'Error processing Strava webhook event.', details: error.message },
      { status: 500 }
    );
  }
}

async function createWebhookEvent(body) {
  try {
    const userId = body?.owner_id; // Assuming user ID is owner_id from Strava webhook payload.
    const token = await refreshStravaToken(userId);
    const payload = await getActivityById(body.object_id, token);

    if (!payload) {
      return NextResponse.json({ message: 'EVENT_RECEIVED' });
    }

    const formattedNotionObject = await fmtNotionObject(payload, true);
    if (!formattedNotionObject) {
      console.error('Error creating Notion page', 'Empty formatted notion object')
      // await logNotionError('Error creating Notion page', 'Empty formatted notion object');
      return NextResponse.json({ message: 'EVENT_RECEIVED' });
    }

    await addNotionItem(formattedNotionObject);
    return NextResponse.json({ message: 'EVENT_RECEIVED' });
  } catch (error) {
    handleStravaReauthorizationError(error);
    console.error('Error creating Strava webhook event:', error);
    // await logNotionError('Error creating Strava webhook event', error);
    return NextResponse.json(
      { message: 'Error creating Strava webhook event.', details: error.message },
      { status: 500 }
    );
  }
}

async function updateWebhookEvent(body) {
  try {
    const userId = body?.owner_id;
    const token = await refreshStravaToken(userId);
    const updatedActivity = await getActivityById(body?.object_id, token);

    if (!updatedActivity) {
      return NextResponse.json({ message: 'EVENT_RECEIVED' });
    }

    const allStravaPages = await getAllStravaPages();
    const notionId = allStravaPages.find(
      (item) => item.properties?.strava_id?.rich_text[0]?.text?.content == updatedActivity.id
    )?.id;

    if (!notionId) {
      console.log('Update From Unknown Strava Activity', 'Creating new Notion page')
      // await logNotionItem('Update From Unknown Strava Activity', 'Creating new Notion page');
      return await createWebhookEvent(body);
    }

    await updateNotionPage(notionId, updatedActivity);
    return NextResponse.json({ message: 'EVENT_RECEIVED' });
  } catch (error) {
    handleStravaReauthorizationError(error);
    console.error('Error updating Strava webhook event:', error);
    // await logNotionError('Error updating Strava webhook event', error);
    return NextResponse.json(
      { message: 'Error updating Strava webhook event.', details: error.message },
      { status: 500 }
    );
  }
}
