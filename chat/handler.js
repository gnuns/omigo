'use strict';
module.exports.init = init;

const _ = require('lodash');
let Client = require('./client');
let clientList = [];
let io;

function init(_io) {
  io = _io;
  io.on('connection', onConnet);
}

function onConnet(socket) {
  let client = new Client(socket);
  console.log(client.id, ' connected');
  socket.on('disconnect', () => onDisconnect(client));
  socket.on('next', () => onRequestNext(client));
  clientList.push(client);
}

function onDisconnect(client) {
  console.log(client.id, ' disconnected');
  clientList = _.remove(clientList, (c) => c.id === client.id);
}

function onRequestNext(requesterClient) {
  let partner = clientList[_.random(0, clientList.length)];
  while (!requesterClient.isValidPartner(partner.id)) {
    partner = clientList[_.random(0, clientList.length)];
  }
  partner.setPartnerInfo(requesterClient);
  requesterClient.setPartnerInfo(partner);
}
