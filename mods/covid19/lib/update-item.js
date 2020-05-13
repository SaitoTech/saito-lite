const UpdateItemTemplate = require('./update-item.template');

module.exports = UpdateItem = {

  async render(app, data) {

    document.querySelector('.footer').innerHTML += UpdateItemTemplate();

    var html = "";

    if (typeof data.item_id == 'undefined' || data.item_id == "") {
      data.covid19.returnFormFromPragma("covid19", "items", function (res) {
        document.querySelector('.modal-form').innerHTML = res;

        document.getElementById('order_id').value = data.order_id;
        data.covid19.treatHide(document.getElementById('order_id'));
        data.covid19.treatACDropDown(document.getElementById('category_id'), 'categories', 'id', 'name');
        data.covid19.treatACDropDown(document.getElementById('status_id'), 'statuses', 'id', 'status_name');

      });
    } else {
      data.covid19.sendPeerDatabaseRequest("covid19", "items", "*", "deleted <> 1 AND items.id = " + data.item_id, null, function (res) {
        html = data.covid19.returnForm("covid19", "items", data.item_id, res.rows[0]);
        document.querySelector('.modal-form').innerHTML += html;

        document.getElementById('order_id').value = data.order_id;
        data.covid19.treatHide(document.getElementById('order_id'));
        data.covid19.treatACDropDown(document.getElementById('category_id'), 'categories', 'id', 'name');
        data.covid19.treatACDropDown(document.getElementById('status_id'), 'statuses', 'id', 'status_name');


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


    document.getElementById('save-item').addEventListener('click', (e) => {
      data.covid19.submitForm(document.querySelector('.modal-form'));
      document.querySelector('.item-template').destroy();
//      UpdateSuccess.render(app, data);
//      UpdateSuccess.attachEvents(app, data);

    });

    document.getElementById('cancel-item').addEventListener('click', (e) => {
      //document.querySelector('.item').style.display = "none";
      data.item_id = "";
      document.querySelector('.item-template').destroy();
    });

  }
}
