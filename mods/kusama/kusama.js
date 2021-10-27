const SubstrateBasedCrypto = require("../../lib/templates/substratebasedcrypto");

const parityArchiveNodeEndpoint = 'wss://kusama-rpc.polkadot.io/';
const web3FoundationArchiveNodeEndpoint = 'wss://cc3-5.kusama.network/';
const saitoEndpoint = 'ws://206.189.221.128:9932';
const saitoEndpointSecure = 'wss://parity.saito.io:9931/kusamawss/';

class Kusama extends SubstrateBasedCrypto {
  constructor(app) {
    super(app, 'KSM', saitoEndpointSecure, "Kusama is a Polkadot TESTNET supported by the Saito network. Kusama's Existential Deposit is 0.01 KSM, be sure not to send less than 1 DOT or leave less than 0.01 KSM in your wallet.");
    this.name = 'Kusama';
    this.description = 'Kusama Polkadot testnet for Saito. Installing this module will make Kusama your default in-browser cryptocurrency.';
    this.categories = "Cryptocurrency";
    this.information = "Your wallet has a Kusama module installed. This allows you to send and receive KSM and interact with the Kusama network via Kusama-compatible applications running on the Saito network. Please note that KSM is intended for rapid application prototyping and development. We recommend against using this network for casual network purposes unless you are a developer and know what you are doing. And please be sure to backup your wallet.";
    this.warning = "Kusama has an Existential Deposit of 0.01 KSM. Be sure not to send less than this amount or leave less than 0.01 KSM in your wallet or it will be reaped by the network.";
  }
  renderModalSelectCrypto(app, cryptomod) {
    return `
      <div id="dot-warning" class="dot-warning">
        <div id="dot-warning-header" class="dot-warning-header">Welcome to Kusama!</div>
        <div id="dot-warning-body" class="dot-warning-body">

Kusama is a Polkadot-community network. It has low barriers to entry for parachain development and deployment and is considered a pre-production environment for Polkadot applications:

<p style="margin-bottom:20px"></p>

Before you deposit Kusama, please <b>backup your wallet</b>. While Saito is under development you can keep a copy of your Kusama keys safe by backing up your wallet. If you prefer to test out the network without putting funds at risk, we recommend switching back to the Saito network.

        </div>
        <div id="dot-warning-confirm" class="dot-warning-confirm button">Backup and Continue</div>
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
  max-width: 275px;
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
          cryptomod.activate();
          cryptomod.modal_overlay.hideOverlay();
          app.connection.emit('update_balance');
        }
      }
    } catch (err) {

    }
    return;
  }

}

module.exports = Kusama;

