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

	let html = "";
        if (res.rows.length > 0) {
          html = data.covid19.returnForm("covid19", "suppliers", res.rows[0].id, res.rows[0]);
        } else {
	  let row = { 
		name : "" ,
		email : "" ,	  
		phone : "" ,	  
		address : "" ,
		wechat : "" ,
		notes : "" 
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

        let values = data.covid19.returnFormToArray();
	let insert = 0;
	let id = "";
	for (let i = 0; i < values.length; i++) { if (values[i].id == "") { insert = 1; }  }


	if (insert == 1) {
          id = data.covid19.insertDatabase(values);
	}
	for (let i = 0; i < values.length; i++) { if (values[i].id == "") { values[i].id = id; }  }
        data.covid19.updateDatabase(values);
        UpdateSuccess.render(app, data);
        UpdateSuccess.attachEvents(app, data);

    });

  }

}

