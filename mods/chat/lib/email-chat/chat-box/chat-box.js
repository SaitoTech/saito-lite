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
        }

        let chat_box_main = document.getElementById(`chat-box-main-${group.id}`);
        if (group != null) {
          chat_box_main.innerHTML = '';
          if (group.messages.length == 0) {
            chat_box_main.innerHTML =
              `<p id="chat-box-default-message-${group.id}" style="text-align:center">
                No messages in this group :(
              </p>`;
          } else {
            this.removeDefaultMessage(group.id);
          }

          var last_sender = "";
          var last_sig = "";

          group.messages.forEach(message => {
            let { publickey } = message;

            message = Object.assign({}, message, {
              type : publickey == app.wallet.returnPublicKey() ? 'myself' : 'others',
              keyHTML : data.chat.addrController.returnAddressHTML(publickey),
              identicon_color : app.keys.returnIdenticonColor(publickey),
            });

            if (publickey != last_sender) {
              chat_box_main.innerHTML += ChatBoxMessageContainerTemplate(message, data);
              last_sig = message.sig;
            } else {
              document.getElementById(`chat-box-message-container-${last_sig}`).innerHTML
                  += ChatRoomMessageTemplate(message, data);
            }
            last_sender = publickey;
          });
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
              .onclick = (e) => {
                e.stopPropagation();

                let group_id = e.currentTarget.id.split('-')[3];
                data.chat.active_groups = data.chat.active_groups.filter(group => group.id != group_id);

                // let chat_manager = document.querySelector('.chat-manager');
                let chat_box_to_delete = document.getElementById(`chat-box-${group_id}`);
                chat_box_to_delete.parentNode.removeChild(chat_box_to_delete);
              };

    },

    addMessage(app, data, tx) {
      app.modules.returnModule("Chat")
                      .receiveMessage(app, tx);
      this.addTXToDOM(app, data, tx);
    },

    addMessageToDOM(app, data, message) {
      let { group_id, publickey } = message;

      let chat_box_main = document.getElementById(`chat-box-main-${group_id}`)
      if (!chat_box_main) { return; }
      this.removeDefaultMessage(group_id);

      message = Object.assign({}, message, {
        type : publickey == app.wallet.returnPublicKey() ? 'myself' : 'others',
        keyHTML : data.chat.addrController.returnAddressHTML(publickey),
        identicon : app.keys.returnIdenticon(publickey),
        identicon_color : app.keys.returnIdenticonColor(publickey),
      });

      var messages = [];
      data.chat.groups.forEach(group => {
        if (group.id == group_id) {messages = group.messages;}
      });
      var n = messages.length -1;
      if (n == 0) {
        chat_box_main.innerHTML += ChatBoxMessageContainerTemplate(message, data);
      } else {
        if (messages[n-1].publickey != messages[n].publickey) {
          chat_box_main.innerHTML += ChatBoxMessageContainerTemplate(message, data);
        } else {
          let chat_box_message_container = chat_box_main.querySelectorAll('.chat-box-message-container');
          chat_box_message_container[chat_box_message_container.length-1].innerHTML += ChatRoomMessageTemplate(message, data);
        }
      }
      this.scrollToBottom(group_id);
    },

    addTXToDOM(app, data, tx) {
      let message = Object.assign({}, tx.returnMessage());
      this.addMessageToDOM(app, data, message);
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

    removeDefaultMessage(group_id) {
      let default_message = document.getElementById(`chat-box-default-message-${group_id}`)
      if (default_message)
        default_message.parentNode.removeChild(default_message);
    },

    scrollToBottom(group_id) {
        let chat_box_main = document.getElementById(`chat-box-main-${group_id}`);
        if (chat_box_main) {
          chat_box_main.scrollTop = chat_box_main.scrollHeight;
        }
    }
}

