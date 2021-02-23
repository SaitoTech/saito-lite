class Mods {


  constructor(app, config) {

    this.app     = app;
    this.mods    = [];
    this.uimods  = [];
    this.mods_list = config;

    this.lowest_sync_bid = -1;

  }

  isModuleActive(modname="") {
    for (let i = 0; i < this.mods.length; i++) {
      if (this.mods[i].browser_active == 1) { if (modname == this.mods[i].name) { return 1; } }
    }
    return 0;
  }

  returnActiveModule() {
    for (let i = 0; i < this.mods.length; i++) {
      if (this.mods[i].browser_active == 1) { return this.mods[i]; }
    }
    return null;
  }

  attachEvents() {
    for (let imp = 0; imp < this.mods.length; imp++) {
      if (this.mods[imp].browser_active == 1) {
        this.mods[imp].attachEvents(this.app);
      }
    }
    return null;
  }

  affixCallbacks(tx, txindex, message, callbackArray, callbackIndexArray) {

    //
    // no callbacks on type=9 spv stubs
    //
    if (tx.transaction.type == 9) { return; }

    for (let i = 0; i < this.mods.length; i++) {
      if (message.module != undefined) {
        if (this.mods[i].shouldAffixCallbackToModule(message.module, tx) == 1) {
          callbackArray.push(this.mods[i].onConfirmation.bind(this.mods[i]));
          callbackIndexArray.push(txindex);
        }
      } else {
        if (this.mods[i].shouldAffixCallbackToModule("", tx) == 1) {
          callbackArray.push(this.mods[i].onConfirmation.bind(this.mods[i]));
          callbackIndexArray.push(txindex);
        }
      }
    }
  }

  handlePeerRequest(message, peer, mycallback=null) {
    for (let iii = 0; iii < this.mods.length; iii++) {
      try {
        this.mods[iii].handlePeerRequest(this.app, message, peer, mycallback);
      } catch (err) {
        console.log("handlePeerRequest Unknown Error: \n" + err);
      }
    }
    return;
  }

  async initialize() {

    //
    // remove any disabled / inactive modules
    //
    if (this.app.options) {
      if (this.app.options.modules) {
        for (let i = 0; i < this.app.options.modules.length; i++) {
          if (this.app.options.modules[i].active == 0) {
            for (let z = 0; z < this.mods.length; z++) {
              if (this.mods[z].name === this.app.options.modules[i].name) {
                this.mods.splice(z, 1);
                z = (this.mods.length+1);
              }
            }
          }
        }
      }
    }



    //
    // install any new modules
    //
    let new_mods_installed = 0;
    let start_installation = 0;
    if (this.app.options.modules == null) {
      start_installation = 1;
      this.app.options.modules = [];
    } else {
      if (this.app.options.modules.length < this.mods.length) { start_installation = 1; }
    }
    if (start_installation || true) {
      for (let i = 0; i < this.mods.length; i++) {
        let mi = 0;
        let mi_idx = -1;
        let install_this_module = 0;

        for (let j = 0; j < this.app.options.modules.length; j++) { if (this.mods[i].name == this.app.options.modules[j].name) { mi = 1; mi_idx = j; }}
        if (mi == 0) {
          install_this_module = 1;
        } else {
          if (this.app.options.modules[mi_idx].installed == 0) {
            install_this_module = 1;
          }
        }

        if (install_this_module == 1) {
          new_mods_installed = 1;
          await this.mods[i].installModule(this.app);
          if (mi_idx != -1) {
            this.app.options.modules[mi_idx].installed = 1;
            if (this.app.options.modules[mi_idx].version == undefined) {
              this.app.options.modules[mi_idx].version == "";
            }
            if (this.app.options.modules[mi_idx].publisher == undefined) {
              this.app.options.modules[mi_idx].publisher == "";
            }
            this.app.options.modules[mi_idx].active = 1;
          } else {
            this.app.options.modules.push({ name : this.mods[i].name , installed : 1 , version : "", publisher : "" , active : 1 });
          }
        }
      }
      if (new_mods_installed == 1) {
        this.app.storage.saveOptions();
      }
    }




    let modNames = {};
    this.mods.forEach((mod, i) => {
      if(modNames[mod.name]) {
        console.log(`*****************************************************************`);
        console.log(`***** WARNING: mod ${mod.name} is installed more than once! *****`);
        console.log(`*****************************************************************`)
      }
      modNames[mod.name] = true;
    });
    

    //
    // browsers install UIMODs
    //
    if (this.app.BROWSER == 1) {
      for (let i = 0; i < this.uimods.length; i++) {
	this.mods.push(this.uimods[i]);
      }
    }
    

    //
    // initialize the modules
    //
    for (let i = 0; i < this.mods.length; i++) {
      await this.mods[i].initialize(this.app);
    }


    //
    // include events here
    //
    this.app.connection.on('handshake_complete', (peer) => {
      this.onPeerHandshakeComplete(peer);
    });

    this.app.connection.on('connection_dropped', (peer) => {
      this.onConnectionUnstable(peer);
    });

    this.app.connection.on('connection_up', (peer) => {
      this.onConnectionStable(peer);
    });

    //
    // .. and setup active module
    //
    if (this.app.BROWSER) {
      await this.app.modules.initializeHTML();
      await this.app.modules.attachEvents();
      await this.app.modules.render();
    }

  }


  render() {
    for (let icb = 0; icb < this.mods.length; icb++) {
      if (this.mods[icb].browser_active == 1) {
        this.mods[icb].render(this.app);
      }
    }
    return null;
  }

  initializeHTML() {
    for (let icb = 0; icb < this.mods.length; icb++) {
      if (this.mods[icb].browser_active == 1) {
        this.mods[icb].initializeHTML(this.app);
      }
    }
    return null;
  }
  // 
  // implementsKeys(request) {
  //   return this.mods
  //     .map(mod => {
  //       return mod.implementsKeys(request);
  //     })
  //     .filter(mod => {
  //       return mod != null;
  //     });
  // }

  respondTo(request) {
    return this.mods
      .filter(mod => {
        return mod.respondTo(request) != null;
      });
  }

  // respondTo V2
  getRespondTos(request) {
    let compliantInterfaces = [];
    this.mods.forEach((mod) => {
      let itnerface = mod.respondTo(request);
      if(itnerface != null) {
        compliantInterfaces.push({...itnerface, modname: mod.name});
      }
    });
    return compliantInterfaces;
  }

  returnModulesBySubType(subtype) {
    let mods = [];
    this.mods.forEach((mod) => {
      if(mod instanceof subtype) {
        mods.push(mod);
      }
    });
    return mods;
  }
  returnFirstModulBySubType(subtype) {
    for(let i = 0; i < this.mods.length; i++) {
      if(this.mods[i] instanceof subtype) {
        return this.mods[i];
      }
    }
    return null;
  }
  returnModulesByTypeName(subtypeName) {
    // TODO: implement if you need this.
  }
  returnFirstModuleByTypeName(subtypeName) {
    // using type name allows us to check for the type without having a
    // reference to it(e.g. for modules which might not be installed). However
    // this technique(constructor.name) will not allow us to check for subtypes.
    for(let i = 0; i < this.mods.length; i++) {
      if(this.mods[i].constructor.name === subtypeName) {
        return this.mods[i];
      }
    }
    return null;
  }
  returnFirstRespondTo(request) {
    for(let i = 0; i < this.mods.length; i++) {
      if(this.mods[i].respondTo(request)) {
        return this.mods[i].respondTo(request);
      }
    }
    throw "Module responding to " + request + " not found";
  }

  onNewBlock(blk, i_am_the_longest_chain) {
    for (let iii = 0; iii < this.mods.length; iii++) {
      this.mods[iii].onNewBlock(blk, i_am_the_longest_chain);
    }
    return;
  }

  onChainReorganization(block_id, block_hash, lc, pos) {
    for (let imp = 0; imp < this.mods.length; imp++) {
      this.mods[imp].onChainReorganization(block_id, block_hash, lc, pos);
    }
    return null;
  }

  onPeerHandshakeComplete(peer) {
    for (let i = 0; i < this.mods.length; i++) {
      this.mods[i].onPeerHandshakeComplete(this.app, peer);
    }
  }

  onConnectionStable(peer) {
    for (let i = 0; i < this.mods.length; i++) {
      this.mods[i].onConnectionStable(this.app, peer);
    }
  }

  onConnectionUnstable(peer) {
    for (let i = 0; i < this.mods.length; i++) {
      this.mods[i].onConnectionUnstable(this.app, peer);
    }
  }


  onWalletReset() {
    for (let i = 0; i < this.mods.length; i++) {
      this.mods[i].onWalletReset();
    }
  }

  returnModuleBySlug(modslug) {
    for (let i = 0; i < this.mods.length; i++) {
      if (modslug === this.mods[i].returnSlug()) {
	return this.mods[i];
      }
    }
    return null;
  } 
  returnModule(modname) {
    for (let i = 0; i < this.mods.length; i++) {
      if (modname === this.mods[i].name) {
        return this.mods[i];
      }
    }
    return null;
  }

  returnModuleIndex(modname) {
    for (let i = 0; i < this.mods.length; i++) {
      if (modname === this.mods[i].name.toLowerCase()) {
        return i;
      }
    }
    return -1;
  }


  updateBlockchainSync(current, target) {
    if (this.lowest_sync_bid == -1) { this.lowest_sync_bid = current; }
    target = target-(this.lowest_sync_bid-1);
    current = current-(this.lowest_sync_bid-1);
    if (target < 1) { target = 1; }
    if (current < 1) { current = 1; }
    let percent_downloaded = 100;
    if (target > current) {
      percent_downloaded = Math.floor(100*(current/target));
    }
    for (let i = 0; i < this.mods.length; i++) {
      this.mods[i].updateBlockchainSync(this.app, percent_downloaded);
    }
    return null;
  }

  webServer(expressapp=null, express=null) {
    for (let i = 0; i < this.mods.length; i++) {
      this.mods[i].webServer(this.app, expressapp, express);
    }
    return null;
  }

}

module.exports = Mods
