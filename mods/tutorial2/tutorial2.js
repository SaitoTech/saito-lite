var ModTemplate = require('../../lib/templates/modtemplate');

class Tutorial2 extends ModTemplate {

  constructor(app) {
    super(app);
    this.name            = "Tutorial2";
    this.description     = "A Basic Wallet to demonstrate the basic Saito Module APIs";
    this.categories      = "Tutorials";
    this.default_html    = 1;
    this.balance         = null;
    //this.appify(this);
    this.initialize = this.onlyOnActiveBrowser(this.initialize.bind(this));
    this.initializeHTML = this.onlyOnActiveBrowser(this.initializeHTML.bind(this));
    this.attachEvents = this.onlyOnActiveBrowser(this.attachEvents.bind(this));
    return this;
  }

  initialize(app) {
    super.initialize(app);
    this.balance = app.wallet.returnBalance();
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
  }

  // updateBalance(app) {
  //   this.balance = app.wallet.returnBalance();
  //   this.render(app);
  // }

  webServer(app, expressapp, express) {
    super.webServer(app, expressapp, express);
    expressapp.get('/gimme', function (req, res) {
      // "interface" is a reserved word :P
      app.modules.getRespondTos("send-reward").forEach((itnerface, i) => {
        itnerface.makePayout(req.query.pubkey, 10000);
        res.type('application/json');
        res.status(200);
        res.send({status: "ok"});
      });
      return;
    });
  };
}
function addCss() {
  var style = document.createElement("style");
  style.innerHTML = `
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
  html += " <input id='getpaid' type='button' value='Get Some Coins!'/>";
  html += "</div>"
  return html;
}
module.exports = Tutorial2;
