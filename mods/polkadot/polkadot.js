const SubstrateBasedCrypto = require("../../lib/templates/substratebasedcrypto");

const parityArchiveNodeEndpoint = 'wss://rpc.polkadot.io';
const saitoEndpoint = 'ws://206.189.222.218:9932';
const saitoEndpointSecure = 'wss://saito.io:9931/polkadotwss/'; // This routes through ssl to 206.189.222.218:9932
const mysteryEndpointFoundOnPolkaStatsIO = 'wss://polkastats.io/api/v3';
class Polkadot extends SubstrateBasedCrypto {
  constructor(app) {
    super(app, 'DOT', saitoEndpointSecure, "Polkadot's Existential Deposit is 1 DOT, be sure not to send less than 1 DOT or leave less than 1 DOT in your wallet.");
    this.name = 'Polkadot';
    this.description = 'Polkadot application layer for in-browser Polkadot applications. Install this module to make Polkadot your default in-browser cryptocurrency';
    this.categories = "Cryptocurrency";
  }

  renderModalSelectCrypto(app, cryptomod) {
    return `
      <div id="dot-warning" class="dot-warning">
	<div id="dot-warning-header" class="dot-warning-header">Warning</div>
	<div id="dot-warning-body" class="dot-warning-body">

DOT is a base-layer token. Saito supports DOT to assist with cross-chain applications and validation tools. This module is not intended for other applications. Use Saito or a Polkadot parachain for those.

<p style="margin-bottom:20px"></p>

Additionally, <b>with this module you can lose significant amounts of money with no protection</b>. Key backup and management is also entirely your responsibility. Unless you know what you are doing, please switch back to Saito or a Polkadot parachain.

        </div>
	<div id="dot-warning-confirm" class="dot-warning-confirm button">Continue</div>
	<div id="revert-to-saito" class="dot-warning-confirm revert-to-saito button">Back to Safety</div>
      </div>
      <style>
.dot-warning {
  background-image: url(/saito/img/doom.jpg);
  background-size: cover;
  width: 80vw;
  height: 80vh;
  padding: 30px;
}
.dot-warning-header {
  font-size: 4em;
  text-transform: uppercase;
  font-weight: bold;
  padding: 5px;
}
.dot-warning-body {
  max-width: 500px;
  font-size: 1.25em;
  padding: 5px;
  background: #0005;
}
.dot-warning-confirm {
  max-width: 200px;
  font-size: 1.2em;
  margin-top: 20px;
  text-align: center;
  float: left;
  margin-right: 20px;
}
.revert-to-saito {
  max-width 200px;
  font-size: 1.2em;
  margin-top: 20px;
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
          cryptomod.modal_overlay.hideOverlay();
        }
      }
      let dotno = document.getElementById("revert-to-saito");
      if (dotno) {
        dotno.onclick = (e) => {
          app.wallet.setPreferredCrypto("SAITO");
          cryptomod.modal_overlay.hideOverlay();
        }
      }
    } catch (err) {

    }
    return;
  }


}

module.exports = Polkadot;
