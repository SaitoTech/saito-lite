const GameObserverTemplate = require('./game-observer.template');

class GameObserver {

    constructor(app) {
      this.app 			= app;
    }


    render(app, game_mod) {

      this.game_mod = game_mod;

      if (!document.getElementById("game-observer-next")) {
        app.browser.addElementToDom(GameObserverTemplate());
      }

    }



    attachEvents(app, mod) {

      document.getElementById("game-observer-next").onclick = (e) => {
	this.last(app, mod);
      };
    
      document.getElementById("game-observer-last").onclick = (e) => {
	this.next(app, mod);
      };
    
    }


    next(app, mod) {
      if (mod.game.future.length > 0) {
	let arcade_mod = app.modules.returnModule("Arcade");
        if (arcade_mod == null) {
	  alert("ERROR 413231: Arcade Module not Installed");
	  return;
        }
        arcade_self.observerDownloadNextMoves(mod, function() {
console.log("out of download next moves and into processFutureMoves!");
          mod.processFutureMoves();
	});
      } else {
	alert("No Future Moves Left...");
      }
    }


    last(app, mod) {
      alert("Loading Previous Game Step");
    }

}

module.exports = GameObserver


