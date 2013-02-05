var express = require('express');
var configurations = module.exports;
var app = express.createServer();
var settings = require('./settings')(app, configurations, express);
var pay = require('./lib/moz_inapp_pay');

// routes
require('./routes')(app, settings);
require('./routes/auth')(app, settings);
pay.routes(app, settings.options);

var port = process.env['PORT'] || settings.options.port;
app.listen(port);
console.log('Listening on port ' + port);
