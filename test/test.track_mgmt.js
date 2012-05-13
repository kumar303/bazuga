var assert = require('should');
var nock = require('nock');
var trackMgmt = require('../lib/track_mgmt');

describe('trackMgmt', function() {
  describe('.getAll', function() {
    it('returns a list of tracks from the user', function() {
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

      trackMgmt.getAll(req, JSON.stringify(body), function(err, tracks) {
        tracks[0].track.artist.should.equal(body.songs[0].artist);
        tracks[0].track.album.should.equal(body.songs[0].album);
        tracks[0].track.trackTitle.should.equal(body.songs[0].track);
        tracks[0].track.trackSource.should.equal(body.songs[0].s3_urls.ogg);
        tracks.length.should.equal(1);
      });
    });
  });
});
