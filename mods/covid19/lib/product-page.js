const ProductPageTemplate = require('./product-page.template');
const UpdateSupplier = require('./update-supplier.js');

const this_productPage = this;

module.exports = ProductPage = {

  active_category_id: 0,

  render(app, data) {

alert("product: " + data.product_id);

    var supplier_id = 0;
    document.querySelector(".main").innerHTML = ProductPageTemplate(app, data);

    document.querySelector(".navigation").innerHTML = '<div class="button navlink covid_back"><i class="fas fa-back"></i>back</div>';

    this.active_category_id = data.covid19.active_category_id;

    //
    // load product
    //

    let fields = `
        product_specification as 'Specification',
        product_description as 'Description', 
        product_photo as 'Product Image', 
        production_stock as 'Stock', 
        production_daily_capacity as 'Daily Production', 
        pricing_per_unit_public as 'Price (USD)', 
        pricing_notes as 'Pricing Notes', 
        product_dimensions as 'Package Dimensions', 
        product_weight as 'Weight', 
        product_quantities as 'Units per Package', 
        pricing_payment_terms as 'Payment Terms', 
        production_minimum_order as 'Minimum Order',
        supplier_id
      `;

    data.covid19.sendPeerDatabaseRequest("covid19", "products", fields, "id= " + data.product_id, null, function (res) {

      if (res.rows.length > 0) {

        data.covid19.renderProduct(res.rows[0]);
        supplier_id = res.rows[0]["supplier_id"];
        document.querySelector(".product-name").innerHTML = res.rows[0]["Specification"];
        data.covid19.active_category_id = res.rows[0]["category_id"];


        if (data.covid19.isAdmin()) {
          var html = "<div></div><div class='edit-button-holder'><button id='edit-supplier'>Edit</button></div>";
          document.querySelector('.supplier-profile').innerHTML += html;
          //
          // load supplier admin
          fields = "name as 'Name', address as 'Province', phone as 'Phone', email as 'Email', wechat as 'WeChat', notes as 'Notes', publickey";
          data.covid19.sendPeerDatabaseRequest("covid19", "suppliers", fields, "id= " + supplier_id, null, function (res) {
            if (res.rows.length > 0) {
              data.covid19.renderSupplier(res.rows[0]);
              data.supplier_publickey = res.rows[0].publickey;
              document.getElementById('edit-supplier').addEventListener('click', (e) => {
                data.supplier_id = supplier_id;
                UpdateSupplier.render(app, data);
                UpdateSupplier.attachEvents(app, data);
              });
            }
          });

        } else {
          //
          // load supplier supplier
          fields = "address as 'Province'";
          data.covid19.sendPeerDatabaseRequest("covid19", "suppliers", fields, "id= " + supplier_id, null, function (res) {
            if (res.rows.length > 0) {
              data.covid19.renderSupplier(res.rows[0]);
            }
          });
        }


        //
        // load certifications
        //
        fields = "pc.product_id as 'product_id', c.name as 'Name', note, pc.id as cert_id";
        var from = "certifications as 'c' JOIN products_certifications as 'pc'";
        var where = "c.id = pc.certification_id and pc.product_id = " + data.product_id;
        data.covid19.sendPeerDatabaseRequest("covid19", from, fields, where, null, function (res) {
          if (res.rows.length > 0) {
            data.covid19.renderCerts(res.rows, document.querySelector('.cert-grid'));
          }
        });
      }
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
    } catch (err) { }

    document.querySelector('.attachments-btn').addEventListener('click', (e) => {
      data.product_id = e.target.id.split("-")[1];
      Attachments.render(app, data);
      Attachments.attachEvents(app, data);
    });




  }

}
