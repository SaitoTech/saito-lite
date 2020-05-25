module.exports = UpdateOrderTemplate = (app, data) => {

  let html = '';

  html = `
  <div class="order-template">
    
  <h2>Add Order</h2>
  <div class="main-form grid-2"></div>


  <div class="main-form-buttons">
    <button id='save-order' class='save-order'><i class="fas fa-link"></i>  Add/Update Order</button>
  </div>
  
  <div id="purchase-order">
    <div id="page-content">
      <div class="order-items"></div>
    </div>
  </div>

  <div class="main-form-buttons">
    <button id="create-po" class="create-po"><i class="fas fa-file-word"></i>  Create Template Order</button>
    <button id="copy-po" class="copy-po"><i class="fas fa-file-word"></i>  Copy Order Grid</button>
    </div>
  
</div>

<div id="test">

</div>


  `;

  return html;

}
