const GameTemplate = require('../../lib/templates/gametemplate');
const helpers = require('../../lib/helpers/index');



//
// Missile Envy is a bit messy
//
var is_this_missile_envy_noneventable = 0;
var is_player_skipping_playing_china_card = 0;

var start_turn_game_state = null;
var start_turn_game_queue = null;

//
// allows cancellation of pick "pickagain"
//
var original_selected_card = null;




//////////////////
// CONSTRUCTOR  //
//////////////////
class Twilight extends GameTemplate {

  constructor(app) {

    super(app);

    this.app             = app;

    this.name  		 = "Twilight";
    this.slug		 = "twilight";
    this.description     = `Twilight Struggle is a card-driven strategy game for two players, with its theme taken from the Cold War.
      One player plays the United States (US), and the other plays the Soviet Union (USSR).`;
    this.publisher_message = "Twilight Struggle is owned by GMT Games. This module is made available under an open source license provided by GMT Games for usage in open source game engines. Publisher requirements is that at least one player per game has purchased a copy of the game.";
    this.categories      = "Games Arcade Entertainment";

    //
    // this sets the ratio used for determining
    // the size of the original pieces
    //
    this.boardgameWidth  = 5100;

    this.moves           = [];
    this.cards    	 = [];
    this.is_testing 	 = 1;

    //
    // newbie mode
    //
    this.confirm_moves = 1;

    this.log_length 	 = 150;
    this.interface 	 = 1;

    this.gameboardZoom   = 0.90;
    this.gameboardMobileZoom = 0.67;

    this.minPlayers 	 = 2;
    this.maxPlayers 	 = 2;
    this.type       	 = "Strategy Boardgame";
    this.categories 	 = "Bordgame Game"

    // long-horizontal
    this.hud.mode = 0;

  }





  //
  // manually announce arcade banner support
  //
  respondTo(type) {

    if (super.respondTo(type) != null) {
      return super.respondTo(type);
    }

    if (type == "arcade-carousel") {
      let obj = {};
      obj.background = "/twilight/img/arcade/arcade-banner-background.png";
      obj.title = "Twilight Struggle";
      return obj;
    }
   
    return null;
 
  }



  handleCardsMenu() {

    let twilight_self = this;
    let html =
    `
      <div class="game-overlay-menu" id="game-overlay-menu">
        <div>SELECT DECK:</div>
       <ul>
          <li class="menu-item" id="hand">Your Hand</li>
          <li class="menu-item" id="discards">Discarded Cards</li>
          <li class="menu-item" id="removed">Removed Events</li>
          <li class="menu-item" id="unplayed">Unplayed Cards</li>
        </ul>
      </div>
    `;

    twilight_self.overlay.showOverlay(twilight_self.app, twilight_self, html);

    $('.menu-item').on('click', function() {

      let player_action = $(this).attr("id");
      var deck = twilight_self.game.deck[0];
      var html = "";
      var cards;

      switch (player_action) {
        case "hand":
          cards = deck.hand
          break;
        case "discards":
          cards = Object.keys(deck.discards)
          break;
        case "removed":
          cards = Object.keys(deck.removed)
          break;
        case "unplayed":
          cards = Object.keys(twilight_self.returnUnplayedCards())
          break;
        default:
          break;
      }

      html += '<div class="cardlist-container">';
      for (let i = 0; i < cards.length; i++) {
        html += '<div class="cardlist-card">';
        if (cards[i] != undefined) {
	  html += twilight_self.returnCardImage(cards[i], 1);
	}
        html += '</div>';
      }
      html += '</div>';

      if (cards.length == 0) { 
        html = `
          <div style="text-align:center; margin: auto;">
            There are no cards in ${player_action}
          </div>
        `;
      }

      twilight_self.overlay.showOverlay(twilight_self.app, twilight_self, html);
    });

  }



  handleExportMenu() {

    let twilight_self = this;
    let html =
    `
      <div class="game-overlay-menu" id="game-overlay-menu">
        <div>Export Options:</div>
       <ul>
          <li class="menu-item" id="private">Private <div style="font-size:0.8em;clear:both">Create a backup file that saves the game along with the (encrypted) hands of each player. Only the current players will be able to restore the game.</div></li>
        </ul>
      </div>
    `;

    twilight_self.overlay.showOverlay(twilight_self.app, twilight_self, html);

    $('.menu-item').on('click', function() {

      let player_action = $(this).attr("id");

      switch (player_action) {
        case "private":
          break;
        default:
          break;
      }

      twilight_self.overlay.showOverlay(twilight_self.app, twilight_self, "All players are backing up their game...");
    });

  }

  

  handleStatsMenu() {

    let twilight_self = this;

    let us_bg = 0;
    let ussr_bg = 0;

    for (var i in twilight_self.countries) {
      let countryname  = i;
      let divname      = '#'+i;
  
      if ( twilight_self.countries[countryname].bg == 1 ){
  
          if (this.isControlled("us", i) == 1) {us_bg++}
          if (this.isControlled("ussr", i) == 1) {ussr_bg++}
      }
  }


    let html =
    `
      <div class="game-overlay-menu statistics-overlay" id="game-overlay-menu">
        <div>Headline Statistics</div>
	<table class="headline-statistics-table" style="max-width:80vw; width:50%;">
	  <atr>
	    <th></th>
	    <th>US</th>
	    <th>USSR</th>
	  </tr>
	  <tr>
	    <td><b>Played OPS</b></td>
	    <td>${this.game.state.stats.us_ops}</td>
	    <td>${this.game.state.stats.ussr_ops}</td>
	  </tr>
	  <tr>
	    <td><b>Spaced OPS</b></td>
	    <td>${this.game.state.stats.us_ops_spaced}</td>
	    <td>${this.game.state.stats.ussr_ops_spaced}</td>
	  </tr>
	  <tr>
	    <td><b>Scoring Cards</b></td>
	    <td>${this.game.state.stats.us_scorings}</td>
	    <td>${this.game.state.stats.ussr_scorings}</td>
    </tr>
    <tr>
      <td><b>Battlegrounds Controlled</b></td>
      <td>${us_bg}</td>
      <td>${ussr_bg}</td>
    </tr>
	  <tr>
	    <td><b>Coups</b></td>
	    <td>`;
            if (this.game.state.stats.us_coups.length > 0) { html += JSON.stringify(this.game.state.stats.us_coups); }
	    html += `</td><td>`;
	    if (this.game.state.stats.ussr_coups.length > 0) { html += JSON.stringify(this.game.state.stats.ussr_coups); }
	    html += `</td>
	  </tr>
        </table>
	<div style="margin-top:20px;margin-bottom:10px;clear:both">Round-by-Round Statistics</div>
	<table class="statistics-round-table">
	  <tr>
	`;

	for (let z = 0; z < 11; z++) {
	  if (z == 0) { 
	    html += '<th></th>'; 
	  } else { 
	    html += `<th>R${(z)}</th>`; 
	  }
	}
	html += `
	  </tr>
       `;
	for (let y = 0; y < 10; y++) {
	  html += '<tr>';

	  if (y == 0) { html += '<td style="text-align:left">OPS</td>'; }
	  if (y == 1) { html += '<td style="text-align:left">VP</td>'; }
	  if (y == 2) { html += '<td style="text-align:left">US Scoring</td>'; }
	  if (y == 3) { html += '<td style="text-align:left">USSR Scoring</td>'; }

	  for (let z = 0; z < 10; z++) {

	    if (y == 0) {
	      if (z > this.game.state.stats.round.length) {
	        html += `<td> - </td>`;
	      } else {
		if (z == this.game.state.stats.round.length) {
	          html += `<td>${this.game.state.stats.us_ops-this.game.state.stats.ussr_ops}</th>`;
		} else {
	          html += `<td>${this.game.state.stats.round[z].us_ops-this.game.state.stats.round[z].ussr_ops}</th>`;
	        }
	      }
	    }

	    if (y == 1) {
	      if (z > this.game.state.stats.round.length) {
	          html += `<td> - </td>`;
	      } else {
		if (z == this.game.state.stats.round.length) {
	          html += `<td>${this.game.state.vp}</th>`;
		} else {
	          html += `<td>${this.game.state.stats.round[z].vp}</th>`;
	        }
	      }
	    }

	    if (y == 2) {
	      if (z > this.game.state.stats.round.length) {
	          html += `<td> - </td>`;
	      } else {
		if (z == this.game.state.stats.round.length) {
	          html += `<td>${this.game.state.stats.us_scorings}</th>`;
		} else {
	          html += `<td>${this.game.state.stats.round[z].us_scorings}</th>`;
	        }
	      }
	    }

	    if (y == 3) {
	      if (z > this.game.state.stats.round.length) {
	          html += `<td> - </td>`;
	      } else {
		if (z == this.game.state.stats.round.length) {
	          html += `<td>${this.game.state.stats.ussr_scorings}</th>`;
		} else {
	          html += `<td>${this.game.state.stats.round[z].ussr_scorings}</th>`;
	        }
	      }
	    }
	  }
	  html += '</tr>';
	}

    html += `
        </table>
    `;
    html += `
      </div>
    `;

    twilight_self.overlay.showOverlay(twilight_self.app, twilight_self, html);

  }


  handleDisplayMenu() {

    let twilight_self = this;
    let user_message = `
      <div class="game-overlay-menu" id="game-overlay-menu">
        <div>DISPLAY MODE:</div>
       <ul>
          <li class="menu-item" id="english">English</li>
          <li class="menu-item" id="chinese">简体中文</li>
          <li class="menu-item" id="enable_observer_mode">Observer Mode</li>
        </ul>
      </div>`;
//          <li class="menu-item" id="text">Text Cards</li>
//          <li class="menu-item" id="graphics">Graphical Cards</li>

    twilight_self.overlay.showOverlay(twilight_self.app, twilight_self, user_message);

    $('.menu-item').on('click', function() {
      let action2 = $(this).attr("id");

      if (action2 === "enable_observer_mode") {
        twilight_self.game.saveGameState = 1;
	let msgobj = {
	  game_id : twilight_self.game.id ,
	  player : twilight_self.app.wallet.returnPublicKey() ,
	  module : twilight_self.game.module
	};
        let msg = twilight_self.app.crypto.stringToBase64(JSON.stringify(msgobj));
	let observe_link = window.location.href;
	let tmpar = observe_link.split("/");
	let oblink = tmpar[0] + "//" + tmpar[2];

	let html  = '<div class="status-message" id="status-message">Observer Mode will be enabled on your next move (reload to cancel). Make your move and then share this link:';
	html += '<div style="padding:15px;font-size:0.9em;overflow-wrap:anywhere">'+oblink+'/arcade/?i=watch&msg='+msg+'</div>';
	html += '</div>';
	twilight_self.overlay.showOverlay(twilight_self.app, twilight_self, html);

      }

      if (action2 === "text") {
        twilight_self.displayModal("Card Menu options changed to text-mode. Please reload.");
        twilight_self.interface = 0;
        twilight_self.saveGamePreference("interface", 0);
	setTimeout(function() {
          window.location.reload();
	}, 1000);
      }

      if (action2 === "graphics") {
        twilight_self.displayModal("Card Menu options changed to graphical mode. Please reload.");
        twilight_self.interface = 1;
        twilight_self.saveGamePreference("interface", 1);
	setTimeout(function() {
          window.location.reload();
	}, 1000);
      }

      if (action2 === "english") {
        twilight_self.displayModal("Language Settings", "Card settings changed to English");
        twilight_self.lang = "en";
        twilight_self.saveGamePreference("lang", "en");
	setTimeout(function() {
          window.location.reload();
	}, 1000);
      }

      if (action2 === "chinese") {
        twilight_self.displayModal("语言设定", "卡牌语言改成简体中文");
        twilight_self.lang = "zh";
        twilight_self.saveGamePreference("lang", "zh");
	setTimeout(function() {
          window.location.reload();
	}, 1000);
      }

      if (action2 == "enable_hud_vertical") {
        $('.hud').addClass('hud-vertical').removeClass('hud-long').removeClass('hud-square').removeAttr("style");
        twilight_self.hud.mode = 2;
        twilight_self.hud.initial_render = 0;
        twilight_self.hud.render(twilight_self.app, twilight_self);
        twilight_self.hud.attachEvents(twilight_self.app, twilight_self);
        twilight_self.hud.attachCardEvents(twilight_self.app, twilight_self);
        return;
      }
      if (action2 == "enable_hud_square") {
        $('.hud').addClass('hud-square').removeClass('hud-long').removeClass('hud-vertical').removeAttr("style");
        twilight_self.hud.mode = 1;
        twilight_self.hud.initial_render = 0;
        twilight_self.hud.render(twilight_self.app, twilight_self);
        twilight_self.hud.attachEvents(twilight_self.app, twilight_self);
        twilight_self.hud.attachCardEvents(twilight_self.app, twilight_self);
	twilight_self.overlay.hideOverlay();
        return;
      }
      if (action2 == "enable_hud_horizontal") {
        $('.hud').addClass('hud-long').removeClass('hud-vertical').removeClass('hud-square').removeAttr("style");
        twilight_self.hud.mode = 0;
        twilight_self.hud.initial_render = 0;
        twilight_self.hud.render(twilight_self.app, twilight_self);
        twilight_self.hud.attachEvents(twilight_self.app, twilight_self);
        twilight_self.hud.attachCardEvents(twilight_self.app, twilight_self);
	twilight_self.overlay.hideOverlay();
        return;
      }

    });
  }


  async handlePlayerMenu() {

    try {

      let opponent = this.game.opponents[0];
      if (this.app.crypto.isPublicKey(opponent)) {
        opponent = opponent.substring(0, 16);
      }

      let user_message = `
        <div class="status-message" id="status-message">
          <div>Opponent: ${opponent}</div>
        </div>
      `;

      this.overlay.showOverlay(this.app, this, user_message);

    } catch (err) {
console.log(err);
    }

  }


  handleLogMenuItem() {
    //
    // we explicitly add this in the mobile version
    //
    $('.status-overlay').html(`<div style="padding: 0.5em">${$('.log').html()}</div>`);
    this.addLogCardEvents();
  }




  initializeHTML(app) {

    if (this.browser_active == 0) { return; }

    super.initializeHTML(app);

    this.app.modules.respondTo("chat-manager").forEach(mod => {
      mod.respondTo('chat-manager').render(app, this);
      mod.respondTo('chat-manager').attachEvents(app, this);
    });

    // required here so menu will be proper
    try {
      if (this.app.options.gameprefs.twilight_expert_mode == 1) {
        this.confirm_moves = 0;
      } else {
        this.confirm_moves = 1;
      }
    } catch (err) {}

    this.menu.addMenuOption({
      text : "Game",
      id : "game-game",
      class : "game-game",
      callback : function(app, game_mod) {
	game_mod.menu.showSubMenu("game-game");
      }
    });
    this.menu.addSubMenuOption("game-game", {
      text : "Log",
      id : "game-log",
      class : "game-log",
      callback : function(app, game_mod) {
        game_mod.menu.hideSubMenus();
        game_mod.log.toggleLog();
      }
    });
    let initial_confirm_moves = "Newbie Mode"; 
    if (this.confirm_moves == 1) {
      initial_confirm_moves = "Expert Mode"; 
    }
    this.menu.addSubMenuOption("game-game", {
      text : initial_confirm_moves,
      id : "game-confirm",
      class : "game-confirm",
      callback : function(app, game_mod) {
        game_mod.menu.hideSubMenus();
	if (game_mod.confirm_moves == 0) {
	  game_mod.confirm_moves = 1;
          game_mod.saveGamePreference('twilight_expert_mode', 0);
	  window.location.reload();	
	} else {
	  game_mod.confirm_moves = 0;
          game_mod.saveGamePreference('twilight_expert_mode', 1);
	  window.location.reload();	
	}
      }
    });
    this.menu.addSubMenuOption("game-game", {
      text : "Stats",
      id : "game-stats",
      class : "game-stats",
      callback : function(app, game_mod) {
	game_mod.menu.hideSubMenus();
        game_mod.handleStatsMenu();
      }
    });
    this.menu.addSubMenuOption("game-game", {
      text : "Exit",
      id : "game-exit",
      class : "game-exit",
      callback : function(app, game_mod) {
        window.location.href = "/arcade";
      }
    });


    this.menu.addMenuOption({
      text : "Cards",
      id : "game-cards",
      class : "game-cards",
      callback : function(app, game_mod) {
	game_mod.menu.hideSubMenus();
        game_mod.handleCardsMenu();
      }
    });
    this.menu.addMenuOption({
      text : "Display",
      id : "game-display",
      class : "game-display",
      callback : function(app, game_mod) {
	game_mod.menu.hideSubMenus();
        game_mod.handleDisplayMenu();
      }
    });


    let main_menu_added = 0;
    let community_menu_added = 0;
    for (let i = 0; i < this.app.modules.mods.length; i++) {
      if (this.app.modules.mods[i].slug === "chat") {
	for (let ii = 0; ii < this.game.players.length; ii++) {
	  if (this.game.players[ii] != this.app.wallet.returnPublicKey()) {

	    // add main menu
	    if (main_menu_added == 0) {
              this.menu.addMenuOption({
                text : "Chat",
          	id : "game-chat",
          	class : "game-chat",
          	callback : function(app, game_mod) {
		  game_mod.menu.showSubMenu("game-chat");
          	}
              })
	      main_menu_added = 1;
	    }

	    if (community_menu_added == 0) {
    	      this.menu.addSubMenuOption("game-chat", {
    	        text : "Community",
      	        id : "game-chat-community",
      	        class : "game-chat-community",
      	        callback : function(app, game_mod) {
	  	  game_mod.menu.hideSubMenus();
        	  chatmod.sendEvent('chat-render-request', {});
                  chatmod.mute_community_chat = 0;
		  chatmod.openChatBox();
    	        }
              });
	      community_menu_added = 1;
	    }

	    // add peer chat
  	    let data = {};
	    let members = [this.game.players[ii], this.app.wallet.returnPublicKey()].sort();
	    let gid = this.app.crypto.hash(members.join('_'));
	    let name = "Player "+(ii+1);
	    let chatmod = this.app.modules.mods[i];
	
    	    this.menu.addSubMenuOption("game-chat", {
    	      text : name,
      	      id : "game-chat-"+(ii+1),
      	      class : "game-chat-"+(ii+1),
      	      callback : function(app, game_mod) {
		game_mod.menu.hideSubMenus();
	        chatmod.createChatGroup(members, name);
		chatmod.openChatBox(gid);
        	chatmod.sendEvent('chat-render-request', {});
        	chatmod.saveChat();
    	      }
            });
	  }
	}
      }
    }
    this.menu.addMenuIcon({
      text : '<i class="fa fa-window-maximize" aria-hidden="true"></i>',
      id : "game-menu-fullscreen",
      callback : function(app, game_mod) {
	game_mod.menu.hideSubMenus();
        app.browser.requestFullscreen();
      }
    });
    this.menu.render(app, this);
    this.menu.attachEvents(app, this);


    this.log.render(app, this);
    this.log.attachEvents(app, this);

    this.cardbox.render(app, this);
    this.cardbox.attachEvents(app, this);


    //
    // add card events -- text shown and callback run if there
    //
    this.hud.addCardType("logcard", "", null);
    this.hud.addCardType("showcard", "select", this.cardbox_callback);
    this.hud.addCardType("card", "select", this.cardbox_callback);
    if (!app.browser.isMobileBrowser(navigator.userAgent)) {
      this.cardbox.skip_card_prompt = 1;
    } else {
      this.hud.card_width = 110;
    }

    try {

      if (app.browser.isMobileBrowser(navigator.userAgent)) {

        this.hammer.render(this.app, this);
        this.hammer.attachEvents(this.app, this, '.gameboard');

      } else {

	let twilight_self = this;

console.log("adding sizer!");
        this.sizer.render(this.app, this);
        this.sizer.attachEvents(this.app, this, '.gameboard');


        //GameBoardSizer.render(this.app, this);
        //GameBoardSizer.attachEvents(this.app, this, '.gameboard');

        $('#gameboard').draggable({
	  stop : function(event, ui) {
	    twilight_self.saveGamePreference((twilight_self.returnSlug()+"-board-offset"), ui.offset);
	  }
	});

      }

    } catch (err) {}

    this.hud.render(app, this);
    this.hud.attachEvents(app, this);


  }


  ////////////////
  // initialize //
  ////////////////
initializeGame(game_id) {

  //
  // check user preferences to update interface, if text
  //
  if (this.app.options != undefined) {
    if (this.app.options.gameprefs != undefined) {
      if (this.app.options.gameprefs.interface == 0) {
        this.interface = 0;
      }
      if (this.app.options.gameprefs.interface == 1) {
        this.interface = 1;
      }
      if (this.app.options.gameprefs.twilight_expert_mode == 1) {
	this.confirm_moves = 0;
      } else {
        this.confirm_moves = 1;
      }
    }
  }

  if (this.game.status != "") { this.updateStatus(this.game.status); }
  if (this.game.log) { 
    if (this.game.log.length > 0) { 
      for (let i = this.game.log.length-1; i >= 0; i--) { this.updateLog(this.game.log[i]); }
    }
  }

  //
  // VP needed
  //
  this.game.vp_needed = 20;


  //
  // initialize
  //
  if (!this.game.state) {

    this.game.countries = this.returnCountries();
    this.game.state = this.returnState();

console.log("\n\n\n\n");
console.log("---------------------------");
console.log("---------------------------");
console.log("------ INITIALIZE GAME ----");
console.log("---------------------------");
console.log("---------------------------");
console.log("---------------------------");
console.log("DECK: " + this.game.options.deck);
console.log("\n\n\n\n");

    this.updateStatus("<div class='status-message' id='status-message'>Generating the Game</div>");

    this.game.queue.push("round");
    if (this.game.options.usbonus != undefined) {
      if (this.game.options.usbonus > 0) {
        this.game.queue.push("placement_bonus\t2\t"+this.game.options.usbonus);
      }
    }
    this.game.queue.push("placement\t2");
    this.game.queue.push("placement\t1");
    this.game.queue.push("READY");
    this.game.queue.push("DEAL\t1\t2\t8");
    this.game.queue.push("DEAL\t1\t1\t8");
    this.game.queue.push("DECKENCRYPT\t1\t2");
    this.game.queue.push("DECKENCRYPT\t1\t1");
    this.game.queue.push("DECKXOR\t1\t2");
    this.game.queue.push("DECKXOR\t1\t1");

    //
    // TESTING
    //
    if (this.is_testing == 1) {

      this.game.options = {};
      this.game.options.culturaldiplomacy = 1;
      this.game.options.gouzenkoaffair = 1;
      this.game.options.berlinagreement = 1;
      this.game.options.handshake = 1;
      this.game.options.rustinredsquare = 1;
      this.game.options.poliovaccine = 1;

      this.game.options.deck = "endofhistory";
      let a = this.returnEarlyWarCards();
      let b = this.returnMidWarCards();
      let c = this.returnLateWarCards();
      let d = Object.assign({}, a, b);
      let e = Object.assign({}, d, c);

      this.game.options.deck = "coldwarcrazies";
      let f = this.returnEarlyWarCards();
      let g = this.returnMidWarCards();
      let h = this.returnLateWarCards();
      let i = Object.assign({}, f, e);
      let j = Object.assign({}, g, i);
      let k = Object.assign({}, h, j);

      this.game.options.deck = "absurdum";
      let l = this.returnEarlyWarCards();
      let m = this.returnMidWarCards();
      let n = this.returnLateWarCards();
      let o = Object.assign({}, l, k);
      let p = Object.assign({}, m, o);
      let q = Object.assign({}, n, p);

      console.log("CARDS: " + JSON.stringify(k));
      this.game.queue.push("DECK\t1\t"+JSON.stringify(k));
    } else {
      this.game.queue.push("DECK\t1\t"+JSON.stringify(this.returnEarlyWarCards()));
    }
    this.game.queue.push("init");

    if (this.game.dice === "") {
      this.initializeDice();
    }

  }

  this.countries = this.game.countries;

  //
  // adjust screen ratio
  //
try {
  $('.country').css('width', this.scale(202)+"px");
  $('.us').css('width', this.scale(100)+"px");
  $('.ussr').css('width', this.scale(100)+"px");
  $('.us').css('height', this.scale(100)+"px");
  $('.ussr').css('height', this.scale(100)+"px");

  //
  $('.formosan_resolution').css('width', this.scale(202)+"px");
  $('.formosan_resolution').css('height', this.scale(132)+"px");
  $('.formosan_resolution').css('top', this.scale(this.countries['taiwan'].top-32)+"px");
  $('.formosan_resolution').css('left', this.scale(this.countries['taiwan'].left)+"px");

  //
  // update defcon and milops and stuff
  //
  this.updateDefcon();
  this.updateActionRound();
  this.updateSpaceRace();
  this.updateVictoryPoints();
  this.updateMilitaryOperations();
  this.updateRound();
} catch (err) {} // we must be in invite page

  //
  // initialize interface
  //
  for (var i in this.countries) {

    let divname      = '#'+i;
    let divname_us   = divname + " > .us > img";
    let divname_ussr = divname + " > .ussr > img";

    let us_i   = 0;
    let ussr_i = 0;

    try {
      $(divname).css('top', this.scale(this.countries[i].top)+"px");
      $(divname).css('left', this.scale(this.countries[i].left)+"px");
      $(divname_us).css('height', this.scale(100)+"px");
      $(divname_ussr).css('height', this.scale(100)+"px");

      if (this.countries[i].us > 0) { this.showInfluence(i, "us"); }
      if (this.countries[i].ussr > 0) { this.showInfluence(i, "ussr"); }
    } catch (err) {} // invite page

  }


  try {

    let twilight_self = this;
    $('.scoring_card').off();
    $('.scoring_card').mouseover(function() {

      let region = this.id;
      let scoring = twilight_self.calculateScoring(region, 1);
      let total_vp = scoring.us.vp - scoring.ussr.vp;
      let vp_color = "white";

      if (total_vp > 0) { vp_color = "blue" }
      if (total_vp < 0) { vp_color = "red" }
      if (total_vp > (twilight_self.game.vp_needed) || total_vp < (twilight_self.game.vp_needed*-1)) { total_vp = "WIN" }

      $(`.display_card#${region}`).show();
      $(`.display_vp#${region}`).html(
        `VP: <div style="color:${vp_color}">&nbsp${total_vp}</div>`
      );
    }).mouseout(function() {
      let region = this.id;
      $(`.display_card#${region}`).hide();
    })

  } catch (err) {}

}





  //
  // Core Game Logic
  //
  handleGameLoop() {

    let twilight_self = this;
    let player = "ussr"; 
    if (this.game.player === 2) { player = "us"; } 

    //
    // support observer mode
    //
    if (this.game.player === 0) { player = "observer"; }

    //
    // avoid China bug on reshuffle - sept 27
    //
    try {
    if (this.game.deck[0]) {
      if (this.game.deck[0].cards) {
        this.game.deck[0].cards["china"] = this.returnChinaCard();
      }
    }
    } catch (err) {}



    if (this.game.over == 1) {
      let winner = "ussr";
      if (this.game.winner == 2) { winner = "us"; }
      let gid = $('#sage_game_id').attr("class");
      if (gid === this.game.id) {
        this.updateStatus("<div class='status-message' id='status-message'><span>Game Over:</span> "+winner.toUpperCase() + "</span> <span>wins</span></div>");
      }

      return 0;
    }



    ///////////
    // QUEUE //
    ///////////
    if (this.game.queue.length > 0) {

        let qe = this.game.queue.length-1;
        let mv = this.game.queue[qe].split("\t");
        let shd_continue = 1;

console.log("QUEUE: " + this.game.queue);
console.log("MOVE: " + JSON.stringify(mv));

        //
        // cambridge region
        // chernobyl region
        // grainsales sender card
        // missileenvy sender card
        // latinamericandebtcrisis (if USSR can double)
        // che ussr country_of_target1
        //
        // start round
        // flush [discards] // empty discards pile if exists
        // placement (initial placement)
        // ops [us/ussr] card num
        // round
        // revert -- return to start of turn
        // move [us/ussr]
        // turn [us/ussr]
        // event [us/ussr] card
        // remove [us/ussr] [us/ussr] countryname influence     // player moving, then player whose ops to remove
        // place [us/ussr] [us/ussr] countryname influence      // player moving, then player whose ops to remove
        // resolve card
        // space [us/ussr] card
        // defcon [lower/raise]
        // notify [msg]
        // coup [us/ussr] countryname influence
        // realign [us/ussr] countryname
        // card [us/ussr] card  --> hand card to play
        // vp [us/ussr] points [delay_settlement_until_end_of_turn=1]
        // discard [us/ussr] card --> discard from hand
        // discard [ussr/us] card
        // deal [1/2]  --- player decides how many cards they need, adds DEAL and clears when ready
        // init
        // observer -- reveal cards to player0s (insecure)
	//
        if (mv[0] == "init") {

	    //
	    // observer skips
	    //
	    let observer = 0;
	    if (this.game.player === 0) { 
	      if (!this.game.players.includes(this.app.wallet.returnPublicKey())) { 
		observer = 1;
                let roll = this.rollDice(6);
	      }
	    } 


	    if (observer === 0) {

              let tmpar = this.game.players[0];
              if (this.game.options.player1 != undefined) {

                //
                // random pick
                //
                if (this.game.options.player1 == "random") {
                  let roll = this.rollDice(6);
                  if (roll <= 3) {
                    this.game.options.player1 = "us";
                   } else {
                   this.game.options.player1 = "ussr";
                  }
                }

	        // [1] should be creator 
		if (observer == 0) {
                  if (this.game.players[1] === this.app.wallet.returnPublicKey()) {
                    if (this.game.options.player1 == "us") {
                      this.game.player = 2;
                    } else {
                      this.game.player = 1;
                    }
                  } else {
                    if (this.game.options.player1 == "us") {
                      this.game.player = 1;
                    } else {
                      this.game.player = 2;
                    }
                  }
	        }
              }
	    }

            this.game.queue.splice(qe, 1);

        }

	if (mv[0] === "update_observers") {

	  let p = mv[1];
	  if (this.game.player == p) {
	    this.addMove("observer_cards_update\t"+this.game.player+"\t"+JSON.stringify(this.game.deck[0].hand));
	    this.endTurn();
	  }

          this.game.queue.splice(qe, 1);
	  return 0;

	}
        if (mv[0] === "observer_cards_update") {

	  let player = mv[1];
	  let cards = JSON.stringify(mv[2]);

	  if (player == this.game.observer_mode_player) {
	    if (this.game.player == 0) {
	      this.game.deck[0].hand = [];
	      for (let i = 0; i < cards.length; i++) {
	        this.game.deck[0].hand.push(cards[i]);
	      }
	    }
	  }

          this.game.queue.splice(qe, 1);
	  return 1;

        }
        if (mv[0] === "revert") {
          this.revertTurn();
          this.game.queue.splice(qe, 1);
        }
        if (mv[0] === "turn") {
          this.game.state.turn_in_round++;
          this.game.state.events.china_card_eligible = 0;
          this.game.queue.splice(qe, 1);
          this.updateActionRound();
        }
        if (mv[0] === "discard") {
          if (mv[2] === "china") {
            //
            // china card switches hands
            //
            if (mv[1] == "ussr") {
              this.updateLog("China Card passes to US face down");
              this.game.state.events.china_card = 2;
              this.game.state.events.china_card_facedown = 1;
	      this.displayChinaCard();
            }
            if (mv[1] == "us") {
              this.updateLog("China Card passes to USSR face down");
              this.game.state.events.china_card = 1;
              this.game.state.events.china_card_facedown = 1;
	      this.displayChinaCard();
            }
          } else {

            //
            // remove from hand if present
            //
            this.removeCardFromHand(mv[2]);


            //
            // missile envy is an exception, non-player triggers
            //
            if (mv[2] == "missileenvy" && this.game.state.events.missile_envy != this.game.player) {
              this.game.state.events.missile_envy = 0;
              this.game.state.events.missileenvy = 0;
            }

            for (var i in this.game.deck[0].cards) {
              if (mv[2] == i) {
                if (this.game.deck[0].cards[mv[2]] != undefined) {
                  //
                  // move to discard pile
                  //
                  this.updateLog("<span>" + mv[1].toUpperCase() + " discards</span> <span class=\"logcard\" id=\""+mv[2]+"\">" + this.game.deck[0].cards[mv[2]].name + "</span>");
                  //
                  // discard pile is parallel to normal
                  //
                  this.game.deck[0].discards[i] = this.game.deck[0].cards[i];
                }
              }
            }
          }
          this.game.queue.splice(qe, 1);
        }
        //
        // wargames
        //
        if (mv[0] == "wargames") {

          let player = mv[1];
          let activate = parseInt(mv[2]);

          if (activate == 0) {

            //
            // card is discarded, nothing happens
            //

          } else {

            if (player == "us") {
              this.game.state.vp -= this.game.state.wargames_concession;
              this.updateVictoryPoints();
              if (this.game.state.vp > 0) {
                  this.endGame("us","Wargames");
              }
              if (this.game.state.vp < 0) {
                  this.endGame("ussr","Wargames");
              }
              if (this.game.state.vp == 0) {
                this.endGame("tie game","Wargames");
              }
            } else {
              this.game.state.vp += this.game.state.wargames_concession;
              this.updateVictoryPoints();
              if (this.game.state.vp > 0) {
                  this.endGame("us","Wargames");
              }
              if (this.game.state.vp < 0) {
                this.endGame("ussr","Wargames");
              }
              if (this.game.state.vp == 0) {
                this.endGame("tie game","Wargames");
              }
            }

          }

          this.game.queue.splice(qe, 1);
        }



        //
        // card [player] [card]
        //
        if (mv[0] === "card") {

	  let player = mv[1];
	  let card = mv[2];

	  if (player === "us") { player = 2; }
	  if (player === "ussr") { player = 1; }

          this.game.queue.splice(qe, 1);

          if (player == this.game.player) {
	    this.playerTurn(card);
	  } 

	  shd_continue = 0;

        }



        //
        // grainsales
        //
        if (mv[0] === "grainsales") {

          //
          // this is the ussr telling the
          // us what card they can choose
          //
          if (mv[1] == "ussr") {

            // remove the command triggering this
            this.game.queue.splice(qe, 1);

            if (this.game.player == 2) {

              let html  = "<div class='status-message' id='status-message'><span>Grain Sales pulls</span> <span class=\"showcard\" style=\"border-bottom: 1px dashed\" id=\""+mv[2]+"\">" + this.game.deck[0].cards[mv[2]].name + "</span> <span>from USSR. Do you want to play this card?</span>";
              if (mv[2] == "unintervention" && this.game.state.headline == 1) {} else {
                  html += '<ul><li class="card noncard" id="play">play card</li>';
              }
                  html += '<li class="card noncard" id="nope">return card</li>';
                  html += '</ul></div>';
              this.updateStatus(html);

              let twilight_self = this;

              twilight_self.addShowCardEvents(function(action2) {
                if (action2 == "play") {
                  // trigger play of selected card
                  twilight_self.addMove("resolve\tgrainsales");
                  twilight_self.playerTurn(mv[2]);
                }
                if (action2 == "nope") {
                  twilight_self.addMove("resolve\tgrainsales");
                  twilight_self.addMove("ops\tus\tgrainsales\t2");
                  twilight_self.addMove("grainsales\tus\t"+mv[2]);
                  twilight_self.endTurn();
                }
              });

            }
            shd_continue = 0;
          }

          //
          // this is the us telling the
          // ussr they are returning a
          // card
          //
          if (mv[1] == "us") {

            if (this.game.player == 1) {
              this.game.deck[0].hand.push(mv[2]);
            } else {

	      //
	      // us increases ussr cards in hand to avoid deal errors
	      //
              this.game.state.opponent_cards_in_hand++;
	    }

            this.game.queue.splice(qe, 1);
            shd_continue = 1;
          }
        }
        //
        // Stage
        //
        if (mv[0] == "stage") {
          this.game.queue.splice(qe, 1);
          shd_continue = 1;
        }
        //
        // Che
        //
        if (mv[0] == "checoup") {

          let target1 = mv[2];
          let original_us = this.countries[mv[2]].us;
          let twilight_self = this;
          let couppower = mv[3];

          //
          // this is the first coup, which runs on both
          // computers, so they can collectively see the
          // results.
          //
          twilight_self.playCoup("ussr", mv[2], couppower, function() {
            if (twilight_self.countries[mv[2]].us < original_us) {

              let valid_targets = 0;
              for (var i in twilight_self.countries) {
                let countryname = i;
                if ( twilight_self.countries[countryname].bg == 0 && (twilight_self.countries[countryname].region == "africa" || twilight_self.countries[countryname].region == "camerica" || twilight_self.countries[countryname].region == "samerica") && twilight_self.countries[countryname].us > 0 ) {
                  if (countryname !== target1) {
                    valid_targets++;
                  }
                }
              }

              if (valid_targets == 0) {
                twilight_self.updateLog("No valid targets for Che");
                twilight_self.game.queue.splice(qe, 1);
                shd_continue = 1;
                  } else {

                if (twilight_self.game.player == 1) {

                  twilight_self.addMove("resolve\tchecoup");
                  twilight_self.updateStatus("<div class='status-message' id='status-message'>Pick second target for coup:</div>");
                  twilight_self.playerFinishedPlacingInfluence();

                  let user_message = "<div class='status-message' id='status-message'>Che takes effect. Pick first target for coup:<ul>";
                      user_message += '<li class="card" id="skipche">or skip coup</li>';
                      user_message += '</ul></div>';
                  twilight_self.updateStatus(user_message);

		  twilight_self.addShowCardEvents(function(action2) {
                    if (action2 == "skipche") {
                      twilight_self.updateStatus("<div class='status-message' id='status-message'>Skipping Che coups...</div>");
                      twilight_self.addMove("resolve\tchecoup");
                      twilight_self.endTurn();
                    }
                  });

                  for (var i in twilight_self.countries) {
                    let countryname  = i;
                    let divname      = '#'+i;
                    if ( twilight_self.countries[countryname].bg == 0 && (twilight_self.countries[countryname].region == "africa" || twilight_self.countries[countryname].region == "camerica" || twilight_self.countries[countryname].region == "samerica") && countryname !== target1 && twilight_self.countries[countryname].us > 0) {
                      $(divname).off();
                      $(divname).on('click', function() {
                        let c = $(this).attr('id');
                        twilight_self.addMove("coup\tussr\t"+c+"\t"+couppower);
                        twilight_self.endTurn();
                      });
                    } else {
                      $(divname).off();
                      $(divname).on('click', function() {
                        // twilight_self.displayModal("Invalid Target");
                        twilight_self.displayModal("Invalid Target");
                      });
                    }
                  }
                }

                //
                // ussr will tell us who to coup next
                //
                twilight_self.game.queue.splice(qe, 1);
                shd_continue = 0;

              }


            } else {
              //
              // done
              //
              twilight_self.game.queue.splice(qe, 1);
              shd_continue = 1;
            }

          });

        }
        //
        // missileenvy \t sender \t card
        //
        if (mv[0] === "missileenvy") {

          let sender = mv[1];
          let card = mv[2];
          let receiver = "us";
          let discarder = "ussr";
          if (sender == 2) { receiver = "ussr"; discarder = "us"; }

console.log("CARD: " + card);

          this.game.state.events.missile_envy = sender;

          let opponent_card = 0;
          if (this.game.deck[0].cards[card].player == "us" && sender == 2) { opponent_card = 1; }
          if (this.game.deck[0].cards[card].player == "ussr" && sender == 1) { opponent_card = 1; }

          // remove missileenvy from queue
          this.game.queue.splice(qe, 1);

          //
          // play for ops
          //
          if (opponent_card == 1) {
            this.game.queue.push("discard\t"+discarder+"\t"+card);
            this.game.queue.push("ops\t"+receiver+"\t"+card+"\t"+this.game.deck[0].cards[card].ops);
            this.game.queue.push("notify\t"+discarder.toUpperCase() + " offers " + this.game.deck[0].cards[card].name + " for OPS");
          }

          //
          // or play for event
          //
          if (opponent_card == 0) {
            this.game.queue.push("discard\t"+discarder+"\t"+card);
            this.game.queue.push("event\t"+receiver+"\t"+card);
            this.game.queue.push("notify\t"+discarder.toUpperCase() + " offers " + this.game.deck[0].cards[card].name + " for EVENT");
          }

          //
          // remove card from hand
          //
          if (this.game.player == sender) {
            this.removeCardFromHand(card);
          }

          shd_continue = 1;

        }
        //
        // quagmire ussr/us card
        //
        if (mv[0] === "quagmire") {

          let roll = this.rollDice(6);

          this.updateLog(mv[1].toUpperCase() + " </span>rolls a<span> " + roll);

          if (roll < 5) {

            if (mv[1] == "ussr") {
              this.game.state.events.beartrap = 0;
              this.updateLog("Bear Trap ends");
            }
            if (mv[1] == "us") {
              this.game.state.events.quagmire = 0;
              this.updateLog("Quagmire ends");
            }

          } else {
            if (mv[1] == "ussr") {
              this.updateLog("Bear Trap continues...");
            }
            if (mv[1] == "us") {
              this.updateLog("Quagmire continues...");
            }
          }

          this.game.queue.splice(qe, 1);
          shd_continue = 1;

        }
        //
        // tehran
        //
        if (mv[0] == "tehran") {

          let twilight_self = this;
          let sender  = mv[1];
          let keysnum = mv[2];
          this.game.queue.splice(qe, 1);

          if (sender == "ussr") {

            //
            // ussr has sent keys to decrypt
            //
            if (this.game.player == 1) {

              for (let i = 0; i < keysnum; i++) { this.game.queue.splice(this.game.queue.length-1, 1); }
              shd_continue = 0;

            } else {

              //
              // us decrypts and decides what to toss
              //
              var cardoptions = [];
              var pos_to_discard = [];

              for (let i = 0; i < keysnum; i++) {
                cardoptions[i] = this.game.deck[0].crypt[i];
                cardoptions[i] = this.app.crypto.decodeXOR(cardoptions[i], this.game.deck[0].keys[i]);
              }
              for (let i = 0; i < keysnum; i++) {
                cardoptions[i] = this.app.crypto.decodeXOR(cardoptions[i], this.game.queue[this.game.queue.length-keysnum+i]);
                cardoptions[i] = this.app.crypto.hexToString(cardoptions[i]);
              }
              for (let i = 0; i < keysnum; i++) {
                this.game.queue.splice(this.game.queue.length-1, 1);
              }


              let user_message = "<div class='status-message' id='status-message'>Select cards to discard:<ul>";
              for (let i = 0; i < cardoptions.length; i++) {
                user_message += '<li class="card card_'+this.game.deck[0].crypt[i]+'" id="'+this.game.deck[0].crypt[i]+'_'+cardoptions[i]+'">'+this.game.deck[0].cards[cardoptions[i]].name+'</li>';
              }
              user_message += '</ul> When you are done discarding <span class="card dashed showcard nocard" id="finished">click here</span>.</div>';
              twilight_self.updateStatus(user_message);

              //
              // cardoptions is in proper order
              //
              let cards_discarded = 0;

	      twilight_self.addShowCardEvents(function(action2) {

                if (action2 == "finished") {

                  for (let i = 0; i < pos_to_discard.length; i++) { twilight_self.addMove(pos_to_discard[i]); }
                  twilight_self.addMove("tehran\tus\t"+cards_discarded);
                  twilight_self.endTurn();

                } else {

                  let tmpar = action2.split("_");

                  let id_to_remove = ".card_"+tmpar[0];
                  $(id_to_remove).hide();
                  pos_to_discard.push(tmpar[0]);
                  cards_discarded++;
                  twilight_self.addMove("discard\tus\t"+tmpar[1]);
                  twilight_self.addMove("notify\tUS discards <span class=\"logcard\" id=\""+tmpar[1]+"\">"+twilight_self.game.deck[0].cards[tmpar[1]].name +"</span>");

                }
              });
            }

            shd_continue = 0;

          } else {

            //
            // us has sent keys to discard back
            //
            let removedcard = [];
            for (let i = 0; i < keysnum; i++) {
              removedcard[i] = this.game.queue[this.game.queue.length-1];
              this.game.queue.splice(this.game.queue.length-1, 1);
            }

            for (let i = 0; i < 5; i++) {
              if (removedcard.includes(this.game.deck[0].crypt[i])) {
                //
                // set cards to zero
                //
                this.game.deck[0].crypt[i] = "";
                this.game.deck[0].keys[i] = "";
              }
            }

            //
            // remove empty elements
            //
            var newcards = [];
            var newkeys  = [];
            for (let i = 0; i < this.game.deck[0].crypt.length; i++) {
              if (this.game.deck[0].crypt[i] != "") {
                newcards.push(this.game.deck[0].crypt[i]);
                newkeys.push(this.game.deck[0].keys[i]);
              }
            }

            //
            // keys and cards refreshed
            //
            this.game.deck[0].crypt = newcards;
            this.game.deck[0].keys = newkeys;

          }
        }

        //
        // limit [restriction] [region]
        //
        if (mv[0] == "limit") {
          if (mv[1] == "china") { this.game.state.events.china_card_in_play = 1; }
          if (mv[1] == "coups") { this.game.state.limit_coups = 1; }
          if (mv[1] == "spacerace") { this.game.state.limit_spacerace = 1; }
          if (mv[1] == "realignments") { this.game.state.limit_realignments = 1; }
          if (mv[1] == "placement") { this.game.state.limit_placement = 1; }
          if (mv[1] == "milops") { this.game.state.limit_milops = 1; }
          if (mv[1] == "ignoredefcon") { this.game.state.limit_ignoredefcon = 1; }
          if (mv[1] == "region") { this.game.state.limit_region += mv[2]; }
          this.game.queue.splice(qe, 1);
        }
        if (mv[0] == "flush") {

          if (mv[1] == "discards") {
            this.game.deck[0].discards = {};
          }
          this.game.queue.splice(qe, 1);

        }
        //
        // latinamericandebtcrisis
        //
        if (mv[0] == "latinamericandebtcrisis") {

          let twilight_self = this;


          if (this.game.player == 2) {
            this.game.queue.splice(qe, 1);
            return 0;
          }

          if (this.game.player == 1) {

            this.game.queue.splice(qe, 1);

            let countries_to_double = 0;
            for (var i in this.countries) {
              if (this.countries[i].region == "samerica") {
                if (this.countries[i].ussr > 0) { countries_to_double++; }
              }
            }
            if (countries_to_double > 2) { countries_to_double = 2; }
            if (countries_to_double == 0) {
              this.addMove("notify\tUSSR has no countries with influence to double");
              this.endTurn();
              return 0;
            }


            this.updateStatus("<div class='status-message' id='status-message'><span>Select</span> "+countries_to_double+" <span>countries in South America to double USSR influence</span></div>");

            //
            // double influence in two countries
            //
            for (var i in this.countries) {

              let countryname  = i;
              let divname      = '#'+i;

              if (this.countries[i].region == "samerica") {

                if (this.countries[i].ussr > 0 ) {
                  twilight_self.countries[countryname].place = 1;
                }

                $(divname).off();
                $(divname).on('click', function() {

                  let countryname = $(this).attr('id');

                  if (twilight_self.countries[countryname].place == 1) {
                    let ops_to_place = twilight_self.countries[countryname].ussr;
                    twilight_self.placeInfluence(countryname, ops_to_place, "ussr", function() {
                      twilight_self.addMove("place\tussr\tussr\t"+countryname+"\t" + ops_to_place);
                      twilight_self.countries[countryname].place = 0;
                      countries_to_double--;
                      if (countries_to_double == 0) {
                        twilight_self.playerFinishedPlacingInfluence();
                        twilight_self.endTurn();
                      }
                    });
                  } else {
                    twilight_self.displayModal("InvalidTarget");
                  }
                });
              }
            }
          }
          return 0;
        }
        //
        // north sea oil bonus turn
        //
        if (mv[0] == "northsea") {
          if (this.game.player == 1) {
            let html  = "US determining whether to take extra turn";
            this.updateStatus(html);
          }
          if (this.game.player == 2) {
            let html  = "<span>Do you wish to take an extra turn:<span><ul>";
            html += '<li class="card" id="play">play turn</li>';
            html += '<li class="card" id="nope">no turn</li>';
            html += '</ul>';
            this.updateStatus(html);

            let twilight_self = this;

            twilight_self.addShowCardEvents(function(action2) {

              if (action2 == "play") {
                  twilight_self.addMove("resolve\tnorthsea");
                  twilight_self.addMove("play\t2");
                  twilight_self.endTurn();
              }
              if (action2 == "nope") {
                  twilight_self.addMove("resolve\tnorthsea");
                  twilight_self.addMove("play\t2");
                  twilight_self.endTurn();
              }

            });
          }
          shd_continue = 0;
        }
        //
        // space race  us/ussr card
        //
        if (mv[0] == "space") {
          this.playerSpaceCard(mv[2], mv[1]);
	  if (mv[2] != "china") {
            this.game.deck[0].discards[mv[2]] = this.game.deck[0].cards[mv[2]];
	  }
          this.game.queue.splice(qe, 1);
        }
        //
        // unlimit
        //
        if (mv[0] == "unlimit") {
          if (mv[1] == "china") { this.game.state.events_china_card_in_play = 0; }
          if (mv[1] == "cmc") { this.game.state.events.cubanmissilecrisis = 0; }
          if (mv[1] == "coups") { this.game.state.limit_coups = 0; }
          if (mv[1] == "spacerace") { this.game.state.limit_spacerace = 0; }
          if (mv[1] == "realignments") { this.game.state.limit_realignments = 0; }
          if (mv[1] == "placement") { this.game.state.limit_placement = 0; }
          if (mv[1] == "milops") { this.game.state.limit_milops = 0; }
          if (mv[1] == "ignoredefcon") { this.game.state.limit_ignoredefcon = 0; }
          if (mv[1] == "region") { this.game.state.limit_region = ""; }
          this.game.queue.splice(qe, 1);
        }
        //
        // chernobyl
        //
        if (mv[0] == "chernobyl") {
          this.game.state.events.chernobyl = mv[1];
          this.game.queue.splice(qe, 1);
        }
        //
        // burn die roll
        //
        if (mv[0] == "dice") {
          if (mv[1] == "burn") {
            if (this.game.player == 1 && mv[2] == "ussr") {
              roll = this.rollDice(6);
            }
            if (this.game.player == 2 && mv[2] == "us")   {
              roll = this.rollDice(6);
            }
          }
          this.game.queue.splice(qe, 1);
        }
        //
        // aldrich ames
        //
        if (mv[0] == "aldrichreveal") {

          if (this.game.player == 2) {

            let cards_to_reveal = this.game.deck[0].hand.length;
            let revealed = "";
            for (let i = 0; i < this.game.deck[0].hand.length; i++) {
              if (i > 0) { revealed += ", "; }
              revealed += this.game.deck[0].hand[i];
            }
            this.addMove("notify\tUS hand contains: "+revealed);
            this.endTurn();
          }

          this.game.queue.splice(qe, 1);
          return 0;

        }
        if (mv[0] == "aldrich") {

          //
          // us telling ussr their hand
          //
          if (mv[1] == "us") {

            let num = mv[2];
            let html = "<div class='status-message' id='status-message'><span>Aldrich Ames triggered. USSR discard card from US hand:<span><ul>";
            this.game.queue.splice(qe, 1);

            for (let i = 0; i < num; i++) {
              let uscard = this.game.queue[this.game.queue.length-1];
              html += '<li class="card showcard" id="'+uscard+'">'+this.game.deck[0].cards[uscard].name+'</li>';
              this.game.queue.splice(this.game.queue.length-1, 1);
            }
            html += '</ul></div>';

            if (this.game.player == 2) {
              this.updateStatus("<div class='status-message' id='status-message'>USSR is playing Aldrich Ames</div>");
            }

            if (this.game.player == 1) {

              this.updateStatus(html);

              let twilight_self = this;

              twilight_self.addShowCardEvents(function(action2) {
                twilight_self.addMove("aldrich\tussr\t"+action2);
                twilight_self.endTurn();
              });
            }

            shd_continue = 0;
          }


          if (mv[1] == "ussr") {

            if (this.game.player == 2) {
              this.removeCardFromHand(mv[2]);
            }

            this.game.queue.splice(qe, 1);
            this.updateLog("<span>USSR discards </span><span class=\"logcard\" id=\""+mv[2]+"\">"+this.game.deck[0].cards[mv[2]].name + "</span>");
            shd_continue = 1;
          }

        }
        //
        // cambridge five
        //
        if (mv[0] === "cambridge") {
          if (this.game.player == 1) {
            let placetxt = '<div class="status-message" id="status-message">' + player.toUpperCase() + " place 1 OP in";
            for (let b = 1; b < mv.length; b++) {
              placetxt += " ";
              placetxt += mv[b];
            }
	    placetxt += '</div>';
            twilight_self.updateStatus(placetxt);
            for (let i = 1; i < mv.length; i++) {
              for (var k in this.countries) {

                //
                // names of cards differ for these two. update so region matches
                //
                if (mv[i] == "centralamerica") { mv[i] = "camerica"; }
                if (mv[i] == "southamerica") { mv[i] = "samerica"; }

                if (this.countries[k].region.indexOf(mv[i]) > -1) {
                  let divname = "#"+k;
                  $(divname).off();
                  $(divname).on('click',function() {
                    let countryname = $(this).attr('id');
                    twilight_self.playerFinishedPlacingInfluence();
                    twilight_self.countries[countryname].ussr += 1;
                    twilight_self.showInfluence(countryname, "ussr");
                    twilight_self.addMove("place\tussr\tussr\t"+countryname+"\t1");
                    twilight_self.endTurn();
                  });
                }
              }
            }
          }
          this.game.queue.splice(qe, 1);
          shd_continue = 0;
        }
        //
        // tear down this wall
        //
        if (mv[0] === "teardownthiswall") {

          if (this.game.player == 1) {
            this.updateStatus("<div class='status-message' id='status-message'>US playing Tear Down This Wall</div>");
            return 0;

          }

          let user_message = "<div class='status-message' id='status-message'><span>Tear Down this Wall is played -- US may make 3 OP free Coup Attempt or Realignments in Europe.</span><ul>";
              user_message += '<li class="card" id="taketear"><span>make coup or realign</span></li>';
              user_message += '<li class="card" id="skiptear"><span>skip coup</span></li>';
              user_message += '</ul></div>';
          twilight_self.updateStatus(user_message);
          twilight_self.addShowCardEvents(function(action2) {

            if (action2 == "skiptear") {
              twilight_self.updateStatus("<div class='status-message' id='status-message'><span>Skipping Tear Down this Wall...</span></div>");
              twilight_self.addMove("resolve\tteardownthiswall");
              twilight_self.endTurn();
            }

            if (action2 == "taketear") {
              twilight_self.addMove("resolve\tteardownthiswall");
              twilight_self.addMove("unlimit\tignoredefcon");
              twilight_self.addMove("unlimit\tregion");
              twilight_self.addMove("unlimit\tplacement");
              twilight_self.addMove("unlimit\tmilops");
              twilight_self.addMove("ops\tus\tteardown\t3");
              twilight_self.addMove("limit\tmilops");
              twilight_self.addMove("limit\tplacement");
              twilight_self.addMove("limit\tregion\tasia");
              twilight_self.addMove("limit\tregion\tseasia");
              twilight_self.addMove("limit\tregion\tmideast");
              twilight_self.addMove("limit\tregion\tsamerica");
              twilight_self.addMove("limit\tregion\tcamerica");
              twilight_self.addMove("limit\tregion\tafrica");
              twilight_self.addMove("limit\tignoredefcon");
              twilight_self.endTurn();
            }

          });

          shd_continue = 0;

        }
        if (mv[0] === "deal") {
          if (this.game.player == mv[1]) {

            let cards_needed_per_player = 8;
            if (this.game.state.round >= 4) { cards_needed_per_player = 9; }

            let ussr_cards = this.game.deck[0].hand.length;
            for (let z = 0; z < this.game.deck[0].hand.length; z++) {
              if (this.game.deck[0].hand[z] == "china") {
                ussr_cards--;
              }
            }
            let us_cards   = this.game.state.opponent_cards_in_hand;

            if (this.game.player == 2) {
              let x = ussr_cards;
              ussr_cards = us_cards;
              us_cards = x;
            }

            let us_cards_needed = cards_needed_per_player - us_cards;
            let ussr_cards_needed = cards_needed_per_player - ussr_cards;
            reshuffle_limit = us_cards_needed + ussr_cards_needed;

            if (mv[1] == 1) {
              this.addMove("resolve\tdeal");
              this.addMove("DEAL\t1\t"+mv[1]+"\t"+ussr_cards_needed);
            } else {
              this.addMove("resolve\tdeal");
              this.addMove("DEAL\t1\t"+mv[1]+"\t"+us_cards_needed);
            }
            this.endTurn();
          } else {
            this.updateStatus("<div class='status-message' id='status-message'><span>Opponent is being dealt new cards.</span></div>");
          }
          this.updateStatus("<div class='status-message' id='status-message'>"+player.toUpperCase() + " <span>is fetching new cards</span></div>");
          return 0;
        }

        if (mv[0] === "ops") {

          if (this.game.deck[0].cards[mv[2]] != undefined) { this.game.state.event_name = this.game.deck[0].cards[mv[2]].name; }

          this.updateLog("<span>" + mv[1].toUpperCase() + " plays </span><span class=\"logcard\" id=\""+mv[2]+"\">" + this.game.state.event_name + "</span> <span>for " + mv[3] + " OPS</span>");

          // stats
          if (mv[1] == "us") { this.game.state.stats.us_ops += parseInt(mv[3]); }
          if (mv[1] == "ussr") { this.game.state.stats.ussr_ops += parseInt(mv[3]); }
	  if (this.game.deck[0].cards[mv[2]] != undefined) {
	    if (this.game.deck[0].cards[mv[2]].player == "us") {
	      if (mv[1] == "ussr") {
	        this.game.state.stats.ussr_us_ops += parseInt(mv[3]);
	      }
	      if (mv[1] == "us") {
	        this.game.state.stats.us_us_ops += parseInt(mv[3]);
	      }
	    }
	    if (this.game.deck[0].cards[mv[2]].player == "ussr") {
	      if (mv[1] == "ussr") {
	        this.game.state.stats.ussr_ussr_ops += parseInt(mv[3]);
	      }
	      if (mv[1] == "us") {
	        this.game.state.stats.us_ussr_ops += parseInt(mv[3]);
	      }
	    }
	    if (this.game.deck[0].cards[mv[2]].player == "both") {
	      if (mv[1] == "ussr") {
	        this.game.state.stats.ussr_neutral_ops += parseInt(mv[3]);
	      }
	      if (mv[1] == "us") {
	        this.game.state.stats.us_neutral_ops += parseInt(mv[3]);
	      }
	    }
	  }

          // unset formosan if China card played by US
          if (mv[1] == "us" && mv[2] == "china") {
            this.game.state.events.formosan = 0;
            $('.formosan').hide();
          }

          this.playOps(mv[1], mv[3], mv[2]);
          shd_continue = 0;
        }
        if (mv[0] === "milops") {
          this.updateLog(mv[1].toUpperCase() + "</span> <span>receives</span> <span>" + mv[2] + "</span> <span>milops");
          if (mv[1] === "us") {
            this.game.state.milops_us += parseInt(mv[2]);
          } else {
            this.game.state.milops_ussr += parseInt(mv[2]);
          }
          this.updateMilitaryOperations();
          this.game.queue.splice(qe, 1);
        }
        if (mv[0] === "vp") {
          if (mv.length > 3) {
            if (parseInt(mv[3]) == 1) {
              this.updateLog(mv[1].toUpperCase() + "</span> <span>receives</span> " + mv[2] + " <span>VP", this.log_length, 1);
              if (mv[1] === "us") {
                this.game.state.vp_outstanding += parseInt(mv[2]);
              } else {
                this.game.state.vp_outstanding -= parseInt(mv[2]);
              }
            } else {
              if (mv[1] === "us") {
                this.game.state.vp += parseInt(mv[2]);
              } else {
                this.game.state.vp -= parseInt(mv[2]);
              }
	   }
          } else {
            this.updateLog(mv[1].toUpperCase() + "</span> <span>receives</span> <span>" + mv[2] + "</span> <span>VP");
            if (mv[1] === "us") {
              this.game.state.vp += parseInt(mv[2]);
            } else {
              this.game.state.vp -= parseInt(mv[2]);
            }
            this.updateVictoryPoints();
          }
          this.game.queue.splice(qe, 1);
        }
        if (mv[0] === "coup") {

          let card = "";
          if (mv.length >= 5) { card = mv[4]; }

          this.updateLog("<span>" + mv[1].toUpperCase() + "</span> <span>coups</span> <span>" + this.countries[mv[2]].name + "</span> <span>with</span> <span>" + mv[3] + "</span> <span>OPS</span>");
          if (this.game.state.limit_milops != 1) {
            //
            // modify ops is handled incoherently with milops, so we calculate afresh here
            //
            // reason is that modify ops is run before submitting coups sometimes and sometimes now
            //
            if (card != "") {
              if (mv[1] == "us") { this.game.state.milops_us += this.modifyOps(parseInt(mv[3]), card, 2); }
              if (mv[1] == "ussr") { this.game.state.milops_ussr += this.modifyOps(parseInt(mv[3]), card, 1); }
            } else {
              if (mv[1] == "us") { this.game.state.milops_us += this.modifyOps(parseInt(mv[3]), "", 2); }
              if (mv[1] == "ussr") { this.game.state.milops_ussr += this.modifyOps(parseInt(mv[3]), "", 1); }
            }
            this.updateMilitaryOperations();
          }
          //
          // do not submit card, ops already modified
          //
          this.playCoup(mv[1], mv[2], mv[3]);
          this.game.queue.splice(qe, 1);
        }


        if (mv[0] === "realign") {
          this.updateLog("<span>" + mv[1].toUpperCase() + " <span>realigns</span> <span>" + this.countries[mv[2]].name + "</span> <span>with 1 OPS</span>");
          if (mv[1] != player) { this.playRealign(mv[2]); }
          this.game.queue.splice(qe, 1);
        }
        if (mv[0] === "defcon") {
          if (mv[1] == "lower") {
            this.lowerDefcon();
            if (this.game.state.defcon <= 0) {
              if (this.game.state.headline == 1) {
                if (this.game.state.player_to_go == 1) {
                  this.endGame("us", "headline defcon suicide!");
                } else {
                  this.endGame("ussr", "headline defcon suicide!");
                }
                return;
              }
              if (this.game.state.turn == 0) {
                this.endGame("ussr", "defcon");
              } else {
                this.endGame("us", "defcon");
              }
              return;
            }
          }
          if (mv[1] == "raise") {
              this.game.state.defcon++;
            if (this.game.state.defcon > 5) { this.game.state.defcon = 5; }
            this.updateDefcon();
          }
          this.game.queue.splice(qe, 1);
        }
        if (mv[0] === "notify") {
          this.updateLog(mv[1]);
          this.game.queue.splice(qe, 1);
        }
        if (mv[0] === "move") {
          if (mv[1] == "ussr") { this.game.state.move = 0; }
          if (mv[1] == "us") { this.game.state.move = 1; }
          this.game.queue.splice(qe, 1);
        }
        if (mv[0] === "event") {

          if (this.game.deck[0].cards[mv[2]] != undefined) { this.game.state.event_name = this.game.deck[0].cards[mv[2]].name; }
          this.updateLog("<span>" + mv[1].toUpperCase() + "</span> <span>triggers</span> <span class=\"logcard\" id=\""+mv[2]+"\">" + this.game.state.event_name + "</span> <span>event</span>");

          shd_continue = this.playEvent(mv[1], mv[2]);

          //
          // show active events
          //
          this.updateEventTiles();

          if (shd_continue == 0) {

            //
            // game will stop
            //
            //this.game.saveGame(this.game.id);

          } else {

            //
            // only continue if we do not stop
            //
            if (mv[1] == "china") {
            } else {

              //
              // remove non-recurring events from game
              //
              for (var i in this.game.deck[0].cards) {
                if (mv[2] == i) {
                  if (this.game.deck[0].cards[i].recurring != 1) {

                    let event_removal = 1;

                    //
                    // Wargames not removed if DEFCON > 2
                    //
                    if (this.game.state.defcon > 2 && mv[2] == "wargames") {
                      event_removal = 0;
                    }

                    //
                    // NATO not removed if prerequisitcs not met
                    //
                    if (this.game.state.events.nato == 0 && mv[2] == "nato") {
                      event_removal = 0;
                    }

                    //
                    // Solidarity not removed if Pope John Paul II not in play
                    //
                    if (this.game.state.events.johnpaul == 0 && mv[2] == "solidarity") {
                      event_removal = 0;
                    }

                    //
                    // Star Wars not removed if not triggered
                    //
                    if (this.game.state.events.starwars == 0 && mv[2] == "starwars") {
                      event_removal = 0;
                    }


                    //
                    // Our Man in Tehran not removed if not triggered
                    //
                    if (this.game.state.events.ourmanintehran == 0 && mv[2] == "ourmanintehran") {
                      event_removal = 0;
                    }


                    //
                    // Kitchen Debates not removed if not triggered
                    //
                    if (this.game.state.events.kitchendebates == 0 && mv[2] == "kitchendebates") {
                      event_removal = 0;
                    }


                    if (event_removal == 1) {

                      this.updateLog("<span>" + this.game.deck[0].cards[i].name + "</span> <span>removed from game</span>");
                      this.game.deck[0].removed[i] = this.game.deck[0].cards[i];
                      delete this.game.deck[0].cards[i];

                    } else {

                      // just discard -- NATO catch mostly
                      this.updateLog("<span>" + this.game.deck[0].cards[i].name + "</span> <span>discarded</span>");
                      this.game.deck[0].discards[i] = this.game.deck[0].cards[i];

                    }
                  } else {
                    this.updateLog("<span>" + this.game.deck[0].cards[i].name + "</span> <span>discarded</span>");
                    this.game.deck[0].discards[i] = this.game.deck[0].cards[i];
                  }
                }
              }
            }

            // delete event if not deleted already
            this.game.queue.splice(qe, 1);
          }
        }
        if (mv[0] === "stability") {
          let p = mv[1];
          let c = mv[2];
          let adj = parseInt(mv[3]);
	  if (this.countries[c] != undefined) {
	    this.countries[c].control += adj;
	    this.updateLog(this.countries[c].name + " stability is now " + this.countries[c].control);
	  }
          this.game.queue.splice(qe, 1);
        }
        if (mv[0] === "place") {
console.log("place: " + mv[1] + " -- " + player);
          if (player !== mv[1]) { this.placeInfluence(mv[3], parseInt(mv[4]), mv[2]); }
          this.game.queue.splice(qe, 1);
        }
        if (mv[0] === "setvar") {
          if (this.game.player != mv[1]) {
	    if (mv[2] == "opponent_cards_in_hand") {
              this.game.state.opponent_cards_in_hand = parseInt(mv[3]);
	    }
	    if (mv[3]) {
	      if (mv[3] == "back_button_cancelled") {
                this.game.state.back_button_cancelled = parseInt(mv[4]);
	      }
	    }
          }
          this.game.queue.splice(qe, 1);
        }
        if (mv[0] === "remove") {
          if (player != mv[1]) { this.removeInfluence(mv[3], parseInt(mv[4]), mv[2]); }
          this.showInfluence(mv[3], "us");
          this.showInfluence(mv[3], "ussr");
          this.game.queue.splice(qe, 1);
        }
        if (mv[0] === "resolve") {

          //
          // eliminate junta
          //
          if (mv[1] === "junta") { this.game.state.events.junta = 0; }

          if (qe == 0) {
              this.game.queue = [];
          } else {

            let le = qe-1;

            //
            // resolving UN intervention means disabling the effect
            //
            if (mv[1] == "unintervention") {

	      //
	      // if u2 in play, give extra VP
	      //
	      if (this.game.state.events.u2 == 1) {
		this.updateLog("USSR gains +1 VP bonus from U2 Intervention");
		this.game.state.vp--;
	        this.updateVictoryPoints();
	      }


              //
              // UNIntervention causing issues with USSR when US plays
              // force the event to reset in ALL circumstances
              //
              this.game.state.events.unintervention = 0;

              let lmv = this.game.queue[le].split("\t");
              if (lmv[0] == "event" && lmv[2] == mv[1]) {
                this.game.state.events.unintervention = 0;
              }

            }
            //
            // we can remove the event if it is immediately above us in the queue
            //
            if (le <= 0) {
              this.game.queue = ["round"]; // shd be first
            } else {

              let lmv = this.game.queue[le].split("\t");
              let rmvd = 0;


	      if (lmv[0] === "OBSERVER_CHECKPOINT" && le >= 1) {
		let tmp = this.game.queue[le];
	        this.game.queue[le] = this.game.queue[le-1];
		this.game.queue[le-1] = tmp; 		
                lmv = this.game.queue[le].split("\t");
console.log("re-arranged resolve to avoid OBSERVER MODE bug");
	      }


              if (lmv[0] == "headline" && mv[1] == "headline") {
                this.game.queue.splice(le, 2);
                rmvd = 1;
              }
              if (lmv[0] == "ops" && mv[1] == "ops") {
                this.game.queue.splice(le, 2);
                rmvd = 1;
              }
              if (lmv[0] == "play" && mv[1] == "play") {
                this.game.queue.splice(le, 2);
                rmvd = 1;
              }
              if (lmv[0] == "event" && lmv[2] == mv[1]) {
                this.game.queue.splice(le, 2);
                rmvd = 1;
              }
              if (lmv[0] == "placement" && mv[1] == "placement") {
                this.game.queue.splice(le, 2);
                rmvd = 1;
              }
              if (lmv[0] == "placement_bonus" && mv[1] == "placement_bonus") {
                this.game.queue.splice(le, 2);
                rmvd = 1;
              }
              if (lmv[0] == "deal" && mv[1] == "deal") {
                this.game.queue.splice(le, 2);
                rmvd = 1;
              }
              if (lmv[0] == "discard" && lmv[2] == mv[1]) {
                this.game.queue.splice(qe, 1);
                rmvd = 1;
              }
              if (lmv[0] === mv[1]) {	// "discard teardownthiswall"
                this.game.queue.splice(le, 2);
                rmvd = 1;
              }
              if (rmvd == 0) {

                //
                // remove the event
                //
                this.game.queue.splice(qe, 1);
                //
                // go back through the queue and remove the first event that matches this one
                //
                for (let z = le, zz = 1; z >= 0 && zz == 1; z--) {
                  let tmplmv = this.game.queue[z].split("\t");
                  if (tmplmv.length > 0) {
                    if (tmplmv[0] === "event") {
                      if (tmplmv.length > 2) {
                        if (tmplmv[2] === mv[1]) {
  console.log("resolving earlier: " + this.game.queue[z]);
                          this.game.queue.splice(z);
                          zz = 0;
                        }
                      }
                    }

		    //
 		    // may need to remove deal
		    //
                    if (tmplmv[0] === "deal" && mv[1] == "deal") {
                      this.game.queue.splice(z);
                      zz = 0;
		    }
                  }
                }
              }
            }
          }

          //
          // remove non-recurring events from game
          //
          for (var i in this.game.deck[0].cards) {
            if (mv[1] == i) {
              if (this.game.deck[0].cards[i].recurring != 1) {
                this.updateLog("<span>" + this.game.deck[0].cards[i].name + "</span> <span>removed from game</span>");
                this.game.deck[0].removed[i] = this.game.deck[0].cards[i];
                delete this.game.deck[0].cards[i];
              } else {
                this.updateLog("<span>" + this.game.deck[0].cards[i].name + "</span> <span>discarded</span>");
                this.game.deck[0].discards[i] = this.game.deck[0].cards[i];
              }
            }
          }


        }
        if (mv[0] === "placement") {

          //
          // TESTING
          //
          // if you want to hardcode the hands of the players, you can set
          // them manually here. Be sure that all of the cards have been
          // dealt ento the DECK during the setup phase though.
          //

          if (this.is_testing == 1) {
            if (this.game.player == 2) {
              this.game.deck[0].hand = ["redscare","wwby","duckandcover","degaulle","saltnegotiations","africa", "centralamerica", "europe", "asia"];
            } else {
              this.game.deck[0].hand = ["nato", "naziscientist", "brezhnev", "opec", "southamerica","opec", "cubanmissile","china","vietnamrevolts"];
            }
          }

          //
          // add china card
          //
          this.game.deck[0].cards["china"] = this.returnChinaCard();
          if (this.game.player == 1) {
            let hand_contains_china = 0;
            for (let x = 0; x < this.game.deck[0].hand.length; x++) {
              if (this.game.deck[0].hand[x] == "china") { hand_contains_china = 1; }
            }
            if (hand_contains_china == 0) {
              if (! this.game.deck[0].hand.includes("china")) {
                this.game.deck[0].hand.push("china");
              }
            }
          }

          if (mv[1] == 1) {
            if (this.game.player == mv[1]) {
              this.playerPlaceInitialInfluence("ussr");
            } else {
              this.updateStatusAndListCards('USSR is making its initial placement of influence:');
            }
          } else {
            if (this.game.player == mv[1]) {
              this.playerPlaceInitialInfluence("us");
            } else {
              this.updateStatusAndListCards('US is making its initial placement of influence:');
            }
          }

          //
          // do not remove from queue -- handle RESOLVE on endTurn submission
          //
          return 0;

        }
        if (mv[0] === "placement_bonus") {
          if (mv[1] == 1) {
            if (this.game.player == mv[1]) {
              this.playerPlaceBonusInfluence("ussr", mv[2]);
            } else {
              this.updateStatusAndListCards(`USSR is making its bonus placement of ${mv[2]} influence`);
            }
          } else {
            if (this.game.player == mv[1]) {
              this.playerPlaceBonusInfluence("us", mv[2]);
            } else {
              this.updateStatusAndListCards(`US is making its bonus placement of ${mv[2]} influence`);
            }
          }

          //
          // do not remove from queue -- handle RESOLVE on endTurn submission
          //
          return 0;

        }

        if (mv[0] === "headline") {

          let stage  = "headline1";
          let player = 1;
          let hash   = "";
          let xor    = "";
          let card   = "";

          if (mv.length > 2) {
            stage = mv[1];
            player = parseInt(mv[2]);
          }

          if (stage === "headline1") {
            this.game.state.defectors_pulled_in_headline = 0;
          }

          if (mv.length > 3) { hash = mv[3]; }
          if (mv.length > 4) { xor = mv[4]; }
          if (mv.length > 5) { card = mv[5]; }

          let x = this.playHeadlineModern(stage, player, hash, xor, card);

          //
          // do not remove from queue -- handle RESOLVE on endTurn submission
          //
          return 0;

        }
        if (mv[0] === "round") {


	  //
	  // china card is face-up
	  //
          this.game.state.events.china_card_facedown = 0;
	  if (this.game.player != 0) {
	    this.displayChinaCard();
	  }


          //
          // END OF HISTORY
          //
          this.game.state.events.inftreaty = 0;


          //
          // NORAD
          //
          if (this.game.state.us_defcon_bonus == 1) {
            if (this.isControlled("us", "canada") == 1) {

              let twilight_self = this;
              this.game.state.us_defcon_bonus = 0;

              if (this.game.player == 1) {
                this.updateStatus("<div class='status-message' id='status-message'>NORAD triggers: US places 1 influence in country with US influence</div>");
                this.updateLog("NORAD triggers: US places 1 influence in country with US influence");
                return 0;
              }
              if (this.game.player == 2) {
              this.updateLog("NORAD triggers: US places 1 influence in country with US influence");
                for (var i in this.countries) {

                  let countryname  = i;
                  let divname      = '#'+i;

                  if (this.countries[countryname].us > 0) {

                      this.updateStatus("<div class='status-message' id='status-message'>Place your NORAD bonus: (1 OP)</div>");

                      $(divname).off();
                      $(divname).on('click', function() {

                      // no need for this end-of-round
                      // twilight_self.addMove("resolve\tturn");

                      let countryname = $(this).attr('id');
                      twilight_self.addMove("place\tus\tus\t"+countryname+"\t1");
                      twilight_self.placeInfluence(countryname, 1, "us", function() {
                        twilight_self.playerFinishedPlacingInfluence();
                        twilight_self.endTurn();
                      });
                    });
                  }
                }
              }
              return 0;
            } else {
              this.game.state.us_defcon_bonus = 0;
            }
          }

          //
          // prevent DEFCON bonus from carrying over to next round
          //
          this.game.state.us_defcon_bonus = 0;


	  // STATS - aggregate the statisics
	  if (this.game.state.round > 1) {
	    this.game.state.stats.round.push({});
	    this.game.state.stats.round[this.game.state.stats.round.length-1].us_scorings = this.game.state.stats.us_scorings;
	    this.game.state.stats.round[this.game.state.stats.round.length-1].ussr_scorings = this.game.state.stats.ussr_scorings;
	    this.game.state.stats.round[this.game.state.stats.round.length-1].us_ops = this.game.state.stats.us_ops;
	    this.game.state.stats.round[this.game.state.stats.round.length-1].ussr_ops = this.game.state.stats.ussr_ops;
	    this.game.state.stats.round[this.game.state.stats.round.length-1].us_us_ops = this.game.state.stats.us_ops;
	    this.game.state.stats.round[this.game.state.stats.round.length-1].ussr_us_ops = this.game.state.stats.ussr_ussr_ops;
	    this.game.state.stats.round[this.game.state.stats.round.length-1].us_ussr_ops = this.game.state.stats.us_ussr_ops;
	    this.game.state.stats.round[this.game.state.stats.round.length-1].ussr_ussr_ops = this.game.state.stats.ussr_ussr_ops;
	    this.game.state.stats.round[this.game.state.stats.round.length-1].us_neutral_ops = this.game.state.stats.us_neutral_ops;
	    this.game.state.stats.round[this.game.state.stats.round.length-1].ussr_neutral_ops = this.game.state.stats.ussr_neutral_ops;
	    this.game.state.stats.round[this.game.state.stats.round.length-1].vp = this.game.state.vp;
	  }

          //
          // settle outstanding VP issue
          //
          this.settleVPOutstanding();


          //
          // show active events
          //
          this.updateEventTiles();

          if (this.game.state.events.northseaoil_bonus == 1) {

            this.game.state.events.northseaoil_bonus = 0;
            if (this.game.player == 1) {
              this.updateStatus("<div class='status-message' id='status-message'>US is deciding whether to take extra turn</div>");
              return 0;
            }

            //
            // US gets extra move
            //
            let html  = "<div class='status-message' id='status-message'><span>Do you want to take an extra turn: (North Sea Oil)</span><ul>";
                html += '<li class="card" id="play">play extra turn</li>';
                html += '<li class="card" id="nope">do not play</li>';
                html += '</ul></div>';
            this.updateStatus(html);

            let twilight_self = this;

            twilight_self.addShowCardEvents(function(action2) {

              if (action2 == "play") {
                twilight_self.addMove("play\t2");
                twilight_self.endTurn(1);
              }
              if (action2 == "nope") {
                twilight_self.addMove("notify\tUS does not play extra turn");
                twilight_self.endTurn(1);
              }

            });

            return 0;

          }

          //
          // Eagle Has Landed
          //
          if (this.game.state.eagle_has_landed != "" && this.game.state.eagle_has_landed_bonus_taken == 0 && this.game.state.round > 0) {

            this.game.state.eagle_has_landed_bonus_taken = 1;

            let bonus_player = 1;
            if (this.game.state.eagle_has_landed == "us") { bonus_player = 2; }

            if (this.game.player != bonus_player) {
              this.updateStatus('div class="status-message" id="status-message">' + this.game.state.eagle_has_landed.toUpperCase() + " </span> <span>is deciding whether to discard a card</div>");
              return 0;
            }

	    let available_cards = [];
	    for (let i = 0; i < this.game.deck[0].hand.length; i++) {
	      let thiscard = this.game.deck[0].hand[i];
	      if (thiscard != "europe" && thiscard != "asia" && thiscard != "mideast" && thiscard != "seasia" && thiscard != "centralamerica" && thiscard != "southamerica" && thiscard != "africa" && thiscard != "china") {
	        available_cards.push(thiscard);
	      }
	    }

	    //
            // if we have no cards, skip
	    //
            if (available_cards.length == 0) {
	      this.updateLog("No cards in hand, skipping end-of-turn discard");
	      this.addMove("notify\tSkipping Eagle / Bear has Landed");
	      this.endTurn();
	      return 0;
  	    }

            //
            // DISCARD CARD
            //
            let html  = '<div id="status-message" class="status-message">US may discard a card: (Eagle Has Landed)<ul>';
            if (bonus_player == 1) { html  = '<div id="status-message" class="status-message">USSR may discard a card: (Bear Has Landed)<ul>'; }
                html += '<li class="card" id="discard">discard card</li>';
                html += '<li class="card" id="nope">do not discard</li>';
                html += '</ul>';
                html += '</div>';
            this.updateStatus(html);

            let twilight_self = this;
	    
            twilight_self.addShowCardEvents(function(action2) {

              if (action2 == "nope") {
                twilight_self.addMove("notify\t"+twilight_self.game.state.eagle_has_landed.toUpperCase()+" does not discard a card");
                twilight_self.endTurn(1);
              }

              if (action2 == "discard") {

                let cards_discarded = 0;

                let cards_to_discard = 0;
                let user_message = "<div class='status-message' id='status-message'><span>Select card to discard:</span><ul>";
                for (let i = 0; i < available_cards.length; i++) {
                  user_message += '<li class="card showcard" id="'+available_cards[i]+'">'+twilight_self.game.deck[0].cards[available_cards[i]].name+'</li>';
                  cards_to_discard++;
                }

                if (cards_to_discard == 0) {
                  twilight_self.updateStatus("<div class='status-message' id='status-message'><span>No cards available to discard! Please wait for next turn...</span></div>");
                  twilight_self.addMove("notify\tUS has no cards available to discard");
                  twilight_self.endTurn(1);
                  return;
                }

                user_message += '</ul> </span>If you wish to cancel your discard,</span> <span class="card dashed showcard nocard" id="finished">click here</span>.</div>';
                twilight_self.updateStatus(user_message);

                twilight_self.addShowCardEvents(function(action2) {
                  if (action2 == "finished") {
                    twilight_self.endTurn(1);
                  } else {
                    $(action2).hide();
                    twilight_self.hideCard();
                    twilight_self.updateStatus("<div class='status-message' id='status-message'>Discarding...</div>");
                    cards_discarded++;
                    twilight_self.removeCardFromHand(action2);
                    twilight_self.addMove("discard\t"+twilight_self.game.state.eagle_has_landed+"\t"+action2);
                    twilight_self.addMove("notify\t"+twilight_self.game.state.eagle_has_landed.toUpperCase()+" discards <span class=\"logcard\" id=\""+action2+"\">"+twilight_self.game.deck[0].cards[action2].name + "</span>");
                    twilight_self.endTurn(1);
                    return 0;
                  }
                });
              }

              return 0;

            });
            return 0;

          }




          //
          // Space Shuttle
          //
          if (this.game.state.space_shuttle != "" && this.game.state.space_shuttle_bonus_taken == 0 && this.game.state.round > 0) {

            this.game.state.space_shuttle_bonus_taken = 1;

            let bonus_player = 1;
            if (this.game.state.space_shuttle == "us") { bonus_player = 2; }

            if (this.game.player != bonus_player) {
              this.updateStatus(this.game.state.space_shuttle.toUpperCase() + "</span> <span>is deciding whether to take extra turn");
              return 0;
            }

            //
            // player gets extra move
            //
            let html  = "<span>Do you want to take an extra turn: (Space Shuttle)</span><ul>";
                html += '<li class="card" id="play">play extra turn</li>';
                html += '<li class="card" id="nope">do not play</li>';
                html += '</ul>';
            this.updateStatus(html);

            let twilight_self = this;

            twilight_self.addShowCardEvents(function(action2) {

              if (action2 == "play") {
                twilight_self.addMove("play\t"+bonus_player);
                twilight_self.endTurn(1);
              }
              if (action2 == "nope") {
                twilight_self.addMove("notify\t"+twilight_self.game.state.space_shuttle.toUpperCase()+" does not play extra turn");
                twilight_self.endTurn(1);
              }

            });

            return 0;

          }



          //
          // if we have come this far, move to the next turn
          //
          if (this.game.state.round > 0) {
            this.updateLog("End of Round");
          }
          this.endRound();

          this.updateStatus("<div class='status-message' id='status-message'><span>Preparing for round</span> " + this.game.state.round+"</div>");

          let rounds_in_turn = 6;
          if (this.game.state.round > 3) { rounds_in_turn = 7; }

          for (let i = 0; i < rounds_in_turn; i++) {
            this.game.queue.push("turn");
            this.game.queue.push("play\t2");
            this.game.queue.push("play\t1");
          }
          this.game.queue.push("headline");
          this.game.queue.push("update_observers\t2");
          this.game.queue.push("update_observers\t1");
          this.game.state.headline = 0;


          //
          // END GAME IF WE MAKE IT !
          //
          if (this.game.state.round == 11) {
            this.finalScoring();
          }


          //
          // DEAL MISSING CARDS
          //
          if (this.game.state.round > 1) {

            this.updateLog(this.game.deck[0].crypt.length + " <span>cards remaining in deck...</span>");

            this.game.queue.push("deal\t2");
            this.game.queue.push("deal\t1");

            let reshuffle_limit = 14;

            let cards_needed_per_player = 8;
            if (this.game.state.round >= 4) { cards_needed_per_player = 9; }

            let ussr_cards = this.game.deck[0].hand.length;
            for (let z = 0; z < this.game.deck[0].hand.length; z++) {
              if (this.game.deck[0].hand[z] == "china") {
                ussr_cards--;
              }
            }
            let us_cards   = this.game.state.opponent_cards_in_hand;

            if (this.game.player == 2) {
              let x = ussr_cards;
              ussr_cards = us_cards;
              us_cards = x;
            }

            let us_cards_needed = cards_needed_per_player - us_cards;
            let ussr_cards_needed = cards_needed_per_player - ussr_cards;
            reshuffle_limit = us_cards_needed + ussr_cards_needed;

            if (this.game.deck[0].crypt.length < reshuffle_limit) {

              //
              // no need to reshuffle in turn 4 or 8 as we have new cards inbound
              //
              if (this.game.state.round != 4 && this.game.state.round != 8) {

                //
                // this resets discards = {} so that DECKBACKUP will not retain
                //
                let discarded_cards = this.returnDiscardedCards();


		//
		// shuttle diplomacy
		//
       		if (this.game.state.events.shuttlediplomacy == 1) {
		  if (discarded_cards['shuttle'] != undefined) {
		    delete discarded_cards['shuttle'];
		  }
		}


                if (Object.keys(discarded_cards).length > 0) {

                  //
                  // shuffle in discarded cards
                  //
                  this.game.queue.push("SHUFFLE\t1");
                  this.game.queue.push("DECKRESTORE\t1");
                  this.game.queue.push("DECKENCRYPT\t1\t2");
                  this.game.queue.push("DECKENCRYPT\t1\t1");
                  this.game.queue.push("DECKXOR\t1\t2");
                  this.game.queue.push("DECKXOR\t1\t1");
                  this.game.queue.push("DECK\t1\t"+JSON.stringify(discarded_cards));
                  this.game.queue.push("DECKBACKUP\t1");
                  this.updateLog("Shuffling discarded cards back into the deck...");

                }

                //
                // deal existing cards before
                // we shuffle the discards into the
                // deck
                //
                let cards_available = this.game.deck[0].crypt.length;
                let player2_cards = Math.floor(cards_available / 2);
                let player1_cards = cards_available - player2_cards;;

                //
                // adjust distribution of cards
                //
                if (player2_cards > us_cards_needed) {
                  let surplus_cards = player2_cards - us_cards_needed;
                  player2_cards = us_cards_needed;
                  player1_cards += surplus_cards;
                }

                if (player1_cards > ussr_cards_needed) {
                  let surplus_cards = player1_cards - ussr_cards_needed;
                  player1_cards = ussr_cards_needed;
                  player2_cards += surplus_cards;
                }

                if (player1_cards > 0) {
                  this.game.queue.push("DEAL\t1\t2\t"+player2_cards);
                  this.game.queue.push("DEAL\t1\t1\t"+player1_cards);
                }
                this.updateStatus("<div class='status-message' id='status-message'>Dealing remaining cards from draw deck before reshuffling...</div>");
                this.updateLog("Dealing remaining cards from draw deck before reshuffling...");

              }

            }


            if (this.game.state.round == 4) {

              this.game.queue.push("SHUFFLE\t1");
              this.game.queue.push("DECKRESTORE\t1");
              this.game.queue.push("DECKENCRYPT\t1\t2");
              this.game.queue.push("DECKENCRYPT\t1\t1");
              this.game.queue.push("DECKXOR\t1\t2");
              this.game.queue.push("DECKXOR\t1\t1");
              this.game.queue.push("DECK\t1\t"+JSON.stringify(this.returnMidWarCards()));
              this.game.queue.push("DECKBACKUP\t1");
              this.updateLog("Adding Mid War cards to the deck...");

            }

            if (this.game.state.round == 8) {

              this.game.queue.push("SHUFFLE\t1");
              this.game.queue.push("DECKRESTORE\t1");
              this.game.queue.push("DECKENCRYPT\t1\t2");
              this.game.queue.push("DECKENCRYPT\t1\t1");
              this.game.queue.push("DECKXOR\t1\t2");
              this.game.queue.push("DECKXOR\t1\t1");
              this.game.queue.push("DECK\t1\t"+JSON.stringify(this.returnLateWarCards()));
              this.game.queue.push("DECKBACKUP\t1");
              this.updateLog("Adding Late War cards to the deck...");

            }
          }

          return 1;
        }
        if (mv[0] === "play") {

if (this.game.player == 0) {
  this.game.queue.push("OBSERVER_CHECKPOINT");
}

          //
          // copy for reversion
          //
          try {
            start_turn_game_state = JSON.parse(JSON.stringify(this.game.state));
            start_turn_game_queue = JSON.parse(JSON.stringify(this.game.queue));
          } catch (err) {
            start_turn_game_state = null;
            start_turn_game_queue = null;
          }

          //
          // it is no longer the headline
          //
          this.game.state.headline = 0;

          //
          // resolve outstanding VP
          //
          this.settleVPOutstanding();

          //
          // show active events
          //
          this.updateEventTiles();


          if (mv[1] == 1) {
            this.game.state.turn = 0;
          }
          if (mv[1] == 2) { this.game.state.turn = 1; }

          //
          // deactivate cards
          //
          this.game.state.events.china_card_eligible = 0;
	  this.displayChinaCard();

          //
          // back button functions again
          //
          this.game.state.back_button_cancelled = 0;

          //
          // NORAD
          //
          if (this.game.state.us_defcon_bonus == 1) {
            if (this.isControlled("us", "canada") == 1) {

              let twilight_self = this;
              this.game.state.us_defcon_bonus = 0;

              if (this.game.player == 1) {
                this.updateStatus("<div class='status-message' id='status-message'>NORAD triggers: US places 1 influence in country with US influence</div>");
                this.updateLog("NORAD triggers: US places 1 influence in country with US influence");
                return 0;
              }
              if (this.game.player == 2) {
              this.updateLog("NORAD triggers: US places 1 influence in country with US influence");
                for (var i in this.countries) {

                  let countryname  = i;
                  let divname      = '#'+i;

                  if (this.countries[countryname].us > 0) {

                      this.updateStatus("<div class='status-message' id='status-message'>US place NORAD bonus: (1 OP)</div>");

                      $(divname).off();
                      $(divname).on('click', function() {

                      twilight_self.addMove("resolve\tturn");

                      let countryname = $(this).attr('id');
                      twilight_self.addMove("place\tus\tus\t"+countryname+"\t1");
                      twilight_self.placeInfluence(countryname, 1, "us", function() {
                        twilight_self.playerFinishedPlacingInfluence();
                        twilight_self.endTurn();
                      });
                    });
                  }
                }
              }
              return 0;
            } else {
              this.game.state.us_defcon_bonus = 0;
            }
          }

          this.updateDefcon();
          this.updateActionRound();
          this.updateSpaceRace();
          this.updateVictoryPoints();
          this.updateMilitaryOperations();
          this.updateRound();

          this.playMove();
          return 0;
        }


        //
        // avoid infinite loops
        //
        if (shd_continue == 0) {
          console.log("NOT CONTINUING");
          return 0;
        }


    } // if cards in queue
    return 1;

  }





  playHeadlineModern(stage, player, hash="", xor="", card="") {

    if (this.game.player === 0) {
      this.updateLog("Processing Headline Cards...");
      return;
    }


    this.game.state.headline = 1;

    //
    // NO HEADLINE PEEKING
    //
    if (this.game.state.man_in_earth_orbit == "") {

      //
      // USSR picks
      //
      if (stage == "headline1") {

        //
        // both players reset headline info
        //
        this.game.state.headline_hash  		= "";
        this.game.state.headline_xor   		= "";
        this.game.state.headline_card  		= "";
        this.game.state.headline_opponent_hash  	= "";
        this.game.state.headline_opponent_xor   	= "";
        this.game.state.headline_opponent_card  	= "";

        if (this.game.player == player) {
          this.updateLog("USSR selecting headline card");
          this.addMove("resolve\theadline");
          this.playerPickHeadlineCard();
        } else {
          this.updateStatusAndListCards(`Waiting for USSR to pick headline card`);
        }

        return 0;
      }

      //
      // US picks
      //
      if (stage == "headline2") {
        if (this.game.player == player) {

          this.game.state.headline_opponent_hash = hash;
          this.updateLog("US selecting headline card");
          this.addMove("resolve\theadline");
          this.playerPickHeadlineCard();

        } else {

          this.updateStatusAndListCards(`Waiting for US to pick headline card`);

        }
        return 0;
      }


      //
      // USSR sends XOR
      //
      if (stage == "headline3") {
        if (this.game.player == player) {

          this.game.state.headline_opponent_hash = hash;
          this.updateLog("Initiating blind headline card swap");
          this.addMove("resolve\theadline");
          this.addMove("headline\theadline4\t"+2+"\t"+this.game.state.headline_hash+"\t"+this.game.state.headline_xor+"\t"+this.game.state.headline_card);
          this.endTurn();

        } else {
          this.updateLog("Waiting for USSR to confirm card selection");
        }
        return 0;
      }


      //
      // US confirms USSR XOR and sends its XOR
      //
      if (stage == "headline4") {
        if (this.game.player == player) {

          this.game.state.headline_opponent_xor  = xor;
          this.game.state.headline_opponent_card = card;

          if (this.game.state.headline_opponent_hash != this.app.crypto.encodeXOR(this.app.crypto.stringToHex(this.game.state.headline_opponent_card), this.game.state.headline_opponent_xor)) {
            alert("PLAYER 1 HASH WRONG: -- this is a development error message that can be triggered if the opponent attempts to cheat by changing their selected card after sharing the encrypted hash. It can also be rarely caused if one or both players reload or have unreliable connections during the headline exchange process. The solution in this case is for both players to reload until the game hits the first turn. " + this.game.state.headline_opponent_hash + " -- " + this.game.state.headline_opponent_card + " -- " + this.game.state.headline_opponent_xor + " -- " + this.app.crypto.encodeXOR(this.app.crypto.stringToHex(this.game.state.headline_opponent_card), this.game.state.headline_opponent_xor));
          }

          this.updateLog("Initiating blind headline card swap");
          this.addMove("resolve\theadline");
          this.addMove("headline\theadline5\t"+1+"\t"+this.game.state.headline_hash+"\t"+this.game.state.headline_xor+"\t"+this.game.state.headline_card);
          this.endTurn();

        } else {

          this.updateLog("Waiting for US to confirm card selection");

        }
        return 0;
      }


      //
      // USSR confirms US XOR
      //
      if (stage == "headline5") {

        if (this.game.player == 0) {
    	  this.updateLog("Observer Mode does not handle headlines well...");
	  this.game.queue.splice(this.game.queue.length-1, 1);
	  return 1;
        }

        if (this.game.player == player) {


          this.game.state.headline_opponent_xor  = xor;
          this.game.state.headline_opponent_card = card;

          if (this.game.state.headline_opponent_hash != this.app.crypto.encodeXOR(this.app.crypto.stringToHex(this.game.state.headline_opponent_card), this.game.state.headline_opponent_xor)) {
            alert("PLAYER 2 HASH WRONG: -- this is a development error message that can be triggered if the opponent attempts to cheat by changing their selected card after sharing the encrypted hash. It can also be rarely caused if one or both players reload or have unreliable connections during the headline exchange process. The solution in this case is for both players to reload until the game hits the first turn. " + this.game.state.headline_opponent_hash + " -- " + this.game.state.headline_opponent_card + " -- " + this.game.state.headline_opponent_xor + " -- " + this.app.crypto.encodeXOR(this.app.crypto.stringToHex(this.game.state.headline_opponent_card), this.game.state.headline_opponent_xor));
          }

          this.updateLog("Initiating blind headline card swap");

          this.addMove("resolve\theadline");
          this.addMove("headline\theadline6\t"+2+"\t"+this.game.state.headline_hash+"\t"+this.game.state.headline_xor+"\t"+this.game.state.headline_card);
          this.endTurn();

        } else {
          this.updateLog("Waiting for US to confirm card selection");
        }
        return 0;
      }
    } // end man-in-earth orbit




    //
    // man in earth orbit = HEADLINE PEEKING
    //
    else {

      //
      // first remember we are in the headline phase
      //
      this.game.state.headline = 1;

      let first_picker = 2;
      let second_picker = 1;
      let playerside = "US";

      if (this.game.state.man_in_earth_orbit === "us") { first_picker = 1; second_picker = 2; playerside = "USSR"; }


      //
      // first player sends card
      //
      if (stage == "headline1") {

        if (this.game.player == first_picker) {
          this.updateLog(playerside + " selecting headline card first");
          this.addMove("resolve\theadline");
          this.playerPickHeadlineCard();
        } else {
          this.updateStatusAndListCards(playerside + ' picks headline card first');
        }
        return 0;

      }



      //
      // second player sends card
      //
      if (stage == "headline2") {

        if (this.game.player == second_picker) {

          this.game.state.headline_opponent_hash = hash;
          this.game.state.headline_opponent_xor = xor;
          this.game.state.headline_opponent_card = card;

          this.updateLog(playerside + " selecting headline card player");
          this.addMove("resolve\theadline");
          this.playerPickHeadlineCard();

        } else {
          this.updateStatusAndListCards('Opponent picking headline card second');
        }
        return 0;

      }

      //
      // first player gets second player pick, then we move on....
      //
      if (stage == "headline3") {

        if (this.game.player == first_picker) {
          this.game.state.headline_opponent_hash = hash;
          this.game.state.headline_opponent_xor = xor;
          this.game.state.headline_opponent_card = card;
        }

        stage = "headline6";

      }

    } // end man-in-earth-orbit









    //
    // default to ussr
    //
    this.game.state.player_to_go = 1;

    //
    // headline execution starts here
    //
    if (stage == "headline6") {

      this.updateLog("Moving into first headline card event");

      let my_card = this.game.state.headline_card;
      let opponent_card = this.game.state.headline_opponent_card;

      //
      // observer mode
      //
      if (this.game.player == 0) {
	this.updateLog("Observer Mode does not handle headlines well...");
	this.game.queue.splice(this.game.queue.length-1, 1);
	return 1;
      }


      if (this.game.player == 1) {
        if (this.returnOpsOfCard(my_card) > this.returnOpsOfCard(opponent_card)) {
          this.game.state.player_to_go = 1;
        } else {
          this.game.state.player_to_go = 2;
        }
      }
      if (this.game.player == 2) {
        if (this.returnOpsOfCard(my_card) >= this.returnOpsOfCard(opponent_card)) {
          this.game.state.player_to_go = 2;
        } else {
          this.game.state.player_to_go = 1;
        }
      }

      let player = "ussr";
      let opponent = "us";
      if (this.game.player == 2) { player = "us"; opponent = "ussr"; }
      let card_player = player;

      //
      // headline4 is our FIRST headline card
      // headline5 is our SECOND headline card
      //
      let shd_continue = 1;

      //
      // check to see if defectors is live
      //
      let us_plays_defectors = 0;
      let ussr_plays_defectors = 0;

      if (my_card == "defectors") {
        if (opponent == "ussr") {
          us_plays_defectors = 1;
        }
        if (opponent == "us") {
          ussr_plays_defectors = 1;
        }
      } else {
        if (opponent_card == "defectors") {
          if (opponent == "ussr") {
              ussr_plays_defectors = 1;
          }
          if (opponent == "us") {
              us_plays_defectors = 1;
          }
        }
      }


      if (us_plays_defectors == 1) {

        this.updateLog("<span>US headlines</span> <span class=\"logcard\" id=\"defectors\">Defectors</span>");

        this.game.turn = [];
        if (my_card != "defectors") {
          this.updateLog("<span>USSR headlines</span> <span class=\"logcard\" id=\""+my_card+"\">"+this.game.deck[0].cards[my_card].name+"</span>");
        } else {
          this.updateLog("<span>USSR headlines</span> <span class=\"logcard\" id=\""+opponent_card+"\">"+this.game.deck[0].cards[opponent_card].name+"</span>");
        }

        this.updateLog("Defectors cancels USSR headline.");
        this.updateStatus("<div class='status-message' id='status-message'>Defectors cancels USSR headline. Moving into first turn...</div>");

        //
        // only one player should trigger next round
        //
        if (this.game.player == 1) {
          this.addMove("resolve\theadline");
          this.addMove("discard\tus\tdefectors");
          this.addMove("discard\tussr\t"+my_card);
          this.endTurn();
        }

      } else {

        // show headline card information to both players
        if (this.game.player == 1) {
          this.updateStatus("<div class='status-message' id='status-message'><span>US headlines</span> <span class=\"showcard\" id=\""+opponent_card+"\">"+this.game.deck[0].cards[opponent_card].name+"</span>. USSR headlines <span class=\"showcard\" id=\""+my_card+"\">"+this.game.deck[0].cards[my_card].name+"</span></div>");
          this.updateLog("<span>US headlines</span> <span class=\"logcard\" id=\""+opponent_card+"\">"+this.game.deck[0].cards[opponent_card].name+"</span>.");
          this.updateLog("<span>USSR headlines</span> <span class=\"logcard\" id=\""+my_card+"\">"+this.game.deck[0].cards[my_card].name+"</span>");
        } else {
          this.updateStatus("<div class='status-message' id='status-message'><span>USSR headlines</span> <span class=\"showcard\" id=\""+opponent_card+"\">"+this.game.deck[0].cards[opponent_card].name+"</span>. US headlines <span class=\"showcard\" id=\""+my_card+"\">"+this.game.deck[0].cards[my_card].name+"</span></div>");
          this.updateLog("<span>USSR headlines <span class=\"logcard\" id=\""+opponent_card+"\">"+this.game.deck[0].cards[opponent_card].name+"</span>.");
          this.updateLog("<span>US headlines <span class=\"logcard\" id=\""+my_card+"\">"+this.game.deck[0].cards[my_card].name+"</span>");
        }


        if (this.game.state.player_to_go == this.game.player) {
          this.addMove("resolve\theadline");
          this.addMove("headline\theadline7\t"+2+"\t"+this.game.state.headline_hash+"\t"+this.game.state.headline_xor+"\t"+this.game.state.headline_card);
          this.addMove("event\t"+card_player+"\t"+my_card);
//          this.addMove("discard\t"+card_player+"\t"+my_card);
//          this.addMove("discard\t"+opponent+"\t"+opponent_card);
          this.removeCardFromHand(my_card);
          this.endTurn();
        }
      }
      return 0;
    }




    //
    // second player plays headline card
    //
    if (stage == "headline7") {

      let my_card = this.game.state.headline_card;
      let opponent_card = this.game.state.headline_opponent_card;

      //
      // observer mode
      //
      if (this.game.player == 0) {
	this.updateLog("Observer Mode does not handle headlines well...");
	this.game.queue.splice(this.game.queue.length-1, 1); // get rid of headline // we have already executed the event
	return 1;
      }


      //
      // we switch to the other player now
      //
      if (this.game.player == 1) {
        if (this.game.deck[0].cards[my_card] == undefined) { this.game.state.player_to_go = 2; } else {
          if (this.game.deck[0].cards[opponent_card] == undefined) { this.game.state.player_to_go = 1; } else {
            if (this.returnOpsOfCard(my_card) > this.returnOpsOfCard(opponent_card)) {
              this.game.state.player_to_go = 2;
            } else {
              this.game.state.player_to_go = 1;
            }
          }
        }
      }

      if (this.game.player == 2) {
        if (this.game.deck[0].cards[my_card] == undefined) { this.game.state.player_to_go = 1; } else {
          if (this.game.deck[0].cards[opponent_card] == undefined) { this.game.state.player_to_go = 2; } else {
            if (this.returnOpsOfCard(my_card) >= this.returnOpsOfCard(opponent_card)) {
              this.game.state.player_to_go = 1;
            } else {
              this.game.state.player_to_go = 2;
            }
            }
        }
      }


      let player = "ussr";
      let opponent = "us";
      if (this.game.player == 2) { player = "us"; opponent = "ussr"; }
      let card_player = player;

      if (player == "ussr" && this.game.state.defectors_pulled_in_headline == 1) {
        if (this.game.state.player_to_go == this.game.player) {
          this.addMove("resolve\theadline");
          this.addMove("notify\tDefectors cancels USSR headline. Tough luck, there.");
          this.removeCardFromHand(my_card);
          this.endTurn();
        }
      } else {
        if (this.game.state.player_to_go == this.game.player) {
          this.addMove("resolve\theadline");
          this.addMove("event\t"+card_player+"\t"+my_card);
          this.removeCardFromHand(my_card);
          this.endTurn();
        }
      }

      return 0;

    }

    return 1;
  }





  playMove() {

    this.game.state.headline  = 0;
    this.game.state.headline_hash = "";
    this.game.state.headline_card = "";
    this.game.state.headline_xor = "";
    this.game.state.headline_opponent_hash = "";
    this.game.state.headline_opponent_card = "";
    this.game.state.headline_opponent_xor = "";


    //
    // how many turns left?
    //
    let rounds_in_turn = 6;
    if (this.game.state.round > 3) { rounds_in_turn = 7; }
    let moves_remaining = rounds_in_turn - this.game.state.turn_in_round;


    //
    //
    //
    let scoring_cards_available = 0;
    for (i = 0; i < this.game.deck[0].hand.length; i++) {
      if (this.game.deck[0].cards[this.game.deck[0].hand[i]] != undefined) {
        if (this.game.deck[0].cards[this.game.deck[0].hand[i]].scoring == 1) { scoring_cards_available++; }
      }
    }


    //
    // player 1 moves
    //
    if (this.game.state.turn == 0) {
      if (this.game.player == 1) {
        if (this.game.state.turn_in_round == 0) {
          this.game.state.turn_in_round++;
          this.updateActionRound();
        }
        if (this.game.state.events.missile_envy == 1) {

          //
          // if must play scoring card -- moves remaining at 0 in last move
          //
          if (scoring_cards_available > moves_remaining) {
            this.playerTurn("scoringcard");
          } else {

            //
            // if cannot sacrifice missile envy to bear trap because red purged
            //
            if (this.game.state.events.beartrap == 1 && this.game.state.events.redscare_player1 >= 1) {
              this.playerTurn();
            } else {
              this.playerTurn("missileenvy");
            }
          }
        } else {
          this.playerTurn();
        }
      } else {
        this.updateStatusAndListCards(`Waiting for USSR to move`);
        if (this.game.state.turn_in_round == 0) {
          this.game.state.turn_in_round++;
          this.updateActionRound();
        }
      }
      return;
    }

    //
    // player 2 moves
    //
    if (this.game.state.turn == 1) {

      //
      // END OF HISTORY
      //
      if (this.game.state.events.greatsociety == 1) {

        this.game.state.events.greatsociety = 0;
	if (this.game.player == 2) {

	  let scoring_cards = [];
          for (let i = 0; i < this.game.deck[0].hand.length; i++) {
	    if (this.game.deck[0].cards[this.game.deck[0].hand[i]].scoring == 1) {
	      scoring_cards.push(this.game.deck[0].hand[i]);
	    }
	  }

	  let html = `<div class="status-message">Great Society is active. US may earn a VP for either skipping its turn or playing a scoring card:<ul>`;
	  if (scoring_cards.length > 0) { 
	    html += `
		<li class='card' id='scoring'>play scoring card</li>
		<li class='card' id='scoring_w_card'>play scoring card and draw card</li>
	    `;
	  }
	  html += `
		<li class='card' id='skip'>skip turn</li>
		<li class='card' id='skip_w_card'>skip turn and draw card</li>
	  `;
	  if (this.game.deck[0].hand.length > 0) {
	    html += `
		<li class='card' id='select'>select card</li>
	    `;
	  }
	  html += '</ul>';
	  html += '</div>';
	  this.updateStatus(html);

	  let twilight_self = this;

          twilight_self.addShowCardEvents(function(action2) {

            if (action2 === "select") {
	      twilight_self.updateStatus();
	      twilight_self.playerMove();
	      return;
            }
            if (action2 === "skip" || action2 === "skip_w_card") {
              twilight_self.addMove("resolve\tplay");
	      if (action2 === "skip_w_card") {
	        twilight_self.addMove("SAFEDEAL\t1\t2\t1");
	        twilight_self.addMove("notify\tUS is drawing a bonus card");
	      }
              twilight_self.addMove("vp\tus\t1\t0");
              twilight_self.addMove("notify\tUS skips a turn for 1 VP as a Great Society");
              twilight_self.endTurn();
            }
            if (action2 === "scoring" || action2 === "scoring_w_card") {
              twilight_self.addMove("resolve\tplay");
              twilight_self.addMove("vp\tus\t1\t0");
              twilight_self.addMove("notify\tUS plays a scoring card for 1 VP as a Great Society");
	      if (action2 === "scoring_w_card") {
	        twilight_self.addMove("SAFEDEAL\t1\t2\t1");
	        twilight_self.addMove("notify\tUS is drawing a bonus card");
	      }
              twilight_self.playerTurn("greatsociety");
            }
	  });

	  return 0;
	}
      }


      if (this.game.player == 2) {

        if (this.game.state.turn_in_round == 0) {
          this.removeCardFromHand(this.game.state.headline_card);
        }

        if (this.game.state.events.missile_envy == 2) {

          //
          // moves remaining will be 0 last turn
          //
          if (scoring_cards_available > moves_remaining) {
            this.playerTurn("scoringcard");
          } else {

            //
            // if cannot sacrifice missile envy to quagmire because red scare
            //
            if (this.game.state.events.quagmire == 1 && this.game.state.events.redscare_player2 >= 1) {
              this.playerTurn();
            } else {
              this.playerTurn("missileenvy");
            }

          }
        } else {
          this.playerTurn();
        }
      } else {
        // this.updateStatus("Waiting for US to move");
        this.updateStatusAndListCards(`Waiting for US to move`);
      }
      return;
    }


    return 1;

  }






  playOps(player, ops, card) {

    if (this.game.player == 0) { return; }

    let original_ops = ops;

    //
    // modify ops
    //
    ops = this.modifyOps(ops, card);

    let me = "ussr";
    let twilight_self = this;

    // reset events / DOM
    twilight_self.playerFinishedPlacingInfluence();

    if (this.game.player == 2) { me = "us"; }

    if (player === me) {

      let bind_back_button_state = true;
      if (twilight_self.game.state.event_before_ops == 1) { bind_back_button_state = false; }
      if (twilight_self.game.state.headline == 1) { bind_back_button_state = false; }
      if (twilight_self.game.state.back_button_cancelled == 1) { bind_back_button_state = false; }

      let html = twilight_self.formatPlayOpsStatus(player, ops, bind_back_button_state); // back button
      twilight_self.updateStatus(html);

      if (bind_back_button_state) {
        twilight_self.bindBackButtonFunction(() => {
          twilight_self.addMove("revert");
          twilight_self.endTurn();
  	  return;
        });
      }

      // TODO:
      twilight_self.addShowCardEvents(function(action2) {

        //
        // prevent ops hang
        //
        twilight_self.addMove("resolve\tops");

        //
        // Cuban Missile Crisis
        //
        if (action2 == "cancel_cmc") {

          this.moves = [];

          if (twilight_self.game.player == 1) {
            twilight_self.removeInfluence("cuba", 2, "ussr");
            twilight_self.addMove("ops\tussr\t"+card+"\t"+original_ops);
            twilight_self.addMove("remove\tussr\tussr\tcuba\t2");
            twilight_self.addMove("notify\tUSSR has cancelled the Cuban Missile Crisis");
            twilight_self.addMove("unlimit\tcmc");
            twilight_self.endTurn();
          } else {

            let user_message = "<div class='status-message' id='status-message'>Select country from which to remove influence:<ul>";
            if (twilight_self.countries['turkey'].us >= 2) {
              user_message += '<li class="card showcard" id="turkey">Turkey</li>';
            }
            if (twilight_self.countries['westgermany'].us >= 2) {
              user_message += '<li class="card showcard" id="westgermany">West Germany</li>';
            }
            user_message += '</ul></div>';
            twilight_self.updateStatus(user_message);
            twilight_self.addShowCardEvents(function(action2) {

              if (action2 === "turkey") {
                twilight_self.removeInfluence("turkey", 2, "us");
                twilight_self.addMove("ops\tus\t"+card+"\t"+original_ops);
                twilight_self.addMove("remove\tus\tus\tturkey\t2");
                twilight_self.addMove("unlimit\tcmc");
                twilight_self.addMove("notify\tUS has cancelled the Cuban Missile Crisis");
                twilight_self.endTurn();
              }
              if (action2 === "westgermany") {
                twilight_self.removeInfluence("westgermany", 2, "us");
                twilight_self.addMove("ops\tus\t"+card+"\t"+original_ops);
                twilight_self.addMove("remove\tus\tus\twestgermany\t2");
                twilight_self.addMove("unlimit\tcmc");
                twilight_self.addMove("notify\tUS has cancelled the Cuban Missile Crisis");
                twilight_self.endTurn();
              }
            });
          }
          return;
        }


        if (action2 == "place") {

          let j = ops;
          let html = twilight_self.formatStatusHeader("Place " + j + " influence", "", true)
          twilight_self.updateStatus(html);
          twilight_self.prePlayerPlaceInfluence(player);
          if (j == 1) {
            twilight_self.uneventOpponentControlledCountries(player, card);
          }
          twilight_self.playerPlaceInfluence(player, (country, player) => {

            j--;

            //
            // breaking control must be costly
            //
            if (twilight_self.game.break_control == 1) {
              j--;
              if (j < 0) { twilight_self.endRegionBonus(); j = 0; }
            }
            twilight_self.game.break_control = 0;

            if (j < 2) {
              twilight_self.uneventOpponentControlledCountries(player, card);
            }

            let html = twilight_self.formatStatusHeader("Place " + j + " influence", "",  true)
            twilight_self.updateStatus(html);

            if (j <= 0) {
              if (twilight_self.isRegionBonus(card) == 1) {
                twilight_self.updateStatus("<div class='status-message' id='status-message'>Place regional bonus</div>");
                j++;
                twilight_self.limitToRegionBonus();
                twilight_self.endRegionBonus();
              } else {
                twilight_self.playerFinishedPlacingInfluence();
                twilight_self.endTurn();
                return;
              }
            }


            twilight_self.bindBackButtonFunction(() => {
              //
              // If the placement array is full, then
              // undo all of the influence placed this turn
              //
              if (twilight_self.undoMove(action2, ops - j)) {
                twilight_self.playOps(player, ops, card);
              }
            });

          });

        }

        if (action2 == "coup") {

          let html = twilight_self.formatStatusHeader("Pick a country to coup", "", true);
          twilight_self.updateStatus(html);
          twilight_self.playerCoupCountry(player, ops, card);

        }


        if (action2 == "realign") {

          let header_msg = `Realign with ${ops} OPS, or:`;
          let html = `<ul><li class=\"card\" id=\"cancelrealign\">end turn</li></ul>`;
              html = twilight_self.formatStatusHeader(header_msg, html, true);
          twilight_self.updateStatus(html);

          twilight_self.addShowCardEvents(function(action2) {

            if (action2 == "cancelrealign") {
              twilight_self.addMove("notify\t"+player.toUpperCase()+" opts to end realignments");
              twilight_self.endTurn();
              return;
            }

          });

          let j = ops;
          twilight_self.playerRealign(player, card, () => {

            //
            // disable countries without
            //
            for (var countryname in twilight_self.countries) {

              let divname3 = "#"+countryname;

              if (twilight_self.game.player == 1) {
                if (twilight_self.countries[countryname].us < 1) {
                  $(divname3).off();
                  $(divname3).on('click',()=>{ twilght_self.displayModal('Invalid Realign Target'); });
                }
              } else {
                if (twilight_self.countries[countryname].ussr < 1) {
                  $(divname3).off();
                  $(divname3).on('click',()=>{ twilght_self.displayModal('Invalid Realign Target'); });
                }
              }
            }


            j--;

            twilight_self.updateStatus("<div class='status-message' id='status-message'>Realign with " + j + " OPS, or:<ul><li class=\"card\" id=\"cancelrealign\">stop realigning</li></ul></div>");
            let html = `<ul><li class=\"card\" id=\"cancelrealign\">end turn</li></ul>`;
                html = twilight_self.formatStatusHeader(`Realign with ${j} OPS, or:`, html, true);
            twilight_self.updateStatus(html);
            twilight_self.addShowCardEvents(function(action2) {

              if (action2 == "cancelrealign") {

                //
                // reverse order of realigns
                //
                // they need to be executed in the order that we did them for bonuses to work properly
                //
                let new_moves = [];
                for (let z = twilight_self.moves.length-1; z >= 0; z--) {
                  let tmpar = twilight_self.moves[z].split("\t");
                  if (tmpar[0] === "realign") {
                    new_moves.push(twilight_self.moves[z]);
                  } else {
                    new_moves.unshift(twilight_self.moves[z])
                  }
                }
                twilight_self.moves = new_moves;
                twilight_self.endTurn();
                return;
              }
            });


            if (j <= 0) {
              if (twilight_self.isRegionBonus(card) == 1) {
                twilight_self.updateStatus("<div class='status-message' id='status-message'>Realign with bonus OP</div>");
                j++;
                twilight_self.limitToRegionBonus();
                twilight_self.endRegionBonus();
              } else {

                //
                // reverse order of realigns
                //
                // they need to be executed in the order that we did them for bonuses to work properly
                //
                let new_moves = [];
                for (let z = twilight_self.moves.length-1; z >= 0; z--) {
                  let tmpar = twilight_self.moves[z].split("\t");
                  if (tmpar[0] === "realign") {
                    new_moves.push(twilight_self.moves[z]);
                  } else {
                    new_moves.unshift(twilight_self.moves[z])
                  }
                }
                twilight_self.moves = new_moves;
                twilight_self.endTurn();
                return;
              }
            }
          });
        }

        twilight_self.bindBackButtonFunction(() => {
          twilight_self.playOps(player, ops, card);
        });

      });
    }

    return;

  }

  confirmEvent() {
    return confirm("Confirm your desire to play this event");
  }

  formatPlayOpsStatus(player, ops, bind_back_button=false) {

    let header_msg = `<span>${player.toUpperCase()} plays ${ops} OPS:</span><ul>`;
    let html = '<ul>';

    if (this.game.state.limit_placement == 0) { html += '<li class="card" id="place">place influence</li>'; }
    if (this.game.state.limit_coups == 0) { html += '<li class="card" id="coup">launch coup</li>'; }
    if (this.game.state.limit_realignments == 0) { html += '<li class="card" id="realign">realign country</li>'; }

    //
    // Cuban Missile Crisis
    //
    if ((this.game.player == 1 && this.game.state.events.cubanmissilecrisis == 1) || (this.game.player == 2 && this.game.state.events.cubanmissilecrisis == 2)) {
      let can_remove = 0;
      if (this.game.player == 1 && this.countries['cuba'].ussr >= 2) { can_remove = 1; }
      if (this.game.player == 2 && this.countries['turkey'].us >= 2) { can_remove = 1; }
      if (this.game.player == 2 && this.countries['westgermany'].us >= 2) { can_remove = 1; }
      if (can_remove == 1) {
        html += '<li class="card" id="cancel_cmc">cancel cuban missile crisis</li>';
      }
    }

    html += '</ul>';
    html = this.formatStatusHeader(header_msg, html, bind_back_button);
    return html;
  }

  bindBackButtonFunction(mycallback) {
    $('#back_button').off();
    $('#back_button').on('click', mycallback);
  }



  playerPickHeadlineCard() {

this.startClock();

    let twilight_self = this;

    if (this.browser_active == 0) { return; }

    let player = "us";
    if (this.game.player == 1) { player = "ussr"; }
    let x = "";

    //
    // HEADLINE PEEKING / man in earth orbit
    //
    if (this.game.state.man_in_earth_orbit != "") {
      if (this.game.state.man_in_earth_orbit === "us") {
        if (this.game.player == 1) {
          x = `
            <div class="status-message" class="status-message"><span>${player.toUpperCase()}</span> <span>pick your headline card first</span></div>
            ${this.returnCardList(this.game.deck[0].hand)}
          `;
        } else {
          x = `
            <div class="status-message" id="status-message"><span>${player.toUpperCase()}</span> <span>pick your headline card second (opponent selected: ${twilight_self.game.state.headline_opponent_card})</span></div>
            ${this.returnCardList(this.game.deck[0].hand)}
          `;
        }
      } else {
        if (this.game.player == 1) {
          x = `
            <div class="status-message" id="status-message"><span>${player.toUpperCase()}</span> <span>pick your headline card second (opponent selected: ${twilight_self.game.state.headline_opponent_card})</span></div>
            ${this.returnCardList(this.game.deck[0].hand)}
          `;
        } else {
          x = `
            <div class="status-message" id="status-message"><span>${player.toUpperCase()}</span> <span>pick your headline card first</span></div>
            ${this.returnCardList(this.game.deck[0].hand)}
          `;
        }
      }
    //
    // NORMAL HEADLINE ORDER
    //
    } else {
      x = `
        <div class="status-message" id="status-message"><span>${player.toUpperCase()}</span> <span>pick your headline card</span></div>
        ${this.returnCardList(this.game.deck[0].hand)}
      `;
    }

    this.updateStatus(x);


    if (twilight_self.confirm_moves == 1) { twilight_self.cardbox.skip_card_prompt = 0; }
    twilight_self.addShowCardEvents(function(card) {
      if (twilight_self.confirm_moves == 1) { twilight_self.cardbox.skip_card_prompt = 1; }
      twilight_self.playerTurnHeadlineSelected(card, player);
    });

  }


  revertTurn() {
    let twilight_self = this;
    if (start_turn_game_state == null || start_turn_game_state == undefined) {} else {
      twilight_self.game.state = start_turn_game_state;
    }
    for (let i = twilight_self.game.queue.length-1; i >= 0; i--) {
      let tmpar = twilight_self.game.queue[i].split("\t");
      if (tmpar[0] === "discard") {
	if (tmpar[1] === "ussr" && twilight_self.game.player == 1) {
	  if (tmpar[2] != "ops") {
            twilight_self.updateLog("USSR second-guesses themselves...");
	    twilight_self.addCardToHand(tmpar[2]);
	  }
	}
	if (tmpar[1] === "us" && twilight_self.game.player == 2) {
	  if (tmpar[2] != "ops") {
            twilight_self.updateLog("US second-guesses themselves...");
	    twilight_self.addCardToHand(tmpar[2]);
	  }
	}
      }
      if (tmpar[0] === "play") {
        this.displayBoard();
	return 1;
      } else {
	twilight_self.game.queue.splice(i, 1);
      }
    }
    this.displayBoard();
  }




  playerTurnHeadlineSelected(card, player) {

    this.startClock();

    let twilight_self = this;


    // cannot pick china card or UN intervention
    if (card == "china") {
      twilght_self.displayModal("Invalid Headline", "You cannot headline China"); return; }
    if (card == "unintervention") {
      twilght_self.displayModal("Invalid Headline", "You cannot headline UN Intervention"); return; }

    twilight_self.game.state.headline_card = card;
    twilight_self.game.state.headline_xor = twilight_self.app.crypto.hash(Math.random());
    twilight_self.game.state.headline_hash = twilight_self.app.crypto.encodeXOR(twilight_self.app.crypto.stringToHex(twilight_self.game.state.headline_card), twilight_self.game.state.headline_xor);


    //
    // HEADLINE PEEKING / man in earth orbit
    //
    if (this.game.state.man_in_earth_orbit != "") {
      if (this.game.state.man_in_earth_orbit === "us") {
        if (this.game.player == 1) {
          twilight_self.addMove("headline\theadline2\t2\t"+twilight_self.game.state.headline_hash+"\t"+twilight_self.game.state.headline_xor+"\t"+twilight_self.game.state.headline_card+"\t");
        } else {
          twilight_self.addMove("headline\theadline3\t2\t"+twilight_self.game.state.headline_hash+"\t"+twilight_self.game.state.headline_xor+"\t"+twilight_self.game.state.headline_card+"\t");
        }
      } else {
        if (this.game.player == 1) {
          twilight_self.addMove("headline\theadline3\t2\t"+twilight_self.game.state.headline_hash+"\t"+twilight_self.game.state.headline_xor+"\t"+twilight_self.game.state.headline_card+"\t");
        } else {
          twilight_self.addMove("headline\theadline2\t2\t"+twilight_self.game.state.headline_hash+"\t"+twilight_self.game.state.headline_xor+"\t"+twilight_self.game.state.headline_card+"\t");
        }
      }
    //
    // NORMAL HEADLINE ORDER
    //
    } else {
      if (this.game.player == 1) {
        twilight_self.addMove("headline\theadline2\t2\t"+twilight_self.game.state.headline_hash+"\t\t\t");
      } else {
        twilight_self.addMove("headline\theadline3\t1\t"+twilight_self.game.state.headline_hash+"\t\t\t");
      }
    }

    twilight_self.updateStatus("<div class='status-message' id='status-message'>simultaneous blind pick... encrypting selected card</div>");
    twilight_self.game.turn = [];

    $('.card').off();
    $('.showcard').off();
    twilight_self.hideCard();
    twilight_self.endTurn();

    return;

  }



  playerTurn(selected_card=null) {

    this.startClock();

    let twilight_self = this;

    //
    // if the clock is going, ask to confirm moves
    //
    twilight_self.confirm_this_move = 1;

    //
    // END OF HISTORY
    //
    let greatsociety = 0;
    if (selected_card == "greatsociety") {
      greatsociety = 1;
      selected_card = "scoringcard";
    }

    //
    // remove back button from forced gameplay
    //
    if (selected_card != null) { 
      this.game.state.back_button_cancelled = 1; 
    }

    //
    // check who has China Card
    //
    this.displayChinaCard();

    //
    // show active events
    //
    this.updateEventTiles();

    //
    // if player only has the China Card, they are allowed to skip
    //
    if (selected_card == null && is_player_skipping_playing_china_card == 0) {
      if (this.game.deck[0].hand.length == 1) {
	if (this.game.deck[0].hand[0] == "china") {

	  is_player_skipping_playing_china_card = 1;

          let html = '<div class="status-message" id="status-message">You only have the China Card remaining. Do you wish to play it this turn?';
              html += '<ul><li class="card" id="play">play card</li><li class="card" id="skipturn">skip turn</li></ul></div>';
          this.updateStatus(html);
          this.addShowCardEvents(function(action) {

	    if (action === "play") {
	      twilight_self.playerTurn(selected_card);
	    }
	    if (action === "skipturn") {
	      twilight_self.addMove("resolve\tplay");
	      if (twilight_self.game.player == 1) {
	        twilight_self.addMove("notify\tUSSR chooses not to play the China Card");
	      } else {
	        twilight_self.addMove("notify\tUS chooses not to play the China Card");
	      }
	      twilight_self.endTurn();
	    }

          });

	  return;
	}
      }
    }
    is_player_skipping_playing_china_card = 0;



    original_selected_card = selected_card;

    if (this.browser_active == 0) { return; }

    //
    // reset region bonuses (if applicable)
    //
    this.game.state.events.china_card_in_play = 0;
    this.game.state.events.vietnam_revolts_eligible = 1;
    this.game.state.events.china_card_eligible = 1;
    this.game.state.events.region_bonus = "";
    this.game.state.ironlady_before_ops = 0;

    let player = "ussr";
    let opponent = "us";
    let playable_cards = [];

    if (this.game.player == 2) {
      player = "us";
      opponent = "ussr"; 
    }

    is_this_missile_envy_noneventable = this.game.state.events.missileenvy;
    if ( (player === "ussr" && this.game.state.events.missile_envy == 1) || (player === "us" && this.game.state.events.missile_envy == 2)) {
      is_this_missile_envy_noneventable = 1;
    }

    let user_message = "";
    if (selected_card == null) {

      user_message = player.toUpperCase() + " pick a card: ";
      for (i = 0; i < this.game.deck[0].hand.length; i++) {
        //
        // when UN Intervention is eventing, we can only select opponent cards
        //
        if (this.game.state.events.unintervention == 1) {
          if (this.game.player == 1 && this.game.deck[0].cards[this.game.deck[0].hand[i]].player === "us") {
            playable_cards.push(this.game.deck[0].hand[i]);
          }
          if (this.game.player == 2 && this.game.deck[0].cards[this.game.deck[0].hand[i]].player === "ussr") {
            playable_cards.push(this.game.deck[0].hand[i]);
          }
        } else {
          playable_cards.push(this.game.deck[0].hand[i]);
        }
      };
    } else {

      if (selected_card === "scoringcard") {
        user_message = 'Scoring card must be played: <ul>';
        for (i = 0; i < this.game.deck[0].hand.length; i++) {
          if (this.game.deck[0].cards[this.game.deck[0].hand[i]] != undefined) {
            if (this.game.deck[0].cards[this.game.deck[0].hand[i]].scoring == 1) {
              selected_card = this.game.deck[0].hand[i];
              playable_cards.push(this.game.deck[0].hand[i]);
            }
          }
        }
      } else {
        playable_cards.push(selected_card);
      }
    }

    //
    // Cuban Missile Crisis
    //
    if ((this.game.player == 1 && this.game.state.events.cubanmissilecrisis == 1) || (this.game.player == 2 && this.game.state.events.cubanmissilecrisis == 2)) {
      let can_remove = 0;
      if (this.game.player == 1 && this.countries['cuba'].ussr >= 2) { can_remove = 1; }
      if (this.game.player == 2 && this.countries['turkey'].us >= 2) { can_remove = 1; }
      if (this.game.player == 2 && this.countries['westgermany'].us >= 2) { can_remove = 1; }
      if (can_remove == 1) {
        playable_cards.push("cancel cuban missile crisis");
      }
    }

    //
    // Bear Trap and Quagmire
    //
    // headline check ensures that Quagmire does not trigger if headlined and the US triggers a card pull
    //
    if (this.game.state.headline == 0 && ((this.game.player == 1 && this.game.state.events.beartrap == 1) || (this.game.player == 2 && this.game.state.events.quagmire == 1)) ) {

      //
      // do we have cards to select
      //
      let cards_available = 0;
      let scoring_cards_available = 0;
      playable_cards = [];

      //
      // how many turns left?
      //
      let rounds_in_turn = 6;
      if (this.game.state.round > 3) { rounds_in_turn = 7; }
      let moves_remaining = rounds_in_turn - this.game.state.turn_in_round;


      if (this.game.state.events.beartrap == 1 && this.game.player == 1) {
        user_message = "Select a card for Bear Trap: ";
      } else {
        user_message = "Select a card for Quagmire: ";
      }

      for (i = 0; i < this.game.deck[0].hand.length; i++) {
        if (this.modifyOps(this.game.deck[0].cards[this.game.deck[0].hand[i]].ops, this.game.deck[0].hand[i], this.game.player, 0) >= 2 && this.game.deck[0].hand[i] != "china") {
	  playable_cards.push(this.game.deck[0].hand[i]);
          cards_available++;
        }
        if (this.game.deck[0].cards[this.game.deck[0].hand[i]] != undefined) {
          if (this.game.deck[0].cards[this.game.deck[0].hand[i]].scoring == 1) { scoring_cards_available++; }
        }
      }

console.log("available cards: " + cards_available + " -- " + this.game.state.events.missile_envy + " -- " + this.game.state.events.missileenvy);

      //
      // handle missile envy if needed
      //
      let playable_cards_handled = 1;
      if (this.game.state.events.missile_envy == this.game.player) {
        playable_cards_handled = 0;
        if (this.modifyOps(2, "missileenvy", this.game.player, 0) >= 2) {
	  // reset here, since will not trigger elsewhere
          playable_cards_handled = 1;
          this.game.state.events.missile_envy = 0;
          this.game.state.events.missileenvy = 0;
          playable_cards = [];
          playable_cards.push("missileenvy");
        }
      }

      if (playable_cards_handled == 0) {

        //
        // do we have any cards to play?
        //
        if (cards_available > 0 && scoring_cards_available <= moves_remaining) {
          this.updateStatus("<div class='status-message' id='status-message'>" + user_message + '</div>');
          playable_cards = [];
          for (i = 0; i < this.game.deck[0].hand.length; i++) {
            if (this.game.deck[0].cards[this.game.deck[0].hand[i]] != undefined) {
              if (this.modifyOps(this.game.deck[0].cards[this.game.deck[0].hand[i]].ops, this.game.deck[0].hand[i], this.game.player, 0) >= 2 && this.game.deck[0].hand[i] != "china") {
                playable_cards.push(this.game.deck[0].hand[i]);
              }
            }
          }
        } else {
          if (scoring_cards_available > 0) {
            if (this.game.state.events.beartrap == 1) {
              user_message = "Bear Trap restricts you to Scoring Cards: ";
            } else {
              user_message = "Quagmire restricts you to Scoring Cards: ";
            }
	    playable_cards = [];
            for (i = 0; i < this.game.deck[0].hand.length; i++) {
              if (this.game.deck[0].cards[this.game.deck[0].hand[i]] != undefined) {
                if (this.game.deck[0].cards[this.game.deck[0].hand[i]].scoring == 1) {
                  playable_cards.push(this.game.deck[0].hand[i]);
                }
              }
            }
          } else {
            if (this.game.state.events.beartrap == 1) {
              user_message = "No cards playable due to Bear Trap: ";
            } else {
              user_message = "No cards playable due to Quagmire: ";
            }
            playable_cards = [];
            playable_cards.push("skip turn");
          }
        }
      }
    }

    //
    // display the cards
    //
    if (playable_cards.length > 0) {
      this.updateStatusAndListCards(user_message, playable_cards);
    } else {
      this.updateStatusAndListCards(user_message, this.game.deck[0].hand);
    }


    if (this.game.state.events.unintervention != 1 && selected_card != "grainsales") {

      //
      // END OF HISTORY
      //
      // note - do not remove the clearing of the moves array if removing greatsociety
      //
      if (greatsociety != 1) {
        this.moves = [];
      }

    }

    twilight_self.playerFinishedPlacingInfluence();

    //
    // cannot play if no cards remain
    //
    if (selected_card == null && this.game.deck[0].hand.length == 0) {
      this.updateStatus("<div class='status-message' id='status-message'>Skipping turn... no cards left to play</div>");
      this.updateLog("Skipping turn... no cards left to play");
      this.addMove("resolve\tplay");
      this.endTurn();
      return;
    }


    twilight_self.addShowCardEvents(function(card) {
      twilight_self.playerTurnCardSelected(card, player);
    });

  }


  playerTurnCardSelected(card, player) {

    this.startClock();

    let twilight_self = this;
    let opponent = "us";
    if (this.game.player == 2) { opponent = "ussr"; }

      //
      // Skip Turn
      //
      if (card === "skipturn") {
        twilight_self.hideCard(card);
        twilight_self.addMove("resolve\tplay");
        twilight_self.addMove("notify\t"+player+" has no cards playable.");
        twilight_self.endTurn();
        return 0;
      }


      //
      // warn if user is leaving a scoring card in hand
      //
      let scoring_cards_available = 0;
      let rounds_in_turn = 6;
      if (twilight_self.game.state.round > 3) { rounds_in_turn = 7; }
      let moves_remaining = rounds_in_turn - twilight_self.game.state.turn_in_round;

      for (i = 0; i < twilight_self.game.deck[0].hand.length; i++) {
        if (this.game.deck[0].cards[this.game.deck[0].hand[i]] != undefined) {
          if (twilight_self.game.deck[0].cards[twilight_self.game.deck[0].hand[i]].scoring == 1) { scoring_cards_available++; }
        }
      }

      if (scoring_cards_available > 0 && scoring_cards_available > moves_remaining && twilight_self.game.deck[0].cards[card].scoring == 0) {
        let c = confirm("Holding a scoring card at the end of the turn will lose you the game. Still play this card?");
        if (c) {} else { return; }
      }

      //
      // Quagmire / Bear Trap
      //
      if (twilight_self.game.state.headline == 0 && (twilight_self.game.state.events.quagmire == 1 && twilight_self.game.player == 2) || (twilight_self.game.state.events.beartrap == 1 && twilight_self.game.player == 1) ) {

        //
        // WWBY triggers if US cannot play UN intervention because of Quagmire
        //
        if (twilight_self.game.state.events.wwby == 1 && twilight_self.game.state.headline == 0) {
          if (player == "us") {
            if (card != "unintervention") {
              twilight_self.game.state.events.wwby_triggers = 1;
            }
            twilight_self.game.state.events.wwby = 0;
          }
        }


        //
        // scoring cards score, not get discarded
        //
        if (twilight_self.game.deck[0].cards[card].scoring == 0) {
          twilight_self.hideCard(card);
          twilight_self.removeCardFromHand(card);
          twilight_self.addMove("resolve\tplay");
          twilight_self.addMove("quagmire\t"+player+"\t"+card);
          twilight_self.addMove("discard\t"+player+"\t"+card);
          twilight_self.endTurn();
          return 0;
        }
      }


      //
      // Cuban Missile Crisis
      //
      if (card == "cancelcubanmissilecrisis") {
        if (twilight_self.game.player == 1) {
          twilight_self.removeInfluence("cuba", 2, "ussr");
          twilight_self.addMove("remove\tussr\tussr\tcuba\t2");
          twilight_self.addMove("unlimit\tcmc");
          twilight_self.addMove("notify\tUSSR has cancelled the Cuban Missile Crisis");
          twilight_self.endTurn();
        } else {

          let user_message = "Select country from which to remove influence:<ul>";
          if (twilight_self.countries['turkey'].us >= 2) {
            user_message += '<li class="card showcard" id="turkey">Turkey</li>';
          }
          if (twilight_self.countries['westgermany'].us >= 2) {
            user_message += '<li class="card showcard" id="westgermany">West Germany</li>';
          }
          user_message += '</ul>';
          twilight_self.updateStatus("<div class='status-message' id='status-message'>" + user_message + '</div>');
          twilight_self.addShowCardEvents(function(action2) {

            if (action2 === "turkey") {
              twilight_self.removeInfluence("turkey", 2, "us");
              twilight_self.addMove("remove\tus\tus\tturkey\t2");
              twilight_self.addMove("unlimit\tcmc");
              twilight_self.addMove("notify\tUS has cancelled the Cuban Missile Crisis");
              twilight_self.endTurn();
            }
            if (action2 === "westgermany") {
              twilight_self.removeInfluence("westgermany", 2, "us");
              twilight_self.addMove("remove\tus\tus\twestgermany\t2");
              twilight_self.addMove("unlimit\tcmc");
              twilight_self.addMove("notify\tUS has cancelled the Cuban Missile Crisis");
                twilight_self.endTurn();
            }
          });

        }
        return 0;
      }

      //
      // The China Card
      //
      twilight_self.hideCard(card);
      twilight_self.addMove("resolve\tplay");
      twilight_self.addMove("discard\t"+player+"\t"+card);

      if (card == "china") {
        twilight_self.addMove("unlimit\tchina");
        twilight_self.game.state.events.china_card_in_play = 1;
      }

      //
      // WWBY triggers on non-headlines, so Grain Sales headline shdn't trigger
      //
      if (twilight_self.game.state.events.wwby == 1 && twilight_self.game.state.headline == 0) {
        if (player == "us") {
          if (card != "unintervention") {
            twilight_self.game.state.events.wwby_triggers = 1;
          }
          twilight_self.game.state.events.wwby = 0;
        }
      }


      if (twilight_self.game.deck[0].cards[card].scoring == 1) {
        let status_header = `Playing ${twilight_self.game.deck[0].cards[card].name}:`;
        let html = ``;
        html += `<ul><li class="card" id="event">score region</li></ul>`

        // true means we want to include the back button in our functionality
        if (this.game.state.back_button_cancelled == 1) {
          html = twilight_self.formatStatusHeader(status_header, html, false);
        } else {
          html = twilight_self.formatStatusHeader(status_header, html, true);
        }
        twilight_self.updateStatus(html);
      } else {

        let ops = twilight_self.modifyOps(twilight_self.game.deck[0].cards[card].ops, card, twilight_self.game.player, 0);


        //
        // is space race an option
        //
        let sre = 1;
        if (twilight_self.game.player == 1 && twilight_self.game.state.space_race_ussr_counter >= 1) {
          if (twilight_self.game.state.animal_in_space == "ussr" && twilight_self.game.state.space_race_ussr_counter < 2) {} else {
            sre = 0;
          }
        }
        if (twilight_self.game.player == 2 && twilight_self.game.state.space_race_us_counter >= 1) {
          if (twilight_self.game.state.animal_in_space == "us" && twilight_self.game.state.space_race_us_counter < 2) {} else {
            sre = 0;
          }
        }

        let announcement = "";

        announcement += `<ul>`;

        //
        // cannot play China card or Missile Envy (forced) for event
        //
        // cannot event UN Intervention w/o the opponent card in hand
        //
        let can_play_event = 1;
        if (card == "unintervention") {
          let opponent_event_in_hand = 0;
          for (let b = 0; b < twilight_self.game.deck[0].hand.length; b++) {
            let tmpc = twilight_self.game.deck[0].hand[b];
            if (tmpc != "china") {
              if (twilight_self.game.player == 1) {
                if (twilight_self.game.deck[0].cards[tmpc].player === "us") { opponent_event_in_hand = 1; }
              } else {
                if (twilight_self.game.deck[0].cards[tmpc].player === "ussr") { opponent_event_in_hand = 1; }
              }
            }
          }
          if (opponent_event_in_hand == 0) { can_play_event = 0; }
        }
        if (card == "china") { can_play_event = 0; }
        if (card == "missileenvy" && is_this_missile_envy_noneventable == 1) { can_play_event = 0; }

        //
        // cannot play event of opponent card (usability fix)
        //
        if (twilight_self.game.deck[0].cards[card].player == opponent) { can_play_event = 0; }

        if (can_play_event == 1) { announcement += '<li class="card" id="event">play event</li>'; }

        announcement += '<li class="card" id="ops">play ops</li>';

        if (sre == 1) {
          if (player == "ussr" && ops > 1) {
            if (twilight_self.game.state.space_race_ussr < 4 && ops > 1) {
              announcement += '<li class="card" id="space">space race</li>';
            }
            if (twilight_self.game.state.space_race_ussr >= 4 && twilight_self.game.state.space_race_ussr < 7 && ops > 2) {
              announcement += '<li class="card" id="space">space race</li>';
            }
            if (twilight_self.game.state.space_race_ussr == 7 && ops > 3) {
              announcement += '<li class="card" id="space">space race</li>';
              }
          }
          if (player == "us" && ops > 1) {
            if (twilight_self.game.state.space_race_us < 4 && ops > 1) {
              announcement += '<li class="card" id="space">space race</li>';
            }
            if (twilight_self.game.state.space_race_us >= 4 && twilight_self.game.state.space_race_us < 7 && ops > 2) {
              announcement += '<li class="card" id="space">space race</li>';
            }
            if (twilight_self.game.state.space_race_us == 7 && ops > 3) {
              announcement += '<li class="card" id="space">space race</li>';
              }
          }
        } else {
        }

        //
        // cancel cuban missile crisis
        //
        if ((twilight_self.game.player == 1 && twilight_self.game.state.events.cubanmissilecrisis == 1) || (twilight_self.game.player == 2 && twilight_self.game.state.events.cubanmissilecrisis == 2)) {
          let can_remove = 0;
          if (twilight_self.game.player == 1 && twilight_self.countries['cuba'].ussr >= 2) { can_remove = 1; }
          if (twilight_self.game.player == 2 && twilight_self.countries['turkey'].us >= 2) { can_remove = 1; }
          if (can_remove == 1) {
            announcement += '<li class="card" id="cancel_cmc">cancel cuban missile crisis</li>';
          }
        }

        if (twilight_self.game.state.back_button_cancelled == 1) {
          announcement = twilight_self.formatStatusHeader(
            `<span>${player.toUpperCase()}</span> <span>playing</span> <span>${twilight_self.game.deck[0].cards[card].name}</span>`,
	    announcement,
            false
          );
        } else {
          announcement = twilight_self.formatStatusHeader(
            `<span>${player.toUpperCase()}</span> <span>playing</span> <span>${twilight_self.game.deck[0].cards[card].name}</span>`,
	    announcement,
            true
          );
        }

        twilight_self.updateStatus(announcement);
      }

      $('#back_button').off();
      $('#back_button').on('click', () => {
        this.playerTurn();
      });

      twilight_self.addShowCardEvents(function(action) {
        $('.card').off();

        //
        // missile envy (reset if held over headline)
        // - added August 15 2020
        //
	if ((twilight_self.game.player == 2 && twilight_self.game.state.events.missile_envy == 2) || (twilight_self.game.player == 1 && twilight_self.game.state.events.missile_envy == 1)) {
	  if (card == "missileenvy") {
	    twilight_self.game.state.events.missileenvy = 0;
	    twilight_self.game.state.events.missile_envy = 0;
	    is_this_missile_envy_noneventable = 0;
	  }
	}


        //
        // Cuban Missile Crisis
        //
        if (action == "cancel_cmc") {
          this.moves = [];
          if (twilight_self.game.player == 1) {
            twilight_self.removeInfluence("cuba", 2, "ussr");
            twilight_self.addMove("card\tussr\t"+card);
            twilight_self.addMove("remove\tussr\tussr\tcuba\t2");
            twilight_self.addMove("notify\tUSSR has cancelled the Cuban Missile Crisis");
            twilight_self.addMove("unlimit\tcmc");
            twilight_self.endTurn();
          } else {

            let user_message = "Select country from which to remove influence:<ul>";
            if (twilight_self.countries['turkey'].us >= 2) {
              user_message += '<li class="card showcard" id="turkey">Turkey</li>';
            }
            if (twilight_self.countries['westgermany'].us >= 2) {
              user_message += '<li class="card showcard" id="westgermany">West Germany</li>';
            }
            user_message += '</ul>';
            twilight_self.updateStatus("<div class='status-message' id='status-message'>" + user_message + "</div>");

            twilight_self.addShowCardEvents(function(action2) {

              if (action2 === "turkey") {
                twilight_self.removeInfluence("turkey", 2, "us");
                twilight_self.addMove("card\tus\t"+card);
                twilight_self.addMove("remove\tus\tus\tturkey\t2");
                twilight_self.addMove("unlimit\tcmc");
                twilight_self.addMove("notify\tUS has cancelled the Cuban Missile Crisis");
                twilight_self.endTurn();
              }
              if (action2 === "westgermany") {
                twilight_self.removeInfluence("westgermany", 2, "us");
                twilight_self.addMove("card\tus\t"+card);
                twilight_self.addMove("remove\tus\tus\twestgermany\t2");
                twilight_self.addMove("unlimit\tcmc");
                twilight_self.addMove("notify\tUS has cancelled the Cuban Missile Crisis");
                  twilight_self.endTurn();
              }
            });
          }
          return;
        }


        if (action == "event") {

          //
          // sanity check on opponent event choice
          //
          if (twilight_self.game.deck[0].cards[card].player != "both" && twilight_self.game.deck[0].cards[card].player != player) {

            let fr =  "<div class='status-message' id='status-message'><span>This is your opponent's event. Are you sure you wish to play it for the event instead of the OPS?</span><ul>";
                fr += '<li class="card" id="playevent">play event</li>';
                fr += '<li class="card" id="pickagain">pick again</li>';
                fr += '</ul></div>';

            twilight_self.updateStatus(fr);

            twilight_self.addShowCardEvents(function(action) {
              $('.card').off();

              if (action == "playevent") {
                twilight_self.playerTriggerEvent(player, card);
                return;
              }
              if (action == "pickagain") {
                twilight_self.playerTurn(original_selected_card);
                return;
              }

            });

            return;
          }

          //
          // our event or both
          //
          if (twilight_self.confirm_moves == 1) {

            let fr_header = 
              `
              Confirm you want to play this event:
	      `;
            let fr_msg = `
             <ul>
              <li class="card" id="playevent">play event</li>
              <li class="card" id="pickagain">pick again</li>
              </ul>
              <input type="checkbox" name="dontshowme" value="true" style="width: 20px;height: 1.5em;"> don't confirm moves (expert mode)...
              `;

            let html = twilight_self.formatStatusHeader(fr_header, fr_msg, false);
	    twilight_self.updateStatus(html);

//            twilight_self.updateStatus(fr);
            twilight_self.addShowCardEvents(function(action) {
              $('.card').off();

              if (action == "playevent") {
                twilight_self.playerTriggerEvent(player, card);
                return;
              }
              if (action == "pickagain") {
                twilight_self.playerTurn(original_selected_card);
                return;
              }

            });

            $('input:checkbox').change(function() {
              if ($(this).is(':checked')) {
                twilight_self.confirm_moves = 0;
                twilight_self.saveGamePreference('confirm_moves', 1);
		try { $(".game-confirm").text("Newbie Mode"); } catch (err) {}
              }
            })

            return;
          }

          // play normally when not confirmed
          twilight_self.playerTriggerEvent(player, card);
          return;

        }

        if (action == "ops") {

          //
          // our event or both
          //
          if (twilight_self.confirm_moves == 1 && (card != "missileenvy" || is_this_missile_envy_noneventable == 0)) {

            let fr_header = "Confirm you want to play for ops:";
	    let fr_msg = `
              <ul>
              <li class="card" id="playevent">play for ops</li>
              <li class="card" id="pickagain">pick again</li>
              </ul>
              `;
	    if (twilight_self.confirm_moves == 1) {
              fr_msg += `<input type="checkbox" name="dontshowme" value="true" style="width: 20px;height: 1.5em;"> don't confirm moves (expert mode)...`;
	    }
	    fr_msg += `
	      </div>
	    `;

            let html = twilight_self.formatStatusHeader(fr_header, fr_msg,  false)
	    twilight_self.updateStatus(html);

//            twilight_self.updateStatus(fr);
            twilight_self.addShowCardEvents(function(action) {
              $('.card').off();

              if (action == "playevent") {
                twilight_self.playerTriggerOps(player, card);
                return;
              }
              if (action == "pickagain") {
                twilight_self.playerTurn(original_selected_card);
                return;
              }

            });

            $('input:checkbox').change(function() {
              if ($(this).is(':checked')) {
                twilight_self.confirm_moves = 0;
                twilight_self.saveGamePreference('confirm_moves', 0);
		try { $(".game-confirm").text("Newbie Mode"); } catch (err) {}
              }
            })

            return;
          }

          // play normally when not confirmed
          twilight_self.playerTriggerOps(player, card);
          return;

        }

        if (action == "space") {

          if (twilight_self.confirm_moves == 1) {

            let fr =
              `
	      <div class="status-message" id="status-message">
              <div>Confirm you want to space ${twilight_self.game.deck[0].cards[card].name}</div>
             <ul>
              <li class="card" id="playevent">send into orbit</li>
              <li class="card" id="pickagain">pick again</li>
              </ul>
              <input type="checkbox" name="dontshowme" value="true" style="width: 20px;height: 1.5em;"> don't confirm moves (expert mode)...
	      </div>
              `;

            twilight_self.updateStatus(fr);
            twilight_self.addShowCardEvents(function(action) {
              $('.card').off();

              if (action == "playevent") {
                twilight_self.addMove("space\t"+player+"\t"+card);
                twilight_self.removeCardFromHand(card);
                twilight_self.endTurn();
                return;
              }
              if (action == "pickagain") {
                twilight_self.playerTurn(original_selected_card);
                return;
              }

            });

            $('input:checkbox').change(function() {
              if ($(this).is(':checked')) {
                twilight_self.confirm_moves = 0;
                twilight_self.saveGamePreference('confirm_moves', 1);
		try { $(".game-confirm").text("Newbie Mode"); } catch (err) {}
              }
            })

            return;
          }

          twilight_self.addMove("space\t"+player+"\t"+card);
          twilight_self.removeCardFromHand(card);
          twilight_self.endTurn();
          return;
        }

        twilight_self.updateStatus("");

      });

  }



  playerTriggerOps(player, card) {

    let twilight_self = this;
    let opponent = "us";
    if (this.game.player == 2) { opponent = "ussr"; }

    if (twilight_self.game.deck[0].cards[card].player == opponent) {
      if (twilight_self.game.state.events.unintervention == 1) {

        //
        // Flower Power
        //
        if (twilight_self.game.state.events.flowerpower == 1) {
          if ((card == "arabisraeli" && twilight_self.game.state.events.campdavid == 0) || card == "koreanwar" || card == "brushwar" || card == "indopaki" || card == "iraniraq") {
            if (player === "us") {
              twilight_self.addMove("notify\tFlower Power triggered by "+card);
              twilight_self.addMove("vp\tussr\t2\t1");
            }
          }
        }

        // resolve added
        twilight_self.addMove("notify\t"+player.toUpperCase()+" plays "+card+" with UN Intervention");
        twilight_self.addMove("ops\t"+player+"\t"+card+"\t"+twilight_self.game.deck[0].cards[card].ops);
        twilight_self.removeCardFromHand(card);
        twilight_self.endTurn();
        return;

      } else {

        //
        // Flower Power
        //
        if (twilight_self.game.state.events.flowerpower == 1) {
          if ((card == "arabisraeli" && twilight_self.game.state.events.campdavid == 0) || card == "koreanwar" || card == "brushwar" || card == "indopaki" || card == "iraniraq") {
            if (player === "us") {
              twilight_self.addMove("notify\tFlower Power triggered by "+card);
              twilight_self.addMove("vp\tussr\t2\t1");
            }
          }
        }

        let html = '<ul><li class="card" id="before">event before ops</li><li class="card" id="after">event after ops</li></ul>';
            html = twilight_self.formatStatusHeader('Playing opponent card:', html, true);
        twilight_self.updateStatus(html);
        twilight_self.bindBackButtonFunction(() => {
          twilight_self.playerTurnCardSelected(card, player);
        });

        twilight_self.addShowCardEvents(function(action2) {

          twilight_self.game.state.event_before_ops = 0;
          twilight_self.game.state.event_name = "";

          if (action2 === "before") {
            twilight_self.game.state.event_before_ops = 1;
            twilight_self.game.state.event_name = twilight_self.game.deck[0].cards[card].name;
            twilight_self.addMove("ops\t"+player+"\t"+card+"\t"+twilight_self.game.deck[0].cards[card].ops);
            twilight_self.addMove("event\t"+player+"\t"+card);
            twilight_self.removeCardFromHand(card);
            twilight_self.endTurn();
            return;
          }
          if (action2 === "after") {
            twilight_self.game.state.event_name = twilight_self.game.deck[0].cards[card].name;
            twilight_self.addMove("event\t"+player+"\t"+card);
            twilight_self.addMove("ops\t"+player+"\t"+card+"\t"+twilight_self.game.deck[0].cards[card].ops);
            twilight_self.removeCardFromHand(card);
            twilight_self.endTurn();
            return;
          }
        });
      }

      return;

    } else {

      twilight_self.addMove("ops\t"+player+"\t"+card+"\t"+twilight_self.game.deck[0].cards[card].ops);
      if (card == "china") { twilight_self.addMove("limit\tchina"); }
      twilight_self.removeCardFromHand(card);

      //
      // Flower Power
      //
      if (twilight_self.game.state.events.flowerpower == 1) {
        if ((card == "arabisraeli" && twilight_self.game.state.events.campdavid == 0) || card == "koreanwar" || card == "brushwar" || card == "indopaki" || card == "iraniraq") {
          if (player === "us") {
            twilight_self.addMove("notify\tFlower Power triggered by "+card);
            twilight_self.addMove("vp\tussr\t2\t1");
          }
        }
      }

      twilight_self.endTurn();
      return;

    }

  }





  playerTriggerEvent(player, card) {

    let twilight_self = this;

    //
    // Flower Power
    //
    if (twilight_self.game.state.events.flowerpower == 1) {
      if ((card == "arabisraeli" && twilight_self.game.state.events.campdavid == 0) || card == "koreanwar" || card == "brushwar" || card == "indopaki" || card == "iraniraq") {
        if (player === "us") {
          twilight_self.addMove("notify\tFlower Power triggered by "+card);
          twilight_self.addMove("vp\tussr\t2\t1");
        }
      }
    }

    twilight_self.game.state.event_name = twilight_self.game.deck[0].cards[card].name;
    twilight_self.addMove("event\t"+player+"\t"+card);
    twilight_self.removeCardFromHand(card);


    //
    // Our Man in Tehran -- check if reshuffle is needed
    //
    if (card == "tehran") {

      //
      // reshuffle needed before event
      //
      if (5 > twilight_self.game.deck[0].crypt.length) {

        let discarded_cards = twilight_self.returnDiscardedCards();

	//
	// shuttle diplomacy
	//
       	if (this.game.state.events.shuttlediplomacy == 1) {
	  if (discarded_cards['shuttle'] != undefined) {
	    delete discarded_cards['shuttle'];
	  }
	}


        if (Object.keys(discarded_cards).length > 0) {

          //
          // shuffle in discarded cards -- eliminate SHUFFLE here as unnecessary
          //
          twilight_self.addMove("DECKRESTORE\t1");
          twilight_self.addMove("DECKENCRYPT\t1\t2");
          twilight_self.addMove("DECKENCRYPT\t1\t1");
          twilight_self.addMove("DECKXOR\t1\t2");
          twilight_self.addMove("DECKXOR\t1\t1");
          twilight_self.addMove("flush\tdiscards"); // opponent should know to flush discards as we have
          twilight_self.addMove("DECK\t1\t"+JSON.stringify(discarded_cards));
          twilight_self.addMove("DECKBACKUP\t1");
          twilight_self.updateLog("cards remaining: " + twilight_self.game.deck[0].crypt.length);
          twilight_self.updateLog("Shuffling discarded cards back into the deck...");

        }
      }
    }

    twilight_self.endTurn();
    return;

  }











  /////////////////////
  // Place Influence //
  /////////////////////
  uneventOpponentControlledCountries(player, card) {

    let bonus_regions = this.returnArrayOfRegionBonuses(card);

    for (var i in this.countries) {
      if (player == "us") {
        if (this.isControlled("ussr", i) == 1) {

          //
          // allow bonus regions to break control with bonuses
          //
          let bonus_region_applies = 0;
          for (let z = 0; z < bonus_regions.length; z++) {
            if (this.countries[i].region.indexOf(bonus_regions[z]) > -1) { bonus_region_applies = 1; }
          }

          if (bonus_region_applies == 1) {
          } else {
            this.countries[i].place = 0;
            let divname = '#'+i;
            $(divname).off();
          }

        }
      }

      if (player == "ussr") {
        if (this.isControlled("us", i) == 1) {

          //
          // allow bonus regions to break control with bonuses
          //
          let bonus_region_applies = 0;
          for (let z = 0; z < bonus_regions.length; z++) {
            if (this.countries[i].region.indexOf(bonus_regions[z]) > -1) { bonus_region_applies = 1; }
          }

          if (bonus_region_applies == 1) {
          } else {
            this.countries[i].place = 0;
            let divname = '#'+i;
            $(divname).off();
          }

        }
      }
    }

  }



  prePlayerPlaceInfluence(player) {



    //
    // reset
    //
    for (var i in this.countries) { this.game.countries[i].place = 0; }

    //
    // ussr
    //
    if (player == "ussr") {

      this.game.countries['finland'].place = 1;
      this.game.countries['poland'].place = 1;
      this.game.countries['romania'].place = 1;
      this.game.countries['afghanistan'].place = 1;
      this.game.countries['northkorea'].place = 1;

      for (var i in this.game.countries) {
        if (this.game.countries[i].ussr > 0) {

          let place_in_country = 1;

          //
          // skip argentina if only has 1 and ironlady_before_ops
          //
          if (this.game.state.ironlady_before_ops == 1 && this.game.countries['chile'].ussr < 1 && this.game.countries['uruguay'].ussr < 1 && this.game.countries['paraguay'].ussr < 1 && this.game.countries['argentina'].ussr == 1 && i === "argentina") { place_in_country = 0; }

          this.game.countries[i].place = place_in_country;

          if (place_in_country == 1) {
            for (let n = 0; n < this.game.countries[i].neighbours.length; n++) {
              let j = this.game.countries[i].neighbours[n];
              this.game.countries[j].place = 1;
            }
          }

        }
      }
    }

    //
    // us
    //
    if (player == "us") {

      this.game.countries['canada'].place = 1;
      this.game.countries['mexico'].place = 1;
      this.game.countries['cuba'].place = 1;
      this.game.countries['japan'].place = 1;

      for (var i in this.game.countries) {
        if (this.game.countries[i].us > 0) {
          this.game.countries[i].place = 1;
          for (let n = 0; n < this.game.countries[i].neighbours.length; n++) {
            let j = this.game.countries[i].neighbours[n];
            this.game.countries[j].place = 1;
          }
        }
      }
    }

  }



  playerPlaceInitialInfluence(player) {

    try {
this.startClock();

    let twilight_self = this;

    if (player == "ussr") {

      twilight_self.addMove("resolve\tplacement");

      this.updateStatusAndListCards(`You are the USSR. Place six additional influence in Eastern Europe.`);


      var placeable = [];
      placeable.push("finland");
      placeable.push("eastgermany");
      placeable.push("poland");
      placeable.push("austria");
      placeable.push("czechoslovakia");
      placeable.push("hungary");
      placeable.push("romania");
      placeable.push("yugoslavia");
      placeable.push("bulgaria");

      let ops_to_place = 6;

      for (let i = 0; i < placeable.length; i++) {

        this.game.countries[placeable[i]].place = 1;

        let divname = "#"+placeable[i];

        $(divname).off();
        $(divname).on('click', function() {

          let countryname = $(this).attr('id');

          if (twilight_self.countries[countryname].place == 1) {
            twilight_self.addMove("place\tussr\tussr\t"+countryname+"\t1");
            twilight_self.placeInfluence(countryname, 1, "ussr");
            ops_to_place--;

            if (ops_to_place == 0) {
              twilight_self.playerFinishedPlacingInfluence();
              twilight_self.game.state.placement = 1;
              twilight_self.endTurn();
            }
          } else {
            // twilight_self.displayModal("you cannot place there...: " + j + " influence left");
            twilight_self.displayModal("Invalid Influence Placement", `You cannot place there...: ${j} influence left`);
          }
        });
      } 
    }


    if (player == "us") {

      twilight_self.addMove("resolve\tplacement");

      this.updateStatusAndListCards(`You are the US. Place seven additional influence in Western Europe.`)

      var placeable = [];

      placeable.push("canada");
      placeable.push("uk");
      placeable.push("benelux");
      placeable.push("france");
      placeable.push("italy");
      placeable.push("westgermany");
      placeable.push("greece");
      placeable.push("spain");
      placeable.push("turkey");
      placeable.push("austria");
      placeable.push("norway");
      placeable.push("denmark");
      placeable.push("sweden");
      placeable.push("finland");

      var ops_to_place = 7;

      for (let i = 0; i < placeable.length; i++) {
        this.game.countries[placeable[i]].place = 1;

        let divname = "#"+placeable[i];

        $(divname).off();
        $(divname).on('click', function() {

          let countryname = $(this).attr('id');

          if (twilight_self.countries[countryname].place == 1) {
            twilight_self.addMove("place\tus\tus\t"+countryname+"\t1");
            twilight_self.placeInfluence(countryname, 1, "us");
            ops_to_place--;

            if (ops_to_place == 0) {
              twilight_self.playerFinishedPlacingInfluence();
              twilight_self.game.state.placement = 1;
              twilight_self.endTurn();
            }
          } else {
            // twilight_self.displayModal("you cannot place there...: " + j + " influence left");
            twilight_self.displayModal("Invalid Influence Placement", `You cannot place there...: ${j} influence left`);
          }
        });
      }
    }
    } catch (err) {}
  }



  playerPlaceBonusInfluence(player, bonus) {

this.startClock();

    let twilight_self = this;

    if (player == "ussr") {

      twilight_self.addMove("resolve\tplacement_bonus");

      this.updateStatusAndListCards(`You are the USSR. Place</span> ${bonus} <span>additional influence in countries with existing Soviet influence.`);

      let ops_to_place = bonus;

      for (var i in this.game.countries) {
        if (this.game.countries[i].ussr > 0) {

          let countryname  = i;
          let divname      = '#'+i;

          $(divname).off();
          $(divname).on('click', function() {

            let countryname = $(this).attr('id');

            twilight_self.addMove("place\tussr\tussr\t"+countryname+"\t1");
            twilight_self.placeInfluence(countryname, 1, "ussr");
            ops_to_place--;

            if (ops_to_place == 0) {
              twilight_self.playerFinishedPlacingInfluence();
              twilight_self.game.state.placement = 1;
              twilight_self.endTurn();
            }
          });
        }
      }
    }



    if (player == "us") {

      twilight_self.addMove("resolve\tplacement_bonus");

      this.updateStatusAndListCards(`You are the US. Place</span> ${bonus} <span>additional influence in countries with existing American influence.`);

      let ops_to_place = bonus;

      for (var i in this.game.countries) {
        if (this.game.countries[i].us > 0) {

          let countryname  = i;
          let divname      = '#'+i;

          $(divname).off();
          $(divname).on('click', function() {

            let countryname = $(this).attr('id');

            twilight_self.addMove("place\tus\tus\t"+countryname+"\t1");
            twilight_self.placeInfluence(countryname, 1, "us");
            ops_to_place--;

            if (ops_to_place == 0) {
              twilight_self.playerFinishedPlacingInfluence();
              twilight_self.game.state.placement = 1;
              twilight_self.endTurn();
            }
          });
        }
      }
    }
  }









  /////////////////////
  // PLACE INFLUENCE //
  /////////////////////
  addCardToHand(card) {
    if (this.game.player == 0) { return; }
    this.game.deck[0].hand.push(card);
  }
  removeCardFromHand(card) {
    if (this.game.player == 0) { return; }
    for (i = 0; i < this.game.deck[0].hand.length; i++) {
      if (this.game.deck[0].hand[i] == card) {
        this.game.deck[0].hand.splice(i, 1);
      }
    }
  }
  removeInfluence(country, inf, player, mycallback=null) {

    if (player == "us") {
      this.countries[country].us = parseInt(this.countries[country].us) - parseInt(inf);
      if (this.countries[country].us < 0) { this.countries[country].us = 0; };
      this.showInfluence(country, "ussr");
    } else {
      this.countries[country].ussr = parseInt(this.countries[country].ussr) - parseInt(inf);
      if (this.countries[country].ussr < 0) { this.countries[country].ussr = 0; };
      this.showInfluence(country, "us");
    }

    this.updateLog(player.toUpperCase() + "</span> <span>removes </span> " + inf + "<span> from</span> <span>" + this.countries[country].name);

    this.showInfluence(country, player, mycallback);

  }

  placeInfluence(country, inf, player, mycallback=null) {

    if (player == "us") {
      this.countries[country].us = parseInt(this.countries[country].us) + parseInt(inf);
    } else {
      this.countries[country].ussr = parseInt(this.countries[country].ussr) + parseInt(inf);
    }

    this.updateLog(player.toUpperCase() + "</span> <span>places</span> " + inf + " <span>in</span> <span>" + this.countries[country].name, this.log_length, 1);

    this.showInfluence(country, player, mycallback);

  }


  showInfluence(country, player, mycallback=null) {

    let obj_us    = "#"+country+ " > .us";
    let obj_ussr = "#"+country+ " > .ussr";

    let us_i   = parseInt(this.countries[country].us);
    let ussr_i = parseInt(this.countries[country].ussr);

    let has_control = 0;

    if (player == "us") {
      let diff = us_i - ussr_i;
      if (diff > 0 && diff >= this.countries[country].control) {
        has_control = 1;
      }
    } else {
      let diff = ussr_i - us_i;
      if (diff > 0 && diff >= this.countries[country].control) {
        has_control = 1;
      }
    }


    //
    // update non-player if control broken
    //
    if (player == "us") {
      if (this.isControlled("ussr", country) == 0) {
        if (this.countries[country].ussr > 0) {
          $(obj_ussr).html('<div class="ussr_uncontrol">'+ussr_i+'</div>');
        }
      } else {
        if (this.isControlled("us", country) == 1) {
          $(obj_us).html('<div class="us_control">'+us_i+'</div>');
        }
      }
    } else {
      if (this.isControlled("us", country) == 0) {
        if (this.countries[country].us > 0) {
          $(obj_us).html('<div class="us_uncontrol">'+us_i+'</div>');
        }
      } else {
        if (this.isControlled("ussr", country) == 1) {
          $(obj_ussr).html('<div class="ussr_control">'+ussr_i+'</div>');
        }
      }
    }


    //
    // update HTML
    //
    if (has_control == 1) {
      if (player == "us") {
        $(obj_us).html('<div class="us_control">'+us_i+'</div>');
      } else {
        $(obj_ussr).html('<div class="ussr_control">'+ussr_i+'</div>');
      }
    } else {
      if (player == "us") {
        if (us_i == 0) {
          $(obj_us).html('');
        } else {
          $(obj_us).html('<div class="us_uncontrol">'+us_i+'</div>');
        }
      } else {
        if (ussr_i == 0) {
          $(obj_ussr).html('');
        } else {
          $(obj_ussr).html('<div class="ussr_uncontrol">'+ussr_i+'</div>');
        }
      }
    }

    $('.us_control').css('height', this.scale(100)+"px");
    $('.us_uncontrol').css('height', this.scale(100)+"px");
    $('.ussr_control').css('height', this.scale(100)+"px");
    $('.ussr_uncontrol').css('height', this.scale(100)+"px");

    $('.us_control').css('font-size', this.scale(100)+"px");
    $('.us_uncontrol').css('font-size', this.scale(100)+"px");
    $('.ussr_control').css('font-size', this.scale(100)+"px");
    $('.ussr_uncontrol').css('font-size', this.scale(100)+"px");

    //
    // adjust screen ratio
    //
    $('.country').css('width', this.scale(202)+"px");
    $('.us').css('width', this.scale(100)+"px");
    $('.ussr').css('width', this.scale(100)+"px");
    $('.us').css('height', this.scale(100)+"px");
    $('.ussr').css('height', this.scale(100)+"px");

    //
    // update game state
    //
    this.game.countries = this.countries;

    if (mycallback != null) { mycallback(country, player); }

  }








 
  playerRealign(player, card, mycallback=null) {

    // reset off
    this.playerFinishedPlacingInfluence();

    var twilight_self = this;
    var valid_target = 0;

    // all countries can be realigned
    for (var i in this.countries) {

      let countryname = i;

      valid_target = 1;





      //
      // Region Restrictions
      //
      if (twilight_self.game.state.limit_region.indexOf(twilight_self.countries[countryname].region) > -1) {
        valid_target = 0;
      }

      //
      // DEFCON restrictions
      //
      if (twilight_self.game.state.limit_ignoredefcon == 0) {
        if (twilight_self.countries[countryname].region == "europe" && twilight_self.game.state.defcon < 5) {
          valid_target = 0;
        }
        if (twilight_self.countries[countryname].region == "asia" && twilight_self.game.state.defcon < 4) {
          valid_target = 0;
        }
        if (twilight_self.countries[countryname].region == "seasia" && twilight_self.game.state.defcon < 4) {
          valid_target = 0;
        }
        if (twilight_self.countries[countryname].region == "mideast" && twilight_self.game.state.defcon < 3) {
          valid_target = 0;
        }
      }



      //
      // END OF HISTORY
      //
      if (twilight_self.game.state.events.inftreaty == 1){
        valid_target = 1;
      }    

      //
      // Can Only Realign Countries with Opponent Influence
      //
      if (twilight_self.game.player == 1) {
        if (twilight_self.countries[countryname].us < 1) {
          valid_target = 0;
        }
      } else {
        if (twilight_self.countries[countryname].ussr < 1) {
          valid_target = 0;
        }
      }


      let divname      = '#'+i;

      if (valid_target == 1) {

        $(divname).off();
        $(divname).on('click', function() {

          let c = $(this).attr('id');

          //
          // US / Japan Alliance
          //
           if (twilight_self.game.state.events.usjapan == 1 && c == "japan" && player == "ussr") {
            // twilight_self.displayModal("US / Japan Alliance prevents realignments in Japan");
            twilight_self.displayModal("Invalid Realignment", `US / Japan Alliance prevents realignments in Japan`);
	    return;
          }

          //
          // Nato
          //
          if (twilight_self.game.state.events.nato == 1 && twilight_self.countries[c].region == "europe" && player == "ussr") {
            if (twilight_self.isControlled("us", c) == 1) {
              if ( (c == "westgermany" && twilight_self.game.state.events.nato_westgermany == 0) || (c == "france" && twilight_self.game.state.events.nato_france == 0) ) {} else {
                twilight_self.displayModal("Invalid Realignment", `Nato prevents realignments in US Controlled countries in Europe`);
	        return;
              }
            }
          }


          //
          // vietnam revolts and china card bonuses
          //
          if (twilight_self.countries[c].region !== "seasia") { twilight_self.game.state.events.vietnam_revolts_eligible = 0; }
          if (twilight_self.countries[c].region !== "seasia" && twilight_self.countries[c].region !== "asia") { twilight_self.game.state.events.china_card_eligible = 0; }
         
          var result = twilight_self.playRealign(c);
          twilight_self.addMove("realign\t"+player+"\t"+c);
          mycallback();
                  
        });

      } else {

        $(divname).off();
        $(divname).on('click', function() {
          twilight_self.displayModal("Invalid Target");
        });

      }
    }
  }

  playerPlaceInfluence(player, mycallback=null) {

this.startClock();

    // reset off
    this.playerFinishedPlacingInfluence();

    var twilight_self = this;
    let xpos = 0;
    let ypos = 0;

    for (var i in this.countries) {

      let countryname  = i;
      let divname      = '#'+i;

      let restricted_country = 0;

      //
      // Chernobyl
      //
      if (this.game.player == 1 && this.game.state.events.chernobyl != "") {
        if (this.countries[i].region == this.game.state.events.chernobyl) { 
	  restricted_country = 1;
          if (this.game.state.events.chernobyl == "asia") {
            if (this.countries[i].region == "seasia") { 
	      restricted_country = 1;
	    }
          }
        }
      }

      if (this.game.state.limit_region.indexOf(this.countries[i].region) > -1) { restricted_country = 1; }

      if (restricted_country == 1) {

        $(divname).off();
        $(divname).on('click', function() {
          twilight_self.displayModal("Invalid Target");
        });

      } else {

        if (player == "us") {

          $(divname).off();
          $(divname).on('mousedown', function (e) {
            xpos = e.clientX;
            ypos = e.clientY;
          });
          $(divname).on('mouseup', function (e) {
            if (Math.abs(xpos-e.clientX) > 4) { return; }
            if (Math.abs(ypos-e.clientY) > 4) { return; }
            //$(divname).on('click', function() {

            let countryname = $(this).attr('id');

            if (twilight_self.countries[countryname].place == 1) {

              //
              // vietnam revolts and china card - US never eligible for former
              //
              twilight_self.game.state.events.vietnam_revolts_eligible = 0;
              //if (twilight_self.countries[countryname].region !== "seasia") { twilight_self.game.state.events.vietnam_revolts_eligible = 0; }
              if (twilight_self.countries[countryname].region.indexOf("asia") < 0) { twilight_self.game.state.events.china_card_eligible = 0; }

              if (twilight_self.isControlled("ussr", countryname) == 1) { twilight_self.game.break_control = 1; }

              //
              // permit cuban missile crisis removal after placement
              //
              if (twilight_self.game.state.events.cubanmissilecrisis == 2) {
                if (countryname === "turkey" || countryname === "westgermany") {
                  if (twilight_self.countries[countryname].us >= 1) {

                    //
                    // allow player to remove CMC
                    //
                    if (twilight_self.app.BROWSER == 1) {

                      let removeinf = confirm("You are placing 1 influence in "+twilight_self.countries[countryname].name+". Once this is done, do you want to cancel the Cuban Missile Crisis by removing 2 influence in "+twilight_self.countries[countryname].name+"?");
                      if (removeinf) {

                        if (countryname === "turkey") {
                          twilight_self.removeInfluence("turkey", 2, "us");
                          twilight_self.addMove("remove\tus\tus\tturkey\t2");
                          twilight_self.addMove("unlimit\tcmc");
                          twilight_self.addMove("notify\tUS has cancelled the Cuban Missile Crisis");
                        }
                        if (countryname === "westgermany") {
                          twilight_self.removeInfluence("westgermany", 2, "us");
                          twilight_self.addMove("remove\tus\tus\twestgermany\t2");
                          twilight_self.addMove("unlimit\tcmc");
                          twilight_self.addMove("notify\tUS has cancelled the Cuban Missile Crisis");
                        }

			twilight_self.game.state.events.cubanmissilecrisis = 0;

                      }
                    }
                  }
                }
              }

              twilight_self.addMove("place\tus\tus\t"+countryname+"\t1");
              twilight_self.placeInfluence(countryname, 1, "us", mycallback);

            } else {
              twilight_self.displayModal("you cannot place there...");
              return;
            }
          });
        } else {

          $(divname).off();
          $(divname).on('mousedown', function (e) {
            xpos = e.clientX;
            ypos = e.clientY;
          });
          $(divname).on('mouseup', function (e) {
            if (Math.abs(xpos-e.clientX) > 4) { return; }
            if (Math.abs(ypos-e.clientY) > 4) { return; }
            //$(divname).on('click', function() {

            let countryname = $(this).attr('id');

            if (twilight_self.countries[countryname].place == 1) {

              //
              // vietnam revolts and china card
              //
              if (twilight_self.countries[countryname].region !== "seasia") { twilight_self.game.state.events.vietnam_revolts_eligible = 0; }
              if (twilight_self.countries[countryname].region.indexOf("asia") < 0) { twilight_self.game.state.events.china_card_eligible = 0; }
              if (twilight_self.isControlled("us", countryname) == 1) { twilight_self.game.break_control = 1; }

              //
              // permit cuban missile crisis removal after placement
              //
              if (twilight_self.game.state.events.cubanmissilecrisis == 1) {
                if (countryname === "cuba") {
                  if (twilight_self.countries[countryname].ussr >= 1) {

                    //
                    // allow player to remove CMC
                    //
                    if (twilight_self.app.BROWSER == 1) {

                      let removeinf = confirm("You are placing 1 influence in "+twilight_self.countries[countryname].name+". Once this is done, do you want to cancel the Cuban Missile Crisis by removing 2 influence in "+twilight_self.countries[countryname].name+"?");
                      if (removeinf) {

                        if (countryname === "cuba") {
                          twilight_self.removeInfluence("cuba", 2, "ussr");
                          twilight_self.addMove("remove\tussr\tussr\tcuba\t2");
                          twilight_self.addMove("unlimit\tcmc");
                          twilight_self.addMove("notify\tUSSR has cancelled the Cuban Missile Crisis");
                        }

			twilight_self.game.state.events.cubanmissilecrisis = 0;

                      }
                    }
                  }
                }
              }

              twilight_self.addMove("place\tussr\tussr\t"+countryname+"\t1");
              twilight_self.placeInfluence(countryname, 1, "ussr", mycallback);
            } else {
              twilight_self.displayModal("Invalid Target");
              return;
            }
          });
        } // NON RESTRICTED COUNTRY
      }
    }

  }


  playerFinishedPlacingInfluence(player, mycallback=null) {
    for (var i in this.countries) {
      let divname      = '#'+i;
      $(divname).off();
    }
    if (mycallback != null) { mycallback(); }
  }


  playerSpaceCard(card, player) {

    let card_ops = this.game.deck[0].cards[card].ops;

    // stats
    if (player == "us") { this.game.state.stats.us_ops_spaced += this.modifyOps(card_ops, card, player); }
    if (player == "ussr") { this.game.state.stats.ussr_ops_spaced += this.modifyOps(card_ops, card, player); }

    if (player == "ussr") {
      this.game.state.space_race_ussr_counter++;
    } else {
      this.game.state.space_race_us_counter++;
    }

    let roll = this.rollDice(6);

    let successful     = 0;
    let next_box       = 1;

    if (player == "ussr") { next_box = this.game.state.space_race_ussr+1; }
    if (player == "us") { next_box = this.game.state.space_race_us+1; }

    if (next_box == 1) { if (roll < 4) { successful = 1; } }
    if (next_box == 2) { if (roll < 5) { successful = 1; } }
    if (next_box == 3) { if (roll < 4) { successful = 1; } }
    if (next_box == 4) { if (roll < 5) { successful = 1; } }
    if (next_box == 5) { if (roll < 4) { successful = 1; } }
    if (next_box == 6) { if (roll < 5) { successful = 1; } }
    if (next_box == 7) { if (roll < 4) { successful = 1; } }
    if (next_box == 8) { if (roll < 3) { successful = 1; } }

    this.updateLog("<span>" + player.toUpperCase() + "</span> <span>attempts space race (rolls</span> " + roll + ")");

    if (successful == 1) {
      this.updateLog("<span>" + player.toUpperCase() + "</span> <span>advances in the Space Race</span>");
      this.advanceSpaceRace(player);
    } else {
      this.updateLog("<span>" + player.toUpperCase() + "</span> <span>fails in the Space Race</span>");
    }

  }




  ///////////
  // COUPS //
  ///////////
  playerCoupCountry(player,  ops, card) {

    var twilight_self = this;

    for (var i in this.countries) {

      let countryname  = i;
      let divname      = '#'+i;

      $(divname).off();
      $(divname).on('click', function() {

        let valid_target = 0;
        let countryname = $(this).attr('id');

        //
        // sanity DEFCON check
        //
        if (twilight_self.game.state.defcon == 2 && twilight_self.game.countries[countryname].bg == 1) {
          if (confirm("Are you sure you wish to coup a Battleground State? (DEFCON is 2)")) {
          } else {
            twilight_self.playOps(player, ops, card);
            return;
          }
        }

        //
        // sanity Cuban Missile Crisis check
        //
        if (twilight_self.game.state.events.cubanmissilecrisis == 2 && player =="us" ||
            twilight_self.game.state.events.cubanmissilecrisis == 1 && player =="ussr"
        ) {
          if (confirm("Are you sure you wish to coup during the Cuban Missile Crisis?")) {
          } else {
            twilight_self.playOps(player, ops, card);
            return;
          }
        }



        if (player == "us") {
          if (twilight_self.countries[countryname].ussr <= 0) { twilight_self.displayModal("Cannot Coup"); } else { valid_target = 1; }
        } else {
          if (twilight_self.countries[countryname].us <= 0)   { twilight_self.displayModal("Cannot Coup"); } else { valid_target = 1; }
        }

        //
        // Coup Restrictions
        //
        if (twilight_self.game.state.events.usjapan == 1 && countryname == "japan") {
          twilight_self.displayModal("US / Japan Alliance prevents coups in Japan");
          valid_target = 0;
        }
        if (twilight_self.game.state.limit_ignoredefcon == 0) {
          if (twilight_self.game.state.limit_region.indexOf(twilight_self.countries[countryname].region) > -1) {
            twilight_self.displayModal("Invalid Region for this Coup");
            valid_target = 0;
          }
          if (twilight_self.countries[countryname].region == "europe" && twilight_self.game.state.defcon < 5) {
            twilight_self.displayModal("DEFCON prevents coups in Europe");
            valid_target = 0;
          }
          if (twilight_self.countries[countryname].region == "asia" && twilight_self.game.state.defcon < 4) {
            twilight_self.displayModal("DEFCON prevents coups in Asia");
            valid_target = 0;
          }
          if (twilight_self.countries[countryname].region == "seasia" && twilight_self.game.state.defcon < 4) {
            twilight_self.displayModal("DEFCON prevents coups in Asia");
            valid_target = 0;
          }
          if (twilight_self.countries[countryname].region == "mideast" && twilight_self.game.state.defcon < 3) {
            twilight_self.displayModal("DEFCON prevents coups in the Middle-East");
            valid_target = 0;
          }
        }

        // Nato Coup Restriction
        if (valid_target == 1 && twilight_self.countries[countryname].region == "europe" && twilight_self.game.state.events.nato == 1 && player == "ussr") {
          if (twilight_self.isControlled("us", countryname) == 1) {
            if ( (countryname == "westgermany" && twilight_self.game.state.events.nato_westgermany == 0) || (countryname == "france" && twilight_self.game.state.events.nato_france == 0) ) {} else {
              twilight_self.displayModal("NATO prevents coups of US-controlled countries in Europe");
              valid_target = 0;
            }
          }
        }

        // The Reformer Coup Restriction
        if (valid_target == 1 && twilight_self.countries[countryname].region == "europe" && twilight_self.game.state.events.reformer == 1 && player == "ussr") {
          twilight_self.displayModal("The Reformer prevents USSR coup attempts in Europe");
          valid_target = 0;
        }

        if (valid_target == 1) {

          //
          // china card regional bonuses
          //
          if (card == "china" && (twilight_self.game.countries[countryname].region == "asia" || twilight_self.game.countries[countryname].region == "seasia")) {
            twilight_self.updateLog("China bonus OP added to Asia coup...");
            ops++;
          }
          if (player == "ussr" && twilight_self.game.state.events.vietnam_revolts == 1 && twilight_self.game.countries[countryname].region == "seasia") {
	    if (twilight_self.returnOpsOfCard(card) == 1 && twilight_self.game.state.events.redscare_player1 >= 1) {
              twilight_self.updateLog("Vietnam Revolts bonus OP removed by Red Purge");
	    } else { 
              twilight_self.updateLog("Vietnam Revolts bonus OP added to Southeast Asia coup...");
              ops++;
            }
          }

          // twilight_self.displayModal("Coup launched in " + twilight_self.game.countries[countryname].name);
          twilight_self.displayModal("Coup Launched", `Coup launched in ${twilight_self.game.countries[countryname].name}`);
          twilight_self.addMove("coup\t"+player+"\t"+countryname+"\t"+ops+"\t"+card);
          twilight_self.endTurn();
        }

      });
    }
  }




  playCoup(player, countryname, ops, mycallback=null) {

    let roll    = this.rollDice(6);

    // stats
    if (player == "us") { this.game.state.stats.us_coups.push(roll); }
    if (player == "ussr") { this.game.state.stats.ussr_coups.push(roll); }

    //
    // Yuri and Samantha
    //
    if (this.game.state.events.yuri == 1) {
      if (player == "us") {
        this.game.state.vp -= 1;
        this.updateVictoryPoints();
        this.updateLog("USSR gains 1 VP from Yuri and Samantha");
      }
    }

    //
    // Salt Negotiations
    //
    if (this.game.state.events.saltnegotiations == 1) {
      this.updateLog("Salt Negotiations -1 modifier on coups");
      roll--;
    }

    //
    // Latin American Death Squads
    //
    if (this.game.state.events.deathsquads != 0) {
      if (this.game.state.events.deathsquads <= -1) {
	let roll_modifier = this.game.state.events.deathsquads * -1;
        if (this.countries[countryname].region == "camerica" || this.countries[countryname].region == "samerica") {
          if (player == "ussr") {
            this.updateLog("Latin American Death Squads triggers: USSR "+roll_modifier+" modifier");
            roll += roll_modifier;
          }
          if (player == "us")   {
            if (this.countries[countryname].region == "camerica" || this.countries[countryname].region == "samerica") {
              this.updateLog("Latin American Death Squads triggers: US -"+roll_modifier+" modifier");
              roll -= roll_modifier;
            }
          }
        }
      }
      if (this.game.state.events.deathsquads >= 1) {
        let roll_modifier = this.game.state.events.deathsquads;
        if (this.countries[countryname].region == "camerica" || this.countries[countryname].region == "samerica") {
          if (player == "ussr") {
            this.updateLog("Latin American Death Squads triggers: USSR -"+roll_modifier+" modifier");
            roll -= roll_modifier;
          }
          if (player == "us")   {
            this.updateLog("Latin American Death Squads triggers: US "+roll_modifier+" modifier");
            roll += roll_modifier;
          }
        }
      }
    }



    //
    // END OF HISTORY (INF Treaty and CMC)
    //
    if (this.game.state.events.inftreaty == 1) {
        this.updateLog("INF Treaty -1 modifier on coups");
        roll--;
    }
    if ((player == "ussr" && this.game.state.events.cubanmissilecrisis == 1) || (player == "us" && this.game.state.events.cubanmissilecrisis == 2)) {
	this.game.state.events.cubanmissilecrisis = 0;
    }


    let control = this.countries[countryname].control;
    let winning = parseInt(roll) + parseInt(ops) - parseInt(control * 2);


    //
    // Cuban Missile Crisis
    //
    if (player == "ussr" && this.game.state.events.cubanmissilecrisis == 1) {
      this.endGame("us","Cuban Missile Crisis");
      return;
    }
    if (player == "us" && this.game.state.events.cubanmissilecrisis == 2) {
      this.endGame("ussr","Cuban Missile Crisis");
      return;
    }


    if (this.countries[countryname].bg == 1) {
      //
      // Nuclear Submarines
      //
      if (player == "us" && this.game.state.events.nuclearsubs == 1) {} else {
	if (this.game.state.lower_defcon_on_coup == 1) {
          this.lowerDefcon();
	}
      }
    }


    if (winning > 0) {

      if (this.browser_active == 1) {
        this.displayModal(`COUP SUCCEEDED: ${player.toUpperCase()} rolls ${roll} (${this.game.countries[countryname].name})`);
      }

      this.updateLog(player.toUpperCase() + " <span>rolls</span> " + roll);

      while (winning > 0) {

        if (player == "us") {

          if (this.countries[countryname].ussr > 0) {
            this.removeInfluence(countryname, 1, "ussr");
          } else {
            this.placeInfluence(countryname, 1, "us");
          }
        }

        if (player == "ussr") {
          if (this.countries[countryname].us > 0) {
            this.removeInfluence(countryname, 1, "us");
          } else {
            this.placeInfluence(countryname, 1, "ussr");
          }
        }

        winning--;

      }
    } else {

      if (this.browser_active == 1) {
        this.updateLog(player.toUpperCase() + "</span> <span>rolls</span> " + roll + " <span>(no change)");
      }
    }


    //
    // update country
    //
    this.showInfluence(countryname, player);

    if (mycallback != null) {
      mycallback();
    }

    return;
  }



  playRealign(country) {

    let outcome_determined = 0;

    while (outcome_determined == 0) {

      let bonus_us = 0;
      let bonus_ussr = 0;

      if (this.countries[country].us > this.countries[country].ussr) {
        bonus_us++;
      }
      if (this.countries[country].ussr > this.countries[country].us) {
        bonus_ussr++;
      }
      for (let z = 0; z < this.countries[country].neighbours.length; z++) {
        let racn = this.countries[country].neighbours[z];
        if (this.isControlled("us", racn) == 1) {
          bonus_us++;
        }
        if (this.isControlled("ussr", racn) == 1) {
          bonus_ussr++;
        }
      }

      //
      // handle adjacent influence
      //
      if (country === "mexico") { bonus_us++; }
      if (country === "cuba")   { bonus_us++; }
      if (country === "japan")  { bonus_us++; }
      if (country === "canada") { bonus_us++; }
      if (country === "finland") { bonus_ussr++; }
      if (country === "romania") { bonus_ussr++; }
      if (country === "afghanistan") { bonus_ussr++; }
      if (country === "northkorea") { bonus_ussr++; }


      //
      // Iran-Contra Scandal
      //
      if (this.game.state.events.irancontra == 1) {
        this.updateLog("Iran-Contra Scandal -1 modification on US roll");
        bonus_us--;
      }

      let roll_us   = this.rollDice(6);
      let roll_ussr = this.rollDice(6);

      this.updateLog("<span>US bonus</span> " + bonus_us + " <span>vs. USSR bonus</span> " + bonus_ussr);
      this.updateLog("<span>US roll</span> " + roll_us + " <span>vs. USSR roll</span> " + roll_ussr);

      roll_us   = roll_us + bonus_us;
      roll_ussr = roll_ussr + bonus_ussr;

      if (roll_us > roll_ussr) {
        outcome_determined = 1;
        let diff = roll_us - roll_ussr;
        if (this.countries[country].ussr > 0) {
          if (this.countries[country].ussr < diff) {
            diff = this.countries[country].ussr;
          }
          this.removeInfluence(country, diff, "ussr");
        }
      }
      if (roll_us < roll_ussr) {
        outcome_determined = 1;
        let diff = roll_ussr - roll_us;
        if (this.countries[country].us > 0) {
          if (this.countries[country].us < diff) {
            diff = this.countries[country].us;
          }
          this.removeInfluence(country, diff, "us");
        }
      }
      if (roll_us === roll_ussr) {
        outcome_determined = 1;
      }
    }

    this.showInfluence(country, "us");
    this.showInfluence(country, "ussr");

  }








  ///////////////////////
  // Twilight Specific //
  ///////////////////////
  addMove(mv) {
    this.moves.push(mv);
  }

  removeMove() {
    return this.moves.pop();
  }

  endTurn(nextTarget=0) {

    //
    // cancel back button on subsequent cards picks
    //
    //this.game.state.back_button_cancelled = 1;


    //
    // show active events
    //
    this.updateEventTiles();


    this.updateStatus("<div class='status-message' id='status-message'>Waiting for information from peers....</div>");

    //
    // remove events from board to prevent "Doug Corley" gameplay
    //
    try {
    $(".card").off();
    $(".country").off();
    } catch (err) {}

    //
    // we will bury you scores first!
    //
    if (this.game.state.events.wwby_triggers == 1) {
      this.addMove("notify\tWe Will Bury You triggers +3 VP for USSR");
      this.addMove("vp\tussr\t3");
      this.game.state.events.wwby_triggers = 0;
    }

    let cards_in_hand = this.game.deck[0].hand.length;
    for (let z = 0; z < this.game.deck[0].hand.length; z++) {
      if (this.game.deck[0].hand[z] == "china") {
        cards_in_hand--;
      }
    }

    let extra = {};
    this.addMove("setvar\t"+this.game.player+"\topponent_cards_in_hand\t"+cards_in_hand);
    this.game.turn = this.moves;
    this.moves = [];
    this.sendMessage("game", extra);

  console.log("MESSAGE SENT: " + this.game.queue);

  }


  undoMove(move_type, num_of_moves) {

    switch(move_type) {
      case 'place':
        // iterate through the queue and remove past moves
        // cycle through past moves to know what to revert
        for (let i = 0; i < num_of_moves; i++) {
          let last_move = this.removeMove();
          last_move = last_move.split('\t');
          let player = last_move[2];
          let country = last_move[3];
          let ops = last_move[4];

    let opponent = "us";
    if (player == "us") { opponent = "ussr"; }
          this.removeInfluence(country, ops, player);

    //
    // if the country is now enemy controlled, it must have taken an extra move
    // for the play to place there....
    //
          if (this.isControlled(opponent, country) == 1) {
      i++;
          }

        }

        // use this to clear the "resolve ops" move
        this.removeMove();
        return 1;
      default:
        break;
        return 0;
    }
  }


  endGame(winner, method) {

    this.game.over = 1;
    if (winner == "us") { this.game.winner = 2; }
    if (winner == "ussr") { this.game.winner = 1; }
    if (winner == "tie game") { 
      this.game.winner = 0; 
      this.game.over = 1;
      this.tieGame(this.game.id);
      return;
    }

    if (this.game.winner != this.game.player) {
      //
      // share wonderful news
      //
      this.game.over = 0;
      this.resignGame(this.game.id);
    }

    if (this.browser_active == 1) {
      this.displayModal("<span>The Game is Over</span> - <span>" + winner.toUpperCase() + "</span> <span>wins by</span> <span>" + method + "<span>");
      this.updateStatus("<div class='status-message' id='status-message'><span>The Game is Over</span> - <span>" + winner.toUpperCase() + "</span> <span>wins by</span> <span>" + method + "<span></div>");
    }
  }

  displayBoard() {
    this.updateDefcon();
    this.updateActionRound();
    this.updateSpaceRace();
    this.updateVictoryPoints();
    this.updateMilitaryOperations();
    this.updateRound();
  }


  endRound() {

    this.game.state.round++;
    this.game.state.turn 		= 0;
    this.game.state.turn_in_round = 0;
    this.game.state.move 		= 0;

    //
    // game over if scoring card is held
    //
    if (this.game.state.round > 1) {
      for (let i = 0 ; i < this.game.deck[0].hand.length; i++) {
        if (this.game.deck[0].hand[i] != "china") {
	  try {
            if (this.game.deck[0].cards[this.game.deck[0].hand[i]].scoring == 1) {
              let player = "us";
              let winner = "ussr";
              if (this.game.player == 1) { player = "ussr"; winner = "us"; this.game.winner = 2; }
                this.endGame(winner, "opponent held scoring card");
            }
          } catch (err) {}
	}
      }
    }


    //
    // calculate milops
    //
    if (this.game.state.round > 1) {
      let milops_needed = this.game.state.defcon;
      let ussr_milops_deficit = (this.game.state.defcon-this.game.state.milops_ussr);
      let us_milops_deficit = (this.game.state.defcon-this.game.state.milops_us);

      if (ussr_milops_deficit > 0) {
        this.game.state.vp += ussr_milops_deficit;
        this.updateLog("<span>USSR penalized</span> " + ussr_milops_deficit + " <span>VP (milops)</span>");
      }
      if (us_milops_deficit > 0) {
        this.game.state.vp -= us_milops_deficit;
        this.updateLog("<span>US penalized</span> " + us_milops_deficit + " <span>VP (milops)</span>");
      }
    }

    this.game.state.us_defcon_bonus = 0;

    this.game.state.milops_us = 0;
    this.game.state.milops_ussr = 0;

    this.game.state.space_race_us_counter = 0;
    this.game.state.space_race_ussr_counter = 0;
    this.game.state.eagle_has_landed_bonus_taken = 0;
    this.game.state.space_shuttle_bonus_taken = 0;

    // set to 1 when ironlady events before ops played (by ussr - limits placement to rules)
    this.game.state.ironlady_before_ops = 0;

    this.game.state.events.wwby_triggers = 0;
    this.game.state.events.region_bonus = "";
    this.game.state.events.u2 = 0;
    this.game.state.events.containment = 0;
    this.game.state.events.brezhnev = 0;
    this.game.state.events.redscare_player1 = 0;
    this.game.state.events.redscare_player2 = 0;
    this.game.state.events.vietnam_revolts = 0;
    this.game.state.events.vietnam_revolts_eligible = 0;
    this.game.state.events.deathsquads = 0;
    this.game.state.events.missileenvy = 0;
    this.game.state.events.cubanmissilecrisis = 0;
    this.game.state.events.nuclearsubs = 0;
    this.game.state.events.saltnegotiations = 0;
    this.game.state.events.northseaoil_bonus = 0;
    this.game.state.events.yuri = 0;
    this.game.state.events.irancontra = 0;
    this.game.state.events.chernobyl = "";
    this.game.state.events.aldrich = 0;

    //
    // increase DEFCON by one
    //
    this.game.state.defcon++;
    if (this.game.state.defcon > 5) { this.game.state.defcon = 5; }
    this.game.state.ussr_milops = 0;
    this.game.state.us_milops = 0;


    this.updateDefcon();
    this.updateActionRound();
    this.updateSpaceRace();
    this.updateVictoryPoints();
    this.updateMilitaryOperations();
    this.updateRound();


    //
    // give me the china card if needed -- OBSERVER
    //
    if (this.game.player != 0) {
    let do_i_have_the_china_card = 0;
    for (let i = 0; i < this.game.deck[0].hand.length; i++) {
      if (this.game.deck[0].hand[i] == "china") {
        do_i_have_the_china_card = 1;
      }
    }
    if (do_i_have_the_china_card == 0) {
      if (this.game.player == 1) {
        if (this.game.state.events.china_card == 1) {
          if (!this.game.deck[0].hand.includes("china")) {
            this.game.deck[0].hand.push("china");
          }
        }
      }
      if (this.game.player == 2) {
        if (this.game.state.events.china_card == 2) {
          if (!this.game.deck[0].hand.includes("china")) {
            this.game.deck[0].hand.push("china");
          }
        }
      }
    }
    }
    this.game.state.events.china_card = 0;
    this.game.state.events.china_card_eligible = 0;


  }




  whoHasTheChinaCard() {

    //
    // the observer has no clue
    //
    if (this.game.player == 0) {
      return "ussr";
    }

    let do_i_have_the_china_card = 0;

    for (let i = 0; i < this.game.deck[0].hand.length; i++) {
      if (this.game.deck[0].hand[i] == "china") {
        do_i_have_the_china_card = 1;
      }
    }

    if (do_i_have_the_china_card == 0) {
      if (this.game.player == 1) {
        if (this.game.state.events.china_card == 1) {
          if (!this.game.deck[0].hand.includes("china")) {
            return "us";
          } else {
            return "ussr";
          }
        } else {
          if (do_i_have_the_china_card == 1) {
            return "ussr";
          } else {
            return "us";
          }
        }
      }
      if (this.game.player == 2) {
        if (this.game.state.events.china_card == 2) {
          if (!this.game.deck[0].hand.includes("china")) {
            return "ussr";
          } else {
            return "us";
          }
        } else {
          if (do_i_have_the_china_card == 1) {
            return "us";
          } else {
            return "ussr";
          }
        }
      }
    } else {
      if (this.game.player == 1) { return "ussr"; }
      if (this.game.player == 2) { return "us"; }
    }

    //
    // we should never hit this
    //

  }




  ////////////////////
  // Core Game Data //
  ////////////////////
  returnState() {

    var state = {};

    state.dealt = 0;
    state.back_button_cancelled = 0;
    state.defectors_pulled_in_headline = 0;
    state.placement = 0;
    state.headline  = 0;
    state.headline_hash = "";
    state.headline_card = "";
    state.headline_xor = "";
    state.headline_opponent_hash = "";
    state.headline_opponent_card = "";
    state.headline_opponent_xor = "";
    state.round = 0;
    state.turn  = 0;
    state.turn_in_round = 0;
    state.broke_control = 0;
    state.us_efcon_bonus = 0;
    state.opponent_cards_in_hand = 0;
    state.event_before_ops = 0;
    state.event_name = "";
    state.player_to_go = 1; // used in headline to track phasing player (primarily for assigning losses for defcon lowering stunts)

    state.lower_defcon_on_coup = 1;

    state.vp_outstanding = 0; // vp not settled yet

    state.space_race_us = 0;
    state.space_race_ussr = 0;

    state.animal_in_space = "";
    state.man_in_earth_orbit = "";
    state.eagle_has_landed = "";
    state.eagle_has_landed_bonus_taken = 0;
    state.space_shuttle = "";
    state.space_shuttle_bonus_taken = 0;

    state.space_race_us_counter = 0;
    state.space_race_ussr_counter = 0;

    state.limit_coups = 0;
    state.limit_realignments = 0;
    state.limit_placement = 0;
    state.limit_spacerace = 0;
    state.limit_region = "";
    state.limit_ignoredefcon = 0;

    // track as US (+) and USSR (-)
    state.vp    = 0;

    state.ar_ps         = [];

    // relative --> top: 38px
    state.ar_ps[0]      = { top : 208 , left : 920 };
    state.ar_ps[1]      = { top : 208 , left : 1040 };
    state.ar_ps[2]      = { top : 208 , left : 1155 };
    state.ar_ps[3]      = { top : 208 , left : 1270 };
    state.ar_ps[4]      = { top : 208 , left : 1390 };
    state.ar_ps[5]      = { top : 208 , left : 1505 };
    state.ar_ps[6]      = { top : 208 , left : 1625 };
    state.ar_ps[7]      = { top : 208 , left : 1740 };

    state.vp_ps     = [];
    state.vp_ps[0]  = { top : 2460, left : 3040 };
    state.vp_ps[1]  = { top : 2460, left : 3300 };
    state.vp_ps[2]  = { top : 2460, left : 3435 };
    state.vp_ps[3]  = { top : 2460, left : 3570 };
    state.vp_ps[4]  = { top : 2460, left : 3705 };
    state.vp_ps[5]  = { top : 2460, left : 3840 };
    state.vp_ps[6]  = { top : 2460, left : 3975 };
    state.vp_ps[7]  = { top : 2460, left : 4110 };

    state.vp_ps[8]  = { top : 2600, left : 3035 };
    state.vp_ps[9]  = { top : 2600, left : 3170 };
    state.vp_ps[10]  = { top : 2600, left : 3305 };
    state.vp_ps[11]  = { top : 2600, left : 3435 };
    state.vp_ps[12]  = { top : 2600, left : 3570 };
    state.vp_ps[13]  = { top : 2600, left : 3705 };
    state.vp_ps[14]  = { top : 2600, left : 3840 };
    state.vp_ps[15]  = { top : 2600, left : 3975 };
    state.vp_ps[16]  = { top : 2600, left : 4110 };

    state.vp_ps[17]  = { top : 2740, left : 3035 };
    state.vp_ps[18]  = { top : 2740, left : 3170 };
    state.vp_ps[19]  = { top : 2740, left : 3305 };
    state.vp_ps[20]  = { top : 2740, left : 3570 };
    state.vp_ps[21]  = { top : 2740, left : 3840 };
    state.vp_ps[22]  = { top : 2740, left : 3975 };
    state.vp_ps[23]  = { top : 2740, left : 4110 };

    state.vp_ps[24]  = { top : 2880, left : 3035 };
    state.vp_ps[25]  = { top : 2880, left : 3170 };
    state.vp_ps[26]  = { top : 2880, left : 3305 };
    state.vp_ps[27]  = { top : 2880, left : 3435 };
    state.vp_ps[28]  = { top : 2880, left : 3570 };
    state.vp_ps[29]  = { top : 2880, left : 3705 };
    state.vp_ps[30]  = { top : 2880, left : 3840 };
    state.vp_ps[31]  = { top : 2880, left : 3975 };
    state.vp_ps[32]  = { top : 2880, left : 4110 };

    state.vp_ps[33]  = { top : 3025, left : 3035 };
    state.vp_ps[34]  = { top : 3025, left : 3170 };
    state.vp_ps[35]  = { top : 3025, left : 3305 };
    state.vp_ps[36]  = { top : 3025, left : 3435 };
    state.vp_ps[37]  = { top : 3025, left : 3570 };
    state.vp_ps[38]  = { top : 3025, left : 3705 };
    state.vp_ps[39]  = { top : 3025, left : 3840 };
    state.vp_ps[40]  = { top : 3025, left : 3975 };

    state.space_race_ps = [];
    state.space_race_ps[0] = { top : 510 , left : 3465 }
    state.space_race_ps[1] = { top : 510 , left : 3638 }
    state.space_race_ps[2] = { top : 510 , left : 3810 }
    state.space_race_ps[3] = { top : 510 , left : 3980 }
    state.space_race_ps[4] = { top : 510 , left : 4150 }
    state.space_race_ps[5] = { top : 510 , left : 4320 }
    state.space_race_ps[6] = { top : 510 , left : 4490 }
    state.space_race_ps[7] = { top : 510 , left : 4660 }
    state.space_race_ps[8] = { top : 510 , left : 4830 }

    state.milops_us = 0;
    state.milops_ussr = 0;

    state.milops_ps    = [];
    state.milops_ps[0]  = { top : 2940 , left : 1520 };
    state.milops_ps[1]  = { top : 2940 , left : 1675 };
    state.milops_ps[2]  = { top : 2940 , left : 1830 };
    state.milops_ps[3]  = { top : 2940 , left : 1985 };
    state.milops_ps[4]  = { top : 2940 , left : 2150 };
    state.milops_ps[5]  = { top : 2940 , left : 2305 };

    state.defcon = 5;

    state.defcon_ps    = [];
    state.defcon_ps[0] = { top : 2585, left : 1520 };
    state.defcon_ps[1] = { top : 2585, left : 1675 };
    state.defcon_ps[2] = { top : 2585, left : 1830 };
    state.defcon_ps[3] = { top : 2585, left : 1985 };
    state.defcon_ps[4] = { top : 2585, left : 2140 };

    state.round_ps    = [];
    state.round_ps[0] = { top : 150, left : 3473 };
    state.round_ps[1] = { top : 150, left : 3627 };
    state.round_ps[2] = { top : 150, left : 3781 };
    state.round_ps[3] = { top : 150, left : 3935 };
    state.round_ps[4] = { top : 150, left : 4098 };
    state.round_ps[5] = { top : 150, left : 4252 };
    state.round_ps[6] = { top : 150, left : 4405 };
    state.round_ps[7] = { top : 150, left : 4560 };
    state.round_ps[8] = { top : 150, left : 4714 };
    state.round_ps[9] = { top : 150, left : 4868 };

    // stats - statistics
    state.stats = {};
    state.stats.us_scorings = 0;
    state.stats.ussr_scorings = 0;
    state.stats.us_ops = 0;
    state.stats.ussr_ops = 0;
    state.stats.us_us_ops = 0;
    state.stats.ussr_us_ops = 0;
    state.stats.us_ussr_ops = 0;
    state.stats.ussr_ussr_ops = 0;
    state.stats.us_neutral_ops = 0;
    state.stats.ussr_neutral_ops = 0;
    state.stats.us_ops_spaced = 0;
    state.stats.ussr_ops_spaced = 0;
    state.stats.us_coups = [];
    state.stats.ussr_coups = [];
    state.stats.round = [];

    // events - early war
    state.events = {};
    state.events.optional = {};			// optional cards -- makes easier to search for
    state.events.formosan           = 0;
    state.events.redscare_player1   = 0;
    state.events.redscare_player2   = 0;
    state.events.containment        = 0;
    state.events.degaulle           = 0;
    state.events.nato               = 0;
    state.events.nato_westgermany   = 0;
    state.events.nato_france        = 0;
    state.events.marshall           = 0;
    state.events.warsawpact         = 0;
    state.events.unintervention     = 0;
    state.events.usjapan            = 0;
    state.events.norad              = 0;

    // regional bonus events
    state.events.vietnam_revolts     = 0;
    state.events.vietnam_revolts_eligible = 0;
    state.events.china_card          = 0;
    state.events.china_card_facedown = 0;
    state.events.china_card_in_play  = 0;
    state.events.china_card_eligible = 0;

    // events - mid-war
    state.events.northseaoil        = 0;
    state.events.johnpaul           = 0;
    state.events.ourmanintehran     = 0;
    state.events.kitchendebates     = 0;
    state.events.brezhnev           = 0;
    state.events.wwby               = 0;
    state.events.wwby_triggers      = 0;
    state.events.willybrandt        = 0;
    state.events.shuttlediplomacy   = 0;
    state.events.deathsquads        = 0;
    state.events.campdavid          = 0;
    state.events.cubanmissilecrisis = 0;
    state.events.saltnegotiations   = 0;
    state.events.missileenvy        = 0; // tracks whether happening
    state.events.missile_envy       = 0; // to whom
    state.events.flowerpower        = 0;
    state.events.beartrap           = 0;
    state.events.quagmire           = 0;

    // events - late war
    state.events.awacs              = 0;
    state.events.starwars           = 0;
    state.events.teardown           = 0;
    state.events.iranianhostage     = 0;
    state.events.ironlady           = 0;
    state.events.reformer           = 0;
    state.events.northseaoil        = 0;
    state.events.northseaoil_bonus  = 0;
    state.events.evilempire         = 0;
    state.events.yuri               = 0;
    state.events.aldrich            = 0;
    state.wargames_concession       = 6;

    //
    // events END OF HISTORY
    //
    state.events.inftreaty          = 0;


    //
    // events COLD WAR CRAZIES
    //
    state.events.communi          = 0;



    return state;

  }


  returnCountries() {

    var countries = {};

    // EUROPE
    countries['canada'] = { top : 752, left : 842 , us : 2 , ussr : 0 , control : 4 , bg : 0 , neighbours : [ 'uk' ] , region : "europe" , name : "Canada" };
    countries['uk'] = { top : 572, left : 1690 , us : 5 , ussr : 0 , control : 5 , bg : 0 , neighbours : [ 'canada','norway','benelux','france' ] , region : "europe" , name : "UK" };
    countries['benelux'] = { top : 728, left : 1860 , us : 0 , ussr : 0 , control : 3 , bg : 0 , neighbours : [ 'uk','westgermany' ] , region : "europe" , name : "Benelux" };
    countries['france'] = { top : 906, left : 1820 , us : 0 , ussr : 0 , control : 3 , bg : 1 , neighbours : [ 'algeria', 'uk','italy','spain','westgermany' ] , region : "europe" , name : "France" };
    countries['italy'] = { top : 1036, left : 2114 , us : 0 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'spain','france','greece','austria','yugoslavia' ] , region : "europe" , name : "Italy" };
    countries['westgermany'] = { top : 728, left : 2078 , us : 0 , ussr : 0 , control : 4 , bg : 1 , neighbours : [ 'austria','france','benelux','denmark','eastgermany' ] , region : "europe" , name : "West Germany" };
    countries['eastgermany'] = { top : 580, left : 2156 , us : 0 , ussr : 3 , control : 3 , bg : 1 , neighbours : [ 'westgermany','poland','austria','czechoslovakia' ] , region : "europe" , name : "East Germany" };
    countries['poland'] = { top : 580, left : 2386 , us : 0 , ussr : 0 , control : 3 , bg : 1 , neighbours : [ 'eastgermany','czechoslovakia' ] , region : "europe" , name : "Poland" };
    countries['spain'] = { top : 1118, left : 1660 , us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'morocco', 'france','italy' ] , region : "europe" , name : "Spain" };
    countries['greece'] = { top : 1200, left : 2392 , us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'italy','turkey','yugoslavia','bulgaria' ] , region : "europe" , name : "Greece" };
    countries['turkey'] = { top : 1056, left : 2788 , us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'syria', 'greece','romania','bulgaria' ] , region : "europe"  , name : "Turkey"};
    countries['yugoslavia'] = { top : 1038, left : 2342 , us : 0 , ussr : 0 , control : 3 , bg : 0 , neighbours : [ 'italy','hungary','romania','greece' ] , region : "europe" , name : "Yugoslavia" };
    countries['bulgaria'] = { top : 1038, left : 2570 , us : 0 , ussr : 0 , control : 3 , bg : 0 , neighbours : [ 'greece','turkey' ] , region : "europe" , name : "Bulgaria" };

    countries['romania'] = { top : 880, left : 2614 , us : 0 , ussr : 0 , control : 3 , bg : 0 , neighbours : [ 'turkey','hungary','yugoslavia' ] , region : "europe" , name : "Romania" };
    countries['hungary'] = { top : 880, left : 2394 , us : 0 , ussr : 0 , control : 3 , bg : 0 , neighbours : [ 'austria','czechoslovakia','romania','yugoslavia' ] , region : "europe" , name : "Hungary" };
    countries['austria'] = { top : 880, left : 2172 , us : 0 , ussr : 0 , control : 4 , bg : 0 , neighbours : [ 'hungary','italy','westgermany','eastgermany' ] , region : "europe" , name : "Austria" };
    countries['czechoslovakia'] = { top : 728, left : 2346 , us : 0 , ussr : 0 , control : 3 , bg : 0 , neighbours : [ 'hungary','poland','eastgermany' ] , region : "europe" , name : "Czechoslovakia" };
    countries['denmark'] = { top : 432, left : 1982 , us : 0 , ussr : 0 , control : 3 , bg : 0 , neighbours : [ 'sweden','westgermany' ] , region : "europe" , name : "Denmark" };
    countries['norway'] = { top : 278, left : 1932 , us : 0 , ussr : 0 , control : 4 , bg : 0 , neighbours : [ 'uk','sweden' ] , region : "europe" , name : "Norway" };
    countries['finland'] = { top : 286, left : 2522 , us : 0 , ussr : 1 , control : 4 , bg : 0 , neighbours : [ 'sweden' ] , region : "europe" , name : "Finland" };
    countries['sweden'] = { top : 410, left : 2234 , us : 0 , ussr : 0 , control : 4 , bg : 0 , neighbours : [ 'finland','denmark','norway' ] , region : "europe" , name : "Sweden" };

    // MIDDLE EAST
    countries['libya'] = { top : 1490, left : 2290, us : 0 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'egypt','tunisia' ] , region : "mideast" , name : "Libya" };
    countries['egypt'] = { top : 1510, left : 2520, us : 0 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'libya','sudan','israel' ], region : "mideast"  , name : "Egypt"};
    countries['lebanon'] = { top : 1205, left : 2660, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'syria','jordan','israel' ], region : "mideast"  , name : "Lebanon"};
    countries['syria'] = { top : 1205, left : 2870, us : 0 , ussr : 1 , control : 2 , bg : 0 , neighbours : [ 'lebanon','turkey','israel' ], region : "mideast"  , name : "Syria"};
    countries['israel'] = { top : 1350, left : 2620, us : 1 , ussr : 0 , control : 4 , bg : 1 , neighbours : [ 'egypt','jordan','lebanon','syria' ], region : "mideast" , name : "Israel" };
    countries['iraq'] = { top : 1350, left : 2870, us : 0 , ussr : 1 , control : 3 , bg : 1 , neighbours : [ 'jordan','iran','gulfstates','saudiarabia' ], region : "mideast" , name : "Iraq" };
    countries['iran'] = { top : 1350, left : 3082, us : 1 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'iraq','afghanistan','pakistan' ], region : "mideast" , name : "Iran" };
    countries['jordan'] = { top : 1500, left : 2760, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'israel','lebanon','iraq','saudiarabia' ], region : "mideast" , name : "Jordan" };
    countries['gulfstates'] = { top : 1500, left : 3010, us : 0 , ussr : 0 , control : 3 , bg : 0 , neighbours : [ 'iraq','saudiarabia' ], region : "mideast" , name : "Gulf States" };
    countries['saudiarabia'] = { top : 1650, left : 2950, us : 0 , ussr : 0 , control : 3 , bg : 1 , neighbours : [ 'jordan','iraq','gulfstates' ], region : "mideast" , name : "Saudi Arabia" };


    // ASIA
    countries['afghanistan'] = { top : 1250, left : 3345, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'iran','pakistan' ], region : "asia" , name : "Afghanistan" };
    countries['pakistan'] = { top : 1450, left : 3345, us : 0 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'iran','afghanistan','india' ], region : "asia" , name : "Pakistan"}
    countries['india'] = { top : 1552, left : 3585, us : 0 , ussr : 0 , control : 3 , bg : 1 , neighbours : [ 'pakistan','burma' ], region : "asia" , name : "India"};
    countries['burma'] = { top : 1580, left : 3855, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'india','laos' ], region : "seasia" , name : "Burma"};
    countries['laos'] = { top : 1600, left : 4070, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'burma','thailand','vietnam' ], region : "seasia" , name : "Laos"};
    countries['thailand'] = { top : 1769, left : 3980, us : 0 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'laos','vietnam','malaysia' ], region : "seasia" , name : "Thailand"};
    countries['vietnam'] = { top : 1760, left : 4200, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'laos','thailand' ], region : "seasia" , name : "Vietnam"};
    countries['malaysia'] = { top : 1990, left : 4080, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'thailand','australia','indonesia' ], region : "seasia" , name : "Malaysia"};
    countries['australia'] = { top : 2442, left : 4450, us : 4 , ussr : 0 , control : 4 , bg : 0 , neighbours : [ 'malaysia' ], region : "asia" , name : "Australia" };
    countries['indonesia'] = { top : 2176, left : 4450, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'malaysia','philippines' ], region : "seasia" , name : "Indonesia"};
    countries['philippines'] = { top : 1755, left : 4530, us : 1 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'indonesia','japan' ], region : "seasia" , name : "Philippines"};
    countries['taiwan'] = { top : 1525, left : 4435, us : 0 , ussr : 0 , control : 3 , bg : 0 , neighbours : [ 'japan','southkorea' ], region : "asia" , name : "Taiwan"};
    countries['japan'] = { top : 1348, left : 4705, us : 1 , ussr : 0 , control : 4 , bg : 1 , neighbours : [ 'philippines','taiwan','southkorea' ], region : "asia" , name : "Japan"};
    countries['southkorea'] = { top : 1200, left : 4530, us : 1 , ussr : 0 , control : 3 , bg : 1 , neighbours : [ 'japan','taiwan','northkorea' ], region : "asia" , name : "South Korea"};
    countries['northkorea'] = { top : 1050, left : 4480, us : 0 , ussr : 3 , control : 3 , bg : 1 , neighbours : [ 'southkorea' ], region : "asia" , name : "North Korea"};



    // CENTRAL AMERICA
    countries['mexico'] = { top : 1370, left : 175, us : 0 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'guatemala' ], region : "camerica" , name : "Mexico"};
    countries['guatemala'] = { top : 1526, left : 360, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'mexico','elsalvador','honduras' ], region : "camerica" , name : "Guatemala"};
    countries['elsalvador'] = { top : 1690, left : 295, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'honduras','guatemala' ], region : "camerica" , name : "El Salvador"};
    countries['honduras'] = { top : 1675, left : 515, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'nicaragua','costarica','guatemala','elsalvador' ], region : "camerica" , name : "Honduras"};
    countries['nicaragua'] = { top : 1675, left : 735, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'costarica','honduras','cuba' ], region : "camerica" , name : "Nicaragua"};
    countries['costarica'] = { top : 1830, left : 495, us : 0 , ussr : 0 , control : 3 , bg : 0 , neighbours : [ 'honduras', 'panama','nicaragua' ], region : "camerica" , name : "Costa Rica"};
    countries['panama'] = { top : 1830, left : 738, us : 1 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'colombia','costarica' ], region : "camerica" , name : "Panama"};
    countries['cuba'] = { top : 1480, left : 750, us : 0 , ussr : 0 , control : 3 , bg : 1 , neighbours : [ 'haiti','nicaragua' ], region : "camerica" , name : "Cuba"};
    countries['haiti'] = { top : 1620, left : 970, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'cuba','dominicanrepublic' ], region : "camerica" , name : "Haiti"};
    countries['dominicanrepublic'] = { top : 1620, left : 1180, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'haiti' ], region : "camerica" , name : "Dominican Republic"};

    // SOUTH AMERICA
    countries['venezuela'] = { top : 1850, left : 1000, us : 0 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'colombia','brazil' ], region : "samerica" , name : "Venezuela"};
    countries['colombia'] = { top : 2010, left : 878, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'panama','venezuela','ecuador' ], region : "samerica" , name : "Colombia"};
    countries['ecuador'] = { top : 2075, left : 650, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'peru','colombia' ], region : "samerica" , name : "Ecuador"};
    countries['peru'] = { top : 2244, left : 780, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'ecuador','chile','bolivia' ], region : "samerica" , name : "Peru"};
    countries['chile'] = { top : 2570, left : 885, us : 0 , ussr : 0 , control : 3 , bg : 1 , neighbours : [ 'peru','argentina' ], region : "samerica" , name : "Chile"};
    countries['bolivia'] = { top : 2385, left : 1005, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'paraguay','peru' ], region : "samerica" , name : "Bolivia"};
    countries['argentina'] = { top : 2860, left : 955, us : 0 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'chile','uruguay','paraguay' ], region : "samerica" , name : "Argentina"};
    countries['paraguay'] = { top : 2550, left : 1130, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'uruguay','argentina','bolivia' ], region : "samerica" , name : "Paraguay"};
    countries['uruguay'] = { top : 2740, left : 1200, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'argentina','paraguay','brazil' ], region : "samerica" , name : "Uruguay"};
    countries['brazil'] = { top : 2230, left : 1385, us : 0 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'uruguay','venezuela' ], region : "samerica" , name : "Brazil"};

    // AFRICA
    countries['morocco'] = { top : 1400, left : 1710, us : 0 , ussr : 0 , control : 3 , bg : 0 , neighbours : [ 'westafricanstates','algeria','spain' ], region : "africa" , name : "Morocco"};
    countries['algeria'] = { top : 1330, left : 1935, us : 0 , ussr : 0 , control : 2 , bg : 1 , neighbours : [ 'tunisia','morocco','france','saharanstates' ], region : "africa" , name : "Algeria"};
    countries['tunisia'] = { top : 1310, left : 2160, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'libya','algeria' ], region : "africa" , name : "Tunisia"};
    countries['westafricanstates'] = { top : 1595, left : 1690, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'ivorycoast','morocco' ], region : "africa" , name : "West African States"};
    countries['saharanstates'] = { top : 1650, left : 2025, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'algeria','nigeria' ], region : "africa" , name : "Saharan States"};
    countries['sudan'] = { top : 1690, left : 2550, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'egypt','ethiopia' ], region : "africa" , name : "Sudan"};
    countries['ivorycoast'] = { top : 1885, left : 1835, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'nigeria','westafricanstates' ], region : "africa" , name : "Ivory Coast"};
    countries['nigeria'] = { top : 1859, left : 2110, us : 0 , ussr : 0 , control : 1 , bg : 1 , neighbours : [ 'ivorycoast','cameroon','saharanstates' ], region : "africa" , name : "Nigeria"};
    countries['ethiopia'] = { top : 1845, left : 2710, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'sudan','somalia' ], region : "africa" , name : "Ethiopia"};
    countries['somalia'] = { top : 1910, left : 2955, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'ethiopia','kenya' ], region : "africa" , name : "Somalia"};
    countries['cameroon'] = { top : 2035, left : 2210, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'zaire','nigeria' ], region : "africa" , name : "Cameroon"};
    countries['zaire'] = { top : 2110, left : 2470, us : 0 , ussr : 0 , control : 1 , bg : 1 , neighbours : [ 'angola','zimbabwe','cameroon' ], region : "africa" , name : "Zaire"};
    countries['kenya'] = { top : 2045, left : 2735, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'seafricanstates','somalia' ], region : "africa" , name : "Kenya"};
    countries['angola'] = { top : 2290, left : 2280, us : 0 , ussr : 0 , control : 1 , bg : 1 , neighbours : [ 'southafrica','botswana','zaire' ], region : "africa" , name : "Angola"};
    countries['seafricanstates'] = { top : 2250, left : 2760, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'zimbabwe','kenya' ], region : "africa" , name : "Southeast African States"};
    countries['zimbabwe'] = { top : 2365, left : 2545, us : 0 , ussr : 0 , control : 1 , bg : 0 , neighbours : [ 'seafricanstates','botswana','zaire' ], region : "africa" , name : "Zimbabwe"};
    countries['botswana'] = { top : 2520, left : 2475, us : 0 , ussr : 0 , control : 2 , bg : 0 , neighbours : [ 'southafrica','angola','zimbabwe' ], region : "africa" , name : "Botswana"};
    countries['southafrica'] = { top : 2690, left : 2370, us : 1 , ussr : 0 , control : 3 , bg : 1 , neighbours : [ 'angola','botswana' ], region : "africa" , name : "South Africa"};

    for (var i in countries) { countries[i].place = 0; }

    return countries;

  }



  returnChinaCard() {
    return { img : "TNRnTS-06" , name : "China" , scoring : 0 , bg : 0 , player : "both" , recurring : 1 , ops : 4 };
  }



  returnEarlyWarCards() {

console.log("RETURNING CARDS: " + this.game.options.deck);

    var deck = {};

    // EARLY WAR
    deck['asia']            = { img : "TNRnTS-01" , name : "Asia Scoring", scoring : 1 , player : "both" , recurring : 1 , ops : 0 };
    deck['europe']          = { img : "TNRnTS-02" , name : "Europe Scoring", scoring : 1 , player : "both" , recurring : 1 , ops : 0 };
    deck['mideast']         = { img : "TNRnTS-03" , name : "Middle-East Scoring", scoring : 1 , player : "both" , recurring : 1 , ops : 0 };
    deck['duckandcover']    = { img : "TNRnTS-04" , name : "Duck and Cover", scoring : 0 , player : "us"   , recurring : 1 , ops : 3 };
    deck['fiveyearplan']    = { img : "TNRnTS-05" , name : "Five Year Plan", scoring : 0 , player : "us"   , recurring : 1 , ops : 3 };
    deck['socgov']          = { img : "TNRnTS-07" , name : "Socialist Governments", scoring : 0 , player : "ussr" , recurring : 1 , ops : 3 };
    deck['fidel']           = { img : "TNRnTS-08" , name : "Fidel", scoring : 0 , player : "ussr" , recurring : 0 , ops : 2 };
    deck['vietnamrevolts']  = { img : "TNRnTS-09" , name : "Vietnam Revolts", scoring : 0 , player : "ussr" , recurring : 0 , ops : 2 };
    deck['blockade']        = { img : "TNRnTS-10" , name : "Blockade", scoring : 0 , player : "ussr" , recurring : 0 , ops : 1 };
    deck['koreanwar']       = { img : "TNRnTS-11" , name : "Korean War", scoring : 0 , player : "ussr" , recurring : 0 , ops : 2 };
    deck['romanianab']      = { img : "TNRnTS-12" , name : "Romanian Abdication", scoring : 0 , player : "ussr" , recurring : 0 , ops : 1 };
    deck['arabisraeli']     = { img : "TNRnTS-13" , name : "Arab-Israeli War", scoring : 0 , player : "ussr" , recurring : 1 , ops : 2 };
    deck['comecon']         = { img : "TNRnTS-14" , name : "Comecon", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 };
    deck['nasser']          = { img : "TNRnTS-15" , name : "Nasser", scoring : 0 , player : "ussr" , recurring : 0 , ops : 1 };
    deck['warsawpact']      = { img : "TNRnTS-16" , name : "Warsaw Pact", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 };
    deck['degaulle']        = { img : "TNRnTS-17" , name : "De Gaulle Leads France", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 };
    deck['naziscientist']   = { img : "TNRnTS-18" , name : "Nazi Scientist", scoring : 0 , player : "both" , recurring : 0 , ops : 1 };
    deck['truman']          = { img : "TNRnTS-19" , name : "Truman", scoring : 0 , player : "us"   , recurring : 0 , ops : 1 };
    deck['olympic']         = { img : "TNRnTS-20" , name : "Olympic Games", scoring : 0 , player : "both" , recurring : 1 , ops : 2 };
    deck['nato']            = { img : "TNRnTS-21" , name : "NATO", scoring : 0 , player : "us"   , recurring : 0 , ops : 4 };
    deck['indreds']         = { img : "TNRnTS-22" , name : "Independent Reds", scoring : 0 , player : "us"   , recurring : 0 , ops : 2 };
    deck['marshall']        = { img : "TNRnTS-23" , name : "Marshall Plan", scoring : 0 , player : "us"   , recurring : 0 , ops : 4 };
    deck['indopaki']        = { img : "TNRnTS-24" , name : "Indo-Pakistani War", scoring : 0 , player : "both" , recurring : 1 , ops : 2 };
    deck['containment']     = { img : "TNRnTS-25" , name : "Containment", scoring : 0 , player : "us"   , recurring : 0 , ops : 3 };
    deck['cia']             = { img : "TNRnTS-26" , name : "CIA Created", scoring : 0 , player : "us"   , recurring : 0 , ops : 1 };
    deck['usjapan']         = { img : "TNRnTS-27" , name : "US/Japan Defense Pact", scoring : 0 , player : "us"   , recurring : 0 , ops : 4 };
    deck['suezcrisis']      = { img : "TNRnTS-28" , name : "Suez Crisis", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 };
    deck['easteuropean']    = { img : "TNRnTS-29" , name : "East European Unrest", scoring : 0 , player : "us"   , recurring : 1 , ops : 3 };
    deck['decolonization']  = { img : "TNRnTS-30" , name : "Decolonization", scoring : 0 , player : "ussr" , recurring : 1 , ops : 2 };
    deck['redscare']        = { img : "TNRnTS-31" , name : "Red Scare", scoring : 0 , player : "both" , recurring : 1 , ops : 4 };
    deck['unintervention']  = { img : "TNRnTS-32" , name : "UN Intervention", scoring : 0 , player : "both" , recurring : 1 , ops : 1 };
    deck['destalinization'] = { img : "TNRnTS-33" , name : "Destalinization", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 };
    deck['nucleartestban']  = { img : "TNRnTS-34" , name : "Nuclear Test Ban Treaty", scoring : 0 , player : "both" , recurring : 1 , ops : 4 };
    deck['formosan']        = { img : "TNRnTS-35" , name : "Formosan Resolution", scoring : 0 , player : "us"   , recurring : 0 , ops : 2 };

    //
    // OPTIONS - we default to the expanded deck
    //
    if (this.game.options.deck != "original" ) {
      deck['defectors']       = { img : "TNRnTS-103" ,name : "Defectors", scoring : 0 , player : "us"   , recurring : 1 , ops : 2 };
      deck['cambridge']       = { img : "TNRnTS-104" ,name : "The Cambridge Five", scoring : 0 , player : "ussr"   , recurring : 1 , ops : 2 };
      deck['specialrelation'] = { img : "TNRnTS-105" ,name : "Special Relationship", scoring : 0 , player : "us"   , recurring : 1 , ops : 2 };
      deck['norad']           = { img : "TNRnTS-106" ,name : "NORAD", scoring : 0 , player : "us"   , recurring : 0 , ops : 3 };
    }

    //
    // remove or add specified cards
    //
    if (this.game.options != undefined) {
      for (var key in this.game.options) {

        if (deck[key] != undefined) { delete deck[key]; }

        //
        // optional early war cards
        //
        if (key === "culturaldiplomacy") { deck['culturaldiplomacy'] = { img : "TNRnTS-202png" , name : "Cultural Diplomacy", scoring : 0 , player : "both" , recurring : 1 , ops : 2 }; }
        if (key === "gouzenkoaffair") { deck['gouzenkoaffair'] = { img : "TNRnTS-204png" , name : "Gouzenko Affair", scoring : 0 , player : "ussr" , recurring : 0 , ops : 2 }; }
        if (key === "poliovaccine") { deck['poliovaccine'] = { img : "TNRnTS-206png" , name : "Polio Vaccine", scoring : 0 , player : "both" , recurring : 0 , ops : 3 }; }

	// END OF HISTORY
        if (key === "peronism") { deck['peronism']       = { img : "TNRnTS-307png" ,name : "Peronism", scoring : 0 , player : "both"   , recurring : 0 , ops : 1 }; }


	// COLD WAR CRAZIES 
        if (key === "berlinairlift") { deck['berlinairlift']      	= { img : "TNRnTS-401png" ,name : "Berlin Airlift", scoring : 0 , player : "us"     , recurring : 0 , ops : 1 }; }
        if (key === "communistrevolution") { deck['communistrevolution']       = { img : "TNRnTS-402png" ,name : "Communist Revolution", scoring : 0 , player : "ussr"   , recurring : 1 , ops : 2 }; }
        if (key === "philadelphia") { deck['philadelphia']      	= { img : "TNRnTS-403png" ,name : "Philadelphia Experiment", scoring : 0 , player : "us"     , recurring : 0 , ops : 3 }; }
        if (key === "sinoindian") { deck['sinoindian']                = { img : "TNRnTS-404png" ,name : "Sino-Indian War", scoring : 0 , player : "both"   , recurring : 1 , ops : 2 }; }
        if (key === "titostalin") { deck['titostalin']                = { img : "TNRnTS-405png" ,name : "Tito-Stalin Split", scoring : 0 , player : "us"   , recurring : 1 , ops : 3 }; }

      }
    }


    //
    // specify early-war period
    //
    for (var key in deck) { deck[key].p = 0; }

    return deck;

  }



  returnMidWarCards() {

    var deck = {};

    deck['brushwar']          = { img : "TNRnTS-36" , name : "Brush War", scoring : 0 , player : "both" , recurring : 1 , ops : 3 };
    deck['centralamerica']    = { img : "TNRnTS-37" , name : "Central America Scoring", scoring : 1 , player : "both" , recurring : 1 , ops : 0 };
    deck['seasia']            = { img : "TNRnTS-38" , name : "Southeast Asia Scoring", scoring : 1 , player : "both" , recurring : 0 , ops : 0 };
    deck['armsrace']          = { img : "TNRnTS-39" , name : "Arms Race", scoring : 0 , player : "both" , recurring : 1 , ops : 3 };
    deck['cubanmissile']      = { img : "TNRnTS-40" , name : "Cuban Missile Crisis", scoring : 0 , player : "both" , recurring : 0 , ops : 3 };
    deck['nuclearsubs']       = { img : "TNRnTS-41" , name : "Nuclear Subs", scoring : 0 , player : "us" , recurring : 0 , ops : 2 };
    deck['quagmire']          = { img : "TNRnTS-42" , name : "Quagmire", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 };
    deck['saltnegotiations']  = { img : "TNRnTS-43" , name : "Salt Negotiations", scoring : 0 , player : "both" , recurring : 0 , ops : 3 };
    deck['beartrap']          = { img : "TNRnTS-44" , name : "Bear Trap", scoring : 0 , player : "us" , recurring : 0 , ops : 3 };
    deck['summit']            = { img : "TNRnTS-45" , name : "Summit", scoring : 0 , player : "both" , recurring : 1 , ops : 1 };
    deck['howilearned']       = { img : "TNRnTS-46" , name : "How I Learned to Stop Worrying", scoring : 0 , player : "both" , recurring : 0 , ops : 2 };
    deck['junta']             = { img : "TNRnTS-47" , name : "Junta", scoring : 0 , player : "both" , recurring : 1 , ops : 2 };
    deck['kitchendebates']    = { img : "TNRnTS-48" , name : "Kitchen Debates", scoring : 0 , player : "us" , recurring : 0 , ops : 1 };
    deck['missileenvy']       = { img : "TNRnTS-49" , name : "Missile Envy", scoring : 0 , player : "both" , recurring : 1 , ops : 2 };
    deck['wwby']              = { img : "TNRnTS-50" , name : "We Will Bury You", scoring : 0 , player : "ussr" , recurring : 0 , ops : 4 };
    deck['brezhnev']          = { img : "TNRnTS-51" , name : "Brezhnev Doctrine", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 };
    deck['portuguese']        = { img : "TNRnTS-52" , name : "Portuguese Empire Crumbles", scoring : 0 , player : "ussr" , recurring : 0 , ops : 2 };
    deck['southafrican']      = { img : "TNRnTS-53" , name : "South African Unrest", scoring : 0 , player : "ussr" , recurring : 1 , ops : 2 };
    deck['allende']           = { img : "TNRnTS-54" , name : "Allende", scoring : 0 , player : "ussr" , recurring : 0 , ops : 1 };
    deck['willybrandt']       = { img : "TNRnTS-55" , name : "Willy Brandt", scoring : 0 , player : "ussr" , recurring : 0 , ops : 2 };
    deck['muslimrevolution']  = { img : "TNRnTS-56" , name : "Muslim Revolution", scoring : 0 , player : "ussr" , recurring : 1 , ops : 4 };
    deck['abmtreaty']         = { img : "TNRnTS-57" , name : "ABM Treaty", scoring : 0 , player : "both" , recurring : 1 , ops : 4 };
    deck['culturalrev']       = { img : "TNRnTS-58" , name : "Cultural Revolution", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 };
    deck['flowerpower']       = { img : "TNRnTS-59" , name : "Flower Power", scoring : 0 , player : "ussr" , recurring : 0 , ops : 4 };
    deck['u2']                = { img : "TNRnTS-60" , name : "U2 Incident", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 };
    deck['opec']              = { img : "TNRnTS-61" , name : "OPEC", scoring : 0 , player : "ussr" , recurring : 1 , ops : 3 };
    deck['lonegunman']        = { img : "TNRnTS-62" , name : "Lone Gunman", scoring : 0 , player : "ussr" , recurring : 0 , ops : 1 };
    deck['colonial']          = { img : "TNRnTS-63" , name : "Colonial Rear Guards", scoring : 0 , player : "us" , recurring : 1 , ops : 2 };
    deck['panamacanal']       = { img : "TNRnTS-64" , name : "Panama Canal Returned", scoring : 0 , player : "us" , recurring : 0 , ops : 1 };
    deck['campdavid']         = { img : "TNRnTS-65" , name : "Camp David Accords", scoring : 0 , player : "us" , recurring : 0 , ops : 2 };
    deck['puppet']            = { img : "TNRnTS-66" , name : "Puppet Governments", scoring : 0 , player : "us" , recurring : 0 , ops : 2 };
    deck['grainsales']        = { img : "TNRnTS-67" , name : "Grain Sales to Soviets", scoring : 0 , player : "us" , recurring : 1 , ops : 2 };
    deck['johnpaul']          = { img : "TNRnTS-68" , name : "John Paul II Elected Pope", scoring : 0 , player : "us" , recurring : 0 , ops : 2 };
    deck['deathsquads']       = { img : "TNRnTS-69png" , name : "Latin American Death Squads", scoring : 0 , player : "both" , recurring : 1 , ops : 2 };
    deck['oas']               = { img : "TNRnTS-70" , name : "OAS Founded", scoring : 0 , player : "us" , recurring : 0 , ops : 1 };
    deck['nixon']             = { img : "TNRnTS-71" , name : "Nixon Plays the China Card", scoring : 0 , player : "us" , recurring : 0 , ops : 2 };
    deck['sadat']             = { img : "TNRnTS-72" , name : "Sadat Expels Soviets", scoring : 0 , player : "us" , recurring : 0 , ops : 1 };
    deck['shuttle']           = { img : "TNRnTS-73" , name : "Shuttle Diplomacy", scoring : 0 , player : "us" , recurring : 1 , ops : 3 };
    deck['voiceofamerica']    = { img : "TNRnTS-74" , name : "Voice of America", scoring : 0 , player : "us" , recurring : 1 , ops : 2 };
    deck['liberation']        = { img : "TNRnTS-75" , name : "Liberation Theology", scoring : 0 , player : "ussr" , recurring : 1 , ops : 2 };
    deck['ussuri']            = { img : "TNRnTS-76" , name : "Ussuri River Skirmish", scoring : 0 , player : "us" , recurring : 0 , ops : 3 };
    deck['asknot']            = { img : "TNRnTS-77" , name : "Ask Not What Your Country...", scoring : 0 , player : "us" , recurring : 0 , ops : 3 };
    deck['alliance']          = { img : "TNRnTS-78" , name : "Alliance for Progress", scoring : 0 , player : "us" , recurring : 0 , ops : 3 };
    deck['africa']            = { img : "TNRnTS-79" , name : "Africa Scoring", scoring : 1 , player : "both" , recurring : 1 , ops : 0 };
    deck['onesmallstep']      = { img : "TNRnTS-80" , name : "One Small Step", scoring : 0 , player : "both" , recurring : 1 , ops : 2 };
    deck['southamerica']      = { img : "TNRnTS-81" , name : "South America Scoring", scoring : 1 , player : "both" , recurring : 1 , ops : 0 };

    //
    // OPTIONS - we default to the expanded deck
    //
    if (this.game.options.deck != "original" ) {
      deck['che']               = { img : "TNRnTS-107" , name : "Che", scoring : 0 , player : "ussr" , recurring : 1 , ops : 3 };
      deck['tehran']            = { img : "TNRnTS-108" , name : "Our Man in Tehran", scoring : 0 , player : "us" , recurring : 0 , ops : 2 };
    }


    //
    // remove any cards specified
    //
    if (this.game.options != undefined) {
      for (var key in this.game.options) {

        if (deck[key] != undefined) { delete deck[key]; }

        //
        // optional midwar cards
        //
        if (key === "handshake") { deck['handshake'] = { img : "TNRnTS-201png" , name : "Handshake in Space", scoring : 0 , player : "both" , recurring : 1 , ops : 1 }; }
        if (key === "berlinagreement") { deck['berlinagreement'] = { img : "TNRnTS-205png" , name : "Berlin Agreement", scoring : 0 , player : "both" , recurring : 0 , ops : 2 }; }


	// END OF HISTORY
        if (key === "manwhosavedtheworld") { deck['manwhosavedtheworld']       = { img : "TNRnTS-301png" ,name : "The Man Who Saved the World", scoring : 0 , player : "both"   , recurring : 0 , ops : 4 }; }
        if (key === "breakthroughatlopnor") { deck['breakthroughatlopnor']      = { img : "TNRnTS-302png" ,name : "Breakthrough at Lop Nor", scoring : 0 , player : "ussr"   , recurring : 0 , ops : 2 }; }
        if (key === "greatsociety") { deck['greatsociety']              = { img : "TNRnTS-303png" ,name : "Great Society", scoring : 0 , player : "us"   , recurring : 0 , ops : 2 }; }
        if (key === "nationbuilding") { deck['nationbuilding']            = { img : "TNRnTS-304png" ,name : "Nation Building", scoring : 0 , player : "both"   , recurring : 1 , ops : 2 }; }
	if (key === "eurocommunism") { deck['eurocommunism']             = { img : "TNRnTS-306png" ,name : "Eurocommunism", scoring : 0 , player : "us"   , recurring : 0 , ops : 3 }; }


	// ABSURDUM
        if (key === "kissingerisawarcriminal") { deck['kissingerisawarcriminal'] 	     	= { img : "TNRnTS-502png" ,name : "Kissinger Bombs Cambodia", scoring : 0 , player : "us"     , recurring : 1 , ops : 2 }; }


      }
    }

    //
    // specify early-war period
    //
    for (var key in deck) { deck[key].p = 1; }


    return deck;

  }


  returnLateWarCards() {

    var deck = {};

    deck['iranianhostage']    = { img : "TNRnTS-82" , name : "Iranian Hostage Crisis", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 };
    deck['ironlady']          = { img : "TNRnTS-83" , name : "The Iron Lady", scoring : 0 , player : "us" , recurring : 0 , ops : 3 };
    deck['reagan']            = { img : "TNRnTS-84" , name : "Reagan Bombs Libya", scoring : 0 , player : "us" , recurring : 0 , ops : 2 };
    deck['starwars']          = { img : "TNRnTS-85" , name : "Star Wars", scoring : 0 , player : "us" , recurring : 0 , ops : 2 };
    deck['northseaoil']       = { img : "TNRnTS-86" , name : "North Sea Oil", scoring : 0 , player : "us" , recurring : 0 , ops : 3 };
    deck['reformer']          = { img : "TNRnTS-87" , name : "The Reformer", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 };
    deck['marine']            = { img : "TNRnTS-88" , name : "Marine Barracks Bombing", scoring : 0 , player : "ussr" , recurring : 0 , ops : 2 };
    deck['KAL007']            = { img : "TNRnTS-89" , name : "Soviets Shoot Down KAL-007", scoring : 0 , player : "us" , recurring : 0 , ops : 4 };
    deck['glasnost']          = { img : "TNRnTS-90" , name : "Glasnost", scoring : 0 , player : "ussr" , recurring : 0 , ops : 4 };
    deck['ortega']            = { img : "TNRnTS-91" , name : "Ortega Elected in Nicaragua", scoring : 0 , player : "ussr" , recurring : 0 , ops : 2 };
    deck['terrorism']         = { img : "TNRnTS-92" , name : "Terrorism", scoring : 0 , player : "both" , recurring : 1 , ops : 2 };
    deck['irancontra']        = { img : "TNRnTS-93" , name : "Iran Contra Scandal", scoring : 0 , player : "ussr" , recurring : 0 , ops : 2 };
    deck['chernobyl']         = { img : "TNRnTS-94" , name : "Chernobyl", scoring : 0 , player : "us" , recurring : 0 , ops : 3 };
    deck['debtcrisis']        = { img : "TNRnTS-95" , name : "Latin American Debt Crisis", scoring : 0 , player : "ussr" , recurring : 1 , ops : 2 };
    deck['teardown']          = { img : "TNRnTS-96" , name : "Tear Down this Wall", scoring : 0 , player : "us" , recurring : 0 , ops : 3 };
    deck['evilempire']        = { img : "TNRnTS-97" , name : "An Evil Empire", scoring : 0 , player : "us" , recurring : 0 , ops : 3 };
    deck['aldrichames']       = { img : "TNRnTS-98" , name : "Aldrich Ames Remix", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 };
    deck['pershing']          = { img : "TNRnTS-99" , name : "Pershing II Deployed", scoring : 0 , player : "ussr" , recurring : 0 , ops : 3 };
    deck['wargames']          = { img : "TNRnTS-100" , name : "Wargames", scoring : 0 , player : "both" , recurring : 0 , ops : 4 };
    deck['solidarity']        = { img : "TNRnTS-101" , name : "Solidarity", scoring : 0 , player : "us" , recurring : 0 , ops : 2 };

    //
    // OPTIONS - we default to the expanded deck
    //
    if (this.game.options.deck != "original" ) {
      deck['iraniraq']          = { img : "TNRnTS-102" , name : "Iran-Iraq War", scoring : 0 , player : "both" , recurring : 0 , ops : 2 };
      deck['yuri']              = { img : "TNRnTS-109" , name : "Yuri and Samantha", scoring : 0 , player : "ussr" , recurring : 0 , ops : 2 };
      deck['awacs']             = { img : "TNRnTS-110" , name : "AWACS Sale to Saudis", scoring : 0 , player : "us" , recurring : 0 , ops : 3 };
    }

    //
    // remove any cards specified
    //
    if (this.game.options != undefined) {
      for (var key in this.game.options) {

        if (deck[key] != undefined) { delete deck[key]; }

        //
        // optional latewar cards
        //
        if (key === "rustinredsquare") { deck['rustinredsquare'] = { img : "TNRnTS-203png" , name : "Rust Lands in Red Square", scoring : 0 , player : "us" , recurring : 0 , ops : 1 }; }

        // END OF HISTORY
        if (key === "perestroika") { deck['perestroika']       = { img : "TNRnTS-305png" ,name : "Perestroika", scoring : 0 , player : "ussr"   , recurring : 0 , ops : 3 }; }
        if (key === "inftreaty") { deck['inftreaty']         = { img : "TNRnTS-308png" ,name : "INF Treaty", scoring : 0 , player : "both"   , recurring : 0 , ops : 3 }; }

        // COLD WAR CRAZIES
        if (key === "sovietcoup") { deck['sovietcoup']       = { img : "TNRnTS-405png" ,name : "Soviet Coup", scoring : 0 , player : "ussr"   , recurring : 0 , ops : 4 }; }    

        // TWILIGHT ABSURDUM
        if (key === "brexit") { deck['brexit'] 	     	= { img : "TNRnTS-501png" ,name : "Brexit", scoring : 0 , player : "both"     , recurring : 1 , ops : 4 }; }

      }
    }


    //
    // specify early-war period
    //
    for (var key in deck) { deck[key].p = 2; }

    return deck;

  }



  returnUnplayedCards() {

    var unplayed = {};
    for (let i in this.game.deck[0].cards) {
      unplayed[i] = this.game.deck[0].cards[i];
    }
    for (let i in this.game.deck[0].discards) {
      delete unplayed[i];
    }
    for (let i in this.game.deck[0].removed) {
      delete unplayed[i];
    }
    for (let i = 0; i < this.game.deck[0].hand.length; i++) {
      delete unplayed[this.game.deck[0].hand[i]];
    }

    return unplayed;

  }




  returnDiscardedCards() {

    var discarded = {};

    for (var i in this.game.deck[0].discards) {
      discarded[i] = this.game.deck[0].cards[i];
      delete this.game.deck[0].cards[i];
    }

    this.game.deck[0].discards = {};

    return discarded;

  }



  isControlled(player, country) {

    if (this.countries[country] == undefined) { return 0; }

    let country_lead = 0;

    if (player == "ussr") {
      country_lead = parseInt(this.countries[country].ussr) - parseInt(this.countries[country].us);
    }
    if (player == "us") {
      country_lead = parseInt(this.countries[country].us) - parseInt(this.countries[country].ussr);
    }

    if (this.countries[country].control <= country_lead) { return 1; }
    return 0;

  }



  returnOpsOfCard(card="", deck=0) {
    if (this.game.deck[deck].cards[card] != undefined) {
      return this.game.deck[deck].cards[card].ops;
    }
    if (this.game.deck[deck].discards[card] != undefined) {
      return this.game.deck[deck].discards[card].ops;
    }
    if (this.game.deck[deck].removed[card] != undefined) {
      return this.game.deck[deck].removed[card].ops;
    }
    if (card == "china") { return 4; }
    return 1;
  }



  returnArrayOfRegionBonuses(card="") {

    let regions = [];

    //
    // Vietnam Revolts
    //
    if (this.game.state.events.vietnam_revolts == 1 && this.game.state.events.vietnam_revolts_eligible == 1 && this.game.player == 1) {

      //
      // Vietnam Revolts does not give bonus to 1 OP card in SEA if USSR Red Purged
      // https://boardgamegeek.com/thread/1136951/red-scarepurge-and-vietnam-revolts
      let pushme = 1;
      if (card != "") {
        if (this.game.state.events.redscare_player1 >= 1) {
          if (this.returnOpsOfCard(card) == 1) { pushme = 0; }
        }
      }
      if (pushme == 1) {
        regions.push("seasia");
      }
    }

    //
    // The China Card
    //
    if (this.game.state.events.china_card_in_play == 1 && this.game.state.events.china_card_eligible == 1) {
      regions.push("asia");
    }

    return regions;

  }



  isRegionBonus(card="") {

    //
    // Vietnam Revolts
    //
    if (this.game.state.events.vietnam_revolts == 1 && this.game.state.events.vietnam_revolts_eligible == 1 && this.game.player == 1) {

      //
      // Vietnam Revolts does not give bonus to 1 OP card in SEA if USSR Red Purged
      // https://boardgamegeek.com/thread/1136951/red-scarepurge-and-vietnam-revolts
      if (card != "") { if (this.returnOpsOfCard(card) == 1 && this.game.state.events.redscare_player1 >= 1) { return 0; } }

      this.updateStatus("<div class='status-message' id='status-message'>Extra 1 OP Available for Southeast Asia</div>");
      this.game.state.events.region_bonus = "seasia";
      return 1;
    }

    //
    // The China Card
    //
    if (this.game.state.events.china_card_in_play == 1 && this.game.state.events.china_card_eligible == 1) {

      this.updateStatus("<div class='status-message' id='status-message'>Extra 1 OP Available for Asia</div>");
      this.game.state.events.region_bonus = "asia";
      return 1;
    }
    return 0;
  }




  endRegionBonus() {
    if (this.game.state.events.vietnam_revolts_eligible == 1 && this.game.state.events.vietnam_revolts == 1) {
      this.game.state.events.vietnam_revolts_eligible = 0;
      return;
    }
    if (this.game.state.events.china_card_eligible == 1) {
      this.game.state.events.china_card_eligible = 0;
      return;
    }
  }


  limitToRegionBonus() {
    for (var i in this.countries) {
      if (this.countries[i].region.indexOf(this.game.state.events.region_bonus) == -1) {
        let divname = '#'+i;
        $(divname).off();
      } else {

    let extra_bonus_available = 0;
    if (this.game.state.events.region_bonus == "seasia" && this.game.state.events.china_card_eligible == 1) {
      extra_bonus_available = 1;
    }

    if (extra_bonus_available == 0) {
            if (this.game.player == 1) {

              // prevent breaking control
              if (this.isControlled("us", i) == 1) {
                let divname = '#'+i;
                $(divname).off();
        }
            } else {

              // prevent breaking control
              if (this.isControlled("ussr", i) == 1) {
                let divname = '#'+i;
                $(divname).off();
        }
      }
    }
        }

    }
    return;
  }



  modifyOps(ops,card="",playernum=0, updatelog=1) {

    if (playernum == 0) { playernum = this.game.player; }

    if (card == "olympic" && ops == 4) {} else {
      if (card != "") { ops = this.returnOpsOfCard(card); }
    }

    if (this.game.state.events.brezhnev == 1 && playernum == 1) {
      if (updatelog == 1) {
        this.updateLog("USSR gets Brezhnev bonus +1");
      }
      ops++;
    }
    if (this.game.state.events.containment == 1 && playernum == 2) {
      if (updatelog == 1) {
        this.updateLog("US gets Containment bonus +1");
      }
      ops++;
    }
    if (this.game.state.events.redscare_player1 >= 1 && playernum == 1) {
      if (updatelog == 1) {
	if (this.game.state.events.redscare_player1 == 1) {
          this.updateLog("USSR is affected by Red Purge");
	} else {
          this.updateLog("USSR is really affected by Red Purge");
	}
      }
      ops-=this.game.state.events.redscare_player1;
    }
    if (this.game.state.events.redscare_player2 >= 1 && playernum == 2) {
      if (updatelog == 1) {
	if (this.game.state.events.redscare_player2 == 1) {
          this.updateLog("US is affected by Red Scare");
        } else {
          this.updateLog("US is really affected by Red Scare");
        }
      }
      ops-=this.game.state.events.redscare_player2;
    }
    if (ops <= 0) { return 1; }
    if (ops >= 4) { return 4; }
    return ops;
  }



  finalScoring() {

    //
    // disable shuttle diplomacy
    //
    this.game.state.events.shuttlediplomacy = 0;

    //
    //
    //
    if (this.whoHasTheChinaCard() == "ussr") {
      this.game.state.vp--;
      this.updateLog("USSR receives 1 VP for the China Card");
      if (this.game.state.vp <= -20) {
        this.endGame("ussr", "victory points");
        return;
      }
    } else {
      this.game.state.vp++;
      this.updateLog("US receives 1 VP for the China Card");
      if (this.game.state.vp >= 20) {
        this.endGame("us", "victory points");
        return;
      }
    }


    let vp_adjustment = 0;
    let total_vp = 0;

    vp_adjustment = this.calculateScoring("europe");
    total_vp = vp_adjustment.us.vp - vp_adjustment.ussr.vp;
    this.game.state.vp += total_vp;
    this.updateLog("<span>Europe:</span> " + total_vp + " <span>VP</span>");
 
    vp_adjustment = this.calculateScoring("asia");
    total_vp = vp_adjustment.us.vp - vp_adjustment.ussr.vp;
    this.game.state.vp += total_vp;
    this.updateLog("<span>Asia:</span> " + total_vp + " <span>VP</span>");

    vp_adjustment = this.calculateScoring("mideast");
    total_vp = vp_adjustment.us.vp - vp_adjustment.ussr.vp;
    this.game.state.vp += total_vp;
    this.updateLog("<span>Middle East:</span> " + total_vp + " <span>VP</span>");

    vp_adjustment = this.calculateScoring("africa");
    total_vp = vp_adjustment.us.vp - vp_adjustment.ussr.vp;
    this.game.state.vp += total_vp;
    this.updateLog("<span>Africa:</span> " + total_vp + " <span>VP</span>");

    vp_adjustment = this.calculateScoring("southamerica");
    total_vp = vp_adjustment.us.vp - vp_adjustment.ussr.vp;
    this.game.state.vp += total_vp;
    this.updateLog("<span>South America:</span> " + total_vp + " <span>VP</span>");

    vp_adjustment = this.calculateScoring("centralamerica");
    total_vp = vp_adjustment.us.vp - vp_adjustment.ussr.vp;
    this.game.state.vp += total_vp;
    this.updateLog("<span>Central America:</span> " + total_vp + " <span>VP</span>");

    this.updateVictoryPoints();

    if (this.game.state.vp == 0) {
      this.endGame("tie game", "final scoring");
      return 1;
    }
    if (this.game.state.vp < 0) {
      this.endGame("ussr", "final scoring");
    } else {
      this.endGame("us", "final scoring");
    }

    return 1;
  }



  calculateControlledBattlegroundCountries(scoring, bg_countries) {
    for (var [player, side] of Object.entries(scoring)) {
      for (var country of bg_countries) {
        if (this.isControlled(player, country) == 1) { side.bg++; }
      }
    }
    return scoring;
  }

  calculateControlledCountries(scoring, countries) {
    for (var [player, side] of Object.entries(scoring)) {
      for (var country of countries) {
        if (this.isControlled(player, country) == 1) { side.total++ };
      }
    }
    return scoring;
  }

  determineRegionVictor(scoring, region_scoring_range, max_bg_num) {

console.log("RANGE: " + JSON.stringify(region_scoring_range));
console.log("SCORING: " + JSON.stringify(scoring));

    if (scoring.us.bg == max_bg_num && scoring.us.total > scoring.ussr.total) { scoring.us.vp = region_scoring_range.control; }
    else if (scoring.us.bg > scoring.ussr.bg && scoring.us.total > scoring.us.bg && scoring.us.total > scoring.ussr.total) { scoring.us.vp = region_scoring_range.domination; }
    else if (scoring.us.total > 0) { scoring.us.vp = region_scoring_range.presence; }


    if (scoring.ussr.bg == max_bg_num && scoring.ussr.total > scoring.us.total) { scoring.ussr.vp = region_scoring_range.control; }
    else if (scoring.ussr.bg > scoring.us.bg && scoring.ussr.total > scoring.ussr.bg && scoring.ussr.total > scoring.us.total) { scoring.ussr.vp = region_scoring_range.domination; }
    else if (scoring.ussr.total > 0) { scoring.ussr.vp = region_scoring_range.presence; }

    scoring.us.vp = scoring.us.vp + scoring.us.bg;
    scoring.ussr.vp = scoring.ussr.vp + scoring.ussr.bg;

    return scoring;
  }


  calculateScoring(region, mouseover_preview=0) {

    var scoring = {
      us: {total: 0, bg: 0, vp: 0},
      ussr: {total: 0, bg: 0, vp: 0},
    }

    switch (region) {

      ////////////
      // EUROPE //
      ////////////
      case "europe":

        let eu_bg_countries = [];
        let eu_countries = [];
	for (let i in this.countries) {
	  if (this.countries[i].region === "europe") {
	    if (this.countries[i].bg === 1) {
	      eu_bg_countries.push(i);
	    } else {
	      eu_countries.push(i);
	    }
	  }
        }
        let eu_scoring_range = {presence: 3, domination: 7, control: 10000 };

        scoring = this.calculateControlledBattlegroundCountries(scoring, eu_bg_countries);
        scoring.us.total = scoring.us.bg;
        scoring.ussr.total = scoring.ussr.bg;
        scoring = this.calculateControlledCountries(scoring, eu_countries);
        scoring = this.determineRegionVictor(scoring, eu_scoring_range, eu_bg_countries.length);

        //
        // neighbouring countries
        //
        if (this.isControlled("us", "finland") == 1) { scoring.us.vp++; }
        if (this.isControlled("us", "romania") == 1) { scoring.us.vp++; }
        if (this.isControlled("us", "poland") == 1) { scoring.us.vp++; }
        if (this.isControlled("ussr", "canada") == 1) { scoring.ussr.vp++; }

        //
        // GOUZENKO AFFAIR -- early war optional
        //
        if (this.game.state.events.optional.gouzenkoaffair == 1) {
          if (this.isControlled("us", "canada") == 1) { vp_us++; }
        }

        break;


      /////////////
      // MIDEAST //
      /////////////
      case "mideast":
        let me_bg_countries = [];
        let me_countries = [];
	for (let i in this.countries) {
	  if (this.countries[i].region === "mideast") {
	    if (this.countries[i].bg === 1) {
	      me_bg_countries.push(i);
	    } else {
	      me_countries.push(i);
	    }
	  }
	}
        let me_scoring_range = { presence: 3, domination: 5, control: 7 };
        // pseudo function to calculate control
        scoring = this.calculateControlledBattlegroundCountries(scoring, me_bg_countries);
        scoring.us.total = scoring.us.bg;
        scoring.ussr.total = scoring.ussr.bg;
        scoring = this.calculateControlledCountries(scoring, me_countries);

        //
        // Shuttle Diplomacy
        //
        if (this.game.state.events.shuttlediplomacy == 1) {
          if (scoring.ussr.bg > 0) {
            scoring.ussr.bg--;
            scoring.ussr.total--;
          }         
          if (mouseover_preview == 0) {

            this.game.state.events.shuttlediplomacy = 0;

	    //
	    // and move into discard pile... finally
	    //
	    this.game.deck[0].discards['shuttle'] = this.game.deck[0].cards['shuttle'];

          }
        }
        scoring = this.determineRegionVictor(scoring, me_scoring_range, me_bg_countries.length);

        // scoring transform
        break;


      /////////////
      // SE ASIA //
      /////////////
      case "seasia":
        let seasia_countries = [
          "burma",
          "laos",
          "vietnam",
          "malaysia",
          "philippines",
          "indonesia",
          "thailand",
        ];

        for (var [player, side] of Object.entries(scoring)) {
          for (country of seasia_countries) {
            if (this.isControlled(player, country) == 1) { country == "thailand" ? side.bg+=2 : side.bg++; }
          }
        }

        scoring.us.vp = scoring.us.vp + scoring.us.bg;
        scoring.ussr.vp = scoring.ussr.vp + scoring.ussr.bg;
        break;



      case "africa":
        let af_bg_countries = [];
        let af_countries = [];
	for (let i in this.countries) {
	  if (this.countries[i].region === "africa") {
	    if (this.countries[i].bg === 1) {
	      af_bg_countries.push(i);
	    } else {
	      af_countries.push(i);
	    }
	  }
        };
        let af_scoring_range = {presence: 1, domination: 4, control: 6 };

        scoring = this.calculateControlledBattlegroundCountries(scoring, af_bg_countries);
        scoring.us.total = scoring.us.bg;
        scoring.ussr.total = scoring.ussr.bg;
        scoring = this.calculateControlledCountries(scoring, af_countries);
        scoring = this.determineRegionVictor(scoring, af_scoring_range, af_bg_countries.length);

        break;

      /////////////////////
      // CENTRAL AMERICA //
      /////////////////////
      case "centralamerica":
        let ca_bg_countries = [];
        let ca_countries = [];
	for (let i in this.countries) {
	  if (this.countries[i].region === "camerica") {
	    if (this.countries[i].bg === 1) {
	      ca_bg_countries.push(i);
	    } else {
	      ca_countries.push(i);
	    }
	  }
        }
        let ca_scoring_range = {presence: 1, domination: 3, control: 5};

        scoring = this.calculateControlledBattlegroundCountries(scoring, ca_bg_countries);
        scoring.us.total = scoring.us.bg;
        scoring.ussr.total = scoring.ussr.bg;
        scoring = this.calculateControlledCountries(scoring, ca_countries);
        scoring = this.determineRegionVictor(scoring, ca_scoring_range, ca_bg_countries.length);

        //
        // neighbouring countries
        //
        if (this.isControlled("ussr", "mexico") == 1) { scoring.ussr.vp++; }
        if (this.isControlled("ussr", "cuba") == 1) { scoring.ussr.vp++; }

        break;

      ///////////////////
      // SOUTH AMERICA //
      ///////////////////
      case "southamerica":
        let sa_bg_countries = [];
        let sa_countries = [];
	for (let i in this.countries) {
	  if (this.countries[i].region === "samerica") {
	    if (this.countries[i].bg === 1) {
	      sa_bg_countries.push(i);
	    } else {
	      sa_countries.push(i);
	    }
	  }
        }
        let sa_scoring_range = {presence: 2, domination: 5, control: 6};

        scoring = this.calculateControlledBattlegroundCountries(scoring, sa_bg_countries);
        scoring.us.total = scoring.us.bg;
        scoring.ussr.total = scoring.ussr.bg;
        scoring = this.calculateControlledCountries(scoring, sa_countries);
        scoring = this.determineRegionVictor(scoring, sa_scoring_range, sa_bg_countries.length);

        break;


      //////////
      // ASIA //
      //////////
      case "asia":
        let as_bg_countries = [];
        let as_countries = [];
	for (let i in this.countries) {
	  if (this.countries[i].region === "asia" || this.countries[i].region === "seasia") {
	    if (this.countries[i].bg === 1) {
	      as_bg_countries.push(i);
	    } else {
              if (this.game.state.events.formosan == 1 && i === "taiwan") {
                if (this.isControlled("us", "taiwan") == 1) { as_bg_countries.push(i); } else { as_countries.push(i); }
              } else {
	        as_countries.push(i);
	      }
	    }
	  }
        };
        let as_scoring_range = {presence: 3, domination: 7, control: 9};

        scoring = this.calculateControlledBattlegroundCountries(scoring, as_bg_countries);

        scoring.us.total = scoring.us.bg;
        scoring.ussr.total = scoring.ussr.bg;

        scoring = this.calculateControlledCountries(scoring, as_countries);

        //
        // Shuttle Diplomacy
        //
        if (this.game.state.events.shuttlediplomacy == 1) {
          if (scoring.ussr.bg > 0) {
            scoring.ussr.bg--;
            scoring.ussr.total--;
          }
	  if (mouseover_preview == 0) {

            this.game.state.events.shuttlediplomacy = 0;

	    //
	    // and move into discard pile... finally
	    //
	    this.game.deck[0].discards['shuttle'] = this.game.deck[0].cards['shuttle'];

          }
	}

        scoring = this.determineRegionVictor(scoring, as_scoring_range, as_bg_countries.length);

	
        //
        // neighbouring countries
        //
        if (this.isControlled("us", "afghanistan") == 1) { scoring.us.vp++; }
        if (this.isControlled("us", "northkorea") == 1) { scoring.us.vp++; }
        if (this.isControlled("ussr", "japan") == 1) { 

	  //
	  // Shuttle Diplomacy also removes adjacency of Japan if controlled
	  //
          if (this.game.state.events.shuttlediplomacy == 1) {
	    this.updateLog("USSR loses Japan/US-adjacency with Shuttle Diplomacy");
          } else {
	    scoring.ussr.vp++; 
	  }

	}

        break;
      }
    return scoring;
  }




  doesPlayerDominateRegion(player, region) {

    let total_us = 0;
    let total_ussr = 0;
    let bg_us = 0;
    let bg_ussr = 0;
    let vp_us = 0;
    let vp_ussr = 0;


    ////////////
    // EUROPE //
    ////////////
    if (region == "europe") {

      if (this.isControlled("us", "italy") == 1) { bg_us++; }
      if (this.isControlled("ussr", "italy") == 1) { bg_ussr++; }
      if (this.isControlled("us", "france") == 1) { bg_us++; }
      if (this.isControlled("ussr", "france") == 1) { bg_ussr++; }
      if (this.isControlled("us", "westgermany") == 1) { bg_us++; }
      if (this.isControlled("ussr", "westgermany") == 1) { bg_ussr++; }
      if (this.isControlled("us", "eastgermany") == 1) { bg_us++; }
      if (this.isControlled("ussr", "eastgermany") == 1) { bg_ussr++; }
      if (this.isControlled("us", "poland") == 1) { bg_us++; }
      if (this.isControlled("ussr", "poland") == 1) { bg_ussr++; }

      total_us = bg_us;
      total_ussr = bg_ussr;

      if (this.isControlled("us", "spain") == 1) { total_us++; }
      if (this.isControlled("ussr", "spain") == 1) { total_ussr++; }
      if (this.isControlled("us", "greece") == 1) { total_us++; }
      if (this.isControlled("ussr", "greece") == 1) { total_ussr++; }
      if (this.isControlled("us", "turkey") == 1) { total_us++; }
      if (this.isControlled("ussr", "turkey") == 1) { total_ussr++; }
      if (this.isControlled("us", "yugoslavia") == 1) { total_us++; }
      if (this.isControlled("ussr", "yugoslavia") == 1) { total_ussr++; }
      if (this.isControlled("us", "bulgaria") == 1) { total_us++; }
      if (this.isControlled("ussr", "bulgaria") == 1) { total_ussr++; }
      if (this.isControlled("us", "austria") == 1) { total_us++; }
      if (this.isControlled("ussr", "austria") == 1) { total_ussr++; }
      if (this.isControlled("us", "romania") == 1) { total_us++; }
      if (this.isControlled("ussr", "romania") == 1) { total_ussr++; }
      if (this.isControlled("us", "hungary") == 1) { total_us++; }
      if (this.isControlled("ussr", "hungary") == 1) { total_ussr++; }
      if (this.isControlled("us", "czechoslovakia") == 1) { total_us++; }
      if (this.isControlled("ussr", "czechoslovakia") == 1) { total_ussr++; }
      if (this.isControlled("us", "benelux") == 1) { total_us++; }
      if (this.isControlled("ussr", "benelux") == 1) { total_ussr++; }
      if (this.isControlled("us", "uk") == 1) { total_us++; }
      if (this.isControlled("ussr", "uk") == 1) { total_ussr++; }
      if (this.isControlled("us", "canada") == 1) { total_us++; }
      if (this.isControlled("ussr", "canada") == 1) { total_ussr++; }
      if (this.isControlled("us", "norway") == 1) { total_us++; }
      if (this.isControlled("ussr", "norway") == 1) { total_ussr++; }
      if (this.isControlled("us", "denmark") == 1) { total_us++; }
      if (this.isControlled("ussr", "denmark") == 1) { total_ussr++; }
      if (this.isControlled("us", "sweden") == 1) { total_us++; }
      if (this.isControlled("ussr", "sweden") == 1) { total_ussr++; }
      if (this.isControlled("us", "finland") == 1) { total_us++; }
      if (this.isControlled("ussr", "finland") == 1) { total_ussr++; }

      if (total_us > 0) { vp_us = 3; }
      if (total_ussr> 0) { vp_ussr = 3; }

      if (bg_us > bg_ussr && total_us > bg_us && total_us > total_ussr) { vp_us = 7; }
      if (bg_ussr > bg_us && total_ussr > bg_ussr && total_ussr > total_us) { vp_ussr = 7; }

      if (total_us == 6 && total_us > total_ussr) { vp_us = 10000; }
      if (total_ussr == 6 && total_us > total_ussr) { vp_ussr = 10000; }

      vp_us = vp_us + bg_us;
      vp_ussr = vp_ussr + bg_ussr;

      if ((vp_us >= vp_ussr+2 && total_us > bg_us) || (bg_us == 5 && total_us > total_ussr)) {
        if (player == "us") { return 1; }
        if (player == "ussr") { return 0; }
      }
      if ((vp_ussr >= vp_us+2 && total_ussr > bg_ussr) || (bg_ussr == 5 && total_ussr > total_us)) {
        if (player == "us") { return 0; }
        if (player == "ussr") { return 1; }
      }
    }



    /////////////////
    // MIDDLE EAST //
    /////////////////
    if (region == "mideast") {

      if (this.isControlled("us", "libya") == 1) { bg_us++; }
      if (this.isControlled("ussr", "libya") == 1) { bg_ussr++; }
      if (this.isControlled("us", "egypt") == 1) { bg_us++; }
      if (this.isControlled("ussr", "egypt") == 1) { bg_ussr++; }
      if (this.isControlled("us", "israel") == 1) { bg_us++; }
      if (this.isControlled("ussr", "israel") == 1) { bg_ussr++; }
      if (this.isControlled("us", "iraq") == 1) { bg_us++; }
      if (this.isControlled("ussr", "iraq") == 1) { bg_ussr++; }
      if (this.isControlled("us", "iran") == 1) { bg_us++; }
      if (this.isControlled("ussr", "iran") == 1) { bg_ussr++; }
      if (this.isControlled("us", "saudiarabia") == 1) { bg_us++; }
      if (this.isControlled("ussr", "saudiarabia") == 1) { bg_ussr++; }

      total_us = bg_us;
      total_ussr = bg_ussr;

      if (this.isControlled("us", "lebanon") == 1) { total_us++; }
      if (this.isControlled("ussr", "lebanon") == 1) { total_ussr++; }
      if (this.isControlled("us", "syria") == 1) { total_us++; }
      if (this.isControlled("ussr", "syria") == 1) { total_ussr++; }
      if (this.isControlled("us", "jordan") == 1) { total_us++; }
      if (this.isControlled("ussr", "jordan") == 1) { total_ussr++; }
      if (this.isControlled("us", "gulfstates") == 1) { total_us++; }
      if (this.isControlled("ussr", "gulfstates") == 1) { total_ussr++; }

      if (total_us > 0) { vp_us = 3; }
      if (total_ussr> 0) { vp_ussr = 3; }

      if (bg_us > bg_ussr && total_us > bg_us && total_us > total_ussr) { vp_us = 5; }
      if (bg_ussr > bg_us && total_ussr > bg_ussr && total_ussr > total_us) { vp_ussr = 5; }

      if (total_us == 7 && total_us > total_ussr) { vp_us = 7; }
      if (total_ussr == 7 && total_us > total_ussr) { vp_ussr = 7; }

      vp_us = vp_us + bg_us;
      vp_ussr = vp_ussr + bg_ussr;

      if ((vp_us >= vp_ussr+2 && total_us > bg_us) || (bg_us == 6 && total_us > total_ussr)) {
        if (player == "us") { return 1; }
        if (player == "ussr") { return 0; }
      }
      if ((vp_ussr >= vp_us+2 && total_ussr > bg_ussr) || (bg_ussr == 6 && total_ussr > total_us)) {
        if (player == "us") { return 0; }
        if (player == "ussr") { return 1; }
      }
    }



    ////////////
    // AFRICA //
    ////////////
    if (region == "africa") {

      if (this.isControlled("us", "algeria") == 1) { bg_us++; }
      if (this.isControlled("ussr", "algeria") == 1) { bg_ussr++; }
      if (this.isControlled("us", "nigeria") == 1) { bg_us++; }
      if (this.isControlled("ussr", "nigeria") == 1) { bg_ussr++; }
      if (this.isControlled("us", "zaire") == 1) { bg_us++; }
      if (this.isControlled("ussr", "zaire") == 1) { bg_ussr++; }
      if (this.isControlled("us", "angola") == 1) { bg_us++; }
      if (this.isControlled("ussr", "angola") == 1) { bg_ussr++; }
      if (this.isControlled("us", "southafrica") == 1) { bg_us++; }
      if (this.isControlled("ussr", "southafrica") == 1) { bg_ussr++; }

      total_us = bg_us;
      total_ussr = bg_ussr;

      if (this.isControlled("us", "morocco") == 1) { total_us++; }
      if (this.isControlled("ussr", "morocco") == 1) { total_ussr++; }
      if (this.isControlled("us", "tunisia") == 1) { total_us++; }
      if (this.isControlled("ussr", "tunisia") == 1) { total_ussr++; }
      if (this.isControlled("us", "westafricanstates") == 1) { total_us++; }
      if (this.isControlled("ussr", "westafricanstates") == 1) { total_ussr++; }
      if (this.isControlled("us", "saharanstates") == 1) { total_us++; }
      if (this.isControlled("ussr", "saharanstates") == 1) { total_ussr++; }
      if (this.isControlled("us", "sudan") == 1) { total_us++; }
      if (this.isControlled("ussr", "sudan") == 1) { total_ussr++; }
      if (this.isControlled("us", "ivorycoast") == 1) { total_us++; }
      if (this.isControlled("ussr", "ivorycoast") == 1) { total_ussr++; }
      if (this.isControlled("us", "ethiopia") == 1) { total_us++; }
      if (this.isControlled("ussr", "ethiopia") == 1) { total_ussr++; }
      if (this.isControlled("us", "somalia") == 1) { total_us++; }
      if (this.isControlled("ussr", "somalia") == 1) { total_ussr++; }
      if (this.isControlled("us", "cameroon") == 1) { total_us++; }
      if (this.isControlled("ussr", "cameroon") == 1) { total_ussr++; }
      if (this.isControlled("us", "kenya") == 1) { total_us++; }
      if (this.isControlled("ussr", "kenya") == 1) { total_ussr++; }
      if (this.isControlled("us", "seafricanstates") == 1) { total_us++; }
      if (this.isControlled("ussr", "seafricanstates") == 1) { total_ussr++; }
      if (this.isControlled("us", "zimbabwe") == 1) { total_us++; }
      if (this.isControlled("ussr", "zimbabwe") == 1) { total_ussr++; }
      if (this.isControlled("us", "botswana") == 1) { total_us++; }
      if (this.isControlled("ussr", "botswana") == 1) { total_ussr++; }

      if (total_us > 0) { vp_us = 1; }
      if (total_ussr> 0) { vp_ussr = 1; }

      if (bg_us > bg_ussr && total_us > bg_us && total_us > total_ussr) { vp_us = 4; }
      if (bg_ussr > bg_us && total_ussr > bg_ussr && total_ussr > total_us) { vp_ussr = 4; }

      if (total_us == 7 && total_us > total_ussr) { vp_us = 6; }
      if (total_ussr == 7 && total_us > total_ussr) { vp_ussr = 6; }

      vp_us = vp_us + bg_us;
      vp_ussr = vp_ussr + bg_ussr;

      if ((vp_us >= vp_ussr+2 && total_us > bg_us) || (bg_us == 5 && total_us > total_ussr)) {
        if (player == "us") { return 1; }
        if (player == "ussr") { return 0; }
      }
      if ((vp_ussr >= vp_us+2 && total_ussr > bg_ussr) || (bg_ussr == 5 && total_ussr > total_us)) {
        if (player == "us") { return 0; }
        if (player == "ussr") { return 1; }
      }
    }



    /////////////////////
    // CENTRAL AMERICA //
    /////////////////////
    if (region == "centralamerica") {

      if (this.isControlled("us", "mexico") == 1) { bg_us++; }
      if (this.isControlled("ussr", "mexico") == 1) { bg_ussr++; }
      if (this.isControlled("us", "cuba") == 1) { bg_us++; }
      if (this.isControlled("ussr", "cuba") == 1) { bg_ussr++; }
      if (this.isControlled("us", "panama") == 1) { bg_us++; }
      if (this.isControlled("ussr", "panama") == 1) { bg_ussr++; }

      total_us = bg_us;
      total_ussr = bg_ussr;

      if (this.isControlled("us", "guatemala") == 1) { total_us++; }
      if (this.isControlled("ussr", "guatemala") == 1) { total_ussr++; }
      if (this.isControlled("us", "elsalvador") == 1) { total_us++; }
      if (this.isControlled("ussr", "elsalvador") == 1) { total_ussr++; }
      if (this.isControlled("us", "honduras") == 1) { total_us++; }
      if (this.isControlled("ussr", "honduras") == 1) { total_ussr++; }
      if (this.isControlled("us", "costarica") == 1) { total_us++; }
      if (this.isControlled("ussr", "costarica") == 1) { total_ussr++; }
      if (this.isControlled("us", "nicaragua") == 1) { total_us++; }
      if (this.isControlled("ussr", "nicaragua") == 1) { total_ussr++; }
      if (this.isControlled("us", "haiti") == 1) { total_us++; }
      if (this.isControlled("ussr", "haiti") == 1) { total_ussr++; }
      if (this.isControlled("us", "dominicanrepublic") == 1) { total_us++; }
      if (this.isControlled("ussr", "dominicanrepublic") == 1) { total_ussr++; }

      if (total_us > 0) { vp_us = 1; }
      if (total_ussr> 0) { vp_ussr = 1; }

      if (bg_us > bg_ussr && total_us > bg_us && total_us > total_ussr) { vp_us = 3; }
      if (bg_ussr > bg_us && total_ussr > bg_ussr && total_ussr > total_us) { vp_ussr = 3; }

      if (total_us == 7 && total_us > total_ussr) { vp_us = 5; }
      if (total_ussr == 7 && total_us > total_ussr) { vp_ussr = 5; }

      vp_us = vp_us + bg_us;
      vp_ussr = vp_ussr + bg_ussr;

      if ((vp_us > vp_ussr && total_us > bg_us && bg_us > 0) || (bg_us == 3 && total_us > total_ussr)) {
        if (player == "us") { return 1; }
        if (player == "ussr") { return 0; }
      }
      if ((vp_ussr > vp_us && total_ussr > bg_ussr && bg_ussr > 0) || (bg_ussr == 3 && total_ussr > total_us)) {
        if (player == "us") { return 0; }
        if (player == "ussr") { return 1; }
      }
    }



    ///////////////////
    // SOUTH AMERICA //
    ///////////////////
    if (region == "southamerica") {

      if (this.isControlled("us", "venezuela") == 1) { bg_us++; }
      if (this.isControlled("ussr", "venezuela") == 1) { bg_ussr++; }
      if (this.isControlled("us", "brazil") == 1) { bg_us++; }
      if (this.isControlled("ussr", "brazil") == 1) { bg_ussr++; }
      if (this.isControlled("us", "argentina") == 1) { bg_us++; }
      if (this.isControlled("ussr", "argentina") == 1) { bg_ussr++; }
      if (this.isControlled("us", "chile") == 1) { bg_us++; }
      if (this.isControlled("ussr", "chile") == 1) { bg_ussr++; }

      total_us = bg_us;
      total_ussr = bg_ussr;

      if (this.isControlled("us", "colombia") == 1) { total_us++; }
      if (this.isControlled("ussr", "colombia") == 1) { total_ussr++; }
      if (this.isControlled("us", "ecuador") == 1) { total_us++; }
      if (this.isControlled("ussr", "ecuador") == 1) { total_ussr++; }
      if (this.isControlled("us", "peru") == 1) { total_us++; }
      if (this.isControlled("ussr", "peru") == 1) { total_ussr++; }
      if (this.isControlled("us", "bolivia") == 1) { total_us++; }
      if (this.isControlled("ussr", "bolivia") == 1) { total_ussr++; }
      if (this.isControlled("us", "paraguay") == 1) { total_us++; }
      if (this.isControlled("ussr", "paraguay") == 1) { total_ussr++; }
      if (this.isControlled("us", "uruguay") == 1) { total_us++; }
      if (this.isControlled("ussr", "uruguay") == 1) { total_ussr++; }

      if (total_us > 0) { vp_us = 2; }
      if (total_ussr> 0) { vp_ussr = 2; }

      if (bg_us > bg_ussr && total_us > bg_us && total_us > total_ussr) { vp_us = 5; }
      if (bg_ussr > bg_us && total_ussr > bg_ussr && total_ussr > total_us) { vp_ussr = 5; }

      if (total_us == 7 && total_us > total_ussr) { vp_us = 6; }
      if (total_ussr == 7 && total_us > total_ussr) { vp_ussr = 6; }

      vp_us = vp_us + bg_us;
      vp_ussr = vp_ussr + bg_ussr;

      if ((vp_us > vp_ussr+2 && total_us > bg_us && bg_us > 0) || (bg_us == 4 && total_us > total_ussr)) {
        if (player == "us") { return 1; }
        if (player == "ussr") { return 0; }
      }
      if ((vp_ussr > vp_us+2 && total_ussr > bg_ussr && bg_ussr > 0) || (bg_ussr == 4 && total_ussr > total_us)) {
        if (player == "us") { return 0; }
        if (player == "ussr") { return 1; }
      }

    }




    //////////
    // ASIA //
    //////////
    if (region == "asia") {

      if (this.isControlled("us", "northkorea") == 1) { bg_us++; }
      if (this.isControlled("ussr", "northkorea") == 1) { bg_ussr++; }
      if (this.isControlled("us", "southkorea") == 1) { bg_us++; }
      if (this.isControlled("ussr", "southkorea") == 1) { bg_ussr++; }
      if (this.isControlled("us", "japan") == 1) { bg_us++; }
      if (this.isControlled("ussr", "japan") == 1) { bg_ussr++; }
      if (this.isControlled("us", "thailand") == 1) { bg_us++; }
      if (this.isControlled("ussr", "thailand") == 1) { bg_ussr++; }
      if (this.isControlled("us", "india") == 1) { bg_us++; }
      if (this.isControlled("ussr", "india") == 1) { bg_ussr++; }
      if (this.isControlled("us", "pakistan") == 1) { bg_us++; }
      if (this.isControlled("ussr", "pakistan") == 1) { bg_ussr++; }
      if (this.game.state.events.formosan == 1) {
        if (this.isControlled("us", "taiwan") == 1) { bg_us++; }
      }

      total_us = bg_us;
      total_ussr = bg_ussr;

      if (this.isControlled("us", "afghanistan") == 1) { total_us++; }
      if (this.isControlled("ussr", "afghanistan") == 1) { total_ussr++; }
      if (this.isControlled("us", "burma") == 1) { total_us++; }
      if (this.isControlled("ussr", "burma") == 1) { total_ussr++; }
      if (this.isControlled("us", "laos") == 1) { total_us++; }
      if (this.isControlled("ussr", "laos") == 1) { total_ussr++; }
      if (this.isControlled("us", "vietnam") == 1) { total_us++; }
      if (this.isControlled("ussr", "vietnam") == 1) { total_ussr++; }
      if (this.isControlled("us", "malaysia") == 1) { total_us++; }
      if (this.isControlled("ussr", "malaysia") == 1) { total_ussr++; }
      if (this.isControlled("us", "australia") == 1) { total_us++; }
      if (this.isControlled("ussr", "australia") == 1) { total_ussr++; }
      if (this.isControlled("us", "indonesia") == 1) { total_us++; }
      if (this.isControlled("ussr", "indonesia") == 1) { total_ussr++; }
      if (this.isControlled("us", "philippines") == 1) { total_us++; }
      if (this.isControlled("ussr", "philippines") == 1) { total_ussr++; }

      if (total_us > 0) { vp_us = 3; }
      if (total_ussr> 0) { vp_ussr = 3; }

      if (bg_us > bg_ussr && total_us > bg_us && total_us > total_ussr) { vp_us = 7; }
      if (bg_ussr > bg_us && total_ussr > bg_ussr && total_ussr > total_us) { vp_ussr = 7; }

      if (this.game.state.events.formosan == 1) {
        if (total_us == 7 && total_us > total_ussr) { vp_us = 9; }
        if (total_ussr == 7 && total_us > total_ussr) { vp_ussr = 9; }
      } else {
        if (total_us == 6 && total_us > total_ussr) { vp_us = 9; }
        if (total_ussr == 6 && total_us > total_ussr) { vp_ussr = 9; }
      }

      vp_us = vp_us + bg_us;
      vp_ussr = vp_ussr + bg_ussr;

      if ((vp_us > vp_ussr+2 && total_us > bg_us && bg_us > 0) || (bg_us >= 6 && total_us > total_ussr)) {
	if (bg_us == 6 && this.isControlled("us", "taiwan") == 1 && this.game.state.events.formosan == 1) { return 0; }
        if (player == "us") { return 1; }
        if (player == "ussr") { return 0; }
      }
      if ((vp_ussr > vp_us+2 && total_ussr > bg_ussr && bg_ussr > 0) || (bg_ussr == 6 && total_ussr > total_us)) {
        if (player == "us") { return 0; }
        if (player == "ussr") { return 1; }
      }
    }

    return 0;

  }




  returnCardItem(card) {

    if (this.interface == 1) {
      if (this.game.deck[0].cards[card] == undefined) {
        return `<div id="${card.replace(/ /g,'')}" class="card cardbox-hud cardbox-hud-status">${this.returnCardImage(card, 1)}</div>`;
      }
      return `<div id="${card.replace(/ /g,'')}" class="card showcard cardbox-hud cardbox-hud-status">${this.returnCardImage(card, 1)}</div>`;
    } else {
      if (this.game.deck[0].cards[card] == undefined) {
        return '<li class="card showcard" id="'+card+'">'+this.game.deck[0].cards[card].name+'</li>';
      }
      return '<li class="card showcard" id="'+card+'">'+this.game.deck[0].cards[card].name+'</li>';
    }

  }





  returnCardList(cardarray=[]) {

    let hand = this.game.deck[0].hand;

    let html = "";


    if (this.interface == 1) {
      for (i = 0; i < cardarray.length; i++) {
        html += this.returnCardItem(cardarray[i]);
      }
      html = `
        <div class="status-cardbox" id="status-cardbox">
          ${html}
        </div>`;
    } else {

      html = "<ul>";
      for (i = 0; i < cardarray.length; i++) {
        html += this.returnCardItem(cardarray[i]);
      }
      html += '</ul>';

    }

    return html;

  }



  updateStatusAndListCards(message, cards=null) {

    //
    // OBSERVER MODE
    //
    if (this.game.player == 0) {
      this.updateStatus(`<div id="status-message" class="status-message">${message}</div>`);
      //this.addShowCardEvents();
      return;
    }

    if (cards == null) {
      cards = this.game.deck[0].hand;
    }

    html = `
        <div id="status-message" class="status-message">${message}</div>
        ${this.returnCardList(cards)}
    `

    this.updateStatus(html);
    this.addShowCardEvents();
  }


  updateRound() {

    let dt = 0;
    let dl = 0;

    if (this.game.state.round == 0) {
      dt = this.game.state.round_ps[0].top;
      dl = this.game.state.round_ps[0].left;
    }
    if (this.game.state.round == 1) {
      dt = this.game.state.round_ps[0].top;
      dl = this.game.state.round_ps[0].left;
    }
    if (this.game.state.round == 2) {
      dt = this.game.state.round_ps[1].top;
      dl = this.game.state.round_ps[1].left;
    }
    if (this.game.state.round == 3) {
      dt = this.game.state.round_ps[2].top;
      dl = this.game.state.round_ps[2].left;
    }
    if (this.game.state.round == 4) {
      dt = this.game.state.round_ps[3].top;
      dl = this.game.state.round_ps[3].left;
    }
    if (this.game.state.round == 5) {
      dt = this.game.state.round_ps[4].top;
      dl = this.game.state.round_ps[4].left;
    }
    if (this.game.state.round == 6) {
      dt = this.game.state.round_ps[5].top;
      dl = this.game.state.round_ps[5].left;
    }
    if (this.game.state.round == 7) {
      dt = this.game.state.round_ps[6].top;
      dl = this.game.state.round_ps[6].left;
    }
    if (this.game.state.round == 8) {
      dt = this.game.state.round_ps[7].top;
      dl = this.game.state.round_ps[7].left;
    }
    if (this.game.state.round == 9) {
      dt = this.game.state.round_ps[8].top;
      dl = this.game.state.round_ps[8].left;
    }
    if (this.game.state.round == 10) {
      dt = this.game.state.round_ps[9].top;
      dl = this.game.state.round_ps[9].left;
    }

    dt = this.scale(dt)+"px";
    dl = this.scale(dl)+"px";

    $('.round').css('width', this.scale(140)+"px");
    $('.round').css('height', this.scale(140)+"px");
    $('.round').css('top', dt);
    $('.round').css('left', dl);

  }


  lowerDefcon() {

    //
    // END OF HISTORY
    //
    if ((this.game.state.events.manwhosavedtheworld === "us" && this.game.state.turn == 1) || (this.game.state.events.manwhosavedtheworld === "ussr" && this.game.state.turn == 0)) {
      if (this.game.state.defcon == 2) {
        this.game.state.events.manwhosavedtheworld = "";
        this.updateLog("<span>Man Who Saved the World prevents thermonuclear war</span>");
        return;
      }
    }


    this.game.state.defcon--;

    this.updateLog("<span>DEFCON falls to</span> " + this.game.state.defcon);

    if (this.game.state.defcon == 2) {
      if (this.game.state.events.norad == 1) {
        if (this.game.state.headline != 1) {
          this.game.state.us_defcon_bonus = 1;
        }
      }
    }


  console.log("LOWERING DEFCON: " + this.game.state.defcon + " -- " + this.game.state.headline + " -- " + this.game.state.player_to_go);

    if (this.game.state.defcon == 1) {
      if (this.game.state.headline == 1) {
        //
        // phasing player in headline loses
        //
        if (this.game.state.player_to_go == 1) {
          this.endGame("us", "<span>USSR triggers thermonuclear war</span>");
        }
        if (this.game.state.player_to_go == 2) {
          this.endGame("ussr", "<span>US triggers thermonuclear war</span>");
        }
        return;
      }
      if (this.game.state.turn == 0) {
        this.endGame("us", "<span>USSR triggers thermonuclear war 1</span>");
      } else {
        this.endGame("ussr", "<span>US triggers thermonuclear war 2</span>");
      }
    }

    this.updateDefcon();
  }


  updateDefcon() {

    if (this.game.state.defcon > 5) { this.game.state.defcon = 5; }

    let dt = 0;
    let dl = 0;

    if (this.game.state.defcon == 5) {
      dt = this.game.state.defcon_ps[0].top;
      dl = this.game.state.defcon_ps[0].left;
    }
    if (this.game.state.defcon == 4) {
      dt = this.game.state.defcon_ps[1].top;
      dl = this.game.state.defcon_ps[1].left;
    }
    if (this.game.state.defcon == 3) {
      dt = this.game.state.defcon_ps[2].top;
      dl = this.game.state.defcon_ps[2].left;
    }
    if (this.game.state.defcon == 2) {
      dt = this.game.state.defcon_ps[3].top;
      dl = this.game.state.defcon_ps[3].left;
    }
    if (this.game.state.defcon == 1) {
      dt = this.game.state.defcon_ps[4].top;
      dl = this.game.state.defcon_ps[4].left;
    }

    dt = this.scale(dt) + "px";
    dl = this.scale(dl) + "px";

    dt = dt;
    dl = dl;

    $('.defcon').css('width', this.scale(120)+"px");
    $('.defcon').css('height', this.scale(120)+"px");
    $('.defcon').css('top', dt);
    $('.defcon').css('left', dl);

  }



  updateActionRound() {

    let dt = 0;
    let dl = 0;
    let dt_us = 0;
    let dl_us = 0;

    let turn_in_round = this.game.state.turn_in_round;

    if (turn_in_round == 0) {
      dt = this.game.state.ar_ps[0].top;
      dl = this.game.state.ar_ps[0].left;
    }
    if (turn_in_round == 1) {
      dt = this.game.state.ar_ps[0].top;
      dl = this.game.state.ar_ps[0].left;
    }
    if (turn_in_round == 2) {
      dt = this.game.state.ar_ps[1].top;
      dl = this.game.state.ar_ps[1].left;
    }
    if (turn_in_round == 3) {
      dt = this.game.state.ar_ps[2].top;
      dl = this.game.state.ar_ps[2].left;
    }
    if (turn_in_round == 4) {
      dt = this.game.state.ar_ps[3].top;
      dl = this.game.state.ar_ps[3].left;
    }
    if (turn_in_round == 5) {
      dt = this.game.state.ar_ps[4].top;
      dl = this.game.state.ar_ps[4].left;
    }
    if (turn_in_round == 6) {
      dt = this.game.state.ar_ps[5].top;
      dl = this.game.state.ar_ps[5].left;
    }
    if (turn_in_round == 7) {
      dt = this.game.state.ar_ps[6].top;
      dl = this.game.state.ar_ps[6].left;
    }
    if (turn_in_round == 8) {
      dt = this.game.state.ar_ps[7].top;
      dl = this.game.state.ar_ps[7].left;
    }

    dt = this.scale(dt)+"px";
    dl = this.scale(dl)+"px";

    if (this.game.state.turn == 0) {
      $('.action_round_us').hide();
      $('.action_round_ussr').show();
      $('.action_round_ussr').css('width', this.scale(100)+"px");
      $('.action_round_ussr').css('height', this.scale(100)+"px");
      $('.action_round_ussr').css('top', dt);
      $('.action_round_ussr').css('left', dl);
    } else {
      $('.action_round_ussr').hide();
      $('.action_round_us').show();
      $('.action_round_us').css('width', this.scale(100)+"px");
      $('.action_round_us').css('height', this.scale(100)+"px");
      $('.action_round_us').css('top', dt);
      $('.action_round_us').css('left', dl);
    }

    let rounds_this_turn = 6;
    if (this.game.state.round > 3) { rounds_this_turn = 7; }
    if (this.game.state.northseaoil == 1 && this.game.player == 2) { rounds_this_turn++; }
    if (this.game.state.space_station === "us" && this.game.player == 2) { rounds_this_turn++; }
    if (this.game.state.space_station === "ussr" && this.game.player == 1) { rounds_this_turn++; }

    $('.action_round_cover').css('width', this.scale(100)+"px");
    $('.action_round_cover').css('height', this.scale(100)+"px");

    let dt8 = this.scale(this.game.state.ar_ps[7].top) + "px";
    let dl8 = this.scale(this.game.state.ar_ps[7].left) + "px";
    let dt7 = this.scale(this.game.state.ar_ps[6].top) + "px";
    let dl7 = this.scale(this.game.state.ar_ps[6].left) + "px";

    $('.action_round_8_cover').css('top', dt8);
    $('.action_round_8_cover').css('left', dl8);
    $('.action_round_7_cover').css('top', dt7);
    $('.action_round_7_cover').css('left', dl7);

    if (rounds_this_turn < 8) { $('.action_round_8_cover').css('display','all'); } else { $('.action_round_8_cover').css('display','none'); }
    if (rounds_this_turn < 7) { $('.action_round_7_cover').css('display','all'); } else { $('.action_round_7_cover').css('display','none'); }

  }



  advanceSpaceRace(player) {

    this.updateLog("<span>" + player.toUpperCase() + "</span> <span>has advanced in the space race</span>");

    if (player == "us") {

      this.game.state.space_race_us++;

      // Earth Satellite
      if (this.game.state.space_race_us == 1) {
        if (this.game.state.space_race_ussr < 1) {
          this.game.state.vp += 2;
          this.updateVictoryPoints();
        } else {
          this.game.state.vp += 1;
          this.updateVictoryPoints();
        }
      }

      // Animal in Space
      if (this.game.state.space_race_us == 2) {
        if (this.game.state.space_race_ussr < 2) {
          this.game.state.animal_in_space = "us";
        } else {
          this.game.state.animal_in_space = "";
        }
      }

      // Man in Space
      if (this.game.state.space_race_us == 3) {
        if (this.game.state.space_race_ussr < 3) {
          this.game.state.vp += 2;
          this.updateVictoryPoints();
        } else {
          this.game.state.animal_in_space = "";
        }
      }

      // Man in Earth Orbit
      if (this.game.state.space_race_us == 4) {
        if (this.game.state.space_race_ussr < 4) {
          this.game.state.man_in_earth_orbit = "us";
        } else {
          this.game.state.man_in_earth_orbit = "";
          this.game.state.animal_in_space = "";
        }
      }

      // Lunar Orbit
      if (this.game.state.space_race_us == 5) {
        if (this.game.state.space_race_ussr < 5) {
          this.game.state.vp += 3;
          this.updateVictoryPoints();
        } else {
          this.game.state.vp += 1;
          this.updateVictoryPoints();
          this.game.state.man_in_earth_orbit = "";
          this.game.state.animal_in_space = "";
        }
      }

      // Eagle has Landed
      if (this.game.state.space_race_us == 6) {
        if (this.game.state.space_race_ussr < 6) {
          this.game.state.eagle_has_landed = "us";
        } else {
          this.game.state.eagle_has_landed = "";
          this.game.state.man_in_earth_orbit = "";
          this.game.state.animal_in_space = "";
        }
      }

      // Space Shuttle
      if (this.game.state.space_race_us == 7) {
        if (this.game.state.space_race_ussr < 7) {
          this.game.state.vp += 4;
          this.updateVictoryPoints();
        } else {
          this.game.state.vp += 2;
          this.updateVictoryPoints();
          this.game.state.eagle_has_landed = "";
          this.game.state.man_in_earth_orbit = "";
          this.game.state.animal_in_space = "";
        }
      }

      // Space Station
      if (this.game.state.space_race_us == 8) {
        if (this.game.state.space_race_ussr < 8) {
          this.game.state.vp += 2;
          this.updateVictoryPoints();
          this.game.state.space_shuttle = "us";
        } else {
          this.game.state.eagle_has_landed = "";
          this.game.state.man_in_earth_orbit = "";
          this.game.state.animal_in_space = "";
          this.game.state.space_shuttle = "";
        }
      }
    }





    if (player == "ussr") {

      this.game.state.space_race_ussr++;

      // Earth Satellite
      if (this.game.state.space_race_ussr == 1) {
        if (this.game.state.space_race_us < 1) {
          this.game.state.vp -= 2;
          this.updateVictoryPoints();
        } else {
          this.game.state.vp -= 1;
          this.updateVictoryPoints();
        }
      }

      // Animal in Space
      if (this.game.state.space_race_ussr == 2) {
        if (this.game.state.space_race_us < 2) {
          this.game.state.animal_in_space = "ussr";
        } else {
          this.game.state.animal_in_space = "";
        }
      }

      // Man in Space
      if (this.game.state.space_race_ussr == 3) {
        if (this.game.state.space_race_us < 3) {
          this.game.state.vp -= 2;
          this.updateVictoryPoints();
        } else {
          this.game.state.animal_in_space = "";
        }
      }

      // Man in Earth Orbit
      if (this.game.state.space_race_ussr == 4) {
        if (this.game.state.space_race_us < 4) {
          this.game.state.man_in_earth_orbit = "ussr";
        } else {
          this.game.state.animal_in_space = "";
          this.game.state.man_in_earth_orbit = "";
        }
      }

      // Lunar Orbit
      if (this.game.state.space_race_ussr == 5) {
        if (this.game.state.space_race_us < 5) {
          this.game.state.vp -= 3;
          this.updateVictoryPoints();
        } else {
          this.game.state.vp -= 1;
          this.updateVictoryPoints();
          this.game.state.animal_in_space = "";
          this.game.state.man_in_earth_orbit = "";
        }
      }

      // Bear has Landed
      if (this.game.state.space_race_ussr == 6) {
        if (this.game.state.space_race_us < 6) {
          this.game.state.eagle_has_landed = "ussr";
        } else {
          this.game.state.animal_in_space = "";
          this.game.state.man_in_earth_orbit = "";
          this.game.state.eagle_has_landed = "";
        }
      }

      // Space Shuttle
      if (this.game.state.space_race_ussr == 7) {
        if (this.game.state.space_race_us < 7) {
          this.game.state.vp -= 4;
          this.updateVictoryPoints();
        } else {
          this.game.state.vp -= 2;
          this.updateVictoryPoints();
          this.game.state.animal_in_space = "";
          this.game.state.man_in_earth_orbit = "";
          this.game.state.eagle_has_landed = "";
        }
      }

      // Space Station
      if (this.game.state.space_race_ussr == 8) {
        if (this.game.state.space_race_us < 8) {
          this.game.state.vp -= 2;
          this.updateVictoryPoints();
          this.game.state.space_shuttle = "ussr";
        } else {
          this.game.state.animal_in_space = "";
          this.game.state.man_in_earth_orbit = "";
          this.game.state.eagle_has_landed = "";
          this.game.state.space_shuttle = "";
        }
      }
    }

    this.updateSpaceRace();
  }



  updateSpaceRace() {

    let dt_us = 0;
    let dl_us = 0;
    let dt_ussr = 0;
    let dl_ussr = 0;

    if (this.game.state.space_race_us == 0) {
      dt_us = this.game.state.space_race_ps[0].top;
      dl_us = this.game.state.space_race_ps[0].left;
    }
    if (this.game.state.space_race_us == 1) {
      dt_us = this.game.state.space_race_ps[1].top;
      dl_us = this.game.state.space_race_ps[1].left;
    }
    if (this.game.state.space_race_us == 2) {
      dt_us = this.game.state.space_race_ps[2].top;
      dl_us = this.game.state.space_race_ps[2].left;
    }
    if (this.game.state.space_race_us == 3) {
      dt_us = this.game.state.space_race_ps[3].top;
      dl_us = this.game.state.space_race_ps[3].left;
    }
    if (this.game.state.space_race_us == 4) {
      dt_us = this.game.state.space_race_ps[4].top;
      dl_us = this.game.state.space_race_ps[4].left;
    }
    if (this.game.state.space_race_us == 5) {
      dt_us = this.game.state.space_race_ps[5].top;
      dl_us = this.game.state.space_race_ps[5].left;
    }
    if (this.game.state.space_race_us == 6) {
      dt_us = this.game.state.space_race_ps[6].top;
      dl_us = this.game.state.space_race_ps[6].left;
    }
    if (this.game.state.space_race_us == 7) {
      dt_us = this.game.state.space_race_ps[7].top;
      dl_us = this.game.state.space_race_ps[7].left;
    }
    if (this.game.state.space_race_us == 8) {
      dt_us = this.game.state.space_race_ps[8].top;
      dl_us = this.game.state.space_race_ps[8].left;
    }

    if (this.game.state.space_race_ussr == 0) {
      dt_ussr = this.game.state.space_race_ps[0].top;
      dl_ussr = this.game.state.space_race_ps[0].left;
    }
    if (this.game.state.space_race_ussr == 1) {
      dt_ussr = this.game.state.space_race_ps[1].top;
      dl_ussr = this.game.state.space_race_ps[1].left;
    }
    if (this.game.state.space_race_ussr == 2) {
      dt_ussr = this.game.state.space_race_ps[2].top;
      dl_ussr = this.game.state.space_race_ps[2].left;
    }
    if (this.game.state.space_race_ussr == 3) {
      dt_ussr = this.game.state.space_race_ps[3].top;
      dl_ussr = this.game.state.space_race_ps[3].left;
    }
    if (this.game.state.space_race_ussr == 4) {
      dt_ussr = this.game.state.space_race_ps[4].top;
      dl_ussr = this.game.state.space_race_ps[4].left;
    }
    if (this.game.state.space_race_ussr == 5) {
      dt_ussr = this.game.state.space_race_ps[5].top;
      dl_ussr = this.game.state.space_race_ps[5].left;
    }
    if (this.game.state.space_race_ussr == 6) {
      dt_ussr = this.game.state.space_race_ps[6].top;
      dl_ussr = this.game.state.space_race_ps[6].left;
    }
    if (this.game.state.space_race_ussr == 7) {
      dt_ussr = this.game.state.space_race_ps[7].top;
      dl_ussr = this.game.state.space_race_ps[7].left;
    }
    if (this.game.state.space_race_ussr == 8) {
      dt_ussr = this.game.state.space_race_ps[8].top;
      dl_ussr = this.game.state.space_race_ps[8].left;
    }

    dt_us = this.scale(dt_us);
    dl_us = this.scale(dl_us);
    dt_ussr = this.scale(dt_ussr+40)+"px";
    dl_ussr = this.scale(dl_ussr+10)+"px";

    $('.space_race_us').css('width', this.scale(100)+"px");
    $('.space_race_us').css('height', this.scale(100)+"px");
    $('.space_race_us').css('top', dt_us);
    $('.space_race_us').css('left', dl_us);

    $('.space_race_ussr').css('width', this.scale(100)+"px");
    $('.space_race_ussr').css('height', this.scale(100)+"px");
    $('.space_race_ussr').css('top', dt_ussr);
    $('.space_race_ussr').css('left', dl_ussr);

  }



  updateEventTiles() {

    try {

    if (this.game.state.events.warsawpact == 0) {
      $('#eventtile_warsaw').css('display','none');
    } else {
      $('#eventtile_warsaw').css('display','block');
    }

    if (this.game.state.events.degaulle == 0) {
      $('#eventtile_degaulle').css('display','none');
    } else {
      $('#eventtile_degaulle').css('display','block');
    }

    if (this.game.state.events.nato == 0) {
      $('#eventtile_nato').css('display','none');
    } else {
      $('#eventtile_nato').css('display','block');
    }

    if (this.game.state.events.marshall == 0) {
      $('#eventtile_marshall').css('display','none');
    } else {
      $('#eventtile_marshall').css('display','block');
    }

    if (this.game.state.events.usjapan == 0) {
      $('#eventtile_usjapan').css('display','none');
    } else {
      $('#eventtile_usjapan').css('display','block');
    }

    if (this.game.state.events.norad == 0) {
      $('#eventtile_norad').css('display','none');
    } else {
      $('#eventtile_norad').css('display','block');
    }

    if (this.game.state.events.quagmire == 0) {
      $('#eventtile_quagmire').css('display','none');
    } else {
      $('#eventtile_quagmire').css('display','block');
    }

    if (this.game.state.events.formosan == 0) {
      $('#eventtile_formosan').css('display','none');
      $('.formosan_resolution').css('display','none');
      $('.formosan_resolution').hide();
    } else {
      if (this.isControlled("ussr", "taiwan") != 1) {
        $('#eventtile_formosan').css('display','block');
        $('.formosan_resolution').css('display','block');
        $('.formosan_resolution').show();
      } else {
        $('.formosan_resolution').css('display','none');
        $('.formosan_resolution').hide();
      }
    }

    if (this.game.state.events.beartrap == 0) {
      $('#eventtile_beartrap').css('display','none');
    } else {
      $('#eventtile_beartrap').css('display','block');
    }

    if (this.game.state.events.willybrandt == 0) {
      $('#eventtile_willybrandt').css('display','none');
    } else {
      $('#eventtile_willybrandt').css('display','block');
    }

    if (this.game.state.events.campdavid == 0) {
      $('#eventtile_campdavid').css('display','none');
    } else {
      $('#eventtile_campdavid').css('display','block');
    }

    if (this.game.state.events.flowerpower == 0) {
      $('#eventtile_flowerpower').css('display','none');
    } else {
      $('#eventtile_flowerpower').css('display','block');
    }

    if (this.game.state.events.johnpaul == 0) {
      $('#eventtile_johnpaul').css('display','none');
    } else {
      $('#eventtile_johnpaul').css('display','block');
    }

    if (this.game.state.events.iranianhostage == 0) {
      $('#eventtile_iranianhostagecrisis').css('display','none');
    } else {
      $('#eventtile_iranianhostagecrisis').css('display','block');
    }

    if (this.game.state.events.shuttlediplomacy == 0) {
      $('#eventtile_shuttlediplomacy').css('display','none');
    } else {
      $('#eventtile_shuttlediplomacy').css('display','block');
    }

    if (this.game.state.events.ironlady == 0) {
      $('#eventtile_ironlady').css('display','none');
    } else {
      $('#eventtile_ironlady').css('display','block');
    }

    if (this.game.state.events.northseaoil == 0) {
      $('#eventtile_northseaoil').css('display','none');
    } else {
      $('#eventtile_northseaoil').css('display','block');
    }

    if (this.game.state.events.reformer == 0) {
      $('#eventtile_reformer').css('display','none');
    } else {
      $('#eventtile_reformer').css('display','block');
    }

    if (this.game.state.events.teardown == 0) {
      $('#eventtile_teardown').css('display','none');
    } else {
      $('#eventtile_teardown').css('display','block');
    }

    if (this.game.state.events.evilempire == 0) {
      $('#eventtile_evilempire').css('display','none');
    } else {
      $('#eventtile_evilempire').css('display','block');
    }

    if (this.game.state.events.awacs == 0) {
      $('#eventtile_awacs').css('display','none');
    } else {
      $('#eventtile_awacs').css('display','block');
    }

    } catch (err) {}

  }



  updateMilitaryOperations() {

    let dt_us = 0;
    let dl_us = 0;
    let dt_ussr = 0;
    let dl_ussr = 0;

    if (this.game.state.milops_us == 0) {
      dt_us = this.game.state.milops_ps[0].top;
      dl_us = this.game.state.milops_ps[0].left;
    }
    if (this.game.state.milops_us == 1) {
      dt_us = this.game.state.milops_ps[1].top;
      dl_us = this.game.state.milops_ps[1].left;
    }
    if (this.game.state.milops_us == 2) {
      dt_us = this.game.state.milops_ps[2].top;
      dl_us = this.game.state.milops_ps[2].left;
    }
    if (this.game.state.milops_us == 3) {
      dt_us = this.game.state.milops_ps[3].top;
      dl_us = this.game.state.milops_ps[3].left;
    }
    if (this.game.state.milops_us == 4) {
      dt_us = this.game.state.milops_ps[4].top;
      dl_us = this.game.state.milops_ps[4].left;
    }
    if (this.game.state.milops_us >= 5) {
      dt_us = this.game.state.milops_ps[5].top;
      dl_us = this.game.state.milops_ps[5].left;
    }

    if (this.game.state.milops_ussr == 0) {
      dt_ussr = this.game.state.milops_ps[0].top;
      dl_ussr = this.game.state.milops_ps[0].left;
    }
    if (this.game.state.milops_ussr == 1) {
      dt_ussr = this.game.state.milops_ps[1].top;
      dl_ussr = this.game.state.milops_ps[1].left;
    }
    if (this.game.state.milops_ussr == 2) {
      dt_ussr = this.game.state.milops_ps[2].top;
      dl_ussr = this.game.state.milops_ps[2].left;
    }
    if (this.game.state.milops_ussr == 3) {
      dt_ussr = this.game.state.milops_ps[3].top;
      dl_ussr = this.game.state.milops_ps[3].left;
    }
    if (this.game.state.milops_ussr == 4) {
      dt_ussr = this.game.state.milops_ps[4].top;
      dl_ussr = this.game.state.milops_ps[4].left;
    }
    if (this.game.state.milops_ussr >= 5) {
      dt_ussr = this.game.state.milops_ps[5].top;
      dl_ussr = this.game.state.milops_ps[5].left;
    }

    dt_us = this.scale(dt_us);
    dl_us = this.scale(dl_us);
    dt_ussr = this.scale(dt_ussr+40)+"px";
    dl_ussr = this.scale(dl_ussr+10)+"px";

    $('.milops_us').css('width', this.scale(100)+"px");
    $('.milops_us').css('height', this.scale(100)+"px");
    $('.milops_us').css('top', dt_us);
    $('.milops_us').css('left', dl_us);

    $('.milops_ussr').css('width', this.scale(100)+"px");
    $('.milops_ussr').css('height', this.scale(100)+"px");
    $('.milops_ussr').css('top', dt_ussr);
    $('.milops_ussr').css('left', dl_ussr);

  }



  updateVictoryPoints() {

    //
    // if VP are outstanding, do not update VP and trigger end
    //
    if (this.game.state.vp_outstanding != 0) { return; }

    let dt = 0;
    let dl = 0;

    if (this.game.state.vp <= -20) {
      dt = this.game.state.vp_ps[0].top;
      dl = this.game.state.vp_ps[0].left;
    }
    if (this.game.state.vp == -19) {
      dt = this.game.state.vp_ps[1].top;
      dl = this.game.state.vp_ps[1].left;
    }
    if (this.game.state.vp == -18) {
      dt = this.game.state.vp_ps[2].top;
      dl = this.game.state.vp_ps[2].left;
    }
    if (this.game.state.vp == -17) {
      dt = this.game.state.vp_ps[3].top;
      dl = this.game.state.vp_ps[3].left;
    }
    if (this.game.state.vp == -16) {
      dt = this.game.state.vp_ps[4].top;
      dl = this.game.state.vp_ps[4].left;
    }
    if (this.game.state.vp == -15) {
      dt = this.game.state.vp_ps[5].top;
      dl = this.game.state.vp_ps[5].left;
    }
    if (this.game.state.vp == -14) {
      dt = this.game.state.vp_ps[6].top;
      dl = this.game.state.vp_ps[6].left;
    }
    if (this.game.state.vp == -13) {
      dt = this.game.state.vp_ps[7].top;
      dl = this.game.state.vp_ps[7].left;
    }
    if (this.game.state.vp == -12) {
      dt = this.game.state.vp_ps[8].top;
      dl = this.game.state.vp_ps[8].left;
    }
    if (this.game.state.vp == -11) {
      dt = this.game.state.vp_ps[9].top;
      dl = this.game.state.vp_ps[9].left;
    }
    if (this.game.state.vp == -10) {
      dt = this.game.state.vp_ps[10].top;
      dl = this.game.state.vp_ps[10].left;
    }
    if (this.game.state.vp == -9) {
      dt = this.game.state.vp_ps[11].top;
      dl = this.game.state.vp_ps[11].left;
    }
    if (this.game.state.vp == -8) {
      dt = this.game.state.vp_ps[12].top;
      dl = this.game.state.vp_ps[12].left;
    }
    if (this.game.state.vp == -7) {
      dt = this.game.state.vp_ps[13].top;
      dl = this.game.state.vp_ps[13].left;
    }
    if (this.game.state.vp == -6) {
      dt = this.game.state.vp_ps[14].top;
      dl = this.game.state.vp_ps[14].left;
    }
    if (this.game.state.vp == -5) {
      dt = this.game.state.vp_ps[15].top;
      dl = this.game.state.vp_ps[15].left;
    }
    if (this.game.state.vp == -4) {
      dt = this.game.state.vp_ps[16].top;
      dl = this.game.state.vp_ps[16].left;
    }
    if (this.game.state.vp == -3) {
      dt = this.game.state.vp_ps[17].top;
      dl = this.game.state.vp_ps[17].left;
    }
    if (this.game.state.vp == -2) {
      dt = this.game.state.vp_ps[18].top;
      dl = this.game.state.vp_ps[18].left;
    }
    if (this.game.state.vp == -1) {
      dt = this.game.state.vp_ps[19].top;
      dl = this.game.state.vp_ps[19].left;
    }
    if (this.game.state.vp == 0) {
      dt = this.game.state.vp_ps[20].top;
      dl = this.game.state.vp_ps[20].left;
    }
    if (this.game.state.vp == 1) {
      dt = this.game.state.vp_ps[21].top;
      dl = this.game.state.vp_ps[21].left;
    }
    if (this.game.state.vp == 2) {
      dt = this.game.state.vp_ps[22].top;
      dl = this.game.state.vp_ps[22].left;
    }
    if (this.game.state.vp == 3) {
      dt = this.game.state.vp_ps[23].top;
      dl = this.game.state.vp_ps[23].left;
    }
    if (this.game.state.vp == 4) {
      dt = this.game.state.vp_ps[24].top;
      dl = this.game.state.vp_ps[24].left;
    }
    if (this.game.state.vp == 5) {
      dt = this.game.state.vp_ps[25].top;
      dl = this.game.state.vp_ps[25].left;
    }
    if (this.game.state.vp == 6) {
      dt = this.game.state.vp_ps[26].top;
      dl = this.game.state.vp_ps[26].left;
    }
    if (this.game.state.vp == 7) {
      dt = this.game.state.vp_ps[27].top;
      dl = this.game.state.vp_ps[27].left;
    }
    if (this.game.state.vp == 8) {
      dt = this.game.state.vp_ps[28].top;
      dl = this.game.state.vp_ps[28].left;
    }
    if (this.game.state.vp == 9) {
      dt = this.game.state.vp_ps[29].top;
      dl = this.game.state.vp_ps[29].left;
    }
    if (this.game.state.vp == 10) {
      dt = this.game.state.vp_ps[30].top;
      dl = this.game.state.vp_ps[30].left;
    }
    if (this.game.state.vp == 11) {
      dt = this.game.state.vp_ps[31].top;
      dl = this.game.state.vp_ps[31].left;
    }
    if (this.game.state.vp == 12) {
      dt = this.game.state.vp_ps[32].top;
      dl = this.game.state.vp_ps[32].left;
    }
    if (this.game.state.vp == 13) {
      dt = this.game.state.vp_ps[33].top;
      dl = this.game.state.vp_ps[33].left;
    }
    if (this.game.state.vp == 14) {
      dt = this.game.state.vp_ps[34].top;
      dl = this.game.state.vp_ps[34].left;
    }
    if (this.game.state.vp == 15) {
      dt = this.game.state.vp_ps[35].top;
      dl = this.game.state.vp_ps[35].left;
    }
    if (this.game.state.vp == 16) {
      dt = this.game.state.vp_ps[36].top;
      dl = this.game.state.vp_ps[36].left;
    }
    if (this.game.state.vp == 17) {
      dt = this.game.state.vp_ps[37].top;
      dl = this.game.state.vp_ps[37].left;
    }
    if (this.game.state.vp == 18) {
      dt = this.game.state.vp_ps[38].top;
      dl = this.game.state.vp_ps[38].left;
    }
    if (this.game.state.vp == 19) {
      dt = this.game.state.vp_ps[39].top;
      dl = this.game.state.vp_ps[39].left;
    }
    if (this.game.state.vp >= 20) {
      dt = this.game.state.vp_ps[40].top;
      dl = this.game.state.vp_ps[40].left;
    }


    if (this.app.BROWSER == 1) {

      if (this.game.state.vp > 19) {
        this.endGame("us", "victory point track");
      }
      if (this.game.state.vp < -19) {
        this.endGame("ussr", "victory point track");
      }

      dt = this.scale(dt);
      dl = this.scale(dl);

      dt = dt + "px";
      dl = dl + "px";

      $('.vp').css('width', this.scale(120)+"px");
      $('.vp').css('height', this.scale(120)+"px");
      $('.vp').css('top', dt);
      $('.vp').css('left', dl);
    }
  }







  mobileCardSelect(card, player, mycallback, prompttext="play") {

    let twilight_self = this;

    twilight_self.hideCard();
    twilight_self.showPlayableCard(card);

    $('.cardbox_menu_playcard').html(prompttext);
    $('.cardbox_menu_playcard').css('display','block');
    $('.cardbox_menu_playcard').off();
    $('.cardbox_menu_playcard').on('click', function () {
      $('.cardbox_menu').css('display','none');
      twilight_self.hideCard();
      mycallback();
      $(this).hide();
      $('.cardbox-exit').hide();
    });
    $('.cardbox-exit').off();
    $('.cardbox-exit').on('click', function () {
      twilight_self.hideCard();
      $('.cardbox_menu_playcard').css('display','none');
      $(this).css('display', 'none');
    });

  }

  returnCardImage(cardname, hud=0) {

    let cardclass = "cardimg";
    if (hud == 1) { cardclass = "cardimg-hud"; }

    var c = this.game.deck[0].cards[cardname];
    if (c == undefined) { c = this.game.deck[0].discards[cardname]; }
    if (c == undefined) { c = this.game.deck[0].removed[cardname]; }
    if (c == undefined) {

      //
      // this is not a card, it is something like "skip turn" or cancel
      //
      return '<div class="noncard">'+cardname+'</div>';

    }

    var html = `<img class="${cardclass}" src="/twilight/img/${this.lang}/${c.img}.svg" />`;

    //
    // cards can be generated with http://www.invadethree.space/tscardgen/
    // as long as they have the string "png" included in the name they will
    // be treated as fully formed (i.e. not SVG files). The convention is to
    // name these cards starting at 201 in order to avoid conflict with other
    // cards that may be released officially.
    //
    if (c.img.indexOf("png") > -1) {
        html = `<img class="${cardclass}" src="/twilight/img/${this.lang}/${c.img}.png" />`;
    } else {
        if (c.p == 0) { html += `<img class="${cardclass}" src="/twilight/img/EarlyWar.svg" />`; }
        if (c.p == 1) { html += `<img class="${cardclass}" src="/twilight/img/MidWar.svg" />`; }
        if (c.p == 2) { html += `<img class="${cardclass}" src="/twilight/img/LateWar.svg" />`; }

      switch (c.player) {
        case "both":
          html += `<img class="${cardclass}" src="/twilight/img/BothPlayerCard.svg" />`;
          if (c.ops) {
            html += `<img class="${cardclass}" src="/twilight/img/White${c.ops}.svg" />`;
            html += `<img class="${cardclass}" src="/twilight/img/Black${c.ops}.svg" />`;
          }
          break;
        case "us":
          html += `<img class="${cardclass}" src="/twilight/img/AmericanPlayerCard.svg" />`;
          if (c.ops) { html += `<img class="${cardclass}" src="/twilight/img/Black${c.ops}.svg" />`; }
          break;
        case "ussr":
          html += `<img class="${cardclass}" src="/twilight/img/SovietPlayerCard.svg" />`;
          if (c.ops) { html += `<img class="${cardclass}" src="/twilight/img/White${c.ops}.svg" />`; }
          break;
        default:
          break;
      }
    }

    if (c.scoring == 1) {
      html +=`<img class="${cardclass}" src="/twilight/img/MayNotBeHeld.svg" />`;
    } else if (c.recurring == 0) {
      if (c.img.indexOf("png") > -1) {} else {
        html += `<img class="${cardclass}" src="/twilight/img/RemoveFromPlay.svg" />`;
      }
    }

    return html
  }

  showCard(cardname) {
    let card_html = this.returnCardImage(cardname);
    let cardbox_html = this.app.browser.isMobileBrowser(navigator.userAgent) ?
      `${card_html}
        <div id="cardbox-exit-background">
          <div class="cardbox-exit" id="cardbox-exit">×</div>
        </div>` : card_html;

    $('#cardbox').html(cardbox_html);
    $('#cardbox').show();
  }

  showPlayableCard(cardname) {
    let card_html = this.returnCardImage(cardname);
    let cardbox_html = this.app.browser.isMobileBrowser(navigator.userAgent) ?
      `${card_html}
      <div id="cardbox-exit-background">
        <div class="cardbox-exit" id="cardbox-exit">×</div>
      </div>
      <div class="cardbox_menu_playcard cardbox_menu_btn" id="cardbox_menu_playcard">
        PLAY
      </div>` : card_html;

    $('#cardbox').html(cardbox_html);
    $('#cardbox').show();
  }

  hideCard() {
    this.cardbox.hideCardbox(1);
    //$('#cardbox').hide();
    //$('.cardbox_event_blocker').css('height','0px');
    //$('.cardbox_event_blocker').css('width','0px');
    //$('.cardbox_event_blocker').css('display','none');
  }




  returnGameOptionsHTML() {

    return `

      <div style="padding:40px;width:100vw;height:100vh;overflow-y:scroll;display:grid;grid-template-columns: 200px auto">

	<div style="top:0;left:0;">

            <label for="player1">Play as:</label>
            <select name="player1">
              <option value="random" selected>random</option>
              <option value="ussr">USSR</option>
              <option value="us">US</option>
            </select>

            <label for="deck">Deck:</label>
            <select name="deck" id="deckselect" onchange='
	      if ($("#deckselect").val() == "saito") { 
		$(".saito_edition").prop("checked",true); 
		$(".endofhistory_edition").prop("checked", false); 
	      } else { 
		$(".saito_edition").prop("checked", false); 
	        if ($("#deckselect").val() == "optional") { 
		  $(".optional_edition").prop("checked", false); 
	 	} else { 
		  $(".optional_edition").prop("checked", true); 
		  if ($("#deckselect").val() == "endofhistory") { 
alert("end of history!");
		    $(".endofhistory_edition").prop("checked",true); 
		    $(".optional_edition").prop("checked", false);
		  } else {
		    if ($("#deckselect").val() == "coldwarcrazies") { 
		      $(".coldwarcrazies_edition").prop("checked",true); 
		      $(".optional_edition").prop("checked", false);
		    } else {
		      if ($("#deckselect").val() == "absurdum") { 
		        $(".absurdum_edition").prop("checked",true); 
		        $(".optional_edition").prop("checked",true);
		      }
		    }
		  }
		}
	      } '>
            <option value="original">original</option>
              <option value="optional" selected>optional</option>
              <option value="saito">saito edition</option>
              <option value="absurdum">twilight absurdum</option>
              <option value="endofhistory">end of history</option>
              <option value="coldwarcrazies">cold war crazies</option>
            </select>

            <label for="usbonus">US bonus: </label>
            <select name="usbonus">
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2" selected>2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>

            <label for="clock">Player Time Limit:</label>
            <select name="clock">
              <option value="0" default>no limit</option>
              <option value="10">10 minutes</option>
              <option value="20">20 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">60 minutes</option>
              <option value="90">90 minutes</option>
              <option value="120">120 minutes</option>
            </select>

            <label for="observer_mode">Observer Mode:</label>
            <select name="observer">
              <option value="enable" selected>enable</option>
              <option value="disable">disable</option>
            </select>

	    <div id="game-wizard-advanced-return-btn" class="game-wizard-advanced-return-btn button" style="margin-top:20px;padding:30px;text-align:center">accept</div>

	</div>

            <div id="game-wizard-advanced-box" class="game-wizard-advanced-box" style="display:block;padding-left:20px;">

	      <style type="text/css">li { list-style: none; } .saito-select { margin-bottom: 10px; margin-top:5px; } label { text-transform: uppercase; } .removecards { grid-gap: 0.1em; } .list-header { font-weight: bold; font-size:1.5em; margin-top:0px; margin-bottom:10px; margin-left: 15px; text-transform: uppercase; } </style>
              <div class="list-header">remove cards:</div>
              <ul id="removecards" class="removecards">
              <li><input class="remove_card" type="checkbox" name="asia" /> Asia Scoring</li>
              <li><input class="remove_card" type="checkbox" name="europe" /> Europe Scoring</li>
              <li><input class="remove_card" type="checkbox" name="mideast" /> Middle-East Scoring</li>
              <li><input class="remove_card" type="checkbox" name="duckandcover" /> Duck and Cover</li>
              <li><input class="remove_card" type="checkbox" name="fiveyearplan" /> Five Year Plan</li>
              <li><input class="remove_card" type="checkbox" name="socgov" /> Socialist Governments</li>
              <li><input class="remove_card" type="checkbox" name="fidel" /> Fidel</li>
              <li><input class="remove_card" type="checkbox" name="vietnamrevolts" /> Vietnam Revolts</li>
              <li><input class="remove_card" type="checkbox" name="blockade" /> Blockade</li>
              <li><input class="remove_card" type="checkbox" name="koreanwar" /> Korean War</li>
              <li><input class="remove_card" type="checkbox" name="romanianab" /> Romanian Abdication</li>
              <li><input class="remove_card" type="checkbox" name="arabisraeli" /> Arab Israeli War</li>
              <li><input class="remove_card" type="checkbox" name="comecon" /> Comecon</li>
              <li><input class="remove_card" type="checkbox" name="nasser" /> Nasser</li>
              <li><input class="remove_card" type="checkbox" name="warsawpact" /> Warsaw Pact</li>
              <li><input class="remove_card" type="checkbox" name="degaulle" /> De Gaulle Leads France</li>
              <li><input class="remove_card" type="checkbox" name="naziscientist" /> Nazi Scientists Captured</li>
              <li><input class="remove_card" type="checkbox" name="truman" /> Truman</li>
              <li><input class="remove_card saito_edition" type="checkbox" name="olympic" /> Olympic Games</li>
              <li><input class="remove_card" type="checkbox" name="nato" /> NATO</li>
              <li><input class="remove_card" type="checkbox" name="indreds" /> Independent Reds</li>
              <li><input class="remove_card" type="checkbox" name="marshall" /> Marshall Plan</li>
              <li><input class="remove_card" type="checkbox" name="indopaki" /> Indo-Pakistani War</li>
              <li><input class="remove_card" type="checkbox" name="containment" /> Containment</li>
              <li><input class="remove_card" type="checkbox" name="cia" /> CIA Created</li>
              <li><input class="remove_card" type="checkbox" name="usjapan" /> US/Japan Defense Pact</li>
              <li><input class="remove_card" type="checkbox" name="suezcrisis" /> Suez Crisis</li>
              <li><input class="remove_card" type="checkbox" name="easteuropean" /> East European Unrest</li>
              <li><input class="remove_card" type="checkbox" name="decolonization" /> Decolonization</li>
              <li><input class="remove_card" type="checkbox" name="redscare" /> Red Scare</li>
              <li><input class="remove_card" type="checkbox" name="unintervention" /> UN Intervention</li>
              <li><input class="remove_card" type="checkbox" name="destalinization" /> Destalinization</li>
              <li><input class="remove_card" type="checkbox" name="nucleartestban" /> Nuclear Test Ban Treaty</li>
              <li><input class="remove_card" type="checkbox" name="formosan" /> Formosan Resolution</li>
              <li><input class="remove_card optional_edition" type="checkbox" name="defectors" /> Defectors</li>
              <li><input class="remove_card optional_edition " type="checkbox" name="specialrelation" /> Special Relationship</li>
              <li><input class="remove_card optional_edition" type="checkbox" name="cambridge" /> The Cambridge Five</li>
              <li><input class="remove_card optional_edition" type="checkbox" name="norad" /> NORAD</li>
            </ul>
            <ul class="removecards" style="clear:both;margin-top:13px">
              <li><input class="remove_card" type="checkbox" name="brushwar" /> Brush War</li>
              <li><input class="remove_card" type="checkbox" name="centralamerica" /> Central America Scoring</li>
              <li><input class="remove_card" type="checkbox" name="seasia" /> Southeast Asia Scoring</li>
              <li><input class="remove_card" type="checkbox" name="armsrace" /> Arms Race</li>
              <li><input class="remove_card" type="checkbox" name="cubanmissile" /> Cuban Missile Crisis</li>
              <li><input class="remove_card" type="checkbox" name="nuclearsubs" /> Nuclear Subs</li>
              <li><input class="remove_card" type="checkbox" name="quagmire" /> Quagmire</li>
              <li><input class="remove_card" type="checkbox" name="saltnegotiations" /> Salt Negotiations</li>
              <li><input class="remove_card" type="checkbox" name="beartrap" /> Bear Trap</li>
              <li><input class="remove_card saito_edition" type="checkbox" name="summit" /> Summit</li>
              <li><input class="remove_card" type="checkbox" name="howilearned" /> How I Learned to Stop Worrying</li>
              <li><input class="remove_card" type="checkbox" name="junta" /> Junta</li>
              <li><input class="remove_card" type="checkbox" name="kitchendebates" /> Kitchen Debates</li>
              <li><input class="remove_card" type="checkbox" name="missileenvy" /> Missile Envy</li>
              <li><input class="remove_card" type="checkbox" name="wwby" /> We Will Bury You</li>
              <li><input class="remove_card" type="checkbox" name="brezhnev" /> Brezhnev Doctrine</li>
              <li><input class="remove_card" type="checkbox" name="portuguese" /> Portuguese Empire Crumbles</li>
              <li><input class="remove_card" type="checkbox" name="southafrican" /> South African Unrest</li>
              <li><input class="remove_card" type="checkbox" name="allende" /> Allende</li>
              <li><input class="remove_card" type="checkbox" name="willybrandt" /> Willy Brandt</li>
              <li><input class="remove_card" type="checkbox" name="muslimrevolution" /> Muslim Revolution</li>
              <li><input class="remove_card" type="checkbox" name="abmtreaty" /> ABM Treaty</li>
              <li><input class="remove_card" type="checkbox" name="culturalrev" /> Cultural Revolution</li>
              <li><input class="remove_card" type="checkbox" name="flowerpower" /> Flower Power</li>
              <li><input class="remove_card" type="checkbox" name="u2" /> U-2 Incident</li>
              <li><input class="remove_card" type="checkbox" name="opec" /> OPEC</li>
              <li><input class="remove_card" type="checkbox" name="lonegunman" /> Lone Gunman</li>
              <li><input class="remove_card" type="checkbox" name="colonial" /> Colonial</li>
              <li><input class="remove_card" type="checkbox" name="panamacanal" /> Panama Canal</li>
              <li><input class="remove_card" type="checkbox" name="campdavid" /> Camp David Accords</li>
              <li><input class="remove_card" type="checkbox" name="puppet" /> Puppet Governments</li>
              <li><input class="remove_card" type="checkbox" name="grainsales" /> Grain Sales to Soviets</li>
              <li><input class="remove_card" type="checkbox" name="johnpaul" /> John Paul</li>
              <li><input class="remove_card" type="checkbox" name="deathsquads" /> Death Squads</li>
              <li><input class="remove_card" type="checkbox" name="oas" /> OAS Founded</li>
              <li><input class="remove_card" type="checkbox" name="nixon" /> Nixon Plays the China Card</li>
              <li><input class="remove_card" type="checkbox" name="sadat" /> Sadat Expels Soviets</li>
              <li><input class="remove_card" type="checkbox" name="shuttle" /> Shuttle Diplomacy</li>
              <li><input class="remove_card" type="checkbox" name="voiceofamerica" /> Voice of America</li>
              <li><input class="remove_card" type="checkbox" name="liberation" /> Liberation Theology</li>
              <li><input class="remove_card" type="checkbox" name="ussuri" /> Ussuri River Skirmish</li>
              <li><input class="remove_card" type="checkbox" name="asknot" /> Ask Not What Your Country Can Do For You</li>
              <li><input class="remove_card" type="checkbox" name="alliance" /> Alliance for Progress</li>
              <li><input class="remove_card" type="checkbox" name="africa" /> Africa Scoring</li>
              <li><input class="remove_card" type="checkbox" name="onesmallstep" /> One Small Step</li>
              <li><input class="remove_card" type="checkbox" name="southamerica" /> South America</li>
              <li><input class="remove_card optional_edition" type="checkbox" name="che" /> Che</li>
              <li><input class="remove_card optional_edition" type="checkbox" name="tehran" /> Our Man in Tehran</li>
            </ul>
            <ul class="removecards" style="clear:both;margin-top:13px">
              <li><input class="remove_card" type="checkbox" name="iranianhostage" /> Iranian Hostage Crisis</li>
              <li><input class="remove_card" type="checkbox" name="ironlady" /> The Iron Lady</li>
              <li><input class="remove_card" type="checkbox" name="reagan" /> Reagan Bombs Libya</li>
              <li><input class="remove_card" type="checkbox" name="starwars" /> Star Wars</li>
              <li><input class="remove_card" type="checkbox" name="northseaoil" /> North Sea Oil</li>
              <li><input class="remove_card" type="checkbox" name="reformer" /> The Reformer</li>
              <li><input class="remove_card" type="checkbox" name="marine" /> Marine Barracks Bombing</li>
              <li><input class="remove_card" type="checkbox" name="KAL007" /> Soviets Shoot Down KAL-007</li>
              <li><input class="remove_card" type="checkbox" name="glasnost" /> Glasnost</li>
              <li><input class="remove_card" type="checkbox" name="ortega" /> Ortega Elected in Nicaragua</li>
              <li><input class="remove_card" type="checkbox" name="terrorism" /> Terrorism</li>
              <li><input class="remove_card" type="checkbox" name="ironcontra" /> Iran Contra Scandal</li>
              <li><input class="remove_card" type="checkbox" name="chernobyl" /> Chernobyl</li>
              <li><input class="remove_card" type="checkbox" name="debtcrisis" /> Latin American Debt Crisis</li>
              <li><input class="remove_card" type="checkbox" name="teardown" /> Tear Down this Wall</li>
              <li><input class="remove_card" type="checkbox" name="evilempire" /> An Evil Empire</li>
              <li><input class="remove_card" type="checkbox" name="aldrichames" /> Aldrich Ames Remix</li>
              <li><input class="remove_card" type="checkbox" name="pershing" /> Pershing II Deployed</li>
              <li><input class="remove_card" type="checkbox" name="wargames" /> Wargames</li>
              <li><input class="remove_card" type="checkbox" name="solidarity" /> Solidarity</li>
              <li><input class="remove_card optional_edition" type="checkbox" name="iraniraq" /> Iran-Iraq War</li>
              <li><input class="remove_card optional_edition" type="checkbox" name="yuri" /> Yuri and Samantha</li>
              <li><input class="remove_card optional_edition" type="checkbox" name="awacs" /> AWACS Sale to Saudis</li>
            </ul>

            <div class="list-header">add cards:</div>
            <ul id="removecards" class="removecards">
              <li><input class="remove_card saito_edition" type="checkbox" name="culturaldiplomacy" /> Cultural Diplomacy (Early-War)</li>
              <li><input class="remove_card saito_edition" type="checkbox" name="handshake" /> Handshake in Space (Mid-War)</li>
              <li><input class="remove_card saito_edition" type="checkbox" name="rustinredsquare" /> Rust Lands in Red Square (Late-War)</li>
              <li><input class="remove_card" type="checkbox" name="gouzenkoaffair" /> Gouzenko Affair (Early-War)</li>
              <li><input class="remove_card" type="checkbox" name="poliovaccine" /> Polio Vaccine (Early-War)</li>
              <li><input class="remove_card saito_edition" type="checkbox" name="berlinagreement" /> 1971 Berlin Agreement (Mid-War)</li>
              <li><input class="remove_card endofhistory_edition" type="checkbox" name="peronism" /> Peronism (Early-War)</li>
              <li><input class="remove_card endofhistory_edition" type="checkbox" name="manwhosavedtheworld" /> The Man Who Saved the World (Mid-War)</li>
              <li><input class="remove_card endofhistory_edition" type="checkbox" name="breakthroughatlopnor" /> Breakthrough at Lop Nor (Mid-War)</li>
              <li><input class="remove_card endofhistory_edition" type="checkbox" name="nationbuilding" /> Nation Building (Mid-War)</li>
              <li><input class="remove_card endofhistory_edition" type="checkbox" name="greatsociety" /> Great Society (Mid-War)</li>
              <li><input class="remove_card endofhistory_edition" type="checkbox" name="perestroika"  /> Perestroika (Late-War)</li>
              <li><input class="remove_card endofhistory_edition" type="checkbox" name="eurocommunism" /> Eurocommunism (Mid-War)</li>
              <li><input class="remove_card endofhistory_edition" type="checkbox" name="inftreaty" /> INF Treaty (Late-War)</li>
              <li><input class="remove_card coldwarcrazies_edition" type="checkbox" name="communistrevolution" /> Communist Revolution (Early-War)</li>
            </div>

      </div>
    </div>
          `;

  }

  settleVPOutstanding() {

    if (this.game.state.vp_outstanding != 0) {
      this.game.state.vp += this.game.state.vp_outstanding;
    }
    this.game.state.vp_outstanding = 0;
    this.updateVictoryPoints();

  }

  addShowCardEvents(onCardClickFunction=null) {
    this.changeable_callback = onCardClickFunction;
    this.hud.attachCardEvents(this.app, this);
  }

  addLogCardEvents() {

    try {
    let twilight_self = this;

    if (!this.app.browser.isMobileBrowser(navigator.userAgent)) {

      $('.logcard').off();
      $('.logcard').mouseover(function() {
        let card = $(this).attr("id");
        twilight_self.showCard(card);
      }).mouseout(function() {
        let card = $(this).attr("id");
        twilight_self.hideCard(card);
      });

    } else {

      $('.logcard').off();
      $('.logcard').on('click', function() {

        let card = $(this).attr("id");

        twilight_self.showCard(card);
        $('.cardbox-exit').off();
        $('.cardbox-exit').on('click', function () {
          twilight_self.hideCard();
          $('.cardbox_menu_playcard').css('display','none');
          $(this).css('display', 'none');
        });
      });

    }
    } catch (err) {}
  }

  returnFormattedGameOptions(options) {
    let new_options = {};
    for (var index in options) {
      if (index == "player1") {
        if (options[index] == "random") {
          new_options[index] = options[index];
        } else {
          new_options[index] = options[index] == "ussr" ? "us" : "ussr";
        }
      } else {
        new_options[index] = options[index]
      }
    }
    return new_options;
  }





  formatStatusHeader(status_header, status_message, include_back_button=false) {
    let back_button_html = `<i class="fa fa-arrow-left" id="back_button"></i>`;
    return `
    <div class="status-header">
      ${include_back_button ? back_button_html : ""}
      <div style="text-align: center;">
        ${status_header}
      </div>
    </div>
    <div class="status-message">
      ${status_message}
    </div>
    `
  }


  displayChinaCard() {

    $('.china_card_status').removeClass('china_card_status_us_facedown');
    $('.china_card_status').removeClass('china_card_status_us_faceup');
    $('.china_card_status').removeClass('china_card_status_ussr_facedown');
    $('.china_card_status').removeClass('china_card_status_ussr_faceup');

    let x = this.whoHasTheChinaCard();

    if (x === "ussr") {
      if (this.game.state.events.china_card_facedown == 0) {
        $('.china_card_status').addClass('china_card_status_ussr_faceup');
      } else {
        $('.china_card_status').addClass('china_card_status_ussr_facedown');
      }
    } else {
      if (this.game.state.events.china_card_facedown == 0) {
        $('.china_card_status').addClass('china_card_status_us_faceup');
      } else {
        $('.china_card_status').addClass('china_card_status_us_facedown');
      }
    }

  }




  /////////////////
  // Play Events //
  /////////////////
  //
  // the point of this function is either to execute events directly
  // or permit the relevant player to translate them into actions
  // that can be directly executed by UPDATE BOARD.
  //
  // this function returns 1 if we can continue, or 0 if we cannot
  // in the handleGame loop managing the events / turns that are
  // queued up to go.
  //
  playEvent(player, card) {

    if (this.game.deck[0].cards[card] != undefined) {
      this.updateStatus("<div class='status-message' id='status-message'><span>Playing event:</span> <span>" + this.game.deck[0].cards[card].name + "</span></div>");
    } else {
      //
      // event already run - sync loading error
      //
      console.log("sync loading error -- playEvent on card: " + card);
      return 1;
    }



