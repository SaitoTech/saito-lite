module.exports = UpdateOrderTemplate = (app, data) => {

  let html = '';

  html = `
  <div class="order-template">
    
  <h2>Order</h2>

  <div class="order-head grid-2-1-columns">
    <div class="main-form grid-2"></div>
    <div class="order-log"></div>
  </div>


  <div class="main-form-buttons">
    <button id='save-order' class='save-order'><i class="fas fa-link"></i>  Add/Update Order</button>
    <button class="hidden" id="create-po" class="create-po"><i class="fas fa-file-word"></i>  Download Template PO</button>
    <button class="hidden" id="copy-po" class="copy-po"><i class="fas fa-file-word"></i>  Copy PO Grid</button>
  </div>
  
  <div id="purchase-order">
    <div id="page-content">
      <div class="order-items"></div>
    </div>
  </div>

  
</div>


  `;

  return html;

}
