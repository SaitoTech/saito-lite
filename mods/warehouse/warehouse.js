const ModTemplate = require('../../lib/templates/modtemplate');

class Warehouse extends ModTemplate {
  constructor(app) {
    super(app);
    this.app = app;
    this.name = "Warehouse";
    this.description = "Block data warehouse for the Saito blockchain. Not suitable for lite-clients";
    this.categories = "Utilities Dev";
    this.alwaysRun = 1;
  }

  onConfirmation(blk, tx, conf, app) {
    if (conf == 0) {
      // removed addTransactionsToDatabase from here
    }
  }

  onNewBlock(blk, lc) {
    // console.log('warehouse - on new block');
    this.addTransactionsToDatabase(blk);
  }

  async addTransactionsToDatabase(blk) {
    try {
      for (let i = 0; i < blk.transactions.length; i++) {
        if (blk.transactions[i].transaction.type >= -999) {
          for (let ii = 0; ii < blk.transactions[i].transaction.to.length; ii++) {
            if (blk.transactions[i].transaction.to[ii].type >= -999) {
              let sql = `INSERT OR IGNORE INTO transactions (
                                address, 
                                amt, 
                                bid, 
                                tid, 
                                sid, 
                                bhash, 
                                lc, 
                                rebroadcast,
                                sig,
                                ts,
                                block_ts,
                                type,
                                tx_from,
                                tx_to,
                                name,
                                module
                                )
                             VALUES (
                                $address, 
                                $amt, 
                                $bid, 
                                $tid, 
                                $sid, 
                                $bhash, 
                                $lc, 
                                $rebroadcast,
                                $sig,
                                $ts,
                                $block_ts,
                                $type,
                                $tx_from,
                                $tx_to,
                                $name,
                                $module
                                )`;
              let ttype = 0;
              let tname = "";
              let tmodule = "";
              if (blk.transactions[i].msg.type) {
                ttype = blk.transactions[i].msg.type;
              }
              if (blk.transactions[i].msg.name) {
                tname = blk.transactions[i].msg.name;
              }
              if (blk.transactions[i].msg.module) {
                tmodule = blk.transactions[i].msg.module;
              }
              let params = {
                $address: blk.transactions[i].transaction.to[ii].add,
                $amt: blk.transactions[i].transaction.to[ii].amt,
                $bid: blk.block.id,
                $tid: blk.transactions[i].transaction.id,
                $sid: ii,
                $bhash: blk.returnHash(),
                $lc: 1,
                $rebroadcast: 0,
                $sig: blk.transactions[i].transaction.sig,
                $ts: blk.transactions[i].transaction.ts,
                $block_ts: blk.block.ts,
                $type: ttype,
                $tx_from: blk.transactions[i].transaction.from[0].add,
                $tx_to: blk.transactions[i].transaction.to[ii].add,
                $name: tname,
                $module: tmodule
              }
              await this.app.storage.executeDatabase(sql, params, "warehouse");
            }
          }
        }
      }
      return;
    } catch (err) {
      console.error(err);
    }

  }


  shouldAffixCallbackToModule() { return 1; }

}

module.exports = Warehouse;
