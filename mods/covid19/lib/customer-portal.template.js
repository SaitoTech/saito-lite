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

      <div id="products-table" class="products-table" style="display:none;grid-gap:1em;grid-template-columns: repeat(7, auto);">
        <div class="table-head">UPDATE</div>
        <div class="table-head">Standard</div>
        <div class="table-head">Daily Capacity</div>
        <div class="table-head">Minimum Order</div>
        <div class="table-head">USD Cost (FOB)</div>
        <div class="table-head">Certifications</div>
        <div class="table-head">Verified</div>

      </div>

  `;

  return html;

}
