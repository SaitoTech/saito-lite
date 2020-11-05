const HeaderSettingsDropdownTemplate = require('./header-settings-dropdown.template');
// const HeaderSettingsIconTemplate = require('./header-settings-icon.template');
const HeaderDropdownTemplate = require('./header-dropdown.template');

module.exports = SaitoHeaderTemplate = (app, mod, state) => {

  // let linkHtml = "";
  // 
  // ifaces.forEach((iface, i) => { linkHtml += HeaderSettingsIconTemplate(iface); });
  let name = state.publicId ? state.publicId : state.pubkey;
  let html = `
    <div id="saito-header" class="header header-home">
      <a href="/"><img class="logo" src="/saito/img/logo.svg"></a>
      <div id="header-icon-links" class="header-icon-links">
        <div id="header-mini-wallet" class="header-mini-wallet">
          <img class="header-profile-photo" src="${state.profilePhoto}">
          <span class="header-username">${name}</span>
          <span class="header-balance">12.5 Saito</span>
          <i class="header-icon icon-med fas fa-wallet"></i>
        </div>
        <i id="navigator" class="header-icon icon-med fas fa-bars"></i>
      </div>
      ${HeaderDropdownTemplate(state.ifaces)}
      ${HeaderSettingsDropdownTemplate(app)}
    </div>
  `;
  return html;

}
