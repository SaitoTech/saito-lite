const saito = require('./../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');

class SuperWallet extends ModTemplate {

  constructor(app) {

    super(app);

    this.name = "SuperWallet";
    this.description = "";
    this.categories = "";
    this.default_html = 1;
  }
  
  requestInterface(type = "", interfaceBuilder = null) {
    return null;
  }
  
  initialize(app) {
    console.log("superwallet init");
    super.initialize(app);

  }
  
  async render(app) {
    console.log("superwallet render");
    if (!document.getElementById("superwallet-container")) { 
      app.browser.addElementToDom('<div id="superwallet-container" class="superwallet-container"></div>'); 
    }
    app.modules.requestInterfaces("is_cryptocurrency").forEach(async(response, i) => {
      console.log("is crypto");
      let pubkey = await response.getPubkey();
      console.log("got pubkey");
      let balance = await response.getBalance();
      console.log("got balance");
      app.browser.addElementToDom(`<div>
        <div>${response.ticker}</div>
        <div>${pubkey}</div>
        <div>${balance}</div>
      </div>`, "arcade-container");
      
    });

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

