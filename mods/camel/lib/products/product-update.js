const UpdateProductTemplate = require('./product-update.template');
const UpdateSuccess = require('../utils/update-success');


module.exports = UpdateProduct = {

  async render(app, data) {

    document.querySelector('.main').innerHTML = UpdateProductTemplate();

    var html = "";

    //we are creating a new product
    if (typeof data.product_uuid == 'undefined' || data.product_uuid == "") {
      data.camel.returnFormFromPragma("camel", "products", function (res) {
        document.querySelector('.main-form').innerHTML = res;
        data.camel.treatHide(document.getElementById('supplier_id'));
        data.camel.treatHide(document.getElementById('category_id'));
        data.camel.treatTextArea(document.getElementById('product_details'));
        data.camel.treatPhoto(document.getElementById('product_photo'));
        data.camel.treatBoolean(document.getElementById('published'));
        //data.camel.treatACDropDown(document.getElementById('product_status'), 'statuses', 'id', 'status_name');
        //data.camel.treatLog(document.getElementById('product_status'));
      });
    } else {
      //load the product
      data.camel.sendPeerDatabaseRequest("camel", "products", "*", "deleted <> 1 AND products.id = " + data.product_uuid, null, function (res) {
        //data.product = res.rows[0];
        html = data.camel.returnForm("camel", "products", data.product_uuid, res.rows[0]);
        document.querySelector('.main-form').innerHTML += html;
        //data.camel.treatTextArea(document.getElementById('requirements'));
        //data.camel.treatReLabel(document.getElementById('details'), 'Buyer Name');
        //data.camel.treatACDropDown(document.getElementById('product_status'), 'statuses', 'id', 'status_name', true);
        //data.camel.treatACDropDown(document.getElementById('pricing_mode'), 'payment_terms', 'id', 'payment_terms_name', true);

      });
    }

  },

  attachEvents(app, data) {

    document.getElementById('save-product').addEventListener('click', (e) => {
      data.camel.submitForm(document.querySelector('.main-form'));

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
