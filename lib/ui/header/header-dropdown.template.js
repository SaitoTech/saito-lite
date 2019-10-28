module.exports = HeaderDropdownTemplate = () => {
  return `
    <div class="header-dropdown" style="display: none">
      <div class="header-dropdown-modules">
        <ul>
          <a href="/arcade"><li>Arcade</li></a>
          <a href="/chat"><li>Chat</li></a>
          <a href="/email"><li>Email</li></a>
          <a href="/forum"><li>Forum</li></a>
        </ul>
      </div>
      <div class="header-dropdown-settings">
        <ul>
          <li id="header-dropdown-reset-wallet">Reset Wallet</li>
          <li id="header-dropdown-load-wallet">Load Wallet</li>
          <li>Settings</li>
        </ul>
      </div>
    </div>
  `;
}