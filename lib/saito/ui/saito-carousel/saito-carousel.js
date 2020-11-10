const SaitoCarouselTemplate = require('./templates/saito-carousel.template');
const SaitoGameCarouselLeafTemplate = require('./templates/saito-sarousel-leaf.template');

class SaitoCarousel {

    constructor(app) {
      this.app = app;
    }

    // Carousel will be inserted into the dom as the first child of elem with 
    // id = "${type}-carousel". Modules that wish to be included in the carousel
    // should respondTo "${type}-carousel" with an object 
    // like "{title: ..., background: ...}". css should be placed at /${type}/carousel.css
    render(app, mod, type = "arcade") {
      console.log("redner")
      if (!document.getElementById("saito-carousel")) {
        app.browser.prependElementToDom(SaitoCarouselTemplate(type), document.getElementById("arcade-main"));
      }
      this.addLeaves(app, type);
    }

    attachEvents(app, mod) {
    }

    // addLeaf(el) {
    //   document.getElementById("saito-carousel-wrapper").appendChild(el);
    // }
    addLeaves(app, type = "arcade") {
      console.log("addLeaves")
      carouselElem = document.querySelector(".carousel-wrapper");
      carouselElem.innerHTML += "";
      app.modules.respondTo(type + "-carousel").forEach((mod, i) => {
        let response = mod.respondTo(type + "-carousel")
        if(response) {
          carouselElem.innerHTML += SaitoGameCarouselLeafTemplate(mod, response);
        }
      });
    }

}

module.exports = SaitoCarousel

