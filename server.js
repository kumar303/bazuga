var express = require('express');
var redis = require('redis');
var pay = require('mozpay');

var app = express.createServer();
var client = redis.createClient();
var configurations = module.exports;
var settings = require('./settings')(app, configurations, express);
settings.client = client;

// routes
require('./routes')(app, settings);
require('./routes/auth')(app, settings);
pay.routes(app, settings.options);

client.on('error', function (err) {
  console.log('Redis error: ' + err);
});

// Payment handlers
require('./lib/payments')(pay, settings);

var port = process.env['PORT'] || settings.options.port;
app.listen(port);
console.log('Listening on port ' + port);
