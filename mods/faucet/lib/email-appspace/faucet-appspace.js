const FaucetAppspaceTemplate = require('./faucet-appspace.template.js');

module.exports = FaucetAppspace = {

  render(app, mod) {

    document.querySelector(".email-appspace").innerHTML = FaucetAppspaceTemplate(app);

  },

  attachEvents(app, mod) {

    try {

      let fbutton = document.querySelector(".faucet_btn");
      fbutton.onclick = function (e) {

	let newtx = app.wallet.createUnsignedTransaction(app.wallet.returnPublicKey(), 0.0);
        newtx.msg.module = "Faucet";
        newtx.msg.request = "saito";
	newtx = app.wallet.signTransaction(newtx);
	app.network.propagateTransaction(newtx);
	salert("Broadcasting Request for Saito");

      }

    } catch (err) {}

  },

}


