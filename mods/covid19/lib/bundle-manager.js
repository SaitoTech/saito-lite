const BundleManagerTemplate = require('./bundle-manager.template');
const UpdateBundle = require('./update-bundle');
const AttachFile = require('./attach-file');


module.exports = BundleManager = {

  render(app, data) {

    document.querySelector(".main").innerHTML = BundleManagerTemplate();
    document.querySelector(".navigation").innerHTML = '<div class="button navlink covid_back"><i class="fas fa-back"></i> Back</div>';


    //
    // load products
    //

    var sql = `
      select 
        *,
        ( select count(*) from file_attachments where file_attachments.object_table = 'bundles' AND file_attachments.object_id = bundles.id ) as 'count'
      from 
        bundles
      where
        bundles.deleted <> 1 AND
        (
          (admin = "${app.wallet.returnPublicKey()}"
        OR
          "${app.wallet.returnPublicKey()}" = "${data.covid19.admin_pkey}") 
        )
`;
    var html = `
          <div class="table-head">Name</div>
          <div class="table-head">Description</div>
          <div class="table-head">No. Files</div>
          <div class="table-head"></div>
        `;

    data.covid19.sendPeerDatabaseRequestRaw("covid19", sql, function (res) {
      res.rows.forEach(row => {

        html += `<div>${row.name}</div>`;
        html += `<div>${row.description}</div>`;
        html += `<div>${row.count}</div>`;
        html += `
        <div class="grid-buttons ${row.id}">
          <div class="grid-action edit" data-id="${row.id}">Edit</div>
          <div class="grid-action delete" data-id="${row.id}">Delete</div>
          <div class="grid-action attach" data-id="${row.id}">Add File</div>          
        </div>`;
      });
      document.querySelector(".loading").style.display = "none";
      document.querySelector("#bundle-table").style.display = "grid";
      document.querySelector("#bundle-table").innerHTML = html;


      //treat buttons
      document.querySelectorAll('.grid-action.edit').forEach(el => {
        el.addEventListener('click', (e) => {
          data.bundle_id = e.target.dataset.id;
          UpdateBundle.render(app, data);
          UpdateBundle.attachEvents(app, data);
        });
      });

      document.querySelectorAll('.grid-action.delete').forEach(el => {
        el.addEventListener('click', (e) => {

          data.bundle_id = e.target.dataset.id;
          data.covid19.sendPeerDatabaseRequest("covid19", "bundles", "uuid", "bundle.id = " + data.bundle_id, null, async (res) => {
            
            let c = confirm("Are you sure you want to delete this bundle?");
            if (c) {
              
              let values = [];
                  values[0] = {};
                  values[0].dbname = "covid19";
                  values[0].table  = "bundles";
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
          data.target_object = 'bundles';
          AttachFile.render(app, data);
          AttachFile.attachEvents(app, data);

        });
      });

    });

  },

  attachEvents(app, data) {

    document.querySelector('.new-bundle-btn').addEventListener('click', (e) => {
      //data.product_id = e.currentTarget.id;
      UpdateBundle.render(app, data);
      UpdateBundle.attachEvents(app, data);
    });

    try {
      document.querySelector('.covid_back').addEventListener('click', (e) => {
        data.covid19.renderPage("home", app, data);
      });
    } catch (err) { }
  }
}
