var debugging_enabled = true;

export const logDatabaseQueryError = function (eventFired: any, error: any, result: any) {
    if (debugging_enabled) {
        console.log("Event: ", eventFired);
        console.log("Error: ", JSON.stringify(error));
        console.log("Result: ", JSON.stringify(result));
    }
};

export const consolelog = function (eventFired: any, error: any, result: any) {
    if (debugging_enabled) {
        console.log(eventFired, error, result)
    }
};


/*
*-------------------
* LOG REQUEST PARAMS
*-------------------
*/
export const logRequest = function (request: any) {
  if (debugging_enabled) {
    console.log("REQUEST:" + JSON.stringify(request.body));
  }
};

export const logGetRequest = function (request: any) {
  if (debugging_enabled) {
    console.log("REQUEST: " + JSON.stringify(request.query));
  }
};


/*
*-------------------
* START SECTION
*-------------------
*/

export const startSection = function (section: any) {
    if (debugging_enabled) {
        console.log("=========== " + section + " ===========");
    }
};

/*
*-------------------
* LOG RESPONSE
*-------------------
*/

export const logResponse = function (response: any) {
    if (debugging_enabled) {
        console.log("RESPONSE: " + JSON.stringify(response, undefined, 2));
    }
};

export default {
    logDatabaseQueryError,
    logGetRequest,
    logRequest,
    logResponse,
    startSection,
    consolelog
}