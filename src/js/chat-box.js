/*********************************************
 * by Gabriel 'Hezag' Nunes
 * website: http://multiverso.me
 * email: gabriel (at) multiverso (dot) me
 * github: https://github.com/gnuns
 **********************************************/
'use strict';
window.chatBox = (function() {
  let $box = $('.conversation-box');
  let $message = $('.write-box>textarea');

  $('.write-box>.btn').on('click', sendMessage);
  $message.on('keydown', function(e) {
    if (e.which == 13) sendMessage();
  });


  return {
    'clear': clear,
    'writePartnerMessage': writePartnerMessage,
    'writeSytemInfo': writeSytemInfo
  };


  function clear() {
    $box.html('');
  }

  function sendMessage() {
    let message = $message.val();
    if (chatClient.sendMessage(message)) {
      let msgText = document.createTextNode(' ' + message);
      let $userlog = $('<p class="userlog me"></p>');
      $userlog.append('<span class="name">You</span>');
      $userlog.append(msgText);
      $box.append($userlog);
      $message.val('');
    }
  }

  function writeSytemInfo(code) {
    $box.append(code);
  }

  function writePartnerMessage(msg) {
    let msgText = document.createTextNode(' ' + msg.content);
    let $userlog = $('<p class="userlog stranger"></p>');
    $userlog.append('<span class="name">Stranger</span>');
    $userlog.append(msgText);
    $box.append($userlog);
  }
})();
