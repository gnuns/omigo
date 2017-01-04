'use strict';
const app         = require('express');
const http        = require('http').Server(app);
const io          = require('socket.io')(http);
const config      = require('./config');
const chatHandler = require('./chat/handler');

start();

function start() {
  chatHandler.init(io);

  http.listen(config.port, function() {
    console.log('listening on', config.port);
  });
}
