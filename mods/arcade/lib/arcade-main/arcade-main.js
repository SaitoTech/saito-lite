const ArcadeMainTemplate = require('./arcade-main.template');

// const ArcadeGameCarouselTemplate = require('./arcade-game-carousel/arcade-game-carousel.template');

const ArcadeGameTemplate = require('./arcade-game.template');
const ArcadeGameListRowTemplate = require('./arcade-gamelist-row.template');

const ArcadeLoader = require('./arcade-loader');
const ArcadeGameCreate = require('./arcade-game-create/arcade-game-create');


module.exports = ArcadeMain = {

  render(app, data) {

    let arcade_main = document.querySelector(".arcade-main");
    if (!arcade_main) { return; ***REMOVED***
    arcade_main.innerHTML = ArcadeMainTemplate();

    //
    // click-to-create games
    //
    let carousel = document.getElementById("arcade-carousel-slides");
    data.arcade.mods.forEach(mod => {
      let gameobj = mod.respondTo("arcade-games");
      if (gameobj != null) {
        carousel.innerHTML += ArcadeGameTemplate(mod, gameobj);
  ***REMOVED***
***REMOVED***);

    //
    // click-to-join
    //
    data.arcade.games.forEach(tx => {
      let txmsg = tx.returnMessage();
      let game_id = txmsg.game_id;
      let button_text = "JOIN";

      if (data.arcade.app.options.games != undefined) {
        for (let z = 0; z < data.arcade.app.options.games.length; z++) {
          if (data.arcade.app.options.games[z].initializing == 0) {
            button_text = "CONTINUE";
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
console.log("HERE: " + JSON.stringify(tx));
      document.querySelector('.arcade-gamelist').innerHTML += ArcadeGameListRowTemplate(app, tx, button_text);
***REMOVED***);

    if (data.arcade.glide) {
      data.arcade.glide.mount();
***REMOVED***

  ***REMOVED***,


  attachEvents(app, data) {

    //
    // create game
    //
    Array.from(document.getElementsByClassName('game')).forEach(game => {
      game.addEventListener('click', (e) => {

        data.active_game = e.currentTarget.id;

        ArcadeGameCreate.render(app, data);
        ArcadeGameCreate.attachEvents(app, data);

  ***REMOVED***);
***REMOVED***);


    //
    // join game
    //
    Array.from(document.getElementsByClassName('arcade-game-row-join')).forEach(game => {
      game.addEventListener('click', (e) => {

        let game_id = e.currentTarget.id;
	    game_id = game_id.substring(17);

        for (let i = 0; i < data.arcade.games.length; i++) {
          if (data.arcade.games[i].transaction.sig == game_id) {

	    if (data.arcade.games[i].transaction.from[0].add == app.wallet.returnPublicKey()) {
	      salert("You cannot accept your own game!");
	      return;
	***REMOVED***

    ***REMOVED***
    ***REMOVED***
    ***REMOVED***
            if (data.arcade.app.options.games != undefined) {
              if (data.arcade.app.options.games.length > 0) {
                for (let z = 0; z < data.arcade.app.options.games.length; z++) {
                  if (data.arcade.app.options.games[z].id == game_id) {
                          app.options.games[z].ts = new Date().getTime();
                          app.options.games[z].initialize_game_run = 0;
                          app.storage.saveOptions();
                          window.location = '/' + app.options.games[i].module.toLowerCase();
                    return;
              ***REMOVED***
            ***REMOVED***
          ***REMOVED***
        ***REMOVED***


	    //
	    // check with server to see if this game is taken yet
	    //
    	    data.arcade.sendPeerDatabaseRequest("arcade", "games", "is_game_already_accepted", data.arcade.games[i].id, null, function(res) {
      	      if (res.rows == undefined) { 
		console.log("ERROR 458103: cannot fetch information on whether game already accepted!");
		return;
	  ***REMOVED***
      	      if (res.rows.length > 0) {
        	if (res.rows[0].game_still_open == 1) {

		  //
		  // sanity check
		  //
console.log("CHECKING OPTIONS WHEN INVITING: " + JSON.stringify(data.arcade.games[i]));
            	  data.arcade.sendInviteRequest(app, data, data.arcade.games[i]);
            	  ArcadeLoader.render(app, data);
            	  ArcadeLoader.attachEvents(app, data);

	    ***REMOVED*** else {

		  salert("Sorry... game already accepted. Your list of open games will update shortly on next block!");

		***REMOVED***
      	  ***REMOVED***
    	***REMOVED***);

            return;
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***);
***REMOVED***);
  ***REMOVED***

***REMOVED***
