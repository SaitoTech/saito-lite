const saito = require('../../lib/saito/saito.js');
const ModTemplate = require('../../lib/templates/modtemplate');


class Archive extends ModTemplate {

  constructor(app) {

    super(app);
    this.name = "Archive";
    this.events = [];

  ***REMOVED***



  onConfirmation(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();

    //
    // by default we just save everything that is an application
    //
    if (conf == 0) {
      if (tx.transaction.msg.module != "") {
        this.saveTransaction(tx);
  ***REMOVED***
***REMOVED***
  ***REMOVED***




  async handlePeerRequest(app, req, peer, mycallback) {

    if (req.request == null) { return; ***REMOVED***
    if (req.data == null) { return; ***REMOVED***

    var txs;
    var response = {***REMOVED***;
    //
    // only handle archive request
    //
    if (req.request == "archive") {

      switch(req.data.request) {

        case "delete":
          this.deleteTransaction(req.data.tx, req.data.publickey, req.data.sig);
          break;

        case "save":
          this.saveTransaction(req.data.tx);
          break;

        case "load":

          let type = "";
          let num  = 50;
          if (req.data.num != "")  { num = req.data.num; ***REMOVED***
          if (req.data.type != "") { type = req.data.type; ***REMOVED***
          txs = await this.loadTransactions(req.data.publickey, req.data.sig, type, num);
          response.err = "";
          response.txs = txs;
          mycallback(response);
          break;

        case "load_keys":
          if (!req.data.keys) { return; ***REMOVED***
          txs = await this.loadTransactionsByKeys(req.data);

          response.err = "";
          response.txs = txs;

          mycallback(response);
          break;

        default:
          break;
  ***REMOVED***
***REMOVED***
  ***REMOVED***





  async saveTransaction(tx=null) {

    if (tx == null) { return; ***REMOVED***

    let msgtype = "";
    if (tx.transaction.msg.module != "") { msgtype = tx.transaction.msg.module; ***REMOVED***

    let sql = "";
    let params = {***REMOVED***;

    for (let i = 0; i < tx.transaction.to.length; i++) {    
      sql = "INSERT INTO txs (sig, publickey, tx, ts, type) VALUES ($sig, $publickey, $tx, $ts, $type)";
      params = {
        $sig		:	tx.transaction.sig ,
        $publickey	:	tx.transaction.to[i].add ,
        $tx		:	JSON.stringify(tx.transaction) ,
        $ts		:	tx.transaction.ts ,
        $type		:	msgtype
  ***REMOVED***;
      this.app.storage.executeDatabase(sql, params, "archive");
***REMOVED***

  ***REMOVED***



  async deleteTransaction(tx=null, authorizing_publickey="", authorizing_sig="") {

    if (tx == null) { return; ***REMOVED***

    //
    // the individual requesting deletion should sign the transaction.sig with their own
    // privatekey. this provides a sanity check on ensuring that the right message is
    // deleted
    //
    if (this.app.crypto.verifyMessage(("delete_"+tx.transaction.sig), authorizing_sig, authorizing_publickey)) {

      let sql = "DELETE FROM txs WHERE publickey = $publickey AND sig = $sig";
      let params = {
        $sig		:	tx.transaction.sig ,
        $publickey	:	authorizing_publickey
  ***REMOVED***;

      this.app.storage.executeDatabase(sql, params, "archive");

***REMOVED***
  ***REMOVED***


  async loadTransactions(publickey, type, num) {

    let sql = "";
    let params = {***REMOVED***;

    if (type === "all") {
      sql = "SELECT * FROM txs WHERE publickey = $publickey ORDER BY id DESC LIMIT $num";
      params = { $publickey : publickey , $num : num***REMOVED***;
***REMOVED*** else {
      sql = "SELECT * FROM txs WHERE publickey = $publickey AND type = $type ORDER BY id DESC LIMIT $num";
      params = { $publickey : publickey , $type : type , $num : num***REMOVED***;
***REMOVED***

    let rows = await this.app.storage.queryDatabase(sql, params, "archive");
    let txs = rows.map(row => row.tx);

    return txs;

  ***REMOVED***

  async saveTransactionByKey(key="", tx=null) {

    if (tx == null) { return; ***REMOVED***

    //
    // TODO - transactions "TO" multiple ppl this means redundant sigs and txs but with unique publickeys
    //
    let msgtype = "";
    if (tx.transaction.msg.module != "") { msgtype = tx.transaction.msg.module; ***REMOVED***

    let sql = "INSERT INTO txs (sig, publickey, tx, ts, type) VALUES ($sig, $publickey, $tx, $ts, $type)";
    let params = {
      $sig:	tx.transaction.sig ,
      $publickey:	key,
      $tx:	JSON.stringify(tx.transaction),
      $ts:	tx.transaction.ts,
      $type:	msgtype
***REMOVED***;
    this.app.storage.executeDatabase(sql, params, "archive");

  ***REMOVED***

  async loadTransactionsByKeys({keys=[], type='all', num=50***REMOVED***) {
    let sql = "";
    let params = {***REMOVED***;

    let count = 0;
    let paramkey = '';
    let where_statement_array = [];

    try {

      keys.forEach(key => {
        paramkey = `$key${count***REMOVED***`;
        where_statement_array.push(paramkey);
        params[paramkey] =  key;
        count++;
  ***REMOVED***);

      if (type === "all") {
        sql = `SELECT * FROM txs WHERE publickey IN ( ${where_statement_array.join(',')***REMOVED*** ) ORDER BY id DESC LIMIT $num`;
        params = Object.assign(params, { $num : num ***REMOVED***);
  ***REMOVED*** else {
        sql = `SELECT * FROM txs WHERE publickey IN ( ${where_statement_array.join(',')***REMOVED*** ) AND type = $type ORDER BY id DESC LIMIT $num`;
        params = Object.assign(params, { $type : type , $num : num***REMOVED***);
  ***REMOVED***
***REMOVED*** catch(err) {
      console.log(err);
***REMOVED***

    try {
      let rows = await this.app.storage.queryDatabase(sql, params, "archive");
      let txs = rows.map(row => row.tx);
      return txs;
***REMOVED*** catch (err) {
      console.log(err);
***REMOVED***

  ***REMOVED***

***REMOVED***


module.exports = Archive;

