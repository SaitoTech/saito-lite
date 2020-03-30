const ProductPageTemplate = require('./product-page.template');

const this_productPage = this;

module.exports = ProductPage = {

  render(data) {

    var supplier_id = 0;
    document.querySelector(".main").innerHTML = ProductPageTemplate();

    //
    // load product
    //
    data.covid19.sendPeerDatabaseRequest("covid19", "products", "*", "id= " + data.id, null, function (res) {
      let fields = `product_name as 'Name', \
      product_description as 'Description', \
      product_photo as 'Product Image', \
      product_specification as 'Specification', \
      production_stock as 'Stock', \
      production_daily_capacity as 'Daily Production', \
      pricing_per_unit_rmb as 'Price (RMB)', \ 
      pricing_notes as 'Pricing Notes', \
      product_dimensions as 'Package Dimensions', \
      product_weight as 'Weight', \
      product_quantities as 'Package Contents', \
      pricing_payment_terms as 'Payment Terms', \
      production_minimum_order as 'Payment Terms',
      supplier_id
    `;
      data.covid19.sendPeerDatabaseRequest("covid19", "products", fields, "id= " + data.id, null, function (res) {

        if (res.rows.length > 0) {

          data.covid19.renderProduct(res.rows[0]);
          supplier_id = res.rows[0]["supplier_id"];
          document.querySelector(".product-name").innerHTML = res.rows[0]["Name"];

          //
          // load certificates
          fields = "name as 'Name', address as 'Province', phone as 'Phone', email as 'Email', wechat as 'WeChat Id', notes as 'Notes'";
          //fields = "*";

          data.covid19.sendPeerDatabaseRequest("covid19", "suppliers", fields, "id= " + supplier_id, null, function (res) {

            if (res.rows.length > 0) {

              data.covid19.renderSupplier(res.rows[0]);

            }
          });

          //
          // load certifications
          //
          fields = "c.name as 'Name', (select id from attachments where id = pc.id ) as attachment_id";
          var from = "certifications as 'c' JOIN products_certifications as 'pc'";
          var where = "c.id = pc.certification_id and pc.product_id =";
          data.covid19.sendPeerDatabaseRequest("covid19", from, fields, where + data.id, null, function (res) {

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
    // no events here
  }

}
