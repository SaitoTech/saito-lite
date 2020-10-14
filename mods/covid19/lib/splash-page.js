const SplashPageTemplate = require('./splash-page.template.js');
const SplashPageAdminTemplate = require('./splash-page-admin.template.js');
const CustomerPortal = require('./customer-portal');
const SupplierProfile = require('./supplier-profile');


module.exports = SplashPageAppspace = {

  render(app, data) {
    var this_portal = this;

    if (data.covid19.isAdmin()) {
      document.querySelector(".main").innerHTML = SplashPageAdminTemplate();
    } else {
      document.querySelector(".main").innerHTML = SplashPageTemplate();
    }


    document.querySelector(".navigation").innerHTML = "";



    this.postrender(app, data);
  },

  postrender(app, data) {
    sql = `
    select 
      categories.name as 'product', 
      categories.id as 'category_id',
      ifnull((select capacity from categories_prices WHERE categories_prices.category_id = categories.id order by ts desc limit 1),0) as 'capacity', 
      count(products.id) as 'product_count', 
      (select group_concat( distinct (" " || certifications.name)) from certifications, products_certifications, products as p where products_certifications.certification_id = certifications.id AND products_certifications.deleted <> 1 AND products_certifications.product_id = p.id AND p.category_id = categories.id) as 'certs',
      ifnull((select price from categories_prices WHERE categories_prices.category_id = categories.id order by ts desc limit 1),0) as 'cost' 
    from 
      products 
    JOIN 
      suppliers ON suppliers.id = products.supplier_id
    JOIN 
      categories ON products.category_id = categories.id
    where 
      products.deleted <> 1 AND 
      products.published = 1 AND
      suppliers.deleted <> 1 
    group by 
      categories.id;
    `;
    var html = "";
    html += `<div class="grid-header" style="text-align:left">Product</div>`;
    html += `<div class="grid-header" style="text-align:right">Daily Capacity</div>`;
    html += `<div class="grid-header" style="text-align:right">Sources</div>`;
    html += `<div class="grid-header" style="text-align:right">Latest USD Price</div>`;
    html += `<div class="grid-header" style="text-align:left">Certifications</div>`;
    

    data.covid19.sendPeerDatabaseRequestRaw("covid19", sql, function (res) {
      res.rows.forEach(row => {

	if (row.certs == 'null' || row.certs == null) { row.certs = ""; }

        html += `<div data-category_id="${row.category_id}" class="active_category tip"><a>${row.product}</a><div class="tiptext">View All</div></div>`;
        html += `<div class="rightj">${s2Number(row.capacity)}</div>`;
        html += `<div class="rightj">${s2Number(row.product_count)}</div>`;
        html += `<div class="rightj">${row.cost.toFixed(2)}</div>`;
        html += `<div>${row.certs}</div>`
         
          ;
      });
      document.querySelector('.product-summary').innerHTML = html;
      document.querySelectorAll('.active_category a').forEach(el => {
        el.addEventListener('click', (e) => {
          data.covid19.active_category_id = e.target.parentElement.dataset.category_id;
          data.covid19.renderPage("customer", app, data);
        });
      });

      var pdfHTML = `
        <div style="padding: 15px; background: var(--saito-dhb);">
          <img class="logo major-logo" src="/covid19/dhbgloballogo.png">
        </div>
      `;
      pdfHTML += document.querySelector('.summary-section').innerHTML;
      pdfHTML += `<p>For questions or purchase inquiries, please contact us at <a href="mailto:e.yeung@dhb.global">e.yeung@dhb.global</a>.</p><hr />`;

      document.getElementById('list2pdf-btn').addEventListener('click', (e) => {
        data.covid19.pdfCap(pdfHTML, 'DHB-product-list-' + new Date().toISOString().split('T')[0].replace(/-/g,'') + '.pdf');
      });

    });
  },


  attachEvents(app, data) {

    document.getElementById('customer-search-btn').addEventListener('click', (e) => {
      CustomerPortal.render(app, data);
      CustomerPortal.attachEvents(app, data);
    });

  }

}
