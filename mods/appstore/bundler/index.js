import { Saito ***REMOVED*** from '../../../lib/index';
import mods_paths from './modules.config.json';

async function init() {
  let saito = new Saito({ mod_paths ***REMOVED***);
  saito.BROWSER = 1;
  await saito.init();
***REMOVED***

init();
