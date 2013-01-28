
module.exports = function(app, settings) {
  // Main track page
  app.get('/', function(req, res) {
    res.render('index', { title: 'Bazuga!' });
  });

  app.post('/jwt', function(req, res) {
    res.send('foobar');
  });
}
