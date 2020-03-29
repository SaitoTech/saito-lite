const UpdateProductTemplate = require('./update-product.template');


module.exports = UpdateProduct = {

  render(app, data) {

    document.querySelector(".main").innerHTML = UpdateProductTemplate(app, data);

    //
    // load categories
    //
    data.covid19.sendPeerDatabaseRequest("covid19", "categories", "*", "", null, function (res) {

      document.querySelector(".loading").style.display = "none";
      for (let i = 0; i < res.rows.length; i++) {
        let opt = document.createElement('option');
        opt.value = res.rows[i].id;
        opt.innerHTML = res.rows[i].name;
        document.getElementById('select-product-type').appendChild(opt);
      }
      document.querySelector(".portal").style.display = "block";

      data.covid19.sendPeerDatabaseRequest("covid19", "products JOIN suppliers", "*", "products.supplier_id = suppliers.id AND products.id = " + data.product_id, null, function (res) {

        if (res.rows.length > 0) {
          data.covid19.renderProductForm(res.rows[0]);
        } else {


	  let row = { 
	 	id : 0 , 
		supplier_id : "" ,
		category_id : "" ,	  
		product_name : "" ,	  
		product_specification : "" ,	  
		product_dimensions : "" ,	  
		product_weight : "" ,	  
		product_quantities : "" ,	  
		product_photo : "" ,	  
		pricing_per_unit_rmb : "" ,	  
		pricing_notes : "" ,	  
		pricing_payment_terms : "" ,	  
		production_stock : "" ,	  
		production_daily_capacity : "" ,	  
		production_minimum_order : "" ,	  
	  }
          data.covid19.renderProductForm(row);
        }
      });
    });
  },

  attachEvents(app, data) {

    document.querySelector('.update-product-btn').addEventListener('click', (e) => {

      let product_id = e.currentTarget.id;
      let values     = [];

      Array.from(document.getElementsByClassName('input')).forEach(input => {
	let field = {};
	    field.table  = input.getAttribute("id");
	    field.column = input.getAttribute("name");
	    field.value  = input.value;
	    field.id     = product_id;
	values.push(field);
      });

      data.covid19.updateServerDatabase(values);

      salert("You have send a cryptographically-signed message updating your records. It will take approximately 30 seconds before the network updates to reflect your new information. Please be patient and reload in a minute if your information is not immediately updated.");
      window.location.reload();

    });


  }

}

