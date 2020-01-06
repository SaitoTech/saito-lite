module.exports = ProfileAppspaceTemplate = (app) => {
  return `
  <link rel="stylesheet" href="/profile/style.css">
  <div class="email-appspace-profile">

    <h3>Your Profile</h3>

    <div class="info">
      Your profile contains basic information about you: your Saito address, username, avatar, off-chain encryption keys and location of any publicly-accessible archive node. 
    </div>

    <div class="grid-2">

      <div>Your Saito Address:</div>
      <div id="qrcode"></div>

      <div>Name:</div>
      <div><a href="">david@saito.tech</a></div>

      <div>Avatar:</div>
      <div class="profile-avatar" id="profile-avatar"><img src="${app.keys.returnIdenticon(app.wallet.returnPublicKey())}" /></div>

      <div>Archve Node:</div>
      <div>https://saito.io</div>

    </div>

    <input id="profile-update-avatar" class="profile-update-avatar" style="display:none" type="file" />

  </div>
  `;
}
