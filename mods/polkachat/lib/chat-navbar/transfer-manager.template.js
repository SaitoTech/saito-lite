module.exports = TransferManagerTemplate = (mode) => {

alert("MODE: " + mode);

  if (mode == "scanner") {
    return `
      <div class="transfer-manager-container">
        <div class="scanner-placeholder"></div>
        <button class="super launch-scanner"><i class="fas fa-qrcode"></i> Scan</button>
      </div>
    `;
  };


  if (mode == "qrcode") { 
    return `
      <div class="transfer-manager-container">
        <div id="qrcode" class="qrcode"></div>
      </div>
    `;
  }
}

