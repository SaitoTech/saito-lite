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

      document.getElementById("game-observer-next-btn").onclick = (e) => {
	this.next(app, mod);
      };
    
      document.getElementById("game-observer-last-btn").onclick = (e) => {
	this.last(app, mod);
      };
    
    }


    next(app, mod) {

      let observer_self = this;
      let current_queue_hash = app.crypto.hash(JSON.stringify(mod.game.queue));

      //
      // unhalt the game
      //
      mod.game.halted = 0;
      mod.game.gaming_active = 0;
      mod.saveGame(mod.game.id);

      let arcade_mod = app.modules.returnModule("Arcade");
      if (arcade_mod == null) {
        alert("ERROR 413231: Arcade Module not Installed");
        return;
      }
      arcade_mod.observerDownloadNextMoves(mod, function(mod2) {
        mod = mod2;

	if (mod.game.future.length == 0) {
	  salert("No Moves Yet Available Beyond this Point");
	  observer_self.hideNextMoveButton();
	  return;
        }
	if (mod.game.queue.length > 0) {
	  if (mod.game.queue[mod.game.queue.length-1] === "OBSERVER_CHECKPOINT") {
	    mod.game.queue.splice(mod.game.queue.length-1, 1);
	  }
	}

	mod.runQueue();
        mod.processFutureMoves();

	if (mod.game.future.length == 0) {
          let revised_queue_hash = app.crypto.hash(JSON.stringify(mod.game.queue));
	  if (revised_queue_hash === current_queue_hash) {
	    salert("No Moves Yet Available Beyond this Point");
	    observer_self.hideNextMoveButton();
	    return;
          }
        }

      });
    }


    last(app, mod) {
      let arcade_mod = app.modules.returnModule("Arcade");
      if (arcade_mod == null) {
	alert("ERROR 413252: Arcade Module not Installed");
	return;
      }
      salert("Please wait while we move back one step...");
      arcade_mod.initializeObserverModePreviousStep(mod.game.id, mod.game.step.ts);
    }

    hideNextMoveButton() {
      document.getElementById("game-observer-next").style.display = "none";
    }

    showNextMoveButton() {
      document.getElementById("game-observer-next").style.display = "block";
    }

    hideLastMoveButton() {
      document.getElementById("game-observer-last").style.display = "none";
    }

    showLastMoveButton() {
      document.getElementById("game-observer-last").style.display = "block";
    }

}

module.exports = GameObserver


