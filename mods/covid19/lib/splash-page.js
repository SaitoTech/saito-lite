const SplashPageTemplate 	= require('./splash-page.template.js');
const CustomerPortal            = require('./customer-portal');
const SupplierPortal            = require('./supplier-portal');


module.exports = SplashPageAppspace = {

    render(app, data) {
      document.querySelector(".main").innerHTML = SplashPageTemplate();
    },


    attachEvents(app, data) {

      document.getElementById('customer-search-btn').addEventListener('click', (e) => {
        CustomerPortal.render(app, data);
        CustomerPortal.attachEvents(app, data);
      });

      document.getElementById('supplier-portal-btn').addEventListener('click', (e) => {
        SupplierPortal.render(app, data);
        SupplierPortal.attachEvents(app, data);
      });

    }

}
