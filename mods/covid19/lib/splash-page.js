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
    sql = `
    select 
      categories.name as 'product', 
      categories.id as 'category_id',
      sum(products.production_daily_capacity) as 'capacity', 
      count(products.id) as 'product_count', 
      group_concat( distinct (" " || certifications.name)) as 'certs', 
      min(products.pricing_per_unit_public) || ' ~ ' ||  max(products.pricing_per_unit_public) as 'cost' 
    from 
      products 
    JOIN 
      suppliers ON suppliers.id = products.supplier_id
    JOIN 
      categories ON products.category_id = categories.id
    LEFT JOIN 
      products_certifications ON products.id = products_certifications.product_id
    LEFT JOIN 
      certifications ON products_certifications.certification_id = certifications.id
    where 
      products.deleted <> 1 AND 
      suppliers.deleted <> 1
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

    data.covid19.sendPeerDatabaseRequestRaw("covid19", sql, function (res) {
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

      //      data.covid19.pdfCapture(document.getElementById('list2pdf-btn'), document.querySelector('.summary-section'), 297, 210,'product-list.pdf');
      data.covid19.pdfCaptureHTML(document.getElementById('list2pdf-btn'), document.querySelector('.summary-section'), 297, 210, 'product-list.pdf');


    });
  },


  attachEvents(app, data) {

    document.getElementById('customer-search-btn').addEventListener('click', (e) => {
      CustomerPortal.render(app, data);
      CustomerPortal.attachEvents(app, data);
    });

    /*
    document.getElementById('supplier-portal-btn').addEventListener('click', (e) => {
      SupplierProfile.render(app, data);
      SupplierProfile.attachEvents(app, data);
    });
    */

  }

}
