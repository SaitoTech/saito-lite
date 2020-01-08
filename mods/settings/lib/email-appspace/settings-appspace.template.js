module.exports = SettingsAppspaceTemplate = (app) => {
  return `
  <link rel="stylesheet" href="/settings/style.css">
  <div class="email-appspace-settings">

    <h3>Your Network Settings:</h3>
  
    <div class="grid-1-2-columns">

      <div class="">

        <div class="grid-2">

          <div>public key:</div>
          <div>${app.wallet.returnPublicKey()}</div>

          <div>private key:</div>
          <div><input id="privatekey" type="password" value="${app.wallet.returnPrivateKey()}" class="password" /></div>

          <button id="reset-account-btn" class="reset-account-btn">Reset Account</button>
	  <div></div>

          <button id="backup-account-btn" class="backup-account-btn">Manual Backup</button>
	  <div></div>

          <button id="restore-account-btn" class="restore-account-btn">Restore Account</button>
	  <div></div>

        </div>

	<div id="settings-appspace" class="settings-appspace" style="clear:both;margin-top:20px"></div>

      </div>
    </div>

    <div style="display:none"><input id="settings-restore-account" class="settings-restore-account" style="" type="file" /></div>

  </div>
  `;
}
