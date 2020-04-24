module.exports = HeaderTemplate = (ddmods) => {
  html = `
    <a href="/covid19">
      <img class="logo major-logo" src="/covid19/dhbgloballogo.png" />
      <img class="logo powered-by" src="/covid19/dreamscape-logo.png" />
    </a>
      <i id="settings" class="header-icon icon-med fas fa-cog"></i>

  <div style="display:none"><input id="settings-restore-account" class="settings-restore-account" type="file" /></div>

  `;
  html += `</div>`;

  return html;
}
