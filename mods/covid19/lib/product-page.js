const ProductPageTemplate = require('./product-page.template');

const this_productPage = this;

module.exports = ProductPage = {

  active_category_id : 0,

  render(app, data) {

    var supplier_id = 0;
    document.querySelector(".main").innerHTML = ProductPageTemplate();
    document.querySelector(".navigation").innerHTML = '<div class="button navlink covid_back"><i class="fas fa-back"></i>back</div>';

    this.active_category_id = data.covid19.active_category_id;

    //
    // load product
    //
    data.covid19.sendPeerDatabaseRequest("covid19", "products", "*", "id= " + data.id, null, function (res) {
      let fields = `
        product_specification as 'Specification', \
        product_description as 'Description', \
        product_photo as 'Product Image', \
        production_stock as 'Stock', \
        production_daily_capacity as 'Daily Production', \
        pricing_per_unit_rmb as 'Price (RMB)', \ 
        pricing_notes as 'Pricing Notes', \
        product_dimensions as 'Package Dimensions', \
        product_weight as 'Weight', \
        product_quantities as 'Units per Package', \
        pricing_payment_terms as 'Payment Terms', \
        production_minimum_order as 'Minimum Order',
        supplier_id
      `;

      data.covid19.sendPeerDatabaseRequest("covid19", "products", fields, "id= " + data.id, null, function (res) {

        if (res.rows.length > 0) {

          data.covid19.renderProduct(res.rows[0]);
          supplier_id = res.rows[0]["supplier_id"];
          document.querySelector(".product-name").innerHTML = res.rows[0]["Specification"];
          data.covid19.active_category_id = res.rows[0]["category_id"];

          //
          // load certificates
          fields = "name as 'Name', address as 'Province', notes as 'Notes'";
          data.covid19.sendPeerDatabaseRequest("covid19", "suppliers", fields, "id= " + supplier_id, null, function (res) {

            if (res.rows.length > 0) {
              data.covid19.renderSupplier(res.rows[0]);
            }
          });

          //
          // load certifications
          //
          fields = "pc.product_id as 'product_id', c.name as 'Name', pc.id as cert_id";
          var from = "certifications as 'c' JOIN products_certifications as 'pc'";
          var where = "c.id = pc.certification_id and pc.product_id = " + data.id;
          data.covid19.sendPeerDatabaseRequest("covid19", from, fields, where, null, function (res) {
            if (res.rows.length > 0) {
              data.covid19.renderCerts(res.rows, document.querySelector('.cert-grid'));
            }
          });
        }
      });
    });
    document.querySelector(".loading").style.display = "none";
    document.querySelector(".portal").style.display = "block";
    
    
  },

  attachEvents(app, data) {

    let aci = this.active_category_id;

    try {
      document.querySelector('.covid_back').addEventListener('click', (e) => {
        data.covid19.active_category_id = aci;

        if (data.covid19.active_category_id > 0) {
          data.covid19.renderPage("customer", app, data);
        } else {
          data.covid19.renderPage("home", app, data);
        }

      });
    } catch (err) {}



  }

}
