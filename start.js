const saito = require('./lib/saito/saito.js');
const server = require('./core/server.js');
const storage = require('./core/storage-core.js');
const mods_config = require('./mods/modules.config.js');

var app                   = {***REMOVED***;
    app.BROWSER           = 0;
    app.SPVMODE           = 0;
    app.CHROME            = 0;
    app.GENESIS_PUBLICKEY = "npDwmBDQafC148AyhqeEBMshHyzJww3X777W9TM3RYNv";

//
// set basedir
//
global.__webdir = __dirname + "/lib/saito/web/";

initSaito();

async function initSaito() {


  ////////////////////
  // Load Variables //
  ////////////////////
  try {
    app.crypto     = new saito.crypto();
    app.connection = new saito.connection();
    app.storage    = new storage(app);
    app.shashmap   = new saito.shashmap(app);
    app.mempool    = new saito.mempool(app);
    app.wallet     = new saito.wallet(app);
    app.miner      = new saito.miner(app);
    app.browser    = new saito.browser(app);
//    app.archives   = new saito.archives(app);
//    app.dns        = new saito.dns(app);
//    app.keys       = new saito.keychain(app);
    app.network    = new saito.network(app);
    app.burnfee    = new saito.burnfee(app);
    app.blockchain = new saito.blockchain(app);

    // We need an external way to load modules and server
    // app.server     = new saito.server(app);
    app.server     = new server(app);
    // app.modules    = require('./lib/saito/modules')(app, mods);
    app.modules    = new saito.modules(app, mods_config);

    ////////////////
    // Initialize //
    ////////////////
    await app.storage.initialize();
    app.wallet.initialize();
    app.mempool.initialize();

    await app.blockchain.initialize();
//    app.keys.initialize();
    app.network.initialize();
//
    //
    // archives before modules
    //
//    app.archives.initialize();
    //
    // dns before browser so modules can
    // initialize with dns support
    //
//    app.dns.initialize();
    //
    // modules pre-initialized before
    // browser, so that the browser
    // can check which application we
    // are viewing.
    //
    app.modules.mods = mods_config.map(mod_path => {
      const Module = require(`./mods/${mod_path***REMOVED***`);
      return new Module(app);
***REMOVED***);
    app.modules.pre_initialize();
//    app.browser.initialize();
    app.modules.initialize();
    //
    // server initialized after modules
    // so that the modules can use the
    // server to feed their own subpages
    // as necessary
    //
    app.server.initialize();


    if (app.BROWSER == 0) {

      console.log(`

◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻
◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻
◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◼◻◻◻◼◻◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻
◻◻◻◻◻◻◻◻◻◻◻◻◻◼◼◼◻◻◻◻◻◻◼◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻
◻◻◻◻◻◻◻◻◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻◼◻◻◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻
◻◻◻◻◻◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻◻◻◻◻◻◼◼◼◻◻◻◻◻◻◻
◻◻◻◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻◻◻◻◻◻◻◼◼◼◻◻◻◻◻
◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻◻◻◻◻◻◻◻◻◼◼◼◻◻
◻◼◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻◻◻◻◻◻◻◻◻◼◼◼◻
◻◼◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻◻◻◻◻◼◼◼◻◻◼◻
◻◼◻◻◻◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻◻◼◼◼◻◻◻◻◼◻
◻◼◻◻◻◻◻◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◼◼◻◻◻◻◻◻◻◼◻
◻◼◻◻◻◻◻◻◻◻◼◻◼◼◼◻◻◻◻◻◻◻◻◻◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻◼◻
◻◼◻◻◻◻◻◻◻◼◻◻◻◻◻◼◼◼◻◻◻◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻
◻◼◻◻◻◻◻◻◼◻◻◻◻◻◻◻◻◻◼◼◻◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻
◻◼◻◻◻◻◻◼◻◻◻◻◻◻◻◻◻◻◻◻◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻
◻◼◻◻◻◻◼◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻
◻◼◻◻◻◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻
◻◼◻◻◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻
◻◼◻◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻
◻◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻
◻◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◼◼◼◼◼◼◼◼◼◼◼◼◼◼◼◼◼◼◼◻
◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◼◼◻◻
◻◻◻◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻◻◻◼◻◻◻◻◻◻◻◻◻◻◻◻◼◼◼◻◻◻◻◻
◻◻◻◻◻◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻◼◻◻◻◻◻◻◻◻◻◻◼◼◼◻◻◻◻◻◻◻
◻◻◻◻◻◻◻◻◻◻◼◼◼◻◻◻◻◻◻◻◼◻◻◻◻◻◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻
◻◻◻◻◻◻◻◻◻◻◻◻◻◼◼◼◻◻◻◻◼◻◻◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻
◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◼◻◻◼◻◻◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻
◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻
◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻
      
      Welcome to Saito

     address: ${app.wallet.returnPublicKey()***REMOVED***
     balance: ${app.wallet.returnBalance()***REMOVED***

   This is the address and balance of your computer on the Saito network. Once Saito
   is running it will generate tokens automatically over time. The more transactions 
   you process the greater the chance that you will be rewarded for the work.

   For inquiries please visit our website: https://saito.tech

      `);
***REMOVED*** else {

      console.log(`

      ◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻
      ◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻
      ◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◼◻◻◻◼◻◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻
      ◻◻◻◻◻◻◻◻◻◻◻◻◻◼◼◼◻◻◻◻◻◻◼◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻
      ◻◻◻◻◻◻◻◻◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻◼◻◻◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻
      ◻◻◻◻◻◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻◻◻◻◻◻◼◼◼◻◻◻◻◻◻◻
      ◻◻◻◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻◻◻◻◻◻◻◼◼◼◻◻◻◻◻
      ◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻◻◻◻◻◻◻◻◻◼◼◼◻◻
      ◻◼◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻◻◻◻◻◻◻◻◻◼◼◼◻
      ◻◼◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻◻◻◻◻◼◼◼◻◻◼◻
      ◻◼◻◻◻◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻◻◼◼◼◻◻◻◻◼◻
      ◻◼◻◻◻◻◻◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◼◼◻◻◻◻◻◻◻◼◻
      ◻◼◻◻◻◻◻◻◻◻◼◻◼◼◼◻◻◻◻◻◻◻◻◻◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻◼◻
      ◻◼◻◻◻◻◻◻◻◼◻◻◻◻◻◼◼◼◻◻◻◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻
      ◻◼◻◻◻◻◻◻◼◻◻◻◻◻◻◻◻◻◼◼◻◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻
      ◻◼◻◻◻◻◻◼◻◻◻◻◻◻◻◻◻◻◻◻◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻
      ◻◼◻◻◻◻◼◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻
      ◻◼◻◻◻◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻
      ◻◼◻◻◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻
      ◻◼◻◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻
      ◻◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻
      ◻◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◼◼◼◼◼◼◼◼◼◼◼◼◼◼◼◼◼◼◼◻
      ◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◼◼◻◻
      ◻◻◻◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻◻◻◼◻◻◻◻◻◻◻◻◻◻◻◻◼◼◼◻◻◻◻◻
      ◻◻◻◻◻◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻◼◻◻◻◻◻◻◻◻◻◻◼◼◼◻◻◻◻◻◻◻
      ◻◻◻◻◻◻◻◻◻◻◼◼◼◻◻◻◻◻◻◻◼◻◻◻◻◻◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻
      ◻◻◻◻◻◻◻◻◻◻◻◻◻◼◼◼◻◻◻◻◼◻◻◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻
      ◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◼◻◻◼◻◻◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻
      ◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◼◼◼◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻
      ◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻◻
      
    Welcome to Saito

    address: ${app.wallet.returnPublicKey()***REMOVED***
    balance: ${app.wallet.returnBalance()***REMOVED***

    Above is the address and balance of this computer on the Saito network. Once Saito
    is running it will generate tokens automatically over time. You can increase your
    likelihood of this by processing more transactions and creating services that attract
    clients. The more transactions you process the greater the chance that you will be
    rewarded for the work.

    For inquiries please visit our website:  https://saito.tech
      `)
***REMOVED***

  ***REMOVED*** catch (err) {
    console.log(err);

  ***REMOVED***
***REMOVED*** // init saito

function shutdownSaito() {
  console.log("Shutting down Saito");
  app.server.close();
  app.network.close();
***REMOVED***

/////////////////////
// Cntl-C to Close //
/////////////////////
process.on('SIGTERM', function () {
  shutdownSaito();
  console.log("Network Shutdown");
  process.exit(0)
***REMOVED***);
process.on('SIGINT', function () {
  shutdownSaito();
  console.log("Network Shutdown");
  process.exit(0)
***REMOVED***);




