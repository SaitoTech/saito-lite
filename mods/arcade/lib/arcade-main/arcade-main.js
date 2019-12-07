const ArcadeMainTemplate = require('./arcade-main.template');

// const ArcadeGameCarouselTemplate = require('./arcade-game-carousel/arcade-game-carousel.template');

const ArcadeGameTemplate = require('./arcade-game.template');
const ArcadeGameListRowTemplate = require('./arcade-gamelist-row.template');

const ArcadeLoader = require('./arcade-loader');
const ArcadeGameCreate = require('./arcade-game-create/arcade-game-create');


module.exports = ArcadeMain = {

  render(app, data) {

    let arcade_main = document.querySelector(".arcade-main");
    if (!arcade_main) { return; }
    arcade_main.innerHTML = ArcadeMainTemplate();

    //
    // click-to-Create Games
    //
    //let carousel = document.getElementById("arcade-carousel-slides");
    //data.arcade.mods.forEach(mod => {
    //  let gameobj = mod.respondTo("arcade-games");
    //  if (gameobj != null) {
    //    carousel.innerHTML += ArcadeGameTemplate(mod, gameobj);
    //  }
    //});

    //
    // click-to-join
    //
    data.arcade.games.forEach(tx => {

      let txmsg = tx.returnMessage();
      let publickey = app.wallet.returnPublicKey();
      let { game_id } = txmsg;

      let button_text = {};
      button_text.join = "JOIN";

      if (tx.isFrom(publickey))
        button_text.cancel = "CANCEL";

      if (app.options.games) {
        let { games } = app.options;

        games.forEach(game => {
          if (game.initializing == 0 && game.id == game_id) {
            button_text.continue = "CONTINUE";
            delete button_text.join;

            if (game.players.some(player => publickey == player))
              button_text.delete = "DELETE";
              delete button_text.cancel;
          }
        });
      }

      document.querySelector('.arcade-gamelist').innerHTML += ArcadeGameListRowTemplate(app, tx, button_text);
      console.log(button_text);
    });

  },







  attachEvents(app, data) {

    //
    // Create Game
    //
    Array.from(document.getElementsByClassName('game')).forEach(game => {
      game.addEventListener('click', (e) => {

        data.active_game = e.currentTarget.id;
        ArcadeGameCreate.render(app, data);
        ArcadeGameCreate.attachEvents(app, data);

      });
    });

    //
    // join game
    //
    Array.from(document.getElementsByClassName('arcade-game-row-join')).forEach(game => {
      game.onclick = (e) => {

        let game_id = e.currentTarget.id;
        game_id = game_id.split('-').pop();

        //
        // find our accepted game
        //
        let { games } = data.arcade;
        let accepted_game = null;

        games.forEach((g) => {
          if (g.transaction.sig === game_id) accepted_game = g;
        });

        if (!accepted_game) return;

        //
        // check that we're not accepting our own game
        //
        if (accepted_game.transaction.from[0].add == app.wallet.returnPublicKey()) {
          let { players } = accepted_game.returnMessage();
          if (players.length > 1) {
            salert(`
              This is your game! Not enough players have joined the game for us to start,
              but we'll take you to the loading page since at least one other player is waiting for this game to start....
            `);
            ArcadeLoader.render(app, data);
            ArcadeLoader.attachEvents(app, data);
          } else {
            salert("You cannot accept your own game!");
          }
        } else {
          //
          // check if we've already accepted game and have it locally
          //
          if (app.options.games) {
            let existing_game = app.options.games.find(g => g.id == game_id);

            if (existing_game != -1 && existing_game) {
              if (existing_game.initializing == 1) {
                salert("This game is initializing!");

                ArcadeLoader.render(app, data);
                ArcadeLoader.attachEvents(app, data);
                return;
              } else {
                //
                // solid game already created
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
          // check with server to see if this game is taken yet
          //
          data.arcade.sendPeerDatabaseRequest(
            "arcade",
            "games",
            "is_game_already_accepted",
            accepted_game.id,
            null,
            (res) => {

console.log("CHECKING TO SEE IF THERE IS STILL SPACE IN THE GAME: " + JSON.stringify(res.rows));
              if (res.rows == undefined) {
                console.log("ERROR 458103: cannot fetch information on whether game already accepted!");
                return;
              }

              if (res.rows.length > 0) {
                if (res.rows[0].game_still_open == 1) {
                  //
                  // data re: game in form of tx
                  //
                  let { transaction } = accepted_game;
                  let game_tx = Object.assign({ msg: { players_array: null } }, transaction);

                  if (game_tx.msg.players_array) {
                    let players = transaction.msg.players_array.split("_");
                    if (players.length >= 2) {
                      data.arcade.sendMultiplayerAcceptRequest(app, data, accepted_game);
                      return;
                    }
                  }

                  //
                  // sanity check
                  //
  console.log("CHECKING OPTIONS WHEN INVITING: " + JSON.stringify(accepted_game));

                  data.arcade.sendInviteRequest(app, data, accepted_game);
                  ArcadeLoader.render(app, data);
                  ArcadeLoader.attachEvents(app, data);
                } else {
                  salert("Sorry... game already accepted. Your list of open games will update shortly on next block!");
                }
              }
            });
        }
      };
    });

    Array.from(document.getElementsByClassName('arcade-game-row-delete')).forEach(game => {
      game.onclick = (e) => {
        let game_id = e.currentTarget.id;
        game_id = game_id.split('-').pop();
        salert(`Delete game id: ${game_id}`);

        if (app.options.games) {
          let { games } = app.options;
          let resigned_game = games.find(game => game.id == game_id);
          if (resigned_game != -1) {
            let game_mod = app.modules.returnModule(resigned_game.module);
            game_mod.resignGame(game_id);
          }

          this.removeGameFromList(game_id);
        }
      };
    });

    Array.from(document.getElementsByClassName('arcade-game-row-cancel')).forEach(game => {
      game.onclick = (e) => {
        let game_id = e.currentTarget.id;
        sig = game_id.split('-').pop();
        salert(`Cancel game id: ${game_id}`);

        let newtx = app.wallet.createUnsignedTransactionWithDefaultFee();
        let msg = {
          sig: sig,
          status: 'close',
          request: 'close',
          module: 'Arcade'
        }

        newtx.transaction.msg = msg;
        newtx = app.wallet.signTransaction(newtx);
        app.network.propagateTransaction(newtx);

        this.removeGameFromList(game_id);
      }
    });
  },

  removeGameFromList(game_id) {
    document.getElementById(`arcade-gamelist`)
                  .removeChild(document.getElementById(`arcade-game-${game_id}`));
  }

}
