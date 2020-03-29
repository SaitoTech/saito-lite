const SupplierPortalTemplate = require('./supplier-portal.template.js');
const ProductPage = require('./product-page.js');
const UpdateProduct = require('./update-product.js');


module.exports = SupplierPortal = {

  render(app, data) {

    document.querySelector(".main").innerHTML = SupplierPortalTemplate();

      //
      // load products
      //
      let whereclause = "suppliers.id = products.supplier_id AND products.category_id = categories.id";
      data.covid19.sendPeerDatabaseRequest("covid19", "products JOIN suppliers LEFT JOIN categories", "categories.name, products.product_specification, products.product_photo, products.pricing_per_unit_rmb, products.production_daily_capacity", whereclause, null, function(res) {

        data.covid19.addProductsToTable(res.rows, [ 'name', 'product_specification', 'product_photo', 'pricing_per_unit_rmb', 'production_daily_capacity', 'certifications', 'June 24', 'admin']);

      document.querySelector(".loading").style.display = "none";
      document.querySelector(".portal").style.display = "block";
      document.querySelector(".products-table").style.display = "grid";

      document.querySelectorAll('.fullview_product').forEach(el => {
        el.addEventListener('click', (e) => {
          data.id = e.toElement.id;
          ProductPage.render(data);
        });
      });

      document.querySelectorAll('.edit_product').forEach(el => {
        el.addEventListener('click', (e) => {
          data.product_id = e.toElement.id;
          UpdateProduct.render(app, data);
          UpdateProduct.attachEvents(app, data);
        });
      });
    });


    console.log("done");
  },

  attachEvents(app, data) {

    document.querySelector('.add-or-update-product-btn').addEventListener('click', (e) => {
      data.product_id = e.currentTarget.id;
      UpdateProduct.render(app, data);
      UpdateProduct.attachEvents(app, data);
    });

  }

}
