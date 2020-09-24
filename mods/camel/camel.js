const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/dbmodtemplate');
const AddressController = require('../../lib/ui/menu/address-controller');
const utils = require('./lib/utils/utils');

const Header = require('./lib/header/header');

const AdminHome = require('./lib/admin/admin-home');
const ProductManager = require('./lib/products/product-manager');
const ScanManager = require('./lib/scan/scan-manager');



class Camel extends ModTemplate {

  constructor(app) {

    super(app);

    this.name 		= "Camel";
    this.description    = "Product Code Scanning and Tracking";
    this.categories     = "SCM";
    this.mode           = "product";


    Object.assign(Camel.prototype, utils)

  }


  handleUrlParams(urlParams) {

    if (this.browser_active == 0) { return; }

    if (urlParams.get('mode')) {
      this.mode = urlParams.get('mode');
    }
  }

  initializeHTML(app) {

    if (this.app.BROWSER == 0) { return; }

    Header.render(app, data);
    Header.attachEvents(app, data);

  }


  onPeerHandshakeComplete(app, peer) {

    if (this.browser_active == 0) { return; }

    let data = {};
        data.mod = this;

    if (this.app.BROWSER == 0) { return; }

    switch (this.mode) {
      case "scan":
        ScanManager.render(app, data);
        ScanManager.attachEvents(app, data);
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

