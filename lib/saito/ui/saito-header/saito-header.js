const SaitoHeaderTemplate = require('./saito-header.template');

class SaitoHeader {

    constructor(app) {
      this.app = app;
    }

    render(app, mod) {
      if (!document.querySelector("#saito-header")) { app.browser.addElementToDom(SaitoHeaderTemplate()); }
    }

    attachEvents(app, game_mod) {
    }

}

module.exports = SaitoHeader

