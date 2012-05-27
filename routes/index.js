var api = require('../lib/api.js');
var trackMgmt = require('../lib/track_mgmt');

module.exports = function(app, settings) {
  // Main track page
  app.get('/', function(req, res) {
    res.render('index', { title: 'Herbie' });
  });

  // Get track list
  app.get('/tracks/list', function(req, res) {
    api.get('/music/', {email: req.session.email}, settings,
      function(err, resp, body) {
        trackMgmt.getAll(req, body, function(err, tracks) {
          res.json({ tracks: tracks });
        });
      }
    );
  });
}
