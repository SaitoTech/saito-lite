const UpdateOrderTemplate = require('./update-order.template');
const ItemManager = require('./item-manager');

module.exports = UpdateOrder = {

  async render(app, data) {

    document.querySelector('.main').innerHTML = UpdateOrderTemplate();

    var html = "";

    if (typeof data.order_id == 'undefined' || data.order_id == "") {
      data.covid19.returnFormFromPragma("covid19", "orders", function (res) {
        document.querySelector('.main-form').innerHTML = res;
        data.covid19.treatTextArea(document.getElementById('requirements'));
      });
    } else {
      data.covid19.sendPeerDatabaseRequest("covid19", "orders", "*", "deleted <> 1 AND orders.id = " + data.order_id, null, function (res) {
        html = data.covid19.returnForm("covid19", "orders", data.order_id, res.rows[0]);
        document.querySelector('.main-form').innerHTML += html;
        data.covid19.treatTextArea(document.getElementById('requirements'));

        ItemManager.render(app, data);
        ItemManager.attachEvents(app, data);
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
      data.covid19.submitForm(document.querySelector('.main-form'));
      document.querySelector('.order-template').destroy();
      UpdateSuccess.render(app, data);
      UpdateSuccess.attachEvents(app, data);

    });

  

    /* no cancel button in full view
    document.getElementById('cancel-order').addEventListener('click', (e) => {
      //document.querySelector('.order').style.display = "none";
      data.order_id = "";
      document.querySelector('.order-template').destroy();
    });
    */
  }
}
