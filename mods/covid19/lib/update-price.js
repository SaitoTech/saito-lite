const UpdatePriceTemplate = require('./update-price.template');

module.exports = UpdatePrice = {

  async render(app, data) {

    document.querySelector('.footer').innerHTML += UpdatePriceTemplate();

    data.covid19.returnFormFromPragma("covid19", "categories_prices", function(res) {
      document.querySelector('.modal-form').innerHTML = res;

      document.getElementById('category_id').value = data.category_id;
      document.getElementById('ts').value = new Date().getTime();
      data.covid19.treatHide(document.getElementById('category_id'));
      data.covid19.treatHide(document.getElementById('ts'));

      /*
      data.covid19.treatACDropDown(document.getElementById('price_id'), 'prices', 'id', 'name');
      data.covid19.treatHide(document.getElementById('object_table'));
      document.getElementById('object_table').value = data.target_object;
      data.covid19.treatHide(document.getElementById('object_id'));
      document.getElementById('object_id').value = data.product_id;
      */
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

    
    document.getElementById('add-price').addEventListener('click', (e) => {
      data.covid19.submitForm(document.querySelector('.modal-form'));
      document.querySelector('.price-template').destroy();
      UpdateSuccess.render(app, data);
      UpdateSuccess.attachEvents(app, data);

    });

    document.getElementById('cancel-price').addEventListener('click', (e) => {
     //document.querySelector('.price').style.display = "none";
     document.querySelector('.price-template').destroy();
    });

  }
}