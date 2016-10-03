'use strict';

const moment = require('moment');
const uuid = require('uuid');
const Utils = require('@flywheelsports/jsutils');

const UMF_VERSION = 'UMF/1.4.2';
const UMF_INVALID_MESSAGE = 'UMF message requires "to", "from" and "body" fields';

class UMFMessage {
  constructor() {
  }

  /**
  * @name _getTimeStamp
  * @summary retrieve an ISO 8601 timestamp
  * @private
  * @return {string} timestamp - ISO 8601 timestamp
  */
  _getTimeStamp() {
    return moment().toISOString();
  }

  /**
  * @name createMessageID
  * @summary Returns a UUID for use with messages
  * @return {string} uuid - UUID
  */
  createMessageID() {
    return uuid.v4();
  }

  /**
  * @name createShortMessageID
  * @summary Returns a short form UUID for use with messages
  * @return {string} uuid - UUID
  */
  createShortMessageID() {
    return Utils.shortID();
  }

  /**
  * @name createMessage
  * @summary Create a UMF style message.
  * @description This is a helper function which helps format a UMF style message.
  *              The caller is responsible for ensuring that required fields such as
  *              "to", "from" and "body" are provided either before or after using
  *              this function.
  * @param {object} message - optional message overrides.
  * @param {boolean} shortFormat - optional flag to use UMF short form syntax.
  * @return {object} message - a UMF formatted message.
  */
  createMessage(message, shortFormat=false) {
    let msg;
    if (shortFormat === false) {
      msg = Object.assign({
        mid: this.createMessageID(),
        timestamp: this._getTimeStamp(),
        version: UMF_VERSION
      }, message || {});
    } else {
      msg = Object.assign({
        mid: this.createShortMessageID(),
        ts: this._getTimeStamp(),
        ver: UMF_VERSION
      }, message || {});
    }
    return msg;
  }

  /**
  * @name validateMessage
  * @summary Validates that a UMF message has required fields
  * @param {object} message - UMF formatted message
  * @return {boolean} response - returns true is valid otherwise false
  */
  validateMessage(message) {
    if ((!message.from && !message.frm) || !message.to || (!message.body && !message.bdy)) {
      return false;
    } else {
      return true;
    }
  }

  /**
  * @name getMessageBody
  * @summary Return the body from a UMF message
  * @param {object} message - UMF message
  * @return {object} body - UMF message body
  */
  getMessageBody(message) {
    return Object.assign({}, message.body);
  }

  /**
   * @name parseRoute
   * @summary parses message route strings
   * @private
   * @param {string} toValue - string to be parsed
   * @return {object} object - containing route parameters. If the
   *                  object contains an error field then the route
   *                  isn't valid.
   */
  parseRoute(toValue) {
    let serviceName = '';
    let httpMethod = 'post';
    let apiRoute = '';
    let error;
    let urlRoute = toValue;
    let instance = '';

    let atPos = urlRoute.indexOf('@');
    if (atPos > -1) {
      instance = urlRoute.substring(0, atPos);
      urlRoute = urlRoute.substring(atPos + 1);
    }

    let segments = urlRoute.split(':');
    if (segments.length < 1) {
      error = 'route field has invalid number of routable segments';
    } else {
      if (segments[0].indexOf('http') === 0) {
        let url = `${segments[0]}:${segments[1]}`;
        segments.shift();
        segments[0] = url;
      }
      serviceName = segments[0];
      segments.shift();
      apiRoute = segments.join(':');
      let s1 = apiRoute.indexOf('[');
      if (s1 === 0) {
        let s2 = apiRoute.indexOf(']');
        if (s2 < 0) {
          error = 'route field has ill-formed HTTP method verb in segment';
        } else {
          httpMethod = apiRoute.substring(s1 + 1, s2).toLowerCase();
        }
        if (!error) {
          let s3 = httpMethod.length;
          if (s3 > 0) {
            apiRoute = apiRoute.substring(s3 + 2, apiRoute.length);
          }
        }
      }
    }
    return {
      instance,
      serviceName,
      httpMethod,
      apiRoute,
      error
    };
  }
}

module.exports = new UMFMessage();
