module.exports = HeaderSettingsDropdownTemplate = () => {
  return `
    <div id="settings-dropdown" class="header-dropdown">
      <ul>
        <li id="header-dropdown-reset-wallet">Reset Wallet</li>
        <li id="header-dropdown-load-wallet">Load Wallet</li>
        <li>Settings</li>
        <a href="/qrscanner"><li>Scan QR</li></a>
      </ul>
    </div>
  `;
}