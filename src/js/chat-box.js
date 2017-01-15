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
  let $controlBtn = $('#control');

  $('.write-box>.btn').on('click', sendMessage);
  $controlBtn.on('click', control);

  $message.on('keydown', function(e) {
    if (e.which == 13) sendMessage();
  });
  $(document).on('keyup', function(e) {
    if (e.which == 27) $controlBtn.click();
  });


  return {clear, writePartnerMessage, writeSytemInfo, changeChatMode};

  function control(reset) {
    let current = $controlBtn.attr('data-current');
    if (reset === true) {
      $controlBtn.text('next');
      $controlBtn.attr('data-current', 'next');
      $controlBtn.removeClass('red');
    } else if (current === 'start' || current === 'really') {
      $controlBtn.text('next');
      $controlBtn.attr('data-current', 'next');
      $controlBtn.removeClass('red');
      chatClient.nextPartner();
    } else {
      $controlBtn.text('really?');
      $controlBtn.attr('data-current', 'really');
      $controlBtn.addClass('red');
    }
  }

  function changeChatMode(isVideo) {
    if (isVideo) {
      $('.chat').removeClass('text-only');
    } else {
      $('.chat').addClass('text-only');
    }
  }

  function clear() {
    $box.html('');
    $message.html('');
  }

  function sendMessage() {
    let message = $message.val();
    if (chatClient.sendMessage(message)) {
      let msgText = document.createTextNode(' ' + message);
      let $userlog = $('<p class="userlog me"></p>');
      $userlog.append('<span class="name">You</span>');
      $userlog.append(msgText);
      $box.append($userlog);
      $box.scrollTop($box.prop('scrollHeight'));
      $message.val('');
      control(true);
    }
  }

  function writeSytemInfo(code) {
    let $syslog = $('<div class="sys-info"></div>');

    switch (code) {
      case 'partner_connected':
        chatBox.clear();
        $syslog.append('<p class="syslog"><strong>You\'re now chatting with a random stranger. Say hi!</strong></p>');
        break;
      case 'waiting_partner':
        $syslog.append('<p class="syslog"><strong>Looking for someone you can talk to...</strong></p>');
        break;
      case 'partner_disconnected':
        $syslog.append('<p class="syslog"><strong>Sorry. stranger has disconnected.</strong></p>');
        $syslog.append('<p class="syslog"><strong>Click on <span class="special">next</span> to start a new chat.</strong></p>');
        break;
      case 'server_disconnection':
        $syslog.append('<p class="syslog error"><strong>System error! Please refresh this page!</strong></p>');
        break;
      default:
        $syslog.append(code);
        break;
    }
    $box.append($syslog);
    $box.scrollTop($box.prop('scrollHeight'));
  }

  function writePartnerMessage(msg) {
    let msgText = document.createTextNode(' ' + msg.content);
    let $userlog = $('<p class="userlog stranger"></p>');
    $userlog.append('<span class="name">Stranger</span>');
    $userlog.append(msgText);
    $box.append($userlog);
    $box.scrollTop($box.prop('scrollHeight'));
  }
})();
