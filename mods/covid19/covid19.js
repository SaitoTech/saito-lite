const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const SplashPage = require('./lib/splash-page');



class Covid19 extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "Covid19";
    this.description	= "Open Source PPE Procurement Platform";
    this.categories	= "Health NGO";

    this.db_tables.push("products JOIN suppliers");
    this.db_tables.push("products JOIN suppliers LEFT JOIN categories");

    this.admin_pkey     = "ke6qwkD3XB8JvWwf68RMjDAn2ByJRv3ak1eqUzTEz9cr";

    this.description = "A covid19 management framework for Saito";
    this.categories  = "Admin Healthcare Productivity";    
    this.definitions =  {};

    return this;
  }





  //
  // email plugin handles product updates
  //
  respondTo(type) {
    if (type == 'email-appspace') {
      let obj = {};
          obj.render = this.renderEmailPlugin;
          obj.attachEvents = this.attachEventsEmailPlugin;
      return obj;
    }
    return null;
  }
  renderEmailPlugin(app, data) {
    try {

      let product_json_base64 = app.browser.returnURLParameter("product");
      let product_json        = app.crypto.base64ToString(product_json_base64);
      let product             = JSON.parse(product_json);

      document.querySelector('.email-appspace').innerHTML = `
        Update your Product Information:
        <p></p>
        <pre>${JSON.stringify(product)}</pre>
	<p></p>
	<div class="update-product-btn button">update</div>
      `;
    } catch (err) {
      console.log("Error rendering covid19 email plugin: " + err);
    }
  }
  attachEventsEmailPlugin(app, data) {
    try {

      document.querySelector('.update-product-btn').addEventListener('click', function(e) {

	alert("Sending Transaction to Update Product");
	window.href = "/covid19";

      });
    } catch (err) {
      console.log("Error attaching events to Covid19 email");
    }
  }




  async installModule(app) {

    await super.installModule(app);

    let sql = "";
    let params = {};

    sql = "INSERT INTO certifications (name) VALUES ($name)";
    params = { $name : "CE Authentication" }
    await app.storage.executeDatabase(sql, params, "covid19");

    sql = "INSERT INTO certifications (name) VALUES ($name)";
    params = { $name : "FDA Authentication" }
    await app.storage.executeDatabase(sql, params, "covid19");

    sql = "INSERT INTO certifications (name) VALUES ($name)";
    params = { $name : "Test Report" }
    await app.storage.executeDatabase(sql, params, "covid19");

    sql = "INSERT INTO certifications (name) VALUES ($name)";
    params = { $name : "Business License" }
    await app.storage.executeDatabase(sql, params, "covid19");

    sql = "INSERT INTO certifications (name) VALUES ($name)";
    params = { $name : "Medical Device Certificate" }
    await app.storage.executeDatabase(sql, params, "covid19");

    sql = "INSERT INTO categories (name) VALUES ('N95口罩 N95 Mask')";
    await app.storage.executeDatabase(sql, {}, "covid19");
    sql = "INSERT INTO categories (name) VALUES ('防护服Protection clothes')";
    await app.storage.executeDatabase(sql, {}, "covid19");
    sql = "INSERT INTO categories (name) VALUES ('外科口罩 Surgical Masks')";
    await app.storage.executeDatabase(sql, {}, "covid19");

  }
  async initialize(app) {

    await super.initialize(app);

    let sql = "";

/*
    sql = "UPDATE products SET category_id = 1 WHERE product_name = '外科口罩 Surgical Masks'";
    await app.storage.executeDatabase(sql, {}, "covid19");

    sql = "UPDATE products SET category_id = 2 WHERE product_name = 'N95口罩 N95 Mask'";
    await app.storage.executeDatabase(sql, {}, "covid19");

    sql = "UPDATE products SET category_id = 3 WHERE product_name = '防护服Protection clothes'";
    await app.storage.executeDatabase(sql, {}, "covid19");
*/
    sql = "PRAGMA table_info(suppliers)";
    this.definitions['suppliers'] = await app.storage.queryDatabase(sql, {}, "covid19");
    
    sql = "PRAGMA table_info(products)";
    this.definitions['products'] = await app.storage.queryDatabase(sql, {}, "covid19");

  }



  initializeHTML(app) {

    if (this.app.BROWSER == 0) { return; }

    let data = {};
        data.covid19 = this;

    SplashPage.render(app, data);
    SplashPage.attachEvents(app, data);

  }




  onConfirmation(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();
    let email = app.modules.returnModule("Email");

    if (conf == 0) {

      //
      // administrator receives transaction
      //
    }
  }


/*
          <th>Photo</th>
          <th>Product</th>
          <th>Producer</th>
          <th>Certifications</th>
          <th>Daily Volume</th>
          <th>Cost</th>
          <th>Next Shipping Date</th>
 	  <td>click for details</th>
*/
  addProductsToTable(rows, fields) {


    for (let i = 0; i < rows.length; i++) {

      let html = '';
      //html += `      `;

      for (let ii = 0; ii < fields.length; ii++) {

        let added = 0;

        try {
	  if (rows[i][fields[ii]] != "") {

	    if (fields[ii] == "product_photo") {
	      if (rows[i][fields[ii]] != null) {
  	        html += `<td><img style="max-width:200px;max-height:200px" src="${rows[i][fields[ii]]}" /></td>`;
	        added = 1;
	      }
	    }

	    if (fields[ii] == "edit") {
  	      html += `<td><span class="edit_product" id="${rows[i].id}">edit</a> | <span class="delete_product" id="${rows[i].id}">delete</span></td>`;
	      added = 1;
	    }

	    if (fields[ii] == "fullview") {
  	      html += `<td><span class="fullview_product" id="${rows[i].id}">view full details</span></td>`;
	      added = 1;
	    }

	    if (fields[ii] == "admin") {
  	      html += `<td><span class="fullview_product" id="${rows[i].id}">view full details</span> | <span class="edit_product" id="${rows[i].id}">edit</a> | <span class="delete_product" id="${rows[i].id}">delete</span></td>`;
	      added = 1;
	    }

	    if (added == 0) {
  	      html += `<td>${rows[i][fields[ii]]}</td>`;
	      added = 1;
	    }


	  } else {
          }
        } catch (err) {
console.log("err: " + err);
	}

	if (added == 0) {
	  html += `<td></td>`;
	}

      }

      //html += '</div>';
      document.querySelector(".products-table").innerHTML += html;

    }

  }


  isAdmin() {
    return 1;
    if (this.app.wallet.returnPublicKey() == this.admin_publickey) { return 1; }
    return 0;
  }

}

module.exports = Covid19;



