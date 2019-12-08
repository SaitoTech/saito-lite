const path        = require('path');
const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');

const RegistryModal = require('./lib/modal/registry-modal');


class Registry extends ModTemplate {

  constructor(app) {

    super(app);

    this.app            = app;
    this.name           = "Registry";

    //
    // master DNS publickey for this module
    //
    this.publickey = '23ykRYbjvAzHLRaTYPcqjkQ2LnFYeMkg9cJgXPbrWcHmr'

    return this;
  }



/*******
  respondTo(type) {
    if (type == 'email-appspace') {
      let obj = {};
          obj.render = this.renderEmail;
          obj.attachEvents = this.attachEventsEmail;
      return obj;
    }
    return null;
  }
  renderEmail(app, data) {
     data.registry = app.modules.returnModule("Registry");
     let RegistryAppspace = require('./lib/email-appspace/registry-appspace');
     RegistryAppspace.render(app, data);
  }
  attachEventsEmail(app, data) {
     data.registry = app.modules.returnModule("Registry");
     RegistryAppspace.attachEvents(app, data);
  }
*******/

  showModal() {
    RegistryModal.render(this.app, this);
    RegistryModal.attachEvents(this.app, this);
  }

  registerIdentifier(identifier, domain="@saito") {

    let newtx = this.app.wallet.createUnsignedTransaction(this.publickey, this.app.wallet.wallet.default_fee, this.app.wallet.wallet.default_fee);
    if (newtx == null) {
      console.log("NULL TX CREATED IN REGISTRY MODULE")
      return;
    }

    if (typeof identifier === 'string' || identifier instanceof String) {
      var regex=/^[0-9A-Za-z]+$/;
      if (!regex.test(identifier)) { salert("Alphanumeric Characters only"); return false; }

      newtx.transaction.msg.module   	= "Registry";
      newtx.transaction.msg.request	= "register";
      newtx.transaction.msg.identifier	= identifier + domain;

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
        if (tx.isTo(registry_self.publickey) && app.wallet.returnPublicKey() == registry_self.publickey) {

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

	    let newtx = registry_self.app.wallet.createUnsignedTransaction(tx.transaction.from[0].add, 50.0, fee);
		newtx.transaction.msg.module = "Email";
		newtx.transaction.msg.title  = "Address Registration Success!";
	    	newtx.transaction.msg.message = "You have successfully registered the identifier: " + identifier;
                newtx.transaction.msg.identifier = identifier;
                newtx.transaction.msg.signed_message = signed_message;
                newtx.transaction.msg.sig = sig;

	    newtx = registry_self.app.wallet.signTransaction(newtx);
	    registry_self.app.network.propagateTransaction(newtx);

	  } else {

            let newtx = registry_self.app.wallet.createUnsignedTransaction(tx.transaction.from[0].add, 0.0, fee);
                newtx.transaction.msg.module = "Email";
                newtx.transaction.msg.title  = "Address Registration Failed!";
                newtx.transaction.msg.message = "The identifier you requested (" + identifier + ") has already been registered";
                newtx.transaction.msg.identifier = identifier;
                newtx.transaction.msg.signed_message = "";
                newtx.transaction.msg.sig = "";

            newtx = registry_self.app.wallet.signTransaction(newtx);
            registry_self.app.network.propagateTransaction(newtx);

	  }

          return;

        }
      }



      //
      //
      //
      if (txmsg.module == "Email") {
	if (tx.transaction.from[0].add == registry_self.publickey) {
	  if (tx.transaction.to[0].add == registry_self.app.wallet.returnPublicKey()) {
	    if (tx.transaction.msg.identifier != undefined && tx.transaction.msg.signed_message != undefined && tx.transaction.msg.sig != undefined) {

	      //
	      // am email? for us? from the DNS registrar?
	      //
	      let identifier 	 = tx.transaction.msg.identifier;
	      let signed_message = tx.transaction.msg.signed_message;
	      let sig		 = tx.transaction.msg.sig;

	      if (registry_self.app.crypto.verifyMessage(signed_message, sig, registry_self.publickey)) {
	        registry_self.app.keys.addKey(tx.transaction.to[0].add, identifier, true, "", blk.block.id, blk.returnHash(), 1);
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
console.log("ROWS: " + rows.length);
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

    newtx.transaction.msg.module   = "Email";
    newtx.transaction.msg.data     = "You have successfully registered your address";
    newtx.transaction.msg.title    = "Address Registration Success!";

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

    newtx.transaction.msg.module   = "Email";
    newtx.transaction.msg.data     = "You have successfully registered your address";
    newtx.transaction.msg.title    = "Address Registration Success!";

    newtx = this.app.wallet.signTransaction(tx);
    this.app.network.propagateTransaction(newtx); 

  }




}
module.exports = Registry;


