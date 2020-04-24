const UpdateFileTemplate = require('./update-file.template');

module.exports = UpdateFile = {

  async render(app, data) {

    document.querySelector('.footer').innerHTML += UpdateFileTemplate();

    data.covid19.returnFormFromPragma("covid19", "files", function(res) {
      document.querySelector('.modal-form').innerHTML = res;

      //data.covid19.treatACDropDown(document.getElementById('file_id'), 'files', 'id', 'name');
      //data.covid19.treatHide(document.getElementById('product_id'));
      //document.getElementById('product_id').value = data.product_id;
      let fileel = document.getElementById('file_data');
      let typeel = document.getElementById('file_type');
      let nameel = document.getElementById('file_filename');
      data.covid19.treatFile(fileel, typeel, nameel);
      //document.getElementById('admin').value = this.app.wallet.returnPublicKey();

    });
    
   
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
      FileManager.render(app, data);
      FileManager.attachEvents(app, data);

    });

    document.getElementById('cancel-file').addEventListener('click', (e) => {
     //document.querySelector('.file').style.display = "none";
     document.querySelector('.file-template').destroy();
    });

  }
}