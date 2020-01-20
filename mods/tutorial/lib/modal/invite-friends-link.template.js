module.exports = InviteFriendsLinkTemplate = (app) => {
  
  return `
        <div class="welcome-modal-header">Your Invitation Link:</h1></div>
        <div class="welcome-modal-main">
          <div style="margin:1em 0">Share this link with your friends. Anyone who clicks on it will be setup with an account on the network and add you on chat when they join:</div>
    <div class="link-space">
      <input class="share-link" type="text" value="${app.browser.returnInviteLink()}"></input>
      <i class="fas fa-copy"></i>
    </div>
          <div class="welcome-modal-info">
            <div style="margin-top:20px" class="welcome-modal-explanation tip">
              <div><b>What happens when someone clicks on this link?</b> <i class="fas fa-info-circle"></i></div>
              <div class="tiptext">Users you invite will be given a copy of your javascript bundle (so they are running the same applications and have guaranteed version-compatibility). The Saito rewards module will give both you and your friends a bonus in Saito tokens for helping spread work.</div>
            </fieldset>
          </div>
        </div>
 

<style>

.welcome-modal-info {
  clear: both;
  font-size: 1.2em;
}

.link-space {
    display: flex;
}

.link-space i {
    font-size: 1.5em;
    line-height: 1.5em;
    margin: 0 10px;
    cursor:pointer;
}

.link-space i:hover {
    text-shadow: 2px 2px 2px #333;
}

</style>

`;

}
