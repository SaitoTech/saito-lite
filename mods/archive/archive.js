const ModTemplate = require('../../lib/templates/modtemplate');

class Archive extends ModTemplate {

  constructor(app) {

    super(app);
    this.name = "Archive";
    this.description = "Supports the saving and serving of network transactions";
    this.categories = "Utilities Core";

    this.events = [];

    this.description = "A tool for storing transactions for asynchronous retreival.";
    this.categories  = "Utilities";

  }



  onConfirmation(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();

    //
    // by default we just save everything that is an application
    //
    if (conf == 0) {
      if (tx.transaction.msg.module != "") {
        this.saveTransaction(tx);
      }
    }
  }




  async handlePeerRequest(app, req, peer, mycallback) {

    if (req.request == null) { return; }
    if (req.data == null) { return; }

    var txs;
    var response = {};
    //
    // only handle archive request
    //
    if (req.request === "archive") {

      if (req.data.request === "delete") {
        this.deleteTransaction(req.data.tx, req.data.publickey, req.data.sig);
      }
      if (req.data.request === "save") {
        this.saveTransaction(req.data.tx);
      }
      if (req.data.request === "load") {
        let type = "";
        let num  = 50;
        if (req.data.num != "")  { num = req.data.num; }
        if (req.data.type != "") { type = req.data.type; }
        txs = await this.loadTransactions(req.data.publickey, req.data.sig, type, num);
        response.err = "";
        response.txs = txs;
        mycallback(response);
      }
      if (req.data.request === "load_keys") {
        if (!req.data.keys) { return; }
        txs = await this.loadTransactionsByKeys(req.data);
        response.err = "";
        response.txs = txs;
        mycallback(response);
      }
    }
  }





  async saveTransaction(tx=null) {

    if (tx == null) { return; }

    let msgtype = "";
    if (tx.transaction.msg.module != "") { msgtype = tx.transaction.msg.module; }

    let sql = "";
    let params = {};

    for (let i = 0; i < tx.transaction.to.length; i++) {    
      sql = "INSERT OR IGNORE INTO txs (sig, publickey, tx, ts, type) VALUES ($sig, $publickey, $tx, $ts, $type)";
      params = {
        $sig		:	tx.transaction.sig ,
        $publickey	:	tx.transaction.to[i].add ,
        $tx		:	JSON.stringify(tx.transaction) ,
        $ts		:	tx.transaction.ts ,
        $type		:	msgtype
      };
      await this.app.storage.executeDatabase(sql, params, "archive");
    }

  }



  async deleteTransaction(tx=null, authorizing_publickey="", authorizing_sig="") {

    if (tx == null) { return; }

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
      };

      await this.app.storage.executeDatabase(sql, params, "archive");

    }
  }


  async loadTransactions(publickey, sig, type, num) {

    let sql = "";
    let params = {};

    if (type === "all") {
      sql = "SELECT * FROM txs WHERE publickey = $publickey ORDER BY id DESC LIMIT $num";
      params = { $publickey : publickey , $num : num};
    } else {
      sql = "SELECT * FROM txs WHERE publickey = $publickey AND type = $type ORDER BY id DESC LIMIT $num";
      params = { $publickey : publickey , $type : type , $num : num};
    }

    let rows = await this.app.storage.queryDatabase(sql, params, "archive");
    let txs = [];

    if (rows != undefined) {
      if (rows.length > 0) {
        txs = rows.map(row => row.tx);
      }
    }
    return txs;

  }

  async saveTransactionByKey(key="", tx=null) {

    if (tx == null) { return; }

    //
    // TODO - transactions "TO" multiple ppl this means redundant sigs and txs but with unique publickeys
    //
    let msgtype = "";
    if (tx.transaction.msg.module != "") { msgtype = tx.transaction.msg.module; }

    let sql = "INSERT OR IGNORE INTO txs (sig, publickey, tx, ts, type) VALUES ($sig, $publickey, $tx, $ts, $type)";
    let params = {
      $sig:	tx.transaction.sig ,
      $publickey:	key,
      $tx:	JSON.stringify(tx.transaction),
      $ts:	tx.transaction.ts,
      $type:	msgtype
    };
    await this.app.storage.executeDatabase(sql, params, "archive");

  }

  async loadTransactionsByKeys({keys=[], type='all', num=50}) {
    let sql = "";
    let params = {};

    let count = 0;
    let paramkey = '';
    let where_statement_array = [];

    try {

      keys.forEach(key => {
        paramkey = `$key${count}`;
        where_statement_array.push(paramkey);
        params[paramkey] =  key;
        count++;
      });

      if (type === "all") {
        sql = `SELECT * FROM txs WHERE publickey IN ( ${where_statement_array.join(',')} ) ORDER BY id DESC LIMIT $num`;
        params = Object.assign(params, { $num : num });
      } else {
        sql = `SELECT * FROM txs WHERE publickey IN ( ${where_statement_array.join(',')} ) AND type = $type ORDER BY id DESC LIMIT $num`;
        params = Object.assign(params, { $type : type , $num : num});
      }
    } catch(err) {
      console.log(err);
    }

    try {
      let rows = await this.app.storage.queryDatabase(sql, params, "archive");
      let txs = [];
      if (rows != undefined) {
	if (rows.length > 0) {
          txs = rows.map(row => row.tx);
        }
      }
      return txs;
    } catch (err) {
      console.log(err);
    }

  }

}


module.exports = Archive;

