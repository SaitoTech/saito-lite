


  playerTurn(stage="main") {
  
    let html = '';
    let imperium_self = this;
    let technologies = this.returnTechnology();

    if (stage == "main") {
  
      let playercol = "player_color_"+this.game.player;
  
      let html  = '<div class="terminal_header">[command: '+this.game.players_info[this.game.player-1].command_tokens+'] [strategy: '+this.game.players_info[this.game.player-1].strategy_tokens+'] [fleet: '+this.game.players_info[this.game.player-1].fleet_supply+'] [commodities: '+this.game.players_info[this.game.player-1].commodities+'] [trade goods: '+this.game.players_info[this.game.player-1].goods+'] [player: '+this.game.player+']</div>';
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

      //
      // add tech and factional abilities
      //
      let tech_attach_menu_events = 0;
      let tech_attach_menu_triggers = [];
      let tech_attach_menu_index = [];


      let z = this.returnEventObjects();
      for (let i = 0; i < z.length; z++) {
	if (z[i].menuOptionTrigger(this, this.game.player) == 1) {
          let x = z[i].menuOption(this, this.game.player);
	  html += x.html;
	  tech_attach_menu_index.push(i);
	  tech_attach_menu_triggers.push(x.trigger);
	  tech_attach_menu_events = 1;
	}
      }
  
      if (this.canPlayerPass(this.game.player) == 1) {
        html += '<li class="option" id="pass">pass</li>';
      }
      html += '</ul>';
  
      this.updateStatus(html);
  
      $('.option').on('click', function() {
  
        let action2 = $(this).attr("id");

        //
        // respond to tech and factional abilities
        //
        if (tech_attach_menu_events == 1) {
	  for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
	    if (action2 == tech_attach_menu_triggers[i]) {
   	      let mytech = technologies[imperium_self.game.players_info[imperium_self.game.player-1].tech[tech_attach_menu_index]];
	      mytech.menuOptionActivated(imperium_self, imperium_self.game.player);
	      return;
	    }
	  }
        }

        if (action2 == "activate") {
  	  imperium_self.addMove("player_end_turn\t"+imperium_self.game.player);
          imperium_self.playerActivateSystem();
        }

        if (action2 == "select_strategy_card") {
  	  imperium_self.addMove("player_end_turn\t"+imperium_self.game.player);
          imperium_self.playerSelectStrategyCard(function(success) {
  	    imperium_self.addMove("strategy\t"+success+"\t"+imperium_self.game.player+"\t1");
  	    imperium_self.endTurn();
          });
        }
        if (action2 == "action") {
  	  imperium_self.addMove("player_end_turn\t"+imperium_self.game.player);
          imperium_self.playerSelectActionCard(function(card) {
  	    imperium_self.addMove("action_card_post\t"+imperium_self.game.player+"\t"+card);
  	    imperium_self.addMove("action_card\t"+imperium_self.game.player+"\t"+card);
  	    imperium_self.endTurn();
          });
        }
        if (action2 == "trade") {
          imperium_self.playerTrade(function() {
  	    imperium_self.endTurn();
          });
        }
        if (action2 == "pass") {
  	  imperium_self.addMove("player_end_turn\t"+imperium_self.game.player);
          imperium_self.addMove("pass\t"+imperium_self.game.player);
          imperium_self.endTurn();
        }
      });
    }
  }
  
  



  playerContinueTurn(player, sector) {

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
          imperium_self.playerSelectActionCard(function(card) {
            imperium_self.addMove("continue\t"+player+"\t"+sector);
            imperium_self.addMove("action_card_post\t"+imperium_self.game.player+"\t"+card);
            imperium_self.addMove("action_card\t"+imperium_self.game.player+"\t"+card);
            imperium_self.endTurn();
          }, player, sector);
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
  
    this.updateStatus(html);
  
    $('.buildchoice').off();
    $('.buildchoice').on('click', function() {
  
      let id = $(this).attr("id");
  
      if (id == "yes") {
  
        imperium_self.addMove("DEAL\t2\t"+imperium_self.game.player+"\t2");
        imperium_self.addMove("expend\t"+imperium_self.game.player+"\tstrategy\t1");
        imperium_self.endTurn();
        return;
  
      } else {
  
        imperium_self.endTurn();
        return;
  
      }
    });
  
  }
  
  



  playerResearchTechnology(mycallback) {
  
    let imperium_self = this;
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

      //
      // handle prerequisites
      //
      imperium_self.exhaustPlayerResearchTechnologyPrerequisites(i);
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




  playerScoreVictoryPoints(mycallback, stage=0) {  

    let imperium_self = this;
   
    let html = '';  
    if (stage == 1) { 
      html += 'You are playing the Imperium primary. ';
    }
    if (stage == 2) { 
      html += 'You are playing the Imperium secondary. ';
    }

    html += 'Do you wish to score any victory points? <p></p><ul>';
  
    // Stage I Public Objectives
    for (let i = 0; i < this.game.state.stage_i_objectives.length; i++) {
      if (this.canPlayerScoreVictoryPoints(this.game.player, this.game.state.stage_i_objectives[i], 1)) {
        html += '1 VP Public Objective: <li class="option stage1" id="'+this.game.state.stage_i_objectives[i]+'">'+this.game.deck[3].cards[this.game.state.stage_i_objectives[i]].name+'</li>';
      }
    }
  
    // Stage II Public Objectives
    for (let i = 0; i < this.game.state.stage_ii_objectives.length; i++) {
      if (this.canPlayerScoreVictoryPoints(this.game.player, this.game.state.stage_ii_objectives[i], 2)) {
        html += '2 VP Public Objective: <li class="option stage2" id="'+this.game.state.stage_ii_objectives[i]+'">'+this.game.deck[4].cards[this.game.state.stage_ii_objectives[i]].name+'</li>';
      }
    }
  
    // Secret Objectives
    for (let i = 0 ; i < this.game.deck[5].hand.length; i++) {
      if (this.canPlayerScoreVictoryPoints(this.game.player, this.game.deck[5].hand[i], 3)) {
        html += '1 VP Secret Objective: <li class="option secret3" id="'+this.game.deck[5].hand[i]+'">'+this.game.deck[5].cards[this.game.deck[5].hand[i]].name+'</li>';
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

    let imperium_self = this;

    if (deck == 1) {
      let objectives = this.returnStageIPublicObjectives();
      objectives[objective].post(imperium_self, imperium_self.game.player, function(success) {
        mycallback(1, objective);
      });
    }
  
    if (deck == 2) {
      let objectives = this.returnStageIIPublicObjectives();
      objectives[objective].post(imperium_self, imperium_self.game.player, function(success) {
        mycallback(2, objective);
      });
    }
  
    if (deck == 3) {
      let objectives = this.returnSecretObjectives();
      objectives[objective].post(imperium_self, imperium_self.game.player, function(success) {
        mycallback(1, objective);
      });
    }
  
    mycallback(0, "null-vp-objective");
  
  }
  
  
  
  playerBuildInfrastructure(mycallback, stage=1) {   

    let imperium_self = this;
  
    let html = '';

    if (stage == 1) { html += "Which would you like to build: <p></p><ul>"; }
    else { html += "You may also build an additional PDS: <p></p><ul>"; }

    html += '<li class="buildchoice" id="pds">Planetary Defense System</li>';
    if (stage == 1) {
      html += '<li class="buildchoice" id="spacedock">Space Dock</li>';
    }
    html += '</ul>';
  
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
	  mycallback();
        }
        if (id == "spacedock") {
  	  imperium_self.addMove("produce\t"+imperium_self.game.player+"\t"+1+"\t"+planet_idx+"\tspacedock\t"+sector);
	  mycallback();
        }
  
      }, 2);  // 2 any i control
  
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
        calculated_total_cost += imperium_self.returnUnitCost(stuff_to_build[i], imperium_self.game.player);
      }
      calculated_total_cost += imperium_self.returnUnitCost(id, imperium_self.game.player);
  
      //
      // reduce production costs if needed
      //
      if (imperium_self.game.players_info[imperium_self.game.player-1].production_bonus > 0) {
        calculated_total_cost -= imperium_self.game.players_info[imperium_self.game.player-1].production_bonus;
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
  	total_cost += imperium_self.returnUnitCost(stuff_to_build[i], imperium_self.game.player);
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
        total_cost += imperium_self.returnUnitCost(stuff_to_build[i], imperium_self.game.player);
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
    // 2 = controlled by me
    //
  
    let imperium_self = this;
  
    let html  = "Select a system in which to select a planet: ";
    this.updateStatus(html);
  
    $('.sector').on('click', function() {
  
      let sector = $(this).attr("id");
      let sys = imperium_self.returnSectorAndPlanets(sector);

      //
      // exit if no planets are controlled
      //
      if (mode == 2) {
	let exist_controlled_planets = 0;
        for (let i = 0; i < sys.p.length; i++) {
	  if (sys.p[i].owner == imperium_self.game.player) {
	    exist_controlled_planets = 1;
	  }
        }
	if (exist_controlled_planets == 0) {
	  alert("Invalid Choice: you do not control planets in that sector");
	  return;
	}
      }

  
      html = 'Select a planet in this system: <p></p><ul>';
      for (let i = 0; i < sys.p.length; i++) {
	if (mode == 0) {
          html += '<li class="option" id="' + i + '">' + sys.p[i].name + ' (<span class="invadeplanet_'+i+'">0</span>)</li>';
	}
	if (mode == 1) {
          html += '<li class="option" id="' + i + '">' + sys.p[i].name + ' (<span class="invadeplanet_'+i+'">0</span>)</li>';
	}
	if (mode == 2 && sys.p[i].owner == imperium_self.game.player) {
          html += '<li class="option" id="' + i + '">' + sys.p[i].name + '</li>';
	}
      }
      html += '</ul>';
  

      imperium_self.updateStatus(html);
  
      $('.option').off();
      $('.option').on('mouseenter', function() { let s = $(this).attr("id"); imperium_self.showPlanetCard(sector, s); });
      $('.option').on('mouseleave', function() { let s = $(this).attr("id"); imperium_self.hidePlanetCard(sector, s); });
      $('.option').on('click', function() {
	let pid = $(this).attr("id");
	imperium_self.hidePlanetCard(sector, pid);
        mycallback(sector, pid);
      });
  
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







  
  playerSelectActionCard(mycallback, player, sector) { 
 
    let imperium_self = this;
    let array_of_cards = this.returnPlayerActionCards(this.game.player);
    let action_cards = this.returnActionCards();

    let html = '';

    html += "Select an action card: <p></p><ul>";
    for (let z in array_of_cards) {
      let thiscard = action_cards[this.game.deck[1].hand[z]];
      html += '<li class="textchoice pointer" id="'+this.game.deck[1].hand[z]+'">' + thiscard.name + '</li>';
    }
    html += '<li class="textchoice pointer" id="cancel">cancel</li>';
    html += '</ul>';
  
    this.updateStatus(html);
    $('.textchoice').on('mouseenter', function() { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.showActionCard(s); } });
    $('.textchoice').on('mouseleave', function() { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.hideActionCard(s); } });
    $('.textchoice').on('click', function() {

      let action2 = $(this).attr("id");

      if (action2 != "cancel") { imperium_self.hideActionCard(action2); }

      if (action2 === "cancel") {
	if (sector == null) {
	  imperium_self.playerTurn();
	  return;
	}
	else {
	  imperium_self.playerContinueTurn(player, sector);
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
  playerSelectStrategyCard(mycallback, mode=0) {

    let array_of_cards = this.game.players_info[this.game.player-1].strategy;
    let strategy_cards = this.returnStrategyCards();
    let imperium_self = this;  

    let html = "";

    html += "Select a strategy card: <p></p><ul>";
    for (let z in array_of_cards) {
      if (!this.game.players_info[this.game.player-1].strategy_cards_played.includes(array_of_cards[z])) {
        html += '<li class="textchoice" id="'+array_of_cards[z]+'">' + strategy_cards[array_of_cards[z]].name + '</li>';
      }
    }
    html += '<li class="textchoice pointer" id="cancel">cancel</li>';
    html += '</ul>';
  
    this.updateStatus(html);
    $('.textchoice').on('mouseenter', function() { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.showStrategyCard(s); } });
    $('.textchoice').on('mouseleave', function() { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.hideStrategyCard(s); } });
    $('.textchoice').on('click', function() {

      let action2 = $(this).attr("id");

      if (action2 != "cancel") { imperium_self.hideStrategyCard(action2); }

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

    let imperium_self = this;
    let cards = this.returnStrategyCards();
    let html  = "<div class='terminal_header'>You are playing as " + this.returnFaction(this.game.player) + ". Select your strategy card:</div><p></p><ul>";
    if (this.game.state.round > 1) {
      html  = "<div class='terminal_header'>"+this.returnFaction(this.game.player) + ": select your strategy card:</div><p></p><ul>";
    }
    for (let z = 0; z < this.game.state.strategy_cards.length; z++) {
      html += '<li class="textchoice" id="'+this.game.state.strategy_cards[z]+'">' + cards[this.game.state.strategy_cards[z]].name + '</li>';
    }
    html += '</ul>';
  
    this.updateStatus(html);
    $('.textchoice').off();
    $('.textchoice').on('mouseenter', function() { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.showStrategyCard(s); } });
    $('.textchoice').on('mouseleave', function() { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.hideStrategyCard(s); } });
    $('.textchoice').on('click', function() {
      let action2 = $(this).attr("id");
      imperium_self.hideStrategyCard(action2);
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
  
        let sys = imperium_self.returnSectorAndPlanets(obj.ships_and_sectors[i].sector);
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
          imperium_self.addMove("space_invasion\t"+imperium_self.game.player+"\t"+destination);
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
        let sys = imperium_self.returnSectorAndPlanets(sector);
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
 

        //
        // is there stuff left to move?
        //
	let stuff_available_to_move = 0;
        for (let i = 0; i < sys.p.length; i++) {
          let planetary_units = sys.p[i].units[imperium_self.game.player-1];
          for (let k = 0; k < planetary_units.length; k++) {
            if (planetary_units[k].type == "infantry") {
              stuff_available_to_move++;
            }
          }
        }
        for (let i = 0; i < sys.s.units[imperium_self.game.player-1].length; i++) {
          if (sys.s.units[imperium_self.game.player-1][i].type == "fighter") {
    	    stuff_available_to_move++;
          }
        }


        if (total_ship_capacity > 0 && stuff_available_to_move > 0) {
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
              if (planetary_units[k].type == "infantry") {
                infantry_available_to_move++;
              }
            }
            if (infantry_available_to_move > 0) {
              user_message += '<li class="addoption option" id="addinfantry_p_'+i+'">add infantry from '+sys.p[i].name+' (<span class="add_infantry_remaining_'+i+'">'+infantry_available_to_move+'</span>)</li>';
            }
          }
  
          let fighters_available_to_move = 0;
          for (let i = 0; i < sys.s.units[imperium_self.game.player-1].length; i++) {
            if (sys.s.units[imperium_self.game.player-1][i].type == "fighter") {
    	    fighters_available_to_move++;
            }
          }
          user_message += '<li class="addoption option" id="addfighter_s_s">add fighter (<span class="add_fighters_remaining">'+fighters_available_to_move+'</span>)</li>';
          user_message += '<li class="addoption option" id="skip">finish</li>';
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
    let sys = this.returnSectorAndPlanets(sector);
  
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
console.log("confirm and launch invasion!");
	for (let i = 0; i < planets_invaded.length; i++) {
console.log("INVADING PLANET: " + planets_invaded[i]);
          imperium_self.prependMove("bombardment\t"+imperium_self.game.player+"\t"+sector+"\t"+planets_invaded[i]);
          imperium_self.prependMove("bombardment_post\t"+imperium_self.game.player+"\t"+sector+"\t"+planets_invaded[i]);
    	  imperium_self.prependMove("planetary_defense\t"+imperium_self.game.player+"\t"+sector+"\t"+planets_invaded[i]);
    	  imperium_self.prependMove("planetary_defense_post\t"+imperium_self.game.player+"\t"+sector+"\t"+planets_invaded[i]);
    	  imperium_self.prependMove("ground_combat_start\t"+imperium_self.game.player+"\t"+sector+"\t"+planets_invaded[i]);
    	  imperium_self.prependMove("ground_combat\t"+imperium_self.game.player+"\t"+sector+"\t"+planets_invaded[i]);
    	  imperium_self.prependMove("ground_combat_post\t"+imperium_self.game.player+"\t"+sector+"\t"+planets_invaded[i]);
    	  imperium_self.prependMove("ground_combat_end\t"+imperium_self.game.player+"\t"+sector+"\t"+planets_invaded[i]);
	}
        imperium_self.endTurn();
        return;
      }

      //
      // looks like we have selected a planet for invasion
      //
      if (!planets_invaded.includes(planet_idx)) {
        planets_invaded.push(planet_idx);
      }

      //
      // figure out available infantry and ships capacity
      //
      for (let i = 0; i < sys.s.units[player - 1].length; i++) {
        let unit = sys.s.units[player-1][i];
        for (let k = 0; k < unit.storage.length; k++) {
  	if (unit.storage[k].type == "infantry") {
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
            if (sys.p[i].units[player - 1][j].type == "infantry") {
              if (populated_planet_forces == 0) {
                forces_on_planets[i]++;;
  	    }
            }
          }
          html += '<li class="invadechoice option" id="invasion_planet_'+i+'">'+sys.p[i].name+' (<span class="planet_'+i+'_infantry">'+forces_on_planets[i]+'</span>)</li>';
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
  	    }
  	  }
        }
        if (forces_on_ships[i] > 0) {
          html += '<li class="invadechoice" id="invasion_ship_'+i+'">'+ship.name+' (<span class="ship_'+i+'_infantry">'+forces_on_ships[i]+'</span>)</li>';
        }
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
 
          landing_forces.push(landing);
  
          let planet_counter = ".invadeplanet_"+planet_idx;
          let planet_forces = parseInt($(planet_counter).html());
  
          planet_forces++;
          $(planet_counter).html(planet_forces);
  
          counter--;
          $(counter_div).html(counter);
  
        }
  
        if (action2 === "finished") {
  
          for (let y = 0; y < landing_forces.length; y++) {
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
        let sys = imperium_self.returnSectorAndPlanets(pid);
        let divpid = '#'+pid;
  
        $(divpid).find('.hex_activated').css('background-color', 'yellow');
        $(divpid).find('.hex_activated').css('opacity', '0.3');
  
        let c = confirm("Activate this system?");
        if (c) {
          sys.s.activated[imperium_self.game.player-1] = 1;
          imperium_self.addMove("activate_system_post\t"+imperium_self.game.player+"\t"+pid);
          imperium_self.addMove("activate_system\t"+imperium_self.game.player+"\t"+pid);
          imperium_self.addMove("expend\t"+imperium_self.game.player+"\t"+"command"+"\t"+1);
	  imperium_self.endTurn();
        }
      }
  
    });
  }
  
  
  //
  // if we have arrived here, we are ready to continue with our options post
  // systems activation, which are move / pds combat / space combat / bombardment
  // planetary invasion / ground combat
  //
  playerPostActivateSystem(sector) {
  
    let imperium_self = this;
  
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




