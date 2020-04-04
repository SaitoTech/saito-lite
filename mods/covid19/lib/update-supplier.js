const UpdateSupplierTemplate = require('./update-supplier.template');
const UpdateSuccess = require('./update-success');



module.exports = UpdateSupplier = {

  async render(app, data) {
    
    var supplier_publickey = app.wallet.returnPublicKey();
    if (data.covid19.isAdmin()) {
      supplier_publickey = data.supplier_publickey;
    }

    document.querySelector(".main").innerHTML = UpdateSupplierTemplate(app, data);

    //
    // load categories
    //
    data.covid19.sendPeerDatabaseRequest("covid19", "suppliers", "*", "suppliers.publickey = '" + supplier_publickey + "'", null, function (res) {

        if (res.rows.length > 0) {
          data.covid19.renderSupplierForm(res.rows[0]);
        } else {
	  let row = { 
	 	id : 0 , 
		name : "" ,
		email : "" ,	  
		phone : "" ,	  
		address : "" ,
		wechat : "" ,
		notes : "" 
	  }
         data.covid19.renderSupplierForm(row);
        }

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

      let values = [];

      Array.from(document.getElementsByClassName('input')).forEach(input => {
        let field = {};
            field.table  = input.dataset.table;
            field.column = input.dataset.column;
            field.value  = input.value;
            field.id     = "supplier";
        values.push(field);
      });

      data.covid19.updateServerDatabase(values, supplier_publickey);

      UpdateSuccess.render(app, data);
      UpdateSuccess.attachEvents(app, data);

    });

  }

}

