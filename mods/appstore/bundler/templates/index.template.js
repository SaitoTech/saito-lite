module.exports = IndexTemplate = (module_config_filename) => {
  return `
import { Saito } from '../../../lib/index';
import mod_paths from './${module_config_filename}';

async function init() {
  let saito = new Saito({ mod_paths });
  saito.BROWSER = 1;
  await saito.init();
  console.log("Hello!");
}

init();
  `;
}