module.exports = TransferManagerTemplate = (mode) => {

  if (mode == "scanner") {
    return `
      <div class="transfer-manager-container">
        <h3>Click Button to Scan:</h3>
        <div class="button launch-scanner">launch scanner</div>
      </div>
    `;
  } else {
    return `
      <div class="transfer-manager-container">
        <h3>Your QRCode:</h3>
        <div id="qrcode" class="qrcode"></div>
      </div>
    `;
  }
}

