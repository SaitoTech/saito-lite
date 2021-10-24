const GameOverlayTemplate = require('./game-overlay.template');

class GameOverlay {

    constructor(app) {
      this.app = app;
    }

    render(app, mod) {
      if (!document.querySelector(".game-overlay-backdrop")) { app.browser.addElementToDom(GameOverlayTemplate()); }
    }

    attachEvents(app, game_mod) {
    }

    showOverlay(app, game_mod, html, mycallback=null) {

      this.render(app, game_mod);

      let overlay_self = this;

      let overlay_el = document.querySelector(".game-overlay");
      let overlay_backdrop_el = document.querySelector(".game-overlay-backdrop");
      overlay_el.innerHTML = html;
      overlay_el.style.display = "block";
      overlay_backdrop_el.style.display = "block";

      overlay_backdrop_el.onclick = (e) => {
        overlay_self.hideOverlay(mycallback);
      }

    }

    blockClose() {
      let overlay_backdrop_el = document.querySelector(".game-overlay-backdrop");
      overlay_backdrop_el.onclick = (e) => {};
    }


    hideOverlay(mycallback=null) {

      let overlay_el = document.querySelector(".game-overlay");
      let overlay_backdrop_el = document.querySelector(".game-overlay-backdrop");
      overlay_el.style.display = "none";
      overlay_backdrop_el.style.display = "none";

      if (mycallback != null) { mycallback(); }

    }


    showCardSelectionOverlay(app, game_mod, cards, options={}, mycallback=null) {

      let html = '';
      let wrapper_style = "";

      if (options.backgroundImage) {
        wrapper_style += `background-image: url(${options.backgroundImage}); background-size: cover;`;
      }
      if (options.padding) {
        wrapper_style += `padding:${options.padding};`;
      }
      if (options.textAlign) {
        wrapper_style += `text-align:${options.textAlign};`;
      }

      html += `<div style="${wrapper_style}">`;

      let has_continue_button = 1;
      let has_close_button = 1;
      let has_button = 0;
      let has_card_select = 1;
      let cardlist_row_gap = "1em";
      let cardlist_column_gap = "1em";
      let cardlist_container_height = "80vh";
      let cardlist_container_width = "80vw";

      if (!options.onContinue) { options.onContinue = function() {}; has_continue_button = 0; }
      if (!options.onClose) { options.onClose = function() {}; has_close_button = 0; }
      if (!options.onCardSelect) { options.onCardSelect = function() {}; has_card_select = 0; }
      if (has_continue_button || has_close_button) { has_button = 1; }

      if (options.rowGap) {
	cardlist_row_gap = options.rowGap;
      }
      if (options.columnGap) {
	cardlist_column_gap = options.columnGap;
      }
      if (options.title) {
	html += `<div class="game-overlay-cardlist-title">${options.title}</div>`;
      }
      if (options.subtitle) {
	html += `<div class="game-overlay-cardlist-subtitle">${options.subtitle}</div>`;
      }
      if (options.cardlistHeight) {
	cardlist_container_height = options.cardlistHeight;
      }
      if (options.cardlistWidth) {
	cardlist_container_width = options.cardlistWidth;
      }

      html += '<div class="game-overlay-cardlist-container">';
      for (let i in cards) {
        html += '<div class="game-overlay-cardlist-card">';
        if (cards[i] != undefined) {
	  let x = 0;
          if (typeof cards[i] === 'object' && !Array.isArray(cards[i]) && cards[i] != null) {
	    if (cards[i].returnCardImage != 'undefined' && cards[i].returnCardImage != null) {
	      html += cards[i].returnCardImage();
	      x = 1;
	    }
	  }
	  if (x == 0) {
            html += game_mod.returnCardImage(i);
          }
        }
        html += '</div>';
      }
      html += '</div>';


      if (has_button) {
	html += '<div class="game-overlay-button-container">';
        if (has_continue_button) {
  	  html += `<div class="game-overlay-button-continue button game-overlay-cardlist-button">continue</div>`;
        }
        if (has_close_button) {
  	  html += `<div class="game-overlay-button-close button super game-overlay-cardlist-button">close</div>`;
        }
	html += '</div>';
      }
      // wrapper div
      html += '</div>';


      this.showOverlay(app, game_mod, html, () => {
	options.onClose();
      });

      //
      // set width/height
      //
      document.querySelector(".game-overlay-cardlist-container").style.width = cardlist_container_width;
      document.querySelector(".game-overlay-cardlist-container").style.maxWidth = cardlist_container_width;
      document.querySelector(".game-overlay-cardlist-container").style.height = cardlist_container_height;
      document.querySelector(".game-overlay-cardlist-container").style.maxHeight = cardlist_container_height;

      //
      // right-align left card if only 2
      //
      if (cards.length == 2) {
	let el = document.querySelector(".game-overlay-cardlist-container");
	if (el) { 
	  let el2 = el.children[0]; 
	  if (el2) {
	    let el3 = el2.children[0]; 
	    if (el3) {
	      el3.style.float = "right"; 
	    }
	  }
	}
      }


      //
      // buttons
      //
      if (has_continue_button) {
        document.querySelector(".game-overlay-button-continue").onclick = (e) => {
          options.onContinue();
        }
      }
      if (has_close_button) {
        document.querySelector(".game-overlay-button-close").onclick = (e) => {
          options.onClose();
        }
      }


      //
      // if cards are selectable
      //
      if (has_card_select) {
	document.querySelectorAll('.game-overlay-cardlist-card').forEach(el => {
    	  el.onclick = (e) => {
	    let cardname = el.getAttribute("id");
	    if (cardname == null) {
	      if (el.children) {
	        cardname = el.children[0].getAttribute("id");
	      }
	    }
	    options.onCardSelect(cardname);
	  }
  	});
      }


      // update number shown
      if (options.columns > 0) {
	let x = "1fr ";
	for (let y = 1; y < options.columns; y++) { x += "1fr "; }
	document.querySelector(".game-overlay-cardlist-container").style.gridTemplateColumns = x;
      } else {
	document.querySelector(".game-overlay-cardlist-container").style.gridTemplateColumns = "1fr 1fr 1fr 1fr";
      }

    }

}

module.exports = GameOverlay

