var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');
const Big = require('big.js');
const path = require('path');
const fs = require('fs');

class Balance extends ModTemplate {

  constructor(app) {
    super(app);
    this.app = app;
    this.name = "Balance";
    this.description = "Ensures token persistance";
    this.categories = "Utilities Dev";
  }

  onConfirmation(blk, tx, conf, app) {
    if (conf == 0) {
      this.updateSlips(blk);
    }
  }

  async onChainReorganization(bid, bsh, lc) {
    let sql = "UPDATE slips SET lc = $lc WHERE bsh = $bsh AND bid = $bid";
    let params = { 
      $lc  : lc,
      $bsh : bsh,
      $bid : bid,
    }
    await this.app.storage.executeDatabase(sql, params, "balance");
  }


  async initialize(app) { 
console.log("initializing!");
    await super.initialize(app);
    this.resetDatabase(app);
  }

  async resetDatabase(app) {

console.log("Creating Balance New!");

    let sql = "SELECT SUM(amt) as sum, address FROM slips where bid > 3 GROUP BY address";
    let params = {}

    let rows = await this.app.storage.queryDatabase(sql, params, "balance");

console.log("ROWS: "+ JSON.stringify(rows));
    for (let i = 0; i < rows.length; i++) {

console.log("Merging Row: " + i);

      let sum = rows[i].sum;
      let address = rows[i].address;

console.log(address + " + " + sum);

      let sql2_1 = "BEGIN TRANSACTION";
          sql2_1 += ";DELETE FROM slips WHERE address LIKE '^"+address+"$'";
          sql2_1 += `;INSERT INTO slips (
        address,
        bid,
        tid,
        sid,
        bsh,
        amt,
        type,
        lc,
        spent,
        shash)
      VALUES (
        $address,
        $bid,
        $tid,
        $sid,
        $bsh,
        $amt,
        $type,
        $lc,
        $spent,
        $shash);`
      let params2 = {
        $address: address,
        $bid:   5,
        $tid:   0,
        $sid:   0,
        $bsh:   "",
        $amt:   sum,
        $type:  0,
        $lc:    1,
        $spent: 0,
        $shash: "",
      }
      sql2_1 += ";COMMIT;";

console.log("1");
      await app.storage.executeDatabase(sql2_1, params, "balance");
      //await app.storage.executeDatabase(sql2_1, {}, "balance");
console.log("2");
      //await app.storage.executeDatabase(sql2_2, {}, "balance");
console.log("3");
      //await app.storage.executeDatabase(sql2_3, params2, "balance");
console.log("4");
      //await app.storage.executeDatabase(sql2_4, {}, "balance");

console.log("UPDATED RECORDS FOR: " + address);

    } 
  }


  updateSlips(blk) {

    let bsh = blk.returnHash();
    let bid = blk.block.id;

    blk.transactions.forEach(tx => {
      tx.transaction.to.forEach(slip => {

        var clone = Object. assign({}, slip)

	clone.bsh = bsh;
	clone.tid = tx.transaction.id;
	clone.bid = bid;
        if (parseInt(clone.amt) > 0 && clone.add != '') {
          this.addCloneSlipToDatabase(clone, 1);
        }

      });
      tx.transaction.from.forEach(slip => {

        var clone = Object. assign({}, slip)

	clone.bsh = bsh;
	clone.tid = tx.transaction.id;
	clone.bid = bid;
        if (parseInt(clone.amt) > 0 && clone.add != "") {
          this.addCloneSlipToDatabase(clone, -1);
        }
      });
    });

    //TODO:
    // * add chain reog handling
    // * add rebroadcasting behaviour

  }


  //
  // slip object must be CLONE of actual slip, as otherwise adjusting values 
  // breaks SPV mode
  //
  async addCloneSlipToDatabase(slip, p) {
    let revised_amt = slip.amt;
    slip.spent = 0;
    if (p == -1) {
      slip.amt = "-"+slip.amt; 
      slip.spent = 1;
    }
    let sql = `INSERT OR IGNORE INTO slips (
      address,
      bid,
      tid,
      sid,
      bsh,
      amt,
      type,
      lc,
      spent,
      shash)
    VALUES (
      $address,
      $bid,
      $tid,
      $sid,
      $bsh,
      $amt,
      $type,
      $lc,
      $spent,
      $shash);`

    let params = {
      $address: slip.add,
      $bid: slip.bid,
      $tid: slip.tid,
      $sid: slip.sid,
      $bsh: slip.bsh,
      $amt: slip.amt,
      $type: slip.type,
      $lc: slip.lc,
      $spent: slip.spent,
      $shash: this.app.crypto.hash(JSON.stringify(slip))
    }

    await this.app.storage.executeDatabase(sql, params, "balance");

  }

  webServer(app, expressapp) {

    var balance_self = app.modules.returnModule("Balance");

    ///////////////////
    // web resources //
    ///////////////////
  
    expressapp.get('/balance/', async function (req, res) {

      res.setHeader('Content-type', 'text/html');
      res.charset = 'UTF-8';

      var sql = "";
      var params = "";
      var html = "";

      var address = req.query.address;
      var lim = req.query.lim;
      if (typeof parseInt(lim) != 'number') { lim = '10'; }
      if (typeof address == 'undefined') {

        sql = "SELECT address, SUM(amt) as 'balance' from slips group by address order by SUM(amt) desc limit $lim;";
        params = { $lim: lim };

      } else {

        sql = "SELECT address, SUM(amt) as 'balance' from slips WHERE address = $address order by SUM(amt);";
        params = { $address: address };

      }

      let rows = await balance_self.app.storage.queryDatabase(sql, params, "balance");

      if (rows == null) {

        res.setHeader('Content-type', 'text/html');
        res.charset = 'UTF-8';
        res.write("NO Balances FOUND: ");
        res.end();
        return;

      } else {

        html = balance_self.header();
        html += "<body>";
        html += "<div style='margin: 100px 2em; font-family: monospace; display:grid; grid-gap: 1em; grid-template-columns: auto auto'>";
        html += "<div>Address</div><div>Balance</div>"
        rows.forEach(row => {
          html += "<div>" + row.address + "</div>";
          html += "<div>" + row.balance + "</div>";
        })
        html += "</div>"
        html += "</body>";
        res.write(html);
        res.end();
        return;

      }
    });
  }

  header() {
    return '<html> \
    <head> \
    <meta charset="utf-8"> \
    <meta http-equiv="X-UA-Compatible" content="IE=edge"> \
    <meta name="viewport" content="width=device-width, initial-scale=1"> \
    <meta name="description" content=""> \
    <meta name="author" content=""> \
    <title>Saito Network: Address Balance List</title> \
    <link rel="stylesheet" type="text/css" href="/saito/style.css" /> \
    <link rel="stylesheet" href="/saito/lib/font-awesome-5/css/all.css" type="text/css" media="screen"> \
    <link rel="icon" sizes="192x192" href="/saito/img/touch/pwa-192x192.png"> \
    <link rel="apple-touch-icon" sizes="192x192" href="/saito/img/touch/pwa-192x192.png"> \
    <link rel="icon" sizes="512x512" href="/saito/img/touch/pwa-512x512.png"> \
    <link rel="apple-touch-icon" sizes="512x512" href="/saito/img/touch/pwa-512x512.png"></link> \
    </head> \
    <body> \
        <div class="header header-home"> \
        <img class="logo" src="/logo.svg"> \
    </div>';
  }


  shouldAffixCallbackToModule() { return 1; }

}

module.exports = Balance;


