const ChatSidebarTemplate = require('./../templates/chat-sidebar.template');
const ChatSidebarContactTemplate = require('./../templates/chat-sidebar-contact.template');
const ModalAddUser = require('./../../../../lib/saito/ui/modal-add-user/modal-add-user');


module.exports = ChatSidebar = {

    render(app, mod) {

      mod.modal_add_user = new ModalAddUser(app);

      if (!document.querySelector('.chat-header')) { app.browser.addElementToDom(ChatSidebarTemplate(), "email-chat" ); } 

      for (let i = 0; i < mod.groups.length; i++) {
        if (!document.getElementById(mod.groups[i].id)) { 
          app.browser.addElementToDom(ChatSidebarContactTemplate(app, mod.groups[i]), "chat-list" );
        }
      }

    },

    attachEvents(app, mod) {

      //
      // open chat window if clicked
      //
      document.querySelectorAll(".chat-row").forEach(row => {
	row.onclick = (e) => {
	  mod.mute_community_chat = 0;
          try {
            let chatName = document.querySelector(`#${e.currentTarget.id} .chat-group-name`).innerHTML;
            app.browser.logMatomoEvent("Chat", "ArcadeSidebarChatOpenedClick", chatName);
          } catch (e) {
            // This sometimes fails if the id is formed a certain way the querySelector throws an error..
            app.browser.logMatomoEvent("Chat", "ArcadeSidebarChatOpenedClick", "unknownChat");
          }
          mod.openChatBox(e.currentTarget.id);
        };
      });

      //
      // add contact modal if + clicked
      //
      document.getElementById("email-chat-add-contact").onclick = (e) => {
        mod.modal_add_user.render(app, mod);
        mod.modal_add_user.attachEvents(app, mod);
      };

    },

}
