const SaitoCarouselTemplate = require('./templates/saito-carousel.template');

class SaitoCarousel {

    constructor(app) {
      this.app = app;
      this.id = "";
    }

    render(app, mod, id="") {
      this.id = id;
      if (!document.getElementById("saito-carousel")) { app.browser.addElementToDom(SaitoCarouselTemplate(), id); }
    }

    attachEvents(app, mod) {
    }

    addLeaf(el) {
      document.getElementById("saito-carousel-wrapper").appendChild(el);
    }

}

module.exports = SaitoCarousel

