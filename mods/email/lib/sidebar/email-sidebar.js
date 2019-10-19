const EmailSidebarTemplate 	= require('./email-sidebar.template.js');

const EmailChat 		= require('./email-chat.js');
const EmailChatTemplate 	= require('./email-chat.template.js');
const EmailComposeBtn 		= require('./email-compose-btn.js');
const EmailComposeBtnTemplate 	= require('./email-compose-btn.template.js');
const EmailLoader 		= require('./email-loader.js');
const EmailLoaderTemplate 	= require('./email-loader.template.js');
const EmailNavigator 		= require('./email-navigator.js');
const EmailNavigatorTemplate 	= require('./email-navigator.template.js');



module.exports = EmailSidebar = {

    components: [],


    render(app, data=[]) {

      if (data.length > 0) {
	for (let i = 0; i < data.length; i++) {
	  if (data[i] == "chat") { components[3].render(); }
	}
	this.attachEvents();
	return;
      }


      let email_sidebar_compose_btn = new EmailComposeBtn();
      let email_sidebar_navigator = new EmailNavigator();
      let email_sidebar_loader = new EmailLoader();
      let email_sidebar_chat = new EmailChat();

      components.push(email_sidebar_compose_btn);
      components.push(email_sidebar_navigator);
      components.push(email_sidebar_loader);
      components.push(email_sidebar_chat);

      let sidebar_div = document.querySelector(".email-sidebar");
      if (!sidebar_div) { return; }

      for (let i = 0; i < components.length; i++) {
	sidebar_div.innerHTML += EmailComposeBtnTemplate();
	sidebar_div.innerHTML += EmailNavigatorTemplate();
	sidebar_div.innerHTML += EmailLoaderTemplate();
	sidebar_div.innerHTML += EmailChatTemplate();
      }

      for (let i = 0; i < components.length; i++) {
        components[i].render(app);
        components[i].attachEvents(app);
      }

      this.attachEvents();

    },



    attachEvents(app) {
    }

}
