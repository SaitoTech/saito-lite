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
    this.trigger_bid = 2;
    this.fully_paid_out = 0;
    this.was_the_chain_reset = 0;
  }


  async onNewBlock(blk, lc) {

    if (blk.block.id == 1) {
      if (this.app.blockchain.index.blocks.length == 1) {
        this.was_the_chain_reset = 1;
      }
    }

    if (this.was_the_chain_reset == 1) {
      if (this.fully_paid_out == 0) {
        this.issuePayments(this.app);
      }
    }

  }



  async onConfirmation(blk, tx, conf, app) {

    if (conf == 0) {

      if (tx.transaction.type == 2 || tx.transaction.type == 1) { return; }

      if (this.maxbid == -1) {
        let sql = "SELECT max(spent) as maxbid FROM slips WHERE lc = 1";
        let params = {}
        let rows = await this.app.storage.queryDatabase(sql, params, "balance");
        if (rows) { if (rows.length) { this.maxbid = rows[0].maxbid; } }
      }

      if (this.maxbid == 0) {
        let sql = "SELECT max(bid) as maxbid FROM slips WHERE lc = 1";
        let params = {}
        let rows = await this.app.storage.queryDatabase(sql, params, "balance");
        if (rows) { if (rows.length) { this.maxbid = rows[0].maxbid; } }
      }

      //try just dropping this check
      if (this.maxbid <= 0) { this.maxbid = 1; }

      //if (blk.block.id > this.maxbid) {
      await this.updateSlips(blk, tx);
      //}

    }
  }

  async onChainReorganization(bid, bsh, lc) {
    let sql = "UPDATE slips SET lc = $lc WHERE bsh = $bsh AND bid = $bid";
    let params = {
      $lc: lc,
      $bsh: bsh,
      $bid: bid,
    }
    await this.app.storage.executeDatabase(sql, params, "balance");
    return;
  }

  /*
  async onChainReorganization(bid, bsh, lc) {
    let sql = "UPDATE slips SET lc = $lc WHERE bsh = $bsh AND bid = $bid";
    let params = {
      $lc: lc,
      $bsh: bsh,
      $bid: bid,
    }
    await this.app.storage.executeDatabase(sql, params, "balance");
    return;
  }

  */

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
    if (rows) {
      if (rows.length) {
        this.maxbid = rows[0].maxbid;
      }
    }

    //
    // if there is a bid greater, than is our maxbid
    //
    sql = "SELECT max(bid) as maxbid FROM slips WHERE lc = 1";
    params = {}
    rows = await this.app.storage.queryDatabase(sql, params, "balance");
    if (rows) {
      if (rows.length) {
        if (rows[0].maxbid > this.maxbid) {
          this.maxbid = rows[0].maxbid;
        }
      }
    }

    //
    // handle normal transactions (bid of 3 allows a bit of time)
    //
    sql = "SELECT SUM(CAST(amt AS FLOAT)) as sum, address FROM slips WHERE type = 0 AND (paid <> 1 OR paid is null) AND bid >= " + this.trigger_bid + " GROUP BY address";
    params = {}
    rows = await this.app.storage.queryDatabase(sql, params, "balance");

    if (rows) {
      for (let i = 0; i < rows.length; i++) {

        let sum = rows[i].sum;
        let address = rows[i].address;

        let sql2_1 = "BEGIN";
        //ignore block 1 again
        let sql2_2 = "DELETE FROM slips WHERE address = '" + address + "' AND bid > 1 AND type != 4;";
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
          $bid: this.maxbid,
          $tid: 0,
          $sid: 0,
          $bsh: "",
          $amt: sum,
          $type: 0,
          $lc: 1,
          $spent: this.maxbid,
          $paid: 0,
          $shash: "",
        }
        let sql2_4 = "COMMIT";

        await db.run(sql2_1, {});
        await db.run(sql2_2, {});
        await db.run(sql2_3, params2);
        await db.run(sql2_4, {});

      }
  }

    //
    // handle staking transactions
    //
    sql = "SELECT SUM(CAST(amt AS FLOAT)) as sum, address FROM slips WHERE type = 4 AND bid > 3 GROUP BY address";
    params = {}
    rows = await this.app.storage.queryDatabase(sql, params, "balance");
    if (rows) {
      for (let i = 0; i < rows.length; i++) {

        let sum = rows[i].sum;
        let address = rows[i].address;

        let sql2_1 = "BEGIN";
        let sql2_2 = "DELETE FROM slips WHERE address = '" + address + "' AND type = 4";
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
          $bid: this.maxbid,
          $tid: 0,
          $sid: 0,
          $bsh: "",
          $amt: sum,
          $type: 4,
          $lc: 1,
          $spent: 0,
          $paid: this.maxbid,
          $shash: "",
        }
        let sql2_4 = "COMMIT";

        await db.run(sql2_1, {});
        await db.run(sql2_2, {});
        await db.run(sql2_3, params2);
        await db.run(sql2_4, {});

        console.log("Updating balance for :" + address + " to: " + sum);

        //console.log("UPDATED STAKING RECORDS FOR: " + address);

      }
    }

    return;
  }



  async issuePayments(app) {

    console.log('issuing balance payments');

    // ignore first block payments - lest we just keep making them.
    let sql = "SELECT SUM(CAST(amt AS FLOAT)) AS sum, address FROM slips WHERE spent > 1 and paid = 0 and bid >= " + this.trigger_bid + " GROUP BY address";
    let params = {}
    let rows = await this.app.storage.queryDatabase(sql, params, "balance");
    if (rows) {
      if (rows.length) {
        for (let i = 0; i < rows.length; i++) {

          //
          // issue payment
          //
          let faucet_payment = rows[i].sum;
          let address = rows[i].address;

          //
          // do we have enough tokens to issue this payment
          //
          app.wallet.calculateBalance();
          if (Big(faucet_payment).lte(app.wallet.returnBalance()) && Big(faucet_payment).gt(0)) {

            let newtx = this.app.wallet.createUnsignedTransaction(address, faucet_payment, 0.0);
            newtx.transaction.ts = new Date().getTime();
            newtx.msg.module = "Balance";
            newtx = this.app.wallet.signTransaction(newtx);

            //
            // issue payment
            //
            let sql2 = "UPDATE slips SET spent = 0, paid = 1 WHERE address = $address";
            let params2 = { $address: address }
            await this.app.storage.executeDatabase(sql2, params2, "balance");

            //
            // propagate transaction 
            //
            this.app.network.propagateTransaction(newtx);
            console.log("Paying :" + address + " - " + faucet_payment);

          } else {

            //
            // telling this address to fuck off, it should send us cash if anything...
            //
            if (Big(faucet_payment).lte(0)) {

              //
              // issue payment
              //
              let sql2 = "UPDATE slips SET spent = 0 WHERE address = $address";
              let params2 = { $address: address }
              await this.app.storage.executeDatabase(sql2, params2, "balance");

            }
          }
        }
      } else {

        this.fully_paid_out = 1;
      }
    } else {
      this.fully_paid_out = 1;
    }
  }



  async updateSlips(blk, tx) {

    let bsh = blk.returnHash();
    let bid = blk.block.id;
    let sid = 0;

    for (let i = 0; i < tx.transaction.to.length; i++) {

      let clone = Object.assign({}, tx.transaction.to[i]);

      clone.bsh = bsh;
      clone.tid = tx.transaction.id;
      clone.bid = bid;
      clone.sid = sid;

      if (parseInt(clone.amt) > 0 && clone.add != '') {
        await this.addCloneSlipToDatabase(clone, 1);
      }

      sid++;

    }


    for (let i = 0; i < tx.transaction.from.length; i++) {

      let clone = Object.assign({}, tx.transaction.from[i]);

      clone.bsh = bsh;
      clone.tid = tx.transaction.id;
      clone.bid = bid;
      clone.sid = sid;

      if (parseInt(clone.amt) > 0 && clone.add != "") {
        await this.addCloneSlipToDatabase(clone, -1);
      }

      sid++;

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
      slip.amt = "-" + slip.amt;
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
      $paid: slip.paid,
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

      var addresses = req.query.address;

      var lim = req.query.lim;
      if (!parseInt(lim) > 0) { lim = '10'; }
      if (typeof addresses == 'undefined') {

        sql = "SELECT address, SUM(CAST(amt AS FLOAT)) as 'balance' from slips where substr(address, 14, 29) <> 'yMTVpvuKNEHt2fZQUxDebpiBaqwkW' AND (paid <> 1 OR paid is null) group by address order by SUM(CAST(amt AS FLOAT)) desc limit $lim;";
        params = { $lim: lim };

      } else {

        var address = "";

        addresses.split('-').forEach(a => {
          address += "'" + a + "'" + ", ";
        });
        address = address.slice(0, -2);

        //sql = "SELECT address, SUM(CAST(amt AS FLOAT)) as 'balance' from slips WHERE address in ($address) group by address order by SUM(CAST(amt AS FLOAT));";
        //params = { $address: address };

        sql = "SELECT address, SUM(CAST(amt AS FLOAT)) as 'balance' from slips WHERE address in (" + address + ") AND (paid <> 1 OR paid is null) group by address order by SUM(CAST(amt AS FLOAT));";
        params = {};
        //console.log(sql);
        //console.log(address);

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
        html += "<div><h3>Address</h3></div><div><h3>Balance</h3></div>"
        rows.forEach(row => {
          if (row.address != balance_self.app.wallet.returnPublicKey()) {
            html += "<div>" + row.address + "</div>";
            html += "<div>" + row.balance + "</div>";
          }
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


