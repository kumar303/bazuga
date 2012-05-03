var gravatar = require('gravatar');

module.exports = function(app) {
  /* Filter for checking if a user is authenticated before
   * they can access views that require login
   */
  var isAuthenticated = function(req, res, next) {
    if (!req.session.email) {
      res.redirect('/');
    } else {
      next();
    }
  };

  // Home/main
  app.get('/', function(req, res) {
    res.render('index', { title: 'Herbie' });
  });

  // Dashboard
  app.get('/dashboard', isAuthenticated, function(req, res) {
    res.render('dashboard', { title: 'Dashboard' });
  });

  // Get track
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
