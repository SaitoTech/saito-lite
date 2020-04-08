module.exports = SupplierPortalTemplate = () => {

  let html = '';

  html = `
  <div class="supplier-information">

    <h2>Supplier Portal:</h2>

    <p></p>

    <div class="loading">

      Currently loading your products....

    </div>

    <div class="portal" style="display:none">

      <div id="products-table" class="products-table" style="display:none; grid-template-columns: repeat(7, auto);">
         
      </div>

     <div class="add-or-update-product-btn button">Add New Product</div>

    </div>
  </div>
  `;

  return html;

}
