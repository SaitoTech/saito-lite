const ChatBoxTemplate = require('./chat-box.template.js');
const ChatBoxMessageContainerTemplate = require('./chat-box-message-container.template.js');
const ChatRoomMessageTemplate = require('../../chat-main/chat-room/chat-room-message.template');

module.exports = ChatBox = {

    group: {},

    render(app, data, group=null) {

        let active_group_name = "";
        if (group != null) {
          active_group_name = group.name;
        }

        if (!document.getElementById(`chat-box-${group.id}`)) {
          let {el_parser} = data.helpers;
          document.querySelector('.chat-manager').append(el_parser(ChatBoxTemplate(active_group_name, group.id)));

          if (group != null) {
            if (group.messages.length == 0) {
              document.getElementById(`chat-box-main-${group.id}`).innerHTML =
                `<p id="chat-box-default-message-${group.id}" style="text-align:center">
                  No messages in this group :(
                </p>`;
            }

            var last_sender = "";
            var last_sig = "";
            group.messages.forEach(message => {
              let type = message.publickey == app.wallet.returnPublicKey() ? 'myself' : 'others';
              message.keyHTML = data.chat.addrController.returnAddressHTML(message.publickey);
              if (message.publickey != last_sender) {
                document.getElementById(`chat-box-main-${group.id}`).innerHTML +=
                ChatBoxMessageContainerTemplate(message, message.sig, type, data);
                last_sig = message.sig;
              } else {
                document.getElementById(`chat-box-message-container-${last_sig}`).innerHTML 
                   += ChatRoomMessageTemplate(message, message.sig, type, data);
              }
              last_sender = message.publickey;
            });
          }
        }

        this.scrollToBottom(group.id);
    },

    attachEvents(app, data, group) {
      let msg_input = document.getElementById(`chat-box-new-message-input-${group.id}`);
      msg_input.addEventListener("keypress", (e) => {
          if ((e.which == 13 || e.keyCode == 13) && !e.shiftKey) {
              e.preventDefault();
              if (msg_input.value == '') { return; }

              let msg_data = {
                message: msg_input.value,
                group_id: group.id,
                publickey: app.wallet.returnPublicKey(),
                timestamp: new Date().getTime()
              };

              let newtx = this.createMessage(app, data, msg_data);
              app.modules.returnModule("Chat")
                      .sendMessage(app, newtx);

              this.addMessage(app, data, newtx);
              msg_input.value = '';
          }
      });

      let chat_box_header = document.getElementById(`chat-box-header-${group.id}`);
      chat_box_header.onclick = () => {
        let chat_box = document.getElementById(`chat-box-${group.id}`);
        chat_box.classList.toggle('chat-box-hide');
      };

      document.getElementById(`chat-box-close-${group.id}`)
              .addEventListener('click', (e) => {
                e.stopPropagation();

                let group_id = e.currentTarget.id.split('-')[3];
                data.chat.active_groups = data.chat.active_groups.filter(group => group.id != group_id);

                let chat_manager = document.querySelector('.chat-manager');
                let chat_box_to_delete = document.getElementById(`chat-box-${group_id}`);
                chat_manager.removeChild(chat_box_to_delete);
              });

    },

    addMessage(app, data, tx) {
      app.modules.returnModule("Chat")
                      .receiveMessage(app, tx);
      this.addTXToDOM(app, data, tx);
    },

    addMessageToDOM(app, data, msg) {
      let chat_box_main = document.getElementById(`chat-box-main-${msg.group_id}`)
      if (!chat_box_main) { return; }
      if (document.getElementById(`chat-box-default-message-${msg.group_id}`)) { chat_box_main.innerHTML = '' }

      msg.identicon = app.keys.returnIdenticon(msg.publickey);
      msg.keyHTML = data.chat.addrController.returnAddressHTML(msg.publickey);
      var messages = [];
      data.chat.groups.forEach(group => {
        if (group.id == msg.group_id) {messages = group.messages;}
      });
      var n = messages.length -1;
      if (n == 0) {
        chat_box_main.innerHTML += ChatBoxMessageContainerTemplate(msg, msg.sig, msg.type, data);
      } else {
        if (messages[n-1].publickey != messages[n].publickey) {
          chat_box_main.innerHTML += ChatBoxMessageContainerTemplate(msg, msg.sig, msg.type, data);
        } else {
          chat_box_main.querySelectorAll('.chat-box-message-container')[chat_box_main.querySelectorAll('.chat-box-message-container').length-1].innerHTML 
          += ChatRoomMessageTemplate(msg, msg.sig, msg.type, data);
        }
      }
      this.scrollToBottom(msg.group_id);
    },

    addTXToDOM(app, data, tx) {
      
        let msg = Object.assign({}, tx.returnMessage(), { identicon: app.keys.returnIdenticon(tx.returnMessage().publickey), type: 'myself' });
        this.addMessageToDOM(app, data, msg);
    },

    createMessage(app, data, msg_data) {

        let publickey = app.network.peers[0].peer.publickey;
        let identicon = app.keys.returnIdenticon(msg_data.publickey);
        let newtx = app.wallet.createUnsignedTransaction(publickey, 0.0, 0.0);
        if (newtx == null) { return; }

        newtx.transaction.msg = {
            module: "Chat",
            request: "chat message",
            publickey: msg_data.publickey,
            identicon: identicon,
            group_id: msg_data.group_id,
            message:  msg_data.message,

            //
            // will possibly encrypt
            // this.saito.keys.encryptMessage(this.saito.wallet.returnPublicKey(), msg),
            //
            timestamp: msg_data.timestamp,
        };

        // newtx.transaction.msg = this.app.keys.encryptMessage(this.app.wallet.returnPublicKey(), newtx.transaction.msg);
        newtx.transaction.msg.sig = app.wallet.signMessage(JSON.stringify(newtx.transaction.msg));
        newtx = app.wallet.signTransaction(newtx);
        return newtx;
    },

    scrollToBottom(group_id) {
        let chat_box_main = document.getElementById(`chat-box-main-${group_id}`);
        if (chat_box_main) {
          chat_box_main.scrollTop = chat_box_main.scrollHeight;
        }
    }
}

