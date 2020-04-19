const SplashPageTemplate 	= require('./splash-page.template.js');
const CustomerPortal            = require('./customer-portal');
const SupplierProfile           = require('./supplier-profile');


module.exports = SplashPageAppspace = {

    render(app, data) {
      document.querySelector(".main").innerHTML = SplashPageTemplate();
      document.querySelector(".navigation").innerHTML = "";



      data.covid19.sendPeerDatabaseRequest("covid19", "", "*", "", null, function (res) {
        document.querySelector(".loading").style.display = "none";
        for (let i = 0; i < res.rows.length; i++) {
          let opt = document.createElement('option');
          opt.value = res.rows[i].id;
          opt.innerHTML = res.rows[i].name;
          document.getElementById('select-product-type').appendChild(opt);
        }
        document.querySelector(".portal").style.display = "block";
      });

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
