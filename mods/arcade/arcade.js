const axios = require('axios');
const saito = require('../../lib/saito/saito.js');
const ModTemplate = require('../../lib/templates/modtemplate');
const ArcadeMain = require('./lib/arcade-main/arcade-main');
const ArcadeLoader = require('./lib/arcade-main/arcade-loader');
const ArcadeLeftSidebar = require('./lib/arcade-left-sidebar/arcade-left-sidebar');
const ArcadeRightSidebar = require('./lib/arcade-right-sidebar/arcade-right-sidebar');
const ArcadeStartGameList = require('./lib/arcade-start-game-list/arcade-start-game-list');

const Header = require('../../lib/ui/header/header');


class Arcade extends ModTemplate {

  constructor(app) {

    super(app);

    this.name = "Arcade";
    this.events			= ['chat-render-request'];
    this.mods			= [];
    this.affix_callbacks_to 	= [];
    this.games			= [];
    this.observer		= [];
    this.leaderboard = [];

    this.accepted = [];

  ***REMOVED***



   receiveEvent(type, data) {
     if (type == 'chat-render-request') {
       if (this.browser_active) {
         let uidata = {***REMOVED***;
             uidata.arcade = this;
         ArcadeLeftSidebar.render(this.app, uidata);
         ArcadeLeftSidebar.attachEvents(this.app, uidata);
   ***REMOVED***
 ***REMOVED***
  ***REMOVED***


  observeGame(msg) {

    let msgobj 			= JSON.parse(this.app.crypto.base64ToString(msg));
    let address_to_watch 	= msgobj.publickey;
    let game_id 		= msgobj.game_id;
    let arcade_self		= this;

    //
    // already watching game... load it
    //
    if (this.app.options.games) {
      let { games ***REMOVED*** = this.app.options;

      for (let i = 0; i < games.length; i++) {
        if (games[i].id == game_id) {
          games[i].ts = new Date().getTime();
          this.app.storage.saveOptions();
          window.location = '/'+games[i].module.returnSlug();
          return;
    ***REMOVED***
  ***REMOVED***
***REMOVED***

    axios.get(`/arcade/observer/${game_id***REMOVED***`)
      .then(response => {
        let game = response.data;
***REMOVED***
***REMOVED*** tell peers to forward this address transactions
***REMOVED***
        this.app.keys.addWatchedPublicKey(address_to_watch);

***REMOVED***
***REMOVED*** specify observer mode only
***REMOVED***
        game.player = 0;
        if (this.app.options.games == undefined) {
          this.app.options.games = [];
    ***REMOVED***

        for (let i = 0; i < this.app.options.games.length; i++) {
          if (this.app.options.games[i].id == game.id) {
            this.app.options.games.splice(i, 1);
      ***REMOVED***
    ***REMOVED***

        this.app.options.games.push(game);
        this.app.storage.saveOptions();

***REMOVED***
***REMOVED*** move into game
***REMOVED***
        window.location = '/'+arcade_self.app.options.games[arcade_self.app.options.games.length-1].module.toLowerCase().replace(/\w/,'_');
  ***REMOVED***)
      .catch(err => console.log("ERROR 418019: error fetching game for observer mode", err));
  ***REMOVED***

  render(app, data) {

    if (this.browser_active == 0) { return; ***REMOVED***

    ArcadeMain.render(app, data);
    ArcadeMain.attachEvents(app, data);

    ArcadeLeftSidebar.render(app, data);
    ArcadeLeftSidebar.attachEvents(app, data);

    ArcadeRightSidebar.render(app, data);
    ArcadeRightSidebar.attachEvents(app, data);

  ***REMOVED***



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
***REMOVED***

    //
    // left-panel chat
    //
    x = this.app.modules.respondTo("email-chat");
    for (let i = 0; i < x.length; i++) {
      this.mods.push(x[i]);
***REMOVED***

    //
    // right-panel sidebar
    //
    x = this.app.modules.respondTo("arcade-sidebar");
    for (let i = 0; i < x.length; i++) {
      this.mods.push(x[i]);
***REMOVED***

    //
    // add my own games (as fake txs)
    //
    if (this.app.options.games != null) {

      let { games ***REMOVED*** = this.app.options;

      games.forEach(game => {
        let game_tx = new saito.transaction();

***REMOVED***
***REMOVED*** ignore games that are over
***REMOVED***
        if (game.over) return;

        if (game.players) {
          game_tx.transaction.to = game.players.map(player => new saito.slip(player));
          game_tx.transaction.from = game.players.map(player => new saito.slip(player));
    ***REMOVED*** else {
          game_tx.transaction.from.push(new saito.slip(this.app.wallet.returnPublicKey()));
          game_tx.transaction.to.push(new saito.slip(this.app.wallet.returnPublicKey()));
    ***REMOVED***

        let msg = {
          request: "loaded",
          game: game.module,
          game_id: game.id,
          options: game.options,
          players_needed: game.players_needed,
    ***REMOVED***

        game_tx.transaction.sig = game.id;
        game_tx.transaction.msg = msg;

        this.addGameToOpenList(game_tx);
  ***REMOVED***);
***REMOVED***
  ***REMOVED***


  initializeHTML(app) {

    let data = {***REMOVED***;
    data.arcade = this;


    Header.render(app, data);
    Header.attachEvents(app, data);

    this.render(app, data);

    // let perView = this.app.browser.isMobileBrowser(navigator.userAgent) ? 1 : 3;

    // Use for Carousel
    /*
    if (typeof window !== "undefined") {
      importGlide = async () => {
        const Glide = await import('./lib/glide/glide.min.js');
        this.glide = new Glide.default('.glide', {
          type: 'carousel',
          autoplay: 3000,
          perView,
    ***REMOVED***);

        this.glide.mount();
  ***REMOVED***
      importGlide();
***REMOVED***
    */
  ***REMOVED***


  //
  // load transactions into interface when the network is up
  //
  onPeerHandshakeComplete(app, peer) {

    if (this.browser_active == 0) { return; ***REMOVED***

    let arcade_self = this;

    //
    // load open games from server
    //
    this.sendPeerDatabaseRequest("arcade", "games", "*", "status = 'open'", null, (res, data) => {
      if (res.rows) {
        res.rows.forEach(row => {
          let tx = new saito.transaction(JSON.parse(row.tx));

          tx.transaction.msg.players_needed = row.players_needed;
          tx.transaction.msg.players_available = row.players_available;
          tx.transaction.msg.players_array = row.players_array;

console.log("ADDING OPEN GAME FROM SERVER: " + JSON.stringify(tx.transaction));
          this.addGameToOpenList(tx);
    ***REMOVED***);

  ***REMOVED***
***REMOVED***);


    //
    // load active games for observer mode
    //
    this.sendPeerDatabaseRequest(
      "arcade",
      "gamestate",
      "DISTINCT game_id, module, player, players_array",
      "1 = 1 GROUP BY game_id ORDER BY last_move DESC LIMIT 50",
      null,
      (res) => {
      if (res.rows) {
console.log("ACTIVE OBSERVER GAMES:" + JSON.stringify(res.rows));
        res.rows.forEach(row => {
          let { game_id, module, players_array, player ***REMOVED*** = row;
          this.addGameToObserverList({
            game_id,
            module,
            players_array,
            publickey,
      ***REMOVED***);
    ***REMOVED***);
  ***REMOVED***
***REMOVED***);

    // select winner, sum(score), module from leaderboard group by winner
    // SELECT winner, sum(score), module FROM leaderboard GROUP by winner ORDER BY score DESC LIMIT 10
    let message = {***REMOVED***;
    message.request = "arcade leaderboard list";
    message.data = {***REMOVED***;

    this.app.network.sendRequestWithCallback(message.request, message.data, (res) => {
      res.rows.forEach(row => this.addWinnerToLeaderboard(row));
***REMOVED***)


  ***REMOVED***


  addGameToObserverList(msg) {

    for (let i = 0; i < this.observer.length; i++) {
      if (msg.game_id == this.observer[i].game_id) {
        return;
  ***REMOVED***
***REMOVED***
    this.observer.push(msg);

    let data = {***REMOVED***;
    data.arcade = this;

    if (this.browser_active == 1) {
      ArcadeRightSidebar.render(this.app, data);
      ArcadeRightSidebar.attachEvents(this.app, data);
***REMOVED***
  ***REMOVED***

  addWinnerToLeaderboard(msg) {
    this.leaderboard.push(msg);

    let data = {***REMOVED***;
    data.arcade = this;

    if (this.browser_active == 1) {
      ArcadeRightSidebar.render(this.app, data);
      ArcadeRightSidebar.attachEvents(this.app, data);
***REMOVED***
  ***REMOVED***


  addGameToOpenList(tx) {

    let txmsg = tx.returnMessage();

    for (let i = 0; i < this.games.length; i++) {
      if (this.games[i].transaction.sig == tx.transaction.sig) { 
console.log("QUITTING A: " + this.games[i].transaction.options);
        return;
  ***REMOVED***
      if (txmsg.game_id == this.games[i].transaction.sig) {
console.log("QUITTING B: " + this.games[i].transaction.options);
        return;
  ***REMOVED***
***REMOVED***

console.log("PUSHING BACK: " + JSON.stringify(tx.transaction));

    this.games.unshift(tx);

    let data = {***REMOVED***;
    data.arcade = this;

    if (this.browser_active == 1) {
      ArcadeMain.render(this.app, data);
      ArcadeMain.attachEvents(this.app, data);
***REMOVED***
  ***REMOVED***

  removeGameFromOpenList(tx) {
    this.games = this.games.filter(game => game.transaction.sig == tx.transaction.sig);

    let data = {***REMOVED***;
    data.arcade = this;

    if (this.browser_active == 1) {
      ArcadeMain.render(this.app, data);
      ArcadeMain.attachEvents(this.app, data);
***REMOVED***
  ***REMOVED***


  async onConfirmation(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();
    // let arcade_self = app.modules.returnModule("Arcade");

    if (conf == 0) {

      //
      // open msgs -- prolifigate
      //
      if (txmsg.module == "Arcade" && txmsg.request == "open") {
        this.addGameToOpenList(tx);
        this.receiveOpenRequest(blk, tx, conf, app);
  ***REMOVED***

      //
      // cancel open games
      //
      if (txmsg.module == "Arcade" && txmsg.request == "close") {
        this.removeGameFromOpenList(tx);
        this.receiveCloseRequest(blk, tx, conf, app);
  ***REMOVED***

      //
      // save state -- also prolifigate
      //
      if (txmsg.game_state != undefined && txmsg.game_id != "") {
        this.saveGameState(blk, tx, conf, app);
  ***REMOVED***




      // invites
      if (txmsg.request == "invite") {
console.log("ARCADE GETS INVITE REQUEST");


***REMOVED***
***REMOVED*** this might be a server, in which cse it doesn't have options.games
***REMOVED***
        if (this.app.options != undefined) {
          if (this.app.options.games != undefined) {
            for (let i = 0; i < this.app.options.games.length; i++) {
              if (this.app.options.games[i].id == txmsg.game_id) {
                if (this.app.options.games[i].initializing == 0) { return; ***REMOVED***
            ***REMOVED***
          ***REMOVED***
      ***REMOVED***
    ***REMOVED***
console.log("ARCADE PROCESSING RECEIVE INVITE REQUEST");
        this.receiveInviteRequest(blk, tx, conf, app);
  ***REMOVED***


      //
      // ignore msgs for others
      //
      // if (!tx.isTo(app.wallet.returnPublicKey())) { return; ***REMOVED***


      // acceptances
      if (txmsg.request === "accept") {

console.log("ARCADE GETS ACCEPT MESSAGE: " + txmsg.request);
console.log("i am " + app.wallet.returnPublicKey());
console.log("TX: " + JSON.stringify(tx.transaction));
console.log("MSG: " + txmsg);

***REMOVED***
***REMOVED*** multiplayer games might hit here without options.games
***REMOVED*** in which case we need to import game details including
***REMOVED*** options, etc.
***REMOVED***

        if (this.app.BROWSER == 1) {
          for (let i = 0; i < this.app.options.games.length; i++) {
            if (this.app.options.games[i].id == txmsg.game_id) {
  
  console.log("GAME NO LONGER INITIALIZING!");
  
              if (this.app.options.games[i].initializing == 0) { 
  
        ***REMOVED***
        ***REMOVED*** is this old? exit
        ***REMOVED***
                let currentTime = new Date().getTime();
                if ((currentTime-this.app.options.games[i].ts) > 2000) {
  console.log(currentTime + " ------- " + this.app.options.games[i].ts);
                  return;
            ***REMOVED***
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***

console.log("... still here... receive accept request!");
        await this.receiveAcceptRequest(blk, tx, conf, app);

console.log("\n\n\nlaunching request to launch game... flag button, etc.");

        this.launchGame(txmsg.game_id);
  ***REMOVED***

      // game over
      if (txmsg.request == "gameover") {
        this.receiveGameoverRequest(blk, tx, conf, app);
  ***REMOVED***
***REMOVED***
  ***REMOVED***

  async handlePeerRequest(app, message, peer, mycallback=null) {
    super.handlePeerRequest(app, message, peer, mycallback);

    switch(message.request) {
      case 'arcade leaderboard list':
        let sql = `
        SELECT winner, sum(score) as highscore, module FROM leaderboard
        GROUP by winner, module
        ORDER BY highscore
        DESC LIMIT 10`;

        let rows = await this.app.storage.queryDatabase(sql, {***REMOVED***, 'arcade');
        mycallback({rows***REMOVED***);
        break;
***REMOVED***
  ***REMOVED***

  launchGame(game_id) {

    if (this.browser_active == 0) { return; ***REMOVED***

    let arcade_self = this;

    arcade_self.is_initializing = true;

    arcade_self.initialization_timer = setInterval(() => {

      let game_idx = -1;
      if (arcade_self.app.options.games != undefined) {
        for (let i = 0; i < arcade_self.app.options.games.length; i++) {
          if (arcade_self.app.options.games[i].id == game_id) {
            game_idx = i;
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***

      if (game_idx == -1) { return; ***REMOVED***

      if (arcade_self.app.options.games[game_idx].initializing == 0) {

        clearInterval(arcade_self.initialization_timer);

        let data = {***REMOVED***;
            data.arcade   = arcade_self;
            data.game_id  = game_id;

        ArcadeLoader.render(arcade_self.app, data);
        ArcadeLoader.attachEvents(arcade_self.app, data);

  ***REMOVED***
***REMOVED***, 1000);

  ***REMOVED***



  async saveGameState(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();

    let game_state = "";
    let key_state  = "";

    if (txmsg.game_state != "") { game_state = txmsg.game_state; ***REMOVED***
    if (txmsg.key_state != "") { key_state = txmsg.key_state; ***REMOVED***

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
      if (!x.includes(txto[z].add)) { x.push(txto[z].add); ***REMOVED***
***REMOVED***
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
    ***REMOVED***;
    await app.storage.executeDatabase(sql, params, "arcade");

  ***REMOVED***





  async receiveOpenRequest(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();

    let module 			= txmsg.game;
    let player			= tx.transaction.from[0].add;
    let game_id			= tx.transaction.sig;
    let players_needed		= 2;
    if (txmsg.players_needed > 2) { players_needed = txmsg.players_needed; ***REMOVED***
    let options			= {***REMOVED***;
    if (txmsg.options != undefined) { options = txmsg.options; ***REMOVED***
    let start_bid		= blk.block.id;
    let valid_for_minutes	= 60;
    let created_at		= parseInt(tx.transaction.ts);
    let expires_at 		= created_at + (60000 * parseInt(valid_for_minutes));
    let players_array           = player;

    let sql = `INSERT INTO games (
                  player ,
                  players_needed ,
                  players_accepted ,
                  players_array ,
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
                $players_needed ,
                  $players_accepted ,
                  $players_array ,
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
                $players_needed     : players_needed ,
                $players_accepted   : 0 ,
                $players_array      : players_array ,
                $module     : module ,
                $game_id    : game_id ,
                 $status	    : "open" ,
                $options    : options ,
                $tx         : JSON.stringify(tx.transaction) ,
                $start_bid  : blk.block.id ,
                $created_at : created_at ,
                $expires_at : expires_at
          ***REMOVED***;
    await app.storage.executeDatabase(sql, params, "arcade");
    return;

  ***REMOVED***

  sendOpenRequest(app, data, gamedata) {
    let tx = this.createOpenTransaction(gamedata);
    this.app.network.propagateTransaction(tx);
  ***REMOVED***

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
        tx.transaction.msg.options_html 	= gamedata.options_html;
        tx.transaction.msg.players_needed 	= gamedata.players_needed;
        tx.transaction.msg.accept_sig 		= accept_sig;
        tx.transaction.msg.players  		= [];
        tx.transaction.msg.players.push(this.app.wallet.returnPublicKey());
    tx = this.app.wallet.signTransaction(tx);

    return tx;

  ***REMOVED***

  async receiveCloseRequest(blk, tx, conf, app) {
    let txmsg = tx.returnMessage();
    let sql = `UPDATE games SET status = $status WHERE game_id = $game_id`
    let params = { $status: 'close', $game_id: txmsg.sig ***REMOVED***;
    let resp = await app.storage.executeDatabase(sql, params, "arcade");
  ***REMOVED***



  async receiveInviteRequest(blk, tx, conf, app) {

    //
    // servers
    //
    let txmsg = tx.returnMessage();

    let unique_keys = [];
    for (let i = 0; i < tx.transaction.to.length; i++) {
      if (!unique_keys.includes(tx.transaction.to[i].add)) {
        unique_keys.push(tx.transaction.to[i].add);
  ***REMOVED***
***REMOVED***
    unique_keys.sort();
    let players_array = unique_keys.join("_");
    let sql = "UPDATE games SET players_accepted = "+unique_keys.length+", players_array = $players_array WHERE status = $status AND game_id = $game_id";
    let params = {
      $players_array : players_array ,
      $status : 'open',
      $game_id : txmsg.game_id 
***REMOVED***
    await this.app.storage.executeDatabase(sql, params, "arcade");


    //
    // servers nope out
    //
    if (this.browser_active == 0) { return; ***REMOVED***

    //
    // auto-accept
    //
    this.accepted[txmsg.sig] = 1;


    //
    // browsers
    //
    let opponent = tx.transaction.from[0].add;
    let invitee  = tx.transaction.to[0].add;

    //
    //
    //
    if (this.app.options.games != undefined) {
      for (let i = 0; i < this.app.options.games.length; i++) {
        if (this.app.options.games[i].id == txmsg.game_id) {
          this.app.options.games[i].options = txmsg.options;
          this.app.storage.saveOptions();
    ***REMOVED***
  ***REMOVED***
***REMOVED***


    data = {***REMOVED***;
    data.arcade = this;

  ***REMOVED***

  sendInviteRequest(app, data, opentx) {
    let tx = this.createInviteTransaction(app, data, opentx);
    this.app.network.propagateTransaction(tx);
  ***REMOVED***

  createInviteTransaction(app, data, gametx) {

    let txmsg = gametx.returnMessage();

    let tx = app.wallet.createUnsignedTransactionWithDefaultFee();
        tx.transaction.to.push(new saito.slip(gametx.transaction.from[0].add, 0.0));
        tx.transaction.to.push(new saito.slip(app.wallet.returnPublicKey(), 0.0));
        tx.transaction.msg.ts   	= "";
        tx.transaction.msg.module   	= txmsg.game;
        tx.transaction.msg.request  	= "invite";
        tx.transaction.msg.game_id	= gametx.transaction.sig;
        tx.transaction.msg.players_needed 	= txmsg.players_needed;
        tx.transaction.msg.options  	= txmsg.options;
        tx.transaction.msg.accept_sig   = "";
        if (gametx.transaction.msg.accept_sig != "") { 
          tx.transaction.msg.accept_sig   = gametx.transaction.msg.accept_sig;
    ***REMOVED***
        if (gametx.transaction.msg.ts != "") { 
          tx.transaction.msg.ts   = gametx.transaction.msg.ts;
    ***REMOVED***
        tx.transaction.msg.invite_sig   = app.crypto.signMessage(("invite_game_"+tx.transaction.msg.ts), app.wallet.returnPrivateKey());
    tx = this.app.wallet.signTransaction(tx);

    return tx;

  ***REMOVED***







  async receiveAcceptRequest(blk, tx, conf, app) {

    if (this.browser_active == 1) {
      let data = {***REMOVED***;
      data.arcade = this;
      ArcadeLoader.render(app, data);
      ArcadeLoader.attachEvents(app, data);
***REMOVED***

    let txmsg = tx.returnMessage();
    let publickeys = tx.transaction.to.map(slip => slip.add);
    let removeDuplicates = (names) => names.filter((v,i) => names.indexOf(v) === i)
    let unique_keys = removeDuplicates(publickeys);
    unique_keys.sort();
    let players_array = unique_keys.join("_"); 

    let sql = "UPDATE games SET players_accepted = (players_accepted+1), players_array = $players_array WHERE status = $status AND game_id = $game_id";
    let params = {
      $players_array : players_array ,
      $state : 'open',
      $game_id : txmsg.game_id
***REMOVED***

    try {
      let resp = await this.app.storage.executeDatabase(sql, params, "arcade"); 
***REMOVED*** catch (err) {
      console.log(err);
***REMOVED***

    sql = "UPDATE games SET status = 'active' WHERE status = $status AND players_accepted >= players_needed AND game_id = $game_id";
    params = {
      $status : 'open',
      $game_id : txmsg.game_id
***REMOVED***

console.log("about to await execut db");
console.log(sql);
console.log(params);

    try {
      let resp = await this.app.storage.executeDatabase(sql, params, "arcade");
***REMOVED*** catch (err) {
      console.log(err);
***REMOVED***

console.log("done now...");

  ***REMOVED***



  launchSinglePlayerGame(app, data, gameobj) {

    //
    //
    window.location = '/'+gameobj.slug;
    return;

  ***REMOVED***

  sendMultiplayerAcceptRequest(app, data, gameobj) {

console.log("SEND MULTIPLE ACCEPT: " + JSON.stringify(gameobj));

    let txmsg = gameobj.transaction.msg;
    let players_array = txmsg.players_array;
    let players_needed = txmsg.players_needed;
    let game_id = gameobj.transaction.sig;
    let options = txmsg.options;
    let opponents = players_array.split("_");
    let game_self = app.modules.returnModule(txmsg.game);

console.log("LOADED THE GAME: " + txmsg.game);

    //
    // create the game
    //
    game_self.loadGame(game_id);
    for (let i = 0; i < opponents.length; i++) {
      game_self.addPlayer(opponents[i]);
***REMOVED***
    game_self.game.players_needed = players_needed;

    //
    // GAME LIBRARY ACCEPT CREATES GAMES AS WELL
    // if this code is updated, update the 
    // SAGE receiveInvite code
    //
    game_self.game.module = txmsg.module;
    game_self.game.options = options;
    game_self.game.id = game_id;
    game_self.game.accept = 1;
    game_self.saveGame(game_id);


    let tx = app.wallet.createUnsignedTransactionWithDefaultFee();
        for (let i = 0; i < opponents.length; i++) { tx.transaction.to.push(new saito.slip(opponents[i], 0.0)); ***REMOVED***
        tx.transaction.to.push(new saito.slip(this.app.wallet.returnPublicKey(), 0.0));
***REMOVED***
***REMOVED*** arcade will listen, but we need game engine to receive to start initialization
***REMOVED***
        tx.transaction.msg.module   = txmsg.game;
        tx.transaction.msg.request  = "accept";
        tx.transaction.msg.multiple  = 1;
        tx.transaction.msg.game = txmsg.game;
        tx.transaction.msg.options = options;
        tx.transaction.msg.game_id  = game_id;
        opponents.push(this.app.wallet.returnPublicKey());
        tx.transaction.msg.players_array = opponents.join("_");
        tx.transaction.msg.players_needed = players_needed;
    tx = this.app.wallet.signTransaction(tx);
    this.app.network.propagateTransaction(tx);

  ***REMOVED***

  async receiveGameoverRequest(blk, tx, conf, app) {
    //
    // we want to update the game, and also give the winner points
    //
    let txmsg = tx.returnMessage();
    let sql = "UPDATE games SET status = $status, winner = $winner WHERE game_id = $game_id";
    let params = {
      $status: 'over',
      $game_id : txmsg.game_id,
      $winner  : txmsg.winner
***REMOVED***
    await this.app.storage.executeDatabase(sql, params, "arcade");

    // module	TEXT,
    // game_id	TEXT,
    // tx		TEXT,
    // bid	INTEGER,
    // bsh TEXT,
    // created_at 	INTEGER,
    // expires_at 	INTEGER,
    // winner 	TEXT,

    sql = `INSERT INTO leaderboard (module, game_id, winner, score, tx, bid, bsh, timestamp, sig)
    VALUES ($module, $game_id, $winner, $score, $tx, $bid, $bsh, $timestamp, $sig)`;
    params = {
      $module: txmsg.module,
      $game_id: txmsg.game_id,
      $winner: txmsg.winner,
      $score: 50,
      $tx: JSON.stringify(tx.transaction),
      $bid: blk.block.id,
      $bsh: blk.returnHash(),
      $timestamp: tx.transaction.ts,
      $sig: tx.transaction.sig
***REMOVED***

    await this.app.storage.executeDatabase(sql, params, "arcade");

  ***REMOVED***

  //
  // ????
  //
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
        tx.transaction.msg.options  	= {***REMOVED***;
        tx.transaction.msg.ts 		= created_at;
        tx.transaction.msg.sig  	= sig;
    tx = this.app.wallet.signTransaction(tx);
    this.app.network.propagateTransaction(tx);

  ***REMOVED***


  webServer(app, expressapp, express) {

    super.webServer(app, expressapp, express);

    let fs = app.storage.returnFileSystem();
    if (fs != null) {

      expressapp.get('/arcade/observer/:game_id', async (req, res) => {

console.log("\n\n\n\nHERE WE ARE!");

        let sql    = "SELECT * FROM gamestate WHERE game_id = $game_id ORDER BY id DESC LIMIT 1";
        let params = { $game_id : req.params.game_id ***REMOVED***
        let games  = await app.storage.queryDatabase(sql, params, "arcade");

        if (games.length > 0) {
          let game = games[0];
          res.setHeader('Content-type', 'text/html');
          res.charset = 'UTF-8';
console.log(JSON.stringify(game));
          res.write(game.game_state);
          res.end();
          return;
    ***REMOVED***

  ***REMOVED***);


      expressapp.get('/arcade/keystate/:game_id/:player_pkey', async (req, res) => {

        let sql = "SELECT * FROM gamestate WHERE game_id = $game_id AND player_pkey = $playerpkey ORDER BY id DESC LIMIT 1";
        let params = {
          $game_id : req.params.game_id ,
          $playerpkey : req.params.player_pkey
    ***REMOVED***
        let games  = await app.storage.queryDatabase(sql, params, "arcade");

        if (games.length > 0) {

          let game = games[0];
          res.setHeader('Content-type', 'text/html');
          res.charset = 'UTF-8';
          res.write(game.key_state.toString());
          res.end();
          return;

    ***REMOVED***
  ***REMOVED***);



      expressapp.get('/arcade/restore/:game_id/:player_pkey', async (req, res) => {

        let sql    = "SELECT * FROM gamestate WHERE game_id = $game_id ORDER BY id DESC LIMIT 10";
        let params = { $game_id : req.params.game_id ***REMOVED***
        let games  = await app.storage.queryDatabase(sql, params, "arcade");

        let stop_now = 0;
        let games_to_push = [];
        let recovering_pkey = "";

***REMOVED***
          if (req.params.player_pkey != undefined) { recovering_pkey = req.params.pkayer_pkey; ***REMOVED***
    ***REMOVED*** catch (err) {***REMOVED***

        if (games.length > 0) {
          for (let z = 0; z < games.length; z++) {
            let game = games[z];
            if (game.player_pkey == recovering_pkey) { stop_now = 1; ***REMOVED*** else { games_to_push.push(game.state); ***REMOVED***
            if (recovering_pkey == "" || stop_now == 1) { z = games.length+1; ***REMOVED***
      ***REMOVED***
          res.setHeader('Content-type', 'text/html');
          res.charset = 'UTF-8';
          res.write(JSON.stringify(games_to_push));
          res.end();
          return;
    ***REMOVED***

  ***REMOVED***);

***REMOVED***
  ***REMOVED***




  //
  // reset list of games that can be accepted
  //
  onNewBlock(blk, lc) {
    if (lc == 1) {
      this.accepted = [];
***REMOVED***
  ***REMOVED***



  async sendPeerDatabaseRequest(dbname, tablename, select="", where="", peer=null, mycallback=null) {

    //
    // if someone is trying to accept a game, check no-one else has taken it yet
    //
    if (dbname == "arcade" && tablename == "games" && select == "is_game_already_accepted") {

      let game_id = where;
      let res = {***REMOVED***;
          res.rows = [];

      if (this.accepted[game_id] == 1) { 
        res.rows.push({ game_still_open : 0 ***REMOVED***);
  ***REMOVED*** else {
        res.rows.push({ game_still_open : 1 ***REMOVED***);
        this.accepted[game_id] = 1;
  ***REMOVED***

      mycallback(res);
      return;

***REMOVED***

    //
    // otherwise kick into parent
    //
    super.sendPeerDatabaseRequest(dbname, tablename, select, where, peer, mycallback);

  ***REMOVED***

  shouldAffixCallbackToModule(modname) {
    if (modname == "Arcade") { return 1; ***REMOVED***
    for (let i = 0; i < this.affix_callbacks_to.length; i++) {
      if (this.affix_callbacks_to[i] == modname) { return 1; ***REMOVED***
***REMOVED***
    return 0;
  ***REMOVED***

  updateBalance() {
    if (this.browser_active) {
      let balance = this.app.wallet.returnBalance();
      document.querySelector('.saito-balance').innerHTML = balance + " SAITO";
***REMOVED***
  ***REMOVED***

***REMOVED***

module.exports = Arcade;

