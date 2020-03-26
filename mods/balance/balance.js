var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');

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

  updateSlips(blk) {
    blk.transactions.forEach(tx => {
      tx.transaction.to.forEach(slip => {
        console.log(JSON.stringify(slip));
        console.log(this.app.crypto.hash(JSON.stringify(slip)));
        if (slip.amt > 0) {
          this.addSlipToDatabase(slip, 1);
        }
      });
      tx.transaction.from.forEach(slip => {
        console.log(JSON.stringify(slip));
        if (slip.amt > 0) {
          this.addSlipToDatabase(slip, -1);
        }
      });
    });

    //TODO:
    // * add chain reog handling
    // * add rebroadcasting behaviour

  }

  async addSlipToDatabase(slip, p) {
    let sql = `INSERT OR IGNORE INTO slips (
      address,
      bid,
      tid,
      sid,
      bsh,
      amt,
      type,
      lc,
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
      $shash);`

    let params = {
      $address: slip.add,
      $bid: slip.bid,
      $tid: slip.tid,
      $sid: slip.sid,
      $bsh: slip.bsh,
      $amt: slip.amt * p,
      $type: slip.type,
      $lc: slip.lc,
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