module.exports = SettingsAppspaceTemplate = (app) => {

  html = `
  <link rel="stylesheet" href="/settings/style.css">
  <div class="email-appspace-settings">    
  
    <div class="settings-grid">

      <div class="settings-wallet-management">

	      <h3>Wallet Management:</h3>

        <div class="grid-2">

          <div>public key:</div>
          <div>${app.wallet.returnPublicKey()}</div>

          <div>private key:</div>
          <div>
            <input id="privatekey" type="text" value="${app.wallet.returnPrivateKey()}" class="password" />
            <i class="see-password fas fa-eye" id="see-password"></i>
          </div>

	      </div>

        <div class="settings-buttons">
          <button id="reset-account-btn" class="reset-account-btn"">Reset Account</button>
          <button id="backup-account-btn" class="backup-account-btn"">Manual Backup</button>
          <button id="restore-account-btn" class="restore-account-btn">Restore Account</button>
        </div>
      </div>

      <div class="settings-app-management">

        <h3>Activate / Disable Modules:</h3>
	      <h4>Installed Applications:</h4>
        <div class="settings-app-list">
  `;
   
  for (let i = 0; i < app.options.modules.length; i++) {
    html += `
  <div class="settings-app-select">
  <label class="s-container">${app.options.modules[i].name}
	  <input type="checkbox" value="modules_mods_${i}" class="modules_mods_checkbox" name="modules_mods_${i}" id="${i}"`;
    if (app.options.modules[i].active == 1) { html += ' CHECKED'; }
    html += ` /> <span class="s-checkmark"></span> 
    </label>
	</div>
   `;
  }
  html += `
        </div>
      </div>

	    <div id="settings-appspace" class="settings-appspace"></div>

    </div>
  </div>

  <div style="display:none"><input id="settings-restore-account" class="settings-restore-account" type="file" /></div>

</div>
  `;

  return html;
}

