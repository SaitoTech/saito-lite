/*********************************************************************************

 GAME MODULE v.2

 This is a general parent class for modules that wish to implement Game logic. It
 introduces underlying methods for creating games via email invitations, and sending
 and receiving game messages over the Saito network. The module also includes random
 number routines for dice and deck management.

 This module attempts to use peer-to-peer connections with fellow gamers where
 possible in order to avoid the delays associated with on-chain transactions. All
 games should be able to fallback to using on-chain communications however. Peer-
 to-peer connections will only be used if both players have a proxymod connection
 established.a

 Developers please note that every interaction with a random dice and or processing
 of the deck requires an exchange between machines, so games that do not have more
 than one random dice roll per move and/or do not require constant dealing of cards
 from a deck are easier to implement on a blockchain than those which require
 multiple random moves per turn.

 HOW IT WORKS

 We recommend new developers check out the WORDBLOCKS game for a quick introduction
 to how to build complex games atop the Saito Game Engine. Essentially, games require
 developers to manage a "stack" of instructions which are removed one-by-one from
 the main stack, updating the state of all players in the process.

 MINOR DEBUGGING NOTE


 core functionality from being re-run -- i.e. DECKBACKUP running twice on rebroadcast
 or reload, clearing the old deck twice. What this means is that if the msg.extra
 data fields are used to communicate, they should not be expected to persist AFTER
 core functionality is called like DEAL or SHUFFLE. etc. An example of this is in the
 Twilight Struggle headline code.

**********************************************************************************/
let ModTemplate = require('./modtemplate');
let saito = require('../saito/saito.js')
let GameHud = require('./lib/game-hud/game-hud.js')
let GameCardbox = require('./lib/game-cardbox/game-cardbox.js')
let GameCardfan = require('./lib/game-cardfan/game-cardfan.js')




class GameTemplate extends ModTemplate {

  constructor(app) {

    super(app);

    this.name = "Game";
    this.game = {};
    this.moves = [];


    //
    // game interface variables
    //
    this.interface 	= 0;    // 0 = no hud
				// 1 = graphics hud
   	 		        // 2 = text hud
    this.relay_moves_offchain_if_possible = 1;

    this.hud = new GameHud(app);
    this.cardbox = new GameCardbox(app);
    this.cardfan = new GameCardfan(app);
    this.menus		= [];
    this.minPlayers     = 2;
    this.maxPlayers     = 2;
    this.lang           = "en";

    this.gameboardWidth = 5100;
    this.screenRatio    = 1;
    this.screenSize     = {width: null, height: null}
    this.gameboardZoom  = 1.0;
    this.gameboardMobileZoom = 1.0;
    this.publisher_message = "";

    //
    // auto-saving game state in tx msgs
    //
    this.saveGameState = 0;
    this.saveKeyState = 0;

    //
    // used in reshuffling
    //
    this.old_discards = {};
    this.old_removed  = {};
    this.old_cards    = {};
    this.old_crypt    = [];
    this.old_keys     = [];
    this.old_hand     = [];

    this.initialize_game_run = 0; //
                                  // this is distinct from this.game.initialize_game_run
                                  // the reason is that BOTH are set to 1 when the game
                                  // is initialized. But we only nope out on initializing
                                  // the game if BOTH are 1. This allows us to swap in and
                                  // out saved games, but still init the game on reload if
                                  // this.game.initialize_game_run is set to 1 but it is
                                  // a freshly loaded browser.
                                  //
    this.game.issued_keys_deleted = 0;

    return this;

  }



  displayModal(modalHeaderText, modalBodyText="") {
    salert(`${modalHeaderText}: ${modalBodyText}`);
  }


  initializeHTML(app) {

    //
    // initialize game feeder tries to do this
    //
    // it needs to as the QUEUE which starts
    // executing may updateStatus and affect
    // the interface. So this is a sanity check
    //
    if (this.browser_active == 0) { return; }
    if (this.initialize_game_run == 1) { return; }

    this.hud.render(app, this);
    this.cardbox.render(app, this);

  }


  attachEvents(app) {

    //
    // initialize game feeder tries to do this
    //
    // it needs to as the QUEUE which starts
    // executing may updateStatus and affect
    // the interface. So this is a sanity check
    //
    if (this.browser_active == 0) { return; }
    if (this.initialize_game_run == 1) { return; }
    this.hud.attachEvents(app, this.game);
    this.cardbox.attachEvents(app, this.game);

    this.cardfan.attachEvents(app, this.game);
  }









  //
  // ARCADE SUPPORT
  //
  respondTo(type) {

    if (type == "arcade-games") {
      let obj = {};
      obj.img = "/" + this.returnSlug() + "/img/arcade.jpg";
      obj.render = this.renderArcade;
      obj.attachEvents = this.attachEventsArcade;
      return obj;
    }

    return null;

  }
  renderArcade(app, data) {
  }
  attachEventsArcade(app, data) {
  }




  async onConfirmation(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();
    let game_self = app.modules.returnModule(txmsg.module);

    if (conf == 0) {

      let tx_processed = 0;
      let old_game_id = "";

      //
      // back-up active game
      //
      if (game_self.game.id != "" && game_self.game.id != undefined && game_self.game.over != 1) {
	if (game_self.game.id != txmsg.game_id) {
          old_game_id = game_self.game.id;
          game_self.saveGame(old_game_id);
	}
      }

      // invites
      if (tx.isTo(app.wallet.returnPublicKey()) && txmsg.request == "invite") {
        tx_processed = 1;
        game_self.receiveInviteRequest(blk, tx, conf, app);
      }

      // acceptances
      if (tx.isTo(app.wallet.returnPublicKey()) && txmsg.request == "accept") {
        tx_processed = 1;
        game_self.receiveAcceptRequest(blk, tx, conf, app);
      }

      // game over
      if (txmsg.request == "gameover") {
        tx_processed = 1;
        game_self.receiveGameoverRequest(blk, tx, conf, app);
      }


      let game_id = txmsg.game_id;
      if (app.options.games) {
        for (let i = 0; i < app.options.games.length; i++) {
          if (game_id == app.options.games[i].id) {
            //
            // standardgame move
            //
            if (tx_processed == 0) {
              game_self.handleGameMove(app, tx);
            }
          }
        }
      }

      //
      // restore active game
      //
      if (old_game_id != "") {
	//
	// if an older game exists, save new before we reload the old
	//
        game_self.saveGame(game_self.game.id);
        game_self.loadGame(old_game_id);
        game_self.game.ts = new Date().getTime();
        game_self.saveGame(old_game_id);
      }
    }
  }




  handleGameMove(app, tx) {

    let game_self = this;
    let txmsg = tx.returnMessage();
    let following_game = 0;
    let old_game_id2 = "";

    //
    // back-up active game -- offchain / relay doesn't handle in onconfirmation, so we do here too
    //
    if (game_self.game.id != txmsg.game_id) {
      old_game_id2 = game_self.game.id;
      game_self.saveGame(old_game_id2);
    }

    try {

      let game_id = txmsg.game_id;
      for (let i = 0; i < app.options.games.length; i++) {
        if (game_id == app.options.games[i].id) {
          following_game = 1;
        }
      }

      if (following_game == 1) {

        //
        // only process new game move!
        //
        try {
          if (txmsg.step == undefined) { txmsg.step = {}; }
          if (txmsg.step.game != undefined) {
            if (txmsg.step.game <= game_self.game.step.game && game_self.game.step.players.includes(tx.transaction.from[0].add)) {
console.log("AAA: " + JSON.stringify(txmsg));
              return;
            }
          } else {
            txmsg.step.game = 0;
            if (game_self.game.step.game > 0) {
console.log("BBB: " + JSON.stringify(txmsg));
              return;
            }
          }
          if (txmsg.turn == undefined) { txmsg.turn = []; }
	  if (txmsg.step.game > game_self.game.step.game || txmsg.step.game == 0) {
console.log("RESET PLAYERS to []");
	    game_self.game.step.players = [];
	  } else {

	    if (game_self.game.step.game > txmsg.step.game) {

	      //
	      // we have moved beyond this step in the game
	      //
console.log("old move... rejecting: " + JSON.stringify(txmsg));
	      return;

	    }

console.log("POTENTIAL DOUBLE-MOVE GUARD!");
	    //
	    // do not permit double moves if this is from an existing player who has moved this step
	    //
console.log("PLAYERS MARKED AS MOVED: " + JSON.stringify(game_self.game.step.players));
console.log("this move is from: " + tx.transaction.from[0].add);
	    if (game_self.game.step.players.includes(tx.transaction.from[0].add)) { 
	      console.log("WE SHOULD SKIP THIS MOVE!"); 
	      return;
	    }
	  }
          game_self.game.step.game = txmsg.step.game;
	  game_self.game.step.players.push(tx.transaction.from[0].add);
        } catch (err) {
          console.log("ERROR 029384: error thrown checking game step: " + JSON.stringify(err));
        }

        ///////////
        // QUEUE //
        ///////////
        if (game_self.game.queue != undefined) {
console.log(" processing move from: " + tx.transaction.from[0].add );
console.log("CCC: " + JSON.stringify(txmsg));
          for (let i = 0; i < txmsg.turn.length; i++) { game_self.game.queue.push(txmsg.turn[i]); }
          game_self.saveGame(game_self.game.id);
          game_self.runQueue(txmsg);
        }
      }
    } catch (err) {
    }

    //
    // restore old_game_id2 -- because offchain doesn't do this in onconfirm, we do
    // it here as well
    //
    if (old_game_id2 != "") {
      game_self.saveGame(game_self.game.id);
      game_self.loadGame(old_game_id2);
      game_self.game.ts = new Date().getTime();
      game_self.saveGame(old_game_id2);
    }

  }







  createAcceptTransaction(players, game_id, options) {

    let tx = this.app.wallet.createUnsignedTransactionWithDefaultFee();
    for (let i = 0; i < players.length; i++) {
      tx.transaction.to.push(new saito.slip(players[i], 0.0));
    }
        tx.transaction.msg.module       = this.name;
        tx.transaction.msg.request      = "accept";
        tx.transaction.msg.game_id      = game_id;
        tx.transaction.msg.options      = options;
	//
	// this tx is addressed to all participants, thus we set a 
	// separate variable to identify the original user whose
	// invite transaction is being responded to here.
	//
        tx.transaction.msg.originator   = tx.transaction.from[0].add;
    tx = this.app.wallet.signTransaction(tx);

    return tx;

  }

  receiveInviteRequest(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();

    let game_id = tx.transaction.sig;
    let options = {};
    let invite_sig = "";
    let players_needed = 1;

    if (txmsg.game_id != "") { game_id = txmsg.game_id; }
    if (txmsg.options != "") { options = txmsg.options; }
    if (txmsg.invite_sig != "") { invite_sig = txmsg.invite_sig; }
    if (txmsg.players_needed > 1) { players_needed = txmsg.players_needed; }

    if (!tx.isTo(app.wallet.returnPublicKey())) { return; }


    //
    // do not accept multiple times
    //
    if (this.app.options.games == undefined) { 
      this.app.options.games = []; 
    }
    if (this.app.options.games != undefined) {
      for (let i = 0; i < this.app.options.games.length; i++) {
        if (this.app.options.games[i].id == game_id) {
	  console.log("already processed this game!");
	  return;
	}
      }
    }

    let create_new_game = 0;
    let send_accept_tx  = 0;
    let inviter_accepts = 0;

    //
    // auto-accept my own "open" games
    //
    if (txmsg.accept_sig != "") {
      let msg_to_verify = "create_game_" + tx.transaction.msg.ts;
      if (app.crypto.verifyMessage(msg_to_verify, txmsg.accept_sig, this.app.wallet.returnPublicKey())) {
	create_new_game = 1;
	send_accept_tx  = 1;
      }
    }

    //
    // auto-accept games i send inviting others
    //
    if (txmsg.invite_sig != "") {
      let msg_to_verify2 = "invite_game_" + tx.transaction.msg.ts;
      if (app.crypto.verifyMessage(msg_to_verify2, txmsg.invite_sig, this.app.wallet.returnPublicKey())) {
	create_new_game = 1;
      }
    }


    //
    // inviter auto-accepts
    //
    if (txmsg.invite_sig != "") {
      let msg_to_verify2 = "invite_game_" + tx.transaction.msg.ts;
      if (app.crypto.verifyMessage(msg_to_verify2, txmsg.invite_sig, tx.transaction.from[0].add)) {
	inviter_accepts = 1;
      }
    }



    if (create_new_game == 1) {

      this.loadGame(game_id);
      for (let i = 0; i < tx.transaction.from.length; i++) {
        this.addPlayer(tx.transaction.from[i].add);
      }
      for (let i = 0; i < tx.transaction.to.length; i++) {
        this.addPlayer(tx.transaction.to[i].add);
      }
      for (let i = 0; i < this.game.players.length; i++) {
	if (this.game.players[i] == this.app.wallet.returnPublicKey()) {
	  this.game.accepted[i] = 1;
	}
      }

      this.game.players_needed = players_needed;

      if (inviter_accepts == 1) {
        for (let i = 0; i < this.game.players.length; i++) {
  	  if (this.game.players[i] == tx.transaction.from[0].add) {
	    this.game.accepted[i] = 1;
	  }
        }
      }

      //
      // MULTIPLAYER ACCEPT CREATES AS WELL
      // if this code is updated, update the 
      // on-send multiplayerAccept function
      //
      this.game.module = txmsg.module;
      this.game.options = options;
      this.game.id = game_id;
      this.game.accept = 1;
      this.saveGame(game_id);

      console.log("\n\n\nWHAT IS THE GID: " + game_id);
      console.log("WHAT IS THE GTS: " + txmsg.ts);
      console.log("PLAYERS NEEDED: " + this.game.players_needed);
      console.log("PLAYERS ON INVITE: " + this.game.players);
      console.log("ACCEPTS ON INVITE: " + this.game.accepted);
      console.log("OPTIONS: " + JSON.stringify(this.game.options));


    }
    if (send_accept_tx == 1) {

      let newtx = this.createAcceptTransaction(this.game.players, this.game.id, this.game.options);
      app.network.propagateTransaction(newtx);

    }

    return;

  }



  receiveAcceptRequest(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();

    let game_id = txmsg.game_id;
    let originator = txmsg.originator;

    this.loadGame(game_id);

console.log("LOADED GID: " + game_id);

    this.game.options = txmsg.options;
    this.game.module = txmsg.module;

    if (this.game.over == 1) { return; }

    //
    // game yet to start
    //
    if (this.game.step.game == 0) {

      if (tx.transaction.from[0].add == app.wallet.returnPublicKey()) {
        this.game.invitation = 0;
        this.game.accept = 1;
      }

      for (let i = 0; i < tx.transaction.to.length; i++) { this.addPlayer(tx.transaction.to[i].add); }
      this.saveGame(game_id);

    }

    //
    // the inviter automatically approves
    //
    if (originator === this.app.wallet.returnPublicKey()) {
      for (let i = 0; i < this.game.players.length; i++) {
        if (this.game.players[i] == originator) { this.game.accepted[i] = 1; }
      }
      this.game.invitation = 0;
      this.game.accept = 1;
      this.saveGame(game_id);
    }

console.log("INVITER HAS APPROVED! ");

    //
    // has everyone accepted?
    //
    let has_everyone_accepted = 1;
    //
    // do we have enough players?
    //
    if (this.game.players_needed > this.game.players.length) {
      has_everyone_accepted = 0;
    } 

console.log("HAS EVERYONE ACCEPTED?: " + has_everyone_accepted);

    for (let b = 0; b < this.game.accepted.length; b++) {

console.log("AAA: " + b);
      //
      // multiplayer accepts come in 1-by-1, so 
      // if this is from me, everyone else must
      // have already accepted
      //
      if (tx.transaction.from[0].add == this.app.wallet.returnPublicKey()) {
	for (let z = 0; z < this.game.players.length; z++) {
console.log("AAA Z: " + z);
	  this.game.accepted[z] = 1;
	}
      }

      if (tx.transaction.from[0].add === this.game.players[b]) {
console.log("AAA 1: ");
        this.game.accepted[b] = 1;
      }
      if (this.game.players[b] === originator) {
console.log("AAA 2: ");
        this.game.accepted[b] = 1;
      }
      if (this.game.players[b] === this.app.wallet.returnPublicKey() && this.game.accepted[b] == 1) {
console.log("AAA 3: ");
        this.game.accept = 1;
      }
      this.saveGame(game_id);
      if (this.game.accepted[b] == 0) {
console.log("unaccepted by b: " + b);
        has_everyone_accepted = 0;
      }
    }

    if (has_everyone_accepted == 0) {
console.log("noping out: ");
      return;
    } 


    //
    // return if I have not accepted
    //
    if (this.game.accept == 0) {
console.log(" ... .and I have no accepted!");
      return;
    }

    if (this.game.players_set == 0) {

      //
      // set our player numbers alphabetically
      //
      let players = [];
      for (let z = 0; z < this.game.players.length; z++) {
        players.push(this.app.crypto.hash(this.game.players[z]+this.game.id));
      }
      players.sort();

      for (let i = 0; i < players.length; i++) {
        if (players[i] === this.app.crypto.hash(this.app.wallet.returnPublicKey()+this.game.id)) {
          this.game.player = i+1;
        }
      }

      this.game.players_set = 1;
      this.saveGame(game_id);

    }

console.log("PLAUERS: " + this.game.players);

console.log(" ... if we hit this point everyone has accepted the game!");
console.log("I AM PLAYER: " + this.game.player);
    //
    // if we hit this point, everyone has accepted the game
    // so we can move into handleGame
    //
    if (this.initializeGameFeeder(game_id) == 1) {
console.log("PLAYER: " + this.game.player);
    } else {
      this.saveGame(game_id);
    }
  }




  initialize(app) {

    if (this.browser_active == 0) { return; }

    //
    // screen ratio
    //
    let gameheight = $('.gameboard').height();
    let gamewidth = $('.gameboard').width();
    this.screenRatio = gamewidth / this.gameboardWidth;

    //
    // we grab the game with the
    // most current timestamp (ts)
    // since no ID is provided
    //
    this.loadGame();

    //
    // dice initialization
    //
    if (this.game.dice === "") {
      this.game.dice = app.crypto.hash(this.game.id);
    }

    //
    //
    //
    this.initializeGameFeeder(this.game.id);

  }



  initializeGame() {

    //
    // 
    if (this.game.dice == "") {
      this.initializeDice();
      this.queue.push("READY");
      this.saveGame(this.game.id);
    }

  }



  initializeGameFeeder(game_id) {

    //
    // sanity load (multiplayer)
    //
    this.loadGame(game_id);

    //
    // proactively initialize HTML so that the HUD
    // and other graphical elements exist for the game
    // queue to handle. We must specify not to do this
    // twice, ergo initializeHTML doing the init check
    //
    try {
//      if (this.browser_active == 1) {
        this.initializeHTML(this.app);
        this.attachEvents(this.app);
//      }
    } catch (err) {
console.log("ERROR 888232: error initializing HTML and attaching events in game template...: " + err);
    }

    //
    // quit if already initialized, or not first time initialized
    //
    if (this.game.initialize_game_run == 1 && this.initialize_game_run == 1) { return 0; } else { this.game.initialize_game_run = 1; this.initialize_game_run = 1; }

console.log("INITIALIZE GAME FEEDER! 2 -- " + game_id);

    this.initializeGame(game_id);

    //
    // requires game moves to be decrypted... rebroadcast pending
    //
    for (let i = 0; i < this.app.wallet.wallet.pending.length; i++) {
      let tmptx = new saito.transaction(this.app.wallet.wallet.pending[i]);
      try {
        let txmsg = tmptx.returnMessage();
        if (txmsg.module != undefined) {
          let game_self  = this.app.modules.returnModule(txmsg.module);
          if (txmsg.game_id == undefined) {
            if (txmsg.game_id !== this.game.id) {
            } else {
              if (game_self == this) {
                if (game_self.game.step.game > txmsg.step.game) {
                  this.app.wallet.wallet.pending.splice(i, 1);
                  i--;
                } else {
                  this.updateStatus("Rebroadcasting our last move to be sure opponent receives it. Please wait for your opponent to move.");
                  this.updateLog("we just rebroadcast our last move to be sure opponent receives it. please wait for your opponent to move.");
                  //
                  // avoid making multiple moves, so cut-out before next msg arrives and triggers queue processing
                  //
                  return 0;
                }
              }
            }
          }
        }
      } catch (err) {}
    }

    this.runQueue();
    return 1;

  }

  runQueue() {

    //
    // txmsg already added to queue, so only
    // sent along for reference as needed by
    // the games themselves
    //
    let game_self = this;
    let cont = 1;

console.log("QUEUE: " + JSON.stringify(game_self.game.queue));

    //
    // loop through the QUEUE (game stack)
    //
    if (game_self.game.queue.length > 0) {
      while (game_self.game.queue.length > 0 && cont == 1) {

        let gqe = game_self.game.queue.length-1;
        let gmv = game_self.game.queue[gqe].split("\t");

console.log("GAME MOVE: " + gmv[0]);

        //
        // core game engine
        //
        // SHUFFLE [decknum]
        // REQUESTKEYS [decknum] sender recipient keys
        // ISSUEKEYS [decknum] sender recipient keys decklength
        // DEAL [decknum] [player] [num_pf_cards]
        // DECKBACKUP [decknum]
        // DECKRESTORE [decknum]
        // DECKENCRYPT [decknum] [player]
        // DECKXOR [decknum] [player]
        // DECK [decknum] [array of cards]
        // POOL [poolnum]
        // FLIPCARD [decknum] [cardnum] [poolnum] [player]
        // RESOLVEFLIP [decknum] [cardnum] [poolnum]
        // RESOLVEDEAL [decknum] recipient cards
        // RESOLVE
        // GAMEOVER [msg]
        //
        if (gmv[0] === "GAMEOVER") {
          if (game_self.browser_active == 1) {
            game_self.updateStatus("Opponent Resigned");
            game_self.updateLog("Opponent Resigned");
          }
          return 0;
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
          game_self.saveGame(game_self.game.id);
        }


        if (gmv[0] == "READY") {
          game_self.game.initializing = 0;
          game_self.game.queue.splice(gqe, 1);
          game_self.saveGame(game_self.game.id);
        }


        if (gmv[0] === "SHUFFLE") {
          game_self.shuffleDeck(gmv[1]);
          game_self.game.queue.splice(gqe, 1);
        }


        if (gmv[0] === "RESOLVEDEAL") {

          let deckidx = gmv[1];
          let recipient = gmv[2];
          let cards = gmv[3];

          this.updateLog("resolving deal for "+recipient+"...");

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

          game_self.saveGame(game_self.game.id);

        }


        if (gmv[0] === "RESOLVEFLIP") {

          let deckidx = gmv[1];
          let cardnum = gmv[2];
          let poolidx = gmv[3];

          this.updateStatus("Exchanging keys to flip card...");
          this.updateLog("exchanging keys to flip card...");

          //
          // how many players are going to send us decryption keys?
          //
          let decryption_keys_needed = game_self.game.opponents.length+1;

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

          this.updateLog("decrypting cards in deck flip...");

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
            game_self.saveGame(game_self.game.id);
            cont = 1;

          } else {

            //
            // wait for more decryption keys
            //
            game_self.saveGame(game_self.game.id);
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

          this.updateLog("dealing cards to "+recipient+"...");

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

          this.updateStatus("Requesting decryption keys to draw cards from deck...");
          this.updateLog("requesting keys for "+recipient+"...");

          //
          // sender then sends keys
          //
          if (game_self.game.player == sender) {
            game_self.game.turn = [];
            game_self.game.turn.push("RESOLVE");
            for (let i = 0; i < cards; i++) { game_self.game.turn.push(game_self.game.deck[deckidx-1].keys[i]); }
            game_self.game.turn.push("ISSUEKEYS\t"+deckidx+"\t"+sender+"\t"+recipient+"\t"+cards+"\t"+game_self.game.deck[deckidx-1].keys.length);
            game_self.sendMessage("game", {});
          }

          //
          // execution stops
          //
          game_self.saveGame(game_self.game.id);
          return 0;

        }



        if (gmv[0] === "ISSUEKEYS") {

          let deckidx = gmv[1];
          let sender = gmv[2];
          let recipient = gmv[3];
          let cards = gmv[4];
          let opponent_deck_length = gmv[5]; // this is telling us how many keys the other player has, so we can coordinate and now double-decrypt
          let keyidx = gqe-cards;

console.log("deckidx: " + deckidx);
console.log("sender: " + sender);
console.log("recipient: " + recipient);
console.log("cards: " + cards);
console.log("opponent_deck_length: " + opponent_deck_length);
console.log("keyidx " + keyidx);

        // ISSUEKEYS [decknum] sender recipient keys decklength

          this.updateStatus("Issuing decryption keys to fellow players...");
          this.updateLog("issuing keys to "+recipient+"...");

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
          game_self.saveGame(game_self.game.id);

        }




        //
        // module requires updating
        //
        if (gmv[0] === "DECKBACKUP") {

          this.updateStatus("Backing up existing deck in preparation for adding new cards...");
          this.updateLog("deck backup...");
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
          game_self.saveGame(game_self.game.id);

        }


        if (gmv[0] === "DECKRESTORE") {

          this.updateLog("deck restore...");
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
          game_self.saveGame(game_self.game.id);

        }



        if (gmv[0] === "CARDS") {
          this.updateLog("exchanging cards with opponent...");
          this.updateStatus("Exchanging cards with opponent...");
          let deckidx = gmv[1];
          game_self.game.queue.splice(gqe, 1);
          for (let i = 0; i < gmv[2]; i++) {
            game_self.game.deck[deckidx-1].crypt[(gmv[2]-1-i)] = game_self.game.queue[gqe-1-i];
            game_self.game.queue.splice(gqe-1-i, 1);
          }
          game_self.saveGame(game_self.game.id);
        }



        //
        // dealing into a pool makes the cards publicly visible to everyone
        //
        if (gmv[0] === "POOL") {

          this.updateLog("creating public card pool...");
          let poolidx = gmv[1];

          //
          // create deck if not exists
          //
          game_self.resetPool(poolidx-1);

          while (game_self.game.pool.length < poolidx) { game_self.addPool(); }
          game_self.game.queue.splice(gqe, 1);
          game_self.saveGame(game_self.game.id);

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

          this.updateStatus("Flipping card from top of deck...");
          this.updateLog("flipping card from top of deck...");
          console.log("A - " + cardnum + "---" + playerid);

          //
          // players process 1 by 1
          //

          if (playerid != this.game.player) {
console.log("not my turn yt...");
            return 0;
          }

          if (cardnum == 1) {
            game_self.updateLog("flipping " + cardnum + " card into pool " + poolidx);
          } else {
            game_self.updateLog("flipping " + cardnum + " cards into pool " + poolidx);
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
          game_self.saveGame(game_self.game.id);
 
          //
          // stop execution until messages received
          //
          cont = 0;

        }


        if (gmv[0] === "DECK") {

          this.updateLog("deck processing...");
          let deckidx = parseInt(gmv[1]);
          let cards = JSON.parse(gmv[2]);
          let adjidx = (deckidx-1);

          //
          // create deck if not exists
          //
          game_self.resetDeck(deckidx-1);

          while (game_self.game.deck.length < deckidx) { game_self.addDeck(); }
          game_self.updateStatus("creating deck by importing specified cards...");
          game_self.game.deck[deckidx-1].cards = cards;
          let a = 0;
          for (var i in game_self.game.deck[adjidx].cards) {
            game_self.game.deck[adjidx].crypt[a] = game_self.app.crypto.stringToHex(i);
            a++;
          }
          game_self.game.queue.splice(gqe, 1);
          game_self.saveGame(game_self.game.id);

        }


        if (gmv[0] === "DECKXOR") {

          this.updateLog("deck initial card xor...");

          let deckidx = gmv[1];
          let playerid = gmv[2];

          //
          // players process 1 by 1
          //
          if (playerid != this.game.player) {
console.log("noping out as i am not the player to send: " + playerid + " ---- " + this.game.player);
            return 0;
          }

          game_self.updateStatus("encrypting deck for blind shuffle (player " + gmv[2] + ")");

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
          game_self.saveGame(game_self.game.id);

          //
          // stop execution until messages received
          //
          cont = 0;

        }


        if (gmv[0] === "DECKENCRYPT") {

          this.updateLog("deck initial card encrypt...");
          let deckidx = gmv[1];

          if (game_self.game.player == gmv[2]) {

            game_self.updateStatus("encrypting shuffled deck for dealing to players...");

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
            game_self.updateStatus("opponent encrypting shuffled deck for dealing to players...");
          }

          cont = 0;
        }



	//
	// this can happen if we "ISSUEKEYS" on unencrypted decks
	//
        if (gmv[0] === null || gmv[0] == "null") {
	  console.log("REMOVING NULL ENTRY");
          game_self.game.queue.splice(gqe, 1);
          game_self.saveGame(game_self.game.id);
	}


	if (cont == 1) {
	  cont = this.handleGameLoop();
	}


	if (cont == 0) {
	  return;
	}
      }
    }
  }


  handleGameLoop() {
    return 0;
  }


















  addPlayer(address) {
    if (address === "") { return; }
    for (let i = 0; i < this.game.players.length; i++) {
      if (this.game.players[i] === address) { return; }
    }
    this.game.players.push(address);
    this.game.accepted.push(0);
    if (this.app.wallet.returnPublicKey() !== address) {
console.log("just added opponent: " + address);
      this.game.opponents.push(address);
    }
console.log(this.game.players);
console.log(this.game.opponents);
  }


  receiveGameoverRequest(blk, tx, conf, app) {
    let txmsg = tx.returnMessage();
    let { game_id, module } = txmsg;

    let game_self  = app.modules.returnModule(module);

    let game = this.loadGame(game_id);
    game.over = 1;

    this.saveGame(game_id);

    game_self.game.queue.push("GAMEOVER\t");
    game_self.runQueue(txmsg);

    return;
  }

  resignGame(game_id) {

    //
    // send game over message
    //
    let game = this.loadGame(game_id);

    var newtx = this.app.wallet.createUnsignedTransactionWithDefaultFee();
    newtx.transaction.to = game.players.map(player => new saito.slip(player));

    if (game.over == 0) {
      let { winner, module } = game;

      //
      // TODO: fix for multiple players
      //
      winner = game.players.find(player => player != this.app.wallet.returnPublicKey());

      game.over = 1;
      game.last_block = this.app.blockchain.last_bid
      this.saveGame(game.id);

      let msg = {
        request: "gameover",
        game_id: game.id,
        winner,
        module,
        reason: "",
      }

      newtx.transaction = Object.assign(newtx.transaction, { msg });
      newtx = this.app.wallet.signTransaction(newtx);
      this.app.network.propagateTransaction(newtx);
    }
  }




  saveGame(game_id) {

    if (this.app.options.games == undefined) {
      this.app.options.games = [];
    }
    if (this.app.options.gameprefs == undefined) {
      this.app.options.gameprefs = {};
      this.app.options.gameprefs.random = this.app.crypto.generateKeys();
      this.app.storage.saveOptions();
    }

    if (game_id != null) {
      for (let i = 0; i < this.app.options.games.length; i++) {
        if (this.app.options.games[i].id === game_id) {
          if (this.game == undefined) { console.log("Saving Game Error: safety catch 1"); return; }
          if (this.game.id != game_id) { console.log("Saving Game Error: safety catch 2"); return; }
          this.game.ts = new Date().getTime();
          this.app.options.games[i] = JSON.parse(JSON.stringify(this.game));
          this.app.storage.saveOptions();
          return;
        }
      }
    }

    if (this.game.id === game_id) {
      this.app.options.games.push(this.game);
    } else {
      this.game = this.newGame(game_id);
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
      this.app.storage.saveOptions();
    }

    this.app.options.gameprefs[key] = value;

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

        game.step         = {};
        game.step.game    = 0;
        game.step.deck    = 0;
        game.step.deal    = 0;
        game.step.players = [];

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

    this.updateLog("shuffling deck");
    this.updateStatus("Shuffling the Deck");

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

    //
    // observer mode
    //
    if (this.game.player == 0) { return; }
    if (this.game.opponents == undefined) {
      return;
    }

    let game_self = this;
    let mymsg = {};
    let ns = {};
        ns.game = this.game.step.game;
        ns.deck = this.game.step.deck;
        ns.deal = this.game.step.deal;

console.log("existing step: " + this.game.step.game);

    if (type == "game") {
      ns.game++;
console.log("so sending with: " + ns.game);
      mymsg.request = "game";
    } else {
console.log(" not game move, sending with " + ns.game);
    }


    //
    // returns key state and game state
    //
    if (this.saveGameState == 1) { mymsg.game_state = this.returnGameState(); }
    if (this.saveKeyState == 1) { mymsg.key_state = this.returnKeyState(); }

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

    newtx.transaction.msg = mymsg;
    newtx = this.app.wallet.signTransaction(newtx);
    game_self.app.wallet.wallet.pending.push(JSON.stringify(newtx.transaction));
    game_self.saveGame(game_self.game.id);

    //
    // send off-chain if possible
    //
    if (this.relay_moves_offchain_if_possible) {
      //
      // only game moves to start
      //
      if (newtx.transaction.msg.request === "game") {
        let relay_mod = this.app.modules.returnModule('Relay');
	//
	// only initialized moves off-chain
	//
        if (relay_mod != null && game_self.game.initializing == 0) {
          relay_mod.sendRelayMessage(this.game.players, 'game relay gamemove', newtx);
        }
      }
    }

    //
    // send on-chain to preserve game record
    //
    game_self.app.network.propagateTransactionWithCallback(newtx, function (errobj) {
    });

  }


  //
  // respond to off-chain game moves
  //
  async handlePeerRequest(app, message, peer, mycallback = null) {

    await super.handlePeerRequest(app, message, peer, mycallback);

    if (message.request === "game relay gamemove") {

      if (message.data != undefined) {
        if (message.data.transaction != undefined) {
          if (message.data.transaction.msg != undefined) {
            if (message.data.transaction.msg.module === this.name) {
              let gametx = new saito.transaction(message.data.transaction);
              this.handleGameMove(this.app, gametx);
            }
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

    this.game.status = str;

    try {
      if (this.browser_active == 1) {
        let status_obj = document.getElementById("status");    
        status_obj.innerHTML = str;
      }
    } catch (err) {}

  }


  updateLog(str, length = 20) {

    if (str) {
      this.game.log.unshift(str);
      if (this.game.log.length > length) { this.game.log.splice(length); }
    }

    let html = '';

    for (let i = 0; i < this.game.log.length; i++) {
      if (i > 0) { html += '<br/>'; }
      html += "> " + this.game.log[i];
    }

    try {
      if (this.browser_active == 1) {
        let log_obj = document.getElementById("log");    
        log_obj.innerHTML = html;
      }
    } catch (err) {}

  if (this.app.BROWSER == 1) { $('#log').html(html) }

  }








  returnGameState() {
    let game_clone = JSON.parse(JSON.stringify(this.game));
    for (let i = 0; i < game_clone.deck.length; i++) {
      game_clone.deck[i].keys = [];
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
   console.log("DECRYPTED KEYSTATE!: " + decrypted_json);
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
      html += '<span class="game-option">' + name + ': ' + options[name] + '</span>, ';
    }
    html = html.slice(0, -2);
    return html;
  }


}

module.exports = GameTemplate;

