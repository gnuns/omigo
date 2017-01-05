/*********************************************
 * by Gabriel 'Hezag' Nunes
 * website: http://multiverso.me
 * email: gabriel (at) multiverso (dot) me
 * github: https://github.com/gnuns
 **********************************************/
'use strict';
window.chatClient = (function() {
  const socket = io('http://localhost:3000');
  let hasPartner = false;
  socket.on('msg', chatBox.writePartnerMessage);
  socket.on('sysinfo', handleSysInfo);
  socket.on('hello', chatBox.writeSytemInfo);

  return {
    'sendMessage': sendMessage,
    'nextPartner': nextPartner
  };

  function nextPartner() {
    chatBox.clear();
    socket.emit('next');
  }

  function handleSysInfo(code) {
    switch (code) {
      case 'partner_connected':
        hasPartner = true;
        break;
      case 'partner_disconnected':
        hasPartner = false;
        break;
      case 'waiting_partner':
        hasPartner = false;
        break;
      default:

    }
    chatBox.writeSytemInfo(code);
  }

  function sendMessage(msg) {
    if (hasPartner && msg.replace(/\s+/g, '').length > 0) {
      socket.emit('msg', msg);
      return true;
    }
    return false;
  }
})();
