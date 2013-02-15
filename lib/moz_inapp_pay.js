var events = require('events');
var util = require('util');
var jwt = require('jwt-simple');
var request = require('request');
var config;

/*
 * Set up custom events. Possible events:
 *
 * pay.on('postback', function(notice) {
 *   // process a validated payment notice.
 * });
 *
 * pay.on('chargeback', function(notice) {
 *   // process a validated chargeback notice.
 * });
 *
 */
function Pay() {}
util.inherits(Pay, events.EventEmitter);

var pay = new Pay();
module.exports = pay;


/**
 * Configure global settings.
 *
 * @param {Object} settings
 * @api public
 */
pay.configure = function(options) {
  config = options;
};


/**
 * Encode a JWT payment request.
 *
 * @param {Object} request
 * @api public
 */
pay.request = function(request, cb) {
  _requireConfig();
  return jwt.encode(pay.issueRequest(request), config.mozPaySecret, 'HS256');
};


/**
 * Verify an incoming JWT payment notice.
 *
 * @param {String} encoded JWT
 * @api public
 */
pay.verify = function(foreignJwt) {
  return jwt.decode(foreignJwt, config.mozPaySecret);
};


/**
 * Add routes to an express app object.
 *
 * @param {Object} express app object
 * @param {Object} settings to pass into configure()
 * @api public
 */
pay.routes = function(app, options) {
  if (options)
    pay.configure(options);
  _requireConfig();

  var prefix = config.mozPayRoutePrefix;
  if (prefix && prefix.slice(-1) == '/') {
    prefix = prefix.slice(0, -1);
  }
  if (!prefix)
    throw new Error('config.mozPayRoutePrefix cannot be blank');

  function handle(req, res, onData) {
    var data;

    var notice = req.param('notice');
    if (!notice) {
      res.send(400);
      return;
    }

    try {
      data = jwt.decode(notice, config.mozPaySecret);
    } catch (er) {
      console.log('Ignoring JWT: ' + er.toString());
      res.send(400);
      return;
    }

    if (!data.request) {
      console.log('JWT request is empty: ' + data.request);
      res.send(400);
      return;
    }
    try {
      var tID = data.response.transactionID;
    } catch (er) {
      console.log('Unexpected JWT object: ' + er.toString());
      res.send(400);
      return;
    }
    if (!tID) {
      console.log('transactionID is empty: ' + tID);
      res.send(400);
      return;
    }
    res.send(tID);
    onData(data);
  }

  app.post(prefix + '/postback', function(req, res) {
    handle(req, res, function(data) {
      pay.emit('postback', data);
    });
  });

  app.post(prefix + '/chargeback', function(req, res) {
    handle(req, res, function(data) {
      pay.emit('chargeback', data);
    });
  });

};


/**
 * Issue a JWT object (i.e. not encoded) for a payment request.
 *
 * @param {Object} request
 * @api public
 */
pay.issueRequest = function(request) {
  _requireConfig();
  // UTC unix timestamp.
  var now = Math.round(Date.now() / 1000);
  return {iss: config.mozPayKey,
          aud: config.mozPayAudience,
          typ: 'mozilla/payments/inapp/v1',
          iat: now,
          exp: now + 3600,  // in 1hr
          request: request};
};


function _requireConfig() {
  if (!config)
    throw new Error('configure() must be called before anything else.');
}
