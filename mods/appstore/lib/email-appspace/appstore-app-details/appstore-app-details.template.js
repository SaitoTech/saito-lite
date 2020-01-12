module.exports = AppstoreAppDetailsTemplate = (app) => {
  return `

<div class="appstore-app-install-overlay">

  <div class="appstore-app-install-content">

    <div class="appstore-app-install-image">
      <img src="/saito/img/dreamscape.png" />
    </div>

    <div class="appstore-app-install-name"></div>

    <div class="appstore-app-install-description"></div>

    <div class="appstore-app-install-version"></div>

    <div class="appstore-app-install-publickey"></div>

    <div class="appstore-app-install-unixtime"></div>

    <div class="appstore-app-install-bsh"></div>

    <div class="appstore-app-install-bid"></div>

    <button id="appstore-app-install-confirm-btn" class="appstore-app-install-confirm-btn">INSTALL</button>
  
  </div>

</div>
  `;
}
