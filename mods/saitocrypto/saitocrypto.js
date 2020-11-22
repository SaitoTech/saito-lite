const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const { Keyring }  = require('@polkadot/keyring');
const { mnemonicGenerate } = require('@polkadot/util-crypto');
const { ApiPromise, WsProvider }  = require('@polkadot/api');
const { randomBytes }   = require('crypto');
class SaitoCrypto extends ModTemplate {

  constructor(app) {

    super(app);

    this.name = "SaitoCrypto";
    this.description = "Payment Gateway for DOT cryptocurrency in Saito Application";
    this.categories = "Crptocurrency";
    this.ticker = "SAITO";
    this.mods = [];
  }
  
  requestInterface(type = "") {
    if (type == "___is_cryptocurrency") {
      return {
        // The ticker of the cryptocurrency
        ticker: this.ticker,
        // get balance of given address.
        //  getBalance(address)
        getBalance: () => { return 0; },
        // transfer to another addresses
        transfer: null,
        // sign and send a raw transaction
        signAndSend: null,
        subscribe: null,
        getPubkey: () => { return "asdf"; },
        getKeyring: null,
        buildRawTx: null,
      }
    }
    return null;
  }
  
  
  // const unsub = await api.query.system.account(ADDR, ({ nonce, data: balance }) => {
  //   console.log(`free balance is ${balance.free} with ${balance.reserved} reserved and a nonce of ${nonce}`);
  // });
  
  async getBal(){
    
    console.log("getbalanace");
    const wsProvider = new WsProvider('wss://rpc.polkadot.io');
    //const wsProvider = new WsProvider('wss://localhost:8888');
    //const wsProvider = new WsProvider('ws://localhost:8887');
    //const wsProvider = new WsProvider('ws://localhost');
    //const wsProvider = new WsProvider('ws://138.197.202.211');
    
    console.log("made provider");
    // returns an API instance when connected, decorated and ready-to use...
    const api = await ApiPromise.create({ provider: wsProvider });  
    console.log("made api");
    await api.isReady;
    
    
    let ADDR = '5DTestUPts3kjeXSTMyerHihn1uwMfLj8vU8sqF7qYrFabHE';
    ADDR = "13MfMQeGbBb73HAAGRctG8GomWg3mXumP2vnrrRqxBBbqiQH";
    console.log("isReady");
    setInterval(async() => {
      // Retrieve the last timestamp
      const now = await api.query.timestamp.now();
      
      // Retrieve the account balance & nonce via the system module
      const { nonce, data: balance } = await api.query.system.account(ADDR);
      
      console.log(`${now}: balance of ${balance.free} and a nonce of ${nonce}`);  
    }, 2000);
    
    
    
  }
  initialize(app) {

    super.initialize(app);
    //this.getBal();
  }

  initializeHTML(app) {
    if (this.app.BROWSER == 0 || !this.browser_active) { return; };
    document.querySelector("#content .main").innerHTML = "<div id='greeting'>Hello World!</div>"
    addCss();
  }
  tryLoadFromLocalStorage() {
    
  }
  getBalance() {
    
  }
  // createAccount(seed)
  // create
  
  // User has an "account" on the system, a multisig wallet
  // They can request to start a game with 50% of the funds in the wallet
  // When funds are "in play", other modules must be restricted from using those funds as collateral for other games
  //
  // createMultisigWallet
  // 
  // useMultisigWallet
  // hasMultisigWallet
  // isFunded
  // sendToPlayer
  // 
  

}

module.exports = SaitoCrypto;

