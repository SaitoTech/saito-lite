module.exports = PolkadotAddressTemplate = (app, mod) => {
  return `
    <div class="polkadot-overlay-container">

      <h1 class="polkadot-overlay-header">Your Address:</h1>

      <div class="polkadot-overlay-subheader">Which token do you want to use? We recommend Westend because tokens are free. You can always change this later: </div>

      <div class="polkadot-overlay-address">DOT-ADDRESS-HERE</div>

      <div class="polkadot-overlay-infobox">
	Your balance at this address is ______. We recommend that. Please also remember that you should BACKUP your wallet so you 
        don't lose the private keys to this address. If you need to backup, you can do that by clicking on THIS LINK.
      </div>

      <div class="polkadot-overlay-token-selected button">OK, Load Arcade</div>

    </div>




<style type="text/css">

.polkadot-overlay-container {
  background-color: whitesmoke;
  max-width: 50vw;
  max-height: 90vh;
  margin-left: auto;
  margin-right: auto;
  padding: 25px;
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
  padding: 5px;
  font-size: 0.9em;
  border: 1px solid #EFEFEF;
}
.polkadot-overlay-token-selected {
  text-align: center;
}
</style>
  `;
}
