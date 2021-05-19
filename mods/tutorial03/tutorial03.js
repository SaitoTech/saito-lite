var ModTemplate = require('../../lib/templates/modtemplate');
const Tutorial03EmailAppspace = require('./lib/email-appspace/tutorial03-appspace');

//
// Saito supports the use of a special class of Cryptocurrency Modules which 
// allow users to send and receive tokens in third-party cryptocurrencies, 
// such as DOT. Anyone can develop and deploy modules that provide this kind
// of integration.
//
// this application demonstrates how to interact with these cryptocurrency
// modules. it installs a menu option to the Saito Wallet. users who install 
// it will be able to click on this menu to see a text input for an address, 
// a text input for an amount, and a send button. clicking this button will
// send a DOT payment from the 
//
class Tutorial03 extends ModTemplate {

  //
  // CONSTRUCTOR
  //
  constructor(app) {

    super(app);

    this.name            = "Tutorial03";
    this.description     = "Example of simple Polkadot Integration";
    this.categories      = "Saito Tutorials";

    return this;

  }



  //
  // RESPOND_TO
  //
  // add a module to the Wallet by responding to "email-appspace"
  //
  respondTo(type) {
    if (type == 'email-appspace') {
      let obj = {};
          obj.render = function (app, mod) {
            Tutorial03EmailAppspace.render(app, mod);
          }
          obj.attachEvents = function (app, mod) {
            Tutorial03EmailAppspace.attachEvents(app, mod);
          }
      return obj;
    }
    return null;
  }

}

module.exports = Tutorial03;

