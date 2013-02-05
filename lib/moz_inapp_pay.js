var jwt = require('jwt-simple');
var request = require('request');
var config;


/**
 * Configure global settings.
 *
 * @param {Object} settings
 * @api public
 */
exports.configure = function(options) {
  config = options;
};


/**
 * Encode a JWT payment request.
 *
 * @param {Object} request
 * @api public
 */
exports.request = function(request, cb) {
  _requireConfig();
  return jwt.encode(exports.issueRequest(request), config.mozPaySecret, 'HS256');
};


/**
 * Verify an incoming JWT payment notice.
 *
 * @param {String} encoded JWT
 * @api public
 */
exports.verify = function(foreignJwt) {
  return jwt.decode(foreignJwt, config.mozPaySecret);
};


/**
 * Add routes to an express app object.
 *
 * @param {Object} express app object
 * @param {Object} settings to pass into configure()
 * @api public
 */
exports.routes = function(app, options) {
  if (options)
    exports.configure(options);

  var prefix = config.mozPayRoutePrefix;
  if (prefix && prefix.slice(-1) == '/') {
    prefix = prefix.slice(0, -1);
  }
  if (!prefix)
    throw new Error('config.mozPayRoutePrefix cannot be blank');

  app.post(prefix + '/postback', function(req, res) {
    console.log(req.param('jwt'));
    res.send('foobar');
  });

  app.post(prefix + '/chargeback', function(req, res) {
    res.send('foobar');
  });

};


/**
 * Issue a JWT object (i.e. not encoded) for a payment request.
 *
 * @param {Object} request
 * @api public
 */
exports.issueRequest = function(request) {
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
