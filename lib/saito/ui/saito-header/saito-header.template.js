

let SaitoHeaderIconTemplate = (iface) => {
  let html = `
<a class="header-icon-fullscreen tip" href="${iface.link}">
  <i id="${iface.slug}" class="header-icon icon-med ${iface.icon_fa} ${iface.css_classes}">
  <div class="redicon"></div></i>
  <div class="tiptext headertip">${iface.name}</div>
</a>
`;
  return html;
}

module.exports = SaitoHeaderTemplate = (ifaces) => {
  let linkHtml = "";
  ifaces.forEach((iface, i) => {
    linkHtml += SaitoHeaderIconTemplate(iface);
  });
  let html = `
<a href="/">
  <img class="logo" src="/saito/img/logo.svg" >
</a>
<div id="header-icon-links" class="header-icon-links">
  ` + linkHtml +`
  <i id="navigator" class="header-icon icon-med fas fa-bars"></i>
  <i id="settings" class="header-icon icon-med fas fa-cog"></i>
</div>
  `;
  return html;
}

