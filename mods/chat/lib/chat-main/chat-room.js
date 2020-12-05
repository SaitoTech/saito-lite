const ChatRoomTemplate = require('./templates/chat-room.template');
const ChatRoomMessageBlockTemplate = require('./templates/chat-room-message-block.template');

var marked = require('marked');
var sanitizeHtml = require('sanitize-html');
const linkifyHtml = require('markdown-linkify');

module.exports = ChatRoom = {

    render(app, mod, group) {

      document.getElementById("chat-main").innerHTML = "";
      app.browser.addElementToDom(ChatRoomTemplate(group), "chat-main");

      let message_input = document.querySelector('#input.chat-room-input');
      let msg = message_input == null ? '' : message_input.value;

      let message_blocks = mod.createMessageBlocks(group); 
      let chat_box_main = document.getElementById(`chat-room-content-${group.id}`);

      let first_comment_sig = "";
      for (let i = 0; i < message_blocks.length; i++) {
        let html = ChatBoxMessageBlockTemplate(app, mod, group, message_blocks[i]);
        if (i == message_blocks.length-1) {
          let first_comment_sig = "first_comment_sig";
          if (message_blocks[i].length > 0) { first_comment_sig = app.crypto.hash(message_blocks[i][0].transaction.sig); }
          // recreate html after destroying so existing entries are output (template checks to avoid dupes)
          try{document.getElementById(`chat-message-set-${first_comment_sig}`).destroy();}catch(err){};
          html = ChatBoxMessageBlockTemplate(app, mod, group, message_blocks[i]);
          chat_box_main.innerHTML += html;
        } else {
          chat_box_main.innerHTML += html;
        }
      }

      this.scrollToBottom();

    },

    attachEvents(app, mod) {

      let chat_self = this;
      let msg_input = document.getElementById(`input`);
      let group_id = msg_input.getAttribute("data-id");

      //
      // submit on enter
      //
      msg_input.addEventListener("keypress", (e) => {
        if ((e.which == 13 || e.keyCode == 13) && !e.shiftKey) {
          e.preventDefault();
          if (msg_input.value == '') { return; }
          let newtx = mod.createMessage(group_id, msg_input.value);
          mod.sendMessage(app, newtx);
          chat_self.addMessage(app, mod, newtx);
          msg_input.value = '';
        }
      });


    },




    addMessage(app, mod, tx) {
      app.modules.returnModule("Chat").receiveMessage(app, tx);
      this.addTXToDOM(app, mod, tx);
    },

    addTXToDOM(app, mod, tx) {
      let message = Object.assign({}, tx.returnMessage(), { type: 'myself' });
      this.addMessageToDOM(app, mod, message);
    },

    addMessageToDOM(app, mod, msg) {
      try {
        if (document.getElementById(msg.sig)) { return };
        let message = Object.assign({}, msg, {
          keyHTML: app.browser.returnAddressHTML(msg.publickey),
          identicon: app.keys.returnIdenticon(msg.publickey),
          identicon_color: app.keys.returnIdenticonColor(msg.publickey),
        });
        //remove safety base64 encoding.
        //message.message = app.crypto.base64ToString(message.message);

        let chat_box_main = document.getElementById(`chat-box-main-${message.group_id}`);

        let last_message_block = Object.assign({ messages: [] }, this.message_blocks[this.message_blocks.length - 1]);
        let last_message = Object.assign({}, last_message_block.messages[last_message_block.messages.length - 1]);

        if (last_message.publickey == message.publickey) {
          last_message_block = Object.assign({}, last_message_block, {
            last_message_timestamp: message.timestamp,
            last_message_sig: message.sig,
            messages: [...last_message_block.messages, message],
            type: app.wallet.returnPublicKey() == message.publickey ? 'myself' : 'others',
          });
          chat_box_main.removeChild(chat_box_main.lastElementChild);
          chat_box_main.innerHTML += ChatBoxMessageBlockTemplate(last_message_block, mod);
          this.message_blocks[this.message_blocks.length - 1] = last_message_block;
        } else {
          let new_message_block = Object.assign({}, {
            publickey: message.publickey,
            group_id: message.group_id,
            last_message_timestamp: message.timestamp,
            last_message_sig: message.sig,
            keyHTML: message.keyHTML,
            identicon: message.identicon,
            identicon_color: message.identicon_color,
            type: app.wallet.returnPublicKey() == message.publickey ? 'myself' : 'others',
            messages: [message]
          });
          this.message_blocks.push(new_message_block);
          chat_box_main.innerHTML += ChatBoxMessageBlockTemplate(new_message_block, mod);
        }
        // add window.imgPoP to all images in chat_box_main ...

        document.querySelectorAll('.chat-box-main .img-prev').forEach(img => {
          img.addEventListener('click', window.imgPop(img));
        });
        this.scrollToBottom(message.group_id);
      } catch (err) { }
    },




    scrollToBottom(group_id) {
      let chat_box_main = document.getElementById(`chat-room-content`);
      if (chat_box_main) { chat_box_main.scrollTop = chat_box_main.scrollHeight; }
    },




}





