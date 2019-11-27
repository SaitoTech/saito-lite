module.exports = IndexTemplate = (module_config_filename) => {
  return `
import { Saito ***REMOVED*** from '../../../lib/index';
import mod_paths from './${module_config_filename***REMOVED***';

async function init() {
  let saito = new Saito({ mod_paths ***REMOVED***);
  saito.BROWSER = 1;
  await saito.init();
  console.log("Hello!");
***REMOVED***

init();
  `;
***REMOVED***