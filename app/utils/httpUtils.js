// import fetch from 'node-fetch';

/**
 * Throws error if the string passed doesn't meet our standards
 * @param {String} url The URL string we want to check
 * @param {String} method The HTTP method to add to the error message if any
 */
export const checkUrl = (url, method) => {
  if (typeof url !== "string" || url.length <= 17) {
    console.warn(
      `Looks like you haven't supplied a proper URL to your ${method} request. URL supplied: ${url}`
    );
    throw new Error(
      `Looks like you haven't supplied a proper URL to your ${method} request. URL supplied: ${url}`
    );
  }
};

/**
 * Takes in an object to turn into the second argument of a fetch() request. It will use each of that object's
 * keys as the keys for the new object. If 'method' is not included, we assume it is a GET request.
 * @param {Object} options The HTTP Options object we want to pass.
 * @returns {Object} Fetch options object.
 */
export const buildFetchOptions = (options = {}) => {
  let fetchOptions = {};

  if (options && (typeof options !== "object" || Array.isArray(options) || options === null)) {
    console.warn(
      `Not including this in the request, but it looks like you've supplied an incorrectly formatted "options" argument: ${options}`
    );
  } else {
    fetchOptions = { ...options };
  }

  if (!fetchOptions.method) {
    fetchOptions.method = "GET";
  }

  return fetchOptions;
};

/**
 * Sends an HTTP request to the specified URL with the given options.
 * @param {String} url The URL we want to fetch from
 * @param {String} errorMessage Message we should send to the requester upon fetch failure
 * @param {Object} options The request options we want to include, if none are included; we'll assume it's a GET request
 * @returns {Object} Shape: {status: ResponseStatusCode<Number>, data: (either JSON or error String)}
 */
export const responseBuilder = async (url, errorMessage, options = {}) => {
  const fetchOptions = buildFetchOptions(options);
  checkUrl(url, fetchOptions.method);

  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      console.warn(`
        responseBuilder response NOT ok:
        Status: ${response?.status}
        response.ok: ${response.ok}
        URL: ${url}
      `);
      const data = await response.json();
      if (data?.errors?.length) {
        // Strava errors look like this, let's send the error back formatted their way
        return { status: 400, data: { ...data.errors[0] } };
      }
      return { status: response.status, data: errorMessage };
    }

    // As of now, I'm assuming we're ONLY going to be hitting things that return JSON
    if (fetchOptions.method === "DELETE") {
      return { status: 200, data: "deleted" };
    }
    const data = await response.json();
    return { status: response.status, data };
  } catch (e) {
    console.error("responseBuilder ERROR:", e);
    return {
      status: 500,
      data: `Internal server error attempting to ${fetchOptions.method} ${url}`,
    };
  }
};