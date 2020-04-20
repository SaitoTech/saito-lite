const UpdateSupplierTemplate = require('./update-supplier.template');
const UpdateSuccess = require('./update-success');



module.exports = UpdateSupplier = {

  async render(app, data) {

    var supplier_publickey = app.wallet.returnPublicKey();
    if (data.covid19.isAdmin()) {
      supplier_publickey = data.supplier_publickey;
    }

    document.querySelector(".main").innerHTML = UpdateSupplierTemplate(app, data);

    data.covid19.sendPeerDatabaseRequest("covid19", "suppliers", "*", "suppliers.publickey = '" + supplier_publickey + "'", null, function (res) {

      let html = "";
      if (res.rows.length > 0) {
        html = data.covid19.returnForm("covid19", "suppliers", res.rows[0].id, res.rows[0]);
      } else {
        let row = {
          Name: "",
          Email: "",
          Phone: "",
          Address: "",
          Wechat: "",
          Notes: "",
          publickey: app.wallet.returnPublicKey()
        }
        html = data.covid19.returnForm("covid19", "suppliers", "", row);
      }

      document.querySelector(".supplier-grid").innerHTML = html;
      document.querySelector('.loading').style.display = "none";
      document.querySelector('.portal').style.display = "block";
    });
  },



  attachEvents(app, data) {

    var supplier_publickey = app.wallet.returnPublicKey();
    if (data.covid19.isAdmin()) {
      supplier_publickey = data.supplier_publickey;
    }

    document.querySelector('.update-supplier-btn').addEventListener('click', (e) => {
      try {
        let pkeyobj = document.querySelector(".supplier_publickey");
        if (pkeyobj) {
          supplier_publickey = pkeyobj.value;
        }
      } catch (err) { }

      data.covid19.submitForm();
      UpdateSuccess.render(app, data);
      UpdateSuccess.attachEvents(app, data);

    });

  }

}

