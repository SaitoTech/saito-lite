const saito = require('../../lib/saito/saito.js');
const ModTemplate = require('../../lib/templates/modtemplate');
const ArcadeMain = require('./lib/arcade-main/arcade-main');
const ArcadeLoader = require('./lib/arcade-main/arcade-loader');
const ArcadeLeftSidebar = require('./lib/arcade-left-sidebar/arcade-left-sidebar');
const ArcadeRightSidebar = require('./lib/arcade-right-sidebar/arcade-right-sidebar');

const Header = require('../../lib/ui/header/header');


class Arcade extends ModTemplate {

  constructor(app) {

    super(app);

    this.name 			= "Arcade";
    this.events			= ['chat-render-request'];
    this.mods			= [];
    this.affix_callbacks_to 	= [];
    this.games			= [];
    this.observer		= [];
    this.accepted               = [];

  }



   receiveEvent(type, data) {
     if (type == 'chat-render-request') {
       if (this.browser_active) {
         let uidata = {};
	     uidata.arcade = this;
         ArcadeLeftSidebar.render(this.app, uidata);
         ArcadeLeftSidebar.attachEvents(this.app, uidata);
       }
     }
  }


  observeGame(msg) {

    let msgobj 			= JSON.parse(this.app.crypto.base64ToString(msg));
    let address_to_watch 	= msgobj.publickey;
    let game_id 		= msgobj.game_id;
    let arcade_self		= this;

    //
    // already watching game... load it
    //
    for (let i = 0; i < arcade_self.app.options.games.length; i++) {
      if (arcade_self.app.options.games[i].id == game_id) {

	arcade_self.app.options.games[i].ts = new Date().getTime();
        arcade_self.app.storage.saveOptions();
        window.location = '/'+arcade_self.app.options.games[i].module.toLowerCase();
        return;
      }
    }


    $.get(`/arcade/observer/${game_id}`, (response, error) => {

      if (error == "success") {

        let game = JSON.parse(response);

        //
        // tell peers to forward this address transactions
        //
        arcade_self.app.keys.addWatchedPublicKey(address_to_watch);

        //
        // specify observer mode only
        //
        game.player = 0;
        if (arcade_self.app.options.games == undefined) {
          arcade_self.app.options.games = [];
        }
        for (let i = 0; i < arcade_self.app.options.games.length; i++) {
          if (arcade_self.app.options.games[i].id == game.id) {
            arcade_self.app.options.games.splice(i, 1);
          }
        }
        arcade_self.app.options.games.push(game);
        arcade_self.app.storage.saveOptions();

        //
        // move into game
        //
        window.location = '/'+arcade_self.app.options.games[arcade_self.app.options.games.length-1].module.toLowerCase();

      } else {
console.log("ERROR 418019: error fetching game for observer mode");
      }
    });
  }

  render(app, data) {

    if (this.browser_active == 0) { return; }

    ArcadeMain.render(app, data);
    ArcadeMain.attachEvents(app, data);

    ArcadeLeftSidebar.render(app, data);
    ArcadeLeftSidebar.attachEvents(app, data);

    ArcadeRightSidebar.render(app, data);
    ArcadeRightSidebar.attachEvents(app, data);

  }



  initialize(app) {

    super.initialize(app);

    //
    // main-panel games
    //
    let x = [];
    x = this.app.modules.respondTo("arcade-games");
    for (let i = 0; i < x.length; i++) {
      this.mods.push(x[i]);
      this.affix_callbacks_to.push(x[i].name);
    }

    //
    // left-panel chat
    //
    x = this.app.modules.respondTo("email-chat");
    for (let i = 0; i < x.length; i++) {
      this.mods.push(x[i]);
    }

    //
    // add my own games (as fake txs)
    //
    if (this.app.options.games != undefined) {
      for (let i = 0; i < this.app.options.games.length; i++) {
	let z = new saito.transaction();
        for (let j = 0; j < this.app.options.games[i].players.length; j++) {
	  z.transaction.to.push(new saito.slip(this.app.options.games[i].players[j]));
        }
        for (let j = 0; j < this.app.options.games[i].players.length; j++) {
	  z.transaction.from.push(new saito.slip(this.app.options.games[i].players[j]));
        }
	z.transaction.sig          = this.app.options.games[i].id;
	z.transaction.msg.game_id  = this.app.options.games[i].id;
	z.transaction.msg.request  = "loaded";
        z.transaction.msg.game   = this.app.options.games[i].module;
        z.transaction.msg.options  = this.app.options.games[i].options;;
	this.addGameToOpenList(z);
      }
    }

/****
    // fake games
    for (let i=0; i < 5; i++) {
      this.games.unshift(
        new saito.transaction({
          to: [],
          from: [{ add: app.wallet.returnPublicKey() }],
          msg: {
            game: 'Twilight Struggle',
            game_id: app.crypto.hash(`${new Date().getTime()}`),
            options: ['US +2', 'ES'],
            options_html: `
              <div class="game-options-html">
                <div class="pill">US +2</div>
                <div class="pill">ES</div>
              </div>
            `
          },
          sig: app.crypto.hash(`${new Date().getTime()}`)
        })
      )

      this.addGameToObserverList({
        game_id : app.crypto.hash(`${new Date().getTime()}`),
        publickey : app.crypto.hash(`${new Date().getTime()}`)
      });
    }
****/

  }


  initializeHTML(app) {

    let data = {};
    data.arcade = this;


    Header.render(app, data);
    Header.attachEvents(app, data);

    this.render(app, data);

    // Use for Carousel
    importGlide = async () => {
      const Glide = await import('./lib/glide/glide.min.js');
      this.glide = new Glide.default('.glide', {
        type: 'carousel',
        autoplay: 3000,
        perView: 3,
      });

      this.glide.mount();
    }
    importGlide();

  }


  //
  // load transactions into interface when the network is up
  //
  onPeerHandshakeComplete(app, peer) {

    if (this.browser_active == 0) { return; }

    let arcade_self = this;

    //
    // load open games from server
    //
    this.sendPeerDatabaseRequest("arcade", "games", "*", "status = 'open'", null, function(res, data) {
      if (res.rows == undefined) { return; }
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
	  let tx = new saito.transaction(JSON.parse(res.rows[i].tx));
	  arcade_self.addGameToOpenList(tx);
	}
      }
    });


    //
    // load active games for observer mode
    //
    this.sendPeerDatabaseRequest("arcade", "gamestate", "DISTINCT game_id, module, player, players_array", "1 = 1 GROUP BY game_id ORDER BY last_move DESC LIMIT 50", null, function(res) {
      if (res.rows == undefined) { return; }
      if (res.rows.length > 0) {
console.log("ACTIVE OBSERVER GAMES:" + JSON.stringify(res.rows));
        for (let i = 0; i < res.rows.length; i++) {
	  arcade_self.addGameToObserverList({ game_id : res.rows[i].game_id, module : res.rows[i].module , players_array : res.rows[i].players_array, publickey : res.rows[i].player });
	}
      }
    });


  }


  addGameToObserverList(msg) {

    for (let i = 0; i < this.observer.length; i++) {
      if (msg.game_id == this.observer[i].game_id) {
        return;
      }
    }
    this.observer.push(msg);

    let data = {};
    data.arcade = this;

    if (this.browser_active == 1) {
      ArcadeRightSidebar.render(this.app, data);
      ArcadeRightSidebar.attachEvents(this.app, data);
    }
  }


  addGameToOpenList(tx) {

    let txmsg = tx.returnMessage();

    for (let i = 0; i < this.games.length; i++) {
      if (this.games[i].transaction.sig == tx.transaction.sig) { 
        return;
      }
      if (txmsg.game_id == this.games[i].transaction.sig) {
        return;
      }
    }

    this.games.unshift(tx);

    let data = {};
    data.arcade = this;

    if (this.browser_active == 1) {
      ArcadeMain.render(this.app, data);
      ArcadeMain.attachEvents(this.app, data);
    }
  }


  async onConfirmation(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();
    let arcade_self = app.modules.returnModule("Arcade");

    if (conf == 0) {

      //
      // open msgs -- prolifigate
      //
      if (txmsg.module == "Arcade" && txmsg.request == "open") {
	arcade_self.addGameToOpenList(tx);
	arcade_self.receiveOpenRequest(blk, tx, conf, app);
      }

      //
      // save state -- also prolifigate
      //
      if (txmsg.game_state != undefined && txmsg.game_id != "") {
	arcade_self.saveGameState(blk, tx, conf, app);
      }


      //
      // ignore msgs for others
      //
      if (!tx.isTo(app.wallet.returnPublicKey())) { return; }



      // invites
      if (txmsg.request == "invite") {

        for (let i = 0; i < arcade_self.app.options.games.length; i++) {
	  if (arcade_self.app.options.games[i].id == txmsg.game_id) {
	    if (arcade_self.app.options.games[i].initializing == 0) { return; }
	  }
        }

	arcade_self.receiveInviteRequest(blk, tx, conf, app);
      }

      // acceptances
      if (txmsg.request == "accept") {

console.log("ARCADE GETS ACCEPT MESSAGE: " + txmsg.request);

        for (let i = 0; i < arcade_self.app.options.games.length; i++) {
	  if (arcade_self.app.options.games[i].id == txmsg.game_id) {
console.log("GAME NO LONGER INITIALIZING!");
	    if (arcade_self.app.options.games[i].initializing == 0) { 

	      //
	      // is this old? exit
	      //
	      let currentTime = new Date().getTime();
	      if ((currentTime-arcade_self.app.options.games[i].ts) > 2000) {
console.log(currentTime + " ------- " + arcade_self.app.options.games[i].ts);
	        return;
	      }
	    }
	  }
        }

console.log("... still here... receive accept request!");
        arcade_self.receiveAcceptRequest(blk, tx, conf, app);

console.log("\n\n\nlaunching request to launch game... flag button, etc.");

	arcade_self.launchGame(txmsg.game_id);
      }

      // game over
      if (txmsg.request == "gameover") {
	arcade_self.receiveGameoverRequest(blk, tx, conf, app);
      }
    }
  }



  launchGame(game_id) {

    if (this.browser_active == 0) { return; }

    let arcade_self = this;

    arcade_self.is_initializing = true;
    arcade_self.initialization_timer = setInterval(() => {

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

        clearInterval(arcade_self.initialization_timer);

	let data = {};
	    data.arcade   = arcade_self;
	    data.game_id  = game_id;

	ArcadeLoader.render(arcade_self.app, data);
	ArcadeLoader.attachEvents(arcade_self.app, data);

      }
    }, 1000);

  }



  async saveGameState(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();

    let game_state = "";
    let key_state  = "";

    if (txmsg.game_state != "") { game_state = txmsg.game_state; }
    if (txmsg.key_state != "") { key_state = txmsg.key_state; }

    let sql = `INSERT INTO gamestate (
		game_id , 
		player ,
		players_array ,
		module ,
		bid ,
		tid ,
		lc ,
		key_state ,
		game_state ,
		last_move
       ) VALUES (
		$game_id,
		$player,
		$players_array,
		$module,
		$bid,
		$tid,
		$lc,
		$key_state,
		$game_state,
		$last_move
        )`;
    let x = [];
    let txto = tx.transaction.to;
    for (let z = 0; z < txto.length; z++) {
      if (!x.includes(txto[z].add)) { x.push(txto[z].add); }
    }
    let players_array = x.join("_");
    let params = {
                $game_id   : txmsg.game_id ,
                $player    : tx.transaction.from[0].add ,
                $players_array    : players_array ,
                $module    : txmsg.module ,
                $bid       : blk.block.id ,
                $tid       : tx.transaction.id ,
                $lc        : 1 ,
                $key_state : JSON.stringify(key_state) ,
                $game_state : JSON.stringify(game_state) ,
                $last_move : (new Date().getTime())
        };
    await app.storage.executeDatabase(sql, params, "arcade");

  }





  async receiveOpenRequest(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();

    let module 			= txmsg.game;
    let player			= tx.transaction.from[0].add;
    let game_id			= tx.transaction.sig;
    let options			= {};
    let start_bid		= blk.block.id;
    let valid_for_minutes	= 60;
    let created_at		= parseInt(tx.transaction.ts);
    let expires_at 		= created_at + (60000 * parseInt(valid_for_minutes));

    let sql = `INSERT INTO games (
  		player ,
		module ,
		game_id ,
		status ,
		options ,
		tx ,
		start_bid ,  
		created_at ,
		expires_at
	      ) VALUES (
		$player ,
		$module ,
		$game_id ,
		$status ,
		$options ,
		$tx,
		$start_bid ,
		$created_at ,
		$expires_at
	      )`;
    let params = {
                $player     : player ,
                $module     : module ,
                $game_id    : game_id ,
	 	$status	    : "open" ,
		$options    : options ,
		$tx         : JSON.stringify(tx.transaction) ,
		$start_bid  : blk.block.id ,
		$created_at : created_at ,
		$expires_at : expires_at
              };
console.log("INSERTING OPEN GAME: " + sql + " -- " + params);
    await app.storage.executeDatabase(sql, params, "arcade");
    return;
  }
  sendOpenRequest(app, data, gamedata) {
    let tx = this.createOpenTransaction(gamedata);
    this.app.network.propagateTransaction(tx);
  }
  createOpenTransaction(gamedata) {

    let ts = new Date().getTime();
    let accept_sig = this.app.crypto.signMessage(("create_game_"+ts), this.app.wallet.returnPrivateKey());

    let tx = this.app.wallet.createUnsignedTransactionWithDefaultFee();
        tx.transaction.to.push(new saito.slip(this.app.wallet.returnPublicKey(), 0.0));
        tx.transaction.msg.ts       		= ts;
        tx.transaction.msg.module   		= "Arcade";
        tx.transaction.msg.request  		= "open";
        tx.transaction.msg.game     		= gamedata.name;
        tx.transaction.msg.options  		= gamedata.options;
        tx.transaction.msg.options_html = gamedata.options_html;
        tx.transaction.msg.players_needed 	= gamedata.players_needed;
        tx.transaction.msg.accept_sig 		= accept_sig;
        tx.transaction.msg.players  		= [];
        tx.transaction.msg.players.push(this.app.wallet.returnPublicKey());
    tx = this.app.wallet.signTransaction(tx);

    return tx;

  }




  async receiveInviteRequest(blk, tx, conf, app) {

    //
    // servers
    //
    let txmsg = tx.returnMessage();
    let sql = "UPDATE games SET state = 'active', id = $gid WHERE sig = $sig";
    let params = {
      $gid : txmsg.game_id ,
      $sig : txmsg.sig
    }
    await this.app.storage.executeDatabase(sql, params, "arcade");
    if (this.browser_active == 0) { return; }

    //
    // auto-accept
    //
    this.accepted[txmsg.sig] = 1;


    //
    // browsers
    //
    let opponent = tx.transaction.from[0].add;
    let invitee  = tx.transaction.to[0].add;

    data = {};
    data.arcade = this;

  }
  sendInviteRequest(app, data, opentx) {
    let tx = this.createInviteTransaction(app, data, opentx);
    this.app.network.propagateTransaction(tx);
  }
  createInviteTransaction(app, data, gametx) {

    let txmsg = gametx.returnMessage();

    let tx = app.wallet.createUnsignedTransactionWithDefaultFee();
        tx.transaction.to.push(new saito.slip(gametx.transaction.from[0].add, 0.0));
        tx.transaction.to.push(new saito.slip(app.wallet.returnPublicKey(), 0.0));
        tx.transaction.msg.ts   	= "";
        tx.transaction.msg.module   	= txmsg.game;
        tx.transaction.msg.request  	= "invite";
	tx.transaction.msg.game_id	= gametx.transaction.sig;
        tx.transaction.msg.options  	= txmsg.options;
        tx.transaction.msg.accept_sig   = "";
	if (gametx.transaction.msg.accept_sig != "") { 
          tx.transaction.msg.accept_sig   = gametx.transaction.msg.accept_sig;
        }
	if (gametx.transaction.msg.ts != "") { 
          tx.transaction.msg.ts   = gametx.transaction.msg.ts;
        }
        tx.transaction.msg.invite_sig   = app.crypto.signMessage(("invite_game_"+tx.transaction.msg.ts), app.wallet.returnPrivateKey());
    tx = this.app.wallet.signTransaction(tx);

    return tx;

  }







  async receiveAcceptRequest(blk, tx, conf, app) {

    if (this.browser_active == 1) {
      ArcadeLoader.render(app, data);
      ArcadeLoader.attachEvents(app, data);
    }

    let publickeys = tx.transaction.to.map(slip => slip.add);
    let removeDuplicates = (names) => names.filter((v,i) => names.indexOf(v) === i)
    let unique_keys = removeDuplicates(publickeys);
 
    let sql = "UPDATE games SET state = 'accepted' WHERE state = $state AND player IN ($player1, $player2, $player3, $player4)";
    let params = {
      $state : 'open',
      $player1 : unique_keys[0] || '',
      $player2 : unique_keys[1] || '',
      $player3 : unique_keys[2] || '',
      $player4 : unique_keys[3] || '',
    }
console.log("about to await execut db");
    await this.app.storage.executeDatabase(sql, params, "arcade");
console.log("done now...");

  }
  sendAcceptRequest(app, data) {

    let game_module 	= "Wordblocks";
    let game_id		= "7123598714987123512";
    let opponents 	= [app.wallet.returnPublicKey()];

    let tx = app.wallet.createUnsignedTransactionWithDefaultFee();
        for (let i = 1; i < opponents.length; i++) { tx.transaction.to.push(new saito.slip(opponents[i], 0.0)); }
        tx.transaction.to.push(new saito.slip(this.app.wallet.returnPublicKey(), 0.0));
        tx.transaction.msg.module   = game_module;
        tx.transaction.msg.request  = "accept";
        tx.transaction.msg.game_id  = game_id;
    tx = this.app.wallet.signTransaction(tx);
    this.app.network.propagateTransaction(tx);

  }






  async receiveGameoverRequest(blk, tx, conf, app) {

    let sql = "UPDATE games SET state = $state, winner = $winner WHERE game_id = $game_id";
    let params = {
      $state: 'over',
      $game_id : txmsg.game_id,
      $winner  : txmsg.winner
    }
    await arcade_self.app.storage.executeDatabase(sql, params, "arcade");

  }
  sendGameoverRequest(app, data) {

    let game_module 	= "Wordblocks";
    let options		= "";
    let sig		= "";
    let created_at      = "";
    let player		= app.wallet.returnPublicKey();

    let tx = app.wallet.createUnsignedTransactionWithDefaultFee();
        tx.transaction.to.push(new saito.slip(player, 0.0));
        tx.transaction.msg.module   	= game_module;
        tx.transaction.msg.request  	= "invite";
        tx.transaction.msg.options  	= {};
        tx.transaction.msg.ts 		= created_at;
        tx.transaction.msg.sig  	= sig;
    tx = this.app.wallet.signTransaction(tx);
    this.app.network.propagateTransaction(tx);

  }


  


  webServer(app, expressapp, express) {

    super.webServer(app, expressapp, express);

    let fs = app.storage.returnFileSystem();
    if (fs != null) {

      expressapp.get('/arcade/observer/:game_id', async (req, res) => {

console.log("\n\n\n\nHERE WE ARE!");

        let sql    = "SELECT * FROM gamestate WHERE game_id = $game_id ORDER BY id DESC LIMIT 1";
        let params = { $game_id : req.params.game_id }
        let games  = await app.storage.queryDatabase(sql, params, "arcade");

        if (games.length > 0) {
          let game = games[0];
          res.setHeader('Content-type', 'text/html');
          res.charset = 'UTF-8';
console.log(JSON.stringify(game));
          res.write(game.game_state);
          res.end();
          return;
        }

      });


      expressapp.get('/arcade/keystate/:game_id/:player_pkey', async (req, res) => {

        let sql = "SELECT * FROM gamestate WHERE game_id = $game_id AND player_pkey = $playerpkey ORDER BY id DESC LIMIT 1";
        let params = {
          $game_id : req.params.game_id ,
          $playerpkey : req.params.player_pkey
        }
        let games  = await app.storage.queryDatabase(sql, params, "arcade");

        if (games.length > 0) {

          let game = games[0];
          res.setHeader('Content-type', 'text/html');
          res.charset = 'UTF-8';
          res.write(game.key_state.toString());
          res.end();
          return;

        }
      });



      expressapp.get('/arcade/restore/:game_id/:player_pkey', async (req, res) => {

        let sql    = "SELECT * FROM gamestate WHERE game_id = $game_id ORDER BY id DESC LIMIT 10";
        let params = { $game_id : req.params.game_id }
        let games  = await app.storage.queryDatabase(sql, params, "arcade");

        let stop_now = 0;
        let games_to_push = [];
        let recovering_pkey = "";

        try {
          if (req.params.player_pkey != undefined) { recovering_pkey = req.params.pkayer_pkey; }
        } catch (err) {}

        if (games.length > 0) {
          for (let z = 0; z < games.length; z++) {
            let game = games[z];
            if (game.player_pkey == recovering_pkey) { stop_now = 1; } else { games_to_push.push(game.state); }
            if (recovering_pkey == "" || stop_now == 1) { z = games.length+1; }
          }
          res.setHeader('Content-type', 'text/html');
          res.charset = 'UTF-8';
          res.write(JSON.stringify(games_to_push));
          res.end();
          return;
        }

      });

    }
  }




  //
  // reset list of games that can be accepted
  //
  onNewBlock(blk, lc) {
    if (lc == 1) {
console.log("IN ARCADE RESETTING ACCEPTED!");
      this.accepted = [];
    }
  }



  async sendPeerDatabaseRequest(dbname, tablename, select="", where="", peer=null, mycallback=null) {

    //
    // if someone is trying to accept a game, check no-one else has taken it yet
    //
    if (dbname == "arcade" && tablename == "games" && select == "is_game_already_accepted") {

      let game_id = where;
      let res = {};
          res.rows = [];

      if (this.accepted[game_id] == 1) { 
        res.rows.push({ game_still_open : 0 });
      } else {
        res.rows.push({ game_still_open : 1 });
        this.accepted[game_id] = 1;
      }

      mycallback(res);
      return;

    }

    //
    // otherwise kick into parent
    //
    super.sendPeerDatabaseRequest(dbname, tablename, select, where, peer, mycallback);

  }






  shouldAffixCallbackToModule(modname) {
    if (modname == "Arcade") { return 1; }
    for (let i = 0; i < this.affix_callbacks_to.length; i++) {
      if (this.affix_callbacks_to[i] == modname) { return 1; }
    }
    return 0;
  }

}

module.exports = Arcade;

