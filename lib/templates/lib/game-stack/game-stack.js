/*********************************************************************************

 GAME STACK v.3

 This is a general parent class for executing basic cryptographic techniques that 
 require stack execution.

 Game object assumed to have the following properties:

   game.locked			<--- game locked
   game.step.latest 		<--- last received step in game  
   game.step.players[player] 	<--- last received step from player
   game.queue			<--- game queue 

**********************************************************************************/

class GameStack {

  constructor() {
    return this;
  }



  executeStack(game, mod) {

    let cont = 1;

    //
    // avoid non-terminal loops
    //
    let loop = 0;
    let loop_length = 0;
    let loop_length_instruction = "";

    //
    // save state
    //
    let game_state = JSON.parse(JSON.stringify(game_self.game));

    //
    // stack execution
    //
    if (game.queue.length > 0) {
      while (game.queue.length > 0 && cont == 1) {

	loop++;
	loop_length = game.queue.length;
	loop_length_instruction = game.queue[game.queue.length-1];

	if (loops_through_queue >= 100) {
          console.log("NON-TERMINAL STACK EXECUTION");
          process.exit();
	}

        let gqe = game.queue.length-1;
        let gmv = game.queue[gqe].split("\t");


        //
        // core game engine
        //
        // * SECUREROLL_COMMIT [player] [random] [move]		<--- everyone checks (move+random) is mystery hash
        // * SECUREROLL_RESPONSE [player] [random]		<--- opponents(s) send random response
        // * SECUREROLL_REQUEST [player] [mystery hash]		<--- player sends hash of move 
        // SHUFFLE [decknum]
        // REQUESTKEYS [decknum] sender recipient keys
        // ISSUEKEYS [decknum] sender recipient keys decklength
        // FLIPCARD [decknum] [cardnum] [poolnum] [player]
        // DEAL [decknum] [player] [num_pf_cards]
        // * SAFEDEAL [decknum] [player] [num_pf_cards]          <--- reshuffles if needed
        // * SAFEFLIPCARD [decknum] [cardnum] [poolnum] [player] <--- reshuffles if needed
        // DECKBACKUP [decknum]
        // DECKRESTORE [decknum]
        // DECKENCRYPT [decknum] [player]
        // DECKXOR [decknum] [player]
        // DECK [decknum] [array of cards]
        // POOL [poolnum]
	// * PAY [currency] [amount] [address]
	// * BALANCE [currency] [address]
	// PLAY [player]
        // RESOLVEFLIP [decknum] [cardnum] [poolnum]
        // RESOLVEDEAL [decknum] recipient cards
        // RESOLVE
        // RESIGN
	// * SETCONFIRMS [num] [opt_array_of_keys]
        // SETVAR [var] [val] [val]
        // OBSERVER [player] [enable]
        // GAMEOVER [msg]
        // NOTIFY [message]
        // * LOG [interface]
        // * LOCK [interface]
	// * UNLOCK [interface]
	// * ACKNOWLEDGE
        //


        if (gmv[0] === "SETVAR") {
	  if (gmv[1]) {
	    if (gmv[3]) {
	      game[gmv[1]][gmv[2]] = gmv[3];
	    } else {
	      if (gmv[2]) {
	        game[gmv[1]] = gmv[2];
	      }
	    }
	  }
          game.queue.splice(gqe, 1);
        }


        if (gmv[0] === "NOTIFY") {
          mod.updateLog(gmv[1]);
          game.queue.splice(gqe, 1);
        }


        if (gmv[0] === "GAMEOVER") {
          mod.updateStatus("Opponent Resigned");
          mod.updateLog("Opponent Resigned");
          return 0;
        }





      }
    }

    return game;
  }










        if (gmv[0] === "RESOLVE") {
          if (gqe == 0) {
            game_self.game.queue = [];
          } else {
            let gle = gqe-1;
            if (game_self.game.queue[gle] === "RESOLVE") {
              game_self.game.queue.splice(gqe, 1);
            } else {
              if (gle <= 0) {
                game_self.game.queue = [];
              } else {
                game_self.game.queue.splice(gle, 2);
              }
            }
          }
        }


        if (gmv[0] == "READY") {
          game_self.game.initializing = 0;
          game_self.game.queue.splice(gqe, 1);
          game_self.saveGame(game_self.game.id);

	  if (game_self.app.modules.isModuleActive("Arcade")) {
	    let arcade_self = game_self.app.modules.returnModule("Arcade");
	    if (arcade_self.initialization_timer == null) {
	      console.log("We seem to have loaded into a READY process while viewing the arcade, but our game is not waiting for the initialization screen, so we should check and show that launch screen.");
	      arcade_self.launchGame(game_self.game.id);
	    }
	  }

        }


        if (gmv[0] === "SHUFFLE") {
          game_self.shuffleDeck(gmv[1]);
          game_self.game.queue.splice(gqe, 1);
        }


        if (gmv[0] === "RESOLVEDEAL") {

          let deckidx = gmv[1];
          let recipient = gmv[2];
          let cards = gmv[3];

          //this.updateLog("resolving deal for "+recipient+"...");

          if (game_self.game.player == recipient) {
            for (let i = 0; i < cards; i++) {
              let newcard = game_self.game.deck[deckidx-1].crypt[i];

              //
              // if we have a key, this is encrypted
              //
              if (game_self.game.deck[deckidx-1].keys[i] != undefined) {
                newcard = game_self.app.crypto.decodeXOR(newcard, game_self.game.deck[deckidx-1].keys[i]);
              }


              newcard = game_self.app.crypto.hexToString(newcard);
              if (! game_self.game.deck[deckidx-1].hand.includes(newcard)) {
                game_self.game.deck[deckidx-1].hand.push(newcard);
              }
            }
          }

          if (gqe == 0) {
            game_self.game.queue = [];
          } else {
            let gle = gqe-1;
            if (gle <= 0) {
              game_self.game.queue = [];
            } else {
              game_self.game.queue.splice(gle, 2);
            }
          }

          //
          // everyone purges their spent keys
          //
          if (game_self.game.issued_keys_deleted == 0) {
            game_self.game.deck[deckidx-1].keys = game_self.game.deck[deckidx-1].keys.splice(cards, game_self.game.deck[deckidx-1].keys.length - cards);
            game_self.game.deck[deckidx-1].crypt = game_self.game.deck[deckidx-1].crypt.splice(cards, game_self.game.deck[deckidx-1].crypt.length - cards);
            game_self.game.issued_keys_deleted = 1;
          }

        }


        if (gmv[0] === "RESOLVEFLIP") {

          let deckidx = gmv[1];
          let cardnum = gmv[2];
          let poolidx = gmv[3];

          //this.updateStatus("Exchanging keys to flip card...");
          //this.updateLog("exchanging keys to flip card...");

          //
          // how many players are going to send us decryption keys?
          //
          let decryption_keys_needed = game_self.game.opponents.length+1;

          //
          // create pool if not exists
          //
          while (game_self.game.pool.length < poolidx) { game_self.addPool(); }

          //
          // if this is the first flip, we add the card to the crypt deck
          // so that we can decrypt them as the keys come in.
          //
          if (game_self.game.pool[poolidx-1].crypt.length == 0) {

            //
            // update cards available to pool
            //
            this.game.pool[poolidx-1].cards = this.game.deck[deckidx-1].cards;

            //
            // copy the card info over from the deck
            //
            for (let z = 0; z < cardnum; z++) {
              this.game.pool[poolidx-1].crypt.push(this.game.deck[deckidx-1].crypt[z]);
              for (let p = 0; p < decryption_keys_needed; p++) {
                this.game.pool[poolidx-1].keys.push([]);
              }
            }
          }

          //this.updateStatus("decrypting cards in deck flip...");

          //
          // now we can get the keys
          //
          game_self.game.queue.splice(gqe, 1);

          for (let i = 0; i < cardnum; i++) {
  
            let nc = game_self.game.pool[poolidx-1].crypt[(0+i)];
            let thiskey = game_self.game.queue[gqe-1-i];

            //
            // add the key
            //
            game_self.game.pool[poolidx-1].keys[(0+i)].push(thiskey);
            if (thiskey == null) {
              // nc does not require decoding
            } else {
              nc = game_self.app.crypto.decodeXOR(nc, thiskey);
            }

            //
            // store card in hand
            //
            game_self.game.pool[poolidx-1].crypt[(0+i)] = nc;
          }

          //
          // now remove from queue
          //
          game_self.game.queue.splice(gqe-cardnum, cardnum);

          //
          // processed one set of keys
          //
          game_self.game.pool[poolidx-1].decrypted++;

          //
          // if everything is handled, purge old deck data
          //
          let purge_deck_and_keys = 0;

          if (game_self.game.pool[poolidx-1].decrypted == decryption_keys_needed) {

            for (let i = 0; i < cardnum; i++) {
              game_self.game.pool[poolidx-1].hand.push(game_self.app.crypto.hexToString(game_self.game.pool[poolidx-1].crypt[0]));
              game_self.game.pool[poolidx-1].crypt.splice(0, 1);
            }

            game_self.game.deck[deckidx-1].keys = game_self.game.deck[deckidx-1].keys.splice(cardnum, game_self.game.deck[deckidx-1].keys.length - cardnum);
            game_self.game.deck[deckidx-1].crypt = game_self.game.deck[deckidx-1].crypt.splice(cardnum, game_self.game.deck[deckidx-1].crypt.length - cardnum);
            cont = 1;

          } else {

            //
            // wait for more decryption keys
            //
            cont = 1;

          }
        }


        if (gmv[0] === "DEAL") {

          let deckidx = gmv[1];
          let recipient = gmv[2];
          let cards = gmv[3];

          //
          // resolvedeal checks this when
          // deleting the keys from its
          // crypt.
          //
          this.game.issued_keys_deleted = 0;

          //this.updateStatus("dealing cards to "+recipient+"...");
          //this.updateLog("dealing cards to "+recipient+"...");

          let total_players = game_self.game.opponents.length+1;

          // if the total players is 1 -- solo game
          if (total_players == 1) {

            // go right to resolving the deal
            game_self.game.queue.push("RESOLVEDEAL\t"+deckidx+"\t"+recipient+"\t"+cards);
            //game_self.game.queue.push("RESOLVEDEAL\t"+deckidx+"\t"+recipient+"\t"+cards);

          } else {

            game_self.game.queue.push("RESOLVEDEAL\t"+deckidx+"\t"+recipient+"\t"+cards);
            for (let i = 1; i < total_players+1; i++) {
              if (i != recipient) {
                game_self.game.queue.push("REQUESTKEYS\t"+deckidx+"\t"+i+"\t"+recipient+"\t"+cards);
              }
            }
          }
        }


        if (gmv[0] === "REQUESTKEYS") {

          let deckidx = gmv[1];
          let sender = gmv[2];
          let recipient = gmv[3];
          let cards = gmv[4];

          //this.updateStatus("Requesting decryption keys to draw cards from deck...");
          //this.updateLog("requesting keys for "+recipient+"...");

          //
          // sender then sends keys
          //
          if (game_self.game.player == sender) {
            game_self.game.turn = [];
            game_self.game.turn.push("RESOLVE");
            for (let i = 0; i < cards; i++) { game_self.game.turn.push(game_self.game.deck[deckidx-1].keys[i]); }
            game_self.game.turn.push("ISSUEKEYS\t"+deckidx+"\t"+sender+"\t"+recipient+"\t"+cards+"\t"+game_self.game.deck[deckidx-1].keys.length);
            game_self.sendMessage("game", {});
          } else {
	  }

          //
          // execution stops
          //
          return 0;

        }



        if (gmv[0] === "ISSUEKEYS") {

          let deckidx = gmv[1];
          let sender = gmv[2];
          let recipient = gmv[3];
          let cards = gmv[4];
          let opponent_deck_length = gmv[5]; // this is telling us how many keys the other player has, so we can coordinate and now double-decrypt
          let keyidx = gqe-cards;

          //this.updateStatus("Issuing decryption keys to fellow players...");
          //this.updateLog("issuing keys to "+recipient+"...");

          game_self.game.queue.splice(gqe, 1);

          let my_deck_length = game_self.game.deck[deckidx-1].crypt.length;

          if (game_self.game.player == recipient && my_deck_length == opponent_deck_length) {
            for (let i = 0; i < cards; i++) {
	      if (game_self.game.queue[keyidx+i] != null) {
                game_self.game.deck[deckidx-1].crypt[i] = game_self.app.crypto.decodeXOR(game_self.game.deck[deckidx-1].crypt[i], game_self.game.queue[keyidx+i]);
	      } else {
	      }
            }
          }

          game_self.game.queue.splice(keyidx, cards);

        }




        //
        // module requires updating
        //
        if (gmv[0] === "DECKBACKUP") {

          //this.updateStatus("Backing up existing deck in preparation for adding new cards...");
          //this.updateLog("deck backup...");
          let deckidx = gmv[1];

          game_self.old_discards = game_self.game.deck[deckidx-1].discards;
          game_self.old_removed = game_self.game.deck[deckidx-1].removed;
          game_self.old_cards = {};
          game_self.old_crypt = [];
          game_self.old_keys = [];
          game_self.old_hand = [];

          for (let i = 0; i < game_self.game.deck[deckidx-1].crypt.length; i++) {
            game_self.old_crypt[i] = game_self.game.deck[deckidx-1].crypt[i];
            game_self.old_keys[i] = game_self.game.deck[deckidx-1].keys[i];
          }
          for (var i in game_self.game.deck[deckidx-1].cards) {
            game_self.old_cards[i] = game_self.game.deck[deckidx-1].cards[i];
          }
          for (let i = 0; i < game_self.game.deck[deckidx-1].hand.length; i++) {
            game_self.old_hand[i] = game_self.game.deck[deckidx-1].hand[i];
          }

          game_self.game.queue.splice(gqe, 1);

        }


        if (gmv[0] === "DECKRESTORE") {

          //this.updateLog("deck restore...");
          let deckidx = gmv[1];

          for (let i = game_self.old_crypt.length - 1; i >= 0; i--) {
            game_self.game.deck[deckidx-1].crypt.unshift(game_self.old_crypt[i]);
            game_self.game.deck[deckidx-1].keys.unshift(game_self.old_keys[i]);
          }
          for (var b in game_self.old_cards) {
            game_self.game.deck[deckidx-1].cards[b] = game_self.old_cards[b];
          }
          for (let i = game_self.old_hand.length - 1; i >= 0; i--) {
            game_self.game.deck[deckidx-1].hand.unshift(game_self.old_hand[i]);
          }

          game_self.game.deck[deckidx-1].removed = game_self.old_removed;
          game_self.game.deck[deckidx-1].discards = game_self.old_discards;

          game_self.old_removed = {};
          game_self.old_discards = {};

          game_self.old_cards = {};
          game_self.old_crypt = [];
          game_self.old_keys = [];
          game_self.old_hand = [];
          game_self.game.queue.splice(gqe, 1);

        }



        if (gmv[0] === "CARDS") {
          //this.updateLog("exchanging cards with opponent...");
          //this.updateStatus("Exchanging cards with opponent...");
          let deckidx = parseInt(gmv[1]);
          game_self.game.queue.splice(gqe, 1);
          for (let i = 0; i < parseInt(gmv[2]); i++) {
            game_self.game.deck[deckidx-1].crypt[(parseInt(gmv[2])-1-i)] = game_self.game.queue[gqe-1-i];
            game_self.game.queue.splice(gqe-1-i, 1);
          }
        }



        //
        // dealing into a pool makes the cards publicly visible to everyone
        //
        if (gmv[0] === "POOL") {

          //this.updateLog("creating public card pool...");
          let poolidx = gmv[1];

          //
          // create deck if not exists
          //
          game_self.resetPool(poolidx-1);

          while (game_self.game.pool.length < poolidx) { game_self.addPool(); }
          game_self.game.queue.splice(gqe, 1);

        }



        if (gmv[0] === "FLIPRESET") {
          let poolidx  = gmv[1];
          while (game_self.game.pool.length < poolidx) { 
	    game_self.addPool();
	  }
          game_self.game.pool[poolidx-1].crypt = [];
          game_self.game.pool[poolidx-1].keys  = [];
          game_self.game.pool[poolidx-1].decrypted = 0;
          game_self.game.queue.splice(gqe, 1);
        }

        if (gmv[0] === "FLIPCARD") {

          let deckidx  = gmv[1];
          let cardnum  = gmv[2];
          let poolidx  = gmv[3];
          let playerid = parseInt(gmv[4]);

          //this.updateStatus("Flipping card from top of deck...");
          //this.updateLog("flipping card from top of deck...");

          //
          // players process 1 by 1
          //
          if (playerid != this.game.player) {
            return 0;
          }

          if (cardnum == 1) {
            //game_self.updateLog("flipping " + cardnum + " card into pool " + poolidx);
          } else {
            //game_self.updateLog("flipping " + cardnum + " cards into pool " + poolidx);
          }

          //
          // create pool if not exists
          //
          while (game_self.game.pool.length < poolidx) { game_self.addPool(); }

          //
          // share card decryption information
          //
          game_self.game.turn = [];
          game_self.game.turn.push("RESOLVE");
          for (let i = 0; i < cardnum && i < game_self.game.deck[deckidx-1].crypt.length; i++) {
            game_self.game.turn.push(game_self.game.deck[deckidx-1].keys[i]);
          }
          game_self.game.turn.push("RESOLVEFLIP\t"+deckidx+"\t"+cardnum+"\t"+poolidx);

          let extra = {};

          game_self.sendMessage("game", extra);
 
          //
          // stop execution until messages received
          //
          cont = 0;

        }


        if (gmv[0] === "DECK") {

          //this.updateLog("deck processing...");
          let deckidx = parseInt(gmv[1]);
          let cards = JSON.parse(gmv[2]);
          let adjidx = (deckidx-1);

          //
          // create deck if not exists
          //
          game_self.resetDeck(deckidx-1);

          while (game_self.game.deck.length < deckidx) { game_self.addDeck(); }
          game_self.game.deck[deckidx-1].cards = cards;
          let a = 0;
          for (var i in game_self.game.deck[adjidx].cards) {
            game_self.game.deck[adjidx].crypt[a] = game_self.app.crypto.stringToHex(i);
            a++;
          }
          game_self.game.queue.splice(gqe, 1);

        }


        if (gmv[0] === "DECKXOR") {

          //this.updateLog("deck initial card xor...");

          let deckidx = gmv[1];
          let playerid = gmv[2];

          //
          // players process 1 by 1
          //
          if (playerid != this.game.player) {
            return 0;
          }

          if (game_self.game.deck[deckidx-1].xor == "") { game_self.game.deck[deckidx-1].xor = game_self.app.crypto.hash(Math.random()); }

          for (let i = 0; i < game_self.game.deck[deckidx-1].crypt.length; i++) {
            game_self.game.deck[deckidx-1].crypt[i] = game_self.app.crypto.encodeXOR(game_self.game.deck[deckidx-1].crypt[i], game_self.game.deck[deckidx-1].xor);
            game_self.game.deck[deckidx-1].keys[i] = game_self.app.crypto.generateKeys();
          }

          //
          // shuffle the encrypted deck
          //
          game_self.game.deck[deckidx-1].crypt = game_self.shuffleArray(game_self.game.deck[deckidx-1].crypt);

          game_self.game.turn = [];
          game_self.game.turn.push("RESOLVE");
          for (let i = 0; i < game_self.game.deck[deckidx-1].crypt.length; i++) { game_self.game.turn.push(game_self.game.deck[deckidx-1].crypt[i]); }
          game_self.game.turn.push("CARDS\t"+deckidx+"\t"+game_self.game.deck[deckidx-1].crypt.length);

          let extra = {};

          game_self.sendMessage("game", extra);

          //
          // stop execution until messages received
          //
          cont = 0;

        }


        if (gmv[0] === "DECKENCRYPT") {

          //this.updateLog("deck initial card encrypt...");
          let deckidx = gmv[1];

          if (game_self.game.player == gmv[2]) {

            //game_self.updateStatus("encrypting shuffled deck for dealing to players...");

            for (let i = 0; i < game_self.game.deck[deckidx-1].crypt.length; i++) {
              game_self.game.deck[deckidx-1].crypt[i] = game_self.app.crypto.decodeXOR(game_self.game.deck[deckidx-1].crypt[i], game_self.game.deck[deckidx-1].xor);
              game_self.game.deck[deckidx-1].crypt[i] = game_self.app.crypto.encodeXOR(game_self.game.deck[deckidx-1].crypt[i], game_self.game.deck[deckidx-1].keys[i]);
            }

            game_self.game.turn = [];
            game_self.game.turn.push("RESOLVE");
            for (let i = 0; i < game_self.game.deck[deckidx-1].crypt.length; i++) { game_self.game.turn.push(game_self.game.deck[deckidx-1].crypt[i]); }
            game_self.game.turn.push("CARDS\t"+deckidx+"\t"+game_self.game.deck[deckidx-1].crypt.length);

            let extra = {};
            game_self.sendMessage("game", extra);

          } else {
            //game_self.updateStatus("opponent encrypting shuffled deck for dealing to players...");
          }

          cont = 0;
        }



	//
	// this can happen if we "ISSUEKEYS" on unencrypted decks
	//
        if (gmv[0] === null || gmv[0] == "null") {
	  console.log("REMOVING NULL ENTRY");
          game_self.game.queue.splice(gqe, 1);

	}


	//
	// we have not removed anything, so throw it to the game
	//
        if (loop_length == game_self.game.queue.length && cont == 1 && loop_length_instruction === game_self.game.queue[game_self.game.queue.length-1]) {
	  cont = this.handleGameLoop();
//console.log("we moved into the game: " + cont);
	  //this.processFutureMoves();
	  //return 0;
	}

	if (cont == 0) {
	  // check here -- redundant except for "acknowledge"
	  this.processFutureMoves();
	  return 0;
	}
      }
    }
  }







  addNextMove(gametx) {

console.log(" .. add next move " + gametx.transaction.sig);

    let game_self = this;
    let gametxmsg = gametx.returnMessage();

    ////////////
    // HALTED //
    ////////////
    if (game_self.game.halted == 1 || game_self.gaming_active == 1) {
      if (game_self.game.future == undefined || game_self.game.future == "undefined" || game_self.game.future == null) { game_self.game.future = []; }
      if (game_self.game.id === gametxmsg.game_id) {
        game_self.game.future.push(JSON.stringify(gametx.transaction));
      }
      game_self.saveFutureMoves(game_self.game.id);
      game_self.gaming_active = 0;
      return;
    }

    // ACCEPT / JOIN / OPEN will not have turn defined
    if (gametxmsg.turn == undefined) { gametxmsg.turn = []; }
    if (gametxmsg.step == undefined) { gametxmsg.step = {}; }
console.log(" .. updating player "+gametx.transaction.from[0].add+" to move " + gametxmsg.step.game);
    game_self.game.step.players[gametx.transaction.from[0].add] = gametxmsg.step.game;
    if (gametxmsg.step.game > game_self.game.step.game) {
console.log(" .. updating game step to " + gametxmsg.step.game);
      game_self.game.step.game = gametxmsg.step.game;
    }

    ///////////
    // QUEUE //
    ///////////
    if (game_self.game.queue != undefined) {
      for (let i = 0; i < gametxmsg.turn.length; i++) {
        game_self.game.queue.push(gametxmsg.turn[i]);
      }

      // added sept 27 - we may have spliced away, so don't readd in saveGame
      game_self.saveFutureMoves(game_self.game.id);
      game_self.saveGame(game_self.game.id);
      game_self.runQueue();
      game_self.processFutureMoves();
      game_self.gaming_active = 0;
    }

  }


  addFutureMove(gametx) {
console.log(" .. add future move " + gametx.transaction.sig);
    let game_self = this;
    if (!game_self.game.future.includes(JSON.stringify(gametx.transaction))) {
      game_self.game.future.push(JSON.stringify(gametx.transaction));
      game_self.saveFutureMoves(game_self.game.id);
    }
  }




  processFutureMoves() {

    let game_self = this;

    if (game_self.gaming_active == 1) { return 0; }
    if (game_self.game.halted == 1) { return 0; }

    //
    // do we have future game moves waiting
    //
//console.log("FUTURE MOVES: " + game_self.game.future.length);
//console.log("gaming active --> " + game_self.gaming_active);
//console.log("game halted   --> " + game_self.game.halted);
//console.log("game step --> " + game_self.game.step.game);
//console.log("PLAYER: " + game_self.game.player);

    let nothing_left = 0;
    let loop_size = game_self.game.future.length;
    let tx_processed = 0;
    let loops_through_queue = 0;
    let last_loop_instruction_processed = 0;
    let loop_length = 0;
    let loop_length_instruction = "";


    // prevents endless looping if we process a move and it pops back on the future queue -- it'll go to the end
    let max_loop_length = loop_size;
    let num_txs_processed = 0;

    while (loop_size > 0 && game_self.gaming_active != 1 && game_self.game.halted != 1 && nothing_left == 0 && num_txs_processed < max_loop_length) {

//console.log("fm . " + game_self.game.future.length + " -- " + game_self.gaming_active + " -- " + game_self.game.halted + " -- " + nothing_left);

      loops_through_queue++;
      loop_length = game_self.game.queue.length;
      loop_length_instruction = game_self.game.queue[game_self.game.queue.length-1];
      tx_processed = 0;

      for (let ii = 0; ii < loop_size; ii++) {
        let ftx = new saito.transaction(JSON.parse(game_self.game.future[ii]));
        let ftxmsg = ftx.returnMessage();
        if (game_self.isUnprocessedMove(game_self.game.player, ftxmsg)) {
          game_self.game.future.splice(ii, 1);
	  num_txs_processed++;
	  game_self.addNextMove(ftx);
	  tx_processed = 1;
	} else {
	  if (game_self.isFutureMove(game_self.game.player, ftxmsg)) {
	    tx_processed = 1;
	  } else {
            game_self.game.future.splice(ii, 1);
	    tx_processed = 1;
	    ii--; // reduce index as deleted
	  }
	}
        loop_size = game_self.game.future.length;
      }
      loop_size = game_self.game.future.length;


      // exit condition 1 - overkill for sanity sake
      if (tx_processed == 0 || game_self.game.future.length == 0) {
	nothing_left = 1;
      } else {
      }

      //
      // i.e. tx processed is 1 because txs was determined to be future move... so we got here...
      //
      // in which case we exit if an entire iteration through the loop as accomplished NOTHIGN
      //
      if (loop_length == game_self.game.queue.length && loop_length_instruction == game_self.game.queue[game_self.game.queue.length-1] && last_loop_instruction_processed != loops_through_queue) {
	nothing_left = 1;
      } else {
      }

    }
  }


  handleGameLoop() {
    return 0;
  }




  removePlayer(address) {
    if (address === "") { return; }
    for (let i = 0; i < this.game.players.length; i++) {
      if (this.game.players[i] === address) { 
        this.game.players.splice(i, 1);
        this.game.accepted.splice(i, 1);
      }
    }
    for (let i = 0; i < this.game.opponents.length; i++) {
      if (this.game.opponents[i] === address) {
        this.game.opponents.splice(i, 1);
      }
    }
  }


  addPlayer(address) {
    if (address === "") { return; }
    for (let i = 0; i < this.game.players.length; i++) {
      if (this.game.players[i] === address) { return; }
    }
    this.game.players.push(address);
    this.game.accepted.push(0);
    if (this.app.wallet.returnPublicKey() !== address) {
      this.game.opponents.push(address);
    }
  }


  receiveGameoverRequest(blk, tx, conf, app) {
    let txmsg = tx.returnMessage();
    let { game_id, module } = txmsg;

    let game_self  = app.modules.returnModule(module);
    let game = this.loadGame(game_id);
    if (game) {
      game.over = 1;
      this.saveGame(game_id);

      game_self.game.queue.push("GAMEOVER\t");
      game_self.runQueue(txmsg);
      game_self.gaming_active = 0;
    }
    return;
  }


  //
  // call this to end game as tie
  //
  tieGame(game_id=null) {
    this.resignGame(game_id, 1);
  }


  //
  // call this to resign the game
  //
  resignGame(game_id=null, tiegame=0) {

    let game = this.loadGame(game_id);

    var newtx = this.app.wallet.createUnsignedTransactionWithDefaultFee();
    newtx.transaction.to = game.players.map(player => new saito.slip(player));

    if (game.over == 0) {

      let { winner, module } = game;

      //
      // the winner is the player whose PID is marked in this.game.winner
      //
      // failing that, the player that calls resignGame loses
      //
      // conditions in reverse order below
      //
      winner = game.players.find(player => player != this.app.wallet.returnPublicKey());
      if (this.game.winner > 0) { winner = this.game.players[this.game.winner-1]; }
      if (tiegame == 1) { winner = ""; }

      game.over = 1;
      game.last_block = this.app.blockchain.last_bid;
      this.saveGame(game.id);

      newtx.msg = {
        request: "gameover",
        game_id: game.id,
        winner,
        module,
        reason: "",
      }

      newtx = this.app.wallet.signTransaction(newtx);
      this.app.network.propagateTransaction(newtx);
    }
  }



  saveFutureMoves(game_id=null) {

    if (game_id === null) { return; }

    //
    // saves future moves without disrupting our queue state
    // so that we can continue without reloading and reload
    // without losing future moves.
    //
    if (this.app.options) {
      if (this.app.options.games) {
        for (let i = 0; i < this.app.options.games.length; i++) {
	  if (this.app.options.games[i].id === this.game.id) {
	    this.app.options.games[i].future = this.game.future;
	  }
        }
      }
    }

    this.app.storage.saveOptions();

  }




  saveGame(game_id) {

    if (this.app.options) {
      if (!this.app.options.games) {
        this.app.options = Object.assign({
          games: [],
          gameprefs: { random: this.app.crypto.generateKeys() }
        }, this.app.options);
      }
    }

    if (typeof game_id === 'undefined') {
      game_id = this.app.crypto.hash(Math.random());
    }

    if (game_id != null) {
      if (this.app.options) {
        if (this.app.options.games) {
          for (let i = 0; i < this.app.options.games.length; i++) {
            if (this.app.options.games[i].id === game_id) {
              if (this.game == undefined) { console.log("Saving Game Error: safety catch 1"); return; }
              if (this.game.id != game_id) { console.log("Saving Game Error: safety catch 2"); return; }
              this.game.ts = new Date().getTime();

	      //
	      // sept 25 - do not overwrite any future moves saved separately
	      //
	      for (let ii = 0; ii < this.app.options.games[i].future.length; ii++) {
	        let do_we_contain_this_move = 0;
		for (let iii = 0; iii < this.game.future.length; iii++) {
		  if (this.app.options.games[i].future[ii] === this.game.future[iii]) { do_we_contain_this_move = 1; }
		}
	        if (do_we_contain_this_move == 0) {
		  this.game.future.push(this.app.options.games[i].future[ii]);
		}
	      }

              this.app.options.games[i] = JSON.parse(JSON.stringify(this.game));
              this.app.storage.saveOptions();
              return;
            }
          }
        }
      }
    }

    if (this.game.id === game_id) {
      //console.log("ADDING GAME TO GAMES");
      this.app.options.games.push(this.game);
    } else {
      //console.log("CREATING NEW GAME");
      this.game = this.newGame(game_id);
    }

    if (this.game.id.length < 25) {
      if (this.game.players_needed > 1) {
        process.exit();
      }
    }

    this.app.storage.saveOptions();
    return;

  }

  saveGamePreference(key, value) {

    if (this.app.options.games == undefined) {
      this.app.options.games = [];
    }
    if (this.app.options.gameprefs == undefined) {
      this.app.options.gameprefs = {};
      this.app.options.gameprefs.random = this.app.crypto.generateKeys();
    }

    this.app.options.gameprefs[key] = value;
    this.app.storage.saveOptions();

  }

  loadGame(game_id = null) {

    if (this.app.options.games == undefined) {
      this.app.options.games = [];
    }
    if (this.app.options.gameprefs == undefined) {
      this.app.options.gameprefs = {};
      this.app.options.gameprefs.random = this.app.crypto.generateKeys();  // returns private key for self-encryption (save keys)
    }



    //
    // load most recent game
    //
    if (game_id == null) {

      let game_to_open = 0;

      for (let i = 0; i < this.app.options.games.length; i++) {
        if (this.app.options.games[i].ts > this.app.options.games[game_to_open].ts) {
          game_to_open = i;
        }
      }
      if (this.app.options.games == undefined) {
        game_id = null;
      } else {
        if (this.app.options.games.length == 0) {
          game_id = null;
        } else {
          game_id = this.app.options.games[game_to_open].id;
        }
      }
    }

    if (game_id != null) {
      for (let i = 0; i < this.app.options.games.length; i++) {
        if (this.app.options.games[i].id === game_id) {
          this.game = JSON.parse(JSON.stringify(this.app.options.games[i]));
          return this.game;
        }
      }
    }

    //
    // otherwise subsequent save will be blank
    //
    this.game = this.newGame(game_id);
    this.saveGame(game_id);
    return this.game;

  }


  newGame(game_id = null) {

    if (game_id == null) { game_id = Math.random().toString(); }

    let game = {};
        game.id           = game_id;
        game.player       = 1;
        game.players      = [];
        game.players_needed = 1;
        game.accepted     = [];
        game.players_set  = 0;
        game.target       = 1;
        game.invitation   = 1;
        game.initializing = 1;
        game.initialize_game_run = 0;
        game.accept       = 0;
        game.over         = 0;
        game.winner       = 0;
        game.module       = "";
	game.originator   = "";
        game.ts           = new Date().getTime();
        game.last_block   = 0;
        game.options      = {};
        game.options.ver  = 1;
        game.invite_sig   = "";
	game.future	  = []; // future moves (arrive while we take action)
	game.halted	  = 0;
	game.saveGameState = 0;
	game.saveKeyState = 0;

	game.clock_spent  = 0;
	game.clock_limit  = 0;

        game.step         = {};
        //game.step.game    = 0;
	// july 14
        game.step.game    = 1;
        game.step.players = {}; // associative array mapping pkeys to last game step

        game.queue        = [];
        game.turn         = [];
        game.opponents    = [];
        game.deck         = []; // shuffled cards
        game.pool         = []; // pools of revealed cards
        game.dice         = "";

        game.status       = ""; // status message
        game.log          = [];

    return game;
  }


  rollDice(sides = 6, mycallback = null) {
    this.game.dice = this.app.crypto.hash(this.game.dice);
    let a = parseInt(this.game.dice.slice(0, 12), 16) % sides;
    if (mycallback != null) {
      mycallback((a + 1));
    } else {
      return (a + 1);
    }
  }


  initializeDice() {
    if (this.game.dice === "") { this.game.dice = this.app.crypto.hash(this.game.id); }
  }


  scale(x) {
    let y = Math.floor(this.screenRatio * x);
    return y;
  }




  //
  // Fisher–Yates shuffle algorithm:
  //
  shuffleArray(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }


  returnNextPlayer(num) {
    let p = parseInt(num) + 1;
    if (p > this.game.players.length) { return 1; }
    return p;
  }


  shuffleDeck(deckidx=0) {

    //this.updateLog("shuffling deck");
    //this.updateStatus("Shuffling the Deck");

    let new_cards = [];
    let new_keys = [];

    let old_crypt = this.game.deck[deckidx-1].crypt;
    let old_keys = this.game.deck[deckidx-1].keys;

    let total_cards = this.game.deck[deckidx-1].crypt.length;
    let total_cards_remaining = total_cards;

    for (let i = 0; i < total_cards; i++) {

      // will never have zero die roll, so we subtract by 1
      let random_card = this.rollDice(total_cards_remaining) - 1;

      new_cards.push(old_crypt[random_card]);
      new_keys.push(old_keys[random_card]);

      old_crypt.splice(random_card, 1);
      old_keys.splice(random_card, 1);

      total_cards_remaining--;

    }

    this.game.deck[deckidx-1].crypt = new_cards;
    this.game.deck[deckidx-1].keys = new_keys;

  }



  sendMessage(type = "game", extra = {}, mycallback = null) {

    //this.updateStatus("Sending Move to Opponents...");

    //
    // game timer
    //
    this.time.last_sent = new Date().getTime();
    if (this.time.last_sent > (this.time.last_received+1000)) {
      this.game.clock_spent += (this.time.last_sent - this.time.last_received);
      let time_left = this.game.clock_limit - this.game.clock_spent;
      this.clock.displayTime(time_left);

      if (time_left < 0 && this.game.clock_limit > 0) {
        this.resignGame();
        try {
          this.displayModal("<span>The Game is Over</span> - <span>Player " + this.game.player + " loses by timeout</span>");
          this.updateStatus("<span>The Game is Over</span> - <span>Player " + this.game.player + " loses by timeout</span>");
          this.updateLog("<span>The Game is Over</span> - <span>Player " + this.game.player + " loses by timeout</span>");
        } catch (err) {
        }
	return 0;
      }

      this.stopClock();
    }


    //
    // observer mode
    //
    if (this.game.player == 0) { return; }
    if (this.game.opponents == undefined) {
      return;
    }

    let send_onchain_only = 0;
    for (let i = 0; i < this.game.turn.length; i++) {
      if (this.game.turn[i] == "READY") {
	send_onchain_only = 1;
      }
    }


    let game_self = this;
    let mymsg = {};

    //
    // steps
    //
    let ns = {};
        ns.game = this.game.step.game;
    if (type == "game") {
      ns.game++;
      mymsg.request = "game";
    } else {
    }


    //
    // purge bad futures
    //


    //
    // returns key state and game state
    //
    // if we are saving game state, we make sure the other player does too!
    if (this.game.saveGameState == 1) {  
      if (this.observer_mode == 0) {
	this.game.turn.push("OBSERVER\t"+this.game.player+"\t1");
        this.game.turn.push("SETVAR\tgame\tsaveGameState\t1");
      }
      mymsg.game_state = this.returnPreMoveGameState(); 
      //mymsg.game_state = this.returnGameState(); 
    }
    if (this.game.saveKeyState == 1) { mymsg.key_state = this.returnKeyState(); }

    mymsg.turn = this.game.turn;
    mymsg.module = this.name;
    mymsg.game_id = this.game.id;
    mymsg.player = this.game.player;
    mymsg.step = ns;
    mymsg.extra = extra;

    let newtx = this.app.wallet.createUnsignedTransactionWithDefaultFee(this.app.wallet.returnPublicKey(), 0.0);
    if (newtx == null) {
      //alert("ERROR: Unable to make move. Do you have enough SAITO tokens?");
      return;
    }

    for (let i = 0; i < this.game.opponents.length; i++) {
      newtx.transaction.to.push(new saito.slip(this.game.opponents[i], 0.0));
    }

    newtx.msg = mymsg;
    newtx = this.app.wallet.signTransaction(newtx);

    game_self.app.wallet.wallet.pending.push(JSON.stringify(newtx.transaction));
    game_self.app.wallet.saveWallet();
    game_self.saveGame(game_self.game.id);

    //
    // send off-chain if possible - step 2 onchain to avoid relay issues with options
    //
    //if (mymsg.step.game != 2) {
    if (this.relay_moves_offchain_if_possible && send_onchain_only == 0) {

      //
      // only game moves to start
      //
      if (newtx.msg.request === "game" || this.initialize_game_offchain_if_possible == 1) {
        let relay_mod = this.app.modules.returnModule('Relay');
        //
        // only initialized moves off-chain
	//
        if (relay_mod != null && (game_self.game.initializing == 0 || (game_self.initialize_game_offchain_if_possible == 1))) {
          relay_mod.sendRelayMessage(this.game.players, 'game relay gamemove', newtx);
        }
      }
    }
    //}


    game_self.app.network.propagateTransactionWithCallback(newtx, function (errobj) {
    });

  }


  //
  // respond to off-chain game moves
  //
  async handlePeerRequest(app, message, peer, mycallback = null) {


    //
    // servers should not make game moves
    //
    if (app.BROWSER == 0) { return; }

    let game_self = this;

    await super.handlePeerRequest(app, message, peer, mycallback);

    if (message.request === "game relay gamemove") {
      if (message.data != undefined) {

console.log("received relay move");

        let gametx = new saito.transaction(message.data.transaction);
        let gametxmsg = gametx.returnMessage();
        if (gametxmsg.module == this.name) { 
	   
          //
          // what if no game is loaded into module
          //

	  
          if ( ( (!game_self.game) || (game_self.game.id != gametxmsg.game_id ) ) && gametxmsg.game_id != "") {
console.log("loading game");
            game_self.game = game_self.loadGame(gametxmsg.game_id);
          }

	  if (game_self.isFutureMove(gametx.transaction.from[0].add, gametxmsg)) {
	    game_self.addFutureMove(gametx);
	  }
	  if (game_self.isUnprocessedMove(gametx.transaction.from[0].add, gametxmsg)) {
	    game_self.addNextMove(gametx);
	  }
        }
      }
    }
  }




  addPool() {
    let newIndex = this.game.pool.length;
    this.resetPool(newIndex);
  }
  addDeck() {
    let newIndex = this.game.deck.length;
    this.resetDeck(newIndex);
  }
  resetPool(newIndex=0) {
    this.game.pool[newIndex] = {};
    this.game.pool[newIndex].cards     = {};
    this.game.pool[newIndex].crypt     = [];
    this.game.pool[newIndex].keys      = [];
    this.game.pool[newIndex].hand      = [];
    this.game.pool[newIndex].decrypted = 0;
  }
  resetDeck(newIndex=0) {
    this.game.deck[newIndex] = {};
    this.game.deck[newIndex].cards    = {};
    this.game.deck[newIndex].crypt    = [];
    this.game.deck[newIndex].keys     = [];
    this.game.deck[newIndex].hand     = [];
    this.game.deck[newIndex].xor      = "";
    this.game.deck[newIndex].discards = {};
    this.game.deck[newIndex].removed  = {};
  }



  updateStatus(str) {

    if (this.lock_interface == 1) { return; }

    this.game.status = str;

    if (this.useHUD) {
      this.hud.updateStatus(str);
      return;
    }

    try {
      if (this.browser_active == 1) {
        let status_obj = document.getElementById("status");    
        status_obj.innerHTML = str;
      }
    } catch (err) {}

  }


  //
  // force does nothing here, but adding for consistency sake in case
  // we want to prevent duplicate lines in this lowest-level of log
  // management instead of just in the HUD
  //
  updateLog(str, length = 20, force = 0) {

    if (str) {
      if (!this.game.log.includes(str)) {
        this.game.log.unshift(str);
        if (this.game.log.length > length) { 
	  if (this.game.log_length > length) {} else {
	    this.game.log.splice(length); 	
	  }
	}
      }
    }


    if (this.useHUD) {
      this.hud.updateLog(str, this.addLogCardEvents.bind(this), force);
      return;
    }


    let html = '';

    for (let i = 0; i < this.game.log.length; i++) {
      if (i > 0) { html += '<br/>'; }
      if (this.game.log[i].indexOf('>') > -1) {
        html += this.game.log[i];
      } else {
        html += "> " + this.game.log[i];
      }
    }

    try {
      if (this.browser_active == 1) {
        let log_obj = document.getElementById("log");    
        log_obj.innerHTML = html;
      }
    } catch (err) {}

    this.addLogCardEvents();

  }









  returnPreMoveGameState() {
    let game_clone = JSON.parse(JSON.stringify(this.game_state_pre_move));
    for (let i = 0; i < game_clone.deck.length; i++) {
      if (game_clone.deck[i]) {
        game_clone.deck[i].keys = [];
      }
    }
    return game_clone;
  }
  returnGameState() {
    let game_clone = JSON.parse(JSON.stringify(this.game));
    for (let i = 0; i < game_clone.deck.length; i++) {
      if (game_clone.deck[i]) {
        game_clone.deck[i].keys = [];
      }
    }
    return game_clone;
  }
  returnKeyState() {
    if (this.app.options.gameprefs == undefined) {
      this.app.options.gameprefs = {};
      this.app.options.gameprefs.random = this.app.crypto.generateKeys();
      this.app.options.saveOptions();
    }
    let game_clone = JSON.parse(JSON.stringify(this.game));
    game_clone.last_txmsg = {};
    return this.app.crypto.aesEncrypt(JSON.stringify(game_clone), this.app.options.gameprefs.random);
  }
  restoreKeyState(keyjson) {
    try {
      let decrypted_json = this.app.crypto.aesDecrypt(keyjson, this.app.options.gameprefs.random);
      this.game = JSON.parse(decrypted_json);
    } catch (err) {
      console.log("Error restoring encrypted deck and keys backup");
    }
  }

  returnGameOptionsHTML() { return "" }

  returnFormattedGameOptions(options) { return options; }

  returnGameRowOptionsHTML(options) {
    let html = '';
    for(var name in options) {
      let show_option = 1;
      if (name == "clock") { if (options[name] == 0) { show_option = 0; } }
      html += '<span class="game-option">' + name + ': ' + options[name] + '</span>, ';
    }
    html = html.slice(0, -2);
    return html;
  }






  addMove(mv) {
    this.moves.push(mv);
  }

  removeMove() {
    return this.moves.pop();
  }

  endTurn(nexttarget=0) {

    let extra = {};
    this.game.turn = this.moves;
    this.moves = [];
    this.sendMessage("game", extra);

  }




  returnCardList(cardarray=[]) {

    let html = "";
    for (i = 0; i < cardarray.length; i++) {
      html += this.returnCardItem(cardarray[i]);
    }
    return `<div class="status-cardbox" id="status-cardbox">${html}</div>`;

  }


  returnCardItem(card) {

    for (let z = 0; z < this.game.deck.length; z++) {
      if (this.game.deck[z].cards[card] != undefined) {
        return `<div id="${card.replace(/ /g,'')}" class="card cardbox-hud cardbox-hud-status">${this.returnCardImage(card)}</div>`;
      }
    }
    return '<li class="card showcard" id="'+card+'">'+this.game.deck[0].cards[card].name+'</li>';

  }




  returnCardImage(cardname) {
    
    let c = null;
    
    for (let z = 0; c == undefined && z < this.game.deck.length; z++) {
      c = this.game.deck[z].cards[cardname];
      if (c == undefined) { c = this.game.deck[z].discards[cardname]; }
      if (c == undefined) { c = this.game.deck[z].removed[cardname]; }
    }
    
    // 
    // this is not a card, it is something like "skip turn" or cancel
    // 
    if (c == undefined) {
      return '<div class="noncard">'+cardname+'</div>';
    
    }
    
    return `<img class="cardimg showcard" id="${cardname}" src="/${this.returnSlug()}/img/${c.img}" />`;
  
  }




  //
  // returns discarded cards and removes them from discard pile
  //
  returnDiscardedCards(deckidx) {

    var discarded = {};
    deckidx = parseInt(deckidx-1);

    for (var i in this.game.deck[deckidx].discards) {
      discarded[i] = this.game.deck[0].cards[i];
      delete this.game.deck[0].cards[i];
    }

    this.game.deck[0].discards = {};

    return discarded;

  }




  showCard(cardname) {
    let card_html = this.returnCardImage(cardname);
    let cardbox_html = this.app.browser.isMobileBrowser(navigator.userAgent) ?
      `${card_html}
        <div id="cardbox-exit-background">
          <div class="cardbox-exit" id="cardbox-exit">×</div>
        </div>` : card_html;

    $('#cardbox').html(cardbox_html);
    $('#cardbox').show();
  }

  showPlayableCard(cardname) {
    let card_html = this.returnCardImage(cardname);
    let cardbox_html = this.app.browser.isMobileBrowser(navigator.userAgent) ?
      `${card_html}
      <div id="cardbox-exit-background">
        <div class="cardbox-exit" id="cardbox-exit">×</div>
      </div>
      <div class="cardbox_menu_playcard cardbox_menu_btn" id="cardbox_menu_playcard">
        PLAY
      </div>` : card_html;

    $('#cardbox').html(cardbox_html);
    $('#cardbox').show();
  }

  hideCard() {
    $('#cardbox').hide();
  }



  updateStatusAndListCards(message, cards=[], mycallback=null) {

    html = `
      <div class="status-message">
        ${message}
      </div>
      ${this.returnCardList(cards)}
    `

    this.updateStatus(html);
    this.addShowCardEvents(mycallback);
  }



  addShowCardEvents(onCardClickFunction) {
    let gameobj_self = this;
    this.changeable_callback = onCardClickFunction;
    this.hud.attachCardEvents(this.app, this);
  }

  addLogCardEvents() {

    let gameobj_self = this;

    if (!this.app.browser.isMobileBrowser(navigator.userAgent)) {

      $('.logcard').off();
      $('.logcard').mouseover(function() {
        let card = $(this).attr("id");
        gameobj_self.showCard(card);
      }).mouseout(function() {
        let card = $(this).attr("id");
        gameobj_self.hideCard(card);
      });

    }

  }


  removeCardFromHand(card) {
    
    for (let z = 0; z < this.game.deck.length; z++) {
      for (i = 0; i < this.game.deck[z].hand.length; i++) {
        if (this.game.deck[z].hand[i] === card) {
          this.game.deck[z].hand.splice(i, 1);
        }
      }
    }
  }



  
  endGame(winner, method) {
        
    this.game.over = 1;
    this.game.winner = winner;
        
    if (this.game.winner == this.game.player) {
      //
      // share wonderful news
      //
      this.game.over = 0;
      this.resignGame();
    }
  
    if (this.browser_active == 1) {
      try {
        this.displayModal("<span>The Game is Over</span> - <span>" + winner.toUpperCase() + "</span> <span>wins by</span> <span>" + method + "<span>");
        this.updateStatus("<span>The Game is Over</span> - <span>" + winner.toUpperCase() + "</span> <span>wins by</span> <span>" + method + "<span>");
      } catch (err) {

      } 
    } 
  }   
        


  formatStatusHeader(status_header, include_back_button=false) {
    let back_button_html = `<i class="fa fa-arrow-left" id="back_button"></i>`;
    return `
    <div class="status-header">
      ${include_back_button ? back_button_html : ""}
      <div style="text-align: center;">
        ${status_header}
      </div>
    </div>
    `
  }

  startClock() {
    clearInterval(this.clock_timer);
    this.clock_timer = setInterval(() => {
      let x = new Date().getTime();
      let time_on_clock = this.game.clock_limit - (x - this.time.last_received) - this.game.clock_spent;
      this.clock.displayTime(time_on_clock);
    }, 1000);
  }

  stopClock() { 
    clearInterval(this.clock_timer);
  }

  lockInterface() {
    this.lock_interface = 1;
    this.lock_interface_step = this.game.queue[this.game.queue.length-1];
  }
  unlockInterface() {
    this.lock_interface = 0;
  }
  mayUnlockInterface() {
    if (this.lock_interface_step === this.game.queue[this.game.queue.length-1]) { return 1; }
    return 0;
  }

  async displayModal(modalHeaderText, modalBodyText="") {
    await salert(`${modalHeaderText}: ${modalBodyText}`);
  }
  async preloadImages() {}

}

module.exports = GameTemplate;

