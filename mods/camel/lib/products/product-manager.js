const ProductManagerTemplate = require('./product-manager.template');
const UpdateProduct = require('./product-update');
//const AttachFile = require('./attach-file');


module.exports = ProductManager = {

  render(app, data) {

    document.querySelector(".main").innerHTML = ProductManagerTemplate();
    //document.querySelector(".navigation").innerHTML = '<div class="button navlink covid_back"><i class="fas fa-back"></i> Back</div>';


    //
    // load products
    //
    /*
        var sql = `
          select 
            *
          from 
            products
          where
            products.deleted <> 1 AND
            (
              (admin = "${app.wallet.returnPublicKey()}"
            OR
              "${app.wallet.returnPublicKey()}" = "${data.covid19.admin_pkey}") 
            )
    `;
    */
    var sql = `
      select 
        *
      from 
        products
      where
        products.deleted <> 1
      `;

    var html = `
          <div class="table-head">Name</div>
          <div class="table-head">Details</div>
          <div class="table-head">Product Image</div>
          <div class="table-head"></div>
        `;
    var rownum = 0;
    var rowclass = "";

    data.mod.sendPeerDatabaseRequestRaw("camel", sql, function (res) {
      res.rows.forEach(row => {
        rownum++;
        if (rownum % 2) { rowclass = "even" } else { rowclass = "odd" };
        html += `<div class="${rowclass}">${row.product_name}</div>`;
        html += `<div class="${rowclass}">${row.product_details}</div>`;
        html += `<div class="${rowclass}">${row.product_photo}</div>`;
        html += `
        <div class="grid-buttons ${row.uuid} rowclass">
          <div class="grid-action edit" data-id="${row.uuid}">Edit</div>
          <div class="grid-action delete" data-id="${row.uuid}">Delete</div>          
        </div>`;
      });
      document.querySelector(".loading").style.display = "none";
      document.querySelector("#product-table").style.display = "grid";
      document.querySelector("#product-table").innerHTML = html;



      //treat buttons
      document.querySelectorAll('.grid-action.edit').forEach(el => {
        el.addEventListener('click', (e) => {
          data.product_uuid = e.target.dataset.uuid;
          UpdateProduct.render(app, data);
          UpdateProduct.attachEvents(app, data);
        });
      });

      document.querySelectorAll('.grid-action.delete').forEach(el => {
        el.addEventListener('click', (e) => {

          data.product_uuid = e.target.dataset.uuid;
          data.covid19.sendPeerDatabaseRequest("covid19", "products", "uuid", "product.id = " + data.product_uuid, null, async (res) => {

            let c = confirm("Are you sure you want to delete this product?");
            if (c) {

              let values = [];
              values[0] = {};
              values[0].dbname = "covid19";
              values[0].table = "products";
              values[0].column = "uuid";
              values[0].value = res.rows[0].uuid;

              data.covid19.deleteDatabase(values);

              await salert("Delete Requested - please reload in 30 seconds");

            }
          });
        });
      });

    });

  },

  attachEvents(app, data) {

    document.querySelector('.new-product-btn').addEventListener('click', (e) => {
      UpdateProduct.render(app, data);
      UpdateProduct.attachEvents(app, data);
    });
  }
}
