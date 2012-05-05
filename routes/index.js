const TRACK_URL = 'http://localhost:8000/en-US/songs';

var request = require('request');
var trackMgmt = require('../lib/track_mgmt');

module.exports = function(app) {
  // Main track page
  app.get('/', function(req, res) {
    res.render('index', { title: 'Herbie' });
  });

  // Get track list
  app.get('/tracks/list', function(req, res) {
    request.get(TRACK_URL + '?email=' + escape(req.session.email),
      function(err, resp, body) {
        trackMgmt.getAll(req, function(err, tracks) {
          res.json({ tracks: tracks });
        });
      }
    );
  });
}
