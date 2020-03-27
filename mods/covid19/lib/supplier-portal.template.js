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

      <div id="products-table" class="products-table" style="display:none;grid-gap: 1em;grid-template-columns: repeat(8, auto);">
          <div class="table-head">Category</div>
          <div class="table-head">Specification</div>
          <div class="table-head">Photo</div>
          <div class="table-head">Unit Cost</div>
          <div class="table-head">Daily Volume</div>
          <div class="table-head">Certifications</div>
          <div class="table-head">Lead Time</div>
          <div class="table-head"></div>
      </div>


    </div>
  </div>
  `;

  return html;

}
