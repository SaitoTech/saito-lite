const GameTemplate = require('../../lib/templates/gametemplate');
  
  
  
//////////////////
// CONSTRUCTOR  //
//////////////////
class Pandemic extends GameTemplate {
  
  constructor(app) {
  
    super(app);
  
    this.name            = "Pandemic";
    this.description     = `Pandemic is a cooperative multiplayer board game in which players works together to try and fend off a global epidemic.`;
    this.categories      = "Arcade Games Entertainment";

    this.useHUD          = 1;
    this.addHUDMenu      = ['Cards'];
    this.maxPlayers      = 4;
    this.minPlayers      = 2;  
    this.type            = "Cooperative Boardgme";

    this.gameboardWidth  = 2602;
  
    this.moves           = [];
    this.outbreaks       = [];
    this.maxHandSize     = 7;
  
    this.active_moves = 0;		// player active moves
    this.interface = 1;  			// default to graphics
  
    return this;
  
  }
  
  
  
  
  
  triggerHUDMenu(menuitem) {
    switch (menuitem) {
      case "cards":
        this.handleCardsMenuItem();
        break;
    }
  }
  
  
  handleCardsMenuItem() {
  
    let pandemic_self = this;
    let display_message = "";
  
    let html = `<div id="menu-container"><div style="margin-bottom: 1em">Select your deck:</div><ul>`;
    for (let i = 0; i <= this.game.opponents.length; i++) {
      html += `<li class="card" id="${i}">${this.game.players_info[i].role} (${(i+1)} - ${this.game.cities[this.game.players_info[i].city].name})</li>`;
    }
    html += `</ul></div>`
  
    $('.hud_menu_overlay').html(html);
  
    // leave action enabled on other panels
    $('.card').on('click', function() {
  
      let player_chosen = parseInt($(this).attr("id"));
      var deck = pandemic_self.game.players_info[player_chosen].cards;
  
      for (let i = 0; i < deck.length; i++) {
        let city = pandemic_self.game.deck[1].cards[deck[i]];
        display_message += `<div class="cardbox-hud" id="cardbox-hud-${i}"><img src="/pandemic/img/${city.img}" /></div>`;
      }
  
      display_message = `<div class="display-cards">${display_message}</div>`;
      $('.hud_menu_overlay').html(display_message);
  
    });
  
  }
  
  
  
  
  
  
  
  ////////////////
  // initialize //
  ////////////////
  initializeGame(game_id) {
  
    //
    // enable chat
    //
  
    //if (!this.app.browser.isMobileBrowser(navigator.userAgent)) {
    //  const chat = this.app.modules.returnModule("Chat");
    //  chat.addPopUpChat();
    //}
  
    this.updateStatus("loading game...");
    this.loadGame(game_id);
    if (this.game.status != "") { this.updateStatus(this.game.status); }
  
    //
    // new state if needed
    //
    if (this.game.dice == "") {
      this.initializeDice();
    }
    if (this.game.cities == undefined) {
  
      this.game.events    = this.returnEvents();
      this.game.cities    = this.returnCities();
      this.game.state     = this.returnState();
      this.game.players_info   = this.returnPlayers((this.game.players.length));
  
      this.updateStatus("Generating the Game");
  
      //
      // start game once here
      //
      this.game.queue = [];
      this.game.queue.push("round");
  
      this.game.queue.push("initialize_player_deck");
  
      //
      // Deal Player Cards
      //
      let cards_to_deal = 2;
      if (this.game.opponents.length+1 == 3) { cards_to_deal = 3; }
      if (this.game.opponents.length+1 == 2) { cards_to_deal = 4; }
  
      for (let i = 0; i < this.game.opponents.length+1; i++) {
        this.game.queue.push("draw_player_card\t"+(i+1)+"\t"+cards_to_deal);
      }
  
      this.game.queue.push("place_initial_infection");
  
      //
      // Shuffle Infection Cards
      //
      this.game.queue.push("READY");
  
      //
      // Shuffle Player Cards
      //
      let playerCards = this.returnPlayerCards();
      this.game.queue.push("SHUFFLE\t2");
      this.game.queue.push("DECK\t2\t"+JSON.stringify(playerCards));
  
      this.game.queue.push("SHUFFLE\t1");
      this.game.queue.push("DECK\t1\t"+JSON.stringify(this.returnInfectionCards()));
  
    }
  
  
    //
    // display the players
    //
    for (let i = 1; i <= this.game.players_info.length; i++) {
      let divname = ".player"+i+"_role_card";
      let cssvalue = 'url("/pandemic/img/'+this.game.players_info[i-1].card+'")';
      $(divname).css('background-image',cssvalue);
    }
  
  
    //
    // interface
    //
    for (var i in this.game.cities) {
  
      let divname      = '#'+i;
  
      $(divname).css('top', this.scale(this.game.cities[i].top)+"px");
      $(divname).css('left', this.scale(this.game.cities[i].left)+"px");
  
    } 
  
    //
    // restore influence
    //
    this.showBoard();
  
  
    //
    // if the browser is active, shift to the game that way
    //
    if (this.browser_active == 1) {
      let msg = {};
      msg.extra = {};
      msg.extra.target = this.game.target;
      this.handleGameLoop(msg);
    }
  
  }
  
  
  
  
  



  playerTurn() {
  
    let pandemic_self = this;
  
    //
    // reset events
    //
    this.game.state.one_quiet_night = 0;
  
    //
    // next turn
    //
    this.addMove("turn\t"+this.returnNextPlayer(this.game.player));
  
    //
    // infect cities
    //
    this.addMove("infect");
  
    //
    // draw two player cards
    //
    this.addMove("draw_player_card\t"+this.game.player+"\t2");
  
    //
    // discard extra cards
    //
    if (this.game.players_info[this.game.player-1].cards.length > this.maxHandSize) {
      this.playerDiscardCards(function (){
        pandemic_self.playerMakeMove(pandemic_self.game.players_info[pandemic_self.game.player-1].moves);
      });
    } else {
      this.playerMakeMove(this.game.players_info[this.game.player-1].moves);
    }
  
  }
  




  playerDiscardCards(mycallback) {
  
    let pandemic_self = this;
  
    $('.card').off();
    this.updateStatusAndListCards("Pick a card to discard: ");
    $('.card').on('click', function() {
  
      let cid = $(this).attr('id');
  
      //
      // if we click to discard an event card, we can play it instead
      //
      if (cid.indexOf("event") > -1) {
        let c = confirm("Do you want to play this event card instead of discarding it?");
        if (c) {
  	pandemic_self.playEventCard(function () {
            if (pandemic_self.game.players_info[pandemic_self.game.player-1].cards.length > pandemic_self.maxHandSize) {
  	    pandemic_self.playerDiscardCards(mycallback);
  	  } else {
  	    mycallback();
            }
          });
  	return;
        }
      }
  
      pandemic_self.addMove("discard\t"+pandemic_self.game.player+"\t"+cid);
      pandemic_self.removeCardFromHand(pandemic_self.game.player, cid);
      if (pandemic_self.game.players_info[pandemic_self.game.player-1].cards.length <= pandemic_self.maxHandSize) {
        mycallback();
      } else {    
        pandemic_self.playerDiscardCards(mycallback);
      }
    });
  
  }
  



  removeEvents() {
  
    $('.card').off();
    $('.city').off();
  
  }



  playerMakeMove(moves=0) {
  
    let pandemic_self = this;
    let player = this.game.players_info[this.game.player-1];
    let city = player.city;
  
    if (moves == 0) { this.endTurn(); return; }
  
    this.active_moves = moves;
  
    let html  = "You are the " + player.role + " ("+this.game.cities[player.city].name+"). " + moves +' moves remaining. Choose an action:<p></p><ul>';
        html += '<li class="card" id="move">drive / ferry</li>';
        html += '<li class="card" id="flight">direct flight</li>';
    
        if (
  	this.game.players_info[this.game.player-1].cards.includes("event1") ||
  	this.game.players_info[this.game.player-1].cards.includes("event2") ||
  	this.game.players_info[this.game.player-1].cards.includes("event3") ||
  	this.game.players_info[this.game.player-1].cards.includes("event4") ||
  	this.game.players_info[this.game.player-1].cards.includes("event5")) {
          html += '<li class="card" id="eventcard">play event card</li>';
        }
        if (this.game.players_info[this.game.player-1].cards.includes(city)) {
          html += '<li class="card" id="flight">charter flight</li>';
        }
        if (this.game.state.research_stations.length > 1 && this.game.state.research_stations.includes(city)) {
          html += '<li class="card" id="shuttle">shuttle flight</li>';
        }
        if (!this.game.state.research_stations.includes(city) && this.canPlayerBuildResearchStation(city) == 1) {
          html += '<li class="card" id="station">build research station</li>';
        }
        if (this.isCityInfected(city) == 1) {
          html += '<li class="card" id="cure">treat disease</li>';
        }
        if (this.canPlayerDiscoverCure() == 1) {
          html += '<li class="card" id="discover_cure">research cure</li>';
        }
        if (this.canPlayerShareKnowledge() == 1) {
          html += '<li class="card" id="exchange">share knowledge</li>';
        }
        html += '<li class="card" id="pass">pass</li>';
        html += '</ul>';
  
  
    $('.card').off();
    this.updateStatusAndListCards(html);
    $('.card').on('click', function() {
  
      let action = $(this).attr('id');
  
      if (action === "eventcard") {
        pandemic_self.playEventCard();
      }
      if (action === "move") {
        pandemic_self.movePlayer();
      }
      if (action === "cure") {
        pandemic_self.cureDisease();
      }
      if (action === "discover_cure") {
        pandemic_self.discoverCure();
      }
      if (action === "station") {
        pandemic_self.buildResearchStation();
      }
      if (action === "flight") {
        pandemic_self.directFlight();
      }
      if (action === "shuttle") {
        pandemic_self.shuttleFlight();
      }
      if (action === "pass") {
        pandemic_self.endTurn();
        return 0;
      }
      if (action === "exchange") {
        pandemic_self.shareKnowledge();
        return 0;
      }
  
    });
  
  }
  




  shareKnowledge() {
  
    let pandemic_self = this;
    let player = this.game.players_info[this.game.player-1];
    let city = player.city;
    let players_in_city = 0;
  
    let exchange_mode = 0; // 1 = giving card
  			 // 0 = taking card
  
    //
    // do I have this card?
    //
    for (let i = 0; i < player.cards; i++) {
      if (player.cards[i] == city) {
        exchange_mode = 1;
      }
    }
  
    //
    // if I do not -- I am taking the card
    //
    if (exchange_mode == 0) {    
      this.addMove("takecard\t"+this.game.player+"\t"+this.game.player+"\t"+city);
      this.game.players_info[this.game.player-1].cards.push(city);
      pandemic_self.active_moves--;
      if (pandemic_self.active_moves == 0) {
        pandemic_self.endTurn();
      } else {
        pandemic_self.playerMakeMove(pandemic_self.active_moves);
      }
    }
  
    //
    // if I do -- I am giving the card
    //
    if (exchange_mode == 1) {
  
      let html = 'Give card to whom? <p></p><ul>';
      for (let i = 0; i < this.game.players_info.length; i++) {
        if (this.game.players_info[i].city == city && i != (this.game.player-1)) { 
          html += '<li class="card" id="'+(i+1)+'">Player '+(i+1)+'</li>';
        }
      }
      html += '</ul>';
      this.updateStatus(html);
  
      $('.card').off();
      $('.card').on('click', function() {
  
        let id = $(this).attr("id");
  
        let player_to_receive = parseInt(id)-1;
        this.addMove("takecard\t"+this.game.player+"\t"+player_to_receive+"\t"+city);
  
        pandemic_self.active_moves--;
        if (pandemic_self.active_moves == 0) {
          pandemic_self.endTurn();
        } else {
          pandemic_self.playerMakeMove(pandemic_self.active_moves);
        }
  
      });
  
    }
  
    return;
  
  }






  canPlayerShareKnowledge() {
  
    let player = this.game.players_info[this.game.player-1];
    let city = player.city;
  
    //
    // does anyone have this card?
    //
    let has_city_card = 0;
  
    for (let i = 0; i < this.game.players_info.length; i++) {
      for (let k = 0; k < this.game.players_info[i].cards.length; k++) {
        if (this.game.players_info[i].cards[k] == city) {
  	has_city_card = 1;
        }
      }
    }
  
    if (has_city_card == 0) { return 0; }
  
    //
    // are two people in the same city?
    //
    players_in_city = 0;
    for (let i = 0; i < this.game.players_info.length; i++) {
      if (this.game.players_info[i].city == city) { players_in_city++; }
    }
  
    if (players_in_city >= 2) { return 1; }
  
    return 0;
  
  }
  canPlayerDiscoverCure() {
  
    let cards = this.game.players_info[this.game.player-1].cards;
    let city  = this.game.players_info[this.game.player-1].city;
  
    if (!this.game.state.research_stations.includes(city)) {
      return 0;
    }
  
    let blue = 0;
    let yellow = 0;
    let red = 0;
    let black = 0;
  
    let research_limit = 5;
    if (this.game.players_info[this.game.player-1].type == 2) { research_limit = 4; }
  
    for (let i = 0; i < cards.length; i++) {
      if (this.game.deck[0].cards[cards[i]] != undefined) {
        if (this.game.deck[0].cards[cards[i]].virus == "yellow") { yellow++; }
        if (this.game.deck[0].cards[cards[i]].virus == "red") { red++; }
        if (this.game.deck[0].cards[cards[i]].virus == "black") { black++; }
        if (this.game.deck[0].cards[cards[i]].virus == "blue") { blue++; }
      }
    }
  
    if (yellow >= research_limit && this.game.state.yellow_cure == 0) { return 1; }
    if (blue >= research_limit && this.game.state.blue_cure == 0) { return 1; }
    if (black >= research_limit && this.game.state.black_cure == 0) { return 1; }
    if (red >= research_limit && this.game.state.red_cure == 0) { return 1; }
  
    return 0;
  
  }
  playEventCard(mycallback=null) {
  
    let cards = this.game.players_info[this.game.player-1].cards;
    let pandemic_self = this;
  
    let html = 'Play an event card: <p></p><ul>';
  
    for (let i = 0; i < cards.length; i++) {
      if (cards[i] == "event1" || cards[i] == "event2" || cards[i] == "event3" || cards[i] == "event4" || cards[i] == "event5") {
        html += '<li id="'+cards[i]+'" class="card">'+this.game.deck[1].cards[cards[i]].name+'</li>';
      }
    }
    html += '</ul>';
  
    this.updateStatus(html);
  
    $('.card').off();
    $('.card').on('click', function() {
  
      let id = $(this).attr("id");
  
      pandemic_self.addMove("discard\t"+pandemic_self.game.player+"\t"+id);
      pandemic_self.removeCardFromHand(pandemic_self.game.player, id);
  
      //
      // AIRLIFT
      //
      if (id == "event1") {
  
        html = 'Pick a pawn to move to another city: <p></p><ul>';
        for (let i = 0; i < pandemic_self.game.players_info.length; i++) {
  	html += '<li id="'+(i+1)+'" class="card">Player '+(i+1)+' ('+pandemic_self.game.players_info[i].role+')</li>'
        }
        html += '</ul>';
        pandemic_self.updateStatus(html);
  
        $('.card').off();
        $('.card').on('click', function() {
  
  	let player_to_move = $(this).attr('id');
  	let cities_array = [];
  
          html = 'Move to which city: <p></p><ul>';
          for (let key in pandemic_self.game.cities) {
    	  cities_array.push(key);
          }
  	cities_array.sort();
  
          for (let i = 0; i < cities_array.length; i++) {
    	  html += '<li id="'+cities_array[i]+'" class="card">'+pandemic_self.game.cities[cities_array[i]].name+'</li>'
          }
          html += '</ul>';
  
          pandemic_self.updateStatus(html);
  
          $('.card').off();
          $('.card').on('click', function() {
  
    	  let city_destination = $(this).attr('id');
  
            pandemic_self.game.players_info[pandemic_self.game.player-1].city = city_destination;
            pandemic_self.showBoard();
  	  pandemic_self.addMove("move\t"+player_to_move+"\t"+city_destination);
  	  if (mycallback == null) {
              if (pandemic_self.active_moves == 0) {
                pandemic_self.endTurn();
              } else {
                pandemic_self.playerMakeMove(pandemic_self.active_moves);
              }
  	  } else {
  	    mycallback();
  	  }
  	});
        });
      }
  
  
      //
      // RESILIENT POPULATION
      //
      if (id == "event2") {
  
        pandemic_self.game.state.infection_drawn.sort();
  
        html = 'Resilient Population: remove a card from the infection discard pile <p></p><ul>';
        for (let i = 0; i < pandemic_self.game.state.infection_drawn.length; i++) {
          html += '<li class="card" id="'+pandemic_self.game.state.infection_drawn[i]+'">'+pandemic_self.game.cities[pandemic_self.game.state.infection_drawn[i]].name+'</li>';
        }
        html += '</ul>';
  
        pandemic_self.updateStatus(html);
  
        $('.card').off();
        $('.card').on('click', function() {
  
  	let id = $(this).attr("id");
  
  	pandemic_self.addMove("resilientpopulation\t"+id);
  	if (mycallback == null) {
            if (pandemic_self.active_moves == 0) {
              pandemic_self.endTurn();
            } else {
              pandemic_self.playerMakeMove(pandemic_self.active_moves);
            }
          } else {
    	  mycallback();
  	}
        });
  
      }
  
  
      //
      // ONE QUIET NIGHT
      //
      if (id == "event3") {
  
        pandemic_self.updateLog("One Quiet Night: skipping the next infection stage.");
        pandemic_self.game.state.one_quiet_night = 1;
        pandemic_self.addMove("onequietnight");
        if (mycallback == null) {
          if (pandemic_self.active_moves == 0) {
            pandemic_self.endTurn();
          } else {
            pandemic_self.playerMakeMove(pandemic_self.active_moves);
          }
        } else {
          mycallback();
        }
      }
  
  
      //
      // FORECAST
      //
      if (id == "event4") {
  
        let forecast = [];
        let forecast2 = [];
        for (let i = 0; i < 6; i++) {
  	forecast.push(pandemic_self.app.crypto.hexToString(pandemic_self.game.deck[0].crypt[i]));
        }
  
        let html = 'These are the top six cards of the infection pile. Put them back on the pile one-by-one: <p></p><ul>';
        for (let i = 0; i < forecast.length; i++) {
  	html += '<li id="'+forecast[i]+'" class="card">'+pandemic_self.game.cities[forecast[i]].name+'</li>';
        }
        html += '</ul>';
  
        pandemic_self.updateStatus(html);
  
        $('.card').off();
        $('.card').on('click', function() {
  
  	let x = $(this).attr("id");
  
  	forecast2.push(x);
  	$(this).remove();
  
  	//
  	// when done, refresh
  	//
  	if (forecast2.length == 6) {
  	  let y = "forecast\t6\t";
  	      y += forecast2[5];
  	      y += "\t";
  	      y += forecast2[4];
  	      y += "\t";
  	      y += forecast2[3];
  	      y += "\t";
  	      y += forecast2[2];
  	      y += "\t";
  	      y += forecast2[1];
  	      y += "\t";
  	      y += forecast2[0];
  	  pandemic_self.addMove(y);
  	  if (mycallback == null) {
              if (pandemic_self.active_moves == 0) {
                pandemic_self.endTurn();
              } else {
                pandemic_self.playerMakeMove(pandemic_self.active_moves);
              }
  	  } else {
  	    mycallback();
  	  }
  	}
  
        });
  
      }
  
      //
      // GOVERNMENT GRANT
      //
      if (id == "event5") {
  
        let cities_array = [];
  
        html = 'Pick a city for a free research station: <p></p><ul>';
        for (let key in pandemic_self.game.cities) {
  	cities_array.push(key);
        }
        cities_array.sort();
  
        for (let i = 0; i < cities_array.length; i++) {
  	if (!pandemic_self.game.state.research_stations.includes(cities_array[i])) {
            html += '<li id="'+cities_array[i]+'" class="card">'+pandemic_self.game.cities[cities_array[i]].name+'</li>'
  	}
        }
        html += '</ul>';
  
        pandemic_self.updateStatus(html);
  
        $('.card').off();
        $('.card').on('click', function() {
  
  	let city_for_station = $(this).attr('id');
  
          if (pandemic_self.game.state.research_stations.length == 6) {
            pandemic_self.game.state.research_stations[0] = pandemic_self.game.state.research_stations[1];
            pandemic_self.game.state.research_stations[1] = pandemic_self.game.state.research_stations[2];
            pandemic_self.game.state.research_stations[2] = pandemic_self.game.state.research_stations[3];
            pandemic_self.game.state.research_stations[3] = pandemic_self.game.state.research_stations[4];
            pandemic_self.game.state.research_stations[4] = pandemic_self.game.state.research_stations[5];
            pandemic_self.game.state.research_stations[5] = city_for_station;
          } else {
            pandemic_self.game.state.research_stations[pandemic_self.game.state.research_stations.length] = city_for_station;
          }
  
          pandemic_self.addMove("buildresearchstation\t"+pandemic_self.game.player+"\t"+city_for_station);
          pandemic_self.showBoard();
  	if (mycallback == null) {
            if (pandemic_self.active_moves == 0) {
              pandemic_self.endTurn();
            } else {
              pandemic_self.playerMakeMove(pandemic_self.active_moves);
            }
  	} else {
            mycallback();
  	}
        });
  
  
      }
  
      return;
    });
  
  }
  discoverCure() {
  
    let cards = this.game.players_info[this.game.player-1].cards;
    let pandemic_self = this;
  
    let blue = 0;
    let yellow = 0;
    let red = 0;
    let black = 0;
  
    let research_limit = 5;
    if (this.game.players_info[this.game.player-1].type == 2) { research_limit = 4; }
  
    for (let i = 0; i < cards.length; i++) {
      if (this.game.deck[0].cards[cards[i]] != undefined) {
        if (this.game.deck[0].cards[cards[i]].virus == "yellow") { yellow++; }
        if (this.game.deck[0].cards[cards[i]].virus == "red") { red++; }
        if (this.game.deck[0].cards[cards[i]].virus == "black") { black++; }
        if (this.game.deck[0].cards[cards[i]].virus == "blue") { blue++; }
      }
    }
  
    let html = 'Research Cure: <p></p><ul>';
  
    if (yellow >= research_limit && this.game.state.yellow_cure == 0) { html += '<li id="yellow" class="card">yellow</li>'; }
    if (blue >= research_limit && this.game.state.blue_cure == 0) { html += '<li id="blue" class="card">blue</li>'; }
    if (black >= research_limit && this.game.state.black_cure == 0) { html += '<li id="black" class="card">black</li>'; }
    if (red >= research_limit && this.game.state.red_cure == 0) { html += '<li id="red" class="card">red</li>'; }
    html += '</ul>';
  
    this.updateStatus(html);
  
    $('.card').off();
    $('.card').on('click', function() {
  
      let reesarch_limit = 5;
      if (pandemic_self.game.players_info[pandemic_self.game.player-1].type == 2) { research_limit = 4; }
  
      let c = $(this).attr('id');
  
      let cards = pandemic_self.game.players_info[pandemic_self.game.player-1].cards;
      
      for (let i = 0, k = 0; k < research_limit && i < cards.length; i++) {
        if (pandemic_self.game.deck[0].cards[cards[i]] != undefined) {
          if (pandemic_self.game.deck[0].cards[cards[i]].virus == c) {
            pandemic_self.addMove("discard\t"+pandemic_self.game.player+"\t"+cards[i]);
  	  cards.splice(i, 1);
  	  i--;
  	  k++;
          }
        }
      }
  
      if (c == "yellow") { pandemic_self.game.state.yellow_cure = 1; }
      if (c == "red") { pandemic_self.game.state.red_cure = 1; }
      if (c == "blue") { pandemic_self.game.state.blue_cure = 1; }
      if (c == "black") { pandemic_self.game.state.black_cure = 1; }
  
      if (pandemic_self.game.state.yellow_cure == 1 && pandemic_self.game.state.red_cure == 1 && pandemic_self.game.state.blue_cure == 1 && pandemic_self.game.state.black_cure == 1) {
        pandemic_self.endGame("You win: all diseases cured");
        return;
      }
  
  
      pandemic_self.addMove("curevirus\t"+pandemic_self.game.player+"\t"+c);
  
      pandemic_self.showBoard();
  
      pandemic_self.active_moves--;
      if (pandemic_self.active_moves == 0) {
        pandemic_self.endTurn();
      } else {
        pandemic_self.playerMakeMove(pandemic_self.active_moves);
      }
  
    });
  
  }
  isCityInfected(city) {
  
    if (this.game.cities[city].virus.blue > 0) { return 1; }
    if (this.game.cities[city].virus.black > 0) { return 1; }
    if (this.game.cities[city].virus.red > 0) { return 1; }
    if (this.game.cities[city].virus.yellow > 0) { return 1; }
  
    return 0;
  
  }
  canPlayerBuildResearchStation(city) {
  
    //
    // operations experts
    //
    if (this.game.players_info[this.game.player-1].type == 4) {
      let city = this.game.players_info[this.game.player-1].city;
      if (!this.game.state.research_stations.includes(city)) {
        //if (this.game.players_info[this.game.player-1].cards.length > 0) {
  	return 1;
        //}
      }
    }
  
    for (let i = 0; i < this.game.players_info[this.game.player-1].cards.length; i++) {
      if (this.game.players_info[this.game.player-1].cards[i] == city) { return 1; } 
    }
  
    return 0;
  
  }
  
  returnHopsToCityFromCity(fromcity, tocity) {
  
    let hops = 0;
    let current_cities = [];
    let new_cities = [];
    current_cities.push(fromcity);
  
    //
    // graph will eventually close
    //
    while (1) {
  
      new_cities = [];
      hops++;
  
      for (let i = 0; i < current_cities.length; i++) {
        let neighbours = this.game.cities[current_cities[i]].neighbours;
        for (let k = 0; k < neighbours.length; k++) {
          if (neighbours[k] == tocity) {
  	  return hops;
  	} else {
  	  if (!new_cities.includes(neighbours[k])) {
  	    new_cities.push(neighbours[k]);
  	  }
  	}
        }
      }
  
      current_cities = new_cities;
  
    }
  
  }
  
  movePlayer(player=0) { // 0 = me
  
    let pandemic_self = this;
    let city = this.game.players_info[this.game.player-1].city;
  
    let html  = "Move where: ";
    for (let i = 0; i < this.game.cities[city].neighbours.length; i++) {
      let c = this.game.cities[city].neighbours[i];
      html += '<li class="card" id="'+c+'">'+this.game.cities[c].name+'</li>';
    }
  
    this.updateStatus(html);
  
    $('.city').off();
    $('.city').on('click', function() {
  
      let c = $(this).attr('id');
      let hops = pandemic_self.returnHopsToCityFromCity(c, city);
  
      if (hops > pandemic_self.active_moves) { alert("Invalid Move -- too many hops"); }
      else {
  
        pandemic_self.game.players_info[pandemic_self.game.player-1].city = c;
        pandemic_self.active_moves -= (hops-1); // because we subtract one move by default
        pandemic_self.showBoard();
  
        let replaced = 0;
        for (let i = 0; i < pandemic_self.moves.length; i++) {
          if (pandemic_self.moves[i].indexOf("move") > -1) {
            pandemic_self.moves[i] = "move\t"+pandemic_self.game.player+"\t"+c;
    	  replaced = 1;
          }
        }
        if (replaced == 0) {
          pandemic_self.addMove("move\t"+pandemic_self.game.player+"\t"+c);
        }
  
        pandemic_self.playerMakeMove(pandemic_self.active_moves-1);
  
      } 
  
    });
  
  
  
  
  
    $('.card').off();
    $('.card').on('click', function() {
      let c = $(this).attr('id');
      pandemic_self.game.players_info[pandemic_self.game.player-1].city = c;
      pandemic_self.showBoard();
  
      let replaced = 0;
      for (let i = 0; i < pandemic_self.moves.length; i++) {
        if (pandemic_self.moves[i].indexOf("move") > -1) {
          pandemic_self.moves[i] = "move\t"+pandemic_self.game.player+"\t"+c;
  	replaced = 1;
        }
      }
      if (replaced == 0) {
        pandemic_self.addMove("move\t"+pandemic_self.game.player+"\t"+c);
      }
      pandemic_self.playerMakeMove(pandemic_self.active_moves-1);
    });
  
  }
  
  
  cureDisease() { // 0 = me
  
    let pandemic_self = this;
    let city = this.game.players_info[this.game.player-1].city;
  
    let number_of_diseases = 0;
  
    if (this.game.cities[city].virus.blue > 0)   { number_of_diseases++; }
    if (this.game.cities[city].virus.black > 0)  { number_of_diseases++; }
    if (this.game.cities[city].virus.red > 0)    { number_of_diseases++; }
    if (this.game.cities[city].virus.yellow > 0) { number_of_diseases++; }
  
    //
    // if there is just one type, cure it
    //
    if (number_of_diseases == 1) {
  
      pandemic_self.active_moves--;
  
      let c = "blue";
      let cubes_to_cure = 1;
      if (pandemic_self.game.players_info[pandemic_self.game.player-1].type == 3) { cubes_to_cure = 3; }
      
      let city = pandemic_self.game.players_info[pandemic_self.game.player-1].city;
  
      if ( pandemic_self.game.cities[city].virus.blue > 0 ) { 
        if (pandemic_self.game.state.blue_cure == 1) { cubes_to_cute = pandemic_self.game.cities[city].virus.blue; }
        pandemic_self.game.cities[city].virus.blue -= cubes_to_cure; pandemic_self.game.state.blue_active -= cubes_to_cure; c = "blue"; }
      if ( pandemic_self.game.cities[city].virus.red > 0 )  { 
        if (pandemic_self.game.state.red_cure == 1) { cubes_to_cute = pandemic_self.game.cities[city].virus.red; }
        pandemic_self.game.cities[city].virus.red -= cubes_to_cure; pandemic_self.game.state.red_active -= cubes_to_cure; c = "red"; }
      if ( pandemic_self.game.cities[city].virus.black > 0 ) { 
        if (pandemic_self.game.state.black_cure == 1) { cubes_to_cute = pandemic_self.game.cities[city].virus.black; }
        pandemic_self.game.cities[city].virus.black -= cubes_to_cure; pandemic_self.game.state.black_active -= cubes_to_cure; c = "black"; }
      if ( pandemic_self.game.cities[city].virus.yellow > 0 ) { 
        if (pandemic_self.game.state.yellow_cure == 1) { cubes_to_cute = pandemic_self.game.cities[city].virus.yellow; }
        pandemic_self.game.cities[city].virus.yellow -= cubes_to_cure; pandemic_self.game.state.yellow_active -= cubes_to_cure; c = "yellow"; }
  
      pandemic_self.addMove("cure\t"+pandemic_self.game.player+"\t"+city+"\t"+cubes_to_cure+"\t"+c);
      pandemic_self.showBoard();
  
      if (pandemic_self.active_moves == 0) {
        pandemic_self.endTurn();
      } else {
        pandemic_self.playerMakeMove(pandemic_self.active_moves);
      }
  
      return;
    }
  
  
    let html  = "Cure disease: ("+pandemic_self.active_moves+" moves)";
    if (this.game.cities[city].virus.blue > 0)     { html += '<li class="card" id="blue">blue</li>'; }
    if (this.game.cities[city].virus.red > 0)      { html += '<li class="card" id="red">red</li>'; }
    if (this.game.cities[city].virus.black > 0)    { html += '<li class="card" id="black">black</li>'; }
    if (this.game.cities[city].virus.yellow > 0)   { html += '<li class="card" id="yellow">yellow</li>'; }
    html += '<li class="card" id="stop">stop</li>';
  
    this.updateStatus(html);
  
    $('.card').off();
    $('.card').on('click', function() {
  
      let c = $(this).attr('id');
  
      if (c == "stop") {
        if (pandemic_self.active_moves == 0) {
          pandemic_self.endTurn();
        } else {
          pandemic_self.playerMakeMove(pandemic_self.active_moves);
        }
        return;
      }
  
      pandemic_self.active_moves--;
  
      let cubes_to_cure = 1;
      if (pandemic_self.game.players_info[pandemic_self.game.player-1].type == 3) { cubes_to_cure = 3; }
  
      let city = pandemic_self.game.players_info[pandemic_self.game.player-1].city;
      pandemic_self.addMove("cure\t"+pandemic_self.game.player+"\t"+city+"\t"+cubes_to_cure+"\t"+c);
  
      if (c == "blue")   { 
        if (pandemic_self.game.state.blue_cure == 1) { cubes_to_cute = pandemic_self.game.cities[city].virus.blue; }
  pandemic_self.game.cities[city].virus.blue -= cubes_to_cure; }
      if (c == "red")    { 
  pandemic_self.game.cities[city].virus.red -= cubes_to_cure }
        if (pandemic_self.game.state.red_cure == 1) { cubes_to_cute = pandemic_self.game.cities[city].virus.red; }
      if (c == "black")  { 
        if (pandemic_self.game.state.black_cure == 1) { cubes_to_cute = pandemic_self.game.cities[city].virus.black; }
  pandemic_self.game.cities[city].virus.black -= cubes_to_cure; }
      if (c == "yellow") { 
        if (pandemic_self.game.state.yellow_cure == 1) { cubes_to_cute = pandemic_self.game.cities[city].virus.yellow; }
  pandemic_self.game.cities[city].virus.yellow -= cubes_to_cure; }
  
      if ( pandemic_self.game.cities[city].virus.blue < 0 ) { pandemic_self.game.cities[city].virus.blue = 0; }
      if ( pandemic_self.game.cities[city].virus.yellow < 0 ) { pandemic_self.game.cities[city].virus.yellow = 0; }
      if ( pandemic_self.game.cities[city].virus.red < 0 ) { pandemic_self.game.cities[city].virus.red = 0; }
      if ( pandemic_self.game.cities[city].virus.black < 0 ) { pandemic_self.game.cities[city].virus.black = 0; }
  
      pandemic_self.showBoard();
  
      if (pandemic_self.active_moves == 0) {
        pandemic_self.endTurn();
      } else {
        pandemic_self.cureDisease();
      }
    });
  
  }
  
  directFlight() {
  
    let pandemic_self = this;
    let city = this.game.players_info[this.game.player-1].city;
    let cards = this.game.players_info[this.game.player-1].cards;
  
    let html  = "Take a direct flight: <ul>";
    for (let i = 0; i < cards.length; i++) {
      if (this.game.cities[cards[i]] != undefined) {
        html += '<li class="card" id="'+cards[i]+'">'+this.game.cities[cards[i]].name+'</li>';
      }
    }
    html += '<li class="card" id="stop">stop</li>';
    html += '</ul>';
  
    this.updateStatus(html);
  
    $('.card').off();
    $('.card').on('click', function() {
  
      let c = $(this).attr('id');
  
      if (c == "stop") {
        pandemic_self.playerMakeMove(pandemic_self.active_moves);
        return;
      }
  
  
      //
      // replace older moves
      //
      let replaced = 0;
      for (let i = 0; i < pandemic_self.moves.length; i++) {
        if (pandemic_self.moves[i].indexOf("move") > -1) {
          pandemic_self.moves[i] = "move\t"+pandemic_self.game.player+"\t"+c;
           replaced = 1;
        }
      }
      if (replaced == 0) {
        pandemic_self.addMove("move\t"+pandemic_self.game.player+"\t"+c);
      }
  
  
  
      pandemic_self.active_moves--;
      pandemic_self.game.players_info[pandemic_self.game.player-1].city = c;
      pandemic_self.addMove("discard\t"+pandemic_self.game.player+"\t"+c);
      pandemic_self.removeCardFromHand(pandemic_self.game.player, c);
      pandemic_self.showBoard();
  
      if (pandemic_self.active_moves == 0) {
        pandemic_self.endTurn();
      } else {
        pandemic_self.playerMakeMove(pandemic_self.active_moves);
      }
    });
  
  }
  
  shuttleFlight() {
  
    let pandemic_self = this;
    let city = this.game.players_info[this.game.player-1].city;
  
    let html  = "Take a shuttle flight: <ul>";
    for (let i = 0; i < this.game.state.research_stations.length; i++) {
      html += '<li class="card" id="'+this.game.state.research_stations[i]+'">'+this.game.cities[this.game.state.research_stations[i]].name+'</li>';
    }
    html += '<li class="card" id="stop">stop</li>';
    html += '</ul>';
  
    this.updateStatus(html);
  
    $('.card').off();
    $('.card').on('click', function() {
  
      let c = $(this).attr('id');
  
      if (c == "stop") {
        pandemic_self.playerMakeMove(pandemic_self.active_moves);
        return;
      }
  
      //
      // replace older moves
      //
      let replaced = 0;
      for (let i = 0; i < pandemic_self.moves.length; i++) {
        if (pandemic_self.moves[i].indexOf("move") > -1) {
          pandemic_self.moves[i] = "move\t"+pandemic_self.game.player+"\t"+c;
           replaced = 1;
        }
      }
      if (replaced == 0) {
        pandemic_self.addMove("move\t"+pandemic_self.game.player+"\t"+c);
      }
  
      pandemic_self.active_moves--;
      pandemic_self.game.players_info[pandemic_self.game.player-1].city = c;
      pandemic_self.addMove("discard\t"+pandemic_self.game.player+"\t"+c);
      pandemic_self.showBoard();
  
      if (pandemic_self.active_moves == 0) {
        pandemic_self.endTurn();
      } else {
        pandemic_self.playerMakeMove(pandemic_self.active_moves);
      }
    });
  
  }
  
  
  buildResearchStation(city="") {
  
    let pandemic_self = this;
  
    //
    // i am building myself
    //
    if (city == "") {
  
      let player = this.game.players_info[this.game.player-1];
      let city = player.city;
  
      //
      // this was originally implemented with spending any card to build, now is free
      //
      // if player is Operations Expert
      //
      if (player.type == 4) {
  
  
        //let html  = "Discard any card to build a research station: <ul>";
        //for (let i = 0; i < player.cards.length; i++) {
        //  html += '<li class="card" id="'+player.cards[i]+'">'+this.game.cities[player.cards[i]].name+'</li>';
        //}
        //html += '<li class="card" id="stop">cancel</li>';
        //html += '</ul>';
        //
        //this.updateStatus(html);
        //
        //$('.card').off();
        //$('.card').on('click', function() {
        //
        //  let c = $(this).attr('id');
        //
        //  if (c == "stop") {
        //    pandemic_self.playerMakeMove(pandemic_self.active_moves);
        //    return;
        //  }
        //
        //  for (let i = 0; i < player.cards.length; i++) {
        //    if (player.cards[i] == c) {
        //      pandemic_self.addMove("discard\t"+pandemic_self.game.player+"\t"+c);
        //      player.cards.splice(i,1);
        //    i = player.cards.length+2;
        //    }
        //  }
  
          if (pandemic_self.game.state.research_stations.length == 6) {
            pandemic_self.game.state.research_stations[0] = pandemic_self.game.state.research_stations[1];
            pandemic_self.game.state.research_stations[1] = pandemic_self.game.state.research_stations[2];
            pandemic_self.game.state.research_stations[2] = pandemic_self.game.state.research_stations[3];
            pandemic_self.game.state.research_stations[3] = pandemic_self.game.state.research_stations[4];
            pandemic_self.game.state.research_stations[4] = pandemic_self.game.state.research_stations[5];
            pandemic_self.game.state.research_stations[5] = city;
          } else {
            pandemic_self.game.state.research_stations[pandemic_self.game.state.research_stations.length] = city;
          }
  
          pandemic_self.addMove("discard\t"+pandemic_self.game.player+"\t"+city);
          pandemic_self.addMove("buildresearchstation\t"+pandemic_self.game.player+"\t"+city);
          pandemic_self.active_moves--;
          pandemic_self.showBoard();
          pandemic_self.playerMakeMove(pandemic_self.active_moves);
  
        //
        //});   
        //
  
        return 0; 
      }
  
  
      for (let i = 0; i < pandemic_self.game.state.research_stations.length; i++) {
        if (pandemic_self.game.state.research_stations[i] == city) {
          pandemic_self.active_moves--;
          pandemic_self.showBoard();
          pandemic_self.playerMakeMove(pandemic_self.active_moves);
          return;
        }
      }
  
      if (pandemic_self.game.state.research_stations.length == 6) {
        pandemic_self.game.state.research_stations[0] = pandemic_self.game.state.research_stations[1];
        pandemic_self.game.state.research_stations[1] = pandemic_self.game.state.research_stations[2];
        pandemic_self.game.state.research_stations[2] = pandemic_self.game.state.research_stations[3];
        pandemic_self.game.state.research_stations[3] = pandemic_self.game.state.research_stations[4];
        pandemic_self.game.state.research_stations[4] = pandemic_self.game.state.research_stations[5];
        pandemic_self.game.state.research_stations[5] = city;
      } else {
        pandemic_self.game.state.research_stations[pandemic_self.game.state.research_stations.length] = city;
      }
  
      pandemic_self.addMove("discard\t"+pandemic_self.game.player+"\t"+city);
      pandemic_self.addMove("buildresearchstation\t"+pandemic_self.game.player+"\t"+city);
  
      for (let i = 0; i < player.cards.length; i++) {
        if (player.cards[i] == city) {
          player.cards.splice(i, 1); i = player.cards.length+2;
          pandemic_self.active_moves--;
          pandemic_self.showBoard();
          pandemic_self.playerMakeMove(pandemic_self.active_moves);
          return;
        }
      }
  
      pandemic_self.active_moves--;
      pandemic_self.showBoard();
      pandemic_self.playerMakeMove(pandemic_self.active_moves);
  
    //
    // if we are given the city, just put it on the board
    //
    } else {
  
      if (pandemic_self.game.state.research_stations.length == 6) {
        pandemic_self.game.state.research_stations[0] = pandemic_self.game.state.research_stations[1];
        pandemic_self.game.state.research_stations[1] = pandemic_self.game.state.research_stations[2];
        pandemic_self.game.state.research_stations[2] = pandemic_self.game.state.research_stations[3];
        pandemic_self.game.state.research_stations[3] = pandemic_self.game.state.research_stations[4];
        pandemic_self.game.state.research_stations[4] = pandemic_self.game.state.research_stations[5];
        pandemic_self.game.state.research_stations[5] = city;
      } else {
        pandemic_self.game.state.research_stations[pandemic_self.game.state.research_stations.length] = city;
      }
  
    }
  
  }
  
  
  
  
  
  //
  // Core Game Logic
  //
  handleGameLoop(msg=null) {
  
    let pandemic_self = this;
  
    ///////////
    // QUEUE //
    ///////////
    if (this.game.queue.length > 0) {
  
  console.log("QUEUE: " + this.game.queue);
  
      pandemic_self.saveGame(pandemic_self.game.id);
  
      let qe = this.game.queue.length-1;
      let mv = this.game.queue[qe].split("\t");
      let shd_continue = 1;
  
      //
      // start
      // round
      // notify [msg]
      // move [msg]
      // draw_player_card [player] [cards]
      // initialize_player_deck
      //
      if (mv[0] === "start") {
        this.game.queue.splice(qe, 1);
      }
      if (mv[0] === "forecast") {
        let cards_to_update = parseInt(mv[1]);
        for (let i = 0; i < cards_to_update; i++) {
  	let newcard = mv[i+2];
   	this.updateLog(newcard + " on top of infection pile...");
  	this.game.deck[0].crypt[i] = this.app.crypto.stringToHex(newcard);
        }
        this.game.queue.splice(qe, 1);
      }
      if (mv[0] === "resilientpopulation") {
        for (let i = 0; i < this.game.state.infection_drawn.length; i++) {
   	if (this.game.state.infection_drawn[i] == mv[1]) {
  	  this.game.state.infection_drawn.splice(i, 1); i--;
  	}
        }
        this.game.queue.splice(qe, 1);
      }
      if (mv[0] === "resolve") {
        if (this.game.queue.length <= 1) { this.game.queue = []; }
        this.game.queue.splice(qe-1, 2);
      }
      if (mv[0] === "discard") {
        let player = parseInt(mv[1]);
        let card = mv[2];
  
        for (let i = 0; i < this.game.players_info[player-1].cards.length; i++) {
  	if (this.game.players_info[player-1].cards[i] == card) {
            this.game.players_info[player-1].cards.splice(i, 1);
  	}
        }
  
        this.game.queue.splice(qe-1, 2);
      }
      if (mv[0] === "round") {
        this.game.queue.push("turn\t1");
      }
      if (mv[0] === "turn") {
  
        this.highlightActivePlayerTurn(mv[1]);
  
        if (parseInt(mv[1]) == this.game.player) {
          this.playerTurn();
        } else {
  	this.removeEvents();
  	this.updateStatus("You are the "+this.game.players_info[this.game.player-1].role+" ("+this.game.cities[this.game.players_info[this.game.player-1].city].name+"). Waiting for Player " + mv[1] + " ("+this.game.players_info[parseInt(mv[1])].name+")");
        }
  
  
        return 0;
      }
      if (mv[0] === "draw_player_card") {
  
        this.updateLog(this.game.deck[1].crypt.length + " cards left in deck.");
  
        let player = parseInt(mv[1])-1;
        let cards = parseInt(mv[2]);
  
        for (let i = 0; i < cards; i++) {
  
          if (this.game.deck[1].crypt.length == 0) {
    	    this.endGame("No more cards. You have failed to contain the pandemic in time.");
  	    return;
          }
  
  	  let cards_left = cards-i-1;
  	  let card = this.drawPlayerCard(player);

  	  if (card == "epidemic1" || card == "epidemic2" || card == "epidemic3" || card == "epidemic4" || card == "epidemic5" || card == "epidemic6") {
  
  	    this.updateLog("Player "+(player+1)+": draws Epidemic Card");
  	    this.addMove("RESOLVE");
  	    this.addMove("draw_player_card\t"+(player+1)+"\t"+cards_left);
  	    this.addMove("epidemic");
            this.game.queue.splice(qe, 1);
  	    this.endTurn();
  
  	    return 0;
  
  	  } else {
console.log("PLAYER: " + player + " --- " + " need to overwrite now that players is pkeys");
  	    this.updateLog("Player "+(player+1)+": draws "+this.game.deck[1].cards[card].name);
            this.game.players_info[player].cards.push(card);
  	  }
        }
  
        this.game.queue.splice(qe, 1);
  
      }
      if (mv[0] === "epidemic") {
  
        this.game.state.infection_rate++;
  
        this.outbreaks = [];
        let city   = this.drawInfectionCardFromBottomOfDeck();
        let virus      = this.game.deck[0].cards[city].virus;
  
        //
        // add three cubes
        //
        this.updateLog("Outbreak in " + city + " (" + virus + ")");
        this.addDiseaseCube(city, virus);
        this.addDiseaseCube(city, virus);
        this.addDiseaseCube(city, virus);
  
        //
        // shuffle cards into TOP of infection deck
        //
        let new_deck = [];
  
        for (let i = 0; i < this.game.state.infection_drawn.length; i++) {
          let roll = this.rollDice(this.game.state.infection_drawn.length);
  	new_deck.push(this.app.crypto.stringToHex(this.game.state.infection_drawn[roll-1]));
  	this.game.state.infection_drawn.splice(roll-1, 1);
        }
  
  console.log("\n\n\nEPIDEMIC CARDS GETTING RECYCLED: ");
  console.log( JSON.stringify(new_deck) );
  
        for (let i = 0; i < this.game.deck[0].crypt.length; i++) {
  	new_deck.push(this.game.deck[0].crypt[i]);
        }
  
        this.game.deck[0].crypt = new_deck;
        this.game.deck[0].discards = [];
  
        this.showBoard();
  
        this.game.queue.splice(qe, 1);
  
      }
      if (mv[0] === "infect") {
  
        let infection_cards = 2;
        if (this.game.state.infection_rate > 2) { infection_cards = 3; }
        if (this.game.state.infection_rate > 4) { infection_cards = 4; }
  
        if (this.game.state.one_quiet_night == 0) {
          for (let i = 0; i < infection_cards; i++) {
  
            this.outbreaks = [];
  
            let city   = this.drawInfectionCard();
            let virus  = this.game.deck[0].cards[city].virus;
  	  let place_virus = 1;
  
  	  if (virus == "blue" && this.game.state.blue_cure == 1) {
  	    let total = 0;
  	    for (let key in this.game.cities) { total += this.game.cities[key].virus.blue; }
  	    if (total == 0) { place_virus = 0; }
  	  }
  
  	  if (virus == "black" && this.game.state.black_cure == 1) {
  	    let total = 0;
  	    for (let key in this.game.cities) { total += this.game.cities[key].virus.black; }
  	    if (total == 0) { place_virus = 0; }
  	  }
  
  	  if (virus == "red" && this.game.state.red_cure == 1) {
  	    let total = 0;
  	    for (let key in this.game.cities) { total += this.game.cities[key].virus.red; }
  	    if (total == 0) { place_virus = 0; }
  	  }
  
  	  if (virus == "yellow" && this.game.state.yellow_cure == 1) {
  	    let total = 0;
  	    for (let key in this.game.cities) { total += this.game.cities[key].virus.yellow; }
  	    if (total == 0) { place_virus = 0; }
  	  }
  
  
  	  if (place_virus == 1) {
  	    this.updateLog("Infection cluster in " + this.game.cities[city].name);
    	    this.addDiseaseCube(city, virus);
  	  } else {
  	    this.updateLog("Cure prevents infection in " + this.game.cities[city].name);
  	  }
  
          }
          this.game.state.one_quiet_night = 0;
        }
  
        this.showBoard();
  
        this.game.queue.splice(qe, 1);
  
      }
      if (mv[0] === "place_initial_infection") {
  
        //
        // place initial cards
        //
        for (let i = 3; i > 0; i--) {
          for (let k = 0; k < 3; k++) {
            let newcard = this.drawInfectionCard();
            let virus = this.game.deck[0].cards[newcard].virus;
            let dvirus = this.game.deck[0].discards[newcard].virus;
            if (virus == "yellow") { this.game.cities[newcard].virus.yellow = i; }
            if (virus == "blue") { this.game.cities[newcard].virus.blue = i; }
            if (virus == "black") { this.game.cities[newcard].virus.black = i; }
            if (virus == "red") { this.game.cities[newcard].virus.red = i; }
            this.updateLog(this.game.cities[newcard].name + " infected with " + i + " " + virus + " -- " + dvirus);
          }
        }
  
        this.game.queue.splice(qe, 1);
      }
      if (mv[0] === "initialize_player_deck") {
  
        let epidemics = 4;
        let undrawn_cards = this.game.deck[1].crypt.length;
        let section_length = Math.floor(undrawn_cards/epidemics);
  
        //
        // adjustable difficulty
        //
        if (this.game.options.difficulty != undefined) {
          if (this.game.options.difficulty === "medium") { epidemics = 5; }
          if (this.game.options.difficulty === "hard") { epidemics = 6; }
        }
  
  
        //
        // add epidemic cards to deck
        //
        this.game.deck[1].cards['epidemic1'] = { img : "Epidemic.jpg" }
        this.game.deck[1].cards['epidemic2'] = { img : "Epidemic.jpg" }
        this.game.deck[1].cards['epidemic3'] = { img : "Epidemic.jpg" }
        this.game.deck[1].cards['epidemic4'] = { img : "Epidemic.jpg" }
        this.game.deck[1].cards['epidemic5'] = { img : "Epidemic.jpg" }
        this.game.deck[1].cards['epidemic6'] = { img : "Epidemic.jpg" }
  
        //
        // shuffle them into the undrawn pile
        //
        for (let i = 0, starting_point = 0; i < epidemics; i++) {
  	let cardname = "epidemic"+(i+1);
  	let insertion_point = this.rollDice((section_length));
  	this.game.deck[1].crypt.splice(starting_point+insertion_point, 0, this.app.crypto.stringToHex(cardname));	
  	starting_point += 1;
  	starting_point += section_length;
        }
  
  
        //
        // add events to deck
        //
        let total_events = 0;
        for (var i in this.game.events) { total_events++; this.game.deck[1].cards[i] = this.game.events[i]; }
  
        //
        // shuffle them into the undrawn pile
        //
        for (let i = 0; i < total_events; i++) {
  	let cardname = "event"+(i+1);
  	let insertion_point = this.rollDice((this.game.deck[1].crypt.length-1));
  	this.game.deck[1].crypt.splice(insertion_point, 0, this.app.crypto.stringToHex(cardname));	
        }
  
  console.log("\n\n\nCARDS AS INITED: ");
  for (let i = 0; i < this.game.deck[1].crypt.length; i++) {
  console.log(this.app.crypto.hexToString(this.game.deck[1].crypt[i]));
  }
  
        this.game.queue.splice(qe, 1);
  
      }
      if (mv[0] === "curevirus") {
        let player = parseInt(mv[1]);
        let virus = mv[2];
        if (this.game.player != player) {
  
          if (virus == "yellow") { pandemic_self.game.state.yellow_cure = 1; }
          if (virus == "red")    { pandemic_self.game.state.red_cure = 1; }
          if (virus == "blue")   { pandemic_self.game.state.blue_cure = 1; }
          if (virus == "black")  { pandemic_self.game.state.black_cure = 1; }
  
        }
        this.game.queue.splice(qe, 1);
      }
      if (mv[0] === "onequietnight") {
        this.game.state.one_quiet_night = 1;
        this.game.queue.splice(qe, 1);
      }
      if (mv[0] === "buildresearchstation") {
        let player = parseInt(mv[1]);
        let city = mv[2];
        if (this.game.player != player) {
  	this.buildResearchStation(city);
        }
        this.game.queue.splice(qe, 1);
      }
      if (mv[0] === "notify") {
        this.updateLog(mv[1]);
        this.game.queue.splice(qe, 1);
      }
      if (mv[0] === "takecard") {
        let sender = parseInt(mv[1]); // player who already executed adding / removing
        let recipient = parseInt(mv[2]);
        let card = mv[3];
        if (recipient != this.game.player) {
          pandemic_self.removeCardFromHand(this.game.player,card);
        } if (recipient == this.game.player && recipient != sender) {
          pandemic_self.game.players_info[recipient-1].cards.push(card);
        }
        if (this.game.player !== parseInt(mv[1])) {
          pandemic_self.game.players_info[(parseInt(mv[1])-1)].city = mv[3];
  	pandemic_self.showBoard();
        }
        this.game.queue.splice(qe, 1);
      }
      if (mv[0] === "move") {
        pandemic_self.game.players_info[(parseInt(mv[1])-1)].city = mv[2];
        pandemic_self.showBoard();
        this.game.queue.splice(qe, 1);
      }
      if (mv[0] === "cure") {
        if (this.game.player !== parseInt(mv[1])) {
  
          if (pandemic_self.game.state.blue_cure == 1 && mv[4] == "blue") { mv[3] = pandemic_self.game.cities[mv[2]].virus.blue; }
          if (pandemic_self.game.state.red_cure == 1 && mv[4] == "red") { mv[3] = pandemic_self.game.cities[mv[2]].virus.red; }
          if (pandemic_self.game.state.yellow_cure == 1 && mv[4] == "yellow") { mv[3] = pandemic_self.game.cities[mv[2]].virus.yellow; }
          if (pandemic_self.game.state.black_cure == 1 && mv[4] == "black") { mv[3] = pandemic_self.game.cities[mv[2]].virus.black; }
  
  	if (mv[4] === "yellow") { pandemic_self.game.cities[mv[2]].virus.yellow -= parseInt(mv[3]); pandemic_self.game.state.yellow_active -= parseInt(mv[3]); }
  	if (mv[4] === "blue") { pandemic_self.game.cities[mv[2]].virus.blue -= parseInt(mv[3]); pandemic_self.game.state.blue_active -= parseInt(mv[3]); }
  	if (mv[4] === "black") { pandemic_self.game.cities[mv[2]].virus.black -= parseInt(mv[3]); pandemic_self.game.state.black_active -= parseInt(mv[3]); }
  	if (mv[4] === "red") { pandemic_self.game.cities[mv[2]].virus.red -= parseInt(mv[3]); pandemic_self.game.state.red_active -= parseInt(mv[3]); }
  
  	if ( pandemic_self.game.cities[mv[2]].virus.yellow < 0 ) { pandemic_self.game.cities[mv[2]].virus.yellow = 0; }
  	if ( pandemic_self.game.cities[mv[2]].virus.red < 0 ) { pandemic_self.game.cities[mv[2]].virus.red = 0; }
  	if ( pandemic_self.game.cities[mv[2]].virus.blue < 0 ) { pandemic_self.game.cities[mv[2]].virus.blue = 0; }
  	if ( pandemic_self.game.cities[mv[2]].virus.black < 0 ) { pandemic_self.game.cities[mv[2]].virus.black = 0; }
  
  	pandemic_self.showBoard();
        }
        this.game.queue.splice(qe, 1);
      }
      if (shd_continue == 0) { 
        console.log("NOT CONTINUING");
        return 0; 
      }
  
      return 1;
    }
  
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  addMove(mv) {
    this.moves.push(mv);
  }
  
  endTurn() {
  
    this.updateStatus("Waiting for information from peers....");
    
    let extra = {};
        extra.target = this.returnNextPlayer(this.game.player);
    this.game.turn = this.moves;
    this.sendMessage("game", extra);
    this.moves = [];
    this.saveGame(this.game.id);
  
  }
  endGame(notice) {
    this.game.over = 1;
    alert("GAME OVER: " + notice);
    this.saveGame(this.game.id);
  }
  
  
  
  drawInfectionCard() {
  
    let newcard = this.game.deck[0].crypt[0];
        newcard = this.app.crypto.hexToString(newcard);
  
    this.game.state.infection_topcard = newcard;
    this.game.state.infection_drawn.push(newcard);
    this.game.deck[0].discards[newcard] = this.game.deck[0].cards[newcard];
    this.game.deck[0].crypt.splice(0, 1);
  
    this.showBoard();
  
    return newcard;
  
  }
  
  
  triggerOutbreak(city, virus) {
  
    this.game.state.outbreak_rate++;
    this.updateLog("Outbreak in " + city);
  
    for (let i = 0; i < this.game.cities[city].neighbours.length; i++) {
      if (!this.outbreaks.includes(this.game.cities[city].neighbours[i])) {
        this.addDiseaseCube(this.game.cities[city].neighbours[i], virus);
      }
    }
  
  }



  addDiseaseCube(city, virus) {
  
    if (virus == "blue") { 
      this.game.cities[city].virus.blue++; 
      this.game.state.blue_active++;
      if (this.game.state.blue_active > 24) { this.endGame("Blue Disease Outbreak Beyond Control"); return; }
      if (this.game.cities[city].virus.blue > 3) {
        this.game.cities[city].virus.blue = 3; 
        this.outbreaks.push(city);
        this.triggerOutbreak(city, virus);   
      }
    }
  
    if (virus == "black") { 
      this.game.cities[city].virus.black++; 
      this.game.state.black_active++;
      if (this.game.state.black_active > 24) { this.endGame("Black Disease Outbreak Beyond Control"); return; }
      if (this.game.cities[city].virus.black > 3) {
        this.game.cities[city].virus.black = 3; 
        this.outbreaks.push(city);
        this.triggerOutbreak(city, virus);   
      }
    }
    if (virus == "red") { 
      this.game.cities[city].virus.red++; 
      this.game.state.red_active++;
      if (this.game.state.red_active > 24) { this.endGame("Red Disease Outbreak Beyond Control"); return; }
      if (this.game.cities[city].virus.red > 3) {
        this.game.cities[city].virus.red = 3;
        this.outbreaks.push(city);
        this.triggerOutbreak(city, virus);   
      }
    }
    if (virus == "yellow") { 
      this.game.cities[city].virus.yellow++; 
      this.game.state.yellow_active++;
      if (this.game.state.yellow_active > 24) { this.endGame("Yellow Disease Outbreak Beyond Control"); return; }
      if (this.game.cities[city].virus.yellow > 3) {
        this.game.cities[city].virus.yellow = 3;
        this.outbreaks.push(city);
        this.triggerOutbreak(city, virus);   
      }
    }
  
  }
  
  
  drawInfectionCardFromBottomOfDeck() {
  
    let newcard = this.game.deck[0].crypt[this.game.deck[0].crypt.length-1];
        newcard = this.app.crypto.hexToString(newcard);
  
    this.game.state.infection_topcard = newcard;
    this.game.state.infection_drawn.push(newcard);
    this.game.deck[0].discards[newcard] = this.game.deck[0].cards[newcard];
    this.game.deck[0].crypt.splice(this.game.deck[0].crypt.length-1, 1);
  
    this.showBoard();
  
    return newcard;
  
  }
  



  drawPlayerCard(player=1) {
  
    let newcard = this.game.deck[1].crypt[0];
        newcard = this.app.crypto.hexToString(newcard);
  
    this.game.state.player_topcard = newcard;
  
    this.game.deck[1].discards[newcard] = this.game.deck[1].cards[newcard];
    this.game.deck[1].crypt.splice(0, 1);
  
    this.showBoard();
  
    return newcard;
  }
  
  
  

  returnState() {
  
    var state = {};
  
    state.outbreak_rate = 0;
    state.infection_rate = 0;
  
    // events
    state.one_quiet_night = 0;
  
    // cards
    state.infection_topcard = "";
    state.player_topcard = "";
    state.infection_drawn = [];
    state.research_stations = [];
    state.research_stations[0] = "atlanta";
  
    // cures
    state.yellow_cure = 0;
    state.blue_cure = 0;
    state.red_cure = 0;
    state.black_cure = 0;
  
    // onboard
    state.yellow_active = 0;
    state.blue_active = 0;
    state.red_active = 0;
    state.black_active = 0;
  
    return state;
  
  }
  



  returnPlayers(num=1) {
  
    var players = [];
  
    for (let i = 0; i < num; i++) {
  
      players[i] = {};
      players[i].city = "atlanta";
      players[i].moves      = 4;
      players[i].cards      = [];
      players[i].type       = 1;
  
      let roles = ['generalist','scientist','medic','operationsexpert'];
      let role  = roles[(this.rollDice(4)-1)];
  
      if (i == 0) {
        if (this.game.options.player1 != undefined) {
          if (this.game.options.player1 != "random") {
            role = this.game.options.player1;
          }
        }
      }
      if (i == 1) {
        if (this.game.options.player2 != undefined) {
          if (this.game.options.player2 != "random") {
            role = this.game.options.player2;
          }
        }
      }
      if (i == 2) {
        if (this.game.options.player3 != undefined) {
          if (this.game.options.player3 != "random") {
            role = this.game.options.player3;
          }
        }
      }
      if (i == 3) {
        if (this.game.options.player4 != undefined) {
          if (this.game.options.player4 != "random") {
            role = this.game.options.player4;
          }
        }
      }
  
      if (role === 'generalist') {
        players[i].role     = "Generalist";
        players[i].pawn     = "Pawn%20Generalist.png";
        players[i].card     = "Role%20-%20Generalist.jpg";
        players[i].moves    = 5;
        players[i].type     = 1;
      }
      if (role === 'scientist') {
        players[i].role     = "Scientist";
        players[i].pawn     = "Pawn%20Scientist.png";
        players[i].card     = "Role%20-%20Scientist.jpg";
        players[i].type     = 2;
      }
      if (role === 'medic') {
        players[i].role     = "Medic";
        players[i].pawn     = "Pawn%20Medic.png";
        players[i].card     = "Role%20-%20Medic.jpg";
        players[i].type     = 3;
      }
      if (role === 'operationsexpert') {
        players[i].role     = "Operations Expert";
        players[i].pawn     = "Pawn%20Operations%20Expert.png";
        players[i].card     = "Role%20-%20Operations%20Expert.jpg";
        players[i].type     = 4;
      }
  
    }
  
    return players;
  
  }
  



  returnCities() {
  
    var cities = {};
  
    cities['sanfrancisco'] = { top : 560, left : 95 , neighbours : [ 'tokyo', 'manila', 'losangeles', 'chicago' ] , name : "San Francisco" };
    cities['chicago'] = { top : 490, left : 340 , neighbours : [ 'sanfrancisco', 'losangeles', 'mexicocity', 'atlanta', 'montreal' ] , name : "Chicago" };
    cities['montreal'] = { top : 480, left : 530 , neighbours : [ 'chicago', 'newyork', 'washington' ] , name : "Montreal" };
    cities['newyork'] = { top : 505, left : 675 , neighbours : [ 'montreal', 'washington', 'london', 'madrid' ] , name : "New York" };
    cities['washington'] = { top : 625, left : 615 , neighbours : [ 'montreal', 'newyork', 'miami', 'atlanta' ] , name : "Washington" };
    cities['atlanta'] = { top : 630, left : 410 , neighbours : [ 'chicago', 'miami', 'washington' ] , name : "Atlanta" };
    cities['losangeles'] = { top : 750, left : 135 , neighbours : [ 'sydney', 'sanfrancisco', 'mexicocity', 'chicago' ] , name : "Los Angeles" };
    cities['mexicocity'] = { top : 815, left : 315 , neighbours : [ 'chicago', 'losangeles', 'miami', 'bogota', 'lima' ] , name : "Mexico City" };
    cities['miami'] = { top : 790, left : 530 , neighbours : [ 'washington', 'atlanta', 'mexicocity', 'bogota' ] , name : "Miami" };
    cities['bogota'] = { top : 980, left : 515 , neighbours : [ 'miami', 'mexicocity', 'lima', 'saopaulo', 'buenosaires' ] , name : "Bogota" };
    cities['lima'] = { top : 1180, left : 445 , neighbours : [ 'santiago', 'bogota', 'mexicocity' ] , name : "Lima" };
    cities['santiago'] = { top : 1390, left : 470 , neighbours : [ 'lima' ] , name : "Santiago" };
    cities['buenosaires'] = { top : 1355, left : 670 , neighbours : [ 'saopaulo', 'bogota' ] , name : "Buenos Aires" };
    cities['saopaulo'] = { top : 1210, left : 780 , neighbours : [ 'bogota', 'buenosaires', 'madrid', 'lagos' ] , name : "Sao Paulo" };
    cities['lagos'] = { top : 950, left : 1150 , neighbours : [ 'saopaulo', 'khartoum', 'kinshasa' ] , name : "Lagos" };
    cities['khartoum'] = { top : 910, left : 1395 , neighbours : [ 'cairo', 'lagos', 'kinshasa', 'johannesburg' ] , name : "Khartoum" };
    cities['kinshasa'] = { top : 1080, left : 1275 , neighbours : [ 'lagos', 'khartoum', 'johannesburg' ] , name : "Kinshasa" };
    cities['johannesburg'] = { top : 1270, left : 1385 , neighbours : [ 'kinshasa', 'khartoum' ] , name : "Johannesburg" };
    cities['london'] = { top : 390, left : 1025 , neighbours : [ 'newyork', 'madrid', 'essen', 'paris' ] , name : "London" };
    cities['madrid'] = { top : 580, left : 1005 , neighbours : [ 'newyork', 'paris', 'london' , 'algiers' , 'saopaulo' ] , name : "Madrid" };
    cities['essen'] = { top : 360, left : 1220 , neighbours : [ 'stpetersburg', 'london', 'milan' ] , name : "Essen" };
    cities['paris'] = { top : 485, left : 1170 , neighbours : [ 'london', 'essen', 'madrid', 'milan', 'algiers' ] , name : "Paris" };
    cities['stpetersburg'] = { top : 320, left : 1430 , neighbours : [ 'essen', 'moscow' , 'istanbul' ] , name : "St. Petersburg" };
    cities['milan'] = { top : 450, left : 1300 , neighbours : [ 'essen', 'istanbul', 'paris' ] , name : "Milan" };
    cities['algiers'] = { top : 685, left : 1220 , neighbours : [ 'madrid', 'paris', 'cairo', 'istanbul' ] , name : "Algiers" };
    cities['cairo'] = { top : 720, left : 1360 , neighbours : [ 'khartoum', 'algiers', 'istanbul', 'baghdad', 'riyadh' ] , name : "Cairo" };
    cities['istanbul'] = { top : 560, left : 1385 , neighbours : [ 'stpetersburg', 'milan', 'algiers', 'cairo', 'baghdad', 'moscow' ] , name : "Istanbul" };
    cities['moscow'] = { top : 450, left : 1535 , neighbours : [ 'stpetersburg', 'tehran', 'istanbul' ] , name : "Moscow" };
    cities['baghdad'] = { top : 660, left : 1525 , neighbours : [ 'cairo', 'riyadh', 'karachi', 'tehran', 'istanbul' ] , name : "Baghdad" };
    cities['riyadh'] = { top : 830, left : 1545 , neighbours : [ 'cairo', 'istanbul', 'karachi' ] , name : "Riyadh" };
    cities['tehran'] = { top : 540, left : 1665 , neighbours : [ 'moscow', 'karachi', 'baghdad', 'delhi' ] , name : "Tehran" };
    cities['karachi'] = { top : 720, left : 1705 , neighbours : [ 'baghdad', 'tehran', 'delhi', 'riyadh', 'mumbai' ] , name : "Karachi" };
    cities['mumbai'] = { top : 865, left : 1720 , neighbours : [ 'chennai', 'karachi', 'delhi' ] , name : "Mumbai" };
    cities['delhi'] = { top : 670, left : 1845 , neighbours : [ 'tehran', 'karachi', 'mumbai', 'chennai' , 'kolkata' ] , name : "Delhi" };
    cities['chennai'] = { top : 965, left : 1870 , neighbours : [ 'mumbai', 'delhi', 'kolkata', 'bangkok', 'jakarta' ] , name : "Chennai" };
    cities['kolkata'] = { top : 715, left : 1975 , neighbours : [ 'delhi', 'chennai', 'bangkok', 'hongkong' ] , name : "Kolkata" };
    cities['bangkok'] = { top : 880, left : 2005 , neighbours : [ 'kolkata', 'hongkong', 'chennai', 'jakarta', 'hochiminhcity' ] , name : "Bangkok" };
    cities['jakarta'] = { top : 1130, left : 2005 , neighbours : [ 'chennai', 'bangkok', 'hochiminhcity', 'sydney' ] , name : "Jakarta" };
    cities['sydney'] = { top : 1390, left : 2420 , neighbours : [ 'jakarta', 'manila', 'losangeles' ] , name : "Sydney" };
    cities['manila'] = { top : 1000, left : 2305 , neighbours : [ 'sydney', 'hongkong', 'hochiminhcity', 'sanfrancisco', 'taipei' ] , name : "Manila" };
    cities['hochiminhcity'] = { top : 1010, left : 2120 , neighbours : [ 'jakarta', 'bangkok', 'hongkong', 'manila' ] , name : "Ho Chi Minh City" };
    cities['hongkong'] = { top : 790, left : 2115 , neighbours : [ 'hochiminhcity', 'shanghai', 'bangkok', 'kolkata', 'taipei' , 'manila' ] , name : "Hong Kong" };
    cities['taipei'] = { top : 765, left : 2270 , neighbours : [ 'shanghai', 'hongkong', 'manila', 'osaka' ] , name : "Taipei" };
    cities['shanghai'] = { top : 630, left : 2095 , neighbours : [ 'beijing', 'hongkong', 'taipei', 'seoul', 'tokyo' ] , name : "Shanghai" };
    cities['beijing'] = { top : 500, left : 2085 , neighbours : [ 'shanghai', 'seoul' ] , name : "Beijing" };
    cities['seoul'] = { top : 485, left : 2255 , neighbours : [ 'beijing', 'shanghai', 'tokyo' ] , name : "Seoul" };
    cities['tokyo'] = { top : 565, left : 2385 , neighbours : [ 'seoul', 'shanghai', 'sanfrancisco', 'osaka' ] , name : "Tokyo" };
    cities['osaka'] = { top : 710, left : 2405 , neighbours : [ 'taipei', 'tokyo' ] , name : "Osaka" };
  
    //
    // set initial viral load
    //
    for (var key in cities) {
      cities[key].virus = {};
      cities[key].virus.yellow = 0;
      cities[key].virus.red = 0;
      cities[key].virus.blue = 0;
      cities[key].virus.black = 0;
    }
  
    return cities;
  
  }
  
  
  returnEvents() {
  
    var events = {};
  
    events['event1'] = { img : 'Special%20Event%20-%20Airlift.jpg' , name : 'Airlift' , virus : "" }
    events['event2'] = { img : 'Special%20Event%20-%20Resilient%20Population.jpg' , name : 'Resilient Population' , virus : "" }
    events['event3'] = { img : 'Special%20Event%20-%20One%20Quiet%20Night.jpg' , name : 'One Quiet Night' , virus : "" }
    events['event4'] = { img : 'Special%20Event%20-%20Forecast.jpg' , name : 'Forecast' , virus : "" }
    events['event5'] = { img : 'Special%20Event%20-%20Government%20Grant.jpg' , name : 'Government Grant' , virus : "" }
  
    return events;
  
  }
  
  
  
  returnInfectionCards() {
  
    var deck = {};
  
    deck['sanfrancisco'] = { img : "Infection%20Blue%20San%20Francisco.jpg" , virus : "blue" }
    deck['chicago'] =  { img : "Infection%20Blue%20Chicago.jpg" , virus : "blue" }
    deck['montreal'] =  { img : "Infection%20Blue%20Toronto.jpg" , virus : "blue" };
    deck['newyork'] =  { img : "Infection%20Blue%20New%20York.jpg" , virus : "blue" };
    deck['washington'] =  { img : "Infection%20Blue%20Washington.jpg" , virus : "blue" };
    deck['atlanta'] =  { img : "Infection%20Blue%20Atlanta.jpg" , virus : "blue" };
    deck['losangeles'] =  { img : "Infection%20Yellow%20Los%20Angeles.jpg" , virus : "yellow" };
    deck['mexicocity'] =  { img : "Infection%20Yellow%20Mexico%20City.jpg" , virus : "yellow" };
    deck['miami'] =  { img : "Infection%20Yellow%20Miami.jpg" , virus : "yellow" };
    deck['bogota'] =  { img : "Infection%20Yellow%20Bogota.jpg" , virus : "yellow" };
    deck['lima'] =  { img : "Infection%20Yellow%20Lima.jpg" , virus : "yellow" };
    deck['santiago'] =  { img : "Infection%20Yellow%20Santiago.jpg" , virus : "yellow" };
    deck['buenosaires'] =  { img : "Infection%20Yellow%20Buenos%20Aires.jpg" , virus : "yellow" };
    deck['saopaulo'] =  { img : "Infection%20Yellow%20Sao%20Paulo.jpg" , virus : "yellow" };
    deck['lagos'] =  { img : "Infection%20Yellow%20Lagos.jpg" , virus : "yellow" };
    deck['khartoum'] =  { img : "Infection%20Yellow%20Khartoum.jpg" , virus : "yellow" };
    deck['kinshasa'] =  { img : "Infection%20Yellow%20Kinsasha.jpg" , virus : "yellow" };
    deck['johannesburg'] =  { img : "Infection%20Yellow%20Johannesburg.jpg" , virus : "yellow" };
    deck['london'] =  { img : "Infection%20Blue%20London.jpg" , virus : "blue" };
    deck['madrid'] =  { img : "Infection%20Blue%20Madrid.jpg" , virus : "blue" };
    deck['essen'] =  { img : "Infection%20Blue%20Essen.jpg" , virus : "blue" };
    deck['paris'] =  { img : "Infection%20Blue%20Paris.jpg" , virus : "blue" };
    deck['stpetersburg'] =  { img : "Infection%20Blue%20St.%20Petersburg.jpg" , virus : "blue" };
    deck['milan'] =  { img : "Infection%20Blue%20Milan.jpg" , virus : "blue" };
    deck['algiers'] =  { img : "Infection%20Black%20Algiers.jpg" , virus : "black" };
    deck['cairo'] =  { img : "Infection%20Black%20Cairo.jpg" , virus : "black" };
    deck['istanbul'] =  { img : "Infection%20Black%20Istanbul.jpg" , virus : "black" };
    deck['moscow'] =  { img : "Infection%20Black%20Moscow.jpg" , virus : "black" };
    deck['baghdad'] =  { img : "Infection%20Black%20Baghdad.jpg" , virus : "black" };
    deck['riyadh'] =  { img : "Infection%20Black%20Riyadh.jpg" , virus : "black" };
    deck['tehran'] =  { img : "Infection%20Black%20Tehran.jpg" , virus : "black" };
    deck['karachi'] =  { img : "Infection%20Black%20Karachi.jpg" , virus : "black" };
    deck['mumbai'] =  { img : "Infection%20Black%20Mumbai.jpg" , virus : "black" };
    deck['delhi'] =  { img : "Infection%20Black%20Delhi.jpg" , virus : "black" };
    deck['chennai'] =  { img : "Infection%20Black%20Chennai.jpg" , virus : "black" };
    deck['kolkata'] =  { img : "Infection%20Black%20Kolkata.jpg" , virus : "black" };
    deck['bangkok'] =  { img : "Infection%20Red%20Bangkok.jpg" , virus : "red" };
    deck['jakarta'] =  { img : "Infection%20Red%20Jakarta.jpg" , virus : "red" };
    deck['sydney'] =  { img : "Infection%20Red%20Sydney.jpg" , virus : "red" };
    deck['manila'] =  { img : "Infection%20Red%20Manila.jpg" , virus : "red" };
    deck['hochiminhcity'] =  { img : "Infection%20Red%20Ho%20Chi%20Minh%20City.jpg" , virus : "red" };
    deck['hongkong'] =  { img : "Infection%20Red%20Hong%20Kong.jpg" , virus : "red" };
    deck['taipei'] =  { img : "Infection%20Red%20Taipei.jpg" , virus : "red" };
    deck['shanghai'] =  { img : "Infection%20Red%20Shanghai.jpg" , virus : "red" };
    deck['beijing'] =  { img : "Infection%20Red%20Beijing.jpg" , virus : "red" };
    deck['seoul'] =  { img : "Infection%20Red%20Seoul.jpg" , virus : "red" };
    deck['tokyo'] =  { img : "Infection%20Red%20Tokyo.jpg" , virus : "red" };
    deck['osaka'] = { img : "Infection%20Red%20Osaka.jpg" , virus : "red" };
  
    return deck;
  
  }
  returnRoleCards() {
  
    var deck = {};
  
    deck['osaka'] = { img : "card_osaka.jpg" };
  
    return deck;
  
  }
  
  returnPlayerCards() {
  
    var deck = {};
  
    deck['sanfrancisco'] = { img : "Card%20Blue%20San%20Francisco.jpg" , name : "San Francisco" , virus : "blue" }
    deck['chicago'] =  { img : "Card%20Blue%20Chicago.jpg" , name : "Chicago" , virus : "blue" }
    deck['montreal'] =  { img : "Card%20Blue%20Toronto.jpg"  , name : "Montreal" , virus : "blue" };
    deck['newyork'] =  { img : "Card%20Blue%20New%20York.jpg"  , name : "New York" , virus : "blue" };
    deck['washington'] =  { img : "Card%20Blue%20Washington.jpg" , name : "Washington" , virus : "blue" };
    deck['atlanta'] =  { img : "Card%20Blue%20Atlanta.jpg" , name : "Atlanta" , virus : "blue" };
    deck['london'] =  { img : "Card%20Blue%20London.jpg" , name : "London" , virus : "blue" };
    deck['madrid'] =  { img : "Card%20Blue%20Madrid.jpg" , name : "Madrid" , virus : "blue" };
    deck['essen'] =  { img : "Card%20Blue%20Essen.jpg" , name : "Essen" , virus : "blue" };
    deck['paris'] =  { img : "Card%20Blue%20Paris.jpg" , name : "Paris" , virus : "blue" };
    deck['stpetersburg'] =  { img : "Card%20Blue%20St.%20Petersburg.jpg" , name : "St. Petersburg" , virus : "blue" };
    deck['milan'] =  { img : "Card%20Blue%20Milan.jpg" , name : "Milan" , virus : "blue" };
    deck['losangeles'] =  { img : "Card%20Yellow%20Los%20Angeles.jpg" , name : "Los Angeles" , virus : "yellow" };
    deck['mexicocity'] =  { img : "Card%20Yellow%20Mexico%20City.jpg" , name : "Mexico City" , virus : "yellow" };
    deck['miami'] =  { img : "Card%20Yellow%20Miami.jpg" , name : "Miami" , virus : "yellow" };
    deck['bogota'] =  { img : "Card%20Yellow%20Bogota.jpg" , name : "Bogota" , virus : "yellow" };
    deck['lima'] =  { img : "Card%20Yellow%20Lima.jpg" , name : "Lima" , virus : "yellow" };
    deck['santiago'] =  { img : "Card%20Yellow%20Santiago.jpg" , name : "Santiago" , virus : "yellow" };
    deck['buenosaires'] =  { img : "Card%20Yellow%20Buenos%20Aires.jpg" , name : "Buenos Aires" , virus : "yellow" };
    deck['saopaulo'] =  { img : "Card%20Yellow%20Sao%20Paulo.jpg" , name : "Sao Paulo" , virus : "yellow" };
    deck['lagos'] =  { img : "Card%20Yellow%20Lagos.jpg" , name : "Lagos" , virus : "yellow" };
    deck['khartoum'] =  { img : "Card%20Yellow%20Khartoum.jpg" , name : "Khartoum" , virus : "yellow" };
    deck['kinshasa'] =  { img : "Card%20Yellow%20Kinsasha.jpg" , name : "Kinshasa" , virus : "yellow" };
    deck['johannesburg'] =  { img : "Card%20Yellow%20Johannesburg.jpg" , name : "Johannesburg" , virus : "yellow" };
    deck['algiers'] =  { img : "Card%20Black%20Algiers.JPG" , name : "Algiers" , virus : "black" };
    deck['cairo'] =  { img : "Card%20Black%20Cairo.jpg" , name : "Cairo" , virus : "black" };
    deck['istanbul'] =  { img : "Card%20Black%20Istanbul.jpg" , name : "Istanbul" , virus : "black" };
    deck['moscow'] =  { img : "Card%20Black%20Moscow.jpg" , name : "Moscow" , virus : "black" };
    deck['baghdad'] =  { img : "Card%20Black%20Baghdad.jpg" , name : "Baghdad" , virus : "black" };
    deck['riyadh'] =  { img : "Card%20Black%20Riyadh.jpg" , name : "Riyadh" , virus : "black" };
    deck['tehran'] =  { img : "Card%20Black%20Tehran.jpg" , name : "Tehran" , virus : "black" };
    deck['karachi'] =  { img : "Card%20Black%20Karachi.jpg" , name : "Karachi" , virus : "black" };
    deck['mumbai'] =  { img : "Card%20Black%20Mumbai.jpg" , name : "Mumbai" , virus : "black" };
    deck['delhi'] =  { img : "Card%20Black%20Delhi.jpg" , name : "New Delhi" , virus : "black" };
    deck['chennai'] =  { img : "Card%20Black%20Chennai.jpg" , name : "Chennai" , virus : "black" };
    deck['kolkata'] =  { img : "Card%20Black%20Kolkata.jpg" , name : "Kolkata" , virus : "black" };
    deck['bangkok'] =  { img : "Card%20Red%20Bangkok.jpg" , name : "Bangkok" , virus : "red" };
    deck['jakarta'] =  { img : "Card%20Red%20Jakarta.jpg" , name : "Jakarta" , virus : "red" };
    deck['sydney'] =  { img : "Card%20Red%20Sydney.jpg" , name : "Sydney" , virus : "red" };
    deck['manila'] =  { img : "Card%20Red%20Manila.jpg" , name : "Manila" , virus : "red" };
    deck['hochiminhcity'] =  { img : "Card%20Red%20Ho%20Chi%20Minh%20City.jpg" , name : "Ho Chi Minh City" , virus : "red" };
    deck['hongkong'] =  { img : "Card%20Red%20Hong%20Kong.jpg" , name : "Hong Kong" , virus : "red" };
    deck['taipei'] =  { img : "Card%20Red%20Taipei.jpg" , name : "Taipei" , virus : "red" };
    deck['shanghai'] =  { img : "Card%20Red%20Shanghai.jpg" , name : "Shanghai" , virus : "red" };
    deck['beijing'] =  { img : "Card%20Red%20Beijing.jpg" , name : "Beijing" , virus : "red" };
    deck['seoul'] =  { img : "Card%20Red%20Seoul.jpg" , name : "Seoul" , virus : "red" };
    deck['tokyo'] =  { img : "Card%20Red%20Tokyo.jpg" , name : "Tokyo" , virus : "red" };
    deck['osaka'] = { img : "Card%20Red%20Osaka.jpg" , name : "Osaka" , virus : "red" };
  
    return deck;
  
  }
  
  displayOutbreaks() {
  
    let t = 982;
    let l = 90;
  
    if (this.game.state.infection_rate == 0) {
      t = 982;
      l = 90;
    }
  
    if (this.game.state.infection_rate == 1) {
      t = 1067;
      l = 188;
    }
  
    if (this.game.state.infection_rate == 2) {
      t = 1142;
      l = 90;
    }
  
    if (this.game.state.infection_rate == 3) {
      t = 1224;
      l = 188;
    }
  
    if (this.game.state.infection_rate == 4) {
      t = 1302;
      l = 90;
    }
  
    if (this.game.state.infection_rate == 5) {
      t = 1380;
      l = 188;
    }
  
    if (this.game.state.infection_rate == 6) {
      t = 1452;
      l = 90;
    }
  
    if (this.game.state.infection_rate == 7) {
      t = 1530;
      l = 188;
    }
  
    if (this.game.state.infection_rate == 8) {
      t = 1606;
      l = 90;
    }
  
    $('.marker_outbreak').css('top', this.scale(t)+"px");
    $('.marker_outbreak').css('left', this.scale(l)+"px");
  
  
  }
  displayDecks() {
  
    if (this.game.state.infection_topcard != "") {
      let imgurl = 'url("/pandemic/img/'+this.game.deck[0].cards[this.game.state.infection_topcard].img+'")';
      $('.infection_discard_pile').css('background-image', imgurl);
    }
  
    if (this.game.state.player_topcard != "") {
      let imgurl = 'url("/pandemic/img/'+this.game.deck[1].cards[this.game.state.player_topcard].img+'")';
      $('.player_discard_pile').css('background-image', imgurl);
    }
  
  }
  displayDisease() {
  
    for (var i in this.game.cities) {
  
      let divname = "#"+i;
      let width = 100;
      let cubedeath = '';
  
  
      //
      // YELLOW 
      //
      let cubes = this.game.cities[i].virus.yellow;
      if (cubes > 0) {
  
        let starting_point = width / 2;
        let cube_gap = 50;
        if (cubes > 1) {
          starting_point = 0;
          cube_gap = (width / cubes) - 10;
        }
  
        for (let z = 0; z < cubes; z++) {
          cubedeath += '<img class="cube" src="/pandemic/img/cube_yellow.png" style="position:absolute;top:-'+this.scale(20)+'px;left:'+this.scale(starting_point)+'px;" />';
          starting_point += cube_gap;
        }
      }
  
  
      //
      // RED
      //
      cubes = this.game.cities[i].virus.red;
      if (cubes > 0) {
  
        let starting_point = width / 2;
        let cube_gap = 50;
        if (cubes > 1) {
          starting_point = 0;
          cube_gap = (width / cubes) - 10;
        }
  
        for (let z = 0; z < cubes; z++) {
          cubedeath += '<img class="cube" src="/pandemic/img/cube_red.png" style="position:absolute;top:'+this.scale(starting_point)+'px;left:'+this.scale(80)+'px;" />';
          starting_point += cube_gap;
        }
      }
  
  
  
      //
      // BLUE
      //
      cubes = this.game.cities[i].virus.blue;
      if (cubes > 0) {
  
        let starting_point = width / 2;
        let cube_gap = 50;
        if (cubes > 1) {
          starting_point = 0;
          cube_gap = (width / cubes) - 10;
        }
  
        for (let z = 0; z < cubes; z++) {
          cubedeath += '<img class="cube" src="/pandemic/img/cube_blue.png" style="position:absolute;top:'+this.scale(80)+'px;left:'+this.scale(starting_point)+'px;" />';
          starting_point += cube_gap;
        }
      }
  
  
      //
      // BLACK 
      //
      cubes = this.game.cities[i].virus.black;
      if (cubes > 0) {
  
        let starting_point = width / 2;
        let cube_gap = 50;
        if (cubes > 1) {
          starting_point = 0;
          cube_gap = (width / cubes) - 10;
        }
  
        for (let z = 0; z < cubes; z++) {
          cubedeath += '<img class="cube" src="/pandemic/img/cube_black.png" style="position:absolute;top:'+this.scale(starting_point)+'px;left:-'+this.scale(20)+'px;" />';
          starting_point += cube_gap;
        }
      }
  
      $(divname).html(cubedeath);
    }
  
  }
  displayVials() {
  
    let w = 82;
    let h = 102;
  
    $('.vial_yellow').css('top', this.scale(1703)+"px");
    $('.vial_yellow').css('left', this.scale(816)+"px");
    $('.vial_red').css('top', this.scale(1703)+"px");
    $('.vial_red').css('left', this.scale(936)+"px");
    $('.vial_blue').css('top', this.scale(1703)+"px");
    $('.vial_blue').css('left', this.scale(1068)+"px");
    $('.vial_black').css('top', this.scale(1703)+"px");
    $('.vial_black').css('left', this.scale(1182)+"px");
  
    if (this.game.state.yellow_cure == 1) {
      $('.vial_yellow').css('background-image','url("/pandemic/img/Vial%20Yellow%20Eradicated.png")');
    }
    if (this.game.state.blue_cure == 1) {
      $('.vial_blue').css('background-image','url("/pandemic/img/Vial%20Blue%20Eradicated.png")');
    }
    if (this.game.state.black_cure == 1) {
      $('.vial_black').css('background-image','url("/pandemic/img/Vial%20Black%20Eradicated.png")');
    }
    if (this.game.state.red_cure == 1) {
      $('.vial_red').css('background-image','url("/pandemic/img/Vial%20Red%20Eradicated.png")');
    }
  
  }
  displayPlayers() {
  
    for (let i = 0; i < this.game.players_info.length; i++) {
    
      let imgurl = 'url("/pandemic/img/'+this.game.players_info[i].pawn+'")';
      let divname = ".player"+(i+1);
  
      let city = this.game.players_info[i].city;
      
      let t = this.game.cities[city].top;
      let l = this.game.cities[city].left + (i*30);
  
      $(divname).css('top', this.scale(t)+"px");
      $(divname).css('left', this.scale(l)+"px");
  
      $(divname).css('background-image', imgurl);
  
    }
  
    for (let i = this.game.players_info.length; i < 6; i++) {
      let divname = ".player"+(i+1);
      $(divname).css('display', 'none');
    }
  
  }
  displayResearchStations() {
  
    for (let i = 0; i < this.game.state.research_stations.length; i++) {
    
      let divname = ".research_station"+(i+1);
  
      let city = this.game.state.research_stations[i];
      
      let t = this.game.cities[city].top + 25;
      let l = this.game.cities[city].left + 25;
  
      $(divname).css('top', this.scale(t)+"px");
      $(divname).css('left', this.scale(l)+"px");
      $(divname).css('display', 'block');
  
    }
  
  }
  displayInfectionRate() {
  
    let t = 350;
    let l = 1650;
  
    if (this.game.state.infection_rate == 1) {
      t = 350;
      l = 1745;
    }
  
    if (this.game.state.infection_rate == 2) {
      t = 350;
      l = 1840;
    }
  
    if (this.game.state.infection_rate == 3) {
      t = 350;
      l = 1935;
    }
  
    if (this.game.state.infection_rate == 4) {
      t = 350;
      l = 2030;
    }
  
    if (this.game.state.infection_rate == 5) {
      t = 350;
      l = 2125;
    }
  
    if (this.game.state.infection_rate == 6) {
      t = 350;
      l = 2220;
    }
  
    if (this.game.state.infection_rate == 7) {
      t = 350;
      l = 2315;
    }
  
    $('.marker_infection_rate').css('top', this.scale(t)+"px");
    $('.marker_infection_rate').css('left', this.scale(l)+"px");
  
  }
  showBoard() {
  
    //
    //
    $('.back_player_card').css('top', this.scale(1390)+"px");
    $('.back_player_card').css('left', this.scale(1595)+"px");
  
    $('.back_infection_card').css('top', this.scale(65)+"px");
    $('.back_infection_card').css('left', this.scale(1590)+"px");
  
    $('.player_discard_pile').css('top', this.scale(1390)+"px");
    $('.player_discard_pile').css('left', this.scale(1960)+"px");
  
  //  $('.infection_deck').css('top', this.scale(800)+"px");
  //  $('.infection_deck').css('left', this.scale(800)+"px");
  
    $('.infection_discard_pile').css('top', this.scale(65)+"px");
    $('.infection_discard_pile').css('left', this.scale(2040)+"px");
  
    this.displayInfectionRate();
    this.displayOutbreaks();
    this.displayDisease();
    this.displayPlayers();
    this.displayResearchStations();
  
    this.displayDecks();
    this.displayVials();
  
  }
  
  
  
  
  
  returnCardList(cardarray=[], cardtype="city") {
  
    let hand = this.game.players_info[this.game.player-1].cards;
    let html = "";
  
    if (cardarray.length == 0) {
      for (let i = 0; i < hand.length; i++) {
        cardarray.push(this.game.cities[hand[i]].name);
      }
    }
  
    if (this.interface == 1) {
      for (i = 0; i < cardarray.length; i++) {
        html += this.returnCardItem(cardarray[i], cardtype);
      }
      html = `
        <div class="display-cards display-cards-status">
          ${html}
        </div>`;
    } else {
  
      html = "<ul>";
      for (i = 0; i < cardarray.length; i++) {
        html += this.returnCardItem(cardarray[i], cardtype);
      }
      html += '</ul>';
  
    }
  
    return html;
  
  }
  
  
  
  returnCardItem(card, cardtype="city") {
  
    if (this.interface == 1) {
      if (this.game.cities[card] == undefined) {
        return `<div id="${card.replace(/ /g,'')}" class="card cardbox-hud-image showcard cardbox-hud cardbox-hud-status">${this.returnCardImage(card, cardtype)}</div>`;
      }
      return `<div id="${card.replace(/ /g,'')}" class="card cardbox-hud-image showcard cardbox-hud cardbox-hud-status">${this.returnCardImage(card, cardtype)}</div>`;
    } else {
      if (this.game.cities[card] == undefined) {
        return '<li class="card" id="'+card+'">'+this.game.cities[card].name+'</li>';
      }
      return '<li class="card" id="'+card+'">'+this.game.cities[card].name+'</li>';
    }
  
  }
  
  



  updateStatusAndListCards(message, cards=null) {
  
    if (cards == null) {
      cards = this.game.players_info[this.game.player-1].cards;
    }
  
    html = `
      <div class="cardbox-status-container">
        <div>${message}</div>
        ${this.returnCardList(cards, "city")}
      </div>
    `
  
    this.updateStatus(html);
    this.addShowCardEvents();
  
  }


  

  addShowCardEvents() {
  
    let pandemic_self = this;
  
    if (!this.app.browser.isMobileBrowser(navigator.userAgent)) {
  
      $('.showcard').off();
      $('.showcard').mouseover(function() {
        let card = $(this).attr("id");
        pandemic_self.showCard(card);
      }).mouseout(function() {
        let card = $(this).attr("id");
        pandemic_self.hideCard(card);
      });
  
    }
  
  }
  addLogCardEvents() {
  
    let pandemic_self = this;
  
    if (!this.app.browser.isMobileBrowser(navigator.userAgent)) {
  
      $('.logcard').off();
      $('.logcard').mouseover(function() {
        let card = $(this).attr("id");
        pandemic_self.showCard(card);
      }).mouseout(function() {
        let card = $(this).attr("id");
        pandemic_self.hideCard(card);
      });
  
    }
  
  }
  returnCardImage(cardname, cardtype="city") {
  
    var c = "";
    if (cardtype == "city") { c = this.game.deck[1].cards[cardname]; }
    if (cardtype == "infection") { c = this.game.deck[0].cards[cardname]; }
    
    var html = `<img class="cardimg" src="/pandemic/img/${c.img}" />`;
    return html;
  
  }
  
  hideCard(cardname="") {
    $('#cardbox').hide();
  }
  
  showCard(cardname, cardtype="city") {
  
    let url = this.returnCardImage(cardname, cardtype);
  
    //
    // mobile needs recentering
    //
    if (this.app.browser.isMobileBrowser(navigator.userAgent)) {
      // add additional html
      url += `
      <div id="cardbox-exit-background">
      <div class="cardbox-exit" id="cardbox-exit">×</div>
      </div>
      <div class="cardbox_menu_playcard cardbox_menu_btn" id="cardbox_menu_playcard">PLAY</div>`
      $('.cardbox-exit').show();
    }
  
    $('#cardbox').html(url);
    $('#cardbox').show();
  }
  
  removeCardFromHand(plyr, card) {
  
    let player = this.game.players_info[plyr-1];
    let cards = player.cards;
  
    for (let i = 0; i < cards.length; i++) {
      if (cards[i] == card) {
        cards.splice(i, 1);
        this.hideCard();
        return;
      }
    }
  
  }
  
  
  
  
  
  returnGameOptionsHTML() {
  
    return `
          <h3>Pandemic: </h3>
  
          <form id="options" class="options" style="">

            <label for="difficulty">Difficulty:</label>
            <select name="difficulty">
              <option value="easy">easy</option>
              <option value="medium" default>not so easy</option>
              <option value="hard">damn hard</option>
            </select>

            <label for="player1">Player 1:</label>
            <select name="player1">
              <option value="random" default>random</option>
              <option value="generalist" default>generalist</option>
              <option value="scientist">scientist</option>
              <option value="medic">medic</option>
              <option value="operationsexpert">operations expert</option>
            </select>
  
            <label for="player2">Player 2:</label>
            <select name="player2">
              <option value="random" default>random</option>
              <option value="generalist" default>generalist</option>
              <option value="scientist">scientist</option>
              <option value="medic">medic</option>
              <option value="operationsexpert">operations expert</option>
            </select>

            <label for="player3" class="game-players-options game-players-options-3p">Player 3:</label>
            <select name="player3" id="game-players-select-3p" class="game-players-options game-players-options-3p">
              <option value="random" default>random</option>
              <option value="generalist" default>generalist</option>
              <option value="scientist">scientist</option>
              <option value="medic">medic</option>
              <option value="operationsexpert">operations expert</option>
            </select>

            <label for="player4" class="game-players-options game-players-options-4p">Player 4:</label>
            <select name="player4" id="game-players-select-4p" class="game-players-options game-players-options-4p">
              <option value="random" default>random</option>
              <option value="generalist" default>generalist</option>
              <option value="scientist">scientist</option>
              <option value="medic">medic</option>
              <option value="operationsexpert">operations expert</option>
            </select>
  
  	</form>
  
  	`;
  
  }
  
  
  
  returnQuickLinkGameOptions(options) {
  
    let new_options = {};
    let player1 = "";
    let player2 = "";
  
    for (var index in options) {
      if (index == "player1") {
        player1 = options[index];
      }
      if (index == "player2") {
        player2 = options[index];
      }
    }
  
    for (var index in options) { new_options[index] = options[index]; }
    new_options['player1'] = player2;
    new_options['player2'] = player1;
  
    return new_options;
  
  }
  
  
  highlightActivePlayerTurn(num=1) {
  
    for (let i = 1; i <= this.game.players_info.length; i++) {
      let active_player = ".player"+i+"_role_card";
      if (i == num) {
        $(active_player).css('border','5px solid #FFF');
      } else {
        $(active_player).css('border','5px solid #444');
      }
    }
  
  }
  
  
}
module.exports = Pandemic;


  
