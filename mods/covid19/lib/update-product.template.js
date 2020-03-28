module.exports = UpdateProductTemplate = () => {

  let html = '';

  html = `
  <div class="supplier-information">

    <h2>Company Information:</h2>

    <p></p>

    <div class="grid-2">

      <div>Company Name:</div>
      <div><input type="text" id="" value="Company Name" /></div>

      <div>Company Address:</div>
      <div><input type="text" id="" value="Company Address" /></div>

    </div>


    <h2>Product Details:</h2>

    <div class="grid-2">

      <div>Specification:</div>
      <div><input type="text" id="" value="Specification" /></div>

    </div>


    <div class="update-product-btn button">Update Public Listing</div>

  </div>
  `;

  return html;

}
