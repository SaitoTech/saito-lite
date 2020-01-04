module.exports = WelcomeBackupTemplate = () => {
  
  return `
  <div class="welcome-modal-wrapper">
    <div class="welcome-modal-action">
      <div class="welcome-modal-left">
        <div class="welcome-modal-header">Welcome to Saito</h1></div>
        <div class="welcome-modal-main">
          <div style="margin:1em 0">Backup your Saito wallet and start getting Saito tokens for free:</div>
          <div style="display:flex;">
      <input style="width:100%; color:black; font-size:1em; background:white;margin:0 1em 0 0;" id="registry-input" type="text" placeholder="email">
      <input style="display: var(--saito-wu);" id="name" name="name" type="text"></input>
      <button id="backup-email-button" style="clear:both; margin:unset; margin-left:0px; min-width:6em; font-size:0.7em;">BACKUP WALLET</button>
          </div>
          <div style="font-size:0.9em;height:30px;margin-top:10px"><input type="checkbox" id="signup" style="float:left;width:2em;height:2em;margin-right:10px" checked /> send periodic updates on important network news (max monthly)</div>
        </div>
        <div class="welcome-modal-info">
          <fieldset style="margin-top:20px" class="welcome-modal-explanation">
            <div><b>How does this work?</b></div>
            <div>Your browser will encrypt your wallet using a password you provide and send you a copy by email. You can restore your wallet anytime by providing this encrypted file along with your password.</div>
          </fieldset>
        </div>
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
