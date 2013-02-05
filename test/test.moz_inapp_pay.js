var assert = require('should');
var jwt = require('jwt-simple');
var nock = require('nock');

var config = {mozPayKey: 'my-app', mozPaySecret: 'THE SECRET',
              mozPayAudience: 'marketplace.firefox.com',
              mozPayRoutePrefix: '/mozpay'};
var incomingJWT = {iss: 'marketplace.firfox.com',
                   aud: config.mozPayKey,
                   // ...
                   };

var pay = require('../lib/moz_inapp_pay.js');


describe('moz_inapp_pay.request', function() {

  before(function() {
    pay.configure(config);
    this.request = {pricePoint: 1,
                    id: 'my-product:1',
                    name: 'Unlock Level 10',
                    description: 'Lets you play Level 10! So fun!',
                    productData: '',
                    postbackURL: 'https://.../postback',
                    chargebackURL: 'https://.../chargeback'}
    this.result = pay.request(this.request);

    this.decode = function _decode() {
      return jwt.decode(this.result, config.mozPaySecret);
    };

  });

  it('should encode a JWT with mozPaySecret', function() {
    this.decode();
  });

  it('should set iss to mozPayKey', function() {
    var res = this.decode();
    res.iss.should.equal(config.mozPayKey);
  });

  it('should set aud to mozPayAudience', function() {
    var res = this.decode();
    res.aud.should.equal(config.mozPayAudience);
  });

  it('should preserve request', function() {
    var res = this.decode();
    res.request.should.eql(this.request);
  });

  it('should require pre-configuration', function() {
    pay.configure(null);
    (function() { pay.request(this.request) }).should.throwError();
  });

});


describe('moz_inapp_pay.verify', function() {

  before(function() {
    pay.configure(config);
  });

  it('should verify an incoming JWT', function() {
    pay.verify(jwt.encode(incomingJWT, config.mozPaySecret));
  });

  it('should fail with the wrong signature', function() {
    (function() {
      pay.verify(jwt.encode(incomingJWT, 'incorrect secret'));
    }).should.throwError('Signature verification failed');
  });

  it('should fail with a malformed JWT', function() {
    (function() {
      pay.verify(jwt.encode(incomingJWT, config.mozPaySecret) + '.garbage');
    }).should.throwError('Not enough or too many segments');
  });

  it('should require pre-configuration', function() {
    pay.configure(null);
    (function() {
      pay.verify(jwt.encode(incomingJWT, config.mozPaySecret));
    }).should.throwError();
  });

});


describe('moz_inapp_pay.routes', function() {

  before(function() {
    pay.configure(config);

    // TODO replace with a mocking lib.
    this.app = function() {
      return new function App() {
        var _app = this;

        this.post = function() {
          _app.post.called = true;
          var call = [];
          for (var i=0; i<arguments.length; i++) {
            call.push(arguments[i]);
          }
          _app.post.args.push(call);
        };
        this.post.called = false;
        this.post.args = [];
      };
    };

  });

  it('should add a postback', function() {
    var app = this.app();
    pay.routes(app);
    assert.ok(app.post.called);
    assert.equal(app.post.args[0][0], '/mozpay/postback');
  });

  it('should add a chargeback', function() {
    var app = this.app();
    pay.routes(app);
    assert.ok(app.post.called);
    assert.equal(app.post.args[1][0], '/mozpay/chargeback');
  });

  it('should use a prefix', function() {
    var app = this.app();
    pay.configure({mozPayRoutePrefix: '/foo'});
    pay.routes(app);
    assert.ok(app.post.called);
    assert.equal(app.post.args[0][0], '/foo/postback');
  });

  it('should clean the prefix', function() {
    var app = this.app();
    pay.configure({mozPayRoutePrefix: '/foo/'});
    pay.routes(app);
    assert.ok(app.post.called);
    assert.equal(app.post.args[0][0], '/foo/postback');
  });

  it('cannot have a null prefix', function() {
    var app = this.app();
    pay.configure({mozPayRoutePrefix: null});
    (function() {
      pay.routes(app);
    }).should.throwError();
  });

});
