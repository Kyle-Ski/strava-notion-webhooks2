// Constants for webhook events and activity event types

export const WEBHOOK_EVENTS = {
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete',
  };
  
  export const WEBHOOK_EVENT_TYPES = {
    ACTIVITY: 'activity',
    HIKE: 'Hike',
  };
  
  // Constants for Strava API activity-related requests
  export const STRAVA_ACTIVITIES_GET = {
    // Any other specific configuration for fetching activities could be added here
  };
  
  // Example of an environment variable fallback
  export const STRAVA_VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  
  // Central export to make imports easier
  const constants = {
    WEBHOOK_EVENTS,
    WEBHOOK_EVENT_TYPES,
    STRAVA_ACTIVITIES_GET,
    STRAVA_VERIFY_TOKEN,
  };
  
  export default constants;
  