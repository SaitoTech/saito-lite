const GameCardboxTemplate = require('./game-cardbox.template');

class GameCardbox {

    constructor(app, height=480, width=640) {
      this.app 			= app;
      this.height 		= height;
      this.width 		= width;
      this.cardbox_lock 	= 0;     // 1 = mouseover does not remove popup
      this.skip_card_prompt 	= 0; // 1 = don't prompt for action, just execute
      this.card_types		= []; // associative array of css / text / callback
      this.game_mod 		= null;
      this.card_types.push({
	css 	: 	"showcard" ,
	action 	: 	"play" ,
	mycallback:	function() {
	  alert("clicked!");
	}
      });

    }

    render(app, game_mod) {

      this.game_mod = game_mod;

      if (!document.getElementById("cardbox-card")) {
	document.getElementById("hud-cardbox").innerHTML += GameCardboxTemplate();
      }

    }



    attachEvents(app, game_mod) {

      for (let i = 0; i < this.card_types.length; i++) {
	let card_css      = this.card_types[i].css;
	let card_action   = this.card_types[i].action;
	let card_callback = this.card_types[i].mycallback;
        Array.from(document.getElementsByClassName(card_css)).forEach(card => {
          card.onmouseover = (e) => {
	    if (this.cardbox_lock == 1) { return; }
	    this.showCardbox(e.currentTarget.id);
          };
          card.onmouseout = (e) => {
	    this.hideCardbox();
          };
          card.onclick = (e) => {
	    this.cardbox_lock = 1;
	    if (card_action != "" && card_callback != null) {
	      this.showCardbox(e.currentTarget.id, card_action, card_callback);
	    } else {
	      this.showCardbox(e.currentTarget.id);
	    }
          };
        });
      }
      //
      // force-close card popup
      //
      let cardbox_exit_btn = document.getElementById("cardbox-exit");
      cardbox_exit_btn.onclick = (e) => {
	this.hideCardbox(1);
      };
    
    }


    
    showCardbox(card, action="", mycallback=null) {
      document.getElementById("cardbox-card").innerHTML = this.game_mod.returnCardImage(card);
      if (this.skip_card_prompt == 1 && mycallback != null) {
	mycallback(card);
	return;
      }
      if (action != "") {
	this.cardbox_lock = 1;
        document.getElementById("cardbox-menu").style.display = "block";
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
      document.getElementById("cardbox-menu").style.display = "none";
      document.getElementById("cardbox-exit").style.display = "none";
      document.getElementById("cardbox-exit-background").style.display = "none";
      this.cardbox_lock = 0;
    }

}

module.exports = GameCardbox


