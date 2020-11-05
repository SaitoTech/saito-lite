
module.exports = SaitoHeaderTemplate = (app, mod) => {

  let html = `

    <div id="saito-header" class="header header-home">
      <a href="/"><img class="logo" src="/saito/img/logo.svg"></a>
      <div id="header-icon-links" class="header-icon-links">
        <div id="header-mini-wallet" class="header-mini-wallet">
          <img id="header-profile-photo" class="header-profile-photo" src="">
          <span id="header-username" class="header-username"></span>
          <span id="header-balance" class="header-balance">12.5 SAITO</span>
          <i class="header-icon icon-med fas fa-wallet"></i>
        </div>
        <i id="navigator" class="header-icon icon-med fas fa-bars"></i>
      </div>

      <div id="modules-dropdown" class="header-dropdown">
        <ul id="modules-dropdown-list"></ul>
      </div>

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
       </div>

     </div>
  `;
  return html;

}
