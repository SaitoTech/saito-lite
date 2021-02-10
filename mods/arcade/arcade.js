const saito = require('./../../lib/saito/saito');
const SaitoOverlay = require('../../lib/saito/ui/saito-overlay/saito-overlay');
const ModTemplate = require('../../lib/templates/modtemplate');
const ArcadeMain = require('./lib/arcade-main/arcade-main');
const ArcadeSidebar = require('./lib/arcade-sidebar/arcade-sidebar');
const AddressController = require('../../lib/ui/menu/address-controller');
const SaitoHeader = require('../../lib/saito/ui/saito-header/saito-header');
const getMockGames = require('./mockinvites.js');
const ArcadeContainerTemplate = require('./lib/arcade-main/templates/arcade-container.template');
const ModalRegisterEmail = require('../../lib/saito/ui/modal-register-email/modal-register-email');
// const ArcadeCreateGameOverlay = require('./lib/arcade-create-game-overlay/arcade-create-game-overlay');

fetch = require("node-fetch");

class Arcade extends ModTemplate {

  constructor(app) {

    super(app);

    this.name = "Arcade";
    this.description = "Interface for creating and joining games coded for the Saito Open Source Game Engine.";
    this.categories = "Games Entertainment";

    this.events = ['chat-render-request'];
    this.mods = [];
    this.affix_callbacks_to = [];
    this.games = [];
    this.observer = [];
    this.old_game_removal_delay = 2000000;
    this.is_initializing = false;
    this.initialization_timer = null;
    this.viewing_arcade_initialization_page = 0;

    this.icon_fa = "fas fa-gamepad";

    this.accepted = [];

    this.description = "A place to find, play and manage games!";
    this.categories = "Games Utilities";
    this.addrController = new AddressController(app);

    this.header = null;
    this.overlay = null;
    
    //TODO: DELETE THESE LINES
    // no mock games
    //this.games = getMockGames(app);

  }
  
  receiveEvent(type, data) {
    if (type == 'chat-render-request') {
      if (this.browser_active) {
        ArcadeSidebar.render(this.app, this);
        ArcadeSidebar.attachEvents(this.app, this);
      }
    }
  }


  handleUrlParams(urlParams) {
    let i = urlParams.get('i');
    if (i == "watch") {
      let msg = urlParams.get('msg');
      this.observeGame(msg, 0);
    }
  }


  renderArcadeMain(app, mod) {
    if (this.browser_active == 1) {
      if (this.viewing_arcade_initialization_page == 0) {
        ArcadeMain.render(this.app, this);
        ArcadeMain.attachEvents(this.app, this);
      }
    }
  }

  returnServices() {
    let services = [];
    services.push({ service : "arcade" , domain : "saito" });
    return services;
  }

  respondTo(type = "") {
    if (type == "header-dropdown") {
      return {
        name: this.appname ? this.appname : this.name,
        icon_fa: this.icon_fa,
        browser_active: this.browser_active,
        slug: this.returnSlug()
      };
    }
    return null;
  }

  initialize(app) {

    super.initialize(app);

    //
    // add my own games (as fake txs)
    //
    if (this.app.options.games != null) {
      this.addGamesToOpenList(this.app.options.games.map((game) => { return this.createGameTXFromOptionsGame(game);}));
    }

    //
    // listen for txs from arcade-supporting games
    //
    this.app.modules.respondTo("arcade-games").forEach(mod => {
      this.affix_callbacks_to.push(mod.name);
    });

  }

  initializeHTML(app) {
    this.header = new SaitoHeader(app, this);
    app.modules.getRespondTos("private_sale_overlay").forEach((moduleResponse, i) => {
      moduleResponse.initializePrivateSaleOverlay();
      //moduleResponse.triggerPrivateSaleOverlay();
    });
  }



  //
  // load transactions into interface when the network is up
  //
  onPeerHandshakeComplete(app, peer) {
    if (this.browser_active == 0) { return; }

    let arcade_self = this;
    let cutoff = new Date().getTime() - this.old_game_removal_delay;

    //
    // load open games from server
    //
    this.sendPeerDatabaseRequestWithFilter(

        "Arcade",

        `SELECT * FROM games WHERE status = "open" AND created_at > ${cutoff}`,

        (res) => {
          if (res.rows) {
            this.addGamesToOpenList(res.rows.map((row) => {return new saito.transaction(JSON.parse(row.tx))}))
          }
        }
    );


    //
    // load observer games (active) -- ASC 
    //
    let current_timestamp = new Date().getTime() - 1200000;
    this.sendPeerDatabaseRequestWithFilter(

      "Arcade" ,

       `SELECT DISTINCT id, count(id) as count, last_move, game_id, module, player, players_array FROM gamestate WHERE 1 = 1 AND last_move > 10 GROUP BY game_id ORDER BY count DESC, last_move DESC LIMIT 8`,



      (res) => {

        if (res.rows) {
          res.rows.forEach(row => {
            let { game_id, module, players_array, player } = row;
            this.addGameToObserverList({
              game_id,
              module,
              players_array,
              player,
            });
          });
        }
      }
    );


  }





  async render(app) {
    if (!document.getElementById("arcade-container")) { 
      app.browser.addElementToDom(ArcadeContainerTemplate()); 
    }

    if (this.header == null) {
      this.header = new SaitoHeader(app, this);
    }
    if (this.overlay == null) {
      this.overlay = new SaitoOverlay(app, this);
    }

    this.header.render(app, this);
    this.header.attachEvents(app, this);

    this.overlay.render(app, this);
    this.overlay.attachEvents(app, this);

    ArcadeSidebar.render(app, this);
    ArcadeSidebar.attachEvents(app, this);
    
    this.renderArcadeMain(this.app, this);

  }
  isMyGame(invite, app) {
    for(let i = 0; i < invite.msg.players.length; i++) {
      if (invite.msg.players[i] == app.wallet.returnPublicKey()) {
        return true;
      }
    }
    return false;
  }


  //
  // purge any bad games from options file
  //
  purgeBadGames(app) {
    if (app.options) {
      if (app.options.games) {
        for (let i = app.options.games.length-1; i >= 0; i--) {
          if (app.options.games[i].module === "" && app.options.games[i].id.length < 25) {
            app.options.games.splice(i, 1);
          }
        }
      }
    }
  }
  notifyPeers(app, tx) {
    for (let i = 0; i < app.network.peers.length; i++) {
      if (app.network.peers[i].peer.synctype == "lite") {
        //
        // fwd tx to peer
        //
        let message = {};
          message.request = "arcade spv update";
          message.data = {};
          message.data.tx = tx;
        app.network.peers[i].sendRequest(message.request, message.data);
      }
    }
  }


  joinGame(app, tx) {

    let txmsg = tx.returnMessage();
    let game_id = txmsg.game_id;
    let blk = null;
    let conf = 0;

    for (let i = 0; i < this.games; i++) {
      if (this.games[i].transaction) {
        if (this.games[i].transaction.msg) {
          if (txmsg.game_id == this.games[i].transaction.msg.game_id) {

            let existing_players_found = 0;

            for (let z = 0; z < this.games[i].transaction.msg.players.length; z++) {
              for (let zz = 0; zz < tx.transaction.to.length; zz++) {
                if (this.games[i].transaction.msg.players[z] == tx.transaction.to[zz].add) {
                  existing_players_found++;
                  z = this.games[i].transaction.msg.players.length+1;
                }
              }
            }
            if (existing_players_found < this.games[i].transaction.msg.players.length) {

            }
          }
        }
      }
    }

    this.joinGameOnOpenList(tx);
    this.receiveJoinRequest(blk, tx, conf, app);

    //
    // it is possible that we have multiple joins that bring us up to
    // the required number of players, but that did not arrive in the
    // one-by-one sequence needed for the last player to trigger an
    // "accept" request instead of another "join".
    //
    // in this case the last player sends an accept request which triggers
    // the start of the game automatically.
    if (tx.transaction) {
      if (!tx.transaction.sig) { return; }
      if (tx.msg.over == 1) { return; }

      for (let i = 0; i < this.games.length; i++) {
        if (this.games[i].transaction.sig == txmsg.game_id) {

          let number_of_willing_players = this.games[i].msg.players.length;
          let number_of_players_needed  = this.games[i].msg.players_needed;

          // console.log("NUMBER OF WILLING PLAYERS IN THIS GAME: " + number_of_willing_players);
          // console.log("NUMBER OF PLAYERS NEEDED IN THIS GAME: " + number_of_players_needed);

          if (number_of_willing_players >= number_of_players_needed) {

            //
            // first player is the only one with a guaranteed consistent order in all 
            // browsers -- cannot use last player to join as players may disagree on 
            // their order. so the first player is responsible for processing the "accept"
            //
            if (this.games[i].msg.players[0] == this.app.wallet.returnPublicKey()) {

              // i should send an accept request to kick this all off
              this.games[i].msg.players.splice(0, 1);
              this.games[i].msg.players_sigs.splice(0, 1);

              let newtx = this.createAcceptTransaction(this.games[i]);
              this.app.network.propagateTransaction(newtx);

            }
          }
        }
      }
    }
  }


  //
  // MESSY -- not deleting immediately
  //
  async onConfirmation(blk, tx, conf, app) {
    let txmsg = tx.returnMessage();
    
    if (conf == 0) {

      this.purgeBadGames(app)

      //
      // notify SPV clients of "open", "join" and "close"(, and "accept") messages
      //
      if (app.BROWSER == 0 && txmsg.request == "open" || txmsg.request == "join" || txmsg.request == "accept" || txmsg.request == "close") {
        this.notifyPeers(app, tx);
      }

      //
      // open msgs -- public invitations
      //
      if (txmsg.module === "Arcade" && txmsg.request == "open") {
        this.addGameToOpenList(tx);
        this.receiveOpenRequest(blk, tx, conf, app);
      }

      //
      // open msgs -- private invitations
      //
      if (txmsg.module === "ArcadeInvite" && txmsg.request == "open" && tx.isTo(app.wallet.returnPublicKey())) {
        this.addGameToOpenList(tx);
      }

      //
      // join msgs -- add myself to game list
      //
      if (txmsg.request == "join") {
        this.joinGame(app, tx);
      }

      //
      // cancel open games
      //
      if (txmsg.module == "Arcade" && txmsg.request == "close") {
        this.receiveCloseRequest(blk, tx, conf, app);
        this.receiveGameoverRequest(blk, tx, conf, app);
      }

      //
      // save state -- also prolifigate
      //
      if (txmsg.game_state != undefined && txmsg.game_id != "") {
        this.saveGameState(blk, tx, conf, app);
      }


      if (txmsg.request === "sorry") {
        if (tx.isTo(app.wallet.returnPublicKey())) {
          //TODO: Can we just use "this.receiveSorryAcceptedTransaction"?
          app.modules.returnModule("Arcade").receiveSorryAcceptedTransaction(blk, tx, conf, app);
        }
      }

      //
      // acceptances
      //
      if (txmsg.request === "accept") {

        //
        // remove game from server
        //
        // let players_array = txmsg.players.join("_");;
        let sql = `UPDATE games SET status = "active" WHERE game_id = $game_id`;
        let params = {
          $game_id : tx.msg.game_id ,
        }
        await this.app.storage.executeDatabase(sql, params, 'arcade');


        //
        // do not process if transaction is not for us
        //
        if (!tx.isTo(app.wallet.returnPublicKey())) { 

          return;
        }



        //
        // make sure game in options file
        //
        if (this.app.options) {

          if (!this.app.options.games) {
            this.app.options.games = [];
          }

          if (this.app.options.games) {
            let game_found = false;
            for (let i = 0; i < this.app.options.games.length; i++) {
              if (this.app.options.games[i].id == txmsg.game_id) {
                game_found = true;
              }
            }

            if (game_found == false) {

              //
              // copied above reject all tx not to us NEW
              //
              if (!tx.isTo(app.wallet.returnPublicKey())) {
                if (this.games.length > 0) {
                  for (let i = 0; i < this.games.length; i++) {

                    let transaction = Object.assign({ sig: "" }, this.games[i].transaction);
                    if (transaction.sig == txmsg.game_id) {
                      //
                      // remove game (accepted players are equal to number needed)
                      //
                      transaction.msg = Object.assign({ players_needed: 0, players: [] }, this.games[i].msg);
                      if (parseInt(transaction.msg.players_needed) >= (transaction.msg.players.length + 1)) {
                        this.removeGameFromOpenList(txmsg.game_id); //on confirmation
                      }
                    }
                  }
                }
              }

              //
              // only load games that are for us
              //
	      // this eliminates observer mode....
	      //
              if (tx.isTo(app.wallet.returnPublicKey())) {
                let gamemod = this.app.modules.returnModule(tx.msg.game);
                if (gamemod) {
                  gamemod.loadGame(tx.msg.game_id);
                }
              }
            }
          }
        }

        //
        // multiplayer games might hit here without options.games
        // in which case we need to import game details including
        // options, etc.
        //
        if (this.app.BROWSER == 1) {

          if (this.app.options != undefined) {
            if (this.app.options.games != undefined) {
              for (let i = 0; i < this.app.options.games.length; i++) {
                if (this.app.options.games[i].id == txmsg.game_id) {
                  if (this.app.options.games[i].initializing == 0) {

                    //
                    // is this old? exit
                    //
                    let currentTime = new Date().getTime();
                    if ((currentTime - this.app.options.games[i].ts) > 5000) {
                      console.log(`${currentTime} ------- ${this.app.options.games[i].ts}`);
                      return;
                    }
                  }
                }
              }
            }
          }

          //
          // also possible this is game in our displayed list
          //
          if (!tx.isTo(app.wallet.returnPublicKey())) {
            if (this.games.length > 0) {
              for (let i = 0; i < this.games.length; i++) {
                let transaction = Object.assign({ sig: "" }, this.games[i].transaction);
                if (transaction.sig == txmsg.game_id) {
                  transaction.msg = Object.assign({ players_needed: 0, players: [] }, this.games[i].msg);
                  if (parseInt(transaction.msg.players_needed) == (transaction.msg.players.length + 1)) {
                    this.removeGameFromOpenList(txmsg.game_id); // handle peer
                  }
                }
              }
            }
          }


          //
          // remove games from open games list
          //
          for (let i = 0; i < this.games.length; i++) {
            let transaction = Object.assign({ sig: "" }, this.games[i].transaction);
            if (transaction.sig === tx.msg.game_id) {
              if (transaction.options) {
                if (transaction.options.players_needed <= (transaction.players.length + 1)) {
                  console.info("ACCEPT MESSAGE SENT ON GAME WAITING FOR ONE PLAYER! -- deleting");
                  this.games.splice(i, 1);
                  console.info("RE-RENDER");
                  this.renderArcadeMain(this.app, this);
                }
              }
            }
          }
        }
        await this.receiveAcceptRequest(blk, tx, conf, app);


        //
        // alert us someone has accepted our game if elsewhere
        //
        if (this.browser_active == 0) {
          if (txmsg.module === "Arcade" && tx.isTo(app.wallet.returnPublicKey())) {
            this.showAlert();
          }
        }

        //
        // only launch game if it is for us -- observer mode?
        //
        if (tx.isTo(app.wallet.returnPublicKey())) {
          console.info("THIS GAMEIS FOR ME: " + tx.isTo(app.wallet.returnPublicKey()));
          console.info("OUR GAMES: ", this.app.options.games);
          // game is over, we don't care
          if (tx.msg.over) {
            if (tx.msg.over == 1) { return; }
          }
          this.launchGame(txmsg.game_id);
        }
      }

    }
  }


  
  async handlePeerRequest(app, message, peer, mycallback = null) {
    //
    // this code doubles onConfirmation
    //
    if (message.request === 'arcade spv update') {

      let tx = new saito.transaction(message.data.tx.transaction);
      let txmsg = tx.returnMessage();
      let conf = 0;
      let blk = null;

      //
      // open msgs -- public invitations
      //
      if (txmsg.module === "Arcade" && txmsg.request == "open") {
        siteMessage(txmsg.game + ' invite created.', 3000);
        this.addGameToOpenList(tx);
        this.receiveOpenRequest(blk, tx, conf, app);
      }

      //
      // open msgs -- private invitations
      //
      if (txmsg.module === "ArcadeInvite" && txmsg.request == "open" && tx.isTo(app.wallet.returnPublicKey())) {
        siteMessage('Private ' + txmsg.game + ' invite created.', 3000);
        this.addGameToOpenList(tx);
      }

      //
      // join msgs -- add myself to game list
      //
      if (txmsg.request == "join") {
        this.joinGameOnOpenList(tx);
        this.receiveJoinRequest(blk, tx, conf, app);
      }

      //
      // accept msgs -- remove games from list
      //
      if (txmsg.request == "accept") {
          this.removeGameFromOpenList(txmsg.game_id);
          if(txmsg.players.includes(app.wallet.returnPublicKey())) {
            siteMessage(txmsg.module + ' invite accepted.', 20000);
            app.browser.sendNotification('Game Accepted', txmsg.module + ' invite accepted.', 'game-acceptance-notification');
          }
      }



      //
      // cancel open games
      //
      if (txmsg.module == "Arcade" && txmsg.request == "close") {
        // try to give game over message
        // this.receiveGameoverRequest();

        if (tx.isFrom(this.app.wallet.returnPublicKey())) {
          this.removeGameFromOpenList(tx.returnMessage().sig);
        } else {
          if (this.app.options) {
            if (this.app.options.games) {
              for (let i = 0; i < this.app.options.games.length; i++) {

                if (this.app.options.games[i].id === tx.returnMessage().sig) {

                  console.log("%%%%%%%%%%%%%%%%");
                  console.log("%%%%%%%%%%%%%%%%");
                  console.log("%%%% DELETED %%%");
                  console.log("%%%%%%%%%%%%%%%%");
                  console.log("%%%%%%%%%%%%%%%%");

                  this.app.options.games[i].status = "Opponent Resigned";
                  this.app.options.games[i].over = 1;
                  this.app.storage.saveOptions();

                  let gamemod = this.app.modules.returnModule(this.app.options.games[i].module);
                  if (gamemod) {
                    gamemod.loadGame(tx.returnMessage().sig);
                    gamemod.updateStatus("Opponent Resigned");
                    gamemod.updateLog("Opponent Resigned");
                  }
                }
              }
            }
          }
        }

        this.removeGameFromOpenList(txmsg.sig);
        // if (this.viewing_arcade_initialization_page == 0 && this.browser_active == 1) {
        //   this.renderArcadeMain(this.app, this);
        // }
      }
      this.receiveCloseRequest(blk, tx, conf, app);
    } // end peer relayed txs



    if (message.request == 'rawSQL' && app.BROWSER == 0 && message.data.module == "Arcade") {

      //
      // intercept a very particular query
      //
      if (message.data.sql.indexOf("is_game_already_accepted") > -1) {

        let game_id = message.data.game_id;

        let res = {};
        res.rows = [];

        if (this.accepted[game_id] > 0) {

          if (this.accepted[game_id] > 2) {

            //
            // check required of players_needed vs. players_accepted
            //
            let sql3 = `SELECT status FROM games WHERE game_id = $game_id`;
            let params3 = { $game_id : game_id }
            let rows3 = await this.app.storage.queryDatabase(sql3, params3, 'arcade');
            if (rows3) {
              if (rows3.length > 0) {
                if (rows3[0].status === "open") {
                  this.accepted[game_id] = 0;
                  res.rows.push({ game_still_open: 1 });
                  mycallback(res);
                  return;
                }
              }
            }
          }
          
          this.accepted[game_id]++;
          res.rows.push({ game_still_open: 0 });
        } else {
          this.accepted[game_id] = 1;
          res.rows.push({ game_still_open: 1 });
        }

        mycallback(res);
        return;

      }

    }

    super.handlePeerRequest(app, message, peer, mycallback);
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




  async receiveGameoverRequest(blk, tx, conf, app) {
    let txmsg = tx.returnMessage();
    let sql = "UPDATE games SET status = $status, winner = $winner WHERE game_id = $game_id";
    let params = {
      $status: 'over',
      $game_id: txmsg.game_id,
      $winner: txmsg.winner
    }
    await this.app.storage.executeDatabase(sql, params, "arcade");
  }



  async receiveOpenRequest(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();

    //
    // add to games table
    //
    let game_id = tx.transaction.sig;
    let players_needed = 2;
    if (parseInt(txmsg.players_needed) > 2) { players_needed = parseInt(txmsg.players_needed); }
    let module = txmsg.game;
    let options = {};
    if (txmsg.options != undefined) { options = txmsg.options; }
    let game_status = "open";
    let player = tx.transaction.from[0].add;
    let players_array = player;
    let start_bid = 1;
    if (blk != null) { start_bid = blk.block.id; }
    let valid_for_minutes = 60;
    let created_at = parseInt(tx.transaction.ts);
    let expires_at = created_at + (60000 * parseInt(valid_for_minutes));
    let acceptance_sig = "";
    if (txmsg.players_sigs.length > 0) { acceptance_sig = txmsg.players_sigs[0]; }

    let sql = `INSERT INTO games (
                game_id ,
                players_needed ,
                players_array ,
                module ,
                status ,
                options ,
                tx ,
                start_bid ,
                created_at ,
                expires_at
              ) VALUES (
                $game_id ,
                $players_needed ,
                $players_array ,
                $module ,
                $status ,
                $options ,
                $tx,
                $start_bid ,
                $created_at ,
                $expires_at
              )`;
    let params = {
      $game_id: game_id,
      $players_needed: parseInt(players_needed),
      $players_array: players_array,
      $module: module,
      $status: game_status,
      $options: options,
      $tx: JSON.stringify(tx.transaction),
      $start_bid: start_bid,
      $created_at: created_at,
      $expires_at: expires_at
    };
    await app.storage.executeDatabase(sql, params, "arcade");



    //
    // insert into invites
    //
    let sql2 = `INSERT INTO invites (
                game_id ,
                player ,
                acceptance_sig ,
                module ,
                created_at ,
                expires_at
              ) VALUES (
                $game_id ,
                $player ,
                $acceptance_sig ,
                $module ,
                $created_at ,
                $expires_at
              )`;
    let params2 = {
      $game_id: game_id,
      $player: player,
      $acceptance_sig: acceptance_sig,
      $module: module,
      $created_at: created_at,
      $expires_at: expires_at
    };
    await app.storage.executeDatabase(sql2, params2, "arcade");

    return;

  }




  async receiveJoinRequest(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();

    //
    // add to invite table
    //
    let game_id = tx.msg.game_id;
    let players_needed = 2;
    if (parseInt(txmsg.players_needed) > 2) { players_needed = parseInt(txmsg.players_needed); }
    let module = txmsg.game;
    let options = {};
    if (txmsg.options != undefined) { options = txmsg.options; }
    let game_status = "open";
    let player = tx.transaction.from[0].add;
    let players_array = player;
    let start_bid = 0;
    if (blk != null) { start_bid = blk.block.id; }
    let valid_for_minutes = 60;
    let created_at = parseInt(tx.transaction.ts);
    let expires_at = created_at + (60000 * parseInt(valid_for_minutes));
    let acceptance_sig = "";
    if (txmsg.invite_sig != "") { acceptance_sig = txmsg.invite_sig; }

    //
    // insert into invites
    //
    let sql2 = `INSERT INTO invites (
                game_id ,
                player ,
                acceptance_sig ,
                module ,
                created_at ,
                expires_at
              ) VALUES (
                $game_id ,
                $player ,
                $acceptance_sig ,
                $module ,
                $created_at ,
                $expires_at
              )`;
    let params2 = {
      $game_id: game_id,
      $player: player,
      $acceptance_sig: acceptance_sig,
      $module: module,
      $created_at: created_at,
      $expires_at: expires_at
    };
    await app.storage.executeDatabase(sql2, params2, "arcade");

    return;

  }


  createOpenTransaction(gamedata, recipient="") {

    let sendto = this.app.wallet.returnPublicKey();
    let moduletype = "Arcade";

    if (recipient != "") {
      sendto = recipient;
      moduletype = "ArcadeInvite";
    }

    let { ts, name, options, options_html, players_needed } = gamedata;
    let accept_sig = this.app.crypto.signMessage(`invite_game_${ts}`, this.app.wallet.returnPrivateKey());

    let tx = this.app.wallet.createUnsignedTransactionWithDefaultFee();
    tx.transaction.to.push(new saito.slip(sendto, 0.0));
    tx.msg = {
      ts,
      module: moduletype,
      request: "open",
      game: name,
      options,
      options_html: options_html || "",
      players_needed : parseInt(players_needed),
      players: [this.app.wallet.returnPublicKey()],
      players_sigs: [accept_sig],
    };
    tx = this.app.wallet.signTransaction(tx);

    return tx;

  }

  async receiveCloseRequest(blk, tx, conf, app) {
    let txmsg = tx.returnMessage();
    let sql = `UPDATE games SET status = $status WHERE game_id = $game_id`
    let params = { $status: 'close', $game_id: txmsg.sig };
    let resp = await app.storage.executeDatabase(sql, params, "arcade");
  }


  createInviteTransaction(app, data, gametx) {

    let txmsg = gametx.returnMessage();

    let tx = app.wallet.createUnsignedTransactionWithDefaultFee();
    tx.transaction.to.push(new saito.slip(gametx.transaction.from[0].add, 0.0));
    tx.transaction.to.push(new saito.slip(app.wallet.returnPublicKey(), 0.0));
    tx.msg.ts = "";
    tx.msg.module = txmsg.game;
    tx.msg.request = "invite";
    tx.msg.game_id = gametx.transaction.sig;
    tx.msg.players_needed = parseInt(txmsg.players_needed);
    tx.msg.options = txmsg.options;
    tx.msg.accept_sig = "";
    if (gametx.msg.accept_sig != "") {
      tx.msg.accept_sig = gametx.msg.accept_sig;
    }
    if (gametx.msg.ts != "") {
      tx.msg.ts = gametx.msg.ts;
    }
    tx.msg.invite_sig = app.crypto.signMessage(("invite_game_" + tx.msg.ts), app.wallet.returnPrivateKey());
    tx = this.app.wallet.signTransaction(tx);

    return tx;

  }




  createJoinTransaction(gametx) {

    let txmsg = gametx.returnMessage();

    let tx = this.app.wallet.createUnsignedTransactionWithDefaultFee();
    tx.transaction.to.push(new saito.slip(gametx.transaction.from[0].add, 0.0));
    tx.transaction.to.push(new saito.slip(this.app.wallet.returnPublicKey(), 0.0));
    tx.msg.ts = "";
    tx.msg.module = txmsg.game;
    tx.msg.request = "join";
    tx.msg.game_id = gametx.transaction.sig;
    tx.msg.players_needed = parseInt(txmsg.players_needed);
    tx.msg.options = txmsg.options;
    tx.msg.invite_sig = this.app.crypto.signMessage(("invite_game_" + gametx.msg.ts), this.app.wallet.returnPrivateKey());
    if (gametx.msg.ts != "") { tx.msg.ts = gametx.msg.ts; }
    tx = this.app.wallet.signTransaction(tx);

    return tx;

  }

  launchSinglePlayerGame(app, data, gameobj) {
    window.location = '/' + gameobj.slug;
    return;
  }
  
  createAcceptTransaction(gametx) {

    let txmsg = gametx.returnMessage();

    let accept_sig = this.app.crypto.signMessage(("invite_game_" + txmsg.ts), this.app.wallet.returnPrivateKey());
    txmsg.players.push(this.app.wallet.returnPublicKey());
    txmsg.players_sigs.push(accept_sig);
    txmsg.request = "accept";

    let tx = this.app.wallet.createUnsignedTransactionWithDefaultFee();
    for (let i = 0; i < txmsg.players.length; i++) { tx.transaction.to.push(new saito.slip(txmsg.players[i], 0.0)); }
    tx.transaction.to.push(new saito.slip(this.app.wallet.returnPublicKey(), 0.0));

    //
    // arcade will listen, but we need game engine to receive to start initialization
    //
    tx.msg = txmsg;
    tx.msg.game_id = gametx.transaction.sig;
    tx.msg.request = "accept";
    tx.msg.module = txmsg.game;
    tx = this.app.wallet.signTransaction(tx);

    return tx;

  }





  receiveSorryAcceptedTransaction(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();

    try {

      //
      // delete from local stores
      //
      if (app.options.games) {
        for (let i = app.options.games.length - 1; i >= 0; i--) {
          if (app.options.games[i].id == txmsg.game_id) {
            //console.info("########################");
            //console.info("### SENDING SORRY TX ###");
            //console.info("########################");
            //console.info("\n\n\nSORRY -- RECEIVED: " + JSON.stringify(app.options.games[i]));
            if (app.options.games[i].players.length == parseInt(app.options.games[i].players_needed) && !app.options.games[i].players.includes(tx.transaction.from[0].add)) {

              if (this.browser_active == 1) {
                salert("Opponent has responded claiming game already accepted :( -- returning to Arcade");
              }

              app.options.games.splice(i, 1);
              app.storage.saveOptions();
            }
          }
        }
      }

      if (this.browser_active == 1) {
        salert("Sorry! Your opponent has replied that has already accepted that game!");
        window.location = "/arcade";
        return;
      }

    } catch (err) {
      //console.info("ERROR WITH SORRY ACCEPTED TRANSACTION: " + err);
    }

  }



  async receiveAcceptRequest(blk, tx, conf, app) {

    if (this.browser_active == 1) {
      if (tx.isTo(app.wallet.returnPublicKey())) {

        //
        // if game already initialized, skip loeader
        //
        let txmsg = tx.returnMessage();
	let game_id = txmsg.game_id;
	if (app.options.games) {
	  for (let i = 0; i < app.options.games.length; i++) {
	    if (app.options.games[i].id == tx.transaction.sig) {
	      // game already accepted
	      return;
	    }
	  }
	}

        GameLoader.render(app, this);
        GameLoader.attachEvents(app, this);
        this.viewing_arcade_initialization_page = 1;

      } else {

	//
	// observers might get these when reloading the chain
	//
	if (this.game.player == 0) { return; }

      }
    }

    let txmsg = tx.returnMessage();
    let publickeys = [];
    for (let i = 0; i < tx.transaction.to.length; i++) {
      if (!publickeys.includes(tx.transaction.to[i].add)) {
        publickeys.push(tx.transaction.to[i].add);
      }
    }
    let unique_keys = publickeys;
    unique_keys.sort();
    let players_array = unique_keys.join("_");

    let sql = "UPDATE games SET players_array = $players_array WHERE status = $status AND game_id = $game_id";
    let params = {
      $players_array: players_array,
      $status: 'open',
      $game_id: txmsg.game_id
    }

    try {
      let resp = await this.app.storage.executeDatabase(sql, params, "arcade");
    } catch (err) {
      //console.info(err);
    }

    sql = "UPDATE games SET status = 'active' WHERE game_id = $game_id";
    params = {
      $game_id: txmsg.game_id
    }

    try {
      let resp = await this.app.storage.executeDatabase(sql, params, "arcade");
    } catch (err) {
      console.log(err);
    }
  }





  launchGame(game_id) {

    if (this.browser_active == 0) { return; }

    let arcade_self = this;
    arcade_self.is_initializing = true;
    arcade_self.initialization_timer = setInterval(() => {
      console.log("setInterval");
      let game_idx = -1;
      if (arcade_self.app.options.games != undefined) {
        for (let i = 0; i < arcade_self.app.options.games.length; i++) {
          if (arcade_self.app.options.games[i].id == game_id) {
            game_idx = i;
          }
        }
      }

      if (game_idx == -1) { return; }

      if (arcade_self.app.options.games[game_idx].initializing == 0) {

        //
        // check we don't have a pending TX for this game...
        //
        let ready_to_go = 1;

        if (arcade_self.app.wallet.wallet.pending.length > 0) {
          for (let i = 0; i < arcade_self.app.wallet.wallet.pending.length; i++) {
            let thistx = new saito.transaction(JSON.parse(arcade_self.app.wallet.wallet.pending[i]));
            let thistxmsg = thistx.returnMessage();
            if (thistxmsg.module == arcade_self.app.options.games[game_idx].module) {
              if (thistxmsg.game_id == arcade_self.app.options.games[game_idx].id) {
                ready_to_go = 0;
              }
            }
          }
        }
        
        if (ready_to_go == 0) {
          console.log("transaction for this game still in pending...");
          return;
        }
        
        clearInterval(arcade_self.initialization_timer);

        GameLoader.render(this.app, this, game_id);
        GameLoader.attachEvents(this.app, this);
        this.viewing_arcade_initialization_page = 1;

      }
    }, 1000);

  }




  webServer(app, expressapp, express) {

    super.webServer(app, expressapp, express);

    const fs = app.storage.returnFileSystem();
    const path = require('path');

    if (fs != null) {

      expressapp.get('/arcade/observer_multi/:game_id/:bid/:tid/:last_move', async (req, res) => {

	let lm = 0;
        let lbid = 0;        
        let ltid = 0;        
        let game_id = 0;

	try {
          if (req.params.last_move) 	{ lm = req.params.last_move; }
          if (req.params.bid) 		{ lbid = req.params.bid; }
          if (req.params.tid) 		{ ltid = req.params.tid; }
          if (req.params.game_id) 	{ game_id = req.params.game_id; }
	  if (lbid === "undefined") 	{ lbid = 0; }
	  if (ltid === "undefined") 	{ ltid = 0; }
	} catch (err) {}


        let sql = "SELECT * FROM gamestate WHERE game_id = $game_id AND last_move > $last_move ORDER BY last_move ASC LIMIT 10";
        let params = { $game_id: game_id , $last_move : lm };

	if (ltid != 0) {
          sql = "SELECT * FROM gamestate WHERE game_id = $game_id AND (last_move > $last_move OR tid > $last_tid) ORDER BY last_move ASC LIMIT 10";
          params = { $game_id: game_id , $last_move : lm , $last_tid : ltid };
	}


        let games = await app.storage.queryDatabase(sql, params, "arcade");

        if (games.length > 0) {
          res.setHeader('Content-type', 'text/html');
          res.charset = 'UTF-8';
          res.write(JSON.stringify(games));
          res.end();
          return;
        } else {
          res.setHeader('Content-type', 'text/html');
          res.charset = 'UTF-8';
          res.write("{}");
          res.end();
          return;
        }

      });


      expressapp.get('/arcade/observer_prev/:game_id/:current_move', async (req, res) => {

        let sql = "SELECT * FROM gamestate WHERE game_id = $game_id AND last_move < $last_move ORDER BY last_move DESC LIMIT 2";
        let params = { $game_id: req.params.game_id , $last_move : req.params.current_move }

        if (req.params.current_move == 0 || req.params.current_move === "undefined") {
          sql = "SELECT * FROM gamestate WHERE game_id = $game_id ORDER BY last_move ASC LIMIT 1";
          params = { $game_id: req.params.game_id }
	}

        let games = await app.storage.queryDatabase(sql, params, "arcade");

        if (games.length > 0) {
          res.setHeader('Content-type', 'text/html');
          res.charset = 'UTF-8';
          res.write(JSON.stringify(games));
          res.end();
          return;
        } else {
          res.setHeader('Content-type', 'text/html');
          res.charset = 'UTF-8';
          res.write("{}");
          res.end();
          return;
        }

      });

      expressapp.get('/arcade/observer/:game_id', async (req, res) => {

        let sql = "SELECT bid, tid, last_move, game_state FROM gamestate WHERE game_id = $game_id ORDER BY id DESC LIMIT 1";
        let params = { $game_id: req.params.game_id }

        let games = await app.storage.queryDatabase(sql, params, "arcade");

        if (games.length > 0) {
          let game = games[0];
          res.setHeader('Content-type', 'text/html');
          res.charset = 'UTF-8';
          res.write(JSON.stringify(game));
          res.end();
          return;
        }

      });


      expressapp.get('/arcade/keystate/:game_id/:player_pkey', async (req, res) => {

        let sql = "SELECT * FROM gamestate WHERE game_id = $game_id AND player = $playerpkey ORDER BY id DESC LIMIT 1";
        let params = {
          $game_id: req.params.game_id,
          $playerpkey: req.params.player_pkey
        }
        let games = await app.storage.queryDatabase(sql, params, "arcade");

        if (games.length > 0) {

          let game = games[0];
          res.setHeader('Content-type', 'text/html');
          res.charset = 'UTF-8';
          res.write(game.game_state.toString());
          res.end();
          return;

        }
      });


      expressapp.get('/arcade/restore/:game_id/:player_pkey', async (req, res) => {

        let sql = "SELECT * FROM gamestate WHERE game_id = $game_id ORDER BY id DESC LIMIT 10";
        let params = { $game_id: req.params.game_id }
        let games = await app.storage.queryDatabase(sql, params, "arcade");

        let stop_now = 0;
        let games_to_push = [];
        let recovering_pkey = "";

        try {
          if (req.params.player_pkey != undefined) { recovering_pkey = req.params.pkayer_pkey; }
        } catch (err) { }

        if (games.length > 0) {
          for (let z = 0; z < games.length; z++) {
            let game = games[z];
            if (game.player_pkey == recovering_pkey) { stop_now = 1; } else { games_to_push.push(game.state); }
            if (recovering_pkey == "" || stop_now == 1) { z = games.length + 1; }
          }
          res.setHeader('Content-type', 'text/html');
          res.charset = 'UTF-8';
          res.write(JSON.stringify(games_to_push));
          res.end();
          return;
        }

      });

      expressapp.get('/arcade/invite/:gameinvite', async (req, res) => {
        res.setHeader('Content-type', 'text/html');
        res.sendFile(path.resolve(__dirname + '/web/invite.html'));
      });

    }
  }





  createGameTXFromOptionsGame(game) {

    let game_tx = new saito.transaction();

    //
    // ignore games that are over
    //
    //console.info("GAME OVER + LAST BLOCK: " + game.over + " -- " + game.last_block + " -- " + game.id);

    if (game.over) { if (game.last_block > 0) { return; } }

    if (game.players) {
      game_tx.transaction.to = game.players.map(player => new saito.slip(player));
      game_tx.transaction.from = game.players.map(player => new saito.slip(player));
    } else {
      game_tx.transaction.from.push(new saito.slip(this.app.wallet.returnPublicKey()));
      game_tx.transaction.to.push(new saito.slip(this.app.wallet.returnPublicKey()));
    }

    let msg = {
      request: "loaded",
      game: game.module,
      game_id: game.id,
      options: game.options,
      players: game.players ,
      players_needed: game.players_needed,
      over: game.over,
      last_block: game.last_block,
    }
    if (game.status === "Opponent Resigned") { msg.options_html = "Opponent Resigned"; }

    game_tx.transaction.sig = game.id;
    game_tx.msg = msg;
    game_tx = this.app.wallet.signTransaction(game_tx);

    return game_tx;
  }



  removeOldGames() {
    let removed_old_games = 0;

    // if the game is very old, remove it
    for (let i = 0; i < this.games.length; i++) {
      let gamets = parseInt(this.games[i].transaction.ts);
      let timepassed = (new Date().getTime()) - gamets;
      if (timepassed > this.old_game_removal_delay) {
        this.games.splice(i, 1);
        removed_old_games = 1;
        i--;
      }
    }
    return removed_old_games;
  }



  // just receive the sig of the game to remove
  removeGameFromOpenList(game_sig) {
    this.games = this.games.filter(game => {
      if (game.transaction) {
        return game.transaction.sig != game_sig;
      } else {
        return true;
      }
    });

    if (this.app.options) {
      if (this.app.options.games) {
        for (let i = 0; i < this.app.options.games.length; i++) {
          if (this.app.options.games[i].id == game_sig) {
            this.app.options.games.splice(i, 1);
            this.app.storage.saveOptions();
          }
        }
      }
    }

    this.renderArcadeMain(this.app, this);
  }

  isForUs(tx) {

    if (!tx) { return false; }

    let for_us = true;
    let txmsg = tx.returnMessage();

    if (!txmsg) { return false; }

    if (txmsg.options.players_invited) {
      for_us = false;
      if (tx.transaction.from[0].add == this.app.wallet.returnPublicKey()) {
        for_us = true;
      } else {
        tx.returnMessage().options.players_invited.forEach(player => {
          if (player == this.app.wallet.returnPublicKey() || player == this.app.keys.returnIdentifierByPublicKey(this.app.wallet.returnPublicKey())) {
            for_us = true;
          }
        });
      }
    }
    return for_us;
  }
  validateGame(tx) {

    if (!tx) { return false; }

    if (!tx.transaction) {

      return false;

    } else {
      if (!tx.transaction.sig) { return false; }
      if (tx.msg.over == 1) { return false; }
    }
    for (let i = 0; i < this.games.length; i++) {

      let transaction = Object.assign({sig: "" }, this.games[i].transaction);
      if (tx.transaction.sig == transaction.sig) { return false; }
      if (tx.returnMessage().game_id != "" && tx.returnMessage().game_id == transaction.sig) { return false; }
      if (tx.returnMessage().game_id === this.games[i].transaction.sig) {
        console.log("ERROR 480394: not re-adding existing game to list");
        return false;
      }
    }
    return true;
  }
  joinGameOnOpenList(tx) {

    if (!tx.transaction) {
      return;
    } else {
      if (!tx.transaction.sig) { return; }
      if (tx.msg.over == 1) { return; }
    }

    let txmsg = tx.returnMessage();

    for (let i = 0; i < this.games.length; i++) {
      if (this.games[i].transaction.sig == txmsg.game_id) {
        if (!this.games[i].msg.players.includes(tx.transaction.from[0].add)) {
          if (txmsg.invite_sig != "") {
            this.games[i].msg.players.push(tx.transaction.from[0].add);
            if (!this.games[i].msg.players_sigs) { this.games[i].msg.players_sigs = []; }
            this.games[i].msg.players_sigs.push(txmsg.invite_sig);
          }
        }
      }
    }

    if (this.browser_active == 1) {
      this.render(this.app);
    }


  }
  addGameToOpenList(tx) {
    console.log("addGameToOpenList");
    let valid_game = this.validateGame(tx);
    if (valid_game) {
      let for_us = this.isForUs(tx);
      if (for_us) {
        this.games.unshift(tx);
      }
      let removed_game = this.removeOldGames();
      if(for_us || removed_game){
        this.renderArcadeMain(this.app, this);
      }
    }
  }
  addGamesToOpenList(txs) {

    let for_us = false;
    txs.forEach((tx, i) => {
      let valid_game = this.validateGame(tx);
      if (valid_game){
        let this_game_is_for_us = this.isForUs(tx);
        if (this_game_is_for_us) {
          this.games.unshift(tx);
        }
        for_us = for_us || this_game_is_for_us;
      }
      
    });
    let removed_game = this.removeOldGames();
    if(for_us || removed_game){
      this.renderArcadeMain(this.app, this);
    }
    
  }
    

  addGameToObserverList(msg) {
    for (let i = 0; i < this.observer.length; i++) {
      if (msg.game_id == this.observer[i].game_id) {
        return;
      }
    }
    this.observer.push(msg);

    this.renderArcadeMain(this.app, this);
  }




  async saveGameState(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();

    let game_state = "";

    if (txmsg.game_state != "") { game_state = txmsg.game_state; }


    let sql = `INSERT INTO gamestate (
                game_id ,
                player ,
                players_array ,
                module ,
                bid ,
                tid ,
                lc ,
                sharekey ,
                game_state ,
                tx ,
                last_move
       ) VALUES (
                $game_id,
                $player,
                $players_array,
                $module,
                $bid,
                $tid,
                $lc,
                "",
                $game_state,
                $tx ,
                $last_move
        )`;
    let x = [];
    let txto = tx.transaction.to;
    for (let z = 0; z < txto.length; z++) {
      if (!x.includes(txto[z].add)) { x.push(txto[z].add); }
    }

    //
    // add any move associated with this tx to the
    // gamestate so that it can be executed to pull
    // us up-to-date on what happened in preparation
    // for the next turn / broadcast
    //
    game_state.last_turn = txmsg.turn;


    //
    // do not save 1-player games
    //
    if (x.length == 1) { return; }

    let players_array = x.join("_");

    let params = {
      $game_id: txmsg.game_id,
      $player: tx.transaction.from[0].add,
      $players_array: players_array,
      $module: txmsg.module,
      $bid: blk.block.id,
      $tid: tx.transaction.id,
      $lc: 1,
      $game_state: JSON.stringify(game_state),
      $tx: JSON.stringify(tx.transaction) ,
      $last_move: (new Date().getTime())
    };

    await app.storage.executeDatabase(sql, params, "arcade");


    //
    // periodically prune
    //
    if (Math.random() < 0.005) {
      let current_ts = new Date().getTime();
      let one_week_ago = current_ts - 640000000;
      let delete_sql = "SELECT game_id FROM gamestate WHERE last_move < $last_move GROUP BY game_id ORDER BY last_move ASC";
      let delete_params = { $last_move : one_week_ago };
      let rows3 = await app.storage.queryDatabase(delete_sql, delete_params, "arcade");

      if (rows3) {
        if (rows3.length > 0) {
          for (let i = 0; i < rows3.length; i++) {
            let game_id = rows3[i].game_id;
	    let purge_sql = "DELETE FROM gamestate WHERE game_id = $game_id";
            let purge_params = { $game_id : game_id };
	    await app.storage.executeDatabase(purge_sql, purge_params, "arcade");
          }
        }
      }

      //
      // purge old games
      //
      let current_timestamp = new Date().getTime() - 1200000;
      let sql5 = "DELETE FROM games WHERE status = 'open' AND created_at < $adjusted_ts";
      let params5 = { $adjusted_ts : current_timestamp }
      await this.app.storage.executeDatabase(sql5, params5, 'arcade');

      let sql6 = "DELETE FROM invites WHERE created_at < $adjusted_timestamp";
      let params6 = { $adjusted_ts : current_timestamp }
      await this.app.storage.executeDatabase(sql6, params6, 'arcade');

    }

  }





  observeGame(msg, watch_live=0) {

    let arcade_self = this;

    let msgobj = JSON.parse(this.app.crypto.base64ToString(msg));
    let address_to_watch = msgobj.player;
    let game_id = msgobj.game_id;
    let tid = msgobj.tid;
    let bid = msgobj.bid;
    let last_move = msgobj.last_move;

    if (tid === undefined || tid == "") { tid = 1; }
    if (bid === undefined || bid == "") { tid = 1; }
    if (last_move === undefined || last_move == "") { tid = 1; }

    //
    // already watching game... load it
    //
    if (this.app.options.games) {
      let { games } = this.app.options;
      for (let i = 0; i < games.length; i++) {
        if (games[i].id === game_id) {
          games[i].observer_mode = 1;
          games[i].observer_mode_active = 0;
          for (let z = 0; z < games[i].players.length; z++) {
            if (games[i].players[z] == address_to_watch) {
              games[i].observer_mode_player = (z+1);
            }
          }
	  if (!games[i].observer_mode_player) {
	    games[i].observer_mode_player = 1;
	  }
	  if (address_to_watch == "") {
	    address_to_watch = games[i].players[0];
	  }
          games[i].ts = new Date().getTime();
          arcade_self.app.keys.addWatchedPublicKey(address_to_watch);
          arcade_self.app.options.games = games;
          arcade_self.app.storage.saveOptions();
          let slug = arcade_self.app.modules.returnModule(msgobj.module).returnSlug();
          window.location = '/' + slug;
          return;
        }
      }
    }


/***
    //
    // watch live
    //
    if (watch_live) {
      fetch(`/arcade/observer/${game_id}`).then(response => {
        response.json().then(data => {

          let game = JSON.parse(data.game_state);
          let tid = data.tid;
          let bid = data.bid;
          let lm = data.last_move;

	  game.step.ts = lm;
	  game.step.tid = tid;
	  game.step.bid = bid;

          //
          // tell peers to forward this address transactions
          //
          arcade_self.app.keys.addWatchedPublicKey(address_to_watch);
          let { games } = arcade_self.app.options;

          //
          // specify observer mode only
          //
          if (games == undefined) {
            games = [];
          }

          for (let i = 0; i < games.length; i++) {
            if (games[i].id == game_id) {
              games.splice(i, 1);
            }
          }

          game.observer_mode = 1;
          game.observer_mode_active = 0;
          game.player = 0;

          //
          // and we add this stuff to our queue....
          //
          for (let z = 0; z < game.last_turn.length; z++) {
            game.queue.push(game.last_turn[z]);
          }

	  //
	  // increment the step by 1, as returnPreGameMove will have unincremented
	  // ( i.e. not including the step that broadcast it )
          //
	  game.step.game++;

          games.push(game);

          arcade_self.app.options.games = games;
          arcade_self.app.storage.saveOptions();

          //
          // move into game
          //
          let slug = arcade_self.app.modules.returnModule(msgobj.module).returnSlug();
          window.location = '/' + slug;
        })
      }).catch(err => console.info("ERROR 418019: error fetching game for observer mode", err));
    } else {
****/
      //
      // HACK
      // do not listen
      //
      arcade_self.app.keys.addWatchedPublicKey(address_to_watch);
      //
      let { games } = arcade_self.app.options;
      if (games == undefined) { games = []; }
      for (let i = 0; i < games.length; i++) {
        if (games[i].id == game_id) {
          games.splice(i, 1);
        }
      }
console.log("ABOUT TO KICK INTO OBSERVER MODE!");

      arcade_self.app.options.games = games;
      arcade_self.initializeObserverMode(game_id, watch_live);

console.log("AND CONTINUING");
//    }

  }



  observerDownloadNextMoves(game_mod, mycallback=null) {

    let arcade_self = this;

    // purge old transactions
    for (let i = 0; i < game_mod.game.future.length; i++) {

      let queued_tx = new saito.transaction(JSON.parse(game_mod.game.future[i]));
      let queued_txmsg = queued_tx.returnMessage();

      if (queued_txmsg.step.game <= game_mod.game.step.game && queued_txmsg.step.game <= game_mod.game.step.players[queued_tx.transaction.from[0].add]) {
        game_mod.game.future.splice(i, 1);
        i--;
      }
    }

    console.log(` NEXT MOVES: /arcade/observer_multi/${game_mod.game.id}/${game_mod.game.step.bid}/${game_mod.game.step.tid}/${game_mod.game.step.ts}`);

    fetch(`/arcade/observer_multi/${game_mod.game.id}/${game_mod.game.step.bid}/${game_mod.game.step.tid}/${game_mod.game.step.ts}`).then(response => {
      response.json().then(data => {

console.log("data length: " + data.length);

	for (let i = 0; i < data.length; i++) {

console.log("i: " + i + " --- tx id: " + data[i].id);
	  let future_tx = new saito.transaction(JSON.parse(data[i].tx));
	  future_tx.msg = future_tx.returnMessage();
	  future_tx.msg.game_state = {};
	  //
	  // write this data into the tx
	  //
	  future_tx.msg.last_move = data[i].last_move;
	  future_tx.msg.last_tid = data[i].tid;
	  future_tx.msg.last_bid = data[i].bid;
	  future_tx = arcade_self.app.wallet.signTransaction(future_tx);

	  let already_contains_move = 0;
	  for (let z = 0; z < game_mod.game.future.length; z++) {

	    let tmptx = new saito.transaction(JSON.parse(game_mod.game.future[z]));

console.log("steps comparison: " + future_tx.msg.step.game + " -- vs -- " + game_mod.game.step.game);

	    if (future_tx.msg.step.game <= game_mod.game.step.game && future_tx.msg.step.game <= game_mod.game.step.players[future_tx.transaction.from[0].add]) {
	      already_contains_move = 1;
	    }
	  }

	  if (already_contains_move == 0) {
	    game_mod.game.future.push(JSON.stringify(future_tx.transaction));
	  }
	}

	game_mod.saveGame(game_mod.game.id);	
	game_mod.saveFutureMoves(game_mod.game.id);	

	if (mycallback != null) { mycallback(game_mod); }

      });
    }).catch(err => console.info("ERROR 354322: error downloading next moves", err));
  }




  async initializeObserverModePreviousStep(game_id, starting_move) {

    let arcade_self = this;
    let { games } = arcade_self.app.options;

    let first_tx = null;;

    console.log(`FETCHING: /arcade/observer_prev/${game_id}/${starting_move}`);

    fetch(`/arcade/observer_prev/${game_id}/${starting_move}`).then(response => {
      response.json().then(data => {

        first_tx = JSON.parse(data[0].game_state);

console.log("UPDATED GAME TS to: " + JSON.stringify(first_tx.step));
console.log("UPDATED GAME QUEUE to: " + JSON.stringify(first_tx.queue));


	//
	// single transaction
	//
	let future_tx = new saito.transaction(JSON.parse(data[0].tx));
	    future_tx.msg = future_tx.returnMessage();
	    future_tx.msg.game_state = {};
	    future_tx.msg.last_move = data[0].last_move;
	    future_tx.msg.last_tid = data[0].tid
	    future_tx.msg.last_bid = data[0].bid;
	    future_tx = arcade_self.app.wallet.signTransaction(future_tx);
            if (first_tx.future == undefined || first_tx.future == "undefined" || first_tx.future == null) { first_tx.future = []; }
	    first_tx.future.push(JSON.stringify(future_tx.transaction));

        //
        // we did not add a move
        //
        let game = first_tx;

	//
	// prevent old turns from persisting
	//
	game.turn = [];

console.log("reset to step: " + game.step.game);
console.log("queue at this step: " + game.queue);

        game.observer_mode = 1;
        game.observer_mode_active = 0;
        game.player = 0;

	//
	// set timestamp
	//
	game.step.ts = 0;

        let idx = -1;
        for (let i = 0; i < games.length; i++) {
          if (games[i].id === first_tx.id) {
            idx = i;
          }
        }
        if (idx == -1) {
          games.push(game);
        } else {
          games[idx] = game;
        }

        arcade_self.app.options.games = games;
        arcade_self.app.storage.saveOptions();

	let game_mod = arcade_self.app.modules.returnModule(game.module);

        //
        // move into or reload game
        //
        let slug = arcade_self.app.modules.returnModule(first_tx.module).returnSlug();
        window.location = '/' + slug;

      });
    });
  }


  initializeObserverMode(game_id, starting_move) {

    let arcade_self = this;
    let { games } = arcade_self.app.options;

    let first_tx = null;;
    let first_tx_fetched = 0;

console.log("initializing observer mode here!");


console.log(`FETCHED: /arcade/observer_multi/${game_id}/0/0/${starting_move}`);

    fetch(`/arcade/observer_multi/${game_id}/0/0/${starting_move}`).then(response => {
      response.json().then(data => {

console.log("RECEIVED THE RESPONSE!");

	let did_we_add_a_move = 0;;

	for (let i = 0; i < data.length; i++) {

	  if (first_tx_fetched == 0) {

console.log("AA2");

	    first_tx = JSON.parse(data[i].game_state);
	    first_tx_fetched = 1;
console.log("AA3");

	    let future_tx = new saito.transaction(JSON.parse(data[i].tx));
	    future_tx.msg = future_tx.returnMessage();
	    future_tx.msg.game_state = {};
	    future_tx.msg.last_move = data[i].last_move;
	    future_tx.msg.last_tid = data[i].last_tid;
	    future_tx.msg.last_bid = data[i].bid;
	    future_tx = arcade_self.app.wallet.signTransaction(future_tx);
            if (first_tx.future == undefined || first_tx.future == "undefined" || first_tx.future == null) { first_tx.future = []; }
	    first_tx.future.push(JSON.stringify(future_tx.transaction));
console.log("AAA");

	  } else {
console.log("BB1");

	    let future_tx = new saito.transaction(JSON.parse(data[i].tx));
	    future_tx.msg = future_tx.returnMessage();
	    future_tx.msg.game_state = {};
	    future_tx.msg.last_move = data[i].last_move;
	    future_tx.msg.last_tid = data[i].tid;
	    future_tx.msg.last_bid = data[i].bid;
	    future_tx = arcade_self.app.wallet.signTransaction(future_tx);
            if (first_tx.future == undefined || first_tx.future == "undefined" || first_tx.future == null) { first_tx.future = []; }
	    first_tx.future.push(JSON.stringify(future_tx.transaction));
console.log("BB2");

	  }

	  did_we_add_a_move = 1;

	}

        //
        // we did not add a move
        //
        let game = first_tx;
        game.observer_mode = 1;
        game.observer_mode_active = 0;
        game.player = 0;

        let idx = -1;
        for (let i = 0; i < games.length; i++) {
          if (games[i].id === first_tx.id) {
            idx = i;
          }
        }
        if (idx == -1) {
          games.push(game);
        } else {
          games[idx] = game;
        }

        arcade_self.app.options.games = games;
        arcade_self.app.storage.saveOptions();

        //
        // move into game
        //
        let slug = arcade_self.app.modules.returnModule(first_tx.module).returnSlug();
        window.location = '/' + slug;

      });
    }).catch(err => console.info("ERROR 351232: error fetching queued games for observer mode", err));
  }





  shouldAffixCallbackToModule(modname) {
    if (modname == "ArcadeInvite") { return 1; }
    if (modname == "Arcade") { return 1; }
    for (let i = 0; i < this.affix_callbacks_to.length; i++) {
      if (this.affix_callbacks_to[i] == modname) {
        //console.info("AFFIXING CALLBACKS TO: " + modname);
        return 1;
      }
    }
    return 0;
  }

  updateIdentifier() {
  }

  onResetWallet() { 
    if (this.app.options) {
      this.app.options.games = [];
    }
  }


}

module.exports = Arcade;


