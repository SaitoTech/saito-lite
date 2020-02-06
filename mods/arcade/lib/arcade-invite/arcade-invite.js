const ArcadeInviteTemplate = require('./arcade-invite.template');

module.exports = ArcadeInvite = {
  render(app, data) {
    let arcade_invite_container = document.getElementById('arcade-invite-container');
    if (arcade_invite_container) {
      let { invite_payload } = data.arcade;
      arcade_invite_container.innerHTML = ArcadeInviteTemplate(invite_payload);
    }
  },

  attachEvents(app, data) {
    let game_spinner = document.getElementById('invite-game-spinner');
    let arcade_initializer = document.getElementById('manage-invitations');
    let play_button = document.getElementById('invite-play-button');

    play_button.onclick = () => {
      arcade_initializer.style.display = 'none';
      game_spinner.style.display = 'block';
    }
  }
}
