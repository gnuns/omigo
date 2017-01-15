'use strict';
const express = require('express')();
const http = require('http').Server(express);
const io = require('socket.io')(http);
const config = require('./config');
const chatHandler = require('./chat/handler')();

start();

function start() {
  chatHandler.init(io, express);
  http.listen(config.port, function() {
    console.log('listening on', config.port);
  });
}
