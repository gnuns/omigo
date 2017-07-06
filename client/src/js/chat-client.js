/*********************************************
 * by Gabriel 'Hezag' Nunes
 * website: http://multiverso.me
 * email: gabriel (at) multiverso (dot) me
 * github: https://github.com/gnuns
 **********************************************/
'use strict';
window.chatClient = (function() {
  const socket = io(window.serverURI);
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
  socket.on('videochat_ice', processIce);
  socket.on('disconnect', handleServerDisconnection);

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

  function handleServerDisconnection() {
    handleSysInfo('server_disconnection');
  }

  function disconnectFromPartner() {
    hasPartner = false;
    if (peer && peer.close) peer.close();
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

      let $myVideo = $('<video muted>');

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
    if (!isVideoChat || !localMediaStream) {
      return socket.emit('videochat_init', false);
    }
    setupPeerConnection();
    peer.offer(function (err, offer) {
      socket.emit('videochat_init', offer);
    });
  }

  function handleVideoOffer(offer) {
    if (!isVideoChat || !localMediaStream) {
      return socket.emit('videochat_offer_ok', false);
    }
    setupPeerConnection();
    peer.handleOffer(offer, function (err) {
      if (err) return;
      peer.answer(function (err, answer) {
          if (!err) socket.emit('videochat_offer_ok', answer);
      });
    });
  }

  function setupPeerConnection() {
    peer = new PeerConnection({
      'iceServers': [{'url': 'stun:stun.l.google.com:19302'},
                     {'url': 'stun:stun1.l.google.com:19302'},
                     {'url': 'stun:stun2.l.google.com:19302'},
                     {'url': 'stun:stun3.l.google.com:19302'}]});

    peer.addStream(localMediaStream);
    peer.on('addStream', function (event) {
      let remoteMediaStream = event.stream;
      if (partnerIsStreaming) return false;
      partnerIsStreaming = true;
      let $strangerVideo = $('<video>');

      $('.video>.stranger>video').remove();
      $('.video>.stranger').append($strangerVideo);
      $strangerVideo.attr('src', window.URL.createObjectURL(remoteMediaStream));
      setTimeout(function () {
        if ($strangerVideo[0].paused) {
          $strangerVideo[0].play();
        }
      }, 200);
    });
    peer.on('ice', function (candidate) {
      socket.emit('videochat_ice', candidate);
    });
  }

  function handleVideoOfferResponse(answer) {
    if (peer) {
      peer.handleAnswer(answer);
    }
  }

  function processIce(candidate) {
    if (peer) {
      peer.processIce(candidate);
    }
  }
})();
