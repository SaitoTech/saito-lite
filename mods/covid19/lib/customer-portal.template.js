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
          <th>Supplier</th>
          <th>Specification</th>
          <th>Photo</th>
          <th>Unit Cost</th>
          <th>Daily Volume</th>
          <th>Certifications</th>
          <th>Lead Time</th>
          <th></th>
        </tr>
      </table>

  `;

  return html;

}
