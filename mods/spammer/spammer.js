//
// This module monitors the blockchain and our
// unspent transaction inputs. It creates fake
// transactions to speed up block production
// for testing purposes.`
//

const ModTemplate = require('../../lib/templates/modtemplate');
const crypto = require('crypto');
const Big = require('big.js');

//////////////////
// CONSTRUCTOR  //
//////////////////
class Spammer extends ModTemplate {

  constructor(app) {
    this.app  = app;
    this.name = "Spammer"
  }

  onNewBlock(blk) {
    if (this.app.BROWSER == 1) { return; }

    var emails_to_send = 9;
    var size_of_emails_in_mb = 100;
    var size_of_mb = 1024000;


    // one possible cause of failure is if we create a large
    // number of transactions and it takes so long that only
    // some of them get added to the next block, and then we
    // have double-input problems.
    //
    // in order to avoid this, we just empty the mempool first
    //this.app.mempool.transactions = [];
    //this.app.mempool.transactions_hmap = [];
    //this.app.mempool.transactions_inputs_hmap = [];

    try {
  console.log("-----------------------------------------");

      var thisfee = Big(2.0);
      var thisamt = Big(1.0);
      var strlength = size_of_mb * size_of_emails_in_mb;
      var random_data = crypto.randomBytes(Math.ceil(strlength/2)).toString('hex').slice(0,strlength);

      for (let x = 0; x < emails_to_send; x++) {

        var available_inputs_limit = 0.5;
        var available_inputs       = Big(blk.app.wallet.returnAvailableInputs(available_inputs_limit));

        if (available_inputs.lt(available_inputs_limit) || (x < 0 || x >= emails_to_send)) {
console.log(" ... txs in mempool: " + this.app.mempool.transactions.length);
console.log("-----------------------------------------");
          return;
        }

        if (emails_to_send == 1) {
          //thisamt = Big(this.app.wallet.returnBalance());
          //thisamt = thisamt.minus(thisfee);
        }

        if (thisamt.gt(0)) {

          let newtx = this.app.wallet.createUnsignedTransaction(this.app.wallet.returnPublicKey(), thisamt, thisfee);
          if (newtx != null) {
            if (x == 0) { console.log("------------- CREATING TX ---------------"); }
            newtx.transaction.msg.data = random_data + x;
            newtx = this.app.wallet.signTransaction(newtx);

      // let prems = this.app.mempool.transactions.length;
      // let prems2 = prems;
            this.app.mempool.addTransaction(newtx, 0); // don't relay-on-validate

      // if (this.app.mempool.transactions.length != prems+1) {
      //   console.log("THIS TX FAILED: " + x);
      //   newtx.transaction.msg.data = "";
      //   //console.log(JSON.stringify(newtx));
      //   //console.log(JSON.stringify(blk.app.mempool.transactions));
      // }

          } else {
            console.log("ERROR: spammer modules - newtx is null...");
      x = emails_to_send+1;
          }
        }
      }
      console.log(" ... txs in mempool: " + this.app.mempool.transactions.length);
      console.log("-----------------------------------------");

    } catch(err) {
      console.err(err);
    }
  }
}

module.exports = Spammer;
