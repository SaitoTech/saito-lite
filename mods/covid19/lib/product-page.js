const ProductPageTemplate = require('./product-page.template');

const this_productPage = this;

module.exports = ProductPage = {

  render(data) {

    document.querySelector(".main").innerHTML = ProductPageTemplate();

    //
    // load product
    //
    data.covid19.sendPeerDatabaseRequest("covid19", "products JOIN suppliers", "*", "products.supplier_id = suppliers.id AND id= " + data.id, null, function (res) {

      if (res.rows.length > 0) {
        data.covid19.renderProduct(res.rows[0]);
        document.querySelector(".product-name").innerHTML = res.rows[0]["product_name"];
      }

      document.querySelector(".loading").style.display = "none";
      document.querySelector(".portal").style.display = "block";
    });

  },


  attachEvents(app, data) {
  
  },


  renderProduct(prod) {
    var html = "";
    Object.entries(prod).forEach(field => {
      switch(field[0]) {
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

}
