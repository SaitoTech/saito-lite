const ArcadeInviteTemplate = require('./arcade-invite.template');
const ArcadeLoadedTemplate = require('../arcade-main/arcade-loaded.template');

module.exports = ArcadeInvite = {
  render(app, data) {
    let arcade_invite_container = document.getElementById('arcade-invite-container');
    if (arcade_invite_container) {
      if (data.game_id) {
        arcade_invite_container.innerHTML = ArcadeLoadedTemplate();
      } else {
        let { tx } = data.arcade.invite_payload;
        arcade_invite_container.innerHTML = ArcadeInviteTemplate({ publickey: tx.from[0].add });
      }
    }
  },

  attachEvents(app, data) {
    let game_spinner = document.getElementById('invite-game-spinner');
    let arcade_initializer = document.getElementById('manage-invitations');
    let play_button = document.getElementById('invite-play-button');

    play_button.onclick = () => {
      arcade_initializer.style.display = 'none';
      game_spinner.style.display = 'block';

      let { tx } = data.arcade.invite_payload;
      tx = app.wallet.createRawTransaction(tx);

      let txmsg = tx.returnMessage();

      if (txmsg.players_needed == 2) {
        let accept_tx = data.arcade.createAcceptTransaction(tx);
        data.arcade.app.network.propagateTransaction(accept_tx);
      }
    }
  }
}
