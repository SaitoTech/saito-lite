module.exports = TransferManagerTemplate = (mode) => {

  if (mode == "scanner") {
    return `
      <div class="transfer-manager-container">
        
        <div class="scanner-placeholder"></div>
        <button class="super launch-scanner"><i class="fas fa-qrcode"></i> Scan</button>
      </div>
    `;
  } else {
    return `
      <div class="transfer-manager-container">
        <div id="qrcode" class="qrcode"></div>
      </div>
    `;
  }
}