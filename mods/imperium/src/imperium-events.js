



  returnEventObjects(player) {

    // techs
    // factions
    // laws
    // secret-objectives
    // agendas

    let z = [];

    //
    // all player techs
    //
    for (let i = 0; i < this.game.players_info.length; i++) {
      for (let j = 0; j < this.game.players_info[i].tech.length; j++) {
	if (this.tech[this.game.players_info[i].tech[j]] != undefined) {
          z.push(this.tech[this.game.players_info[i].tech[j]]);
	} else {
console.log("MISSING TECH: " + this.game.players_info[i].tech[j]);
	}
      }
    }

    //
    // all factions in-play
    //
    for (let i = 0; i < this.game.players_info.length; i++) {
      if (this.factions[this.game.players_info[i].faction] != undefined) {
        z.push(this.factions[this.game.players_info[i].faction]);
      } else {
console.log("MISSING FACTION: " + this.game.players_info[i].faction);
      }
    }

    return z;

  }



  addEvents(obj) {

    ///////////////////////
    // game state events //
    ///////////////////////
    //
    // these events run at various points of the game, such as at the start of the game or
    // on a new turn. they should be asynchronous (not require user input) and thus do not
    // require a trigger - every function is run every time the game reaches this state..
    //
    if (obj.initialize == null) {
      obj.initialize = function(imperium_self, player) { return 0; }
    }
    if (obj.upgradeUnit == null) {
      obj.upgradeUnit = function(imperium_self, player, unit) { return unit; }
    }
    if (obj.unitDestroyed == null) {
      obj.unitDestroyed = function(imperium_self, player, unit) { return 0; }
    }
    if (obj.onNewRound == null) {
      obj.onNewRound = function(imperium_self, player, mycallback) { return 0; }
    }
    if (obj.onNewTurn == null) {
      obj.onNewTurn = function(imperium_self, player, mycallback) { return 0; }
    }


    ////////////////////
    // strategy cards //
    ////////////////////
    if (obj.strategyPrimaryEvent == null) {
      obj.strategyPrimaryEvent = function(imperium_self, player, card_player) { return 0; }
    }
    if (obj.strategySecondaryEvent == null) {
      obj.strategySecondaryEvent = function(imperium_self, player, card_player) { return 0; }
    }
    if (obj.strategyCardBeforeTriggers == null) {
      obj.strategyCardBeforeTriggers = function(imperium_self, player, card_player, card) { return 0; }
    }
    if (obj.strategyCardBeforeEvent == null) {
      obj.strategyCardBeforeEvent = function(imperium_self, player, card_player, card) { return 0; }
    }
    if (obj.strategyCardAfterTriggers == null) {
      obj.strategyCardAfterTriggers = function(imperium_self, player, card_player, card) { return 0; }
    }
    if (obj.strategyCardAfterEvent == null) {
      obj.strategyCardAfterEvent = function(imperium_self, player, card_player, card) { return 0; }
    }
    if (obj.playersChooseStrategyCardsBeforeTriggers == null) {
      obj.playersChooseStrategyCardsBeforeTriggers = function(imperium_self, player) { return 0; }
    }
    if (obj.playersChooseStrategyCardsBeforeEvent == null) {
      obj.playersChooseStrategyCardsBeforeEvent = function(imperium_self, player) { return 0; }
    }
    if (obj.playersChooseStrategyCardsAfterTriggers == null) {
      obj.playersChooseStrategyCardsAfterTriggers = function(imperium_self, player) { return 0; }
    }
    if (obj.playersChooseStrategyCardsAfterEvent == null) {
      obj.playersChooseStrategyCardsAfterEvent = function(imperium_self, player) { return 0; }
    }



    ////////////////////
    // main turn menu //
    ////////////////////
    //
    // these events modify the menu presented to the player each and every time the player
    // has the option of a turn.
    //
    if (obj.menuOption == null) {
      obj.menuOption = function(imperium_self, player) { return 0; }
    }
    if (obj.menuOptionTrigger == null) {
      obj.menuOptionTrigger = function(imperium_self, player) { return {}; }
    }
    if (obj.menuOptionActivated == null) {
      obj.menuOptionActivated = function(imperium_self, player) { return 0; }
    }




    ////////////////////////
    // synchronous events //
    ////////////////////////
    //
    // these can be called directly from game code itself, ie the imperium-state-updates functions
    // that execute game-code collectively on all player machines. they do not need to be added to
    // the stack for a separate check, but cannot require intervention.
    //

/****
    //
    // unit is destroyed
    //
    if (obj.destroyedUnitTriggersSync == null) {
      obj.destroyedUnitTriggers = function(imperium_self, player, attacker, defender, sector, planet_idx, details) { return 0; }
    }
    if (obj.destroyedUnitEventSync == null) {
      obj.destroyedUnitEvent = function(imperium_self, player, attacker, defender, sector, planet_idx, details) { return 0; }
    }

    //
    // space unit is destroyed
    //
    if (obj.destroyedSpaceUnitTriggersSync == null) {
      obj.destroyedSpaceUnitTriggers = function(imperium_self, player, attacker, defender, sector, planet_idx, details) { return 0; }
    }
    if (obj.destroyedUnitEventSync == null) {
      obj.destroyedUnitEvent = function(imperium_self, player, attacker, defender, sector, planet_idx, details) { return 0; }
    }

    //
    // ground unit is destroyed
    //
    if (obj.destroyedGroundUnitTriggersSync == null) {
      obj.destroyedGroundUnitTriggersSync = function(imperium_self, player, attacker, defender, sector, planet_idx, details) { return 0; }
    }
    if (obj.destroyedGroundUnitEventSync == null) {
      obj.destroyedGroundUnitEventSync = function(imperium_self, player, attacker, defender, sector, planet_idx, details) { return 0; }
    }
****/


    //////////////////////////
    // asynchronous eventsa //
    //////////////////////////
    //
    // these events must be triggered by something that is put onto the stack. they allow users to stop the execution of the game
    // and take arbitrary action. 
    //

    //
    // when action card is played
    //
    if (obj.playActionCardTriggers == null) {
      obj.playActionCardTriggers = function(imperium_self, player, action_card_player, card) { return 0; }
    }
    if (obj.playActionCardEvent == null) {
      obj.playActionCardEvent = function(imperium_self, player, action_card_player, card) { return 0; }
    }


    //
    // when strategy card primary is played
    //
    if (obj.playStrategyCardPrimaryTriggers == null) {
      obj.playStrategyCardPrimaryTriggers = function(imperium_self, player, card) { return 0; }
    }
    if (obj.playStrategyCardPrimaryEvent == null) {
      obj.playStrategyCardPrimaryEvent = function(imperium_self, player, card) { return 0; }
    }


    //
    // when strategy card secondary is played
    //
    if (obj.playStrategyCardSecondaryTriggers == null) {
      obj.playStrategyCardSecondaryTriggers = function(imperium_self, player, card) { return 0; }
    }
    if (obj.playStrategyCardSecondaryEvent == null) {
      obj.playStrategyCardSecondaryEvent = function(imperium_self, player, card) { return 0; }
    }


    //
    // when system is activated
    //
    if (obj.activateSystemTriggers == null) {
      obj.activateSystemTriggers = function(imperium_self, player, sector) { return 0; }
    }
    if (obj.activateSystemEvent == null) {
      obj.postSystemActivation = function(imperium_self, player, sector) { return 0; }
    }

    //
    // when pds combat starts
    //
    if (obj.pdsSpaceDefenseTriggers == null) {
      obj.pdsSpaceDefenseTriggers = function(imperium_self, player, sector) { return 0; }
    }
    if (obj.pdsSpaceDefenseEvent == null) {
      obj.pdsSpaceDefenseEvent = function(imperium_self, player, sector) { return 0; }
    }

    //
    // when space combat round starts
    //
    if (obj.spaceCombatTriggers == null) {
      obj.spaceCombatTriggers = function(imperium_self, player, sector) { return 0; }
    }
    if (obj.spaceCombatEvent == null) {
      obj.spaceCombatEvent = function(imperium_self, player, sector) { return 0; }
    }

    //
    // when bombardment starts
    //
    if (obj.bombardmentTriggers == null) {
      obj.bombardmentTriggers = function(imperium_self, player, sector) { return 0; }
    }
    if (obj.bombardmentEvent == null) {
      obj.bombardmentEvent = function(imperium_self, player, sector) { return 0; }
    }

    //
    // when planetry invasion starts
    //
    if (obj.planetaryDefenseTriggers == null) {
      obj.planetaryDefenseTriggers = function(imperium_self, player, sector, planet_idx) { return 0; }
    }
    if (obj.planetaryDefenseEvent == null) {
      obj.planetaryDefenseEvent = function(imperium_self, player, sector, planet_idx) { return 0; }
    }


    //
    // when ground combat round starts
    //
    if (obj.groundCombatTriggers == null) {
      obj.groundCombatTriggers = function(imperium_self, player, sector, planet_idx) { return 0; }
    }
    if (obj.groundCombatEvent == null) {
      obj.groundCombatEvent = function(imperium_self, player, sector, planet_idx) { return 0; }
    }

    //
    // end of player turn
    //
    if (obj.playerEndTurnTriggers == null) {
      obj.playerEndTurnTriggers = function(imperium_self, player) { return 0; }
    }
    if (obj.playerEndTurnEvent == null) {
      obj.playerEndTurnEvent = function(imperium_self, player) { return 0; }
    }

    return obj;
  
  }



