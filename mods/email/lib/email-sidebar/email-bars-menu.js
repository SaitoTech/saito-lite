const EmailBarsMenuTemplate = require('./email-bars-menu.template');

module.exports = EmailBarsMenu = {

  render(app, mod) {

    document.querySelector('.email-bars-menu').innerHTML = EmailBarsMenuTemplate();

    let email_apps = document.querySelector(".email-apps");
    let mods = app.modules.respondTo("email-appspace");
    for (let i = 0; i < mods.length; i++) {
      let module = mods[i];
      if (module.name === "MyQRCode") {
        email_apps.innerHTML += `<li class="email-apps-item email-apps-item-${i}" style="display:none" id="email-nav-${module.name}">${module.name}</li>`;
      } else {
        email_apps.innerHTML += `<li class="email-apps-item email-apps-item-${i}" id="email-nav-${module.name}">${module.name}</li>`;
      }
    }

    app.wallet.returnActivatedCryptos().forEach(async(responseInterface, i) => {
      if (responseInterface.name !== "Saito") {
        app.browser.addElementToDom(`<li id="email-nav-${responseInterface.name}" class="crypto-apps-item">
          ${responseInterface.ticker}
        </li>`, "crypto-apps");
      }
    });

    // copy the content of .email-bars-menu into #mobile.email-bars-menu
    // ############### TODO #############
    // Do this with CSS and remove all the relevant javacsript.
    if(!document.querySelector('#mobile.email-bars-menu')) {
      let emailBarsMenuInnerHTML = document.querySelector('.email-bars-menu').innerHTML;
      // fix the IDs on the elements...
      // These IDs are also present but I guess they serve no functional purpose:
      // email-nav-inbox email-nav-sent email-nav-trash email-apps crypto-apps
      emailBarsMenuInnerHTML = emailBarsMenuInnerHTML.replaceAll("email-nav-", "mobile-email-nav-");

      app.browser.addElementToDom(`<div id="mobile" class="email-bars-menu" style="display:none;">
        <button class="super" id="mobile-email-compose-btn">SEND</button>
        ${emailBarsMenuInnerHTML}
      </div>`)
    }

  },
  attachEvents(app, mod) {
    // attach events to cyrpto mod buttons
    document.querySelectorAll('.crypto-apps-item').forEach((cryptoAppButton, i) => {
      cryptoAppButton.onclick = (e) => {
        // Set the state of email mod to something here so email-body.js does the right thing.
        let subPage = e.currentTarget.id.replace('email-nav-','').replace('mobile-','');
        window.location.hash = mod.goToLocation(`#page=crypto_page&subpage=${subPage}`);
      }
    });
    document.querySelectorAll('.email-navigator-item').forEach((item) => {
      item.onclick = (e) => {
        let subPage = e.currentTarget.id.replace('email-nav-','').replace('mobile-','');
        window.location.hash = mod.goToLocation(`#page=email_list&subpage=${subPage}`);
      }
    });

    document.querySelectorAll('.email-apps-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        let subPage = e.currentTarget.id.replace('email-nav-','').replace('mobile-','');
        window.location.hash = mod.goToLocation(`#page=email_appspace&subpage=${subPage}`);
      });
    });

    // Hide the menu bar if user clicks off of it or on a button in it
    let email_bars_menu = document.querySelector('#mobile.email-bars-menu');
    let emailSidebarHideCallback = () => {
        email_bars_menu.style.display = "none";
    }
    email_bars_menu.removeEventListener('click', emailSidebarHideCallback);
    email_bars_menu.addEventListener('click', emailSidebarHideCallback);
    let emailSidebarHideCallbackGlobal = (e) => {
        if (e.target.id !== "email-bars-icon") {
            email_bars_menu.style.display = "none";
        }
    }
    window.removeEventListener('click', emailSidebarHideCallbackGlobal);
    window.addEventListener('click', emailSidebarHideCallbackGlobal);
  }
}
