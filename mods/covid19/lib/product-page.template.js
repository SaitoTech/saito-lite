module.exports = ProductPageTemplate = (app, data) => {

  let html = '';

  html = `
  <div class="splash-introduction">

    <h2 class="product-name"></h2>

    <div class="loading">

      Loading Product

    </div>

    <div class="portal" style="display:none">

    <h3>Product Details:</h3>

      <div id="product-grid" class="product-grid grid-4">

      </div>

      <hr />

    <h3>Certifications</h3>

      <div id="cert-grid" class="cert-grid">

      </div>

      <hr />

      <div class="supplier-profile">

        <h3>Supplier Details</h3>

        <div id="supplier-grid" class="supplier-grid grid-4"></div>

      </div>

      <hr />

      <div style="display:flex;" class="product-buttons">
      
        <div id="attachments-${data.product_id}" class="attachments-btn button"><i class="fas fa-list"></i> View Attachments</div>
      </div>

    </div>
  </div>
  `;

  return html;

}
