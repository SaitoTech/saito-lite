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

      <table id="products-table" class="products-table" style="display:none;">
        <tr>
          <th>UPDATE</th>
          <th>Standard</th>
          <th>Daily Capacity</th>
          <th>Minimum Order</th>
          <th>USD Cost (FOB)</th>
          <th>Certifications</th>
          <th>Verified</th>
        </tr>
      </table>

  `;

  return html;

}
