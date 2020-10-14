const CategoryManagerTemplate = require('./category-manager.template');
const UpdatePrice = require('./update-price');
const UpdateCategory = require('./update-category');

module.exports = CategoryManager = {

  render(app, data) {

    document.querySelector(".main").innerHTML = CategoryManagerTemplate();
    document.querySelector(".navigation").innerHTML = '<div class="button navlink covid_back"><i class="fas fa-back"></i> Back</div>';


    //
    // load products
    //
    var sql = `
      SELECT 
        categories.id as 'category_id',
        categories.name as 'category',
        (SELECT categories_prices.price || ',' || categories_prices.capacity || ',' || categories_prices.ts FROM categories_prices where categories_prices.category_id = categories.id order by ts desc limit 1) as  'pricets'        
      FROM 
        categories
      WHERE
        "${app.wallet.returnPublicKey()}" = "${data.covid19.admin_pkey}"
      `;
    var html = `
          <div class="table-head">Category</div>
          <div class="table-head">Price</div>
          <div class="table-head">Capacity</div>
          <div class="table-head">Last Updated</div>
          <div class="table-head"></div>
        `;

    data.covid19.sendPeerDatabaseRequestRaw("covid19", sql, function (res) {

      res.rows.forEach(row => {

        var date = "";
        var price = "";
        if(row.pricets != null) {
          date =  new Date(row.pricets.split(',')[2]*1).toISOString().split('T')[0];
          price = row.pricets.split(',')[0];
          capacity = row.pricets.split(',')[1];
        }

        if (row.category_data != "") {

            html += `<div>${row.category}</div>`;
            html += `<div>${price}</div>`;
            html += `<div>${s2Number(capacity)}</div>`;
            html += `<div>${date}</div>`;
            html += `
            <div class="grid-buttons ${row.category_id}">
              <div class="grid-action add" data-id="${row.category_id}">Add New Price</div>
              <div class="grid-action edit" data-id="${row.category_id}">Edit Category</div>
            </div>`;

          }
      });

      document.querySelector(".loading").style.display = "none";
      document.querySelector("#category-table").style.display = "grid";
      document.querySelector("#category-table").innerHTML = html;


      //treat buttons
      document.querySelectorAll('.grid-action.edit').forEach(el => {
        el.addEventListener('click', (e) => {
          data.category_id = e.target.dataset.id;
          UpdateCategory.render(app, data);
          UpdateCategory.attachEvents(app, data);
        });
      });

      document.querySelectorAll('.grid-action.add').forEach(el => {
        el.addEventListener('click', async (e) => {

          data.category_id = e.target.dataset.id;
          UpdatePrice.render(app, data);
          UpdatePrice.attachEvents(app, data);
        });
      });
    });

  },

  attachEvents(app, data) {

    document.querySelector('.new-category-btn').addEventListener('click', (e) => {
      data.category_id = "";
      UpdateCategory.render(app, data);
      UpdateCategory.attachEvents(app, data);
    });

    try {
      document.querySelector('.covid_back').addEventListener('click', (e) => {
        data.covid19.renderPage("home", app, data);
      });
    } catch (err) { }
  }
}