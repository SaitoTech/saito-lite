module.exports = InviteFriendsLinkTemplate = (app) => {
  return `
    <div class="welcome-modal-header">
      <h1>Your Invitation Link:</h1>
    </div>
    <div class="welcome-modal-main">
      <div class="welcome-modal-text">Share this link with your friends. Users you invite will be given a copy of your javascript bundle (Any games or applications you've installed via the appstore will be included). The Saito rewards module will give both you and your friends a bonus in Saito tokens for helping spread work.</div>
      <div class="link-space">
        <input class="share-link" type="text" value="${app.browser.returnInviteLink()}"></input>
        <i class="fas fa-copy"></i>
      </div>
    </div>
    
<style>
.welcome-modal-info {
  clear: both;
  font-size: 1.2em;
}
.welcome-modal-text {
  margin:1em 0;
  font-size: 1.5em;
  font-weight: bold;
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
