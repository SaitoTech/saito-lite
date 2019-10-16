const saito = require('./saito');

class Keychain {


  constructor(app) {

    if (!(this instanceof Keychain)) {
      return new Keychain(app);
***REMOVED***

    this.app         = app || {***REMOVED***;
    this.keys        = [];

    return this;

  ***REMOVED***



  initialize() {

    if (this.app.options.keys == null) { this.app.options.keys = {***REMOVED***; ***REMOVED***

    for (let i = 0; i < this.app.options.keys.length; i++) {

      var tk               = this.app.options.keys[i];

      var k                = new saito.key();
          k.publickey      = tk.publickey;
          k.watched        = tk.watched;
          k.aes_publickey  = tk.aes_publickey;
          k.aes_privatekey = tk.aes_privatekey;
          k.aes_secret     = tk.aes_secret;
          k.proxymod_host      = tk.proxymod_host;
          k.proxymod_port      = tk.proxymod_port;
          k.proxymod_publickey = tk.proxymod_publickey;
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


  addKey(publickey, identifier = "", watched = false, tag = "") {

    if (publickey == "") { return; ***REMOVED***
    publickey = publickey.trim();

    let tmpkey = this.findByPublicKey(publickey);
    if (tmpkey == null) {
      tmpkey                = new saito.key();
      tmpkey.publickey      = publickey;
      tmpkey.watched        = watched;
      if (identifier != "") { tmpkey.addIdentifier(identifier); ***REMOVED***
      if (tag != "")        { tmpkey.addTag(tag); ***REMOVED***
      this.keys.push(tmpkey);
***REMOVED*** else {
      if (identifier != "") { tmpkey.addIdentifier(identifier); ***REMOVED***
      if (tag != "")        { tmpkey.addTag(tag); ***REMOVED***
      if (watched)          { tmpkey.watched = true; ***REMOVED***
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


  returnKeychainByTag(tag) {
    var kx = [];
    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].isTagged(tag)) { kx[kx.length] = this.keys[x]; ***REMOVED***
***REMOVED***
    return kx;
  ***REMOVED***


  returnKeychain() {
    return this.keys;
  ***REMOVED***


  returnPublicKeyByIdentifier(identifier) {
    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].isIdentifier(identifier)) { return this.keys[x].publickey; ***REMOVED***
***REMOVED***
    return "";
  ***REMOVED***


  Keychain.prototype.returnIdentifierByPublicKey = function returnIdentifierByPublicKey(publickey) {
    if (this.keys != undefined) {
      for (let x = 0; x < this.keys.length; x++) {
        if (this.app.crypto.isPublicKey(publickey)) { 
  	  if (this.keys[x].identifier != undefined) {
            if (this.keys[x].identifier.length > 0) {
              return this.keys[x].identifier[0]; 
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
      if (this.keys[i].isWatched()) {
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
      if (this.keys[x].publickey == publickey) {
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
      if (this.keys[x].publickey == publickey) {
        if (this.keys[x].aes_secret != "") {
          return true;
    ***REMOVED***
  ***REMOVED***
***REMOVED***

    return false;

  ***REMOVED***


  updateProxyByPublicKey(publickey, proxy_host = "", proxy_port = "", proxy_publickey = "") {

    if (publickey == "") { return; ***REMOVED***

    this.addKey(publickey);

    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].publickey == publickey) {
        this.keys[x].proxy_host = proxy_host;
        this.keys[x].proxy_port = proxy_port;
        this.keys[x].proxy_publickey = proxy_publickey;
  ***REMOVED***
***REMOVED***

    this.saveKeys();

    return true;
  ***REMOVED***



  returnProxyByPublicKey(publickey) {

    if (publickey == "") { return null; ***REMOVED***

    let proxy           = {***REMOVED***;
        proxy.host      = "";
        proxy.port      = "";
        proxy.publickey = "";

    this.addKey(publickey);

    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].publickey == publickey) {
        if (this.keys[x].proxy_host != "") { proxy.host = this.keys[x].proxy_host; ***REMOVED***
        if (this.keys[x].proxy_port != "") { proxy.port = this.keys[x].proxy_port; ***REMOVED***
        if (this.keys[x].proxy_publickey != "") { proxy.publickey = this.keys[x].proxy_publickey; ***REMOVED***
  ***REMOVED***
***REMOVED***

    if (proxy.host == undefined) { return null; ***REMOVED***
    if (proxy.publickey == undefined) { return null; ***REMOVED***
    if (proxy.host != "" && proxy.port != "" && proxy.publickey != "") { return proxy; ***REMOVED***
    return null;

  ***REMOVED***


  function clean() {
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

