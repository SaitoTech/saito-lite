var ModTemplate = require('../../lib/templates/modtemplate');

class Tutorial2 extends ModTemplate {

  constructor(app) {
    super(app);
    this.name            = "Tutorial2";
    this.description     = "A Basic Wallet to demonstrate the basic Saito Module APIs";
    this.categories      = "Tutorials";
    this.default_html    = 1;
    this.balance         = null;
    return this;
  }

  initialize(app) {
    if (this.app.BROWSER == 0) { return; };
    super.initialize(app);
    this.balance = app.wallet.returnBalance();
  }

  initializeHTML(app) {
    if (this.app.BROWSER == 0) { return; };
    this.render(app);
    addCss();
  }

  render(app) {
    let html = "<div id='helloworld'>Hello World!</div>";
    if(this.balance) {
      html += "<div>" + this.balance + "</div>";
    }
    document.querySelector("#content .main").innerHTML = html;
    document.getElementById("helloworld").onclick = (event) => {
       fetch(`/gimme?pubkey=${app.wallet.returnPublicKey()}`).then(response => {
         console.log(response);
       }).catch((err) => {
         console.log(err)
       });
    };
  }

  updateBalance(app) {
    if (this.app.BROWSER == 0) { return; };
    if(app.BROWSER) {
      this.balance = app.wallet.returnBalance();
      this.render(app);
    }
  }

  webServer(app, expressapp, express) {
    expressapp.get('/gimme2', function (req, res) {
      app.modules.requestInterfaces("send-reward").forEach((itnerface, i) => {
        itnerface.makePayout(req.query.pubkey, 10000);
        res.type('application/json');
        res.status(200);
        res.send({status: "ok"});
      });
      return;
    });
    super.webServer(app, expressapp, express);
  };
}
function addCss() {
  var style = document.createElement("style");
  style.innerHTML = `
    #greeting {
      font-size: 24px;
      text-align: center;
      margin: 10px 10px 10px 10px;
    }
  `;
  document.head.appendChild(style);
}
module.exports = Tutorial2;
