module.exports = HeaderTemplate = (ddmods) => {
  html = `
    <a href="/covid19">
        <img class="logo" src="/saito/img/logo.svg" >
      </a>
      <i id="settings" class="header-icon icon-med fas fa-cog"></i>

  <div style="display:none"><input id="settings-restore-account" class="settings-restore-account" type="file" /></div>

  `;
  html += `</div>`;

  return html;
}
