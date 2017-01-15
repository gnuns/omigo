/*********************************************
 * by Gabriel 'Hezag' Nunes
 * website: http://multiverso.me
 * email: gabriel (at) multiverso (dot) me
 * github: https://github.com/gnuns
 **********************************************/
'use strict';
window.chatClient = (function() {
  const socket = io('https://192.168.0.16/');
  let hasPartner = false;
  let isVideoChat = false;
  let partnerIsStreaming = false;
  let localMediaStream = null;
  let peer;

  socket.on('msg', chatBox.writePartnerMessage);
  socket.on('sysinfo', handleSysInfo);
  socket.on('videochat_init', handleVideoInit);
  socket.on('videochat_offer', handleVideoOffer);
  socket.on('videochat_offer_response', handleVideoOfferResponse);

  tryVideoChat();

  return {
    'sendMessage': sendMessage,
    'nextPartner': nextPartner
  };

  function nextPartner() {
    chatBox.clear();
    disconnectFromPartner();
    $('.video>.stranger>video').remove();
    socket.emit('next');
  }

  function sendLocalInfo() {
    socket.emit('info', {isVideoChat: isVideoChat})
  }

  function disconnectFromPartner() {
    hasPartner = false;
    if (peer && peer.destroy) peer.destroy();
    peer = null;
    partnerIsStreaming = false;
    $('.video>.stranger').removeClass('loading');
  }

  function tryVideoChat() {
    navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then(function (_localMediaStream) {
      localMediaStream = _localMediaStream;
      isVideoChat = true;
      sendLocalInfo();
      chatBox.changeChatMode(true);

      let $myVideo = $('<video>');

      $('.video>.me').html('');
      $('.video>.me').append($myVideo);
      $myVideo.attr('src', window.URL.createObjectURL(localMediaStream));
      $myVideo[0].play();
    })
    .catch(function (err) {
      localMediaStream = null;
      isVideoChat = false;
      sendLocalInfo();
      chatBox.changeChatMode(false);
    });
  }

  function handleSysInfo(code) {
    switch (code) {
      case 'partner_connected':
        hasPartner = true;
        $('.video>.stranger').addClass('loading');
        break;
      case 'partner_disconnected':
        disconnectFromPartner();
        break;
      case 'waiting_partner':
        sendLocalInfo();
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

  function handleVideoInit() {
    console.log('handleVideoInit')
    if (!isVideoChat || !localMediaStream) {
      return socket.emit('videochat_init', false);
    }
    let peerConfig = {
      initiator: true,
      stream: localMediaStream,
      trickle: false
    };
    peer = new SimplePeer(peerConfig);
    peer.on('signal', function(signal) {
      console.log('sending signal...');
      socket.emit('videochat_init', signal);
    });
    peer.on('stream', function (stream) {
      if (partnerIsStreaming) return false;
      partnerIsStreaming = true;
      let $strangerVideo = $('<video>');

      $('.video>.stranger>video').remove();
      $('.video>.stranger').append($strangerVideo);
      $strangerVideo.attr('src', window.URL.createObjectURL(stream));
      setTimeout(function () {
        if ($strangerVideo[0].paused) {
          $strangerVideo[0].play();
        }
      }, 200);
    });
  }

  function handleVideoOffer(offer) {
    console.log('handleVideoOffer')
    if (!isVideoChat || !localMediaStream) {
      return socket.emit('videochat_offer_ok', false);
    }
    let peerConfig = {
      stream: localMediaStream,
      trickle: false
    };
    peer = new SimplePeer(peerConfig);
    peer.signal(offer);
    peer.on('signal', (signal) => {
      console.log('sending signal...');
      socket.emit('videochat_offer_ok', signal);
    });
    peer.on('stream', function (stream) {
      if (partnerIsStreaming) return false;
      partnerIsStreaming = true;
      let $strangerVideo = $('<video>');

      $('.video>.stranger>video').remove();
      $('.video>.stranger').append($strangerVideo);
      $strangerVideo.attr('src', window.URL.createObjectURL(stream));
      setTimeout(function () {
        if ($strangerVideo[0].paused) {
          $strangerVideo[0].play();
        }
      }, 200);
    });
  }

  function handleVideoOfferResponse(res) {
    console.log('handleVideoOfferResponse')
    if (peer) {
      peer.signal(res);
    }
  }
})();
