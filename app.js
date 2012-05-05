var express = require('express');
var configurations = module.exports;
var app = express.createServer();
var settings = require('./settings')(app, configurations, express);

// routes
require('./routes')(app);
require('./routes/auth')(app, settings);

app.listen(process.env['PORT'] || settings.options.port);
