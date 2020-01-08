module.exports = ProfileAppspaceTemplate = (app) => {
  return `
  <link rel="stylesheet" href="/profile/style.css">
  <div class="email-appspace-profile">

    <div class="">

      <div class="grid-2">
        <div class="saito-address">Saito Address:</div>
        <div>unregistered</div>
      </div>

      <div class="registering-saito-address-info">Registering a Saito address allows others to send you messages using your Saito username instead of having to copy and paste your publickey.</div>

      <div class="grid-2">
        <div>Legacy Email:</div>
        <div>unregistered</div>
      </div>

      <div class="registering-email-address-info">Registering an email address provides some initial tokens for using the network and provides an email address we can use to send you a backup copy of your wallet.</div>

      <div class="grid-2 grid-2-special">
        <div>Avatar:</div>
        <div></div>
      </div>

        <div><img style="max-width:100px;max-height:100px" src="${app.keys.returnIdenticon(app.wallet.returnPublicKey())}" /></div>
        <div class="upload-avatar-info">Upload an Avatar and your friends will see this instead of your standard image. It may take a bit of time until your new friends see it.</div>

  </div>
  `;
}
