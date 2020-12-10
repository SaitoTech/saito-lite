module.exports = PhoneScanReturnTemplate = (content) => {

let html = '';

  html = `
  <div class="user-scan-result-wrapper">
    
  <h2>Product Scan Summary</h2>


  <div class="user-scan-result">
    <center>
      <div class="panda-wrapper">
        <div class="rotator"></div>
        <div class="panda"></div>
      </div>
    </center>
  </div>


  <div class="main-form-buttons">
    <button id='summary-exit' class='summary-exit'><i class="fas fa-link"></i> Return</button>
  </div>
    
</div>


  `;

  return html;
}