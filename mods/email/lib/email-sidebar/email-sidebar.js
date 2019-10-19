const EmailSidebarTemplate 	= require('./email-sidebar.template.js');
const EmailControls 		= require('./email-controls.js');
const EmailChat 		= require('./email-chat.js');


module.exports = EmailSidebar = {

    render(app, data) {

      let sidebar_div = document.querySelector(".email-sidebar");
      if (!sidebar_div) { return; ***REMOVED***

      EmailControls.render(app, data);
      EmailChat.render(app, data);

      this.attachEvents(app);

***REMOVED***,

    attachEvents(app) {
***REMOVED***

***REMOVED***
