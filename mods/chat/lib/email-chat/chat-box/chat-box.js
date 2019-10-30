const ChatBoxTemplate = require('./chat-box.template.js');
const ChatBoxMessageContainerTemplate = require('./chat-box-message-container.template.js');

const elParser = require('../../../../../lib/helpers/el_parser');

module.exports = ChatBox = {

    render(app, data) {

        let active_group_name = "";
        if (data.chat.active != undefined) {
          active_group_name = data.chat.active.group_name;
        }

        document.querySelector('.chat-manager').append(elParser(ChatBoxTemplate(active_group_name, data.chat.active.group_id)));

        if (data.chat.active != undefined) {
          data.chat.active.messages.forEach(message => {
            let type = message.publickey == app.wallet.returnPublicKey() ? 'myself' : 'others';
            document.querySelector('.chat-box-main').innerHTML += ChatBoxMessageContainerTemplate(message, '1239841203498', type);
          });
        }

        this.scrollToBottom();
    },

    attachEvents(app, data) {

      let msg_input = document.querySelector(".chat-box-new-message-input");
      msg_input.addEventListener("keypress", (e) => {
          if ((e.which == 13 || e.keyCode == 13) && !e.shiftKey) {
              e.preventDefault();
              if (msg_input.value == '') {return;}
              this.sendMessage(app, data, msg_input.value);
              this.scrollToBottom();
              msg_input.value = '';
          }
      });

      let toggleBoxHeader = (e) => {
        let chat_box = document.querySelector('.chat-box')
        chat_box.style.height = chat_box.style.height == '3em' ? '38em' : '3em';
      };

      let chat_box_header = document.querySelector('.chat-box-header');

      chat_box_header.removeEventListener('click', toggleBoxHeader);
      chat_box_header.addEventListener('click', toggleBoxHeader);

      document.getElementById('chat-box-close')
              .addEventListener('click', (e) => {
                e.stopPropagation();
                let chat_manager = document.querySelector('.chat-manager');
                chat_manager.removeChild(e.path[2]);
              });

    },

    sendMessage(app, data, msg) {
      let msg_data = {
          message: msg,
          group_id: data.chat.active.group_id,
          publickey: app.wallet.returnPublicKey(),
          timestamp: new Date().getTime()
      };

      let newtx = this.createMessage(app, data, msg_data);
      app.network.propagateTransaction(newtx);

      this.addMessageToDOM(msg_data, newtx.transaction.sig, "myself");
    },

    addMessageToDOM(data, sig, type) {
        let chat_box_main = document.getElementById(`chat-box-main-${data.group_id}`)
        if (!chat_box_main) { return; }
        chat_box_main.innerHTML += ChatBoxMessageContainerTemplate(data, sig, type);
        this.scrollToBottom();
    },

    createMessage(app, data, msg_data) {
        let publickey = app.network.peers[0].peer.publickey;
        let newtx = app.wallet.createUnsignedTransactionWithDefaultFee(publickey);
        if (newtx == null) { return; }

        newtx.transaction.msg = {
            module: "Chat",
            request: "chat message",
            publickey: msg_data.publickey,
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

    scrollToBottom() {
        let chat_box_main = document.querySelector(".chat-box-main")
        chat_box_main.scrollTop = chat_box_main.scrollHeight;
    }
}

