module.exports = ModalRegisterEmailTemplate = () => {

  return `  
  <div class="welcome-modal-wrapper">
    <div class="welcome-modal-action">
      <div class="welcome-modal-left">
        <div class="welcome-modal-header">Connect an Email Address:</h1></div>
        <div class="welcome-modal-main">
          <div style="margin:1em 0">Email yourself an encrypted backup of your wallet:</div>
          <div style="display:flex;">
      <input style="width:100%; color:black; font-size:1em; background:white;margin:0 1em 0 0;" id="registry-input" type="text" placeholder="email@domain.com">
      <input style="display: var(--saito-wu);" id="name" name="name" type="text"></input>
      <button id="backup-email-button" style="clear:both; margin:unset; margin-left:0px; min-width:6em; font-size:0.7em;">EMAIL BACKUP</button>
          </div>
          <div style="font-size:0.9em;height:30px;margin-top:10px"><input type="checkbox" id="signup" style="float:left;width:2em;height:2em;margin-right:10px" checked /><span style="padding-top:8px"> send periodic updates on important Saito news (max monthly)</span></div>
        </div>
        <div class="welcome-modal-info">
            <div class="tip"><b>How does this work? <i class="fas fa-info-circle"></i></b>
              <div class="tiptext">Your browser will encrypt your wallet and email you a copy. No-one but you will ever have access to your private keys. If you opt-in for email your browser will separately request periodic updates from the Saito project.</div>
            </div>
          </div>
      </div>
    </div>

    <div class="welcome-modal-exit tutorial-skip">
      <p>
          I've already got a backup.
      </p>
      <i class="fas fa-arrow-right"></i>
    </div>
  </div>
  `;

}

