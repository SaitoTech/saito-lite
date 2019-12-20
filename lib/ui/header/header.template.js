module.exports = HeaderTemplate = (ddmods) => {
  html = `
    <a href="">
        <img class="logo" src="/saito/img/logo.svg" >
      </a>
  `;
  html += `<div id="header-icon-links" class="header-icon-links">`;
  for (let i = 0; i < ddmods.length; i++) {
    html += `<a class="header-icon-fullscreen" href="${ddmods[i].returnLink()***REMOVED***"><i id="${ddmods[i].returnSlug()***REMOVED***" class="header-icon icon-med ${ddmods[i].icon_fa***REMOVED***"></i></a>`;
   ***REMOVED***
   html += `
      <i id="navigator" class="header-icon icon-med fas fa-bars"></i>
      <i id="settings" class="header-icon icon-med fas fa-cog"></i>
  `;
  html += `</div>`;

  return html;
***REMOVED***
