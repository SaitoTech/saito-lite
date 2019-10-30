module.exports = QRScannerTemplate = () => {
  return `
    <button class="file-button">UPLOAD</button>
    <video playsinline autoplay></video>
    <canvas style="display: none" id="qr-canvas"></canvas>
    <input style="display: none" id="file-input" type="file">
  `
}