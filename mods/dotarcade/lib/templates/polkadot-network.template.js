module.exports = PolkadotNetworkTemplate = (app, mod) => {
  return `
    <div class="polkadot-overlay-container">

      <h1 class="polkadot-overlay-header">Choose Polkadot Network:</h1>

      <div class="polkadot-overlay-subheader">Which token do you want to use? We recommend Westend because tokens are free. You can always change this later: </div>

      <div class="polkadot-overlay-select">
	<select>
	  <option value="none" selected>please select</option>
	  <option value="DOT">DOT</option>
	  <option value="KUSAMA">Kusama (free tokens available)</option>
	  <option value="WESTEND">Westend (free tokens available)</option>
        </select>
      </div>

      <div class="polkadot-overlay-infobox">
	Sorry! We could support playing Poker and other games on DOT, but until the network 
        supports transaction rebroadcasting that may be anti-social. At least while we are
        still in demo mode, please select another token. 
      </div>

      <div id="polkadot-overlay-network-selected-btn" class="polkadot-overlay-network-selected-btn button">Select</div>

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
.polkadot-overlay-network-selected-btn {
  text-align: center;
}
</style>
  `;
}
