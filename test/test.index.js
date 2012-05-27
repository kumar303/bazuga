var assert = require('should');
var nock = require('nock');
var jwt = require('jwt-simple');
var index = require('../routes/index.js');
var testapp = require('./testapp.js');

var app = testapp(index);

describe('/tracks/list', function() {
  it('proxies a list of tracks', function() {
    var req = {
      session: {
        email: 'test@test.org'
      }
    };

    var body = {
      songs: [{
        artist: 'Aphex Twin',
        small_art_url: 'http://test.com/223.jpg',
        album_art_url: 'http://test.com/223.jpg',
        album: 'Selected Ambient Works Vol. 2',
        track: 'Blue Calx',
        s3_urls: {ogg: 'http://test.com/223.ogg'}
      }]
    };

    nock('http://localhost:8000')
      .get('/en-US/songs?email=test@test.org')
      .reply(200, JSON.stringify(body));

    app.get('/tracks/list', req, function(res) {
      assert.equal(res.jsonData.tracks[0].track.artist, "Aphex Twin");
    });
  });
});
