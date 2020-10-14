const UpdateFileTemplate = require('./update-file.template');

module.exports = UpdateFile = {

  async render(app, data) {

    document.querySelector('.footer').innerHTML += UpdateFileTemplate();
   
    if (typeof data.file_id == 'undefined' || data.file_id == "") {
      data.covid19.returnFormFromPragma("covid19", "files", function(res) {
        document.querySelector('.modal-form').innerHTML = res;
        let fileel = document.getElementById('file_data');
        let typeel = document.getElementById('file_type');
        let nameel = document.getElementById('file_filename');
        data.covid19.treatFile(fileel, typeel, nameel);
      });
    } else {
      data.covid19.sendPeerDatabaseRequest("covid19", "files", "*", "deleted <> 1 AND files.id = " + data.file_id, null, function (res) {
        html = data.covid19.returnForm("covid19", "files", data.file_id, res.rows[0]);
        document.querySelector('.modal-form').innerHTML += html;
        let fileel = document.getElementById('file_data');
        let typeel = document.getElementById('file_type');
        let nameel = document.getElementById('file_filename');
        data.covid19.treatFile(fileel, typeel, nameel);
      });
    }

   
  },

  attachEvents(app, data) {
    let supplier_publickey = app.wallet.returnPublicKey();

    try {
      let pkeyobj = document.querySelector(".supplier_publickey");
      if (pkeyobj) {
        supplier_publickey = pkeyobj.value;
      }
    } catch (err) { }

    
    document.getElementById('save-file').addEventListener('click', (e) => {
      data.covid19.submitForm(document.querySelector('.modal-form'));
      document.querySelector('.file-template').destroy();
      UpdateSuccess.render(app, data);
      UpdateSuccess.attachEvents(app, data);
    });

    document.getElementById('cancel-file').addEventListener('click', (e) => {
     //document.querySelector('.file').style.display = "none";
     document.querySelector('.file-template').destroy();
    });

  }
}
