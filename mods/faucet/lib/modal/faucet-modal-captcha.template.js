module.exports = FaucetModalIntroTemplate = () => {
  return `
    <div>
      <p style="line-height: 1.5em;">
        Saito is an open-source blockchain network.
        We use tokens to pay for services on the network.
      </p>
      <p style="margin-bottom: 1.5em;line-height: 1.5em;">Solve the CAPTCHA to earn tokens</p>
      <div style="display: grid; margin-bottom: 1em">
        <div style="display: flex">
            <input style="text-align: right; color: black; font-size: 1em; background:white;" id="registry-input" type="text" placeholder="Username">
            <h3 style="color: black; margin-left: 5px;align-self: center;">@saito</h3>
        </div>
      </div>
      <div style="display: flex;justify-content: space-between;">
        <div id="recaptcha"></div>
        <div style="display: flex;align-items: center;justify-content: flex-end;">
          <button id="registry-add-button" disabled>SUBMIT</button>
        </div>
      </div>
      <div class="tutorial-skip" style="
        align-self: flex-end;
        font-size: 0.65em;
        color:gray;
        text-decoration: underline;
        text-align: right;
        cursor: pointer;">No thanks</div>
    </div>
  `
***REMOVED***