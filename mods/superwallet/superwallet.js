const saito = require('./../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');

class SuperWallet extends ModTemplate {

  constructor(app) {
    super(app);
    this.name = "SuperWallet";
    this.description = "";
    this.categories = "";
    this.rendered = false;
  }
  
  requestInterface(type = "", interfaceBuilder = null) {
    return null;
  }
  
  initialize(app) {
    super.initialize(app);
  }
  async initializeHTML (app) {
    this.render(app);
  }
  async loadBalance (responseInterface) {
    let balance = await responseInterface.getBalance();
    document.querySelector(`#crypto-${responseInterface.modname} .balance`).innerHTML = balance;
  }
  async loadPubkey (responseInterface) {
    let address = await responseInterface.getAddress();
    document.querySelector(`#crypto-${responseInterface.modname} .address`).innerHTML = address;
  }
  async render(app) {
    if (!this.rendered) {
      this.rendered = true;
      app.browser.addElementToDom('<div id="superwallet-container" class="superwallet-container"></div>'); 
      app.modules.requestInterfaces("is_cryptocurrency").forEach(async(responseInterface, i) => {
        let infoHtml = '';
        if (responseInterface.info) {
          infoHtml = `<div class="crypto-info">${responseInterface.info}</div>`;
        }
        app.browser.addElementToDom(`<div id="crypto-${responseInterface.modname}" class="crypto-container">
          <div class="ticker">${responseInterface.ticker}</div>
          <div class="crypto-title">${responseInterface.description}</div>
          ${infoHtml}
          
          <div>
            Address: <span class="address">loading...</span>
          </div>
          <div>
            Balance: <span class="balance">loading...</span>
          </div>
          <div>
            Amount: <input class="howmuch" type="text"></input>
          </div>
          <div>
            To: <input class="pubkeyto" type="text"></input>
          </div>
          <input class="sendbutton" type="button" value="send"></input>
        </div>`, "superwallet-container");
        this.loadBalance(responseInterface);
        this.loadPubkey(responseInterface);
        document.querySelector(`#crypto-${responseInterface.modname} .sendbutton`).onclick = () => {
          let howMuch = document.querySelector(`#crypto-${responseInterface.modname} .howmuch`).value;
          let toAddress = document.querySelector(`#crypto-${responseInterface.modname} .pubkeyto`).value;
          responseInterface.transfer(howMuch, toAddress);
        }
      });
    }
  }

  // async onConfirmation(blk, tx, conf, app) {
  // 
  // }

  // webServer(app, expressapp, express) {
  //   super.webServer(app, expressapp, express);
  //   expressapp.get('/arcade/observer/:game_id', async (req, res) => {
  //     if (games.length > 0) {
  //       let game = games[0];
  //       res.setHeader('Content-type', 'text/html');
  //       res.charset = 'UTF-8';
  //       //console.info(JSON.stringify(game));
  //       res.write(game.game_state);
  //       res.end();
  //       return;
  //     }
  //   });
  // }




}

module.exports = SuperWallet;

