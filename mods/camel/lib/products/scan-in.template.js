module.exports = ScanManagerTemplate = () => {

  let html = '';

  html = `
  <div class="scan-information">

    <h2>Scan QR Code</h2>

    <p><hr /></p>

    <div class="scanner-shim">
      <div class="loading">
    
        <p>
          Please be patient while we initialize your camera 
        </p>

        <div class="launch-scanner">Launch Scanner</div>

      </div>
    
    </div>
    <input type="hidden" class="product_id" id="product_id"></input>
  </div>
  `;

  return html;

}
