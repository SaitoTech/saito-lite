const path        = require('path');
const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');

const RegistryModal = require('./lib/modal/registry-modal');


class Registry extends ModTemplate {

  constructor(app) {

    super(app);

    this.app            = app;
    this.name           = "Registry";
    this.description    = "Adds support for the Saito DNS system, so that users can register user-generated names. Runs DNS server on core nodes.";
    this.categories     = "Core Utilities Messaging";

    //
    // master DNS publickey for this module
    //
    this.publickey = 'zYCCXRZt2DyPD9UmxRfwFgLTNAqCd5VE8RuNneg4aNMK';

    return this;
  }


  returnServices() {
    let services = [];
    services.push({ service : "registry" , domain : "saito" });
    return services;
  }
  
  respondTo(type = "") {
    if (type == "do-registry-prompt") {        
      return {
        doRegistryPrompt: async() => {
          var requested_id = await sprompt("Pick a handle or nickname. <br /><sub>Alphanumeric characters only - Do not include an @</sub.>");
          try {
            let success = this.tryRegisterIdentifier(requested_id);
            if (success) {
              return requested_id;
            } else {
              throw "Unknown error";
            }
          } catch(err){
            if(err.message == "Alphanumeric Characters only") {
              salert("Alphanumeric Characters only"); 
            } else {
              throw err;
            }
          }
        }
      }
    }
    return null;
  }


  showModal() {
    RegistryModal.render(this.app, this);
    RegistryModal.attachEvents(this.app, this);
  }

  tryRegisterIdentifier(identifier, domain="@saito") {
    
      let newtx = this.app.wallet.createUnsignedTransaction(this.publickey, this.app.wallet.wallet.default_fee, this.app.wallet.wallet.default_fee);
      if (newtx == null) {
        console.log("NULL TX CREATED IN REGISTRY MODULE")
        throw Error("NULL TX CREATED IN REGISTRY MODULE");
      }

      if (typeof identifier === 'string' || identifier instanceof String) {
        var regex=/^[0-9A-Za-z]+$/;
        if (!regex.test(identifier)) {
          throw Error("Alphanumeric Characters only");
        }

        newtx.msg.module   	= "Registry";
        //newtx.msg.request	= "register";
        newtx.msg.identifier	= identifier + domain;

        newtx = this.app.wallet.signTransaction(newtx);
        this.app.network.propagateTransaction(newtx);

        // sucessful send
        return true;
      } else {
        throw TypeError("identifier must be a string");
      }

    
  }

  // DEPRECATED, USE tryRegisterIdentifier()
  registerIdentifier(identifier, domain="@saito") {

    let newtx = this.app.wallet.createUnsignedTransaction(this.publickey, this.app.wallet.wallet.default_fee, this.app.wallet.wallet.default_fee);
    if (newtx == null) {
      console.log("NULL TX CREATED IN REGISTRY MODULE")
      return;
    }

    if (typeof identifier === 'string' || identifier instanceof String) {
      var regex=/^[0-9A-Za-z]+$/;
      if (!regex.test(identifier)) { salert("Alphanumeric Characters only"); return false; }

      newtx.msg.module   	= "Registry";
      //newtx.msg.request	= "register";
      newtx.msg.identifier	= identifier + domain;

      newtx = this.app.wallet.signTransaction(newtx);
      this.app.network.propagateTransaction(newtx);

      // sucessful send
      return true;
    }

  }


  onPeerHandshakeComplete(app, peer) {

    let registry_self = app.modules.returnModule("Registry");

    if (registry_self.app.options.server != undefined) {
      registry_self.publickey = registry_self.app.wallet.returnPublicKey();
    } else {
      registry_self.publickey = peer.peer.publickey;
    }

  }


  async onConfirmation(blk, tx, conf, app) {

    let registry_self = app.modules.returnModule("Registry");
    let txmsg = tx.returnMessage();

    if (conf == 0) {
      if (txmsg.module === "Registry") {

	//
	// this is to us, and we are the main registry server
	//
        if (tx.isTo(registry_self.publickey) && app.wallet.returnPublicKey() === registry_self.publickey) {

console.log(registry_self.publickey + " -- " + app.wallet.returnPublicKey());

          let request = txmsg.request;
          let identifier = txmsg.identifier;
          let publickey = tx.transaction.from[0].add;
          let unixtime = new Date().getTime();
          let bid = blk.block.id;
          let bsh = blk.returnHash();
          let lock_block = 0;
          let signed_message = identifier + publickey + bid + bsh;
          let sig = registry_self.app.wallet.signMessage(signed_message);
          let signer = this.publickey;
          let lc = 1;

          // servers update database
          let res = await registry_self.addRecord(identifier, publickey, unixtime, bid, bsh, lock_block, sig, signer, 1);
          let fee = tx.returnPaymentTo(registry_self.publickey);

          // send message
          if (res == 1) {

            let newtx = registry_self.app.wallet.createUnsignedTransaction(tx.transaction.from[0].add, 0, fee);
                newtx.msg.module = "Email";
                newtx.msg.origin = "Registry";
                newtx.msg.title  = "Address Registration Success!";
                newtx.msg.message = "<p>You have successfully registered the identifier: <span class='boldred'>" + identifier + "</span></p>";
                newtx.msg.identifier = identifier;
                newtx.msg.signed_message = signed_message;
                newtx.msg.sig = sig;

            newtx = registry_self.app.wallet.signTransaction(newtx);
            registry_self.app.network.propagateTransaction(newtx);

          } else {

            let newtx = registry_self.app.wallet.createUnsignedTransaction(tx.transaction.from[0].add, 0.0, fee);
                newtx.msg.module = "Email";
                newtx.msg.title  = "Address Registration Failed!";
                newtx.msg.message = "<p>The identifier you requested (<span class='boldred'>" + identifier + "</span>) has already been registered.</p>";
                newtx.msg.identifier = identifier;
                newtx.msg.signed_message = "";
                newtx.msg.sig = "";

            newtx = registry_self.app.wallet.signTransaction(newtx);
            registry_self.app.network.propagateTransaction(newtx);

          }

          return;

        }
      }


      if (txmsg.module == "Email") {
        if (tx.transaction.from[0].add == registry_self.publickey) {
          if (tx.transaction.to[0].add == registry_self.app.wallet.returnPublicKey()) {
            if (tx.msg.identifier != undefined && tx.msg.signed_message != undefined && tx.msg.sig != undefined) {

              //
              // am email? for us? from the DNS registrar?
              //
              let identifier 	 = tx.msg.identifier;
              let signed_message = tx.msg.signed_message;
              let sig		 = tx.msg.sig;

	      try {
console.log("a");
                if (registry_self.app.crypto.verifyMessage(signed_message, sig, registry_self.publickey)) {
console.log("b");
                  registry_self.app.keys.addKey(tx.transaction.to[0].add, identifier, true, "", blk.block.id, blk.returnHash(), 1);
console.log("c");
                }
  	      } catch (err) {
		console.log("ERROR verifying username registration message: " + err);
	      }
            }
          }
        }
      }
    }
  }


  async addRecord(identifier="", publickey="", unixtime=0, bid=0, bsh="", lock_block=0, sig="", signer="", lc=1) {

    let sql = `INSERT INTO records (
        identifier, 
        publickey, 
        unixtime, 
        bid, 
        bsh, 
        lock_block, 
        sig,
        signer, 
        lc
      ) VALUES (
        $identifier, 
        $publickey,
        $unixtime, 
        $bid, 
        $bsh, 
        $lock_block, 
        $sig, 
        $signer, 
        $lc
      )`;
    let params = {
        $identifier	:	identifier ,
        $publickey	:	publickey ,
        $unixtime	:	unixtime ,
        $bid		:	bid ,
        $bsh		:	bsh ,
        $lock_block	:	lock_block ,
        $sig		:	sig,
        $signer		:	signer,
        $lc		:	lc,
      }
    await this.app.storage.executeDatabase(sql, params, "registry");

    sql = "SELECT * FROM records WHERE identifier = $identifier AND publickey = $publickey AND unixtime = $unixtime AND bid = $bid AND bsh = $bsh AND lock_block = $lock_block AND sig = $sig AND signer = $signer AND lc = $lc";
    let rows = await this.app.storage.queryDatabase(sql, params, "registry");
console.log(sql);
console.log(params);
console.log("\n\n\nRES: " + JSON.stringify(rows));
// console.log("ROWS: " + rows.length);
    if (rows.length == 0) {
      return 0;
    } else {
      return 1;
    }

  }




  async onChainReorganization(bid, bsh, lc) {

    var sql    = "UPDATE records SET lc = $lc WHERE bid = $bid AND bsh = $bsh";
    var params = { $bid : bid , $bsh : bsh }
    await this.app.storage.executeDatabase(sql, params, "registry");

    return;

  }



  shouldAffixCallbackToModule(modname) {
    if (modname == this.name) { return 1; }
    if (modname == "Email") { return 1; }
    return 0;
  }



  sendSuccessResponse(tx) {

    let fee = tx.returnPaymentTo(this.app.wallet.returnPublicKey());

    let  newtx = registry_self.app.wallet.createUnsignedTransaction(to, 0.0, fee);
    if (newtx == null) {
      console.log("NULL TX CREATED IN REGISTRY MODULE")
      return;
    }

    newtx.msg.module   = "Email";
    newtx.msg.data     = "You have successfully registered your address";
    newtx.msg.title    = "Address Registration Success!";

    newtx = this.app.wallet.signTransaction(tx);
    this.app.network.propagateTransaction(newtx); 

  }




  sendFailureResponse(tx) {

    let fee = tx.returnPaymentTo(this.app.wallet.returnPublicKey());

    let  newtx = registry_self.app.wallet.createUnsignedTransaction(to, 0.0, fee);
    if (newtx == null) {
      console.log("NULL TX CREATED IN REGISTRY MODULE")
      return;
    }

    newtx.msg.module   = "Email";
    newtx.msg.data     = "You have successfully registered your address";
    newtx.msg.title    = "Address Registration Success!";

    newtx = this.app.wallet.signTransaction(tx);
    this.app.network.propagateTransaction(newtx); 

  }




}
module.exports = Registry;


