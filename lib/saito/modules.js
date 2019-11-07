class Mods {


  constructor(app, config) {

    this.app     = app;
    this.mods    = [];
    this.mods_list = config;

    this.lowest_sync_bid = -1;

    return this;
  }



  attachEvents() {
    for (let imp = 0; imp < this.mods.length; imp++) {
      if (this.mods[imp].browser_active == 1) {
        this.mods[imp].attachEvents(this.app);
      }
    }
    return null;
  }

  attachEmailEvents() {
    for (let imp = 0; imp < this.mods.length; imp++) {
      this.mods[imp].attachEmailEvents(this.app);
    }
    return null;
  }

  affixCallbacks(tx, txindex, message, callbackArray, callbackIndexArray) {
    for (let i = 0; i < this.mods.length; i++) {
      if (message.module != undefined) {
        if (this.mods[i].shouldAffixCallbackToModule(message.module, tx) == 1) {
          callbackArray.push(this.mods[i].onConfirmation);
          callbackIndexArray.push(txindex);
        }
      } else {
        if (this.mods[i].shouldAffixCallbackToModule("", tx) == 1) {
          callbackArray.push(this.mods[i].onConfirmation);
          callbackIndexArray.push(txindex);
	}
      }
    }
  }

  displayEmailForm(modname) {
    for (let i = 0; i < this.mods.length; i++) {
      if (modname == this.mods[i].name) {
        if (this.mods[i].handlesEmail == 1) {
          this.mods[i].displayEmailForm(this.app);
          for (let ii = 0; ii < this.mods.length; ii++) {
        if (this.mods[ii].name == "Email") {
              this.mods[ii].active_module = modname;
        }
      }
        }
      }
    }
    return null;
  }

  displayEmailMessage(modname, message_id) {
    for (let i = 0; i < this.mods.length; i++) {
      if (modname == this.mods[i].name) {
        if (this.mods[i].handlesEmail == 1) {
          return this.mods[i].displayEmailMessage(this.app, message_id);
        }
      }
    }
    return null;
  }

  formatEmailTransaction(tx, modname) {
    for (let i = 0; i < this.mods.length; i++) {
      if (modname == this.mods[i].name) {
        return this.mods[i].formatEmailTransaction(tx, this.app);
      }
    }
    return null;
  }

  handleDomainRequest(message, peer, mycallback) {
    for (let iii = 0; iii < this.mods.length; iii++) {
      if (this.mods[iii].handlesDNS == 1) {
        this.mods[iii].handleDomainRequest(this.app, message, peer, mycallback);
      }
    }
    return;
  }

  handleMultipleDomainRequest(message, peer, mycallback) {
    for (let iii = 0; iii < this.mods.length; iii++) {
      if (this.mods[iii].handlesDNS == 1) {
        this.mods[iii].handleMultipleDomainRequest(this.app, message, peer, mycallback);
      }
    }
    return;
  }

  handlePeerRequest(message, peer, mycallback=null) {
    for (let iii = 0; iii < this.mods.length; iii++) {
      try {
        this.mods[iii].handlePeerRequest(this.app, message, peer, mycallback);
      } catch (err) {}
    }
    return;
  }

  async initialize() {

    //
    // install any new modules
    //
    let new_mods_installed = 0;
    if (this.app.options.modules == null) {
      this.app.options.modules = [];
      for (let i = 0; i < this.mods.length; i++) {
        let mi = 0;
        for (let j = 0; j < this.app.options.modules.length; j++) { if (this.mods[i].name == this.app.options.modules[j]) { mi = 1; }}
        if (mi == 0) {
          new_mods_installed = 1;
          await this.mods[i].installModule(this.app);
          this.app.options.modules.push(this.mods[i].name);
        };
      }
      if (new_mods_installed == 1) {
        this.app.storage.saveOptions();
      }
    }


    //
    // initialize the modules
    //
    for (let i = 0; i < this.mods.length; i++) {
      this.mods[i].initialize(this.app);
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
    console.log("initializing html...");
    await this.app.modules.initializeHTML();
    console.log("attaching events...");
    await this.app.modules.attachEvents();


  }


  initializeHTML() {
    for (let icb = 0; icb < this.mods.length; icb++) {
      if (this.mods[icb].browser_active == 1) {
        this.mods[icb].initializeHTML(this.app);
      }
    }
    return null;
  }

  implementsKeys(request) {
    return this.mods
      .map(mod => {
        return mod.implementsKeys(request);
      })
      .filter(mod => {
        return mod != null;
      });
  }

  respondTo(request) {
    return this.mods
      .filter(mod => {
        return mod.respondTo(request) != null;
      });
  }

  loadFromArchives(tx) {
    for (let iii = 0; iii < this.mods.length; iii++) {
      this.mods[iii].loadFromArchives(this.app, tx);
    }
    return;
  }

  onNewBlock(blk, i_am_the_longest_chain) {
    for (let iii = 0; iii < this.mods.length; iii++) {
      this.mods[iii].onNewBlock(blk, i_am_the_longest_chain);
    }
    return;
  }

  onChainReorganization(block_id, block_hash, lc) {
    for (let imp = 0; imp < this.mods.length; imp++) {
      this.mods[imp].onChainReorganization(block_id, block_hash, lc);
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


  returnModule(modname) {
    for (let i = 0; i < this.mods.length; i++) {
      if (modname == this.mods[i].name) {
        return this.mods[i];
      }
    }
    return null;
  }

  updateBalance() {
    for (let i = 0; i < this.mods.length; i++) {
      this.mods[i].updateBalance(this.app);
    }
    return null;
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
