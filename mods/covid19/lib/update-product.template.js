module.exports = UpdateProductTemplate = (app, data) => {

  let html = '';

  html = `
  <div class="supplier-information">

    <div class="loading">
      Loading Product Editing Page....
    </div>

    <div class="portal" style="display:none">

      <h3>Product Details:</h3>
      <div class="category-select">
        <select id="select-product-type" name="select-product-type">
          <option value=0>select product category</option>
        </select>
      </div>
 
      <div id="product-grid" class="product-grid grid-4" style="display:none"></div>

      <hr >
      
      <h3>Certifications</h3>

      <div id="cert-grid" class="cert-grid"></div>

      <hr />

      <div style="display:flex;">
      <div id="${data.product_id}" class="update-product-btn button" style="display:none"><i class="fas fa-save"></i> Update Public Listing</div>
      <div id="attachto-${data.product_id}" class="attach-cert-btn button" style="display:none"><i class="fas fa-certificate"></i> Attach Certificate</div>
      </div>
    </div>
  </div>

  <input class="supplier_publickey" style="display:none" type="hidden" value="${app.wallet.returnPublicKey()}" />

  `;

  return html;

}
