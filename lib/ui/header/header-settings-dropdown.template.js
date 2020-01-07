module.exports = HeaderSettingsDropdownTemplate = (app) => {

  let my_profile   = 1;
  let add_contacts = 1;
  let show_qrcode  = 0;
  let show_settings  = 1;
  let show_backup  = 0;
  let show_reset   = 0;

  if (app.modules.returnModule("QRScanner")) {
    show_qrcode = 1;
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
<!--
    <button class="manage-account">Manage Profile</button>
-->
    <center><hr width="98%" style="color:#888"/></center>

    <div class="wallet-actions">
  `;
  if (my_profile) {
    html += `
      <div class="wallet-action-row" id="header-dropdown-my-profile">
        <span class="scan-qr-info"><i class="settings-fas-icon fas fa-user"></i> My Profile </span>
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
  if (show_settings) {
    html += `
      <div class="wallet-action-row" id="header-dropdown-settings">
        <span class="scan-qr-info"><i class="settings-fas-icon fas fa-wrench"></i> Settings </span>
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
