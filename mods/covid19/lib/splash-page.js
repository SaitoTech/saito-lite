const SplashPageTemplate 	= require('./splash-page.template.js');
const CustomerPortal            = require('./customer-portal');
const SupplierProfile           = require('./supplier-profile');


module.exports = SplashPageAppspace = {

    render(app, data) {
      document.querySelector(".main").innerHTML = SplashPageTemplate();
      document.querySelector(".navigation").innerHTML = "";
    },


    attachEvents(app, data) {

      document.getElementById('customer-search-btn').addEventListener('click', (e) => {
        CustomerPortal.render(app, data);
        CustomerPortal.attachEvents(app, data);
      });

      document.getElementById('supplier-portal-btn').addEventListener('click', (e) => {
        SupplierProfile.render(app, data);
        SupplierProfile.attachEvents(app, data);
      });

    }

}
