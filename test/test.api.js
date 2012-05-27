var assert = require('should');
var jwt = require('jwt-simple');

var api = require('../lib/api.js');

describe('api.signRequest', function() {

  before(function() {
    this.req = api.signRequest({email: 'edna@wat.com'},
                               {options: {apiSecret: 'THE SECRET',
                                          apiKey: 'herbie-ui-id',
                                          apiDomain: 'http://api-server.com'}});
  });

  it('signs a verifiable API request', function() {
    jwt.decode(this.req, 'THE SECRET');
  });

  it('should declare the issuer', function() {
    var dec = jwt.decode(this.req, 'THE SECRET');
    assert.equal(dec.iss, 'herbie-ui-id');
  });

  it('should declare the audience', function() {
    var dec = jwt.decode(this.req, 'THE SECRET');
    assert.equal(dec.aud, 'http://api-server.com');
  });

  it('should include the actual request', function() {
    var dec = jwt.decode(this.req, 'THE SECRET');
    assert.equal(dec.request.email, 'edna@wat.com');
  });
});
