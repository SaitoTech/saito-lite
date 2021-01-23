

    //
    // Missile Envy
    //
    if (card == "missileenvy") {

      let twilight_self = this;

      let instigator = 1;
      let opponent = "us";
      if (player == "us") { instigator = 2; opponent = "ussr"; }
      this.game.state.events.missileenvy = 1;

      //
      //
      //
      if (this.game.player == instigator) {
        this.updateStatus("<div class='status-message' id='status-message'>Opponent is returning card for Missile Envy</div>");
        return 0;

      }


      //
      // targeted player provided list if multiple options available
      //
      if (this.game.player != instigator && this.game.player != 0) {

        this.addMove("resolve\tmissileenvy");

        let selected_card  = "";
        let selected_ops   = -1;
        let multiple_cards = 0;
        let available_cards = [];

        if (this.game.deck[0].hand.length == 0) {
          this.addMove("notify\t"+opponent.toUpperCase()+" hand contains no cards.");
          this.endTurn();
          return 0;
        }

        for (let i = 0; i < twilight_self.game.deck[0].hand.length; i++) {
          let thiscard = twilight_self.game.deck[0].hand[i];
          if (thiscard != "china" && (!(this.game.state.headline == 1 && (thiscard == this.game.state.headline_opponent_card || thiscard == this.game.state.headline_card)))) {
            available_cards.push(thiscard);
          }
        }

        if (available_cards.length == 0) {
          this.addMove("notify\t"+opponent.toUpperCase()+" hand has no eligible cards.");
          this.endTurn();
          return 0;
        }

        for (let i = 0; i < available_cards.length; i++) {

          let card = this.game.deck[0].cards[available_cards[i]];

          if (this.modifyOps(card.ops) == selected_ops) {
            multiple_cards = 1;
          }

          if (this.modifyOps(card.ops) > selected_ops) {
            selected_ops  = this.modifyOps(card.ops);
            selected_card = available_cards[i];
            multiple_cards = 0;
          }
        }


        if (multiple_cards == 0) {

          //
          // offer highest card
          //
          this.addMove("missileenvy\t"+this.game.player+"\t"+selected_card);
          this.endTurn();

        } else {

          //
          // select highest card
          //
          let user_message = "<span>Select card to give opponent:</span><ul>";
          for (let i = 0; i < available_cards.length; i++) {
            if (this.modifyOps(this.game.deck[0].cards[available_cards[i]].ops) == selected_ops && available_cards[i] != "china") {
              user_message += '<li class="card showcard" id="'+available_cards[i]+'">'+this.game.deck[0].cards[available_cards[i]].name+'</li>';
            }
          }
          user_message += '</ul>';
          this.updateStatus("<div class='status-message' id='status-message'>" + user_message + "</div>");
          twilight_self.addShowCardEvents(function(action2) {

            //
            // offer card
            //
            twilight_self.addMove("missileenvy\t"+twilight_self.game.player+"\t"+action2);
            twilight_self.endTurn();

          });
        }
      }
      return 0;
    }



