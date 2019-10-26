const path        = require('path');
const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');



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





  register_identifier(identifier) {

    let newtx = this.app.wallet.createUnsignedTransaction(this.publickey, this.app.wallet.wallet.default_fee, this.app.wallet.wallet.default_fee);
    if (newtx == null) {
      console.log("NULL TX CREATED IN REGISTRY MODULE")
      return;
    }

    newtx.transaction.msg.module   	= "Registry";
    newtx.transaction.msg.request	= "register";
    newtx.transaction.msg.identifier	= identifier;

    newtx = this.app.wallet.signTransaction(newtx);
    this.app.network.propagateTransaction(newtx); 

  }



  async onConfirmation(blk, tx, conf, app) {

    let registry_self = app.modules.returnModule("Registry");
    let txmsg = tx.returnMessage();

    if (txmsg.module === "Registry") {
      if (tx.isTo(registry_self.publickey)) {

        let request = txmsg.request;
        let identifier = txmsg.identifier;
        let publickey = tx.transaction.from[0].add;
	let unixtime = new Date().getTime();
        let bid = blk.block.id;
        let bsh = blk.returnHash();
  	let lock_block = 0;
	let sig = "";
	let signer = this.publickey;
	let lc = 1;

        // servers update database
        registry_self.addRecord(identifier, publickey, unixtime, bid, bsh, lock_block, sig, signer, 1);
        return;

      }
    }
  }


  async addRecord(identifier="", publickey="", unixtime=0, bid=0, bsh="", lock_block=0, sig="", signer="", lc=1) {

    let sql = `INSERT INTO TABLE records (
	identifier, 
	publickey, 
	unixtime, 
	bid, 
	bsh, 
	lock_block, 
	sig, signer, 
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
        identifier	:	identifier ,
        publickey	:	publickey ,
        unixtime	:	unixtime ,
        bid		:	bid ,
        bsh		:	bsh ,
        lock_block	:	lock_block ,
        sig		:	sig,
        signer		:	signer,
        lc		:	lc,
      }
    await this.app.storage.executeDatabase(sql, params, "registry");

    sql = "SELECT FROM records WHERE identifier = $identifier, publickey = $publickey, unixtime = $unixtime, bid = $bid, bsh = $bsh, lock_block = $lock_block, sig = $sig, signer = $signer, lc = $lc";
    let rows = this.app.storage.queryDatabase(sql, params, "registry");

    console.log("\n\n\nRESULTS OF DNS REGISTRATION: " + JSON.stringify(rows));

    return 1;

  }




  async onChainReorganization(bid, bsh, lc) {

    var sql    = "UPDATE records SET lc = $lc WHERE bid = $bid AND bsh = $bsh";
    var params = { $bid : bid , $bsh : bsh }
    await this.app.storage.executeDatabase(sql, params, "registry");

    return;

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


