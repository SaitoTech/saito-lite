


    //
    // Ask Not What Your Country Can Do For You
    //
    if (card == "asknot") {

      if (this.game.player == 1) {
        this.updateStatus("<div class='status-message' id='status-message'>Waiting for US to play Ask Not What Your Country Can Do For You</div>");
        return 0;

      }
      if (this.game.player == 2) {

        var twilight_self = this;
        let cards_discarded = 0;

        let cards_to_discard = 0;
        let user_message = "<div class='status-message' id='status-message'>Select cards to discard:<ul>";
        for (let i = 0; i < this.game.deck[0].hand.length; i++) {
          if (this.game.deck[0].hand[i] != "china" && this.game.deck[0].hand[i] != this.game.state.headline_opponent_card && this.game.deck[0].hand != this.game.state.headline_card) {
            user_message += '<li class="card showcard card_'+this.game.deck[0].hand[i]+'" id="'+this.game.deck[0].hand[i]+'">'+this.game.deck[0].cards[this.game.deck[0].hand[i]].name+'</li>';
            cards_to_discard++;
          }
        }

        if (cards_to_discard == 0) {
          twilight_self.addMove("notify\tUS has no cards available to discard");
          twilight_self.endTurn();
          return;
        }

        user_message += '</ul> When you are done discarding <span class="card dashed showcard nocard" id="finished">click here</span>.</div>';

        twilight_self.updateStatus(user_message);
        twilight_self.addMove("resolve\tasknot");
        twilight_self.addShowCardEvents(function(action2) {

          if (action2 == "finished") {

	    //
	    // cards to deal first
	    //
	    let cards_to_deal_before_reshuffle = cards_discarded;
	    let cards_to_deal_after_reshuffle = 0;
	    
            if (cards_to_deal_before_reshuffle > twilight_self.game.deck[0].crypt.length) {
	      cards_to_deal_before_reshuffle = twilight_self.game.deck[0].crypt.length;
	      cards_to_deal_after_reshuffle = cards_discarded - cards_to_deal_before_reshuffle;
	    }

            //
            // if Aldrich Ames is active, US must reveal cards
            //
            if (twilight_self.game.state.events.aldrich == 1) {
              twilight_self.addMove("aldrichreveal\tus");
            }

	    if (cards_to_deal_after_reshuffle > 0) {
              twilight_self.addMove("DEAL\t1\t2\t"+cards_to_deal_after_reshuffle);
	    }

            //
            // are there enough cards available, if not, reshuffle
            //
            if (cards_discarded > twilight_self.game.deck[0].crypt.length) {

              let discarded_cards = twilight_self.returnDiscardedCards();

              //
              // shuttle diplomacy
              //
              if (this.game.state.events.shuttlediplomacy == 1) {
                if (discarded_cards['shuttle'] != undefined) {
                  delete discarded_cards['shuttle'];
                }
              }


              if (Object.keys(discarded_cards).length > 0) {

                //
                // shuffle in discarded cards
                //
                twilight_self.addMove("SHUFFLE\t1");
                twilight_self.addMove("DECKRESTORE\t1");
                twilight_self.addMove("DECKENCRYPT\t1\t2");
                twilight_self.addMove("DECKENCRYPT\t1\t1");
                twilight_self.addMove("DECKXOR\t1\t2");
                twilight_self.addMove("DECKXOR\t1\t1");
                twilight_self.addMove("flush\tdiscards"); // opponent should know to flush discards as we have
                twilight_self.addMove("DECK\t1\t"+JSON.stringify(discarded_cards));
                twilight_self.addMove("DECKBACKUP\t1");
                twilight_self.updateLog("cards remaining: " + twilight_self.game.deck[0].crypt.length);
                twilight_self.updateLog("Shuffling discarded cards back into the deck...");

              }
            }

            twilight_self.addMove("DEAL\t1\t2\t"+cards_to_deal_before_reshuffle);
            twilight_self.endTurn();

          } else {
            cards_discarded++;
            let id_to_remove = ".card_"+action2;
            $(id_to_remove).hide();
            twilight_self.removeCardFromHand(action2);
            twilight_self.addMove("discard\tus\t"+action2);
          }
        });

      }

      return 0;

    }

