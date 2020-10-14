module.exports = ScanManagerTemplate = () => {

  let html = '';

  html = `
  <div class="scan-information">

    <h2>Scan QR Code</h2>

    <p><hr /></p>

    <div class="loading">

      <p>
        Please be patient while we initialize your camera 
      </p>

      <div class="launch-scanner">Launch Scanner</div>

      <p></p>

      <div class="qrcode" id="qrcode"></div>

    </div>

  </div>
  `;

  return html;

}
