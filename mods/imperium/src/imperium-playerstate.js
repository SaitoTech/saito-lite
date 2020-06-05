  
  
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

      //
      // faction gameplay modifiers 
      //
      players[i].deep_space_conduits = 0; // treat all systems adjacent to activated system
      players[i].resupply_stations = 0; // gain trade goods on system activation if contains ships 
      players[i].turn_nullification = 0; // after player activates system with ships, can end turn ...
 
      //
      // roll modifiers
      //
      players[i].space_combat_roll_modifier 	= 0;
      players[i].ground_combat_roll_modifier 	= 0;
      players[i].pds_combat_roll_modifier 	= 0;

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
  
  
  
