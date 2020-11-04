const ChatSidebarTemplate = require('./templates/chat-sidebar.template');
const ChatSidebarContactTemplate = require('./templates/chat-sidebar-contact.template');

module.exports = ChatSidebar = {

    render(app, mod) {

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
	row.onclick = (e) => { mod.openChatBox(e.currentTarget.id); };
      });



    },

}
