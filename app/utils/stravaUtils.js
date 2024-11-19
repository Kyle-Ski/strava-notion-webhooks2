import { handleStravaReauthorizationError, logRequest, logNotionError, logNotionItem } from './stravaHelpers';
import strava from 'strava-v3';

/**
 * Gets a Strava Activity by its ID
 * @param {String} id Strava Activity ID
 * @param {String} token Strava access_token
 * @returns {Promise} The Strava activity
 */
export const getActivityById = async (id, token) => {
  try {
    if (!token) {
      throw new Error('Strava access token is required to fetch activity.');
    }

    // Log the request for debugging
    logRequest({ id, operation: 'getActivityById' });

    const payload = await strava.activities.get({
      access_token: token,
      id,
    });

    return payload;
  } catch (e) {
    console.error(`Error getting Strava activity by id: ${id}, ERROR: ${e}`);
    await handleStravaReauthorizationError(e);
    await logNotionError('Error Getting Strava Activity By Id', { id, error: e.message });
    return false;
  }
};

/**
 * Gets all of the activities for the Strava athlete
 * @param {String} token Strava access_token
 * @param {Number} page Optional. The page number for activities pagination.
 * @returns {Promise} A list of Strava activities
 */
export const getAllActivities = async (token, page = 1) => {
  try {
    if (!token) {
      throw new Error('Strava access token is required to fetch activities.');
    }

    // Log the request for debugging
    logRequest({ operation: 'getAllActivities', page });

    const payload = await strava.athlete.listActivities({
      access_token: token,
      page,
    });

    return payload;
  } catch (e) {
    console.error('Error listing all Strava activities:', e);
    await handleStravaReauthorizationError(e);
    await logNotionError('Error Getting All Strava Activities', { error: e.message });
    return false;
  }
};
