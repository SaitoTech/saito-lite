module.exports = SplashPageAdminTemplate = () => {

  let html = '';

  html = `
  <div class="splash-introduction">

    <h2>Admin Portal</h2>

    <p><a class="" href="/covid19/?mode=category-manager">Categories and Pricing</a></p>
    <p><a class="" href="/covid19/?mode=order-manager">Orders</a></p>
    <p><a class="" href="/covid19/?mode=file-manager">File Manager</a></p>
    <p><a class="" href="/covid19/?mode=bundle-manager">Bundle Mananger</a></p>
    <p><a class="" href="/covid19/?mode=category-manager">Categories and Pricing</a></p>
    <p><a class="" href="/covid19/?mode=supplier">Supplier Portal</a></p>
    <p><a class="" href="/covid19/?mode=supplier-profile">Supplier Profile</a></p>

    <div class="summary-section" id="summary-section">

    <h3>Products:</h3>

    <hr />

      <div class="product-summary" id="product-summary">
        Loading...
      </div>

      <hr />
  
    </div>

    <div class="splash-actions">
      <button id="customer-search-btn" class="button">View Products by Category</button>
      <button id="list2pdf-btn" class="button">Download List as PDF</button>
    </div>


    <hr />


  </div>
  `;

  return html;

}