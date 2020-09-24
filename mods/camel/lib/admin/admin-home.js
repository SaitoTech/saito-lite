const AdminHomeTemplate = require('./admin-home.template.js');

//const CustomerPortal = require('./customer-portal');
//const SupplierProfile = require('./supplier-profile');


module.exports = AdminHome = {

  render(app, data) {
    var this_portal = this;

    document.querySelector(".main").innerHTML = AdminHomeTemplate();

  
  },

 


  attachEvents(app, data) {
/*
    document.getElementById('customer-search-btn').addEventListener('click', (e) => {
      CustomerPortal.render(app, data);
      CustomerPortal.attachEvents(app, data);
    });
*/
  }

}
