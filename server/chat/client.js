'use strict';
module.exports = client;

function client(socket) {
  let {id} = socket;
  let partnersMap = {};
  let videoHandshake = {};
  let currentPartner = false;
  let isWaiting = true;
  let chatType;

  resetVideoHandshake();
  return {
    id,
    socket,
    setPartnerInfo,
    isValidPartner,
    waitNext,
    sendSystemInfo,
    sendMessageToPartner,
    disconnectFromPartner,
    requestVideoInit,
    sendVideoOffer,
    sendVideoOfferResponse,
    sendVideoICE,
    setChatType,
    isWaiting: () => isWaiting,
    getPartner: () => currentPartner,
    getChatType: () => chatType
  };

  function setPartnerInfo(partner) {
    if (!partnersMap[partner.id]) partnersMap[partner.id] = {chatsCount:0};

    let currentTimestamp = Math.floor(Date.now() / 1000);

    partnersMap[partner.id].lastChatTimestamp = currentTimestamp;
    partnersMap[partner.id].chatsCount++;

    isWaiting = false;
    currentPartner = partner;
    partner.sendSystemInfo('partner_connected');
  }

  function setChatType(type) {
    chatType = type;
  }

  function resetVideoHandshake() {
    videoHandshake = {
      offerSent: false,
      offerResponseSent: false
    };
  }

  function disconnectFromPartner() {
    if (currentPartner) {
      currentPartner.waitNext();
      currentPartner.sendSystemInfo('partner_disconnected');
    }
    resetVideoHandshake();
    currentPartner = false;
  }

  function sendMessageToPartner(message) {
    let msg = {
      from: 'partner',
      content: message
    };
    if (currentPartner) {
      socket.broadcast.to(currentPartner.id).emit('msg', msg);
    }
  }

  function sendSystemInfo(code) {
    socket.emit('sysinfo', code);
  }

  function requestVideoInit() {
    socket.emit('videochat_init');
  }

  function sendVideoOffer(data) {
    if (!videoHandshake.offerSent) {
      socket.emit('videochat_offer', data);
      videoHandshake.offerSent = true;
      return true;
    }
    return false;
  }

  function sendVideoOfferResponse(res) {
    if (!videoHandshake.offerResponseSent) {
      socket.emit('videochat_offer_response', res);
      videoHandshake.offerResponseSent = true;
      return true;
    }
    return false;
  }

  function sendVideoICE(candidate) {
    socket.emit('videochat_ice', candidate);
  }

  function waitNext() {
    currentPartner = false;
    isWaiting = true;
  }

  function isValidPartner(partner) {
    if (partner.id !== socket.id && partner.isWaiting()) {
      if (partner.getChatType() !== chatType) return false;
      let isReturningPartner = !!partnersMap[partner.id];
      if (isReturningPartner) {
        let now = Math.floor(Date.now() / 1000);
        let timeSinceLastChat = (now - partnersMap[partner.id].lastChatTimestamp);
        // if timeSinceLastChat > 5 minutes
        return (timeSinceLastChat > 300);
      } return true;
    } return false;
  }
}
