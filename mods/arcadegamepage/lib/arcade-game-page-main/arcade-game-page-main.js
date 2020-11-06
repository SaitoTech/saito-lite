// const ModTemplate = require('../../lib/templates/modtemplate');
const ArcadeGamePageMainTemplate = require('./templates/arcade-game-page-main.template');
module.exports = ArcadeGamePageMain = {

  render(app, mod) {
    if (document.querySelector("#arcade-container")) { app.browser.addElementToDom(ArcadeGamePageMainTemplate(), "arcade-container"); }
    
  },

  attachEvents(app, mod) {

  },
}
