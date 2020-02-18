module.exports = SettingsAppspaceTemplate = (app) => {

  let modules_html = app.options.modules
    .map((mod, i) => {
      let CHECKED = mod.active ? 'CHECKED': '';
      return `
        <div class="settings-app-select">
          <label class="s-container">${mod.name}
            <input
              type="checkbox"
              value="modules_mods_${i}"
              class="modules_mods_checkbox"
              name="modules_mods_${i}" id="${i}" ${CHECKED}/>
            <span class="s-checkmark"></span>
          </label>
         </div>
      `;
    })
    .join('');

  return `
  <link rel="stylesheet" href="/settings/style.css">
  <div class="email-appspace-settings">

    <div class="settings-grid">

      <div class="settings-wallet-management">

	      <h3>Wallet Management:</h3>

        <div class="grid-2">

          <div class="public-key">public key:</div>
          <div>${app.wallet.returnPublicKey()}</div>

          <div>private key:</div>
          <div class="private-key">
            <input id="privatekey" type="text" value="${app.wallet.returnPrivateKey()}" class="password" />
            <i class="see-password fas fa-eye" id="see-password"></i>
          </div>

	      </div>

        <div class="settings-buttons">
          <button id="reset-account-btn" class="reset-account-btn"">Reset Account</button>
          <button id="backup-account-btn" class="backup-account-btn"">Manual Backup</button>
          <button id="restore-account-btn" class="restore-account-btn">Restore Account</button>
          <button id="delete-account-btn" class="delete-account-btn">Delete Account</button>
        </div>
      </div>

      <div class="settings-app-management">

        <h3>Activate / Disable Modules:</h3>
	      <h4>Installed Applications:</h4>
        <div class="settings-app-list">
        ${modules_html}
        </div>
      </div>

	    <div id="settings-appspace" class="settings-appspace"></div>

    </div>
  </div>

  <div style="display:none"><input id="settings-restore-account" class="settings-restore-account" type="file" /></div>

</div>
  `;
}

