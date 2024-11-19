import supabase from './supabaseClient';
/**
 * Fetches a value from the Supabase 'tokens' table based on user ID and key.
 * @param {String} userId The ID of the user for whom we're retrieving the data.
 * @param {String} key The key of the data we want to retrieve (e.g., 'access_token').
 * @returns {any} The value associated with the provided key or false if not found.
 */
export const getSupabaseValue = async (userId, key) => {
  try {
    const { data, error } = await supabase
      .from('tokens')
      .select(key)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      console.warn(`Unable to retrieve ${key} for user ${userId}.`, error);
      return false;
    }

    return data[key];
  } catch (error) {
    console.error(`Error retrieving value from Supabase for user ${userId}:`, error);
    return false;
  }
};

/**
 * Sets a value in the Supabase 'tokens' table for a specific user.
 * @param {String} userId The ID of the user for whom we're setting the data.
 * @param {String} key The key of the data we want to set (e.g., 'access_token').
 * @param {any} value The value we want to set.
 * @returns {Boolean} True if the value was successfully set, false otherwise.
 */
export const setSupabaseValue = async (userId, key, value) => {
  if (value === undefined) {
    console.warn(`Attempted to set undefined value for key: ${key} and user: ${userId}`);
    return false;
  }

  try {
    const { error } = await supabase
      .from('tokens')
      .update({ [key]: value })
      .eq('user_id', userId);

    if (error) {
      console.error(`Error setting value for ${key} in Supabase for user ${userId}:`, error);
      return false;
    }

    console.log(`Successfully set ${key} for user ${userId}.`);
    return true;
  } catch (error) {
    console.error(`Error setting value in Supabase for user ${userId}:`, error);
    return false;
  }
};
