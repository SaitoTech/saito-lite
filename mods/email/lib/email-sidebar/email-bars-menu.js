const EmailBarsMenuTemplate = require('./email-bars-menu.template');

module.exports = EmailBarsMenu = {

  module_application_loaded: 0,

  render(app, data) {

    document.querySelector('.email-bars-menu').innerHTML = EmailBarsMenuTemplate();

    let email_apps = document.querySelector(".email-apps");
    for (let i = 0; i < data.mods.length; i++) {
      if (data.mods[i].respondTo("email-appspace") != null) {
        email_apps.innerHTML += `<li class="email-apps-item email-apps-item-${i}" id="${i}">${data.mods[i].name}</li>`;
      }
    }

  },

  attachEvents(app, data) {

    //
    // inbox / sent / trash
    //
    Array.from(document.getElementsByClassName('email-navigator-item'))
      .forEach(item => item.addEventListener('click', (e) => {

        if (e.currentTarget.classList.contains("active-navigator-item")) {
          // user clicks already-active item
        } else {

          Array.from(document.getElementsByClassName('email-navigator-item'))
            .forEach(item2 => {
              if (item2.classList.contains("active-navigator-item")) {
                if (item2 != e.currentTarget) {
                  item2.classList.remove("active-navigator-item");
                  e.currentTarget.classList.add("active-navigator-item");

                  if (e.currentTarget.id == "inbox") {
                    data.email.emails.active = "inbox";
                  }
                  if (e.currentTarget.id == "sent") {
                    data.email.emails.active = "sent";
                  }
                  if (e.currentTarget.id == "trash") {
                    data.email.emails.active = "trash";
                  }


                }
              }
          });

          Array.from(document.getElementsByClassName('email-apps-item'))
            .forEach(item2 => {
              if (item2.classList.contains("active-navigator-item")) {
                if (item2 != e.currentTarget) {
                  item2.classList.remove("active-navigator-item");
                  e.currentTarget.classList.add("active-navigator-item");

                  if (e.currentTarget.id == "inbox") {
                    data.email.emails.active = "inbox";
                  }
                  if (e.currentTarget.id == "sent") {
                    data.email.emails.active = "sent";
                  }
                  if (e.currentTarget.id == "trash") {
                    data.email.emails.active = "trash";
                  }

                }
              }
          });

          data.email.appspace_mod = null;
          data.email.active = "email_list";
          data.email.header_title = "";

          data.email.main.render(app, data);
          data.email.main.attachEvents(app, data);

        }
    }));



    Array.from(document.getElementsByClassName('email-apps-item'))
      .forEach(item => item.addEventListener('click', (e) => {

        if (e.currentTarget.classList.contains("active-navigator-item")) {
          // user clicks already-active item
        } else {

          Array.from(document.getElementsByClassName('email-apps-item'))
            .forEach(item2 => {
              if (item2.classList.contains("active-navigator-item")) {
                if (item2 != e.currentTarget) {
                  item2.classList.remove("active-navigator-item");
                  e.currentTarget.classList.add("active-navigator-item");
                }
              }
          });

          Array.from(document.getElementsByClassName('email-navigator-item'))
            .forEach(item2 => {
              if (item2.classList.contains("active-navigator-item")) {
                if (item2 != e.currentTarget) {
                  item2.classList.remove("active-navigator-item");
                  e.currentTarget.classList.add("active-navigator-item");
                }
              }
          });

          data.email.active = "email_appspace";
          data.email.previous_state = "email_list";
          data.email.header_title = "Application";
          data.email.appspace_mod = data.email.mods[e.currentTarget.id];
          data.email.appspace_mod_idx = e.currentTarget.id;

          data.email.main.render(app, data)
          data.email.main.attachEvents(app, data)

        }
    }));



    //
    // load first app
    //
    if (this.module_application_loaded == 0) { 

      this.module_application_loaded = 1; 

      if (app.browser.returnURLParameter("module") != "") {

	let modname = app.browser.returnURLParameter("module"); 
        for (let i = 0; i < data.mods.length; i++) {
          if (data.mods[i].returnSlug() == modname) {

            let modobj = document.querySelector(`.email-apps-item-${i}`);

// 	    data.email.active	    = "email_appspace";
// 	    data.email.previous_state   = "email_list";
//    	    data.email.header_title     = "Saito AppStore";
//    	    data.email.appspace_mod     = data.email.mods[i];
//   	    data.email.appspace_mod_idx = i;

	    setTimeout(function () { 
	      modobj.click();
            }, 500);

	  }
	}
      }
    }
  }
}
