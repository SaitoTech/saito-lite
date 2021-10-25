const GameCardboxTemplate = require('./game-cardbox.template');

class GameCardbox {

    constructor(app, height=480, width=640) {
      this.app 			= app;
      this.height 		= height;
      this.width 		= width;
      this.cards		= [];
      this.cardfan 		= 0; // obsolete
      this.cardbox_lock 	= 0;     // 1 = mouseover does not remove popup
      this.skip_card_prompt 	= 0; // 1 = don't prompt for action, just execute
      this.card_types		= []; // associative array of css / text / callback
      this.game_mod 		= null;
    }


    render(app, game_mod) {

      this.game_mod = game_mod;

      if (!document.getElementById("game-cardbox")) {
        app.browser.addElementToDom(GameCardboxTemplate());
	// push behind all
        document.getElementById("game-cardbox").style.zindex = -10; //push behind 
      }

    }

    attachEvents(app, game_mod) {

    }

    attachCardEvents(app, game_mod) {

      try {

      for (let i = 0; i < this.card_types.length; i++) {
	let card_css      = this.card_types[i].css;
	let card_action   = this.card_types[i].action;
	let card_callback = this.card_types[i].mycallback;
        Array.from(document.getElementsByClassName(card_css)).forEach(card => {
          card.onmouseover = (e) => {
	    try {
	      if (this.cardbox_lock == 1) { 
	        return;
	      }
	      this.showCardbox(e.currentTarget.id);
	    } catch (err) {}
          };
          card.onmouseout = (e) => {
	    try {
	      this.hideCardbox();
	    } catch (err) {}
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
    
      } catch (err) {
      }

    }


    showCardboxHTML(card, html, action="", mycallback=null) {

      // non-graphical cards trigger automatically
      if (html == "" || html == null || html.indexOf("noncard") > -1 || html.indexOf("nocard") > -1) { 
	if (mycallback != null) { mycallback(card); this.hideCardbox(1); }
        return;
      }

      // otherwise we handle the card individually
      if (this.cardfan == 0) {
	// replace the card
        document.getElementById("cardbox-card").innerHTML = html;
      } else {
	html = "";
        for (let i = 0; i < this.cards.length; i++) {
          html += this.game_mod.returnCardImage(this.cards[i], action, mycallback);
	}
        document.getElementById("cardbox-card").innerHTML = html;
      }

      // hide cardbox AFTER callback so cards available in game callback
      if (this.skip_card_prompt == 1 && mycallback != null) {
	mycallback(card);
        this.hideCardbox(1);
	return;
      }
      if (action != "") {
	this.cardbox_lock = 1;
        document.getElementById("cardbox-menu").style.display = "block";
        document.getElementById("cardbox-menu").innerHTML = action;
        document.getElementById("cardbox-menu").onclick = (e) => {
	  if (mycallback != null) {
	    mycallback(card);
	  }
	  this.hideCardbox(1);
	}
        document.getElementById("cardbox-exit").style.display = "block";
      }
      if (this.cardbox_lock == 1) {
        document.getElementById("cardbox-exit").style.display = "block";
        document.getElementById("cardbox-exit-background").style.display = "block";
      }
      document.getElementById("game-cardbox").style.zIndex = 250;
      document.getElementById("game-cardbox").style.display = "block";
      document.getElementById("cardbox-card").style.display = "block";
    }
    showCardbox(card, action="", mycallback=null) {

      if (card == "undefined" || card == "") { return; }

      // this.cardfan = 1
      if (!this.cards.includes(card)) {
        this.cards.push(card);
      }
      // card and returnCardImage(card) only used in this.cardfan=0 mode
      this.showCardboxHTML(card, this.game_mod.returnCardImage(card), action, mycallback);
    }
    hideCardbox(force=0) {
      try {
        if (this.cardbox_lock == 1 && force == 0) { return; }
        this.cards = [];
        document.getElementById("game-cardbox").style.zindex = -10; //push behind 
        document.getElementById("game-cardbox").style.display = "none";
        document.getElementById("cardbox-card").style.display = "none";
        document.getElementById("cardbox-menu").style.display = "none";
        document.getElementById("cardbox-exit").style.display = "none";
        document.getElementById("cardbox-exit-background").style.display = "none";
        this.cardbox_lock = 0;
        document.getElementById("game-cardbox").style.zIndex = -1;
      } catch (err) {}
    }



    addCardType(css_name, action_text, mycallback) { 

      for (let i = 0; i < this.card_types.length; i++) {
	if (this.card_types[i].css === css_name) { return; }
      }

      this.card_types.push({
        css     :       css_name ,
        action  :       action_text ,
        mycallback:     mycallback 
      });

    }

}

module.exports = GameCardbox


