const SaitoCarouselTemplate = require('./templates/saito-carousel.template');
const SaitoGameCarouselLeafTemplate = require('./templates/saito-sarousel-leaf.template');

//TODO: Break out general carousel css(e.g. animations) from specific stuff in /arcade/carousel.css
class SaitoCarousel {

    constructor(app) {
      this.app = app;
    }

    // Carousel will be inserted into the dom as the first child of elem with 
    // id = id. Modules that wish to be included in the carousel should
    // respondTo "${type}-carousel" with an object like 
    // "{title: ..., background: ...}". css should be placed at /${type}/carousel.css
    render(app, mod, type = "arcade", id) {
      if (!document.getElementById("saito-carousel")) {
        app.browser.prependElementToDom(SaitoCarouselTemplate(), document.getElementById(id));
      }
      this.addLeaves(app, type);
      
      document.querySelector("#saito-carousel").onclick = () => {
        app.browser.logMatomoEvent("UXError", "ArcadeUXError", "CarouselClickAttempt");
      }
    }

    attachEvents(app, mod) {
      
    }

    addLeaves(app, type = "arcade") {
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

