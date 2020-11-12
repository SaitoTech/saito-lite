const ArcadeMainTemplate = require('./templates/arcade-main.template');
const ArcadePosts = require('./arcade-posts');
const ArcadeInfobox = require('./arcade-infobox');
const SaitoCarousel = require('../../../../lib/saito/ui/saito-carousel/saito-carousel');
const ArcadeGameViewTemplate = require('./templates/arcade-game-view.template');

module.exports = ArcadeMain = {

  render(app, mod, invites) {

    if (!document.getElementById("arcade-container")) { app.browser.addElementToDom('<div id="arcade-container" class="arcade-container"></div>'); }
    if (!document.querySelector(".arcade-main")) { app.browser.addElementToDom(ArcadeMainTemplate(app, mod, invites), "arcade-container"); }
    invites.forEach((invite, i) => {
      document.querySelector(`#invite-${invite.transaction.sig} .invite-tile-join-button`).onclick = () => {
        mod.overlay.showOverlay(app, mod, ArcadeGameViewTemplate(app, mod, invite));
        document.querySelector(".game-invite-btn").onclick = () => {
          // TODO: Join game here~~~
          console.log("Join game here")
        }
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
