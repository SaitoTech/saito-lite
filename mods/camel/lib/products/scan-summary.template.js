module.exports = ScanSummaryTemplate = (app, data) => {

  let html = '';

  html = `
  <div class="summary-template">
    
  <h2>Product Scan Summary</h2>


  <div class="summary-grid grid-4-columns"></div>


  <div class="main-form-buttons">
    <button id='summary-exit' class='summary-exit'><i class="fas fa-link"></i> Return</button>
  </div>
  

  
</div>


  `;

  return html;

}
