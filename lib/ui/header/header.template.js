module.exports = HeaderTemplate = (ddmods) => {
  html = `
    <a href="/">
        <img class="logo" src="/saito/img/logo.svg" >
      </a>
  `;
  html += `<div id="header-icon-links" class="header-icon-links">`;
  for (let i = 0; i < ddmods.length; i++) {
    let link = (ddmods[i].browser_active === 1) ? "javascript:void(0)" : ddmods[i].returnLink();
    let classes = (ddmods[i].browser_active === 1) ? ddmods[i].icon_fa + " header-icon-disabled" : ddmods[i].icon_fa;
    html += `<a class="header-icon-fullscreen tip" href="${link}">
             <i id="${ddmods[i].returnSlug()}" class="header-icon icon-med ${classes}">
             <div class="redicon"></div></i>
             <div class="tiptext headertip">${ddmods[i].name}</div>
             </a>`;
   }
   html += `
      <i id="navigator" class="header-icon icon-med fas fa-bars"></i>
      <i id="settings" class="header-icon icon-med fas fa-cog"></i>
  `;
  html += `</div>`;

  return html;
}
