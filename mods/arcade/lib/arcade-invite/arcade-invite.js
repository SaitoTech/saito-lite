const ArcadeInviteTemplate = require('./arcade-invite.template');

module.exports = ArcadeInvite = {
  render(app, data) {
    let arcade_invite_container = document.getElementById('arcade-invite-container');
    if (arcade_invite_container) {
      let { invite_payload } = data.arcade;
      arcade_invite_container.innerHTML = ArcadeInviteTemplate(invite_payload);
    }
  },

  attachEvents(app, data) {
    let game_spinner = document.getElementById('invite-game-spinner');
    let arcade_initializer = document.getElementById('manage-invitations');
    let play_button = document.getElementById('invite-play-button');

    play_button.onclick = () => {
      arcade_initializer.style.display = 'none';
      game_spinner.style.display = 'block';

      let { invite_payload } = data.arcade;
      console.log(invite_payload);

      /*{
        module: "Twilight",
        publickey: "24fyD8JFWWhbs8RaZgDwXsuPTTSo6XKrnZkKhdKPSgLrn",
        options: {…},
        ts: 1581314797043,
        sig: "3qEaRPoHAbVwfK42pMf5EDDUvGHSCke1JAP3R6KC82LqArpf8EkLRXUXWzEZwc8Wu4uhNme5UpP9jh27R83S8B4H"
      }*/

      // NECESSARY OPTIONS TO ADD

      /*
        let players_needed = accepted_game.transaction.msg.players_needed;
        let players_available = accepted_game.transaction.msg.players.length;
      */

      let game_id = invite_payload.game_id;
      let open_game_tx = data.arcade.createOpenTransaction(invite_payload);
      open_game_tx.transaction.to = [invite_payload.publickey]


      // we're joining if we don't have everyone yet
      if (players_needed > open_game_tx.transaction.to.length + 1) {
        //
        // add open_game_tx to list of our games
        //
        // data.arcade.addGameToOpenList(open_game_tx);
        let join_tx = data.arcade.createJoinTransaction(app, data, open_game_tx);
        join_tx.transaction.to = [invite_payload.publickey, app.wallet.returnPublicKey()];
        join_tx.transaction.msg.game_id = game_id;
        data.arcade.joinGameToOpenList(join_tx);
        console.log(join_tx);

      } else {
        data.arcade.sendPeerDatabaseRequest(
          "arcade",
          "games",
          "is_game_already_accepted",
          game_id,
          null,
          (res) => {

            if (res.rows == undefined) {
              console.log("ERROR 458103: cannot fetch information on whether game already accepted!");
              return;
            }

            if (res.rows.length > 0) {
              if (res.rows[0].game_still_open == 1) {

                //
                // data re: game in form of tx
                //
                let { transaction } = open_game_tx;
                // let game_tx = Object.assign({ msg: { players_array: null } }, transaction);

                salert("Accepting this game!");
                open_game_tx.transaction.msg.players = [invite_payload.publickey];
                let newtx = data.arcade.createAcceptTransaction(app, data, open_game_tx);
                data.arcade.app.network.propagateTransaction(newtx);
                return;

              } else {
                salert("Sorry, this game has been accepted already!");
              }
            } else {
              salert("Sorry... game already accepted. Your list of open games will update shortly on next block!");
            }
          });
      }

      return;

      //
      // check with server to see if this game is taken yet
      //

      //
      // invite logic goes here
      // let game_id = e.currentTarget.id;
      // game_id = game_id.split('-').pop();

        //
        // find our accepted game
        //
        let { games } = data.arcade;
        let accepted_game = null;

        games.forEach((g) => {
          if (g.transaction.sig === game_id) { accepted_game = g; }
        });

        if (!accepted_game) return;

	//
	// if there are not enough players, we will join not accept
	//
        let players_needed = accepted_game.transaction.msg.players_needed;
        let players_available = accepted_game.transaction.msg.players.length;
        if ( players_needed > (players_available+1) ) {
          let newtx = data.arcade.createJoinTransaction(app, data, accepted_game);
          data.arcade.app.network.propagateTransaction(newtx);
	  data.arcade.joinGameOnOpenList(newtx);
          salert("You have broadcast a message asking to join this game! It may take a minute or so for your icon to appear next to the game.");
	  return;
	}

	//
	// we are the final player, but first check we're not accepting our own game
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
          // we are going to send a message to accept this game, but first check if we have
	  // already done this, in which case we will have the game loaded in our local games list
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
      }
    }
  }
}
