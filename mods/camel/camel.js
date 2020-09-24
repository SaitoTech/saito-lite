const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/dbmodtemplate');
const AddressController = require('../../lib/ui/menu/address-controller');
const utils = require('./lib/utils/utils');

const AdminHome = require('./lib/admin/admin-home');
const ProductManager = require('./lib/products/product-manager');


class Camel extends ModTemplate {

  constructor(app) {

    super(app);

    this.name 		= "Camel";
    this.description    = "Product Code Scanning and Tracking";
    this.categories     = "SCM";

    this.admin_pkey     = app.wallet.returnPublicKey();
    this.mode           = "product";


    Object.assign(Camel.prototype, utils)

  }


  handleUrlParams(urlParams) {
    if (urlParams.get('mode')) {
alert("setting mode!");
      this.mode = urlParams.get('mode');
    }
  }


  render(app, data=null) {

    if (this.browser_active == 0) { return; }

    if (data == null) { 
      data = {};
      data.mod = this; 
    }

    CamelMain.render(app, data);
    CamelMain.attachEvents(app, data);

  }


  initializeHTML(app) {
    let data = {};
    data.mod = this;
    this.renderPage(app, data);
  }


  renderPage(app, data) {

    switch (data.mod.mode) {
      case "scan":
        //scan-page
        break;
      case "admin":
        AdminHome.render(app, data);
        AdminHome.attachEvents(app, data);
        break;
      case "product":
        ProductManager.render(app, data);
        ProductManager.attachEvents(app, data);
        break;
      default:
        //scan-page
    }
  }

}

module.exports = Camel;

