module.exports = CustomerPortalTemplate = () => {

  let html = '';

  html = `
  <div class="splash-introduction">

    <h2>Browse Available Suppliers:</h2>

    <div class="loading">

      Currently loading available products....

    </div>

    <div class="portal" style="display:none">

      <div class="category-select">
        <select id="select-product-type" name="select-product-type">
          <option value=0>select product category</option>
        </select>
      </div>
      <div id="products-table" class="products-table" style="display:none;grid-gap: 1em;grid-template-columns: repeat(8, auto);">
        
      </div>

    </div>
  </div>
  `;

  return html;

}
