const ArcadeMainTemplate = require('./arcade-main.template');

module.exports = ArcadeMain = {

  render(app, data) {

    if (!document.getElementById("arcade-container")) { app.browser.addElementToDom('<div id="arcade-container" class="arcade-container"></div>'); }
    if (!document.querySelector(".arcade-main")) { app.browser.addElementToDom(ArcadeMainTemplate(), "arcade-container"); }

  },


  attachEvents(app, data) {

  },
}
