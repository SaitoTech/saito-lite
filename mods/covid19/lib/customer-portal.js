const CustomerPortalTemplate 	= require('./customer-portal.template.js');


module.exports = CustomerPortal = {

    render(app, data) {
      document.querySelector(".main").innerHTML = CustomerPortalTemplate();
    },


    attachEvents(app, data) {

      document.getElementById('update-product-btn').addEventListener('click', (e) => {
alert("Testing");

//        CustomerPortal.render(app, data);
//        CustomerPortal.attachEvents(app, data);
      });

    }

}
