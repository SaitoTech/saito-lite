
  returnState() {
 
    let state = {};
 
        state.speaker = 1;
        state.round = 0;
        state.turn = 1;
        state.round_scoring = 0;
        state.events = {};

	//
	// these are the laws, cards, etc. in force
	//
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
        state.agendas_per_round = 2;
        state.how_voted_on_agenda = [];
        state.voting_on_agenda = 0;

        state.temporary_assignments = ["all"]; // all = any units
        state.temporary_rerolls = 0; // 100 = unlimited


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


    return state;
  }


