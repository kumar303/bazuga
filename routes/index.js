var pay = require('mozpay');
var qs = require('qs');

module.exports = function(app, settings) {

  app.get('/', function(req, res) {
    res.render('index', { title: 'Bazuga!' });
  });

  app.post('/jwt', function(req, res) {
    var kind = req.param('kind');
    var name;
    if (kind === 'kiwi') {
      name = '4 Kiwis';
    } else if (kind === 'banana') {
      name = '4 Bananas';
    } else {
      console.log('Received bad kind: ' + kind);
      res.send(400);
      return;
    }
    var payReq = {
      id: kind,
      name: name,
      description: 'Fruit pack for the Bazuga game',
      pricePoint: 1,
      productData: qs.stringify({email: req.session.email}),
      postbackURL: 'http://localhost:3000/mozpay/postback',
      chargebackURL: 'http://localhost:3000/mozpay/chargeback'
    };
    if (settings.options.simulatePay) {
      console.log('Simulating a payment!');
      payReq.simulate = {result: 'postback'};
    }
    var jwt = pay.request(payReq);
    console.log('Starting payment with: ' + jwt);
    res.send({jwt: jwt});
  });
}
