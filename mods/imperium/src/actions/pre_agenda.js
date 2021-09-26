
    //
    // invisible and unwinnable rider attached to prevent voting
    //
    this.importActionCard('assassinate-representative', {
  	name : "Assassinate Representative" ,
  	type : "pre_agenda" ,
  	text : "Choose a player. That player cannot vote on the Agenda" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (action_card_player == imperium_self.game.player) {

            imperium_self.playerSelectPlayerWithFilter(
              "Select a player who will not be able to vote on this Agenda: " ,
              function(player) {
                if (player != imperium_self.game.player) { return 1; } return 0;
              },
              function(player) {
                imperium_self.addMove("rider\t"+player+"\tassassinate-representative\t-1");
                imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(imperium_self.game.player) + " assassinates the " + imperium_self.returnFactionNickname(player) + " delegate");
                imperium_self.endTurn();
                return 0;
              },
              null,
            );
	  }
	  return 0;
        },
    });




    this.importActionCard('diplomatic-scandal', {
  	name : "Diplomatic Scandal" ,
  	type : "pre_agenda" ,
  	text : "Choose a player. That player loses a maximum of four votes on this agenda" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  if (action_card_player == imperium_self.game.player) {

            imperium_self.playerSelectPlayerWithFilter(
              "Select a player to lose 4 votes: " ,
              function(player) {
                if (player != imperium_self.game.player) { return 1; } return 0;
              },
              function(player) {
                imperium_self.addMove("diplomatic_scandal\t"+imperium_self.game.player+"\t"+player);
                imperium_self.addMove("NOTIFY\t" + imperium_self.returnFaction(imperium_self.game.player) + " unearths scandal concerning the voting representative of " + imperium_self.returnFaction(player));
                imperium_self.endTurn();
                return 0;
              },
              null,
            );
	  }
	  return 0;
        },
        handleGameLoop : function(imperium_self, qe, mv) {

          if (mv[0] == "diplomatic_scandal") {

            let player = parseInt(mv[1]);
            let target = parseInt(mv[2]);
            imperium_self.game.queue.splice(qe, 1);

            imperium_self.game.state.votes_available[target-1] -= 4;
            if (imperium_self.game.state.votes_available[target-1] < 0) { 
              imperium_self.game.state.votes_available[target-1] = 0;
            }

            return 1;
          }

	  return 1;
        }

    });





