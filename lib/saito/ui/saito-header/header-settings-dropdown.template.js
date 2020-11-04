module.exports = HeaderSettingsDropdownTemplate = (app) => {

  let my_profile   = 1;
  let add_contacts = 1;
  let show_myqrcode  = 0;
  let show_qrcode  = 0;
  let show_settings  = 1;
  let show_backup  = 1;
  let show_restore = 1;
  let show_reset   = 0;

  if (app.modules.returnModule("QRScanner")) {
    show_qrcode = 1;
  }
  if (app.modules.returnModule("MyQRCode")) {
    show_myqrcode = 1;
  }


  let html = `
    <div id="settings-dropdown" class="header-dropdown">
      <div class="personal-info">
        <img class="profile-photo" />
        <div class="account-info">
          <div class="profile-identifier">anonymous account</div>
          <div class="profile-public-key"></div>
        </div>
    </div>

    <center><hr width="98%" style="color:#888"/></center>

    <div class="wallet-actions">
  `;

  if (show_backup) {
    html += `
      <div class="wallet-action-row" id="header-dropdown-backup-wallet">
        <span class="scan-qr-info"><i class="settings-fas-icon fas fa-copy"></i> Backup Access Keys</span>
      </div>
    `;
  }
  if (show_restore) {
    html += `
      <div class="wallet-action-row" id="header-dropdown-restore-wallet">
        <span class="scan-qr-info"><i class="settings-fas-icon fas fa-redo"></i> Restore Access Keys</span>
      </div>
    `;
  }
  if (my_profile) {
    html += `
      <div class="wallet-action-row" id="header-dropdown-my-profile">
        <span class="scan-qr-info"><i class="settings-fas-icon fas fa-user"></i> Public Profile </span>
      </div>
    `;
  }
  if (show_settings) {
    html += `
      <div class="wallet-action-row" id="header-dropdown-settings">
        <span class="scan-qr-info"><i class="settings-fas-icon fas fa-wrench"></i> Settings </span>
      </div>
    `;
  }
  if (add_contacts) {
    html += `
      <div class="wallet-action-row" id="header-dropdown-add-contacts">
        <span class="scan-qr-info"><i class="settings-fas-icon fas fa-user-friends"></i> Add Contacts </span>
      </div>
    `;
  }
  if (show_myqrcode) {
    html += `
      <div class="wallet-action-row" id="header-dropdown-myqrcode">
        <span class="scan-qr-info"><i class="settings-fas-icon fas fa-barcode"></i> QRCode </span>
      </div>
    `;
  }
  if (show_qrcode) {
    html += `
      <div class="wallet-action-row" id="header-dropdown-scan-qr">
        <span class="scan-qr-info"><i class="settings-fas-icon fas fa-qrcode"></i> Scan </span>
      </div>
    `;
  }
  if (show_backup) {
    html += `
      <div class="wallet-action-row" id="header-dropdown-backup-wallet">
        <span class="scan-qr-info"><i class="settings-fas-icon fas fa-copy"></i> Backup Wallet</span>
      </div>
    `;
  }
  if (show_reset) {
    html += `
      <div class="wallet-action-row" id="header-dropdown-reset-wallet">
        <span class="scan-qr-info"><i class="settings-fas-icon fas fa-redo"></i> Reset Wallet</span>
      </div>
    `;
  }
  html += `
    </div>
  `;

  return html;

}
