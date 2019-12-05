
import { Saito ***REMOVED*** from '../../../lib/index';
import mod_paths from './modules.config-1575534605300-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855.json';

async function init() {
  let saito = new Saito({ mod_paths ***REMOVED***);
  saito.BROWSER = 1;
  await saito.init();
  console.log("Hello!");
***REMOVED***

init();
  