const AttachFileTemplate = require('./attach-file.template');

module.exports = AttachFile = {

  async render(app, data) {

    document.querySelector('.footer').innerHTML += AttachFileTemplate();

    data.covid19.returnFormFromPragma("covid19", "file_attachments", function(res) {
      document.querySelector('.modal-form').innerHTML = res;

      data.covid19.treatACDropDown(document.getElementById('file_id'), 'files', 'id', 'file_filename');
      data.covid19.treatHide(document.getElementById('object_table'));
      document.getElementById('object_table').value = data.target_object;
      data.covid19.treatHide(document.getElementById('object_id'));
      document.getElementById('object_id').value = data.product_id;
      
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

    
    document.getElementById('attach-file').addEventListener('click', (e) => {
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