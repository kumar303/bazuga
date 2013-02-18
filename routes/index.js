var pay = require('../lib/moz_inapp_pay');

module.exports = function(app, settings) {
  app.get('/', function(req, res) {
    res.render('index', { title: 'Bazuga!' });
  });

  app.post('/jwt', function(req, res) {
    // TODO fetch product type from params.
    var jwt = pay.request({
      id: 'my-product:1',
      name: 'Some Product',
      description: 'description',
      pricePoint: 1,
      productData: '',
      postbackURL: 'http://localhost:3000/mozpay/postback',
      chargebackURL: 'http://localhost:3000/mozpay/chargeback'
    });
    console.log('Starting payment with: ' + jwt);
    res.send({jwt: jwt});
  });
}
