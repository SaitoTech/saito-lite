const GameMenuTemplate = require('./game-menu.template');
const GameMenuIconTemplate = require('./game-menu-icon.template');
const GameMenuOptionTemplate = require('./game-menu-option.template');

class GameMenu {

    constructor(app) {

      this.app = app;

      this.icons = [];
      this.options = [];
      this.sub_options = [];
      this.sub_menu_open = "";

    }


    render(app, mod) {

      if (!document.querySelector(".game-menu")) { app.browser.addElementToDom(GameMenuTemplate()); }

      let html = '<ul>';
      for (let i = 0; i < this.icons.length; i++) { html += GameMenuIconTemplate(this.icons[i]); }
      for (let i = 0; i < this.options.length; i++) { html += GameMenuOptionTemplate(this.options[i], this.sub_options[i]); }
      html += '</ul>';

      let menu = document.querySelector(".game-menu");
      menu.innerHTML = html;

    }


    attachEvents(app, game_mod) {

      //
      // callbacks in game-menu-option
      //
      for (let i = 0; i < this.options.length; i++) {
	let divname = "#"+this.options[i].id;
	let menu = document.querySelector(divname);
        menu.ontouch = (e) => {
	  let id = e.currentTarget.id;
	  for (let i = 0; i < this.options.length; i++) {
	    if (this.options[i].id === id) {
              if (this.sub_menu_open === id) { 
		this.hideSubMenus(); 
		e.stopPropagation();
		return;
	      }
	      if (this.options[i].callback != undefined) {
	        this.options[i].callback(app, game_mod);
		e.stopPropagation();
	      }
	    }
	  }
	  return;
        }
        menu.onclick = (e) => {
	  let id = e.currentTarget.id;
	  for (let i = 0; i < this.options.length; i++) {
	    if (this.options[i].id === id) {
              if (this.sub_menu_open === id) { 
		this.hideSubMenus(); 
		e.stopPropagation();
		return;
	      }
	      if (this.options[i].callback != undefined) {
	        this.options[i].callback(app, game_mod);
		e.stopPropagation();
	      }
	    }
	  }
        }
      }

      //
      // sub-menu
      //
      for (let i = 0; i < this.sub_options.length; i++) {
        for (let ii = 0; ii < this.sub_options[i].length; ii++) {
	  let divname = "#"+this.sub_options[i][ii].id;
	  let menu = document.querySelector(divname);
          menu.ontouch = (e) => {
	    let id = e.currentTarget.id;
	    for (let iii = 0; iii < this.sub_options.length; iii++) {
	      for (let iv = 0; iv < this.sub_options[iii].length; iv++) {
	        if (this.sub_options[iii][iv].id === id) {
	          if (this.sub_options[iii][iv].callback != undefined) {
	            this.sub_options[iii][iv].callback(app, game_mod);
	      	    e.stopPropagation();
	          }
	        }
	      }
	    }
	    return;
          }
          menu.onclick = (e) => {
	    let id = e.currentTarget.id;
	    for (let iii = 0; iii < this.sub_options.length; iii++) {
	      for (let iv = 0; iv < this.sub_options[iii].length; iv++) {
	        if (this.sub_options[iii][iv].id === id) {
	          if (this.sub_options[iii][iv].callback != undefined) {
	            this.sub_options[iii][iv].callback(app, game_mod);
	      	    e.stopPropagation();
	          }
	        }
	      }
	    }
          }
        }
      }


      //
      // callbacks in game-menu-icon
      //
      for (let i = 0; i < this.icons.length; i++) {
	let divname = "#"+this.icons[i].id;
	let menu = document.querySelector(divname);

        menu.onclick = (e) => {
	  let id = e.currentTarget.id;
	  for (let i = 0; i < this.icons.length; i++) {
	    if (this.icons[i].id === id) {
	      if (this.icons[i].callback != undefined) {
	        this.icons[i].callback(app, game_mod);
		e.stopPropagation();
	      }
	    }
	  }
        }
      
        menu.ontouch = (e) => {
	  let id = e.currentTarget.id;
	  for (let i = 0; i < this.icons.length; i++) {
	    if (this.icons[i].id === id) {
	      if (this.icons[i].callback != undefined) {
	        this.icons[i].callback(app, game_mod);
		e.stopPropagation();
	      }
	    }
	  }
        }
      }

    }

    addMenuOption(options={}) { 
      for (let i = 0; i < this.options.length; i++) { if (this.options[i].id == options.id) { return; } }
      this.options.push(options); 
      this.sub_options.push([]); 
    }
    addSubMenuOption(parent_id, options={}) { 
      for (let i = 0; i < this.options.length; i++) { 
	if (this.options[i].id == parent_id) {
	  if (this.sub_options[i]) {
	    for (let z = 0; z < this.sub_options[i].length; z++) {
	      if (this.sub_options[i][z].id === options.id) { return; }
	    }
	    this.sub_options[i].push(options);
	  }
	} 
      }
    }
    addMenuIcon(options={}) {
      for (let i = 0; i < this.icons.length; i++) { if (this.icons[i].id == options.id) { return; } }
      this.icons.push(options); 
    }

    showSubMenu(parent_id) {
      if (this.sub_menu_open != "") { this.hideSubMenus(); }
      this.sub_menu_open = parent_id;
      let el = document.querySelector("#"+parent_id+" > ul");
      el.style.display = "block";
    }
    hideSubMenus() {
      this.sub_menu_open = "";
      for (let i = 0; i < this.options.length; i++) {
        let divname = "#"+this.options[i].id+" > ul";
	let el = document.querySelector(divname);
	if (el) { el.style.display = "none"; }
      }
    }

}

module.exports = GameMenu

