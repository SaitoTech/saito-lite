const SplashPageTemplate = require('./splash-page.template.js');
const CustomerPortal = require('./customer-portal');
const SupplierProfile = require('./supplier-profile');


module.exports = SplashPageAppspace = {

  render(app, data) {

    var this_portal = this;

    document.querySelector(".main").innerHTML = SplashPageTemplate();
    document.querySelector(".navigation").innerHTML = "";
    
    this.postrender(app, data);    
  },

  postrender(app, data) {
    let whereclause = "suppliers.id = products.supplier_id AND products.category_id = categories.id group by products.category_id";
    let select = "categories.name as 'product', count(products.id) as 'count', sum(products.production_daily_capacity) as 'capacity', 'certs', min(products.pricing_per_unit_public) || ' ~ ' ||  max(products.pricing_per_unit_public) as 'cost'";
    let from = "products JOIN suppliers LEFT JOIN categories";
    var sql = "select " + select + " from " + from + " where " + whereclause + ";";
    sql = `
    select 
      categories.name as 'product', 
      categories.id as 'category_id',
      sum(products.production_daily_capacity) as 'capacity', 
      count(products.id) as 'product_count', 
      group_concat( distinct (" " || certifications.name)) as 'certs', 
      min(products.pricing_per_unit_public) || ' ~ ' ||  max(products.pricing_per_unit_public) as 'cost' 
    from 
      products JOIN 
      suppliers JOIN 
      products_certifications JOIN 
      certifications LEFT JOIN 
      categories 
    where 
      suppliers.id = products.supplier_id AND 
      products.category_id = categories.id AND 
      products.id = products_certifications.product_id AND 
      products_certifications.certification_id = certifications.id 
    group by 
      products.category_id;
    `;
    var html = "";
    html += `<div class="grid-header">Product</div>`;
    html += `<div class="grid-header">Daily Capacity</div>`;
    html += `<div class="grid-header">Count</div>`;
    html += `<div class="grid-header">Cost USD</div>`;
    html += `<div class="grid-header">Certifications</div>`;
    html += `<div class="grid-header"></div>`;
    //data.covid19.sendPeerDatabaseRequest("covid19", from, select, whereclause, null, function (res) {
    data.covid19.sendPeerDatabaseRequestRaw("covid19", sql, function(res) {
      res.rows.forEach(row => {
        html += `<div data-category_id="${row.category_id}" class="active_category tip"><a>${row.product}</a><div class="tiptext">View All</div></div>`;
        html += `<div>${row.capacity}</div>`;
        html += `<div>${row.product_count}</div>`;
        html += `<div>${row.cost}</div>`;
        html += `<div>${row.certs}</div>`
        html += `<div data-category_id="${row.category_id}"><div class="active_category grid-action"><i class="fas fa-external-link-alt"></i> View All</div></div>`        
      ;
      });
      document.querySelector('.product-summary').innerHTML = html;
      document.querySelectorAll('.active_category').forEach(el => {
        el.addEventListener('click', (e) => {
          data.covid19.active_category_id = e.target.parentElement.dataset.category_id;
          data.covid19.renderPage("customer", app, data);
        });
      });
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
/*
select categories.name as 'product', sum(products.production_daily_capacity) as 'capacity', (select group_concat (name) from 
certifications where id in (1, 3, 5)) as 'Certificates', min(products.pricing_per_unit_public) || ' ~ ' ||  min(products.pricing_per_
unit_public) as 'cost' from products JOIN suppliers JOIN products_certifications LEFT JOIN categories where suppliers.id = products.s
upplier_id AND products.category_id = categories.id AND products.id = products_certifications.product_id group by products.category_i
d



select categories.name as 'product', sum(products.production_daily_capacity) as 'capacity', group_concat(products_certifications.certification_id) as 'cert_ids', (select group_concat (name) from certifications where id in (select group_concat(products_certifications.certification_id)) as 'Certificates', min(products.pricing_per_unit_public) || ' ~ ' ||  min(products.pricing_per_unit_public) as 'cost' from products JOIN suppliers JOIN products_certifications LEFT JOIN categories where suppliers.id = products.supplier_id AND products.category_id = categories.id AND products.id = products_certifications.product_id group by products.category_id;


select categories.name as 'product', sum(products.production_daily_capacity) as 'capacity', (select'certs', min(products.pricing_per_unit_public) || ' ~ ' ||  min(products.pricing_per_unit_public) as 'cost' from products JOIN suppliers LEFT JOIN categories where suppliers.id = products.supplier_id AND products.category_id = categories.id group by products.category_id;


select categories.name as 'product', sum(products.production_daily_capacity) as 'capacity', group_concat(products_certifications.certification_id) as 'cert_ids', (select group_concat (name) from certifications where id in (select group_concat(products_certifications.certification_id)) as 'Certificates', min(products.pricing_per_unit_public) || ' ~ ' ||  min(products.pricing_per_unit_public) as 'cost' from products JOIN suppliers JOIN products_certifications JOIN certifications LEFT JOIN categories where suppliers.id = products.supplier_id AND products.category_id = categories.id AND products.id = products_certifications.product_id AND products_certifications.certification_id = certifications.id group by products.category_id;



select categories.name as 'product', sum(products.production_daily_capacity) as 'capacity', group_concat(distinct(certifications.name)) as 'certs', min(products.pricing_per_unit_public) || ' ~ ' ||  min(products.pricing_per_unit_public) as 'cost' from products JOIN suppliers JOIN products_certifications JOIN certifications LEFT JOIN categories where suppliers.id = products.supplier_id AND products.category_id = categories.id AND products.id = products_certifications.product_id AND products_certifications.certification_id = certifications.id group by products.category_id;
*/