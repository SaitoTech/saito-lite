const AttachBundleTemplate = require('./attach-bundle.template');

module.exports = AttachBundle = {

  async render(app, data) {

    document.querySelector('.footer').innerHTML += AttachBundleTemplate();

    data.covid19.returnFormFromPragma("covid19", "bundle_attachments", function(res) {
      document.querySelector('.modal-form').innerHTML = res;

      data.covid19.treatACDropDown(document.getElementById('bundle_id'), 'bundles', 'id', 'name');
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

    
    document.getElementById('attach-bundle').addEventListener('click', (e) => {
      data.covid19.submitForm(document.querySelector('.modal-form'));
      document.querySelector('.bundle-template').destroy();
      UpdateSuccess.render(app, data);
      UpdateSuccess.attachEvents(app, data);

    });

    document.getElementById('cancel-bundle').addEventListener('click', (e) => {
     //document.querySelector('.bundle').style.display = "none";
     document.querySelector('.bundle-template').destroy();
    });

  }
}