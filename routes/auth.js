var auth = require('../lib/authenticate');

module.exports = function(app, settings) {
  // Login
  app.post('/login', function(req, res) {
    auth.verify(req, settings, function(error, email) {
      if (error) {
        console.log('BrowserID error: ' + error);
        res.send(401);
        return;
      }
      email = email.toLowerCase();
      req.session.email = email;
      settings.client.hgetall(email + '.fruit', function(err, reply) {
        res.json(reply || {});
      });
    });
  });

  // Logout
  app.get('/logout', function(req, res) {
    if (req.session) {
      delete req.session.email;
    }
    res.redirect('/?logged_out=1', 303);
  });
};
