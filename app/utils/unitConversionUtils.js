/**
 * Rounds input number to two decimals.
 * @param {number} num
 * @returns {number}
 */
export const twoDecimals = (num) => {
    if (typeof num !== 'number') {
      throw new Error('Input must be a number');
    }
    return Math.round((num + Number.EPSILON) * 100) / 100;
  };
  
  /**
   * Converts degrees Celsius to Fahrenheit.
   * @param {number} celsius Temp in Celsius
   * @returns {number}
   */
  export const celsiusToF = (celsius) => {
    if (typeof celsius !== 'number') {
      throw new Error('Input must be a number');
    }
    return twoDecimals(celsius * (9 / 5) + 32);
  };
  
  /**
   * Checks if a Unix timestamp has passed.
   * @param {number} unixTime The time we want to check (in seconds)
   * @returns {boolean} True if the timestamp has passed, otherwise false.
   */
  export const checkTimeExpired = (unixTime) => {
    if (typeof unixTime !== 'number') {
      throw new Error('Input must be a number');
    }
  
    console.log(`Checking now: ${new Date()} vs ${new Date(unixTime * 1000)}`);
    const now = Date.now() / 1000;
    return unixTime < now;
  };
  
  /**
   * Converts date to the day of the week.
   * @param {String} date Zulu date in string format Ex: "2022-01-30T09:58:22Z"
   * @returns {String} Day of the week
   */
  export const dateToDayOfWeek = (date) => {
    if (typeof date !== 'string') {
      throw new Error('Input must be a string');
    }
  
    const numDay = new Date(date).getUTCDay();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[numDay] || 'Invalid Date';
  };
  
  /**
   * Converts meters per second to miles per hour.
   * @param {number} metersPerSec
   * @returns {number}
   */
  export const metersPerSecToMph = (metersPerSec) => {
    if (typeof metersPerSec !== 'number') {
      throw new Error('Input must be a number');
    }
    return twoDecimals(metersPerSec * 2.237);
  };
  
  /**
   * Converts meters to miles rounded to two decimals.
   * @param {number} meters
   * @returns {number}
   */
  export const metersToMiles = (meters) => {
    if (typeof meters !== 'number') {
      throw new Error('Input must be a number');
    }
    return twoDecimals(meters / 1609);
  };
  
  /**
   * Converts meters to feet rounded to two decimals.
   * @param {number} meters
   * @returns {number}
   */
  export const metersToFeet = (meters) => {
    if (typeof meters !== 'number') {
      throw new Error('Input must be a number');
    }
    return twoDecimals(meters * 3.281);
  };
  
  /**
   * Converts time in seconds to "HH:MM:SS" format.
   * @param {number} seconds Time in seconds
   * @returns {String} Time in "HH:MM:SS" format
   */
  export const secondsToTime = (seconds) => {
    if (typeof seconds !== 'number') {
      throw new Error('Input must be a number');
    }
    
    return new Date(seconds * 1000)
      .toISOString()
      .slice(11, 19); // Extracts the HH:MM:SS part
  };
  
  // Export all utility functions
  export default {
    celsiusToF,
    checkTimeExpired,
    dateToDayOfWeek,
    twoDecimals,
    metersPerSecToMph,
    metersToFeet,
    metersToMiles,
    secondsToTime,
  };
  