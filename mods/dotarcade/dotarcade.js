const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const SaitoOverlay = require('../../lib/saito/ui/saito-overlay/saito-overlay');
const SaitoHeader = require('../../lib/saito/ui/saito-header/saito-header');

class DotArcade extends ModTemplate {

  constructor(app) {

    super(app);

    this.name = "DotArcade";
    this.description = "Default Dot Support in Saito Arcade";
    this.categories = "Entertainment Polkadort";

    this.icon_fa = "fas fa-gamepad";

    this.header = null;
    this.overlay = null;
    
  }
  
  initialize(app) {
    super.initialize(app);
  }

  initializeHTML(app) {

    /* SETUP HEADER */
    if (this.header == null) {
      this.header = new SaitoHeader(app, this);
    }

    this.header.render(app, this);
    this.header.attachEvents(app, this);

    if (document.querySelector('.header-icon-links')) {
      app.browser.prependElementToDom(document.querySelector("#header-icon-links-hidden").innerHTML, document.querySelector('.header-icon-links'));
    }
    if (document.querySelector('.header-dropdown')) {
      app.browser.prependElementToDom(document.querySelector("#header-dropdown-hidden").innerHTML, document.querySelector('.header-dropdown'));
    }


    /* PAGE CONTENT */
    const jssource = "http://localhost:12101/saito/dotsaito.js";
    let data = null;

    ////////////////////////////
    // read from localStorage //
    ////////////////////////////
    if (typeof(Storage) !== "undefined") {
      data = localStorage.getItem("options");
      data = JSON.parse(data);
    }

    if (data != null) {
      if (data.bundle != jssource) {
        // STEP 1
        document.getElementById("step-1").style.display = "block";
        document.getElementById("confirm-replace-wallet").onclick = e => {
          // update wallet
          fetch('/options')
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }

            // update SAITO with our bundle
            data.bundle = jssource;

            // save in localstorage
            localStorage.setItem("options", JSON.stringify(data));

            // and refresh
            window.location.reload();
          })
          .catch(err => console.error("ERROR loading options file from server"));
        }
      } else {
        // STEP 2
        document.getElementById("step-2").style.display = "block";

        // load wallet to the links
        // console.log(app);

      }
    }

  }

}

module.exports = DotArcade;

