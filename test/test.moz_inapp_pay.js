var shouldBe = require('should');
var express = require('express');
var jwt = require('jwt-simple');
//var nock = require('nock');
var request = require('superagent');
var _ = require('underscore');

var config = {mozPayKey: 'my-app', mozPaySecret: 'THE SECRET',
              mozPayAudience: 'marketplace.firefox.com',
              mozPayRoutePrefix: '/mozpay'};
var payRequest = {pricePoint: 1,
                  id: 'my-product:1',
                  name: 'Unlock Level 10',
                  description: 'Lets you play Level 10! So fun!',
                  productData: '',
                  postbackURL: 'https://.../postback',
                  chargebackURL: 'https://.../chargeback'};
var incomingJWT = {iss: 'marketplace.firefox.com',
                   aud: config.mozPayKey,
                   // ...
                   request: payRequest};

var pay = require('../lib/moz_inapp_pay.js');


describe('moz_inapp_pay.request', function() {

  before(function() {
    pay.configure(config);
    this.request = payRequest;
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


describe('moz_inapp_pay.routes (config)', function() {

  before(function() {
    pay.configure(config);

    // TODO replace with a mocking lib? Having a hard time finding one.
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
    shouldBe.ok(app.post.called);
    shouldBe.equal(app.post.args[0][0], '/mozpay/postback');
  });

  it('should add a chargeback', function() {
    var app = this.app();
    pay.routes(app);
    shouldBe.ok(app.post.called);
    shouldBe.equal(app.post.args[1][0], '/mozpay/chargeback');
  });

  it('should use a prefix', function() {
    var app = this.app();
    pay.configure({mozPayRoutePrefix: '/foo'});
    pay.routes(app);
    shouldBe.ok(app.post.called);
    shouldBe.equal(app.post.args[0][0], '/foo/postback');
  });

  it('should clean the prefix', function() {
    var app = this.app();
    pay.configure({mozPayRoutePrefix: '/foo/'});
    pay.routes(app);
    shouldBe.ok(app.post.called);
    shouldBe.equal(app.post.args[0][0], '/foo/postback');
  });

  it('cannot have a null prefix', function() {
    var app = this.app();
    pay.configure({mozPayRoutePrefix: null});
    (function() {
      pay.routes(app);
    }).should.throwError();
  });

});


describe('moz_inapp_pay.routes (handlers)', function() {

  before(function() {
    var self = this;
    pay.removeAllListeners();
    pay.configure(config);
    this.app = express.createServer();
    this.app.use(express.bodyParser());
    pay.routes(this.app);

    var port = 3001;
    this.app.listen(3001);

    this.url = function(path) {
      return 'http://localhost:' + port + config.mozPayRoutePrefix + path;
    }

    this.postback = function(data, onEnd) {
      request.post(self.url('/postback'))
        .send(data)
        .end(function(res) {
          onEnd(res);
        });
    };

    this.notice = function() {
      return _.extend({}, incomingJWT, {response: {transactionID: 'webpay-123'}});
    };
  });

  after(function() {
    this.app.close();
  });

  it('must get a notice parameter', function(done) {
    this.postback({}, function(res) {
      res.status.should.equal(400);
      done();
    });
  });

  it('must get a valid JWT', function(done) {
    this.postback({notice: '<garbage>'}, function(res) {
      res.status.should.equal(400);
      done();
    });
  });

  it('must get a JWT with correct signature', function(done) {
    this.postback({notice: jwt.encode(incomingJWT, 'wrong secret')}, function(res) {
      res.status.should.equal(400);
      done();
    });
  });

  it('must get a response object', function(done) {
    var notice = this.notice();
    delete notice.response;

    this.postback({notice: jwt.encode(notice, config.mozPaySecret)}, function(res) {
      res.status.should.equal(400);
      done();
    });
  });

  it('must get a request object', function(done) {
    var notice = this.notice();
    delete notice.request;

    this.postback({notice: jwt.encode(notice, config.mozPaySecret)}, function(res) {
      res.status.should.equal(400);
      done();
    });
  });

  it('must get a transactionID', function(done) {
    var notice = this.notice();
    delete notice.response.transactionID;

    this.postback({notice: jwt.encode(notice, config.mozPaySecret)}, function(res) {
      res.status.should.equal(400);
      done();
    });
  });

  it('must respond with transaction ID', function(done) {
    var notice = this.notice();

    this.postback({notice: jwt.encode(notice, config.mozPaySecret)}, function(res) {
      res.status.should.equal(200);
      res.text.should.equal(notice.response.transactionID);
      done();
    });
  });

  it('must emit a postback event', function(done) {
    var sentNotice = this.notice();

    pay.on('postback', function(notice) {
      notice.should.eql(sentNotice);
      done();
    });

    this.postback({notice: jwt.encode(sentNotice, config.mozPaySecret)}, function(res) {
      res.status.should.equal(200);
    });
  });

  it('must emit a chargeback event', function(done) {
    var sentNotice = this.notice();

    pay.on('chargeback', function(notice) {
      notice.should.eql(sentNotice);
      done();
    });

    request.post(this.url('/chargeback'))
      .send({notice: jwt.encode(sentNotice, config.mozPaySecret)})
      .end(function(res) {
        res.status.should.equal(200);
      });
  });

});
