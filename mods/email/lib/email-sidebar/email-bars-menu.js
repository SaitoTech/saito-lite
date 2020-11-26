const EmailBarsMenuTemplate = require('./email-bars-menu.template');

module.exports = EmailBarsMenu = {

  render(app, mod) {
    console.log("EmailBarsMenu render");
    console.log(document.querySelector('.email-navigator-bars-menu'));
    //if (document.querySelector('.email-navigator-bars-menu')) { return; }
    
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
    if(!document.querySelector('#mobile.email-bars-menu')) {
      let emailBarsMenuInnerHTML = document.querySelector('.email-bars-menu').innerHTML;
      app.browser.addElementToDom(`<div id="mobile" class="email-bars-menu" style="display:none;">${emailBarsMenuInnerHTML}</div>`)
    }
    
  },
  attachEvents(app, mod) {
    console.log("EmailBarsMenu attachEvents");
    // attach events to cyrpto mod buttons
    Array.from(document.getElementsByClassName('crypto-apps-item')).forEach((cryptoAppButton, i) => {
      cryptoAppButton.onclick = (e) => {
        // Set the state of email mod to something here so email-body.js does the right thing.
        window.location.hash = `#page=crypto_page&subpage=${e.currentTarget.id}`
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
    // ###################### TODO ########################
    // put management of active-navigator-item into email hashchange event.
    Array.from(document.getElementsByClassName('email-navigator-item'))
      .forEach(item => item.addEventListener('click', (e) => {

        Array.from(document.getElementsByClassName('email-navigator-item'))
          .forEach(item2 => {
            if (item2.classList.contains("active-navigator-item")) {
              if (item2 != e.currentTarget) {
                item2.classList.remove("active-navigator-item");
                e.currentTarget.classList.add("active-navigator-item");
              }
            }
        });

        Array.from(document.getElementsByClassName('email-apps-item'))
          .forEach(item2 => {
            if (item2.classList.contains("active-navigator-item")) {
              if (item2 != e.currentTarget) {
                item2.classList.remove("active-navigator-item");
                e.currentTarget.classList.add("active-navigator-item");
                
              }
            }
        });
        window.location.hash = `#page=email_list&subpage=${e.currentTarget.id}`
      
    }));



    Array.from(document.getElementsByClassName('email-apps-item'))
      .forEach(item => item.addEventListener('click', (e) => {

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
        let modname = mods[e.currentTarget.id].name;
        window.location.hash = `#page=email_appspace&subpage=${modname}`
    }));
  }
}
