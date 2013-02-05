var pay = require('../lib/moz_inapp_pay');

module.exports = function(app, settings) {
  app.get('/', function(req, res) {
    res.render('index', { title: 'Bazuga!' });
  });

  app.post('/jwt', function(req, res) {
    // TODO fetch product type from params.
    res.send({jwt: pay.request({name: '..',
                                description: '...'})});
  });
}
