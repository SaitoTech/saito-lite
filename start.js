const server = require('./lib/saito/core/server.js');
const storage = require('./lib/saito/core/storage-core.js');
const mods_config = require('./config/modules.config.js');

const saito = require('./lib/index.js');

async function initSaito() {
  const app = new saito.Saito({
    storage,
    server,
    mod_paths: mods_config.core
  ***REMOVED***);

  app.BROWSER           = 0;
  app.SPVMODE           = 0;
  app.CHROME            = 0;
  app.GENESIS_PUBLICKEY = "npDwmBDQafC148AyhqeEBMshHyzJww3X777W9TM3RYNv";

  //
  // set basedir
  //
  global.__webdir = __dirname + "/lib/saito/web/";

  await app.init();

  console.log(`

                                           
                     ◼◼◼                   
                  ◼◼   ◼ ◼◼                
               ◼◼◼      ◼  ◼◼◼             
            ◼◼◼          ◼    ◼◼◼          
         ◼◼◼              ◼      ◼◼◼       
       ◼◼◼                 ◼       ◼◼◼     
    ◼◼◼                     ◼         ◼◼◼  
   ◼◼◼                       ◼         ◼◼◼ 
   ◼  ◼◼◼                     ◼     ◼◼◼  ◼ 
   ◼     ◼◼◼                   ◼  ◼◼◼    ◼ 
   ◼       ◼◼◼                 ◼◼◼       ◼ 
   ◼        ◼ ◼◼◼           ◼◼◼          ◼ 
   ◼       ◼     ◼◼◼     ◼◼◼             ◼ 
   ◼      ◼         ◼◼ ◼◼                ◼ 
   ◼     ◼            ◼                  ◼ 
   ◼    ◼             ◼                  ◼ 
   ◼   ◼              ◼                  ◼ 
   ◼  ◼               ◼                  ◼ 
   ◼ ◼                ◼                  ◼ 
   ◼◼                 ◼                  ◼ 
   ◼◼                 ◼◼◼◼◼◼◼◼◼◼◼◼◼◼◼◼◼◼◼◼ 
    ◼◼◼               ◼               ◼◼◼  
       ◼◼◼            ◼            ◼◼◼     
         ◼◼◼          ◼          ◼◼◼       
            ◼◼◼       ◼       ◼◼◼          
               ◼◼◼    ◼    ◼◼◼             
                  ◼◼  ◼  ◼◼                
                     ◼◼◼                   
                                           

    Welcome to Saito

    address: ${app.wallet.returnPublicKey()***REMOVED***
    balance: ${app.wallet.returnBalance()***REMOVED***

    This is the address and balance of your computer on the Saito network. Once Saito
    is running it will generate tokens automatically over time. The more transactions
    you process the greater the chance that you will be rewarded for the work.

    For inquiries please visit our website: https://saito.tech

  `);

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
***REMOVED***

initSaito();
