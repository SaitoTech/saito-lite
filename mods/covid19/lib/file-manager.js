const FileManagerTemplate = require('./file-manager.template');
const UpdateFile = require('./update-file');
const ProductPage = require('./product-page.js');
const UpdateProduct = require('./update-product.js');


module.exports = FileManager = {

  render(app, data) {

    document.querySelector(".main").innerHTML = FileManagerTemplate();
    document.querySelector(".navigation").innerHTML = '<div class="button navlink covid_back"><i class="fas fa-back"></i> Back</div>';


    //
    // load products
    //
    var sql = `
      select 
        id,
        file_filename,
        file_type,
        length(file_data) as 'file_size'
      from 
        files
      where
        files.deleted <> 1 AND 
        (
          (admin = "${app.wallet.returnPublicKey()}"
        OR
          "${app.wallet.returnPublicKey()}" = "${data.covid19.admin_pkey}")
        )
`;
    var html = `
          <div class="table-head">Name</div>
          <div class="table-head">Type</div>
          <div class="table-head">Size</div>
          <div class="table-head"></div>
        `;

    data.covid19.sendPeerDatabaseRequestRaw("covid19", sql, function (res) {

      res.rows.forEach(row => {

console.log("RECEIVED: " + JSON.stringify(row));

        if (typeof row.file_data == 'null') { row.file_data = ""; }
	let filelen = 0.0;
        if (row.file_data != "") { 

	  let filed = row.file_data;
	  if (filed != "" && filed != null) { filelen = parseFloat((filed).replace(/=/g,"").length * 0.00075); }
	  if (filed != "" && filed != null) { 
	    filelen = parseInt((filed).replace(/=/g,"").length * 0.00075); 
	    if (filelen == 0) { filelen = parseFloat((filed).replace(/=/g,"").length * 0.00075); }
          }

	  if (filelen == 0 && row.file_size > 0) {  filelen = row.file_size; }

	  if (filelen > 0) {

            html += `<div>${row.file_filename}</div>`;
            html += `<div>${row.file_type}</div>`;
            html += `<div>${filelen} KB</div>`;
            html += `
            <div class="grid-buttons ${row.id}">
              <div class="grid-action edit" data-id="${row.id}">Edit</div>
              <div class="grid-action delete" data-id="${row.id}">Delete</div>
            </div>`;

	  }
        }
      });

      document.querySelector(".loading").style.display = "none";
      document.querySelector("#file-table").style.display = "grid";
      document.querySelector("#file-table").innerHTML = html;


      //treat buttons
      document.querySelectorAll('.grid-action.edit').forEach(el => {
        el.addEventListener('click', (e) => {
          data.file_id = e.target.dataset.id;
          UpdateFile.render(app, data);
          UpdateFile.attachEvents(app, data);
        });
      });

      document.querySelectorAll('.grid-action.delete').forEach(el => {
        el.addEventListener('click', async (e) => {

          data.file_id = e.target.dataset.id;
          data.covid19.sendPeerDatabaseRequest("covid19", "files", "uuid", "files.id = " + data.file_id, null, async (res) => {

	    let c = confirm("Are you sure you want to delete this file?");
	    if (c) {
	
	      let values = [];
		  values[0] = {};
	          values[0].dbname = "covid19";
	          values[0].table  = "files";
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

    document.querySelector('.new-file-btn').addEventListener('click', (e) => {
      data.product_id = e.currentTarget.id;
      UpdateFile.render(app, data);
      UpdateFile.attachEvents(app, data);
    });

    try {
      document.querySelector('.covid_back').addEventListener('click', (e) => {
        data.covid19.renderPage("home", app, data);
      });
    } catch (err) { }
  }
}
