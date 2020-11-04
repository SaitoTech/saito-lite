module.exports = HeaderSettingsIconTemplate = (iface) => {
  return `
    <a class="header-icon-fullscreen tip" href="${iface.link}">
      <i id="${iface.slug}" class="header-icon icon-med ${iface.icon_fa} ${iface.css_classes}">
      <div class="redicon"></div></i>
      <div class="tiptext headertip">${iface.name}</div>
    </a>
  `;
}
