const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate.js');

class Faucet extends ModTemplate {
    constructor(app) {

        super(app);

        this.name = "Faucet";
        this.initial = 5;

    }


    onConfirmation(blk, tx, conf, app) {
        console.log('######################################################');
        console.log('######################################################');
        console.log('##################                ####################');
        console.log('##################  CONFIRMATION  ####################');
        console.log('##################                ####################');
        console.log('######################################################');
        console.log('######################################################');
        if (conf == 0) {
            this.addTransactionsToDatabase(blk);
        }
    }

    async addTransactionsToDatabase(blk) {
        try {
            for (let i = 0; i < blk.transactions.length; i++) {
                if (blk.transactions[i].transaction.type >= -999) {
                    for (let ii = 0; ii < blk.transactions[i].transaction.from.length; ii++) {
                        if (blk.transactions[i].transaction.from[ii].type >= -999) {
                            let sql = `INSERT OR IGNORE INTO users (
                                add,
                                tx_count,
                                balance,
                                games_finished,
                                game_tx_count,
                                first_tx,
                                latest_tx,
                                last_payout_ts,
                                last_payout_amt,
                                total_payout,
                                total_spend,
                                referer)
                           VALUES (
                                $add,
                                $tx_count,
                                $balance,
                                $games_finished,
                                $game_tx_count,
                                $first_tx,
                                $latest_tx,
                                $last_payout_ts,
                                $last_payout_amt,
                                $total_payout,
                                $total_spend,
                                $referer)
                                );`
                            var isGame = 0;
                            if (typeof blk.transactions[i].transaction.msg.game_id != undefined) { isGame = 1 };
                            let params = {
                                $add: blk.transactions[i].transaction.from[ii].add,
                                $tx_count: 1,
                                $balance: 0,
                                $games_finished: 0,
                                $games_tx_count: isGame,
                                $first_tx: blk.transactions[i].ts,
                                $latest_tx: blk.transactions[i].ts,
                                $last_payout_ts: blk.transactions[i].ts,
                                $last_payout_amt: this.initial,
                                $total_payout: this.initial,
                                $total_spend: blk.transactions[i].fees_total,
                                $referer: ""
                            }
                            await this.app.storage.executeDatabase(sql, params, "faucet");
                        }
                    }
                }
            }
            return;
        } catch (err) {
            console.error(err);
        }

    }

}

module.exports = Faucet;
