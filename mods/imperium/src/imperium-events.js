



  addEvents(obj) {

    ///////////////////////
    // game state events //
    ///////////////////////
    //
    // these events run at various points of the game, such as at the start of the game or
    // on a new turn. they should be asynchronous (not require user input) and thus do not
    // require a trigger - every function is run every time the game reaches this state..
    //
    if (obj[i].upgradeUnit == null) {
      obj[i].upgradeUnit = function(imperium_self, player, unit) { return unit; }
    }
    if (obj[i].unitDestroyed == null) {
      obj[i].unitDestroyed = function(imperium_self, player, unit) { return 0; }
    }
    if (obj[i].onNewRound == null) {
      obj[i].onNewRound = function(imperium_self, player, mycallback) { return 0; }
    }
    if (obj[i].onNewTurn == null) {
      obj[i].onNewTurn = function(imperium_self, player, mycallback) { return 0; }
    }


    ////////////////////
    // main turn menu //
    ////////////////////
    //
    // these events modify the menu presented to the player each and every time the player
    // has the option of a turn.
    //
    if (obj[i].menuOption == null) {
      obj[i].menuOption = function(imperium_self, player) { return 0; }
    }
    if (obj[i].menuOptionTrigger == null) {
      obj[i].menuOptionTrigger = function(imperium_self, player) { return {}; }
    }
    if (obj[i].menuOptionActivated == null) {
      obj[i].menuOptionActivated = function(imperium_self, player) { return 0; }
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
    if (obj[i].destroyedUnitTriggersSync == null) {
      obj[i].destroyedUnitTriggers = function(imperium_self, player, attacker, defender, sector, planet_idx, details) { return 0; }
    }
    if (obj[i].destroyedUnitEventSync == null) {
      obj[i].destroyedUnitEvent = function(imperium_self, player, attacker, defender, sector, planet_idx, details) { return 0; }
    }

    //
    // space unit is destroyed
    //
    if (obj[i].destroyedSpaceUnitTriggersSync == null) {
      obj[i].destroyedSpaceUnitTriggers = function(imperium_self, player, attacker, defender, sector, planet_idx, details) { return 0; }
    }
    if (obj[i].destroyedUnitEventSync == null) {
      obj[i].destroyedUnitEvent = function(imperium_self, player, attacker, defender, sector, planet_idx, details) { return 0; }
    }

    //
    // ground unit is destroyed
    //
    if (obj[i].destroyedGroundUnitTriggersSync == null) {
      obj[i].destroyedGroundUnitTriggersSync = function(imperium_self, player, attacker, defender, sector, planet_idx, details) { return 0; }
    }
    if (obj[i].destroyedGroundUnitEventSync == null) {
      obj[i].destroyedGroundUnitEventSync = function(imperium_self, player, attacker, defender, sector, planet_idx, details) { return 0; }
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
    if (obj[i].playActionCardTriggers == null) {
      obj[i].playActionCardTriggers = function(imperium_self, player, action_card_player, card) { return 0; }
    }
    if (obj[i].playActionCardEvent == null) {
      obj[i].playActionCardEvent = function(imperium_self, player, action_card_player, card) { return 0; }
    }


    //
    // when strategy card primary is played
    //
    if (obj[i].playStrategyCardPrimaryTriggers == null) {
      obj[i].playStrategyCardPrimaryTriggers = function(imperium_self, player, card) { return 0; }
    }
    if (obj[i].playStrategyCardPrimaryEvent == null) {
      obj[i].playStrategyCardPrimaryEvent = function(imperium_self, player, card) { return 0; }
    }


    //
    // when strategy card secondary is played
    //
    if (obj[i].playStrategyCardSecondaryTriggers == null) {
      obj[i].playStrategyCardSecondaryTriggers = function(imperium_self, player, card) { return 0; }
    }
    if (obj[i].playStrategyCardSecondaryEvent == null) {
      obj[i].playStrategyCardSecondaryEvent = function(imperium_self, player, card) { return 0; }
    }


    //
    // when system is activated
    //
    if (obj[i].activateSystemTriggers == null) {
      obj[i].activateSystemTriggers = function(imperium_self, player, sector) { return 0; }
    }
    if (obj[i].activateSystemEvent == null) {
      obj[i].postSystemActivation = function(imperium_self, player, sector) { return 0; }
    }

    //
    // when pds combat starts
    //
    if (obj[i].pdsSpaceDefenseTriggers == null) {
      obj[i].pdsSpaceDefenseTriggers = function(imperium_self, player, sector) { return 0; }
    }
    if (obj[i].pdsSpaceDefenseEvent == null) {
      obj[i].pdsSpaceDefenseEvent = function(imperium_self, player, sector) { return 0; }
    }

    //
    // when space combat round starts
    //
    if (obj[i].spaceCombatTriggers == null) {
      obj[i].spaceCombatTriggers = function(imperium_self, player, sector) { return 0; }
    }
    if (obj[i].pdsSpaceDefenseEvent == null) {
      obj[i].pdsSpaceDefenseEvent = function(imperium_self, player, sector) { return 0; }
    }

    //
    // when bombardment starts
    //
    if (obj[i].bombardmentTriggers == null) {
      obj[i].bombardmentTriggers = function(imperium_self, player, sector) { return 0; }
    }
    if (obj[i].bombardmentEvent == null) {
      obj[i].bombardmentEvent = function(imperium_self, player, sector) { return 0; }
    }

    //
    // when planetry invasion starts
    //
    if (obj[i].planetaryDefenseTriggers == null) {
      obj[i].planetaryDefenseTriggers = function(imperium_self, player, sector, planet_idx) { return 0; }
    }
    if (obj[i].planetaryDefenseEvent == null) {
      obj[i].planetaryDefenseEvent = function(imperium_self, player, sector, planet_idx) { return 0; }
    }


    //
    // when ground combat round starts
    //
    if (obj[i].groundCombatTriggers == null) {
      obj[i].groundCombatTriggers = function(imperium_self, player, sector, planet_idx) { return 0; }
    }
    if (obj[i].groundCombatEvent == null) {
      obj[i].groundCombatEvent = function(imperium_self, player, sector, planet_idx) { return 0; }
    }

    return obj;
  
  }



