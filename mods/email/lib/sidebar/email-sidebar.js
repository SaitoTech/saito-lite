const EmailSidebarTemplate 	= require('./email-sidebar.template.js');

const EmailChat 		= require('./email-chat.js');
const EmailChatTemplate 	= require('./email-chat.template.js');
const EmailControls 		= require('./email-controls.js');
const EmailControlsTemplate 	= require('./email-controls.template.js');


module.exports = EmailSidebar = {

    components: [],


    render(app, data=[]) {

      components.push(new EmailControls());
      components.push(new EmailChat());

      let sidebar_div = document.querySelector(".email-sidebar");
      if (!sidebar_div) { return; }

      sidebar_div.innerHTML += EmailControlsTemplate();
      sidebar_div.innerHTML += EmailChatTemplate();

      this.components[0].render(app);
      this.components[1].render(app);

      this.attachEvents(app);

    },



    attachEvents(app) {
    }

}
