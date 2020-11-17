module.exports = ArcadeCreateGameOverlayTemplate = () => {
  return `<div id="game-invite-controls" class="game-invite-controls">
    <div id="public-invite">
      <button id="game-create-btn" class="game-create-btn">Public Invitation</button>
      <div>Anyone can take your invitation.</div>
    </div>
    <div id="friend-invite">
    <button id="friend-invite-btn" class="friend-invite-btn">Invite Friends</button>
    <input type="text" id="game-invitees" class="game-invitees" placeholder="Enter names or addresses, comma separated" />
    </div>
    <div id="link-invite">
      <button id="link-invite-btn" class="link-invite-btn">Share a link</button>
      <textarea id="link-invite-input" style="display:none"></textarea>
    </div>
  </div>`;
}
