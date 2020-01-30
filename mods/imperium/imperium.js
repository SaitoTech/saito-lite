const GameHud = require('../../lib/templates/lib/game-hud/game-hud'); 
const GameTemplate = require('../../lib/templates/gametemplate');
  
class Imperium extends GameTemplate {
  
  constructor(app) {
  
    super(app);
  
    this.name            = "Imperium";
    this.slug		 = "imperium";
    this.description     = `Red Imperium is a multi-player space exploration and conquest simulator. Each player controls a unique faction vying for political control of the galaxy in the waning days of a dying Empire.`;
    this.categories	 = "Arcade Games Entertainment";
    this.minPlayers      = 2;
    this.maxPlayers      = 4;  

    this.gameboardWidth  = 1900;
  
    this.rmoves          = [];
    this.totalPlayers    = 2;

    this.game.confirms_needed 	= 0;
    this.game.confirms_received = 0;
    this.game.confirms_players  = [];

    this.minPlayers = 3;
    this.maxPlayers = 6;
    this.type       = "Strategy Boardgame";

    this.hud = new GameHud(this.app, this.menuItems());

  
    //
    // game-related
    //
    this.assigns = [];  // floating units needing assignment to ships
    this.tracker = {};  // track options in turn
  
    return this;
  
  }
  
  
  
  

  //
  // manually add arcade banner support
  //
  respondTo(type) {

    if (super.respondTo(type) != null) {
      return super.respondTo(type);
    }

    if (type == "arcade-carousel") {
      let obj = {};
      obj.background = "/imperium/img/arcade/arcade-banner-background.png";
      obj.title = "Red Imperium";
      return obj;
    }

    return null;

  }


  
  
  /////////////////
  /// HUD MENUS ///
  /////////////////
  menuItems() {
    return {
      'game-planets': {
        name: 'Planets',
        callback: this.handlePlanetsMenuItem.bind(this)
      },
      'game-tech': {
        name: 'Tech',
        callback: this.handleTechMenuItem.bind(this)
      },
      'game-player': {
        name: 'Trade',
        callback: this.handleTradeMenuItem.bind(this)
      },
      'game-player': {
        name: 'Laws',
        callback: this.handleLawsMenuItem.bind(this)
      },
    }
  }




  handlePlanetsMenuItem() {
  
    let imperium_self = this;
    let factions = this.returnFactions();
    let html =
    `
      <div id="menu-container">
        <div style="margin-bottom: 1em">
          The Planetary Empires:
        </div>
        <ul>
     `;
    for (let i = 0; i < this.game.players_info.length; i++) {
      html += `  <li class="card" id="${i}">${factions[this.game.players_info[i].faction].name}</li>`;
    }
    html += `
        </ul>
      </div>
    `
    $('.hud-menu-overlay').html(html);
    $('.hud-menu-overlay').show();
    $('.status').hide();
  
    //
    // leave action enabled on other panels
    //
    $('.card').on('click', function() {
  
      let player_action = $(this).attr("id");
      let array_of_cards = imperium_self.returnPlayerPlanetCards(player_action+1); // all
  
      let html  = "<ul>";
      for (let z = 0; z < array_of_cards.length; z++) {
        if (imperium_self.game.planets[array_of_cards[z]].exhausted == 1) {
          html += '<li class="cardchoice exhausted" id="cardchoice_'+array_of_cards[z]+'">' + imperium_self.returnPlanetCard(array_of_cards[z]) + '</li>';
        } else {
          html += '<li class="cardchoice" id="cardchoice_'+array_of_cards[z]+'">' + imperium_self.returnPlanetCard(array_of_cards[z]) + '</li>';
        }
      }
      html += '</ul>';
  
      $('.hud-menu-overlay').html(html);
      $('.hud-menu-overlay').show();
  
    });
  }
  
  


 
  handleTechMenuItem() {
  
    let imperium_self = this;
    let factions = this.returnFactions();
    let html =
    `
      <div id="menu-container">
        <div style="margin-bottom: 1em">
          The Technological Empires:
        </div>
        <ul>
     `;
    for (let i = 0; i < this.game.players_info.length; i++) {
    html += `  <li class="card" id="${i}">${factions[this.game.players_info[i].faction].name}</li>`;
    }
    html += `
        </ul>
      </div>
    `
    $('.hud-menu-overlay').html(html);
    $('.hud-menu-overlay').show();
    $('.status').hide();
  
    //
    // leave action enabled on other panels
    //
    $('.card').on('click', function() {
  
      let p = $(this).attr("id");
      let tech = imperium_self.game.players_info[p].tech;
  
      let html  = "<ul>";
      for (let z = 0; z < tech.length; z++) {
        html += '<li class="cardchoice" id="">' + tech[z] + '</li>';
      }
      html += '</ul>';
  
      $('.hud-menu-overlay').html(html);
  
    });
  }
  




  
  handleTradeMenuItem() {
  
    let imperium_self = this;
    let factions = this.returnFactions();
    let html =
    `
      <div id="menu-container">
        <div style="margin-bottom: 1em">
          The Commercial Empires:
        </div>
        <ul>
     `;
    for (let i = 0; i < this.game.players_info.length; i++) {
    html += `  <li class="card" id="${i}">${factions[this.game.players_info[i].faction].name}</li>`;
    }
    html += `
        </ul>
      </div>
    `
    $('.hud-menu-overlay').html(html);
    $('.hud-menu-overlay').show();
    $('.status').hide();
  
    //
    // leave action enabled on other panels
    //
    $('.card').on('click', function() {
  
      let p = $(this).attr("id");
      let commodities_total = imperium_self.game.players_info[p].commodities;
      let goods_total = imperium_self.game.players_info[p].goods;
      let fleet_total = imperium_self.game.players_info[p].fleet_supply;
      let command_total = imperium_self.game.players_info[p].command_tokens;
      let strategy_total = imperium_self.game.players_info[p].strategy_tokens;
  
      let html  = "Total Faction Resources: <p></p><ul>";
      html += '<li>' + commodities_total + " commodities" + '</li>';
      html += '<li>' + goods_total + " goods" + '</li>'
      html += '<li>' + command_total + " command tokens" + '</li>'
      html += '<li>' + strategy_total + " strategy tokens" + '</li>'
      html += '<li>' + fleet_total + " fleet supply" + '</li>'
      html += '</ul>';
  
      $('.hud-menu-overlay').html(html);
  
    });
  }




  handleLawsMenuItem() {
  
    let imperium_self = this;
    let laws = this.returnAgendaCards();
    let html = '<div id="menu-container">';
  
    if (this.game.state.laws.length > 0) {
      html += '<div style="margin-bottom: 1em">Galactic Laws Under Enforcement:</div>';
      html += '<ul>';
      for (let i = 0; i < this.game.state.laws.length; i++) {
        html += `  <li class="card" id="${i}">${laws[this.game.state.laws[i]].name}</li>`;
      }
      html += '</ul>';
      html += '<p></p>';
    }
  
    if (this.game.state.agendas.length > 0) {
      html += '<div style="margin-bottom: 1em">Galactic Laws Under Consideration:</div>';
      html += '<ul>';
      for (let i = 0; i < this.game.state.agendas.length; i++) {
        html += `  <li class="card" id="${i}">${laws[this.game.state.agendas[i]].name}</li>`;
      }
      html += '</ul>';
    }
  
    if (this.game.state.laws.length == 0 && this.game.state.agendas.length == 0) {
      html += 'There are no laws in force or agendas up for consideration at this time.';
    }
  
    html += '</div>';
  
    $('.hud-menu-overlay').html(html);
    $('.hud-menu-overlay').show();
    $('.status').hide();
  
  }
  



  
  
  
  ////////////////////
  // initializeGame //
  ////////////////////
  async initializeGame(game_id) {

    this.updateStatus("loading game...");
    this.loadGame(game_id);

    if (this.game.status != "") { this.updateStatus(this.game.status); }
  
    //
    // specify players
    //
    this.totalPlayers = this.game.players.length;  

    //
    // position non-hex pieces
    //
    $('.agendabox').css('width', this.gameboardWidth);
  
    //
    // create new board
    //
    if (this.game.board == null) {
  
      this.game.board = {};
      for (let i = 1, j = 4; i <= 7; i++) {
        for (let k = 1; k <= j; k++) {
          let slot      = i + "_" + k;
  	this.game.board[slot] = { tile : "" };
        }
        if (i < 4) { j++; };
        if (i >= 4) { j--; };
      }
  
      //
      // dice
      //
      this.initializeDice();
  
      //
      // units are stored in within systems / planets
      //
      this.game.players_info = this.returnPlayers(this.totalPlayers); // factions and player info
      this.game.systems = this.returnSystems();
      this.game.planets = this.returnPlanets();
      this.game.tech    = this.returnTechnologyTree();
      this.game.state   = this.returnState();
      this.game.state.strategy_cards = [];
      let x = this.returnStrategyCards();
      for (let i in x) { this.game.state.strategy_cards.push(i); this.game.state.strategy_cards_bonus.push(0); }
  
      //
      // put homeworlds on board
      //
      let factions = this.returnFactions();
      let hwsectors = this.returnHomeworldSectors(this.game.players_info.length);
console.log("HWSECTORS: ");
console.log(JSON.stringify(hwsectors));
console.log("PLAYERS INFO: ");
console.log(JSON.stringify(this.game.players_info));
console.log("FACTIONS: ");
console.log(JSON.stringify(factions));

      for (let i = 0; i < this.game.players_info.length; i++) {
console.log("setting homeworld: " + i);
        this.game.players_info[i].homeworld = hwsectors[i];
console.log("DOES THE TILE EXIST: " + JSON.stringify(this.game.board[hwsectors[i]].tile));
console.log("FACTION IDX: " + this.game.players_info[i].faction);
        this.game.board[hwsectors[i]].tile = factions[this.game.players_info[i].faction].homeworld;
      }
  
      //
      // remove tiles in 3 player game
      //
      if (this.totalPlayers <= 3) {
        $('#1_3').attr('id', '');
        delete this.game.board["1_3"];
        $('#1_4').attr('id', '');
        delete this.game.board["1_4"];
        $('#2_5').attr('id', '');
        delete this.game.board["2_5"];
        $('#3_1').attr('id', '');
        delete this.game.board["3_1"];
        $('#4_1').attr('id', '');
        delete this.game.board["4_1"];
        $('#5_1').attr('id', '');
        delete this.game.board["5_1"];
        $('#6_5').attr('id', '');
        delete this.game.board["6_5"];
        $('#7_3').attr('id', '');
        delete this.game.board["7_3"];
        $('#7_4').attr('id', '');
        delete this.game.board["7_4"];
      }
  
  
      //
      // add other planet tiles
      //
      let tmp_sys = this.returnSystems();
      let seltil = [];
  
  
      //
      // empty space in board center
      //
      this.game.board["4_4"].tile = "new-byzantium";
  
      for (let i in this.game.board) {
        if (i != "4_4" && !hwsectors.includes(i)) {
          let oksel = 0;
          var keys = Object.keys(tmp_sys);
          while (oksel == 0) {
            let rp = keys[this.rollDice(keys.length)-1];
            if (this.game.systems[rp].hw != 1 && seltil.includes(rp) != 1 && this.game.systems[rp].mr != 1) {
              seltil.push(rp);
              delete tmp_sys[rp];
              this.game.board[i].tile = rp;
              oksel = 1;
            }
          }
        }
      }
  
      //
      // add starting units to player homewords
      //
      for (let i = 0; i < this.totalPlayers; i++) {
  
        let sys = this.returnSystemAndPlanets(hwsectors[i]); 
  
        let strongest_planet = 0;
        let strongest_planet_resources = 0;
        for (z = 0; z < sys.p.length; z++) {
  	sys.p[z].owner = (i+1);
   	if (sys.p[z].resources < strongest_planet_resources) {
  	  strongest_planet = z;
  	  strongest_planet_resources = sys.p[z].resources;
  	}
        }
  
        this.addSpaceUnit(i + 1, hwsectors[i], "cruiser");
        //this.addSpaceUnit(i + 1, hwsectors[i], "flagship");
        //this.addSpaceUnit(i + 1, hwsectors[i], "dreadnaught");
        this.addSpaceUnit(i + 1, hwsectors[i], "destroyer");
        this.addSpaceUnit(i + 1, hwsectors[i], "carrier");
        //this.addSpaceUnit(i + 1, hwsectors[i], "fighter");
        this.addSpaceUnit(i + 1, hwsectors[i], "fighter");
        this.loadUnitOntoPlanet(i + 1, hwsectors[i], strongest_planet, "infantry");
        this.loadUnitOntoPlanet(i + 1, hwsectors[i], strongest_planet, "infantry");
        this.loadUnitOntoPlanet(i + 1, hwsectors[i], strongest_planet, "infantry");
        //this.loadUnitOntoPlanet(i + 1, hwsectors[i], strongest_planet, "infantry");
        this.loadUnitOntoPlanet(i + 1, hwsectors[i], strongest_planet, "pds");
        this.loadUnitOntoPlanet(i + 1, hwsectors[i], strongest_planet, "spacedock");
  
        this.saveSystemAndPlanets(sys);
  
      }
    }
  
  
  
    //
    // display board
    //
    for (let i in this.game.board) {
  
      // add html to index
      let boardslot = "#" + i;
      $(boardslot).html(this.returnTile(i));
  
      // insert planet
      let planet_div = "#hex_img_"+i;
      $(planet_div).attr("src", this.game.systems[this.game.board[i].tile].img);
  
      this.updateSectorGraphics(i);
  
    }
  
  
    this.updateAgendaDisplay();
    this.updateLeaderboard();
          
  
    //
    // initialize game queue
    //
    if (this.game.queue.length == 0) {

console.log("hitting queue management!");  

      this.game.queue.push("turn");
      this.game.queue.push("newround");
  
      //
      // add cards to deck and shuffle as needed
      //
      this.game.queue.push("SHUFFLE\t1");
      this.game.queue.push("SHUFFLE\t2");
      this.game.queue.push("SHUFFLE\t3");
      this.game.queue.push("SHUFFLE\t4");
      this.game.queue.push("SHUFFLE\t5");
      this.game.queue.push("SHUFFLE\t6");
      for (let i = 0; i < this.game.players_info.length; i++) {
        this.game.queue.push("DEAL\t6\t"+(i+1)+"\t2");
      }
      this.game.queue.push("POOL\t3");   // stage ii objectives
      this.game.queue.push("POOL\t2");   // stage i objectives
      this.game.queue.push("POOL\t1");   // agenda cards
      this.game.queue.push("DECK\t1\t"+JSON.stringify(this.returnStrategyCards()));
      this.game.queue.push("DECK\t2\t"+JSON.stringify(this.returnActionCards()));	
      this.game.queue.push("DECK\t3\t"+JSON.stringify(this.returnAgendaCards()));
      this.game.queue.push("DECK\t4\t"+JSON.stringify(this.returnStageIPublicObjectives()));
      this.game.queue.push("DECK\t5\t"+JSON.stringify(this.returnStageIIPublicObjectives()));
      this.game.queue.push("DECK\t6\t"+JSON.stringify(this.returnSecretObjectives()));
  
    }
  

    //
    // add events to board 
    //
    this.addEventsToBoard();
  
  }
  
  
  
  
  
  
  
  /////////////////////
  // Core Game Logic //
  /////////////////////
  handleGameLoop(msg=null) {
  
    let imperium_self = this;
    if (this.game.queue.length > 0) {
  
      imperium_self.saveGame(imperium_self.game.id);
  
      let qe = this.game.queue.length-1;
      let mv = this.game.queue[qe].split("\t");
      let shd_continue = 1;
  
console.log("GAME QUEUE: " + this.game.queue);

      if (mv[0] === "gameover") {
  	if (imperium_self.browser_active == 1) {
  	  alert("Game Over");
  	}
  	imperium_self.game.over = 1;
  	imperium_self.saveGame(imperium_self.game.id);
  	return;
      }
  


	//
	// resolve [action] [1] [publickey voting or 1 for agenda]
	//
      if (mv[0] === "resolve") {

        let le = this.game.queue.length-2;
        let lmv = [];
        if (le >= 0) {
	  lmv = this.game.queue[le].split("\t");
	}
  
	if (mv[1] == lmv[0]) {

  	  if (mv[2] != undefined) {
  
  	    this.game.confirms_received += parseInt(mv[2]);
  	    this.game.confirms_players.push(mv[3]);

  	    if (this.game.confirms_needed <= this.game.confirms_received) {

	      this.resetConfirmsNeeded(0);
    	      this.game.queue.splice(qe-1, 2);
  	      return 1;

  	    } else {

    	      this.game.queue.splice(qe, 1);

	      //
	      // we are waiting for a set number of confirmations
	      // but maybe we reloaded and still need to move
	      // in which case the instruction we need to run is 
	      // the last one.... 
	      //

	      if (mv[3] != undefined) {
	        if (!this.game.confirms_players.includes(this.app.wallet.returnPublicKey())) {
	  	  return 1;
	        }
                if (mv[1] == "agenda") {
		  return 1;
		}
	      }

  	      return 0;
            }
  
            return 0;
  
  	  } else {
    	    this.game.queue.splice(qe-1, 2);
  	    return 1;
	  }
        } else {

          //
          // remove the event
          //
          this.game.queue.splice(qe, 1);

          //
          // go back through the queue and remove any event tht matches this one
          //
          for (let z = le, zz = 1; z >= 0 && zz == 1; z--) {
            let tmplmv = this.game.queue[z].split("\t");
            if (tmplmv.length > 0) {
              if (tmplmv[0] === mv[1]) {
                this.game.queue.splice(z);
                zz = 0;
              }
            }
          }
	}
      } 
 


      if (mv[0] === "turn") {
  
  	this.game.state.turn++;
 
  	let new_round = 1;
        for (let i = 0; i < this.game.players_info.length; i++) {
  	  if (this.game.players_info[i].passed == 0) { new_round = 0; }
        }
  
  	//
  	// NEW TURN
  	//
  	if (new_round == 1) {
  	  this.game.queue.push("setinitiativeorder");
  	  this.game.queue.push("newround");
  	} else {
  	  this.game.queue.push("setinitiativeorder");
  	}
  
  	this.updateLeaderboard();
  
      }
  
     
      if (mv[0] == "vote") {

	let laws = this.returnAgendaCards();
        let agenda_num = mv[1];
	let player = mv[2];
	let vote = mv[3];
	let votes = parseInt(mv[4]);

	this.game.state.votes_cast[player-1] = votes;
	this.game.state.votes_available[player-1] -= votes;
	this.game.state.voted_on_agenda[player-1][this.game.state.voting_on_agenda] = 1;
	this.game.state.how_voted_on_agenda[player-1] = vote;

	let votes_finished = 0;
	for (let i = 0; i < this.game.players.length; i++) {
	  if (this.game.state.voted_on_agenda[i] != 0) { votes_finished++; }
	}


	//
	// everyone has voted
	//
	if (votes_finished == this.game.players.length) {

	  let votes_for = 0;
	  let votes_against = 0;
	  let direction_of_vote = "tie";
 	  let players_in_favour = [];
	  let players_opposed = [];

	  for (let i = 0; i < this.game.players.length; i++) {

	    if (this.game.state.how_voted_on_agenda[i] == "support") {
	      votes_for += this.game.state.votes_cast[i];
	      players_in_favour.push(i+1);
	    }
	    if (this.game.state.how_voted_on_agenda[i] == "oppose") {
	      votes_against += this.game.state.votes_cast[i];
	      players_opposed.push(i+1);
	    }
	    if (votes_against > votes_for) { direction_of_vote = "fails"; }
	    if (votes_against < votes_for) { direction_of_vote = "passes"; }	    
	  }

	  //
	  // announce if the vote passed
	  //
	  this.updateLog("The agenda "+direction_of_vote);
	 
	  //
	  //
	  //
	  if (direction_of_vote == "passes") {
	    laws[imperium_self.game.state.agendas[agenda_num]].onPass(imperium_self, players_in_favour, players_opposed, function(res) {
	      console.log("\n\nBACK FROM AGENDA ONPASS FUNCTION");
	    });
	  } else {
	    if (direction_of_vote == "fails") {
	      laws[imperium_self.game.state.agendas[agenda_num]].onPass(imperium_self, players_in_favour, players_opposed, function(res) {
	        console.log("\n\nBACK FROM AGENDA ONPASS FUNCTION");
	      });
	    } else {
	      this.updateLog("The law is quietly shelved...");
	    }
	  }


	
	  //
	  // prepare for next vote
	  //
	  for (let i = 0; i < this.game.players.length; i++) {
	    this.game.state.voted_on_agenda[i] = 0;
	  }
	  this.game.state.voting_on_agenda++;

	}

  	this.game.queue.splice(qe, 1);
  	return 1;

      }


      if (mv[0] == "agenda") {

	//
	// we repeatedly hit "agenda"
	//
	let laws = imperium_self.returnAgendaCards();
        let agenda_num = parseInt(mv[1]);
	let agenda_name = laws[imperium_self.game.state.agendas[agenda_num]].name;


        let who_is_next = 0;
        for (let i = 0; i < this.game.players.length; i++) {
          if (this.game.state.voted_on_agenda[i] == 0) { who_is_next = i+1; i = this.game.players.length; }
        }

	if (this.game.player != who_is_next) {

          let html  = 'The following agenda has advanced for consideration in the Galactic Senate:<p></p>';
  	      html += '<b>' + laws[imperium_self.game.state.agendas[agenda_num]].name + '</b>';
	      html += '<br />';
	      html += laws[imperium_self.game.state.agendas[agenda_num]].text;
	      html += '<p></p>';
	      html += 'Player '+who_is_next+' is now voting.';
	  this.updateStatus(html);

	} else {


          let html  = 'The following agenda has advanced for consideration in the Galactic Senate:<p></p>';
  	      html += '<b>' + laws[imperium_self.game.state.agendas[agenda_num]].name + '</b>';
	      html += '<br />';
  	      html += laws[imperium_self.game.state.agendas[agenda_num]].text;
	      html += '<p></p>';
              html += '<li class="option" id="support">support</li>';
              html += '<li class="option" id="oppose">oppose</li>';
              html += '<li class="option" id="abstain">abstain</li>';
	  imperium_self.updateStatus(html);


          $('.option').off();
          $('.option').on('click', function() {

            let vote = $(this).attr("id");
	    let votes = 0;
	
	    if (vote == "abstain") {

	      imperium_self.addMove("resolve\tagenda\t1\t"+imperium_self.app.wallet.returnPublicKey());
	      imperium_self.addMove("vote\t"+agenda_num+"\t"+imperium_self.game.player+"\t"+vote+"\t"+votes);
	      imperium_self.endTurn();
	      return 0;

	    }

	    if (vote == "support" || vote == "oppose") {

              let html = 'How many votes do you wish to cast in the Galactic Senate:<p></p>';
	      for (let i = 0; i <= imperium_self.game.state.votes_available[imperium_self.game.player-1]; i++) {
                if (i == 1) {
	          html += '<li class="option" id="'+i+'">'+i+' vote</li>';
                } else {
	          html += '<li class="option" id="'+i+'">'+i+' votes</li>';
	        }
	      }
	      imperium_self.updateStatus(html);

              $('.option').off();
              $('.option').on('click', function() {

                votes = $(this).attr("id");
 
  	        imperium_self.addMove("resolve\tagenda\t1\t"+imperium_self.app.wallet.returnPublicKey());
	        imperium_self.addMove("vote\t"+agenda_num+"\t"+imperium_self.game.player+"\t"+vote+"\t"+votes);
	        imperium_self.endTurn();
	        return 0;

	      });
	    }
	  });
	}

  	return 0;

      }


      if (mv[0] == "change_speaker") {
  
  	this.game.state.speaker = parseInt(mv[1]);
  	this.game.queue.splice(qe, 1);
  	return 1;
  
      }


      if (mv[0] == "setinitiativeorder") {

  	let initiative_order = this.returnInitiativeOrder();
  	this.game.queue.push("resolve\tsetinitiativeorder");

  	for (let i = 0; i < initiative_order.length; i++) {
  	  if (this.game.players_info[initiative_order[i]-1].passed == 0) {
  	    this.game.queue.push("play\t"+initiative_order[i]);
  	  }
  	}
 
  	return 1;
  
      }
  
      //
      // resetconfirmsneeded [confirms_before_continuing] [array \t of \t pkeys]
      //
      if (mv[0] == "resetconfirmsneeded") {

	let confirms = 1;
	if (parseInt(mv[1]) > 1) { confirms = parseInt(mv[1]); }
 	this.resetConfirmsNeeded(confirms);

	for (let i = 2; i < mv.length; i++) {
	  if (mv[i] != undefined) {
	    this.game.confirms_players.push(mv[i]);
	  }
	}

  	this.game.queue.splice(qe, 1);
  	return 1;

      }

      if (mv[0] == "tokenallocation") {
 	this.playerAllocateNewTokens(this.game.player, (this.game.players_info[this.game.player-1].new_tokens_per_round+this.game.players_info[this.game.player-1].new_token_bonus_when_issued));
  	return 0;
      }
  
  
      if (mv[0] === "newround") {
  
        //
  	// reset tech bonuses
  	//
        for (let i = 0; i < this.game.players_info.length; i++) {
          for (let ii = 0; ii < this.game.players_info[i].tech.length; ii++) {
            this.game.tech[this.game.players_info[i].tech[ii]].onNewRound();
  	  }
  	}
  
      	this.game.queue.push("resolve\tnewround");
    	this.game.state.round++;
    	this.updateLog("ROUND: " + this.game.state.round);
  	this.updateStatus("Moving into Round " + this.game.state.round);
  
  	//
  	// SCORING
  	//
        if (this.game.state.round_scoring == 0 && this.game.state.round > 1) {
          this.game.queue.push("strategy\t"+"empire"+"\t"+"-1"+"\t2\t"+1);
  	  this.game.state.round_scoring = 0;
  	} else {
  	  this.game.state.round_scoring = 0;
  	}
  
  	//
  	// RESET USER ACCOUNTS
  	//
        for (let i = 0; i < this.game.players_info.length; i++) {
  	  this.game.players_info[i].passed = 0;
	  this.game.players_info[i].strategy_cards_played = [];
        }


  	//
  	// REPAIR UNITS
  	//
  	this.repairUnits();
  
  	//
  	// set initiative order
  	//
        this.game.queue.push("setinitiativeorder");
  
  
  	//
  	// STRATEGY CARDS
  	//
        this.game.queue.push("playerschoosestrategycards");
 


  	//
  	// ACTION CARDS
  	//
  	for (let i = 1; i <= this.game.players_info.length; i++) {
          this.game.queue.push("DEAL\t2\t"+i+'\t'+(this.game.players_info[this.game.player-1].action_cards_per_round+this.game.players_info[this.game.player-1].action_cards_bonus_when_issued));
  	}
  	
  


  	//
  	// mark as ready 
  	//	  
  	if (this.game.initializing == 1) {
          this.game.queue.push("READY");
  	} else {
  	  //
  	  // ALLOCATE TOKENS
  	  //
          this.game.queue.push("tokenallocation\t"+this.game.players_info.length);
          this.game.queue.push("resetconfirmsneeded\t"+this.game.players_info.length);
	}
  

  	//
  	// FLIP NEW AGENDA CARDS
  	//
        this.game.queue.push("revealagendas");
        this.game.queue.push("notify\tFLIPCARD is completed!");
  	for (let i = 1; i <= this.game.players_info.length; i++) {
          this.game.queue.push("FLIPCARD\t3\t3\t1\t"+i); // deck card poolnum player
  	}


	//
	// DE-ACTIVATE SYSTEMS
	//
        this.deactivateSystems();
	

console.log("DECK FLIPPED: " + JSON.stringify(this.game.deck[2])); 

/***
  	//
  	// FLIP NEW OBJECTIVES
  	//
        if (this.game.state.round == 1) {
          this.game.queue.push("revealobjectives");
  	  for (let i = 1; i <= this.game.players_info.length; i++) {
            this.game.queue.push("FLIPCARD\t4\t8\t2\t"+i); // deck card poolnum player
  	  }
  	  for (let i = 1; i <= this.game.players_info.length; i++) {
            this.game.queue.push("FLIPCARD\t5\t8\t2\t"+i); // deck card poolnum player
  	  }
        }
***/

    	return 1;
  
      }
 

      if (mv[0] === "revealagendas") {
  
  	this.updateLog("revealing upcoming agendas...");
  
  	//
  	// reset agendas
  	//
  	this.game.state.agendas = [];
        for (i = 0; i < 3; i++) {
          this.game.state.agendas.push(this.game.pool[0].hand[i]);	
  	}
  
  	//
  	// reset pool
  	//
  	this.game.pool = [];
  	this.updateAgendaDisplay();
  	this.updateLeaderboard();
  	this.game.queue.splice(qe, 1);

  	return 1;
      }
  

      if (mv[0] === "revealobjectives") {
  
  	this.updateLog("revealing upcoming objectives...");
  
  	//
  	// reset agendas
  	//
        this.game.state.stage_i_objectives = [];
        this.game.state.stage_ii_objectives = [];
        this.game.state.secret_objectives = [];
  
        for (i = 0; i < this.game.pool[1].hand.length; i++) {
          this.game.state.stage_i_objectives.push(this.game.pool[1].hand[i]);	
  	}
        for (i = 0; i < this.game.pool[1].hand.length; i++) {
          this.game.state.stage_ii_objectives.push(this.game.pool[1].hand[i]);	
  	}
  
  	this.game.queue.splice(qe, 1);
  	return 1;
      }
  
      if (mv[0] === "invade_planet") {
  
  	let player       = mv[1];
  	let player_moves = mv[2];
  	let attacker     = mv[3];
  	let defender     = mv[4];
        let sector       = mv[5];
        let planet_idx   = mv[6];
  
  	this.updateLog(this.returnFaction(player) + " invades " + this.returnPlanetName(sector, planet_idx));
  
  	if (this.game.player != player || player_moves == 1) {
  	  this.invadePlanet(attacker, defender, sector, planet_idx);
        }
  
  	//
  	// update planet ownership
  	//
  	this.updatePlanetOwner(sector, planet_idx);
  
  	this.game.queue.splice(qe, 1);
  	return 1;
      }
  
  
      if (mv[0] === "score") {
  
  	let player       = parseInt(mv[1]);
  	let vp 		 = parseInt(mv[2]);
  	let objective    = mv[3];
  
  	this.updateLog(this.returnFaction(player)+" scores "+vp+" VP");
  	this.game.players_info[player-1].vp += vp;
  
  	this.game.queue.splice(qe-1, 2);
  	return 1;

      }
  
  
      if (mv[0] === "playerschoosestrategycards") {
  
  	this.updateLog("Players selecting strategy cards, starting from " + this.returnSpeaker());
  	this.updateStatus("Players selecting strategy cards, starting from " + this.returnSpeaker());
  
  	//
  	// all strategy cards on table again
  	//
  	this.game.state.strategy_cards = [];
  	let x = this.returnStrategyCards();
  
  	for (let z in x) {
    	  if (!this.game.state.strategy_cards.includes(z)) {
  	    this.game.state.strategy_cards.push(z);
  	    this.game.state.strategy_cards_bonus.push(0);
          }
  	}
  
  	if (this.game.player == this.game.state.speaker) {
  
  	  this.addMove("resolve\tplayerschoosestrategycards");
  	  this.addMove("addbonustounselectedstrategycards");
  
  	  let cards_to_select = 1;
  	  if (this.game.players_info.length == 2) { cards_to_select = 3; }
  	  if (this.game.players_info.length == 3) { cards_to_select = 2; }
  	  if (this.game.players_info.length == 4) { cards_to_select = 2; }
  	  if (this.game.players_info.length >= 5) { cards_to_select = 1; }
  
  	  //
  	  // TODO -- pick appropriate card number
  	  //
  	  cards_to_select = 1;
  
  	  for (cts = 0; cts < cards_to_select; cts++) {
            for (let i = 0; i < this.game.players_info.length; i++) {
  	      let this_player = this.game.state.speaker+i;
  	      if (this_player > this.game.players_info.length) { this_player -= this.game.players_info.length; }
  	      this.rmoves.push("pickstrategy\t"+this_player);
            }
  	  }
  
  	  this.endTurn();
  	}

 	return 0;
      }
  
      if (mv[0] === "addbonustounselectedstrategycards") {
  
        for (let i = 0; i < this.game.state.strategy_cards.length; i++) {
          this.game.state.strategy_cards_bonus[i] += 1;
  	}
  
        this.game.queue.splice(qe, 1);
  	return 1;
  
      }


      if (mv[0] === "pickstrategy") {
  
  	let player       = parseInt(mv[1]);
  
  	if (this.game.player == player) {
  	  this.playerSelectStrategyCards(function(card) {
  	    imperium_self.addMove("resolve\tpickstrategy");
  	    imperium_self.addMove("purchase\t"+imperium_self.game.player+"\tstrategycard\t"+card);
  	    imperium_self.endTurn();
  	  });
  	  return 0;
  	} else {
  	  this.updateStatus(this.returnFaction(player) + " is picking a strategy card");
  	}
  	return 0;
      }
  

      if (mv[0] === "land") {

  	let player       = mv[1];
  	let player_moves = mv[2];
        let sector       = mv[3];
        let source       = mv[4];   // planet ship
        let source_idx   = mv[5];   // planet_idx or ship_idx
        let planet_idx   = mv[6];
        let unitjson     = mv[7];

        let sys = this.returnSystemAndPlanets(sector);
  
  	if (this.game.player != player || player_moves == 1) {
          if (source == "planet") {
            this.unloadUnitByJSONFromPlanet(player, sector, source_idx, unitjson);
            this.loadUnitByJSONOntoPlanet(player, sector, planet_idx, unitjson);
          } else {
            if (source == "ship") {
              this.unloadUnitByJSONFromShip(player, sector, source_idx, unitjson);
              this.loadUnitByJSONOntoPlanet(player, sector, planet_idx, unitjson);
            } else {
              //this.loadUnitByJSONOntoShipByJSON(player, sector, shipjson, unitjson);
            }
          }
        }
  
        this.saveSystemAndPlanets(sys);
        this.updateSectorGraphics(sector);
        this.game.queue.splice(qe, 1);
console.log("POST LAND WITH QUEUE: " + this.game.queue);
        return 1;
  
      }
  
      if (mv[0] === "load") {
  
  	let player       = mv[1];
  	let player_moves = mv[2];
        let sector       = mv[3];
        let source       = mv[4];   // planet ship
        let source_idx   = mv[5];   // planet_idx or ship_idx
        let unitjson     = mv[6];
        let shipjson     = mv[7];
//        let sys = this.returnSystemAndPlanets(sector);
  
  	if (this.game.player != player || player_moves == 1) {
          if (source == "planet") {
            this.unloadUnitByJSONFromPlanet(player, sector, source_idx, unitjson);
            this.loadUnitByJSONOntoShipByJSON(player, sector, shipjson, unitjson);
          } else {
            if (source == "ship") {
              this.unloadUnitByJSONFromShip(player, sector, ship_idx, unitjson);
              this.loadUnitByJSONOntoShipByJSON(player, sector, shipjson, unitjson);
            } else {
              this.loadUnitByJSONOntoShipByJSON(player, sector, shipjson, unitjson);
            }
          }
        }


        let sys = this.returnSystemAndPlanets(sector);
console.log("SECTOR NOW RESEMBLES: " + JSON.stringify(sys.s));

  
//        this.saveSystemAndPlanets(sys);
        this.updateSectorGraphics(sector);
        this.game.queue.splice(qe, 1);
        return 1;
  
      }


      if (mv[0] === "notify") {
  
  	this.updateLog(mv[1]);
  	this.game.queue.splice(qe, 1);
  	return 1;
  
      }

      if (mv[0] === "pds_space_defense") {
  
  	let player       = mv[1];
        let sector       = mv[2];
  
  	this.pdsSpaceDefense(player, sector);
  	this.updateSectorGraphics(sector);
  	this.game.queue.splice(qe, 1);
  	return 1;
  
      }


      if (mv[0] === "expend") {
  
  	let player       = parseInt(mv[1]);
        let type         = mv[2];
        let details      = mv[3];
  
        if (type == "command") {
  	  this.game.players_info[player-1].command_tokens -= parseInt(details);
  	}
        if (type == "strategy") {
  	  this.game.players_info[player-1].strategy_tokens -= parseInt(details);
  	}
        if (type == "trade") {
  	  this.game.players_info[player-1].goods -= parseInt(details);
  	}
        if (type == "planet") {
  	  this.game.planets[details].exhausted = 1;
  	}
  
  	this.game.queue.splice(qe, 1);
  	return 1;
  
      }



      if (mv[0] === "unexhaust") {
  
  	let player       = parseInt(mv[1]);
        let type	 = mv[2];
        let name	 = mv[3];
  
  	if (type == "planet") { this.exhaustPlanet(name); }
  
  	this.game.queue.splice(qe, 1);
  	return 1;
  
      }


      if (mv[0] === "trade") {
  
  	let player       = parseInt(mv[1]);
  	let recipient    = parseInt(mv[2]);
        let offer	 = mv[3];
  	let amount	 = mv[4];
  
  	if (offer == "goods") {
  	  amount = parseInt(amount);
  	  if (this.game.players_info[player-1].goods >= amount) {
  	    this.game.players_info[player-1].goods -= amount;
  	    this.game.players_info[recipient-1].goods += amount;
  	  }
  	}
  
  	if (offer == "commodities") {
  	  amount = parseInt(amount);
  	  if (this.game.players_info[player-1].commodities >= amount) {
  	    this.game.players_info[player-1].commodities -= amount;
  	    this.game.players_info[recipient-1].goods += amount;
  	  }
  	}
  
  	this.game.queue.splice(qe, 1);
  	return 1;
  	
      }



      if (mv[0] === "activate") {
  
  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];
  
        sys = this.returnSystemAndPlanets(sector);
  	sys.s.activated[player-1] = 1;
  	this.saveSystemAndPlanets(sys);
        this.updateSectorGraphics(sector);
  	this.game.queue.splice(qe, 1);
  	return 1;
  	
      }


      if (mv[0] === "deactivate") {
  
  	let player       = parseInt(mv[1]);
        let sector	 = mv[2];
  
        sys = this.returnSystemAndPlanets(sector);
  	sys.s.activated[player-1] = 0;
        this.updateSectorGraphics(sector);
  	this.game.queue.splice(qe, 1);
  	return 1;
  
      }


      if (mv[0] === "purchase") {
  
  	let player       = parseInt(mv[1]);
        let item         = mv[2];
        let amount       = parseInt(mv[3]);
  
        if (item == "strategycard") {
  
  	  this.updateLog(this.returnFaction(player) + " takes " + mv[3]);
  
  	  this.game.players_info[player-1].strategy.push(mv[3]);
  	  for (let i = 0; i < this.game.state.strategy_cards.length; i++) {
  	    if (this.game.state.strategy_cards[i] === mv[3]) {
  	      this.game.players_info[player-1].goods += this.game.state.strategy_cards_bonus[i];
  	      this.game.state.strategy_cards.splice(i, 1);
  	      this.game.state.strategy_cards_bonus.splice(i, 1);
  	      i = this.game.state.strategy_cards.length+2;
  	    }
  	  }
  	}

        if (item == "tech") {
  	  this.updateLog(this.returnFaction(player) + " gains " + mv[3]);
  	  this.game.players_info[player-1].tech.push(mv[3]);
  	  this.game.tech[mv[3]].onNewRound(imperium_self, player, function() {});
  	  this.upgradePlayerUnitsOnBoard(player);
  	}
        if (item == "goods") {
  	  this.updateLog(this.returnFaction(player) + " gains " + mv[3] + " trade goods");
  	  this.game.players_info[player-1].goods += amount;
  	}

        if (item == "commodities") {
  	  this.updateLog(this.returnFaction(player) + " gains " + mv[3] + " commodities");
  	  this.game.players_info[player-1].commodities += amount;
  	}

        if (item == "command") {
  	  this.updateLog(this.returnFaction(player) + " gains " + mv[3] + " command tokens");
  	  this.game.players_info[player-1].command_tokens += amount;
  	}
        if (item == "strategy") {
  	  this.updateLog(this.returnFaction(player) + " gains " + mv[3] + " strategy tokens");
  	  this.game.players_info[player-1].strategy_tokens += amount;
  	}

        if (item == "fleetsupply") {
  	  this.game.players_info[player-1].fleet_supply += amount;
  	  this.updateLog(this.returnFaction(player) + " increases their fleet supply to " + this.game.players_info[player-1].fleet_supply);
  	}
  
  	this.game.queue.splice(qe, 1);
  	return 1;
  
      }


      if (mv[0] === "pass") {
  	let player       = parseInt(mv[1]);
  	this.game.players_info[player-1].passed = 1;
  	this.game.queue.splice(qe, 1);
  	return 1;  
      }


      if (mv[0] === "move") {
 
  	let player       = mv[1];
        let player_moves = parseInt(mv[2]);
        let sector_from  = mv[3];
        let sector_to    = mv[4];
        let shipjson     = mv[5];
  
  	//
  	// move any ships
  	//
  	if (this.game.player != player || player_moves == 1) {
console.log("REMOVING SPACE UNIT BY: " + shipjson);
  	  let sys = this.returnSystemAndPlanets(sector_from);
console.log("IN SECTOR: " + JSON.stringify(sys.s));
  	  this.removeSpaceUnitByJSON(player, sector_from, shipjson);
          this.addSpaceUnitByJSON(player, sector_to, shipjson);
  	}
  
    	this.invadeSector(player, sector_to);
  
  	this.updateSectorGraphics(sector_from);
  	this.updateSectorGraphics(sector_to);
  
  	this.game.queue.splice(qe, 1);
  	return 1;
  
      }


      if (mv[0] === "produce") {
  
  	let player       = mv[1];
        let player_moves = parseInt(mv[2]);
        let planet_idx   = parseInt(mv[3]); // planet to build on
        let unitname     = mv[4];
        let sector       = mv[5];
  
  	if (planet_idx != -1) {
          this.addPlanetaryUnit(player, sector, planet_idx, unitname);
  	} else {
          this.addSpaceUnit(player, sector, unitname);
        }
  
  	//
  	// monitor fleet supply
  	//
        console.log("Fleet Supply issues getting managed here....");
  
  	//
  	// update sector
  	//
  	this.updateSectorGraphics(sector);
  
  	let sys = this.returnSystemAndPlanets(sector);
  
  	this.game.queue.splice(qe, 1);
  	return 1;
  
      }



      if (mv[0] === "continue") {
  
  	let player = mv[1];
  	let sector = mv[2];

	//
	// unpack space ships
	//
	this.unloadStoredShipsIntoSector(player, sector);
	this.continuePlayerTurn(player, sector);

        this.game.queue.splice(qe, 1);
        return 0;

      }
  
      if (mv[0] === "play") {
  
  	let player = mv[1];
        if (player == this.game.player) {
  	  this.tracker = this.returnPlayerTurnTracker();
  	  this.addMove("resolve\tplay");
  	  this.playerTurn();
        } else {
  	  this.updateStatus(this.returnFaction(parseInt(player)) + " is taking their turn");
  	}
  
  	return 0;
      }



      if (mv[0] === "strategy") {
  
  	let card = mv[1];
  	let player = parseInt(mv[2]);
  	let stage = mv[3];
  
  	imperium_self.game.players_info[player-1].strategy_cards_played.push(card);


  	if (stage == 1) {
  	  this.playStrategyCardPrimary(player, card);
  	}
  	if (stage == 2) {
  	  this.playStrategyCardSecondary(player, card);
  	}
  
  	return 0;

      }



      if (mv[0] === "action") {
  
  	let card = mv[1];
  	let player = parseInt(mv[2]);

	let cards = this.returnActionCards();
	let played_card = cards[card];

	cards[card].onPlay(this, player, function(c) {
	  console.log("ACTION CARD HAS PLAYED AND RETURNED IN ACTION CALLBACK");
	});

	if (cards[card].interactive == 1) {
  	  this.game.queue.splice(qe, 1);
  	  return 1;
	} else {
  	  this.game.queue.splice(qe, 1);
	  return 0;
	}


      }


  
      //
      // avoid infinite loops
      //
      if (shd_continue == 0) {
        return 0;
      }  
    }
  
    return 1;
  
  }
  


  //
  // this function can be run after a tech bonus is used, to see if 
  // it is really exhausted for the turn, or whether it is from an
  // underlying tech bonus (and will be reset so as to be always
  // available.
  //
  resetTechBonuses() {
  
    //
    // reset tech bonuses
    //
    for (let i = 0; i < this.game.players_info.length; i++) {
      for (let ii = 0; ii < this.game.players_info[i].tech.length; ii++) {
        this.game.tech[this.game.players_info[i].tech[ii]].onNewTurn();
      }
    }
  
  }
 

  deactivateSystems() {

    //
    // deactivate all systems
    //
    for (var sys in this.game.systems) {
      for (let j = 0; j < this.totalPlayers; j++) {
        this.game.systems[sys].activated[j] = 0;
      }
    }

  }
 


  continuePlayerTurn(player, sector) {

    let imperium_self = this;
    let options_available = 0;

    //
    // check to see if any ships survived....
    //
    let html  = this.returnFaction(player) + ": <p></p><ul>";
    if (this.canPlayerInvadePlanet(player, sector)) {
      html += '<li class="option" id="invade">invade planet</li>';
      options_available++;
    }
    if (this.canPlayerPlayActionCard(player)) {
      html += '<li class="option" id="action">action card</li>';
      options_available++;
    }
    html += '<li class="option" id="endturn">end turn</li>';
    html += '</ul>';
   
    if (options_available > 0) {

      this.updateStatus(html);
      $('.option').on('click', function() {
        let action2 = $(this).attr("id");

        if (action2 == "endturn") {
          imperium_self.addMove("resolve\tplay");
          imperium_self.endTurn();
        }
  
        if (action2 == "invade") {
          imperium_self.playerInvadePlanet(player, sector);
        }

        if (action2 == "action") {
          imperium_self.playerSelectActionCard(function(success) {
            imperium_self.addMove("continue\t"+player+"\t"+sector);
            imperium_self.addMove("action\t"+success+"\t"+imperium_self.game.player);
            imperium_self.endTurn();
          }, player, sector);
        }

      });

    }

  }



  playerTurn(stage="main") {
  
    let html = '';
    let imperium_self = this;

    if (stage == "main") {
  
      let playercol = "player_color_"+this.game.player;
  
      let html  = '<div class="terminal_header">[command: '+this.game.players_info[this.game.player-1].command_tokens+'] [strategy: '+this.game.players_info[this.game.player-1].strategy_tokens+'] [fleet: '+this.game.players_info[this.game.player-1].fleet_supply+']</div>';
          html  += '<p style="margin-top:20px"></p>';
          html  += '<div class="terminal_header2"><div class="player_color_box '+playercol+'"></div>' + this.returnFaction(this.game.player) + ":</div><p></p><ul class='terminal_header3'>";
      if (this.game.players_info[this.game.player-1].command_tokens > 0) {
        html += '<li class="option" id="activate">activate system</li>';
      }
      if (this.canPlayerPlayStrategyCard(this.game.player) == 1) {
        html += '<li class="option" id="select_strategy_card">play strategy card</li>';
      }
      if (this.tracker.action_card == 0 && this.canPlayerPlayActionCard(this.game.player) == 1) {
        html += '<li class="option" id="action">play action card</li>';
      }
      if (this.tracker.trade == 0 && this.canPlayerTrade(this.game.player) == 1) {
        html += '<li class="option" id="trade">send trade goods</li>';
      }
  
      if (this.canPlayerPass(this.game.player) == 1) {
        html += '<li class="option" id="pass">pass</li>';
      }
      html += '</ul>';
  
      this.updateStatus(html);
  
      $('.option').on('click', function() {
  
        let action2 = $(this).attr("id");
  
        if (action2 == "activate") {
          imperium_self.playerActivateSystem();
        }
        if (action2 == "select_strategy_card") {
          imperium_self.playerSelectStrategyCard(function(success) {
  	  imperium_self.addMove("strategy\t"+success+"\t"+imperium_self.game.player+"\t1");
  	  imperium_self.endTurn();
          });
        }
        if (action2 == "action") {
          imperium_self.playerSelectActionCard(function(success) {
  	    imperium_self.addMove("action\t"+success+"\t"+imperium_self.game.player);
  	    imperium_self.endTurn();
          });
        }
        if (action2 == "trade") {
          imperium_self.playerTrade(function() {
  	  imperium_self.endTurn();
          });
        }
        if (action2 == "pass") {
          imperium_self.addMove("pass\t"+imperium_self.game.player);
          imperium_self.endTurn();
        }
      });
    }
  }
  
  
  
  
  ////////////////
  // Production //
  ////////////////
  playerBuyTokens() {
  
    let imperium_self = this;

    if (this.returnAvailableInfluence(this.game.player) <= 2) {
      this.updateLog("You skip the initiative secondary, as you lack adequate influence...");
      this.updateStatus("Skipping purchase of tokens as insufficient influence...");
      this.endTurn();
      return 0;
    }
 

    let html = 'Do you wish to purchase any command or strategy tokens? <p></p><ul>';
    html += '<li class="buildchoice" id="command">Command Tokens (<span class="command_total">0</span>)</li>';
    html += '<li class="buildchoice" id="strategy">Strategy Tokens (<span class="strategy_total">0</span>)</li>';
    html += '</ul>';
    html += '<p></p>';
    html += '<div id="buildcost" class="buildcost"><span class="buildcost_total">0</span> influence</div>';
    html += '<div id="confirm" class="buildchoice">click here to finish</div>';
  
    this.updateStatus(html);
  

    let command_tokens = 0;
    let strategy_tokens = 0;
    let total_cost = 0;
  
    $('.buildchoice').off();
    $('.buildchoice').on('click', function() {
  
      let id = $(this).attr("id");
  
      if (id == "confirm") {
  
        total_cost = 3 * (command_tokens + strategy_tokens);
        imperium_self.playerSelectInfluence(total_cost, function(success) {
  
  	if (success == 1) {
            imperium_self.addMove("purchase\t"+imperium_self.game.player+"\tcommand\t"+command_tokens);
            imperium_self.addMove("purchase\t"+imperium_self.game.player+"\tcommand\t"+strategy_tokens);
            imperium_self.endTurn();
            return;
  	} else {
  	  alert("failure to find appropriate influence");
  	}
        });
      };
  
      //
      //  figure out if we need to load infantry / fighters
      //
      if (id == "command") 	{ command_tokens++; }
      if (id == "strategy")	{ strategy_tokens++; }
  
      let divtotal = "." + id + "_total";
      let x = parseInt($(divtotal).html());
      x++;
      $(divtotal).html(x);
  
  
  
      let resourcetxt = " resources";
      total_cost = 3 * (command_tokens + strategy_tokens);
      if (total_cost == 1) { resourcetxt = " resource"; }
      $('.buildcost_total').html(total_cost + resourcetxt);
  
    });
  
  
  }
  
  
  
  
  
  playerBuyActionCards() {
  
    let imperium_self = this;
  
    let html = 'Do you wish to spend 1 strategy token to purchase 2 action cards? <p></p><ul>';
    html += '<li class="buildchoice" id="yes">Purchase Action Cards</li>';
    html += '<li class="buildchoice" id="no">Do Not Purchase Action Cards</li>';
    html += '</ul>';
    html += '<p></p>';
    html += '<div id="confirm" class="buildchoice">click here to finish</div>';
  
    this.updateStatus(html);
  
    $('.buildchoice').off();
    $('.buildchoice').on('click', function() {
  
      let id = $(this).attr("id");
  
      if (id == "yes") {
  
        imperium_self.addMove("DEAL\t2\t"+this.game.player+"\t2");
        imperium_self.addMove("expend\t"+imperium_self.game.player+"\tstrategy\t1");
        imperium_self.endTurn();
        return;
  
      } else {
  
        imperium_self.endTurn();
        return;
  
      }
    });
  
  }
  
  


  canPlayerTrade(player) {
  
    return 0;

  }
  
  canPlayerPlayStrategyCard(player) {

    for (let i = 0; i < this.game.players_info[player-1].strategy.length; i++) {
      if (!this.game.players_info[player-1].strategy_cards_played.includes(this.game.players_info[player-1].strategy[i])) {
        return 1;
      }
    }
  
    return 0;
  
  }
  
  
  canPlayerPass(player) {
  
    if (this.canPlayerPlayStrategyCard(player) == 1) { return 0; }
  
    return 1;
  
  }

  canPlayerPlayActionCard(player) {
  
    let array_of_cards = this.returnPlayerActionCards(this.game.player);

    if (array_of_cards.length > 0) {
      return 1;
    } 
  
    return 0;
  }
  



  canPlayerResearchTechnology(tech) {
  
    let mytech = this.game.players_info[this.game.player-1].tech;
    if (mytech.includes(tech)) { return 0; }
  
    let prereqs = JSON.parse(JSON.stringify(this.game.tech[tech].prereqs));
  
    for (let i = 0; i < mytech.length; i++) {
      let color = mytech[i].color;
      for (let j = 0; j < prereqs.length; j++) {
        if (prereqs[j] == color) {
          prereqs.splice(j, 1);
  	j = prereqs.length;
        }
      }
    }
  
    if (prereqs.length == 0) {
      return 1;
    }
  
    return 0;
  
  }




  playerResearchTechnology(mycallback) {
  
    let html = 'You are eligible to upgrade to the following technologies: <p></p><ul>';
  
    for (var i in this.game.tech) {  
      if (this.canPlayerResearchTechnology(i)) {
        html += '<li class="option" id="'+i+'">'+this.game.tech[i].name+'</li>';
      }
    }
    html += '</ul>';
  
    this.updateStatus(html);
    
    $('.option').off();
    $('.option').on('click', function() {
      mycallback($(this).attr("id"));
    });
  
  
  }
  



  canPlayerScoreVictoryPoints(player, card="", deck=1) {
  
    if (card == "") { return 0; }
  
    let imperium_self = this;
  
    // deck 1 = primary
    // deck 2 = secondary
    // deck 3 = secret
  
    if (deck == 1) {
      let objectives = this.returnStageIPublicObjectives();
      if (objectives[card] != "") {
        if (objectives[card].func(imperium_self, player) == 1) { return 1; }
      }
    }
  
    if (deck == 2) {
      let objectives = this.returnStageIIPublicObjectives();
      if (objectives[card] != "") {
        if (objectives[card].func(imperium_self, player) == 1) { return 1; }
      }
    }
  
    if (deck == 3) {
      let objectives = this.returnSecretObjectives();
      if (objectives[card] != "") {
        if (objectives[card].func(imperium_self, player) == 1) { return 1; }
      }
    }
  
    return 0;
  
  }




  playerScoreVictoryPoints(mycallback) {
  
    let imperium_self = this;
  
    let html = 'Do you wish to score any victory points? <p></p><ul>';
  
    // Stage I Public Objectives
    for (let i = 0; i < this.game.state.stage_i_objectives.length; i++) {
      if (this.canPlayerScoreVictoryPoints(this.game.player, this.game.state.stage_i_objectives[i], 1)) {
        html += '1 VP Public Objective: <li class="option stage1" id="'+i+'">'+this.game.deck[3].cards[this.game.state.stage_i_objectives[i]].name+'</li>';
      }
    }
  
    // Stage II Public Objectives
    for (let i = 0; i < this.game.state.stage_ii_objectives.length; i++) {
      if (this.canPlayerScoreVictoryPoints(this.game.player, this.game.state.stage_ii_objectives[i], 2)) {
        html += '2 VP Public Objective: <li class="option stage2" id="'+i+'">'+this.game.deck[4].cards[this.game.state.stage_ii_objectives[i]].name+'</li>';
      }
    }
  
    // Secret Objectives
    for (let i = 0 ; i < this.game.deck[5].hand.length; i++) {
      if (this.canPlayerScoreVictoryPoints(this.game.player, this.game.deck[5].hand[i], 3)) {
        html += '1 VP Secret Objective: <li class="option secret3" id="'+i+'">'+this.game.deck[5].cards[this.game.deck[5].hand[i]].name+'</li>';
      }
    }
  
    html += '<li class="option" id="no">I choose not to score...</li>';
    html += '</ul>';
  
    this.updateStatus(html);
    
    $('.option').off();
    $('.option').on('click', function() {
  
      let action = $(this).attr("id");
      let objective_type = 3;
  
      if ($(this).hasClass("stage1")) { objective_type = 1; }
      if ($(this).hasClass("stage2")) { objective_type = 2; }
      if ($(this).hasClass("secret3")) { objective_type = 3; }
  
      if (action == "no") {
  
        mycallback(0, "");
  
      } else {
  
        imperium_self.playerPostScoreVictoryPoints(action, objective_type, mycallback);
        let vp = 2;
        let objective = "SECRET OBJECTIVE: mining power";
        mycallback(vp, objective);
  
      }
    });
  }
  


  playerPostScoreVictoryPoints(objective, deck, mycallback) {
  
    if (deck == 1) {
      let objectives = this.returnStageIPublicObjectives();
      objectives[card].post(imperium_self, player, function(success) {
        mycallback(1, objective);
      });
    }
  
    if (deck == 2) {
      let objectives = this.returnStageIIPublicObjectives();
      objectives[card].post(imperium_self, player, function(success) {
        mycallback(2, objective);
      });
    }
  
    if (deck == 3) {
      let objectives = this.returnSecretObjectives();
      objectives[card].post(imperium_self, player, function(success) {
        mycallback(1, objective);
      });
    }
  
    mycallback(0, "null-vp-objective");
  
  }
  
  
  
  playerBuildInfrastructure() { 
  
    let imperium_self = this;
  
    let html = 'Which would you like to build: <p></p><ul>';
    html += '<li class="buildchoice" id="pds">Planetary Defense System</li>';
    html += '<li class="buildchoice" id="spacedock">Space Dock</li>';
    html += '</ul>';
    html += '<p></p>';
    html += '<div id="confirm" class="buildchoice">click here to build</div>';
  
    this.updateStatus(html);
  
    let stuff_to_build = [];  
  
    $('.buildchoice').off();
    $('.buildchoice').on('click', function() {
  
      let id = $(this).attr("id");
  
      html = "Select a planet on which to build: ";
      imperium_self.updateStatus(html);
  
      imperium_self.playerSelectPlanet(function(sector, planet_idx) {
  
        if (id == "pds") {
  	imperium_self.addMove("produce\t"+imperium_self.game.player+"\t"+1+"\t"+planet_idx+"\tpds\t"+sector);
  	imperium_self.endTurn();
        }
        if (id == "spacedock") {
  	imperium_self.addMove("produce\t"+imperium_self.game.player+"\t"+1+"\t"+planet_idx+"\tspacedock\t"+sector);
  	imperium_self.endTurn();
        }
  
      }, 0);  // 0 any planet
  
    });
  
  }
  
  
  playerProduceUnits(sector) { 
  
    let imperium_self = this;
  
    let html = 'Produce Units in this Sector: <p></p><ul>';
    html += '<li class="buildchoice" id="infantry">Infantry (<span class="infantry_total">0</span>)</li>';
    html += '<li class="buildchoice" id="fighter">Fighter (<span class="fighter_total">0</span>)</li>';
    html += '<li class="buildchoice" id="destroyer">Destroyer (<span class="destroyer_total">0</span>)</li>';
    html += '<li class="buildchoice" id="carrier">Carrier (<span class="carrier_total">0</span>)</li>';
    html += '<li class="buildchoice" id="cruiser">Cruiser (<span class="cruiser_total">0</span>)</li>';
    html += '<li class="buildchoice" id="dreadnaught">Dreadnaught (<span class="dreadnaught_total">0</span>)</li>';
    html += '<li class="buildchoice" id="flagship">Flagship (<span class="flagship_total">0</span>)</li>';
    html += '<li class="buildchoice" id="warsun">War Sun (<span class="warsun_total">0</span>)</li>';
    html += '</ul>';
    html += '<p></p>';
    html += '<div id="buildcost" class="buildcost"><span class="buildcost_total">0</span> resources</div>';
    html += '<div id="confirm" class="buildchoice">click here to build</div>';
  
    this.updateStatus(html);
  
    let stuff_to_build = [];  
  
  
    $('.buildchoice').off();
    $('.buildchoice').on('click', function() {
  
      let id = $(this).attr("id");
  
      let calculated_total_cost = 0;
      for (let i = 0; i < stuff_to_build.length; i++) {
        calculated_total_cost += imperium_self.returnUnitCost(stuff_to_build[i], this.game.player);
      }
      calculated_total_cost += imperium_self.returnUnitCost(id, this.game.player);
  
      //
      // reduce production costs if needed
      //
      if (this.game.players_info[player-1].production_bonus > 0) {
        calculated_total_cost -= this.game.players_info[player-1].production_bonus;
      }
  
  
      if (calculated_total_cost > imperium_self.returnAvailableResources(imperium_self.game.player)) {
        alert("You cannot build more than you have available to pay for it.");
        return;
      }
  
  
      //
      // submit when done
      //
      if (id == "confirm") {
  
        let total_cost = 0;
        for (let i = 0; i < stuff_to_build.length; i++) {
  	total_cost += imperium_self.returnUnitCost(stuff_to_build[i], this.game.player);
        }
  
        imperium_self.playerSelectResources(total_cost, function(success) {
  
  	if (success == 1) {
  
            imperium_self.addMove("resolve\tplay");
            imperium_self.addMove("continue\t"+imperium_self.game.player+"\t"+sector);
            for (let y = 0; y < stuff_to_build.length; y++) {
  	    let planet_idx = -1;
  	    if (stuff_to_build[y] == "infantry") { planet_idx = 0; }
  	    imperium_self.addMove("produce\t"+imperium_self.game.player+"\t"+1+"\t"+planet_idx+"\t"+stuff_to_build[y]+"\t"+sector);
            }
            imperium_self.endTurn();
            return;
  
  	} else {
  
  	  alert("failure to find appropriate influence");
  
  	}
  
        });
  
      };
  
  
      //
      //  figure out if we need to load infantry / fighters
      //
      stuff_to_build.push(id);
  
      let total_cost = 0;
      for (let i = 0; i < stuff_to_build.length; i++) {
        total_cost += imperium_self.returnUnitCost(stuff_to_build[i], this.game.player);
      }
  
      let divtotal = "." + id + "_total";
      let x = parseInt($(divtotal).html());
      x++;
      $(divtotal).html(x);
  
  
  
      let resourcetxt = " resources";
      if (total_cost == 1) { resourcetxt = " resource"; }
      $('.buildcost_total').html(total_cost + resourcetxt);
  
    });
  
  }
  
  


  playerTrade(mycallback) {
  
    let imperium_self = this;
    let factions = this.returnFactions();
  
    let html = 'Initiate Trade Offer with Faction: <p></p><ul>';
    for (let i = 0; i < this.game.players_info.length; i++) {
      html += `  <li class="option" id="${i}">${factions[this.game.players_info[i].faction].name}</li>`;
    }
    html += '</ul>';
  
    this.updateStatus(html);
  
    $('.option').off();
    $('.option').on('click', function() {
  
      let faction = $(this).attr("id");
      let commodities_selected = 0;
      let goods_selected = 0;
  
      let html = "Extend Trade Mission: <p></p><ul>";
      html += '<li id="commodities" class="option"><span class="commodities_total">0</span> commodities</li>';
      html += '<li id="goods" class="option"><span class="goods_total">0</span> goods</li>';
      html += '<li id="confirm" class="option">CLICK HERE TO SEND TRADE MISSION</li>';
      html += '</ul>';
  
      imperium_self.updateStatus(html);
  
      $('.option').off();
      $('.option').on('click', function() {
  
        let selected = $(this).attr("id");
  
        if (selected == "commodities") { commodities_selected++; }
        if (selected == "goods") { goods_selected++; }
        if (selected == "confirm") {
  	if (commodities_selected >= 1) {
  	  imperium_self.addMove("trade\t"+imperium_self.game.player+"\t"+(faction+1)+"commodities"+"\t"+commodities_selected);
  	}
  	if (goods_selected >= 1) {
  	  imperium_self.addMove("trade\t"+imperium_self.game.player+"\t"+(faction+1)+"goods"+"\t"+goods_selected);
  	}
        }
  
        if (commodities_selected > imperium_self.game.players_info[imperium_self.game.player-1].commodities) {
  	commodities_selected = imperium_self.game.players_info[imperium_self.game.player-1].commodities;
        }
        if (goods_selected > imperium_self.game.players_info[imperium_self.game.player-1].goods) {
  	goods_selected = imperium_self.game.players_info[imperium_self.game.player-1].goods;
        }
  
        $('.commodities_total').html(commodities_selected);
        $('.goods_total').html(goods_selected);
  
      });
    });
  }
  
  
  
  
  playerSelectSector(mycallback, mode=0) { 
  
    //
    // mode
    //
    // 0 = any sector
    // 1 = activated actor
    //
  
    let imperium_self = this;
  
    $('.sector').on('click', function() {
      let pid = $(this).attr("id");
      mycallback(pid);
    });
  
  }
  
  
  

  playerSelectPlanet(mycallback, mode=0) { 
  
    //
    // mode
    //
    // 0 = in any sector
    // 1 = in unactivated actor
    //
  
    let imperium_self = this;
  
    let html  = "Select a system in which to select a planet: ";
    this.updateStatus(html);
  
    $('.sector').on('click', function() {
  
      let pid = $(this).attr("id");
      let sys = imperium_self.returnSystemAndPlanets(pid);
  
      html = 'Select a planet in this system: <p></p><ul>';
      for (let i = 0; i < sys.p.length; i++) {
        html += '<li class="option" id="' + i + '">' + sys.p[i].name + ' (<span class="invadeplanet_'+i+'">0</span>)</li>';
      }
      html += '</ul>';
  
      imperium_self.updateStatus(html);
  
      $('.option').off();
      $('.option').on('click', function() {
        mycallback(pid, $(this).attr("id"));
      });
  
    });
  
  }
  
  
  
  returnAvailableVotes(player) {

    let array_of_cards = this.returnPlayerPlanetCards(player);
    let total_available_votes = 0;
    for (let z = 0; z < array_of_cards.length; z++) {
      total_available_votes += this.game.planets[array_of_cards[z]].influence;
    }
    return total_available_votes;

  }

  returnAvailableResources(player) {
  
    let array_of_cards = this.returnPlayerUnexhaustedPlanetCards(player); // unexhausted
    let total_available_resources = 0;
    for (let z = 0; z < array_of_cards.length; z++) {
      total_available_resources += this.game.planets[array_of_cards[z]].resources;
    }
    total_available_resources += this.game.players_info[player-1].goods;
    return total_available_resources;
  
  }



  returnAvailableInfluence(player) {
  
    let array_of_cards = this.returnPlayerUnexhaustedPlanetCards(player); // unexhausted
    let total_available_influence = 0;
    for (let z = 0; z < array_of_cards.length; z++) {
      total_available_influence += this.game.planets[array_of_cards[z]].influence;
    }
    total_available_influence += this.game.players_info[player-1].goods;
    return total_available_influence;
  
  }
  


  playerSelectResources(cost, mycallback) {
  
    if (cost == 0) { mycallback(1); }
  
    let imperium_self = this;
    let array_of_cards = this.returnPlayerUnexhaustedPlanetCards(this.game.player); // unexhausted
    let array_of_cards_to_exhaust = [];
    let selected_cost = 0;
  
    let html  = "Select "+cost+" in resources: <p></p><ul>";
    for (let z = 0; z < array_of_cards.length; z++) {
      html += '<li class="cardchoice" id="cardchoice_'+array_of_cards[z]+'">' + this.returnPlanetCard(array_of_cards[z]) + '</li>';
    }
    html += '</ul>';
  
    this.updateStatus(html);
    $('.cardchoice').on('click', function() {
  
      let action2 = $(this).attr("id");
      let tmpx = action2.split("_");
      
      let divid = "#"+action2;
      let y = tmpx[1];
      let idx = 0;
      for (let i = 0; i < array_of_cards.length; i++) {
        if (array_of_cards[i] === y) {
          idx = i;
        } 
      }
  
  
      imperium_self.addMove("expend\t"+imperium_self.game.player+"\tplanet\t"+array_of_cards[idx]);
  
      array_of_cards_to_exhaust.push(array_of_cards[idx]);
  
      $(divid).off();
      $(divid).css('opacity','0.3');
  
      selected_cost += imperium_self.game.planets[array_of_cards[idx]].resources;
  
      if (cost <= selected_cost) { mycallback(1); }
  
    });
  
  }
 
 
  playerSelectStrategyAndCommandTokens(cost, mycallback) {
  
    if (cost == 0) { mycallback(1); }
  
    let imperium_self = this;
  
    let selected_cost  = 0;
    let strategy_spent = 0;
    let command_spent  = 0;
  
    let html  = "Select "+cost+" in influence: <p></p><ul>";
        html += '<li class="option" id="command"><span id="player_command_total">'+this.game.players_info[this.game.player-1].command_tokens+'</span> remaining command tokens</li>';
        html += '<li class="option" id="strategy"><span id="player_strategy_total">'+this.game.players_info[this.game.player-1].strategy_tokens+'</span> remaining strategy tokens</li>';
        html += '</ul>';
  
    this.updateStatus(html);
  
    $('.option').off();
    $('.option').on('click', function() {
  
      let action = $(this).attr("id");
      let divid = "#player_"+action+"_total";
  
      if (action == "command") {
        let remaining = imperium_self.game.players_info[this.game.player-1].command_tokens - command_spent;
        if (remaining > 0) {
          command_spent++;
          imperium_self.addMove("expend\t"+imperium_self.game.player+"\t"+"command"+"\t"+1);
          $(divid).html((remaining-1));
        }
      }
      if (action == "strategy") {
        let remaining = imperium_self.game.players_info[this.game.player-1].command_tokens - strategy_spent;
        if (remaining > 0) {
          strategy_spent++;
          imperium_self.addMove("expend\t"+imperium_self.game.player+"\t"+"strategy"+"\t"+1);
          $(divid).html((remaining-1));
        }
      }
  
      selected_cost = strategy_spent + command_spent;
  
      if (selected_cost >= cost) {
        mycallback(1);
      }
  
    });
  
  }
  


  playerSelectInfluence(cost, mycallback) {
  
    if (cost == 0) { mycallback(1); }
  
    let imperium_self = this;
    let array_of_cards = this.returnPlayerUnexhaustedPlanetCards(this.game.player); // unexhausted
    let array_of_cards_to_exhaust = [];
    let selected_cost = 0;
  
    let html  = "Select "+cost+" in influence: <p></p><ul>";
    for (let z = 0; z < array_of_cards.length; z++) {
      html += '<li class="cardchoice" id="cardchoice_'+array_of_cards[z]+'">' + this.returnPlanetCard(array_of_cards[z]) + '</li>';
    }
    html += '</ul>';
  
    this.updateStatus(html);
    $('.cardchoice').on('click', function() {
  
      let action2 = $(this).attr("id");
      let tmpx = action2.split("_");
      
      let divid = "#"+action2;
      let y = tmpx[1];
      let idx = 0;
      for (let i = 0; i < array_of_cards.length; i++) {
        if (array_of_cards[i] === y) {
          idx = i;
        } 
      }
  
      imperium_self.addMove("expend\t"+imperium_self.game.player+"\tplanet\t"+array_of_cards[idx]);
  
      array_of_cards_to_exhaust.push(array_of_cards[idx]);
  
      $(divid).off();
      $(divid).css('opacity','0.3');
  
      selected_cost += imperium_self.game.planets[array_of_cards[idx]].resources;
  
      if (cost <= selected_cost) { mycallback(1); }
  
    });
  
  }
  
  
  playerSelectActionCard(mycallback, player, sector) { 
 
    let imperium_self = this;
    let array_of_cards = this.returnPlayerActionCards(this.game.player);
    let action_cards = this.returnActionCards();

    let html = "Select an action card: <p></p><ul>";
    for (let z in array_of_cards) {
      let thiscard = action_cards[this.game.deck[1].hand[z]];
      html += '<li class="cardchoice pointer" id="'+this.game.deck[1].hand[z]+'">' + thiscard.name + '</li>';
    }
    html += '<li class="cardchoice pointer" id="cancel">cancel</li>';
    html += '</ul>';
  
    this.updateStatus(html);
    $('.cardchoice').on('mouseenter', function() { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.showActionCard(s); } });
    $('.cardchoice').on('mouseleave', function() { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.hideActionCard(s); } });
    $('.cardchoice').on('click', function() {

      let action2 = $(this).attr("id");

      if (action2 === "cancel") {
	if (sector == null) {
	  imperium_self.playerTurn();
	  return;
	}
	else {
	  imperium_self.continuePlayerTurn(player, sector);
	  return;
	}
      }

      mycallback(action2);

    });
  
  }
  
  
  //
  // this is when players are choosing to play the cards that they have 
  // already chosen.
  //
  playerSelectStrategyCard(mycallback) {

    let array_of_cards = this.game.players_info[this.game.player-1].strategy;
    let strategy_cards = this.returnStrategyCards();
    let imperium_self = this;  

    let html = "Select a strategy card: <p></p><ul>";
    for (let z in array_of_cards) {
      if (!this.game.players_info[this.game.player-1].strategy_cards_played.includes(array_of_cards[z])) {
        html += '<li class="cardchoice" id="'+array_of_cards[z]+'">' + strategy_cards[array_of_cards[z]].name + '</li>';
      }
    }
    html += '<li class="cardchoice pointer" id="cancel">cancel</li>';
    html += '</ul>';
  
    this.updateStatus(html);
    $('.cardchoice').on('mouseenter', function() { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.showStrategyCard(s); } });
    $('.cardchoice').on('mouseleave', function() { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.hideStrategyCard(s); } });
    $('.cardchoice').on('click', function() {

      let action2 = $(this).attr("id");

      if (action2 === "cancel") {
	imperium_self.playerTurn();
	return;
      }

      mycallback(action2);

    });
  }
  


  
  //
  // this is when players select at the begining of the round, not when they 
  // are chosing to play the cards that they have already selected
  //
  playerSelectStrategyCards(mycallback) {

    let cards = this.returnStrategyCards();
    let html  = "<div class='terminal_header'>You are playing as " + this.returnFaction(this.game.player) + ". Select your strategy card:</div><p></p><ul>";
    if (this.game.state.round > 1) {
      html  = "<div class='terminal_header'>"+this.returnFaction(this.game.player) + ": select your strategy card:</div><p></p><ul>";
    }
    for (let z = 0; z < this.game.state.strategy_cards.length; z++) {
      html += '<li class="cardchoice" id="'+this.game.state.strategy_cards[z]+'">' + cards[this.game.state.strategy_cards[z]].name + '</li>';
    }
    html += '</ul>';
  
    this.updateStatus(html);
    $('.cardchoice').on('click', function() {
      let action2 = $(this).attr("id");
      mycallback(action2);
    });
  
  }
  
  
  
  
  //////////////////////////
  // Select Units to Move //
  //////////////////////////
  playerSelectUnitsToMove(destination) {
  
    let imperium_self = this;
    let html = '';
    let hops = 3;
    let sectors = [];
    let distance = [];
  
    let obj = {};
        obj.max_hops = 2;
        obj.ship_move_bonus = this.game.players_info[this.game.player-1].ship_move_bonus;
        obj.fleet_move_bonus = this.game.players_info[this.game.player-1].fleet_move_bonus;
        obj.ships_and_sectors = [];
        obj.stuff_to_move = [];  
        obj.stuff_to_load = [];  
        obj.distance_adjustment = 0;
  
        obj.max_hops += obj.ship_move_bonus;
        obj.max_hops += obj.fleet_move_bonus;
  
    let x = imperium_self.returnSectorsWithinHopDistance(destination, obj.max_hops);
    sectors = x.sectors; 
    distance = x.distance;
  
    for (let i = 0; i < distance.length; i++) {
      if (obj.ship_move_bonus > 0) {
        distance[i]--;
      }
      if (obj.fleet_move_bonus > 0) {
        distance[i]--;
      }
    }
  
    if (obj.ship_move_bonus > 0) {
      obj.distance_adjustment += obj.ship_move_bonus;
    }
    if (obj.fleet_move_bonus > 0) {
      obj.distance_adjustment += obj.fleet_move_bonus;
    }
  
    obj.ships_and_sectors = imperium_self.returnShipsMovableToDestinationFromSectors(destination, sectors, distance);

    let updateInterface = function(imperium_self, obj, updateInterface) {

      let subjective_distance_adjustment = 0;
      if (obj.ship_move_bonus > 0) {
        subjective_distance_adjustment += obj.ship_move_bonus;
      }
      if (obj.fleet_move_bonus > 0) {
        subjective_distance_adjustment += obj.fleet_move_bonus;
      }
      let spent_distance_boost = (obj.distance_adjustment - subjective_distance_adjustment);
  
      let html = 'Select ships to move: <p></p><ul>';
  
      //
      // select ships
      //
      for (let i = 0; i < obj.ships_and_sectors.length; i++) {
  
        let sys = imperium_self.returnSystemAndPlanets(obj.ships_and_sectors[i].sector);
        html += '<b class="sector_name" id="'+obj.ships_and_sectors[i].sector+'" style="margin-top:10px">'+sys.s.name+'</b>';
        html += '<ul>';
        for (let ii = 0; ii < obj.ships_and_sectors[i].ships.length; ii++) {
  
  	//
  	// figure out if we can still move this ship
  	//
  	let already_moved = 0;
  	for (let z = 0; z < obj.stuff_to_move.length; z++) {
  	  if (obj.stuff_to_move[z].sector == obj.ships_and_sectors[i].sector) {
  	    if (obj.stuff_to_move[z].i == i) {
  	      if (obj.stuff_to_move[z].ii == ii) {
  	        already_moved = 1;
  	      }
  	    }
  	  }
  	}	
  
  	if (already_moved == 1) {
  
            html += '<li id="sector_'+i+'_'+ii+'" class=""><b>'+obj.ships_and_sectors[i].ships[ii].name+'</b></li>';
  
  	} else {
  
  	  if (obj.ships_and_sectors[i].ships[ii].move - (obj.ships_and_sectors[i].adjusted_distance[ii] + spent_distance_boost) >= 0) {
              html += '<li id="sector_'+i+'_'+ii+'" class="option">'+obj.ships_and_sectors[i].ships[ii].name+'</li>';
  	  }
  	}
        }
        html += '</ul>';
      }
      html += '<p></p>';
      html += '<div id="confirm" class="option">click here to move</div>';
      imperium_self.updateStatus(html);
 
      //
      // add hover / mouseover to sector names
      //
      let adddiv = ".sector_name";
      $(adddiv).on('mouseenter', function() { let s = $(this).attr("id"); imperium_self.addSectorHighlight(s); });
      $(adddiv).on('mouseleave', function() { let s = $(this).attr("id"); imperium_self.removeSectorHighlight(s); });



      $('.option').off();
      $('.option').on('click', function() {
  
        let id = $(this).attr("id");
  
        //
        // submit when done
        //
        if (id == "confirm") {
  
          imperium_self.addMove("resolve\tplay");
          imperium_self.addMove("continue\t"+imperium_self.game.player+"\t"+destination);
          imperium_self.addMove("pds_space_defense\t"+imperium_self.game.player+"\t"+destination);
          for (let y = 0; y < obj.stuff_to_move.length; y++) { 
            imperium_self.addMove("move\t"+imperium_self.game.player+"\t"+1+"\t"+obj.ships_and_sectors[obj.stuff_to_move[y].i].sector+"\t"+destination+"\t"+JSON.stringify(obj.ships_and_sectors[obj.stuff_to_move[y].i].ships[obj.stuff_to_move[y].ii])); 
          }
          for (let y = obj.stuff_to_load.length-1; y >= 0; y--) {
            imperium_self.addMove("load\t"+imperium_self.game.player+"\t"+0+"\t"+obj.stuff_to_load[y].sector+"\t"+obj.stuff_to_load[y].source+"\t"+obj.stuff_to_load[y].source_idx+"\t"+obj.stuff_to_load[y].unitjson+"\t"+obj.stuff_to_load[y].shipjson); 
          }
          imperium_self.endTurn();
          return;
        };
  
  
        //
        // highlight ship on menu
        //
        $(this).css("font-weight", "bold");
  
        //
        //  figure out if we need to load infantry / fighters
        //
        let tmpx = id.split("_");
        let i  = tmpx[1]; 
        let ii = tmpx[2];
        let calcdist = obj.ships_and_sectors[i].distance;
        let sector = obj.ships_and_sectors[i].sector;
        let sys = imperium_self.returnSystemAndPlanets(sector);
        let ship = obj.ships_and_sectors[i].ships[ii];
        let total_ship_capacity = imperium_self.returnRemainingCapacity(ship);
        let x = { i : i , ii : ii , sector : sector };
  
        //
        // calculate actual distance
        //
        let real_distance = calcdist + obj.distance_adjustment;
        let free_distance = ship.move + obj.fleet_move_bonus;
  
        if (real_distance > free_distance) {
  
  	//
  	// 
  	//
  	obj.ship_move_bonus--;
  
        }
  
  
        obj.stuff_to_move.push(x);

        updateInterface(imperium_self, obj, updateInterface);
  
  
        if (total_ship_capacity > 0) {
  
          let remove_what_capacity = 0;
          for (let z = 0; z < obj.stuff_to_load.length; z++) {
    	    let x = obj.stuff_to_load[z];
  	    if (x.i == i && x.ii == ii) {
  	      let thisunit = JSON.parse(obj.stuff_to_load[z].unitjson);
  	      remove_what_capacity += thisunit.capacity_required;
  	    }
          }

          let user_message = `<div id="menu-container">This ship has <span class="capacity_remaining">${total_ship_capacity}</span> capacity to carry fighters / infantry. Do you wish to add them? <p></p><ul>`;
  
          for (let i = 0; i < sys.p.length; i++) {
            let planetary_units = sys.p[i].units[imperium_self.game.player-1];
            let infantry_available_to_move = 0;
            for (let k = 0; k < planetary_units.length; k++) {
              if (planetary_units[k].name == "infantry") {
                infantry_available_to_move++;
              }
            }
            if (infantry_available_to_move > 0) {
              user_message += '<li class="addoption" id="addinfantry_p_'+i+'">add infantry from '+sys.p[i].name+' (<span class="add_infantry_remaining_'+i+'">'+infantry_available_to_move+'</span>)</li>';
            }
          }
  
console.log("HERE 5");

          let fighters_available_to_move = 0;
          for (let i = 0; i < sys.s.units[imperium_self.game.player-1].length; i++) {
            if (sys.s.units[imperium_self.game.player-1][i].name == "fighter") {
    	    fighters_available_to_move++;
            }
          }
          user_message += '<li class="addoption" id="addfighter_s_s">add fighter (<span class="add_fighters_remaining">'+fighters_available_to_move+'</span>)</li>';
          user_message += '<li class="addoption" id="skip">finish</li>';
          user_message += '</ul></div>';
  

          //
          // choice
          //
          $('.hud-menu-overlay').html(user_message);
          $('.hud-menu-overlay').show();
          $('.status').hide();
          $('.addoption').off();



  
	  //
	  // add hover / mouseover to message
	  //
          for (let i = 0; i < sys.p.length; i++) {
	    adddiv = "#addinfantry_p_"+i;
	    $(adddiv).on('mouseenter', function() { imperium_self.addPlanetHighlight(sector, i); });
	    $(adddiv).on('mouseleave', function() { imperium_self.removePlanetHighlight(sector, i); });
	  }
	  adddiv = "#addfighter_s_s";
	  $(adddiv).on('mouseenter', function() { imperium_self.addSectorHighlight(sector); });
	  $(adddiv).on('mouseleave', function() { imperium_self.removeSectorHighlight(sector); });

  
          // leave action enabled on other panels
          $('.addoption').on('click', function() {
  
            let id = $(this).attr("id");
            let tmpx = id.split("_");
            let action2 = tmpx[0];
 
    	  if (total_ship_capacity > 0) {

            if (action2 === "addinfantry") {
  
              let planet_idx = tmpx[2];
    	      let irdiv = '.add_infantry_remaining_'+planet_idx;
              let ir = parseInt($(irdiv).html());
              let ic = parseInt($('.capacity_remaining').html());
  
  	      //
  	      // we have to load prematurely. so JSON will be accurate when we move the ship, so player_move is 0 for load
  	      //
  	      let unitjson = imperium_self.unloadUnitFromPlanet(imperium_self.game.player, sector, planet_idx, "infantry");
  	      let shipjson_preload = JSON.stringify(sys.s.units[imperium_self.game.player-1][obj.ships_and_sectors[i].ship_idxs[ii]]);  


              imperium_self.loadUnitByJSONOntoShip(imperium_self.game.player, sector, obj.ships_and_sectors[i].ship_idxs[ii], unitjson);
  	  
  	      $(irdiv).html((ir-1));
  	      $('.capacity_remaining').html((ic-1));
  
  	      let loading = {};
  	          loading.sector = sector;
  	          loading.source = "planet";
  	          loading.source_idx = planet_idx;
  	          loading.unitjson = unitjson;
  	          loading.ship_idx = obj.ships_and_sectors[i].ship_idxs[ii];
  	          //loading.shipjson = JSON.stringify(sys.s.units[imperium_self.game.player-1][obj.ships_and_sectors[i].ship_idxs[ii]]);
  	          loading.shipjson = shipjson_preload;
  	          loading.i = i;
  	          loading.ii = ii;
  
  	      total_ship_capacity--;
  
  	      obj.stuff_to_load.push(loading);
  
  	      if (ic === 1 && total_ship_capacity == 0) {
                  $('.status').show();
                  $('.hud-menu-overlay').hide();
  	      }
  
              }
  
  
              if (action2 === "addfighter") {
  
                let ir = parseInt($('.add_fighters_remaining').html());
                let ic = parseInt($('.capacity_remaining').html());
    	        $('.add_fighters_remaining').html((ir-1));
  	        $('.capacity_remaining').html((ic-1));
  
  	        let unitjson = imperium_self.removeSpaceUnit(imperium_self.game.player, sector, "fighter");
  	        let shipjson_preload = JSON.stringify(sys.s.units[imperium_self.game.player-1][obj.ships_and_sectors[i].ship_idxs[ii]]);  

                imperium_self.loadUnitByJSONOntoShip(imperium_self.game.player, sector, obj.ships_and_sectors[i].ship_idxs[ii], unitjson);
  
  	        let loading = {};
    	        obj.stuff_to_load.push(loading);
  
  	        loading.sector = sector;
  	        loading.source = "ship";
  	        loading.source_idx = "";
  	        loading.unitjson = unitjson;
  	        loading.ship_idx = obj.ships_and_sectors[i].ship_idxs[ii];
  	        //loading.shipjson = JSON.stringify(sys.s.units[imperium_self.game.player-1][obj.ships_and_sectors[i].ship_idxs[ii]]);;
  	        loading.shipjson = shipjson_preload;
  	        loading.i = i;
  	        loading.ii = ii;
  
  	        total_ship_capacity--;
  
  	        if (ic == 1 && total_ship_capacity == 0) {
                  $('.status').show();
                  $('.hud-menu-overlay').hide();
                }
              }
   	    } // total ship capacity
  
            if (action2 === "skip") {
              $('.hud-menu-overlay').hide();
              $('.status').show();
            }
  
          });
        }
      });
    };
  
    updateInterface(imperium_self, obj, updateInterface);
  
    return;
  
  }
  
  
  
  playerInvadePlanet(player, sector) {
  
    let imperium_self = this;
    let sys = this.returnSystemAndPlanets(sector);
  
    let total_available_infantry = 0;
    let space_transport_available = 0;
    let space_transport_used = 0;
  
    let landing_forces = [];
    let planets_invaded = [];
  
    html = 'Which planet(s) do you invade: <p></p><ul>';
    for (let i = 0; i < sys.p.length; i++) {
      if (sys.p[i].owner != player) {
        html += '<li class="option sector_name" id="' + i + '">' + sys.p[i].name + ' (<span class="invadeplanet_'+i+'">0</span>)</li>'; 
      }
    }
    html += '<li class="option" id="confirm">launch invasion(s)</li>'; 
    html += '</ul>';
    this.updateStatus(html);
  
    let populated_planet_forces = 0;
    let populated_ship_forces = 0;
    let forces_on_planets = [];
    let forces_on_ships = [];
  
    $('.option').off();
    let adiv = ".sector_name";
    $(adiv).on('mouseenter', function() { let s = $(this).attr("id"); imperium_self.addPlanetHighlight(sector, s); });
    $(adiv).on('mouseleave', function() { let s = $(this).attr("id"); imperium_self.removePlanetHighlight(sector, s); });
    $('.option').on('click', function () {
  

      let planet_idx = $(this).attr('id');
  
      if (planet_idx == "confirm") {
        imperium_self.endTurn();
        return;
      }

console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");

      if (!planets_invaded.includes(planet_idx)) {
        imperium_self.addMove("invade_planet\t"+imperium_self.game.player+"\t"+1+"\t"+imperium_self.game.player+"\t"+sys.p[planet_idx].owner+"\t"+sector+"\t"+planet_idx);
        planets_invaded.push(planet_idx);
      }
  
      //
      // figure out available infantry and ships capacity
      //
      for (let i = 0; i < sys.s.units[player - 1].length; i++) {
        let unit = sys.s.units[player-1][i];
        for (let k = 0; k < unit.storage.length; k++) {
  	if (unit.storage[k].name == "infantry") {
            if (populated_ship_forces == 0) {
              total_available_infantry += 1;
  	  }
  	}
        }
        if (sys.s.units[player - 1][i].capacity > 0) {
          if (populated_ship_forces == 0) {
            space_transport_available += sys.s.units[player - 1][i].capacity;
          }
        }
      }
  
      html = 'Select Ground Forces for Invasion of '+sys.p[planet_idx].name+': <p></p><ul>';
  
      //
      // other planets in system
      //
      for (let i = 0; i < sys.p.length; i++) {
        forces_on_planets.push(0);
        if (space_transport_available > 0 && sys.p[i].units[player - 1].length > 0) {
          for (let j = 0; j < sys.p[i].units[player - 1].length; j++) {
            if (sys.p[i].units[player - 1][j].name == "infantry") {
              if (populated_planet_forces == 0) {
                forces_on_planets[i]++;;
  	    }
            }
          }
          html += '<li class="invadechoice" id="invasion_planet_'+i+'">'+sys.p[i].name+' (<span class="planet_'+i+'_infantry">'+forces_on_planets[i]+'</span>)</li>';
        }
      }
      populated_planet_forces = 1;
  
  
  
      //
      // ships in system
      //
      for (let i = 0; i < sys.s.units[player-1].length; i++) {
        let ship = sys.s.units[player-1][i];
        forces_on_ships.push(0);
        for (let j = 0; j < ship.storage.length; j++) {
  	if (ship.storage[j].name === "infantry") {
            if (populated_ship_forces == 0) {
              forces_on_ships[i]++;
  	  } else {
  
  	    // need to subtract forces removed from ship
  
  	  }
  	}
        }
        html += '<li class="invadechoice" id="invasion_ship_'+i+'">'+ship.name+' (<span class="ship_'+i+'_infantry">'+forces_on_ships[i]+'</span>)</li>';
      }
      populated_ship_forces = 1;
      html += '<li class="invadechoice" id="finished_0_0">finish selecting</li>';
      html += '</ul>';
  
  
      //
      // choice
      //
      $('.hud-menu-overlay').html(html);
      $('.status').hide();
      $('.hud-menu-overlay').show();
  
  
      $('.invadechoice').off();
      $('.invadechoice').on('click', function() {

        let id = $(this).attr("id");
        let tmpx = id.split("_");
  
        let action2 = tmpx[0];
        let source = tmpx[1];
        let source_idx = tmpx[2];
        let counter_div = "." + source + "_"+source_idx+"_infantry";
        let counter = parseInt($(counter_div).html());
  
        if (action2 == "invasion") {
  
          if (source == "planet") {
     	    if (space_transport_available <= 0) { alert("Invalid Choice! No space transport available!"); return; }
  	    forces_on_planets[source_idx]--;
          } else {
  	    forces_on_ships[source_idx]--;
          }
          if (counter == 0) { 
   	    alert("You cannot attack with forces you do not have available."); return;
          }
 
    	  let unitjson = JSON.stringify(imperium_self.returnUnit("infantry", imperium_self.game.player));
  
          let landing = {};
              landing.sector = sector;
              landing.source = source;
              landing.source_idx = source_idx;
              landing.planet_idx = planet_idx;
              landing.unitjson = unitjson;
 
console.log("LOADING THIS UNIT INTO LANDING FORCES: " + unitjson); 
          landing_forces.push(landing);
console.log("LANDING FORCES NOW HAVE N UNITS: " + landing_forces.length);
  
          let planet_counter = ".invadeplanet_"+planet_idx;
          let planet_forces = parseInt($(planet_counter).html());
  
          planet_forces++;
          $(planet_counter).html(planet_forces);
  
          counter--;
          $(counter_div).html(counter);
  
        }
  
        if (action2 === "finished") {
  
          //
          // submit when done
          //
console.log("TOTAL FORCES LANDING: " + landing_forces.length);
          for (let y = 0; y < landing_forces.length; y++) {
console.log("\n\nLANDING 1 UNIT: ");
    	    imperium_self.addMove("land\t"+imperium_self.game.player+"\t"+1+"\t"+landing_forces[y].sector+"\t"+landing_forces[y].source+"\t"+landing_forces[y].source_idx+"\t"+landing_forces[y].planet_idx+"\t"+landing_forces[y].unitjson);
          };
	  landing_forces = [];  

          $('.status').show();
          $('.hud-menu-overlay').hide();
  
          return;
        }
      });
    });
  }
  
  
  canPlayerActivateSystem(pid) {
  
    let imperium_self = this;
    let sys = imperium_self.returnSystemAndPlanets(pid);
    if (sys.s.activated[imperium_self.game.player-1] == 1) { return 0; }
    return 1;
  
  }


  playerActivateSystem() {
  
    let imperium_self = this;
    let html  = "Select a sector to activate: ";
    let activated_once = 0;
  
    imperium_self.updateStatus(html);
  
    $('.sector').off();
    $('.sector').on('click', function() {

      //
      // only allowed 1 at a time
      //
      if (activated_once == 1) { return; }

      let pid = $(this).attr("id");
  

      if (imperium_self.canPlayerActivateSystem(pid) == 0) {
  
        alert("You cannot activate that system: " + pid);
  
      } else {
  
        activated_once = 1;
        let sys = imperium_self.returnSystemAndPlanets(pid);
        let divpid = '#'+pid;
  
        $(divpid).find('.hex_activated').css('background-color', 'yellow');
        $(divpid).find('.hex_activated').css('opacity', '0.3');
  
        let c = confirm("Activate this system?");
        if (c) {
          //$('.sector').off();
          sys.s.activated[imperium_self.game.player-1] = 1;
    //      imperium_self.addMove("resolve\tplay");
          imperium_self.addMove("activate\t"+imperium_self.game.player+"\t"+pid);
          imperium_self.addMove("expend\t"+imperium_self.game.player+"\t"+"command"+"\t"+1);
          imperium_self.playerPostActivateSystem(pid);
        }
      }
  
    });
  }
  
  
  playerPostActivateSystem(sector) {
  
    let imperium_self = this;
  
    //
    // move
    // space
    // ground
    // produce
    //
    let html  = this.returnFaction(this.game.player) + ": <p></p><ul>";
        html += '<li class="option" id="move">move into sector</li>';
    if (this.canPlayerProduceInSector(this.game.player, sector)) {
        html += '<li class="option" id="produce">produce units</li>';
    }
        html += '<li class="option" id="finish">finish turn</li>';
        html += '</ul>';
  
    imperium_self.updateStatus(html);
  
    $('.option').on('click', function() {
  
      let action2 = $(this).attr("id");
  
      if (action2 == "move") {
        imperium_self.playerSelectUnitsToMove(sector);
      }
      if (action2 == "produce") {
        imperium_self.playerProduceUnits(sector);
      }
      if (action2 == "finish") {
        imperium_self.addMove("resolve\tplay");
        imperium_self.endTurn();
      }
    });
  }
  
  
  
  
  
  
  /////////////////////////
  // Add Events to Board //
  /////////////////////////
  addEventsToBoard() {
  
    let imperium_self = this;
    let pid  = "";
  
    $('.sector').off();
    $('.sector').on('mouseenter', function() {
      pid = $(this).attr("id");
      imperium_self.showSector(pid);
    }).on('mouseleave', function() {
      pid = $(this).attr("id");
      imperium_self.hideSector(pid);
    });
  
  }
  
  
  
  
  exhaustPlanet(pid) {
    this.game.planets[pid].exhausted = 1;
  }
  unexhaustPlanet(pid) {
    this.game.planets[pid].exhausted = 0;
  }
  updatePlanetOwner(sector, planet_idx) {
    let sys = this.returnSystemAndPlanets(sector);
    let owner = -1;
    for (let i = 0; i < sys.p[planet_idx].units.length; i++) {
      if (sys.p[planet_idx].units[i].length > 0) { owner = i+1; }
    }
    if (owner != -1) {
      sys.p[planet_idx].owner = owner;
      sys.p[planet_idx].exhausted = 1;
    }
    this.saveSystemAndPlanets(sys);
  }
  
  
  
  
  ///////////////////////
  // Display Gameboard //
  ///////////////////////
  showSector(pid) {
  
    let hex_space = ".sector_graphics_space_"+pid; 
    let hex_ground = ".sector_graphics_planet_"+pid;
  
    $(hex_space).fadeOut();
    $(hex_ground).fadeIn();
  
  }
  hideSector(pid) {
  
    let hex_space = ".sector_graphics_space_"+pid; 
    let hex_ground = ".sector_graphics_planet_"+pid;
  
    $(hex_ground).fadeOut();
    $(hex_space).fadeIn();
  
  }
  
  
  
  
  
  
  
  
  
  
  
  
  addPlanetaryUnit(player, sector, planet_idx, unitname) {
    return this.loadUnitOntoPlanet(player, sector, planet_idx, unitname);
  };
  addSpaceUnitByJSON(player, sector, planet_idx, unitjson) {
    return this.loadUnitByJSONOntoPlanet(player, sector, planet_idx, unitname);
  };
  addSpaceUnit(player, sector, unitname) {
    let sys = this.returnSystemAndPlanets(sector);
    let unit_to_add = this.returnUnit(unitname, player);
    sys.s.units[player - 1].push(unit_to_add);
    this.saveSystemAndPlanets(sys);
    return JSON.stringify(unit_to_add);
  };
  addSpaceUnitByJSON(player, sector, unitjson) {
    let sys = this.returnSystemAndPlanets(sector);
    sys.s.units[player - 1].push(JSON.parse(unitjson));
    this.saveSystemAndPlanets(sys);
    return unitjson;
  };
  removeSpaceUnit(player, sector, unitname) {
    let sys = this.returnSystemAndPlanets(sector);
  
    for (let i = 0; i < sys.s.units[player - 1].length; i++) {
      if (sys.s.units[player - 1][i].name === unitname) {
        let removedunit = sys.s.units[player - 1].splice(i, 1);
        this.saveSystemAndPlanets(sys);
        return JSON.stringify(removedunit[0]);
        ;
      }
    }
  };
  removeSpaceUnitByJSON(player, sector, unitjson) {
    let sys = this.returnSystemAndPlanets(sector);
    for (let i = 0; i < sys.s.units[player - 1].length; i++) {
      if (JSON.stringify(sys.s.units[player - 1][i]) === unitjson) {
        sys.s.units[player - 1].splice(i, 1);
        this.saveSystemAndPlanets(sys);
        return unitjson;
      }
    }
  };
  loadUnitOntoPlanet(player, sector, planet_idx, unitname) {
    let sys = this.returnSystemAndPlanets(sector);
    let unit_to_add = this.returnUnit(unitname, player);
    sys.p[planet_idx].units[player - 1].push(unit_to_add);
    this.saveSystemAndPlanets(sys);
    return JSON.stringify(unit_to_add);
  };
  loadUnitByJSONOntoPlanet(player, sector, planet_idx, unitjson) {
    let sys = this.returnSystemAndPlanets(sector);
    sys.p[planet_idx].units[player - 1].push(JSON.parse(unitjson));
    this.saveSystemAndPlanets(sys);
    return unitjson;
  };
  loadUnitOntoShip(player, sector, ship_idx, unitname) {
    let sys = this.returnSystemAndPlanets(sector);
    let unit_to_add = this.returnUnit(unitname, player);
    sys.s.units[player - 1][ship_idx].storage.push(unit_to_add);
    this.saveSystemAndPlanets(sys);
    return JSON.stringify(unit_to_add);
  };
  loadUnitByJSONOntoShip(player, sector, ship_idx, unitjson) {
    let sys = this.returnSystemAndPlanets(sector);
    sys.s.units[player - 1][ship_idx].storage.push(JSON.parse(unitjson));
    this.saveSystemAndPlanets(sys);
    return unitjson;
  };
  loadUnitOntoShipByJSON(player, sector, shipjson, unitname) {
    let sys = this.returnSystemAndPlanets(sector);
    for (let i = 0; i < sys.s.units[player - 1].length; i++) {
      if (JSON.stringify(sys.s.units[player - 1][i]) === shipjson) {
        let unit_to_add = this.returnUnit(unitname, player);
        sys.s.units[player - 1][i].storage.push(unit_to_add);
        this.saveSystemAndPlanets(sys);
        return JSON.stringify(unit_to_add);
      }
    }
    return "";
  };
  loadUnitByJSONOntoShipByJSON(player, sector, shipjson, unitjson) {
    let sys = this.returnSystemAndPlanets(sector);
    for (let i = 0; i < sys.s.units[player - 1].length; i++) {
      if (JSON.stringify(sys.s.units[player - 1][i]) === shipjson) {
        sys.s.units[player - 1][i].storage.push(JSON.parse(unitjson));
        this.saveSystemAndPlanets(sys);
        return unitjson;
      }
    }
    return "";
  };
  loadUnitFromShip(player, sector, ship_idx, unitname) {
    let sys = this.returnSystemAndPlanets(sector);
    for (let i = 0; i < sys.s.units[player - 1][ship_idx].storage.length; i++) {
      if (sys.s.units[player - 1][ship_idx].storage[i].name === unitname) {
        let unit_to_remove = sys.s.units[player - 1][ship_idx].storage[i];
        sys.s.units[player-1][ship_idx].storage.splice(i, 1);
        this.saveSystemAndPlanets(sys);
        return JSON.stringify(unit_to_remove);
      }
    }
    return "";
  };
  unloadUnitFromPlanet(player, sector, planet_idx, unitname) {
    let sys = this.returnSystemAndPlanets(sector);
    for (let i = 0; i < sys.p[planet_idx].units[player - 1].length; i++) {
      if (sys.p[planet_idx].units[player - 1][i].name === unitname) {
        let unit_to_remove = sys.p[planet_idx].units[player - 1][i];
        sys.p[planet_idx].units[player-1].splice(i, 1);
        this.saveSystemAndPlanets(sys);
        return JSON.stringify(unit_to_remove);
      }
    }
    return "";
  };
  unloadUnitByJSONFromPlanet(player, sector, planet_idx, unitjson) {
    let sys = this.returnSystemAndPlanets(sector);
    for (let i = 0; i < sys.p[planet_idx].units[player-1].length; i++) {
      if (JSON.stringify(sys.p[planet_idx].units[player - 1][i]) === unitjson) {
        let unit_to_remove = sys.p[planet_idx].units[player - 1][i];
        sys.p[planet_idx].units[player-1].splice(i, 1);
        this.saveSystemAndPlanets(sys);
        return JSON.stringify(unit_to_remove);
      }
    }
    return "";
  };
  unloadUnitByJSONFromShip(player, sector, ship_idx, unitjson) {
    let sys = this.returnSystemAndPlanets(sector);
console.log("PLAYER: " + player);
console.log("SHIPS IN SECTOR: " + JSON.stringify(sys.s.units));
console.log("UNLOADING: " + unitjson);
console.log("FROM: " + sector + " -- " + ship_idx);
    for (let i = 0; i < sys.s.units[player - 1][ship_idx].length; i++) {
      if (JSON.stringify(sys.s.units[player - 1][ship_idx][i]) === unitjson) {
        sys.s.units[player-1][ship_idx].storage.splice(i, 1);
        this.saveSystemAndPlanets(sys);
        return unitjson;
      }
    }
    return "";
  };
  unloadUnitFromShipByJSON(player, sector, shipjson, unitname) {
    let sys = this.returnSystemAndPlanets(sector);
    for (let i = 0; i < sys.s.units[player - 1].length; i++) {
      if (JSON.stringify(sys.s.units[player - 1][i]) === shipjson) {
        for (let j = 0; j < sys.s.units[player - 1][i].storage.length; j++) {
          if (sys.s.units[player - 1][i].storage[j].name === unitname) {
            sys.s.units[player-1][i].storage.splice(j, 1);
            this.saveSystemAndPlanets(sys);
            return unitjson;
          }
        }
      }
    }
    return "";
  };
  unloadUnitByJSONFromShipByJSON(player, sector, shipjson, unitjson) {
    let sys = this.returnSystemAndPlanets(sector);
    for (let i = 0; i < sys.s.units[player - 1].length; i++) {
      if (JSON.stringify(sys.s.units[player - 1][i]) === shipjson) {
        for (let j = 0; j < sys.s.units[player - 1][i].storage.length; j++) {
          if (JSON.stringify(sys.s.units[player - 1][i].storage[j]) === unitjson) {
            sys.s.units[player-1][i].storage.splice(j, 1);
            this.saveSystemAndPlanets(sys);
            return unitjson;
          }
        }
      }
    }
    return "";
  };
  unloadStoredShipsIntoSector(player, sector) {
    let sys = this.returnSystemAndPlanets(sector);
console.log("111a");
    for (let i = 0; i < sys.s.units[player - 1].length; i++) {
console.log("111a: " + i);
      for (let j = 0; j < sys.s.units[player - 1][i].storage.length; j++) {
	let unit = sys.s.units[player-1][i].storage[j];
console.log("unitjson: " + unitjson);
	let unitjson = JSON.stringify(unit);
console.log("JSONstringifyunit: " + JSON.stringify(unit));
console.log("checking to see if we should unload: " + unit.name);
        if (unit.name === "fighter") {
	  sys.s.units[player-1].push(unit);
          sys.s.units[player-1][i].storage.splice(j, 1);
	}
      }
    }
console.log("updating graphics...");
    this.updateSectorGraphics(sector);
    this.saveSystemAndPlanets(sys);
console.log("saved system and planets...");
  }
  
  
  
  
  
  
  
  
  pdsSpaceDefense(attacker, destination) {
  
    let sys = this.returnSystemAndPlanets(destination);
    let x = this.returnSectorsWithinHopDistance(destination, 1);
    let sectors = [];
    let distance = [];
  
  
    sectors = x.sectors;
    distance = x.distance;
  
    //
    // get enemy pds units within range
    //
    let battery = this.returnPDSWithinRange(attacker, destination, sectors, distance);
    let hits = 0;
  
    if (battery.length > 0) {
  
      for (let i = 0; i < battery.length; i++) {
  
        let roll = this.rollDice();
        if (roll >= battery[i].combat) {
          hits++;
        } else {
        }
  
      }
  
      if (hits > 1) {
        this.updateLog(battery.length + " PDS units fire... " + hits + " hit");
      }
      if (hits == 1) {
        this.updateLog(battery.length + " PDS units fire... " + hits + " hits");
      }
      if (hits == 0) {
        this.updateLog(battery.length + " PDS units fire... " + hits + " hit");
      }
  
  
      if (hits > 0) {
        this.assignHitsToSpaceFleet(attacker, destination, hits);
        this.eliminateDestroyedUnitsInSector(attacker, destination);
      }
    }
  }
  
  
  

  
  
  
  invadePlanet(attacker, defender, sector, planet_idx) {
  
    let sys = this.returnSystemAndPlanets(sector);
  
    attacker_faction = this.returnFaction(attacker);
    defender_faction = this.returnFaction(defender);
  
    let attacker_forces = 0;
    let defender_forces = 0;
  
    //
    // if defender exists
    //
    if (defender != -1) {
  
      //
      // planetary defense system
      //
      let hits = 0;
      for (let z = 0; z < sys.p[planet_idx].units[defender-1].length; z++) {
        if (sys.p[planet_idx].units[defender-1][z].name == "pds") {
          let roll = this.rollDice(10);
          if (roll >= 6) {
            this.updateLog("PDS fires and hits (roll: "+roll+")");
    	  hits++;  
          } else {
          }
        }
      }
  
      //
      // assign hits
      //
      this.assignHitsToGroundForces(attacker, sector, planet_idx, hits);
      this.eliminateDestroyedUnitsOnPlanet(attacker, sector, planet_idx);
  
  
      //
      // while the battle rages...
      //
      attacker_forces = this.returnNumberOfGroundForcesOnPlanet(attacker, sector, planet_idx);
      defender_forces = this.returnNumberOfGroundForcesOnPlanet(defender, sector, planet_idx);

this.updateLog("attacker forces: " + attacker_forces);
this.updateLog("defender forces: " + defender_forces);
  
      let total_attacker_hits = 0;
      let total_defender_hits = 0;
  
      while (attacker_forces > 0 && defender_forces > 0) {
  
        //
        // attacker rolls first
        //
        let attacker_hits = 0;
        let defender_hits = 0;
  
        for (let z = 0; z < sys.p[planet_idx].units[attacker-1].length; z++) {
          let unit = sys.p[planet_idx].units[attacker-1][z];
          if (unit.name == "infantry") {
            let roll = this.rollDice(10);
            if (roll >= unit.combat) {
    	    attacker_hits++;  
            } else {
            }
          }
        }
  
        for (let z = 0; z < sys.p[planet_idx].units[defender-1].length; z++) {
          let unit = sys.p[planet_idx].units[defender-1][z];
          if (unit.name == "infantry") {
            let roll = this.rollDice(10);
            if (roll >= unit.combat) {
      	    defender_hits++;  
            } else {
            }
          }
        }
  
        total_attacker_hits += attacker_hits;
        total_defender_hits += defender_hits;
  
        this.assignHitsToGroundForces(attacker, sector, planet_idx, defender_hits);
        this.assignHitsToGroundForces(defender, sector, planet_idx, attacker_hits);
  
        //
        // attacker strikes defender
        //
        attacker_forces = this.returnNumberOfGroundForcesOnPlanet(attacker, sector, planet_idx);
        defender_forces = this.returnNumberOfGroundForcesOnPlanet(defender, sector, planet_idx);
  
      }
  
      if (total_attacker_hits > 0) {
        this.updateLog(total_attacker_hits + " hits for " + this.returnFaction(attacker));
      }
      if (total_defender_hits > 0) {
        this.updateLog(total_defender_hits + " hits for " + this.returnFaction(defender));
      }
    } else {

      attacker_forces = this.returnNumberOfGroundForcesOnPlanet(attacker, sector, planet_idx);
  
   }
  
this.updateLog("attacker forces: " + attacker_forces);
this.updateLog("defender forces: " + defender_forces);
  
    //
    // evaluate if planet has changed hands
    //
    if (attacker_forces > defender_forces || defender == -1) {
  
      //
      // destroy all units belonging to defender (pds, spacedocks)
      //
      if (defender != -1) {
        sys.p[planet_idx].units[defender-1] = [];
      }
  

console.log("This is who is on the planet: ");
console.log(JSON.stringify(sys.p[planet_idx].units[attacker-1]));

      //
      // notify everyone
      //
      let survivors = 0;
      for (let i = 0; i < sys.p[planet_idx].units[attacker-1].length; i++) {
        if (sys.p[planet_idx].units[attacker-1][i].name == "infantry") { survivors++; }
      }
      if (survivors == 1) { 
        this.updateLog(sys.p[planet_idx].name + " is conquered by " + this.returnFaction(attacker) + " (" + survivors + " survivor)");
      } else {
        this.updateLog(sys.p[planet_idx].name + " is conquered by " + this.returnFaction(attacker) + " (" + survivors + " survivors)");
      }
  
      //
      // planet changes ownership
      //
      sys.p[planet_idx].owner = attacker;
      sys.p[planet_idx].exhausted = 1;
  
    } else {
  
      //
      // notify everyone
      //
      this.updateLog("Invasion fails!");
  
    }
  
    //
    // remove destroyed units
    //
    this.eliminateDestroyedUnitsOnPlanet(attacker, sector, planet_idx);
    this.eliminateDestroyedUnitsOnPlanet(defender, sector, planet_idx);
  
    //
    // save regardless
    //
    this.saveSystemAndPlanets(sys);
  
  }
  



  
  invadeSector(attacker, sector) {
  
    let sys = this.returnSystemAndPlanets(sector);
  
    let defender = 0;
    let defender_found = 0;
    for (let i = 0; i < sys.s.units.length; i++) {
      if (attacker != (i+1)) {
        if (sys.s.units[i].length > 0) {
  	defender = (i+1);
  	defender_found = 1;
        }
      }
    }
  
    if (defender_found == 0) {
      this.updateLog(this.returnFaction(attacker) + " fleet moves into " + this.returnSectorName(sector) + " unopposed.");
      return;
    }
  
  
    let attacker_faction = this.returnFaction(attacker);
    let defender_faction = this.returnFaction(defender);
  
  
    //
    // while the battle rages...
    //
    let attacker_forces = this.returnNumberOfSpaceFleetInSector(attacker, sector);
    let defender_forces = this.returnNumberOfSpaceFleetInSector(defender, sector);
  
    let total_attacker_hits = 0;
    let total_defender_hits = 0;
  
    while (attacker_forces > 0 && defender_forces > 0) {
  
      //
      // attacker rolls first
      //
      let attacker_hits = 0;
      let defender_hits = 0;
  
      for (let z = 0; z < sys.s.units[attacker-1].length; z++) {
        let unit = sys.s.units[attacker-1][z];
        let roll = this.rollDice(10);
        if (roll >= unit.combat) {
  //        this.updateLog(attacker_faction + " " +unit.name + " hits (roll: "+roll+")");
          attacker_hits++;  
        } else {
  //        this.updateLog(attacker_faction + " " +unit.name + " misses (roll: "+roll+")");
        }
      }
  
      for (let z = 0; z < sys.s.units[defender-1].length; z++) {
        let unit = sys.s.units[defender-1][z];
        let roll = this.rollDice(10);
        if (roll >= unit.combat) {
  //        this.updateLog(defender_faction + " " +unit.name + " hits (roll: "+roll+")");
          defender_hits++;  
        } else {
  //        this.updateLog(defender_faction + " " +unit.name + " misses (roll: "+roll+")");
        }
      }
  
      this.assignHitsToSpaceFleet(attacker, sector, defender_hits);
      this.assignHitsToSpaceFleet(defender, sector, attacker_hits);
  
      //
      // attacker strikes defender
      //
      attacker_forces = this.returnNumberOfSpaceFleetInSector(attacker, sector);
      defender_forces = this.returnNumberOfSpaceFleetInSector(defender, sector);
  
      total_attacker_hits += attacker_hits;
      total_defender_hits += defender_hits;
  
    }
  
    if (total_attacker_hits > 0) {
      this.updateLog(total_attacker_hits + " hits for " + this.returnFaction(attacker));
    }
    if (total_defender_hits > 0) {
      this.updateLog(total_defender_hits + " hits for " + this.returnFaction(defender));
    }
  
    //
    // evaluate if sector has changed hands
    //
    if (attacker_forces > defender_forces) {
  
      //
      // destroy all floating units belonging to defender (pds, spacedocks)
      //
  
      //
      // notify everyone
      //
      this.updateLog(sys.s.name + " is now controlled by "+ this.returnFaction(attacker));
  
    } else {
  
      //
      // notify everyone
      //
      this.updateLog("Invasion fails!");
  
    }
  
    //
    // remove destroyed units
    //
    this.eliminateDestroyedUnitsInSector(attacker, sector);
    this.eliminateDestroyedUnitsInSector(defender, sector);
  
    //
    // save regardless
    //
    this.saveSystemAndPlanets(sys);
  
  }
  
 


 
  isPlanetExhausted(planetname) {
    if (this.game.planets[planetname].exhausted == 1) { return 1; }
    return 0;
  }
  
  


  canPlayerProduceInSector(player, sector) {
  
    let sys = this.returnSystemAndPlanets(sector);
  
    for (let i = 0; i < sys.p.length; i++) {
      for (let k = 0; k < sys.p[i].units[player-1].length; k++) {
        if (sys.p[i].units[player-1][k].name == "spacedock") {
          return 1;
        }
      }
    }
  
    return 0;
  }



  
  canPlayerInvadePlanet(player, sector) {
  
    let sys = this.returnSystemAndPlanets(sector);
    let space_transport_available = 0;
    let planets_ripe_for_plucking = 0;
    let total_available_infantry = 0;
    let can_invade = 0;
  
    //
    // any planets available to invade?
    //
    for (let i = 0; i < sys.p.length; i++) {
      if (sys.p[i].owner != player) { planets_ripe_for_plucking = 1; }
    }
    if (planets_ripe_for_plucking == 0) { return 0; }
  
  
    //
    // do we have any infantry for an invasion
    //
    for (let i = 0; i < sys.s.units[player-1].length; i++) {
      let unit = sys.s.units[player-1][i];
      for (let k = 0; k < unit.storage.length; k++) {
        if (unit.storage[k].name == "infantry") {
          total_available_infantry += 1;
        }
      }
      if (unit.capacity > 0) { space_tranport_available = 1; }
    }
  
    //
    // return yes if troops in space
    //
    if (total_available_infantry > 0) {
      return 1;
    }
  
    //
    // otherwise see if we can transfer over from another planet in the sector
    //
    if (space_transport_available == 1) {
      for (let i = 0; i < sys.p.length; i++) {
        for (let k = 0; k < sys.p[i].units[player-1].length; k++) {
          if (sys.p[i].units[player-1][k].name == "infantry") { return 1; }
        }
      }
    }
  
    //
    // sad!
    //
    return 0;
  }
  
  
  



  eliminateDestroyedUnitsInSector(player, sector) {
  
    if (player < 0) { return; }
  
    let sys = this.returnSystemAndPlanets(sector);
  
    //
    // in space
    //
    for (let z = 0; z < sys.s.units[player-1].length; z++) {
      if (sys.s.units[player-1][z].destroyed == 1) {
        sys.s.units[player-1].splice(z, 1);
        z--;
      }
    }
  
    //
    // on planets
    //
    for (let planet_idx = 0; planet_idx < sys.p.length; planet_idx++) {
      for (let z = 0; z < sys.p[planet_idx].units[player-1].length; z++) {
        if (sys.p[planet_idx].units[player-1][z].destroyed == 1) {
          sys.p[planet_idx].units[player-1].splice(z, 1);
          z--;
        }
      }
    }
  
    this.saveSystemAndPlanets(sys);
  
  }
  




  eliminateDestroyedUnitsOnPlanet(player, sector, planet_idx) {
  
    if (player < 0) { return; }
  
    let sys = this.returnSystemAndPlanets(sector);
  
    for (let z = 0; z < sys.p[planet_idx].units[player-1].length; z++) {
      if (sys.p[planet_idx].units[player-1][z].destroyed == 1) {
        sys.p[planet_idx].units[player-1].splice(z, 1);
        z--;
      }
    }
  
    this.saveSystemAndPlanets(sys);
  
  }




  assignHitsToGroundForces(defender, sector, planet_idx, hits) {
  
    let sys = this.returnSystemAndPlanets(sector);
    for (let i = 0; i < hits; i++) {
  
      //
      // find weakest unit
      //
      let weakest_unit = -1;
      let weakest_unit_idx = -1;
      for (let z = 0; z < sys.p[planet_idx].units[defender-1].length; z++) {
        let unit = sys.p[planet_idx].units[defender-1][z];
        if (unit.strength > 0 && weakest_unit_idx == -1 && unit.destroyed == 0) {
  	weakest_unit = sys.p[planet_idx].units[defender-1].strength;
  	weakest_unit_idx = z;
        }
        if (unit.strength > 0 && unit.strength < weakest_unit && weakest_unit_idx != -1) {
  	weakest_unit = unit.strength;
  	weakest_unit_idx = z;
        }
      }
  
      //
      // and assign 1 hit
      //
      if (weakest_unit_idx != -1) {
        sys.p[planet_idx].units[defender-1][weakest_unit_idx].strength--;
        if (sys.p[planet_idx].units[defender-1][weakest_unit_idx].strength <= 0) {
          sys.p[planet_idx].units[defender-1][weakest_unit_idx].destroyed = 1;
        }
      }
    }
  
    this.saveSystemAndPlanets(sys);
  
  }




  assignHitsToSpaceFleet(defender, sector, hits) {
  
    let sys = this.returnSystemAndPlanets(sector);
    for (let i = 0; i < hits; i++) {
  
      //
      // find weakest unit
      //
      let weakest_unit = -1;
      let weakest_unit_idx = -1;
      for (let z = 0; z < sys.s.units[defender-1].length; z++) {
        let unit = sys.s.units[defender-1][z];
        if (unit.strength > 0 && weakest_unit_idx == -1 && unit.destroyed == 0) {
  	weakest_unit = sys.s.units[defender-1][z].strength;
  	weakest_unit_idx = z;
        }
        if (unit.strength > 0 && unit.strength < weakest_unit && weakest_unit_idx != -1) {
  	weakest_unit = unit.strength;
  	weakest_unit_idx = z;
        }
      }
  
      //
      // and assign 1 hit
      //
      if (weakest_unit_idx != -1) {
        sys.s.units[defender-1][weakest_unit_idx].strength--;
        if (sys.s.units[defender-1][weakest_unit_idx].strength <= 0) {
          sys.s.units[defender-1][weakest_unit_idx].destroyed = 1;
        }
      }
    }
  
    this.saveSystemAndPlanets(sys);
  
  }
  
  



  returnInitiativeOrder() {
  
    let strategy_cards   = this.returnStrategyCards();
    let card_io_hmap  = [];
    let player_lowest = [];
  
    for (let j in strategy_cards) {
      card_io_hmap[j] = strategy_cards[j].order;
    }

 
console.log("Cards: " + JSON.stringify(card_io_hmap));
 
    for (let i = 0; i < this.game.players_info.length; i++) {

      player_lowest[i] = 100000;

      for (let k = 0; k < this.game.players_info[i].strategy.length; k++) {
        let sc = this.game.players_info[i].strategy[k];
console.log("this sc is: " + sc);
        let or = card_io_hmap[sc];
console.log("comes wth or: " + or);
        if (or < player_lowest[i]) { player_lowest[i] = or; }
      }
    }
  

    let loop = player_lowest.length;
    let player_initiative_order = [];
  
    for (let i = 0; i < loop; i++) {
      let a = player_lowest.indexOf(Math.max(...player_lowest));
console.log("pushing player: " + (a+1));
      player_lowest[a] = -1;
      player_initiative_order.push(a+1);
    }

  

    return player_initiative_order;
  
  }




  returnRemainingCapacity(unit) {
  
    let capacity = unit.capacity;
  
    for (let i = 0; i < unit.storage.length; i++) {
      if (unit.storage[i].can_be_stored != 0) {
        capacity -= unit.storage[i].capacity_required;
      }
    }
  
    if (capacity <= 0) { return 0; }
    return capacity;
  
  };





  returnSectorsWithinHopDistance(destination, hops) {
  
    let sectors = [];
    let distance = [];
    let s = this.returnSectors();
  
    sectors.push(destination);
    distance.push(0);
  
    //
    // find which systems within move distance (hops)
    //
    for (let i = 0; i < hops; i++) {
      let tmp = JSON.parse(JSON.stringify(sectors));
      for (let k = 0; k < tmp.length; k++) {
        let neighbours = s[tmp[k]].neighbours;
        for (let m = 0; m < neighbours.length; m++) {
  	if (!sectors.includes(neighbours[m]))  {
  console.log("adding neighbours " + neighbours[m] + " at " + (i+1) + " from " + tmp[k]);
  	  sectors.push(neighbours[m]);
  	  distance.push(i+1);
  	}
        }
      }
    }
    return { sectors : sectors , distance : distance };
  }
  




  returnPDSWithinRange(attacker, destination, sectors, distance) {
  
    let battery = [];
  
    for (let i = 0; i < sectors.length; i++) {
  
      let sys = this.returnSystemAndPlanets(sectors[i]);
  
      //
      // some sectors not playable in 3 player game
      //
      if (sys != null) {
  
        for (let j = 0; j < sys.p.length; j++) {
          for (let k = 0; k < sys.p[j].units.length; k++) {
  	  if (k != attacker-1) {
  	    for (let z = 0; z < sys.p[j].units[k].length; z++) {
  	      if (sys.p[j].units[k][z].name == "pds") {
  		if (sys.p[j].units[k][z].range <= distance[i]) {
  	          let pds = {};
  	              pds.combat = sys.p[j].units[k][z].combat;
  		      pds.owner = (k+1);
  		      pds.sector = sectors[i];
  
  	          battery.push(pds);
  		}
  	      }
  	    }
  	  }
          }
        }
      }
    }
  
    return battery;
  
  }
  




  returnShipsMovableToDestinationFromSectors(destination, sectors, distance) {
  
    let imperium_self = this;
    let ships_and_sectors = [];
    for (let i = 0; i < sectors.length; i++) {
  
      let sys = this.returnSystemAndPlanets(sectors[i]);
      
  
      //
      // some sectors not playable in 3 player game
      //
      if (sys != null) {
  
        let x = {};
        x.ships = [];
        x.ship_idxs = [];
        x.sector = null;
        x.distance = distance[i];
        x.adjusted_distance = [];
  
        //
        // only move from unactivated systems
        //
        if (sys.s.activated[imperium_self.game.player-1] == 0) {
  
          for (let k = 0; k < sys.s.units[this.game.player-1].length; k++) {
            let this_ship = sys.s.units[this.game.player-1][k];
  
  console.log("examining sector " + sectors[i] + " -- ship found ("+this_ship.name+") with move / distance : " + this_ship.move + " -- " + distance[i]);
  
            if (this_ship.move >= distance[i]) {
  console.log("PUSHING THIS SHIP TO OUR LIST!");
  	    x.adjusted_distance.push(distance[i]);
              x.ships.push(this_ship);
              x.ship_idxs.push(k);
              x.sector = sectors[i];
            }
          }
          if (x.sector != null) {
            ships_and_sectors.push(x);
          }
        }
  
      }
    }
  
    return ships_and_sectors;
  
  }
 

 
  //////////////////
  // Return Board //
  //////////////////
  returnBoard() {
  
    var board = {};
  
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        let divname = (i+1) + "_" + (j+1);
        board[divname] = { letter: "_" , fresh : 1 }
      }
    }
  
    return board;
  
  }
  
  
  /////////////////
  // Return Tile //
  /////////////////
  returnTile(slot="") {
  
    let tile = ' \
          <div class="hexIn" id="hexIn_'+slot+'"> \
            <div class="hexLink" id="hexLink_'+slot+'"> \
              <div class="hex_bg" id="hex_bg_'+slot+'"> \
                <img class="hex_img sector_graphics_background" id="hex_img_'+slot+'" src="" /> \
                <div class="hex_activated" id="hex_activated_'+slot+'"> \
  	      </div> \
                <div class="hex_space" id="hex_space_'+slot+'"> \
  	      </div> \
                <div class="hex_ground" id="hex_ground_'+slot+'"> \
  	      </div> \
              </div> \
            </div> \
          </div> \
    ';
    return tile;
  }
  
  
  ////////////////////
  // Return Planets //
  ////////////////////
  returnPlanets() {
  
    var planets = {};
  
    // regular planets
    planets['planet1']  = { type : "hazardous" , img : "/imperium/img/planets/" , name : "Crystalis" , resources : 3 , influence : 0 , bonus : ""  }
    planets['planet2']  = { type : "hazardous" , img : "/imperium/img/planets/TROTH.png" , name : "Troth" , resources : 2 , influence : 0 , bonus : ""  }
    planets['planet3']  = { type : "industrial" , img : "/imperium/img/planets/LONDRAK.png" , name : "Londrak" , resources : 1 , influence : 2 , bonus : ""  }
    planets['planet4']  = { type : "hazardous" , img : "/imperium/img/planets/CITADEL.png" , name : "Citadel" , resources : 0 , influence : 4 , bonus : "red"  }
    planets['planet5']  = { type : "industrial" , img : "/imperium/img/planets/BELVEDYR.png" , name : "Belvedyr" , resources : 1 , influence : 2 , bonus : ""  }
    planets['planet6']  = { type : "industrial" , img : "/imperium/img/planets/SHRIVA.png" , name : "Shriva" , resources : 2 , influence : 1 , bonus : ""  }
    planets['planet7']  = { type : "hazardous" , img : "/imperium/img/planets/ZONDOR.png" , name : "Zondor" , resources : 3 , influence : 1 , bonus : ""  }
    planets['planet8']  = { type : "hazardous" , img : "/imperium/img/planets/CALTHREX.png" , name : "Calthrex" , resources : 2 , influence : 3 , bonus : ""  }
    planets['planet9']  = { type : "cultural" , img : "/imperium/img/planets/SOUNDRA-IV.png" , name : "Soundra IV" , resources : 1 , influence : 3 , bonus : ""  }
    planets['planet10'] = { type : "industrial" , img : "/imperium/img/planets/" , name : "Udon I" , resources : 1 , influence : 1 , bonus : "blue"  }
    planets['planet11'] = { type : "cultural" , img : "/imperium/img/planets/UDON-II.png" , name : "Udon II" , resources : 1 , influence : 2 , bonus : ""  }
    planets['planet12'] = { type : "cultural" , img : "/imperium/img/planets/NEW-JYLANX.png" , name : "New Jylanx" , resources : 2 , influence : 0 , bonus : ""  }
    planets['planet13'] = { type : "cultural" , img : "/imperium/img/planets/TERRA-CORE.png" , name : "Terra Core" , resources : 0 , influence : 2 , bonus : ""  }
    planets['planet14'] = { type : "cultural" , img : "/imperium/img/planets/OLYMPIA.png" , name : "Olympia" , resources : 1 , influence : 2 , bonus : ""  }
    planets['planet15'] = { type : "industrial" , img : "/imperium/img/planets/GRANTON-MEX.png" , name : "Granton Mex" , resources : 1 , influence : 0 , bonus : "yellow"  }
    planets['planet16'] = { type : "hazardous" , img : "/imperium/img/planets/HARKON-CALEDONIA.png" , name : "Harkon Caledonia" , resources : 2 , influence : 1 , bonus : ""  }
    planets['planet17'] = { type : "cultural" , img : "/imperium/img/planets/NEW-ILLIA.png" , name : "New Illia" , resources : 3 , influence : 1 , bonus : ""  }
    planets['planet18'] = { type : "hazardous" , img : "/imperium/img/planets/LAZAKS-CURSE.png" , name : "Lazak's Curse" , resources : 1 , influence : 3 , bonus : "red"  }
    planets['planet19'] = { type : "cultural" , img : "/imperium/img/planets/VOLUNTRA.png" , name : "Voluntra" , resources : 0 , influence : 2 , bonus : ""  }
    planets['planet20'] = { type : "hazardous" , img : "/imperium/img/planets/XERXES-IV.png" , name : "Xerxes IV" , resources : 3 , influence : 1 , bonus : ""  }
    planets['planet21'] = { type : "industrial" , img : "/imperium/img/planets/SIRENS-END.png" , name : "Siren's End" , resources : 1 , influence : 1 , bonus : "green"  }
    planets['planet22'] = { type : "hazardous" , img : "/imperium/img/planets/RIFTVIEW.png" , name : "Riftview" , resources : 2 , influence : 1 , bonus : ""  }
    planets['planet23'] = { type : "cultural" , img : "/imperium/img/planets/BROUGHTON.png" , name : "Broughton" , resources : 1 , influence : 2 , bonus : ""  }
    planets['planet24'] = { type : "industrial" , img : "/imperium/img/planets/FJORDRA.png" , name : "Fjordra" , resources : 0 , influence : 3 , bonus : ""  }
    planets['planet25'] = { type : "cultural" , img : "/imperium/img/planets/SINGHARTA.png" , name : "Singharta" , resources : 1 , influence : 1 , bonus : ""  }
    planets['planet26'] = { type : "industrial" , img : "/imperium/img/planets/NOVA-KLONDIKE.png" , name : "Nova Klondike" , resources : 2 , influence : 2 , bonus : ""  }
    planets['planet27'] = { type : "industrial" , img : "/imperium/img/planets/CONTOURI-I.png" , name : "Contouri I" , resources : 1 , influence : 1 , bonus : "green"  }
    planets['planet28'] = { type : "hazardous" , img : "/imperium/img/planets/CONTOURI-II.png" , name : "Contouri II" , resources : 2 , influence : 0 , bonus : ""  }
    planets['planet29'] = { type : "cultural" , img : "/imperium/img/planets/HOTH.png" , name : "Hoth" , resources : 2 , influence : 2 , bonus : ""  }
    planets['planet30'] = { type : "industrial" , img : "/imperium/img/planets/UNSULLA.png" , name : "Unsulla" , resources : 1 , influence : 2 , bonus : ""  }
    planets['planet31'] = { type : "industrial" , img : "/imperium/img/planets/GROX-TOWERS.png" , name : "Grox Towers" , resources : 1 , influence : 1 , bonus : "blue"  }
    planets['planet32'] = { type : "hazardous" , img : "/imperium/img/planets/GRAVITYS-EDGE.png" , name : "Gravity's Edge" , resources : 2 , influence : 1 , bonus : ""  }
    planets['planet33'] = { type : "industrial" , img : "/imperium/img/planets/POPULAX.png" , name : "Populax" , resources : 3 , influence : 2 , bonus : "yellow"  }
    planets['planet34'] = { type : "cultural" , img : "/imperium/img/planets/OLD-MOLTOUR.png" , name : "Old Moltour" , resources : 2 , influence : 0 , bonus : ""  }
    planets['planet35'] = { type : "diplomatic" , img : "/imperium/img/planets/NEW-BYZANTIUM.png" , name : "New Byzantium" , resources : 1 , influence : 6 , bonus : ""  }
    planets['planet36'] = { type : "cultural" , img : "/imperium/img/planets/OUTERANT.png" , name : "Outerant" , resources : 1 , influence : 3 , bonus : ""  }
    planets['planet37'] = { type : "industrial" , img : "/imperium/img/planets/VESPAR.png" , name : "Vespar" , resources : 2 , influence : 2 , bonus : ""  }


    planets['planet38'] = { type : "hazardous" , img : "/imperium/img/planets/CRAW-POPULI.png" , name : "Craw Populi" , resources : 1 , influence : 2 , bonus : ""  }
    planets['planet41'] = { type : "industrial" , img : "/imperium/img/planets/LORSTRUCK.png" , name : "Lorstruck" , resources : 1 , influence : 0 , bonus : ""  }
    planets['planet42'] = { type : "hazardous" , img : "/imperium/img/planets/INDUSTRYL.png" , name : "Industryl" , resources : 3 , influence : 1 , bonus : ""  }
    planets['planet43'] = { type : "cultural" , img : "/imperium/img/planets/MECHANEX.png" , name : "Mechanex" , resources : 1 , influence : 0 , bonus : ""  }
    planets['planet44'] = { type : "industrial" , img : "/imperium/img/planets/HEARTHSLOUGH.png" , name : "Hearthslough" , resources : 3 , influence : 0 , bonus : ""  }
    planets['planet45'] = { type : "hazardous" , img : "/imperium/img/planets/" , name : "Incarth" , resources : 2 , influence : 0 , bonus : ""  }
    planets['planet46'] = { type : "cultural" , img : "/imperium/img/planets/AANDOR.png" , name : "Aandor" , resources : 2 , influence : 1 , bonus : ""  }
    planets['planet39'] = { type : "cultural" , img : "/imperium/img/planets/YSSARI-II.png" , name : "Yssari II" , resources : 0 , influence : 1 , bonus : ""  }
    planets['planet40'] = { type : "industrial" , img : "/imperium/img/planets/HOPES-LURE.png" , name : "Hope's Lure" , resources : 3 , influence : 2 , bonus : ""  }
    planets['planet47'] = { type : "hazardous" , img : "/imperium/img/planets/QUANDAM.png" , name : "Quandam" , resources : 1 , influence : 1 , bonus : ""  }
    planets['planet48'] = { type : "cultural" , img : "/imperium/img/planets/BREST.png" , name : "Brest" , resources : 3 , influence : 1 , bonus : ""  }
    planets['planet49'] = { type : "hazardous" , img : "/imperium/img/planets/HIRAETH.png" , name : "Hiraeth" , resources : 1 , influence : 1 , bonus : ""  }

  
    for (var i in planets) {
      planets[i].exhausted = 0;
      planets[i].owner = -1;
      planets[i].units = [this.totalPlayers]; // array to store units

      for (let j = 0; j < this.totalPlayers; j++) {
        planets[i].units[j] = [];
/*
	if (j == 1) {
	  planets[i].units[j].push(this.returnUnit("infantry", 1));
	  planets[i].units[j].push(this.returnUnit("infantry", 1));
	  planets[i].units[j].push(this.returnUnit("infantry", 1));
	  planets[i].units[j].push(this.returnUnit("pds", 1));
	  planets[i].units[j].push(this.returnUnit("pds", 1));
	  planets[i].units[j].push(this.returnUnit("spacedock", 1));
	}
*/
      }
    }
  
    return planets;
  }
  
  
  
  returnState() {
  
    let state = {};
  
        state.speaker = 1;
        state.round = 0;
        state.turn = 1;
        state.round_scoring = 0;
        state.events = {};
        state.laws = [];
        state.agendas = [];
        state.strategy_cards = [];
        state.strategy_cards_bonus = [];
        state.stage_i_objectives = [];
        state.stage_ii_objectives = [];
        state.secret_objectives = [];
        state.votes_available = [];
        state.votes_cast = [];
        state.voted_on_agenda = [];
        state.how_voted_on_agenda = [];
        state.voting_on_agenda = 0;
  
    return state;
  }
  
  ////////////////////
  // Return Planets //
  ////////////////////
  returnSystems() {
  
    var systems = {};
  
    systems['sector1']         = { img : "/imperium/img/sector1.png" , 	   name : "Sector 1" , hw : 0 , mr : 0 , planets : [] }
    systems['sector2']         = { img : "/imperium/img/sector2.png" , 	   name : "Sector 2" , hw : 0 , mr : 0 , planets : [] }
    systems['sector3']         = { img : "/imperium/img/sector3.png" , 	   name : "Sector 3" , hw : 0 , mr : 0 , planets : [] }
    systems['sector4']         = { img : "/imperium/img/sector4.png" , 	   name : "Sector 4" , hw : 0 , mr : 0 , planets : [] }
    systems['sector5']         = { img : "/imperium/img/sector5.png" , 	   name : "Sector 5" , hw : 0 , mr : 0 , planets : [] }
    systems['sector6']         = { img : "/imperium/img/sector6.png" , 	   name : "Sector 6" , hw : 0 , mr : 0 , planets : [] }
    systems['sector7']         = { img : "/imperium/img/sector7.png" , 	   name : "Sector 7" , hw : 0 , mr : 0 , planets : [] }
    systems['sector8']         = { img : "/imperium/img/sector8.png" , 	   name : "Sector 8" , hw : 0 , mr : 0 , planets : ['planet1','planet2'] }
    systems['sector9']         = { img : "/imperium/img/sector9.png" , 	   name : "Sector 9" , hw : 0 , mr : 0 , planets : ['planet3','planet4'] }
    systems['sector10']        = { img : "/imperium/img/sector10.png" , 	   name : "Sector 10" , hw : 0 , mr : 0 , planets : ['planet5','planet6'] }
    systems['sector11']        = { img : "/imperium/img/sector11.png" , 	   name : "Sector 11" , hw : 0 , mr : 0 , planets : ['planet7','planet8'] }
    systems['sector12']        = { img : "/imperium/img/sector12.png" , 	   name : "Sector 12" , hw : 0 , mr : 0 , planets : ['planet9','planet10'] }
    systems['sector13']        = { img : "/imperium/img/sector13.png" , 	   name : "Sector 13" , hw : 0 , mr : 0 , planets : ['planet11','planet12'] }
    systems['sector14']        = { img : "/imperium/img/sector14.png" , 	   name : "Sector 14" , hw : 0 , mr : 0 , planets : ['planet13','planet14'] }
    systems['sector15']        = { img : "/imperium/img/sector15.png" , 	   name : "Sector 15" , hw : 0 , mr : 0 , planets : ['planet15','planet16'] }
    systems['sector16']        = { img : "/imperium/img/sector16.png" , 	   name : "Sector 16" , hw : 0 , mr : 0 , planets : ['planet17','planet18'] }
    systems['sector17']        = { img : "/imperium/img/sector17.png" , 	   name : "Sector 17" , hw : 0 , mr : 0 , planets : ['planet19','planet20'] }
    systems['sector18']        = { img : "/imperium/img/sector18.png" , 	   name : "Sector 18" , hw : 0 , mr : 0 , planets : ['planet21','planet22'] }
    systems['sector19']        = { img : "/imperium/img/sector19.png" , 	   name : "Sector 19" , hw : 0 , mr : 0 , planets : ['planet23','planet24'] }
    systems['sector20']        = { img : "/imperium/img/sector20.png" , 	   name : "Sector 20" , hw : 0 , mr : 0 , planets : ['planet25','planet26'] }
    systems['sector21']        = { img : "/imperium/img/sector21.png" , 	   name : "Sector 21" , hw : 0 , mr : 0 , planets : ['planet27','planet28'] }
    systems['sector22']        = { img : "/imperium/img/sector22.png" , 	   name : "Sector 22" , hw : 0 , mr : 0 , planets : ['planet29'] }
    systems['sector23']        = { img : "/imperium/img/sector23.png" , 	   name : "Sector 23" , hw : 0 , mr : 0 , planets : ['planet30'] }
    systems['sector24']        = { img : "/imperium/img/sector24.png" , 	   name : "Sector 24" , hw : 0 , mr : 0 , planets : ['planet31'] }
    systems['sector25']        = { img : "/imperium/img/sector25.png" , 	   name : "Sector 25" , hw : 0 , mr : 0 , planets : ['planet32'] }
    systems['sector26']        = { img : "/imperium/img/sector26.png" , 	   name : "Sector 26" , hw : 0 , mr : 0 , planets : ['planet33'] }
    systems['sector27']        = { img : "/imperium/img/sector27.png" , 	   name : "Sector 27" , hw : 0 , mr : 0 , planets : ['planet34'] } 
    systems['new-byzantium']   = { img : "/imperium/img/sector28.png" , 	   name : "New Byzantium" , hw : 0 , mr : 1 , planets : ['planet35'] }
    systems['sector29']        = { img : "/imperium/img/sector29.png" , 	   name : "Sector 29" , hw : 0 , mr : 0 , planets : ['planet36'] }
    systems['sector30']        = { img : "/imperium/img/sector30.png" , 	   name : "Sector 30" , hw : 0 , mr : 0 , planets : ['planet37'] }
    systems['sector31']        = { img : "/imperium/img/sector31.png" , 	   name : "Sector 31" , hw : 0 , mr : 0 , planets : ['planet38'] }
    systems['sector32']        = { img : "/imperium/img/sector32.png" , 	   name : "Sector 32" , hw : 0 , mr : 0 , planets : ['planet39'] }
    systems['sector33']        = { img : "/imperium/img/sector34.png" , 	   name : "Sector 33" , hw : 0 , mr : 0 , planets : [] }
    systems['sector34']        = { img : "/imperium/img/sector34.png" , 	   name : "Sector 34" , hw : 0 , mr : 0 , planets : [] }
    systems['sector35']        = { img : "/imperium/img/sector35.png" , 	   name : "Sector 35" , hw : 0 , mr : 0 , planets : [] }
    systems['sector36']        = { img : "/imperium/img/sector36.png" , 	   name : "Sector 36" , hw : 0 , mr : 0 , planets : [] }
    systems['sector37']        = { img : "/imperium/img/sector36.png" , 	   name : "Sector 37" , hw : 0 , mr : 0 , planets : [] }
    systems['sector38']        = { img : "/imperium/img/sector38.png" , 	   name : "Sector 30" , hw : 1 , mr : 0 , planets : ['planet41','planet42'] }
    systems['sector39']        = { img : "/imperium/img/sector39.png" , 	   name : "Sector 31" , hw : 1 , mr : 0 , planets : ['planet43','planet44'] }
    systems['sector40']        = { img : "/imperium/img/sector40.png" , 	   name : "Sector 32" , hw : 1 , mr : 0 , planets : ['planet45','planet46'] }
    systems['sector41']        = { img : "/imperium/img/sector41.png" , 	   name : "Sector 41" , hw : 0 , mr : 0 , planets : ['planet40'] }
    systems['sector42']        = { img : "/imperium/img/sector42.png" , 	   name : "Sector 42" , hw : 0 , mr : 0 , planets : ['planet47'] }
    systems['sector43']        = { img : "/imperium/img/sector43.png" , 	   name : "Sector 43" , hw : 0 , mr : 0 , planets : ['planet48'] }
    systems['sector44']        = { img : "/imperium/img/sector44.png" , 	   name : "Sector 44" , hw : 0 , mr : 0 , planets : ['planet49'] }



    for (var i in systems) {
      systems[i].units = [this.totalPlayers]; // array to store units
      systems[i].activated = [this.totalPlayers]; // array to store units
  
      for (let j = 0; j < this.totalPlayers; j++) {
        systems[i].units[j] = []; // array of united
        systems[i].activated[j] = 0; // is this activated by the player
      }
  
      systems[i].units[1] = [];
  
    }
    return systems;
  };
  
  
  
  
  
  returnNumberOfSpaceFleetInSector(player, sector) {
  
    let sys = this.returnSystemAndPlanets(sector);
    let num = 0;
  
    for (let z = 0; z < sys.s.units[player-1].length; z++) {
      if (sys.s.units[player-1][z].strength > 0 && sys.s.units[player-1][z].destroyed == 0) {
        num++;
      }
    }
  
    return num;
  }



  returnNumberOfGroundForcesOnPlanet(player, sector, planet_idx) {
  
    let sys = this.returnSystemAndPlanets(sector);
    let num = 0;
  
    for (let z = 0; z < sys.p[planet_idx].units[player-1].length; z++) {
      if (sys.p[planet_idx].units[player-1][z].strength > 0 && sys.p[planet_idx].units[player-1][z].destroyed == 0) {
        num++;
      }
    }
  
    return num;
  }



  returnSectors() {
    var slot = {};
    slot['1_1'] = {
      neighbours: ["1_2", "2_1", "2_2"]
    };
    slot['1_2'] = {
      neighbours: ["1_1", "1_3", "2_2", "2_3"]
    };
    slot['1_3'] = {
      neighbours: ["1_2", "1_4", "2_3", "2_4"]
    };
    slot['1_4'] = {
      neighbours: ["1_3", "2_4", "2_5"]
    };
    slot['2_1'] = {
      neighbours: ["1_1", "2_2", "3_1", "3_2"]
    };
    slot['2_2'] = {
      neighbours: ["1_1", "1_2", "2_1", "2_3", "3_2", "3_3"]
    };
    slot['2_3'] = {
      neighbours: ["1_2", "1_3", "2_2", "2_4", "3_3", "3_4"]
    };
    slot['2_4'] = {
      neighbours: ["1_3", "1_4", "2_3", "2_5", "3_4", "3_5"]
    };
    slot['2_5'] = {
      neighbours: ["1_4", "2_4", "3_5", "3_6"]
    };
    slot['3_1'] = {
      neighbours: ["2_1", "3_2", "4_1", "4_2"]
    };
    slot['3_2'] = {
      neighbours: ["2_1", "2_2", "3_1", "3_3", "4_2", "4_3"]
    };
    slot['3_3'] = {
      neighbours: ["2_2", "2_3", "3_2", "3_4", "4_3", "4_4"]
    };
    slot['3_4'] = {
      neighbours: ["2_3", "2_4", "3_3", "3_5", "4_4", "4_5"]
    };
    slot['3_5'] = {
      neighbours: ["2_4", "3_4", "3_6", "4_5", "4_6"]
    };
    slot['3_6'] = {
      neighbours: ["2_5", "3_5", "4_6", "4_7"]
    };
    slot['4_1'] = {
      neighbours: ["3_1", "4_2", "5_1"]
    };
    slot['4_2'] = {
      neighbours: ["3_1", "3_2", "4_1", "4_3", "5_1", "5_2"]
    };
    slot['4_3'] = {
      neighbours: ["3_2", "3_3", "4_2", "4_4", "5_2", "5_3"]
    };
    slot['4_4'] = {
      neighbours: ["3_3", "3_4", "4_3", "4_5", "5_3", "5_4"]
    };
    slot['4_5'] = {
      neighbours: ["3_4", "3_5", "4_4", "4_6", "5_4", "5_5"]
    };
    slot['4_6'] = {
      neighbours: ["3_5", "3_6", "4_5", "4_7", "5_5", "5_6"]
    };
    slot['4_7'] = {
      neighbours: ["3_6", "4_6", "5_6"]
    };
    slot['5_1'] = {
      neighbours: ["4_1", "4_2", "5_2", "6_1"]
    };
    slot['5_2'] = {
      neighbours: ["4_2", "4_3", "5_1", "5_3", "6_1", "6_2"]
    };
    slot['5_3'] = {
      neighbours: ["4_3", "4_4", "5_2", "5_4", "6_2", "6_3"]
    };
    slot['5_4'] = {
      neighbours: ["4_4", "4_5", "5_3", "5_5", "6_3", "6_4"]
    };
    slot['5_5'] = {
      neighbours: ["4_5", "4_6", "5_4", "5_6", "6_4", "6_5"]
    };
    slot['5_6'] = {
      neighbours: ["4_6", "4_7", "5_5", "6_5"]
    };
    slot['6_1'] = {
      neighbours: ["5_1", "5_2", "6_2", "7_1"]
    };
    slot['6_2'] = {
      neighbours: ["5_2", "5_3", "6_1", "6_3", "7_1", "7_2"]
    };
    slot['6_3'] = {
      neighbours: ["5_3", "5_4", "6_2", "6_4", "7_2", "7_3"]
    };
    slot['6_4'] = {
      neighbours: ["5_4", "5_5", "6_3", "6_5", "7_3", "7_4"]
    };
    slot['6_5'] = {
      neighbours: ["5_5", "5_6", "6_4", "7_4"]
    };
    slot['7_1'] = {
      neighbours: ["6_1", "6_2", "7_2"]
    };
    slot['7_2'] = {
      neighbours: ["6_2", "6_3", "7_1", "7_3"]
    };
    slot['7_3'] = {
      neighbours: ["6_3", "6_4", "7_2", "7_4"]
    };
    slot['7_4'] = {
      neighbours: ["6_4", "6_5", "7_3"]
    };
    return slot;
  }; 
  
  
  



  //////////////////////////////
  // Return Secret Objectives //
  //////////////////////////////
  returnSecretObjectives() {
  
    let secret = {};
  
    secret['military-catastrophe']			= {
      name 	: 	"Military Catastrophe" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Destroy the flagship of another player" ,
      type	: 	"instant" ,
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['nuke-them-from-orbit']			= {
      name 	: 	"Nuke them from Orbit" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Destroy a player's last infantry using bombardment" ,
      type	: 	"instant" ,
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['anti-imperialism']			= {
      name 	: 	"Anti-Imperialism" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Achieve victory in combat with a player with the most VP" ,
      type	: 	"instant" , 
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['close-the-trap']			= {
      name 	: 	"Close the Trap" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Destroy another player's last ship in a system using a PDS" ,
      type	: 	"instant" ,
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['flagship-dominance']			= {
      name 	: 	"Launch Flagship" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Achieve victory in a space combat in a system containing your flagship. Your flagship must survive this combat" ,
      type	: 	"instant" ,
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['faction-technologies']			= {
      name 	: 	"Faction Technologies" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Research 2 faction technologies" ,
      type	: 	"instant" ,
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['wormhole-administrator']			= {
      name 	: 	"Wormhole Administrator" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Have at least 1 ship in systems containing alpha and beta wormholes respectively" ,
      type	: 	"instant" ,
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['galactic-observer']			= {
      name 	: 	"Galactic Observer" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Have at least 1 ship in 6 different sectors" ,
      type	: 	"instant" ,
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['establish-a-blockade']			= {
      name 	: 	"Establish a Blockade" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Have at least 1 ship in the same sector as an opponent's space dock" ,
      type	: 	"instant" ,
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['ion-cannon-master']			= {
      name 	: 	"Master of the Ion Cannon" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Have at least 4 PDS units in play" ,
      type	: 	"instant" ,
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['cultural-diplomacy']			= {
      name 	: 	"Cultural Diplomacy" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Control at least 4 cultural planets" ,
      type	: 	"instant" ,
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['act-of-espionage']			= {
      name 	: 	"Act of Espionage" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Discard 5 action cards from your hand" ,
      type	: 	"instant" ,
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['war-engine']			= {
      name 	: 	"Engine of War" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Have three space docks in play" ,
      type	: 	"instant" ,
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['fleet-of-terror']			= {
      name 	: 	"Fleet of Terror" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Have 5 dreadnaughts in play" ,
      type	: 	"instant" ,
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['space-to-breathe']			= {
      name 	: 	"Space to Breathe" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Have at least 1 ship in 3 systems with no planets" ,
      type	: 	"instant" ,
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['ascendant-technocracy']			= {
      name 	: 	"Ascendant Technocracy" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Research 4 tech upgrades on the same color path" ,
      type	: 	"instant" ,
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['penal-colonies']			= {
      name 	: 	"Penal Colonies" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Control four planets with hazardous conditions" ,
      type	: 	"instant" ,
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['master-of-production']			= {
      name 	: 	"Master of Production" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Control four planets with industrial civilizations" ,
      type	: 	"instant" ,
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['occupy-new-byzantium']			= {
      name 	: 	"Occupy New Byzantium" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Control New Byzantium and have at least 3 ships protecting the sector" ,
      type	: 	"instant",
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['cast-a-long-shadow']			= {
      name 	: 	"Cast a Long Shadow" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Have at least 1 ship in a system adjacent to an opponents homeworld" ,
      type	: 	"instant",
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
  
    return secret;
  
  }
  
  
  
  //////////////////////////////////////
  // Return Stage I Public Objectives //
  //////////////////////////////////////
  returnStageIPublicObjectives() {
  
    let obj = {};
  
    obj['manage-to-breathe']			= {
      name 	: 	"Figure out Breathing" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Just score this for free..." ,
      func	:	function(imperium_self, player) {
  
        return 1;
   
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    obj['planetary-unity']			= {
      name 	: 	"Planetary Unity" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Control four planets of the same planet type" ,
      func	:	function(imperium_self, player) {
  
        let planets = imperium_self.returnPlayerPlanetCards(player);
        let success = 0;
        let types   = [];
        for (let i = 0; i < 3; i++) { types[i] = 0; }
  
        for (let i = 0; i < planets.length; i++) {
          if (imperium_self.game.planets[planets[i]].type == "hazardous") { types[0]++; }
          if (imperium_self.game.planets[planets[i]].type == "industrial") { types[1]++; }
          if (imperium_self.game.planets[planets[i]].type == "cultural") { types[2]++; }
        }
  
        for (let i = 0; i < 3; i++) {
  	if (types[i] >= 4) { return 1; }
        }
  
        return 0;
  
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    obj['forge-of-war']				= {
      name 	: 	"Forge of War" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Research 2 unit upgrade technologies" ,
      func	:	function(imperium_self, player) {
  
        let tech = imperium_self.game.players_info[player-1].tech;
        let unit_upgrades = 0;
        for (let i = 0; i < tech.length; i++) {
  	if (imperium_self.game.tech[tech[i]].unit == 1) { unit_upgrades++; }
        }
        if (unit_upgrades >= 2) { return 1; }
        return 0;
  
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    obj['diversified-research']			= {
      name 	: 	"Diversified Research" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Research 2 technologies in two different color paths" ,
      func	:	function(imperium_self, player) {
  
        let tech = imperium_self.game.players_info[player-1].tech;
        let colortech = [];
        for (let i = 0; i < 4; i++) { colortech[i] = 0; }
  
        for (let i = 0; i < tech.length; i++) {
  	if (imperium_self.game.tech[tech[i]].color === "green") { colortech[0]++; }
  	if (imperium_self.game.tech[tech[i]].color === "red") { colortech[1]++; }
  	if (imperium_self.game.tech[tech[i]].color === "yellow") { colortech[2]++; }
  	if (imperium_self.game.tech[tech[i]].color === "blue") { colortech[3]++; }
        }
  
        let criteria = 0;
  
        for (let i = 0; i < 4; i++) {
          if (colortech[i] >= 2) { criteria++; }
        }
  
        if (criteria >= 2) { return 1; }
        return 0;
  
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
  
    };
    obj['mining-conglomerate']			= {
      name 	: 	"Mining Conglomerate" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Spend eight resources when scoring" ,
      func	:	function(imperium_self, player) {
  
        let ar = imperium_self.returnAvailableResources(player);
        if (ar > 8) {
  	return 1;
        }
        return 0;
  
      },
      post	:	function(imperium_self, player, mycallback) {
        imperium_self.playerSelectResources(8, function(success) {
          mycallback(1);
        });
      }
    };
    obj['colonization']				= {
      name 	: 	"Colonization" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Control six planets outside your home system" ,
      func	:	function(imperium_self, player) {
  
        let homeplanets = imperium_self.returnPlayerHomeworldPlanets(player);
        let planets = imperium_self.returnPlayerPlanetCards(player);
  
        let total_non_home_planets = 0;
  
        for (let i = 0; i < planets.length; i++) {
  	if (!homeplanets.includes(planets[i])) { total_non_home_planets++; }
        }
  
        if (total_non_home_planets >= 6) { return 1; }
        return 0;
  
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    obj['conquest-of-science']			= {
      name 	: 	"Conquest of Science" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Control 3 planets with tech specialities" ,
      func	:	function(imperium_self, player) {
  
        let planets = imperium_self.returnPlayerPlanetCards(player);
        let specialities = 0;
        for (let i = 0; i < planets.length; i++) {
          if (imperium_self.game.planets[planets[i]].bonus != "") { specialities++; }
        }
  
        if (specialities >= 3) {
  	return 1;
        }
  
        return 0;
  
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    obj['grand-gesture']				= {
      name 	: 	"A Grand Gesture" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Spend 3 command or strategy tokens when scoring" ,
      func	:	function(imperium_self, player) {
        if ((imperium_self.game.players_info[player-1].command_tokens + imperium_self.game.players_info[player-1].strategy_tokens) >= 3) { return 1; }
        return 0;
      },
      post	:	function(imperium_self, player, mycallback) {
        imperium_self.playerSelectStrategyAndCommandTokens(3, function(success) {
          mycallback(1);
        });
      }
    };
    obj['trade-outposts']				= {
      name 	: 	"Establish Trade Outposts" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Spend 5 trade goods when scoring" ,
      func	:	function(imperium_self, player) {
  
        if (imperium_self.game.players_info[player-1].goods >= 5) { return 1; }
        return 0;
  
      },
      post	:	function(imperium_self, player, mycallback) {
        imperium_self.addMove("expend\t"+player+"\ttrade\t5");
        mycallback(1);
      }
  
    };
    obj['pecuniary-diplomacy']			= {
      name 	: 	"Pecuniary Diplomacy" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Spend 8 influence when scoring" ,
      func	:	function(imperium_self, player) {
  
        let ar = imperium_self.returnAvailableInfluence(player);
        if (ar > 7) {
  	return 1;
        }
        return 0;
      },
      post	:	function(imperium_self, player, mycallback) {
        imperium_self.playerSelectInfluence(8, function(success) {
          mycallback(1);
        });
      },
   
    };
  
    return obj;
  
  }
  
  
  
  ///////////////////////////////////////
  // Return Stage II Public Objectives //
  ///////////////////////////////////////
  returnStageIIPublicObjectives() {
  
    let obj = {};
  
    obj['manage-two-breathe']			= {
      name 	: 	"Figure outwo Breathing" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Just score this two VP for free..." ,
      func	:	function(imperium_self, player) {
  
        return 1;
   
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    obj['master-of-commerce']			= {
      name 	: 	"Master of Commerce" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Spend 10 trade goods when scoring" ,
      func	:	function(imperium_self, player) {
  
        if (imperium_self.game.players_info[player-1].goods >= 10) { return 1; }
        return 0;
  
      },
      post	:	function(imperium_self, player, mycallback) {
        imperium_self.addMove("expend\t"+player+"\ttrade\t10");
        mycallback(1);
      }
  
    };
    obj['display-of-dominance']			= {
      name 	: 	"Display of Dominance" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Control at least 1 planet in another player's home sector" ,
      func	:	function(imperium_self, player) {
  
        let my_planets    = imperium_self.returnPlayerPlanetCards(player);
        let their_planets = imperium_self.returnOtherPlayerHomeworldPlanets(player);
  
        for (let i = 0; i < my_planets.length; i++) {
  	if (their_planets.includes(my_planets[i])) { return 1; }
        }
  
        return 0;
  
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    obj['technological-empire']			= {
      name 	: 	"Technological Empire" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Control 5 planets with tech bonuses" ,
      func	:	function(imperium_self, player) {
  
        let planets = imperium_self.returnPlayerPlanetCards(player);
        let specialities = 0;
        for (let i = 0; i < planets.length; i++) {
          if (imperium_self.game.planets[planets[i]].bonus != "") { specialities++; }
        }
  
        if (specialities >= 5) {
  	return 1;
        }
  
        return 0;
  
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
  
    };
    obj['galactic-currency']			= {
      name 	: 	"Establish Galactic Currency" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Spend 16 resources when scoring" ,
      func	:	function(imperium_self, player) {
  
        let ar = imperium_self.returnAvailableResources(player);
        if (ar > 15) {
  	return 1;
        }
        return 0;
  
      },
      post	:	function(imperium_self, player, mycallback) {
        imperium_self.playerSelectResources(16, function(success) {
          mycallback(1);
        });
      }
  
    };
    obj['cultural-revolution']			= {
      name 	: 	"A Cultural Revolution" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Spend 6 command or strategy tokens when scoring" ,
      func	:	function(imperium_self, player) {
  
        if ((imperium_self.game.players_info[player-1].command_tokens + imperium_self.game.players_info[player-1].strategy_tokens) >= 6) { return 1; }
        return 0;
  
      },
      post	:	function(imperium_self, player, mycallback) {
        imperium_self.playerSelectStrategyAndCommandTokens(6, function(success) {
          mycallback(1);
        });
      }
  
    };
    obj['power-broken']			= {
      name 	: 	"Power Broken" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Spend 16 influence when scoring" ,
      func	:	function(imperium_self, player) {
  
        let ar = imperium_self.returnAvailableInfluence(player);
        if (ar > 15) {
  	return 1;
        }
        return 0;
  
      },
      post	:	function(imperium_self, player, mycallback) {
        imperium_self.playerSelectInfluence(16, function(success) {
          mycallback(1);
        });
      }
  
    };
    obj['master-of-science']			= {
      name 	: 	"Master of Science" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Own 2 tech upgrades in each of 4 tech color paths" ,
      func	:	function(imperium_self, player) {
  
        let tech = imperium_self.game.players_info[player-1].tech;
        let colortech = [];
        for (let i = 0; i < 4; i++) { colortech[i] = 0; }
  
        for (let i = 0; i < tech.length; i++) {
  	if (imperium_self.game.tech[tech[i]].color === "green") { colortech[0]++; }
  	if (imperium_self.game.tech[tech[i]].color === "red") { colortech[1]++; }
  	if (imperium_self.game.tech[tech[i]].color === "yellow") { colortech[2]++; }
  	if (imperium_self.game.tech[tech[i]].color === "blue") { colortech[3]++; }
        }
  
        let criteria = 0;
  
        for (let i = 0; i < 4; i++) {
          if (colortech[i] >= 2) { criteria++; }
        }
  
        if (criteria >= 4) { return 1; }
        return 0;
  
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
  
    };
    obj['colonial-dominance']			= {
      name 	: 	"Colonial Dominance" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Control 11 planets outside your home system" ,
      func	:	function(imperium_self, player) {
  
        let homeplanets = imperium_self.returnPlayerHomeworldPlanets(player);
        let planets = imperium_self.returnPlayerPlanetCards(player);
  
        let total_non_home_planets = 0;
  
        for (let i = 0; i < planets.length; i++) {
  	if (!homeplanets.includes(planets[i])) { total_non_home_planets++; }
        }
  
        if (total_non_home_planets >= 11) { return 1; }
        return 0;
  
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
  
    };
    obj['advanced-technologies']			= {
      name 	: 	"Advanced Technologies" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Research 3 unit upgrade technologies" ,
      func	:	function(imperium_self, player) {
  
        let tech = imperium_self.game.players_info[player-1].tech;
        let unit_upgrades = 0;
        for (let i = 0; i < tech.length; i++) {
  	if (imperium_self.game.tech[tech[i]].unit == 1) { unit_upgrades++; }
        }
        if (unit_upgrades >= 3) { return 1; }
        return 0;
  
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
  
    };
    obj['imperial-unity']			= {
      name 	: 	"Imperial Unity" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Control 6 planets of the same planet type" ,
      func	:	function(imperium_self, player) {
  
        let planets = imperium_self.returnPlayerPlanetCards(player);
        let success = 0;
        let types   = [];
        for (let i = 0; i < 3; i++) { types[i] = 0; }
  
        for (let i = 0; i < planets.length; i++) {
          if (imperium_self.game.planets[planets[i]].type == "hazardous") { types[0]++; }
          if (imperium_self.game.planets[planets[i]].type == "industrial") { types[1]++; }
          if (imperium_self.game.planets[planets[i]].type == "cultural") { types[2]++; }
        }
  
        for (let i = 0; i < 3; i++) {
  	if (types[i] >= 6) { return 1; }
        }
  
        return 0;
  
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
  
    };
  
    return obj;
  
  }
  
  
  
  
  
  
  
  ////////////////////////////
  // Return Technology Tree //
  ////////////////////////////
  returnTechnologyTree() {
  
    let tech = {};
  
    //
    // GREEN
    //
    tech['neural-implants']                       = {
      name        :       "Neural Implants" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "green" ,
      unit        :       0 ,
      type	:	"normal" ,
      prereqs     :       [],
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].action_cards_bonus_when_issued = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].action_cards_bonus_when_issued = 1;
        mycallback(1);
      }
    };
    tech['resuscitation-pods']                    = {
      name        :       "Resuscitation Pods" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "green" ,
      unit        :       0 ,
      type	:	"normal" ,
      prereqs     :       ['green'],
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].reinforce_infantry_after_successful_ground_combat = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    tech['biotic-enhancements']                   = {
      name        :       "Biotic Enhancements" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "green" ,
      unit        :       0 ,
      type	:	"normal" ,
      prereqs     :       ['green','green'],
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].new_token_bonus_when_issued = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].new_token_bonus_when_issued = 1;
        mycallback(1);
      }
    };
    tech['viral-plasma']                  = {
      name        :       "X-91 Viral Plasma" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "green" ,
      unit        :       0 ,
      type	:	"normal" ,
      prereqs     :       ['green','green','green'],
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].x91_bacterial_bombardment = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
  
  
    //
    // BLUE
    //
    tech['electron-shielding']                    = {
      name        :       "Electron Shielding" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "blue" ,
      unit        :       0 ,
      type	:	"normal" ,
      prereqs     :       [],
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].fly_through_asteroids = 1;
        imperium_self.game.players_info[player-1].evasive_bonus_on_pds_shots = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].fly_through_asteroids = 1;
        imperium_self.game.players_info[player-1].evasive_bonus_on_pds_shots = 1;
        mycallback(1);
      }
    };
    tech['slingshot-drive']                       = {
      name        :       "Slingshot Drive" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "blue" ,
      unit        :       0 ,
      type	:	"normal" ,
      prereqs     :       ['blue'],
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].ship_move_bonus = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].ship_move_bonus = 1;
        mycallback(1);
      }
    };
    tech['fleet-ansible']                 = {
      name        :       "Fleet Ansible" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "blue" ,
      unit        :       0 ,
      type	:	"normal" ,
      prereqs     :       ['blue','blue'],
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].perform_two_actions = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].perform_two_actions = 1;
        mycallback(1);
      }
    };
    tech['stealth-cloaking']                      = {
      name        :       "Stealth Cloaking" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "blue" ,
      unit        :       0 ,
      prereqs     :       ['blue','blue','blue'],
      type	:	"normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].move_through_sectors_with_opponent_ships = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].move_through_sectors_with_opponent_ships = 1;
        mycallback(1);
      }
    };
  
    //
    // YELLOW
    //
    tech['waste-recycling']                       = {
      name        :       "Waste Recycling" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "yellow" ,
      unit        :       0 ,
      prereqs     :       [],
      type	:	"normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].production_bonus = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].production_bonus = 1;
        mycallback(1);
      }
    };
    tech['laser-targeting']                       = {
      name        :       "Laser Targeting" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "yellow" ,
      unit        :       0 ,
      type	:	"normal" ,
      prereqs     :       ['yellow'],
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].assign_pds_hits_to_non_fighters = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    tech['deep-space-reanimatronics']                     = {
      name        :       "Deep Space Reanimatronics" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "yellow" ,
      unit        :       0 ,
      prereqs     :       ['yellow','yellow'],
      type	:	"normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].reallocate_four_infantry_per_round = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player) {
        mycallback(1);
      }
    };
    tech['frontline-assembly']                    = {
      name        :       "Frontline Assembly" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "yellow" ,
      unit        :       0 ,
      prereqs     :       ['yellow','yellow','yellow'],
      type	:	"normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].may_produce_after_gaining_planet = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].may_produce_after_gaining_planet = 1;
        mycallback(1);
      }
    };
  
    //
    // RED
    //
    tech['plasma-clusters']                       = {
      name        :       "Plasma Clusters" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "red" ,
      unit        :       0 ,
      prereqs     :       [],
      type	:	"normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].extra_roll_on_bombardment_or_pdf = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].extra_roll_on_bombardment_or_pdf = 1;
        mycallback(1);
  
      }
    };
    tech['stasis-fields']                 = {
      name        :       "Stasis Fields" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "red" ,
      unit        :       0 ,
      prereqs     :       ['red'],
      type	:	"normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].stasis_on_opponent_combat_first_round = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    tech['titanium-shielding']                    = {
      name        :       "Titanium Shielding" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "red" ,
      unit        :       0 ,
      prereqs     :       ['red','red'],
      type	:	"normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].may_repair_damaged_ships_after_space_combat = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].may_repair_damaged_ships_after_space_combat = 1;
        mycallback(1);
      }
    };
    tech['chain-shot']                    = {
      name        :       "Chain Shot" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "red" ,
      unit        :       0 ,
      prereqs     :       ['red','red','red'],
      type	:	"normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].chain_shot = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].chain_shot = 1;
        mycallback(1);
      }
    };
  
    tech['fighter-ii']                    = {
      name        :       "Fighter II" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      unit        :       1 ,
      prereqs     :       ['green','blue'],
      type	:	"normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        this.game.players_info[player-1].upgraded_fighter = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        this.game.players_info[player-1].upgraded_fighter = 1;
        mycallback(1);
      }
    };
    tech['infantry-ii']                   = {
      name        :       "Infantry II" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      unit        :       1 ,
      prereqs     :       ['green','green'],
      type	:	"normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        this.game.players_info[player-1].upgraded_infantry = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        this.game.players_info[player-1].upgraded_infantry = 1;
        mycallback(1);
      }
    };
    tech['carrier-ii']                    = {
      name        :       "Carrier II" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      unit        :       1 ,
      prereqs     :       ['green','green','blue','blue'],
      type	:	"normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        this.game.players_info[player-1].upgraded_carrier = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        this.game.players_info[player-1].upgraded_carrier = 1;
        mycallback(1);
      }
    };
    tech['dreadnaught-ii']                        = {
      name        :       "Dreadnaught II" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      unit        :       1 ,
      prereqs     :       ['blue','blue','yellow'],
      type	:	"normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        this.game.players_info[player-1].upgraded_dreadnaught = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        this.game.players_info[player-1].upgraded_dreadnaught = 1;
        mycallback(1);
      }
    };
    tech['cruiser-ii']                    = {
      name        :       "Cruiser II" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      unit        :       1 ,
      prereqs     :       ['green','yellow','red'],
      type	:	"normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        this.game.players_info[player-1].upgraded_cruiser = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        this.game.players_info[player-1].upgraded_cruiser = 1;
        mycallback(1);
      }
    };
    tech['spacedock-ii']                  = {
      name        :       "Space Dock II" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      unit        :       1 ,
      prereqs     :       ['yellow','yellow'],
      type	:	"normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        this.game.players_info[player-1].upgraded_spacedock = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        this.game.players_info[player-1].upgraded_spacedock = 1;
        mycallback(1);
      }
    };
    tech['destroyer-ii']                  = {
      name        :       "Destroyer II" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      unit        :       1 ,
      prereqs     :       ['red','red'],
      type	:	"normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        this.game.players_info[player-1].upgraded_destroyer = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        this.game.players_info[player-1].upgraded_destroyer = 1;
        mycallback(1);
      }
    };
    tech['pds-ii']                        = {
      name        :       "PDS II" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      unit        :       1 ,
      prereqs     :       ['yellow','red'],
      type	:	"normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        this.game.players_info[player-1].upgraded_pds = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        this.game.players_info[player-1].upgraded_pds = 1;
        mycallback(1);
      }
    };
    tech['war-sun']                       = {
      name        :       "War Sun" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      unit        :       1 ,
      prereqs     :       ['yellow','red','red','red'],
      type	:	"normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        this.game.players_info[player-1].upgraded_warsun = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        this.game.players_info[player-1].upgraded_warsun = 1;
        mycallback(1);
      }
    };
  
    return tech;
  
  }
  
  ///////////////////////////
  // Return Strategy Cards //
  ///////////////////////////
  returnStrategyCards() {
  
    let strategy = {};
  
    strategy['initiative']	= { order : 1 , img : "/imperium/img/strategy/INITIATIVE.png" , name : "Initiative" };
    strategy['diplomacy'] 	= { order : 2 , img : "/imperium/img/strategy/DIPLOMACY.png" , name : "Diplomacy" };
    strategy['politics'] 	= { order : 3 , img : "/imperium/img/strategy/POLITICS.png" , name : "Politics" };
    strategy['build'] 		= { order : 4 , img : "/imperium/img/strategy/BUILD.png" , name : "Build" };
    strategy['trade'] 	 	= { order : 5 , img : "/imperium/img/strategy/TRADE.png" , name : "Trade" };
    strategy['military'] 	= { order : 6 , img : "/imperium/img/strategy/MILITARY.png" , name : "Military" };
    strategy['tech'] 		= { order : 7 , img : "/imperium/img/strategy/TECH.png" , name : "Tech Research" };
    strategy['empire'] 	 	= { order : 8 , img : "/imperium/img/strategy/EMPIRE.png" , name : "Empire" };
  
    return strategy;
  
  }
  
  
  /////////////////////////
  // Return Action Cards //
  /////////////////////////
  returnActionCards() {
  
    let action = {};
  
    action['action1']	= { 
  	name : "Accidental Colonization" ,
  	type : "instant" ,
  	text : "Gain control of one planet not controlled by any player" ,
  	interactive : 1 ,
  	img : "/imperium/img/action_card_template.png" ,
        onPlay : function(imperium_self, player, mycallback) {
console.log("THE ACTION CARD: " + this.name + " is being played!");
          mycallback(1);
        },
    };
    action['action2']	= { 
  	name : "Hydrocannon Cooling" ,
  	type : "instant" ,
  	text : "Ship gets -2 on combat rolls next round" ,
  	interactive : 1 ,
  	img : "/imperium/img/action_card_template.png" ,
        onPlay : function(imperium_self, player, mycallback) {
console.log("THE ACTION CARD: " + this.name + " is being played!");
          mycallback(1);
        },
    };
    action['action3']	= { 
  	name : "Agile Thrusters" ,
  	type : "instant" ,
  	text : "Attached ship may cancel up to 2 hits by PDS or Ion Cannons" ,
  	interactive : 1 ,
  	img : "/imperium/img/action_card_template.png" ,
        onPlay : function(imperium_self, player, mycallback) {
console.log("THE ACTION CARD: " + this.name + " is being played!");
          mycallback(1);
        },
    };
    action['action4']	= { 
  	name : "Diaspora Conflict" ,
  	type : "instant" ,
  	text : "Exhaust a planet card held by another player. Gain trade goods equal to resource value." ,
  	interactive : 1 ,
  	img : "/imperium/img/action_card_template.png" ,
        onPlay : function(imperium_self, player, mycallback) {
console.log("THE ACTION CARD: " + this.name + " is being played!");
          mycallback(1);
        },
    };
    action['action5']	= { 
  	name : "Consortium Research" ,
  	type : "instant" ,
  	text : "Cancel 1 yellow technology prerequisite" ,
  	interactive : 0 ,
  	img : "/imperium/img/action_card_template.png" ,
        onPlay : function(imperium_self, player, mycallback) {
console.log("THE ACTION CARD: " + this.name + " is being played!");
          mycallback(1);
        },
    };
    action['action6']	= { 
  	name : "Independent Thinker" ,
  	type : "instant" ,
  	text : "Cancel 1 blue technology prerequisite" ,
  	interactive : 0 ,
  	img : "/imperium/img/action_card_template.png" ,
        onPlay : function(imperium_self, player, mycallback) {
console.log("THE ACTION CARD: " + this.name + " is being played!");
          mycallback(1);
        },
    };
    action['action7']	= { 
  	name : "Military-Industrial Complex" ,
  	type : "instant" ,
  	text : "Cancel 1 red technology prerequisite" ,
  	interactive : 0 ,
  	img : "/imperium/img/action_card_template.png" ,
        onPlay : function(imperium_self, player, mycallback) {
console.log("THE ACTION CARD: " + this.name + " is being played!");
          mycallback(1);
        },
    };
    action['action8']	= { 
  	name : "Innovative Cluster" ,
  	type : "instant" ,
  	text : "Cancel 1 green technology prerequisite" ,
  	interactive : 0 ,
  	img : "/imperium/img/action_card_template.png" ,
        onPlay : function(imperium_self, player, mycallback) {
console.log("THE ACTION CARD: " + this.name + " is being played!");
          mycallback(1);
        },
    };
    action['action9']	= { 
  	name : "Aggressive Upgrade" ,
  	type : "instant" ,
  	text : "Replace 1 of your Destroyers with a Dreadnaught" ,
  	interactive : 1 ,
  	img : "/imperium/img/action_card_template.png" ,
        onPlay : function(imperium_self, player, mycallback) {
console.log("THE ACTION CARD: " + this.name + " is being played!");
          mycallback(1);
        },
    };
    action['action10']	= { 
  	name : "Lost Mission" ,
  	type : "instant" ,
  	text : "Place 1 Destroyer in a system with no existing ships" ,
  	interactive : 1 ,
  	img : "/imperium/img/action_card_template.png" ,
        onPlay : function(imperium_self, player, mycallback) {
console.log("THE ACTION CARD: " + this.name + " is being played!");
          mycallback(1);
        },
    };
  
    return action;
  
  }
  
  
  /////////////////////////
  // Return Agenda Cards //
  /////////////////////////
  returnAgendaCards() {
  
    let agenda = {};
  
    agenda['a1']	= { 
  	name : "Unruly Natives" ,
  	type : "Law" ,
  	text : "All invasions of unoccupied planets require conquering 1 infantry" ,
  	img : "/imperium/img/agenda_card_template.png" ,
        onPass : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW PASSED!");
          mycallback(1);
	} ,
        onFail : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW FAILS!");
          mycallback(1);
	} ,
    };
    agenda['a2']	= { 
  	name : "Wormhole Travel Ban" ,
  	type : "Law" ,
  	text : "All invasions of unoccupied planets require conquering 1 infantry" ,
  	img : "/imperium/img/agenda_card_template.png" ,
        onPass : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW PASSED!");
          mycallback(1);
	} ,
        onFail : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW FAILS!");
          mycallback(1);
	} ,
    };
    agenda['a3']	= { 
  	name : "Regulated Bureaucracy" ,
  	type : "Law" ,
  	text : "Players may have a maximum of 3 action cards in their hands at all times" ,
  	img : "/imperium/img/agenda_card_template.png" ,
        onPass : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW PASSED!");
          mycallback(1);
	} ,
        onFail : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW FAILS!");
          mycallback(1);
	} ,
    };
    agenda['a4']	= { 
  	name : "Freedom in Arms Act" ,
  	type : "Law" ,
  	text : "Players may place any number of PDS units on planets" ,
  	img : "/imperium/img/agenda_card_template.png" ,
        onPass : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW PASSED!");
          mycallback(1);
	} ,
        onFail : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW FAILS!");
          mycallback(1);
	} ,
    };
    agenda['a5']	= { 
  	name : "Performance Testing" ,
  	type : "Law" ,
  	text : "After any player researches a tach, he must destroy a non-fighter ship if possible" ,
  	img : "/imperium/img/agenda_card_template.png" ,
        onPass : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW PASSED!");
          mycallback(1);
	} ,
        onFail : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW FAILS!");
          mycallback(1);
	} ,
    };
    agenda['a6']	= { 
  	name : "Fleet Limitations" ,
  	type : "Law" ,
  	text : "Players may have a maximum of four tokens in their fleet supply." ,
  	img : "/imperium/img/agenda_card_template.png" ,
        onPass : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW PASSED!");
          mycallback(1);
	} ,
        onFail : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW FAILS!");
          mycallback(1);
	} ,
    };
    agenda['a7']	= { 
  	name : "Restricted Conscription" ,
  	type : "Law" ,
  	text : "Production cost for infantry and fighters is 1 rather than 0.5 resources" ,
  	img : "/imperium/img/agenda_card_template.png" ,
        onPass : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW PASSED!");
          mycallback(1);
	} ,
        onFail : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW FAILS!");
          mycallback(1);
	} ,
    };
    agenda['a8']	= { 
  	name : "Representative Democracy" ,
  	type : "Law" ,
  	text : "All players have only 1 vote in each Politics Vote" ,
  	img : "/imperium/img/agenda_card_template.png" ,
        onPass : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW PASSED!");
          mycallback(1);
	} ,
        onFail : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW FAILS!");
          mycallback(1);
	} ,
    };
    agenda['a9']	= { 
  	name : "Hidden Agenda" ,
  	type : "Law" ,
  	text : "Agendas are Hidden By Default and Only Revealed when the Politics Card is Played" ,
  	img : "/imperium/img/agenda_card_template.png" ,
        onPass : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW PASSED!");
          mycallback(1);
	} ,
        onFail : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW FAILS!");
          mycallback(1);
	} ,
    };
  
    return agenda;
  }
  
  
  /////////////////////
  // Return Factions //
  /////////////////////
  returnFaction(player) {
    let factions = this.returnFactions();
    if (this.game.players_info[player-1] == null) { return "Unknown"; }
    if (this.game.players_info[player-1] == undefined) { return "Unknown"; }
    return factions[this.game.players_info[player-1].faction].name;
  }
  returnSpeaker() {
    let factions = this.returnFactions();
    return factions[this.game.players_info[this.game.state.speaker-1].faction].name;
  }
  returnSectorName(pid) {
    return this.game.systems[this.game.board[pid].tile].name;
  }
  returnPlanetName(sector, planet_idx) {
    let sys = this.returnSystemAndPlanets(sector);
    return sys.p[planet_idx].name;
  }
  
  
  
  
  returnPlayers(num=0) {
  
    var players = [];
    let factions = this.returnFactions();
  
    for (let i = 0; i < num; i++) {
  
      if (i == 0) { col = "color1"; }
      if (i == 1) { col = "color2"; }
      if (i == 2) { col = "color3"; }
      if (i == 3) { col = "color4"; }
      if (i == 4) { col = "color5"; }
      if (i == 5) { col = "color6"; }
  
      var keys = Object.keys(factions);
      let rf = keys[this.rollDice(keys.length)-1];
      delete factions[rf];
  
      players[i] = {};
      players[i].action_cards_per_round = 1;
      players[i].new_tokens_per_round = 2;
      players[i].new_token_bonus_when_issued = 0;
      players[i].command_tokens  	= 3;
      players[i].strategy_tokens 	= 2;
      players[i].fleet_supply    	= 3;
      players[i].faction 		= rf;
      players[i].homeworld	= "";
      players[i].color   		= col;
      players[i].goods		= 0;
      players[i].commodities	= 3;
      players[i].commodity_limit	= 3;
  
      players[i].vp		= 0;
      players[i].passed		= 0;
      players[i].strategy_cards_played = [];
  
      //
      // gameplay modifiers (action cards + tech)
      //
      players[i].action_cards_bonus_when_issued = 0;
      players[i].new_tokens_bonus_when_issued = 0;
      players[i].fleet_move_bonus = 0;
      players[i].ship_move_bonus = 0;
      players[i].fly_through_asteroids = 0;
      players[i].reinforce_infantry_after_successful_ground_combat = 0;
      players[i].x91_bacterial_bombardment = 0;
      players[i].evasive_bonus_on_pds_shots = 0;
      players[i].perform_two_actions = 0;
      players[i].move_through_sectors_with_opponent_ships = 0;
      players[i].assign_pds_hits_to_non_fighters = 0;
      players[i].reallocate_four_infantry_per_round = 0;
      players[i].may_produce_after_gaining_planet = 0;
      players[i].extra_roll_on_bombardment_or_pds = 0;
      players[i].stasis_on_opponent_combat_first_round = 0;
      players[i].may_repair_damaged_ships_after_space_combat = 0;
      players[i].chain_shot = 0;
      players[i].production_bonus = 0;
  
      players[i].upgraded_infantry = 0;
      players[i].upgraded_pds = 0;
      players[i].upgraded_spacedock = 0;
      players[i].upgraded_fighter = 0;
      players[i].upgraded_destroyer = 0;
      players[i].upgraded_carrier = 0;
      players[i].upgraded_cruiser = 0;
      players[i].upgraded_dreadnaught = 0;
      players[i].upgraded_flagship = 0;
      players[i].upgraded_warsun = 0;
  
      if (i == 1) { players[i].color   = "yellow"; }
      if (i == 2) { players[i].color   = "green"; }
      if (i == 3) { players[i].color   = "blue"; }
      if (i == 4) { players[i].color   = "purple"; }
      if (i == 5) { players[i].color   = "black"; }
  
      players[i].planets = [];		
      players[i].tech = [];
      players[i].tech_exhausted_this_turn = [];
      players[i].upgrades = [];
      players[i].strategy = [];		// strategy cards  

      // scored objectives
      players[i].scored_objectives = [];
      players[i].secret_objectives = [];
  
    }
  
    return players;
  
  }
  
  
  
  
  
  ///////////////////////
  // Return Unit Costs //
  ///////////////////////
  returnUnitCost(name, player) {
  
    if (name == "infantry") { return 0.5; }
    if (name == "fighter") { return 0.5; }
    if (name == "destroyer") { return 1; }
    if (name == "cruiser") { return 2; }
    if (name == "carrier") { return 3; }
    if (name == "dreadnaught") { return 4; }
    if (name == "flagship") { return 8; }
    if (name == "warsun") { return 12; }
  
    return 1;
  
  }
  
  
  
  /////////////////////
  // Return Factions //
  /////////////////////
  returnFactions() {
    var factions = {};
    factions['faction1'] = {
      homeworld: "sector38",
      name: "Faction 1"
    };
    factions['faction2'] = {
      homeworld: "sector39",
      name: "Faction 2"
    };
    factions['faction3'] = {
      homeworld: "sector40",
      name: "Faction 3"
    };
  /**
    factions['faction4'] = {
      homeworld: "sector32",
      name: "Faction 4"
    };
    factions['faction5'] = {
      homeworld: "sector32",
      name: "Faction 5"
    };
    factions['faction6'] = {
      homeworld: "sector32",
      name: "Faction 6"
    };
    factions['faction7'] = {
      homeworld: "sector32",
      name: "Faction 7"
    };
    factions['faction8'] = {
      homeworld: "sector32",
      name: "Faction 8"
    };
    factions['faction9'] = {
      homeworld: "sector32",
      name: "Faction 9"
    };
    factions['faction10'] = {
      homeworld: "sector32",
      name: "Faction 10"
    };
    factions['faction11'] = {
      homeworld: "sector32",
      name: "Faction 11"
    };
    factions['faction12'] = {
      homeworld: "sector32",
      name: "Faction 12"
    };
    factions['faction13'] = {
      homeworld: "sector32",
      name: "Faction 13"
    };
    factions['faction14'] = {
      homeworld: "sector32",
      name: "Faction 14"
    };
    factions['faction15'] = {
      homeworld: "sector32",
      name: "Faction 15"
    };
    factions['faction16'] = {
      homeworld: "sector32",
      name: "Faction 16"
    };
    factions['faction17'] = {
      homeworld: "sector32",
      name: "Faction 17"
    };
  **/
    return factions;
  }; 
  
  
  
  ///////////////////////////////
  // Return Starting Positions //
  ///////////////////////////////
  returnHomeworldSectors(players = 4) {
    if (players <= 2) {
      return ["1_1", "4_7"];
    }
  
    if (players <= 3) {
      return ["1_1", "4_7", "7_1"];
    }
  
    if (players <= 4) {
      return ["1_3", "3_1", "5_6", "7_2"];
    }
  
    if (players <= 5) {
      return ["1_3", "3_1", "4_7", "7_1", "7_4"];
    }
  
    if (players <= 6) {
      return ["1_1", "1_4", "4_1", "4_7", "7_1", "7_7"];
    }
  };
  
  
  /////////////////////////
  // Return Turn Tracker //
  /////////////////////////
  returnPlayerTurnTracker() {
    let tracker = {};
    tracker.activate_system = 0;
    tracker.action_card = 0;
    tracker.production = 0;
    tracker.trade = 0;
    return tracker;
  };
  
  
  
  
  
  repairUnits() {
  
    for (let i in this.game.board) {
      let sys = this.returnSystemAndPlanets(i);
      for (let i = 0; i < sys.s.units.length; i++) {
        for (let ii = 0; ii < sys.s.units[i].length; ii++) {
          sys.s.units[i][ii].strength = sys.s.units[i][ii].max_strength;
        }
      }
      for (let i = 0; i < sys.p.length; i++) {
        for (let ii = 0; ii < sys.p[i].units; ii++) {
          for (let iii = 0; iii < sys.p[i].units[ii].length; ii++) {
            sys.p[i].units[ii][iii].strength = sys.p[i].units[ii][iii].max_strength;
          }
        }
      }
      this.saveSystemAndPlanets(sys);
    }
  
  }
  
  
  //////////////////
  // Return Units //
  //////////////////
  returnUnit(type = "", player) {
  
    let unit = {};
  
    unit.name = type;
  
    unit.storage = [];		   // units this unit stores
    unit.capacity = 0;		   // number of units this unit can store
    unit.can_be_stored = 0;	   // can this be stored in other units
    unit.capacity_required = 0;      // how many storage units does it occupy
  
    unit.max_strength = 0;	   // number of hits can sustain (fully repaired)
    unit.strength = 0;	   	   // number of hits can sustain (dead at zero)
    unit.combat = 10;   	           // number of hits on rolls of N
    unit.destroyed = 0;		   // set to 1 when unit is destroyed in battle
  
    unit.move = 0;
    unit.range = 1;		   // range for firing (pds)
    unit.production = 0;
  
    unit.anti_fighter_barrage_rolls = 0;
    unit.anti_fighter_barrage_combat = 0;
  
    unit.resurrect_in_homeworld = 0;
    unit.resurrect_in_homeworld_roll = 0;
  
    if (type == "spacedock") {
      unit.production = 2;
    }
  
    if (type == "pds") {
      unit.move = 0;
      unit.capacity = 0;
      unit.combat = 6;
      unit.strength = 1;
    }
  
    if (type == "carrier") {
      unit.move = 1;
      unit.capacity = 4;
      unit.combat = 9;
      unit.strength = 1;
    }
  
    if (type == "destroyer") {
      unit.move = 1;
      unit.combat = 9;
      unit.strength = 1;
      unit.anti_fighter_barrage_rolls = 2;
      unit.anti_fighter_barrage_combat = 9;
    }
  
    if (type == "dreadnaught") {
      unit.move = 1;
      unit.capacity = 1;
      unit.strength = 2;
      unit.combat = 6;
    }
  
    if (type == "cruiser") {
      unit.move = 2;
      unit.combat = 7;
      unit.strength = 1;
    }
  
    if (type == "flagship") {
      unit.move = 2;
      unit.combat = 8;
      unit.strength = 1;
    }
  
    if (type == "infantry") {
      unit.can_be_stored = 1;
      unit.capacity_required = 1;
      unit.combat = 8;
      unit.strength = 1;
    }
  
    if (type == "fighter") {
      unit.can_be_stored = 1;
      unit.capacity_required = 1;
      unit.combat = 9;
      unit.strength = 1;
    }
  
  
    unit = this.upgradeUnit(unit, player);
  
    return unit;
  };
  
  
  
  
  upgradePlayerUnitsOnBoard(player) {
  
    for (let i = 0; i < this.game.sectors.length; i++) {
      for (let ii = 0; ii < this.game.sectors[i].units[player-1].length; ii++) {
        this.game.sectors[i].units[player-1][ii] = this.upgradeUnit(this.game.sectors[i].units[player-1][ii], player);
      }
    }
    for (let i = 0; i < this.game.planets.length; i++) {
      for (let ii = 0; ii < this.game.planets[i].units[player-1].length; ii++) {
        this.game.planets[i].units[player-1][ii] = this.upgradeUnit(this.game.planets[i].units[player-1][ii], player);
      }
    }
  }
  
  



  upgradeUnit(unit, player) {
  
    let p = this.game.players_info[player-1];
  
    if (unit.name == "fighter") {
      if (p.upgraded_fighter == 1) {
        unit.combat = 8;
        unit.move = 2;
      }
    }
  
    if (unit.name == "spacedock") {
      if (p.upgraded_spacedock == 1) {
        unit.production = 4;
      }
    }
  
    if (unit.name == "pds") {
      if (p.upgraded_pds == 1) {
        unit.range = 1;
        unit.combat = 5;
      }
    }
  
    if (unit.name == "carrier") {
      if (p.upgraded_carrier == 1) {
        unit.move = 2;
        unit.capacity = 6;
      }
    }
  
    if (unit.name == "destroyer") {
      if (p.upgraded_destroyer == 1) {
        unit.move = 2;
        unit.combat = 8;
        unit.anti_fighter_barrage_rolls = 3;
        unit.anti_fighter_barrage_combat = 6;
      }
    }
  
    if (unit.name == "dreadnaught") {
      if (p.upgraded_dreadnaught == 1) {
        unit.move = 2;
        unit.capacity = 2;
        unit.combat = 5;
      }
    }
  
    if (unit.name == "cruiser") {
      if (p.upgraded_cruiser == 1) {
        unit.move = 3;
        unit.combat = 6;
        unit.strength = 1;
      }
    }
  
    if (unit.name == "flagship") {
      if (p.upgraded_flagship == 1) {
        unit.move = 2;
        unit.combat = 5;
        unit.strength = 2;
      }
    }
  
    if (unit.name == "infantry") {
      if (p.upgraded_infantry == 1) {
        unit.combat = 8;
        unit.strength = 1;
        unit.resurrect_in_homeworld = 1;
        unit.resurrect_in_homeworld_roll = 6;
      }
    }
  
    return unit;
  }
  
  
  
  
  ///////////////////////////////
  // Return System and Planets //
  ///////////////////////////////
  returnSystemAndPlanets(pid) {
  
    if (this.game.board[pid] == null) {
      return;
    }
  
    if (this.game.board[pid].tile == null) {
      return;
    }
  
    let sys = this.game.systems[this.game.board[pid].tile];
    let planets = [];
  
    for (let i = 0; i < sys.planets.length; i++) {
      planets[i] = this.game.planets[sys.planets[i]];
    }
  
    return {
      s: sys,
      p: planets
    };
  }; 
  
  



  /////////////////////////////
  // Save System and Planets //
  /////////////////////////////
  saveSystemAndPlanets(sys) {
    for (let key in this.game.systems) {
      if (this.game.systems[key].img == sys.s.img) {
        this.game.systems[key] = sys.s;
        for (let j = 0; j < this.game.systems[key].planets.length; j++) {
          this.game.planets[this.game.systems[key].planets[j]] = sys.p[j];
        }
      }
    }
  };
  
  


  updateAgendaDisplay() {  
    $('.agendas').empty();
    for (let i = 0; i < this.game.state.agendas.length; i++) {
      let agendacard = this.returnAgendaCard(this.game.state.agendas[i]);
      $('.agendas').append(agendacard);
    }
  }
  
  


  updateLeaderboard() {
  
    let imperium_self = this;
    let factions = this.returnFactions();
    let html = "Round " + this.game.state.round + " (turn " + this.game.state.turn + ")";
  
        html += '<p></p>';
        html += '<hr />';
        html += '<ul>';
  
    for (let i = 0; i < this.game.players_info.length; i++) {
      html += `  <li class="card" id="${i}">${factions[this.game.players_info[i].faction].name} -- ${this.game.players_info[i].vp} VP</li>`;
    }
  
    html += '</ul>';
  
    $('.leaderboard').html(html);
  
  }
  
  



  updateSectorGraphics(sector) {
  
    let sys = this.returnSystemAndPlanets(sector);
  
    let divsector = '#hex_space_'+sector;
    let fleet_color = '';
    let bg = '';
    let bgsize = '';
  
    for (let z = 0; z < sys.s.units.length; z++) {
  
      let player = z+1;
  
      //
      // is activated?
      //
      if (sys.s.activated[player-1] == 1) {
        let divpid = '#'+sector;
        $(divpid).find('.hex_activated').css('background-color', 'yellow');
        $(divpid).find('.hex_activated').css('opacity', '0.3');
      }
  
  
      //
      // space
      //
      if (sys.s.units[player-1].length > 0) {
  
        updated_space_graphics = 1;
  
        let carriers     = 0;
        let fighters     = 0;
        let destroyers   = 0;
        let cruisers     = 0;
        let dreadnaughts = 0;
        let flagships    = 0;
  
        for (let i = 0; i < sys.s.units[player-1].length; i++) {
  
          let ship = sys.s.units[player-1][i];
  
          if (ship.name == "carrier") { carriers++; }
          if (ship.name == "fighter") { fighters++; }
          if (ship.name == "destroyer") { destroyers++; }
          if (ship.name == "cruiser") { cruisers++; }
          if (ship.name == "dreadnaught") { dreadnaughts++; }
          if (ship.name == "flagship") { flagships++; }
  
        }
  
        let space_frames = [];
        let ship_graphics = [];
        space_frames.push("white_space_frame.png");
  
        ////////////////////
        // SPACE GRAPHICS //
        ////////////////////
        fleet_color = "color"+player;
        
        if (fighters > 0 ) { 
	  let x = fighters; if (fighters > 9) { x = 9; } 
	  let numpng = "white_space_frame_1_"+x+".png";
	  ship_graphics.push("white_space_fighter.png");
	  space_frames.push(numpng);
	}
        if (destroyers > 0 ) { 
	  let x = destroyers; if (destroyers > 9) { x = 9; } 
	  let numpng = "white_space_frame_2_"+x+".png";
	  ship_graphics.push("white_space_destroyer.png");
	  space_frames.push(numpng);
	}
        if (carriers > 0 ) {
	  let x = carriers; if (carriers > 9) { x = 9; } 
	  let numpng = "white_space_frame_3_"+x+".png";
	  ship_graphics.push("white_space_carrier.png");
	  space_frames.push(numpng);
	}
        if (cruisers > 0 ) { 
	  let x = cruisers; if (cruisers > 9) { x = 9; } 
	  let numpng = "white_space_frame_4_"+x+".png";
	  ship_graphics.push("white_space_cruiser.png");
	  space_frames.push(numpng);
	}
        if (dreadnaughts > 0 ) { 
	  let x = dreadnaughts; if (dreadnaughts > 9) { x = 9; } 
	  let numpng = "white_space_frame_5_"+x+".png";
	  ship_graphics.push("white_space_dreadnaught.png");
	  space_frames.push(numpng);
	}
        if (flagships > 0 ) { 
	  let x = flagships; if (flagships > 9) { x = 9; } 
	  let numpng = "white_space_frame_6_"+x+".png";
	  ship_graphics.push("white_space_flagship.png");
	  space_frames.push(numpng);
	}


	//
	// remove and re-add space frames
	//
	let old_images = "#hex_bg_"+sector+" > .sector_graphics";
        $(old_images).remove();
	let divsector2 = "#hex_bg_"+sector;
	let player_color = "player_color_"+player;
        for (let i = 0; i < ship_graphics.length; i++) {
          $(divsector2).append('<img class="sector_graphics ship_graphic sector_graphics_space sector_graphics_space_'+sector+'" src="/imperium/img/frame/'+ship_graphics[i]+'" />');
        }
	for (let i = 0; i < space_frames.length; i++) {
          $(divsector2).append('<img class="sector_graphics '+player_color+' sector_graphics_space sector_graphics_space_'+sector+'" src="/imperium/img/frame/'+space_frames[i]+'" />');
        }
      }
    }
  
 
  
  
    let ground_frames = [];
    let ground_pos    = [];

    for (let z = 0; z < sys.s.units.length; z++) {
  
      let player = z+1;
      
      ////////////////////////
      // PLANETARY GRAPHICS //
      ////////////////////////
      let total_ground_forces_of_player = 0;
      
      for (let j = 0; j < sys.p.length; j++) {
        total_ground_forces_of_player += sys.p[j].units[z].length;
      }
 
      if (total_ground_forces_of_player > 0) {
        for (let j = 0; j < sys.p.length; j++) {
  
          let infantry     = 0;
          let spacedock    = 0;
          let pds          = 0;
  
          for (let k = 0; k < sys.p[j].units[player-1].length; k++) {
  
            let unit = sys.p[j].units[player-1][k];
  
            if (unit.name == "infantry") { infantry++; }
            if (unit.name == "pds") { pds++; }
            if (unit.name == "spacedock") { spacedock++; }
  
          }

	  let postext = "";

	  ground_frames.push("white_planet_center.png");
	  if (sys.p.length == 1) {
	    postext = "center";
	  } else {
	    if (j == 0) {
	      postext = "top_left";
	    }
	    if (j == 1) {
	      postext = "bottom_right";
	    }
	  }
	  ground_pos.push(postext);


          if (infantry > 0) { 
  	    let x = infantry; if (infantry > 9) { x = 9; } 
	    let numpng = "white_planet_center_1_"+x+".png";
	    ground_frames.push(numpng);
	    ground_pos.push(postext);
	  }
          if (spacedock > 0) { 
  	    let x = spacedock; if (spacedock > 9) { x = 9; } 
	    let numpng = "white_planet_center_2_"+x+".png";
	    ground_frames.push(numpng);
	    ground_pos.push(postext);
	  }
          if (pds > 0) { 
  	    let x = pds; if (pds > 9) { x = 9; } 
	    let numpng = "white_planet_center_3_"+x+".png";
	    ground_frames.push(numpng);
	    ground_pos.push(postext);
	  }
        }

	//
	// remove and re-add space frames
	//
	let old_images = "#hex_bg_"+sector+" > .sector_graphics_planet";
        $(old_images).remove();
	let divsector2 = "#hex_bg_"+sector;
        let player_color = "player_color_"+player;
	let pid = 0;
        for (let i = 0; i < ground_frames.length; i++) {
          if (i > 0 && ground_pos[i] != ground_pos[i-1]) { pid++; }
          $(divsector2).append('<img class="sector_graphics '+player_color+' sector_graphics_planet sector_graphics_planet_'+sector+' sector_graphics_planet_'+sector+'_'+pid+' '+ground_pos[i]+'" src="/imperium/img/frame/'+ground_frames[i]+'" />');
        }
      }
    }
  
  };
  




  
  ///////////////////////
  // Imperium Specific //
  ///////////////////////
  addMove(mv) {
    this.moves.push(mv);
  };
  
  endTurn(nextTarget = 0) {

    for (let i = this.rmoves.length - 1; i >= 0; i--) {
      this.moves.push(this.rmoves[i]);
    }

console.log("SENDING INFO: " + this.moves); 
 
    this.updateStatus("Waiting for information from peers....");
  
    if (nextTarget != 0) {
      extra.target = nextTarget;
    }
  
    this.game.turn = this.moves;
    this.moves = [];
    this.rmoves = [];
console.log("NOW SENDING MOVE:");
    this.sendMessage("game", {});
;
  };
  
  endGame(winner, method) {
    this.game.over = 1;
  
    if (this.active_browser == 1) {
      alert("The Game is Over!");
    }
  };
  
  
  returnOtherPlayerHomeworldPlanets(player=this.game.player) {
  
    let planets = [];
  
    for (let i = 0; i < this.game.players_info.length; i++) {
      if (this.game.player != (i+1)) {
        let their_home_planets = this.returnPlayerHomeworldPlanets((i+1));
        for (let z = 0; z < their_home_planets.length; z++) {
          planets.push(their_home_planets);
        }
      }
    }
  
    return planets;
  
  }
  
  
  returnPlayerHomeworldPlanets(player=this.game.player) {
    let home_sector = this.game.board[this.game.players_info[player-1].homeworld].tile;  // "sector";
    return this.game.systems[home_sector].planets;
  }
  
  returnPlayerUnexhaustedPlanetCards(player=this.game.player) {
    return this.returnPlayerPlanetCards(player, 1);
  }
  returnPlayerExhaustedPlanetCards(player=this.game.player) {
    return this.returnPlayerPlanetCards(player, 2);
  }
  returnPlayerPlanetCards(player=this.game.player, mode=0) {
  
    let x = [];
  
    for (var i in this.game.planets) {
      if (this.game.planets[i].owner == player) {
  
        if (mode == 0) {
          x.push(i);
        }
        if (mode == 1 && this.game.planets[i].exhausted == 0) {
          x.push(i);
        }
        if (mode == 2 && this.game.planets[i].exhausted == 1) {
  	x.push(i);
        }
      }
    }
  
    return x;
  
  }
  returnPlayerActionCards(player=this.game.player, mode=0) {
  
    let x = [];
    //
    // deck 2 -- hand #1
    //
    for (var i in this.game.deck[1].hand) {
      if (mode == 0) {
        x.push(i);
      }
    }
  
    return x;
  
  }
  
  returnPlanetCard(planetname="") {
  
    var c = this.game.planets[planetname];
    if (c == undefined) {
  
      //
      // this is not a card, it is something like "skip turn" or cancel
      //
      return '<div class="noncard">'+cardname+'</div>';
  
    }
  
    var html = `
      <div class="planetcard" style="background-image: url('${c.img}');">
        <div class="planetcard_name">${c.name}</div>
        <div class="planetcard_resources">${c.resources}</div>
        <div class="planetcard_influence">${c.influence}</div>
      </div>
    `;
    return html;
  
  }
  
  
  returnStrategyCard(cardname) {
  
    let cards = this.returnStrategyCards();
    let c = cards[cardname];
  
    if (c == undefined) {
  
      //
      // this is not a card, it is something like "skip turn" or cancel
      //
      return '<div class="noncard">'+cardname+'</div>';
  
    }
  
    var html = `
      <div class="strategycard" style="background-image: url('${c.img}');">
        <div class="strategycard_name">${c.name}</div>
      </div>
    `;
    return html;
  
  }
  
  
  returnActionCard(cardname) {

console.log("looking for: " + cardname);  

    let cards = this.returnActionCards();
    let c = cards[cardname];

console.log("C: " + JSON.stringify(c));  

    if (c == undefined) {
  
      //
      // this is not a card, it is something like "skip turn" or cancel
      //
      return '<div class="noncard">'+c.name+'</div>';
  
    }
  
    var html = `
      <div class="actioncard" style="background-image: url('${c.img}');">
        <div class="actioncard_name">${c.name}</div>
      </div>
    `;
    return html;
  
  }
  
  
  returnAgendaCard(cardname) {
  
    let cards = this.returnAgendaCards();
    let c = cards[cardname];
  
    if (c == undefined) {
  
      //
      // this is not a card, it is something like "skip turn" or cancel
      //
      return '<div class="noncard">'+cardname+'</div>';
  
    }
  
    var html = `
      <div class="agendacard" style="background-image: url('${c.img}');">
        <div class="agendacard_name">${c.name}</div>
      </div>
    `;
    return html;
  
  }
  
  
  
  playStrategyCardPrimary(player, card) {
  
    let imperium_self = this;
  
    let strategy_cards = this.returnStrategyCards();
    this.updateStatus(this.returnFaction(player) + " is playing the " + strategy_cards[card].name + " strategy card");
  
    if (card == "initiative") {
  
      this.game.players_info[player-1].command_tokens += 2;
      this.game.players_info[player-1].strategy_tokens += 1;
  
      if (this.game.player == player) {
        this.addMove("resolve\tstrategy");

	//
	// everyone gets to play the secondary
	//
        this.addMove("strategy\t"+card+"\t"+player+"\t2");
        this.addMove("resetconfirmsneeded\t"+this.game.players_info.length);
        this.addMove("notify\t"+player+" gains 2 command and 1 strategy tokens");
        this.endTurn();
      }
  
    }
    if (card == "negotiation") {
  
      if (this.game.player == player) {
  
        this.updateStatus('Select sector to quagmire in diplomatic negotiations: ');
        this.playerSelectSector(function(sector) {
          imperium_self.addMove("resolve\tstrategy");
          imperium_self.addMove("strategy\t"+card+"\t"+player+"\t2");
          imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
          imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
          for (let i = 0; i < imperium_self.game.players_info.length; i++) {
            imperium_self.addMove("activate\t"+(i+1)+"\t"+sector);
          }
  
  	//
  	// re-activate any planets in that system
  	//
   	let sys = imperium_self.returnSystemAndPlanets(sector);
  	for (let i = 0; i < sys.p.length; i++) {
  	  if (sys.p[i].owner == imperium_self.game.player) {
              imperium_self.addMove("unexhaust\t"+imperium_self.game.player+"\t"+sector);
  	  }
  	}
  	imperium_self.saveSystemAndPlanets(sys);
  
          imperium_self.endTurn();
        });
  
      }
  
  
    }
    if (card == "politics") {

      if (this.game.confirms_needed == 0) {
        //
        // refresh votes --> total available
        //
        this.game.state.votes_available = [];
        this.game.state.votes_cast = [];
        this.game.state.how_voted_on_agenda = [];
        this.game.state.voted_on_agenda = [];
        this.game.state.voting_on_agenda = 0;

        for (let i = 0; i < this.game.players.length; i++) {
	  this.game.state.votes_available.push(this.returnAvailableVotes(i+1));
	  this.game.state.votes_cast.push(0);
	  this.game.state.voted_on_agenda[i] = [];
	  this.game.state.how_voted_on_agenda[i] = "abstain";
	  for (let z = 0; z < this.game.state.agendas_per_round; z++) {
	    this.game.state.voted_on_agenda[z].push(0);
  	  }
        }
      }


      //
      // card player goes for primary
      //
      if (this.game.player == player) {  

        //
        // two action cards
        //
        this.addMove("resolve\tstrategy");
        this.addMove("DEAL\t2\t"+this.game.player+"\t2");
        this.addMove("notify\tdealing two action cards to player "+player);
        this.addMove("strategy\t"+card+"\t"+player+"\t2");
        this.addMove("resetconfirmsneeded\t"+this.game.players_info.length);

        //
        // pick the speaker
        //
        let factions = this.returnFactions();
        let html = 'Make which player the speaker?';
        for (let i = 0; i < this.game.players_info.length; i++) {
      	  html += '<li class="option" id="'+i+'">' + factions[this.game.players_info[i].faction].name + '</li>';
        }
        this.updateStatus(html);

        let chancellor = this.game.player;
        let selected_agendas = [];

        $('.option').off();
        $('.option').on('click', function() {

  	  let chancellor = (parseInt($(this).attr("id")) + 1);
alert(chancellor);

	  let laws = imperium_self.returnAgendaCards();
	  let laws_selected = 0;

	  let html = 'Select two agendas to advance for consideration in the Galactic Senate';	
          for (i = 0; i < 3; i++) {
    	    html += '<li class="option" id="'+i+'">' + laws[imperium_self.game.state.agendas[i]].name + '</li>';
          }
	  imperium_self.updateStatus(html);

          $('.option').off();
          $('.option').on('click', function() {

	    laws_selected++;
	    selected_agendas.push($(this).attr('id'));
	    $(this).hide();

            if (laws_selected >= 2) {
              for (i = 1; i >= 0; i--) {
                imperium_self.addMove("agenda\t"+selected_agendas[i]);
              }
              imperium_self.addMove("change_speaker\t"+chancellor);
              imperium_self.endTurn();
	    }
	  });
        });
      }
    }

    if (card == "infrastructure") {
  
      if (this.game.player == player) {
        this.addMove("resolve\tstrategy");
        this.addMove("strategy\t"+card+"\t"+player+"\t2\t"+player_confirmation_needed);
        this.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
        this.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
        this.playerBuildInfrastructure();
      }
  
  
    }
    if (card == "trade") {
  
      if (this.game.player == player) {
  
        this.addMove("resolve\tstrategy");
        this.addMove("strategy\t"+card+"\t"+player+"\t2");
        this.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
        this.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
        this.addMove("purchase\t"+this.game.player+"\tgoods\t3");
        this.addMove("purchase\t"+this.game.player+"\tcommodities\t"+this.game.players_info[this.game.player-1].commodity_limit);
  
        let factions = this.returnFactions();
        let html = 'Issue commodities to which players: <p></p><ul>';
        for (let i = 0; i < this.game.players_info.length; i++) {
  	if (i != this.game.player-1) {
  	  html += '<li class="option" id="'+i+'">' + factions[this.game.players_info[i].faction].name + '</li>';
          }
        }
        html += '<li class="option" id="finish">finish and end turn</li>';
  
        this.updateStatus(html);
  
        $('.option').off();
        $('.option').on('click', function() {
  	let id = $(this).attr("id");
  	if (id != "finish") {
            imperium_self.addMove("purchase\t"+(id+1)+"\tcommodities\t"+imperium_self.game.players_info[id].commodity_limit);
  	  $(this).hide();
  	} else {
            imperium_self.endTurn();
  	}
        });
  
      }
    }
    if (card == "military") {
  
      if (this.game.player == player) {
  
        this.updateStatus('Select sector to de-activate.');
        this.playerSelectSector(function(sector) {
          imperium_self.addMove("resolve\tstrategy");
          imperium_self.addMove("strategy\t"+card+"\t"+player+"\t2");
          imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
          imperium_self.addMove("deactivate\t"+player+"\t"+sector);
          imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
          imperium_self.endTurn();
        });
  
      }
  
    }
    if (card == "tech") {
  
      if (this.game.player == player) {
  
        this.playerResearchTechnology(function(tech) {
          imperium_self.addMove("resolve\tstrategy");
          imperium_self.addMove("strategy\t"+card+"\t"+player+"\t2");
          imperium_self.addMove("strategy\t"+card+"\t"+player+"\t2");
          imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
          imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
          imperium_self.addMove("purchase\t"+player+"\ttechnology\t"+tech);
          imperium_self.endTurn();
        });
      }
    }
  
    if (card == "empire") {
  
      this.game.state.round_scoring = 1;
  
      if (this.game.player == player) {
        imperium_self.addMove("resolve\tstrategy");
        this.playerScoreVictoryPoints(function(vp, objective) {
          imperium_self.addMove("strategy\t"+card+"\t"+player+"\t2");
          imperium_self.addMove("resetconfirmsneeded\t" + imperium_self.game.players_info.length);
  	  if (vp > 0) {
            imperium_self.addMove("score\t"+player+"\t"+vp+"\t"+objective);
  	  }
          imperium_self.endTurn();
        });
      }
    }
  }




  playStrategyCardSecondary(player, card) {
  
    let imperium_self = this;
  
    let strategy_cards = this.returnStrategyCards();
    this.updateStatus("Moving into the secondary of the " + strategy_cards[card].name + " strategy card");
  
    //
    // no confirms means first time we have hit this
    //
    if (this.game.confirms_received == 0) {
      this.resetConfirmsNeeded(this.game.players_info.length);
    }

console.log("IN SECONDARY: " + this.game.confirms_needed + " -- " + this.game.confirms_received);

  
    if (card == "initiative") {
      this.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
      this.playerBuyTokens();
      return 0;
    }
  
    if (card == "negotiation") {
  
      if (this.game.player != player) {
  
        let html = 'Do you wish to spend 1 strategy token to unexhaust two planet cards? <p></p><ul>';
        html += '<li class="option" id="yes">Yes</li>';
        html += '<li class="option" id="no">No</li>';
        html += '</ul>';
        this.updateStatus(html);
  
        $('.option').off();
        $('.option').on('click', function() {
  
  	let id = $(this).attr("id");
  
  	if (id == "yes") {
  
            imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
            let array_of_cards = imperium_self.returnPlayerExhaustedPlanetCards(imperium_self.game.player); // unexhausted
  
  	  let choices_selected = 0;
  	  let max_choices = 0;
  
            let html  = "Select planets to unexhaust: <p></p><ul>";
  	  for (let z = 0; z < array_of_cards.length; z++) {
  	    max_choices++;
  	    html += '<li class="cardchoice" id="cardchoice_'+array_of_cards[z]+'">' + imperium_self.returnPlanetCard(array_of_cards[z]) + '</li>';
  	  }
  	  html += '</ul>';
  	  if (max_choices >= 2) { max_choices = 2; }
  
  	  imperium_self.updateStatus(html);
  
  	  $('.cardchoice').off();
  	  $('.cardchoice').on('click', function() {
  
  	    let action2 = $(this).attr("id");
  	    let tmpx = action2.split("_");
  
  	    let divid = "#"+action2;
  	    let y = tmpx[1];
  	    let idx = 0;
  	    for (let i = 0; i < array_of_cards.length; i++) {
  	      if (array_of_cards[i] === y) {
  	        idx = i;
  	      }
  	    }
  
  	    choices_selected++;
  	    imperium_self.addMove("unexhaust\t"+imperium_self.game.player+"\tplanet\t"+array_of_cards[idx]);
  
  	    $(divid).off();
  	    $(divid).css('opacity','0.3');
  
  	    if (choices_selected >= max_choices) {
  	      imperium_self.endTurn();
  	    }
  
  	  });
  	}
  
  	if (id == "no") {
            imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
            imperium_self.endTurn();
            return 0;
  	}
  
        });
  
      } else {
        imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
        imperium_self.endTurn();
        return 0;
      }
  
    }
  
    if (card == "politics") {
      imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
      imperium_self.playerBuyActionCards();
      return 0;
  
    }
    if (card == "infrastructure") {
  
      let html = 'Do you wish to spend 1 strategy token to build a PDS or Space Dock? <p></p><ul>';
      if (this.game.player == player) {
        html = 'Do you wish to build a second PDS or Space Dock? <p></p><ul>';
      }
      html += '<li class="option" id="yes">Yes</li>';
      html += '<li class="option" id="no">No</li>';
      html += '</ul>';
  
      this.updateStatus(html);
  
      $('.option').off();
      $('.option').on('click', function() {
  
        let id = $(this).attr("id");
  
        if (id == "yes") {
          imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
  	if (imperium_self.game.player != player) {
            imperium_self.addMove("expend\t"+imperium_self.game.player+"\tstrategy\t1");
  	}
          imperium_self.playerBuildInfrastructure();
        }
        if (id == "no") {
          imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
          imperium_self.endTurn();
          return 0;
        }
      });
    }
  
  
    if (card == "trade") {
  
      if (this.game.player != player) {
  
        let html = 'Do you wish to spend 1 strategy token to refresh your commodities? <p></p><ul>';
        html += '<li class="option" id="yes">Yes</li>';
        html += '<li class="option" id="no">No</li>';
        html += '</ul>';
  
        this.updateStatus(html);
  
        $('.option').off();
        $('.option').on('click', function() {
  
          let id = $(this).attr("id");
  
          if (id == "yes") {
            imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
            imperium_self.addMove("purchase\t"+this.game.player+"\tcommodities\t"+this.game.players_info[this.game.player-1].commodity_limit);
            imperium_self.addMove("expend\t"+imperium_self.game.player+"\tstrategy\t1");
          }
          if (id == "no") {
            imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
            imperium_self.endTurn();
            return 0;
          }
  
        });
      } else {
        imperium_self.addMove("resolve\tstrategy\t1");
        imperium_self.endTurn();
        return 0;
      }
  
    }
    if (card == "military") {
  
      if (this.game.player != player) {
  
        let html = 'Do you wish to spend 1 strategy token to produce in your home sector? <p></p><ul>';
        html += '<li class="option" id="yes">Yes</li>';
        html += '<li class="option" id="no">No</li>';
        html += '</ul>';
  
        this.updateStatus(html);
  
        $('.option').off();
        $('.option').on('click', function() {
  
          let id = $(this).attr("id");
  
          if (id == "yes") {
            imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
            imperium_self.addMove("expend\t"+imperium_self.game.player+"\tstrategy\t1");
  	  imperium_self.playerProduceUnits(this.game.players_info[this.game.player-1].homeworld);
          }
          if (id == "no") {
            imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
            imperium_self.endTurn();
            return 0;
          }
  
        });
      } else {
        this.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
        this.endTurn();
        return 0;
      }
  
    }
    if (card == "tech") {
  
      if (this.game.player != player) {
  
        let html = 'Do you wish to spend 4 resources and a strategy token to research a technology? <p></p><ul>';
        html += '<li class="option" id="yes">Yes</li>';
        html += '<li class="option" id="no">No</li>';
        html += '</ul>';
  
        this.updateStatus(html);
  
        $('.option').off();
        $('.option').on('click', function() {
  
          let id = $(this).attr("id");
  
          if (id == "yes") {

            imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
            imperium_self.playerSelectResources(4, function(success) {
  
  	    if (success == 1) {
                imperium_self.playerResearchTechnology(function(tech) {
                  imperium_self.addMove("purchase\t"+player+"\ttechnology\t"+tech);
                  imperium_self.addMove("expend\t"+imperium_self.game.player+"\tstrategy\t1");
                  imperium_self.endTurn();
                });
  	    } else {
alert("insufficient resources to build this tech... purchase denied");
              imperium_self.endTurn();
  	    }
            });
          }
          if (id == "no") {
            imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
            imperium_self.endTurn();
            return 0;
          }
        });
  
      } else {
  
        let html = 'Do you wish to spend 6 resources and a strategy token to research a technology? <p></p><ul>';
        html += '<li class="option" id="yes">Yes</li>';
        html += '<li class="option" id="no">No</li>';
        html += '</ul>';
  
        this.updateStatus(html);
  
        $('.option').off();
        $('.option').on('click', function() {
  
          let id = $(this).attr("id");
  
          if (id == "yes") {
            imperium_self.addMove("resolve\tstrategy\t1");
            imperium_self.playerSelectResources(6, function(success) {
  
  	    if (success == 1) {
                imperium_self.playerResearchTechnology(function(tech) {
                  imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
                  imperium_self.addMove("purchase\t"+player+"\ttechnology\t"+tech);
                  imperium_self.addMove("expend\t"+imperium_self.game.player+"\tstrategy\t1");
                  imperium_self.endTurn();
                });
  	    } else {
  
  alert("insufficient resources to build this tech... dying");
  
  	    }
            });
          }
          if (id == "no") {
            imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
            imperium_self.endTurn();
            return 0;
          }
        });
      }
    }
  
  
    if (card == "empire") {
  
      imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
      this.playerScoreVictoryPoints(function(vp, objective) {
        if (vp > 0) {
          imperium_self.addMove("score\t"+player+"\t"+vp+"\t"+objective);
        }
        imperium_self.endTurn();
      });
  
    }
  
    return 0;
  
  }
  
  
  
  
  
  
  
  
  playerAllocateNewTokens(player, tokens) {
  
    let imperium_self = this;
  
    if (this.game.player == player) {
  
      let obj = {};
          obj.current_command = this.game.players_info[player-1].command_tokens;
          obj.current_strategy = this.game.players_info[player-1].strategy_tokens;
          obj.new_command = 0;
          obj.new_strategy = 0;
          obj.new_tokens = tokens;
  
      let updateInterface = function(imperium_self, obj, updateInterface) {
  
        let html = 'You have '+obj.new_tokens+' to allocate. How do you want to allocate them? <p></p><ul>';
            html += '<li class="option" id="strategy">Strategy Token '+(obj.current_strategy+obj.new_strategy)+'</li>';
            html += '<li class="option" id="command">Command Token '+(obj.current_command+obj.new_command)+'</li>';
            html += '</ul>';
  
        imperium_self.updateStatus(html);
  
        $('.option').off();
        $('.option').on('click', function() {
  
  	let id = $(this).attr("id");

 
        if (id == "strategy") {
          obj.new_strategy++;
          obj.new_tokens--;
          }

        if (id == "command") {
          obj.new_command++;
          obj.new_tokens--;
          }

        if (obj.new_tokens == 0) {
            if (imperium_self.game.confirms_needed > 0) {
              imperium_self.addMove("resolve\ttokenallocation\t1\t"+imperium_self.app.wallet.returnPublicKey());
	    } else {
              imperium_self.addMove("resolve\ttokenallocation");
	    }
            imperium_self.addMove("purchase\t"+player+"\tstrategy\t"+obj.new_strategy);
            imperium_self.addMove("purchase\t"+player+"\tcommand\t"+obj.new_command);
          imperium_self.endTurn();
          } else {
          updateInterface(imperium_self, obj, updateInterface);
        }

        });

      };

      updateInterface(imperium_self, obj, updateInterface);

    }

    return 0;
  }




  resetConfirmsNeeded(num) {
    this.game.confirms_needed   = num;
    this.game.confirms_received = 0;
    this.game.confirms_players  = [];
  }



  addSectorHighlight(sector) {
    let divname = "#hex_space_"+sector;
    $(divname).css('background-color', '#900');
  }
  removeSectorHighlight(sector) {
    let divname = "#hex_space_"+sector;
    $(divname).css('background-color', 'transparent'); 
  }
  addPlanetHighlight(sector, pid)  {
    let divname = ".sector_graphics_planet_"+sector+'_'+pid;
    $(divname).show();
  }
  removePlanetHighlight(sector, pid)  {
    let divname = ".sector_graphics_planet_"+sector+'_'+pid;
    $(divname).hide();
  }
  showActionCard(c) {
    let action_cards = this.returnActionCards();
    let thiscard = action_cards[c];
    $('.cardbox').html('<img src="'+thiscard.img+'" style="width:100%" />'); 
    $('.cardbox').show();
  }
  hideActionCard(c) {
    $('.cardbox').hide();
  }
  showStrategyCard(c) {
    let strategy_cards = this.returnStrategyCards();
    let thiscard = strategy_cards[c];
    $('.cardbox').html('<img src="'+thiscard.img+'" style="width:100%" />'); 
    $('.cardbox').show();
  }
  hideStrategyCard(c) {
    $('.cardbox').hide();
  }

}

module.exports = Imperium;
  

