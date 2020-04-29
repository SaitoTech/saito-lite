const CustomerPortalTemplate = require('./customer-portal.template.js');
const ProductPage = require('./product-page');
const UpdateProduct = require('./update-product');

module.exports = CustomerPortal = {

  render(app, data) {

    document.querySelector(".main").innerHTML = CustomerPortalTemplate();
    document.querySelector(".navigation").innerHTML = '<div class="button navlink covid_back"><i class="fas fa-back"></i>back</div>';

    //
    // load categories
    //
    data.covid19.sendPeerDatabaseRequest("covid19", "categories", "*", "", null, function (res) {
      document.querySelector(".loading").style.display = "none";
      for (let i = 0; i < res.rows.length; i++) {
        let opt = document.createElement('option');
        opt.value = res.rows[i].id;
        opt.innerHTML = res.rows[i].name;
        if (res.rows[i].id == data.covid19.active_category_id) {
          opt.selected = true;
        }
        document.getElementById('select-product-type').appendChild(opt);
      }
      document.querySelector(".portal").style.display = "block";
    });

    if (data.covid19.isAdmin()) {
      document.getElementById('products-table-controls').style.display = 'block';
    }

  },


  attachEvents(app, data) {

    let portal_self = this;

    document.getElementById('select-product-type').addEventListener('change', (e) => {
      portal_self.updateProductGrid(app, data, e.currentTarget.value);
    });

    document.getElementById('add-product').addEventListener('click', (e) => {
      data.product_id = "";
      UpdateProduct.render(app, data);
      UpdateProduct.attachEvents(app, data);
    });


    if (data.covid19.active_category_id > 0) {
      setTimeout(() => {
        document.getElementById("select-product-type").value = data.covid19.active_category_id;
        portal_self.updateProductGrid(app, data, data.covid19.active_category_id);
      }, 300);
    }

    try {
      document.querySelector('.covid_back').addEventListener('click', (e) => {
        data.covid19.renderPage("home", app, data);
      });
    } catch (err) { }

    try {
      document.querySelector('.add-or-update-product-btn').addEventListener('click', (e) => {
        data.product_id = e.currentTarget.id;
        UpdateProduct.render(app, data);
        UpdateProduct.attachEvents(app, data);
      });
    } catch (err) { }

  },



  updateProductGrid(app, data, category_id) {

    data.covid19.active_category_id = category_id;

    if (category_id > 0) {

      //clear grid
      document.querySelector(".products-table").innerHTML = `
        <div class="table-head">Product</div>
        <div class="table-head">Daily Capacity</div>
        <div class="table-head">Location</div>
        <div class="table-head">Photo</div>
        <div class="table-head">Certifications</div>
        <div class="table-head">Unit Cost</div>
        <div class="table-head"></div>
        `;

      //
      // populate grid
      //
      var whereclause = "";
      if(data.covid19.isAdmin()) {
        whereclause = "suppliers.id = products.supplier_id AND products.deleted <> 1 AND products.category_id = " + category_id;
      } else {
        whereclause = "suppliers.id = products.supplier_id AND products.deleted <> 1 AND products.published = 1 AND products.category_id = " + category_id;        
      }
      data.covid19.sendPeerDatabaseRequest("covid19", "products JOIN suppliers", "products.id as 'product_id', product_specification, production_daily_capacity, suppliers.address as 'Location', 'Loading' as 'product_photo', pricing_per_unit_rmb, 'certifications' as 'certifications', pricing_per_unit_public, products.id", whereclause, null, function (res) {
        data.covid19.addProductsToTable(res.rows, ['product_specification', 'production_daily_capacity', 'Location', 'product_photo', 'certifications', 'pricing_per_unit_public', 'fullview'], app, data);
      });

      //
      //treat grid
      //
      document.querySelector(".products-table").style.display = "grid";


    }

  }

}

