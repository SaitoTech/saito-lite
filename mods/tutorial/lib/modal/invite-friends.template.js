module.exports = InviteFriendsTemplate = () => {
  
  return `
  <div class="welcome-modal-wrapper">
    <div class="welcome-modal-action">
      <div class="welcome-modal-left">
        <div class="welcome-modal-header">Invite Friends</h1></div>
        <div class="welcome-modal-main">
          <div style="margin:1em 0">How would you like to add a contact to Saito:</div>
	  <div style="">
	    <div class="welcome-invite-box generate-link-box">Generate Link</div>
	    <div class="welcome-invite-box scanqr-link-box">Scan QR Code</div>
	    <div class="welcome-invite-box address-link-box">Add by Saito address</div>
	  </div>
          <div class="welcome-modal-info">
            <fieldset style="margin-top:20px" class="welcome-modal-explanation">
              <div><b>What happens when I invite someone to Saito?</b></div>
              <div>Users you invite will be given a copy of your javascript bundle (so they are running the same applications). The Saito faucet will give both you and your friends a bonus in Saito tokens for helping spread work.</div>
            </fieldset>
          </div>
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

<style type="text/stylesheet">

.welcome-invite-box {
  float: left;
  height: 200px;
  width: 200px;
}


</style>

  `;
}
