const SubstrateBasedCrypto = require("../../lib/templates/substratebasedcrypto");

let kaoliniteTestServerEndpoint = "ws://138.197.202.211:9932";
let saitoWestendEndpoint = "ws://178.128.181.212:9932";
let saitoWestendEndpointSecure = "wss://saito.io:9931/argylewss/";

class Westend extends SubstrateBasedCrypto {
  constructor(app) {
    super(app, 'WND', saitoWestendEndpointSecure);
    this.name = 'Westend';
    this.description = 'Westend Polkadot Testnet application support for Saito. Installing this module will make Westnet your default in-browser cryptocurrency.';
    this.categories = "Cryptocurrency";
  }

  renderModalSelectCrypto(app, cryptomod) {
    return `
      <div id="dot-warning" class="dot-warning">
        <div id="dot-warning-header" class="dot-warning-header">Westend Network:</div>
        <div id="dot-warning-body" class="dot-warning-body">

Westend is a Polkadot testnet. It is intended for developing and testing applications. Free tokens are available from the Westend Token Faucet.

<p style="margin-bottom:20px"></p>

Please note that while Saito is under development your wallet may periodically get reset, so we recommend keeping a copy of your Westend keys safe by backing up your wallet if you need them. If you prefer to test applications without the need to get external tokens, we recommend switching back to the Saito network.

        </div>
	<div>
          <div id="dot-warning-confirm" class="dot-warning-confirm button">Continue</div>
          <div id="westend-token-faucet" class="dot-warning-confirm westend-token-faucet button">Visit Token Faucet</div>
        </div>
        <div style="clear:both"></div>
      </div>
      <style>
.dot-warning {
  background-image: url(/saito/img/dreamscape.png);
  background-size: cover;
  width: 80vw;
  max-height: 80vh;
  max-width: 750px;
  padding: 30px;
}
.dot-warning-header {
  font-size: 4em;
  text-transform: uppercase;
  font-weight: bold;
  padding: 5px;
}
.dot-warning-body {
  max-width: 650px;
  font-size: 1.25em;
  padding: 20px;
  background: #0005;
}
.dot-warning-confirm {
  float: left;
  max-width: 275px;
  font-size: 1.2em;
  margin-top: 20px;
  text-align: center;
  background: whitesmoke;
  color: var(--saito-red);
  border: 1px solid var(--saito-red);
}
.westend-token-faucet {
  float: left;
  max-width 200px;
  font-size: 1.2em;
  margin-top: 20px;
  margin-left: 20px;
  text-align: center;
  background: whitesmoke;
  color: var(--saito-red);
  border: 1px solid var(--saito-red);
}
      </style>
    `;
  }

  attachEventsModalSelectCrypto(app, cryptomod) {
    try {
      let dotgo = document.getElementById("dot-warning-confirm");
      if (dotgo) {
        dotgo.onclick = (e) => {
          //app.wallet.backupWallet();
          cryptomod.modal_overlay.hideOverlay();
        }
      }
      let dotno = document.getElementById("westend-token-faucet");
      let url = "https://matrix.to/#/#westend_faucet:matrix.org?via=matrix.parity.io&via=matrix.org&via=web3.foundation";
      if (dotno) {
        dotno.onclick = (e) => {
          window.open(url, '_blank').focus();
        }
      }
    } catch (err) {

    }
    return;
  }


}

module.exports = Westend;
