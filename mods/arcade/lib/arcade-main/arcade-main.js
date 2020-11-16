const ArcadeMainTemplate = require('./templates/arcade-main.template');
const ArcadePosts = require('./arcade-posts');
const ArcadeInfobox = require('./arcade-infobox');
const SaitoCarousel = require('../../../../lib/saito/ui/saito-carousel/saito-carousel');
const ArcadeGameDetailsOverlay = require('../arcade-game-details-overlay/arcade-game-details-overlay');

let tabNames = ["arcade", "observables", "tournaments"];
module.exports = ArcadeMain = {
  initialize(app, mod) {
    ArcadeGameDetailsOverlay.initialize(app, mod);
  },
  render(app, mod) {
    // Sort mod.games in-place to put "my invites" at the top, i.e. any games that the player is in.
    // Sort by looping through games and swapping with the "next" game if the 
    let whereTo = 0;
    for (let i = 0; i < mod.games.length; i++) {
      if (mod.isMyGame(mod.games[i], app)) {
        mod.games[i].isMine = true;
        let replacedGame = mod.games[whereTo];
        mod.games[whereTo] = mod.games[i];
        mod.games[i] = replacedGame;
        whereTo++;
      } else {
        mod.games[i].isMine = false;
      }
    }

    if (!document.getElementById("arcade-container")) { app.browser.addElementToDom('<div id="arcade-container" class="arcade-container"></div>'); }
    if (!document.querySelector(".arcade-main")) { app.browser.addElementToDom(ArcadeMainTemplate(app, mod), "arcade-container"); }

    tabNames.forEach((tabButtonName, i) => {
      document.querySelector("#tab-button-" + tabButtonName).onclick = () => {
        tabNames.forEach((tabName, i) => {
          if (tabName === tabButtonName) {
            document.querySelector("#" + tabName + "-hero").classList.remove("arcade-tab-hidden");
            document.querySelector("#tab-button-" + tabName).classList.add("active-tab-button");
          } else {
            document.querySelector("#" + tabName + "-hero").classList.add("arcade-tab-hidden");
            document.querySelector("#tab-button-" + tabName).classList.remove("active-tab-button");
          }
        });
      }
    });

    //add invites to arcade-hero section
    if (document.querySelector('.arcade-hero')) {
      mod.games.forEach((invite, i) => {
        app.browser.addElementToElement(ArcadeInviteTemplate(app, mod, invite, i), document.querySelector('.arcade-hero'));
      });
      //add the count of games to the box to let the grid know what to render;
      document.querySelector('.arcade-hero').classList.add("of_"+mod.games.length);
    }

    //
    // invite join buttons
    //
    mod.games.forEach((invite, i) => {
      let onclickCallback = () => {
        ArcadeGameDetailsOverlay.render(app, mod, invite);
      }
      document.querySelector(`#invite-${invite.transaction.sig} .invite-tile-join-button`).onclick = onclickCallback;
      document.querySelector(`#invite-${invite.transaction.sig} .invite-tile-play-button`).onclick = onclickCallback;
      //document.querySelector(`#invite-${invite.transaction.sig} .fa-sign-in-alt`).onclick = onclickCallback;
    });

    ArcadePosts.render(app, mod);
    ArcadeInfobox.render(app, mod);
    if (mod.games.length == 0){
      let carousel = new SaitoCarousel(app);
      carousel.render(app, mod, "arcade", "arcade-hero");  
    }
  },

  attachEvents(app, mod) {

  },
}
