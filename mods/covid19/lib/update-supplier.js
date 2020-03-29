const UpdateSupplierTemplate = require('./update-supplier.template');



module.exports = UpdateSupplier = {

  render(app, data) {

    document.querySelector(".main").innerHTML = UpdateSupplierTemplate(app, data);

    //
    // load categories
    //
    data.covid19.sendPeerDatabaseRequest("covid19", "suppliers", "*", "suppliers.publickey = '"+app.wallet.returnPublicKey()+"'", null, function (res) {

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

        document.querySelector('.portal').style.display = "block";
    });
  },



  attachEvents(app, data) {

    document.querySelector('.update-supplier-btn').addEventListener('click', (e) => {

      let values = [];

      Array.from(document.getElementsByClassName('input')).forEach(input => {
        let field = {};
            field.table  = input.getAttribute("id");
            field.column = input.getAttribute("name");
            field.value  = input.value;
            field.id     = "supplier";
        values.push(field);
      });

      data.covid19.updateServerDatabase(values);

    });

  }

}

