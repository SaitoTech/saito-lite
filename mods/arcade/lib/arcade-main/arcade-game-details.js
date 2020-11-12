const ArcadeGameDetailsTemplate = require('./templates/arcade-game-details.template');


module.exports = ArcadeGameDetails = {

  render(app, mod, invite) {

   app.browser.addElementToDom(`<div id="background-shim" class="background-shim" style="background-image: url('/poker/img/arcade.jpg');"></div>`); 
   mod.overlay.showOverlay(app, mod, ArcadeGameDetailsTemplate(app, mod, invite));
  },


  attachEvents(app, mod) {

  },
}
