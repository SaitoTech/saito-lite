var ModTemplate = require('../../lib/templates/modtemplate');

class Tutorial1 extends ModTemplate {

  constructor(app) {
    super(app);
    this.name            = "Tutorial1";
    this.description     = "A Basic Wallet to demonstrate the basic Saito Module APIs";
    this.categories      = "Tutorials";
    this.default_html    = 1;
    this.balance         = null;
    return this;
  }

  initialize(app) {
    console.log("Tutorial1 intialize");
    if (this.app.BROWSER == 0) { return; };
    super.initialize(app);
    this.balance = app.wallet.returnBalance();
  }

  initializeHTML(app) {
    if (this.app.BROWSER == 0) { return; };
    console.log("Tutorial1 initializeHTML");
    this.render(app);
    addCss();
  }

  render(app) {
    console.log("Tutorial1 render");
    let html = "<div id='helloworld'>Hello World!</div>";
    if(this.balance) {
      html += "<div>" + this.balance + "</div>";
    }
    document.querySelector("#content .main").innerHTML = html;
  }

  updateBalance(app) {
    if (this.app.BROWSER == 0) { return; };
    console.log("Tutorial1 updateBalance");
    this.balance = app.wallet.returnBalance();
    this.render(app);
  }
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
module.exports = Tutorial1;
