module.exports = SettingsAppspaceTemplate = (app) => {

  html = `
  <link rel="stylesheet" href="/settings/style.css">
  <div class="email-appspace-settings">

    <h3>Activate / Disable Modules:</h3>
  
    <div class="grid-1-2-columns">

      <div class="">

	<h3>Wallet Management:</h3>

        <div class="grid-2">

          <div>public key:</div>
          <div>${app.wallet.returnPublicKey()}</div>

          <div>private key:</div>
          <div><input id="privatekey" type="password" value="${app.wallet.returnPrivateKey()}" class="password" /></div>

	</div>

        <button id="reset-account-btn" class="reset-account-btn" style="float:left;margin-right:15px;">Reset Account</button>
        <button id="backup-account-btn" class="backup-account-btn" style="float:left;margin-right:15px;">Manual Backup</button>
        <button id="restore-account-btn" class="restore-account-btn" style="float:left;margin-right:15px">Restore Account</button>

        </div>

	<h3>Installed Applications:L</h3>

	<div class="">

  `;
   
  for (let i = 0; i < app.options.modules.length; i++) {
    html += `
	<div class="">
	  <input type="checkbox" value="modules_mods_${i}" class="modules_mods_checkbox" name="modules_mods_${i}" id="${i}"`;
    if (app.options.modules[i].active == 1) { html += ' CHECKED'; }
    html += ` /> ${app.options.modules[i].name}
	</div>
   `;
  }
  html += `
	</div>

	<div id="settings-appspace" class="settings-appspace" style="clear:both;margin-top:20px"></div>

      </div>
    </div>

    <div style="display:none"><input id="settings-restore-account" class="settings-restore-account" style="" type="file" /></div>

  </div>
  `;

  return html;
}
