module.exports = SupplierPortalTemplate = () => {

  let html = '';

  html = `
  <div class="supplier-information">

    <h2>Supplier Portal:</h2>

    <p></p>

    <table>
      <tr>
        <th>UPDATE</th>
        <th>Standard</th>
        <th>Daily Capacity</th>
        <th>Minimum Order</th>
        <th>USD Cost (FOB)</th>
        <th>Certifications</th>
        <th>Verified</th>
      </tr>
      <tr>
        <td class="update-product-btn" id="product-id">UPDATE PRODUCT</td>
        <td>GB2626-2006 civilian</td>
        <td>250,000</td>
        <td>10,000</td>
        <td>1.29</td>
        <td>CE certified, FDA certified, test report, medical device license</td>
        <td>yes</td>
      </tr>
    </table>

  </div>

  `;

  return html;

}
