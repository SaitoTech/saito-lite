import App from './src/app';
import Storage from './src/storage/storage-web';

import { Saito ***REMOVED*** from '../lib/index';
import mods_config from '../config/modules.config';

async function init() {
  let config = {
    storage: Storage,
    mod_paths: mods_config.lite,
    peers:[{"host": "localhost", "port": 12101, "protocol": "http", "publickey": "", "synctype": "lite"***REMOVED***]
  ***REMOVED***;

  let app = new App();
  let saito = new Saito(config);

  await saito.init();
  app.init(saito);
***REMOVED***

init();
