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
	this.next(app, mod);
      };
    
      document.getElementById("game-observer-last").onclick = (e) => {
	this.last(app, mod);
      };
    
    }


    next(app, mod) {
      //
      // unhalt the game
      //
      mod.game.halted = 0;
      mod.game.gaming_active = 0;
      mod.saveGame(mod.game.id);

      if (mod.game.future.length > 0) {
	let arcade_mod = app.modules.returnModule("Arcade");
        if (arcade_mod == null) {
	  alert("ERROR 413231: Arcade Module not Installed");
	  return;
        }
        arcade_mod.observerDownloadNextMoves(mod, function() {
	  if (mod.game.future.length == 0) {
	    salert("No Moves Yet Available Beyond this Point");
          }
	  if (mod.game.queue.length > 0) {
	    if (mod.game.queue[mod.game.queue.length-1] === "OBSERVER_CHECKPOINT") {
	      mod.game.queue.splice(mod.game.queue.length-1, 1);
	    }
	  }
	  mod.runQueue();
          mod.processFutureMoves();
	});
      } else {
	let arcade_mod = app.modules.returnModule("Arcade");
        if (arcade_mod == null) {
	  alert("ERROR 413231: Arcade Module not Installed");
	  return;
        }
        arcade_mod.observerDownloadNextMoves(mod, function() {
	  if (mod.game.future.length == 0) {
	    salert("No Moves Yet Available Beyond this Point");
          }
	  if (mod.game.queue.length > 0) {
	    if (mod.game.queue[mod.game.queue.length-1] === "OBSERVER_CHECKPOINT") {
	      mod.game.queue.splice(mod.game.queue.length-1, 1);
	    }
	  }
	  mod.runQueue();
          mod.processFutureMoves();
	});
      }
    }


    last(app, mod) {
      let arcade_mod = app.modules.returnModule("Arcade");
      if (arcade_mod == null) {
	alert("ERROR 413252: Arcade Module not Installed");
	return;
      }
      salert("Please wait while we move back on step...");
      arcade_mod.initializeObserverModePreviousStep(mod.game.id, mod.game.step.ts);
    }

}

module.exports = GameObserver


