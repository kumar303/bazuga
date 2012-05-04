var gravatar = require('gravatar');
var request = require('request');

module.exports = function(app, io) {
  // Home/main
  app.get('/', function(req, res) {
    res.render('index', { title: 'Herbie' });
  });

  // Add track
  app.get('/tracks/list', function(req, res) {
    request.get('http://localhost:8000/en-US/songs?email=' + escape(req.session.email),
      function(err, resp, body) {
        var tracks = [];
        var email = false;

        if (err) {
          return callback(err);
        }
        console.log(body);
        try {
          var jsonResp = JSON.parse(body);
          console.log(jsonResp.songs.length);
          for (var i = 0; i < jsonResp.songs.length; i++ ) {
              var track = {
                track: {
                  'artist': jsonResp.songs[i].artist,
                  'artistImage': jsonResp.songs[i].album_art_url || '/images/herbie.png',
                  'album': jsonResp.songs[i].album,
                  'trackTitle': jsonResp.songs[i].track,
                  'trackSource': jsonResp.songs[i].s3_ogg_url || '/samples/sample.ogg',
                  'user': gravatar.url(req.session.email),
                  'created': new Date()
                }
              };
console.log(jsonResp.songs[i].artist);

              tracks.push(track);
          }

          // io.socikets.emit('message', tracks);

          res.json({ tracks: tracks });
        } catch (err) {
//return callback(err);
        }

      }
    );
  });
}
