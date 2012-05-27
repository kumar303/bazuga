/*
 * Test a WSGI node app with express style routes.
 *
 * Usage:
 *     var testapp = require('testapp');
 *     var app = testapp(myRoutes);
 *     app.get('/some/path', {queryParam: 'value'}, function(response) {
 *       assert.equal(response.data['viewData'], 'expected');
 *     });
 */
module.exports = function(routes) {
  return new TestApp(routes);
};


function TestApp(routes) {
  var self = this;
  this._routes = {post: {}, get: {}};
  app = {
    get: function(route, fn) {
      self._routes.get[route] = fn;
    },
    post: function(route, fn) {
      self._routes.post[route] = fn;
    }
  };
  routes(app);
}

TestApp.prototype.get = function _get(route, req, callback) {
  this._request('get', route, req, callback);
};

TestApp.prototype.post = function _post(route, req, callback) {
  this._request('post', route, req, callback);
};

TestApp.prototype._request = function _request(method, route, req, callback) {
  var res = new _MockResponse(callback);
  this._routes[method][route](req, res);
};

function _MockResponse(callback) {
  this.viewName = "";
  this.data = {};
  this.jsonData = {};
  this._callback = callback;
}

_MockResponse.prototype.json = function _json(data) {
  this.jsonData = data;
  this._finish();
};

_MockResponse.prototype.render = function _render(view, viewData) {
  this.viewName = view;
  this.data = viewData;
  this._finish();
};

_MockResponse.prototype._finish = function _finish() {
  this._callback(this);
};
