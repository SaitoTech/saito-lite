const SupplierPortalTemplate 	= require('./supplier-portal.template.js');


module.exports = SupplierPortal = {

    render(app, data) {

      document.querySelector(".main").innerHTML = SupplierPortalTemplate();

      //
      // load products
      //
      let whereclause = "suppliers.id = products.supplier_id";
      data.covid19.sendPeerDatabaseRequest("covid19", "products JOIN suppliers LEFT JOIN categories", "*", whereclause, null, function(res) {
        data.covid19.addProductsToTable(res.rows, [ 'name', 'product_specification', 'product_photo', 'pricing_unit_cost', 'production_daily_capacity', 'certifications', 'June 24', 'admin']);
        document.querySelector(".loading").style.display = "none";
        document.querySelector(".portal").style.display = "block";
        document.querySelector(".products-table").style.display = "block";
      });

    },

    attachEvents(app, data) {

    }

}
