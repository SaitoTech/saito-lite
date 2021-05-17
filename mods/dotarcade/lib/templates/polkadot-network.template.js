module.exports = PolkadotNetworkTemplate = (app, mod) => {
  return `
    <div class="polkadot-overlay-container">

      <h1 class="polkadot-overlay-header">Choose Polkadot Network:</h1>

      <div class="polkadot-overlay-subheader">We recommend Westend because tokens are free and you can play around without contributing to blockchain bloat. You can always change this later: </div>

      <div class="polkadot-overlay-select-container">
	<select id="polkadot-overlay-select" class="polkadot-overlay-select">
	  <option value="DOT" selected>DOT</option>
	  <option value="KSM">Kusama</option>
	  <option value="WND">Westend (free tokens)</option>
        </select>
      </div>

      <div id="polkadot-overlay-infobox" class="polkadot-overlay-infobox">
      </div>

      <div id="polkadot-overlay-network-selected-btn" class="polkadot-overlay-network-selected-btn button">Select Westend</div>

    </div>




<style type="text/css">

.polkadot-overlay-container {
  background-color: whitesmoke;
  max-width: 50vw;
  max-height: 90vh;
  margin-left: auto;
  margin-right: auto;
  padding: 25px;
  border-radius: 5px;
}
.polkadot-overlay-header {
  font-size: 2em;
}
.polkadot-overlay-subheader {
  font-size: 1.4em;
}
.polkadot-overlay-select-container {
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 1.2em;
}
.polkadot-overlay-select {
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
