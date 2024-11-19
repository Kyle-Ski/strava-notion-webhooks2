import { createClient } from '@supabase/supabase-js';
import { checkTimeExpired } from './unitConversionUtils';
import { responseBuilder } from './httpUtils';
import { logNotionError, logNotionItem } from './notionUtils';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Logs the incoming request details, suitable for Next.js API routes.
 * @param {Object} req - The request object.
 */
export const logRequest = (req) => {
  console.log(`
    Using our logging utility:
    ${req?.method}: "${req?.url}"
    Full URL: "${req?.headers?.host}${req?.url}"
  `);
};

/**
 * Fetches a new access token from Strava using our refresh token.
 * @param {String} currentRefreshToken - The most recent refresh token from Supabase.
 * @returns {Promise<Object>} The response containing new credentials or error.
 */
export const fetchNewTokens = async (currentRefreshToken) => {
  const requestOptions = {
    body: `client_id=${process.env.STRAVA_CLIENT_ID}&client_secret=${process.env.STRAVA_CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${currentRefreshToken}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  };
  return await responseBuilder(
    'https://www.strava.com/oauth/token',
    'Error fetching new access tokens',
    requestOptions
  );
};

/**
 * Checks if the access token is expired, and if so, refreshes it and updates Supabase.
 * Use this function at the beginning of any Strava API interaction.
 * @param {String} userId - The user ID associated with the token.
 * @returns {Promise<String>} The valid access token.
 */
export const refreshStravaToken = async (userId) => {
  try {
    // Fetch token from Supabase
    const { data, error } = await supabase
      .from('tokens')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      throw new Error(`Token retrieval error: ${error?.message || 'No token found'}`);
    }

    // Check if the token is expired
    const timeExpired = checkTimeExpired(data.expires_at);
    console.log('Time expired?', timeExpired);

    if (timeExpired) {
      const newCreds = await fetchNewTokens(data.refresh_token);
      if (!newCreds?.status || !newCreds?.data || newCreds?.status !== 200) {
        console.error('Error refreshing the tokens...', JSON.stringify(newCreds));
        await logNotionError('Error refreshing the tokens', newCreds);
        throw new Error('Failed to refresh tokens.');
      }
      await logNotionItem('Refresh Token Success', { message: 'Setting new creds' });

      // Update Supabase with new tokens
      const { error: updateError } = await supabase
        .from('tokens')
        .update({
          access_token: newCreds.data.access_token,
          refresh_token: newCreds.data.refresh_token,
          expires_at: newCreds.data.expires_at,
        })
        .eq('user_id', userId);

      if (updateError) {
        throw new Error(`Supabase update error: ${updateError.message}`);
      }
      return newCreds.data.access_token;
    } else {
      return data.access_token;
    }
  } catch (error) {
    console.error('Error refreshing Strava token:', error);
    await logNotionError('Error refreshing Strava token', { userId, error: error.message });
    throw new Error('Error refreshing Strava token.');
  }
};
