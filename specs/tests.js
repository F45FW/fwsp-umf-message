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
    expect(msg.mid).to.not.be.undefined;
    expect(msg.timestamp).to.not.be.undefined;
    expect(msg.version).to.not.be.undefined;
  });

  it('should have standard properties for short messages', () => {
    let msg = UMFMessage.createMessage({}).toShort();
    expect(msg.mid).to.not.be.undefined;
    expect(msg.ts).to.not.be.undefined;
    expect(msg.ver).to.not.be.undefined;
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
    });
    expect(msg.from).to.not.be.undefined;
    expect(msg.body).to.not.be.undefined;
  });
  it('should convert a long form message to a short form message', () => {
    let msg = UMFMessage.createMessage({
      to: 'someservice:/',
      from: 'tester',
      body: {
        val: 'some value'
      }
    });
    let shortFormMessage = msg.toShort();
    expect(shortFormMessage).to.have.property('frm');
    expect(shortFormMessage).to.have.property('bdy');
    expect(shortFormMessage).not.to.have.property('from');
    expect(shortFormMessage).not.to.have.property('body');
  });
});

describe('validateMessage', () => {
  it('should return false if missing from field', () => {
    let msg = UMFMessage.createMessage({});
    let ret = msg.validateMessage();
    expect(ret).to.be.false;
    expect(msg['from']).to.be.undefined;
  });
  it('should return false if missing to field', () => {
    let msg = UMFMessage.createMessage({});
    let ret = msg.validateMessage();
    expect(ret).to.be.false;
    expect(msg['to']).to.be.undefined;
  });
  it('should return false if missing body field', () => {
    let msg = UMFMessage.createMessage({});
    let ret = msg.validateMessage();
    expect(ret).to.be.false;
    expect(msg['body']).to.be.undefined;
  });

  it('should return true for a valid message', () => {
    let msg = UMFMessage.createMessage({
      to: 'service:/',
      from: 'client:/',
      body: {}
    });
    let ret = msg.validateMessage();
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


describe('toJSON', () => {
  it('should return valid JSON for message', () => {
    let msg = UMFMessage.createMessage({
      to: 'someservice:/',
      from: 'tester',
      body: {
        val: 'some value'
      }
    });
    let json = msg.toJSON(msg);
    let parsed = Utils.safeJSONParse(json);
    expect(parsed).to.have.property('from');
  });

});

describe('get message body', () => {
  let longMsg = UMFMessage.createMessage({
    to: 'someservice:/',
    from: 'tester',
    body: {
      val: 'some value'
    }
  }),
  shortMsg = UMFMessage.createMessageShort({
    to: 'someservice:/',
    frm: 'tester',
    bdy: {
      val: 'some value'
    }
  });
  it('should get message body from long-form message', () => {
    let body = UMFMessage.getMessageBody(longMsg);
    expect(body).to.have.property('val');
  });
  it('should get message body from converted short-form message', () => {
    let body = UMFMessage.getMessageBody(UMFMessage.toShort(longMsg));
    expect(body).to.have.property('val');
  });
  it('should get message body from new short-form message', () => {
    let body = UMFMessage.getMessageBody(shortMsg);
    expect(body).to.have.property('val');
  });
  it('should get message body from converted long-form message', () => {
    let body = UMFMessage.getMessageBody(UMFMessage.toLong(shortMsg));
    expect(body).to.have.property('val');
  });
});
