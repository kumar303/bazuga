var jwt = require('jwt-simple');
var request = require('request');

exports.get = function _get(path, req, settings, callback) {
  var url = settings.options.apiDomain + path + '?r=' + exports.signRequest(req, settings);
  request.get(url, callback);
};

exports.signRequest = function(req, settings) {
  var payload = {
    iss: settings.options.apiKey,
    aud: settings.options.apiDomain,
    request: req
  };
  return jwt.encode(payload, settings.options.apiSecret);
};
