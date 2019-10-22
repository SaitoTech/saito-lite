const server = require('./lib/saito/core/server.js');
const storage = require('./lib/saito/core/storage-core.js');
const mods_config = require('./config/modules.config.js');

const saito = require('./lib/index.js');
const logger = require('./lib/saito_logger.js');

async function initSaito() {
  const app = new saito.Saito({
    storage,
    server,
    mod_paths: mods_config.core
  });

  app.BROWSER           = 0;
  app.SPVMODE           = 0;
  app.CHROME            = 0;
  app.GENESIS_PUBLICKEY = "npDwmBDQafC148AyhqeEBMshHyzJww3X777W9TM3RYNv";

  //
  // set basedir
  //
  global.__webdir = __dirname + "/lib/saito/web/";

  await app.init();

  logger.info(`

                                           
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

    address: ${app.wallet.returnPublicKey()}
    balance: ${app.wallet.returnBalance()}

    This is the address and balance of your computer on the Saito network. Once Saito
    is running it will generate tokens automatically over time. The more transactions
    you process the greater the chance that you will be rewarded for the work.

    For inquiries please visit our website: https://saito.tech

  `);

  function shutdownSaito() {
    logger.info("Shutting down Saito");
    app.server.close();
    app.network.close();
  }

  /////////////////////
  // Cntl-C to Close //
  /////////////////////
  process.on('SIGTERM', function () {
    shutdownSaito();
    logger.info("Network Shutdown");
    process.exit(0)
  });
  process.on('SIGINT', function () {
    shutdownSaito();
    logger.info("Network Shutdown");
    process.exit(0)
  });
}

initSaito();
