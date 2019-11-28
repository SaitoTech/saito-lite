module.exports = SettingsAppspaceTemplate = (app) => {
  return `
  <link rel="stylesheet" href="/settings/style.css">
  <div class="email-appspace-settings">
      <h3>Network Keys</h3>
  
      <div class="grid-1-2-columns">
          <div id="qrcode"></div>
          <div>
              <div class="grid-2">
                  <div>public:</div>
                  <div>${app.wallet.returnPublicKey()}</div>
                  <div>private:</div>
                  <div>
                      <input id="privatekey" type="password" value="${app.wallet.returnPrivateKey()}" class="password" />
                  </div>
                  <div>address:</div>
                  <div>${app.keys.returnIdentifierByPublicKey(app.wallet.returnPublicKey()) || "no address registered"}</div>
              </div>
              <button id="reset-account-btn" class="reset-account-btn">Reset Account</button>
          </div>
      </div>
  </div>
  `;
}
