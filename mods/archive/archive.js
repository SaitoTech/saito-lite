const saito = require('../../lib/saito/saito.js');
const ModTemplate = require('../../lib/templates/modtemplate');


class Archive extends ModTemplate {

  constructor(app) {

    super(app);
    this.name = "Archive";
    this.events = [];

  ***REMOVED***


  async installModule(app) {

    await super.installModule(app);

let tx = app.wallet.createUnsignedTransaction();
    tx.transaction.msg.module = "Email";
    tx.transaction.msg.title = "This is our title";
    tx.transaction.msg.message = "This is the substance of our email";
    tx = app.wallet.signTransaction(tx);

    let sql = "INSERT INTO records (sig, publickey, tx, ts, type) VALUES ($sig, $publickey, $tx, $ts, $msgtype)";
console.log("\n\n\n\n\n"+sql);
    let params = {
      $sig		:	tx.transaction.sig ,
      $publickey	:	tx.transaction.to[0].add ,  
      $tx		:	JSON.stringify(tx.transaction) ,
      $ts		:	tx.transaction.ts ,
      $msgtype		:	tx.transaction.msg.module 
***REMOVED***
    await app.storage.executeDatabase(sql, params, "archive");

  ***REMOVED***




  async handlePeerRequest(app, req, peer, mycallback) {

    if (req.request == null) { return; ***REMOVED***
    if (req.data == null) { return; ***REMOVED***

    //
    // only handle archive request
    //
    if (req.request == "archive") {

      switch(req.data.request) {

        case "delete":
          this.deleteTransaction(req.data.tx);
          break;

        case "save":
          this.saveTransaction(req.data.tx);
          break;

        case "load":
          console.log("WE RECEIVED A REQUEST TO LOAD A TRANSACTION");

          let type = "";
          let num  = 50;

          if (req.data.num != "")  { num = req.data.num; ***REMOVED***
          if (req.data.type != "") { num = req.data.type; ***REMOVED***

          let txs = await this.loadTransactions(type, num);

          console.log("AND WE FOUND THESE TRANSACTIONS: " + JSON.stringify(txs));

          let response = {***REMOVED***;
              response.err = "";
              response.txs = txs;

          console.log("RETURNING: " + JSON.stringify(response));

	        mycallback(response);

        default:
          break;
  ***REMOVED***
***REMOVED***
  ***REMOVED***



  async saveTransaction(tx=null) {

    if (tx == null) { return; ***REMOVED***

    //
    // TODO - transactions "TO" multiple ppl this means redundant sigs and txs but with unique publickeys
    //
    let msgtype = "";
    if (tx.transaction.msg.module != "") { type = tx.transaction.msg.module; ***REMOVED***

    let sql = "INSERT INTO records (sig, publickey, tx, ts, type) VALUES ($sig, $publickey, $tx, $ts, $type)";
    let params = {
      $sig		:	tx.transaction.sig ,
      $publickey	:	tx.transaction.to[0].add,
      $tx		:	JSON.stringify(tx.transaction.sig) ,
      $ts		:	tx.transaction.tx ,
      $type		:	msgtype
***REMOVED***;
    this.app.storage.executeDatabase(sql, params, "archives");

  ***REMOVED***



  async deleteTransaction(tx=null) {

    if (tx == null) { return; ***REMOVED***

    //
    // TODO - transactions "TO" multiple ppl this means redundant sigs and txs but with unique publickeys
    //
    let msgtype = "";
    if (tx.transaction.msg.module != "") { type = tx.transaction.msg.module; ***REMOVED***

    let sql = "DELETE FROM records WHERE publickey = $publickey AND sig = $sig";
    let params = {
      $sig		:	tx.transaction.sig ,
      $publickey	:	tx.transaction.to[0].add,
***REMOVED***;
    this.app.storage.executeDatabase(sql, params, "archives");

  ***REMOVED***


  async loadTransactions(type, num) {

    let sql = "SELECT * FROM records";
    let params = {***REMOVED***;

    let rows = await this.app.storage.queryDatabase(sql, params, "archive");

    console.log("\n WE HAVE LOADED THE FOLLOWING ROWS FROM DB FOR RETURN TO CLIENT: " + JSON.stringify(rows));

    let txs = [];
    for (let i = 0; i < rows.length; i++) {
      txs.push(rows[i].tx);
***REMOVED***

console.log("\n\n\nRETURNING: ");
    return txs;

  ***REMOVED***

***REMOVED***


module.exports = Archive;

