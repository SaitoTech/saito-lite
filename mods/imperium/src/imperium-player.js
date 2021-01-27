
returnPlayers(num = 0) {

  var players = [];

  let factions = JSON.parse(JSON.stringify(this.returnFactions()));

  for (let i = 0; i < num; i++) {

    if (i == 0) { col = "color1"; }
    if (i == 1) { col = "color2"; }
    if (i == 2) { col = "color3"; }
    if (i == 3) { col = "color4"; }
    if (i == 4) { col = "color5"; }
    if (i == 5) { col = "color6"; }

    var keys = Object.keys(factions);
    let rf = keys[this.rollDice(keys.length) - 1];
    let delete_as_assigned = 1;

    if (i == 0) {
      if (this.game.options.player1 != undefined) {
        if (this.game.options.player1 != "random") {
          rf = this.game.options.player1;
          delete_as_assigned = 0;
        }
      }
    }
    if (i == 1) {
      if (this.game.options.player2 != undefined) {
        if (this.game.options.player2 != "random") {
          rf = this.game.options.player2;
          delete_as_assigned = 0;
        }
      }
    }
    if (i == 2) {
      if (this.game.options.player3 != undefined) {
        if (this.game.options.player3 != "random") {
          rf = this.game.options.player3;
          delete_as_assigned = 0;
        }
      }
    }
    if (i == 3) {
      if (this.game.options.player4 != undefined) {
        if (this.game.options.player4 != "random") {
          rf = this.game.options.player4;
          delete_as_assigned = 0;
        }
      }
    }

    if (delete_as_assigned) { delete factions[rf]; }


    players[i] = {};
    players[i].can_intervene_in_action_card = 0;
    players[i].secret_objectives_in_hand = 0;
    players[i].action_cards_in_hand = 0;
    players[i].action_cards_per_round = 2;
    players[i].action_card_limit = 7;
    players[i].action_cards_played = [];
    players[i].new_tokens_per_round = 2;
    players[i].command_tokens = 3;
    players[i].strategy_tokens = 2;
    players[i].fleet_supply = 3;
    players[i].fleet_supply_limit = 16;
    players[i].faction = rf;
    players[i].homeworld = "";
    players[i].color = col;
    players[i].goods = 0;
    players[i].commodities = 0;
    players[i].commodity_limit = 3;
    players[i].vp = 0;
    players[i].passed = 0;
    players[i].strategy_cards_played = [];
    players[i].strategy_cards_retained = [];
    players[i].cost_of_technology_primary = 6;
    players[i].cost_of_technology_secondary = 4;
    players[i].promissary_notes = [];

    //
    // unit limits
    //
    players[i].infantry_limit = 30;
    players[i].fighter_limit = 30;
    players[i].carrier_limit = 4;
    players[i].destroyer_limit = 8;
    players[i].cruiser_limit = 8;
    players[i].dreadnaught_limit = 5;
    players[i].flagship_limit = 1;
    players[i].warsun_limit = 2;
    players[i].pds_limit = 4;
    players[i].spacedock_limit = 3;


    players[i].traded_this_turn = 0;


    //
    // gameplay modifiers (action cards + tech)
    //
    players[i].new_token_bonus_when_issued = 0;
    players[i].action_cards_bonus_when_issued = 0;
    players[i].new_tokens_bonus_when_issued = 0;
    players[i].fleet_move_bonus = 0;
    players[i].temporary_fleet_move_bonus = 0;
    players[i].ship_move_bonus = 0;
    players[i].temporary_ship_move_bonus = 0;
    players[i].fly_through_asteroids = 0;
    players[i].fly_through_nebulas = 0;
    players[i].fly_through_supernovas = 0;
    players[i].move_into_supernovas = 0;
    players[i].reinforce_infantry_after_successful_ground_combat = 0;
    players[i].bacterial_weapon = 0;
    players[i].evasive_bonus_on_pds_shots = 0;
    players[i].perform_two_actions = 0;
    players[i].move_through_sectors_with_opponent_ships = 0;
    players[i].temporary_move_through_sectors_with_opponent_ships = 0;
    players[i].assign_pds_hits_to_non_fighters = 0;
    players[i].reallocate_four_infantry_per_round = 0;
    players[i].may_produce_after_gaining_planet = 0;
    players[i].extra_roll_on_bombardment_or_pds = 0;
    players[i].stasis_on_opponent_combat_first_round = 0;
    players[i].may_repair_damaged_ships_after_space_combat = 0;
    players[i].may_assign_first_round_combat_shot = 0;
    players[i].production_bonus = 0;
    players[i].may_player_produce_without_spacedock = 0;
    players[i].may_player_produce_without_spacedock_production_limit = 0;
    players[i].may_player_produce_without_spacedock_cost_limit = 0;

    //
    // must target certain units when assigning hits, if possible
    //
    players[i].target_units = [];
    players[i].planets_conquered_this_turn = [];
    players[i].objectives_scored_this_round = [];
    players[i].must_exhaust_at_round_start = [];


    //
    // faction-inspired gameplay modifiers 
    //
    players[i].deep_space_conduits = 0; // treat all systems adjacent to activated system
    players[i].resupply_stations = 0; // gain trade goods on system activation if contains ships 
    players[i].turn_nullification = 0; // after player activates system with ships, can end turn ...

    //
    // roll modifiers
    //
    players[i].space_combat_roll_modifier = 0;
    players[i].ground_combat_roll_modifier = 0;
    players[i].pds_combat_roll_modifier = 0;
    players[i].bombardment_combat_roll_modifier = 0;
    players[i].space_combat_roll_bonus_shots = 0;
    players[i].ground_combat_roll_bonus_shots = 0;
    players[i].pds_combat_roll_bonus_shots = 0;
    players[i].bombardment_combat_roll_bonus_shots = 0;

    players[i].ground_combat_dice_reroll = 0;
    players[i].space_combat_dice_reroll = 0;
    players[i].pds_combat_dice_reroll = 0;
    players[i].bombardment_combat_dice_reroll = 0;
    players[i].combat_dice_reroll = 0;

    players[i].temporary_immune_to_pds_fire = 0;
    players[i].temporary_immune_to_planetary_defense = 0;

    players[i].temporary_space_combat_roll_modifier = 0;
    players[i].temporary_ground_combat_roll_modifier = 0;
    players[i].temporary_pds_combat_roll_modifier = 0;
    players[i].temporary_bombardment_combat_roll_modifier = 0;

    players[i].units_i_destroyed_this_combat_round = [];
    players[i].units_i_destroyed_last_combat_round = [];
    players[i].my_units_destroyed_this_combat_round = [];
    players[i].my_units_destroyed_last_combat_round = [];

    //
    // tech upgrades
    //
    players[i].temporary_green_tech_prerequisite = 0;
    players[i].temporary_yellow_tech_prerequisite = 0;
    players[i].temporary_red_tech_prerequisite = 0;
    players[i].temporary_blue_tech_prerequisite = 0;
    players[i].permanent_green_tech_prerequisite = 0;
    players[i].permanent_yellow_tech_prerequisite = 0;
    players[i].permanent_red_tech_prerequisite = 0;
    players[i].permanent_blue_tech_prerequisite = 0;
    players[i].temporary_ignore_number_of_tech_prerequisites_on_nonunit_upgrade = 0;
    players[i].permanent_ignore_number_of_tech_prerequisites_on_nonunit_upgrade = 0;
    players[i].temporary_infiltrate_infrastructure_on_invasion = 0;
    players[i].permanent_infiltrate_infrastructure_on_invasion = 0;
    players[i].temporary_opponent_cannot_retreat = 0;
    players[i].permanent_opponent_cannot_retreat = 0;
    players[i].permanent_research_technology_card_must_not_spend_resources = 0;

    if (i == 1) { players[i].color = "yellow"; }
    if (i == 2) { players[i].color = "green"; }
    if (i == 3) { players[i].color = "blue"; }
    if (i == 4) { players[i].color = "purple"; }
    if (i == 5) { players[i].color = "black"; }

    players[i].planets = [];
    players[i].tech = [];
    players[i].tech_exhausted_this_turn = [];
    players[i].upgrades = [];
    players[i].strategy = [];        // strategy cards  

    // scored objectives
    players[i].objectives_scored = [];


    // random
    players[i].lost_planet_this_round = -1; // is player to whom lost

  }

  return players;

}








playerTurn(stage = "main") {

  let html = '';
  let imperium_self = this;
  let technologies = this.returnTechnology();
  let relevant_action_cards = ["action", "main", "instant"];
  let ac = this.returnPlayerActionCards(imperium_self.game.player, relevant_action_cards);

  this.updateLeaderboard();
  this.updateTokenDisplay();

  if (stage == "main") {

    let playercol = "player_color_" + this.game.player;

    let html = '';
    html += '<div class="terminal_header2 sf-readable"><div class="player_color_box ' + playercol + '"></div>' + this.returnFaction(this.game.player) + ":</div><p><ul class='terminal_header3'>";

    if (this.canPlayerPass(this.game.player) == 1) {
      if (this.game.state.active_player_moved == 1) {
        //
        // if we have already moved, we end turn rather than pass
        //
        html += '<li class="option" id="endturn">end turn</li>';
      } else {
        //
        // otherwise we pass
        //
        html += '<li class="option" id="pass">pass</li>';
      }
    } else {
      if (this.game.state.active_player_moved == 1) {
        //
        // if we have already moved, we end turn rather than pass
        //
        html += '<li class="option" id="endturn">end turn</li>';
      }
    }

    if (this.game.state.round == 1 && this.game.state.active_player_moved == 0) {
      if (this.tutorial_move_clicked == 0) {
        html += '<li class="option" id="tutorial_move_ships">move ships</li>';
      }
      if (this.tutorial_produce_clicked == 0) {
        html += '<li class="option" id="tutorial_produce_units">produce units</li>';
      }
    }

    if (this.game.players_info[this.game.player - 1].command_tokens > 0) {
      if (this.game.state.active_player_moved == 0) {
        html += '<li class="option" id="activate">activate sector</li>';
      }
    }
    if (this.canPlayerPlayStrategyCard(this.game.player) == 1) {
      if (this.game.state.active_player_moved == 0) {
        html += '<li class="option" id="select_strategy_card">play strategy card</li>';
      }
    }
    if (ac.length > 0 && this.game.tracker.action_card == 0 && this.canPlayerPlayActionCard(this.game.player) == 1) {
      if (this.game.state.active_player_moved == 0) {
        html += '<li class="option" id="action">play action card</li>';
      }
    }
    if (this.game.tracker.trade == 0 && this.canPlayerTrade(this.game.player) == 1) {
      html += '<li class="option" id="trade">trade</li>';
    }

    //
    // add tech and factional abilities
    //
    let tech_attach_menu_events = 0;
    let tech_attach_menu_triggers = [];
    let tech_attach_menu_index = [];


    if (this.game.state.active_player_moved == 1) {
      let z = this.returnEventObjects();
      for (let i = 0; i < z.length; i++) {
        if (z[i].menuOptionTriggers(this, "main", this.game.player) == 1) {
          let x = z[i].menuOption(this, "main", this.game.player);
          html += x.html;
          tech_attach_menu_index.push(i);
          tech_attach_menu_triggers.push(x.event);
          tech_attach_menu_events = 1;
        }
      }
    }



    html += '</ul></p>';

    this.updateStatus(html);

    $('.option').on('click', function () {

      let action2 = $(this).attr("id");

      //
      // respond to tech and factional abilities
      //
      if (tech_attach_menu_events == 1) {
        for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
          if (action2 == tech_attach_menu_triggers[i]) {
            $(this).remove();
            imperium_self.game.state.active_player_moved = 1;
            z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, "main", imperium_self.game.player);
            return;
          }
        }
      }

      if (action2 == "activate") {
        imperium_self.playerActivateSystem();
      }

      if (action2 == "tutorial_move_ships") {
        imperium_self.tutorial_move_clicked = 1;
        imperium_self.playerAcknowledgeNotice("To move ships select \"activate sector\". Be careful as most ships can only move 1-hexagon and you cannot move ships from sectors that are already activated. You will be able to choose the ships to move, and load infantry and fighters into units that can carry them.", function () {
          imperium_self.playerTurn();
        });
        return;
      }
      if (action2 == "tutorial_produce_units") {
        imperium_self.tutorial_produce_clicked = 1;
        imperium_self.playerAcknowledgeNotice("To produce units, select \"activate sector\" and activate a sector with a space dock (like your home system). You can only have as many non-fighter ships in any sector as your fleet supply, so move your ships out before producing more!", function () {
          imperium_self.playerTurn();
        });
        return;
      }

      if (action2 == "select_strategy_card") {
        imperium_self.playerSelectStrategyCard(function (success) {
          imperium_self.game.state.active_player_moved = 1;
          imperium_self.addMove("strategy_card_after\t" + success + "\t" + imperium_self.game.player + "\t1");
          imperium_self.addMove("strategy\t" + success + "\t" + imperium_self.game.player + "\t1");
          imperium_self.addMove("strategy_card_before\t" + success + "\t" + imperium_self.game.player + "\t1");
          imperium_self.endTurn();
        });
      }
      if (action2 == "action") {
        imperium_self.playerSelectActionCard(function (card) {
          if (imperium_self.action_cards[card].type == "action") { imperium_self.game.state.active_player_moved = 1; }
          imperium_self.addMove("action_card_post\t" + imperium_self.game.player + "\t" + card);
          imperium_self.addMove("action_card\t" + imperium_self.game.player + "\t" + card);
          imperium_self.addMove("lose\t" + imperium_self.game.player + "\taction_cards\t1");
          imperium_self.endTurn();
        }, function () { imperium_self.playerTurn(); },
          relevant_action_cards);
      }
      if (action2 == "trade") {
        imperium_self.playerTrade();
        return 0;
      }
      if (action2 == "pass") {
        imperium_self.addMove("resolve\tplay");
        imperium_self.addMove("setvar\tstate\t0\tactive_player_moved\t" + "int" + "\t" + "0");
        imperium_self.addMove("player_end_turn\t" + imperium_self.game.player);
        imperium_self.addMove("pass\t" + imperium_self.game.player);
        imperium_self.endTurn();
      }
      if (action2 == "endturn") {
        imperium_self.addMove("resolve\tplay");
        imperium_self.addMove("setvar\tstate\t0\tactive_player_moved\t" + "int" + "\t" + "0");
        imperium_self.addMove("player_end_turn\t" + imperium_self.game.player);
        imperium_self.endTurn();
      }
    });
  }
}




playerPlayActionCardMenu(action_card_player, card, action_cards_played = []) {

  let imperium_self = this;
  let relevant_action_cards = ["counter"];

  for (let i = 0; i < this.game.deck[1].hand.length; i++) {
    if (this.game.deck[1].hand[i].indexOf("sabotage") > -1) {
      this.game.players_info[this.game.player - 1].can_intervene_in_action_card = 1;
    }
  }

  if (this.game.players_info[this.game.player - 1].can_intervene_in_action_card) {

    let html = '<div class="action_card_instructions_hud">' + this.returnFaction(action_card_player) + ' has played an action card:</div>';
    html += '<div class="action_card_name_hud">' + imperium_self.action_cards[card].name + '</div>';
    html += '<div class="action_card_text_hud">';
    html += this.action_cards[card].text;
    html += '</div>';
    html += '<ul>';

    let ac = this.returnPlayerActionCards(this.game.player, relevant_action_cards);
    console.log("AC: " + JSON.stringify(ac));
    if (ac.length > 0) {
      html += '<li class="option" id="cont">continue</li>';
      html += '<li class="option" id="action">play action card</li>';
    } else {
      html += '<li class="option" id="cont">continue</li>';
    }

    let tech_attach_menu_events = 0;
    let tech_attach_menu_triggers = [];
    let tech_attach_menu_index = [];

    let z = this.returnEventObjects();
    for (let i = 0; i < z.length; i++) {
      if (z[i].menuOptionTriggers(this, "action_card", this.game.player) == 1) {
        let x = z[i].menuOption(this, "action_card", this.game.player);
        html += x.html;
        tech_attach_menu_index.push(i);
        tech_attach_menu_triggers.push(x.event);
        tech_attach_menu_events = 1;
      }
    }
    html += '</ul>';

    this.updateStatus(html);

    $('.option').off();
    $('.option').on('click', function () {

      let action2 = $(this).attr("id");

      //
      // respond to tech and factional abilities
      //
      if (tech_attach_menu_events == 1) {
        for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
          if (action2 == tech_attach_menu_triggers[i]) {
            $(this).remove();
            z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, "action_card", imperium_self.game.player);
          }
        }
      }

      if (action2 == "action") {
        imperium_self.playerSelectActionCard(function (card) {
          imperium_self.game.players_info[imperium_self.game.player - 1].action_cards_played.push(card);
          imperium_self.addMove("action_card_post\t" + imperium_self.game.player + "\t" + card);
          imperium_self.addMove("action_card\t" + imperium_self.game.player + "\t" + card);
          imperium_self.addMove("lose\t" + imperium_self.game.player + "\taction_cards\t1");
          imperium_self.playerPlayActionCardMenu(action_card_player, card);
        }, function () {
          imperium_self.playerPlayActionCardMenu(action_card_player, card);
        }, relevant_action_cards);
      }

      if (action2 == "cont") {
        imperium_self.endTurn();
      }
      return 0;
    });

  } else {

    let notice = '<div class="action_card_instructions_hud">' + this.returnFaction(action_card_player) + ' has played an action card:</div>';
    notice += '<div class="action_card_name_hud">' + imperium_self.action_cards[card].name + '</div>';
    notice += '<div class="action_card_text_hud">';
    notice += this.action_cards[card].text;
    notice += '</div>';

    this.playerAcknowledgeNotice(notice, function () { imperium_self.endTurn(); });
    return 0;
  }

}





playerPlayBombardment(attacker, sector, planet_idx) {

  let imperium_self = this;

  this.game.state.bombardment_sector = sector;
  this.game.state.bombardment_planet_idx = planet_idx;

  let sys = imperium_self.returnSectorAndPlanets(sector);


  //
  // some laws prohibit bombardment against
  //
  if (this.game.state.bombardment_against_cultural_planets == 0 && sys.p[planet_idx].type == "cultural") {
    this.updateLog("Bombardment not possible against cultural planets. Skipping.");
    this.endTurn();
  }
  if (this.game.state.bombardment_against_industrial_planets == 0 && sys.p[planet_idx].type == "industrial") {
    this.updateLog("Bombardment not possible against industrial planets. Skipping.");
    this.endTurn();
  }
  if (this.game.state.bombardment_against_hazardous_planets == 0 && sys.p[planet_idx].type == "hazardous") {
    this.updateLog("Bombardment not possible against hazardous planets. Skipping.");
    this.endTurn();
  }
  //
  // no bombardment of my own planets (i.e. if parlay ends invasion)
  //
  if (sys.p[planet_idx].owner == imperium_self.game.player) {
    imperium_self.endTurn();
    return 0;
  }
  //
  // no bombardment of PDS-defended territories
  //
  if (this.doesPlanetHavePDS(sys.p[planet_idx])) {
    this.updateLog("Bombardment not possible against PDS-defended planets. Skipping.");
    imperium_self.endTurn();
    return 0;
  }

  html = '<div class="sf-readable">Do you wish to bombard ' + sys.p[planet_idx].name + '? </div><ul>';

  let ac = this.returnPlayerActionCards(this.game.player, ["pre_bombardment"]);
  if (ac.length > 0) {
    html += '<li class="option" id="bombard">bombard planet</li>';
    html += '<li class="option" id="action">play action card</li>';
    html += '<li class="option" id="skip">skip bombardment</li>';
  } else {
    html += '<li class="option" id="bombard">bombard planet</li>';
    html += '<li class="option" id="skip">skip bombardment</li>';
  }

  let tech_attach_menu_events = 0;
  let tech_attach_menu_triggers = [];
  let tech_attach_menu_index = [];

  let z = this.returnEventObjects();
  for (let i = 0; i < z.length; i++) {
    if (z[i].menuOptionTriggers(this, "pre_bombardment", this.game.player) == 1) {
      let x = z[i].menuOption(this, "pre_bombardment", this.game.player);
      html += x.html;
      tech_attach_menu_index.push(i);
      tech_attach_menu_triggers.push(x.event);
      tech_attach_menu_events = 1;
    }
  }
  html += '</ul>';

  this.updateStatus(html);

  $('.option').on('click', function () {

    let action2 = $(this).attr("id");

    //
    // respond to tech and factional abilities
    //
    if (tech_attach_menu_events == 1) {
      for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
        if (action2 == tech_attach_menu_triggers[i]) {
          $(this).remove();
          z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, "pre_bombardment", imperium_self.game.player);
        }
      }
    }

    if (action2 == "action") {
      imperium_self.playerSelectActionCard(function (card) {
        imperium_self.game.players_info[this.game.player - 1].action_cards_played.push(card);
        imperium_self.addMove("action_card_post\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("action_card\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("lose\t" + imperium_self.game.player + "\taction_cards\t1");
        imperium_self.playerPlayActionCardMenu(action_card_player, card);
      }, function () {
        imperium_self.playerPlayActionCardMenu(action_card_player, card);
      }, ["pre_bombardment"]);
    }

    if (action2 == "bombard") {
      imperium_self.addMove("bombard\t" + imperium_self.game.player + "\t" + sector + "\t" + planet_idx);
      imperium_self.endTurn();
    }
    if (action2 == "skip") {
      imperium_self.endTurn();
    }
    return 0;
  });


}


playerAcknowledgeNotice(msg, mycallback) {

  let html = '<div class="sf-readable">' + msg + "</div><ul>";
  html += '<li class="textchoice" id="confirmit">I understand...</li>';
  html += '</ul></p>';

  this.updateStatus(html);

  try {
  $('.textchoice').off();
  $('.textchoice').on('click', function () { mycallback(); });
  } catch (err) {}

  return 0;

}

//
// assign hits to capital ships without triggering events or special abilities
//  -- this is used by special abilities that assign damage outside combat, where they
//  -- cannot be removed by normal factional abilities, etc.
//
 playerAssignHitsCapitalShips(player, sector, total_hits) {

  let imperium_self = this;
  let hits_assigned = 0;
  let maximum_assignable_hits = 0;
  let total_targetted_units = 0;

  let targetted_units = ["destroyer","cruiser","carrier","dreadnaught","warsun","flagship"];

  html = '<div class="sf-readable">You must assign ' + total_hits + ' to your capital ships (if possible):</div><ul>';
  html += '<li class="option" id="assign">continue</li>';
  html += '</ul>';
  this.updateStatus(html);

  $('.option').on('click', function () {

    let action2 = $(this).attr("id");

    if (action2 == "assign") {

      let sys = imperium_self.returnSectorAndPlanets(sector);

      let html = '';
      html += '<div class="sf-readable">Assign <div style="display:inline" id="total_hits_to_assign">' + total_hits + '</div> hits:</div>';
      html += '<ul>';

      for (let i = 0; i < sys.s.units[imperium_self.game.player - 1].length; i++) {
        if (sys.s.units[imperium_self.game.player - 1][i].destroyed == 0 && sys.s.units[imperium_self.game.player - 1][i].strength > 0) {

          let unit = sys.s.units[imperium_self.game.player - 1][i];
          maximum_assignable_hits++;
          if (targetted_units.includes(unit.type)) { total_targetted_units++; }
          html += '<li class="textchoice player_ship_' + i + '" id="' + i + '">' + unit.name;
          if (unit.capacity >= 1) {
	    let fleet = '';
            let fighters = 0;
            let infantry = 0;
            for (let ii = 0; ii < sys.s.units[imperium_self.game.player-1][i].storage.length; ii++) {
              if (sys.s.units[imperium_self.game.player-1][i].storage[ii].type == "infantry") {
                infantry++;
              }
              if (sys.s.units[imperium_self.game.player-1][i].storage[ii].type == "fighter") {
                fighters++;
              }
            }
            if (infantry > 0 || fighters > 0) {
              fleet += ' ';
              if (infantry > 0) { fleet += infantry + "i"; }
              if (fighters > 0) {
                if (infantry > 0) { fleet += ", "; }
                fleet += fighters + "f";
              }
              fleet += ' ';
            }
	    html += fleet;
	  }
          if (unit.strength > 1) {
            maximum_assignable_hits += (unit.strength - 1);
            html += ' <div style="display:inline" id="player_ship_' + i + '_hits">(';
            for (let bb = 1; bb < unit.strength; bb++) { html += '*'; }
            html += ')';
	    html += '</div>'
          }
          html += '</li>';
        }

      }
      html += '</ul>';

      if (maximum_assignable_hits == 0) {
        console.log("ERROR: you had no hits left to assign, bug?");
        imperium_self.endTurn();
        return 0;
      }

      imperium_self.updateStatus(html);

      $('.textchoice').off();
      $('.textchoice').on('click', function () {

        let ship_idx = $(this).attr("id");
        let selected_unit = sys.s.units[imperium_self.game.player - 1][ship_idx];

        if (total_targetted_units > 0) {
          if (!targetted_units.includes(selected_unit.type)) {
            salert("You must first assign hits to the required unit types");
            return;
          } else {
            total_targetted_units--;
          }
        }

        imperium_self.addMove("assign_hit\t" + player + "\t" + player + "\t" + imperium_self.game.player + "\tship\t" + sector + "\t" + ship_idx + "\t0"); // last argument --> player should not assign again 


        total_hits--;
        hits_assigned++;

        $('#total_hits_to_assign').innerHTML = total_hits;

        if (selected_unit.strength > 1) {
          selected_unit.strength--;
          let ship_to_reduce = "#player_ship_" + ship_idx + '_hits';
          let rhtml = '';
          if (selected_unit.strength > 1) {
            html += '(';
            for (let bb = 1; bb < selected_unit.strength; bb++) {
              rhtml += '*';
            }
            rhtml += ')';
          }
          $(ship_to_reduce).html(rhtml);
        } else {
          selected_unit.strength = 0;
          selected_unit.destroyed = 0;
          $(this).remove();
        }

        //
        // we have assigned damage, so make sure sys is updated
        //
        imperium_self.saveSystemAndPlanets(sys);

        if (total_hits == 0 || hits_assigned >= maximum_assignable_hits) {
          imperium_self.updateStatus("Notifying players of hits assignment...");
          imperium_self.endTurn();
          imperium_self.updateStatus("Hits taken...");
        }

      });
    }

  });

console.log("DOne Now");

}



//
// assign hits to my forces
//
 playerAssignHits(attacker, defender, type, sector, details, total_hits, source = "") {

  let imperium_self = this;
  let hits_assigned = 0;
  let maximum_assignable_hits = 0;
  let relevant_action_cards = ["assign_hits"];
  if (details == "pds") { relevant_action_cards = ["post_pds"]; }

  html = '<div class="sf-readable">You must assign ' + total_hits + ' to your fleet:</div><ul>';

  let ac = this.returnPlayerActionCards(imperium_self.game.player, relevant_action_cards);
  if (ac.length > 0) {
    html += '<li class="option" id="assign">continue</li>';
    html += '<li class="option" id="action">play action card</li>';
  } else {
    html += '<li class="option" id="assign">continue</li>';
  }

  let menu_type = "";
  if (details == "pds") { menu_type = "assign_hits_pds"; }
  if (menu_type == "" && type == "space") { menu_type = "assign_hits_space"; }
  if (type == "ground") { menu_type = "assign_hits_ground"; }
  if (type == "anti_fighter_barrage") { menu_type = "assign_hits_anti_fighter_barrage"; }

  let tech_attach_menu_events = 0;
  let tech_attach_menu_triggers = [];
  let tech_attach_menu_index = [];

  let z = this.returnEventObjects();
  for (let i = 0; i < z.length; i++) {
    if (z[i].menuOptionTriggers(this, menu_type, this.game.player) == 1) {
      let x = z[i].menuOption(this, menu_type, this.game.player);
      html += x.html;
      tech_attach_menu_index.push(i);
      tech_attach_menu_triggers.push(x.event);
      tech_attach_menu_events = 1;
    }
  }
  html += '</ul>';

  this.updateStatus(html);

  $('.option').on('click', function () {

    let action2 = $(this).attr("id");

    //
    // respond to tech and factional abilities
    //
    if (tech_attach_menu_events == 1) {
      for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
        if (action2 == tech_attach_menu_triggers[i]) {
          let mytech = this.tech[imperium_self.game.players_info[imperium_self.game.player - 1].tech[tech_attach_menu_index]];
          z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, menu_type, imperium_self.game.player);
        }
      }
    }

    if (action2 == "action") {
      imperium_self.playerSelectActionCard(function (card) {
        imperium_self.addMove(imperium_self.game.state.assign_hits_queue_instruction);
        imperium_self.addMove("action_card_post\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("action_card\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("lose\t" + imperium_self.game.player + "\taction_cards\t1");
        imperium_self.endTurn();
        imperium_self.updateStatus("playing action card before hits assignment");
      }, function () {
        imperium_self.playerAssignHits(attacker, defender, type, sector, details, total_hits, source);
      }, relevant_action_cards);
    }

    if (action2 == "assign") {

      if (imperium_self.game.state.assign_hits_to_cancel > 0) {
        total_hits -= imperium_self.game.state.assign_hits_to_cancel;
        if (total_hits < 0) { total_hits = 0; }
        if (total_hits == 0) {
          imperium_self.updateLog("NOTIFY\t" + imperium_self.returnFactionNickname(imperium_self.game.player) + " does not take any hits");
          imperium_self.endTurn();
          return 0;
        }
      }

      let sys = imperium_self.returnSectorAndPlanets(sector);

      let html = '';
      html += '<div class="sf-readable">Assign <div style="display:inline" id="total_hits_to_assign">' + total_hits + '</div> hits:</div>';
      html += '<ul>';

      let total_targetted_units = 0;
      let targetted_units = imperium_self.game.players_info[imperium_self.game.player - 1].target_units;
      if (type == "anti_fighter_barrage") {
	//
	// overwrite
	//
	targetted_units = [	"fighter", "fighter", "fighter" , "fighter" , "fighter" , 
				"fighter" , "fighter" , "fighter" , "fighter" , "fighter", 
				"fighter" , "fighter" , "fighter" , "fighter" , "fighter", 
				"fighter" , "fighter" , "fighter" , "fighter" , "fighter", 
				"fighter" , "fighter" , "fighter" , "fighter" , "fighter", 
				"fighter" , "fighter" , "fighter" , "fighter" , "fighter", 
				"fighter" , "fighter" , "fighter" , "fighter" , "fighter", 
				"fighter" , "fighter" , "fighter" , "fighter" , "fighter", 
				"fighter" , "fighter" , "fighter" , "fighter" , "fighter", 
				"fighter" , "fighter" , "fighter" , "fighter" , "fighter", 
				"fighter" , "fighter" , "fighter" , "fighter" , "fighter" ];
      }

      for (let i = 0; i < sys.s.units[imperium_self.game.player - 1].length; i++) {
        if (sys.s.units[imperium_self.game.player - 1][i].destroyed == 0 && sys.s.units[imperium_self.game.player - 1][i].strength > 0) {

          console.log("INDEX: " + i + " --- ship: " + sys.s.units[imperium_self.game.player - 1][i].type);

          let unit = sys.s.units[imperium_self.game.player - 1][i];
          maximum_assignable_hits++;
          if (targetted_units.includes(unit.type)) { total_targetted_units++; }
          html += '<li class="textchoice player_ship_' + i + '" id="' + i + '">' + unit.name;
          if (unit.capacity >= 1) {
	    let fleet = '';
            let fighters = 0;
            let infantry = 0;
            for (let ii = 0; ii < sys.s.units[imperium_self.game.player-1][i].storage.length; ii++) {
              if (sys.s.units[imperium_self.game.player-1][i].storage[ii].type == "infantry") {
                infantry++;
              }
              if (sys.s.units[imperium_self.game.player-1][i].storage[ii].type == "fighter") {
                fighters++;
              }
            }
            if (infantry > 0 || fighters > 0) {
              fleet += ' ';
              if (infantry > 0) { fleet += infantry + "i"; }
              if (fighters > 0) {
                if (infantry > 0) { fleet += ", "; }
                fleet += fighters + "f";
              }
              fleet += ' ';
            }
	    html += fleet;
	  }
          if (unit.strength > 1) {
            maximum_assignable_hits += (unit.strength - 1);
            html += ' <div style="display:inline" id="player_ship_' + i + '_hits">(';
            for (let bb = 1; bb < unit.strength; bb++) { html += '*'; }
            html += ')';
	    html += '</div>'
          }
          html += '</li>';
        }

      }
      html += '</ul>';

      if (maximum_assignable_hits == 0) {
        console.log("ERROR: you had no hits left to assign, bug?");
        console.log("SHIPS: " + JSON.stringify(sys.s.units[imperium_self.game.player - 1]));
//        imperium_self.eliminateDestroyedUnitsInSector(imperium_self.game.player, sector);
//        imperium_self.saveSystemAndPlanets(sys);
//        imperium_self.updateSectorGraphics(sector);
        imperium_self.endTurn();
        return 0;
      }

      imperium_self.updateStatus(html);

      $('.textchoice').off();
      $('.textchoice').on('click', function () {

        let ship_idx = $(this).attr("id");
        let selected_unit = sys.s.units[imperium_self.game.player - 1][ship_idx];

        if (total_targetted_units > 0) {
          if (!targetted_units.includes(selected_unit.type)) {
            salert("You must first assign hits to the required unit types");
            return;
          } else {
            total_targetted_units--;
          }
        }

        imperium_self.addMove("assign_hit\t" + attacker + "\t" + defender + "\t" + imperium_self.game.player + "\tship\t" + sector + "\t" + ship_idx + "\t0"); // last argument --> player should not assign again 

        total_hits--;
        hits_assigned++;

        $('#total_hits_to_assign').innerHTML = total_hits;

        if (selected_unit.strength > 1) {
          selected_unit.strength--;
          let ship_to_reduce = "#player_ship_" + ship_idx + '_hits';
          let rhtml = '';
          if (selected_unit.strength > 1) {
            html += '(';
            for (let bb = 1; bb < selected_unit.strength; bb++) {
              rhtml += '*';
            }
            rhtml += ')';
          }
          $(ship_to_reduce).html(rhtml);
        } else {
          selected_unit.strength = 0;
          selected_unit.destroyed = 0;
          $(this).remove();
        }

        //
        // we have assigned damage, so make sure sys is updated
        //
        imperium_self.saveSystemAndPlanets(sys);

        if (total_hits == 0 || hits_assigned >= maximum_assignable_hits) {
          imperium_self.updateStatus("Notifying players of hits assignment...");
          imperium_self.endTurn();
          imperium_self.updateStatus("Hits taken...");
        }

      });
    }

  });
}





//
// destroy units
//
playerDestroyUnits(player, total, sector, capital = 0) {

  let imperium_self = this;
  let total_hits = total;
  let hits_assigned = 0;
  let maximum_assignable_hits = 0;
  let sys = imperium_self.returnSectorAndPlanets(sector);

  html = '<div class="sf-readable">You must destroy ' + total + ' units in sector: ' + imperium_self.game.sectors[sector].name + ':</div><ul>';

  let total_targetted_units = 0;
  let targetted_units = imperium_self.game.players_info[imperium_self.game.player - 1].target_units;

  if (capital == 1) {
    targetted_units = [];
    targetted_units.push("destroyer");
    targetted_units.push("carrier");
    targetted_units.push("destroyer");
    targetted_units.push("cruiser");
    targetted_units.push("dreadnaught");
    targetted_units.push("warsun");
    targetted_units.push("flagship");
  }

  for (let i = 0; i < sys.s.units[imperium_self.game.player - 1].length; i++) {
    let unit = sys.s.units[imperium_self.game.player - 1][i];
    maximum_assignable_hits++;
    if (targetted_units.includes(unit.type)) { total_targetted_units++; }
    html += '<li class="textchoice player_ship_' + i + '" id="' + i + '">' + unit.name + '</li>';
  }
  for (let p = 0; i < sys.p.length; p++) {
    for (let i = 0; i < sys.p[p].units[imperium_self.game.player - 1].length; i++) {
      let unit = sys.p[p].units[imperium_self.game.player - 1][i];
      maximum_assignable_hits++;
      if (targetted_units.includes(unit.type)) { total_targetted_units++; }
      html += '<li class="textchoice player_unit_' + p + '_' + i + '" id="ground_unit_' + p + '_' + i + '">' + unit.name + '</li>';
    }
  }
  html += '</ul>';

  if (maximum_assignable_hits == 0) {
    this.addMove("NOTIFY\t" + this.returnFaction(player) + " has no ships to destroy");
    this.endTurn();
    return 0;
  }


  imperium_self.updateStatus(html);

  $('.textchoice').off();
  $('.textchoice').on('click', function () {


    let ship_idx = $(this).attr("id");
    let planet_idx = 0;
    let unit_idx = 0;
    let unit_type = "ship";

    if (ship_idx.indexOf("_unit_") > 0) {
      unit_type = "ground";
      let tmpk = ship_idx.split("_");
      planet_idx = tmpk[1];
      unit_idx = tmpk[2];

    }

    let selected_unit = null;
    if (unit_type == "ship") {
      selected_unit = sys.s.units[imperium_self.game.player - 1][ship_idx];
    } else {
      selected_unit = sys.p[planet_idx].units[imperium_self.game.player - 1][unit_idx];
    }

    if (total_targetted_units > 0) {
      if (!targetted_units.includes(selected_unit.type)) {
        salert("You must first destroy the required unit types");
        return;
      } else {
        total_targetted_units--;
      }
    }

    if (unit_type == "ship") {
      imperium_self.addMove("destroy_unit\t" + player + "\t" + player + "\t" + "space\t" + sector + "\t" + "0" + "\t" + ship_idx + "\t1");
    } else {
      imperium_self.addMove("destroy_unit\t" + player + "\t" + player + "\t" + "ground\t" + sector + "\t" + planet_idx + "\t" + unit_idx + "\t1");
    }

    selected_unit.strength = 0;;
    selected_unit.destroyed = 0;
    $(this).remove();

    total_hits--;
    hits_assigned++;

    if (total_hits == 0 || hits_assigned >= maximum_assignable_hits) {
      imperium_self.updateStatus("Notifying players of units destroyed...");
      imperium_self.endTurn();
    }

  });
}





//
// destroy ships
//
playerDestroyShips(player, total, sector, capital = 0) {

  let imperium_self = this;
  let total_hits = total;
  let hits_assigned = 0;
  let maximum_assignable_hits = 0;
  let sys = imperium_self.returnSectorAndPlanets(sector);

  html = '<div class="sf-readable">You must destroy ' + total + ' ships in your fleet:</div><ul>';

  let total_targetted_units = 0;
  let targetted_units = imperium_self.game.players_info[imperium_self.game.player - 1].target_units;

  if (capital == 1) {
    targetted_units = [];
    targetted_units.push("destroyer");
    targetted_units.push("carrier");
    targetted_units.push("destroyer");
    targetted_units.push("cruiser");
    targetted_units.push("dreadnaught");
    targetted_units.push("warsun");
    targetted_units.push("flagship");
  }

  for (let i = 0; i < sys.s.units[imperium_self.game.player - 1].length; i++) {
    let unit = sys.s.units[imperium_self.game.player - 1][i];
    maximum_assignable_hits++;
    if (targetted_units.includes(unit.type)) { total_targetted_units++; }
    html += '<li class="textchoice player_ship_' + i + '" id="' + i + '">' + unit.name + '</li>';
  }
  html += '</ul>';

  if (maximum_assignable_hits == 0) {
    this.addMove("NOTIFY\t" + this.returnFaction(player) + " has no ships to destroy");
    this.endTurn();
    return 0;
  }


  imperium_self.updateStatus(html);

  $('.textchoice').off();
  $('.textchoice').on('click', function () {

    let ship_idx = $(this).attr("id");
    let selected_unit = sys.s.units[imperium_self.game.player - 1][ship_idx];

    if (total_targetted_units > 0) {
      if (!targetted_units.includes(selected_unit.type)) {
        salert("You must first destroy the required unit types");
        return;
      } else {
        total_targetted_units--;
      }
    }

    imperium_self.addMove("destroy_unit\t" + player + "\t" + player + "\t" + "space\t" + sector + "\t" + "0" + "\t" + ship_idx + "\t1");

    selected_unit.strength = 0;;
    selected_unit.destroyed = 0;
    $(this).remove();

    total_hits--;
    hits_assigned++;

    if (total_hits == 0 || hits_assigned >= maximum_assignable_hits) {
      imperium_self.updateStatus("Notifying players of hits assignment...");
      imperium_self.endTurn();
    }

  });
}








//
// reaching this implies that the player can choose to fire / not-fire
//
playerPlaySpaceCombat(attacker, defender, sector) {

  let imperium_self = this;
  let sys = this.returnSectorAndPlanets(sector);
  let html = '';
  let relevant_action_cards = ["space_combat"];
  if (this.game.state.space_combat_round > 1) {
    relevant_action_cards.push("space_combat_post");
  }

  let opponent = attacker;
  if (imperium_self.game.player == attacker) { opponent = defender; }

  this.game.state.space_combat_sector = sector;

  html = '<div class="sf-readable"><b>Space Combat: round ' + this.game.state.space_combat_round + ':</b><div class="combat_attacker">' + this.returnFaction(attacker) + '</div><div class="combat_attacker_fleet">' + this.returnPlayerFleetInSector(attacker, sector) + '</div><div class="combat_defender">' + this.returnFaction(defender) + '</div><div class="combat_defender_fleet">' + this.returnPlayerFleetInSector(defender, sector) + '</div><ul>';


console.log("AF: " + this.returnPlayerFleetInSector(attacker, sector));
console.log("DF: " + this.returnPlayerFleetInSector(defender, sector));

  let ac = this.returnPlayerActionCards(this.game.player, relevant_action_cards)
  if (ac.length > 0) {
    html += '<li class="option" id="attack">continue</li>';
    html += '<li class="option" id="action">play action card</li>';
  } else {
    html += '<li class="option" id="attack">continue</li>';
  }

  //
  // can I retreat
  //
  console.log("can " + this.returnFaction(imperium_self.game.player) + " retreat? " + imperium_self.canPlayerRetreat(imperium_self.game.player, attacker, defender, sector));
  if (this.canPlayerRetreat(imperium_self.game.player, attacker, defender, sector)) {
    console.log("can " + this.returnFaction(imperium_self.game.player) + " retreat? " + imperium_self.canPlayerRetreat(imperium_self.game.player, attacker, defender, sector));
    html += '<li class="option" id="retreat">announce retreat</li>';
  }



  let tech_attach_menu_events = 0;
  let tech_attach_menu_triggers = [];
  let tech_attach_menu_index = [];

  let z = this.returnEventObjects();
  for (let i = 0; i < z.length; i++) {
    if (z[i].menuOptionTriggers(this, "space_combat", this.game.player) == 1) {
      let x = z[i].menuOption(this, "space_combat", this.game.player);
      html += x.html;
      tech_attach_menu_index.push(i);
      tech_attach_menu_triggers.push(x.event);
      tech_attach_menu_events = 1;
    }
  }
  html += '</ul>';

  this.updateStatus(html);

  $('.option').on('click', function () {

    let action2 = $(this).attr("id");

    //
    // respond to tech and factional abilities
    //
    if (tech_attach_menu_events == 1) {
      for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
        if (action2 == tech_attach_menu_triggers[i]) {
          $(this).remove();
          z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, "space_combat", imperium_self.game.player);
        }
      }
    }

    if (action2 == "action") {
      imperium_self.playerSelectActionCard(function (card) {
        imperium_self.addMove("action_card_post\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("action_card\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("lose\t" + imperium_self.game.player + "\taction_cards\t1");
        imperium_self.playerPlaySpaceCombat(attacker, defender, sector);
      }, function () {
        imperium_self.playerPlaySpaceCombat(attacker, defender, sector);
      }, relevant_action_cards);
    }

    if (action2 == "attack") {
      // prepend so it happens after the modifiers
      //
      // ships_fire needs to make sure it permits any opponents to fire...
      //
      imperium_self.prependMove("ships_fire\t" + attacker + "\t" + defender + "\t" + sector);
      imperium_self.endTurn();
    }

    if (action2 == "retreat") {
      if (imperium_self.canPlayerRetreat(imperium_self.game.player, attacker, defender, sector)) {
        let retreat_options = imperium_self.returnSectorsWherePlayerCanRetreat(imperium_self.game.player, sector);

        let html = '<div clss="sf-readable">Retreat into which Sector? </div><ul>';
        for (let i = 0; i < retreat_options.length; i++) {
          html += '<li class="option" id="' + i + '">' + sector + '</li>';
        }
        html += '</ul>';

        imperium_self.updateStatus(html);

        $('.option').off();
        $('.option').on('click', function () {

          let opt = $(this).attr("id");
          let retreat_to_sector = retreat_options[opt];

          imperium_self.addMove("retreat\t" + imperium_self.game.player + "\t" + opponent + "\t" + sector + "\t" + retreat_to_sector);
          imperium_self.endTurn();
          return 0;
        });


      } else {
        imperium_self.playerPlaySpaceCombat(attacker, defender, sector);
      }
    }

  });
}




//
// ground combat is over -- provide options for scoring cards, action cards
//
playerRespondToRetreat(player, opponent, from, to) {

  let imperium_self = this;
  let sys = this.returnSectorAndPlanets(to);
  let relevant_action_cards = ["retreat"];
  let ac = this.returnPlayerActionCards(this.game.player, relevant_action_cards);

  if (ac.length == 0) {
    this.playerAcknowledgeNotice("Your opponent has announced a retreat into " + sys.s.sector + " at teh end of this round of combat");
    return;
  }

  let html = '<div class="sf-readable">Your opponent has announced a retreat into ' + sys.s.sector + ' at teh end of this round of combat: </div>';
  html += '<li class="option" option="action">play action card</li>';
  html += '<li class="option" option="permit">permit retreat</li>';

  let tech_attach_menu_events = 0;
  let tech_attach_menu_triggers = [];
  let tech_attach_menu_index = [];

  let z = this.returnEventObjects();
  for (let i = 0; i < z.length; i++) {
    if (z[i].menuOptionTriggers(this, "retreat", this.game.player) == 1) {
      let x = z[i].menuOption(this, "retreat", this.game.player);
      html += x.html;
      tech_attach_menu_index.push(i);
      tech_attach_menu_triggers.push(x.event);
      tech_attach_menu_events = 1;
    }
  }
  html += '</ul>';


  this.updateStatus(html);

  $('.option').off();
  $('.option').on('click', function () {

    let action2 = $(this).attr("id");

    //
    // respond to tech and factional abilities
    //
    if (tech_attach_menu_events == 1) {
      for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
        if (action2 == tech_attach_menu_triggers[i]) {
          $(this).remove();
          z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, "space_combat", imperium_self.game.player);
        }
      }
    }

    if (action2 == "action") {
      imperium_self.playerSelectActionCard(function (card) {
        imperium_self.addMove("action_card_post\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("action_card\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("lose\t" + imperium_self.game.player + "\taction_cards\t1");
        imperium_self.playerRespondToRetreat(player, opponent, from, to);
      }, function () {
        imperium_self.playerRespondToRetreat(player, opponent, from, to);
      }.relevant_action_cards);
    }


    if (action2 == "permit") {
      imperium_self.endTurn();
    }
  });
}






//
// ground combat is over -- provide options for scoring cards, action cards
//
playerPlayGroundCombatOver(player, sector) {

  let imperium_self = this;
  let sys = this.returnSectorAndPlanets(sector);
  let relevant_action_cards = ["ground_combat_victory", "ground_combat_over", "ground_combat_loss"];
  let ac = this.returnPlayerActionCards(this.game.player, relevant_action_cards);

  let html = '';
  let win = 0;

  if (player == sys.p[planet_idx].owner) {
    html = '<div class="sf-readable">Ground Combat is Over (you win): </div><ul>';
    win = 1;
  } else {
    html = '<div class="sf-readable">Space Combat is Over (you lose): </div><ul>';
  }

  if (ac.length > 0) {
    html += '<li class="option" id="ok">acknowledge</li>';
    html += '<li class="option" id="action">action card</li>';
  } else {
    html += '<li class="option" id="ok">acknowledge</li>';
  }

  let tech_attach_menu_events = 0;
  let tech_attach_menu_triggers = [];
  let tech_attach_menu_index = [];

  let z = this.returnEventObjects();
  for (let i = 0; i < z.length; i++) {
    if (z[i].menuOptionTriggers(this, "ground_combat_over", this.game.player) == 1) {
      let x = z[i].menuOption(this, "ground_combat_over", this.game.player);
      html += x.html;
      tech_attach_menu_index.push(i);
      tech_attach_menu_triggers.push(x.event);
      tech_attach_menu_events = 1;
    }
  }
  html += '</ul>';

  this.updateStatus(html);

  $('.option').on('click', function () {

    let action2 = $(this).attr("id");

    //
    // respond to tech and factional abilities
    //
    if (tech_attach_menu_events == 1) {
      for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
        if (action2 == tech_attach_menu_triggers[i]) {
          $(this).remove();
          z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, "space_combat", imperium_self.game.player);
        }
      }
    }

    if (action2 == "action") {
      imperium_self.playerSelectActionCard(function (card) {
        imperium_self.addMove("action_card_post\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("action_card\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("lose\t" + imperium_self.game.player + "\taction_cards\t1");
        imperium_self.playerPlayGroundCombatOver(player, sector, planet_idx);
      }, function () {
        imperium_self.playerPlayGroundCombatOver(player, sector, planet_idx);
      });
    }

    if (action2 === "ok") {
      // prepend so it happens after the modifiers
      //
      // ships_fire needs to make sure it permits any opponents to fire...
      //
      imperium_self.endTurn();
    }

  });
}




//
// space combat is over -- provide options for scoring cards, action cards
//
playerPlaySpaceCombatOver(player, sector) {

  let imperium_self = this;
  let sys = this.returnSectorAndPlanets(sector);
  let relevant_action_cards = ["space_combat_victory", "space_combat_over", "space_combat_loss"];
  let ac = this.returnPlayerActionCards(this.game.player, relevant_action_cards);
  let html = '';
  let win = 0;

  if (this.doesPlayerHaveShipsInSector(player, sector)) {
    html = '<div class="sf-readable">Space Combat is Over (you win): </div><ul>';
    win = 1;
  } else {
    html = '<div class="sf-readable">Space Combat is Over (you lose): </div><ul>';
  }

  if (ac.length > 0) {
    html += '<li class="option" id="ok">acknowledge</li>';
    html += '<li class="option" id="action">action card</li>';
  } else {
    html += '<li class="option" id="ok">acknowledge</li>';
  }

  let tech_attach_menu_events = 0;
  let tech_attach_menu_triggers = [];
  let tech_attach_menu_index = [];

  let z = this.returnEventObjects();
  for (let i = 0; i < z.length; i++) {
    if (z[i].menuOptionTriggers(this, "space_combat_over", this.game.player) == 1) {
      let x = z[i].menuOption(this, "space_combat_over", this.game.player);
      html += x.html;
      tech_attach_menu_index.push(i);
      tech_attach_menu_triggers.push(x.event);
      tech_attach_menu_events = 1;
    }
  }
  html += '</ul>';

  this.updateStatus(html);

  $('.option').on('click', function () {

    let action2 = $(this).attr("id");

    //
    // respond to tech and factional abilities
    //
    if (tech_attach_menu_events == 1) {
      for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
        if (action2 == tech_attach_menu_triggers[i]) {
          $(this).remove();
          z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, "space_combat_over", imperium_self.game.player);
        }
      }
    }

    if (action2 == "action") {
      imperium_self.playerSelectActionCard(function (card) {
        imperium_self.addMove("action_card_post\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("action_card\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("lose\t" + imperium_self.game.player + "\taction_cards\t1");
        imperium_self.playerPlaySpaceCombatOver(player, sector, planet_idx);
      }, function () {
        imperium_self.playerPlaySpaceCombatOver(player, sector, planet_idx);
      });
    }

    if (action2 === "ok") {
      // prepend so it happens after the modifiers
      //
      // ships_fire needs to make sure it permits any opponents to fire...
      //
      imperium_self.endTurn();
    }

  });
}







//
// reaching this implies that the player can choose to fire / not-fire
//
playerPlayGroundCombat(attacker, defender, sector, planet_idx) {

  let imperium_self = this;
  let sys = this.returnSectorAndPlanets(sector);
  let html = '';

  this.game.state.ground_combat_sector = sector;
  this.game.state.ground_combat_planet_idx = planet_idx;


  let attacker_forces = this.returnNumberOfGroundForcesOnPlanet(attacker, sector, planet_idx);
  let defender_forces = this.returnNumberOfGroundForcesOnPlanet(defender, sector, planet_idx);

  if (this.game.player == attacker) {
    html = '<div class="sf-readable">You are invading ' + sys.p[planet_idx].name + ' with ' + attacker_forces + ' infantry. ' + this.returnFaction(defender) + ' has ' + defender_forces + ' infanty remaining. This is round ' + this.game.state.ground_combat_round + ' of ground combat. </div><ul>';
  } else {
    html = '<div class="sf-readable">' + this.returnFaction(attacker) + ' has invaded ' + sys.p[planet_idx].name + ' with ' + attacker_forces + ' infantry. You have ' + defender_forces + ' infantry remaining. This is round ' + this.game.state.ground_combat_round + ' of ground combat. </div><ul>';
  }

  let ac = this.returnPlayerActionCards(this.game.player, ["combat", "ground_combat"])
  if (ac.length > 0) {
    html += '<li class="option" id="attack">continue</li>';
    html += '<li class="option" id="action">play action card</li>';
  } else {
    html += '<li class="option" id="attack">continue</li>';
  }


  let tech_attach_menu_events = 0;
  let tech_attach_menu_triggers = [];
  let tech_attach_menu_index = [];

  let z = this.returnEventObjects();
  for (let i = 0; i < z.length; i++) {
    if (z[i].menuOptionTriggers(this, "ground_combat", this.game.player) == 1) {
      let x = z[i].menuOption(this, "ground_combat", this.game.player);
      html += x.html;
      tech_attach_menu_index.push(i);
      tech_attach_menu_triggers.push(x.event);
      tech_attach_menu_events = 1;
    }
  }
  html += '</ul>';

  this.updateStatus(html);

  $('.option').on('click', function () {

    let action2 = $(this).attr("id");

    //
    // respond to tech and factional abilities
    //
    if (tech_attach_menu_events == 1) {
      for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
        if (action2 == tech_attach_menu_triggers[i]) {
          $(this).remove();
          z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, "ground_combat", imperium_self.game.player);
        }
      }
    }

    if (action2 == "action") {
      imperium_self.playerSelectActionCard(function (card) {
        imperium_self.addMove("action_card_post\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("action_card\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("lose\t" + imperium_self.game.player + "\taction_cards\t1");
        imperium_self.playerPlayGroundCombat(attacker, defender, sector, planet_idx);
      }, function () {
        imperium_self.playerPlayGroundCombat(attacker, defender, sector, planet_idx);
      });
    }

    if (action2 == "attack") {
      // prepend so it happens after the modifiers
      //
      // ships_fire needs to make sure it permits any opponents to fire...
      //
      imperium_self.prependMove("infantry_fire\t" + attacker + "\t" + defender + "\t" + sector + "\t" + planet_idx);
      imperium_self.endTurn();
    }

  });
}







//
// reaching this implies that the player can choose to fire / not-fire
//
playerPlayPDSAttack(player, attacker, sector) {

  let imperium_self = this;
  let html = '';
  let relevant_action_cards = ["pre_pds"];
  let can_target_with_pds_fire = 1;

  let defender = -1;
  let sys = imperium_self.returnSectorAndPlanets(sector);

  for (let i = 0; i < sys.s.units.length; i++) {
    if ((i + 1) != attacker) {
      if (sys.s.units[i].length > 0) {
        defender = (i + 1);
      }
    }
  }

  html = '<div class="sf-readable">Do you wish to fire your PDS before moving into the sector?</div><ul>';

  //
  // skip if attacker is immune
  //
  if (defender != -1) {
    if (imperium_self.game.players_info[defender - 1].temporary_immune_to_pds_fire) {
      html = '<div class="sf-readable">' + imperium_self.returnFaction(defender) + ' cannot be targeted by PDS fire during this invasion:</div><ul>';
      can_target_with_pds_fire = 0;
    }
  } else {
    html = '<div class="sf-readable">You cannot target any ships with PDS fire and must skip firing:</div><ul>';
    can_target_with_pds_fire = 0;
  }


  let ac = this.returnPlayerActionCards(player, relevant_action_cards);
  if (1 == 1) {
    html += '<li class="option" id="skip">skip PDS</li>';
  }
  if (can_target_with_pds_fire == 1) {
    html += '<li class="option" id="fire">fire PDS</li>';
  }
  if (ac.length > 0) {
    html += '<li class="option" id="action">play action card</li>';
  }

  let tech_attach_menu_events = 0;
  let tech_attach_menu_triggers = [];
  let tech_attach_menu_index = [];

  let z = this.returnEventObjects();
  for (let i = 0; i < z.length; i++) {
    if (z[i].menuOptionTriggers(this, "pds", this.game.player) == 1) {
      let x = z[i].menuOption(this, "pds", this.game.player);
      html += x.html;
      tech_attach_menu_index.push(i);
      tech_attach_menu_triggers.push(x.event);
      tech_attach_menu_events = 1;
    }
  }
  html += '</ul>';

  this.updateStatus(html);

  $('.option').on('click', function () {

    let action2 = $(this).attr("id");

    //
    // respond to tech and factional abilities
    //
    if (tech_attach_menu_events == 1) {
      for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
        if (action2 == tech_attach_menu_triggers[i]) {
          $(this).remove();
          z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, "pds", imperium_self.game.player);
        }
      }
    }


    if (action2 == "action") {
      imperium_self.playerSelectActionCard(function (card) {
        imperium_self.addMove("action_card_post\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("action_card\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("lose\t" + imperium_self.game.player + "\taction_cards\t1");
        imperium_self.playerPlayPDSAttack(player, attacker, sector);
      }, function () {
        imperium_self.playerPlayPDSAttack(player, attacker, sector);
      }, relevant_action_cards);
    }

    if (action2 == "skip") {
      imperium_self.endTurn();
    }

    if (action2 == "fire") {
      // prepend so it happens after the modifiers -- defender instead of attacker here
      imperium_self.prependMove("pds_fire\t" + imperium_self.game.player + "\t" + defender + "\t" + sector);
      imperium_self.endTurn();
    };

  });

}


//
// reaching this implies that the player can choose to fire / not-fire
//
playerPlayPDSDefense(player, attacker, sector) {

  let imperium_self = this;
  let html = '';
  let relevant_action_cards = ["pre_pds"];
  let can_target_with_pds_fire = 1;

  html = '<div class="sf-readable">Do you wish to fire your PDS?</div><ul>';

  //
  // skip if attacker is immune
  //
  if (imperium_self.game.players_info[attacker - 1].temporary_immune_to_pds_fire) {
    html = '<div class="sf-readable">Your attacker cannot be targeted by PDS fire during this invasion:</div><ul>';
    can_target_with_pds_fire = 0;
  }


  let ac = this.returnPlayerActionCards(player, relevant_action_cards);
  if (1 == 1) {
    html += '<li class="option" id="skip">skip PDS</li>';
  }
  if (can_target_with_pds_fire == 1) {
    html += '<li class="option" id="fire">fire PDS</li>';
  }
  if (ac.length > 0) {
    html += '<li class="option" id="action">play action card</li>';
  }

  let tech_attach_menu_events = 0;
  let tech_attach_menu_triggers = [];
  let tech_attach_menu_index = [];

  let z = this.returnEventObjects();
  for (let i = 0; i < z.length; i++) {
    if (z[i].menuOptionTriggers(this, "pds", this.game.player) == 1) {
      let x = z[i].menuOption(this, "pds", this.game.player);
      html += x.html;
      tech_attach_menu_index.push(i);
      tech_attach_menu_triggers.push(x.event);
      tech_attach_menu_events = 1;
    }
  }
  html += '</ul>';

  this.updateStatus(html);

  $('.option').on('click', function () {

    let action2 = $(this).attr("id");

    //
    // respond to tech and factional abilities
    //
    if (tech_attach_menu_events == 1) {
      for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
        if (action2 == tech_attach_menu_triggers[i]) {
          $(this).remove();
          z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, "pds", imperium_self.game.player);
        }
      }
    }


    if (action2 == "action") {
      imperium_self.playerSelectActionCard(function (card) {
        imperium_self.addMove("action_card_post\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("action_card\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("lose\t" + imperium_self.game.player + "\taction_cards\t1");
        imperium_self.playerPlayPDSDefense(player, attacker, sector);
      }, function () {
        imperium_self.playerPlayPDSDefense(player, attacker, sector);
      }, relevant_action_cards);
    }

    if (action2 == "skip") {
      imperium_self.endTurn();
    }

    if (action2 == "fire") {
      // prepend so it happens after the modifiers
      imperium_self.prependMove("pds_fire\t" + imperium_self.game.player + "\t" + attacker + "\t" + sector);
      imperium_self.endTurn();
    };

  });

}


//
// reaching this implies that the player can choose to fire / not-fire
//
playerResolveDeadlockedAgenda(agenda, choices) {

  let imperium_self = this;
  let html = '';

  html = '<div class="sf-readable">The agenda has become deadlocked in the Senate. You - the Speaker - must resolve it: </div><ul>';
  for (let i = 0; i < choices.length; i++) {
    html += '<li class="option" id="' + i + '">' + this.returnNameFromIndex(choices[i]) + '</li>';
  }
  html += '</ul>';

  this.updateStatus(html);

  $('.option').off();
  $('.option').on('click', function () {

    let action2 = $(this).attr("id");

    imperium_self.addMove("resolve_agenda\t" + agenda + "\tspeaker\t" + choices[action2]);
    imperium_self.endTurn();
    return 0;

  });
}




//
// reaching this implies that the player can choose to fire / not-fire
//
playerPlayPreAgendaStage(player, agenda, agenda_idx) {

  let imperium_self = this;
  let html = '';
  let relevant_action_cards = ["pre_agenda"];
  let ac = this.returnPlayerActionCards(imperium_self.game.player, relevant_action_cards);

  if (this.doesPlayerHaveRider(imperium_self.game.player)) {
    html = '<div class="sf-readable">With your Rider depending on how the other players vote, your emissaries track the mood in the Senate closely...:</div><ul>';
  } else {
    html = '<div class="sf-readable">As the Senators gather to vote on ' + this.agenda_cards[agenda].name + ', your emissaries nervously tally the votes in their head:</div><ul>';
  }

  if (1 == 1) {
    html += '<li class="option" id="skip">proceed into Senate</li>';
  }
  if (ac.length > 0) {
    html += '<li class="option" id="action">action card</li>';
  }

  let tech_attach_menu_events = 0;
  let tech_attach_menu_triggers = [];
  let tech_attach_menu_index = [];

  let z = this.returnEventObjects();
  for (let i = 0; i < z.length; i++) {
    if (z[i].menuOptionTriggers(this, "pre_agenda", this.game.player) == 1) {
      let x = z[i].menuOption(this, "pre_agenda", this.game.player);
      html += x.html;
      tech_attach_menu_index.push(i);
      tech_attach_menu_triggers.push(x.event);
      tech_attach_menu_events = 1;
    }
  }
  html += '</ul>';

  this.updateStatus(html);

  $('.option').off();
  $('.option').on('click', function () {

    let action2 = $(this).attr("id");

    //
    // respond to tech and factional abilities
    //
    if (tech_attach_menu_events == 1) {
      for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
        if (action2 == tech_attach_menu_triggers[i]) {
          $(this).remove();
          z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, "agenda", imperium_self.game.player);
        }
      }
    }

    if (action2 == "action") {
      imperium_self.playerSelectActionCard(function (card) {
        imperium_self.addMove("action_card_post\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("action_card\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("lose\t" + imperium_self.game.player + "\taction_cards\t1");
        imperium_self.playerPlayPreAgendaStage(player, agenda, agenda_idx);
      }, function () {
        imperium_self.playerPlayPreAgendaStage(player, agenda, agenda_idx);
      }, ["rider"]);
    }

    if (action2 == "skip") {
      imperium_self.endTurn();
    }

  });

}
playerPlayPostAgendaStage(player, agenda, array_of_winning_options) {

  let imperium_self = this;
  let html = '';
  let relevant_action_cards = ["post_agenda"];
  let ac = this.returnPlayerActionCards(imperium_self.game.player, relevant_action_cards);

  if (array_of_winning_options.length > 0) {
    html = '<div class="sf-readable">The Senate has apparently voted for "' + this.returnNameFromIndex(array_of_winning_options[0]) + '". As the Speaker confirms the final tally, you get the feeling the issue may not be fully settled:</div><ul>';
  } else {
    html = '<div class="sf-readable">No-one in the Senate bothered to show-up and vote, leaving the matter to be decided by the Speaker:</div><ul>';
  }
  if (array_of_winning_options.length > 1) {
    html = '<div class="sf-readable">The voting has concluded in deadlock. As you leave the council, you see the Speaker smile and crumple a small note into his pocket:</div><ul>';
  }

  if (1 == 1) {
    html += '<li class="option" id="skip">await results</li>';
  }
  if (ac.length > 0) {
    html += '<li class="option" id="action">action card</li>';
  }

  let tech_attach_menu_events = 0;
  let tech_attach_menu_triggers = [];
  let tech_attach_menu_index = [];

  let z = this.returnEventObjects();
  for (let i = 0; i < z.length; i++) {
    if (z[i].menuOptionTriggers(this, "post_agenda", this.game.player) == 1) {
      let x = z[i].menuOption(this, "post_agenda", this.game.player);
      html += x.html;
      tech_attach_menu_index.push(i);
      tech_attach_menu_triggers.push(x.event);
      tech_attach_menu_events = 1;
    }
  }
  html += '</ul>';

  this.updateStatus(html);

  $('.option').off();
  $('.option').on('click', function () {

    let action2 = $(this).attr("id");

    //
    // respond to tech and factional abilities
    //
    if (tech_attach_menu_events == 1) {
      for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
        if (action2 == tech_attach_menu_triggers[i]) {
          $(this).remove();
          z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, "post_agenda", imperium_self.game.player);
        }
      }
    }

    if (action2 == "action") {
      imperium_self.playerSelectActionCard(function (card) {
        imperium_self.addMove("action_card_post\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("action_card\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("lose\t" + imperium_self.game.player + "\taction_cards\t1");
        imperium_self.playerPlayPostAgendaStage(player, agenda, array_of_winning_options);
      }, function () {
        imperium_self.playerPlayPostAgendaStage(player, agenda, array_of_winning_options);
      }, relevant_action_cards);
    }

    if (action2 == "skip") {
      imperium_self.endTurn();
    }

  });

}



playerContinueTurn(player, sector) {

  let imperium_self = this;
  let options_available = 0;

  if (this.game.tracker.invasion == undefined) { this.game.tracker = this.returnPlayerTurnTracker(); this.game.tracker.activate_system = 1; }

  //
  // check to see if any ships survived....
  //
  let playercol = "player_color_" + this.game.player;
  let html = "<div class='sf-readable'><div class='player_color_box " + playercol + "'></div>" + this.returnFaction(player) + ": </div><ul>";

  if (this.canPlayerScoreActionStageVictoryPoints(player) != "") {
    html += '<li class="option" id="score">score secret objective</li>';
    options_available++;
  }
  if (this.canPlayerProduceInSector(player, sector) && this.game.tracker.production == 0) {
    html += '<li class="option" id="produce">produce units</li>';
    options_available++;
  }
  if (this.canPlayerInvadePlanet(player, sector) && this.game.tracker.invasion == 0) {
    if (sector == "new-byzantium" || sector == "4_4") {
      if ((imperium_self.game.planets['new-byzantium'].owner != -1) || (imperium_self.returnAvailableInfluence(imperium_self.game.player) + imperium_self.game.players_info[imperium_self.game.player - 1].goods) >= 6) {
        html += '<li class="option" id="invade">invade planet</li>';
        options_available++;
      }
    } else {
      html += '<li class="option" id="invade">invade planet</li>';
      options_available++;
    }
  }
  if (this.canPlayerLandInfantry(player, sector) && this.game.tracker.invasion == 0) {
    html += '<li class="option" id="land">reassign infantry</li>';
    options_available++;
  }
  if (this.game.tracker.trade == 0 && this.canPlayerTrade(this.game.player) == 1) {
    html += '<li class="option" id="trade">trade</li>';
  }

  //if (this.canPlayerPlayActionCard(player) && this.game.tracker.action_card == 0) {
  //  html += '<li class="option" id="action">action card</li>';
  //  options_available++;
  //}

  let tech_attach_menu_events = 0;
  let tech_attach_menu_triggers = [];
  let tech_attach_menu_index = [];

  let z = this.returnEventObjects();
  for (let i = 0; i < z.length; i++) {
    if (z[i].menuOptionTriggers(this, "continue", this.game.player) == 1) {
      let x = z[i].menuOption(this, "continue", this.game.player);
      html += x.html;
      tech_attach_menu_index.push(i);
      tech_attach_menu_triggers.push(x.event);
      tech_attach_menu_events = 1;
    }
  }

  html += '<li class="option" id="endturn">end turn</li>';
  html += '</ul>';

  this.updateStatus(html);
  $('.option').on('click', function () {

    let action2 = $(this).attr("id");

    //
    // respond to tech and factional abilities
    //
    if (tech_attach_menu_events == 1) {
      for (let i = 0; i < tech_attach_menu_triggers.length; i++) {
        if (action2 == tech_attach_menu_triggers[i]) {
          $(this).remove();
          z[tech_attach_menu_index[i]].menuOptionActivated(imperium_self, "continue", imperium_self.game.player);
        }
      }
    }

    if (action2 == "endturn") {
      imperium_self.addMove("resolve\tplay");
      imperium_self.addMove("setvar\tstate\t0\tactive_player_moved\t" + "int" + "\t" + "0");
      imperium_self.endTurn();
      return 0;
    }

    if (action2 == "trade") {
      imperium_self.addMove("continue\t" + player + "\t" + sector);
      imperium_self.playerTrade();
      return 0;
    }

    if (action2 == "land") {
      imperium_self.addMove("continue\t" + player + "\t" + sector);
      imperium_self.playerSelectInfantryToLand(sector);
      return 0;
    }

    if (action2 == "produce") {

      //
      // check the fleet supply and NOTIFY users if they are about to surpass it
      //
      let fleet_supply_in_sector = imperium_self.returnSpareFleetSupplyInSector(imperium_self.game.player, sector);
      if (fleet_supply_in_sector <= 1) {
        let notice = "You have no spare fleet supply in this sector. Do you still wish to produce more ships?";
        if (fleet_supply_in_sector == 1) {
          notice = "You have fleet supply for 1 additional capital ship in this sector. Do you still wish to produce more ships?";
        }
        let c = sconfirm(notice);
        if (c) {
          imperium_self.addMove("continue\t" + imperium_self.game.player + "\t" + sector);
          imperium_self.playerProduceUnits(sector);
        }
        return;
      }
      imperium_self.addMove("continue\t" + imperium_self.game.player + "\t" + sector);
      imperium_self.playerProduceUnits(sector);
    }

    if (action2 == "invade") {

      //
      // New Byzantium requires 6 influence to conquer
      //
      if (sector === "new-byzantium" || sector == "4_4") {
        if (imperium_self.game.planets['new-byzantium'].owner == -1) {
          if (imperium_self.returnAvailableInfluence(imperium_self.game.player) >= 6) {
            imperium_self.playerSelectInfluence(6, function (success) {
              imperium_self.game.tracker.invasion = 1;
              imperium_self.playerInvadePlanet(player, sector);
            });
          } else {
            salert("The first conquest of New Byzantium requires spending 6 influence, which you lack.");
            return;
          }
          return;
        }
      }

      imperium_self.game.tracker.invasion = 1;
      imperium_self.playerInvadePlanet(player, sector);
    }

    if (action2 == "action") {
      imperium_self.playerSelectActionCard(function (card) {
        imperium_self.game.tracker.action_card = 1;
        imperium_self.addMove("continue\t" + player + "\t" + sector);
        imperium_self.addMove("action_card_post\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("action_card\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("lose\t" + imperium_self.game.player + "\taction_cards\t1");
        imperium_self.endTurn();
      }, function () {
        imperium_self.playerContinueTurn(player, sector);
        return;
      });
    }



    if (action2 == "score") {
      imperium_self.playerScoreActionStageVictoryPoints(imperium_self, function (imperium_self, vp, objective) {
        imperium_self.addMove("continue\t" + player + "\t" + sector);
        if (vp > 0) { imperium_self.addMove("score\t" + player + "\t" + vp + "\t" + objective); }
        imperium_self.game.players_info[imperium_self.game.player - 1].objectives_scored_this_round.push(objective);
        imperium_self.endTurn();
        return;
      });
    }
  });
}





////////////////
// Production //
////////////////
playerBuyTokens(stage = 0, resolve = 1) {

  let imperium_self = this;

  if (this.returnAvailableInfluence(this.game.player) <= 2) {
    this.updateLog("You skip the initiative secondary, as you lack adequate influence...");
    this.updateStatus("Skipping purchase of tokens as insufficient influence...");
    if (resolve == 1) {
      imperium_self.addMove("resolve\tstrategy\t1\t" + imperium_self.app.wallet.returnPublicKey());
    }
    this.endTurn();
    return 0;
  }

  let html = '<div class="sf-readable">Do you wish to purchase any command or strategy tokens, or increase your fleet supply?</div><ul>';

  if (stage == 2) {
    html = '<div class="sf-readable">Leadership has been played. Do you wish to purchase any additional command or strategy tokens, or increase your fleet supply?</div><ul>';
    if (imperium_self.game.state.round == 1)  {
      html = `The Leadership strategy card has been played. This lets you spend 3 influence to purchase additional command tokens, strategy tokens or fleet supply. Do you wish to purchase any additional tokens: </p><ul>`;
    }
  }

  html += '<li class="buildchoice textchoice" id="skip">Do Not Purchase</li>';
  html += '<li class="buildchoice textchoice" id="command">Command Tokens  +<span class="command_total">0</span></li>';
  html += '<li class="buildchoice textchoice" id="strategy">Strategy Tokens +<span class="strategy_total">0</span></li>';
  html += '<li class="buildchoice textchoice" id="fleet">Fleet Supply  +<span class="fleet_total">0</span></li>';
  html += '</ul></p>';
  html += '';
  html += '<div id="buildcost" class="buildcost"><span class="buildcost_total">0</span> influence</div>';
  html += '<div id="confirm" class="buildchoice">click here to finish</div>';

  this.updateStatus(html);


  let command_tokens = 0;
  let strategy_tokens = 0;
  let fleet_supply = 0;
  let total_cost = 0;

  imperium_self.lockInterface();

  $('.buildchoice').off();
  $('.buildchoice').on('click', function () {

    if (!imperium_self.mayUnlockInterface()) {
      salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
      return;
    }
    imperium_self.unlockInterface();


    let id = $(this).attr("id");

    if (id == "skip") {
      if (resolve == 1) {
        imperium_self.addMove("resolve\tstrategy\t1\t" + imperium_self.app.wallet.returnPublicKey());
      }
      imperium_self.endTurn();
      return;
    }

    if (id == "confirm") {

      total_cost = 3 * (fleet_supply + command_tokens + strategy_tokens);

      if (resolve == 1) {
        imperium_self.addMove("resolve\tstrategy\t1\t" + imperium_self.app.wallet.returnPublicKey());
      }

      imperium_self.playerSelectInfluence(total_cost, function (success) {

        if (success == 1) {
          imperium_self.addMove("purchase\t" + imperium_self.game.player + "\tcommand\t" + command_tokens);
          imperium_self.addMove("purchase\t" + imperium_self.game.player + "\tcommand\t" + strategy_tokens);
          imperium_self.addMove("purchase\t" + imperium_self.game.player + "\tfleetsupply\t" + fleet_supply);
          imperium_self.endTurn();
          return;
        } else {
          imperium_self.endTurn();
        }
      });
    };

    //
    //  figure out if we need to load infantry / fighters
    //
    if (id == "command") { command_tokens++; }
    if (id == "strategy") { strategy_tokens++; }
    if (id == "fleet") { fleet_supply++; }

    let divtotal = "." + id + "_total";
    let x = parseInt($(divtotal).html());
    x++;
    $(divtotal).html(x);

    total_cost = 3 * (command_tokens + strategy_tokens + fleet_supply);
    $('.buildcost_total').html(total_cost);


    let return_to_zero = 0;
    if (total_cost > imperium_self.returnAvailableInfluence(imperium_self.game.player)) {
      salert("You cannot buy more tokens than you have influence available to pay");
      return_to_zero = 1;
    }
    if (return_to_zero == 1) {
      total_cost = 0;
      command_tokens = 0;
      strategy_tokens = 0;
      fleet_supply = 0;
      $('.command_total').html(0);
      $('.strategy_total').html(0);
      $('.fleet_total').html(0);
      return;
    }

  });
}





 playerBuyActionCards(stage = 0, resolve = 1) {

  let imperium_self = this;

  let html = '<div class="sf-readable">Do you wish to spend 1 strategy token to purchase 2 action cards?</div><ul>';
  if (stage == 2) {
    html = '<div class="sf-readable">Politics has been played: do you wish to spend 1 strategy token to purchase 2 action cards?</div><ul>';
    if (imperium_self.game.state.round == 1) {
      html = `${imperium_self.returnFaction(imperium_self.game.player)} has played the Politics strategy card. This lets you to spend 1 strategy token to purchase 2 action cards, which provide special one-time abilities. You have ${imperium_self.game.players_info[imperium_self.game.player-1].strategy_tokens} strategy tokens. Purchase action cards: </p><ul>`;
    }
  }
  html += '<li class="buildchoice textchoice" id="yes">Purchase Action Cards</li>';
  html += '<li class="buildchoice textchoice" id="no">Do Not Purchase Action Cards</li>';
  html += '</ul>';

  this.updateStatus(html);

  imperium_self.lockInterface();

  $('.buildchoice').off();
  $('.buildchoice').on('click', function () {

    if (!imperium_self.mayUnlockInterface()) {
      salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
      return;
    }
    imperium_self.unlockInterface();

    let id = $(this).attr("id");

    if (id == "yes") {

      imperium_self.addMove("resolve\tstrategy\t1\t" + imperium_self.app.wallet.returnPublicKey());
      imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(imperium_self.game.player) + " gets action cards");
      imperium_self.addMove("gain\t" + imperium_self.game.player + "\taction_cards\t2");
      imperium_self.addMove("DEAL\t2\t" + imperium_self.game.player + "\t2");
      imperium_self.addMove("expend\t" + imperium_self.game.player + "\tstrategy\t1");
      imperium_self.endTurn();
      imperium_self.updateStatus("submitted...");
      return;

    } else {

      imperium_self.addMove("resolve\tstrategy\t1\t" + imperium_self.app.wallet.returnPublicKey());
      imperium_self.endTurn();
      imperium_self.updateStatus("submitted...");
      return;

    }
  });

}





playerResearchTechnology(mycallback) {

  let imperium_self = this;
  let html = '<div class="sf-readable">You are eligible to upgrade to the following technologies: </div><ul>';

  for (var i in this.tech) {
    if (this.canPlayerResearchTechnology(i)) {
      html += '<li class="option" id="' + i + '">' + this.tech[i].name + '</li>';
    }
  }
  html += '</ul>';

  this.updateStatus(html);

  imperium_self.lockInterface();

  $('.option').off();
  $('.option').on('mouseenter', function () { let s = $(this).attr("id"); imperium_self.showTechCard(s); });
  $('.option').on('mouseleave', function () { let s = $(this).attr("id"); imperium_self.hideTechCard(s); });
  $('.option').on('click', function () {

    if (!imperium_self.mayUnlockInterface()) {
      salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
      return;
    }
    imperium_self.unlockInterface();

    let i = $(this).attr("id");
    imperium_self.hideTechCard(i);

    //
    // handle prerequisites
    //
    imperium_self.exhaustPlayerResearchTechnologyPrerequisites(i);
    mycallback($(this).attr("id"));

  });

}


//
// return string if YES, empty string if NO
//
canPlayerScoreActionStageVictoryPoints(player) {

  let imperium_self = this;
  let html = "";

  //
  // Secret Objectives - Action Phase
  //
  for (let i = 0; i < imperium_self.game.deck[5].hand.length; i++) {
    if (!imperium_self.game.players_info[imperium_self.game.player - 1].objectives_scored.includes(imperium_self.game.deck[5].hand[i])) {
      if (imperium_self.canPlayerScoreVictoryPoints(imperium_self.game.player, imperium_self.game.deck[5].hand[i], 3)) {
        if (imperium_self.secret_objectives[imperium_self.game.deck[5].hand[i]].phase === "action") {
          html += '<li class="option secret3" id="' + imperium_self.game.deck[5].hand[i] + '">' + imperium_self.secret_objectives[imperium_self.game.deck[5].hand[i]].name + '</li>';
        }
      }
    }
  }

  return html;

}




playerScoreActionStageVictoryPoints(imperium_self, mycallback, stage = 0) {

  let html = '';
  let player = imperium_self.game.player;

  html += '<div class="sf-readable">Do you wish to score a secret objective? </div><ul>';

  html += this.canPlayerScoreActionStageVictoryPoints(player);
  html += '<li class="option cancel" id="cancel">cancel</li>';
  html += '</ul>';

  imperium_self.updateStatus(html);
  imperium_self.lockInterface();

  $('.option').off();
  $('.option').on('click', function () {

    if (!imperium_self.mayUnlockInterface()) {
      salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
      return;
    }
    imperium_self.unlockInterface();

    let action = $(this).attr("id");
    let objective_type = 3;

    if ($(this).hasClass("stage1")) { objective_type = 1; }
    if ($(this).hasClass("stage2")) { objective_type = 2; }
    if ($(this).hasClass("secret3")) { objective_type = 3; }

    if (action === "no") {
      mycallback(imperium_self, 0, "");

    } else {

      let objective = action;
      let vp = 1;
      if (imperium_self.secret_objectives[objective]) {
        if (imperium_self.secret_objectives[objective].vp > 1) { vp = imperium_self.stage_ii_objectives[objective].vp; }
      }

      mycallback(imperium_self, vp, objective);

    }
  });
}



canPlayerScoreVictoryPoints(player, card = "", deck = 1) {

  if (card == "") { return 0; }

  let imperium_self = this;

  // deck 1 = primary
  // deck 2 = secondary
  // deck 3 = secret

  if (deck == 1) {
    let objectives = this.returnStageIPublicObjectives();
    if (objectives[card] != "") {
      if (objectives[card].canPlayerScoreVictoryPoints(imperium_self, player) == 1) { return 1; }
    }
  }

  if (deck == 2) {
    let objectives = this.returnStageIIPublicObjectives();
    if (objectives[card] != "") {
      if (objectives[card].canPlayerScoreVictoryPoints(imperium_self, player) == 1) { return 1; }
    }
  }

  if (deck == 3) {
    let objectives = this.returnSecretObjectives();
    if (objectives[card] != "") {
      if (objectives[card].canPlayerScoreVictoryPoints(imperium_self, player) == 1) { return 1; }
    }
  }

  return 0;

}




playerScoreSecretObjective(imperium_self, mycallback, stage = 0) {

  let html = '';
  let can_score = 0;

  html += '<div class="sf-readable">Do you wish to score any Secret Objectives? </div><ul>';

  // Secret Objectives
  for (let i = 0; i < imperium_self.game.deck[5].hand.length; i++) {
    if (!imperium_self.game.players_info[imperium_self.game.player - 1].objectives_scored.includes(imperium_self.game.deck[5].hand[i])) {
      if (imperium_self.canPlayerScoreVictoryPoints(imperium_self.game.player, imperium_self.game.deck[5].hand[i], 3)) {
        if (!imperium_self.game.players_info[imperium_self.game.player - 1].objectives_scored_this_round.includes(imperium_self.game.deck[5].hand[i])) {
          can_score = 1;
          html += '1 VP Secret Objective: <li class="option secret3" id="' + imperium_self.game.deck[5].hand[i] + '">' + imperium_self.game.deck[5].cards[imperium_self.game.deck[5].hand[i]].name + '</li>';
        }
      }
    }
  }

  html += '<li class="option" id="no">I choose not to score...</li>';
  html += '</ul>';

  imperium_self.updateStatus(html);

  imperium_self.lockInterface();

  $('.option').off();
  $('.option').on('click', function () {

    if (!imperium_self.mayUnlockInterface()) {
      salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
      return;
    }
    imperium_self.unlockInterface();

    let action = $(this).attr("id");
    if (action == "no") {
      mycallback(imperium_self, 0, "");
    } else {
      let objective = action;
      let vp = 1;
      if (imperium_self.secret_objectives[objective]) {
        if (imperium_self.secret_objectives[objective].vp > 1) { vp = imperium_self.secret_objectives[objective].vp; }
      }
      mycallback(imperium_self, vp, objective);
    }
  });
}


playerScoreVictoryPoints(imperium_self, mycallback, stage = 0) {

  let html = '';
  html += '<div class="sf-readable">Do you wish to score any victory points? </div><ul>';

  // Stage I Public Objectives
  for (let i = 0; i < imperium_self.game.state.stage_i_objectives.length; i++) {

    if (!imperium_self.game.players_info[imperium_self.game.player - 1].objectives_scored.includes(imperium_self.game.state.stage_i_objectives[i])) {
      if (imperium_self.canPlayerScoreVictoryPoints(imperium_self.game.player, imperium_self.game.state.stage_i_objectives[i], 1)) {
        if (!imperium_self.game.players_info[imperium_self.game.player - 1].objectives_scored_this_round.includes(imperium_self.game.state.stage_i_objectives[i])) {
          html += '1 VP Public Objective: <li class="option stage1" id="' + imperium_self.game.state.stage_i_objectives[i] + '">' + imperium_self.game.deck[3].cards[imperium_self.game.state.stage_i_objectives[i]].name + '</li>';
        }
      }
    }
  }

  // Stage II Public Objectives
  for (let i = 0; i < imperium_self.game.state.stage_ii_objectives.length; i++) {
    if (!imperium_self.game.players_info[imperium_self.game.player - 1].objectives_scored.includes(imperium_self.game.state.stage_ii_objectives[i])) {
      if (imperium_self.canPlayerScoreVictoryPoints(imperium_self.game.player, imperium_self.game.state.stage_ii_objectives[i], 2)) {
        if (!imperium_self.game.players_info[imperium_self.game.player - 1].objectives_scored_this_round.includes(imperium_self.game.state.stage_ii_objectives[i])) {
          html += '2 VP Public Objective: <li class="option stage2" id="' + imperium_self.game.state.stage_ii_objectives[i] + '">' + imperium_self.game.deck[4].cards[imperium_self.game.state.stage_ii_objectives[i]].name + '</li>';
        }
      }
    }
  }

  /***
      // Secret Objectives
      for (let i = 0 ; i < imperium_self.game.deck[5].hand.length; i++) {
        if (!imperium_self.game.players_info[imperium_self.game.player-1].objectives_scored.includes(imperium_self.game.deck[5].hand[i])) {
          if (imperium_self.canPlayerScoreVictoryPoints(imperium_self.game.player, imperium_self.game.deck[5].hand[i], 3)) {
        if (!imperium_self.game.players_info[imperium_self.game.player-1].objectives_scored_this_round.includes(imperium_self.game.deck[5].hand[i])) {
              html += '1 VP Secret Objective: <li class="option secret3" id="'+imperium_self.game.deck[5].hand[i]+'">'+imperium_self.game.deck[5].cards[imperium_self.game.deck[5].hand[i]].name+'</li>';
            }
          }
        }
      }
  ***/

  html += '<li class="option" id="no">I choose not to score...</li>';
  html += '</ul>';

  imperium_self.updateStatus(html);
  imperium_self.lockInterface();

  $('.option').off();
  $('.option').on('click', function () {

    if (!imperium_self.mayUnlockInterface()) {
      salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
      return;
    }
    imperium_self.unlockInterface();

    let action = $(this).attr("id");
    let objective_type = 3;

    if ($(this).hasClass("stage1")) { objective_type = 1; }
    if ($(this).hasClass("stage2")) { objective_type = 2; }
    if ($(this).hasClass("secret3")) { objective_type = 3; }

    if (action === "no") {
      mycallback(imperium_self, 0, "");

    } else {

      let objective = action;
      let vp = 1;
      if (imperium_self.stage_ii_objectives[objective]) {
        if (imperium_self.stage_ii_objectives[objective].vp > 1) { vp = imperium_self.stage_ii_objectives[objective].vp; }
      }

      mycallback(imperium_self, vp, objective);

    }
  });
}




 playerBuildInfrastructure(mycallback, stage = 1) {

  let imperium_self = this;

  let html = '';

  if (stage == 1) { html += "<div class='sf-readable'>Which would you like to build: </div><ul>"; }
  else { html += "<div class='sf_readable'>You may also build an additional PDS: </div><ul>"; }

  html += '<li class="buildchoice" id="pds">Planetary Defense System</li>';
  if (stage == 1) {
    html += '<li class="buildchoice" id="spacedock">Space Dock</li>';
  }
  html += '</ul>';

  this.updateStatus(html);

  let stuff_to_build = [];

  imperium_self.lockInterface();

  $('.buildchoice').off();
  $('.buildchoice').on('mouseenter', function () { let s = $(this).attr("id"); imperium_self.showUnit(s); });
  $('.buildchoice').on('mouseleave', function () { let s = $(this).attr("id"); imperium_self.hideUnit(s); });
  $('.buildchoice').on('click', function () {

    if (!imperium_self.mayUnlockInterface()) {
      salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
      return;
    }
    imperium_self.unlockInterface();
    $('.buildchoice').off();

    let id = $(this).attr("id");

    imperium_self.playerSelectPlanetWithFilter(
      "Select a planet on which to build: ",
      function (planet) {
        let existing_units = 0;
        if (imperium_self.game.planets[planet].owner == imperium_self.game.player) {
          for (let i = 0; i < imperium_self.game.planets[planet].units[imperium_self.game.player - 1].length; i++) {
            if (imperium_self.game.planets[planet].units[imperium_self.game.player - 1][i].type == id) {
              existing_units++;
            }
          }
          if (id === "pds") {
            if (existing_units >= imperium_self.game.state_pds_limit_per_planet) { return 0; }
          }
          if (id === "spacedock") {
            if (existing_units >= 1) { return 0; }
          }
          return 1;
        }
        return 0;
      },
      function (planet) {
        if (id == "pds") {
          imperium_self.addMove("produce\t" + imperium_self.game.player + "\t" + 1 + "\t" + imperium_self.game.planets[planet].idx + "\tpds\t" + imperium_self.game.planets[planet].sector);
          mycallback(imperium_self.game.planets[planet].sector);
        }
        if (id == "spacedock") {
          imperium_self.addMove("produce\t" + imperium_self.game.player + "\t" + 1 + "\t" + imperium_self.game.planets[planet].idx + "\tspacedock\t" + imperium_self.game.planets[planet].sector);
          mycallback(imperium_self.game.planets[planet].sector);
        }
      },
      function() {
        imperium_self.unlockInterface();
        imperium_self.playerBuildInfrastructure(mycallback, stage);
      },
    );
  });

}


 playerProduceUnits(sector, production_limit = 0, cost_limit = 0, stage = 0, warfare = 0) {

  let imperium_self = this;

  let player_fleet = this.returnPlayerFleet(imperium_self.game.player);
  let player_build = {};
  player_build.infantry = 0;
  player_build.fighters = 0;
  player_build.carriers = 0;
  player_build.cruisers = 0;
  player_build.dreadnaughts = 0;
  player_build.destroyers = 0;
  player_build.flagships = 0;
  player_build.warsuns = 0;

  //
  // determine production_limit from sector
  //
  let sys = this.returnSectorAndPlanets(sector);
  let available_resources = imperium_self.returnAvailableResources(imperium_self.game.player);
  available_resources += imperium_self.game.players_info[imperium_self.game.player - 1].production_bonus;

  let calculated_production_limit = 0;
  for (let i = 0; i < sys.s.units[this.game.player - 1].length; i++) {
    calculated_production_limit += sys.s.units[this.game.player - 1][i].production;
  }
  for (let p = 0; p < sys.p.length; p++) {
    for (let i = 0; i < sys.p[p].units[this.game.player - 1].length; i++) {
      calculated_production_limit += sys.p[p].units[this.game.player - 1][i].production;
      if (sys.p[p].units[this.game.player - 1][i].type === "spacedock") {
        calculated_production_limit += sys.p[p].resources;
      }
    }
  }

  if (this.game.players_info[this.game.player - 1].may_player_produce_without_spacedock == 1) {
    if (production_limit == 0 && this.game.players_info[this.game.player - 1].may_player_produce_without_spacedock_production_limit >= 0) { production_limit = this.game.players_info[this.game.player - 1].may_player_produce_without_spacedock_production_limit; }
    if (cost_limit == 0 && this.game.players_info[this.game.player - 1].may_player_produce_without_spacedock_cost_limit >= 0) { cost_limit = this.game.players_info[this.game.player - 1].may_player_produce_without_spacedock_cost_limit; }
  };

  if (calculated_production_limit > production_limit) { production_limit = calculated_production_limit; }


  let html = '<div class="sf-readable">Produce Units in this Sector: ';
  if (production_limit != 0) { html += '(' + production_limit + ' units max)'; }
  if (cost_limit != 0) { html += '(' + cost_limit + ' cost max)'; }
  html += '</div><ul>';
  if (available_resources >= 1) {
    html += '<li class="buildchoice" id="infantry">Infantry - <span class="infantry_total">0</span></li>';
  }
  if (available_resources >= 1) {
    html += '<li class="buildchoice" id="fighter">Fighter - <span class="fighter_total">0</span></li>';
  }
  if (available_resources >= 1) {
    html += '<li class="buildchoice" id="destroyer">Destroyer - <span class="destroyer_total">0</span></li>';
  }
  if (available_resources >= 3) {
    html += '<li class="buildchoice" id="carrier">Carrier - <span class="carrier_total">0</span></li>';
  }
  if (available_resources >= 2) {
    html += '<li class="buildchoice" id="cruiser">Cruiser - <span class="cruiser_total">0</span></li>';
  }
  if (available_resources >= 4) {
    html += '<li class="buildchoice" id="dreadnaught">Dreadnaught - <span class="dreadnaught_total">0</span></li>';
  }
  if (available_resources >= 8 && this.canPlayerProduceFlagship(imperium_self.game.player)) {
    html += '<li class="buildchoice" id="flagship">Flagship - <span class="flagship_total">0</span></li>';
  }
  if (imperium_self.game.players_info[imperium_self.game.player - 1].may_produce_warsuns == 1) {
    if (available_resources >= 8) {
      html += '<li class="buildchoice" id="warsun">War Sun - <span class="warsun_total">0</span></li>';
    }
  }
  html += '</ul>';
  html += '</p>';
  html += '<div id="buildcost" class="buildcost"><span class="buildcost_total">0 resources</span></div>';
  html += '<div id="confirm" class="buildchoice">click here to build</div>';

  this.updateStatus(html);

  let stuff_to_build = [];

  imperium_self.lockInterface();

  $('.buildchoice').off();
  $('.buildchoice').on('mouseenter', function () { let s = $(this).attr("id"); imperium_self.showUnit(s); });
  $('.buildchoice').on('mouseleave', function () { let s = $(this).attr("id"); imperium_self.hideUnit(s); });
  $('.buildchoice').on('click', function () {

    if (!imperium_self.mayUnlockInterface()) {
      salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
      return;
    }
    imperium_self.unlockInterface();


    let id = $(this).attr("id");

    //
    // submit when done
    //
    if (id == "confirm") {

      $('.buildchoice').off();

      let total_cost = 0;
      for (let i = 0; i < stuff_to_build.length; i++) {
        total_cost += imperium_self.returnUnitCost(stuff_to_build[i], imperium_self.game.player);
      }

      if (imperium_self.game.players_info[imperium_self.game.player - 1].production_bonus > 0) {
        total_cost -= imperium_self.game.players_info[imperium_self.game.player - 1].production_bonus;
      }

      if (warfare == 0) {
        imperium_self.addMove("resolve\tplay");
        imperium_self.addMove("continue\t" + imperium_self.game.player + "\t" + sector);
      } else {
        imperium_self.addMove("resolve\tstrategy\t1\t" + imperium_self.app.wallet.returnPublicKey());
        imperium_self.addMove("expend\t" + imperium_self.game.player + "\tstrategy\t1");
      }

      imperium_self.playerSelectResources(total_cost, function (success) {

        if (success == 1) {
          for (let y = 0; y < stuff_to_build.length; y++) {
            let planet_idx = imperium_self.returnPlayersLeastDefendedPlanetInSector(imperium_self.game.player, sector);
            if (stuff_to_build[y] != "infantry") { planet_idx = -1; }
            imperium_self.addMove("produce\t" + imperium_self.game.player + "\t" + 1 + "\t" + planet_idx + "\t" + stuff_to_build[y] + "\t" + sector);
            imperium_self.addMove("setvar"+"\t"+"state"+"\t"+"0"+"\t"+"active_player_has_produced"+"\t"+1)
            imperium_self.game.tracker.production = 1;
          }
          imperium_self.endTurn();
          return;
        } else {
          salert("failure to find appropriate influence");
        }
      });

      return;
    };


    let calculated_total_cost = 0;
    for (let i = 0; i < stuff_to_build.length; i++) {
      calculated_total_cost += imperium_self.returnUnitCost(stuff_to_build[i], imperium_self.game.player);
    }
    calculated_total_cost += imperium_self.returnUnitCost(id, imperium_self.game.player);

    //
    // reduce production costs if needed
    //
    if (imperium_self.game.players_info[imperium_self.game.player - 1].production_bonus > 0) {
      calculated_total_cost -= imperium_self.game.players_info[imperium_self.game.player - 1].production_bonus;
    }




    //
    // respect production / cost limits
    //
    let return_to_zero = 0;
    if (id == "fighter" && (player_build.fighters + player_fleet.fighters) > imperium_self.game.players_info[imperium_self.game.player - 1].fighter_limit) {
      salert("You can only have " + imperium_self.game.players_info[imperium_self.game.player - 1].fighter_limit + " fighters on the board");
      return_to_zero = 1;
    }
    if (id == "infantry" && (player_build.infantry + player_fleet.infantry) > imperium_self.game.players_info[imperium_self.game.player - 1].infantry_limit) {
      salert("You can only have " + imperium_self.game.players_info[imperium_self.game.player - 1].infantry_limit + " infantry on the board");
      return_to_zero = 1;
    }
    if (id == "destroyer" && (player_build.destroyers + player_fleet.destroyers) > imperium_self.game.players_info[imperium_self.game.player - 1].destroyer_limit) {
      salert("You can only have " + imperium_self.game.players_info[imperium_self.game.player - 1].destroyer_limit + " destroyers on the board");
      return_to_zero = 1;
    }
    if (id == "carrier" && (player_build.carriers + player_fleet.carriers) > imperium_self.game.players_info[imperium_self.game.player - 1].carrier_limit) {
      salert("You can only have " + imperium_self.game.players_info[imperium_self.game.player - 1].carrier_limit + " carriers on the board");
      return_to_zero = 1;
    }
    if (id == "cruiser" && (player_build.cruisers + player_fleet.cruisers) > imperium_self.game.players_info[imperium_self.game.player - 1].cruiser_limit) {
      salert("You can only have " + imperium_self.game.players_info[imperium_self.game.player - 1].cruiser_limit + " cruisers on the board");
      return_to_zero = 1;
    }
    if (id == "dreadnaught" && (player_build.dreadnaughts + player_fleet.dreadnaughts) > imperium_self.game.players_info[imperium_self.game.player - 1].dreadnaught_limit) {
      salert("You can only have " + imperium_self.game.players_info[imperium_self.game.player - 1].dreadnaught_limit + " dreadnaughts on the board");
      return_to_zero = 1;
    }
    if (id == "flagship" && (player_build.flagships + player_fleet.flagships) > imperium_self.game.players_info[imperium_self.game.player - 1].flagships_limit) {
      salert("You can only have " + imperium_self.game.players_info[imperium_self.game.player - 1].flagship_limit + " flagships on the board");
      return_to_zero = 1;
    }
    if (id == "warsun" && (player_build.warsuns + player_fleet.warsuns) > imperium_self.game.players_info[imperium_self.game.player - 1].warsun_limit) {
      salert("You can only have " + imperium_self.game.players_info[imperium_self.game.player - 1].warsun_limit + " warsuns on the board");
      return_to_zero = 1;
    }
    if (calculated_total_cost > imperium_self.returnAvailableResources(imperium_self.game.player)) {
      salert("You cannot build more than you have available to pay for it.");
      return_to_zero = 1;
    }
    if (production_limit < stuff_to_build.length && production_limit > 0) {
      salert("You cannot build more units than your production limit");
      return_to_zero = 1;
    }
    if (cost_limit < calculated_total_cost && cost_limit > 0) {
      salert("You cannot build units that cost more than your cost limit");
      return_to_zero = 1;
    }
    if ((stuff_to_build.length + 1) > calculated_production_limit) {
      salert("You cannot build more units than your production limit");
      return_to_zero = 1;
    }
    if (return_to_zero == 1) {
      stuff_to_build = [];
      $('.infantry_total').html(0);
      $('.fighter_total').html(0);
      $('.destroyer_total').html(0);
      $('.carrier_total').html(0);
      $('.cruiser_total').html(0);
      $('.dreadnaught_total').html(0);
      $('.flagship_total').html(0);
      $('.warsun_total').html(0);
      player_build = {};
      player_build.infantry = 0;
      player_build.fighters = 0;
      player_build.carriers = 0;
      player_build.cruisers = 0;
      player_build.dreadnaughts = 0;
      player_build.destroyers = 0;
      player_build.flagships = 0;
      player_build.warsuns = 0;
      return;
    }

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

    //
    // reduce production costs if needed
    //
    if (imperium_self.game.players_info[imperium_self.game.player - 1].production_bonus > 0) {
      total_cost -= imperium_self.game.players_info[imperium_self.game.player - 1].production_bonus;
      imperium_self.updateLog("Production Costs reduced by 1");
    }

    let resourcetxt = " resources";
    if (total_cost == 1) { resourcetxt = " resource"; }
    $('.buildcost_total').html(total_cost + resourcetxt);

  });

}


playerHandleTradeOffer(faction_offering, their_offer, my_offer, offer_log) {

  let imperium_self = this;

  let goods_offered = 0;
  let goods_received = 0;
  let promissaries_offered = "";
  let promissaries_received = "";

  if (their_offer.promissaries) {
    if (their_offer.promissaries.length > 0) {
      for (let i = 0; i < their_offer.promissaries.length; i++) {
        let pm = their_offer.promissaries[i].promissary;
	let tmpar = pm.split("-");
        let faction_promissary_owner = imperium_self.factions[tmpar[0]].name;
        if (i > 0) { promissaries_received += ', '; }
        promissaries_received += `${faction_promissary_owner} - ${imperium_self.promissary_notes[tmpar[1]].name}`;	
      }
    }
  }

  if (my_offer.promissaries) {
    if (my_offer.promissaries.length > 0) {
      for (let i = 0; i < my_offer.promissaries.length; i++) {
        let pm = my_offer.promissaries[i].promissary;
	let tmpar = pm.split("-");
        let faction_promissary_owner = imperium_self.factions[tmpar[0]].name;
        if (i > 0) { promissaries_offered += ', '; }
        promissaries_offered += `${faction_promissary_owner} - ${imperium_self.promissary_notes[tmpar[1]].name}`;	
      }
    }
  }

  let html = '<div class="sf-readable">You have received a trade offer from ' + imperium_self.returnFaction(faction_offering) + '. ';
  html += 'They offer ' + offer_log;
  html += ': </div><ul>';
  html += `  <li class="option" id="yes">accept trade</li>`;
  html += `  <li class="option" id="no">refuse trade</li>`;
  html += '</ul>';

  imperium_self.updateStatus(html);


  $('.option').off();
  $('.option').on('click', function () {

    let action = $(this).attr("id");

    if (action == "no") {
      imperium_self.addMove("refuse_offer\t" + imperium_self.game.player + "\t" + faction_offering);
      imperium_self.endTurn();
      return 0;
    }

    if (action == "yes") {
      imperium_self.addMove("trade\t" + faction_offering + "\t" + imperium_self.game.player + "\t" + JSON.stringify(their_offer) + "\t" + JSON.stringify(my_offer));
      imperium_self.endTurn();
      return 0;
    }

  });


}


  playerTrade() {

    let imperium_self = this;
    let factions = this.returnFactions();

    let offer_selected = 0;
    let receive_selected = 0;
    let offer_promissaries = [];
    let receive_promissaries = [];
    let max_offer = 0;
    let max_receipt = 0;


    let goodsTradeInterface = function (imperium_self, player, mainTradeInterface, goodsTradeInterface, promissaryTradeInterface) {

      let receive_promissary_text = 'no promissaries';
      for (let i = 0; i < receive_promissaries.length; i++) {
        if (i == 0) { receive_promissary_text = ''; }
        let pm = receive_promissaries[i];
	let tmpar = pm.promissary.split("-");
        let faction_promissary_owner = imperium_self.factions[tmpar[0]].name;
	if (i > 0) { receive_promissary_text += ', '; }
        receive_promissary_text += `${faction_promissary_owner} - ${imperium_self.promissary_notes[tmpar[1]].name}`;	
      }

      let offer_promissary_text = 'no promissaries';
      for (let i = 0; i < offer_promissaries.length; i++) {
        if (i == 0) { offer_promissary_text = ''; }
        let pm = offer_promissaries[i];
	let tmpar = pm.promissary.split("-");
        let faction_promissary_owner = imperium_self.factions[tmpar[0]].name;
	if (i > 0) { offer_promissary_text += ', '; }
        offer_promissary_text += `${faction_promissary_owner} - ${imperium_self.promissary_notes[tmpar[1]].name}`;	
      }

      let html = "<div class='sf-readable'>Make an Offer: </div><ul>";
      html += '<li id="to_offer" class="option">you give <span class="offer_total">'+offer_selected+'</span> commodities/goods</li>';
      html += '<li id="to_receive" class="option">you receive <span class="receive_total">'+receive_selected+'</span> trade goods</li>';
      html += '<li id="promissary_offer" class="option">you give <span class="give_promissary">'+offer_promissary_text+'</span></li>';
      html += '<li id="promissary_receive" class="option">you receive <span class="receive_promissary">'+receive_promissary_text+'</span></li>';
      html += '<li id="confirm" class="option">submit offer</li>';
      html += '</ul>';

      imperium_self.updateStatus(html);

      $('.option').off();
      $('.option').on('click', function () {

        let selected = $(this).attr("id");

        if (selected == "to_offer") { offer_selected++; if (offer_selected > max_offer) { offer_selected = 0; } }
        if (selected == "to_receive") { receive_selected++; if (receive_selected > max_receipt) { receive_selected = 0; } }

	if (selected == "promissary_offer") {
	  promissaryTradeInterface(imperium_self, player, 1, mainTradeInterface, goodsTradeInterface, promissaryTradeInterface);
	  return;
	}
	if (selected == "promissary_receive") {
	  promissaryTradeInterface(imperium_self, player, 2, mainTradeInterface, goodsTradeInterface, promissaryTradeInterface);
	  return;
	}

        if (selected == "confirm") {

          let my_offer = {};
          my_offer.goods = $('.offer_total').html();
	  my_offer.promissaries = offer_promissaries;
          let my_receive = {};
          my_receive.goods = $('.receive_total').html();
	  my_receive.promissaries = receive_promissaries;

          imperium_self.addMove("offer\t" + imperium_self.game.player + "\t" + player + "\t" + JSON.stringify(my_offer) + "\t" + JSON.stringify(my_receive));
          imperium_self.updateStatus("trade offer submitted");
          imperium_self.endTurn();

        }

        $('.offer_total').html(offer_selected);
        $('.receive_total').html(receive_selected);

      });
    }
    //
    // mode = 1 // offer
	      2 // receive
    //
    let promissaryTradeInterface = function (imperium_self, player, mode, mainTradeInterface, goodsTradeInterface, promissaryTradeInterface) {

      // offer mine to them
      if (mode == 1) {

        let html = '<div class="sf-readable">Add Promissary to YOUR Offer: </div><ul>';
        for (let i = 0; i < imperium_self.game.players_info[imperium_self.game.player-1].promissary_notes.length; i++) {

	  let pm = imperium_self.game.players_info[imperium_self.game.player-1].promissary_notes[i];
	  let tmpar = pm.split("-");
          let faction_promissary_owner = imperium_self.factions[tmpar[0]].name;
	  let already_offered = 0;
	  for (let b = 0; b < offer_promissaries.length; b++) {
	    if (offer_promissaries[b].promissary === pm) {
	      already_offered = 1;
	    }
	  }
	  if (already_offered == 0) {
            html += `  <li class="option" id="${i}">${faction_promissary_owner} - ${imperium_self.promissary_notes[tmpar[1]].name}</li>`;
          }
        }
        html += `  <li class="option" id="cancel">cancel</li>`;

	imperium_self.updateStatus(html);
        $('.option').off();
        $('.option').on('click', function () {

          let prom = $(this).attr("id");

          if (prom == "cancel") {
            goodsTradeInterface(imperium_self, player, mainTradeInterface, goodsTradeInterface, promissaryTradeInterface);
            return 0;
          }
	  
	  let promobj = { player : imperium_self.game.player , promissary : imperium_self.game.players_info[imperium_self.game.player-1].promissary_notes[prom] }
	  offer_promissaries.push(promobj);
          goodsTradeInterface(imperium_self, player, mainTradeInterface, goodsTradeInterface, promissaryTradeInterface);
	  return;

	});
      }



      // request theirs
      if (mode == 2) {

        let html = '<div class="sf-readable">Request Promissary FROM them: </div><ul>';
        for (let i = 0; i < imperium_self.game.players_info[player-1].promissary_notes.length; i++) {
	  let pm = imperium_self.game.players_info[player-1].promissary_notes[i];
	  let tmpar = pm.split("-");
          let faction_promissary_owner = imperium_self.factions[tmpar[0]].name;
	  let already_offered = 0;
	  for (let b = 0; b < receive_promissaries.length; b++) {
	    if (receive_promissaries[b].promissary === pm) {
	      already_offered = 1;
	    }
	  }
	  if (already_offered == 0) {
            html += `  <li class="option" id="${i}">${faction_promissary_owner} - ${imperium_self.promissary_notes[tmpar[1]].name}</li>`;
          }
        }
        html += `  <li class="option" id="cancel">cancel</li>`;

	imperium_self.updateStatus(html);
        $('.option').off();
        $('.option').on('click', function () {

          let prom = $(this).attr("id");

          if (prom == "cancel") {
            goodsTradeInterface(imperium_self, player, mainTradeInterface, goodsTradeInterface, promissaryTradeInterface);
            return 0;
          }
	  
	  let promobj = { player : player , promissary : imperium_self.game.players_info[player-1].promissary_notes[prom] }
	  receive_promissaries.push(promobj);
          goodsTradeInterface(imperium_self, player, mainTradeInterface, goodsTradeInterface, promissaryTradeInterface);
	  return;

	});


      }

    }
    let mainTradeInterface = function (imperium_self, mainTradeInterface, goodsTradeInterface, promissaryTradeInterface) {

      let html = '<div class="sf-readable">Make Trade Offer to Faction: </div><ul>';
      for (let i = 0; i < imperium_self.game.players_info.length; i++) {
        if (imperium_self.game.players_info[i].traded_this_turn == 0 && (i + 1) != imperium_self.game.player) {
          if (imperium_self.arePlayersAdjacent(imperium_self.game.player, (i + 1))) {
            html += `  <li class="option" id="${i}">${factions[imperium_self.game.players_info[i].faction].name}</li>`;
          }
        }
      }
      html += `  <li class="option" id="cancel">cancel</li>`;
      html += '</ul>';

      imperium_self.updateStatus(html);

      $('.option').off();
      $('.option').on('click', function () {

        let faction = $(this).attr("id");

        if (faction == "cancel") {
          imperium_self.playerTurn();
          return 0;
        }

        max_offer = imperium_self.game.players_info[imperium_self.game.player - 1].commodities + imperium_self.game.players_info[imperium_self.game.player - 1].goods;
        max_receipt = imperium_self.game.players_info[parseInt(faction)].commodities + imperium_self.game.players_info[parseInt(faction)].goods;

	goodsTradeInterface(imperium_self, (parseInt(faction)+1), mainTradeInterface, goodsTradeInterface, promissaryTradeInterface);

      });
    }

    //
    // start with the main interface
    //
    mainTradeInterface(imperium_self, mainTradeInterface, goodsTradeInterface, promissaryTradeInterface);

  }




playerSelectSector(mycallback, mode = 0) {

  //
  // mode
  //
  // 0 = any sector
  // 1 = activated actor
  //
  let imperium_self = this;

  $('.sector').off();
  $('.sector').on('click', function () {
    $('.sector').off();
    let pid = $(this).attr("id");
    mycallback(pid);
  });

}




playerSelectPlanet(mycallback, mode = 0) {

  //
  // mode
  //
  // 0 = in any sector
  // 1 = in unactivated actor
  // 2 = controlled by me
  //

  let imperium_self = this;

  let html = "Select a system in which to select a planet: ";
  this.updateStatus(html);

  $('.sector').on('click', function () {

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
        salert("Invalid Choice: you do not control planets in that sector");
        return;
      }
    }


    html = '<div class="sf-readable">Select a planet in this system: </div><ul>';
    for (let i = 0; i < sys.p.length; i++) {
      if (mode == 0) {
        html += '<li class="option" id="' + i + '">' + sys.p[i].name + ' - <span class="invadeplanet_' + i + '">0</span></li>';
      }
      if (mode == 1) {
        html += '<li class="option" id="' + i + '">' + sys.p[i].name + ' - <span class="invadeplanet_' + i + '">0</span></li>';
      }
      if (mode == 2 && sys.p[i].owner == imperium_self.game.player) {
        html += '<li class="option" id="' + i + '">' + sys.p[i].name + '</li>';
      }
    }
    html += '</ul>';


    imperium_self.updateStatus(html);

    $('.option').off();
    $('.option').on('mouseenter', function () { let s = $(this).attr("id"); imperium_self.showPlanetCard(sector, s); imperium_self.showSectorHighlight(sector); });
    $('.option').on('mouseleave', function () { let s = $(this).attr("id"); imperium_self.hidePlanetCard(sector, s); imperium_self.hideSectorHighlight(sector); });
    $('.option').on('click', function () {
      let pid = $(this).attr("id");
      imperium_self.hidePlanetCard(sector, pid);
      mycallback(sector, pid);
    });

  });

}



playerSelectInfluence(cost, mycallback) {

  if (cost == 0) { mycallback(1); return; }

  let imperium_self = this;
  let array_of_cards = this.returnPlayerUnexhaustedPlanetCards(this.game.player); // unexhausted
  let array_of_cards_to_exhaust = [];
  let selected_cost = 0;
  let total_trade_goods = imperium_self.game.players_info[imperium_self.game.player - 1].goods;


  let html = "<div class='sf-readable'>Select " + cost + " in influence: </div><ul>";
  for (let z = 0; z < array_of_cards.length; z++) {
    html += '<li class="cardchoice" id="cardchoice_' + array_of_cards[z] + '">' + this.returnPlanetCard(array_of_cards[z]) + '</li>';
  }
  if (1 == imperium_self.game.players_info[imperium_self.game.player - 1].goods) {
    html += '<li class="textchoice" id="trade_goods">' + imperium_self.game.players_info[imperium_self.game.player - 1].goods + ' trade good</li>';
  } else {
    html += '<li class="textchoice" id="trade_goods">' + imperium_self.game.players_info[imperium_self.game.player - 1].goods + ' trade goods</li>';
  }
  html += '</ul>';

  this.updateStatus(html);

  this.lockInterface();

  $('.cardchoice , .textchoice').on('click', function () {

    let action2 = $(this).attr("id");
    let tmpx = action2.split("_");

    let divid = "#" + action2;
    let y = tmpx[1];
    let idx = 0;
    for (let i = 0; i < array_of_cards.length; i++) {
      if (array_of_cards[i] === y) {
        idx = i;
      }
    }



    //
    // handle spending trade goods
    //
    if (action2 == "trade_goods") {
      if (total_trade_goods > 0) {
        imperium_self.addMove("expend\t" + imperium_self.game.player + "\tgoods\t1");
        total_trade_goods--;
        selected_cost += 1;

        if (1 == total_trade_goods) {
          $('#trade_goods').html(('' + total_trade_goods + ' trade good'));
        } else {
          $('#trade_goods').html(('' + total_trade_goods + ' trade goods'));
        }
      }
    } else {
      imperium_self.addMove("expend\t" + imperium_self.game.player + "\tplanet\t" + array_of_cards[idx]);
      array_of_cards_to_exhaust.push(array_of_cards[idx]);
      $(divid).off();
      $(divid).css('opacity', '0.2');
      selected_cost += imperium_self.game.planets[array_of_cards[idx]].influence;
    }

    if (cost <= selected_cost) {

      if (!imperium_self.mayUnlockInterface()) {
        salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
        return;
      }
      imperium_self.unlockInterface();
      $('.cardchoice , .textchoice').off();

      mycallback(1);
    }

  });
}






playerSelectStrategyAndCommandTokens(cost, mycallback) {

  if (cost == 0) { mycallback(1); }

  let imperium_self = this;
  let selected_cost = 0;

  let html = "<div class='sf-readable'>Select " + cost + " in Strategy and Command Tokens: </div><ul>";
  html += '<li class="textchoice" id="strategy">strategy tokens - <span class="available_strategy_tokens">'+imperium_self.game.players_info[imperium_self.game.player-1].strategy_tokens+'</span></li>';
  html += '<li class="textchoice" id="command">command tokens - <span class="available_command_tokens">'+imperium_self.game.players_info[imperium_self.game.player-1].command_tokens+'</span></li>';
  html += '</ul>';

  this.updateStatus(html);
  this.lockInterface();

  $('.textchoice').on('click', function () {

    let action2 = $(this).attr("id");

    if (action2 == "strategy") {
      let x = parseInt($('.available_strategy_tokens').html());
      if (x > 0) {
        selected_cost++;
        $('.available_strategy_tokens').html((x-1));
        imperium_self.addMove("expend\t" + imperium_self.game.player + "\tstrategy\t1");
      }
    }
    if (action2 == "command") {
      let x = parseInt($('.available_command_tokens').html());
      if (x > 0) {
        selected_cost++;
        $('.available_command_tokens').html((x-1));
        imperium_self.addMove("expend\t" + imperium_self.game.player + "\tcommand\t1");
      }
    }

    if (cost <= selected_cost) { 
      if (!imperium_self.mayUnlockInterface()) {
        salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
        return;
      }
      imperium_self.unlockInterface();
      $('.textchoice').off();
      mycallback(1); 
    }

  });

}



playerSelectResources(cost, mycallback) {

  if (cost == 0) { mycallback(1); return; }

  let imperium_self = this;
  let array_of_cards = this.returnPlayerUnexhaustedPlanetCards(this.game.player); // unexhausted
  let array_of_cards_to_exhaust = [];
  let selected_cost = 0;
  let total_trade_goods = imperium_self.game.players_info[imperium_self.game.player - 1].goods;

  let html = "<div class='sf-readable'>Select " + cost + " in resources: </div><ul>";
  for (let z = 0; z < array_of_cards.length; z++) {
    html += '<li class="cardchoice" id="cardchoice_' + array_of_cards[z] + '">' + this.returnPlanetCard(array_of_cards[z]) + '</li>';
  }
  if (1 == imperium_self.game.players_info[imperium_self.game.player - 1].goods) {
    html += '<li class="textchoice" id="trade_goods">' + imperium_self.game.players_info[imperium_self.game.player - 1].goods + ' trade good</li>';
  } else {
    html += '<li class="textchoice" id="trade_goods">' + imperium_self.game.players_info[imperium_self.game.player - 1].goods + ' trade goods</li>';
  }
  html += '</ul>';

  this.updateStatus(html);
  this.lockInterface();

  $('.cardchoice , .textchoice').on('click', function () {

    let action2 = $(this).attr("id");

    let tmpx = action2.split("_");

    let divid = "#" + action2;
    let y = tmpx[1];
    let idx = 0;
    for (let i = 0; i < array_of_cards.length; i++) {
      if (array_of_cards[i] === y) {
        idx = i;
      }
    }

    //
    // handle spending trade goods
    //
    if (action2 == "trade_goods") {
      if (total_trade_goods > 0) {
        imperium_self.addMove("expend\t" + imperium_self.game.player + "\tgoods\t1");
        total_trade_goods--;
        selected_cost += 1;

        if (1 == total_trade_goods) {
          $('#trade_goods').html(('' + total_trade_goods + ' trade good'));
        } else {
          $('#trade_goods').html(('' + total_trade_goods + ' trade goods'));
        }
      }
    } else {
      imperium_self.addMove("expend\t" + imperium_self.game.player + "\tplanet\t" + array_of_cards[idx]);
      array_of_cards_to_exhaust.push(array_of_cards[idx]);
      $(divid).off();
      $(divid).css('opacity', '0.2');
      selected_cost += parseInt(imperium_self.game.planets[array_of_cards[idx]].resources);
    }

    if (cost <= selected_cost) { 

      if (!imperium_self.mayUnlockInterface()) {
        salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
        return;
      }
      imperium_self.unlockInterface();
      $('.cardchoice , .textchoice').off();

      mycallback(1); 

    }

  });

}








playerSelectActionCard(mycallback, cancel_callback, types = []) {

  console.log("WHAT TYPE: " + JSON.stringify(types));

  let imperium_self = this;
  let array_of_cards = this.returnPlayerActionCards(this.game.player, types);
  if (array_of_cards.length == 0) {
    this.playerAcknowledgeNotice("You do not have any action cards that can be played now", function () {
      if (cancel_callback != null) { cancel_callback(); return 0; }
      imperium_self.playerTurn();
      return 0;
    });
    return 0;
  }

  let html = '';

  html += "<div class='sf-readable'>Select an action card: </div><ul>";
  for (let z = 0; z < array_of_cards.length; z++) {
    if (!this.game.players_info[this.game.player - 1].action_cards_played.includes(array_of_cards[z])) {
      let thiscard = imperium_self.action_cards[array_of_cards[z]];
      html += '<li class="textchoice pointer" id="' + array_of_cards[z] + '">' + thiscard.name + '</li>';
    }
  }
  html += '<li class="textchoice pointer" id="cancel">cancel</li>';
  html += '</ul>';

  this.updateStatus(html);
  $('.textchoice').off();
  $('.textchoice').on('mouseenter', function () { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.showActionCard(s); } });
  $('.textchoice').on('mouseleave', function () { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.hideActionCard(s); } });
  $('.textchoice').on('click', function () {

    let action2 = $(this).attr("id");

    if (action2 != "cancel") { imperium_self.hideActionCard(action2); }
    if (action2 === "cancel") { cancel_callback(); return 0; }

    if (imperium_self.game.tracker) { imperium_self.game.tracker.action_card = 1; }
    if (imperium_self.action_cards[action2].type == "action") { imperium_self.game.state.active_player_moved = 1; }

    imperium_self.game.players_info[imperium_self.game.player - 1].action_cards_played.push(action2);

    mycallback(action2);

  });

}


//
// this is when players are choosing to play the cards that they have 
// already chosen.
//
playerSelectStrategyCard(mycallback, mode = 0) {

  let array_of_cards = this.game.players_info[this.game.player - 1].strategy;
  let strategy_cards = this.returnStrategyCards();
  let imperium_self = this;

  let html = "";

  html += "<div class='sf-readable'>Select a strategy card: </div><ul>";
  for (let z in array_of_cards) {
    if (!this.game.players_info[this.game.player - 1].strategy_cards_played.includes(array_of_cards[z])) {
      html += '<li class="textchoice" id="' + array_of_cards[z] + '">' + strategy_cards[array_of_cards[z]].name + '</li>';
    }
  }
  html += '<li class="textchoice pointer" id="cancel">cancel</li>';
  html += '</ul>';

  this.updateStatus(html);
  $('.textchoice').on('mouseenter', function () { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.showStrategyCard(s); } });
  $('.textchoice').on('mouseleave', function () { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.hideStrategyCard(s); } });
  $('.textchoice').on('click', function () {

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
  let playercol = "player_color_" + this.game.player;
  let relevant_action_cards = ["strategy"];
  let ac = this.returnPlayerActionCards(this.game.player, relevant_action_cards);


  let html = "<div class='terminal_header'><div class='player_color_box " + playercol + "'></div>" + this.returnFaction(this.game.player) + ": select your strategy card:</div><ul>";
  if (this.game.state.round > 1) {
    html = "<div class='terminal_header'>" + this.returnFaction(this.game.player) + ": select your strategy card:</div><ul>";
  }
  if (ac.length > 0) {
    html += '<li class="option" id="action">play action card</li>';
  }
  let scards = [];

  for (let z in this.strategy_cards) {
    scards.push("");
  }

  for (let z = 0; z < this.game.state.strategy_cards.length; z++) {
    let rank = parseInt(this.strategy_cards[this.game.state.strategy_cards[z]].rank);
    while (scards[rank - 1] != "") { rank++; }
    scards[rank - 1] = '<li class="textchoice" id="' + this.game.state.strategy_cards[z] + '">' + cards[this.game.state.strategy_cards[z]].name + '</li>';
  }

  for (let z = 0; z < scards.length; z++) {
    if (scards[z] != "") {
      html += scards[z];
    }
  }

  html += '</ul></p>';
  this.updateStatus(html);

  $('.textchoice').off();
  $('.textchoice').on('mouseenter', function () { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.showStrategyCard(s); } });
  $('.textchoice').on('mouseleave', function () { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.hideStrategyCard(s); } });
  $('.textchoice').on('click', function () {

    let action2 = $(this).attr("id");

    if (action2 == "action") {
      imperium_self.playerSelectActionCard(function (card) {
        imperium_self.addMove("pickstrategy\t" + imperium_self.game.player);
        imperium_self.addMove("action_card_post\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("action_card\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("lose\t" + imperium_self.game.player + "\taction_cards\t1");
        imperium_self.endTurn();
        return 0;
      }, function () {
        imperium_self.playerSelectActionCards(action_card_player, card);
      }, ["action"]);
      return 0;
    }

    imperium_self.hideStrategyCard(action2);
    mycallback(action2);
  });

}



playerRemoveInfantryFromPlanets(player, total = 1, mycallback) {

  let imperium_self = this;

  let html = '';
  html += '<div class="sf-readable">Remove ' + total + ' infantry from planets you control:</div>';
  html += '<ul>';

  let infantry_to_remove = [];

  for (let s in this.game.planets) {
    let planet = this.game.planets[s];
    if (planet.owner == player) {
      let infantry_available_here = 0;
      for (let ss = 0; ss < planet.units[player - 1].length; ss++) {
        if (planet.units[player - 1][ss].type == "infantry") { infantry_available_here++; }
      }
      if (infantry_available_here > 0) {
        html += '<li class="option textchoice" id="' + s + '">' + planet.name + ' - <div style="display:inline" id="' + s + '_infantry">' + infantry_available_here + '</div></li>';
      }
    }
  }
  html += '<li class="option textchoice" id="end"></li>';
  html += '</ul>';

  this.updateStatus(html);

  $('.textchoice').off();
  $('.textchoice').on('click', function () {

    let action2 = $(this).attr("id");

    if (action2 == "end") {

      for (let i = 0; i < infantry_to_remove.length; i++) {

        let planet_in_question = imperium_self.game.planets[infantry_to_remove[i].planet];

        let total_units_on_planet = planet_in_question.units[player - 1].length;
        for (let ii = 0; ii < total_units_on_planet; ii++) {
          let thisunit = planet_in_question.units[player - 1][ii];
          if (thisunit.type == "infantry") {
            planet_in_question.units[player - 1].splice(ii, 1);
            ii = total_units_on_planet + 2; // 0 as player_moves below because we have removed above
            imperium_self.addMove("remove_infantry_from_planet\t" + player + "\t" + infantry_to_remove[i].planet + "\t" + "0");
            imperium_self.addMove("NOTIFY\tREMOVING INFANTRY FROM PLANET: " + infantry_to_remove[i].planet);
            console.log("PLANET HAS LEFT: " + JSON.stringify(planet_in_question));
          }
        }
      }
      mycallback(infantry_to_remove.length);
      return;
    }

    infantry_to_remove.push({ infantry: 1, planet: action2 });
    let divname = "#" + action2 + "_infantry";
    let existing_infantry = $(divname).html();
    let updated_infantry = parseInt(existing_infantry) - 1;
    if (updated_infantry < 0) { updated_infantry = 0; }

    $(divname).html(updated_infantry);

    if (updated_infantry == 0) {
      $(this).remove();
    }

    if (infantry_to_remove.length >= total) {
      $('#end').click();
    }

  });

}

playerAddInfantryToPlanets(player, total = 1, mycallback) {

  let imperium_self = this;

  let html = '';
  html += '<div class="sf-readable">Add ' + total + ' infantry to planets you control:</div>';
  html += '<ul>';

  let infantry_to_add = [];

  for (let s in this.game.planets) {
    let planet = this.game.planets[s];
    if (planet.owner == player) {
      let infantry_available_here = 0;
      for (let ss = 0; ss < planet.units[player - 1].length; ss++) {
        if (planet.units[player - 1][ss].type == "infantry") { infantry_available_here++; }
      }
      html += '<li class="option textchoice" id="' + s + '">' + planet.name + ' - <div style="display:inline" id="' + s + '_infantry">' + infantry_available_here + '</div></li>';
    }
  }
  html += '<li class="option textchoice" id="end"></li>';
  html += '</ul>';

  this.updateStatus(html);

  $('.textchoice').off();
  $('.textchoice').on('click', function () {

    let action2 = $(this).attr("id");

    if (action2 == "end") {
      for (let i = 0; i < infantry_to_add.length; i++) {
        imperium_self.addMove("add_infantry_to_planet\t" + player + "\t" + infantry_to_add[i].planet + "\t" + "1");
      }
      mycallback(infantry_to_add.length);
      return;
    }

    infantry_to_add.push({ infantry: 1, planet: action2 });
    let divname = "#" + action2 + "_infantry";
    let existing_infantry = $(divname).html();
    let updated_infantry = parseInt(existing_infantry) + 1;

    $(divname).html(updated_infantry);

    if (infantry_to_add.length >= total) {
      $('#end').click();
    }

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
  let hazards = [];
  let fighters_loaded = 0;
  let infantry_loaded = 0;

  let obj = {};
  obj.max_hops = 2;
  obj.ship_move_bonus = this.game.players_info[this.game.player - 1].ship_move_bonus + this.game.players_info[this.game.player - 1].temporary_ship_move_bonus;
  obj.fleet_move_bonus = this.game.players_info[this.game.player - 1].fleet_move_bonus + this.game.players_info[this.game.player - 1].temporary_fleet_move_bonus;
  obj.ships_and_sectors = [];
  obj.stuff_to_move = [];
  obj.stuff_to_load = [];
  obj.distance_adjustment = 0;

  obj.max_hops += obj.ship_move_bonus;
  obj.max_hops += obj.fleet_move_bonus;

  let x = imperium_self.returnSectorsWithinHopDistance(destination, obj.max_hops, imperium_self.game.player);
  sectors = x.sectors;
  distance = x.distance;
  hazards = x.hazards;

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

  obj.ships_and_sectors = imperium_self.returnShipsMovableToDestinationFromSectors(destination, sectors, distance, hazards);

console.log("HERE: " + JSON.stringify(obj.ships_and_sectors));

  let updateInterface = function (imperium_self, obj, updateInterface) {

    let subjective_distance_adjustment = 0;
    if (obj.ship_move_bonus > 0) {
      subjective_distance_adjustment += obj.ship_move_bonus;
    }
    if (obj.fleet_move_bonus > 0) {
      subjective_distance_adjustment += obj.fleet_move_bonus;
    }
    let spent_distance_boost = (obj.distance_adjustment - subjective_distance_adjustment);

    let playercol = "player_color_" + imperium_self.game.player;
    let html = "<div class='player_color_box " + playercol + "'></div> " + imperium_self.returnFaction(imperium_self.game.player) + ': select ships to move<ul>';

    //
    // select ships
    //
    for (let i = 0; i < obj.ships_and_sectors.length; i++) {

      let sys = imperium_self.returnSectorAndPlanets(obj.ships_and_sectors[i].sector);
      html += '<b class="sector_name" id="' + obj.ships_and_sectors[i].sector + '" style="margin-top:10px">' + sys.s.name + '</b>';
      html += '<ul class="ship_selector">';
      for (let ii = 0; ii < obj.ships_and_sectors[i].ships.length; ii++) {

        //
        // figure out if we can still move this ship
        //
        let already_moved = 0;
        for (let z = 0; z < obj.stuff_to_move.length; z++) {
          if (obj.stuff_to_move[z].already_moved == 1) {
            already_moved = 1;
          }
          if (obj.stuff_to_move[z].sector == obj.ships_and_sectors[i].sector) {
            if (obj.stuff_to_move[z].i == i) {
              if (obj.stuff_to_move[z].ii == ii) {
                already_moved = 1;
              }
            }
          }
        }

	let rift_passage = 0;
	if (obj.ships_and_sectors[i].hazards[ii] === "rift") { rift_passage = 1; }

        if (already_moved == 1) {
          if (rift_passage == 0) {
            html += `<li id="sector_${i}_${ii}" class=""><b>${obj.ships_and_sectors[i].ships[ii].name}</b></li>`;
	  } else {
            html += `<li id="sector_${i}_${ii}" class=""><b>${obj.ships_and_sectors[i].ships[ii].name}</b> - rift</li>`;
	  }
        } else {
          if (obj.ships_and_sectors[i].ships[ii].move - (obj.ships_and_sectors[i].adjusted_distance[ii] + spent_distance_boost) >= 0) {
            if (rift_passage == 0) {
	      html += `<li id="sector_${i}_${ii}" class="option">${obj.ships_and_sectors[i].ships[ii].name}</li>`;
            } else {
	      html += `<li id="sector_${i}_${ii}" class="option">${obj.ships_and_sectors[i].ships[ii].name} - rift</li>`;
	    }
          }
        }
      }

      html += '</ul>';
    }
    html += '<hr />';
    html += '<div id="confirm" class="option">click here to move</div>';
//    html += '<hr />';
//    html += '<div id="clear" class="option">clear selected</div>';
    html += '<hr />';
    imperium_self.updateStatus(html);

    //
    // add hover / mouseover to sector names
    //
    let adddiv = ".sector_name";
    $(adddiv).on('mouseenter', function () { let s = $(this).attr("id"); imperium_self.addSectorHighlight(s); });
    $(adddiv).on('mouseleave', function () { let s = $(this).attr("id"); imperium_self.removeSectorHighlight(s); });


    $('.option').off();
    $('.option').on('click', function () {

      let id = $(this).attr("id");

      //
      // submit when done
      //
      if (id == "confirm") {

        imperium_self.addMove("resolve\tplay");
        // source should be OK as moving out does not add units
        imperium_self.addMove("space_invasion\t" + imperium_self.game.player + "\t" + destination);
        imperium_self.addMove("check_fleet_supply\t" + imperium_self.game.player + "\t" + destination);
        for (let y = 0; y < obj.stuff_to_move.length; y++) {

	  let this_ship_i = obj.stuff_to_move[y].i;
	  let this_ship_ii = obj.stuff_to_move[y].ii;
	  let this_ship_hazard = obj.ships_and_sectors[this_ship_i].hazards[this_ship_ii];

          imperium_self.addMove("move\t" + imperium_self.game.player + "\t" + 1 + "\t" + obj.ships_and_sectors[obj.stuff_to_move[y].i].sector + "\t" + destination + "\t" + JSON.stringify(obj.ships_and_sectors[obj.stuff_to_move[y].i].ships[obj.stuff_to_move[y].ii]) + "\t" + this_ship_hazard);
        }
        for (let y = obj.stuff_to_load.length - 1; y >= 0; y--) {
          imperium_self.addMove("load\t" + imperium_self.game.player + "\t" + 0 + "\t" + obj.stuff_to_load[y].sector + "\t" + obj.stuff_to_load[y].source + "\t" + obj.stuff_to_load[y].source_idx + "\t" + obj.stuff_to_load[y].unitjson + "\t" + obj.stuff_to_load[y].shipjson);
        }

        imperium_self.endTurn();
        return;
      };

      //
      // clear the list to start again
      //
      if (id == "clear") {
        salert("To change movement options, please reload!");
	window.location.reload(true);
        return;
      }


      //
      // highlight ship on menu
      //
      $(this).css("font-weight", "bold");
      this.classList.add("ship_selected");
      console.log(this);

      //
      //  figure out if we need to load infantry / fighters
      //
      let tmpx = id.split("_");
      let i = tmpx[1];
      let ii = tmpx[2];
      let calcdist = obj.ships_and_sectors[i].distance;
      let sector = obj.ships_and_sectors[i].sector;
      let sys = imperium_self.returnSectorAndPlanets(sector);
      let ship = obj.ships_and_sectors[i].ships[ii];
      let total_ship_capacity = imperium_self.returnRemainingCapacity(ship);
      let x = { i: i, ii: ii, sector: sector };


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


      //
      // if this is a fighter, remove it from the underlying
      // list of units we can move, so that it is not double-added
      //
      if (ship.type == "fighter") {
        obj.ships_and_sectors[i].ships[ii].already_moved = 1;
      }




      obj.stuff_to_move.push(x);
      updateInterface(imperium_self, obj, updateInterface);


      //
      // is there stuff left to move?
      //
      let stuff_available_to_move = 0;
      for (let i = 0; i < sys.p.length; i++) {
        let planetary_units = sys.p[i].units[imperium_self.game.player - 1];
        for (let k = 0; k < planetary_units.length; k++) {
          if (planetary_units[k].type == "infantry") {
            stuff_available_to_move++;
          }
        }
      }
      for (let i = 0; i < sys.s.units[imperium_self.game.player - 1].length; i++) {
        if (sys.s.units[imperium_self.game.player - 1][i].type == "fighter") {
          stuff_available_to_move++;
        }
      }


      //
      // remove already-moved fighters from stuff-available-to-move
      // 
      let fighters_available_to_move = 0;
      for (let iii = 0; iii < sys.s.units[imperium_self.game.player - 1].length; iii++) {
        if (sys.s.units[imperium_self.game.player - 1][iii].type == "fighter") {
          let fighter_already_moved = 0;
          for (let z = 0; z < obj.stuff_to_move.length; z++) {
            if (obj.stuff_to_move[z].sector == sector) {
              if (obj.stuff_to_move[z].ii == iii) {
                fighter_already_moved = 1;
              }
            }
          }
          if (fighter_already_moved == 1) {
            stuff_available_to_move--;
          }
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


        let user_message = `<div class="sf-readable">This ship has <span class="capacity_remaining">${total_ship_capacity}</span> capacity. Infantry can capture planets and fighters can protect your fleet. Do you wish to add them? </div><ul>`;

        for (let i = 0; i < sys.p.length; i++) {
          let planetary_units = sys.p[i].units[imperium_self.game.player - 1];
          let infantry_available_to_move = 0;
          for (let k = 0; k < planetary_units.length; k++) {
            if (planetary_units[k].type == "infantry") {
              infantry_available_to_move++;
            }
          }
          if (infantry_available_to_move > 0) {
            user_message += '<li class="option textchoice" id="addinfantry_p_' + i + '">add infantry from ' + sys.p[i].name + ' - <span class="add_infantry_remaining_' + i + '">' + infantry_available_to_move + '</span></li>';
          }
        }

        let fighters_available_to_move = 0;
        for (let iii = 0; iii < sys.s.units[imperium_self.game.player - 1].length; iii++) {
          if (sys.s.units[imperium_self.game.player - 1][iii].type == "fighter") {
            let fighter_already_moved = 0;
            for (let z = 0; z < obj.stuff_to_move.length; z++) {
              if (obj.stuff_to_move[z].sector == sector) {
                if (obj.stuff_to_move[z].ii == iii) {
                  fighter_already_moved = 1;
                }
              }
            }
            if (fighter_already_moved == 0) {
              fighters_available_to_move++;
            }
          }
        }
        user_message += '<li class="option textchoice" id="addfighter_s_s">add fighter - <span class="add_fighters_remaining">' + fighters_available_to_move + '</span></li>';
        user_message += '<li class="option textchoice" id="skip">finish</li>';
        user_message += '</ul></div>';


        //
        // choice
        //
        $('.status-overlay').html(user_message);
        $('.status-overlay').show();
        $('.status').hide();
        $('.textchoice').off();

        //
        // add hover / mouseover to message
        //
        for (let i = 0; i < sys.p.length; i++) {
          adddiv = "#addinfantry_p_" + i;
          $(adddiv).on('mouseenter', function () { imperium_self.addPlanetHighlight(sector, i); });
          $(adddiv).on('mouseleave', function () { imperium_self.removePlanetHighlight(sector, i); });
        }
        adddiv = "#addfighter_s_s";
        $(adddiv).on('mouseenter', function () { imperium_self.addSectorHighlight(sector); });
        $(adddiv).on('mouseleave', function () { imperium_self.removeSectorHighlight(sector); });


        // leave action enabled on other panels
        $('.textchoice').on('click', function () {

          let id = $(this).attr("id");
          let tmpx = id.split("_");
          let action2 = tmpx[0];

          if (total_ship_capacity > 0) {

            if (action2 === "addinfantry") {

              let planet_idx = tmpx[2];
              let irdiv = '.add_infantry_remaining_' + planet_idx;
              let ir = parseInt($(irdiv).html());
              let ic = parseInt($('.capacity_remaining').html());

              //
              // we have to load prematurely. so JSON will be accurate when we move the ship, so player_move is 0 for load
              //
              let unitjson = imperium_self.unloadUnitFromPlanet(imperium_self.game.player, sector, planet_idx, "infantry");
              let shipjson_preload = JSON.stringify(sys.s.units[imperium_self.game.player - 1][obj.ships_and_sectors[i].ship_idxs[ii]]);
              imperium_self.loadUnitByJSONOntoShip(imperium_self.game.player, sector, obj.ships_and_sectors[i].ship_idxs[ii], unitjson);

              $(irdiv).html((ir - 1));
              $('.capacity_remaining').html((ic - 1));

              let loading = {};
              loading.sector = sector;
              loading.source = "planet";
              loading.source_idx = planet_idx;
              loading.unitjson = unitjson;
              loading.ship_idx = obj.ships_and_sectors[i].ship_idxs[ii];
              loading.shipjson = shipjson_preload;
              loading.i = i;
              loading.ii = ii;

              total_ship_capacity--;

              obj.stuff_to_load.push(loading);

              if (ic === 1 && total_ship_capacity == 0) {
                $('.status').show();
                $('.status-overlay').hide();
              }

            }


            if (action2 === "addfighter") {

              if (fighters_available_to_move <= 0) { return; }

              let ir = parseInt($('.add_fighters_remaining').html());
              let ic = parseInt($('.capacity_remaining').html());
              $('.add_fighters_remaining').html((ir - 1));
              fighters_available_to_move--;
              $('.capacity_remaining').html((ic - 1));

              //
              // remove this fighter ...
              //
              let secs_to_check = obj.ships_and_sectors.length;
              for (let sec = 0; sec < obj.ships_and_sectors.length; sec++) {
                if (obj.ships_and_sectors[sec].sector === sector) {
                  let ships_to_check = obj.ships_and_sectors[sec].ships.length;
                  for (let f = 0; f < ships_to_check; f++) {
                    if (obj.ships_and_sectors[sec].ships[f].already_moved == 1) { } else {
                      if (obj.ships_and_sectors[sec].ships[f].type == "fighter") {

                        // remove fighter from status menu
                        let status_div = '#sector_' + sec + '_' + f;
                        $(status_div).remove();

                        // remove from arrays (as loaded)
                        // removed fri june 12
                        //obj.ships_and_sectors[sec].ships.splice(f, 1);
                        //obj.ships_and_sectors[sec].adjusted_distance.splice(f, 1);
                        obj.ships_and_sectors[sec].ships[f] = {};
                        obj.ships_and_sectors[sec].adjusted_distance[f] = 0;
                        f = ships_to_check + 2;
                        sec = secs_to_check + 2;

                      }
                    }
                  }
                }
              }

              let unitjson = imperium_self.removeSpaceUnit(imperium_self.game.player, sector, "fighter");
              let shipjson_preload = JSON.stringify(sys.s.units[imperium_self.game.player - 1][obj.ships_and_sectors[i].ship_idxs[ii]]);

              imperium_self.loadUnitByJSONOntoShip(imperium_self.game.player, sector, obj.ships_and_sectors[i].ship_idxs[ii], unitjson);

              let loading = {};
              obj.stuff_to_load.push(loading);

              loading.sector = sector;
              loading.source = "ship";
              loading.source_idx = "";
              loading.unitjson = unitjson;
              loading.ship_idx = obj.ships_and_sectors[i].ship_idxs[ii];
              loading.shipjson = shipjson_preload;
              loading.i = i;
              loading.ii = ii;

              total_ship_capacity--;

              if (ic == 1 && total_ship_capacity == 0) {
                $('.status').show();
                $('.status-overlay').hide();
              }
            }
          } // total ship capacity

          if (action2 === "skip") {
            $('.status-overlay').hide();
            $('.status').show();
          }

        });
      }
    });
  };

  updateInterface(imperium_self, obj, updateInterface);

  return;

}

//////////////////////////
// Select Units to Move //
//////////////////////////
playerSelectInfantryToLand(sector) {

  let imperium_self = this;
  let html = '<div id="status-message" class="imperial-status-message">Unload Infantry (source): <ul>';
  let sys = imperium_self.returnSectorAndPlanets(sector);

  let space_infantry = [];
  let ground_infantry = [];

  for (let i = 0; i < sys.s.units[this.game.player-1].length; i++) {
    let unit = sys.s.units[this.game.player-1][i];
    if (imperium_self.returnInfantryInUnit(unit) > 0) { 
      html += `<li class="option textchoice" id="addinfantry_s_${i}">remove infantry from ${unit.name} - <span class="add_infantry_remaining_s_${i}">${imperium_self.returnInfantryInUnit(unit)}</span></li>`;
    }
  }

  for (let p = 0; p < sys.p.length; p++) {
    let planet = sys.p[p];
    if (imperium_self.returnInfantryOnPlanet(planet) > 0) { 
      html += `<li class="option textchoice" id="addinfantry_p_${p}">remove infantry from ${planet.name} - <span class="add_infantry_remaining_p_${p}">${imperium_self.returnInfantryOnPlanet(planet)}</span></li>`;
    }
  }

  html += '</ul>';
  html += '</div>';

  html += '<div id="confirm" class="option">click here to move</div>';
//  html += '<hr />';
//  html += '<div id="clear" class="option">clear selected</div>';
  imperium_self.updateStatus(html);

  $('.option').off();
  $('.option').on('click', function () {

    let id = $(this).attr("id");
    let assigned_planets = [];
    let infantry_available_for_reassignment = 0;
    for (let i = 0; i < sys.p.length; i++) {
      assigned_planets.push(0);
    }

    //
    // submit when done
    //
    if (id == "confirm") {

      for (let i = 0; i < space_infantry.length; i++) {
	imperium_self.addMove("unload_infantry\t"+imperium_self.game.player+"\t"+1+"\t"+sector+"\t"+"ship"+"\t"+space_infantry[i].ship_idx);
        infantry_available_for_reassignment++;
      }
      for (let i = 0; i < ground_infantry.length; i++) {
	imperium_self.addMove("unload_infantry\t"+imperium_self.game.player+"\t"+1+"\t"+sector+"\t"+"planet"+"\t"+ground_infantry[i].planet_idx);
        infantry_available_for_reassignment++;
      }

      let html = '<div class="sf-readable" id="status-message">Reassign Infantry to Planets: <ul>';
          for (let i = 0; i < sys.p.length; i++) {
	    let infantry_remaining_on_planet = imperium_self.returnInfantryOnPlanet(sys.p[i]);
	    for (let ii = 0; ii < ground_infantry.length; ii++) {
	      if (ground_infantry[ii].planet_idx == i) { infantry_remaining_on_planet--; }
	    }
  	    html += `<li class="option textchoice" id="${i}">${sys.p[i].name} - <span class="infantry_on_${i}">${infantry_remaining_on_planet}</span></li>`;
          }
          html += '<div id="confirm" class="option">click here to move</div>';
          html += '</ul'; 
          html += '</div>';

      imperium_self.updateStatus(html);

alert("infantry avail: " + infantry_available_for_reassignment);

      $('.option').off();
      $('.option').on('click', function () {

        let id = $(this).attr("id");

        if (id == "confirm") {
	  imperium_self.endTurn();
        }

        if (infantry_available_for_reassignment > 0)  {
          infantry_available_for_reassignment--;
          let divname = ".infantry_on_"+id;
          let v = parseInt($(divname).html());
          v++;
	  $(divname).html((v));
	  imperium_self.addMove("load_infantry\t"+imperium_self.game.player+"\t"+1+"\t"+sector+"\t"+"planet"+"\t"+id);
	}

      });
    };

    //
    // clear the list to start again
    //
    if (id == "clear") {
      salert("To change movement options, just reload!");
      window.location.reload(true);
    }


    //
    // otherwise we selected
    //
    let user_selected = id.split("_");
    if (user_selected[1] === "p") {
      let divname = ".add_infantry_remaining_p_"+user_selected[2];
      let v = parseInt($(divname).html());
      if (v > 0) {
        ground_infantry.push({ planet_idx : user_selected[2] });
	$(divname).html((v-1));
      }
    }
    if (user_selected[1] === "s") {
      let divname = ".add_infantry_remaining_s_"+user_selected[2];
      let v = parseInt($(divname).html());
      if (v > 0) {
        space_infantry.push({ ship_idx : user_selected[2] });
	$(divname).html((v-1));
      }
    }

  });

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

  html = '<div class="sf-readable">Which planet(s) do you invade: </div><ul>';
  for (let i = 0; i < sys.p.length; i++) {
    if (sys.p[i].owner != player) {
      html += '<li class="option sector_name" id="' + i + '">' + sys.p[i].name + ' - <span class="invadeplanet_' + i + '">0</span></li>';
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
  $(adiv).on('mouseenter', function () { let s = $(this).attr("id"); imperium_self.addPlanetHighlight(sector, s); });
  $(adiv).on('mouseleave', function () { let s = $(this).attr("id"); imperium_self.removePlanetHighlight(sector, s); });
  $('.option').on('click', function () {

    let planet_idx = $(this).attr('id');

    if (planet_idx === "confirm") {

/**
      if (landing_forces.length == 0) {
	let sanity_check = confirm("Invade without any landing forces? Are you sure -- the invasion will fail.");
	if (!sanity_check) { return; }
      }
**/
      for (let i = 0; i < planets_invaded.length; i++) {

        let owner = sys.p[planets_invaded[i]].owner;

        imperium_self.prependMove("bombardment\t" + imperium_self.game.player + "\t" + sector + "\t" + planets_invaded[i]);
        imperium_self.prependMove("bombardment_post\t" + imperium_self.game.player + "\t" + sector + "\t" + planets_invaded[i]);
        imperium_self.prependMove("bombardment_post\t" + owner + "\t" + sector + "\t" + planets_invaded[i]);
        imperium_self.prependMove("planetary_defense\t" + imperium_self.game.player + "\t" + sector + "\t" + planets_invaded[i]);
        imperium_self.prependMove("planetary_defense_post\t" + imperium_self.game.player + "\t" + sector + "\t" + planets_invaded[i]);
        imperium_self.prependMove("ground_combat_start\t" + imperium_self.game.player + "\t" + sector + "\t" + planets_invaded[i]);
        imperium_self.prependMove("ground_combat\t" + imperium_self.game.player + "\t" + sector + "\t" + planets_invaded[i]);
        imperium_self.prependMove("ground_combat_post\t" + imperium_self.game.player + "\t" + sector + "\t" + planets_invaded[i]);
        imperium_self.prependMove("ground_combat_end\t" + imperium_self.game.player + "\t" + sector + "\t" + planets_invaded[i]);
      }

      imperium_self.prependMove("continue\t" + imperium_self.game.player + "\t" + sector);
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
      let unit = sys.s.units[player - 1][i];
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

    html = '<div class="sf-readable">Select Ground Forces for Invasion of ' + sys.p[planet_idx].name + ': </div><ul>';

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
        html += '<li class="invadechoice textchoice option" id="invasion_planet_' + i + '">' + sys.p[i].name + ' - <span class="planet_' + i + '_infantry">' + forces_on_planets[i] + '</span></li>';
      }
    }
    populated_planet_forces = 1;



    //
    // ships in system
    //
    for (let i = 0; i < sys.s.units[player - 1].length; i++) {
      let ship = sys.s.units[player - 1][i];
      forces_on_ships.push(0);
      for (let j = 0; j < ship.storage.length; j++) {
        if (ship.storage[j].type === "infantry") {
          if (populated_ship_forces == 0) {
            forces_on_ships[i]++;
          }
        }
      }
      if (forces_on_ships[i] > 0) {
        html += '<li class="invadechoice textchoice" id="invasion_ship_' + i + '">' + ship.name + ' - <span class="ship_' + i + '_infantry">' + forces_on_ships[i] + '</span></li>';
      }
    }
    populated_ship_forces = 1;
    html += '<li class="invadechoice textchoice" id="finished_0_0">finish selecting</li>';
    html += '</ul></p>';


    //
    // choice
    //
    $('.status-overlay').html(html);
    $('.status').hide();
    $('.status-overlay').show();


    $('.invadechoice').off();
    $('.invadechoice').on('click', function () {

      let id = $(this).attr("id");
      let tmpx = id.split("_");

      let action2 = tmpx[0];
      let source = tmpx[1];
      let source_idx = tmpx[2];
      let counter_div = "." + source + "_" + source_idx + "_infantry";
      let counter = parseInt($(counter_div).html());

      if (action2 == "invasion") {

        if (source == "planet") {
          if (space_transport_available <= 0) { salert("Invalid Choice! No space transport available!"); return; }
          forces_on_planets[source_idx]--;
        } else {
          forces_on_ships[source_idx]--;
        }
        if (counter == 0) {
          salert("You cannot attack with forces you do not have available."); return;
        }

        let unitjson = JSON.stringify(imperium_self.returnUnit("infantry", imperium_self.game.player));

        let landing = {};
        landing.sector = sector;
        landing.source = source;
        landing.source_idx = source_idx;
        landing.planet_idx = planet_idx;
        landing.unitjson = unitjson;

        landing_forces.push(landing);

        let planet_counter = ".invadeplanet_" + planet_idx;
        let planet_forces = parseInt($(planet_counter).html());

        planet_forces++;
        $(planet_counter).html(planet_forces);

        counter--;
        $(counter_div).html(counter);

      }

      if (action2 === "finished") {

        for (let y = 0; y < landing_forces.length; y++) {
          imperium_self.addMove("land\t" + imperium_self.game.player + "\t" + 1 + "\t" + landing_forces[y].sector + "\t" + landing_forces[y].source + "\t" + landing_forces[y].source_idx + "\t" + landing_forces[y].planet_idx + "\t" + landing_forces[y].unitjson);
        };
        landing_forces = [];

        $('.status').show();
        $('.status-overlay').hide();

        return;
      }
    });
  });
}



playerActivateSystem() {

  let imperium_self = this;
  let html = "Select a sector to activate: ";
  let activated_once = 0;

  imperium_self.updateStatus(html);

  $('.sector').off();
  $('.sector').on('click', function () {

    //
    // only allowed 1 at a time
    //
    if (activated_once == 1) { return; }

    let pid = $(this).attr("id");

    if (imperium_self.canPlayerActivateSystem(pid) == 0) {
      salert("You cannot activate that system.");
    } else {

      let sys = imperium_self.returnSectorAndPlanets(pid);

      //
      // sanity check on whether we want to do this
      //
      let do_we_permit_this_activation = 1;
      if (!imperium_self.canPlayerMoveShipsIntoSector(imperium_self.game.player, pid)) {
	let c = confirm("You cannot move ships into this sector. Are you sure you wish to activate it?");
	if (c) {
        } else {
	  return;
	}
      }
 
      //
      // if this is our homeworld, it is round 1 and we haven't moved ships out, we may not 
      // understand 
      //
      if (imperium_self.returnPlayerHomeworldSector() == sys.s.sector && imperium_self.game.state.round == 1) {
	let confirm_choice = confirm("If you activate your homeworld you will not be able to move ships out of it until Round 2. Are you sure you want to do this?");
	if (!confirm_choice) { return; }
      }


      activated_once = 1;
      let divpid = '#' + pid;

      $(divpid).find('.hex_activated').css('background-color', 'var(--p' + imperium_self.game.player + ')');
      $(divpid).find('.hex_activated').css('opacity', '0.3');


      let chtml = "<div class='sf-readable'>Activate this system?</div><ul>";
          chtml += '<li class="option" id="yes">yes, do it</li>';
          chtml += '<li class="option" id="no">choose again</li>';
          chtml += '</ul>';

      imperium_self.updateStatus(chtml);
      
      $('.option').off();
      $('.option').on('click', function() {

        let action2 = $(this).attr("id");

        if (action2 === "yes") {
          sys.s.activated[imperium_self.game.player - 1] = 1;
          imperium_self.addMove("pds_space_attack_post\t"+imperium_self.game.player+"\t"+pid);
          imperium_self.addMove("pds_space_attack\t" + imperium_self.game.player + "\t" + pid);
          imperium_self.addMove("activate_system_post\t" + imperium_self.game.player + "\t" + pid);
          imperium_self.addMove("activate_system\t" + imperium_self.game.player + "\t" + pid);
          imperium_self.addMove("expend\t" + imperium_self.game.player + "\t" + "command" + "\t" + 1);
          imperium_self.addMove("setvar\tstate\t0\tactive_player_moved\t" + "int" + "\t" + "1");
          imperium_self.endTurn();

        } else {

          activated_once = 0;
          $(divpid).find('.hex_activated').css('background-color', 'transparent');
          $(divpid).find('.hex_activated').css('opacity', '1');

	  imperium_self.playerActivateSystem();

        }
      });
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
  let relevant_action_cards = ["post_activate_system"];
  let ac = this.returnPlayerActionCards(imperium_self.game.player, relevant_action_cards);
  let player = imperium_self.game.player;

  let html = "<div class='sf-readable'>" + this.returnFaction(this.game.player) + ": </div><ul>";

  if (imperium_self.canPlayerMoveShipsIntoSector(player, sector)) {
    html += '<li class="option" id="move">move into sector</li>';
  }

  if (this.canPlayerProduceInSector(this.game.player, sector)) {
    html += '<li class="option" id="produce">produce units</li>';
  }
  if (this.canPlayerLandInfantry(player, sector) && this.game.tracker.invasion == 0) {
    html += '<li class="option" id="land">relocate infantry</li>';
  }
  if (ac.length > 0) {
    html += '<li class="option" id="action">play action card</li>';
  }
  html += '<li class="option" id="finish">finish turn</li>';
  html += '</ul>';

  imperium_self.updateStatus(html);

  $('.option').on('click', function () {

    let action2 = $(this).attr("id");

    if (action2 == "action") {
      imperium_self.playerSelectActionCard(function (card) {
        imperium_self.addMove("activate_system_post\t" + imperium_self.game.player + "\t" + sector);
        imperium_self.game.players_info[this.game.player - 1].action_cards_played.push(card);
        imperium_self.addMove("action_card_post\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("action_card\t" + imperium_self.game.player + "\t" + card);
        imperium_self.addMove("lose\t" + imperium_self.game.player + "\taction_cards\t1");
      }, function () {
        imperium_self.playerPlayActionCardMenu(action_card_player, card);
      }, ["action"]);
    }

    if (action2 == "land") {
      imperium_self.addMove("continue\t" + player + "\t" + sector);
      imperium_self.playerSelectInfantryToLand(sector);
      return 0;
    }

    if (action2 == "move") {
      imperium_self.playerSelectUnitsToMove(sector);
    }
    if (action2 == "produce") {
      //
      // check the fleet supply and NOTIFY users if they are about to surpass it
      //
      let fleet_supply_in_sector = imperium_self.returnSpareFleetSupplyInSector(player, sector);
      if (fleet_supply_in_sector <= 1) {
        let notice = "You have no spare fleet supply in this sector. Do you still wish to produce more ships?";
        if (fleet_supply_in_sector == 1) {
          notice = "You have fleet supply for 1 additional capital ship in this sector. Do you still wish to produce more ships?";
        }
        let c = confirm(notice);
        if (c) {
          imperium_self.playerProduceUnits(sector);
        }
        return;
      }
      imperium_self.playerProduceUnits(sector);
    }
    if (action2 == "finish") {
      if (!imperium_self.moves.includes("resolve\tplay")) { imperium_self.addMove("resolve\tplay"); }
      imperium_self.addMove("setvar\tstate\t0\tactive_player_moved\t" + "int" + "\t" + "0");
      imperium_self.endTurn();
    }
  });
}






playerAllocateNewTokens(player, tokens, resolve_needed = 1, stage = 0, leadership_primary = 0) {

  let imperium_self = this;

  if (this.game.player == player) {

    let obj = {};
    obj.current_command = this.game.players_info[player - 1].command_tokens;
    obj.current_strategy = this.game.players_info[player - 1].strategy_tokens;
    obj.current_fleet = this.game.players_info[player - 1].fleet_supply;
    obj.new_command = 0;
    obj.new_strategy = 0;
    obj.new_fleet = 0;
    obj.new_tokens = tokens;


    let updateInterface = function (imperium_self, obj, updateInterface) {

      let html = '<div class="sf-readable">You have ' + obj.new_tokens + ' tokens to allocate. How do you want to allocate them? </div><ul>';

      if (stage == 1) {
        html = '<div class="sf-readable">The Leadership card gives you ' + obj.new_tokens + ' tokens to allocate. How do you wish to allocate them? </div><ul>';
      }
      if (stage == 2) {
        html = '<div class="sf-readable">Leadership has been played and you have purchased ' + obj.new_tokens + ' additional tokens. How do you wish to allocate them? </div><ul>';
      }
      if (stage == 3) {
        html = '<div class="sf-readable">You have ' + obj.new_tokens + ' new tokens to allocate: </div><ul>';
      }

      html += '<li class="option" id="command">Command Token - ' + (parseInt(obj.current_command) + parseInt(obj.new_command)) + '</li>';
      html += '<li class="option" id="strategy">Strategy Token - ' + (parseInt(obj.current_strategy) + parseInt(obj.new_strategy)) + '</li>';
      html += '<li class="option" id="fleet">Fleet Supply - ' + (parseInt(obj.current_fleet) + parseInt(obj.new_fleet)) + '</li>';
      html += '</ul>';

      imperium_self.updateStatus(html);
      imperium_self.lockInterface();

      $('.option').off();
      $('.option').on('click', function () {

        let id = $(this).attr("id");

        if (id == "strategy") {
          obj.new_strategy++;
          obj.new_tokens--;
        }

        if (id == "command") {
          obj.new_command++;
          obj.new_tokens--;
        }

        if (id == "fleet") {
          obj.new_fleet++;
          obj.new_tokens--;
        }

        if (obj.new_tokens == 0) {
          if (resolve_needed == 1) {
            if (imperium_self.game.confirms_needed > 0 && leadership_primary == 0) {
              imperium_self.addMove("resolve\ttokenallocation\t1\t" + imperium_self.app.wallet.returnPublicKey());
            } else {
              imperium_self.addMove("resolve\ttokenallocation");
            }
          }
          imperium_self.addMove("purchase\t" + player + "\tstrategy\t" + obj.new_strategy);
          imperium_self.addMove("purchase\t" + player + "\tcommand\t" + obj.new_command);
          imperium_self.addMove("purchase\t" + player + "\tfleetsupply\t" + obj.new_fleet);
          imperium_self.unlockInterface();
          imperium_self.endTurn();
        } else {
          imperium_self.unlockInterface();
          updateInterface(imperium_self, obj, updateInterface);
        }

      });
    };

    updateInterface(imperium_self, obj, updateInterface);

  }

  return 0;
}





playerSelectPlayerWithFilter(msg, filter_func, mycallback = null, cancel_func = null) {

  let imperium_self = this;

  let html = '<div class="sf-readable">' + msg + '</div>';
  html += '<ul>';

  for (let i = 0; i < this.game.players_info.length; i++) {
    if (filter_func(this.game.players_info[i]) == 1) {
      html += '<li class="textchoice" id="' + (i + 1) + '">' + this.returnFaction((i + 1)) + '</li>';
    }
  }
  if (cancel_func != null) {
    html += '<li class="textchoice" id="cancel">cancel</li>';
  }
  html += '</ul>';

  this.updateStatus(html);

  imperium_self.lockInterface();

  $('.textchoice').off();
  $('.textchoice').on('click', function () {

    if (!imperium_self.mayUnlockInterface()) {
      salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
      return;
    }
    imperium_self.unlockInterface();



    let action = $(this).attr("id");

    if (action == "cancel") {
      cancel_func();
      return 0;
    }

    mycallback(action);

  });
}



playerSelectSectorWithFilter(msg, filter_func, mycallback = null, cancel_func = null) {

  let imperium_self = this;

  let html = '<div class="sf-readable">' + msg + '</div>';
  html += '<ul>';

  for (let i in this.game.board) {
    if (filter_func(this.game.board[i].tile) == 1) {
      html += '<li class="textchoice" id="' + i + '">' + this.game.sectors[this.game.board[i].tile].name + '</li>';
    }
  }
  if (cancel_func != null) {
    html += '<li class="textchoice" id="cancel">cancel</li>';
  }
  html += '</ul>';

  this.updateStatus(html);
  this.lockInterface();


  $('.textchoice').off();
  $('.textchoice').on('mouseenter', function () {
    let s = $(this).attr("id");
    if (s != "cancel") {
      imperium_self.showSectorHighlight(s);
    }
  });
  $('.textchoice').on('mouseleave', function () {
    let s = $(this).attr("id");
    if (s != "cancel") {
      imperium_self.hideSectorHighlight(s);
    }
  });
  $('.textchoice').on('click', function () {

    if (!imperium_self.mayUnlockInterface()) {
      salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
      return;
    }
    imperium_self.unlockInterface();


    let action = $(this).attr("id");

    if (action != "cancel") {
      imperium_self.hideSectorHighlight(action);
    }

    if (action == "cancel") {
      cancel_func();
      return 0;
    }

    imperium_self.updateStatus("");
    mycallback(imperium_self.game.board[action].tile);

  });
}





playerSelectChoice(msg, choices, elect = "other", mycallback = null) {

  let imperium_self = this;

  let html = '<div class="sf-readable">' + msg + '</div>';
  html += '<ul>';

  for (let i = 0; i < choices.length; i++) {
    if (elect == "player") {
      html += '<li class="textchoice" id="' + choices[i] + '">' + this.returnFaction(choices[i]) + '</li>';
    }
    if (elect == "planet") {
      html += '<li class="textchoice" id="' + choices[i] + '">' + this.game.planets[choices[i]].name + '</li>';
    }
    if (elect == "sector") {
      html += '<li class="textchoice" id="' + choices[i] + '">' + this.game.sectors[this.game.board[choices[i]].tile].name + '</li>';
    }
    if (elect == "other") {
      html += '<li class="textchoice" id="' + i + '">' + choices[i] + '</li>';
    }
  }
  html += '</ul>';

  this.updateStatus(html);

  this.lockInterface();

  $('.textchoice').off();
  $('.textchoice').on('click', function () {

    if (!imperium_self.mayUnlockInterface()) {
      salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
      return;
    }
    imperium_self.unlockInterface();

    let action = $(this).attr("id");
    mycallback(action);

  });

}










playerSelectPlanetWithFilter(msg, filter_func, mycallback = null, cancel_func = null) {

  let imperium_self = this;

  let html = '<div class="sf-readable">' + msg + '</div>';
  html += '<ul>';

  for (let i in this.game.planets) {
    if (this.game.planets[i].tile != "") {
      if (filter_func(i) == 1) {
        html += '<li class="textchoice" id="' + i + '">' + this.game.planets[i].name + '</li>';
      }
    }
  }
  if (cancel_func != null) {
    html += '<li class="textchoice" id="cancel">cancel</li>';
  }
  html += '</ul>';

  this.updateStatus(html);

  this.lockInterface();

  $('.textchoice').off();
  $('.textchoice').on('mouseenter', function () {
    let s = $(this).attr("id");
    if (s != "cancel") {
      imperium_self.showPlanetCard(imperium_self.game.planets[s].tile, imperium_self.game.planets[s].idx);
      imperium_self.showSectorHighlight(imperium_self.game.planets[s].tile);
    }
  });
  $('.textchoice').on('mouseleave', function () {
    let s = $(this).attr("id");
    if (s != "cancel") {
      imperium_self.hidePlanetCard(imperium_self.game.planets[s].tile, imperium_self.game.planets[s].idx);
      imperium_self.hideSectorHighlight(imperium_self.game.planets[s].tile);
    }
  });
  $('.textchoice').on('click', function () {

    if (!imperium_self.mayUnlockInterface()) {
      salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
      return;
    }
    imperium_self.unlockInterface();


    let action = $(this).attr("id");
    if (action != "cancel") {
      imperium_self.hidePlanetCard(imperium_self.game.planets[action].tile, imperium_self.game.planets[action].idx);
      imperium_self.hideSectorHighlight(imperium_self.game.planets[action].tile);
    }

    if (action == "cancel") {
      cancel_func();
      imperium_self.hideSectorHighlight(action);
      return 0;
    }

    imperium_self.updateStatus("");
    imperium_self.hideSectorHighlight(action);
    mycallback(action);

  });
}




playerSelectUnitInSectorWithFilter(msg, sector, filter_func, mycallback = null, cancel_func = null) {

  let imperium_self = this;
  let unit_array = [];
  let sector_array = [];
  let planet_array = [];
  let unit_idx = [];
  let exists_unit = 0;

  let html = '<div class="sf-readable">' + msg + '</div>';
  html += '<ul>';

  let sys = this.returnSectorAndPlanets(sector);

  for (let k = 0; k < sys.s.units[imperium_self.game.player - 1].length; k++) {
    if (filter_func(sys.s.units[imperium_self.game.player - 1][k])) {
      unit_array.push(sys.s.units[imperium_self.game.player - 1][k]);
      sector_array.push(sector);
      planet_array.push(-1);
      unit_idx.push(k);
      exists_unit = 1;
      html += '<li class="textchoice" id="' + (unit_array.length - 1) + '">' + sys.s.name + ' - ' + unit_array[unit_array.length - 1].name + '</li>';
    }
  }

  for (let p = 0; p < sys.p.length; p++) {
    for (let k = 0; k < sys.p[p].units[imperium_self.game.player - 1].length; k++) {
      if (filter_func(sys.p[p].units[imperium_self.game.player - 1][k])) {
        unit_array.push(sys.p[p].units[imperium_self.game.player - 1][k]);
        sector_array.push(sector);
        planet_array.push(p);
        unit_idx.push(k);
        exists_unit = 1;
        html += '<li class="textchoice" id="' + (unit_array.length - 1) + '">' + sys.s.sector + ' / ' + sys.p[p].name + " - " + unit_array[unit_array.length - 1].name + '</li>';
      }
    }
  }

  if (exists_unit == 0) {
    html += '<li class="textchoice" id="none">no unit available</li>';
  }
  if (cancel_func != null) {
    html += '<li class="textchoice" id="cancel">cancel</li>';
  }
  html += '</ul>';

  this.updateStatus(html);

  $('.textchoice').off();
  //    $('.textchoice').on('mouseenter', function() { 
  //      let s = $(this).attr("id"); 
  //      imperium_self.showPlanetCard(imperium_self.game.planets[s].tile, imperium_self.game.planets[s].idx); 
  //      imperium_self.showSectorHighlight(imperium_self.game.planets[s].tile);
  //    });
  //    $('.textchoice').on('mouseleave', function() { 
  //      let s = $(this).attr("id");
  //      imperium_self.hidePlanetCard(imperium_self.game.planets[s].tile, imperium_self.game.planets[s].idx); 
  //      imperium_self.hideSectorHighlight(imperium_self.game.planets[s].tile);
  //    });

  this.lockInterface();

  $('.textchoice').on('click', function () {

    if (!imperium_self.mayUnlockInterface()) {
      salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
      return;
    }
    imperium_self.unlockInterface();


    let action = $(this).attr("id");
    //      imperium_self.hidePlanetCard(imperium_self.game.planets[action].tile, imperium_self.game.planets[action].idx); 
    //      imperium_self.hideSectorHighlight(imperium_self.game.planets[action].tile);

    if (action === "cancel") {
      cancel_func();
      imperium_self.hideSectorHighlight(action);
      return 0;
    }
    if (action === "none") {
      let unit_to_return = { sector: "", planet_idx: "", unit_idx: -1, unit: null }
      mycallback(unit_to_return);
      return;
    }

    let unit_to_return = { sector: sector_array[action], planet_idx: planet_array[action], unit_idx: unit_idx[action], unit: unit_array[action] }
    //      imperium_self.hideSectorHighlight(action);

    imperium_self.updateStatus("");
    mycallback(unit_to_return);

  });
}






playerSelectUnitWithFilter(msg, filter_func, mycallback = null, cancel_func = null) {

  let imperium_self = this;
  let unit_array = [];
  let sector_array = [];
  let planet_array = [];
  let unit_idx = [];
  let exists_unit = 0;

  let html = '<div class="sf-readable">' + msg + '</div>';
  html += '<ul>';

  for (let i in this.game.sectors) {

    let sys = this.returnSectorAndPlanets(i);
    let sector = i;

    for (let k = 0; k < sys.s.units[imperium_self.game.player - 1].length; k++) {
      if (filter_func(sys.s.units[imperium_self.game.player - 1][k])) {
        unit_array.push(sys.s.units[imperium_self.game.player - 1][k]);
        sector_array.push(sector);
        planet_array.push(-1);
        unit_idx.push(k);
        exists_unit = 1;
        html += '<li class="textchoice" id="' + (unit_array.length - 1) + '">' + sys.s.name + ' - ' + unit_array[unit_array.length - 1].name + '</li>';
      }
    }

    for (let p = 0; p < sys.p.length; p++) {
      for (let k = 0; k < sys.p[p].units[imperium_self.game.player - 1].length; k++) {
        if (filter_func(sys.p[p].units[imperium_self.game.player - 1][k])) {
          unit_array.push(sys.p[p].units[imperium_self.game.player - 1][k]);
          sector_array.push(sector);
          planet_array.push(p);
          unit_idx.push(k);
          exists_unit = 1;
          html += '<li class="textchoice" id="' + (unit_array.length - 1) + '">' + sys.s.sector + ' / ' + sys.p[p].name + " - " + unit_array[unit_array.length - 1].name + '</li>';
        }
      }
    }

  }
  if (exists_unit == 0) {
    html += '<li class="textchoice" id="none">no unit available</li>';
  }
  if (cancel_func != null) {
    html += '<li class="textchoice" id="cancel">cancel</li>';
  }
  html += '</ul>';

  this.updateStatus(html);

  this.lockInterface();

  $('.textchoice').off();
  //    $('.textchoice').on('mouseenter', function() { 
  //      let s = $(this).attr("id"); 
  //      imperium_self.showPlanetCard(imperium_self.game.planets[s].tile, imperium_self.game.planets[s].idx); 
  //      imperium_self.showSectorHighlight(imperium_self.game.planets[s].tile);
  //    });
  //    $('.textchoice').on('mouseleave', function() { 
  //      let s = $(this).attr("id");
  //      imperium_self.hidePlanetCard(imperium_self.game.planets[s].tile, imperium_self.game.planets[s].idx); 
  //      imperium_self.hideSectorHighlight(imperium_self.game.planets[s].tile);
  //    });
  $('.textchoice').on('click', function () {

    if (!imperium_self.mayUnlockInterface()) {
      salert("The game engine is currently processing moves related to another player's move. Please wait a few seconds and reload your browser.");
      return;
    }
    imperium_self.unlockInterface();


    let action = $(this).attr("id");
    //      imperium_self.hidePlanetCard(imperium_self.game.planets[action].tile, imperium_self.game.planets[action].idx); 
    //      imperium_self.hideSectorHighlight(imperium_self.game.planets[action].tile);

    if (action === "cancel") {
      cancel_func();
      imperium_self.hideSectorHighlight(action);
      return 0;
    }
    if (action === "none") {
      console.log("NONE!");
      let unit_to_return = { sector: "", planet_idx: "", unit_idx: -1, unit: null }
      mycallback(unit_to_return);
      return;
    }

    let unit_to_return = { sector: sector_array[action], planet_idx: planet_array[action], unit_idx: unit_idx[action], unit: unit_array[action] }
    //      imperium_self.hideSectorHighlight(action);

    imperium_self.updateStatus("");
    mycallback(unit_to_return);

  });
}





playerSelectUnitInSectorFilter(msg, sector, filter_func, mycallback = null, cancel_func = null) {

  let imperium_self = this;
  let sys = this.returnSectorAndPlanets(sector);

  let html = '<div class="sf-readable">' + msg + '</div>';
  html += '<ul>';

  for (let i = 0; i < this.game.players_info.length; i++) {
    for (let ii = 0; ii < sys.s.units[i].length; ii++) {
      if (filter_func(sys.s.units[i][ii]) == 1) {
        html += '<li class="textchoice" id="' + sector + '_' + i + '_' + i + '">' + this.returnFaction((i + 1)) + " - " + sys.s.units[i][ii].name + '</li>';
      }
    }
  }
  if (cancel_func != null) {
    html += '<li class="textchoice" id="cancel">cancel</li>';
  }
  html += '</ul>';

  this.updateStatus(html);

  $('.textchoice').off();
  $('.textchoice').on('click', function () {

    let action = $(this).attr("id");

    if (action == "cancel") {
      cancel_func();
      return 0;
    }

    let tmpar = action.split("_");

    let s = tmpar[0];
    let p = tmpar[1];
    let unitidx = tmpar[2];

    mycallback({ sector: s, player: p, unitidx: unitidx });

  });
}



playerDiscardActionCards(num) {

  let imperium_self = this;

  if (num < 0) { imperium_self.endTurn(); }

  let html = "<div class='sf-readable'>You must discard <div style='display:inline' class='totalnum' id='totalnum'>" + num + "</div> action card"; if (num > 1) { html += 's'; }; html += ':</div>';
  html += '<ul>';
  let ac_in_hand = this.returnPlayerActionCards(imperium_self.game.player);

  for (let i = 0; i < ac_in_hand.length; i++) {
    html += '<li class="textchoice" id="' + i + '">' + this.action_cards[ac_in_hand[i]].name + '</li>';
  }
  html += '</ul>';

  this.updateStatus(html);

  $('.textchoice').off();
  $('.textchoice').on('mouseenter', function () { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.showActionCard(ac_in_hand[s]); } });
  $('.textchoice').on('mouseleave', function () { let s = $(this).attr("id"); if (s != "cancel") { imperium_self.hideActionCard(ac_in_hand[s]); } });
  $('.textchoice').on('click', function () {

    let action2 = $(this).attr("id");

    num--;

    $('.totalnum').html(num);
    $(this).remove();

    imperium_self.game.players_info[imperium_self.game.player - 1].action_cards_played.push(ac_in_hand[action2]);
    imperium_self.addMove("lose\t" + imperium_self.game.player + "\taction_cards\t1");

    if (num == 0) {
      imperium_self.updateStatus("discarding...");
      imperium_self.endTurn();
    }

  });

}




