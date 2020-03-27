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

    this.db_tables.push("suppliers JOIN products JOIN attachments JOIN categories JOIN certifications");

    this.admin_pkey     = "ke6qwkD3XB8JvWwf68RMjDAn2ByJRv3ak1eqUzTEz9cr";

    this.description = "A covid19 management framework for Saito";
    this.categories  = "Admin Healthcare Productivity";    

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

    sql = "INSERT INTO products (product_name) VALUES ('KN95 superstar')";
    params = { $name : "Medical Device Certificate" }
    await app.storage.executeDatabase(sql, params, "covid19");

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


}

module.exports = Covid19;



