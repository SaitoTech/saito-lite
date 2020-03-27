module.exports = ProductPageTemplate = () => {

  let html = '';

  html = `
  <div class="splash-introduction">

    <h2 class="product-name"></h2>

    <div class="loading">

      Loading Product

    </div>

    <div class="portal" style="display:none">

      <div id="product-grid" class="product-grid grid-4">

      </div>

    </div>
  </div>
  `;

  return html;

}
