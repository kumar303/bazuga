var gravatar = require('gravatar');
var request = require('request');

module.exports = function(app, io) {
  // Home/main
  app.get('/', function(req, res) {
    res.render('index', { title: 'Herbie' });
  });

  // Add track
  app.get('/tracks/list', function(req, res) {
    request.post('http://localhost:8000/en-US/songs?email=' + escape(req.session.email),
      function(err, resp, body) {
        var tracks = [];
        var email = false;

        if (err) {
          return callback(err);
        }

        try {
          var jsonResp = JSON.parse(body);
          var track = {
            track: {
              'artist': jsonResp.artist,
              'artistImage': jsonResp.album_art_url || '/images/herbie.png',
              'album': jsonResp.album,
              'trackTitle': jsonResp.track,
              'trackSource': jsonResp.s3_ogg_url,
              'user': gravatar.url(req.session.email),
              'created': new Date()
            }
          };

          tracks.push(track);

          io.sockets.emit('message', tracks);

          res.json({ status: 200 });
        } catch (err) {
          return callback(err);
        }

      return callback(null, email);
      }
    );
  });
}
