const OrderManagerTemplate = require('./order-manager.template');
const UpdateOrder = require('./update-order');
const AttachFile = require('./attach-file');


module.exports = OrderManager = {

  render(app, data) {

    document.querySelector(".main").innerHTML = OrderManagerTemplate();
    document.querySelector(".navigation").innerHTML = '<div class="button navlink covid_back"><i class="fas fa-back"></i> Back</div>';


    //
    // load orders
    //

    var sql = `
      select 
        *
      from 
        orders
      where
        orders.deleted <> 1 AND
        (
          (admin = "${app.wallet.returnPublicKey()}"
        OR
          "${app.wallet.returnPublicKey()}" = "${data.covid19.admin_pkey}") 
        )
`;
    var html = `
          <div class="table-head">Name</div>
          <div class="table-head">Details</div>
          <div class="table-head">Key Requirments</div>
          <div class="table-head"></div>
        `;
    var rownum = 0;
    var rowclass = "";

    data.covid19.sendPeerDatabaseRequestRaw("covid19", sql, function (res) {
      res.rows.forEach(row => {
        rownum ++;
        if(rownum %2) { rowclass = "even"} else { rowclass = "odd"};
        html += `<div class="${rowclass}">${row.order_name}</div>`;
        html += `<div class="${rowclass}">${row.details}</div>`;
        html += `<div class="${rowclass}">${row.requirements}</div>`;
        html += `
        <div class="grid-buttons ${row.id} rowclass">
          <div class="grid-action edit" data-id="${row.id}">Edit</div>
          <div class="grid-action delete" data-id="${row.id}">Delete</div>          
        </div>`;
      });
      document.querySelector(".loading").style.display = "none";
      document.querySelector("#order-table").style.display = "grid";
      document.querySelector("#order-table").innerHTML = html;
     


      //treat buttons
      document.querySelectorAll('.grid-action.edit').forEach(el => {
        el.addEventListener('click', (e) => {
          data.order_id = e.target.dataset.id;
          UpdateOrder.render(app, data);
          UpdateOrder.attachEvents(app, data);
        });
      });

      document.querySelectorAll('.grid-action.delete').forEach(el => {
        el.addEventListener('click', (e) => {

          data.order_id = e.target.dataset.id;
          data.covid19.sendPeerDatabaseRequest("covid19", "orders", "uuid", "order.id = " + data.order_id, null, async (res) => {
            
            let c = confirm("Are you sure you want to delete this order?");
            if (c) {
              
              let values = [];
                  values[0] = {};
                  values[0].dbname = "covid19";
                  values[0].table  = "orders";
                  values[0].column = "uuid";
                  values[0].value = res.rows[0].uuid;
              
              data.covid19.deleteDatabase(values);
              
              await salert("Delete Requested - please reload in 30 seconds");
            
            }
          });
        });
      });

      document.querySelectorAll('.grid-action.attach').forEach(el => {
        el.addEventListener('click', (e) => {
          data.product_id = e.target.dataset.id;
          data.target_object = 'orders';
          AttachFile.render(app, data);
          AttachFile.attachEvents(app, data);

        });
      });

    });

  },

  attachEvents(app, data) {

    document.querySelector('.new-order-btn').addEventListener('click', (e) => {
      //data.product_id = e.currentTarget.id;
      UpdateOrder.render(app, data);
      UpdateOrder.attachEvents(app, data);
    });

    try {
      document.querySelector('.covid_back').addEventListener('click', (e) => {
        data.covid19.renderPage("home", app, data);
      });
    } catch (err) { }
  }
}
