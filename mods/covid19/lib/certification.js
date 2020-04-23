const CertificationTemplate = require('./certification.template');

module.exports = Certification = {

  async render(app, data) {

    document.querySelector('.main').innerHTML += CertificationTemplate();

    data.covid19.returnFormFromPragma("covid19", "products_certifications", function(res) {
      document.querySelector('.modal-form').innerHTML = res;

      data.covid19.treatACDropDown(document.getElementById('certification_id'), 'certifications', 'id', 'name');
      data.covid19.treatHide(document.getElementById('product_id'));
      document.getElementById('product_id').value = data.product_id;
      let fileel = document.getElementById('file');
      let typeel = document.getElementById('file_type');
      let nameel = document.getElementById('file_filename');
      data.covid19.treatFile(fileel, typeel, nameel);

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

    
    document.getElementById('save-certification').addEventListener('click', (e) => {
      data.covid19.submitForm(document.querySelector('.modal-form'));
      UpdateSuccess.render(app, data);
      UpdateSuccess.attachEvents(app, data);

    });

    document.getElementById('cancel-certification').addEventListener('click', (e) => {
     document.querySelector('.certification').style.display = "none";
    });

  }
}

