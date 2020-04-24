module.exports = UpdateProductTemplate = (app, data) => {

  let html = '';

  html = `
  <div class="supplier-information">

    <div class="loading">
      Loading Product Editing Page....
    </div>

    <div class="portal" style="display:none">

      <h3>Product Details:</h3>
      <!--div class="category-select">
        <select id="select-product-type" name="select-product-type">
          <option value=0>select product category</option>
        </select>
      </div-->
 
      <div id="product-grid" class="product-grid grid-2" style="display:none"></div>

      <div class="certification-space" style="display:none">

        <hr >     
        <h3>Certifications</h3>
        <div id="cert-grid" class="cert-grid"></div>
        <hr />

      </div>


      <div style="display:flex;" class="product-buttons">
      <div id="${data.product_id}" class="update-product-btn button" style="display:none"><i class="fas fa-save"></i> Update</div>
      <div id="attachcertto-${data.product_id}" class="attach-cert-btn button" style="display:none"><i class="fas fa-certificate"></i> Attach Certificate</div>
      <div id="attachfileto-${data.product_id}" class="attach-file-btn button" style="display:none"><i class="fas fa-file"></i> Attach File</div>
      <div id="attachbundleto-${data.product_id}" class="attach-bundle-btn button" style="display:none"><i class="fas fa-list"></i> Attach Bundle</div>
      <div id="attachments-${data.product_id}" class="attachments-btn button" style="display:none"><i class="fas fa-list"></i> View Attachments</div>
      </div>
    </div>
  </div>

  <input class="supplier_publickey" style="display:none" type="hidden" value="${app.wallet.returnPublicKey()}" />

  `;

  return html;

}
