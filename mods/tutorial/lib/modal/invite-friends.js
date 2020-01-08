const InviteFriendsTemplate = require('./invite-friends.template.js');

module.exports = InviteFriends = {

  render(app, data) {

    if (document.querySelector('.document-modal-content')) {
      document.querySelector('.document-modal-content').innerHTML = InviteFriendsTemplate();
    }

  },



  attachEvents(app, data) {

    document.querySelector('.tutorial-skip').onclick = () => {
      data.modal.destroy();
    }

    document.querySelector('.invite-friends-btn').onclick = () => {
      data.modal.destroy();
    }

  }

}



