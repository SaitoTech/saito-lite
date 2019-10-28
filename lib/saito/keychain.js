const saito = require('./saito');
const modtemplate = require('./../templates/modtemplate');


class Keychain {


  constructor(app) {

    if (!(this instanceof Keychain)) {
      return new Keychain(app);
***REMOVED***

    this.app         = app || {***REMOVED***;
    this.keys        = [];
    this.modtemplate = new modtemplate(this.app);

    return this;

  ***REMOVED***



  initialize() {

    if (this.app.options.keys == null) { this.app.options.keys = {***REMOVED***; ***REMOVED***

    for (let i = 0; i < this.app.options.keys.length; i++) {

      var tk               = this.app.options.keys[i];

      var k                = new saito.key();
          k.publickey      = tk.publickey;
          k.watched        = tk.watched;
          k.bid            = tk.bid;
          k.bsh            = tk.bsh;
          k.lc             = tk.lc;
          k.aes_publickey  = tk.aes_publickey;
          k.aes_privatekey = tk.aes_privatekey;
          k.aes_secret     = tk.aes_secret;
          k.identifiers    = [];
          k.tags           = [];

      for (let m = 0; m < tk.identifiers.length; m++) {
        k.identifiers[m] = tk.identifiers[m];
  ***REMOVED***
      for (let m = 0; m < tk.tags.length; m++) {
        k.tags[m] = tk.tags[m];
  ***REMOVED***
      this.keys.push(k);
***REMOVED***
  ***REMOVED***


  addKey(publickey, identifier = "", watched = false, tag = "", bid="", bsh="", lc=1) {

    if (publickey == "") { return; ***REMOVED***
    publickey = publickey.trim();

    let tmpkey = this.findByPublicKey(publickey);
    if (tmpkey == null) {
      tmpkey                = new saito.key();
      tmpkey.publickey      = publickey;
      tmpkey.watched        = watched;
      tmpkey.bid	    = bid;
      tmpkey.bsh	    = bsh;
      tmpkey.lc		    = lc;
      if (identifier != "") { tmpkey.addIdentifier(identifier); ***REMOVED***
      if (tag != "")        { tmpkey.addTag(tag); ***REMOVED***
      this.keys.push(tmpkey);
***REMOVED*** else {
      if (bid != "" && bsh != "") {

        if (tmpkey.bsh != bsh && tmpkey.bid != bid) {

	  tmpkey                = new saito.key();
          tmpkey.publickey      = publickey;
          tmpkey.watched        = watched;
          tmpkey.bid	    	= bid;
          tmpkey.bsh	    	= bsh;
          tmpkey.lc		= lc;
          if (identifier != "") { tmpkey.addIdentifier(identifier); ***REMOVED***
          if (tag != "")        { tmpkey.addTag(tag); ***REMOVED***
          this.keys.push(tmpkey);

	***REMOVED*** else {
	
          tmpkey.publickey      = publickey;
          tmpkey.watched        = watched;
          tmpkey.bid	    	= bid;
          tmpkey.bsh	    	= bsh;
          tmpkey.lc		= lc;
          if (identifier != "") { tmpkey.addIdentifier(identifier); ***REMOVED***
          if (tag != "")        { tmpkey.addTag(tag); ***REMOVED***

	***REMOVED***

  ***REMOVED*** else {
        if (identifier != "") { tmpkey.addIdentifier(identifier); ***REMOVED***
        if (tag != "")        { tmpkey.addTag(tag); ***REMOVED***
        if (watched)          { tmpkey.watched = true; ***REMOVED***
  ***REMOVED***
***REMOVED***
    this.saveKeys();

  ***REMOVED***


  decryptMessage(publickey, encrypted_msg) {

    // submit JSON parsed object after unencryption
    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].publickey == publickey) {
        if (this.keys[x].aes_secret != "") {
          var tmpmsg = this.app.crypto.aesDecrypt(encrypted_msg, this.keys[x].aes_secret);
          if (tmpmsg != null) {
            var tmpx = JSON.parse(tmpmsg);
            if (tmpx.module != null) {
              return JSON.parse(tmpmsg);
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
***REMOVED***
 
    // or return original
    return encrypted_msg;
  ***REMOVED***


  decryptString(publickey, encrypted_string) {

    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].publickey == publickey) {
        if (this.keys[x].aes_secret != "") {
          let tmpmsg = this.app.crypto.aesDecrypt(encrypted_string, this.keys[x].aes_secret);
          return tmpmsg;
    ***REMOVED***
  ***REMOVED***
***REMOVED***

    return encrypted_string;
  ***REMOVED***


  encryptMessage(publickey, msg) {
    let jsonmsg = JSON.stringify(msg);
    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].publickey == publickey) {
        if (this.keys[x].aes_secret != "") {
          return this.app.crypto.aesEncrypt(jsonmsg, this.keys[x].aes_secret);
    ***REMOVED***
  ***REMOVED***
***REMOVED***
    return msg;
  ***REMOVED***


  findByPublicKey(publickey) {
    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].publickey == publickey) { return this.keys[x]; ***REMOVED***
***REMOVED***
    return null;
  ***REMOVED***


  findByIdentifier(identifier) {
    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].isIdentifier(identifier) == 1) { return this.keys[x]; ***REMOVED***
***REMOVED***
    return null;
  ***REMOVED***


  hasSharedSecret(publickey) {
    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].publickey == publickey || this.keys[x].isIdentifier(publickey) == 1) {
        if (this.keys[x].hasSharedSecret() == 1) {
          return true;
    ***REMOVED***
  ***REMOVED***
***REMOVED***
    return false;
  ***REMOVED***


  isWatched(publickey) {
    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].publickey == publickey || this.keys[x].isIdentifier(publickey)) {
        if (this.keys[x].isWatched()) {
          return true;
    ***REMOVED***
  ***REMOVED***
***REMOVED***
    return false;
  ***REMOVED***


  initializeKeyExchange(publickey) {

    var alice            = this.app.crypto.createDiffieHellman();
    var alice_publickey  = alice.getPublicKey(null, "compressed").toString("hex");
    var alice_privatekey = alice.getPrivateKey(null, "compressed").toString("hex");
    this.updateCryptoByPublicKey(publickey, alice_publickey, alice_privatekey, "");
    return alice_publickey;

  ***REMOVED***


  isTagged(publickey, tag) {
    var x = this.findByPublicKey(publickey);
    if (x == null) { return false; ***REMOVED***
    return x.isTagged(tag);
  ***REMOVED***


  saveKeys() {
    this.app.options.keys = this.keys;
    this.app.storage.saveOptions();
  ***REMOVED***


  removeKey(publickey) {
    for (let x = this.keys.length-1; x >= 0; x--) {
      if (this.keys[x].publickey == publickey) {
        this.keys.splice(x, 1);
  ***REMOVED***
***REMOVED***
  ***REMOVED***


  removeKeywordByIdentifierAndKeyword(identifier, tag) {
    for (let x = this.keys.length-1; x >= 0; x--) {
      if (this.keys[x].isIdentifier(identifier) && this.keys[x].isTagged(tag)) {
        this.removeKey(this.keys[x].publickey);
        return;
  ***REMOVED***
***REMOVED***
  ***REMOVED***


  returnKeys() {
    var kx = [];
    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].lc == 1 && this.keys[x].publickey != this.app.wallet.returnPublicKey()) { kx[kx.length] = this.keys[x]; ***REMOVED***
***REMOVED***
    return kx;
  ***REMOVED***


  returnKeychainByTag(tag) {
    var kx = [];
    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].isTagged(tag)) { kx[kx.length] = this.keys[x]; ***REMOVED***
***REMOVED***
    return kx;
  ***REMOVED***


  fetchIdentifier(publickey="", mycallback) {

    let identifier = "";
    if (publickey == "") { mycallback(identifier); ***REMOVED***

    identifier = this.returnIdentifierByPublicKey(publickey);
    if (identifier != "") { mycallback(identifier); ***REMOVED***

    //
    // if no result, fetch from server (modtemplate)
    //
    this.modtemplate.sendPeerDatabaseRequest("registry", "records", "*", "", null, function(res) {
      let rows = [];
      if (res.rows == undefined) { mycallback(rows); ***REMOVED***
      for (let i = 0; i < res.rows.length; i++) {
        rows[i] = JSON.parse(res.rows[i]);
  ***REMOVED***
      mycallback(rows);
***REMOVED***)

  ***REMOVED***

  fetchPublicKey(identifier="") {

    let publickey = "";
    if (identifier=="") { mycallback(publickey); ***REMOVED***

    publickey = this.returnPublicKeyByIdentifier(identifier);
    if (publickey != "") { mycallback(publickey); ***REMOVED***

    //
    // if no result, fetch from server (modtemplate)
    //
    this.modtemplate.sendPeerDatabaseRequest("registry", "records", "*", "", null, function(res) {
      let rows = [];
      if (res.rows == undefined) { mycallback(rows); ***REMOVED***
      for (let i = 0; i < res.rows.length; i++) {
        rows[i] = JSON.parse(res.rows[i]);
  ***REMOVED***
      mycallback(rows);
***REMOVED***)

  ***REMOVED***


  returnPublicKeyByIdentifier(identifier) {
    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].lc == 1 && this.keys[x].isIdentifier(identifier)) { return this.keys[x].publickey; ***REMOVED***
***REMOVED***
    return "";
  ***REMOVED***


  returnIdentifierByPublicKey(publickey) {
    if (this.keys != undefined) {
      for (let x = 0; x < this.keys.length; x++) {
        if (this.keys[x].publickey === publickey) {
  	  if (this.keys[x].identifiers != undefined && this.keys[x].lc == 1) {
            if (this.keys[x].identifiers.length > 0) {
              return this.keys[x].identifiers[0]; 
        ***REMOVED***
	  ***REMOVED***
    ***REMOVED***
  ***REMOVED***
***REMOVED***
    return "";
  ***REMOVED***


  returnWatchedPublicKeys() {
    var x = [];
    for (let i = 0; i < this.keys.length; i++) {
      if (this.keys[i].isWatched() && this.keys[i].lc == 1) {
        x.push(this.keys[i].publickey);
  ***REMOVED***
***REMOVED***
    return x;
  ***REMOVED***


  addWatchedPublicKey(publickey="") {
    this.addKey(publickey, "", true);
    alert("FUNCTIONALITY NOT IMPLEMENTED -- addWatchedPublicKey");
    console.log("FUNCTIONALITY NOT IMPLEMENTED -- addWatchedPublicKey");
    process.exit(1);
    //this.app.network.updatePeersWithWatchedPublicKeys();
  ***REMOVED***



  updateCryptoByPublicKey(publickey, aes_publickey = "", aes_privatekey = "", shared_secret = "") {

    if (publickey == "") { return; ***REMOVED***

    this.addKey(publickey);

    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].publickey == publickey && this.keys[x].lc == 1) {
        this.keys[x].aes_publickey  = aes_publickey;
        this.keys[x].aes_privatekey = aes_privatekey;
        this.keys[x].aes_secret     = shared_secret;
  ***REMOVED***
***REMOVED***

    this.saveKeys();

    return true;
  ***REMOVED***



  alreadyHaveSharedSecret(publickey) {

    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].publickey == publickey && this.keys[x].lc == 1) {
        if (this.keys[x].aes_secret != "") {
          return true;
    ***REMOVED***
  ***REMOVED***
***REMOVED***

    return false;

  ***REMOVED***


  clean() {
    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].isWatched() == false) {
        if (this.keys[x].aes_secret != "") {
  	  console.log("purging key records: " + this.keys[x].publickey + " " + JSON.stringify(this.keys[x].identifiers));
          this.keys.splice(x, 1);
	  x--;
    ***REMOVED***
  ***REMOVED***
***REMOVED***
  ***REMOVED***

***REMOVED***

module.exports = Keychain;

