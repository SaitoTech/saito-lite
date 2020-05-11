const UpdateOrderTemplate = require('./update-order.template');

module.exports = UpdateOrder = {

  async render(app, data) {

    document.querySelector('.footer').innerHTML += UpdateOrderTemplate();

    var html = "";

    if (typeof data.order_id == 'undefined' || data.order_id == "") {
      data.covid19.returnFormFromPragma("covid19", "orders", function (res) {
        document.querySelector('.modal-form').innerHTML = res;
      });
    } else {
      data.covid19.sendPeerDatabaseRequest("covid19", "orders", "*", "deleted <> 1 AND orders.id = " + data.order_id, null, function (res) {
        html = data.covid19.returnForm("covid19", "orders", data.bunlde_id, res.rows[0]);
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


    document.getElementById('save-order').addEventListener('click', (e) => {
      data.covid19.submitForm(document.querySelector('.modal-form'));
      document.querySelector('.order-template').destroy();
//      UpdateSuccess.render(app, data);
//      UpdateSuccess.attachEvents(app, data);

    });

    document.getElementById('cancel-order').addEventListener('click', (e) => {
      //document.querySelector('.order').style.display = "none";
      data.order_id = "";
      document.querySelector('.order-template').destroy();
    });

  }
}
