"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logResponse = exports.startSection = exports.logGetRequest = exports.logRequest = exports.consolelog = exports.logDatabaseQueryError = void 0;
var debugging_enabled = true;
const logDatabaseQueryError = function (eventFired, error, result) {
    if (debugging_enabled) {
        console.log("Event: ", eventFired);
        console.log("Error: ", JSON.stringify(error));
        console.log("Result: ", JSON.stringify(result));
    }
};
exports.logDatabaseQueryError = logDatabaseQueryError;
const consolelog = function (eventFired, error, result) {
    if (debugging_enabled) {
        console.log(eventFired, error, result);
    }
};
exports.consolelog = consolelog;
/*
*-------------------
* LOG REQUEST PARAMS
*-------------------
*/
const logRequest = function (request) {
    if (debugging_enabled) {
        console.log("REQUEST:" + JSON.stringify(request.body));
    }
};
exports.logRequest = logRequest;
const logGetRequest = function (request) {
    if (debugging_enabled) {
        console.log("REQUEST: " + JSON.stringify(request.query));
    }
};
exports.logGetRequest = logGetRequest;
/*
*-------------------
* START SECTION
*-------------------
*/
const startSection = function (section) {
    if (debugging_enabled) {
        console.log("=========== " + section + " ===========");
    }
};
exports.startSection = startSection;
/*
*-------------------
* LOG RESPONSE
*-------------------
*/
const logResponse = function (response) {
    if (debugging_enabled) {
        console.log("RESPONSE: " + JSON.stringify(response, undefined, 2));
    }
};
exports.logResponse = logResponse;
exports.default = {
    logDatabaseQueryError: exports.logDatabaseQueryError,
    logGetRequest: exports.logGetRequest,
    logRequest: exports.logRequest,
    logResponse: exports.logResponse,
    startSection: exports.startSection,
    consolelog: exports.consolelog
};
