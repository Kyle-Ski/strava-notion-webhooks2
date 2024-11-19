/**
 * Logs out the request object, including params, body, and query values.
 * Only logs in non-production environments to avoid security risks.
 * @param {Object} req The request object from a Next.js API route.
 */
export const logObject = (req) => {
    if (process.env.NODE_ENV === 'production') {
      console.warn('logObject is disabled in production environments for security reasons.');
      return;
    }
  
    if (req?.params) {
      for (let key in req.params) {
        console.log(`Logging key-value pair for PARAMS --> ${key}: ${req.params[key]}`);
      }
    }
  
    if (req?.body) {
      for (let key in req.body) {
        console.log(`Logging key-value pair for BODY --> ${key}: ${req.body[key]}`);
      }
    }
  
    if (req?.query) {
      for (let key in req.query) {
        console.log(`Logging key-value pair for QUERY --> ${key}: ${req.query[key]}`);
      }
    }
  };
  