const saito = require('./saito');
const modtemplate = require('./../templates/modtemplate');
var Identicon = require('identicon.js');


class Keychain {

  constructor(app) {

    this.app         = app || {};
    this.keys        = [];
    this.groups      = [];
    this.modtemplate = new modtemplate(this.app);

  }



  initialize() {

    if (this.app.options.keys == null) { this.app.options.keys = {}; }

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

      for (let m = 0; m < tk.identifiers.length; m++) {
        k.identifiers[m] = tk.identifiers[m];
      }
      for (let m = 0; m < tk.tags.length; m++) {
        k.tags[m] = tk.tags[m];
      }
      this.keys.push(k);
    }
  }


  addKey(publickey, identifier = "", watched = false, tag = "", bid="", bsh="", lc=1) {

    if (publickey == "") { return; }
    publickey = publickey.trim();

    let tmpkey = this.findByPublicKey(publickey);
    if (tmpkey == null) {
      tmpkey                = new saito.key();
      tmpkey.publickey      = publickey;
      tmpkey.watched        = watched;
      tmpkey.bid	    = bid;
      tmpkey.bsh	    = bsh;
      tmpkey.lc		    = lc;
      if (identifier != "") { tmpkey.addIdentifier(identifier); }
      if (tag != "")        { tmpkey.addTag(tag); }
      this.keys.push(tmpkey);
    } else {
      if (bid != "" && bsh != "") {

        if (tmpkey.bsh != bsh && tmpkey.bid != bid) {

	  tmpkey                = new saito.key();
          tmpkey.publickey      = publickey;
          tmpkey.watched        = watched;
          tmpkey.bid	    	= bid;
          tmpkey.bsh	    	= bsh;
          tmpkey.lc		= lc;
          if (identifier != "") { tmpkey.addIdentifier(identifier); }
          if (tag != "")        { tmpkey.addTag(tag); }
          this.keys.push(tmpkey);

	} else {
	
          tmpkey.publickey      = publickey;
          tmpkey.watched        = watched;
          tmpkey.bid	    	= bid;
          tmpkey.bsh	    	= bsh;
          tmpkey.lc		= lc;
          if (identifier != "") { tmpkey.addIdentifier(identifier); }
          if (tag != "")        { tmpkey.addTag(tag); }

	}

      } else {
        if (identifier != "") { tmpkey.addIdentifier(identifier); }
        if (tag != "")        { tmpkey.addTag(tag); }
        if (watched)          { tmpkey.watched = true; }
      }
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



  addGroup(group_id="", members=[], name = "", watched = false, tag = "", bid="", bsh="", lc=1) {

    for (let i = 0; i < members.length++; i++) {
      this.addKey(members[i]);
    }
    if (watched == true) {
      for (let i = 0; i < this.keys.length; i++) {
	this.keys[i].watched = true; 
      }	
      this.saveKeys();
    }

    let group = {};

    for (let z = 0; z < this.groups.length; z++) {
      if (this.groups[z].id === group_id) {
	group = this.groups[z];
      }
    }

    group.id = group_id;
    group.members = members;
    group.name = name;
    if (watched == true) { 
      group.watched = true;
    }
    if (group.watched == undefined) {
      group.watched = false;
    }
    if (group.tags == undefined) { group.tags = []; }
    if (tag != "") { if (!group.tags.includes(tag)) { group.tags.push(tag); } }

    this.saveGroups();

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

  saveGrouos() {
    this.app.options.groups = this.groups;
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


  returnKeys() {
    var kx = [];
    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].lc == 1 && this.keys[x].publickey != this.app.wallet.returnPublicKey()) { kx[kx.length] = this.keys[x]; }
    }
    return kx;
  }


  returnGroups() {
    return this.groups;
  }


  returnKeychainByTag(tag) {
    var kx = [];
    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].isTagged(tag)) { kx[kx.length] = this.keys[x]; }
    }
    return kx;
  }


  returnIdenticon(publickey) {
    if (this.keys != undefined) {
      for (let x = 0; x < this.keys.length; x++) {
        if (this.keys[x].publickey === publickey) {
          if (this.keys[x].data.identicon != "" && typeof this.keys[x].data.identicon !== "undefined") {
            return this.keys[x].data.identicon;
          }
        }
      }
    }

    //
    // if we reach here, generate from publickey
    //
    let options = {
      //foreground: [247, 31, 61, 255],           // saito red
      //background: [255, 255, 255, 255],
      margin: 0.0,                              // 0% margin
      size: 420,                                // 420px square
      format: 'svg'                             // use SVG instead of PNG
    };
    let data = new Identicon(this.app.crypto.hash(publickey), options).toString();
    let img = 'data:image/svg+xml;base64,' + data;

    return img;  
  }




  fetchIdentifierPromise(publickey) {
    return new Promise((resolve, reject) => {
      this.fetchIdentifier(publickey, (answer) => {
        resolve(answer);
      });
    });
  }

  fetchManyIdentifiersPromise(publickeys) {
    return new Promise((resolve, reject) => {
      this.fetchManyIdentifiers(publickeys, (answer) => {
        resolve(answer);
      })
    });
  }



  fetchIdentifier(publickey="", mycallback) {

    let identifier = "";
    if (publickey == "") { mycallback(identifier); }

    identifier = this.returnIdentifierByPublicKey(publickey);
    if (!identifier) { mycallback(identifier); }

    //
    // if no result, fetch from server (modtemplate)
    //
    this.modtemplate.sendPeerDatabaseRequest("registry", "records", "*", "", null, function(res) {
      let rows = [];
      if (res.rows == undefined) mycallback(rows);
      rows = res.rows.map(row => JSON.parse(row));
      mycallback(rows);
    })

  }

  fetchManyIdentifiers(publickeys=[], callback) {
    let found_keys = {};
    let missing_keys = [];

    publickeys.forEach(publickey => {
      let identifier = this.returnIdentifierByPublicKey(publickey);
      if (identifier) found_keys[publickey] = identifier;
      else missing_keys.push(`'${publickey}'`);
    });

    if (missing_keys.length == 0) callback(found_keys);
    let where_statement = `publickey in (${missing_keys.join(',')})`;

    this.modtemplate.sendPeerDatabaseRequest("registry", "records", "*", where_statement, null, (res) => {
      let rows = [];
      if (res.rows == undefined) callback(rows);
      rows = res.rows.map(row => {
        let { publickey, identifier, bid, bsh, lc } = row;
        this.addKey(publickey, identifier, false, "", bid, bsh, lc);
        found_keys[publickey] = identifier;
      });
      callback(found_keys);
    });
  }

  fetchPublicKeyPromise(identifier="") {
    return new Promise((resolve, reject) => {
      this.fetchPublicKey(identifier, (answer) => {
        resolve (answer);
      });
    });
  }


  fetchPublicKey(identifier="", mycallback) {

    let publickey = "";
    if (identifier=="") { mycallback(publickey); }

    publickey = this.returnPublicKeyByIdentifier(identifier);
    if (publickey != "") { mycallback(publickey); }

    //
    // if no result, fetch from server (modtemplate)
    //
    this.modtemplate.sendPeerDatabaseRequest("registry", "records", "*", "", null, (res) => {
      let rows = [];
      if (res.rows == undefined) { mycallback(rows); }
      res.rows.forEach(row => {
        let { publickey, identifier, bid, bsh, lc } = row;
        this.addKey(publickey, identifier, false, "", bid, bsh, lc);
      })
      //
      // should only get back one row
      mycallback(res.rows[0]);
    })

  }


  returnPublicKeyByIdentifier(identifier) {
    for (let x = 0; x < this.keys.length; x++) {
      let key = this.keys[x];
      if (key.lc == 1 && key.isIdentifier(identifier)) return key.publickey;
    }
    return "";
  }


  returnIdentifierByPublicKey(publickey) {
    if (this.keys != undefined) {
      for (let x = 0; x < this.keys.length; x++) {
        let key = this.keys[x];
        if (key.publickey === publickey) {
  	  if (key.identifiers != undefined && key.lc == 1) {
            if (key.identifiers.length > 0) {
              return key.identifiers[0];
            }
	  }
        }
      }
    }
    return null;
  }


  returnWatchedPublicKeys() {
    var x = [];
    for (let i = 0; i < this.keys.length; i++) {
      if (this.keys[i].isWatched() && this.keys[i].lc == 1) {
        x.push(this.keys[i].publickey);
      }
    }
    return x;
  }


  addWatchedPublicKey(publickey="") {
    this.addKey(publickey, "", true);
    this.app.network.updatePeersWithWatchedPublicKeys();
  }



  updateCryptoByPublicKey(publickey, aes_publickey = "", aes_privatekey = "", shared_secret = "") {

    if (publickey == "") { return; }

    this.addKey(publickey);

    for (let x = 0; x < this.keys.length; x++) {
      if (this.keys[x].publickey == publickey && this.keys[x].lc == 1) {
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
      if (this.keys[x].publickey == publickey && this.keys[x].lc == 1) {
        if (this.keys[x].aes_secret != "") {
          return true;
        }
      }
    }

    return false;

  }


  clean() {
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

