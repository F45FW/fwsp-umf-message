'use strict';

const uuid = require('uuid');

const UMF_VERSION = 'UMF/1.4.3';
const UMF_INVALID_MESSAGE = 'UMF message requires "to", "from" and "body" fields';


class UMFMessage {
  constructor() {
    this.message = {};
  }

  /**
  * @name getTimeStamp
  * @summary retrieve an ISO 8601 timestamp
  * @return {string} timestamp - ISO 8601 timestamp
  */
  getTimeStamp() {
    return new Date().toISOString();
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
   @see https://en.wikipedia.org/wiki/Base36
  * @return {string} short identifer
  */
  createShortMessageID() {
    return (Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)).toString(36);
  }


  /**
  * @name toJSON
  * @return {object} A JSON stringifiable version of message
  */
  toJSON() {
    return this.message;
  }

  /**
  * @name toShort
  * @summary convert a long message to a short one
  * @return {object} converted message
  */
  toShort() {
    let message = {};
    if (this.message['to']) {
      message['to'] = this.message['to'];
    }
    if (this.message['from']) {
      message['frm'] = this.message['from'];
    }
    if (this.message['mid']) {
      message['mid'] = this.message['mid'];
    }
    if (this.message['rmid']) {
      message['rmid'] = this.message['rmid'];
    }
    if (this.message['timestamp']) {
      message['ts'] = this.message['timestamp'];
    }
    if (this.message['version']) {
      message['ver'] = this.message['version'];
    }
    if (this.message['via']) {
      message['via'] = this.message['via'];
    }
    if (this.message['forward']) {
      message['for'] = this.message['forward'];
    }
    if (this.message['body']) {
      message['bdy'] = this.message['body'];
    }
    return message;
  }

  /**
  * @name validate
  * @summary Validates that a UMF message has required fields
  * @return {boolean} response - returns true is valid otherwise false
  */
  validate() {
    if (!this.message.from || !this.message.to || !this.message.body) {
      return false;
    } else {
      return true;
    }
  }
}

function createMessageInstance(message) {
  let proxy = new Proxy(new UMFMessage(), {
    get: function(target, name, receiver) {
      return name in target ?
        target[name] : target.message[name];
    },
    set: (obj, prop, value) => {
      obj.message[prop] = value;
      return true;
    }
  });
  if (message.to) {
    proxy.to = message.to;
  }
  if (message.from || message.frm) {
    proxy.from = message.from || message.frm;
  }
  proxy.mid = message.mid || proxy.createMessageID();
  if (message.rmid) {
    proxy.rmid = message.rmid;
  }
  proxy.timestamp = message.timestamp || message.ts || proxy.getTimeStamp();
  proxy.version = message.version || message.ver || UMF_VERSION;
  if (message.via) {
    proxy.via = message.via;
  }
  if (message.forward) {
    proxy.forward = message.forward;
  }
  if (message.body || message.bdy) {
    proxy.body = message.body || message.bdy;
  }
  return proxy;
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
function parseRoute(toValue) {
  let serviceName = '';
  let httpMethod;
  let apiRoute = '';
  let error;
  let urlRoute = toValue;
  let instance = '';
  let subID = '';

  let atPos = urlRoute.indexOf('@');
  if (atPos > -1) {
    instance = urlRoute.substring(0, atPos);
    urlRoute = urlRoute.substring(atPos + 1);
    let segments = instance.split('-');
    if (segments.length > 0) {
      instance = segments[0];
      subID = segments[1];
    }
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
    subID,
    serviceName,
    httpMethod,
    apiRoute,
    error
  };
}

/**
* Return an ES6 Proxy object which provides access to message fields.
*/
module.exports = {
  createMessage: createMessageInstance,
  parseRoute: parseRoute
};
