const SaitoCarouselTemplate = require('./templates/saito-carousel.template.js');

module.exports = SaitoCarousel = {

  render(app, mod) {
    if (!document.getElementById("saito-carousel")) { app.browser.addElementToDom(SaitoCarouselTemplate(), id); }
  },

  attachEvents(app, data) {

  },

  addLeaf(el) {
    if (!document.getElementById("saito-carousel")) { app.browser.addElementToDom(SaitoCarouselTemplate()); }
    document.getElementById("saito-carousel").appendChild(el);
  }

}
