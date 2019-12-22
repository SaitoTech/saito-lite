module.exports = SettingsTemplate = () => {
  return `
      <div class="settings container">
          <div>
               <div id="theme-mode">
                   <i id="theme-light" class="icon-med fas fa-sun"></i>
                   <i id="theme-dark" style="display:none;" class="icon-med fas fa-moon"></i>
               </div>
               <h2>Settings</h2>
               <div class="settings-button-table">
                   <button class="settings-reset-button">RESET</button>
                   <button class="settings-import-button">IMPORT</button>
                   <button class="settings-backup-button">BACKUP</button>
                   <button class="settings-fee-button">CHANGE FEE</button>
               </div>

               <div class="settings-dns">
                   <h2>DNS</h2>
                   <div class="settings-dns-table">
                      <div class="settings-dns-row">
                          <span>Domain:</span><div class="dns-domain">saito</div>
                      </div>
                      <div class="settings-dns-row">
                          <span>Host:</span><div class="dns-host">app.saito.network</div>
                      </div>
                      <div class="settings-dns-row">
                          <span>Key:</span>
                          <div class="dns-key">npDwmBDQafC14...</div>
                      </div>
                   </div>
               </div>
          </div>
          <input id="file-input" class="file-input" type="file" name="name" style="display:none;" />
      </div>
  `;
}