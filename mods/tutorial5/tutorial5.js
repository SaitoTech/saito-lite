var saito = require('../../lib/saito/saito');
const Big = require('big.js');
var ModTemplate = require('../../lib/templates/modtemplate');

class Tutorial5 extends ModTemplate {

  constructor(app) {
    super(app);
    this.name            = "Tutorial5";
    this.description     = "A Basic Wallet to demonstrate the basic Saito Module APIs";
    this.categories      = "Tutorials";
    this.balance         = null;
    this.serverkey       = null;
    this.default_html = 1;
    this.appify(this);
    return this;
  }

  initialize(app) {
    super.initialize(app);
    this.balance = app.wallet.returnBalance();
    fetch("/getserverkey").then(response => {
      response.json().then(json => {
        this.serverkey = json.pubkey;
        this.render(app);
      });
    }).catch((err) => {
      console.log(err)
    });
  }

  initializeHTML(app) {
    this.render(app);
    addCss();
  }

  render(app) {
    document.querySelector("#content .main").innerHTML = makeHTML(this);
    document.getElementById("getpaid").onclick = (event) => {
       fetch(`/gimme?pubkey=${app.wallet.returnPublicKey()}`).then(response => {
         console.log(response);
       }).catch((err) => {
         console.log(err)
       });
    };
    document.getElementById("sendbutton").onclick = (event) => {
      let toAddress = document.getElementById("toaddress").value;
      let amount = parseInt(document.getElementById("amount").value, 10);
      this.sendSaito(toAddress, amount, 2);
    };
  }

  updateBalance(app) {
    this.balance = app.wallet.returnBalance();
    this.render(app);
  }

  webServer(app, expressapp, express) {
    expressapp.get('/gimme', function (req, res) {
      app.modules.getRespondTos("send-reward").forEach((itnerface, i) => {
        itnerface.makePayout(req.query.pubkey, 10000);
        res.type('application/json');
        res.status(200);
        res.send({status: "ok"});
      });
      return;
    });
    expressapp.get("/getserverkey", function(req, res){
      res.type('application/json');
      //res.setHeader('Content-type', 'text/html');
      res.status(200);
      res.write(JSON.stringify({pubkey: app.wallet.returnPublicKey()}));
      res.end();
    });
    super.webServer(app, expressapp, express);
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
      // create slips
      newtx.transaction.to = this.app.wallet.createToSlips(1, toAddress, amount, change_amount);
      newtx = this.app.wallet.signTransaction(newtx);
      this.app.network.propagateTransaction(newtx);
    } catch(err){
      console.log("error sending transaction");
      console.log(err);
    }
  }
}

function addCss() {
  var style = document.createElement("style");
  style.innerHTML = `
    #content .main {

    }
    #greeting {
      font-size: 24px;
    }
    #wallet {
      width: 50%;
      background-color: #FF6030;
      margin: auto;
      text-align: center;
      margin-top: 5px;
      margin-bottom: 5px;
    }
    #toaddress {
      width: 90%;
      margin-left: 10px;
      margin-right: 10px;
    }
    #amount {
      width: 40%;
    }
  `;
  document.head.appendChild(style);
}
function makeHTML(mod) {
  let html =  "";
  html += "<div id='wallet'>";
  html += " <div id='greeting'>My Saito Wallet</div>";
  if(mod.balance) {
  html += " <div>balance:</div>";
  html += " <div>" + mod.balance + "</div>";
  }
  html += " <div>to:</div>";
  if(mod.serverkey) {
  html += " <input id='toaddress' type='text' value='" + mod.serverkey + "'/>";
  } else {
  html += " <input id='toaddress' type='text'/>";
  }
  html += " <div>amount:</div>";
  html += " <input id='amount' type='text'/>";
  html += " <input id='sendbutton' type='button' value='send'/>";
  html += " <input id='getpaid' type='button' value='Get Some Coins!'/>";
  html += "</div>"
  return html;
}
module.exports = Tutorial5;
