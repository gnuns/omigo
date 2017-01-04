/*********************************************
 * by Gabriel 'Hezag' Nunes
 * website: http://multiverso.me
 * email: gabriel (at) multiverso (dot) me
 * github: https://github.com/gnuns
 **********************************************/
'use strict';
window.chatClient = (function() {
  const socket = io('http://localhost:3000');

  socket.on('msg', chatBox.writePartnerMessage);
  socket.on('sysinfo', chatBox.writeSytemInfo);
  nextPartner();

  return {
    'sendMessage': sendMessage,
    'nextPartner': nextPartner
  };

  function nextPartner() {
    socket.emit('next');
  }

  function sendMessage(msg) {
    if (msg.replace(/\s+/g, '').length > 0) {
      socket.emit('msg', msg);
      return true;
    }
    return false;
  }
})();
