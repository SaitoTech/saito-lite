const EmailBarsMenuTemplate = require('./email-bars-menu.template');

module.exports = EmailBarsMenu = {

  module_application_loaded: 0,

  render(app, mod) {

    document.querySelector('.email-bars-menu').innerHTML = EmailBarsMenuTemplate();

    let email_apps = document.querySelector(".email-apps");
    let mods = app.modules.respondTo("email-appspace");
    for (let i = 0; i < mods.length; i++) {
      let module = mods[i];
      if (module.name === "MyQRCode") {
        email_apps.innerHTML += `<li class="email-apps-item email-apps-item-${i}" style="display:none" id="${i}">${module.name}</li>`;
      } else {
        email_apps.innerHTML += `<li class="email-apps-item email-apps-item-${i}" id="${i}">${module.name}</li>`;
      }
    }

  },

  attachEvents(app, mod) {

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
                    mod.emails.active = "inbox";
                  }
                  if (e.currentTarget.id == "sent") {
                    mod.emails.active = "sent";
                  }
                  if (e.currentTarget.id == "trash") {
                    mod.emails.active = "trash";
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
                    mod.emails.active = "inbox";
                  }
                  if (e.currentTarget.id == "sent") {
                    mod.emails.active = "sent";
                  }
                  if (e.currentTarget.id == "trash") {
                    mod.emails.active = "trash";
                  }

                }
              }
          });

          mod.appspace_mod = null;
          mod.active = "email_list";
          mod.header_title = "";

          mod.main.render(app, mod);
          mod.main.attachEvents(app, mod);

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

	  let mods = app.modules.respondTo("email-appspace");
          mod.active = "email_appspace";
          mod.previous_state = "email_list";
          mod.appspace_mod = mods[e.currentTarget.id];
          mod.appspace_mod_idx = e.currentTarget.id;
          mod.header_title = mod.appspace_mod.name;

          mod.main.render(app, mod)
          mod.main.attachEvents(app, mod)

        }
    }));



    //
    // load first app
    //
    if (this.module_application_loaded == 0) { 

      this.module_application_loaded = 1; 

      if (app.browser.returnURLParameter("module") != "") {
	let modname = app.browser.returnURLParameter("module"); 
	let mods = app.modules.respondTo("email-appspace");
        for (let i = 0; i < mods.length; i++) {
          if (mods[i].returnSlug() == modname) {
            let modobj = document.querySelector(`.email-apps-item-${i}`);
	    setTimeout(function () { 
	      modobj.click();
            }, 500);

	  }
	}
      }
    }
  }
}
