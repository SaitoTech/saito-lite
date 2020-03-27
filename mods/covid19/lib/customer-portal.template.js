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

      <div id="products-table" class="products-table" style="display:none;grid-gap:5px;grid-template-columns: repeat(7, auto);">
        <div>UPDATE</div>
        <div>Standard</div>
        <div>Daily Capacity</div>
        <div>Minimum Order</div>
        <div>USD Cost (FOB)</div>
        <div>Certifications</div>
        <div>Verified</div>
                
      </div>

  `;

  return html;

}
