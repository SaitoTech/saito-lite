
const GameHudTemplate = require('./game-hud.template');
const GameHudMenuTemplate = require('./game-hud-menu.template');
const GameCardbox = require('../game-cardbox/game-cardbox');
const GameCardfan = require('../game-cardfan/game-cardfan');

const dragElement = require('../../../helpers/drag_element');
const elParser = require('../../../helpers/el_parser');

const { DESKTOP, MOBILE_PORTRAIT, MOBILE_LANDSCAPE } = require('./game-hud-types');

class GameHud {

    constructor(app, menu_fn_map) {

      this.app = app;

      this.status = "";

      this.initial_render = 0;

      this.mode = 0;		// 0 transparent
				// 1 classic (square)
				// 2 vertical

      this.game_mod = null;

      this.logs = [];
      this.logs_length = 150;
      this.logs_last_msg = '';

      this.card_width = 150;

      this.use_log = 1;
      this.use_cardbox = 1;
      this.use_cardfan = 1;
      this.use_board_sizer = 1;

      this.card_types = [];
      this.cardbox = new GameCardbox(app);

      this.menu_function_map = Object.assign(this.defaultMenuFunctionMap(), menu_fn_map);

    }

    render(app, game_mod) {

      this.game_mod = game_mod;

      if (game_mod.browser_active == 1) {

	if (this.initial_render == 0) {

console.log("initial render!");

          if (!document.querySelector(".hud")) { document.body.innerHTML += GameHudTemplate(); }

          let hud 		= document.querySelector(".hud")
          let log 		= document.querySelector(".log")
          let hud_body 		= document.querySelector('.hud-body');
          let hud_menu 		= document.querySelector('.hud-menu');
          let hud_controls	= document.querySelector('.hud-controls');
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
	    hud_header.appendChild(hud_controls);
            hud.appendChild(hud_header);
            hud.appendChild(hud_body);
	  }
	  if (this.mode == 2) {
	    hud.classList.add("hud-vertical");
	    hud_header.appendChild(hud_controls);
            hud.appendChild(hud_header);
            hud.appendChild(hud_body);
	  }
          if (this.use_cardbox == 1) 	{ this.cardbox.render(app, game_mod); }
	  if (this.use_log == 0) { log.style.display = "none"; }

	  //
	  // render top menu
	  //
          if (document.querySelector(".hud-menu").innerHTML.length == 0) { 
	    hud_menu.append(hud_controls);
	    hud_menu.append(elParser(GameHudMenuTemplate(this.menu_function_map)));
	  }


	  //
	  // avoid adding to DOM
	  //
	  this.initial_render = 1;
        }
      }



      console.log("render game hud");

    }


    attachEvents(app, game_mod) {

      try {

      //
      // hud is draggable
      //
      let hud 		= document.getElementById('hud');
      let hud_header 	= document.getElementById('hud-header');
      let hud_body 	= document.getElementById('hud-body');

      dragElement(hud, function() {

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

      });

      //
      // log clicks out
      //
      document.querySelector('.log').addEventListener('click', (e) => {
        document.querySelector('.log').toggleClass('log-lock');
      });


      //
      // top menu
      //
      try {
      Object.entries(this.menu_function_map).forEach(([key, value]) => {
        Array.from(document.getElementsByClassName(key)).forEach((hud_menu_el) => {
          hud_menu_el.onclick = value.callback;
        });
      });
      } catch (err) {}

      //
      // hud home button
      //
      try {
      let hud_home_button = document.getElementById('hud-home-button');
      hud_home_button.onclick = (e) => {
        hud.style.top = null;
        hud.style.left = null;
      }
      } catch (err) {} 


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

      //
      // cardbox events
      //
      if (this.use_cardbox == 1) 	{ this.cardbox.attachEvents(app, game_mod); }

      //
      // fullscreen
      //
      Array.from(document.getElementsByClassName('hud-toggle-fullscreen')).forEach(hud_toggle_fullscreen => {
        hud_toggle_fullscreen.onclick = (e) => {
          app.browser.requestFullscreen();
        };
      });

      } catch (err) {
console.log("ERROR: " + err);
      }

    }

    attachCardEvents(app, game_mod) {

console.log("in HUD attach card events");

      if (game_mod.browser_active == 0) { 
	return; 
      }

      //
      // cardbox events
      //
console.log("attach cardbox events? " + this.use_cardbox);
      if (this.use_cardbox == 1) 	{ 
	this.cardbox.attachEvents(app, game_mod); 
console.log("ATTACHED!");
      }

      //
      // resize hud length if transparent/long mode
      //

      if (this.mode == 0) {

        let hud 		= document.getElementById('hud');
        let status_cardbox	= document.getElementById('status-cardbox');

	if (status_cardbox) {
	  let cards_visible = status_cardbox.childElementCount;
	  let new_width = this.card_width * cards_visible; 

console.log("Resizing long hud: " + new_width);

	  if (new_width < 500) { new_width = 500; }
	  hud.style.width = new_width + "px";
	  hud.style.minWidth = new_width + "px";
	  hud.style.maxWidth = new_width + "px";
	}
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

    renderLogs(app, game_mod) {
        let log = document.getElementById('log');
        if (log) {
            log.innerHTML = this.logs.slice(0, this.logs_length).map(log => `> <span> ${log} </span>`).join('<br>');
        }
    }

    updateStatus(status_html, callback=null) {

        this.status = status_html;
	this.status_callback = callback;
        this.renderStatus();

	//
	// card events
	//
	if (this.use_cardbox == 1) { this.cardbox.attachEvents(this.app, this.game_mod); }

    }

    updateLog(log_str, callback, force=0) {
        if (log_str !== this.logs_last_msg || force == 1) {
            this.logs_last_msg = log_str;
            this.logs.unshift(log_str);
            this.renderLogs();
            callback();
        }

	//
	// card events
	//
	if (this.use_cardbox == 1) { this.cardbox.attachEvents(this.app, this.game_mod); }
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


    defaultMenuFunctionMap() {
        if (!this.app.BROWSER) return {};
        return {
            'game-status': {
                name: 'Status',
                callback: this.renderStatus.bind(this)
            },
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
      if (this.use_cardbox == 1) { this.cardbox.addCardType(css_name, action_text, mycallback); }
    }

}

module.exports = GameHud
