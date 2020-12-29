module.exports = AppstoreAppDetailsTemplate = (app, data) => {

  var unixtime = new Date(data.module.unixtime);

  let html = `  
  <div class="appstore-app-install-content">

    <div class="appstore-app-install-image">
  `;

  if (data.image) {
    html += `      <div style='background: ${data.image}; background-repeat: no-repeat; background-size: cover;width:100%;height:100%'></div> `;
  } else {
    html += `      <img src="/saito/img/dreamscape.png" /> `;
  }

  html += `
      <div class="appstore-app-install-name">${data.module.name}</div>
    </div>

    <div class="appstore-app-install-left">

      <div class="appstore-app-install-description">${data.module.description}</div>

      <div class="appstore-app-istall-details grid-2">

        <div>Version:</div><div class="appstore-app-install-version">${data.module.version}</div>

        <div>Publisher:</div><div class="appstore-app-install-publickey">${data.module.publickey}</div>

        <div>Time:</div><div class="appstore-app-install-unixtime">${unixtime.toUTCString()}</div>

      </div>

    </div>

    <button id="appstore-app-install-confirm-btn" class="appstore-app-install-confirm-btn">INSTALL</button>
  
    <div class="tip">Block Data <i class="fas fa-info-circle"></i>

    <div class="tiptext">

    <div class="grid-2">
      <div>Block hash:</div>
      <div class="appstore-app-install-bsh">${data.module.bsh}</div>
      <div>Block ID:</div>
      <div class="appstore-app-install-bid">${data.module.bid}</div>
    </div>

    </div>

  </div>

  </div>

  `;


  return html;

}
