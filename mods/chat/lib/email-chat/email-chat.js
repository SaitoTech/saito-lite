const EmailChatTemplate 	= require('./email-chat.template.js');
const ChatList		 	= require('./chat-list/chat-list');
const ChatBox		 	= require('./chat-box/chat-box');

const ChatManager = require('./chat-manager/chat-manager');

const elParser = require('../../../../lib/helpers/el_parser');

module.exports = EmailChat = {

    initialize(app, data) {
      my_listener = (msg) => this.addMessageToDOM(app, data, msg);
      app.connection.removeAllListeners('chat_receive_message');
      app.connection.on('chat_receive_message', my_listener);
***REMOVED***,

    render(app, data) {
      let email_chat = document.querySelector(".email-chat")
      email_chat.innerHTML = EmailChatTemplate();

      ChatManager.render(app, data);
      // if (data.chat.groups.length == 0) { email_chat.style.display = "none" ***REMOVED***;
      ChatList.render(app, data);

***REMOVED***,

    attachEvents(app, data) {
      var modal = document.getElementById('add-contact-modal');

      document.getElementById('email-chat-add-contact')
              .onclick = () => modal.style.display = "block";

      document.getElementsByClassName("close")[0]
              .onclick = () => modal.style.display = "none";

      document.getElementById('add-contact-add-button')
              .onclick = () => {
                let publickey = document.getElementById('add-contact-input').value;
                let encrypt_mod = app.modules.returnModule('Encrypt');
                encrypt_mod.initiate_key_exchange(publickey);

        ***REMOVED***
        ***REMOVED*** show success modal
        ***REMOVED***


        ***REMOVED*** then hide it
        ***REMOVED***
                modal.style.display = "none";

          ***REMOVED***;

      ChatList.attachEvents(app, data);
***REMOVED***,

    addMessageToDOM(app, data, msg) {
      // if (data.chat.active.group_id == msg.group_id) {
      ChatBox.addMessageToDOM(msg, msg.sig, msg.type);
      // ***REMOVED***
***REMOVED***,

***REMOVED***
