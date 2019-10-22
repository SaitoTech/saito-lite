const saito = require('../../lib/saito/saito.js');
const ModTemplate = require('../../lib/templates/modtemplate');


class Archive extends ModTemplate {

  constructor(app) {

    super(app);
    this.name = "Archive";
    this.events = [];

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
          if (req.data.num != "")  { num = req.data.num; }
          if (req.data.type != "") { type = req.data.type; }
          let txs = await this.loadTransactions(req.data.publickey, req.data.sig, type, num);
          let response = {};
              response.err = "";
              response.txs = txs;
	  mycallback(response);


        default:
          break;
      }
    }
  }





  async saveTransaction(tx=null) {

    if (tx == null) { return; }

    //
    // TODO - transactions "TO" multiple ppl this means redundant sigs and txs but with unique publickeys
    //
    let msgtype = "";
    if (tx.transaction.msg.module != "") { msgtype = tx.transaction.msg.module; }

    let sql = "INSERT INTO txs (sig, publickey, tx, ts, type) VALUES ($sig, $publickey, $tx, $ts, $type)";
    let params = {
      $sig		:	tx.transaction.sig ,
      $publickey	:	tx.transaction.to[0].add ,
      $tx		:	JSON.stringify(tx.transaction) ,
      $ts		:	tx.transaction.ts ,
      $type		:	msgtype
    };
    this.app.storage.executeDatabase(sql, params, "archive");

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

      this.app.storage.executeDatabase(sql, params, "archive");

    }
  }


  async loadTransactions(publickey, type, num) {

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
    for (let i = 0; i < rows.length; i++) { txs.push(rows[i].tx); }

    return txs;

  }

}


module.exports = Archive;

