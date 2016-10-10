'use strict';

require('./helpers/chai.js');

const Utils = require('fwsp-jsutils');
const UMFMessage = require('../index.js');

describe('createMessage', () => {
  it('should return an object when given an empty message', () => {
    let msg = UMFMessage.createMessage({});
    expect(msg).to.an.object;
  });

  it('should have standard properties', () => {
    let msg = UMFMessage.createMessage({});
    expect(msg).to.have.property('mid');
    expect(msg).to.have.property('timestamp');
    expect(msg).to.have.property('version');
  });

  it('should have standard properties for short messages', () => {
    let msg = UMFMessage.createMessage({}, true);
    expect(msg).to.have.property('mid');
    expect(msg).to.have.property('ts');
    expect(msg).to.have.property('ver');
  });
});

describe('message conversion to and from short form', () => {
  it('should convert a short form message to a long form message', () => {
    let msg = UMFMessage.createMessage({
      to: 'someservice:/',
      frm: 'tester',
      bdy: {
        val: 'some value'
      }
    }, true);
    let longFormMessage = UMFMessage.messageToLong(msg);
    expect(longFormMessage).to.have.property('from');
    expect(longFormMessage).to.have.property('body');
  });
  it('should convert a long form message to a short form message', () => {
    let msg = UMFMessage.createMessage({
      to: 'someservice:/',
      from: 'tester',
      body: {
        val: 'some value'
      }
    });
    let shortFormMessage = UMFMessage.messageToShort(msg);
    expect(shortFormMessage).to.have.property('frm');
    expect(shortFormMessage).to.have.property('bdy');
  });
});

describe('validateMessage', () => {
  it('should return false if missing from field', () => {
    let msg = UMFMessage.createMessage({});
    let ret = UMFMessage.validateMessage(msg);
    expect(ret).to.be.false;
    expect(msg['from']).to.be.undefined;
  });
  it('should return false if missing to field', () => {
    let msg = UMFMessage.createMessage({});
    let ret = UMFMessage.validateMessage(msg);
    expect(ret).to.be.false;
    expect(msg['to']).to.be.undefined;
  });
  it('should return false if missing body field', () => {
    let msg = UMFMessage.createMessage({});
    let ret = UMFMessage.validateMessage(msg);
    expect(ret).to.be.false;
    expect(msg['body']).to.be.undefined;
  });

  it('should return true for a valid message', () => {
    let msg = UMFMessage.createMessage({
      to: 'service:/',
      from: 'client:/',
      body: {}
    });
    let ret = UMFMessage.validateMessage(msg);
    expect(ret).to.be.true;
  });
});

describe('parseRoute', () => {
  let instanceID = 'fa1ae8d586fc44afaad8cd2740aef041';
  let msg = UMFMessage.createMessage({
    to: `${instanceID}@test-service:[GET]/v1/somedata`,
    from: 'client:/',
    body: {}
  });

  it('should parse instance', () => {
    let result = UMFMessage.parseRoute(msg.to);
    expect(result).to.an.object;
    expect(result).to.have.property('instance');
    expect(result.instance).to.be.equal(instanceID);
  });

  it('should parse service name', () => {
    let result = UMFMessage.parseRoute(msg.to);
    expect(result.serviceName).to.be.equal('test-service');
  });

  it('should parse http method', () => {
    let result = UMFMessage.parseRoute(msg.to);
    expect(result.httpMethod).to.be.equal('get');
  });

  it('should parse api route', () => {
    let result = UMFMessage.parseRoute(msg.to);
    expect(result.apiRoute).to.be.equal('/v1/somedata');
  });
});

describe('proxied object', () => {
  it('should return values for long-form keys on short-form message ', () => {
    let msg = UMFMessage.createMessage({
      to: 'someservice:/',
      frm: 'tester',
      bdy: {
        val: 'some value'
      }
    }, true);
    expect(msg.frm).to.equal(msg.from);
    expect(msg.bdy).to.equal(msg.body);
    expect(msg.ts).to.equal(msg.timestamp);
    expect(msg.ver).to.equal(msg.version);
  });

  it('should return values for short-form keys on long-form message', () => {
    let msg = UMFMessage.createMessage({
      to: 'someservice:/',
      from: 'tester',
      body: {
        val: 'some value'
      }
    }, false);
    expect(msg.from).to.equal(msg.frm);
    expect(msg.body).to.equal(msg.bdy);
    expect(msg.timestamp).to.equal(msg.ts);
    expect(msg.version).to.equal(msg.ver);
  });
});

describe('messageToJSON', () => {
  it('should return long-form keys in JSON for a long-form message', () => {
    let msg = UMFMessage.createMessage({
      to: 'someservice:/',
      from: 'tester',
      body: {
        val: 'some value'
      }
    }, false);
    let json = UMFMessage.messageToJSON(msg);
    let parsed = Utils.safeJSONParse(json);
    expect(parsed).to.have.property('from');
  });
  it('should return short-form keys in JSON for a short-form message', () => {
    let msg = UMFMessage.createMessage({
      to: 'someservice:/',
      frm: 'tester',
      bdy: {
        val: 'some value'
      }
    }, true);
    let json = UMFMessage.messageToJSON(msg);
    let parsed = Utils.safeJSONParse(json);
    expect(parsed).to.have.property('frm');
  });

});
