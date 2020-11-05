const HeaderSettingsDropdownTemplate = require('./header-settings-dropdown.template');
// const HeaderSettingsIconTemplate = require('./header-settings-icon.template');
const HeaderDropdownTemplate = require('./header-dropdown.template');

module.exports = SaitoHeaderTemplate = (app, mod, ifaces) => {

  // let linkHtml = "";
  // 
  // ifaces.forEach((iface, i) => { linkHtml += HeaderSettingsIconTemplate(iface); });

  let html = `
    <div id="saito-header" class="header header-home">
      <a href="/"><img class="logo" src="/saito/img/logo.svg"></a>
      <div id="header-icon-links" class="header-icon-links">
        <div class="header-mini-wallet">
          <img class="header-profile-photo" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0MjAnIGhlaWdodD0nNDIwJyBzdHlsZT0nYmFja2dyb3VuZC1jb2xvcjpyZ2JhKDI0MCwyNDAsMjQwLDEpOyc+PGcgc3R5bGU9J2ZpbGw6cmdiYSgzOCwyMTcsMTMwLDEpOyBzdHJva2U6cmdiYSgzOCwyMTcsMTMwLDEpOyBzdHJva2Utd2lkdGg6Mi4xOyc+PHJlY3QgIHg9JzE2OCcgeT0nMCcgd2lkdGg9Jzg0JyBoZWlnaHQ9Jzg0Jy8+PHJlY3QgIHg9JzE2OCcgeT0nMjUyJyB3aWR0aD0nODQnIGhlaWdodD0nODQnLz48cmVjdCAgeD0nODQnIHk9JzAnIHdpZHRoPSc4NCcgaGVpZ2h0PSc4NCcvPjxyZWN0ICB4PScyNTInIHk9JzAnIHdpZHRoPSc4NCcgaGVpZ2h0PSc4NCcvPjxyZWN0ICB4PSc4NCcgeT0nODQnIHdpZHRoPSc4NCcgaGVpZ2h0PSc4NCcvPjxyZWN0ICB4PScyNTInIHk9Jzg0JyB3aWR0aD0nODQnIGhlaWdodD0nODQnLz48cmVjdCAgeD0nODQnIHk9JzE2OCcgd2lkdGg9Jzg0JyBoZWlnaHQ9Jzg0Jy8+PHJlY3QgIHg9JzI1MicgeT0nMTY4JyB3aWR0aD0nODQnIGhlaWdodD0nODQnLz48cmVjdCAgeD0nODQnIHk9JzI1Micgd2lkdGg9Jzg0JyBoZWlnaHQ9Jzg0Jy8+PHJlY3QgIHg9JzI1MicgeT0nMjUyJyB3aWR0aD0nODQnIGhlaWdodD0nODQnLz48cmVjdCAgeD0nODQnIHk9JzMzNicgd2lkdGg9Jzg0JyBoZWlnaHQ9Jzg0Jy8+PHJlY3QgIHg9JzI1MicgeT0nMzM2JyB3aWR0aD0nODQnIGhlaWdodD0nODQnLz48cmVjdCAgeD0nMCcgeT0nMzM2JyB3aWR0aD0nODQnIGhlaWdodD0nODQnLz48cmVjdCAgeD0nMzM2JyB5PSczMzYnIHdpZHRoPSc4NCcgaGVpZ2h0PSc4NCcvPjwvZz48L3N2Zz4=">
          <span class="header-username">fzVHcCpg1ZBQg3mDQpDSFhAmVYFAhD2qDhR6ow9ejSiv</span>
          <span class="header-balance">12.5 Saito</span>
          <i class="header-icon icon-med fas fa-wallet"></i>
        </div>
        <i id="navigator" class="header-icon icon-med fas fa-bars"></i>
        <i id="settings" class="header-icon icon-med fas fa-cog"></i>
      </div>
      ${HeaderDropdownTemplate(ifaces)}
      ${HeaderSettingsDropdownTemplate(app)}
    </div>
  `;
  return html;

}
