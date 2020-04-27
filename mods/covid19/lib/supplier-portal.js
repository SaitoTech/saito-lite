const SupplierPortalTemplate = require('./supplier-portal.template.js');
const ProductPage = require('./product-page.js');
const UpdateProduct = require('./update-product.js');


module.exports = SupplierPortal = {

  render(app, data) {

    document.querySelector(".main").innerHTML = SupplierPortalTemplate();
    document.querySelector(".navigation").innerHTML = '<div class="button navlink covid_back"><i class="fas fa-back"></i> Back</div>';


    //
    // load products
    //

    var sql = `select id from suppliers where publickey = "${app.wallet.returnPublicKey()}"`;
    data.covid19.sendPeerDatabaseRequestRaw("covid19", sql, function (res) {
      res.rows.forEach(row => {
        data.supplier_id = row.id;
      });
    });

    var sql = `
      select 
        products.id as 'product_id', 
        categories.name, 
        products.product_specification as 'name', 
        products.product_photo as 'product_photo', 
        products.pricing_per_unit_rmb as 'unit_cost', 
        products.production_daily_capacity as 'capacity', 
        products.id
      from 
        products JOIN 
        suppliers LEFT JOIN 
        categories
      where
        suppliers.id = products.supplier_id AND 
        products.category_id = categories.id AND 
        products.deleted <> 1 AND 
        suppliers.deleted <> 1 AND
        suppliers.publickey = "${app.wallet.returnPublicKey()}"
`;
    var html = `
          <div class="table-head">Product</div>
          <div class="table-head">Photo</div>
          <div class="table-head">Unit Cost</div>
          <div class="table-head">Daily Volume</div>
          <div class="table-head">ID</div>
          <div class="table-head"></div>
        `;

    data.covid19.sendPeerDatabaseRequestRaw("covid19", sql, function (res) {
      res.rows.forEach(row => {
        html += `<div>${row.name}</div>`;
        html += `<div class="grid-image-holder"><img src="${row.product_photo}"/></div>`;
        html += `<div>${row.unit_cost}</div>`;
        html += `<div>${row.capacity}</div>`;
        html += `<div>${row.id}</div>`;
        html += `
        <div class="grid-buttons ${row.id}">
          <div class="grid-action edit" data-id="${row.id}">Edit</div>
          <div class="grid-action delete" data-id="${row.id}">Delete</div>
        </div>`;
      });
      document.querySelector(".loading").style.display = "none";
      document.querySelector(".portal").style.display = "block";
      document.querySelector("#products-table").style.display = "grid";
      document.querySelector("#products-table").innerHTML = html;


      //treat buttons
      document.querySelectorAll('.grid-action.edit').forEach(el => {
        el.addEventListener('click', (e) => {
          data.product_id = e.target.dataset.id;
          UpdateProduct.render(app, data);
          UpdateProduct.attachEvents(app, data);
        });
      });

      document.querySelectorAll('.grid-action.delete').forEach(el => {
        el.addEventListener('click', (e) => {
          salert("Delete - coming soon!");
        });
      });

    });

  },

  attachEvents(app, data) {

    document.querySelector('.add-or-update-product-btn').addEventListener('click', (e) => {
      data.product_id = "";
      UpdateProduct.render(app, data);
      UpdateProduct.attachEvents(app, data);
    });

    try {
      document.querySelector('.covid_back').addEventListener('click', (e) => {
        data.covid19.renderPage("home", app, data);
      });
    } catch (err) { }
  }
}
