const saito = require('./saito');

class Keychain {


  constructor(app) {

    if (!(this instanceof Keychain)) {
      return new Keychain(app);
    }

    this.app         = app || {};
    this.keys        = [];

    return this;

  }



  initialize() {

    if (this.app.options.keys == null) { this.app.options.keys = {}; }

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
      }
      for (let m = 0; m < tk.tags.length; m++) {
        k.tags[m] = tk.tags[m];
      }
      this.keys.push(k);
    }
  }


  addKey(publickey, identifier = "", watched = false, tag = "") {

    if (publickey == "") { return; }
    publickey = publickey.trim();

    let tmpkey = this.findByPublicKey(publickey);
    if (tmpkey == null) {
      tmpkey                = new saito.key();
      tmpkey.publickey      = publickey;
      tmpkey.watched        = watched;
      if (identifier != "") { tmpkey.addIdentifier(identifier); }
      if (tag != "")        { tmpkey.addTag(tag); }
      this.keys.push(tmpkey);
    } else {
      if (identifier != "") { tmpkey.addIdentifier(identifier); }
      if (tag != "")        { tmpkey.addTag(tag); }
      if (watched)          { tmpkey.watched = true; }
    }
    this.saveKeys();

  }


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
            }
          }
        }
      }
    }
 
    // or return original
    return encrypted_msg;
  }


  decryptString(publickey, encrypted_string) {

    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].publickey == publickey) {
        if (this.keys[x].aes_secret != "") {
          let tmpmsg = this.app.crypto.aesDecrypt(encrypted_string, this.keys[x].aes_secret);
          return tmpmsg;
        }
      }
    }

    return encrypted_string;
  }


  encryptMessage(publickey, msg) {
    let jsonmsg = JSON.stringify(msg);
    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].publickey == publickey) {
        if (this.keys[x].aes_secret != "") {
          return this.app.crypto.aesEncrypt(jsonmsg, this.keys[x].aes_secret);
        }
      }
    }
    return msg;
  }


  findByPublicKey(publickey) {
    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].publickey == publickey) { return this.keys[x]; }
    }
    return null;
  }


  findByIdentifier(identifier) {
    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].isIdentifier(identifier) == 1) { return this.keys[x]; }
    }
    return null;
  }


  hasSharedSecret(publickey) {
    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].publickey == publickey || this.keys[x].isIdentifier(publickey) == 1) {
        if (this.keys[x].hasSharedSecret() == 1) {
          return true;
        }
      }
    }
    return false;
  }


  isWatched(publickey) {
    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].publickey == publickey || this.keys[x].isIdentifier(publickey)) {
        if (this.keys[x].isWatched()) {
          return true;
        }
      }
    }
    return false;
  }


  initializeKeyExchange(publickey) {

    var alice            = this.app.crypto.createDiffieHellman();
    var alice_publickey  = alice.getPublicKey(null, "compressed").toString("hex");
    var alice_privatekey = alice.getPrivateKey(null, "compressed").toString("hex");
    this.updateCryptoByPublicKey(publickey, alice_publickey, alice_privatekey, "");
    return alice_publickey;

  }


  isTagged(publickey, tag) {
    var x = this.findByPublicKey(publickey);
    if (x == null) { return false; }
    return x.isTagged(tag);
  }


  saveKeys() {
    this.app.options.keys = this.keys;
    this.app.storage.saveOptions();
  }


  removeKey(publickey) {
    for (let x = this.keys.length-1; x >= 0; x--) {
      if (this.keys[x].publickey == publickey) {
        this.keys.splice(x, 1);
      }
    }
  }


  removeKeywordByIdentifierAndKeyword(identifier, tag) {
    for (let x = this.keys.length-1; x >= 0; x--) {
      if (this.keys[x].isIdentifier(identifier) && this.keys[x].isTagged(tag)) {
        this.removeKey(this.keys[x].publickey);
        return;
      }
    }
  }


  returnKeychainByTag(tag) {
    var kx = [];
    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].isTagged(tag)) { kx[kx.length] = this.keys[x]; }
    }
    return kx;
  }


  returnPublicKeyByIdentifier(identifier) {
    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].isIdentifier(identifier)) { return this.keys[x].publickey; }
    }
    return "";
  }


  returnIdentifierByPublicKey(publickey) {
    if (this.keys != undefined) {
      for (let x = 0; x < this.keys.length; x++) {
        if (this.app.crypto.isPublicKey(publickey)) { 
  	  if (this.keys[x].identifier != undefined) {
            if (this.keys[x].identifier.length > 0) {
              return this.keys[x].identifier[0]; 
            }
	  }
        }
      }
    }
    return "";
  }


  returnWatchedPublicKeys() {
    var x = [];
    for (let i = 0; i < this.keys.length; i++) {
      if (this.keys[i].isWatched()) {
        x.push(this.keys[i].publickey);
      }
    }
    return x;
  }


  addWatchedPublicKey(publickey="") {
    this.addKey(publickey, "", true);
    alert("FUNCTIONALITY NOT IMPLEMENTED -- addWatchedPublicKey");
    console.log("FUNCTIONALITY NOT IMPLEMENTED -- addWatchedPublicKey");
    process.exit(1);
    //this.app.network.updatePeersWithWatchedPublicKeys();
  }



  updateCryptoByPublicKey(publickey, aes_publickey = "", aes_privatekey = "", shared_secret = "") {

    if (publickey == "") { return; }

    this.addKey(publickey);

    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].publickey == publickey) {
        this.keys[x].aes_publickey  = aes_publickey;
        this.keys[x].aes_privatekey = aes_privatekey;
        this.keys[x].aes_secret     = shared_secret;
      }
    }

    this.saveKeys();

    return true;
  }



  alreadyHaveSharedSecret(publickey) {

    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].publickey == publickey) {
        if (this.keys[x].aes_secret != "") {
          return true;
        }
      }
    }

    return false;

  }


  updateProxyByPublicKey(publickey, proxy_host = "", proxy_port = "", proxy_publickey = "") {

    if (publickey == "") { return; }

    this.addKey(publickey);

    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].publickey == publickey) {
        this.keys[x].proxy_host = proxy_host;
        this.keys[x].proxy_port = proxy_port;
        this.keys[x].proxy_publickey = proxy_publickey;
      }
    }

    this.saveKeys();

    return true;
  }



  returnProxyByPublicKey(publickey) {

    if (publickey == "") { return null; }

    let proxy           = {};
        proxy.host      = "";
        proxy.port      = "";
        proxy.publickey = "";

    this.addKey(publickey);

    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].publickey == publickey) {
        if (this.keys[x].proxy_host != "") { proxy.host = this.keys[x].proxy_host; }
        if (this.keys[x].proxy_port != "") { proxy.port = this.keys[x].proxy_port; }
        if (this.keys[x].proxy_publickey != "") { proxy.publickey = this.keys[x].proxy_publickey; }
      }
    }

    if (proxy.host == undefined) { return null; }
    if (proxy.publickey == undefined) { return null; }
    if (proxy.host != "" && proxy.port != "" && proxy.publickey != "") { return proxy; }
    return null;

  }


  function clean() {
    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].isWatched() == false) {
        if (this.keys[x].aes_secret != "") {
  	  console.log("purging key records: " + this.keys[x].publickey + " " + JSON.stringify(this.keys[x].identifiers));
          this.keys.splice(x, 1);
	  x--;
        }
      }
    }
  }

}

module.exports = Keychain;

