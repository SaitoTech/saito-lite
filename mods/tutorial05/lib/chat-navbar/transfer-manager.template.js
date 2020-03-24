module.exports = TransferManagerTemplate = (mode) => {

  if (mode == "scanner") {
    return `
      <div class="transfer-manager-container">
        
        <div class="scanner-placeholder" style="border: 3px solid var(--saito-red); margin: 10vw; height: 80vw;"></div>
        <button class="super launch-scanner" style="margin: 0 10vw; width: 80vw;"><i class="fas fa-qrcode"></i> Scan</button>
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