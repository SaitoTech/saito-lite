module.exports = FaucetModalIntroTemplate = () => {
  return `
    <div>
      <p style="line-height: 1.5em;">
        Saito is an open-source blockchain network.
        We use tokens to pay for services on the network.
      </p>
      <p style="margin-bottom: 1.5em;line-height: 1.5em;">Solve the CAPTCHA to earn tokens</p>
      <div style="display: flex;justify-content: space-between;">
        <div id="recaptcha"></div>
        <div class="tutorial-skip" style="
        align-self: end;
        font-size: 0.65em;
        color:gray;
        text-decoration: underline;
        cursor: pointer;">No thanks</div>
      </div>
    </div>
  `
***REMOVED***