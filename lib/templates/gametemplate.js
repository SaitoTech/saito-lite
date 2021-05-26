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
 established.

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
let saito = require('../saito/saito');
let GameClock   = require('../saito/ui/game-clock/game-clock');
let GameLog = require('../saito/ui/game-log/game-log');
let GameHud = require('../saito/ui/game-hud/game-hud');
let GameMenu = require('../saito/ui/game-menu/game-menu');
let GameOverlay = require('../saito/ui/game-overlay/game-overlay');
let GameCardbox = require('../saito/ui/game-cardbox/game-cardbox');
let GameCardfan = require('../saito/ui/game-cardfan/game-cardfan');
let GameHexGrid = require('../saito/ui/game-hexgrid/game-hexgrid');
let GameObserver = require('../saito/ui/game-observer/game-observer');
const GameBoardSizer = require('../saito/ui/game-board-sizer/game-board-sizer');
const GameHammerMobile = require('../saito/ui/game-hammer-mobile/game-hammer-mobile');
let GameCryptoTransferManager = require('../saito/ui/game-crypto-transfer-manager/game-crypto-transfer-manager');



class GameTemplate extends ModTemplate {

  constructor(app) {

    super(app);

    this.name = "Game";
    this.game = {};
    this.moves = [];
    this.commands = [];
    this.initializeQueueCommandsExecuted = 0;
    this.game_state_pre_move = "";
    this.crypto_transfer_manager = new GameCryptoTransferManager(app);

    //
    // timer to rebroadcast moves
    //
    this.move_rebroadcasting_active    = false;
    this.move_rebroadcasting_speed     = 5000;
    this.move_rebroadcasting_timer     = null;

    //
    // optional interface
    //
    this.useHUD      = 1;
    this.useCardfan  = 0;
    this.useCardbox  = 0;
    this.useClock    = 0;
    this.useMenu     = 0;
    this.useOverlay  = 0;
    this.useObserver = 0;
    this.useLog      = 0;


    this.lock_interface = 0;
    this.lock_interface_step = "";
    this.lock_interface_tx = "";


    this.confirm_moves = 0;
    this.confirm_this_move = 0;

    //
    // game interface variables
    //
    this.interface = 0;    // 0 = no hud
                            // 1 = graphics hud
                            // 2 = text hud

    this.relay_moves_offchain_if_possible = 1;
    this.initialize_game_offchain_if_possible = 1;

    this.next_move_onchain_only = 0;

    this.hud 		= new GameHud(app);
    this.clock   	= new GameClock(app);
    this.log	        = new GameLog(app);
    this.overlay	= new GameOverlay(app);
    this.cardfan	= new GameCardfan(app);
    this.cardbox	= new GameCardbox(app);
    this.menu	        = new GameMenu(app);
    this.hammer		= GameHammerMobile;
    this.sizer		= GameBoardSizer;
    this.hexgrid	= new GameHexGrid();
    this.observer	= new GameObserver();

    this.clock_timer 	= null;
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

    this.time = {};
    this.time.last_received = 0;
    this.time.last_sent = 0;

    //
    // used to generate provably-fair dice rolls
    //
    this.secureroll_rnums = [];
    this.secureroll_hash  = "";

    this.observer_mode = 0;

    //
    // used in reshuffling
    //
    this.old_discards = {};
    this.old_removed  = {};
    this.old_cards    = {};
    this.old_crypt    = [];
    this.old_keys     = [];
    this.old_hand     = [];

    this.gaming_active = 0;   //
                              // this works like game.halted, except at the level of 
                              // the game engine. when a move arrives it flips to 1
                              // and when a move (rnQueue) has finished executing it 
                              // goes back to 0. The purpose is to prevent a second 
                              // move from arriving and executing while the previous 
                              // one is still executing.
                              //
                              // the difference between game.halted and gaming_active
                              // for design purposes is that game.halted should be 
                              // used when the interface stops the game (i.e. user
                              // acknowledgement is required for the game to progress
                              // while gaming_active happens behind the scenes.
                              //

    this.initialize_game_run = 0; //
                                  // this is distinct from this.game.initialize_game_run
                                  // the reason is that BOTH are set to 1 when the game
                                  // is initialized. But we only nope out on initializing
                                  // the game if BOTH are 1. This allows us to swap in and
                                  // out saved games, but still init the game on reload if
                                  // this.game.initialize_game_run is set to 1 but it is
                                  // a freshly loaded browser.
                                  //

    //
    // instead of associating a different function with each card css we are
    // associating a single one, and changing the reference function inside
    // to get different actions executed on click. Basically we swap out the
    // changeable function before attachingCardEvents and everything just works
    //
    this.changeable_callback = function(card) {};
    let temp_self = this;
    this.cardbox_callback = function(card) { temp_self.changeable_callback(card); };

    return this;

  }


  startMoveRebroadcasting() {
    if (this.move_rebroadcasting_active) { clearInterval(this.move_rebroadcasting_timer); }
    this.move_rebroadcasting_active = true;
    this.move_rebroadcasting_timer = setInterval(() => { 

      for (let i = 0; i < this.app.wallet.wallet.pending.length; i++) {
        let ptx = new saito.transaction(JSON.parse(this.app.wallet.wallet.pending[i]));
	if (ptx.msg) {
	  if (ptx.msg.game_id) {
	    if (ptx.msg.game_id == this.game.id) {

	      console.log("Rebroadcasting Pending Game TX as NEW TX");
	      console.log("gameid: " + ptx.msg.game_id);

	      let newptx = ptx;

/***
	      //
	      // resend move as zero-fee TX in case of failure with slips in paid one
	      //
    	      let newptx = this.app.wallet.createUnsignedTransaction(this.app.wallet.returnPublicKey(), 0.0, 0.0);
              if (newptx == null) {
		console.log("Error sending zero-fee newptx transaction: resend old");
		newptx = ptx;
		return; 
	      } else {

		console.log("Error sending zero-fee newptx transaction: resend old");

                for (let ii = 0; ii < this.game.opponents.length; ii++) {
                  newptx.transaction.to.push(new saito.slip(this.game.opponents[i], 0.0));
                }

                newptx.msg = ptx.msg;
                newptx = this.app.wallet.signTransaction(newptx);
                this.app.wallet.wallet.pending[i] = JSON.stringify(newptx.transaction);

	      }
***/

              this.app.network.propagateTransaction(newptx);
              console.log("Finished Rebroadcast Attempt");
/****
	      try {
		console.log("Resending move as relay message...");
                let relay_mod = this.app.modules.returnModule('Relay');
                if (relay_mod != null && (game_self.game.initializing == 0 || (game_self.initialize_game_offchain_if_possible == 1))) {
		  console.log("Resending move as relay message 2...");
                  relay_mod.sendRelayMessage(this.game.players, 'game relay gamemove', ptx);
                }
	      } catch (err) {
		console.log("Error resending move as relay message 3...");
	      }
****/
	    }
	  }
	}
      }

    }, this.move_rebroadcasting_speed);
  }

  stopMoveRebroadcasting() {
    this.move_rebroadcasting_active = false;
    clearInterval(this.move_rebroadcasting_timer);
  }




  async displayModal(modalHeaderText, modalBodyText="") {
    await salert(`${modalHeaderText}: ${modalBodyText}`);
  }
  async preloadImages() {}


  initializeHTML(app) {

    //
    // initialize game feeder tries to do this
    //
    // it needs to as the QUEUE which starts
    // executing may updateStatus and affect
    // the interface. So this is a sanity check
    //
    if (this.browser_active == 0) { return; }
    if (this.initialize_game_run == 1) { return 0; }


    //
    // hash reflects game position
    //
    try {
      let oldHash = window.location.hash;
      if (oldHash != "") {
	let results = app.browser.parseHash(oldHash);
	let arcade_mod = app.modules.returnModule("Arcade");
	if (arcade_mod) {

	  let game_id = results.gid;
	  let bid = results.bid;
	  let tid = results.tid;
	  let last_move = results.lm;
	  let player = "";

	  msg = {};
	  msg.game_id = game_id;
	  msg.bid = bid;
	  msg.tid = tid;
	  msg.last_move = last_move;
	  msg.player = "";
	  msg.module = this.name;

          let msgobj = app.crypto.stringToBase64(JSON.stringify(msg));

	  if (this.game.id != game_id) {
	    arcade_mod.observeGame(msgobj, last_move);
	    return;
	  }
	}
      }

      window.location.hash = `#`;
      window.location.hash = app.browser.initializeHash(`#gid=${this.game.id}&bid=1&tid=1&lm=0`, oldHash, {});

    } catch (err) {}


    //
    // check options for clock
    //
    if (this.game.options) {
      if (this.game.options.clock) {
        if (this.game.options.clock == 0) {
          this.game.clock_limit = 0;
          this.useClock = 0;
        } else {
          if (this.game.clock_spent == 0) {
            this.game.clock_limit = parseInt(this.game.options.clock)*60*1000;
          }
          this.useClock = 1;
        }
      }
    }


    if (this.useHUD == 1) {
      this.hud.render(app, this);
      this.hud.attachEvents(app, this);
    }


    if (this.useClock == 1) {
      this.clock.render(app, this);
      this.clock.attachEvents(app, this);
    }

    if (this.useObserver == 1 || this.game.player == 0) {
      this.observer.render(app, this);
      this.observer.attachEvents(app, this);
    }


    //
    // load initial display preferences
    //
    if (this.app.options != undefined) {
      if (this.app.options.gameprefs != undefined) {
        if (this.app.options.gameprefs.lang != undefined) { this.lang = this.app.options.gameprefs.lang; }
        if (this.app.options.gameprefs.interface != undefined) { this.interface = this.app.options.gameprefs.interface; }
      }
    }
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
    if (this.useHUD == 1) { this.hud.attachEvents(app, this); }

  }

  attachCardEvents(app) {
    if (this.useHUD == 1) { this.hud.attachCardEvents(app, this); }
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

//console.log("ON-CONF: " + JSON.stringify(txmsg));

      let tx_processed = 0;
      let old_game_id = "";

      //
      // what if no game is loaded into module
      //
      if ((game_self.game === "undefined" || game_self.game === undefined || game_self.game === "" || game_self.game === null) && txmsg.game_id != "") {
console.log("loading game in on-confirmation");
        game_self.game = game_self.loadGame(txmsg.game_id);
      }

      //
      // delete bad games
      //
      if (this.app.options) {
        for (let i = 0; i < this.app.options.games; i++) {
          if (this.app.options.games[i].id) {
            if (this.app.options.games[i].id.length < 25) {
              this.app.options.games.splice(i, 1);
              i--;
            }
          }
        }
      }


      // acceptances
      if (tx.isTo(app.wallet.returnPublicKey()) && txmsg.request === "accept") {
        tx_processed = 1;
        let accept_game = await game_self.receiveAcceptRequest(blk, tx, conf, app);
      }


      //
      // process game move
      //
      let game_id = txmsg.game_id;
      if (app.options.games) {
        for (let i = 0; i < app.options.games.length; i++) {
          if (game_id == app.options.games[i].id) {

console.log("onchain game move received... and processing: " + tx_processed);

            following_game = 1;

            if (tx.isTo(app.wallet.returnPublicKey())) {
              if (tx_processed == 0) {
                if (game_self.isFutureMove(tx.transaction.from[0].add, txmsg)) {
                  console.log("Onchain Future Move from: " + tx.transaction.from[0].add + " -- " + JSON.stringinfy(txmsg.step));
                  game_self.addFutureMove(tx);
                } else {
                  if (game_self.isUnprocessedMove(tx.transaction.from[0].add, txmsg)) {
                    console.log("Onchain Next Move from: " + tx.transaction.from[0].add + " -- " + JSON.stringinfy(txmsg.step));
                    game_self.addNextMove(tx);
                  } else {
console.log("received not a future move, but also not an unprocessed move...");
console.log(JSON.stringify(txmsg));
		  }
		}
              }

            } else {

              //
              // if observer mode enabled
              //
              if (app.options.games[i].observer_mode == 1) {

                if (txmsg.request !== "game") { return; };

                // only load the game if not active, otherwise we load every move and repeat moves
                if (game_self.game.id != game_id) {
                  console.log("2. Loading Game ID: " + game_id);
                  game_self.loadGame(game_id); 
                }
                if (game_self.isFutureMove(tx.transaction.from[0].add, txmsg)) {
                  console.log("2. Processing Future Move onConf: " + JSON.stringify(txmsg.step));
                  game_self.addFutureMove(tx);
                } else {
                  if (game_self.isUnprocessedMove(tx.transaction.from[0].add, txmsg)) {
                    console.log("2. Processing Next Move onConf: " + JSON.stringify(txmsg.step));
                    game_self.addNextMove(tx);
                  }
                }
              }
            }
          }
        }
      }
    }
  }







  //
  // we accept this as the next move if it is either one more than the current
  // in the MASTER step (i.e. legacy for two player games) or if it is one more
  // than the last move made by the specific player (i.e. 3P simultaneous moves)
  //
  isFutureMove(playerpkey, txmsg) {

    let game_self = this;

    if (txmsg.game_id !== game_self.game.id) { 
      return 0;
    }
    if (parseInt(txmsg.step.game) <= (parseInt(game_self.game.step.game)+1)) { 
      return 0; 
    }
    if (txmsg.step.game <= (game_self.game.step.players[playerpkey]+1)) { 
      return 0; 
    }

    if (txmsg.step.game > (game_self.game.step.game+1)) { return 1; }
    if (txmsg.step.game > (game_self.game.step.players[playerpkey]+1)) { return 1; }

    if (game_self.gaming_active == 1) { return 1; }

    return 0;

  }



  isPastMove(player, txmsg) {

    let game_self = this;

    if (txmsg.game_id !== game_self.game.id) { 
      return 0;
    }
    if (parseInt(txmsg.step.game) <= parseInt(game_self.game.step.game)) { 
      if (parseInt(txmsg.step.game) <= parseInt(game_self.game.step.players[player])) { 
        return 1;
      }
    }
    return 0;

  }





  isUnprocessedMove(player, txmsg) {

    let game_self = this;
    if (txmsg.game_id !== game_self.game.id) { 
      return 0;
    }

    if (parseInt(txmsg.step.game) == (game_self.game.step.game+1)) { 
      return 1;
    }
    if (parseInt(txmsg.step.game) == (game_self.game.step.players[player]+1)) { 
      return 1; 
    }
    // FEB 24 - player has an updated move, but not the lastest according to game logic
    if (game_self.game.step.players[player]) {
      if (txmsg.step.game > game_self.game.step.players[player] && txmsg.step.game < game_self.game.step.game) { 
        return 1; 
      }
    }

    return 0;

  }





  createSorryAcceptedTransaction(recipient, game_id) {

    let tx = this.app.wallet.createUnsignedTransactionWithDefaultFee(recipient);
        tx.msg.module       = this.name;
        tx.msg.request      = "sorry";
        tx.msg.game_id      = game_id;
        tx = this.app.wallet.signTransaction(tx);

    return tx;

  }


  //
  // dummy function, arcade usually handles
  //
  receiveSorryAcceptedTransaction(blk, tx, conf, app) {

    try {
 
    } catch (err) {

    }

  }





  createAcceptTransaction(game) {
    let {players, ts, players_needed, players_sigs, id, options} = game;

    let tx = this.app.wallet.createUnsignedTransactionWithDefaultFee();
    for (let i = 0; i < players.length; i++) {
      tx.transaction.to.push(new saito.slip(players[i], 0.0));
    }
    tx.msg.ts             = ts;
    tx.msg.module         = this.name;
    tx.msg.request        = "accept";
    tx.msg.game_id        = id;
    tx.msg.options        = options;
    tx.msg.players        = players;
    tx.msg.players_needed = players_needed;
    tx.msg.players_sigs   = [...players_sigs, this.app.crypto.signMessage(`invite_game_${ts}`, this.app.wallet.returnPrivateKey())];
    //
    // this tx is addressed to all participants, thus we set a
    // separate variable to identify the original user whose
    // invite transaction is being responded to here.
    //
    tx.msg.originator   = tx.transaction.from[0].add;
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
      let msg_to_verify = "create_game_" + tx.msg.ts;
      if (app.crypto.verifyMessage(msg_to_verify, txmsg.accept_sig, this.app.wallet.returnPublicKey())) {
        create_new_game = 1;
        send_accept_tx  = 1;
      }
    }

    //
    // auto-accept games i send inviting others
    //
    if (txmsg.invite_sig != "") {
      let msg_to_verify2 = "invite_game_" + tx.msg.ts;
      if (app.crypto.verifyMessage(msg_to_verify2, txmsg.invite_sig, this.app.wallet.returnPublicKey())) {
        create_new_game = 1;
      }
    }


    //
    // inviter auto-accepts
    //
    if (txmsg.invite_sig != "") {
      let msg_to_verify2 = "invite_game_" + tx.msg.ts;
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
      this.game.players_sigs = txmsg.players_sigs;
      this.saveGame(game_id);
      this.game.ts           = txmsg.ts;

      console.log("\n\n\nWHAT IS THE GID: " + game_id);
      console.log("WHAT IS THE TS: " + this.game.ts);
      console.log("PLAYERS NEEDED: " + this.game.players_needed);
      console.log("PLAYERS SIGS: " + this.game.players_sigs);
      console.log("PLAYERS ON INVITE: " + this.game.players);
      console.log("ACCEPTS ON INVITE: " + this.game.accepted);
      console.log("OPTIONS: " + JSON.stringify(this.game.options));
      console.log("GAMES: ", this.app.options.games);

    }

    if (send_accept_tx == 1) {
      let newtx = this.createAcceptTransaction(this.game);
      app.network.propagateTransaction(newtx);
    }

    return;

  }

  async receiveAcceptRequest(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();

    let game_id = txmsg.game_id;
    let originator = txmsg.originator;

    this.loadGame(game_id);
//
	  //// undo hanlted = 0;

    //
    // accepted games should have all the players. If they do not, drop out
    //
    if (txmsg.players_needed > txmsg.players.length) {
      console.log("ACCEPT REQUEST RECEIVED -- but not enough players in accepted transaction.... aborting");
      this.game.halted = 0;
      return 0;
    }


    //
    // ignore games not containing us
    //
    if (!txmsg.players.includes(app.wallet.returnPublicKey())) {
      console.log("ACCEPT REQUEST RECEIVED -- but not for a game with us in it!");
      this.game.halted = 0;
      return 0;
    }

    //
    // sorry to games we have already processed
    //
    //let newtx = this.createSorryAcceptedTransaction(tx.transaction.from[0].add);
    //    newtx = this.app.wallet.signTransaction(newtx);
    //this.app.network.propagateTransaction(newtx);
    //return;


    //
    // validate all accept-sigs are proper
    //
    let msg_to_verify = "invite_game_" + txmsg.ts;
    let all_verify = 1;
    if (txmsg.players.length != txmsg.players_sigs.length) { all_verify = 0; }
    for (let i = 0; i < txmsg.players.length; i++) {
      if (!app.crypto.verifyMessage(msg_to_verify, txmsg.players_sigs[i], txmsg.players[i])) {
        console.log("PLAYER SIGS do not verify for all players, aborting game acceptance");
        this.game.halted = 0;
        return 0;
      }
    } 

    //
    // if game is over, exit
    //
    if (this.game.over == 1) { 
      this.game.halted = 0;
      return 0;
    }


    //
    // otherwise setup the game
    //
    this.gaming_active = 1;
    this.game.options = txmsg.options;
    this.game.module = txmsg.module;


    //
    // enable save game state if observer mode is an advanced option
    //
    if (this.game.options.observer === "enable") {
      this.game.observer_mode = 1;
      this.observer_mode = 1;
      this.game.saveGameState = 1;
    }




    //
    // add all the players
    //
    for (let i = 0; i < txmsg.players.length; i++) {
      this.addPlayer(txmsg.players[i]);
    }

    this.saveGame(game_id);

    if (this.game.players_set == 0) {

      //
      // set our player numbers alphabetically
      //
      let players = [];
      for (let z = 0; z < this.game.players.length; z++) {
        players.push(this.app.crypto.hash(this.game.players[z]+this.game.id));
        this.game.keys.push(this.game.players[z]); // defaults to SAITO keys
						   // use KEY to update to DOT / etc.
      }
      players.sort();

      let players_reconstructed = [];
      for (let z = 0; z < players.length; z++) {
        for (let zz = 0; zz < this.game.players.length; zz++) {
          if (players[z] === this.app.crypto.hash(this.game.players[zz]+this.game.id)) {
            players_reconstructed.push(this.game.players[zz]);
          }
        }
      }

      this.game.players = players_reconstructed;

      for (let i = 0; i < players.length; i++) {

        if (players[i] === this.app.crypto.hash(this.app.wallet.returnPublicKey()+this.game.id)) {
            this.game.player = i+1;
        }
      }


      //
      // game step
      //
      for (let i = 0; i < this.game.players.length; i++) {
        this.game.step.players[this.game.players[i]] = 1;
      }


      //
      // special key for keystate encryption
      //
      this.saveGamePreference((game_id+"_sharekey"), app.crypto.generateRandomNumber());

console.log("!!!!!!!!!!!!!!!!!!!!");
console.log("!!! GAME CREATED !!!");
console.log("!!!!!!!!!!!!!!!!!!!!");
console.log("My Public Key: " + this.app.wallet.returnPublicKey());
console.log("My Position: "   + this.game.player);
console.log("My Share Key: "  + this.loadGamePreference((game_id+"_sharekey")));
console.log("ALL KEYS: " + JSON.stringify(this.game.players));
console.log("saving with id: " + game_id);
console.log("!!!!!!!!!!!!!!!!!!!!");
console.log("!!!!!!!!!!!!!!!!!!!!");
console.log("!!!!!!!!!!!!!!!!!!!!");

      this.game.players_set = 1;
      this.saveGame(game_id);

      //
      // small delay to permit save to work
      //
      this.gaming_active = 0;

      //
      // players are set and game is accepted, so move into handleGame
      //
      this.initializeGameFeeder(game_id);
      this.processFutureMoves();

    }

    return game_id;
  }




  initialize(app) {

    this.initializeQueueCommands();
    this.startMoveRebroadcasting(); // loop to check for stalled txs

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
    // initialize the clock
    //
    if (this.game.clock_spent > 0) { 
      this.time.last_received = new Date().getTime();
      this.time.last_sent = new Date().getTime();
    } else {
      this.time.last_received = new Date().getTime();
      this.time.last_sent = new Date().getTime();
    }


    //
    //
    //
    this.initializeGameFeeder(this.game.id);
  }


  removeEventsFromBoard() {
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




  async initializeGameFeeder(game_id) {

    //
    // sanity load (multiplayer)
    //
    if (this.game) {
      if (this.game.id !== game_id) {
        this.loadGame(game_id);
      }
    }

    //
    // proactively initialize HTML so that the HUD
    // and other graphical elements exist for the game
    // queue to handle. We must specify not to do this
    // twice, ergo initializeHTML doing the init check
    //
    this.initializeHTML(this.app);
    this.attachEvents(this.app);

    //
    // quit if already initialized, or not first time initialized
    //
    if (this.game.initialize_game_run == 1 && this.initialize_game_run == 1) { return 0; } else { this.game.initialize_game_run = 1; this.initialize_game_run = 1; }

    this.initializeGame(game_id);

    // FEB 12 - disabling causes init on receiver so reduce to earliest step
    if (this.game.step.game < 2) { 
      console.log("saving in initializegamefeeder");
      this.saveGame(this.game.id); 
    }
    this.startQueue();
    this.gaming_active = 0;
    return 1;

  }



  startQueue() {
    //this.gaming_active = 1;
    this.runQueue();
    //this.gaming_active = 0;
    // gaming_active prevents future moves running
    if (this.gaming_active != 1) {
      this.processFutureMoves();
    }
  }


  runQueue() {

    let game_self = this;
    let cont = 1;
    let loops_through_queue = 0;
    let loop_length = 0;
    let loop_length_instruction = "";

    //
    //
    //
    this.game_state_pre_move = JSON.parse(JSON.stringify(game_self.game));

    //
    // loop through the QUEUE (game stack)
    //
    if (game_self.game.queue.length > 0) {
      while (game_self.game.queue.length > 0 && cont == 1) {

	loops_through_queue++;
        loop_length = game_self.game.queue.length;
        loop_length_instruction = game_self.game.queue[game_self.game.queue.length-1];

        if (loops_through_queue >= 100) {
          console.log("ENDLESS QUEUE LOOPING");
          process.exit();
        }

        let gqe = game_self.game.queue.length-1;
        let gmv = game_self.game.queue[gqe].split("\t");

        //
        // queue execution basically starts the timer
        //
        this.time.last_received = new Date().getTime();

        for (let i = 0; i < game_self.commands.length; i++) {
          if (game_self.commands[i](game_self, gmv) === 0) { 
            return 0;
          }
        }

        //
        // we have not removed anything, so throw it to the game
        //
        if (loop_length == game_self.game.queue.length && cont == 1 && loop_length_instruction === game_self.game.queue[game_self.game.queue.length-1]) {
          cont = this.handleGameLoop();
        }

        if (cont == 0) {
          //
          // check here -- redundant except for "acknowledge", as if we
          // have just closed one of those it is possible that other 
          // future moves have arrived in the meantime.
          //
          this.processFutureMoves();
          return 0;
        }
      }
    }
  }







  addNextMove(gametx) {

console.log("executing NEXT move");

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
console.log("saving future moves as halted");
      game_self.saveFutureMoves(game_self.game.id);
      game_self.gaming_active = 0;
      return;
    }



    ////////////////////////////////////
    // observer mode update last_move //
    ////////////////////////////////////
    if (gametxmsg.last_move > 0) {
      game_self.game.step.ts = gametxmsg.last_move;
      game_self.game.step.bid = gametxmsg.last_bid;
      game_self.game.step.tid = gametxmsg.last_tid;
      try {
        window.location.hash = `#gid=${this.game.id}&bid=${game_self.game.step.bid}&tid=${game_self.game.step.tid}&lm=${game_self.game.step.ts}`; 
      } catch (err) {
console.log("ERROR updating hash in observer mode");
      }
    } else {

      //
      // we are not in observer mode because we don't have last_move in the tx
      // which would need to be supplied by the server or peer that is saving
      // gamestate, but we can create a link that will approximate the point of
      // entry, by providing the current timestamp as our ts.
      //
      window.location.hash = `#gid=${this.game.id}&bid=0&tid=0&lm=${new Date().getTime()}`; 

    }


    //
    // ACCEPT / JOIN / OPEN will not have turn defined
    //
    if (gametxmsg.turn == undefined) { gametxmsg.turn = []; }
    if (gametxmsg.step == undefined) { gametxmsg.step = {}; }
    game_self.game.step.players[gametx.transaction.from[0].add] = gametxmsg.step.game;
    if (gametxmsg.step.game > game_self.game.step.game) {
      game_self.game.step.game = gametxmsg.step.game;
    }

    //
    // OBSERVER MODE - 
    //
    if (game_self.game.player == 0) {

console.log("OBSERVER MODE executing step: " + JSON.stringify(gametxmsg.step));

      if (gametxmsg.game_state.deck) {
        if (gametxmsg.game_state.deck.length > 0) {

          console.log("DECK SENT: " + JSON.stringify(gametxmsg.game_state.deck));
          let sharekey = null;

          //
          // create object to hold player deck
          //
          if (game_self.game.player_decks) {} else {
            game_self.game.player_decks = [];
            if (game_self.game.player_decks.length < game_self.game.players) {
              for (let i = 0; i < game_self.game.players.length; i++) {
                game_self.game.player_decks.push = {};
                game_self.game.player_decks[i].deck = [];
              }
            }
          }
        }

  
        //
        // update non-secret deck info
        //
        for (let i = 0; i < gametxmsg.game_state.deck.length; i++) {
          game_self.game.deck[i] = gametxmsg.game_state.deck[i];
        }
      


        if (gametxmsg.sharekey) {
          let player_idx = 0;
          for (let i = 0; i < game_self.game.players.length; i++) {
            if (game_self.game.players[i] === gametx.transaction.from[0].add) {
              player_idx = i;
            }
          }

          let sharekey = gametxmsg.sharekey;
          if (sharekey) {
            for (let i = 0; i < gametxmsg.game_state.deck.length; i++) {
              while (game_self.game.player_decks.length <= player_idx) {
                game_self.game.player_decks.push({});
                game_self.game.player_decks[game_self.game.player_decks.length-1].deck = [];
              }
              while (game_self.game.player_decks[player_idx].deck.length <= i) {
                game_self.game.player_decks[player_idx].deck.push({});
              }
              game_self.game.player_decks[player_idx].deck[i].hand = JSON.parse(this.app.crypto.hexToString(this.app.crypto.decodeXOR(gametxmsg.game_state.deck[i].hand, sharekey)));
              game_self.game.player_decks[player_idx].deck[i].keys = JSON.parse(this.app.crypto.hexToString(this.app.crypto.decodeXOR(gametxmsg.game_state.deck[i].keys, sharekey)));
            }
          }
        }
      }
    }


    ///////////
    // QUEUE //
    ///////////
    if (game_self.game.queue != undefined) {

      for (let i = 0; i < gametxmsg.turn.length; i++) {
        game_self.game.queue.push(gametxmsg.turn[i]);
      }

      //
      // added sept 27 - we may have spliced away, so don't read in saveGame
      //
console.log("saving game condition and heading into runQueue");
      game_self.saveFutureMoves(game_self.game.id);
      game_self.saveGame(game_self.game.id);
      game_self.runQueue();
      game_self.processFutureMoves();
      game_self.gaming_active = 0;
    }


  }


  addFutureMove(gametx) {
    let game_self = this;
    if (!game_self.game.future.includes(JSON.stringify(gametx.transaction))) {
      game_self.game.future.push(JSON.stringify(gametx.transaction));
      game_self.saveFutureMoves(game_self.game.id);
    }

    ////////////////////////////////////
    // observer mode update last_move //
    ////////////////////////////////////
    if (game_self.game.player == 0) {
      try {
        game_self.observer.showNextMoveButton();
      } catch (err) {

      }
    }

  }




  processFutureMoves() {

    let game_self = this;

//console.log("FUTURE MOVES: " + game_self.game.future.length);
//console.log("gaming active --> " + game_self.gaming_active);
//console.log("game halted   --> " + game_self.game.halted);
//console.log("game step --> " + game_self.game.step.game);
//console.log("PLAYER: " + game_self.game.player);

    //
    // observers don't need to respect this
    //
    // TODO -- unsure if this is needed
    //
    if (game_self.game.player != 0) { 
      if (game_self.gaming_active == 1) { return 0; }
      if (game_self.game.halted == 1) { return 0; }
    }

    //
    // do we have future game moves waiting
    //
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
    //console.log("handle game loop returning 0...");
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

      //
      // sender must be in game to end it (removed players no problem)
      //
      if (game_self.game.players.includes(tx.transaction.from[0].add)) {

        game.over = 1;
        this.saveGame(game_id);

        game_self.game.queue.push("GAMEOVER\t");
        game_self.runQueue(txmsg);
        game_self.gaming_active = 0;

      }
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




  //
  // async not used now, but exists to we can potentially add a delay after saves
  // in the future if needed.
  //
  async saveGame(game_id) {

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

	      //
	      // add slight delay on saves to permit storage to save before next move
	      //
              return new Promise((resolve, reject) => {
                setTimeout(() => {
         	  resolve(1);
        	}, 1000);
      	      });
            }
          }
        }
      }
    }

    if (this.game.id === game_id) {
      this.app.options.games.push(this.game);
    } else {
      this.game = this.newGame(game_id);
    }

    if (this.game.id.length < 25) {
      if (this.game.players_needed > 1) {
        process.exit();
      }
    }


    //
    // add slight delay on saves to permit storage to save before next move
    //
    this.app.storage.saveOptions();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(1);
      }, 1000);
    });

  }

  deleteGamePreference(key) {
    if (this.app.options) {
      if (this.app.options.gameprefs) {
        if (this.app.options.gameprefs[key]) {
          delete this.app.options.gameprefs[key];
        }
      }
    }
    return null;
  }
  loadGamePreference(key) {
    if (this.app.options) {
      if (this.app.options.gameprefs) {
         return this.app.options.gameprefs[key];
      }
    }
    return null;
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
        game.confirms_needed = [];
        game.crypto	  = "";
        game.player       = 1;
        game.players      = [];
        game.keys         = [];
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
        game.future       = []; // future moves (arrive while we take action)
        game.halted       = 0;
        game.lock_interface = 0;
        game.saveGameState = 0;

        game.clock_spent  = 0;
        game.clock_limit  = 0;

        game.step         = {};
        game.step.game    = 1;
        game.step.players = {}; // associative array mapping pkeys to last game step
	game.step.ts      = 0;  // last_move in observer mode

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


  shuffleDeck(deckidx=1) {

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



  async sendMessage(type = "game", extra = {}, mycallback = null) {

    //
    // CONFIRM MOVES
    //
    if (this.confirm_moves == 1 && this.confirm_this_move == 1) {
      if (this.game.turn.length > 0) {
        let c = await sconfirm("Submit this move?");
        if (!c) {
          window.location.reload();
          return;
        }
        this.confirm_this_move = 0;
      }
    }

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
    }


    //
    // OBSERVER MODE - gameState
    //
    // if we are saving game state, we make sure the other player does too!
    if (this.game.saveGameState == 1) {  
      if (this.observer_mode == 0) {
        this.game.turn.push("OBSERVER\t"+this.game.player+"\t1");
        this.game.turn.push("SETVAR\tsaveGameState\t1");
      }
      mymsg.game_state = this.returnPreMoveGameState(); 
      mymsg.sharekey = this.loadGamePreference(this.game.id + "_sharekey");
    }

    //
    // if our crypto key is out-of-date, update
    //
    if (game_self.game.crypto !== "SAITO" && game_self.game.crypto !== "") {
      let crypto_mod = this.app.wallet.returnCryptoModuleByTicker(game_self.game.crypto);
      let crypto_key = this.app.wallet.returnPublicKey();
      if (crypto_mod) { crypto_key = crypto_mod.returnAddress(); }
      for (let i = 0; i < this.game.players.length; i++) {
        if (this.game.players[i] == this.app.wallet.returnPublicKey()) {
	  if (this.game.keys[i] !== crypto_key) {
            this.game.turn.push("CRYPTOKEY\t"+this.app.wallet.returnPublicKey()+"\t"+crypto_key+"\t"+this.app.crypto.signMessage(crypto_key, this.app.wallet.returnPrivateKey()));
 	  }
        }
      }
    //
    // revert keys to SAITO if necessary
    //
    } else {
      let crypto_key = this.app.wallet.returnPublicKey();
      for (let i = 0; i < this.game.players.length; i++) {
        if (this.game.players[i] == this.app.wallet.returnPublicKey()) {
	  if (this.game.keys[i] !== crypto_key) {
            this.game.turn.push("CRYPTOKEY\t"+crypto_key+"\t"+crypto_key+"\t"+this.app.crypto.signMessage(crypto_key, this.app.wallet.returnPrivateKey()));
 	  }
        }
      }
    }


    mymsg.turn = this.game.turn;
    mymsg.module = this.name;
    mymsg.game_id = this.game.id;
    mymsg.player = this.game.player;
    mymsg.step = ns;
    mymsg.extra = extra;

    let newtx = this.app.wallet.createUnsignedTransactionWithDefaultFee(this.app.wallet.returnPublicKey(), 0.0);
    if (newtx == null) {
      alert("ERROR: Difficulty Sending Transaction, please reload");
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

        let gametx = new saito.transaction(message.data.transaction);

        let gametxmsg = gametx.returnMessage();

        //
        // nope out if game does not exist locally
        //
        if (!game_self.doesGameExistLocally(gametxmsg.game_id)) {
	  console.log("Game does not exist locally. Not processing HPR message: waiting for on-chain");
	  return;
        }


        if (gametxmsg.module == this.name) { 
/********* MAY 28
	  //
	  // we are concerned about receiving moves out-of-order
 	  //
          if ( ( (!game_self.game) || (game_self.game.id != gametxmsg.game_id ) ) && gametxmsg.game_id != "") {
	    for (let i = 0; i < gametxmsg.turn.length; i++) {
	      if (gametxmsg.turn[i].indexOf("FLIP") > -1) { 
	        console.log("ERROR: game does not exist but off-chain flip creation received. Waiting for on-chain confirmation");
		return;
	      }
	      if (gametxmsg.turn[i].indexOf("DECK") > -1) { 
	        console.log("ERROR: game does not exist but off-chain deck creation received. Waiting for on-chain confirmation");
		return;
	      }
	      if (gametxmsg.turn[i].indexOf("ISSUEKEYS") > -1) { 
	        console.log("ERROR: game does not exist but off-chain issuekeys request received. Waiting for on-chain confirmation");
		return;
	      }
	      if (gametxmsg.turn[i].indexOf("RESOLVE") > -1) { 
	        console.log("ERROR: game does not exist but off-chain resolve request received. Waiting for on-chain confirmation");
		return;
	      }
	    }
	  }
*************/


          //
          // what if no game is loaded into module -- replaced below may 28
          //
//          if ( ( (!game_self.game) || (game_self.game.id != gametxmsg.game_id ) ) && gametxmsg.game_id != "") {
//            game_self.game = game_self.loadGame(gametxmsg.game_id);
//            let cont = game_self.runQueue();
//          }

          //
          // if this game is not loaded...
          //
          if ((game_self.game == "undefined" || game_self.game == undefined || game_self.game == "" || game_self.game == null) && gametxmsg.game_id != game_self.game.id) {
	    console.log("peer to peer game move but not for this game so dropping");
	    return;
          }


          if (game_self.isFutureMove(gametx.transaction.from[0].add, gametxmsg)) {
console.log("Receive Future Move Offchain: " + JSON.stringify(gametxmsg.step));
            game_self.addFutureMove(gametx);
          } else {
            if (game_self.isUnprocessedMove(gametx.transaction.from[0].add, gametxmsg)) {
console.log("Receive NEXT Move Offchain: " + JSON.stringify(gametxmsg.step));
              game_self.addNextMove(gametx);
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



  //
  // force can be set to 1 to override "lock_interface"
  // which is often set to 1 in the game engine to prevent
  // moves that come in while the player is waiting from
  // updating the screen.
  //
  updateStatus(str, force=0) {

    if (this.lock_interface == 1 && force == 0) { return; }

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
    } catch (err) { console.log("Error Updating Log: ignoring"); }

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

    // update log and bind events
    this.log.updateLog(str, this.addLogCardEvents.bind(this), force);

  }








  //
  // OBSERVER MODE - return keystate prior to move (hand, etc.)
  //
  returnPreMoveGameState() {
    let game_clone = JSON.parse(JSON.stringify(this.game_state_pre_move));
    let sharekey = this.loadGamePreference(this.game.id+"_sharekey");
    for (let i = 0; i < game_clone.deck.length; i++) {
      if (sharekey) {
        game_clone.deck[i].hand = this.app.crypto.encodeXOR(this.app.crypto.stringToHex(JSON.stringify(game_clone.deck[i].hand)), sharekey);
        game_clone.deck[i].keys = this.app.crypto.encodeXOR(this.app.crypto.stringToHex(JSON.stringify(game_clone.deck[i].keys)), sharekey);
      } else {
        game_clone.deck[i].keys = [];
        game_clone.deck[i].hand = [];
      }
    }
    return game_clone;
  }
  returnGameState() {
    let game_clone = JSON.parse(JSON.stringify(this.game));
    let sharekey = this.loadGamePreference(this.game.id+"_sharekey");
    for (let i = 0; i < game_clone.deck.length; i++) {
      if (sharekey) {
        game_clone.deck[i].hand = this.app.crypto.encodeXOR(this.app.crypto.stringToHex(JSON.stringify(game_clone.deck[i].hand)), sharekey);
        game_clone.deck[i].keys = this.app.crypto.encodeXOR(this.app.crypto.stringToHex(JSON.stringify(game_clone.deck[i].keys)), sharekey);
      } else {
        game_clone.deck[i].keys = [];
        game_clone.deck[i].hand = [];
      }
    }
    return game_clone;
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
//
// TODO - eliminate jquery dependency here
//
try {
      $('.logcard').off();
      $('.logcard').mouseover(function() {
        let card = $(this).attr("id");
        gameobj_self.showCard(card);
      }).mouseout(function() {
        let card = $(this).attr("id");
        gameobj_self.hideCard(card);
      });
} catch (err) {}
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

  returnGameOptionsHTML() {
    return `
      <div id="game-wizard-advanced-return-btn" class="game-wizard-advanced-return-btn button">accept</div>
    `;
  }   
      


  returnPlayersBoxArray() {

    let player_box = [];

    if (this.game.players.length == 2) { player_box = [1, 4]; }
    if (this.game.players.length == 3) { player_box = [1, 3, 5]; }
    if (this.game.players.length == 4) { player_box = [1, 3, 4, 5]; }
    if (this.game.players.length == 5) { player_box = [1, 2, 3, 5, 6]; }
    if (this.game.players.length == 6) { player_box = [1, 2, 3, 4, 5, 6]; }

    return player_box;

  }

  returnViewBoxArray() {

    let player_box = [];

    if (this.game.players.length == 2) { player_box = [3, 5]; }
    if (this.game.players.length == 3) { player_box = [3, 4, 5]; }
    if (this.game.players.length == 4) { player_box = [2, 3, 5, 6]; }
    if (this.game.players.length == 5) { player_box = [2, 3, 4, 5, 6]; }

    return player_box;

  }



  playerAcknowledgeNotice(msg, mycallback) {

    let html = '<div class="status-message acknowledge-message">' + msg + "</div><ul>";
    html += '<li class="textchoice" id="confirmit">I understand...</li>';
    html += '</ul></p>';

    this.updateStatus(html);

    try {
      let hudheader = document.querySelector('.hud-header');
      if (hudheader) { document.querySelector('#confirmit').style.width = hudheader.style.width; }
    } catch (err) {}

    document.getElementById("confirmit").onclick = (e) => {
      mycallback();
    }

    return 0;

  }


  playerTurn() {
  }


  addPublickeyConfirm(pubkey, confs) {
    this.game.tmp_confirms_received += parseInt(confs);
    this.game.tmp_confirms_players.push(pubkey);
  }



  resetConfirmsNeeded(array_of_player_nums) {

    this.game.confirms_needed   = [];
    this.game.confirms_received = 0;
    this.game.confirms_players  = [];
    this.game.tmp_confirms_received = 0;
    this.game.tmp_confirms_players  = [];

    for (let i = 0; i < this.game.players.length; i++) {
      if (array_of_player_nums.includes((i+1))) { 
        this.game.confirms_needed[i] = 1;
      } else {
        this.game.confirms_needed[i] = 0;
      }
    }

  }


  returnPlayerName(num) {
    let x = this.game.players[num-1].substring(0, 11);
    return x;
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


  initializeQueueCommands() {

    //
    // add stuff to queue
    //
    this.commands.push((game_self, gmv) => {
      if (gmv[0] === "SETVAR") {
        if (gmv[1]) {
          if (gmv[3]) {
            if (gmv[4]) {
              game_self.game[gmv[1]][gmv[2]][gmv[3]] = gmv[4];
            } else {
              game_self.game[gmv[1]][gmv[2]] = gmv[3];
            }
          } else {
            if (gmv[2]) {
              game_self.game[gmv[1]] = gmv[2];
            }
          }
        }
        game_self.game.queue.splice(game_self.game.queue.length-1, 1);
      }
      return 1;
    });


    this.commands.push((game_self, gmv) => {
      if (gmv[0] === "NOTIFY" || gmv[0] === "notify") {
        game_self.updateLog(gmv[1]);
        game_self.game.queue.splice(game_self.game.queue.length-1, 1);
      }
      return 1;
    });


    this.commands.push((game_self, gmv) => {
      if (gmv[0] === "STATUS" || gmv[0] === "status") {
        game_self.updateStatus(gmv[1]);
        game_self.game.queue.splice(game_self.game.queue.length-1, 1);
      }
      return 1;
    });



    this.commands.push((game_self, gmv) => {
      if (gmv[0] === "ACKNOWLEDGE") {

        let notice = gmv[1];
        game_self.game.halted = 1;
        let my_specific_game_id = game_self.game.id;

        //
        // october 4th
        //
        game_self.saveGame(game_self.game.id);

        game_self.playerAcknowledgeNotice(notice, function() {

          if (game_self.game.id != my_specific_game_id) {
            game_self.game = game_self.loadGame(my_specific_game_id);
          }
          game_self.updateStatus(" acknowledged...");
          game_self.game.queue.splice(game_self.game.queue.length-1, 1);
          game_self.game.halted = 0;

          //
          // and save so we continue from AFTER this point...
          //
          game_self.saveGame(game_self.game.id);

          let cont = game_self.runQueue();
          if (cont == 0) { game_self.processFutureMoves(); }

          return 0;

        });

        return 0;
      }

      return 1;
    });


    this.commands.push((game_self, gmv) => {
      if (gmv[0] === "GAMEOVER") {
        if (game_self.browser_active == 1) {
          game_self.updateLog("Player has Quit the Game");
        }
        return 0;
      }
      return 1;
    });


    this.commands.push((game_self,gmv) => {
      if (gmv[0] === "OBSERVER") {
        let msgobj = {
          game_id : game_self.game.id ,
          player : game_self.app.wallet.returnPublicKey() ,
          module : game_self.game.module
        };
        let msg = game_self.app.crypto.stringToBase64(JSON.stringify(msgobj));
        try {
        //
        // OBSOLETE MSG -- keeping code so reference for improvements here though
        //
        //  game_self.displayModal("Observer Mode now Active");
        //  game_self.updateLog(`Player ${game_self.game.player} has enabled observer mode. This can leak data on your private hand to your opponent.`);
        } catch (err) {}
        game_self.observer_mode = 1;
        game_self.game.saveGameState = 1;
        game_self.game.queue.splice(game_self.game.queue.length-1, 1);
      }
      return 1;
    });



    this.commands.push((game_self,gmv) => {
      if (gmv[0] === "PLAY") {

        let players_to_go = [];
        if (gmv[1] === "all") {
          for (let i = 0; i < game_self.game.players.length; i++) {
            players_to_go.push((i+1));
          }
        } else {
          try {
            if (gmv[1].isArray()) {
              players_to_go = gmv[1];
            } else {
              players_to_go = [gmv[1]];
            }
          } catch (err) {
            players_to_go = gmv[1];
          }
        }

        //
        // reset confs if we do not have confirms_needed
        //
        let reset_confirmations = 1;
        for (let i = 0; i < game_self.game.confirms_needed.length; i++) {
          if (game_self.game.confirms_needed[i] == 1) {
            reset_confirmations = 0;
          }
        }
        if (reset_confirmations == 1) {
                game_self.resetConfirmsNeeded(players_to_go);
        }

        for (let i = 0; i < players_to_go.length; i++) {
          if (game_self.game.player == parseInt(players_to_go[i])) {
            if (game_self.game.confirms_needed[(players_to_go[i]-1)] == 1) {
              game_self.playerTurn();
            }
          }
        }

        return 0;

      }
      return 1;
    });


    //
    // [RESOLVE]
    // or
    // [RESOLVE \t publickey] (multi-player simulatensou)
    //
    this.commands.push((game_self,gmv) => {
      if (gmv[0] === "RESOLVE") {

        //
        // resolve coming from specific player
        //
        if (gmv[1]) {
          for (let i = 0; i < game_self.game.players.length; i++) {
            if (game_self.game.players[i] === gmv[1]) {
              game_self.game.confirms_needed[i] = 0;
            }
          }
          if (game_self.app.wallet.returnPublicKey() === gmv[1]) {
            game_self.unlockInterface();
          }
        } else {

          // no userkey provided, so this could be a DEAL or
          // some other command that is being executed WHILE
          // a lower-level command is waiting for all players
          // to move...
          if (game_self.game.queue.length-1 == 0) {
            game_self.game.queue = [];
            return 1;
          } else {
            let gle = game_self.game.queue.length-2;
            if (game_self.game.queue[gle] === "RESOLVE") {
              game_self.game.queue.splice(game_self.game.queue.length-1, 1);
              return 1;
            } else {
              if (gle <= 0) {
                game_self.game.queue = [];
                return 1;
              } else {
                game_self.game.queue.splice(gle, 2);
                return 1;
              }
            }
          }
        }

        //
        // resolve previous command if we are not waiting for anyone
        //
        let resolve_queue = 1;
        for (let i = 0; i < game_self.game.confirms_needed.length; i++) {
          if (game_self.game.confirms_needed[i] == 1) {
            resolve_queue = 0;
          }
        }

        let notice = "Players still to move: <ul>";
        let am_i_still_to_move = 0;
        let anyone_left_to_move = 0;
        for (let i = 0; i < game_self.game.confirms_needed.length; i++) {
          if (game_self.game.confirms_needed[i] == 1) { 
            notice += '<li class="option">'+game_self.returnPlayerName((i+1))+'</li>';
            anyone_left_to_move = 1;
          }
          if (game_self.game.player == (i+1)) {
            am_i_still_to_move = game_self.game.confirms_needed[i];
          }
        }
        notice += '</ul>';
        if (am_i_still_to_move == 0) {
          game_self.updateStatus(notice);
        }

        //
        // return 1 if we remove stuff
        //
        if (resolve_queue == 1) {
          if (game_self.game.queue.length-1 == 0) {
            game_self.game.queue = [];
            return 1;
          } else {
            let gle = game_self.game.queue.length-2;
            if (game_self.game.queue[gle] === "RESOLVE") {
              game_self.game.queue.splice(game_self.game.queue.length-1, 1);
              return 1;
            } else {
              if (gle <= 0) {
                game_self.game.queue = [];
                return 1;
              } else {
                game_self.game.queue.splice(gle, 2);
                return 1;
              }
            }
          }
        }

        //
        // queue not resolves
        //
        game_self.game.queue.splice(game_self.game.queue.length-1, 1);
        return 1;
      }

      return 1;
    });



    this.commands.push((game_self,gmv) => {
      if (gmv[0] == "READY") {
        game_self.game.initializing = 0;
        game_self.game.queue.splice(game_self.game.queue.length-1, 1);
        game_self.saveGame(game_self.game.id);
        if (game_self.app.modules.isModuleActive("Arcade")) {
          let arcade_self = game_self.app.modules.returnModule("Arcade");
          if (arcade_self.initialization_timer == null) {
            console.log("We seem to have loaded into a READY process while viewing the arcade, but our game is not waiting for the initialization screen, so we should check and show that launch screen.");
            arcade_self.launchGame(game_self.game.id);
          }
        }

      }
      return 1;
    });


    this.commands.push((game_self,gmv) => {
      if (gmv[0] === "SHUFFLE") {
        game_self.shuffleDeck(parseInt(gmv[1]));
        game_self.game.queue.splice(game_self.game.queue.length-1, 1);
      }
      return 1;
    });


    this.commands.push((game_self,gmv) => {
      if (gmv[0] === "RESOLVEDEAL") {

        let deckidx = gmv[1];
        let recipient = gmv[2];
        let cards = gmv[3];

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

        if (game_self.game.queue.length-1 == 0) {
          game_self.game.queue = [];
        } else {
          let gle = game_self.game.queue.length-2;
          if (gle <= 0) {
            game_self.game.queue = [];
          } else {
            game_self.game.queue.splice(gle, 2);
          }
        }

	//
	// observer mode
	//
	if (game_self.game.player == 0) {
          if (game_self.game.issued_keys_deleted == 0) {
	    game_self.game.issued_keys_deleted = 1;
	  }
	  return 1;
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
      return 1;
    });


    this.commands.push((game_self,gmv) => {
      if (gmv[0] === "RESOLVEFLIP") {

        let deckidx = gmv[1];
        let cardnum = gmv[2];
        let poolidx = gmv[3];

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
          game_self.game.pool[poolidx-1].cards = game_self.game.deck[deckidx-1].cards;

          //
          // copy the card info over from the deck
          //
          for (let z = 0; z < cardnum; z++) {
            game_self.game.pool[poolidx-1].crypt.push(game_self.game.deck[deckidx-1].crypt[z]);
            for (let p = 0; p < decryption_keys_needed; p++) {
              game_self.game.pool[poolidx-1].keys.push([]);
            }
          }
        }

        //
        // now we can get the keys
        //
        let gqe = game_self.game.queue.length-1;
        game_self.game.queue.splice(game_self.game.queue.length-1, 1);

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

        } else {

          //
          // wait for more decryption keys
          //

        }
      }
      return 1;
    });


    this.commands.push((game_self,gmv) => {
      if (gmv[0] === "DEAL") {

        let deckidx = parseInt(gmv[1]);
        let recipient = parseInt(gmv[2]);
        let cards = parseInt(gmv[3]);

        //
        // resolvedeal checks this when
        // deleting the keys from its
        // crypt.
        //
        game_self.game.issued_keys_deleted = 0;

        let total_players = game_self.game.opponents.length+1;

        // if the total players is 1 -- solo game
        if (total_players == 1) {
          game_self.game.queue.push("RESOLVEDEAL\t"+deckidx+"\t"+recipient+"\t"+cards);
        } else {
          game_self.game.queue.push("RESOLVEDEAL\t"+deckidx+"\t"+recipient+"\t"+cards);
          for (let i = 1; i < total_players+1; i++) {
            if (i != recipient) {
              game_self.game.queue.push("REQUESTKEYS\t"+deckidx+"\t"+i+"\t"+recipient+"\t"+cards);
            }
          }
        }
      }
      return 1;
    });



    //
    // SAFEDEAL shuffles discards back into the deck before dealing
    // if necessary and discards are available. if there are no more
    // cards to be dealt, it ends the game.
    //
    this.commands.push((game_self,gmv) => {
      if (gmv[0] === "SAFEDEAL") {

        game_self.game.queue.splice(game_self.game.queue.length-1, 1);

        let deckidx = parseInt(gmv[1]);
        let recipient = parseInt(gmv[2]);
        let cards = parseInt(gmv[3]);

        //
        // check we have enough cards in this deck
        //

        if (game_self.game.deck[deckidx-1].crypt.length >= cards) {
          this.game.queue.push("DEAL\t"+deckidx+"\t"+recipient+"\t"+cards);
        } else {
          this.game.queue.push("DEAL\t"+deckidx+"\t"+recipient+"\t"+cards);

          let discarded_cards = {};

          for (let i in this.game.deck[deckidx-1].discards) {
            discarded_cards[i] = this.game.deck[deckidx-1].cards[i];
            delete this.game.deck[deckidx-1].cards[i];
          }
          this.game.deck[deckidx-1].discards = {};

          if (Object.keys(discarded_cards).length <= 0) {
            this.updateLog("skipping deal - no cards available and no discards for reshuffling");
          } else {

            //
            // shuffle in discarded cards
            //
            this.game.queue.push("SHUFFLE\t"+deckidx);
            this.game.queue.push("DECKRESTORE\t"+deckidx);
            for (let z = this.game.players.length; z >= 1; z--) {
              this.game.queue.push("DECKENCRYPT\t"+deckidx+"\t"+z);
            }
            for (let z = this.game.players.length; z >= 1; z--) {
              this.game.queue.push("DECKXOR\t"+deckidx+"\t"+z);
            }
            // DECKFLUSH not needed as we are all executing this
            this.game.queue.push("DECK\t"+deckidx+"\t"+JSON.stringify(discarded_cards));
            this.game.queue.push("DECKBACKUP\t"+deckidx);
            this.updateLog("notify\tshuffling discards back into deck...");

          }
        }
      }
      return 1;
    });


    this.commands.push((game_self,gmv) => {
      if (gmv[0] === "REQUESTKEYS") {

        let deckidx = parseInt(gmv[1]);
        let sender = parseInt(gmv[2]);
        let recipient = parseInt(gmv[3]);
        let cards = parseInt(gmv[4]);

	//
	// do not permit dealing more keys than exist in this deck
	//
        if (game_self.game.deck[deckidx-1].keys.length < cards) { cards = game_self.game.deck[deckidx-1].keys.length; }

        //
        // sender then sends keys
        //
        if (game_self.game.player == sender) {
          game_self.game.turn = [];
          game_self.addMove("RESOLVE");
          for (let i = 0; i < cards; i++) { game_self.addMove(game_self.game.deck[deckidx-1].keys[i]); }
          game_self.addMove("ISSUEKEYS\t"+deckidx+"\t"+sender+"\t"+recipient+"\t"+cards+"\t"+game_self.game.deck[deckidx-1].keys.length);
          game_self.endTurn();
        } else {
        }

        //
        // execution stops
        //
        return 0;

      }
      return 1;
    });



    this.commands.push((game_self,gmv) => {
      if (gmv[0] === "ISSUEKEYS") {

        let deckidx = parseInt(gmv[1]);
        let sender = parseInt(gmv[2]);
        let recipient = parseInt(gmv[3]);
        let cards = parseInt(gmv[4]);
        let opponent_deck_length = parseInt(gmv[5]); // this is telling us how many keys the other player has, so we can coordinate and now double-decrypt
        let keyidx = game_self.game.queue.length-1-cards;

        game_self.game.queue.splice(game_self.game.queue.length-1, 1);

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
      return 1;
    });




        //
        // module requires updating
        //
    this.commands.push((game_self,gmv) => {
      if (gmv[0] === "DECKBACKUP") {
        let deckidx = parseInt(gmv[1]);

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

        game_self.game.queue.splice(game_self.game.queue.length-1, 1);

      }
      return 1;
    });


    this.commands.push((game_self,gmv) => {
      if (gmv[0] === "DECKRESTORE") {

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
        game_self.game.queue.splice(game_self.game.queue.length-1, 1);

      }
    });



    this.commands.push((game_self,gmv) => {
      if (gmv[0] === "CARDS") {
        let deckidx = parseInt(gmv[1]);
        let gqe = game_self.game.queue.length-1;
console.log(game_self.game.queue);
        game_self.game.queue.splice(game_self.game.queue.length-1, 1);

	// HACK -- FEB DEBUGGING
        if (game_self.game.deck[deckidx-1] == undefined) {
console.log("INIT ERROR: needing to create this deck");
console.log("deckidx: " + deckidx);
console.log("DECK: " + JSON.stringify(game_self.game.deck));
	}

        for (let i = 0; i < parseInt(gmv[2]); i++) {
          if (game_self.game.player != 0) {
            game_self.game.deck[deckidx-1].crypt[(parseInt(gmv[2])-1-i)] = game_self.game.queue[gqe-1-i];
          }
          game_self.game.queue.splice(gqe-1-i, 1);
        }
      }
      return 1;
    });



    this.commands.push((game_self,gmv) => {
      if (gmv[0] === "POOL") {
        let poolidx = gmv[1];
        game_self.resetPool(poolidx-1);
        while (game_self.game.pool.length < poolidx) { game_self.addPool(); }
        game_self.game.queue.splice(game_self.game.queue.length-1, 1);
      }
      return 1;
    });



    this.commands.push((game_self,gmv) => {
      if (gmv[0] === "FLIPRESET") {
        let poolidx  = gmv[1];
        while (game_self.game.pool.length < poolidx) { 
        game_self.addPool();
      }
        game_self.game.pool[poolidx-1].crypt = [];
        game_self.game.pool[poolidx-1].keys  = [];
        game_self.game.pool[poolidx-1].decrypted = 0;
        game_self.game.queue.splice(game_self.game.queue.length-1, 1);
      }
      return 1;
    });


    this.commands.push((game_self,gmv) => {
      if (gmv[0] === "FLIPCARD") {

        let deckidx  = gmv[1];
        let cardnum  = gmv[2];
        let poolidx  = gmv[3];
        let playerid = parseInt(gmv[4]);

        //
        // players process 1 by 1
        //
        if (playerid != game_self.game.player) { return 0; }

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

        game_self.sendMessage("game", {}); 

        //
        // stop execution until messages received
        //
        return 0;

      }
      return 1;
    });



    //
    // OBSERVER_CHECKPOINT - observers stop execution
    //
    this.commands.push((game_self,gmv) => {
      if (gmv[0] === "OBSERVER_CHECKPOINT") {

	if (game_self.game.player == 0) { 
	  game_self.game.halted = 1;
	  game_self.saveGame(game_self.game.id);
	  return 0; 
	}
	return 1;

      }
      return 1;
    });





    this.commands.push((game_self,gmv) => {
      if (gmv[0] === "DECK") {

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
        game_self.game.queue.splice(game_self.game.queue.length-1, 1);
      }
      return 1;
    });

    this.commands.push((game_self,gmv) => {
      if (gmv[0] === "DECKANDENCRYPT") {

        let deckidx = parseInt(gmv[1]);
        let players = parseInt(gmv[2]);
        let cards = JSON.parse(gmv[3]);

        //
        // create deck if not exists
        //
        game_self.resetDeck(deckidx-1);

        while (game_self.game.deck.length < deckidx) { game_self.addDeck(); }
        game_self.game.deck[deckidx-1].cards = cards;
        let a = 0;
        for (var i in game_self.game.deck[deckidx-1].cards) {
          game_self.game.deck[deckidx-1].crypt[a] = game_self.app.crypto.stringToHex(i);
          a++;
        }
        game_self.game.queue.splice(game_self.game.queue.length-1, 1);

        for (let i = players; i > 0; i--) {
          this.game.queue.push("DECKENCRYPT\t"+deckidx+"\t"+i);
        }
        for (let i = players; i > 0; i--) {
          this.game.queue.push("DECKXOR\t"+deckidx+"\t"+i);
        }

      }
      return 1;
    });


    this.commands.push((game_self,gmv) => {
      if (gmv[0] === "DECKXOR") {

        let deckidx = gmv[1];
        let playerid = gmv[2];

        if (playerid != game_self.game.player) { return 0; }

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
        return 0;

      }
      return 1;
    });



    //
    // required by safedeal
    //
    this.commands.push((game_self,gmv) => {
      if (gmv[0] === "DECKFLUSH") {
        let deckidx = parseInt(gmv[1]);
        if (gmv[2] == "discards") { this.game.deck[deckidx].discards = {}; }
        this.game.queue.splice(qe, 1);
      }
      return 1;
    });


    this.commands.push((game_self,gmv) => {
      if (gmv[0] === "DECKENCRYPT") {

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

        return 0;
      }
      return 1;
    });



    this.commands.push((game_self,gmv) => {
      if (gmv[0] === null || gmv[0] == "null") {
        console.log("REMOVING NULL ENTRY");
        game_self.game.queue.splice(game_self.game.queue.length-1, 1);
      }
    });



    //
    // supporting arbitrary third-party crypto modules
    //
    this.commands.push((game_self,gmv) => {
      if (gmv[0] === "SEND") {

        let sender = gmv[1];
        let receiver = gmv[2];
        let amount = gmv[3];
        let ts = gmv[4];
        let ticker = game_self.game.crypto;
        if (gmv[5]) { ticker = gmv[5]; }


	//
	// if we are not the sender, we do not need to worry and can continue
	//
        if (!this.app.wallet.isOurPreferredCryptoAddress(sender, ticker)) { 
	  game_self.game.queue.splice(game_self.game.queue.length-1, 1);
	  return 1; 
	}

	//
	// if we are the sender, lets get sending and receiving addresses
	//
	let sender_crypto_address = "";
	let receiver_crypto_address = "";
        for (let i = 0; i < game_self.game.players.length; i++) {
	  if (game_self.game.players[i] === sender) { sender_crypto_address = game_self.game.keys[i]; }
	  if (game_self.game.players[i] === receiver) { receiver_crypto_address = game_self.game.keys[i]; }
	}


        //
        // october 4th
        //
        let my_specific_game_id = game_self.game.id;
        game_self.saveGame(game_self.game.id);
        game_self.game.halted = 1;

        game_self.crypto_transfer_manager.send(this.app, this, [sender_crypto_address], [receiver_crypto_address], [amount], ts, ticker, function() {

          game_self.app.wallet.sendPayment([sender_crypto_address], [receiver_crypto_address], [amount], ts, function(robj) {

            if (game_self.game.id != my_specific_game_id) { game_self.game = game_self.loadGame(my_specific_game_id); }

            game_self.updateLog("payments issued...");
            game_self.game.queue.splice(game_self.game.queue.length-1, 1);
            game_self.game.halted = 0;

            //
            // and save so we continue from AFTER this point if the game 
	    // is reloaded...
	    //
            game_self.saveGame(game_self.game.id);

            let cont = game_self.runQueue();
            if (cont == 0) { game_self.processFutureMoves(); }

            return 0;

          }, ticker);

          return 0;

        });
	return 0;
      }
      return 1;
    });



    //
    // supporting arbitrary third-party crypto modules -- specify receiving address
    //
    this.commands.push((game_self,gmv) => {
      if (gmv[0] === "CRYPTOKEY") {

        let playerkey = gmv[1];
        let cryptokey = gmv[2];
        let confsig   = gmv[3];


	//
	// if the playerkey has signed this cryptokey, update
	//
        if (game_self.app.crypto.verifyMessage(cryptokey, confsig, playerkey)) {
	  for (let i = 0; i < game_self.game.keys.length; i++) {
	    if (game_self.game.players[i] === playerkey) {
	      game_self.game.keys[i] = cryptokey;
	    }
	  }
	}

        game_self.game.queue.splice(game_self.game.queue.length-1, 1);
        return 1;

      }
      return 1;
    });


    this.commands.push((game_self,gmv) => {
      if (gmv[0] === "RECEIVE") {

        let sender = gmv[1];
        let receiver = gmv[2];
        let amount = gmv[3];
        let ts = gmv[4];
        let ticker = game_self.game.crypto;
        if (gmv[5]) { ticker = gmv[5]; }

	//
	// if we are the sender, lets get sending and receiving addresses
	//
	let sender_crypto_address = "";
	let receiver_crypto_address = "";
        for (let i = 0; i < game_self.game.players.length; i++) {
	  if (game_self.game.players[i] === sender) { sender_crypto_address = game_self.game.keys[i]; }
	  if (game_self.game.players[i] === receiver) { receiver_crypto_address = game_self.game.keys[i]; }
	}

        // 
        // october 4th
        // 
        let my_specific_game_id = game_self.game.id;
        game_self.saveGame(game_self.game.id);
        game_self.game.halted = 1;

        game_self.crypto_transfer_manager.receive(this.app, this, [sender], [receiver], [amount], ts, ticker, function() {

          game_self.app.wallet.receivePayment([sender_crypto_address], [receiver_crypto_address], [amount], ts, function(robj) {

            game_self.crypto_transfer_manager.hideOverlay();

            if (game_self.game.id != my_specific_game_id) { game_self.game = game_self.loadGame(my_specific_game_id); }

            game_self.updateLog("payments issued...");
            game_self.game.queue.splice(game_self.game.queue.length-1, 1);
            game_self.game.halted = 0;

            //
            // and save so we continue from AFTER this point if the game 
	    // is reloaded...
	    //
            game_self.saveGame(game_self.game.id);

            let cont = game_self.runQueue();
            if (cont == 0) { game_self.processFutureMoves(); }

            return 0;

          }, ticker, -1);

          return 0;
        });
	return 0;
      }
    });


    this.commands.push((game_self,gmv) => {
      if (gmv[0] === "BALANCE") {

        let address = gmv[1];
        let ticker = gmv[2];

        //
        // october 4th
        //
        game_self.saveGame(game_self.game.id);
        game_self.game.halted = 1;
        let my_specific_game_id = game_self.game.id;

        game_self.app.wallet.returnBalance(sender, function(robj) {
          
          if (game_self.game.id != my_specific_game_id) {
            game_self.game = game_self.loadGame(my_specific_game_id);
          }
          game_self.updateStatus(" balance adequate ... ");
          game_self.game.queue.splice(game_self.game.queue.length-1, 1);
          game_self.game.halted = 0;
          game_self.saveGame(game_self.game.id);

          let cont = game_self.runQueue();
          if (cont == 0) { game_self.processFutureMoves(); }
          return 0;

        }, ticker);

        return 0;
      }
      return 1;
    });

  }



  doesGameExistLocally(game_id) {
    if (this.app.options) {
      if (this.app.options.games) {
        for (let i = 0; i < this.app.options.games.length; i++) {
          if (this.app.options.games[i].id === game_id) { return 1; }
        }
      }
    }
    return 0;
  }


  //
  // arcade uses
  //
  returnShortGameOptionsArray(options) {

    let sgo = [];

    for (let i in options) {
      if (options[i] != "") {
        let output_me = 1;
        if (i == "clock" && options[i] == 0) { output_me = 0; }
        if (i == "observer" && options[i] != "enable") { output_me = 0; }
        if (i == "game-wizard-players-select") { output_me = 0; }
        if (i == "gamename") { output_me = 0; }
        if (output_me == 1) {
          sgo[i] = options[i];
        }
      }
    }

    return sgo;
  }


}

module.exports = GameTemplate;

