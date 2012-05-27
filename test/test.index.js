var assert = require('should');
var nock = require('nock');

var api = require('../lib/api.js');
var index = require('../routes/index.js');
var testapp = require('./testapp.js');

var settings = {options: {apiDomain: 'http://server', apiSecret: 'secret', apiKey: 'key'}};
var app = testapp(index, settings);

describe('/tracks/list', function() {
  it('proxies a list of tracks', function() {
    var req = {
      session: {
        email: 'test@test.org'
      }
    };

    var body = {
      tracks: [{
        artist: 'Aphex Twin',
        small_art_url: 'http://test.com/223.jpg',
        album_art_url: 'http://test.com/223.jpg',
        album: 'Selected Ambient Works Vol. 2',
        track: 'Blue Calx',
        s3_urls: {ogg: 'http://test.com/223.ogg'}
      }]
    };

    nock('http://server')
      .get('/music/?r=' + api.signRequest({email: req.session.email}, settings))
      .reply(200, JSON.stringify(body));

    app.get('/tracks/list', req, function(res) {
      assert.equal(res.jsonData.tracks[0].track.artist, "Aphex Twin");
    });
  });
});
