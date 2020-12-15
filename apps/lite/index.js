import { Saito } from '../saito.io/index'
import mods_config from '../../config/modules.config';

async function init() {
  let saito = new Saito({ mod_paths: mods_config.lite });
  saito.BROWSER = 1;
  await saito.init();
  saito.config = await loadConfig();
}

async function loadConfig() {
  try {
    let response = await fetch(`/config`);
    return await response.json();
  } catch(err) {
    return {};
  }
}
init();
