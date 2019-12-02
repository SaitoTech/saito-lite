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
                    data.parentmod.emails.active = "inbox";
                  }
                  if (e.currentTarget.id == "sent") {
                    data.parentmod.emails.active = "sent";
                  }
                  if (e.currentTarget.id == "trash") {
                    data.parentmod.emails.active = "trash";
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
                    data.parentmod.emails.active = "inbox";
                  }
                  if (e.currentTarget.id == "sent") {
                    data.parentmod.emails.active = "sent";
                  }
                  if (e.currentTarget.id == "trash") {
                    data.parentmod.emails.active = "trash";
                  }

                }
              }
          });

          data.parentmod.appspace_mod = null;
          data.parentmod.active = "email_list";
          data.parentmod.header_title = "";

          data.parentmod.main.render(app, data);
          data.parentmod.main.attachEvents(app, data);

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

          data.parentmod.active = "email_appspace";
          data.parentmod.previous_state = "email_list";
          data.parentmod.header_title = "Application";
          data.parentmod.appspace_mod = data.parentmod.mods[e.currentTarget.id];
          data.parentmod.appspace_mod_idx = e.currentTarget.id;

          data.parentmod.main.render(app, data)
          data.parentmod.main.attachEvents(app, data)

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
          if (data.mods[i].name.toLowerCase() == modname) {

            let modobj = document.querySelector(`.email-apps-item-${i}`);

// 	    data.parentmod.active	    = "email_appspace";
// 	    data.parentmod.previous_state   = "email_list";
//    	    data.parentmod.header_title     = "Saito AppStore";
//    	    data.parentmod.appspace_mod     = data.parentmod.mods[i];
//   	    data.parentmod.appspace_mod_idx = i;

	    setTimeout(function () { 
	      modobj.click();
            }, 500);

	  }
	}
      }
    }
  }
}
