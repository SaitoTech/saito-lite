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
    app.modules.requestInterfaces("is_cryptocurrency").forEach(async(responseInterface, i) => {
      app.browser.addElementToDom(`<li id="crypto-apps-item-${responseInterface.modname}" class="crypto-apps-item">
        ${responseInterface.ticker}
      </li>`, "crypto-apps");
    });
    // copy the content of .email-bars-menu into #mobile.email-bars-menu
    let emailBarsMenuInnerHTML = document.querySelector('.email-bars-menu').innerHTML;
    app.browser.addElementToDom(`<div id="mobile" class="email-bars-menu" style="display:none;">${emailBarsMenuInnerHTML}</div>`)
  },
  attachEvents(app, mod) {
    // attach events to cyrpto mod buttons
    Array.from(document.getElementsByClassName('crypto-apps-item')).forEach((cryptoAppButton, i) => {
      cryptoAppButton.onclick = () => {
        // Set the state of email mod to something here so email-body.js does the right thing.
        mod.previous_state = mod.active;
        mod.active = "crypto_mod";
        mod.main.render(app, mod);
        mod.main.attachEvents(app, mod);
      }
    });
    
    // Hide the menu bar if user clicks off of it or on a button in it
    let email_bars_menu = document.querySelector('#mobile.email-bars-menu');
    email_bars_menu.addEventListener('click', () => {
        email_bars_menu.style.display = "none";
    });
    window.addEventListener('click', (e) => {
        if (e.target.id !== "email-bars-icon") {
            email_bars_menu.style.display = "none";
        }
    });

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
          mod.previous_state = mod.active;
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
          console.log("email apps item");
          console.log(mod.active);
          let mods = app.modules.respondTo("email-appspace");
          mod.previous_state = mod.active;
          mod.active = "email_appspace";
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
