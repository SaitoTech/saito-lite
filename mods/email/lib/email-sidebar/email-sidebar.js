const EmailSidebarTemplate 	= require('./email-sidebar.template.js');
const EmailControls 		= require('./email-controls.js');
const EmailChat 		= require('./email-chat.js');


module.exports = EmailSidebar = {

    render(app, data) {

      document.querySelector(".email-sidebar-container").innerHTML = EmailSidebarTemplate();

      EmailControls.render(app, data);
      // EmailChat.render(app, data);

      this.attachEvents();

***REMOVED***,

    attachEvents() {***REMOVED***

***REMOVED***
