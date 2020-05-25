const UpdateOrderTemplate = require('./update-order.template');
const PurchaseOrder = require('./orders/purchase-order');
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
        //data.order = res.rows[0];
        html = data.covid19.returnForm("covid19", "orders", data.order_id, res.rows[0]);
        document.querySelector('.main-form').innerHTML += html;
        data.covid19.treatTextArea(document.getElementById('requirements'));

        ItemManager.render(app, data);
        ItemManager.attachEvents(app, data);

        document.getElementById('create-po').classList.remove('hidden');
        document.getElementById('copy-po').classList.remove('hidden');
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
      if(data.order_id) {
        data.location = "mode=order-manager&order=" + data.order_id;
      } else {
        data.location = "mode=order-manager";
      }
      UpdateSuccess.render(app, data);
      UpdateSuccess.attachEvents(app, data);
    });

    document.getElementById('create-po').addEventListener('click', async (e) => {

      var filename = 'DHBGlobal_Purchase_Order.docx';

      data.sub_title = document.getElementById('details').value;
      data.brief_description = document.getElementById('requirements').value;
      data.pricing_mode = document.getElementById('pricing_mode').value;
      data.fetch = "document";

      PurchaseOrder.render(app, data, function (html) {
        sWord(html, filename);
      });

    });

    document.getElementById('copy-po').addEventListener('click', (e) => {

      data.fetch = "#details";

      PurchaseOrder.render(app, data, function (html) {
        //scopy(html);
        var container = document.createElement('div');
        container.innerHTML = html;

        // Hide element
        container.style.position = 'fixed';
        container.style.pointerEvents = 'none';
        container.style.opacity = 0;

        // Detect all style sheets of the page
        var activeSheets = Array.prototype.slice.call(document.styleSheets)
          .filter(function (sheet) {
            return !sheet.disabled
          });

        // Mount the iframe to the DOM to make `contentWindow` available
        document.body.appendChild(container);

        // Copy to clipboard
        window.getSelection().removeAllRanges();

        var range = document.createRange();
        range.selectNode(container);
        window.getSelection().addRange(range);

        document.execCommand('copy');
        for (var i = 0; i < activeSheets.length; i++) activeSheets[i].disabled = true;
        document.execCommand('copy');
        for (var i = 0; i < activeSheets.length; i++) activeSheets[i].disabled = false;

        // Remove the iframe
        document.body.removeChild(container);
      });

    });

  }
}
