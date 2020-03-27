const SupplierPortalTemplate 	= require('./supplier-portal.template.js');


module.exports = SupplierPortal = {

    render(app, data) {

      document.querySelector(".main").innerHTML = SupplierPortalTemplate();


      data.covid19.sendPeerDatabaseRequest("covid19", "suppliers JOIN products", "*", "suppliers.id = products.supplier_id", null, function(res) {
	data.covid19.populate
console.log(JSON.stringify(res.rows));
      });

    },


    attachEvents(app, data) {

      document.querySelector('.update-product-btn').addEventListener('click', (e) => {

alert("click!");

        let product = {};
	    product.p = "Product Info DIsplayed Here";
	let product_json = JSON.stringify(product);
        let product_json_base64 = app.crypto.stringToBase64(product_json);

	let url = "/email?module=covid19&product="+product_json_base64;

	window.location = url;

      });

    }

}
