
  returnState() {
 
    let state = {};
 
        state.speaker = 1;
        state.round = 0;
        state.turn = 1;
        state.round_scoring = 0;
        state.events = {};
	state.show_tutorials = 0;

	//
	// these are the laws, cards, etc. in force
	//
        state.laws = [];
        state.agendas = [];
	state.vp_target = 14;

	if (this.game.options.game_length) {
	  state.vp_target = parseInt(this.game.options.game_length);
        } 
       
	//
	// riders => who has riders (and is not voting
	// choices => possible outcomes (for/against, players, etc)
	//
        state.riders = [];
        state.choices = [];

	state.action_card_order = "simultaneous";
        state.assign_hits_queue_instruction = "";
        state.assign_hits_to_cancel = "";
        state.active_player_moved = 0;

        state.agendas_voting_information = [];
        state.strategy_cards = [];
        state.strategy_cards_bonus = [];
        state.stage_i_objectives = [];
        state.stage_ii_objectives = [];
        state.secret_objectives = [];
	state.agenda_voting_order = "simultaneous";
        state.votes_available = [];
        state.votes_cast = [];
        state.voted_on_agenda = [];
        state.voting_on_agenda = 0; // record of how people have voted, so action cards may be played
        state.agendas_per_round = 2;
        state.how_voted_on_agenda = [];

        state.temporary_assignments = ["all"]; // all = any units
        state.temporary_rerolls = 0; // 100 = unlimited
        state.temporary_adjacency = [];
	
        state.wormholes_open = 1;
        state.wormholes_adjacent = 0;
        state.temporary_wormholes_adjacent = 0;

        state.space_combat_round = 0;
	state.space_combat_attacker = -1;
	state.space_combat_defender = -1;
        state.space_combat_ships_destroyed_attacker = 0;
        state.space_combat_ships_destroyed_defender = 0;
        state.ground_combat_round = 0;
	state.ground_combat_attacker = -1;
	state.ground_combat_defender = -1;
        state.ground_combat_infantry_destroyed_attacker = 0;
        state.ground_combat_infantry_destroyed_defender = 0;

	state.bombardment_against_cultural_planets = 1;
	state.bombardment_against_industrial_planets = 1;
	state.bombardment_against_hazardous_planets = 1;

	state.pds_limit_per_planet = 2;
	state.pds_limit_total = 4;

	state.retreat_cancelled = 0;

	state.activated_sector = "";
	state.bombardment_sector = "";
	state.bombardment_planet_idx = "";
	state.space_combat_sector = "";
	state.ground_combat_sector = "";
	state.ground_combat_planet_idx = "";

    return state;
  }


