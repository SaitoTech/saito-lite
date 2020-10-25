var saito = require('../../lib/saito/saito');
const Big = require('big.js');
var ModTemplate = require('../../lib/templates/modtemplate');

class TutorialWallet extends ModTemplate {

//////////////////// MODULE API: //////////////////////////
//
// async installModule(app)
// async initialize(app)
// initializeHTML(app) }
// attachEvents(app)
// loadFromArchives(app, tx)
// implementsKeys(request)
// async onConfirmation(blk, tx, confnum, app)
// onNewBlock(blk, lc)
// onChainReorganization(block_id, block_hash, lc, pos)
// onConnectionUnstable(app)
// onConnectionStable(app)
// onWalletReset()
// onPeerHandshakeComplete(app, peer)
// onConnectionStable(app, peer)
// onConnectionUnstable(app, peer)
// shouldAffixCallbackToModule(modname)
// webServer(app, expressapp, express)
// updateBalance(app)
// updateIdentifier(app)
// updateBlockchainSync(app, current, target)
// respondTo(request_type = "")
// receiveEvent(eventname, data)
// sendEvent(eventname, data)
// async handlePeerRequest(app, message, peer, mycallback = null)
// async sendPeerDatabaseRequest(dbname, tablename, select = "", where = "", peer = null, mycallback = null)
// isSQLSafe (sql)
// async sendPeerDatabaseRequestWithFilter(modname="", sql="", success_callback=null, peerfilter=null)
// async sendPeerRequestWithFilter(msg_callback=null, success_callback=null, peerfilter=null)
// async sendPeerDatabaseRequestRaw(db, sql, mycallback = null)
// returnSlug()
// returnLink()
// returnServices()
// handleUrlParams(urlParams)}
// showAlert()
//

  constructor(app) {
    console.log("tutWallet constructor")
    super(app);

    // This name will form the "slug" in the url of your module. If
    // name.toLowerCase matches the filename Saito's Lite Client will
    // detect this in the browser and fire your initializeHTML() method.
    this.name            = "TutorialWallet";
    this.description     = "A Basic Wallet to demonstrate the basic Saito Module APIs";
    this.categories      = "Tutorials";
    this.balance         = null;
    // Will cause initialize to always be run
    this.alwaysRunThese = [this.initialize];

    return this;
  }

  onConfirmation(blk, tx, conf, app) {
    console.log("****** tutorial wallet onConfirmation")
  }

  initialize(app) {
    console.log("****** tutorial wallet initialize");
    super.initialize(app);
    this.balance = app.wallet.returnBalance();
  }

  respondTo(type) {
    console.log("****** tutorial wallet respondTo");
    return null;
  }

  initializeHTML(app) {
    console.log("****** tutorial wallet initializeHTML");
    this.render(app);
  }

  render(app) {
    console.log("****** tutorial wallet render")

    let html = this.makeHTML();
    document.querySelector("#content .main").innerHTML = html;
    document.getElementById("helloworld").onclick = (event) => {
       fetch(`/gimme?pubkey=${app.wallet.returnPublicKey()}`).then(response => {
         console.log(response);
       }).catch((err) => {
         console.log(err)
       });
    };
    document.getElementById("sendbutton").onclick = (event) => {
      let toAddress = document.getElementById("toaddress").value;
      console.log("toAddress")
      console.log(toAddress);
      this.sendSaito(toAddress, 10, 2);
    };
  }

  updateBalance(app) {
    if(this.browser_active == 1) {
      this.balance = app.wallet.returnBalance();
      this.render(app);
    }
  }

  webServer(app, expressapp, express) {
    expressapp.get('/gimme', function (req, res) {
      app.modules.requestInterfaces("send-reward").forEach((itnerface, i) => {
        itnerface.makePayout(req.query.pubkey, 10000);
        res.type('application/json');
        res.status(200);
        res.send({status: "ok"});
      });
      return;
    });
    super.webServer(app, expressapp, express);
  }

  attachEvents(app) {
    console.log("tutWallet attachEvents")
  }

  async installModule(app) {
    console.log("tutWallet installModule")
  }

  makeHTML() {
    let html =  "";
    html += "<div id='wallet'>";
    html += " <div id='helloworld'>Hello World!</div>";
    if(this.balance) {
    html += " <div>" + this.balance + "</div>";
    }
    html += " <div>";
    html += "  <input id='toaddress' type='text'/>";
    html += "  <input id='sendbutton' type='button' value='send'/>";
    html += " </div>"
    html += "</div>"
    return html;
  }
  sendSaito(toAddress, amount, fee = 2){
    try {
      let total_fees = Big(amount + fee);
      let newtx = new saito.transaction();
      newtx.transaction.from = this.app.wallet.returnAdequateInputs(total_fees.toString());
      // add change input
      var total_from_amt = newtx.transaction.from
        .map(slip => slip.amt)
        .reduce((a, b) => Big(a).plus(Big(b)), 0);
      // generate change address(es)
      var change_amount = total_from_amt.minus(total_fees);
      newtx.transaction.to = this.app.wallet.createToSlips(10, toAddress, amount, change_amount);
      newtx = this.app.wallet.signTransaction(newtx);
      this.app.network.propagateTransaction(newtx);
    } catch(err){
      console.log("error sending transaction");
      console.log(err);
    }
  }

  // loadFromArchives(app, tx) {
  //   console.log("tutWallet loadFromArchives")
  // }
  // implementsKeys(request) {
  //   console.log("tutWallet implementsKeys")
  // }
  // onNewBlock(blk, lc) {
  //   console.log("tutWallet onNewBlock")
  // }
  // onChainReorganization(block_id, block_hash, lc, pos) {
  //   console.log("tutWallet onChainReorganization")
  // }
  // onConnectionUnstable(app) {
  //   console.log("tutWallet onConnectionUnstable")
  // }
  // onConnectionStable(app) {
  //   console.log("tutWallet onConnectionStable")
  // }
  // onWalletReset() {
  //   console.log("tutWallet onWalletReset")
  // }
  // onPeerHandshakeComplete(app, peer) {
  //   console.log("tutWallet onPeerHandshakeComplete")
  // }
  // onConnectionStable(app, peer) {
  //   console.log("tutWallet onConnectionStable")
  // }
  // onConnectionUnstable(app, peer) {
  //   console.log("tutWallet onConnectionUnstable")
  // }
  // shouldAffixCallbackToModule(modname) {
  //   console.log("tutWallet shouldAffixCallbackToModule")
  // }
  // // webServer(app, expressapp, express) {
  // //   console.log("tutWallet webServer")
  // // }
  // updateIdentifier(app) {
  //   console.log("tutWallet updateIdentifier")
  // }
  // updateBlockchainSync(app, current, target) {
  //   console.log("tutWallet updateBlockchainSync")
  // }
  // receiveEvent(eventname, data) {
  //   console.log("tutWallet receiveEvent")
  // }
  // sendEvent(eventname, data) {
  //   console.log("tutWallet sendEvent")
  // }
}

module.exports = TutorialWallet;
