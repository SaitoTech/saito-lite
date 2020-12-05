const EmailSidebarTemplate 	= require('./email-sidebar.template.js');
const EmailControls 		= require('./email-controls.js');
const EmailChat 		= require('./email-chat.js');


module.exports = EmailSidebar = {

    render(app, mod) {

      let subPage = app.browser.parseHash(window.location.hash).subpage;
      document.querySelectorAll(`.active-navigator-item`).forEach((activeElem, i) => {
        activeElem.classList.remove("active-navigator-item");
      });
      document.querySelectorAll(`#email-nav-${subPage}.email-navigator-item, #email-nav-${subPage}.email-apps-item, #email-nav-${subPage}.crypto-apps-item`).forEach((newActiveNavItem, i) => {  
        newActiveNavItem.classList.add("active-navigator-item");
      });

      if (!document.querySelector(".email-controls")) {
console.log("Loading Email Controls and Chat!");
        document.querySelector(".email-sidebar").innerHTML = EmailSidebarTemplate();
        EmailControls.render(app, mod);
console.log("RENDER EMAIL CHAT");
        EmailChat.render(app, mod);
console.log("POST RENDER EMAIL CHAT");
      }
    },

    attachEvents(app, mod) {

      EmailControls.attachEvents(app, mod);
      EmailChat.attachEvents(app, mod);

    }

}



