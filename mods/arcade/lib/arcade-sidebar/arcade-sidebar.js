const ArcadeSidebarTemplate = require('./arcade-sidebar.template');
const ArcadeGamesFullListOverlayTemplate = require('./arcade-games-full-list-overlay.template');
const GameOverlay = require('./../../../../lib/saito/ui/game-overlay/game-overlay');
const ArcadeCreateGameOverlay = require('../arcade-create-game-overlay/arcade-create-game-overlay');

module.exports = ArcadeSidebar = {
  initialize(app, mod) {
    ArcadeCreateGameOverlay.initialize(app, mod);
  },
  
  render(app, mod) {

    if (!document.getElementById("arcade-container")) { app.browser.addElementToDom('<div id="arcade-container" class="arcade-container"></div>'); }
    if (!document.querySelector(".arcade-sidebar")) { app.browser.addElementToDom(ArcadeSidebarTemplate(), "arcade-container"); }

    app.modules.respondTo("email-chat").forEach(module => {
      if (module != null) { 
        module.respondTo('email-chat').render(app, module);
      }
    });
    
    let games_menu = document.querySelector(".arcade-apps");
    let gamesMenuHtml = "";
    if (games_menu) {
      // draw 
      games_menu.innerHTML = "";
      app.modules.requestInterfaces("arcade-sidebar").forEach(sidebar => {
        gamesMenuHtml += `<li class="arcade-navigator-item" id="arcade-sidebar-item-${sidebar.modname}">${sidebar.title}</li>`;
      });
      games_menu.innerHTML = gamesMenuHtml;
      // attach callbacks
      app.modules.requestInterfaces("arcade-create-game").forEach(gameCreator => {
        document.getElementById(`arcade-sidebar-item-${gameCreator.modname}`).onclick = () => {
          ArcadeCreateGameOverlay.render(app, mod, gameCreator);
        }
      });
    }

    // appears to be unused legacy code????
    //
    //   let arcade_sidebar_apps_loaded = 0;
    //   app.modules.respondTo("arcade-sidebar").forEach(module => {
    //     if (module != null) { 
  	// module.respondTo('arcade-sidebar').render(app, module);
    //       arcade_sidebar_apps_loaded = 1;
    //     }
    //   });
    // if (arcade_sidebar_apps_loaded == 0) {
    //   document.getElementById("arcade-sidebar-apps").style.display = "none";
    // }
    
    
    
    
    // let games_menu = document.querySelector(".arcade-apps");
    // app.modules.respondTo("arcade-games").forEach(module => {
    //   let title = mod.name;
    //   if (!document.getElementById(module.name)) {
    //     if (module.respondTo("arcade-carousel") != null) {
    //       if (module.respondTo("arcade-carousel").title) {
    //         title = module.respondTo("arcade-carousel").title;
    //       }
    //     }
    //     games_menu.innerHTML += `<li class="arcade-navigator-item" id="${module.name}">${title}</li>`;
    //   }
    // });
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


/**
    document.getElementById("games-add-game").onclick = () => {
      mod.overlay.showOverlay(app, mod, ArcadeGamesFullListOverlayTemplate(app, mod));
//      mod.overlay.showOverlay(app, mod, 'Add or Install New Games');
    };
**/

    app.modules.respondTo("email-chat").forEach(module => {
      module.respondTo('email-chat').attachEvents(app, mod);
    });

  }

}



