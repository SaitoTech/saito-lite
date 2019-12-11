***REMOVED***
***REMOVED***
const Big = require('big.js');

const FaucetAppSpace = require('./lib/email-appspace/faucet-appspace');

class Faucet extends ModTemplate {
***REMOVED***

***REMOVED***

        this.name = "Faucet";
        this.initial = 5;
        this.payoutRatio = 0.8;

***REMOVED***




  respondTo(type) {
    if (type == 'email-appspace') {
      let obj = {***REMOVED***;
          obj.render = this.renderEmail;
          obj.attachEvents = this.attachEventsEmail;
      return obj;
***REMOVED***
    return null;
  ***REMOVED***
  renderEmail(app, data) {
     data.faucet = app.modules.returnModule("Faucet");
     FaucetAppspace.render(app, data);
  ***REMOVED***
  attachEventsEmail(app, data) {
     data.faucet = app.modules.returnModule("Faucet");
     FaucetAppspace.attachEvents(app, data);
  ***REMOVED***




***REMOVED***

        if (app.BROWSER == 1) { return; ***REMOVED***

***REMOVED***
            if (tx.transaction.type == 0) {
                console.log('###########  FAUCET CONFIRMATION  ###########');
                this.updateUsers(tx);
        ***REMOVED***
    ***REMOVED***
***REMOVED***
    
    async updateUsers(tx) {
***REMOVED***
            if (tx.transaction.type >= -999) {
                for (let ii = 0; ii < tx.transaction.from.length; ii++) {
                    if (tx.transaction.from[ii].type >= -999) {
                        if (tx.transaction.from[ii].add != this.app.wallet.returnPublicKey()) {
                            let sql = "SELECT * FROM users where address = $address";
                            let params = {
                                $address: tx.transaction.from[ii].add
                        ***REMOVED***;
                            let rows = await this.app.storage.queryDatabase(sql, params, "faucet");
                            if (rows.length == 0) {
                                this.addUser(tx, ii);
                        ***REMOVED*** else {
                                for (let j = 0; j < rows.length; j++) {
                                    if (rows[j].address == tx.transaction.from[ii].add) {
                                        this.updateUser(rows[j], tx, ii);
                                ***REMOVED***
                            ***REMOVED***
                        ***REMOVED***
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
    ***REMOVED*** catch (err) {
            console.error(err);
    ***REMOVED***
***REMOVED***

    async updateUser(row, tx, ii) {
        let sql = "";
        let params = {***REMOVED***;
        var payout = ((row.total_spend / (row.total_payout + 0.01)) >= this.payoutRatio);
        var newPayout = row.last_payout_amt / this.payoutRatio;
        var isGame = 0;
        if (typeof tx.transaction.msg.game_id != "undefined") { isGame = 1 ***REMOVED***;
        var gameOver = 0;
        if (tx.name == "game over") { gameOver = 1 ***REMOVED***;
        if (payout == true) {
            params = {
                $address: row.address,
                $last_payout_ts: tx.ts,
                $last_payout_amt: newPayout,
                $total_payout: row.total_payout + newPayout,
                $tx_count: row.tx_count + 1,
                $games_finished: row.games_finished + gameOver,
                $game_tx_count: row.game_tx_count + isGame,
                $latest_tx: tx.transaction.ts,
                $total_spend: row.total_spend + Number(tx.fees_total)
        ***REMOVED***
            sql = `UPDATE users SET last_payout_ts = $last_payout_ts, last_payout_amt = $last_payout_amt, total_payout = $total_payout, tx_count = $tx_count, games_finished = $games_finished, game_tx_count = $game_tx_count, latest_tx = $latest_tx, total_spend = $total_spend WHERE address = $address`

    ***REMOVED*** else {
            params = {
                $address: row.address,
                $tx_count: row.tx_count + 1,
                $games_finished: row.games_finished + gameOver,
                $game_tx_count: row.game_tx_count + isGame,
                $latest_tx: tx.transaction.ts,
                $total_spend: row.total_spend + Number(tx.fees_total)
        ***REMOVED***
            sql = `UPDATE users SET last_payout_ts = $last_payout_ts, tx_count = $tx_count, games_finished = $games_finished, game_tx_count = $game_tx_count, latest_tx = $latest_tx, total_spend = $total_spend WHERE address = $address`
    ***REMOVED***
        let resp = await this.app.storage.executeDatabase(sql, params, "faucet");

        if (payout) {
            this.makePayout(row.address, newPayout);
    ***REMOVED***

***REMOVED***


    async addUser(tx, ii) {
        try{
    ***REMOVED***let sql = "INSERT OR IGNORE INTO users (address, tx_count, games_finished, game_tx_count, first_tx, latest_tx, last_payout_ts, last_payout_amt, total_payout, total_spend, referer) VALUES ($address, $tx_count, $games_finished, $game_tx_count, $first_tx, $latest_tx, $last_payout_ts, $last_payout_amt, $total_payout, $total_spend, $referer);"
            var isGame = 0;
            if (typeof tx.transaction.msg.game_id != undefined) { isGame = 1 ***REMOVED***;
            let params = {
                $address: tx.transaction.from[ii].add,
                $tx_count: 1,
                $games_finished: 0,
                $game_tx_count: isGame,
                $first_tx: tx.transaction.ts,
                $latest_tx: tx.transaction.ts,
                $last_payout_ts: tx.transaction.ts,
                $last_payout_amt: this.initial,
                $total_payout: this.initial,
                $total_spend: Number(tx.fees_total),
                $referer: '',
        ***REMOVED***
            let sql = "INSERT OR IGNORE INTO users (address, tx_count, games_finished, game_tx_count, first_tx, latest_tx, last_payout_ts, last_payout_amt, total_payout, total_spend, referer) VALUES ('"+tx.transaction.from[ii].add+"', "+1+", "+0+", "+isGame+", "+tx.transaction.ts+", "+tx.transaction.ts+", "+tx.transaction.ts+", "+this.initial+", "+this.initial+", "+Number(tx.fees_total)+", '');";
            params = {***REMOVED***;
           
            await this.app.storage.executeDatabase(sql, params, "faucet");

    ***REMOVED***initial funds sent
            this.makePayout(tx.transaction.from[ii].add, this.initial);

            return;
    ***REMOVED*** catch (err) {
            console.error(err);
    ***REMOVED***
***REMOVED***

    async makePayout(address, amount) {
***REMOVED***send the user a little something.
    
        let wallet_balance = this.app.wallet.returnBalance();
    
        if (wallet_balance < amount) {
          console.log("\n\n\n *******THE FAUCET IS POOR******* \n\n\n");
          return;
    ***REMOVED***
    
***REMOVED***
    
          let faucet_self = this;
          let total_fees = Big(amount+2);
          let newtx = new saito.transaction();
          newtx.transaction.from = faucet_self.app.wallet.returnAdequateInputs(total_fees.toString());
          newtx.transaction.ts   = new Date().getTime();
    
          console.log("FAUCET INPUTS: " + JSON.stringify(faucet_self.app.wallet.wallet.inputs));
    
  ***REMOVED*** add change input
          var total_inputs = Big(0.0);
          for (let i = 0; i < newtx.transaction.from.length; i++) {
            total_inputs = total_inputs.plus(Big(newtx.transaction.from[i].amt));
      ***REMOVED***
    
  ***REMOVED***
  ***REMOVED*** generate change address(es)
  ***REMOVED***
          var change_amount = total_inputs.minus(total_fees);
    
  ***REMOVED*** break up payment into many slips if large
          var chunks = Math.floor(amount/100);
          var remainder = amount % 100;
          
          for (let i = 0; i < chunks; i++) {
            newtx.transaction.to.push(new saito.slip(address, Big(100.0)));
            newtx.transaction.to[newtx.transaction.to.length-1].type = 0;
      ***REMOVED***
          newtx.transaction.to.push(new saito.slip(address, Big(remainder)));
            newtx.transaction.to[newtx.transaction.to.length-1].type = 0;
    
          if (Big(change_amount).gt(0)) {
            newtx.transaction.to.push(new saito.slip(faucet_self.app.wallet.returnPublicKey(), change_amount.toFixed(8)));
            newtx.transaction.to[newtx.transaction.to.length-1].type = 0;
      ***REMOVED***
    
          newtx.transaction.msg.module    = "Email";
          newtx.transaction.msg.title     = "Saito Faucet - You have been Rewarded";
          newtx.transaction.msg.message   = 'You have received ' + amount + ' tokens from our Saito faucet.';
          newtx = this.app.wallet.signTransaction(newtx);
    
          this.app.network.propagateTransaction(newtx);
          return;
    
    ***REMOVED*** catch(err) {
          console.log("ERROR CAUGHT IN FAUCET: ", err);
          return;
    ***REMOVED***

***REMOVED***

***REMOVED***

***REMOVED***

module.exports = Faucet;
