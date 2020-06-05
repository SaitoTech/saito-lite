  

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

    obj = this.addEvents(obj);
    this.strategy_cards[name] = obj;

  }  


