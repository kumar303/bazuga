const DEFAULT_ARTIST_IMAGE = '/images/herbie.png';

var gravatar = require('gravatar');
var request = require('request');

/* Return a list of tracks
 * Expects: request
 * Returns: tracks
 */
exports.getAll = function(req, body, callback) {
  var email = false;

  try {
    var jsonResp = JSON.parse(body).tracks;
    var tracks = [];

    if (jsonResp) {
      for (var i = 0; i < jsonResp.length; i ++) {
        var track = {
          track: {
            'artist': jsonResp[i].artist,
            'artistImage': jsonResp[i].album_art_url || DEFAULT_ARTIST_IMAGE,
            'album': jsonResp[i].album,
            'trackTitle': jsonResp[i].track,
            'trackSource': jsonResp[i]['s3_urls']['ogg'],
            'user': gravatar.url(req.session.email),
            'created': new Date()
          }
        };
        tracks.push(track);
      }
    }

    return callback(null, tracks);
  } catch (err) {
    console.error('could not parse tracks:', err);
    return callback(err);
  }
};
