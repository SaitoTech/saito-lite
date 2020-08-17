const GameCardboxTemplate = require('./game-cardbox.template');

class GameCardbox {

    constructor(app, height=480, width=640) {
      this.app = app;
      this.height = height;
      this.width = width;
      this.cardbox_lock = 0;     // 1 = mouseover does not remove popup
      this.skip_card_prompt = 0; // 1 = don't prompt for action, just execute
    }

    render(app, game_mod) {

      if (!document.getElementById("cardbox-card")) {
	document.getElementById("hud-cardbox").innerHTML += GameCardboxTemplate();
      }

    }



    attachEvents(app, game_mod) {

      //
      // 
      //
      Array.from(document.getElementsByClassName('showcard')).forEach(card => {
        card.onmouseover = (e) => {
	  if (this.cardbox_lock == 1) { return; }
	  document.getElementById("cardbox-card").innerHTML = game_mod.returnCardImage(e.currentTarget.id);
	  this.showCardbox();
        };
        card.onmouseout = (e) => {
	  this.hideCardbox();
        };
        card.onclick = (e) => {
	  this.cardbox_lock = 1;
	  this.showCardbox();
        };
      });

      //
      // force-close card popup
      //
      let cardbox_exit_btn = document.getElementById("cardbox-exit");
      cardbox_exit_btn.onclick = (e) => {
	this.hideCardbox(1);
      };

    }


    
    showCardbox(action="", mycallback=null) {
      if (this.skip_card_prompt == 1 && mycallback != null) {
	mycallback();
	return;
      }
      if (action != "") {
	this.cardbox_lock = 1;
        document.getElementById("cardbox-menu").innerHTML = action;
        document.getElementById("cardbox-menu").onclick = (e) => {
	  if (mycallback != null) { mycallback(); }
	  this.hideCardbox(1);
	}
        document.getElementById("cardbox-exit").style.display = "block";
      }
      if (this.cardbox_lock == 1) {
        document.getElementById("cardbox-exit").style.display = "block";
        document.getElementById("cardbox-exit-background").style.display = "block";
      }
      document.getElementById("hud-cardbox").style.display = "block";
      document.getElementById("cardbox-card").style.display = "block";
    }
    hideCardbox(force=0) {
      if (this.cardbox_lock == 1 && force == 0) { return; }
      document.getElementById("hud-cardbox").style.display = "none";
      document.getElementById("cardbox-card").style.display = "none";
      document.getElementById("cardbox-exit").style.display = "none";
      document.getElementById("cardbox-exit-background").style.display = "none";
      this.cardbox_lock = 0;
    }

}

module.exports = GameCardbox


