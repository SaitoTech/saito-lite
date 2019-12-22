module.exports = FaucetModalBackupTemplate = () => {
  
  return `
<div class="welcome-modal-wrapper">
  <div class="welcome-modal-action">
      <div class="welcome-modal-header">
          <h1>Welcome to Saito</h1>
      </div>
      <div style="">
          <div style="margin-bottom:20px">Backup your Saito wallet and start getting Saito tokens for free:</div>
          <div style="">
	      <input style="width:100%; color:black; font-size:1em; background:white;" id="registry-input" type="text" placeholder="email">
          </div>
          <div style="font-size:0.7em;height:30px;margin-top:10px"><input type="checkbox" id="signup" style="float:left;margin-right:10px" checked /> send periodic updates on important network news (max monthly)</div>
          <div style="width: 100%; min-height: 50px">
	      <button id="registry-email-button" style="clear:both; margin:unset; margin-left:0px; min-width:6em; font-size:0.7em;">BACKUP WALLET</button>
          </div>

          <fieldset style="margin-top:20px" class="welcome-modal-explanation">
            <div><b>How does this work?</b> </div>
            <div>
            <p>
            Your browser will encrypt your wallet using a password you provide and send you a copy by legacy email. In the future, you can restore your wallet anytime by providing this encrypted file along with your secret password.
            </p>
            </div>
          </fieldset>

      </div>
  </div>
  
  <div class="welcome-modal-exit tutorial-skip">
      <p>
          I know about wallets.
      </p>
      <p>
          I'll back up later.
      </p>
      <i class="fas fa-arrow-right"></i>

  </div>
  
  </div>

  `;
}
