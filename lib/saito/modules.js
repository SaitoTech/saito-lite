class Mods {


  constructor(app, config) {

    this.app     = app;
    this.mods    = [];
    this.mods_list = config;

    this.lowest_sync_bid = -1;

    return this;
  ***REMOVED***



  attachEvents() {
    for (imp = 0; imp < this.mods.length; imp++) {
      if (this.mods[imp].browser_active == 1) {
        this.mods[imp].attachEvents(this.app);
  ***REMOVED***
***REMOVED***
    return null;
  ***REMOVED***

  attachEmailEvents() {
    for (let imp = 0; imp < this.mods.length; imp++) {
      this.mods[imp].attachEmailEvents(this.app);
***REMOVED***
    return null;
  ***REMOVED***

  affixCallbacks(tx, txindex, message, callbackArray, callbackIndexArray) {
    for (let i = 0; i < this.mods.length; i++) {
      if (message.module != undefined) {
        if (this.mods[i].shouldAffixCallbackToModule(message.module, tx) == 1) {
          callbackArray.push(this.mods[i].onConfirmation);
          callbackIndexArray.push(txindex);
    ***REMOVED***
  ***REMOVED*** else {
        if (this.mods[i].shouldAffixCallbackToModule("", tx) == 1) {
          callbackArray.push(this.mods[i].onConfirmation);
          callbackIndexArray.push(txindex);
	***REMOVED***
  ***REMOVED***
***REMOVED***
  ***REMOVED***

  displayEmailForm(modname) {
    for (let i = 0; i < this.mods.length; i++) {
      if (modname == this.mods[i].name) {
        if (this.mods[i].handlesEmail == 1) {
          this.mods[i].displayEmailForm(this.app);
          for (let ii = 0; ii < this.mods.length; ii++) {
        if (this.mods[ii].name == "Email") {
              this.mods[ii].active_module = modname;
    ***REMOVED***
  ***REMOVED***
    ***REMOVED***
  ***REMOVED***
***REMOVED***
    return null;
  ***REMOVED***

  displayEmailMessage(modname, message_id) {
    for (let i = 0; i < this.mods.length; i++) {
      if (modname == this.mods[i].name) {
        if (this.mods[i].handlesEmail == 1) {
          return this.mods[i].displayEmailMessage(this.app, message_id);
    ***REMOVED***
  ***REMOVED***
***REMOVED***
    return null;
  ***REMOVED***

  formatEmailTransaction(tx, modname) {
    for (let i = 0; i < this.mods.length; i++) {
      if (modname == this.mods[i].name) {
        return this.mods[i].formatEmailTransaction(tx, this.app);
  ***REMOVED***
***REMOVED***
    return null;
  ***REMOVED***

  handleDomainRequest(message, peer, mycallback) {
    for (let iii = 0; iii < this.mods.length; iii++) {
      if (this.mods[iii].handlesDNS == 1) {
        this.mods[iii].handleDomainRequest(this.app, message, peer, mycallback);
  ***REMOVED***
***REMOVED***
    return;
  ***REMOVED***

  handleMultipleDomainRequest(message, peer, mycallback) {
    for (let iii = 0; iii < this.mods.length; iii++) {
      if (this.mods[iii].handlesDNS == 1) {
        this.mods[iii].handleMultipleDomainRequest(this.app, message, peer, mycallback);
  ***REMOVED***
***REMOVED***
    return;
  ***REMOVED***

  handlePeerRequest(message, peer, mycallback=null) {
    for (let iii = 0; iii < this.mods.length; iii++) {
      try {
        this.mods[iii].handlePeerRequest(this.app, message, peer, mycallback);
  ***REMOVED*** catch (err) {***REMOVED***
***REMOVED***
    return;
  ***REMOVED***

  async initialize() {
    for (let i = 0; i < this.mods.length; i++) {
      this.mods[i].initialize(this.app);
***REMOVED***

    //
    // include events here
    //
    this.app.connection.on('handshake_complete', (peer) => {
      this.onPeerHandshakeComplete(peer);
***REMOVED***);

    this.app.connection.on('connection_dropped', (peer) => {
      this.onConnectionUnstable(peer);
***REMOVED***);

    this.app.connection.on('connection_up', (peer) => {
      this.onConnectionStable(peer);
***REMOVED***);


  ***REMOVED***


  initializeHTML() {
    for (let icb = 0; icb < this.mods.length; icb++) {
      if (this.mods[icb].browser_active == 1) {
        this.mods[icb].initializeHTML(this.app);
  ***REMOVED***
***REMOVED***
    return null;
  ***REMOVED***

  loadFromArchives(tx) {
    for (let iii = 0; iii < this.mods.length; iii++) {
      this.mods[iii].loadFromArchives(this.app, tx);
***REMOVED***
    return;
  ***REMOVED***

  onNewBlock(blk, i_am_the_longest_chain) {
    for (let iii = 0; iii < this.mods.length; iii++) {
      this.mods[iii].onNewBlock(blk, i_am_the_longest_chain);
***REMOVED***
    return;
  ***REMOVED***

  onChainReorganization(block_id, block_hash, lc) {
    for (let imp = 0; imp < this.mods.length; imp++) {
      this.mods[imp].onChainReorganization(block_id, block_hash, lc);
***REMOVED***
    return null;
  ***REMOVED***

  onPeerHandshakeComplete(peer) {
    for (let i = 0; i < this.mods.length; i++) {
      this.mods[i].onPeerHandshakeComplete(this.app, peer);
***REMOVED***
  ***REMOVED***

  async pre_initialize() {
    if (this.app.options.modules == null) {
      this.app.options.modules = [];
      for (let i = 0; i < this.mods.length; i++) {
        let mi = 0;
        for (let j = 0; j < this.app.options.modules.length; j++) { if (this.mods[i].name == this.app.options.modules[j]) { mi = 1; ***REMOVED******REMOVED***
        if (mi == 0) {
          if (this.app.BROWSER == 0) {
            await this.mods[i].installModule(this.app);
      ***REMOVED***
          this.app.options.modules.push(this.mods[i].name);
    ***REMOVED***;
  ***REMOVED***
      this.app.storage.saveOptions();
***REMOVED***
  ***REMOVED***

  returnModule(modname) {
    for (let i = 0; i < this.mods.length; i++) {
      if (modname == this.mods[i].name) {
        return this.mods[i];
  ***REMOVED***
***REMOVED***
    return null;
  ***REMOVED***

  updateBalance() {
    for (let i = 0; i < this.mods.length; i++) {
      this.mods[i].updateBalance(this.app);
***REMOVED***
    return null;
  ***REMOVED***

  updateBlockchainSync(current, target) {
    if (this.lowest_sync_bid == -1) { this.lowest_sync_bid = current; ***REMOVED***
    target = target-(this.lowest_sync_bid-1);
    current = current-(this.lowest_sync_bid-1);
    if (target < 1) { target = 1; ***REMOVED***
    if (current < 1) { current = 1; ***REMOVED***
    let percent_downloaded = 100;
    if (target > current) {
      percent_downloaded = Math.floor(100*(current/target));
***REMOVED***
    for (let i = 0; i < this.mods.length; i++) {
      this.mods[i].updateBlockchainSync(this.app, percent_downloaded);
***REMOVED***
    return null;
  ***REMOVED***

  webServer(expressapp=null, express=null) {
    for (let i = 0; i < this.mods.length; i++) {
      this.mods[i].webServer(this.app, expressapp, express);
***REMOVED***
    return null;
  ***REMOVED***

***REMOVED***

module.exports = Mods
