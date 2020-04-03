const InviteFriendsQR = require('./qr/invite-friends-qr.js');
const InviteFriendsTemplate = require('./invite-friends.template.js');
const InviteFriendsLinkTemplate = require('./link/invite-friends-link.template');
const InviteFriendsPublickeyTemplate = require('./key/invite-friends-publickey.template');

function stopVideo() {
  let video = document.querySelector('video')
  if (video) { video.srcObject.getTracks().forEach(track => track.stop()); }
}

module.exports = InviteFriends = {

  render(app, data) {
    if (document.querySelector('.document-modal-content')) {
      document.querySelector('.document-modal-content').innerHTML = InviteFriendsTemplate();
    }
  },

  attachEvents(app, data) {
    var modal = document.getElementById('friends-modal');

    const startKeyExchange = async (publickey) => {
      salert("Adding Contact");
      if (!app.crypto.isPublicKey(publickey)) {
        publickey = await data.tutorial.addrController.returnPublicKey(publickey);
      }
      let encrypt_mod = app.modules.returnModule('Encrypt');
      encrypt_mod.initiate_key_exchange(publickey);
      modal.style.display = "none";
    }

    document.querySelector('.tutorial-skip').onclick = () => {
      stopVideo();
      data.modal.destroy();
    }

    document.querySelector('.generate-link-box').onclick = () => {
      document.querySelector('.welcome-modal-left').innerHTML = InviteFriendsLinkTemplate(app);
      document.querySelector('.fa-copy').onclick = () => {
        let text = document.querySelector('.share-link');
        text.select();
        document.execCommand('copy');
      }
    }

    document.querySelector('.scanqr-link-box').onclick = () => {
      let qrscanner = app.modules.returnModule("QRScanner");
      if (qrscanner) { qrscanner.startScanner(); }
//      data.stopVideo = stopVideo;
//      data.startKeyExchange = startKeyExchange;
//      InviteFriendsQR.render(app, data);
//      InviteFriendsQR.attachEvents(app, data);
    }

    document.querySelector('.address-link-box').onclick = () => {
      document.querySelector('.welcome-modal-left').innerHTML = InviteFriendsPublickeyTemplate(app);
      document.getElementById('add-contact-btn')
              .onclick = () => {
                let publickey = document.getElementById('add-contact-input').value;
                startKeyExchange(publickey);
              };
    }
  }

}
