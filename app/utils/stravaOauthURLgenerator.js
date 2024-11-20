// import { logNotionItem, logNotionError } from './notionUtils';

/**
 * Generates the Strava OAuth authorization URL using the base URL and client credentials.
 * This is used to initiate the OAuth flow and authorize our app with Strava.
 * @returns {String} The Strava OAuth authorization URL.
 */
export const generateStravaOAuthUrl = (client_id) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://localhost:3000'; // Default to localhost if BASE_URL is not set
    // const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
    console.log('Client ID:', client_id);
    if (!client_id) {
      throw new Error('CLIENT_ID is not set in environment variables.');
    }

    const redirectUri = `${baseUrl}/api/auth/exchange_token`;
    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=read_all,read,activity:read`;

    console.log('Generated Strava OAuth URL', { authUrl })
    // logNotionItem('Generated Strava OAuth URL', { authUrl });
    console.log('Generated Strava OAuth URL:', authUrl);

    return authUrl;
  } catch (error) {
    console.error('Error generating Strava OAuth URL:', error);
    // logNotionError('Error generating Strava OAuth URL', error);
    throw new Error('Failed to generate Strava OAuth URL.');
  }
};
