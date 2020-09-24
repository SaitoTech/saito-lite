module.exports = UpdateProductTemplate = (app, data) => {

  let html = '';

  html = `
  <div class="product-template">
    
  <h2>Product</h2>

  <div class="product-head">
    <div class="main-form grid-2"></div>
  </div>


  <div class="main-form-buttons">
    <button id='save-product' class='save-product'><i class="fas fa-link"></i>  Add/Update</button>
    <button id='cancel-product' class='cancel-product'><i class="fas fa-link"></i>  Cancel</button>
  </div>
  

  
</div>


  `;

  return html;

}
