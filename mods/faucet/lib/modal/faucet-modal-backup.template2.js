module.exports = FaucetModalBackupTemplate = () => {
  
  return `
<div class="welcome-modal-wrapper">
  <div class="welcome-modal-action">
      <div class="welcome-modal-header">
          <h1>Welcome to Saito</h1>
          <p>
              A 'wallet' has been automatically created for you. <b>This wallet is yours!</b> 
          </p>
          <p>
              It manages your identity on the network and hold tokens you earn on the network.
          </p>
          <p>
              You really should back it up!
          </p>
      </div>
      <div>
          <div class="welcome-backup-email" style="display: flex;width: 100%;">
              <input style="color: black;font-size: 1em;background: white;" id="registry-input" type="text" placeholder="Email">
              <button id="registry-email-button" style="margin: unset;margin-left: 10px;min-width: 6em;font-size: 0.7em;">BACK UP</button>
              
          </div>
          <div class="welcome-modal-signup">
            <input type="checkbox" id="signup" /> Also sign me up for updates on Saito MAINNET launch and other project news.
          </div>
          <fieldset class="welcome-modal-explanation">
            <div><b>How does this work?</b> </div>
            <div>
            <p>
            On the Saito network - your data, and identity are yours. There is no login password, or password recovery. 
            </p>
          <p>
            Enter a password and email address here and your browser will encrypt a backup of your wallet file and email it to you. (Nothing is stored.)
            </p>
            </div>
          </fieldset>

      </div>
  </div>
  
  <div class="welcome-modal-exit tutorial-skip">
      <p>
          I know about wallets, take me to the good stuff.
      </p>
      <p>
          I'll back up later.
      </p>
      <i class="fas fa-arrow-right"></i>

  </div>
  
  </div>

  `;
}