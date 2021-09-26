const Tutorial03AppspaceTemplate = require('./tutorial03-appspace.template.js');
const GameCryptoTransferManager = require('./../../../../lib/saito/ui/game-crypto-transfer-manager/game-crypto-transfer-manager.js');

module.exports = Tutorial03Appspace = {

  render(app, mod) {

    //
    // render our HTML into the space provided
    //
    document.querySelector(".email-appspace").innerHTML = Tutorial03AppspaceTemplate(app);

  },

  attachEvents(app, mod) {

    //
    // add button-click to check our balance
    //
    document.querySelector('.balance_btn').addEventListener('click', async function(e) {

      //
      // which crypto are we using? ask the wallet!
      //
      let cryptomod = app.wallet.returnPreferredCrypto();
      let ticker = cryptomod.ticker;
      let our_address = cryptomod.returnAddress();

      //
      // crypto transfer manager UI
      //
      // we show the non-interactive balance-query element, and 
      // then AWAIT our balance check, and then clear the non-
      // interactive balance-query element once done.
      //
      let crypto_transfer_manager = new GameCryptoTransferManager();
      crypto_transfer_manager.balance(app, mod, our_address, ticker);
      let my_balance = await app.wallet.checkBalance(our_address, ticker);
      crypto_transfer_manager.hideOverlay();

      //
      // report the results
      //
      salert("Your balance is " + my_balance);

    });

    //
    // make a payment
    //
    document.querySelector('.payment_btn').addEventListener('click', async function(e) {

      let cryptomod = app.wallet.returnPreferredCrypto();
      let ticker = cryptomod.ticker;
      let our_address = cryptomod.returnAddress();
      let payment_address = document.getElementById("payment_address").value;
      let payment_amount = document.getElementById("payment_amount").value;

      //
      // lets check our balance to make sure we have the funds in out account
      // before we send out the payment. We can use the Game Crypto Transfer
      // Manager UI elements availablein /lib/saito/ui/* to handle this. These
      // are those lovely popups that will appear while we are checking balances
      //
      let crypto_transfer_manager = new GameCryptoTransferManager();
      crypto_transfer_manager.balance(app, mod, our_address, ticker);
      let my_balance = await app.wallet.checkBalance(our_address, ticker);
      crypto_transfer_manager.hideOverlay();

      //
      // sanity check
      //
      if (parseFloat(my_balance) < parseFloat(payment_amount)) {
        alert("Inadequate Balance: " + my_balance);
	return;
      }


      //
      // inform user payment underway
      //
      document.querySelector(".email-appspace").innerHTML = "Sending Payment";

      //
      // let the wallet send the payment
      //
      try {
        crypto_transfer_manager.receive(app, mod, our_address, payment_address, payment_amount, (new Date().getTime()), ticker);
        await app.wallet.sendPayment(
          [ cryptomod.returnAddress() ],
          [ payment_address ],
          [ payment_amount ] ,
          (new Date().getTime()) ,
          function() {
            document.querySelector(".email-appspace").innerHTML = "Payment Sent";
	    crypto_transfer_manager.hideOverlay();
          },
          cryptomod.ticker
        );
      } catch (err) {
        alert("ERROR: " + err);
      }

    });

  },

}

