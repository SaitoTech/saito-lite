import { Saito } from '../core/index'
import mods_config from '../../config/modules.config';

async function init() {
  let saito = new Saito({ mod_paths: mods_config.lite });
  saito.BROWSER = 1;
  await saito.init();
}
init();
