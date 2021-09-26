const ChatListTemplate = require('./../templates/chat-list.template');
const ChatListHeaderTemplate = require('./../templates/chat-list-header.template');
const ChatRoom = require('./chat-room');
const ModalAddUser = require('./../../../../lib/saito/ui/modal-add-user/modal-add-user');


module.exports = ChatList = {

    render(app, mod) {

      mod.add_user_modal = new ModalAddUser();

      document.getElementById("chat-main").innerHTML = "";
      app.browser.addElementToDom(ChatListTemplate(), "chat-main");      


 
      document.querySelector(".chat-list-container").innerHTML = "";
      for (let i = 0; i < mod.groups.length; i++) {

	let last_message = "";
	let ts = new Date().getTime();
	let formatted_ts = "";

	if (mod.groups[i].txs.length > 0) {
          last_message = mod.groups[i].txs[mod.groups[i].txs.length-1].returnMessage().message;
          ts = mod.groups[i].txs[mod.groups[i].txs.length-1].transaction.ts
	}

	let timestamp = app.browser.formatDate(ts);
	formatted_ts = timestamp.hours + ":" + timestamp.minutes;

        app.browser.addElementToDom(ChatListHeaderTemplate(mod.groups[i], last_message, formatted_ts), "chat-list-container");

      }

    },

    attachEvents(app, mod) {

      Array.from(document.getElementsByClassName('chat-row')).forEach(row => {
        row.onclick = (e) => {

          let group_id = document.getElementById(e.currentTarget.id).getAttribute("data-id");

          for (let i = 0; i < mod.groups.length; i++) {
            if (mod.groups[i].id === group_id) {
              let active_group = mod.groups[i];
              ChatRoom.render(app, mod, active_group);
              ChatRoom.attachEvents(app, mod);
            }
          }
        }
      });

      document.getElementById('chat-nav-add-contact').onclick = () => {
        mod.add_user_modal.render(app, mod);
        mod.add_user_modal.attachEvents(app, mod);
      };

      app.modules.respondTo("chat-navbar").forEach(mod => {
        mod.respondTo("chat-navbar").render(app, mod);
        mod.respondTo("chat-navbar").attachEvents(app, mod);
      });
      
      document.querySelector('#chat.create-button').onclick = () => this.toggleChatNav();
    },

    toggleChatNav() {
      let chat_nav = document.getElementById('chat-nav');
      chat_nav.style.display = chat_nav.style.display == 'none' ? 'flex' : 'none';
    }

}
