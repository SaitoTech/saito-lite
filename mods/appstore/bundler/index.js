import { Saito } from '../../../lib/index';
import mods_paths from './modules.config.json';

async function init() {
  let saito = new Saito({ mod_paths });
  saito.BROWSER = 1;
  await saito.init();
}

init();
