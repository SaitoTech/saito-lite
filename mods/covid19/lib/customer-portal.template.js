module.exports = CustomerPortalTemplate = () => {

  let html = '';

  html = `
  <div class="splash-introduction">

    <h2>Browse Available Suppliers:</h2>

    <div class="loading">

      Currently loading available products....

    </div>

    <div class="portal" style="display:none">

      <select id="select-product-type" name="select-product-type">
        <option value=0>select product category</option>
      </select>

      <div id="products-table" class="products-table" style="display:none;grid-gap: 1em;grid-template-columns: repeat(8, auto);">
          <div class="table-head">Supplier</div>
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
