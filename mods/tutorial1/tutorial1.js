var ModTemplate = require('../../lib/templates/modtemplate');

class Tutorial1 extends ModTemplate {

  constructor(app) {
    super(app);
    this.name            = "Tutorial1";
    this.description     = "A Basic Wallet to demonstrate the basic Saito Module APIs";
    this.categories      = "Tutorials";
    this.default_html    = 1;
    this.balance         = null;
    // this.appify(this);
    this.initialize = this.onlyOnActiveBrowser(this.initialize.bind(this));
    this.initializeHTML = this.onlyOnActiveBrowser(this.initializeHTML.bind(this));
    this.updateBalance = this.onlyOnActiveBrowser(this.updateBalance.bind(this));
    this.render = this.onlyOnActiveBrowser(this.render.bind(this));
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
  html += "</div>"
  return html;
}
module.exports = Tutorial1;
