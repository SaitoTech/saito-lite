const saito = require('./../../../../lib/saito/saito');
const ArcadeSidebarTemplate = require('./arcade-sidebar.template');
const ArcadeGamesFullListOverlayTemplate = require('./arcade-games-full-list-overlay.template');
const SaitoOverlay = require('./../../../../lib/saito/ui/saito-overlay/saito-overlay');
const ModalRegisterUsername = require('./../../../../lib/saito/ui/modal-register-username/modal-register-username');
const ArcadeGameDetails = require('../arcade-game/arcade-game-details');
const ArcadeContainerTemplate = require('../arcade-main/templates/arcade-container.template');
module.exports = ArcadeSidebar = {


  render(app, mod) {

    if (!document.getElementById("arcade-container")) { app.browser.addElementToDom(ArcadeContainerTemplate()); }
    if (!document.querySelector(".arcade-sidebar")) { app.browser.addElementToDom(ArcadeSidebarTemplate(), "arcade-container"); }

    app.modules.respondTo("email-chat").forEach(module => {
      if (module != null) {
        module.respondTo('email-chat').render(app, module);
      }
    });

    // let arcade_sidebar_apps_loaded = 0;
    // app.modules.respondTo("arcade-sidebar").forEach(module => {
    //   if (module != null) {
    //     module.respondTo('arcade-sidebar').render(app, module);
    //     arcade_sidebar_apps_loaded = 1;
    //   }
    // });
    // if (arcade_sidebar_apps_loaded == 0) {
    //   document.getElementById("arcade-sidebar-apps").style.display = "none";
    // }

    let games_menu = document.querySelector(".arcade-apps");
    app.modules.respondTo("arcade-games").forEach(module => {
      let title = module.name;
      try {
        if (module.gamename) { title = module.gamename; }
      } catch (err) {}
      let status = "";
      try {
        if (module.status) {status = '<div class="tiptext">This game is: ' + module.status + '.</div>';}
      } catch (err) {}

      if (!document.getElementById(module.name)) {
        games_menu.innerHTML += `<li class="arcade-navigator-item tip" id="${module.name}">${title}${status}</li>`;
      }
    });
  },

  
  attachEvents(app, mod) {

    if (!document.getElementById("games-add-game")) { return; }

    if (app.modules.returnModule("AppStore") != null) {
      document.getElementById("games-add-game").onclick = () => {
        let appstore_mod = app.modules.returnModule("AppStore");
        if (appstore_mod) {
          let options = { search : "" , category : "Entertainment" , featured : 1 };
          appstore_mod.openAppstoreOverlay(options);
        }
      };
    }
    Array.from(document.getElementsByClassName('arcade-navigator-item')).forEach(game => {
      game.addEventListener('click', (e) => {
        let gameName = e.currentTarget.id;
        app.browser.logMatomoEvent("Arcade", "ArcadeSidebarInviteCreateClick", gameName);
        let doGameDetails = () => {
          let tx = new saito.transaction();
          tx.msg.game = gameName;
          ArcadeGameDetails.render(app, mod, tx);
          ArcadeGameDetails.attachEvents(app, mod, tx);
        }
        //
        // not registered
        //
        if (app.keys.returnIdentifierByPublicKey(app.wallet.returnPublicKey()) == "") {
          if (app.options.wallet.anonymous != 1) {
            mod.modal_register_username = new ModalRegisterUsername(app, doGameDetails);
            mod.modal_register_username.render(app, mod);
            mod.modal_register_username.attachEvents(app, mod);
            return;
          }
        }
        doGameDetails();
      });
    });


    app.modules.respondTo("email-chat").forEach(module => {
      module.respondTo('email-chat').attachEvents(app, mod);
    });

  }

}



