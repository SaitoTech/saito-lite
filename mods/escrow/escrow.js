***REMOVED***
const ModTemplate = require('../../lib/templates/modtemplate');
const EscrowAppspace = require('./lib/email-appspace/escrow-appspace');
const ArcadeEscrowSidebar = require('./lib/arcade-sidebar/escrow-sidebar');

class Escrow extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "Escrow";
    this.publickey      = app.wallet.returnPublicKey();

    this.escrow         = {***REMOVED***;
    this.escrow.address	= "";
    this.escrow.balance	= 0.0;
    this.escrow.create_pending = 0;

    return this;
  ***REMOVED***


  initialize(app) {
    super.initialize(app);
    if (app.options.escrow != undefined) {
      this.escrow.address = app.options.escrow.address;
      this.escrow.balance = app.options.escrow.balance;
      this.escrow.create_pending = app.options.escrow.create_pending;
***REMOVED***
  ***REMOVED***



  registerAccount() {

    let newtx = this.app.wallet.createUnsignedTransactionWithDefaultFee(this.app.wallet.returnPublicKey());
    if (newtx == null) {
      console.log("NULL TX CREATED IN REGISTRY MODULE")
      return 0;
***REMOVED***
    newtx.transaction.msg.module        = this.name;
    newtx.transaction.msg.request       = "register account";
    newtx = this.app.wallet.signTransaction(newtx);
    this.app.network.propagateTransaction(newtx);

    return 1;

  ***REMOVED***



  respondTo(type) {
    if (type == 'email-appspace') {
      let obj = {***REMOVED***;
	  obj.render = this.renderEmail;
	  obj.attachEvents = this.attachEventsEmail;
      return obj;
***REMOVED***
    if (type == 'arcade-sidebar') {
      let obj = {***REMOVED***;
	  obj.render = this.renderArcadeSidebar;
	  obj.attachEvents = this.attachEventsArcadeSidebar;
      return obj;
***REMOVED***
    return null;
  ***REMOVED***
  renderEmail(app, data) {
     data.escrow = app.modules.returnModule("Escrow");;
     EscrowAppspace.render(app, data);
  ***REMOVED***
  attachEventsEmail(app, data) {
     data.escrow = app.modules.returnModule("Escrow");;
     EscrowAppspace.attachEvents(app, data);
  ***REMOVED***
  renderArcadeSidebar(app, data) {
     data.escrow = app.modules.returnModule("Escrow");;
     ArcadeEscrowSidebar.render(app, data);
  ***REMOVED***
  attachEventsArcadeSidebar(app, data) {
     data.escrow = app.modules.returnModule("Escrow");;
     ArcadeEscrowSidebar.attachEvents(app, data);
  ***REMOVED***




  saveEscrow() {
    this.app.options.escrow = Object.assign({***REMOVED***, this.app.options.escrow);
    this.app.options.escrow = this.escrow;
    this.app.storage.saveOptions();
  ***REMOVED***


  returnCryptoBalances(mycallback) {
    mycallback(['balances']);
  ***REMOVED***

  returnAccountHistory(mycallback) {
    mycallback(['history']);
  ***REMOVED***




  async onConfirmation(blk, tx, conf, app) {

    let escrow_self = app.modules.returnModule("Escrow");
    let txmsg = tx.returnMessage();

    if (conf == 0) {
      if (txmsg.module == escrow_self.name) {

	//if (tx.isFrom(escrow_self.publickey) && tx.isTo(app.wallet.returnPublicKey())) {
	if (tx.transaction.to[0].add == app.wallet.returnPublicKey()) {
	  if (txmsg.request === "account balance") {

	    escrow_self.escrow.address = txmsg.address;
	    escrow_self.escrow.balance = txmsg.balance;
	    escrow_self.escrow.create_pending = 0;
	    escrow_self.saveEscrow();

alert("SAVING ESCROW: " + txmsg.address);

	  ***REMOVED***
	***REMOVED***


***REMOVED***if (tx.isTo(escrow_self.publickey)) {
        if (1) {

	  if (txmsg.request === "register account") {

	    let sql = "";
	    let params = "";


	    //
	    // generate new crypto address
	    //
	    let new_crypto_privatekey = app.crypto.generateKeys();
	    let new_crypto_publickey  = app.crypto.returnPublicKey(new_crypto_privatekey);


	    //
	    // insert new users
	    //
	    sql = "INSERT INTO users (publickey) VALUES ($publickey)";
	    params = {
	        $publickey	:	tx.transaction.from[0].add
	***REMOVED***
	    await escrow_self.app.storage.executeDatabase(sql, params, "escrow");


	    //
	    // get user-id
	    //
	    sql = "SELECT id FROM users WHERE publickey = $publickey";
	    params = {
	        $publickey	:	tx.transaction.from[0].add
	***REMOVED***
	    let rows = await escrow_self.app.storage.queryDatabase(sql, params, "escrow");
console.log("ROWS: " + rows);
	    if (rows == null) { return; ***REMOVED***
	    if (rows.length <= 0) { return; ***REMOVED***
	    let user_id = rows[0].id;

console.log("INSERT KEYS INTO USERBASE: ");
	    //
	    // insert key into database
	    //
	    sql = "INSERT INTO keys (user_id, publickey, privatekey) VALUES ($user_id, $publickey, $privatekey)";
	    params = {
		$user_id	:	user_id ,
		$publickey	:	new_crypto_publickey ,
		$privatekey	:	new_crypto_privatekey
	***REMOVED***
	    await escrow_self.app.storage.executeDatabase(sql, params, "escrow");

console.log("INSERT KEYS INTO USERBASE: ");


	    //
	    // inform user of tbeir deposit address and balance
	    //
	    escrow_self.sendAccountBalance(tx.transaction.from[0].add, new_crypto_publickey, 0.0);

	  ***REMOVED***
	***REMOVED***


  ***REMOVED***
***REMOVED***
  ***REMOVED***

  

  sendAccountBalance(recipient, address="", balance=0.0) {

    let newtx = this.app.wallet.createUnsignedTransactionWithDefaultFee(recipient);
    if (newtx == null) {
      console.log("NULL TX CREATED IN REGISTRY MODULE")
      return;
***REMOVED***

    newtx.transaction.msg.module        = this.name;
    newtx.transaction.msg.request       = "account balance";
    newtx.transaction.msg.address	= address;
    newtx.transaction.msg.balance	= balance;

    newtx = this.app.wallet.signTransaction(newtx);
    this.app.network.propagateTransaction(newtx);

  ***REMOVED***


***REMOVED***


module.exports = Escrow;

