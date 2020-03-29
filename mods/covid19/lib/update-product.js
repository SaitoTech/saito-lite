const UpdateProductTemplate = require('./update-product.template');


module.exports = UpdateProduct = {

  render(app, data) {
    document.querySelector(".main").innerHTML = UpdateProductTemplate();

    let fields = "";
    data.covid19.sendPeerDatabaseRequest("covid19", "products JOIN suppliers", "*", "products.supplier_id = suppliers.id AND products.id = " + data.product_id, null, function (res) {

console.log(JSON.stringify(res.rows));

      if (res.rows.length > 0) {
        data.covid19.renderProductForm(res.rows[0]);
      }

    });
    document.querySelector(".loading").style.display = "none";
    document.querySelector(".portal").style.display = "block";

  },

  attachEvents(app, data) {

    document.querySelector('.update-product-btn').addEventListener('click', (e) => {

      let product_id = e.currentTarget.id;
      let values     = [];

      Array.from(document.getElementsByClassName('input')).forEach(input => {
	let field = {};
	    field.table  = input.getAttribute("id");
	    field.column = input.getAttribute("name");
	    field.value  = input.getAttribute("value");
	values.push(field);
      });

      console.log(JSON.stringify(values));


      

    });


  }

}

