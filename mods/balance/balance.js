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
    this.maxbid = -1;
  }

  async onConfirmation(blk, tx, conf, app) {
    if (conf == 0) {

      if (this.maxbid == -1) {
        let sql = "SELECT max(spent) as maxbid FROM slips WHERE lc = 1";
        let params = {}
        let rows = await this.app.storage.queryDatabase(sql, params, "balance");
        if (rows.length) { this.maxbid = rows[0].maxbid; } 
      }

      if (this.maxbid == 0) {
        let sql = "SELECT max(bid) as maxbid FROM slips WHERE lc = 1";
        let params = {}
        let rows = await this.app.storage.queryDatabase(sql, params, "balance");
        if (rows.length) { this.maxbid = rows[0].maxbid; } 
      }

      if (this.maxbid <= 0) { this.maxbid = 1; }

      if (blk.block.id > this.maxbid) {
        await this.updateSlips(blk, tx);
      }

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
    return;
  }


  async initialize(app) { 
    await super.initialize(app);
    await this.resetDatabase(app);
    return;
  }

  async resetDatabase(app) {

    if (app.BROWSER == 1) { return; }

    let db = await app.storage.returnDatabaseByName("balance");

    //
    // maxbid written into SPENT field, which is set to 0 once paid out
    //
    let sql = "SELECT max(spent) as maxbid FROM slips WHERE lc = 1";
    let params = {}
    let rows = await this.app.storage.queryDatabase(sql, params, "balance");
    if (rows.length) {
      this.maxbid = rows[0].maxbid;
    } 

    //
    // handle normal transactions
    //
    sql = "SELECT SUM(amt) as sum, address FROM slips WHERE type = 0 AND bid > 3 GROUP BY address";
    params = {}
    rows = await this.app.storage.queryDatabase(sql, params, "balance");
    db = await app.storage.returnDatabaseByName("balance");

    for (let i = 0; i < rows.length; i++) {

      let sum = rows[i].sum;
      let address = rows[i].address;

      let sql2_1 = "BEGIN";
      let sql2_2 = "DELETE FROM slips WHERE address = '"+address+"' AND type != 4";
      let sql2_3 = `INSERT INTO slips (
        address,
        bid,
        tid,
        sid,
        bsh,
        amt,
        type,
        lc,
        spent,
        paid,
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
        $paid,
        $shash);`
      let params2 = {
        $address: address,
        $bid:   0,
        $tid:   0,
        $sid:   0,
        $bsh:   "",
        $amt:   sum,
        $type:  0,
        $lc:    1,
        $paid:  0,
        $spent: this.maxbid,
        $shash: "",
      }
      let sql2_4 = "COMMIT";

      await db.run(sql2_1, {});
      await db.run(sql2_2, {});
      await db.run(sql2_3, params2);
      await db.run(sql2_4, {});

      console.log("UPDATED RECORDS FOR: " + address);

    } 



    //
    // handle staking transactions
    //
    sql = "SELECT SUM(amt) as sum, address FROM slips WHERE type = 4 AND bid > 3 GROUP BY address";
    params = {}
    rows = await this.app.storage.queryDatabase(sql, params, "balance");
    for (let i = 0; i < rows.length; i++) {

      let sum = rows[i].sum;
      let address = rows[i].address;

      let sql2_1 = "BEGIN";
      let sql2_2 = "DELETE FROM slips WHERE address = '"+address+"' AND type = 4";
      let sql2_3 = `INSERT INTO slips (
        address,
        bid,
        tid,
        sid,
        bsh,
        amt,
        type,
        lc,
        spent,
        paid,
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
        $paid,
        $shash);`
      let params2 = {
        $address: address,
        $bid:   0,
        $tid:   0,
        $sid:   0,
        $bsh:   "",
        $amt:   sum,
        $type:  4,
        $lc:    1,
        $spent: 0,
        $paid:  this.maxbid,
        $shash: "",
      }
      let sql2_4 = "COMMIT";

      await db.run(sql2_1, {});
      await db.run(sql2_2, {});
      await db.run(sql2_3, params2);
      await db.run(sql2_4, {});

      console.log("UPDATED STAKING RECORDS FOR: " + address);

    } 

    return;
  }



  async updateSlips(blk, tx) {

console.log("into update slips");

    let bsh = blk.returnHash();
    let bid = blk.block.id;

    for (let i = 0; i < tx.transaction.to.length; i++) {

      let clone = Object. assign({}, tx.transaction.to[i]);

      clone.bsh = bsh;
      clone.tid = tx.transaction.id;
      clone.bid = bid;
      if (parseInt(clone.amt) > 0 && clone.add != '') {
        await this.addCloneSlipToDatabase(clone, 1);
      }

    }

    for (let i = 0; i < tx.transaction.from.length; i++) {

      let clone = Object. assign({}, tx.transaction.from[i]);

      clone.bsh = bsh;
      clone.tid = tx.transaction.id;
      clone.bid = bid;
      if (parseInt(clone.amt) > 0 && clone.add != "") {
        await this.addCloneSlipToDatabase(clone, -1);
      }
    }

    return;
  }



  //
  // slip object must be CLONE of actual slip, as otherwise adjusting values 
  // breaks SPV mode
  //
  async addCloneSlipToDatabase(slip, p) {
    slip.spent = 0;
    if (p == -1) {
      slip.amt = "-"+slip.amt; 
      slip.spent = 1;
    }

if (slip.add === "") { 
console.log("\n\n\n\n\n\n\n\n\n\n");
console.log("####################");
console.log("INSERTING EMPTY SLIP");
console.log("####################");
console.log(JSON.stringify(slip) + " ---> " + p);
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
      paid,
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
      $paid,
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

console.log("Adding clone slip to DB");
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


