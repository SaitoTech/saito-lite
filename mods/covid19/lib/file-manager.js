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
        *
      from 
        files
      where
        (admin = "${app.wallet.returnPublicKey()}"
      OR
        "${app.wallet.returnPublicKey()}" = "${data.covid19.admin_pkey}") 
`;
    var html = `
          <div class="table-head">Name</div>
          <div class="table-head">Type</div>
          <div class="table-head">Size</div>
          <div class="table-head"></div>
        `;

    data.covid19.sendPeerDatabaseRequestRaw("covid19", sql, function (res) {
      res.rows.forEach(row => {

        if (typeof row.file_data == 'null') { row.file_data = ""; }

	let filelen = 0;
        if (row.file_data != "") { 
	  filelen = parseInt((row.file_data).replace(/=/g,"").length * 0.00075);
        }

        html += `<div>${row.file_filename}</div>`;
        html += `<div>${row.file_type}</div>`;
        html += `<div>${filelen} KB</div>`;
        html += `
        <div class="grid-buttons ${row.id}">
          <div class="grid-action edit" data-id="${row.id}">Edit</div>
          <div class="grid-action delete" data-id="${row.id}">Delete</div>
        </div>`;
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
        el.addEventListener('click', (e) => {
          salert("Delete - coming soon!");
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
