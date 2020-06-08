
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

	state.round_of_space_combat = 0;
	state.round_of_ground_combat = 0;

    return state;
  }


