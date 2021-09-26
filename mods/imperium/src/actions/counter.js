
    this.importActionCard('sabotage1', {
  	name : "Sabotage" ,
  	type : "counter" , 
 	text : "When another player plays an action card, you may cancel that action card" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

console.log("QUEUE: " + JSON.stringify(imperium_self.game.queue));

	  //
	  // this runs in actioncard post...
	  //
	  for (let i = imperium_self.game.queue.length-1; i >= 0; i--) {
	    if (imperium_self.game.queue[i].indexOf("action_card_") >= 0) {
	      let removed_previous = 0;
	      if (imperium_self.game.queue[i].indexOf("action_card_post") == 0) { removed_previous = 1; }
console.log("removing: " + JSON.stringify(imperium_self.game.queue[i]));
	      if (imperium_self.game.queue[i].indexOf("sabotage") > 0) { removed_previous = 0; }
	      if (imperium_self.game.queue[i].indexOf("resolve") != 0) {
	        imperium_self.game.queue.splice(i, 1);
	      }
	      if (removed_previous == 1) { 
	        imperium_self.removeConfirmsNeeded();
	        imperium_self.updateLog(imperium_self.returnFaction(action_card_player) + " plays Sabotage!");
		return 1;
	      }
	    }
	  }

	  return 1;
	}
    });
    this.importActionCard('sabotage2', {
  	name : "Sabotage" ,
  	type : "counter" , 
 	text : "When another player plays an action card, you may cancel that action card" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

console.log("QUEUE: " + JSON.stringify(imperium_self.game.queue));

	  //
	  // this runs in actioncard post...
	  //
	  for (let i = imperium_self.game.queue.length-1; i >= 0; i--) {
	    if (imperium_self.game.queue[i].indexOf("action_card_") >= 0) {
	      let removed_previous = 0;
	      if (imperium_self.game.queue[i].indexOf("action_card_post") == 0) { removed_previous = 1; }
console.log("removing: " + JSON.stringify(imperium_self.game.queue[i]));
	      if (imperium_self.game.queue[i].indexOf("sabotage") > 0) { removed_previous = 0; }
	      if (imperium_self.game.queue[i].indexOf("resolve") != 0) {
	        imperium_self.game.queue.splice(i, 1);
	      }
	      if (removed_previous == 1) { 
	        imperium_self.removeConfirmsNeeded();
	        imperium_self.updateLog(imperium_self.returnFaction(action_card_player) + " plays Sabotage!");
		return 1;
	      }
	    }
	  }

	  return 1;
	}
    });
    this.importActionCard('sabotage3', {
  	name : "Sabotage" ,
  	type : "counter" , 
 	text : "When another player plays an action card, you may cancel that action card" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

console.log("QUEUE: " + JSON.stringify(imperium_self.game.queue));

	  //
	  // this runs in actioncard post...
	  //
	  for (let i = imperium_self.game.queue.length-1; i >= 0; i--) {
	    if (imperium_self.game.queue[i].indexOf("action_card_") >= 0) {
	      let removed_previous = 0;
	      if (imperium_self.game.queue[i].indexOf("action_card_post") == 0) { removed_previous = 1; }
console.log("removing: " + JSON.stringify(imperium_self.game.queue[i]));
	      if (imperium_self.game.queue[i].indexOf("sabotage") > 0) { removed_previous = 0; }
	      if (imperium_self.game.queue[i].indexOf("resolve") != 0) {
	        imperium_self.game.queue.splice(i, 1);
	      }
	      if (removed_previous == 1) { 
	        imperium_self.removeConfirmsNeeded();
	        imperium_self.updateLog(imperium_self.returnFaction(action_card_player) + " plays Sabotage!");
		return 1;
	      }
	    }
	  }

	  return 1;
	}
    });
    this.importActionCard('sabotage4', {
  	name : "Sabotage" ,
  	type : "counter" , 
 	text : "When another player plays an action card, you may cancel that action card" ,
	playActionCard : function(imperium_self, player, action_card_player, card) {

	  //
	  // this runs in actioncard post...
	  //
	  for (let i = imperium_self.game.queue.length-1; i >= 0; i--) {
	    if (imperium_self.game.queue[i].indexOf("action_card_") >= 0) {
	      let removed_previous = 0;
	      if (imperium_self.game.queue[i].indexOf("action_card_post") == 0) { removed_previous = 1; }
	      if (imperium_self.game.queue[i].indexOf("sabotage") > 0) { removed_previous = 0; }
	      if (imperium_self.game.queue[i].indexOf("resolve") != 0) {
	        imperium_self.game.queue.splice(i, 1);
	      }
	      if (removed_previous == 1) { 
	        imperium_self.removeConfirmsNeeded();
	        imperium_self.updateLog(imperium_self.returnFaction(action_card_player) + " plays Sabotage!");
		return 1;
	      }
	    }
	  }

	  return 1;
	}
    });

