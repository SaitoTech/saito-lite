const AttachmentsTemplate = require('./attachments.template');

module.exports = Attachments = {

  async render(app, data) {

    document.querySelector('.footer').innerHTML += AttachmentsTemplate();

    var sql = `
      select 
        distinct(files.file_filename), 
        files.file_type,
        length(files.file_data) as 'file_length',
        'select'
      from 
        files JOIN file_attachments 
          on  files.id = file_attachments.file_id
      where
        file_attachments.object_table = 'products' and 
        file_attachments.object_id = ${data.product_id}
        `;
    var html = `
          <div class="table-head">Bundle</div>
          <div class="table-head">Name/s</div>
          <div class="table-head">Types</div>
          <div class="table-head">Size</div>
          <div class="table-head">Select</div>
          <div class="table-head"></div>
        `;

    data.covid19.sendPeerDatabaseRequestRaw("covid19", sql, function (res) {
      res.rows.forEach(row => {
        if(typeof row.file_data == 'null') {row.file_data = ""}
        html += `<div>      -</div>`;
        html += `<div>${row.file_filename}</div>`;
        html += `<div>${row.file_type}</div>`;
        html += `<div>${row.file_length * 0.00075}KB</div>`;
        html += `
        <div class="grid-select ${row.id}">
          <input class="select" data-id="${row.id}" type="checkbox" />
        </div>`;
        html += `
        <div class="grid-buttons ${row.id}">
          <div class="grid-action edit" data-id="${row.id}">Edit</div>
          <div class="grid-action delete" data-id="${row.id}">Delete</div>
        </div>`;
      });

      sql = `
      select 
        distinct(bundles.name), 
        group_concat(files.file_filename) as 'filenames',
        'zip' as 'file_type' ,
        length(group_concat(files.file_data)) as 'file_length',
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
          html += `<div>${row.name}</div>`;
          html += `<div>${row.filenames}</div>`;
          html += `<div>${row.file_type}</div>`;
          html += `<div>${row.file_length * 0.00075}KB</div>`;
          html += `
          <div class="grid-select ${row.id}">
            <input class="select" data-id="${row.id}" type="checkbox" />
          </div>`;
          html += `
          <div class="grid-buttons ${row.id}">
            <div class="grid-action edit" data-id="${row.id}">Edit</div>
            <div class="grid-action delete" data-id="${row.id}">Delete</div>
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

    });


  },

  attachEvents(app, data) {
    
    


    document.getElementById('attach-download').addEventListener('click', (e) => {
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
