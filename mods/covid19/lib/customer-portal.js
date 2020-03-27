const CustomerPortalTemplate 	= require('./customer-portal.template.js');


module.exports = CustomerPortal = {

    render(app, data) {

      document.querySelector(".main").innerHTML = CustomerPortalTemplate();

      //
      // load categories
      //
      data.covid19.sendPeerDatabaseRequest("covid19", "categories", "*", "", null, function(res) {
	document.querySelector(".loading").style.display = "none";
	for (let i = 0; i < res.rows.length; i++) {
          let opt 	    = document.createElement('option');
    	      opt.value     = res.rows[i].id;
              opt.innerHTML = res.rows[i].name;
          document.getElementById('select-product-type').appendChild(opt);
        }
	document.querySelector(".portal").style.display = "block";
      });

    },


    attachEvents(app, data) {

      document.getElementById('select-product-type').addEventListener('change', (e) => {
        let category_id = e.currentTarget.value;
alert("current id: " + category_id);
	if (category_id > 0) {

          //
          // populate table
          //
          let whereclause = "suppliers.id = products.supplier_id AND products.category_id = "+category_id;
console.log(whereclause);
          data.covid19.sendPeerDatabaseRequest("covid19", "products JOIN suppliers", "*", whereclause, null, function(res) {
console.log(JSON.stringify(res));
	    data.covid19.addProductsToTable(res.rows, [ 'name', 'product_specification', 'product_photo', 'pricing_unit_cost', 'production_daily_capacity', 'certifications', 'June 24', 'edit']);
	    document.querySelector(".products-table").style.display = "block";
          });

	}
      });

    }

}
