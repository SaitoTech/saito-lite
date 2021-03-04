const ArcadeMainTemplate = require('./templates/arcade-main.template');
const ArcadeContainerTemplate = require('./templates/arcade-container.template');
const ArcadePosts = require('./arcade-posts');
const ArcadeInfobox = require('./arcade-infobox');
const GameLoader = require('./../arcade-game/game-loader');
const SaitoCarousel = require('./../../../../lib/saito/ui/saito-carousel/saito-carousel');
const ArcadeGameDetails = require('./../arcade-game/arcade-game-details');
const ArcadeInviteTemplate = require('./templates/arcade-invite.template');
const ArcadeObserveTemplate = require('./templates/arcade-observe.template');


let tabNames = ["arcade", "observables", "tournaments"];
module.exports = ArcadeMain = {

  render(app, mod) {

    //
    // avoid rendering over inits
    //
    if (mod.viewing_arcade_initialization_page == 1) { return; }


    //
    // purge existing content
    //
    if (document.getElementById("arcade-main")) { document.getElementById("arcade-main").destroy(); }

    //
    // put active games first
    //
    let whereTo = 0;
    for (let i = 0; i < mod.games.length; i++) {
      if (mod.isMyGame(mod.games[i], app)) {
        mod.games[i].isMine = true;
        let replacedGame = mod.games[whereTo];
        mod.games[whereTo] = mod.games[i];
        mod.games[i] = replacedGame;
        whereTo++;
      } else {
        mod.games[i].isMine = false;
      }
    }

    //
    // add parent wrapping class
    //
    if (!document.getElementById("arcade-container")) { app.browser.addElementToDom(ArcadeContainerTemplate(app, mod)); }
    if (!document.querySelector(".arcade-main")) { app.browser.addElementToDom(ArcadeMainTemplate(app, mod), "arcade-container"); }

    //
    // add tabs
    //
    tabNames.forEach((tabButtonName, i) => {
      document.querySelector("#tab-button-" + tabButtonName).onclick = () => {
        app.browser.logMatomoEvent("Arcade", "ArcadeTabNavigationClick", tabButtonName);
        tabNames.forEach((tabName, i) => {
          if (tabName === tabButtonName) {
            document.querySelector("#" + tabName + "-hero").classList.remove("arcade-tab-hidden");
            document.querySelector("#tab-button-" + tabName).classList.add("active-tab-button");
          } else {
            document.querySelector("#" + tabName + "-hero").classList.add("arcade-tab-hidden");
            document.querySelector("#tab-button-" + tabName).classList.remove("active-tab-button");
          }
        });
      }
    });


    //
    // add games
    //
    if (document.querySelector('.arcade-hero')) {
      mod.games.forEach((invite, i) => {
        app.browser.addElementToElement(ArcadeInviteTemplate(app, mod, invite, i), document.querySelector('.arcade-hero'));
      });
      mod.observer.forEach((observe, i) => {
        app.browser.addElementToElement(ArcadeObserveTemplate(app, mod, observe, i, app.crypto.stringToBase64(JSON.stringify(observe))), document.querySelector('.observables-hero'));
      });
    }

    //
    // observer mode actions
    //
    document.querySelectorAll(`.observe-game-btn`).forEach((el, i) => {
        el.onclick = function (e) {

          let game_obj = e.currentTarget.getAttribute("data-gameobj");
          let game_cmd = e.currentTarget.getAttribute("data-cmd");

          if (game_cmd === "watch") {
            arcade_main_self.observeGame(app, mod, game_obj);
            return;
          }

        }
    });



    //
    // game invitation actions
    //
    let arcade_main_self = this;
    mod.games.forEach((invite, i) => {
      try{
        document.querySelectorAll(`#invite-${invite.transaction.sig} .invite-tile-button`).forEach((el, i) => {
          el.onclick = function (e) {

            let game_sig = e.currentTarget.getAttribute("data-sig");
            let game_cmd = e.currentTarget.getAttribute("data-cmd");
            app.browser.logMatomoEvent("Arcade", "ArcadeAcceptInviteButtonClick", game_cmd);
            if (game_cmd === "delete") {
              arcade_main_self.deleteGame(app, mod, game_sig);
              return;
            }

            if (game_cmd === "cancel") {
              arcade_main_self.cancelGame(app, mod, game_sig);
              return;
            }

            if (game_cmd === "join") {
              arcade_main_self.joinGame(app, mod, game_sig);
              return;
            }

            if (game_cmd === "continue") {
              arcade_main_self.continueGame(app, mod, game_sig);
              return;
            }

          }
        });	
      } catch(err){}
    });

    ArcadePosts.render(app, mod);
    ArcadeInfobox.render(app, mod);
    if (mod.games.length == 0) {
      let carousel = new SaitoCarousel(app);
      carousel.render(app, mod, "arcade", "arcade-hero");
    }


    //
    // fetch any usernames needed
    //
    app.browser.addIdentifiersToDom();

    //
    //
    //
    try {
      if (app.browser.isSupportedBrowser(navigator.userAgent) == 0) {
        document.querySelector('.alert-banner').style.display = "block";
      }
    } catch (err) {}

  },


  attachEvents(app, mod) {

  },


  joinGame(app, mod, game_id) {

    let accepted_game = null;
    mod.games.forEach((g) => { if (g.transaction.sig === game_id) { accepted_game = g; } });

    if (!accepted_game) { console.log("ERR: game not found"); return; }

    //
    // not enough players? join not accept
    //
    let players_needed = parseInt(accepted_game.msg.players_needed);
    let players_available = accepted_game.msg.players.length;
    if (players_needed > (players_available + 1)) {
      let newtx = mod.createJoinTransaction(accepted_game);
      app.network.propagateTransaction(newtx);
      mod.joinGameOnOpenList(newtx);
      salert("Joining game! Please wait a moment");
      return;
    }


    //
    // enough players, so "accept" to kick off
    //
    if (accepted_game.transaction.from[0].add == app.wallet.returnPublicKey()) {
      let { players } = accepted_game.returnMessage();
      if (players.length > 1) {
        salert(`You created this game! Waiting for enough players to join we can start...`);
      }
    } else {

      //
      // we are going to send a message to accept this game, but first check if we have
      // already done this, in which case we will have the game loaded in our local games list
      //
      if (app.options.games) {

        let existing_game = app.options.games.find(g => g.id == game_id);

        if (existing_game != -1 && existing_game) {
          if (existing_game.initializing == 1) {

            salert("Accepted Game! It may take a minute for your browser to update -- please be patient!");

            GameLoader.render(app, data);
            GameLoader.attachEvents(app, data);

            return;

          } else {

            //
            // game exists, so "continue" not "join"
            //
            existing_game.ts = new Date().getTime();
            existing_game.initialize_game_run = 0;
            app.storage.saveOptions();
            window.location = '/' + existing_game.module.toLowerCase();
            return;
          }
        }
      }

      //
      // ready to go? check with server game is not taken
      //
      mod.sendPeerRequestWithFilter(

        () => {
          let msg = {};
          msg.request = 'rawSQL';
          msg.data = {};
          msg.data.module = "Arcade";
          msg.data.sql = `SELECT is_game_already_accepted FROM games WHERE game_id = "${game_id}"`;
          msg.data.game_id = game_id;
          return msg;
        },

        (res) => {

          if (res.rows == undefined) {
            console.log("ERROR 458103: cannot fetch information on whether game already accepted!");
            return;
          }

          if (res.rows.length > 0) {
            if (res.rows[0].game_still_open == 1 || (res.rows[0].game_still_open == 0 && players_needed > 2)) {

              //
              // data re: game in form of tx
              //
              let { transaction } = accepted_game;
              let game_tx = Object.assign({ msg: { players_array: null } }, transaction);

              salert("Game accepted - please wait");
              let newtx = mod.createAcceptTransaction(accepted_game);
              mod.app.network.propagateTransaction(newtx);

              GameLoader.render(app, mod);
              GameLoader.attachEvents(app, mod);

              return;

            } else {
              salert("Sorry, this game has been accepted already!");
            }
          } else {
            salert("Sorry, this game has already been accepted!");
          }
        }
      );

    }

  },


  continueGame(app, mod, game_id) {

    let existing_game = app.options.games.find(g => g.id == game_id);

    if (existing_game != -1 && existing_game) {
      if (existing_game.initializing == 1) {

        salert("Accepted Game! It may take a minute for your browser to update -- please be patient!");

        GameLoader.render(app, data);
        GameLoader.attachEvents(app, data);

        return;

      } else {

        //
        // game exists, so "continue" not "join"
        //
        existing_game.ts = new Date().getTime();
        existing_game.initialize_game_run = 0;
        app.storage.saveOptions();
        window.location = '/' + existing_game.module.toLowerCase();
        return;

      }
    }
  },


  cancelGame(app, mod, game_id) {

    let sig = game_id;
    var testsig = "";
    let players = [];

    if (app.options.games) {
      for (let i = 0; i < app.options.games.length; i++) {
        if (typeof (app.options.games[i].transaction) != 'undefined') {
          testsig = app.options.games[i].transaction.sig;
        } else if (typeof (app.options.games[i].id) != 'undefined') {
          testsig = app.options.games[i].id;
        }
        if (testsig == sig) {
          app.options.games[i].over = 1;
          players = app.options.games[i].players;
          app.options.games.splice(i, 1);
          app.storage.saveOptions();
        }
      }
    }

    let newtx = app.wallet.createUnsignedTransactionWithDefaultFee();
    let my_publickey = app.wallet.returnPublicKey();

    for (let i = 0; i < players.length; i++) { if (players[i] != my_publickey) newtx.transaction.to.push(app.wallet.createSlip(players[i])); }

    let msg = {
      sig: sig,
      status: 'close',
      request: 'close',
      winner: players[0] == my_publickey ? players[1] : players[0],
      module: 'Arcade'
    }

    newtx.msg = msg;
    newtx = app.wallet.signTransaction(newtx);
    app.network.propagateTransaction(newtx);

    this.removeGameFromList(sig);
  },


  deleteGame(app, mod, game_id) {

    salert(`Delete game id: ${game_id}`);

    if (app.options.games) {
      let { games } = app.options;
      for (let i = 0; i < app.options.games.length; i++) {
        if (app.options.games[i].id == game_id) {

          let resigned_game = app.options.games[i];

          if (resigned_game.over == 0) {
            let game_mod = app.modules.returnModule(resigned_game.module);
            game_mod.resignGame(game_id);
          } else {
            //
            // removing game someone else ended
            //
            app.options.games[i].over = 1;
            app.options.games[i].last_block = app.blockchain.last_bid;
            app.storage.saveOptions();
          }
        }
      }
      this.removeGameFromList(game_id);
    }
  },


  observeGame(app, mod, encryptedgamejson) {
console.log("ABOUT TO JOIN GAME");
    mod.observeGame(encryptedgamejson);
  },


  removeGameFromList(game_id) {
    document.getElementById(`arcade-hero`).removeChild(document.getElementById(`invite-${game_id}`));
  }

}
