

    //////////////
    // Blockade //
    //////////////
    if (card == "blockade") {

      //
      // COMMUNITY
      //
      if (this.game.state.events.optional.berlinagreement == 1) {
        this.updateLog("Berlin Agreement prevents Blockade.");
        return 1;
      }


      if (this.game.player == 1) {
        this.updateStatus("<div class='status-message' id='status-message'>US is responding to Blockade</div>");
        return 0;
      }
      if (this.game.player == 2) {

        this.addMove("resolve\tblockade");

        let twilight_self = this;
        let available = 0;

        for (let i = 0; i < this.game.deck[0].hand.length; i++) {
          if (this.game.deck[0].hand[i] != "china") {
            let avops = this.modifyOps(this.game.deck[0].cards[this.game.deck[0].hand[i]].ops, this.game.deck[0].hand[i], this.game.player, 0);
            if (avops >= 3) { available = 1; }
          }
        }

        if (available == 0) {
          this.updateStatus("<div class='status-message' id='status-message'>Blockade played: no cards available to discard.</div>");
          this.addMove("remove\tus\tus\twestgermany\t"+this.countries['westgermany'].us);
          this.addMove("notify\tUS removes all influence from West Germany");
          this.removeInfluence("westgermany", this.countries['westgermany'].us, "us");
          this.endTurn();
          return 0;
        }

        this.updateStatus('<div class="status-message" id="status-message"><span>Blockade triggers:</span><ul><li class="card" id="discard">discard 3 OP card</li><li class="card" id="remove">remove all US influence in W. Germany</li></ul></div>');
        twilight_self.addShowCardEvents(function(action) {

          if (action == "discard") {
            let choicehtml = '<div class="status-message" id="status-message"><span>Choose a card to discard:</span><ul>';
            for (let i = 0; i < twilight_self.game.deck[0].hand.length; i++) {
              if (twilight_self.modifyOps(twilight_self.game.deck[0].cards[twilight_self.game.deck[0].hand[i]].ops, twilight_self.game.deck[0].hand[i], twilight_self.game.player, 0) >= 3 && twilight_self.game.deck[0].hand[i] != "china") {
                choicehtml += '<li class="card showcard" id="'+twilight_self.game.deck[0].hand[i]+'">'+twilight_self.game.deck[0].cards[twilight_self.game.deck[0].hand[i]].name+'</li>';
              }
            }
            choicehtml += '</ul></div>';
            twilight_self.updateStatus(choicehtml);
            twilight_self.addShowCardEvents(function(card) {
              twilight_self.removeCardFromHand(card);
                twilight_self.addMove("notify\tus discarded "+card);
              twilight_self.endTurn();
              return 0;
            });

          }
          if (action == "remove") {
            twilight_self.updateStatus("<div class='status-message' id='status-message'>Blockade played: no cards available to discard.</div>");
            twilight_self.addMove("remove\tus\tus\twestgermany\t"+twilight_self.countries['westgermany'].us);
            twilight_self.removeInfluence("westgermany", twilight_self.countries['westgermany'].us, "us");
            twilight_self.endTurn();
            return 0;
          }

        });

        return 0;
      }
    }



