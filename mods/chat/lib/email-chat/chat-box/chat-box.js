const ChatBoxTemplate = require('./chat-box.template.js');
const ChatBoxMessageContainerTemplate = require('./chat-box-message-container.template.js');

const elParser = require('../../../../../lib/helpers/el_parser');

module.exports = ChatBox = {

    group: {***REMOVED***,

    render(app, data, group=null) {

        let active_group_name = "";
        if (group != null) {
          active_group_name = group.name;
    ***REMOVED***

        if (!document.getElementById(`chat-box-${group.id***REMOVED***`)) {
          document.querySelector('.chat-manager').append(elParser(ChatBoxTemplate(active_group_name, group.id)));

          if (group != null) {
            if (group.messages.length == 0) {
              document.getElementById(`chat-box-main-${group.id***REMOVED***`).innerHTML =
                `<p id="chat-box-default-message-${group.id***REMOVED***" style="text-align:center">
                  No messages in this group :(
                </p>`;
        ***REMOVED***

            group.messages.forEach(message => {
              let type = message.publickey == app.wallet.returnPublicKey() ? 'myself' : 'others';
              message.publickey = data.chat.addrController.returnAddressHTML(message.publickey);
              document.getElementById(`chat-box-main-${group.id***REMOVED***`).innerHTML +=
                ChatBoxMessageContainerTemplate(message, message.sig, type);
        ***REMOVED***);
      ***REMOVED***
    ***REMOVED***

        this.scrollToBottom(group.id);
***REMOVED***,

    attachEvents(app, data, group) {
      let msg_input = document.getElementById(`chat-box-new-message-input-${group.id***REMOVED***`);
      msg_input.addEventListener("keypress", (e) => {
          if ((e.which == 13 || e.keyCode == 13) && !e.shiftKey) {
              e.preventDefault();
              if (msg_input.value == '') { return; ***REMOVED***

              let msg_data = {
                message: msg_input.value,
                group_id: group.id,
                publickey: app.wallet.returnPublicKey(),
                timestamp: new Date().getTime()
          ***REMOVED***;

              let newtx = this.createMessage(app, data, msg_data);
              app.modules.returnModule("Chat")
                      .sendMessage(app, newtx);

              this.addMessage(app, data, newtx);
              msg_input.value = '';
      ***REMOVED***
  ***REMOVED***);

      let chat_box_header = document.getElementById(`chat-box-header-${group.id***REMOVED***`);
      chat_box_header.onclick = () => {
        let chat_box = document.getElementById(`chat-box-${group.id***REMOVED***`);
        chat_box.classList.toggle('chat-box-hide');
  ***REMOVED***;

      document.getElementById(`chat-box-close-${group.id***REMOVED***`)
              .addEventListener('click', (e) => {
                e.stopPropagation();

                let group_id = e.currentTarget.id.split('-')[3];
                data.chat.active_groups = data.chat.active_groups.filter(group => group.id != group_id);

                let chat_manager = document.querySelector('.chat-manager');
                let chat_box_to_delete = document.getElementById(`chat-box-${group_id***REMOVED***`);
                chat_manager.removeChild(chat_box_to_delete);
          ***REMOVED***);

***REMOVED***,

    addMessage(app, data, tx) {
      app.modules.returnModule("Chat")
                      .receiveMessage(app, tx);
      this.addTXToDOM(data, tx);
***REMOVED***,

    addMessageToDOM(data, msg) {
      let chat_box_main = document.getElementById(`chat-box-main-${msg.group_id***REMOVED***`)
      if (!chat_box_main) { return; ***REMOVED***

      msg.publickey = data.chat.addrController.returnAddressHTML(msg.publickey);

      if (document.getElementById(`chat-box-default-message-${msg.group_id***REMOVED***`)) { chat_box_main.innerHTML = '' ***REMOVED***

      chat_box_main.innerHTML += ChatBoxMessageContainerTemplate(msg, msg.sig, msg.type);
      this.scrollToBottom(msg.group_id);
***REMOVED***,

    addTXToDOM(data, tx) {
        let msg = Object.assign({***REMOVED***, tx.returnMessage(), { type: 'myself' ***REMOVED***);
        this.addMessageToDOM(data, msg);
***REMOVED***,

    createMessage(app, data, msg_data) {

        let publickey = app.network.peers[0].peer.publickey;
        let newtx = app.wallet.createUnsignedTransaction(publickey, 0.0, 0.0);
        if (newtx == null) { return; ***REMOVED***

        newtx.transaction.msg = {
            module: "Chat",
            request: "chat message",
            publickey: msg_data.publickey,
            group_id: msg_data.group_id,
            message:  msg_data.message,

    ***REMOVED***
    ***REMOVED*** will possibly encrypt
    ***REMOVED*** this.saito.keys.encryptMessage(this.saito.wallet.returnPublicKey(), msg),
    ***REMOVED***
            timestamp: msg_data.timestamp,
    ***REMOVED***;

***REMOVED*** newtx.transaction.msg = this.app.keys.encryptMessage(this.app.wallet.returnPublicKey(), newtx.transaction.msg);
        newtx.transaction.msg.sig = app.wallet.signMessage(JSON.stringify(newtx.transaction.msg));
        newtx = app.wallet.signTransaction(newtx);
        return newtx;
***REMOVED***,

    scrollToBottom(group_id) {
        let chat_box_main = document.getElementById(`chat-box-main-${group_id***REMOVED***`);
        if (chat_box_main) {
          chat_box_main.scrollTop = chat_box_main.scrollHeight;
    ***REMOVED***
***REMOVED***
***REMOVED***

