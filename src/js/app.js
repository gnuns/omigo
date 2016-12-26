/*********************************************
 * by Gabriel 'Hezag' Nunes
 * website: http://multiverso.me
 * email: gabriel (at) multiverso (dot) me
 * github: https://github.com/gnuns
 **********************************************/

(function(){
  // scroll down on resize
  window.onresize = function(event) {
    var body = document.getElementById('body');
    body.scrollTop = body.scrollHeight;
    var conversationBox = document.getElementById('conversation-box');
    conversationBox.scrollTop = conversationBox.scrollHeight;
  };
})();
