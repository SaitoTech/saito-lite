const ChatBoxTemplate = require('./chat-box.template.js');
const ChatBoxMessageContainerTemplate = require('./chat-box-message-container.template.js');

const elParser = require('../../../../../lib/helpers/el_parser');

module.exports = ChatBox = {

    group: {},

    render(app, data, group=null) {

        let active_group_name = "";
        if (group != null) {
          active_group_name = group.group_name;
        }

        document.querySelector('.chat-manager').append(elParser(ChatBoxTemplate(active_group_name, group.group_id)));

        if (group != null) {
          group.messages.forEach(message => {
            let type = message.publickey == app.wallet.returnPublicKey() ? 'myself' : 'others';
            document.getElementById(`chat-box-main-${group.group_id}`).innerHTML += ChatBoxMessageContainerTemplate(message, '1239841203498', type);
          });
        }

        this.scrollToBottom(group.group_id);
    },

    attachEvents(app, data, group) {
      let { group_id } = group;

      let msg_input = document.getElementById(`chat-box-new-message-input-${group_id}`);
      msg_input.addEventListener("keypress", (e) => {
          if ((e.which == 13 || e.keyCode == 13) && !e.shiftKey) {
              e.preventDefault();
              if (msg_input.value == '') { return; }

              this.sendMessage(app, data, msg_input.value, group_id);
              this.scrollToBottom();

              msg_input.value = '';
          }
      });

      let toggleBoxHeader = (e) => {
        let chat_box = document.getElementById(`chat-box-${group_id}`);
        chat_box.classList.toggle('chat-box-hide');
      };

      let chat_box_header = document.getElementById(`chat-box-header-${group_id}`);

      chat_box_header.removeEventListener('click', toggleBoxHeader);
      chat_box_header.addEventListener('click', toggleBoxHeader);

      document.getElementById(`chat-box-close-${group_id}`)
              .addEventListener('click', (e) => {
                e.stopPropagation();

                let group_id = e.currentTarget.id.split('-')[3];
                data.chat.active_groups = data.chat.active_groups.filter(group => group.group_id != group_id);

                let chat_manager = document.querySelector('.chat-manager');
                let chat_box_to_delete = document.getElementById(`chat-box-${group_id}`);
                chat_manager.removeChild(chat_box_to_delete);
              });

    },

    sendMessage(app, data, msg, group_id) {
      let msg_data = {
          message: msg,
          group_id: group_id,
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
        this.scrollToBottom(data.group_id);
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

    scrollToBottom(group_id) {
        let chat_box_main = document.getElementById(`chat-box-main-${group_id}`);
        if (chat_box_main) {
          chat_box_main.scrollTop = chat_box_main.scrollHeight;
        }
    }
}

