module.exports = PolkadotAddressTemplate = (app, mod, ticker) => {

  let cryptomod  = app.wallet.returnCryptoModuleByTicker(ticker);
  let my_address = cryptomod.returnAddress();
  let html = `
    <div class="polkadot-overlay-container">

      <div class="polkadot-saito-image"><img class="saito-image" src="/dotarcade/img/backup_note_${ticker.toLowerCase()}.png" /></div>
      <div class="polkadot-overlay-details">
        <div class="polkadot-address-header">Your Wallet:</div>
        <div class="polkadot-overlay-address">${my_address}</div>
        <div class="polkadot-backup-reminder">Please remember to backup your wallet!</div>
      </div>
      <div style="margin-left:auto;margin-right:auto;text-align:center">
        <div class="arcade-link polkadot-overlay-token-selected button">PLAY NOW</div>
  `;

 if (ticker === "WND") {
   html += `
        <a href="https://matrix.to/#/#westend_faucet:matrix.org?via=matrix.parity.io&via=matrix.org&via=web3.foundation" target="_ksm_new" class="polkadot-overlay-token-selected button orange-button">Westend Faucet</a>
        <div class="polkadot-overlay-westend-faucet-info">
          Get Westend WND Polkadot testnet tokens from the faucet.<br />
          Requires a Matix Chat ID.<br /><br />
        </div>
   `;
  }

  html += `
      </div>

    </div>




<style type="text/css">

.polkadot-overlay-container {
  max-width: 50vw;
  max-height: 90vh;
  margin-left: auto;
  margin-right: auto;
  border-radius: 5px;
  padding: 3em 5em;
}
.polkadot-overlay-container::after {
  background-image: url(img/brand-pattern.png);
  background-size: cover;
  content: "";
  opacity: 0.375;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  z-index: -1;
  padding: 25px;
  border-radius: 5px;
}
.polkadot-overlay-container::before {
  z-index: -5;
  content: "";
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  padding: 25px;
  border-radius: 5px;
  background: #efefef;
}
.polkadot-saito-image {
  width: 100%;
  display: none;
}
.saito-image {
  width: 100%;
}
.polkadot-address-header {
  text-align: center;
  margin-top: 15px;
  margin-bottom: 15px;
}
.polkadot-overlay-address {
  text-align: center;
  margin-bottom: 15px;
  font-weight: bold;
  font-size: 1.1em;
  text-overflow: ellipsis;
  overflow: hidden;
}
.polkadot-backup-reminder {
  text-align: center;
  margin-bottom: 15px;
  font-size: 1.1em;
}
.polkadot-overlay-token-selected {
  background-color: rgb(13 164 0);
}

.polkadot-overlay-token-selected:hover, .polkadot-overlay-token-selected:focus {
  background-color: rgb(13 164 0);
  text-shadow: #ffffff 1px 0;
  color: #ffffff;
}

.polkadot-overlay-westend-faucet-info {
  text-align: right;
}






.polkadot-overlay-header {
  font-size: 2em;
}
.polkadot-overlay-subheader {
  font-size: 1.4em;
}
.polkadot-overlay-select {
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 1.2em;
}
.polkadot-overlay-infobox {
  padding: 0px;
  font-size: 1em;
  border: 1px solid #EFEFEF;
  margin-top: 15px;
}
.polkadot-overlay-token-selected {
  text-align: center;
}
.orange-button {
  border: 2px solid rgb(255 172 0);
  background-color: rgb(255 172 0);
  margin-left: 15px;
}
.orange-button:hover {
  background-color: rgb(255 172 0);
}

@media only screen and (max-width: 960px) {
  .polkadot-overlay-container {
    max-width: 80vw;
  }
  .polkadot-overlay-details {
    padding: 25px;
  }
  .saito-overlay .button {
    margin: 1em 0;
    max-width: 70%;
    font-size: 1.5em;
  }
}


</style>
  `;


  return html;

}
