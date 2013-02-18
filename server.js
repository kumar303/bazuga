var express = require('express');
var configurations = module.exports;
var app = express.createServer();
var settings = require('./settings')(app, configurations, express);
var pay = require('mozpay');

// routes
require('./routes')(app, settings);
require('./routes/auth')(app, settings);
pay.routes(app, settings.options);

pay.on('postback', function(data) {
  console.log('postback received for ' + data.response.transactionID);
});

pay.on('chargeback', function(data) {
  console.log('chargeback received for ' + data.response.transactionID);
});

var port = process.env['PORT'] || settings.options.port;
app.listen(port);
console.log('Listening on port ' + port);
