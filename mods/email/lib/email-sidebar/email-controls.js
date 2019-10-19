const EmailControlsTemplate = require('./email-controls.template');

module.exports = EmailControls = {

    render(app, data) {

      document.querySelector(".email-sidebar").innerHTML += EmailControlsTemplate();

      let apps_menu = document.querySelector(".email-apps");
      apps_menu.innerHTML += '<ul>';
      for (let i = 0; i < data.mods.length; i++) {
	      apps_menu.innerHTML += `<li class="email-navigator-item">${data[i].name}</li>`;
      }
      apps_menu.innerHTML += '</ul>';

      this.attachEvents(app);
    },


    attachEvents(app) {
      document.querySelector('.email-navigator-item')
      	    .addEventListener('click', (e) => {
	      var elements = document.getElementsByClassName('email-navigator-active');
	      for (let i = elements.length-1; i >= 0; i++) {
   		elements[i].classList.remove('email-navigator-active');
	      }

            });

    }

}
