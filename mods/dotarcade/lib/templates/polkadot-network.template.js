module.exports = PolkadotNetworkTemplate = (app, mod) => {
  return `
    <div class="polkadot-overlay-container">

      <h1 class="polkadot-overlay-header">Choose Polkadot Token:</h1>

      <div class="polkadot-overlay-subheader">Which Polkadot token do you want to use by default with Saito applications?<br />
        You can change this anytime.</div>

      <form id="polkadot-overlay-radio" class="polkadot-overlay-radio">

        <input type="radio" id="WND" class="network_option" name="network" value="WND" checked>
        <label for="WND">WND - Westend</label>

        <p></p>

        <input type="radio" id="DOT" class="network_option" name="network" value="DOT">
        <label for="DOT">DOT - Polkadot</label>

        <p></p>

        <input type="radio" id="KSM" class="network_option" name="network" value="KSM">
        <label for="KSM">KSM - Kusama</label>

      </form>

      <!--div id="polkadot-overlay-infobox" class="polkadot-overlay-infobox">
      </div-->

      <div>
        <p>
          More parachains coming soon!
        </p>
      </div>

      <div id="polkadot-overlay-network-selected-btn" class="polkadot-overlay-network-selected-btn button">Select Westend</div>

    </div>




<style type="text/css">
.network_option {
  clear: both;
}
.polkadot-overlay-container {
  max-width: 50vw;
  max-height: 90vh;
  margin-left: auto;
  margin-right: auto;
  padding: 25px;
  border-radius: 5px;
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
.polkadot-overlay-header {
  font-size: 2em;
}
.polkadot-overlay-subheader {
  font-size: 1.4em;
}
.polkadot-overlay-radio {
  margin-top: 15px;
  margin-left: 15px;
  font-size:1.35em;
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
  margin: 2em 0 0;
}

@media only screen and (max-width: 960px) {
  .polkadot-overlay-container {
    max-width: 80vw;
  }
  .polkadot-overlay-container {
    max-width: 80vw;
  }
}



</style>
  `;
}
