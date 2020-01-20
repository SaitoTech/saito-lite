module.exports = ProfileAppspaceTemplate = (app) => {

  let html = "";

  html += `
  <link rel="stylesheet" href="/profile/style.css">
  <div class="email-appspace-profile">

    <div class="">

      <div class="grid-2">
        <div class="saito-address">Saito Address:</div>
        <div>${app.keys.returnIdentifierByPublicKey(app.wallet.returnPublicKey())}</div>
      </div>

      <div class="profile-option-info registering-saito-address-info">Registering a Saito address allows others to send you messages using your Saito username instead of your publickey. Click here to register.</div>

      <div class="grid-2">
        <div>Legacy Email:</div>
        <div>${app.keys.returnEmail(app.wallet.returnPublicKey())}</div>
      </div>

      <div class="profile-option-info registering-email-address-info">Providing a legacy email address simplifies backing up your account by letting your email yourself an encrypted copy of your wallet. Click here to register.</div>

      <div class="grid-2 grid-2-special">
        <div>Your Avatar:</div>
        <div></div>
      </div>

      <div id="profile-avatar" class="profile-avatar"><img style="max-width:100px;max-height:100px" src="${app.keys.returnIdenticon(app.wallet.returnPublicKey())}" /></div>
      <div class="profile-option-info upload-avatar-info">Upload an Avatar and your friends will see this instead of your standard image.</div>
      <div style="display:none"><input style="display:none" id="profile-upload-avatar" type="file" /></label></div>

  </div>
  `;

  return html;
}
