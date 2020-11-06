const ArcadeInfoboxTemplate = require('./templates/arcade-infobox.template');

module.exports = ArcadeInfobox = {

  render(app, mod) {

    if (!document.querySelector(".arcade-infobox")) { app.browser.addElementToDom(ArcadeInfoboxTemplate(), "arcade-sub"); }

  },


  attachEvents(app, mod) {

  },
}
