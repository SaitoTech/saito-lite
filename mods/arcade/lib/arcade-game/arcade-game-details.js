const ArcadeGameDetailsTemplate = require('./arcade-game-details.template');
const AdvancedOverlay = require('./advanced-overlay'); // game-overlay
const GameCryptoTransferManager = require('./../../../../lib/saito/ui/game-crypto-transfer-manager/game-crypto-transfer-manager');


const getOptions = () => {
  let options = {};
  document.querySelectorAll('form input, form select').forEach(element => {
    if (element.type == "checkbox") {
      if (element.checked) {
        options[element.name] = 1;
      }
    } else {
      options[element.name] = element.value;
    }
  });
  return options;
}


module.exports = ArcadeGameDetails = {

  render(app, mod, invite) {

    let gamemod = app.modules.returnModule(invite.msg.game);

    if (!document.getElementById("background-shim")) {
      app.browser.addElementToDom(`<div id="background-shim" class="background-shim" style=""><div id="background-shim-cover" class="background-shim-cover"></div></div>`); 
    }

    mod.overlay.showOverlay(app, mod, ArcadeGameDetailsTemplate(app, mod, invite), function() {

      //
      // on close, hide the shim
      //
      document.querySelector('.background-shim').destroy();

    });
    mod.meta_overlay = new AdvancedOverlay(app, gamemod);
    mod.meta_overlay.render(app, gamemod);
    mod.meta_overlay.attachEvents(app, gamemod);

    let gamemod_url = "/" + gamemod.returnSlug() + "/img/arcade.jpg";
    document.querySelector('.game-image').src = gamemod_url;
    document.querySelector('.background-shim').style.backgroundImage = 'url(' + gamemod_url + ')';
    document.querySelector('.game-wizard-advanced-options-overlay').style.display = "none";

    //
    // move into advanced menu
    //
    document.querySelector('.game-wizard-options-toggle').onclick = (e) => {
      mod.meta_overlay.showOverlay(app, gamemod, gamemod.returnGameOptionsHTML());
      document.querySelector('.game-wizard-advanced-options-overlay').style.display = "block";
      try {
        if (document.getElementById("game-wizard-advanced-return-btn")) {
          document.querySelector('.game-wizard-advanced-return-btn').onclick = (e) => {
  	    document.getElementById("game-wizard-advanced-options-overlay").style.display = "none";
          }
        }
      } catch (err) {}
    };

    if (gamemod.status) {
      document.querySelector(".game-wizard-status").innerHTML = `Development Status: ${gamemod.status}.`;
    }

    if (gamemod.publisher_message) {
      document.querySelector('.game-wizard-publisher-message').innerHTML = `<span style="font-weight:bold">NOTE: </span>${gamemod.publisher_message}`;
    }

    document.querySelector('.game-wizard-title').innerHTML = gamemod.name;
    document.querySelector('.game-wizard-description').innerHTML = gamemod.description;

    setTimeout(() => {
      document.querySelector('.game-wizard-players-select').innerHTML = "";
      for (let p = gamemod.minPlayers; p <= gamemod.maxPlayers; p++) {
        var option = document.createElement("option");
            option.text = p + " player";
            option.value = p;
        document.querySelector('.game-wizard-players-select').add(option);
      }
    }, 100);

    //
    // move advanced options into game form
    //
    let advanced1 = document.querySelector('.game-wizard-advanced-box');
    let overlay1 = document.querySelector('.game-overlay');
    let overlay2 = document.querySelector('.game-overlay-backdrop');
    let overlaybox = document.querySelector('.game-wizard-advanced-options-overlay');
    overlaybox.appendChild(overlay1);
    overlaybox.appendChild(overlay2);
    if (advanced1) { overlaybox.appendChild(advanced1); }

  },


  attachEvents(app, mod) {

    //
    // create game
    //
    document.getElementById('game-invite-btn').addEventListener('click', async (e) => {
      try {

        let options = getOptions();

      //
      // if crypto and stake selected, make sure creator has it
      //
      if (options.crypto != "") {
        if (options.stake > 0) {


          let selected_crypto_ticker = app.wallet.returnCryptoModuleByTicker(options.crypto).ticker;
          let preferred_crypto_ticker = app.wallet.returnPreferredCrypto().ticker;
          if(selected_crypto_ticker === preferred_crypto_ticker) {
            let my_address = app.wallet.returnPreferredCrypto().returnAddress();
            let crypto_transfer_manager = new GameCryptoTransferManager(app);
            crypto_transfer_manager.balance(app, mod, my_address, options.crypto, function() {});
            let returnObj = await app.wallet.returnPreferredCryptoBalances([ my_address ], null, options.crypto);
            crypto_transfer_manager.hideOverlay();

            let adequate_balance = 0;
            for (let i = 0; i < returnObj.length; i++) {
              if (returnObj[i].address == my_address) {
                if (parseFloat(returnObj[i].balance) >= parseFloat(options.stake)) {
                  adequate_balance = 1;
                }
              }
            }    

            if (adequate_balance == 0) {
              salert("You don't have enough "+options.crypto+" to create this game!");
              return;
            }
          } else {
            salert(`${options.crypto} must be set as your preferred crypto to create a game using ${options.crypto}`);
            return;
          }
          
        }
      }


        app.browser.logMatomoEvent("Arcade", "ArcadeCreateNewInvite", options.gamename);
        let gamemod = app.modules.returnModule(options.gamename);
        let gamedata = {
          name: gamemod.name,
          slug: gamemod.returnSlug(),
          options: gamemod.returnFormattedGameOptions(options),
          options_html: gamemod.returnGameRowOptionsHTML(options),
          players_needed: document.querySelector('.game-wizard-players-select').value,
        };

        let players_needed = document.querySelector('.game-wizard-players-select').value;

        if (players_needed == 1) {
          mod.launchSinglePlayerGame(app, data, gamedata);
          return;
        } else {
          mod.overlay.hideOverlay();
          document.getElementById('background-shim').destroy();

          let newtx = mod.createOpenTransaction(gamedata);
          mod.app.network.propagateTransaction(newtx);
          mod.renderArcadeMain(app, mod);

        }

      } catch (err) {

      alert("error: " + err);

      }

      return false;

    });




  },
}
