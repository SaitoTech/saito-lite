const SaitoCarouselTemplate = require('./templates/saito-carousel.template');
const SaitoGameCarouselLeafTemplate = require('./templates/saito-sarousel-leaf.template');

class SaitoCarousel {

    constructor(app) {
      this.app = app;
    }

    render(app, mod, type = "arcade-carousel") {
      console.log("redner")
      if (!document.getElementById("saito-carousel")) { app.browser.addElementToDom(SaitoCarouselTemplate()); }
      this.addLeaves(app, type);
    }

    attachEvents(app, mod) {
    }

    // addLeaf(el) {
    //   document.getElementById("saito-carousel-wrapper").appendChild(el);
    // }
    addLeaves(app, type = "arcade-carousel") {
      console.log("addLeaves")
      carouselElem = document.querySelector(".saito-carousel-wrapper");
      carouselElem.innerHTML += "";
      app.modules.respondTo(type).forEach((mod, i) => {
        let response = mod.respondTo(type)
        if(response) {
          carouselElem.innerHTML += SaitoGameCarouselLeafTemplate(mod, response);
        }
      });
    }

}

module.exports = SaitoCarousel

