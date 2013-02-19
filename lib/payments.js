var qs = require('qs');

module.exports = function(pay, settings) {

  pay.on('postback', function(data) {
    console.log('postback received for ' + data.response.transactionID);
    var email = qs.parse(data.request.productData).email;
    var key = email + '.fruit';

    settings.client.hgetall(key, function(err, reply) {
      var newData = reply || {};
      if (!newData[data.request.id])
        newData[data.request.id] = 0;
      newData[data.request.id] += 4;  // 4 are in a bundle
      console.log('Setting ' + newData + ' for ' + email);
      settings.client.hmset(key, newData);
    });

  });

  pay.on('chargeback', function(data) {
    console.log('chargeback received for ' + data.response.transactionID);
  });

}
