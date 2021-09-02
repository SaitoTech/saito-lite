const SaitoOverlay = require('./../../../lib/saito/ui/saito-overlay/saito-overlay');
const GameCryptoTransferManager = require('./../../../lib/saito/ui/game-crypto-transfer-manager/game-crypto-transfer-manager');
const PolkadotAddressTemplate = require('./templates/polkadot-address.template');
const PolkadotNetworkTemplate = require('./templates/polkadot-network.template');


module.exports = PolkadotPopup = {

  render(app, mod) {

  },

  attachEvents(app, mod) {

    let startbtn = document.getElementById("startgame");
    let ticker = "WND";

    startbtn.onclick = (e) => {

      mod.overlay = new SaitoOverlay(app, mod);
      mod.overlay.closebox = false;
      mod.overlay.render(app, mod);
      mod.overlay.attachEvents(app, mod);
      mod.overlay.showOverlay(app, mod, PolkadotNetworkTemplate(app, mod));

      let radioChangeFunc = (e) => {
        if (document.getElementById("KSM").checked) { ticker = "KSM"; }
        if (document.getElementById("DOT").checked) { ticker = "DOT"; }
        if (document.getElementById("WND").checked) { ticker = "WND"; }

        let info = [];
        info['DOT'] = 'Polkadot';
        info['KSM'] = 'Kusama';
        info['WND'] = 'Westend';
        //document.getElementById("polkadot-overlay-infobox").innerHTML = info[ticker];
        document.getElementById("polkadot-overlay-network-selected-btn").innerHTML = "Select " + info[ticker];

      }

      document.getElementById("KSM").onchange = (e) => { radioChangeFunc(e); }
      document.getElementById("DOT").onchange = (e) => { radioChangeFunc(e); }
      document.getElementById("WND").onchange = (e) => { radioChangeFunc(e); }


      document.getElementById("polkadot-overlay-network-selected-btn").onclick = (e) => {

        let ticker = "WND";
        if (document.getElementById("KSM").checked) { ticker = "KSM"; }
        if (document.getElementById("DOT").checked) { ticker = "DOT"; }

        if (ticker == "DOT" || ticker == "KSM") {
          let c = confirm("DOT and Kusama support is provided to demo functionality. We recommend Westend while Polkadot rolls out its scalable parachains. Also, you can get free tokens! Switch?");
          if (c) {
            ticker = "WND";
          }
        }

        //let cryptomod = app.wallet.returnCryptoModuleByTicker(ticker);

        try {

          mod.overlay.hideOverlay();
          mod.overlay.showOverlay(app, mod, PolkadotAddressTemplate(app, mod, ticker));

          document.querySelector(".arcade-link").onclick = (e) => {
            app.wallet.setPreferredCrypto(ticker);
            window.location = '/arcade/#side_bar=1';
          }

        } catch (err) {
          salert("ERROR: Unsupported Crypto Module");
        }
      }     
    }
  },

}
