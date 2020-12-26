module.exports = IndexTemplate = (module_config_filename) => {
  return `
import { Saito } from '../apps/core/index';
import mod_paths from './${module_config_filename}';

// ../mods/appstore/bundler/mods/

async function init() {
  let saito = new Saito({ mod_paths: mod_paths.mod_paths });
  saito.BROWSER = 1;
  await saito.init();
  console.log("Hello!");
}

init();
  `;
}
