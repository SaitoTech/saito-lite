const SupplierPortalTemplate 	= require('./supplier-portal.template.js');


module.exports = SupplierPortal = {

    render(app, data) {
      document.querySelector(".main").innerHTML = SupplierPortalTemplate();
    },


    attachEvents(app, data) {

      document.querySelector('.update-product-btn').addEventListener('click', (e) => {

alert("click!");

        let product = {};
	    product.p = "Product Info DIsplayed Here";
	let product_json = JSON.stringify(product);
        let product_json_base64 = app.crypto.stringToBase64(product_json);

	let url = "/email?module=email&product="+product_json_base64;

	window.location = url;

      });

    }

}
