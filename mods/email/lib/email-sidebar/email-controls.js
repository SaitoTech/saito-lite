const EmailControlsTemplate = require('./email-controls.template');
const EmailChatTemplate = require('./email-chat.template');

module.exports = EmailControls = {

    render(app, data) {

      document.querySelector(".email-sidebar").innerHTML += EmailControlsTemplate();
      document.querySelector(".email-sidebar").innerHTML += EmailChatTemplate();

      let email_apps = document.querySelector(".email-apps");
      for (let i = 0; i < data.mods.length; i++) {
	email_apps.innerHTML += `<li class="email-navigator-item">${data.mods[i].name}</li>`;
      }

      this.attachEvents(app);
    },


    attachEvents(app) {
      document.querySelector('.email-navigator-item')
      	    .addEventListener('click', (e) => {
alert("TEST CLICK!");
	      var elements = document.getElementsByClassName('email-navigator-active');
	      for (let i = elements.length-1; i >= 0; i++) {
   		elements[i].classList.remove('email-navigator-active');
	      }

            });

    }

}
