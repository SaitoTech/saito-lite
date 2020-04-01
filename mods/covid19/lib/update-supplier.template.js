module.exports = UpdateSupplierTemplate = (app, data) => {

  let html = '';

  html = `
  <div class="supplier-information">

    <div class="loading">

      Please wait while we prepare your data-entry form...

      <p></p>

      This page should load in approximately 10 seconds.

    </div>

    <div class="portal" style="display:none">

      <h3>Your Supplier Profile:</h3>

      Please ensure your company name and contact information is correct. Your company name will be listed publicly, but your contact information will be kept private. If you are creating a new account we will contact you by email, phone or wechat shortly to confirm your information and assist with reputational certification for white-label foundries and/or partners of larger, certified medical equipment providers.

      <p></p>

      <div id="supplier-grid" class="supplier-grid grid-2"></div>

      <div id="${data.supplier_id}" class="update-supplier-btn button">Update Account</div>

    </div>
  </div>


  `;

  return html;

}
