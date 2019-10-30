module.exports = EmailAppspaceTemplate = (app) => {
  return `
  <link rel="stylesheet" href="/settings/style.css">
  <div class="email-appspace-settings">

    <h3>Network Keys</h3>

    <div id="qrcode"></div>

    <div class="monospace settings-grid">
        <div class="grid-title">public:</div>
        <div>${app.wallet.returnPublicKey()}</div>
        <div class="grid-title">private:</div>
        <div><input id="privatekey" type="password" value="${app.wallet.returnPrivateKey()}" class="password" /></div>
        <div class="grid-title">address:</div>
        <div>${app.keys.returnIdentifierByPublicKey(app.wallet.returnPublicKey()) || "no address registered"}</div>

    </div>
    <div class="settings-buttons">
        <input type="button" class="button button-secondary" id="reset-account-btn" class="reset-account-btn" value="Reset Account" />
    </div>
  </div>
  `;
}
