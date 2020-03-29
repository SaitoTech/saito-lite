const SupplierProfileTemplate = require('./supplier-profile.template.js');
const SupplierPortal = require('./supplier-portal.js');
const UpdateSupplier = require('./update-supplier.js');


module.exports = SupplierProfile = {

  render(app, data) {

    document.querySelector(".main").innerHTML = SupplierProfileTemplate();


    //
    // load products
    //
    let whereclause = "publickey = '"+app.wallet.returnPublicKey() + "'";
    data.covid19.sendPeerDatabaseRequest("covid19", "suppliers", "*", whereclause, null, function(res) {

      if (res.rows.length == 0) {

        //
        // new supplier
        //
	document.querySelector('.profile-information').innerHTML = `You are using a different browser than normal or have not yet created an account. Please either create a new company account, or restore your wallet.`;
	document.querySelector('.new-supplier-btn').style.display = 'block';
	document.querySelector('.profile').style.display = 'block';
	document.querySelector('.loading').style.display = 'none';

      } else {

	//
	// existing suppler
	//
	document.querySelector('.profile-information').innerHTML = `

Welcome Back!

<p></p>

  <inpur type="hidden" name="supplier_id" class="supplier_id" value="${res.rows[0].id}" />

  <div class="grid-2">

    <div>Company Name:</div>
    <div>${res.rows[0].name}</div>

    <div>Company Phone:</div>
    <div>${res.rows[0].phone}</div>

    <div>Company Email:</div>
    <div>${res.rows[0].email}</div>

    <div>Company Wechat:</div>
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

    document.querySelector('.confirm-supplier-btn').addEventListener('click', (e) => {
      data.supplier_id = document.querySelector(".supplier_id").value;
      SupplierPortal.render(app, data);
      SupplierPortal.attachEvents(app, data);
    });

    document.querySelector('.edit-supplier-btn').addEventListener('click', (e) => {
      data.supplier_id = document.querySelector(".supplier_id").value;
      UpdateSupplier.render(app, data);
      UpdateSupplier.attachEvents(app, data);
    });

    document.querySelector('.new-supplier-btn').addEventListener('click', (e) => {
      data.supplier_id = 0;
      UpdateSupplier.render(app, data);
      UpdateSupplier.attachEvents(app, data);
    });

  }

}
