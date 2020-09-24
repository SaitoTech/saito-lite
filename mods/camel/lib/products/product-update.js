const UpdateProductTemplate = require('./product-update.template');
const UpdateSuccess = require('../utils/update-success');


module.exports = UpdateProduct = {

  async render(app, data) {

    document.querySelector('.main').innerHTML = UpdateProductTemplate();

    var html = "";

    //we are creating a new product
    if (typeof data.product_uuid == 'undefined' || data.product_uuid == "") {
      data.mod.returnFormFromPragma("camel", "products", function (res) {
        document.querySelector('.main-form').innerHTML = res;
        data.mod.treatHide(document.getElementById('supplier_id'));
        data.mod.treatHide(document.getElementById('category_id'));
        data.mod.treatTextArea(document.getElementById('product_details'));
        data.mod.treatPhoto(document.getElementById('product_photo'));
        data.mod.treatBoolean(document.getElementById('published'));
        //data.mod.treatACDropDown(document.getElementById('product_status'), 'statuses', 'id', 'status_name');
        //data.mod.treatLog(document.getElementById('product_status'));
      });
    } else {
      //load the product
      data.mod.sendPeerDatabaseRequest("camel", "products", "*", "deleted <> 1 AND products.uuid = " + data.product_uuid, null, function (res) {
        //data.product = res.rows[0];
        html = data.mod.returnForm("camel", "products", data.product_uuid, res.rows[0]);
        document.querySelector('.main-form').innerHTML += html;
        //data.mod.treatTextArea(document.getElementById('requirements'));
        //data.mod.treatReLabel(document.getElementById('details'), 'Buyer Name');
        //data.mod.treatACDropDown(document.getElementById('product_status'), 'statuses', 'id', 'status_name', true);
        //data.mod.treatACDropDown(document.getElementById('pricing_mode'), 'payment_terms', 'id', 'payment_terms_name', true);

      });
    }

  },

  attachEvents(app, data) {

    document.getElementById('save-product').addEventListener('click', (e) => {
      data.mod.submitForm(document.querySelector('.main-form'));

      document.querySelector('.product-template').destroy();
      data.location = "mode=product";

      UpdateSuccess.render(app, data);
      UpdateSuccess.attachEvents(app, data);
    });

    document.getElementById('cancel-product').addEventListener('click', (e) => {

      document.querySelector('.product-template').destroy();

    });

  }
}
