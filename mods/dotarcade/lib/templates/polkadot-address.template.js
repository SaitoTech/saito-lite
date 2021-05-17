module.exports = PolkadotAddressTemplate = (app, mod, ticker) => {

  let cryptomod  = app.wallet.returnCryptoModuleByTicker(ticker);
  let my_address = cryptomod.returnAddress();
  let html = `
    <div class="polkadot-overlay-container">

      <div class="polkadot-saito-image"><img class="saito-image" src="/dotarcade/img/backup_note_${ticker.toLowerCase()}.png" /></div>

      <div class="polkadot-address-header">Your Wallet:</div>
      <div class="polkadot-overlay-address">${my_address}</div>

      <div class="polkadot-backup-reminder">Please remember to backup your wallet!</div>

      <div style="margin-left:auto;margin-right:auto;text-align:center">
        <div class="arcade-link polkadot-overlay-token-selected button">Load Arcade</div>
  `;

 if (ticker === "WND") {
   html += `
        <a href="https://matrix.to/#/#westend_faucet:matrix.org?via=matrix.parity.io&via=matrix.org&via=web3.foundation" target="_ksm_new" class="polkadot-overlay-token-selected button orange-button">Westend Faucet</a>
   `;
  }

  html += `
      </div>

    </div>




<style type="text/css">

.polkadot-overlay-container {
  background-color: whitesmoke;
  max-width: 50vw;
  max-height: 90vh;
  margin-left: auto;
  margin-right: auto;
  border-radius: 5px;
}
.polkadot-saito-image {
  width: 100%;
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
}
.polkadot-backup-reminder {
  text-align: center;
  margin-bottom: 15px;
  font-size: 1.1em;
}
.polkadot-overlay-token-selected {
  background-color: rgb(13 164 0);
  box-shadow: 0px 16px 29px rgb(13,164 0);
}
.polkadot-overlay-token-selected:hover, .polkadot-overlay-token-selected:focus {
  text-shadow: #ffffff 1px 0;
  background-color: rgb(13 164 0);
  color: #ffffff;
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
  box-shadow: 0px 16px 29px rgb(247 176 31);
  margin-left: 15px;
}
</style>
  `;


  return html;

}
