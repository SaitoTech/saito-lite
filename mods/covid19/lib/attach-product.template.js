module.exports = AttachProductTemplate = (app, data) => {

  let html = '';

  html = `
  <div class="product-template modal-form-wrapper">
    
  <h2>Attach Product to Order</h2>
  <hr />
  <div class="modal-form attach-product"></div>
  <hr />
  <div class="modal-form-buttons">
    <button id='cancel-product' class='cancel-product'>  Cancel</button>
    <button id='save-product' class='save-product'><i class="fas fa-link"></i>  Attach Product</button>
  </div>
</div>


  `;

  return html;

}
