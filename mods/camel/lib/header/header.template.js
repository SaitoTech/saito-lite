module.exports = HeaderTemplate = (ddmods) => {
  html = `
    <a href="/camel">
      <img class="logo major-logo" src="/camel/img/camel.png" />
      <img class="logo powered-by" src="/camel/img/dreamscape-logo.png" />
    </a>
      <i id="settings" class="header-icon icon-med fas fa-cog"></i>
      <i id="scan-now" class="header-icon icon-med fas fa-qrcode"></i>

  <div style="display:none"><input id="settings-restore-account" class="settings-restore-account" type="file" /></div>

  `;
  html += `</div>`;

  return html;
}
