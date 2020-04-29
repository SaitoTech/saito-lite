const AttachmentsTemplate = require('./attachments.template');

module.exports = Attachments = {

  async render(app, data) {

    document.querySelector('.footer').innerHTML += AttachmentsTemplate();

    var sql = `
      select 
        distinct(certifications.name), 
        products_certifications.file_type,
        length(products_certifications.file) as 'file_length',
        products_certifications.id,
        'select'
      from 
        certifications JOIN products_certifications 
          on  certifications.id = products_certifications.certification_id
      where
      products_certifications.product_id = ${data.product_id}
        `;
    var html = `
          <div class="table-head">Type</div>
          <div class="table-head">Name/s</div>
          <div class="table-head">Types</div>
          <div class="table-head">Size</div>
          <div class="table-head">Select</div>
        `;

console.log(sql);
console.log("FINDING ATTACHMENTS");

    data.covid19.sendPeerDatabaseRequestRaw("covid19", sql, function (res) {

      res.rows.forEach(row => {
        if(typeof row.file_data == 'null') {row.file_data = ""}
        html += `<div>Cert.</div>`;
        html += `<div>${row.file_filename}</div>`;
        html += `<div>${row.file_type}</div>`;
        html += `<div>${parseInt(row.file_length * 0.00075)} KB</div>`;
        html += `
        <div class="grid-select ${row.id}">
          <input class="select" data-table-id="products_certifications" data-id="${row.id}" type="checkbox" />
        </div>`;
       });
      });       

      var sql = `
      select 
        distinct(files.file_filename), 
        files.file_type,
        length(files.file_data) as 'file_length',
        files.id,
        'select'
      from 
        files JOIN file_attachments 
          on  files.id = file_attachments.file_id
      where
        file_attachments.object_table = 'products' and 
        file_attachments.object_id = ${data.product_id}
        `;
  
    data.covid19.sendPeerDatabaseRequestRaw("covid19", sql, function (res) {
      res.rows.forEach(row => {
        if(typeof row.file_data == 'null') {row.file_data = ""}
        html += `<div>File</div>`;
        html += `<div>${row.file_filename}</div>`;
        html += `<div>${row.file_type}</div>`;
        html += `<div>${parseInt(row.file_length * 0.00075)} KB</div>`;
        html += `
        <div class="grid-select ${row.id}">
          <input class="select" data-table-id="products_certifications" data-id="${row.id}" type="checkbox" />
        </div>`;
      });
    });

      sql = `
      select 
        distinct(bundles.name), 
        group_concat(files.file_filename) as 'filenames',
        'application/zip' as 'file_type' ,
        length(group_concat(files.file_data)) as 'file_length',
        bundles.id,
        'select'
      from 
        bundles 
      JOIN 
        bundle_attachments ON bundles.id = bundle_attachments.bundle_id
      JOIN
        file_attachments ON (file_attachments.object_table = 'bundles' and file_attachments.object_id = bundles.id) 
      JOIN
        files on files.id = file_attachments.file_id
      where
        bundle_attachments.object_table = 'products' and 
        bundle_attachments.object_id = ${data.product_id}
        `;

      data.covid19.sendPeerDatabaseRequestRaw("covid19", sql, function (res) {
        res.rows.forEach(row => {
          if(typeof row.file_data == 'null') {row.file_data = ""}
          html += `<div>Bundle:<br/ >${row.name}</div>`;
          html += `<div>${row.filenames.split(',').join('<br />')}</div>`;
          html += `<div>${row.file_type}</div>`;
          html += `<div>${parseInt(row.file_length * 0.00075)} KB</div>`;
          html += `
          <div class="grid-select ${row.id}">
            <input class="select" data-id="${row.id}" type="checkbox" />
          </div>`;
        });
        document.querySelector("#attachments-grid").innerHTML = html;
      });
     


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


  },

  attachEvents(app, data) {
    
    


    document.getElementById('attach-download').addEventListener('click', (e) => {
      salert('Coming Soon to a Blockchain Near You')
      document.querySelector('.file-template').destroy();
      //UpdateSuccess.render(app, data);
      //UpdateSuccess.attachEvents(app, data);

    });

    document.getElementById('cancel-attachments').addEventListener('click', (e) => {
      //document.querySelector('.file').style.display = "none";
      document.querySelector('.modal-form-wrapper').destroy();
    });
  }
}
