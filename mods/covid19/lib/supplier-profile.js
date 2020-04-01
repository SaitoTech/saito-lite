const SupplierProfileTemplate = require('./supplier-profile.template.js');
const SupplierPortal = require('./supplier-portal.js');
const UpdateSupplier = require('./update-supplier.js');
const Navigation = require('./navigation.js');
const SplashPage2 = require('./splash-page.js');

module.exports = SupplierProfile = {

  render(app, data) {

    document.querySelector(".main").innerHTML = SupplierProfileTemplate();
    document.querySelector(".navigation").innerHTML = '<div class="button navlink covid_back"><i class="fas fa-back"></i>back</div>';

    //
    // load products
    //
    let whereclause = "publickey = '"+app.wallet.returnPublicKey() + "'";
    data.covid19.sendPeerDatabaseRequest("covid19", "suppliers", "*", whereclause, null, function(res) {

      if (res.rows.length == 0) {

        //
        // new supplier
        //
	document.querySelector('.profile-information').innerHTML = `

Once you have created an account our team will contact you to verify your listed information. If you are a new foundry or white-label partner of an existing supplier that is already certified, please be ready to provide this information for us to assist with your certification process. If you have any questions, contact us anytime at <i>info@dhb.global</i>.

<p></p>

If you have previously created an account and it is not loading, restore access by clicking on the gear icon at the top-right of this page and selecting the "Restore Access Keys" option.

`;
	document.querySelector('.new-supplier-btn').style.display = 'block';
	document.querySelector('.profile').style.display = 'block';
	document.querySelector('.loading').style.display = 'none';

      } else {

	//
	// existing suppler
	//
	document.querySelector('.profile-information').innerHTML = `

This is the information your have published concerning your company. If it is not accurate, please update it. 

<p></p>

  <inpur type="hidden" name="supplier_id" class="supplier_id" value="${res.rows[0].id}" />

  <div class="grid-2">

    <div>Name:</div>
    <div>${res.rows[0].name}</div>

    <div>Address:</div>
    <div>${res.rows[0].address}</div>

    <div>Notes:</div>
    <div>${res.rows[0].notes}</div>

    <div>Phone:</div>
    <div>${res.rows[0].phone}</div>

    <div>Email:</div>
    <div>${res.rows[0].email}</div>

    <div>Wechat:</div>
    <div>${res.rows[0].wechat}</div>

  </div>

	`;

	document.querySelector('.profile').style.display = 'block';
	document.querySelector('.loading').style.display = 'none';
        document.querySelector('.new-supplier-btn').style.display = 'none';
        document.querySelector('.confirm-supplier-btn').style.display = 'block';
        document.querySelector('.edit-supplier-btn').style.display = 'block';

      }
    });

  },

  attachEvents(app, data) {

    try {
    document.querySelector('.covid_back').addEventListener('click', (e) => {
      data.covid19.renderPage("home", app, data);
    });
    } catch (err) {}

    try {
    document.querySelector('.confirm-supplier-btn').addEventListener('click', (e) => {
      data.supplier_id = document.querySelector(".supplier_id").value;
      SupplierPortal.render(app, data);
      SupplierPortal.attachEvents(app, data);
    });
    } catch (err) {}

    try {
    document.querySelector('.edit-supplier-btn').addEventListener('click', (e) => {
      data.supplier_id = document.querySelector(".supplier_id").value;
      UpdateSupplier.render(app, data);
      UpdateSupplier.attachEvents(app, data);
    });
    } catch (err) {}

    try {
    document.querySelector('.new-supplier-btn').addEventListener('click', (e) => {
      data.supplier_id = 0;
      UpdateSupplier.render(app, data);
      UpdateSupplier.attachEvents(app, data);
    });
    } catch (err) {}

  }

}
