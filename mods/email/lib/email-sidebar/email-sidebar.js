const EmailSidebarTemplate 	= require('./email-sidebar.template.js');

const EmailChat 		= require('./email-chat.js');
const EmailChatTemplate 	= require('./email-chat.template.js');
const EmailControls 		= require('./email-controls.js');
const EmailControlsTemplate 	= require('./email-controls.template.js');


module.exports = EmailSidebar = {

    render(app, data) {

      let sidebar_div = document.querySelector(".email-sidebar");
      if (!sidebar_div) { return; ***REMOVED***

      sidebar_div.innerHTML += EmailControlsTemplate();
      sidebar_div.innerHTML += EmailChatTemplate();

      EmailControls.render(app, data);
      EmailChat.render(app, data);

      this.attachEvents(app);

***REMOVED***,

    attachEvents(app) {
***REMOVED***

***REMOVED***
