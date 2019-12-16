class Mods {


  constructor(app, config) {

    this.app     = app;
    this.mods    = [];
    this.mods_list = config;

    this.lowest_sync_bid = -1;

    return this;
  ***REMOVED***



  attachEvents() {
    for (let imp = 0; imp < this.mods.length; imp++) {
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
  ***REMOVED*** callbackArray.push(this.mods[i].onConfirmation);
          callbackArray.push(this.mods[i].onConfirmation.bind(this.mods[i]));
          callbackIndexArray.push(txindex);
    ***REMOVED***
  ***REMOVED*** else {
        if (this.mods[i].shouldAffixCallbackToModule("", tx) == 1) {
  ***REMOVED***callbackArray.push(this.mods[i].onConfirmation);
          callbackArray.push(this.mods[i].onConfirmation.bind(this.mods[i]));
          callbackIndexArray.push(txindex);
	***REMOVED***
  ***REMOVED***
***REMOVED***
  ***REMOVED***

//
//  unless Saito coughs up blood, these should be safe to remove
//  the next time someone edits this file (Dec 2, 2019). domain
//  requests should go through keychain class now.
//
//  handleDomainRequest(message, peer, mycallback) {
//    for (let iii = 0; iii < this.mods.length; iii++) {
//      if (this.mods[iii].handlesDNS == 1) {
//        this.mods[iii].handleDomainRequest(this.app, message, peer, mycallback);
//  ***REMOVED***
//***REMOVED***
//    return;
//  ***REMOVED***
//
//  handleMultipleDomainRequest(message, peer, mycallback) {
//    for (let iii = 0; iii < this.mods.length; iii++) {
//      if (this.mods[iii].handlesDNS == 1) {
//        this.mods[iii].handleMultipleDomainRequest(this.app, message, peer, mycallback);
//  ***REMOVED***
//***REMOVED***
//    return;
//  ***REMOVED***

  handlePeerRequest(message, peer, mycallback=null) {
    for (let iii = 0; iii < this.mods.length; iii++) {
      try {
        this.mods[iii].handlePeerRequest(this.app, message, peer, mycallback);
  ***REMOVED*** catch (err) {***REMOVED***
***REMOVED***
    return;
  ***REMOVED***

  async initialize() {

    //
    // install any new modules
    //
    let new_mods_installed = 0;
    if (this.app.options.modules == null) {
      this.app.options.modules = [];
      for (let i = 0; i < this.mods.length; i++) {
        let mi = 0;
        let mi_idx = -1;
	let install_this_module = 0;

        for (let j = 0; j < this.app.options.modules.length; j++) { if (this.mods[i].name == this.app.options.modules[j].name) { mi = 1; mi_idx = j; ***REMOVED******REMOVED***

        if (mi == 0) {
	  install_this_module = 1;
    ***REMOVED*** else {
	  if (this.app.options.modules[j].installed == 0) {
	    install_this_module = 1;
      ***REMOVED***
	***REMOVED***

	if (install_this_module == 1) {
          new_mods_installed = 1;
          await this.mods[i].installModule(this.app);
	  if (mi_idx != -1) {
            this.app.options.modules[mi_idx].installed = 1;
	    if (this.app.options.modules[mi_idx].version == undefined) { 
	      this.app.options.modules[mi_idx].version == "";
	***REMOVED***
	    if (this.app.options.modules[mi_idx].publisher == undefined) { 
	      this.app.options.modules[mi_idx].publisher == "";
	***REMOVED***
	  ***REMOVED*** else {
            this.app.options.modules.push({ name : this.mods[i].name , installed : 1 , version : "", publisher : "" ***REMOVED***);
	  ***REMOVED***
	***REMOVED***

  ***REMOVED***
      if (new_mods_installed == 1) {
        this.app.storage.saveOptions();
  ***REMOVED***
***REMOVED***


    //
    // initialize the modules
    //
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


    //
    // .. and setup active module
    //
    console.log("initializing html...");
    await this.app.modules.initializeHTML();
    console.log("attaching events...");
    await this.app.modules.attachEvents();


  ***REMOVED***


  initializeHTML() {
    for (let icb = 0; icb < this.mods.length; icb++) {
      if (this.mods[icb].browser_active == 1) {
        this.mods[icb].initializeHTML(this.app);
  ***REMOVED***
***REMOVED***
    return null;
  ***REMOVED***

  implementsKeys(request) {
    return this.mods
      .map(mod => {
        return mod.implementsKeys(request);
  ***REMOVED***)
      .filter(mod => {
        return mod != null;
  ***REMOVED***);
  ***REMOVED***

  respondTo(request) {
    return this.mods
      .filter(mod => {
        return mod.respondTo(request) != null;
  ***REMOVED***);
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

  onConnectionStable(peer) {
    for (let i = 0; i < this.mods.length; i++) {
      this.mods[i].onConnectionStable(this.app, peer);
***REMOVED***
  ***REMOVED***

  onConnectionUnstable(peer) {
    for (let i = 0; i < this.mods.length; i++) {
      this.mods[i].onConnectionUnstable(this.app, peer);
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

  updateIdentifier() {
    for (let i = 0; i < this.mods.length; i++) {
      this.mods[i].updateIdentifier(this.app);
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
