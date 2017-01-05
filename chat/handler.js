'use strict';
module.exports.init = init;

const _ = require('lodash');
let Client = require('./client');
let clientList = [];
let waitingList = [];
let io;

function init(_io) {
  io = _io;
  io.on('connection', onConnet);
  setInterval(refreshConsole, 700);
}

function refreshConsole() {
  process.stdout.write('Clients: ' + clientList.length +
                       ' | Waiting: ' + waitingList.length + '\r');
}

function onConnet(socket) {
  let client = new Client(socket);
  // console.log(client.id, ' connected');
  socket.on('disconnect', () => onDisconnect(client));
  socket.on('next', () => onRequestNext(client));
  socket.on('msg', (msg) => onMessage(client, msg));
  clientList.push(client);
  // console.log(waitingList.length);
}

function onDisconnect(client) {
  // console.log(client.id, ' disconnected');
  client.disconnectFromPartner();
  _.remove(clientList, (c) => c.id === client.id);
  _.remove(waitingList, (c) => c.id === client.id);
}

function onMessage(client, msg) {
  client.sendMessageToPartner(msg);
}

function onRequestNext(client) {
  client.disconnectFromPartner();
  client.sendSystemInfo('waiting_partner');
  let partner = false;
  for (let possiblePartner of waitingList) {
    if (client.isValidPartner(possiblePartner)) {
      partner = possiblePartner;
      break;
    }
  }
  if (!partner) {
    if (!_.some(waitingList, ['id', client.id])) {
      client.waitNext();
      waitingList.push(client);
    }
  } else {
    _.remove(waitingList, (c) => c.id === client.id || c.id === partner.id);
    client.setPartnerInfo(partner);
    partner.setPartnerInfo(client);
  }
}
