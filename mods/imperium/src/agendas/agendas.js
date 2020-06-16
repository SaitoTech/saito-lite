

  this.importAgendaCard('regulated-bureaucracy', {
  	name : "Regulated Bureaucracy" ,
  	type : "Law" ,
  	text : "Players may have a maximum of 3 action cards in their hands at all times" ,
        onPass : function(imperium_self, players_in_favour, players_opposed, votes_for, votes_against, mycallback) {
	  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    imperium_self.game.players_info[i].action_card_limit = 3;
	  }
	  mycallback();
	},
  });

  this.importAgendaCard('fleet-limitations', {
  	name : "Fleet Limitations" ,
  	type : "Law" ,
  	text : "Players may have a maximum of four tokens in their fleet supply." ,
  	img : "/imperium/img/agenda_card_template.png" ,
        onPass : function(imperium_self, players_in_favour, players_opposed, votes_for, votes_against, mycallback) {
	  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
	    imperium_self.game.players_info[i].fleet_supply_limit = 4;
	    if (imperium_self.game.players_info[i].fleet_supply >= 4) { imperium_self.game.players_info[i].fleet_supply = 4; }
	  }
	  mycallback();
	},
  });
  this.importAgendaCard('restricted-conscription', {
  	name : "Restricted Conscription" ,
  	type : "Law" ,
  	text : "Production cost for infantry and fighters is 1 rather than 0.5 resources" ,
  	img : "/imperium/img/agenda_card_template.png" ,
        onPass : function(imperium_self, players_in_favour, players_opposed, votes_for, votes_against, mycallback) {
	  imperium_self.units["infantry"].cost = 1;
	  imperium_self.units["fighter"].cost = 1;
	  mycallback();
	},
  });
  this.importAgendaCard('wormhole-travel-ban', {
  	name : "Wormhole Travel Ban" ,
  	type : "Law" ,
  	text : "All invasions of unoccupied planets require conquering 1 infantry" ,
  	img : "/imperium/img/agenda_card_template.png" ,
        onPass : function(imperium_self, players_in_favour, players_opposed, votes_for, votes_against, mycallback) {
	  imperium_self.game.state.wormholes_open = 0;
	  mycallback();
	},
  });


