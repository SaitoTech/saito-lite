const HeaderSettingsDropdownTemplate = require('./header-settings-dropdown.template');
const HeaderSettingsIconTemplate = require('./header-settings-icon.template');

module.exports = SaitoHeaderTemplate = (app, mod, ifaces) => {

  let linkHtml = "";

  ifaces.forEach((iface, i) => { linkHtml += HeaderSettingsIconTemplate(iface); });

  let html = `
    <div id="saito-header" class="header header-home">
      <a href="/"><img class="logo" src="/saito/img/logo.svg" ></a>
      <div id="header-icon-links" class="header-icon-links">
        ${linkHtml}
        <i id="settings" class="header-icon icon-med fas fa-cog"></i>
      </div>
      ${HeaderSettingsDropdownTemplate(app)}
    </div>
  `;
  return html;

}

