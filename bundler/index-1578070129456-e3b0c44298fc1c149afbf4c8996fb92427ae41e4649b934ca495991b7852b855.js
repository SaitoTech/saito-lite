
import { Saito } from '../lib/index';
import mod_paths from './modules.config-1578070129456-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855.json';

// ../mods/appstore/bundler/mods/

async function init() {
  let saito = new Saito({ mod_paths: mod_paths.mod_paths });
  saito.BROWSER = 1;
  await saito.init();
  console.log("Hello!");
}

init();
  