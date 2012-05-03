var gravatar = require('gravatar');

module.exports = function(app, io) {
  // Home/main
  app.get('/', function(req, res) {
    res.render('index', { title: 'Herbie' });
  });

  // Add track
  app.get('/tracks/list', function(req, res) {
    // stub
    var tracks = [{
      track: {
        'id': req.params.id,
        'artist': 'Autechre',
        'artistImage': '/samples/sample.jpg',
        'trackTitle': 'Clipper',
        'trackSource': '/samples/sample.ogg',
        'user': gravatar.url(req.session.email),
        'created': new Date()
      }
    }];

    io.sockets.emit('message', tracks);

    res.json({ status: 200 });
  });

  // Get track
  // TODO: remove when real stuff works
  app.get('/track/:id', function(req, res) {
    // stub
    res.json({
      'id': req.params.id,
      'artist': 'Autechre',
      'artistImage': '/samples/sample.jpg',
      'trackTitle': 'Clipper',
      'trackSource': '/samples/sample.ogg',
      'user': gravatar.url(req.session.email),
      'created': new Date()
    });
  });
}
