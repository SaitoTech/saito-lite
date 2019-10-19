
module.exports = EmailControls = {


    render(app, data=[]) {

      let apps_menu = document.querySelector(".email_apps");
      if (!apps_menu) { return; }


      for (let i = 0; i < data.length; i++) {
	apps_menu.innerHTML += `<li class="email-navigator-item">${data[i].name}</li>`;
      }

      this.attachEvents(app);

    },


    attachEvents(app) {
    

    }

}
