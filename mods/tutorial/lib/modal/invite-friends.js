const InviteFriendsTemplate = require('./invite-friends.template.js');
const InviteFriendsLinkTemplate = require('./invite-friends-link.template.js');
const InviteFriendsPublickeyTemplate = require('./invite-friends-publickey.template.js');

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

    document.querySelector('.generate-link-box').onclick = () => {
      document.querySelector('.welcome-modal-left').innerHTML = InviteFriendsLinkTemplate(app);
    }

    document.querySelector('.scanqr-link-box').onclick = () => {
      alert("Loading Scanner!");
    }

    document.querySelector('.address-link-box').onclick = () => {
      document.querySelector('.welcome-modal-left').innerHTML = InviteFriendsPublickeyTemplate(app);


      document.querySelector('#add-contact-btn').onclick = () => {
	alert("Adding Contact");
      }

    }

  }

}



