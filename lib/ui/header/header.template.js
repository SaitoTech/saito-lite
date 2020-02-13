module.exports = HeaderTemplate = (ddmods) => {
  html = `
    <a href="">
        <img class="logo" src="/saito/img/logo.svg" >
      </a>
  `;
  html += `<div id="header-icon-links" class="header-icon-links">`;
  for (let i = 0; i < ddmods.length; i++) {
    html += `<a class="header-icon-fullscreen tip" href="${ddmods[i].returnLink()}">
             <i id="${ddmods[i].returnSlug()}" class="header-icon icon-med ${ddmods[i].icon_fa}">
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
