module.exports = InviteFriendsTemplate = () => {
  
  return `
  <div class="welcome-modal-wrapper">
    <div class="welcome-modal-action">
      <div class="welcome-modal-left">
        <div class="welcome-modal-header">Invite Friends</h1></div>
        <div class="welcome-modal-main">
          <div style="margin:1em 0">Adding a friend brings them into the Saito community:</div>
          <div style="display:flex;">
      <input style="width:60%; color:black; font-size:1em; background:white;margin:0 1em 0 0;" id="registry-input" type="text" placeholder="email"><b>@saito</b>
      <button id="registry-email-button" style="clear:both; margin:unset; margin-left:0px; min-width:6em; font-size:0.7em;">REGISTER USERNAME</button>
          </div>
        </div>
        <div class="welcome-modal-info">
          <fieldset style="margin-top:20px" class="welcome-modal-explanation">
            <div><b>What is a Saito username?</b></div>
            <div>As a thanks for helping spread the word, the Saito faucet will give both you and your friends a bonus in Saito tokens once they start using the network.</div>
          </fieldset>
        </div>
      </div>
    </div>
  
    <div class="welcome-modal-exit tutorial-skip">
      <p>
          Thanks, but...
      </p>
      <p>
          Maybe later.
      </p>
      <i class="fas fa-arrow-right"></i>
    </div>
  
  </div>

  `;
}
