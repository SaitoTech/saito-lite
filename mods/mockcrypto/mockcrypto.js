//const ModTemplate = require('./modtemplate');
const AbstractCryptoModule = require("../../lib/templates/abstractcryptomodule");

class MockCrypto extends AbstractCryptoModule {

  constructor(app) {
    super(app, "MOK");
    this.name = "MockCrypto";
    this.description = "A mock AbstractCryptoModule for testing purposes";
    this.endpoint = null;
  }
  
  installModule(app) {
    app.wallet.setPreferredCrypto(this.name);
  }
  initialize(app) {
    if (app.BROWSER) {
      super.initialize(app);
    }
  }
  async returnAddress() {
    return "D34DB33F";
  }
  returnBalance() {
    return new Promise((resolve, reject) => {
      let minDelay = 100;
      let maxDelay = 3000;
      let delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
      let minBalance = 100;
      let maxBalance = 3000;
      let balance = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
      setTimeout(() => {
        resolve(balance);
      }, delay);
    });
  }
  async transfer(howMuch, to) {
  
  }
}
module.exports = MockCrypto;
