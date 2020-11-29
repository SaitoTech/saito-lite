module.exports = ArcadeInviteTemplate = ({publickey}) => {
  return `
    <h2 class="arcade-invite-title">Game Invite</h2>
    <div class="loader" id="invite-game-spinner"></div>
    <div class="arcade-invite-initializer" id="manage-invitations">
      <p class="arcade-invite-description" id="arcade-invite-description">
        <span class="acrade-invite-address" id="inviting-address">${publickey}</span> has invited you to a game. Would you like to play?
      </p>
      <button id="invite-play-button">PLAY</button>
    </div>
  `;
}