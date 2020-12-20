module.exports = QRScannerTemplate = (mode) => {
  return `
    <div class="transfer-manager-container">
      <div class="scanner-placeholder"></div>
      <button class="super launch-scanner"><i class="fas fa-qrcode"></i> Scan</button>
    </div>
  `;
}
