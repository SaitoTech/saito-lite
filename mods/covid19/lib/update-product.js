const UpdateProductTemplate 	= require('./update-product.template.js');


module.exports = UpdateProduct = {

    render(app, data) {
      document.querySelector(".main").innerHTML = UpdateProductTemplate();
    },

    attachEvents(app, data) {

      document.querySelector('.update-product-btn').addEventListener('click', (e) => {
        data.product_id = e.currentTarget.id;
      });


    }

}

