'use strict';
module.exports = client;

function client(socket) {
  let partnerInfoMap = {};

  return {
    id: socket.id,
    socket: socket,
    setPartnerInfo: setPartnerInfo,
    isValidPartner: isValidPartner
  };

  function setPartnerInfo(partner) {
    let currentTimestamp = Math.floor(Date.now() / 1000);
    if (!partnerInfoMap[partner.id]) partnerInfoMap[partner.id] = {chatsCount:0};
    partnerInfoMap[partner.id].lastChatTimestamp = currentTimestamp;
    partnerInfoMap[partner.id].chatsCount++;
  }

  function isValidPartner(partnerId) {
    let currentTimestamp = Math.floor(Date.now() / 1000);
    let isReturningPartner = !!partnerInfoMap[partnerId];
    if ((partnerId === socket.id)) return false;
    if (!isReturningPartner) return true;
    if ((currentTimestamp - partnerInfoMap[partnerId].lastChatTimestamp) > 300) return true;
    return false;
  }
}
