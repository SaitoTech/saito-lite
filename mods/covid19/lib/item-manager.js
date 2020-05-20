const ItemManagerTemplate = require('./item-manager.template');
const UpdateItem = require('./update-item');
const AttachProduct = require('./attach-product');
const ItemProduct = require('./utils/item-product');


module.exports = ItemManager = {

  render(app, data) {

    document.querySelector(".order-items").innerHTML = ItemManagerTemplate();
    document.querySelector(".navigation").innerHTML = '<div class="button navlink covid_back"><i class="fas fa-back"></i> Back</div>';


    //
    // load products
    //

    var sql = `
      select 
        categories.name as 'category',
        categories.id as 'category_id',
        statuses.status_name as 'status',
        items.id as 'item_id',
        *
      from 
        items 
      JOIN 
        categories ON categories.id = items.category_id
      JOIN 
        statuses ON statuses.id = items.status_id

      where
        items.deleted <> 1 AND
        items.order_id = ${data.order_id};
        (
          (admin = "${app.wallet.returnPublicKey()}"
        OR
          "${app.wallet.returnPublicKey()}" = "${data.covid19.admin_pkey}") 
        )
`;
    var html = ``;

    data.covid19.sendPeerDatabaseRequestRaw("covid19", sql, function (res) {
      res.rows.forEach(row => {

        html += `
        <div class="item-deails grid-2-columns">
          <div class="table-head">Category</div><div>${row.category}</div>
          <div class="table-head">Status</div><div>${row.status}</div>
          <div class="table-head">Number</div><div>${s2Number(row.number)}</div>
        </div>
        <div class="item-requirements">
          <div class="table-head">Requirments</div>
          <div>${row.requirements}</div>
        </div>
        <div data-item_id="${row.item_id}" class="item-product"></div>
        <div class="grid-buttons fullrow hr ${row.item_id}">
          <div class="grid-action edit" data-item_id="${row.item_id}">Edit</div>
          <div class="grid-action delete" data-item_id="${row.item_id}">Delete</div>
          <div class="grid-action attach-product" data-category_id="${row.category_id}" data-item_id="${row.item_id}">Add&nbspProduct</div>          
        </div>
        `;
      });
      document.querySelector(".loading").style.display = "none";
      document.querySelector("#item-table").style.display = "grid";
      document.querySelector("#item-table").innerHTML = html;

      document.querySelectorAll('.item-product').forEach(el => {
        data.item_id = el.dataset.item_id;
        ItemProduct.render(app, data, el);
        ItemProduct.attachEvents(app, data, el);
      });


      //treat buttons
      document.querySelectorAll('.grid-action.edit').forEach(el => {
        el.addEventListener('click', (e) => {
          data.item_id = e.target.dataset.item_id;
          UpdateItem.render(app, data);
          UpdateItem.attachEvents(app, data);
        });
      });

      document.querySelectorAll('.grid-action.attach-product').forEach(el => {
        el.addEventListener('click', (e) => {
          data.item_id = e.target.dataset.item_id;
          data.category_id = e.target.dataset.category_id;
          AttachProduct.render(app, data);
          AttachProduct.attachEvents(app, data);
        });
      });

      document.querySelectorAll('.grid-action.delete').forEach(el => {
        el.addEventListener('click', (e) => {

          data.item_id = e.target.dataset.item_id;
          data.covid19.sendPeerDatabaseRequest("covid19", "items", "uuid", "item.id = " + data.item_id, null, async (res) => {
            
            let c = confirm("Are you sure you want to delete this item?");
            if (c) {
              
              let values = [];
                  values[0] = {};
                  values[0].dbname = "covid19";
                  values[0].table  = "items";
                  values[0].column = "uuid";
                  values[0].value = res.rows[0].uuid;
              
              data.covid19.deleteDatabase(values);
              
              await salert("Delete Requested - please reload in 30 seconds");
            
            }
          });
        });
      });

      document.querySelector('.create-product-btn').addEventListener('click', (e) => {
          data.product_id = '';
          UpdateProduct.render(app, data);
          UpdateProduct.attachEvents(app, data);
      });

      //add products

    });

  },

  attachEvents(app, data) {

    var this_products = this;

    document.querySelector('.new-item-btn').addEventListener('click', (e) => {
      data.item_id = "";
      UpdateItem.render(app, data);
      UpdateItem.attachEvents(app, data);
    });

    try {
      document.querySelector('.covid_back').addEventListener('click', (e) => {
        data.covid19.renderPage("home", app, data);
      });
    } catch (err) { }
    
    document.querySelector('.items-refresh').addEventListener('click', (e) => {
      this_products.render(app, data);
      this_products.attachEvents(app, data);
    });

    document.querySelector('.download-all-btn').addEventListener('click', (e) => {
      data.covid19.returnZipForOrder(data.order_id);
    });

  }
}
