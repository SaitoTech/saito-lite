module.exports = CustomerPortalTemplate = () => {

  let html = '';

  html = `
  <div class="splash-introduction">

    <h2>Browse Products and Suppliers by Category:</h2>

    <div class="loading">

      We are currently loading available products...

      <p></p>

      This may take a minute.

      <p></p>

      Please be patient.

    </div>

    <div class="portal" style="display:none">

      <div class="category-select">
        <select id="select-product-type" name="select-product-type">
          <option value=0>select product category</option>
        </select>
      </div>
      <div id="products-table" class="products-table" style="display:none;grid-template-columns: repeat(6, auto);"> 
      </div>
      <div id="products-table-controls" class="products-table-controls" style="display:none;">
        <button id="add-product">Add</button>
      </div>

    </div>
  </div>
  `;

  return html;

}
