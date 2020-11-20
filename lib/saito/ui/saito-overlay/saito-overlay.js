const SaitoOverlayTemplate = require('./saito-overlay.template');

class SaitoOverlay {

    constructor(app) {
      this.app = app;
    }

    render(app, mod) {
      if (!document.querySelector(".saito-overlay-backdrop")) { app.browser.addElementToDom(SaitoOverlayTemplate()); }
    }

    attachEvents(app, saito_mod) {
    }

    showOverlay(app, saito_mod, html, mycallback=null) {

      this.render(app, saito_mod);

      let overlay_self = this;

      let overlay_el = document.querySelector(".saito-overlay");
      let overlay_backdrop_el = document.querySelector(".saito-overlay-backdrop");
      overlay_el.innerHTML = html;
      overlay_el.style.display = "block";
      overlay_backdrop_el.style.display = "block";

      overlay_backdrop_el.onclick = (e) => {
        overlay_self.hideOverlay(mycallback);
      }

    }

    hideOverlay(mycallback=null) {

      let overlay_el = document.querySelector(".saito-overlay");
      let overlay_backdrop_el = document.querySelector(".saito-overlay-backdrop");
      overlay_el.style.display = "none";
      overlay_backdrop_el.style.display = "none";

      if (mycallback != null) { mycallback(); }

    }
}

module.exports = SaitoOverlay

