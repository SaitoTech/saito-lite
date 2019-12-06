const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate.js');

class Faucet extends ModTemplate {
    constructor(app) {

        super(app);

        this.name = "Faucet";
        this.initial = 5;
        this.payoutRatio = 0.8;

    }


    onConfirmation(blk, tx, conf, app) {
        if (conf == 0) {
            if (tx.transaction.type == 0) {
                console.log('###########  FAUCET CONFIRMATION  ###########');
                this.updateUsers(tx);
            }
        }
    }
    
    async updateUsers(tx) {
        try {
            if (tx.transaction.type >= -999) {
                for (let ii = 0; ii < tx.transaction.from.length; ii++) {
                    if (tx.transaction.from[ii].type >= -999) {
                        if (tx.transaction.from[ii].add != this.app.wallet.returnPublicKey()) {
                            let sql = "SELECT * FROM users where address = $address";
                            let params = {
                                $address: tx.transaction.from[ii].add
                            };
                            let rows = await this.app.storage.queryDatabase(sql, params, "faucet");
                            if (rows.length == 0) {
                                this.addUser(tx, ii);
                            } else {
                                for (let j = 0; j < rows.length; j++) {
                                    if (rows[j].address == tx.transaction.from[ii].add) {
                                        this.updateUser(rows[j], tx, ii);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } catch (err) {
            console.error(err);
        }
    }

    async updateUser(row, tx, ii) {
        let sql = "";
        let params = {};
        var payout = ((row.total_spend / (row.total_payout + 0.01)) >= this.payoutRatio);
        var newPayout = row.last_payout_amt / this.payoutRatio;
        var isGame = 0;
        if (typeof tx.transaction.msg.game_id != "undefined") { isGame = 1 };
        var gameOver = 0;
        if (tx.name == "game over") { gameOver = 1 };
        if (payout) {
            params = {
                $address: row.address,
                $last_payout_ts: tx.ts,
                $last_payout_amt: newPayout,
                $total_payout: row.total_payout + newPayout,
                $tx_count: row.tx_count + 1,
                $games_finished: row.games_finished + gameOver,
                $game_tx_count: row.game_tx_count + isGame,
                $latest_tx: tx.transaction.ts,
                $total_spend: row.fees_total + Number(tx.fees_total)
            }
            sql = `UPDATE users SET last_payout_ts = $last_payout_ts, last_payout_amt = $last_payout_amt, total_payout = $total_payout, tx_count = $tx_count, games_finished = $games_finished, game_tx_count = $game_tx_count, latest_tx = $latest_tx, total_spend = $total_spend WHERE address = $address`

        } else {
            params = {
                $address: row.address,
                $tx_count: row.tx_count + 1,
                $games_finished: row.games_finished + gameOver,
                $game_tx_count: row.game_tx_count + isGame,
                $latest_tx: tx.transaction.ts,
                $total_spend: row.total_spend + Number(tx.fees_total)
            }
            sql = `UPDATE users SET last_payout_ts = $last_payout_ts, tx_count = $tx_count, games_finished = $games_finished, game_tx_count = $game_tx_count, latest_tx = $latest_tx, total_spend = $total_spend WHERE address = $address`
        }
        let resp = await this.app.storage.executeDatabase(sql, params, "faucet");

        if (payout) {
            makePayout(row.address, newPayout);
        }

    }


    async addUser(tx, ii) {
        try{
            //let sql = "INSERT OR IGNORE INTO users (address, tx_count, games_finished, game_tx_count, first_tx, latest_tx, last_payout_ts, last_payout_amt, total_payout, total_spend, referer) VALUES ($address, $tx_count, $games_finished, $game_tx_count, $first_tx, $latest_tx, $last_payout_ts, $last_payout_amt, $total_payout, $total_spend, $referer);"
            var isGame = 0;
            if (typeof tx.transaction.msg.game_id != undefined) { isGame = 1 };
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
            }
            let sql = "INSERT OR IGNORE INTO users (address, tx_count, games_finished, game_tx_count, first_tx, latest_tx, last_payout_ts, last_payout_amt, total_payout, total_spend, referer) VALUES ('"+tx.transaction.from[ii].add+"', "+1+", "+0+", "+isGame+", "+tx.transaction.ts+", "+tx.transaction.ts+", "+tx.transaction.ts+", "+this.initial+", "+this.initial+", "+Number(tx.fees_total)+", '');";
            params = {};
           
            await this.app.storage.executeDatabase(sql, params, "faucet");

            //initial funds sent
            makePayout(tx.transaction.from[ii].add, this.initial);

            return;
        } catch (err) {
            console.error(err);
        }
    }

    async makePayout(address, amount) {
        //send the user a little something.
    }

    shouldAffixCallbackToModule() { return 1; }

}

module.exports = Faucet;