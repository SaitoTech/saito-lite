const SaitoOverlayTemplate = require('./saito-overlay.template');

class SaitoOverlay {

    constructor(app) {
      this.app = app;
      this.closebox = true;
    }

    render(app, mod) {
      if (!document.querySelector(".saito-overlay-backdrop")) { app.browser.addElementToDom(SaitoOverlayTemplate(this.closebox)); }
    }

    attachEvents(app, saito_mod) {


    }

    showOverlay(app, saito_mod, html, mycallback=null) {

      this.render(app, saito_mod);

      let overlay_self = this;

      let overlay_el = document.querySelector(".saito-overlay");
      let overlay_backdrop_el = document.querySelector(".saito-overlay-backdrop");
      let closebox_el = document.querySelector(".saito-overlay-closebox");

      if (closebox_el) {
        overlay_el.innerHTML = closebox_el.outerHTML + html;
      } else {
        overlay_el.innerHTML = html;
      }

      overlay_el.style.display = "block";
      overlay_backdrop_el.style.display = "block";

      overlay_backdrop_el.onclick = (e) => {
        overlay_self.hideOverlay(mycallback);
      }
      closebox_el = document.querySelector(".saito-overlay-closebox");
      if (closebox_el) {
        closebox_el.style.display = "block";
        closebox_el.onclick = (e) => {
          this.hideOverlay(mycallback);
        }
      }

    }

    showOverlayBlocking(app, game_mod, html, mycallback=null) {
      this.showOverlay(app, game_mod, html, mycallback=null);
      let overlay_closebox_el = document.querySelector(".saito-overlay-closebox");
      overlay_closebox_el.style.display = "none";
    }



    hideOverlay(mycallback=null) {

      let overlay_el = document.querySelector(".saito-overlay");
      let overlay_backdrop_el = document.querySelector(".saito-overlay-backdrop");
      let closebox_el = document.querySelector(".saito-overlay-closebox");
      overlay_el.style.display = "none";
      overlay_backdrop_el.style.display = "none";
      if (closebox_el) { closebox_el.style.display = "none"; }

      if (mycallback != null) { mycallback(); }

    }
}

module.exports = SaitoOverlay

