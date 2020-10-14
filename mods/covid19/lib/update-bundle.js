const UpdateBundleTemplate = require('./update-bundle.template');

module.exports = UpdateBundle = {

  async render(app, data) {

    document.querySelector('.footer').innerHTML += UpdateBundleTemplate();

    var html = "";

    if (typeof data.bundle_id == 'undefined' || data.bundle_id == "") {
      data.covid19.returnFormFromPragma("covid19", "bundles", function (res) {
        document.querySelector('.modal-form').innerHTML = res;
      });
    } else {
      data.covid19.sendPeerDatabaseRequest("covid19", "bundles", "*", "deleted <> 1 AND bundles.id = " + data.bundle_id, null, function (res) {
        html = data.covid19.returnForm("covid19", "bundles", data.bundle_id, res.rows[0]);
        document.querySelector('.modal-form').innerHTML += html;
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


    document.getElementById('save-bundle').addEventListener('click', (e) => {
      data.covid19.submitForm(document.querySelector('.modal-form'));
      document.querySelector('.bundle-template').destroy();
//      UpdateSuccess.render(app, data);
//      UpdateSuccess.attachEvents(app, data);

    });

    document.getElementById('cancel-bundle').addEventListener('click', (e) => {
      //document.querySelector('.bundle').style.display = "none";
      data.bundle_id = "";
      document.querySelector('.bundle-template').destroy();
    });

  }
}
