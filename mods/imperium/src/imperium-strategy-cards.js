  

  //
  // NOTE: this.game.strategy_cards --> is an array that is used in combination with
  // this.game.strategy_cards_bonus to add trade goods to cards that are not selected
  // in any particular round.
  //
  returnStrategyCards() {
    return this.strategy_cards;
  }
  
  importStrategyCard(name, obj) {

    if (obj.name == null) 	{ obj.name = "Strategy Card"; }
    if (obj.rank == null) 	{ obj.rank = 1; }


    if (obj.returnCardImage == null) {
      obj.returnCardImage = function() {
        return `
          <div class="strategy_card" id="${name}">
	    <img class="strategy_card_img" id="${name}" src="/imperium/img${obj.img}" style="width:100%">
	    <div class="strategy_card_text">${obj.text}</div>
	  </div>
        `;
      };
    }


    obj = this.addEvents(obj);
    this.strategy_cards[name] = obj;

  }  


  playStrategyCardPrimary(player, card) {
    for (let i = 0; i < this.game.players_info.length; i++) {
      if (this.strategy_cards[card]) {
	this.strategy_cards[card].strategyPrimaryEvent(this, (i+1), player);
      }
    }
    return 0;
  }

  playStrategyCardSecondary(player, card) {
    for (let i = 0; i < this.game.players_info.length; i++) {
      if (this.strategy_cards[card]) {
	this.strategy_cards[card].strategySecondaryEvent(this, (i+1), player);
      }
    }
    return 0;
  }

  playStrategyCardTertiary(player, card) {
    for (let i = 0; i < this.game.players_info.length; i++) {
      if (this.strategy_cards[card]) {
	this.strategy_cards[card].strategyTertiaryEvent(this, (i+1), player);
      }
    }
    return 0;
  }



