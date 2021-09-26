const ChatRoomTemplate = require('./../templates/chat-room.template');
const ChatBoxMessageBlockTemplate = require('./../templates/chat-box-message-block.template');


var marked = require('marked');
var sanitizeHtml = require('sanitize-html');
const linkifyHtml = require('markdown-linkify');

module.exports = ChatRoom = {

    render(app, mod, group=null) {

      if (group != null) {
        mod.active_group = group;
      } else {
        group = mod.active_group;
      }

      mod.renderMode = "chatroom";

      document.getElementById("chat-main").innerHTML = "";
      app.browser.addElementToDom(ChatRoomTemplate(group), "chat-main");

      let message_input = document.querySelector('#input.chat-room-input');
      let msg = message_input == null ? '' : message_input.value;


      //
      // how many messages -- max 100 in community chat
      //
      while (group.txs.length > 100) {
        group.txs.shift();
      }



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

console.log("scrolling to the bottom!");
      this.scrollToBottom(group.id);

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
          mod.receiveMessage(app, newtx, "chatroom"); // rendermode
          //chat_self.addMessage(app, mod, group_id, newtx);
          msg_input.value = '';
          document.querySelector("#input.chat-room-input").focus();
          document.querySelector("#input.chat-room-input").select();
        }
      });


      document.getElementById("back-button").onclick = (e) => {
        mod.renderMode = "main";
        mod.render(app, "main");
      }

      document.getElementById("back-button").ontouch = (e) => {
        mod.renderMode = "main";
        mod.render(app, "main");
      }

      document.querySelector(".chat-room-submit-button").onclick = (e) => {
          e.preventDefault();
          if (msg_input.value == '') { return; }
          app.browser.logMatomoEvent("Chat", "ArcadeChatSendMessage", "OnClick");
          let newtx = mod.createMessage(group_id, msg_input.value);
          mod.sendMessage(app, newtx);
          mod.receiveMessage(app, newtx, "chatroom");
          //chat_self.addMessage(app, mod, group_id, newtx);
          msg_input.value = '';
      }

      document.querySelector(".chat-room-submit-button").ontouch = (e) => {
          e.preventDefault();
          if (msg_input.value == '') { return; }
          app.browser.logMatomoEvent("Chat", "ArcadeChatSendMessage", "OnTouch");
          let newtx = mod.createMessage(group_id, msg_input.value);
          mod.sendMessage(app, newtx);
          mod.receiveMessage(app, newtx, "chatroom");
          //chat_self.addMessage(app, mod, group_id, newtx);
          msg_input.value = '';
      }


    },




    addMessage(app, mod, group_id, tx) {
      app.modules.returnModule("Chat").receiveMessage(app, tx, "chatroom");
      for (let i = 0; i < mod.groups.length; i++) {
	if (mod.groups[i].id === group_id) {
          this.render(app, mod, mod.groups[i]);
          this.attachEvents(app, mod);
          this.scrollToBottom(group_id);
	}
      }
    },

    scrollToBottom(group_id) {
      let chat_box_main = document.getElementById(`chat-room-content-${group_id}`);
      if (chat_box_main) { chat_box_main.scrollTop = chat_box_main.scrollHeight; }
    },




}





