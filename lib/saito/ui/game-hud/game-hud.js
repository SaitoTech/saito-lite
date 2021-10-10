const GameHudTemplate = require('./game-hud.template');
const dragElement = require('../../../helpers/drag_element');

const { DESKTOP, MOBILE_PORTRAIT, MOBILE_LANDSCAPE } = require('./game-hud-types');

class GameHud {

    constructor(app) {

      this.app = app;
      this.game_mod = null;

      this.status = "";

      this.initial_render = 0;

      this.mode = 0;		// 0 transparent
				// 1 classic (square)
				// 2 vertical

      this.use_cardbox = 1;
      this.use_cardfan = 1;
      this.use_board_sizer = 1;

      this.card_types = [];

    }

    render(app, game_mod) {

      this.game_mod = game_mod;

      if (game_mod.browser_active == 1) {

	if (this.initial_render == 0) {

          if (!document.querySelector(".hud")) { app.browser.addElementToDom(GameHudTemplate()); }

          let hud 		= document.querySelector(".hud")
          let hud_body 		= document.querySelector('.hud-body');
          let hud_header 	= document.querySelector('.hud-header');

	  //
	  // handle preferred display mode
	  //
	  if (this.mode == 0) {
	    hud.classList.add("hud-long");
            hud.appendChild(hud_header);
            hud.appendChild(hud_body);
	  }
	  if (this.mode == 1) {
	    hud.classList.add("hud-square");
            hud.appendChild(hud_header);
            hud.appendChild(hud_body);
	  }
	  if (this.mode == 2) {
	    hud.classList.add("hud-vertical");
            hud.appendChild(hud_header);
            hud.appendChild(hud_body);
	  }
          if (this.use_cardbox == 1) 	{ game_mod.cardbox.render(app, game_mod); }

	  //
	  // avoid adding to DOM
	  //
	  this.initial_render = 1;

	  this.resizeHudHeight();
	  this.resizeHudWidth();

        }
      }
    }


    attachEvents(app, game_mod) {

      try {

        let myself = this;

	//
	// "card" items become clickable / cardboxable
	//
	// this function is permanent refernce to changeable_callback
	//
        this.addCardType("card", "select", game_mod.cardbox_callback);

        //
        // hud is draggable
        //
	app.browser.makeDraggable("hud", "hud-header", function() { myself.resizeHudHeight(); });

      } catch (err) {
      }


      //
      // hud popup / popdown
      //
      try {
        let hud_toggle_button = document.getElementById('hud-toggle-button');
        hud_toggle_button.onclick = (e) => {
          e.stopPropagation();
          switch (this.checkSizeAndOrientation()) {
	    case DESKTOP:
	      hud.classList.toggle("hud-hidden-vertical");
	      hud_toggle_button.classList.toggle("fa-caret-up");
	      hud_toggle_button.classList.toggle("fa-caret-down");
	  }
        };
      } catch (err) {}

    }


    attachCardEvents(app, game_mod) {

      if (game_mod.browser_active == 0) { 
	return; 
      }

      //
      // cardbox events
      //
      if (this.use_cardbox == 1) {
	// cardbox needs to manage clicks
        game_mod.cardbox.attachCardEvents(app, game_mod); 
      } else {

	// we manage directly
        for (let i = 0; i < this.card_types.length; i++) {
          let card_css      = this.card_types[i].css;
          let card_action   = this.card_types[i].action;
          let card_callback = this.card_types[i].mycallback;
          Array.from(document.getElementsByClassName(card_css)).forEach(card => {
	    card.onmouseover = (e) => {};
            card.onmouseout = (e) => {};
            card.onclick = (e) => {
              card_callback(e.currentTarget.id);
	    };
          });
        }

      }

      //
      // resize hud width if transparent/long mode
      //
      if (this.mode == 0) {
	this.resizeHudWidth();
      }
    }

    renderStatus(app, game_mod) {

      try {
        let status = document.getElementById('status');
        if (status) {

	    let status_div = document.getElementById('status');
	    let status_overlay_div = document.getElementById('status-overlay');

	    if (status_overlay_div) {
	      if (status_overlay_div.style.display != "none") {
                document.getElementById('status-overlay').style.display = 'none';
                status.style.display = 'block';
	      }
	    }
	    if (status.innerHTML !== this.status) { status.innerHTML = this.status; }
	    if (this.status_callback != null) { this.status_callback(); }

        }
      } catch (err) {
      }
    }

    updateStatus(status_html, callback=null) {

        this.status = status_html;
	this.status_callback = callback;
        this.renderStatus();

	//
	// card events
	//
	// we always attach events to the cardbox, as it may be toggleable
	// and needs submission of game_mod and app to function later if 
	// enabled.
	//
        if (this.game_mod != null) {
	  if (this.use_cardbox == 1) {
	    this.game_mod.cardbox.attachCardEvents(this.app, this.game_mod); 
          }
        }
    }

    updateStatusMessage(status_message_txt, callback=null) {
        this.updateStatus('<div id="status-message" class="status-message">' + status_message_txt + '</div>', callback);
    }

    updateStatusMessageAndShowCards(status_message_txt, hand, cards, callback=null) {
      let html = `
        <div id="status-message" class="status-message">${status_message_txt}</div>
        ${this.returnCardList(hand, cards)}
      `;
      this.updateStatus(html, callback);
      this.attachCardEvents(this.app, this.game_mod);
      this.resizeHudWidth();
    }

    onCardClick(onCardClickFunction=null) {
      this.game_mod.changeable_callback = onCardClickFunction;
      this.attachCardEvents(this.app, this.game_mod);
    }


    returnCardList(hand=[], cards) {
      let html = "";
      if (this.mode == 0) {
        for (i = 0; i < hand.length; i++) {
          html += this.returnCardItem(hand[i], cards);
        }
        html = `
          <div class="status-cardbox" id="status-cardbox">
            ${html}
          </div>`;
      } else {
        html = '<ul class="status-cardbox">';
        for (i = 0; i < hand.length; i++) {
          html += this.returnCardItem(hand[i], cards);
        }
        html += '</ul>';
      }
      return html;
    }


    returnCardItem(card, cards) {
      if (this.mode == 0) {
        return `<div id="${card.replace(/ /g,'')}" class="card showcard cardbox-hud cardbox-hud-status">${this.returnCardImage(card, cards, 1)}</div>`;
      } else {
        return '<li class="card showcard" id="'+card+'">'+cards[card].name+'</li>';
      }
    }

    returnCardImage(card, cards, hud=0) {
      let cardclass = "cardimg";
      if (hud == 1) { cardclass = "cardimg-hud"; }
      return `<img class="${cardclass}" src="${cards[card].img}" />`;
    }



    toggleHud(hud, hud_toggle_button) {

      switch (this.checkSizeAndOrientation()) {
        case DESKTOP:
          hud.style.top = null;
          hud.style.left = null;
          break;
        case MOBILE_PORTRAIT:
//          hud.classList.toggle('hud-hidden-vertical');
//          hud_toggle_button.classList.toggle('fa-caret-up');
//          hud_toggle_button.classList.toggle('fa-caret-down');
//          break;
        case MOBILE_LANDSCAPE:
//          hud.classList.toggle('hud-hidden-horizontal');
//          hud_toggle_button.classList.toggle('fa-caret-right');
//          hud_toggle_button.classList.toggle('fa-caret-left');
//          break;
      }

    }


    checkSizeAndOrientation() {
        if (window.matchMedia("(orientation: landscape)").matches && window.innerHeight <= 700) {
            return MOBILE_LANDSCAPE;
        }
        if (window.matchMedia("(orientation: portrait)").matches && window.innerWidth <= 600) {
            return MOBILE_PORTRAIT;
        }
        return DESKTOP;
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
      this.game_mod.cardbox.addCardType(css_name, action_text, mycallback);
    }

    resizeHudHeight() {

      try {

      let hud 		= document.getElementById('hud');
      let hud_header 	= document.getElementById('hud-header');
      let hud_body 	= document.getElementById('hud-body');

      let wheight = window.innerHeight;
          
      let hud_rect = hud.getBoundingClientRect();
      let hud_header_rect = hud_header.getBoundingClientRect();
      let hud_body_rect = hud_body.getBoundingClientRect();
          
      let hud_header_height = hud_header_rect.bottom - hud_header_rect.top;
      let hud_body_height = hud_body_rect.bottom - hud_body_rect.top;
      let hud_height = hud_rect.bottom - hud_rect.top;
          
      let hub_body_cutoff = hud_height - hud_header_height;
          
      let new_height = wheight - hud_body_rect.top;
      let max_height = hud_rect.bottom - hud_rect.top;
          
      if (new_height < max_height) {
        hud_body.style.height = new_height + "px";
        hud_body.style.minHeight = new_height + "px";
        hud_body.style.maxHeight = new_height + "px";
      } else {
        hud_body.style.height = (hud_height - hud_header_height) + "px";
        hud_body.style.minHeight = (hud_height - hud_header_height) + "px";
        hud_body.style.maxHeight = (hud_height - hud_header_height) + "px";
      }

      } catch (err) {
      }
       
    }


    resizeHudWidth() {

      let hud 		= document.getElementById('hud');
      let status_cardbox	= document.querySelector('.status-cardbox');
      let cards = document.querySelectorAll(".cardbox-hud");

      if (!cards) { return; }
      if (!cards[0]) { return; }

      let card_width = Math.floor(cards[0].getBoundingClientRect().width * 1.1);

      if (status_cardbox) {
	let cards_visible = status_cardbox.childElementCount;
	let new_width = card_width * cards_visible; 
	// status has 5 pixel padding
	if (new_width < 510) { new_width = 510; }
	hud.style.width = new_width + "px";
	hud.style.minWidth = new_width + "px";
	hud.style.maxWidth = new_width + "px";
      }

    }

}

module.exports = GameHud
