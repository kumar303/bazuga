var express = require('express');
var configurations = module.exports;
var app = express.createServer();
var settings = require('./settings')(app, configurations, express);

var io = require('socket.io').listen(app);

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10);
});

// routes
require('./routes')(app, io);
require('./routes/auth')(app, settings);

app.listen(process.env['PORT'] || settings.options.port);
