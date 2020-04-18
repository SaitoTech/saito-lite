const SplashPageTemplate = require('./splash-page.template.js');
const CustomerPortal = require('./customer-portal');
const SupplierProfile = require('./supplier-profile');


module.exports = SplashPageAppspace = {

  render(app, data) {

    document.querySelector(".main").innerHTML = SplashPageTemplate();
    document.querySelector(".navigation").innerHTML = "";
    
  },

  postrender(app, data) {
    let whereclause = "suppliers.id = products.supplier_id AND products.category_id = categories.id group by products.category_id";
    let select = "categories.name as 'product', count(products.id) as 'varieties', sum(products.production_daily_capacity) as 'capacity', 'certs', min(products.pricing_per_unit_public) || ' ~ ' ||  max(products.pricing_per_unit_public) as 'cost'";
    let from = "products JOIN suppliers LEFT JOIN categories";
    var sql = "select " + select + " from " + from + " where " + whereclause + ";";
    var html = "";
    html += `<div class="grid-header">Product</div>`;
    html += `<div class="grid-header">Daily Capacity</div>`;
    html += `<div class="grid-header">Varieties</div>`;
    html += `<div class="grid-header">Certifications</div>`;
    html += `<div class="grid-header">Cost Range</div>`;
    //data.covid19.sendPeerDatabaseRequest("covid19", from, select, whereclause, null, function (res) {
    data.covid19.sendPeerDatabaseRequestRaw("covid19", sql, function(res) {
      res.rows.forEach(row => {
        html += `<div>${row.product}</div>`;
        html += `<div>${row.capacity}</div>`;
        html += `<div>${row.varieties}</div>`;
        html += `<div>${row.certs}</div>`;
        html += `<div>${row.cost}</div>`;
      });
      document.querySelector('.product-summary').innerHTML = html;
    });
  },


  attachEvents(app, data) {

    document.getElementById('customer-search-btn').addEventListener('click', (e) => {
      CustomerPortal.render(app, data);
      CustomerPortal.attachEvents(app, data);
    });

    document.getElementById('supplier-portal-btn').addEventListener('click', (e) => {
      SupplierProfile.render(app, data);
      SupplierProfile.attachEvents(app, data);
    });

  }

}
