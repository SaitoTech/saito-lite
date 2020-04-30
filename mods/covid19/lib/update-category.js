const UpdateCategoryTemplate = require('./update-category.template');

module.exports = UpdateCategory = {

  async render(app, data) {

    document.querySelector('.footer').innerHTML += UpdateCategoryTemplate();

    if (typeof data.category_id == 'undefined' || data.category_id == "") {
      data.covid19.returnFormFromPragma("covid19", "categories", function (res) {
        document.querySelector('.modal-form').innerHTML = res;
      
      //hide things
      });
    } else {
      data.covid19.sendPeerDatabaseRequest("covid19", "categories", "*", "deleted <> 1 AND categories.id = " + data.category_id, null, function (res) {
        html = data.covid19.returnForm("covid19", "categories", data.category_id, res.rows[0]);
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


    document.getElementById('add-category').addEventListener('click', (e) => {
      data.covid19.submitForm(document.querySelector('.modal-form'));
      document.querySelector('.category-template').destroy();
      UpdateSuccess.render(app, data);
      UpdateSuccess.attachEvents(app, data);

    });

    document.getElementById('cancel-category').addEventListener('click', (e) => {
      //document.querySelector('.category').style.display = "none";
      document.querySelector('.category-template').destroy();
    });

  }
}