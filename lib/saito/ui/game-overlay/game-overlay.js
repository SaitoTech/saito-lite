const GameOverlayTemplate = require('./game-overlay.template');

class GameOverlay {

    constructor(app) {
      this.app = app;
    }

    render(app, mod) {
      if (!document.querySelector(".game-overlay-backdrop")) { app.browser.addElementToDom(GameOverlayTemplate()); }
    }

    attachEvents(app, game_mod) {
    }

    showOverlay(app, game_mod, html, mycallback=null) {

console.log("app is here: "+app.crypto.hash(html));

      this.render(app, game_mod);

      let overlay_self = this;

      let overlay_el = document.querySelector(".game-overlay");
      let overlay_backdrop_el = document.querySelector(".game-overlay-backdrop");
      overlay_el.innerHTML = html;
      overlay_el.style.display = "block";
      overlay_backdrop_el.style.display = "block";

      overlay_backdrop_el.onclick = (e) => {
        overlay_self.hideOverlay(mycallback);
      }

    }

    showOverlayBlocking(app, game_mod, html, mycallback=null) {
      this.showOverlay(app, game_mod, html, mycallback=null);
      let overlay_backdrop_el = document.querySelector(".game-overlay-backdrop");
      overlay_backdrop_el.onclick = (e) => {};
    }

    hideOverlay(mycallback=null) {

      let overlay_el = document.querySelector(".game-overlay");
      let overlay_backdrop_el = document.querySelector(".game-overlay-backdrop");
      overlay_el.style.display = "none";
      overlay_backdrop_el.style.display = "none";

      if (mycallback != null) { mycallback(); }

    }
}

module.exports = GameOverlay

