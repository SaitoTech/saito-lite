const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/dbmodtemplate');
const AddressController = require('../../lib/ui/menu/address-controller');
const utils = require('./lib/utils/utils');

const Header = require('./lib/header/header');

const AdminHome = require('./lib/admin/admin-home');
const ProductManager = require('./lib/products/product-manager');
const ScanManager = require('./lib/scan/scan-manager');
const ScanReturn = require('./lib/user/scan-return');
const UserApp = require('./lib/user/phone-app');


class Camel extends ModTemplate {

  constructor(app) {

    super(app);

    this.name = "Camel";
    this.description = "Product Code Scanning and Tracking";
    this.categories = "SCM";
    this.mode = "product";

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

    window.addEventListener('message', (e) => {
      console.info(e.data);
    });

    window.addEventListener('message', function(e) {
      //alert("window received: " + e.data);
      if(document.querySelector('.phone-scanner')) {
        document.querySelector('.phone-scanner').value = e.data;
        window.app = app;
       var evt = new CustomEvent('change');
       document.querySelector('.phone-scanner').dispatchEvent(evt);
      }
    }, false);
  }


  onPeerHandshakeComplete(app, peer) {

    if (this.browser_active == 0) { return; }

    let data = {};
    data.mod = this;

    this.setRoute(app, data);
  }

  setRoute(app, data) {

    if (this.app.BROWSER == 0) { return; }

    //salert(this.mode);
    switch (this.mode) {
      case "user":
        UserApp.render(app, data);
        UserApp.attachEvents(app, data);
        break;
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



  async webServer(app, expressapp, express) {

    super.webServer(app, expressapp, express);
    
    let data = {};
    data.mod = this;

    const fs = app.storage.returnFileSystem();
    const path = require('path');

    if (fs != null) {

      expressapp.get('/camel/u/', async (req, res) => {

        data.query = req.query;

        res.setHeader('Content-type', 'text/html');
        res.charset = 'UTF-8';
        res.write(await ScanReturn.render(app, data));
        res.end();
        return;
                
      });
      expressapp.get('/camel/a/', async (req, res) => {

        data.query = req.query;

        res.setHeader('Content-type', 'text/html');
        res.charset = 'UTF-8';
        res.write(await UserApp.render(app, data));
        res.end();
        return;
                
      });
    }    
  }

}
module.exports = Camel;

