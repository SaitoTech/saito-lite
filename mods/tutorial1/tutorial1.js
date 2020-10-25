var ModTemplate = require('../../lib/templates/modtemplate');

class Tutorial1 extends ModTemplate {

//////////////////// MODULE API: //////////////////////////
// 1) your module runs everywhere!! browser_active is important
// 2) let's interact with another module!
// 3)
  constructor(app) {
    console.log("Tutorial1 constructor")
    //console.log("caller is " + arguments.callee.caller.toString());
    //console.log(printStackTrace().join('\n\n'));
    super(app);

    // This name will form the "slug" in the url of your module. If
    // name.toLowerCase matches the filename Saito's Lite Client will
    // detect this in the browser and fire your initializeHTML() method.
    this.name            = "Tutorial1";
    this.description     = "A Basic Wallet to demonstrate the basic Saito Module APIs";
    this.categories      = "Tutorials";
    this.balance         = null;
    return this;
  }

  initialize(app) {
    super.initialize(app);
    this.balance = app.wallet.returnBalance();
  }

  initializeHTML(app) {
    this.render(app);
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

module.exports = Tutorial1;
