module.exports = UpdateSupplierTemplate = (app, data) => {

  let html = '';

  html = `
  <div class="supplier-information">

    <div class="loading">
      Loading Supplier Editing Page....
    </div>

    <div class="portal" style="display:none">

      <h3>Supplier Profile:</h3>

      <div id="supplier-grid" class="supplier-grid grid-4"></div>

      <div id="${data.supplier_id}" class="update-supplier-btn button">Update Account</div>

    </div>
  </div>


  `;

  return html;

}
