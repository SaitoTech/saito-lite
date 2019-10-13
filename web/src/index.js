import App from './app/app';
import { Saito ***REMOVED*** from '../../lib/index';
import Storage from './saito/storage-web';

async function init() {
  let config = {
    storage: Storage,
    mod_paths: [
      'arcade/lite/arcade-lite.js',
      'chat/lite/chat-lite.js',
      'forum/lite/forum-lite.js',
      'wallet/wallet.js'
    ],
    peers:[{"host":"localhost","port":12101,"protocol":"http","publickey":"","synctype":"lite"***REMOVED***]
  ***REMOVED***;

  let app = new App();
  let saito = new Saito(config);

  await saito.init();
  app.init(saito);
***REMOVED***

init();
