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

      <table id="products-table" class="products-table" style="display:none;">
        <tr>
          <th>Category</th>
          <th>Specification</th>
          <th>Photo</th>
          <th>Unit Cost</th>
          <th>Daily Volume</th>
          <th>Certifications</th>
          <th>Lead Time</th>
          <th></th>
        </tr>
      </table>

    </div>
  </div>
  `;

  return html;

}
