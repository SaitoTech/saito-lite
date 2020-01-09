module.exports = InviteFriendsLinkTemplate = (app) => {
  
  return `
        <div class="welcome-modal-header">Your Invitation Link:</h1></div>
        <div class="welcome-modal-main">
          <div style="margin:1em 0">Share this link with your friends. Anyone who clicks on it will be setup will be given an account on the network and add you on chat when they join:</div>
	  <div style="">${app.browser.returnInviteLink()}</div>
          <div class="welcome-modal-info">
            <fieldset style="margin-top:20px" class="welcome-modal-explanation">
              <div><b>What happens when someone clicks on this link?</b></div>
              <div>Users you invite will be given a copy of your javascript bundle (so they are running the same applications and have guaranteed version-compatibility). The Saito faucet will give both you and your friends a bonus in Saito tokens for helping spread work.</div>
            </fieldset>
          </div>
        </div>
  `;

}
