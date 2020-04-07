const SupplierPortalTemplate = require('./supplier-portal.template.js');
const ProductPage = require('./product-page.js');
const UpdateProduct = require('./update-product.js');


module.exports = SupplierPortal = {

  render(app, data) {

    document.querySelector(".main").innerHTML = SupplierPortalTemplate();
    document.querySelector(".navigation").innerHTML = '<div class="button navlink covid_back"><i class="fas fa-back"></i> Back</div>';


      //
      // load products
      //
      let whereclause = `suppliers.id = products.supplier_id AND products.category_id = categories.id AND suppliers.publickey = "${app.wallet.returnPublicKey()}"`;
      data.covid19.sendPeerDatabaseRequest("covid19", "products JOIN suppliers LEFT JOIN categories", "products.id as 'product_id', categories.name, products.product_specification, products.product_photo, products.pricing_per_unit_rmb, products.production_daily_capacity, products.id", whereclause, null, function(res) {

        // no 'name' on supplier page
        data.covid19.addProductsToTable(res.rows, [ 'name', 'product_specification', 'product_photo', 'production_daily_capacity', 'certifications', 'id', 'admin'], app, data);

      document.querySelector(".loading").style.display = "none";
      document.querySelector(".portal").style.display = "block";
      document.querySelector(".products-table").style.display = "grid";

      try { 
      document.querySelectorAll('.fullview_product').forEach(el => {
        el.addEventListener('click', (e) => {
          data.id = e.target.id;
          ProductPage.render(data);
        });
      });
      } catch (err) {}

      try {
      document.querySelectorAll('.edit_product').forEach(el => {
        el.addEventListener('click', (e) => {
          data.product_id = e.target.id;
          UpdateProduct.render(app, data);
          UpdateProduct.attachEvents(app, data);
        });
      });
      } catch (err) {}

      try {
      document.querySelectorAll('.delete_product').forEach(el => {
        el.addEventListener('click', (e) => {
	  alert("Product Deletion functionality coming soon!");
	  data.product_id = e.target.id;
	  data.covid19.deleteProduct(data.product_id, app.wallet.returnPublicKey());
	  alert("Product Deleted!");
	  window.location.reload();

        });
      });
      } catch (err) {}



    });

    var grid = document.querySelector(".products-table");
        
    
    console.log("done");
  },

  attachEvents(app, data) {

    document.querySelector('.add-or-update-product-btn').addEventListener('click', (e) => {
      data.product_id = e.currentTarget.id;
      UpdateProduct.render(app, data);
      UpdateProduct.attachEvents(app, data);
    });

    try {
      document.querySelector('.covid_back').addEventListener('click', (e) => {
        data.covid19.renderPage("home", app, data);
      });
    } catch (err) { }
  }
}
