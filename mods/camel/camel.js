const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const AddressController = require('../../lib/ui/menu/address-controller');


class Camel extends ModTemplate {

  constructor(app) {

    super(app);

    this.name = "Camel";
    this.description = "Product Code Scanning and Tracking";
    this.categories = "SCM";

  }



  handleUrlParams(urlParams) {

    let uuid = urlParams.get('uuid');

console.log("T: " + uuid);

  }



  render(app, data=null) {

    if (this.browser_active == 0) { return; }

    if (data == null) { data = {}; data.mod = this; }

    CamelMain.render(app, data);
    CamelMain.attachEvents(app, data);

  }




  initialize(app) {

    super.initialize(app);

  }


  initializeHTML(app) {

    let data = {};
    data.mod = this;

    this.onConnectionStable(app);

  }


  //
  // load transactions into interface when the network is up
  //
  onPeerHandshakeComplete(app, peer) {

    if (this.browser_active == 0) { return; }

/***
    this.sendPeerDatabaseRequestWithFilter(

	"Arcade",

	`SELECT * FROM games WHERE status = "open"`,

	(res) => {
          if (res.rows) {
            res.rows.forEach(row => {
              let gametx = JSON.parse(row.tx);
              let tx = new saito.transaction(gametx.transaction);
              this.addGameToOpenList(tx);
            });
          }
        }
    );
***/

  }



  async onConfirmation(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();
    let camel_self = app.modules.returnModule("Camel");

    if (conf == 0) {
    }

  }

}

module.exports = Camel;

