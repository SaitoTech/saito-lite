const EmailSidebarTemplate 	= require('./email-sidebar.template.js');
const EmailControls 		= require('./email-controls.js');
const EmailChat 		= require('./email-chat.js');


module.exports = EmailSidebar = {

    render(app, mod) {
      document.querySelector(".email-sidebar").innerHTML = EmailSidebarTemplate();
      EmailControls.render(app, mod);
      EmailChat.render(app, mod);
    },

    attachEvents(app, mod) {
      EmailControls.attachEvents(app, mod);
      EmailChat.attachEvents(app, mod);
    }

}



