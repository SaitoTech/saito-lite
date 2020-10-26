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
    super.initialize(app);
    this.balance = app.wallet.returnBalance();
  }

  initializeHTML(app) {
    this.render(app);
    addCss();
  }

  render(app) {
    let html = "<div id='helloworld'>Hello World!</div>";
    if(this.balance) {
      html += "<div>" + this.balance + "</div>";
    }
    document.querySelector("#content .main").innerHTML = html;
  }

  updateBalance(app) {
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
