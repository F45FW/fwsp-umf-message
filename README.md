# UMF Message 

[![Build Status](https://travis-ci.org/flywheelsports/fwsp-umf-message.svg?branch=master)](https://travis-ci.org/flywheelsports/fwsp-umf-message) [![npm version](https://badge.fury.io/js/fwsp-umf-message.svg)](https://badge.fury.io/js/fwsp-umf-message) <span class="badge-npmdownloads"><a href="https://npmjs.org/package/fwsp-umf-message" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/fwsp-umf-message.svg" alt="NPM downloads" /></a></span> [![npm](https://img.shields.io/npm/l/fwsp-umf-message.svg)]()

Used to create and validate [UMF](https://github.com/cjus/umf) style messages.

## Install
You can install it via NPM:

```shell
$ npm install fwsp-umf-message --save
```

## Usage

```javascript
const UMFMessage = require('fwsp-umf-message');
let msg = UMFMessage.createMessage({
  to: `test-service:[GET]/v1/somedata`,
  from: 'client:/',
  body: {
    somevalues: [1,2,3,4]
  }
});
```

You can also access message fields for getting and setting:

```javascript
console.log('msg.to', msg.to);
msg.to = 'router:/';
console.log('msg.to', msg.to);
```

To retrieve an entire message object use:

```javascript
console.log(msg.toJSON());
```

## Tests

Tests can be found in the `specs` folder.

```shell
$ npm test
```
