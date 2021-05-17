const SaitoOverlay = require('./../../../lib/saito/ui/saito-overlay/saito-overlay');
const GameCryptoTransferManager = require('./../../../lib/saito/ui/game-crypto-transfer-manager/game-crypto-transfer-manager');
const PolkadotAddressTemplate = require('./templates/polkadot-address.template');
const PolkadotNetworkTemplate = require('./templates/polkadot-network.template');


module.exports = PolkadotPopup = {

  render(app, mod) {

  },


  attachEvents(app, mod) {

    let startbtn = document.getElementById("startgame");
    startbtn.onclick = (e) => {

      mod.overlay = new SaitoOverlay(app, mod);
      mod.overlay.closebox = false;
      mod.overlay.render(app, mod);
      mod.overlay.attachEvents(app, mod);
      mod.overlay.showOverlay(app, mod, PolkadotNetworkTemplate(app, mod));

      document.getElementById("polkadot-overlay-select").onchange = (e) => {

        let ticker = document.getElementById("polkadot-overlay-select").value;
	let info = [];
            info['DOT'] = 'Polkadot';
	    info['KSM'] = 'Kusama';
	    info['WND'] = 'Westend';

	document.getElementById("polkadot-overlay-infobox").innerHTML = info[ticker];
	document.getElementById("polkadot-overlay-network-selected-btn").innerHTML = "Select " + info[ticker];

      }


      document.getElementById("polkadot-overlay-network-selected-btn").onclick = (e) => {

        let ticker = document.getElementById("polkadot-overlay-select").value;

	if (ticker == "DOT" || ticker == "KSM") {
	  let c = confirm("Are you sure? DOT and Kusama support is provided as a demo. We recommend Westend while Polkadot rolls out its parachains. Also, you can get free tokens! Switch?");
	  if (!c) {
            document.getElementById("polkadot-overlay-select").value = "WND";
	    ticker = "WND";
	  }
	}

	let cryptomod = app.wallet.returnCryptoModuleByTicker(ticker);

	try {

          mod.overlay.hideOverlay();
          mod.overlay.showOverlay(app, mod, PolkadotAddressTemplate(app, mod, ticker));

	} catch (err) {

	  salert("ERROR: Unsupported Crypto Module");

	}

      }     

    }

  },



}
