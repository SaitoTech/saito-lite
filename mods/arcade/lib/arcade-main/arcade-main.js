const ArcadeMainTemplate = require('./templates/arcade-main.template');
const ArcadePosts = require('./arcade-posts');
const ArcadeInfobox = require('./arcade-infobox');
const SaitoCarousel = require('../../../../lib/saito/ui/saito-carousel/saito-carousel');
const ArcadeGameDetails = require('./arcade-game-details');


module.exports = ArcadeMain = {

  render(app, mod, invites) {

    if (!document.getElementById("arcade-container")) { app.browser.addElementToDom('<div id="arcade-container" class="arcade-container"></div>'); }
    if (!document.querySelector(".arcade-main")) { app.browser.addElementToDom(ArcadeMainTemplate(app, mod, invites), "arcade-container"); }


    //
    // invite join buttons
    //
    invites.forEach((invite, i) => {
      document.querySelector(`#invite-${invite.transaction.sig} .invite-tile-join-button`).onclick = () => {
	ArcadeGameDetails.render(app, mod, invite);
	ArcadeGameDetails.attachEvents(app, mod);
      }
    });
    
    ArcadePosts.render(app, mod);
    ArcadeInfobox.render(app, mod);
    let carousel = new SaitoCarousel(app);
    carousel.render(app, mod);

  },

  attachEvents(app, mod) {
    
  },
}
