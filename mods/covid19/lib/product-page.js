const ProductPageTemplate = require('./product-page.template');

const this_productPage = this;

module.exports = ProductPage = {

  render(data) {

    var supplier_id = 0;
    var certifications = [];
    document.querySelector(".main").innerHTML = ProductPageTemplate();

    //
    // load product
    //
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

            data.covid19.renderCerts(res.rows);

          }
        });
        //
        // load supplier
        fields = "name as 'Name', address as 'Province', phone as 'Phone', email as 'Email', wechat as 'WeChat Id', notes as 'Notes'";
        //fields = "*";

        data.covid19.sendPeerDatabaseRequest("covid19", "suppliers", fields, "id= " + supplier_id, null, function (res) {

          if (res.rows.length > 0) {

            data.covid19.renderSupplier(res.rows[0]);

          }
        });

      }
    });
    document.querySelector(".loading").style.display = "none";
    document.querySelector(".portal").style.display = "block";
  },


  attachEvents(app, data) {

  },

/*
  renderProduct(prod) {
    var html = "";
    Object.entries(prod).forEach(field => {
      switch (field[0]) {
        case 'id':
        case 'supplier_id':
        case 'category_id':
          break;
        case 'product_name':
          html += "<div>Name</div>";
          html += "<div>" + field[1] + "</div>";
          break;
        case 'product_description':
          html += "<div>Description</div>";
          html += "<div>" + field[1] + "</div>";
          break;
        case 'product_specification':
          html += "<div>Name</div>";
          html += "<div>" + field[1] + "</div>";
          break;
        case 'product_dimensions':
          html += "<div>Package Dimensions</div>";
          html += "<div>" + field[1] + "</div>";
          break;
        case 'product_weight':
          html += "<div>Weight</div>";
          html += "<div>" + field[1] + "</div>";
          break;
        case 'product_quantities':
          html += "<div>Package Contents</div>";
          html += "<div>" + field[1] + "</div>";
          break;
        case 'product_photo':
          html += "<div>Product Image</div>";
          html += "<div><img style='max-width:200px;max-height:200px' src=" + field[1] + " /></div>";
          break;
        case 'pricing_per_unit_rmb':
          html += "<div>Price (RMB)</div>";
          html += "<div>" + field[1] + "</div>";
          break;
        case 'pricing_notes':
          html += "<div>Pricing Notes</div>";
          html += "<div>" + field[1] + "</div>";
          break;
        case 'pricing_payment_terms':
          html += "<div>Payment Terms</div>";
          html += "<div>" + field[1] + "</div>";
          break;
        case 'production_stock':
          html += "<div>Stock</div>";
          html += "<div>" + field[1] + "</div>";
          break;
        case 'production_daily_capacity':
          html += "<div>Daily Production</div>";
          html += "<div>" + field[1] + "</div>";
          break;
        case 'production_minimum_order':
          html += "<div>Payment Terms</div>";
          html += "<div>" + field[1] + "</div>";
          break;
        default:
          html += "<div>" + field[0].split("_").join(" ") + "</div>";
          html += "<div>" + field[1] + "</div>";
      }
    });
    document.querySelector('.product-grid').innerHTML = html;
  }
  */

}
