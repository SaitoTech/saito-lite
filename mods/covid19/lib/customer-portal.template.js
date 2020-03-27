module.exports = CustomerPortalTemplate = () => {

  let html = '';

  html = `
  <div class="splash-introduction">

    <h2>Browse Available Suppliers:</h2>

    <select id="select-product-type" name="select-product-type">
      <option value="KN95-face-mask">KN95 face mask</option>
      <option value="KN90-face-mask">KN90 face mask</option>
    </select>

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
        <td class="update-product-btn" id="">update info</td>
        <td>GB2626-2006 civilian</td>
        <td>250,000</td>
        <td>10,000</td>
        <td>1.29</td>
        <td>CE certified, FDA certified, test report, medical device license</td>
	<td>yes</td>
      </tr>
    </table>

  `;

  return html;

}
