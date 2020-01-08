module.exports = ProfileAppspaceTemplate = (app) => {
  return `
  <link rel="stylesheet" href="/profile/style.css">
  <div class="email-appspace-profile">

    <div class="">     

        <div id="qrcode"></div>
 
        <div>${app.browser.returnInviteLink()}</div>
     
        <div style="margin-top:15px;display:inline;width:100px;font-weight:bold;">Saito Address:</div>
        <div style="display:inline">unregistered</div>
        <div style="clear:both;margin-top:10px;font-size:0.9em;">Registering a Saito address allows others to send you messages using your Saito username instead of having to copy and paste your publickey.</div>

        <div style="margin-top:15px;display:inline;width:100px;font-weight:bold;">Legacy Email:</div>
        <div style="display:inline">unregistered</div>
        <div style="clear:both;margin-top:10px;font-size:0.9em;">Registering an email address provides some initial tokens for using the network and provides an email address we can use to send you a backup copy of your wallet.</div>

        <div style="margin-top:15px">Avatar:</div>
        <div class="profile-avatar" id="profile-avatar"><img style="max-width:200px;max-height:200px" src="${app.keys.returnIdenticon(app.wallet.returnPublicKey())}" /></div>
        <div style="clear:both;margin-top:10px;font-size:0.9em;">Upload an Avatar and your friends will see this instead of your standard image. It may take a bit of time until your new friends see it.</div>

    </div>

    <div style="display:none"><input id="profile-update-avatar" class="profile-update-avatar" style="" type="file" /></div>

  </div>
  `;
}
