module.exports = ProductManagerTemplate = () => {

  let html = '';

  html = `
  <div class="product-information">

    <h2>Products</h2>

    <p><hr /></p>

    <div class="loading">

      <p>
        Please be patient while we load the products. 
      </p>

    </div>

    <div id="product-table" class="product-table" style="display:none"></div>

    <hr />
    <br />

    <div class="flex-around">
       <div class="new-product-btn button">New Product</div>
       <div class="check-btn button">Check Barcode</div>
    </div>
    
  </div>
  `;

  return html;

}
