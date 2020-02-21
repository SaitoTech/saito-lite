const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const Big = require('big.js');

const RewardsAppSpace = require('./lib/email-appspace/rewards-appspace');
const RewardsSidebar = require('./lib/arcade-sidebar/arcade-right-sidebar');
const RewardsSidebarRow = require('./lib/arcade-sidebar/arcade-sidebar-row.template');
const activities = require('./lib/email-appspace/activities');

class Rewards extends ModTemplate {

  constructor(app) {

    super(app);

    this.name = "Rewards";
    this.description = "Quick reference for earning Saito tokens from the Saito faucet.";
    this.categories = "Core Utilities Finance";

    this.initial = 10;
    this.payoutRatio = 0.75;

    this.backupPayout = 50;
    this.registryPayout = 50;

    this.referalBonus = 0.1;

    this.description = "User activity reward program module.";
    this.categories = "UI Promotions";

    //
    // we want this running in all browsers
    //
    if (app.BROWSER == 1) {
      this.browser_active = 1;
    }

  }


  respondTo(type) {
    if (type == 'email-appspace') {
      let obj = {};
      obj.render = this.renderEmail;
      obj.attachEvents = this.attachEventsEmail;
      return obj;
    }

    if (type == 'arcade-sidebar') {
      let obj = {};
      obj.render = this.renderArcadeSidebar;
      obj.attachEvents = this.attachEventsArcadeSidebar;
      return obj;
    }
    return null;
  }

  async onPeerHandshakeComplete(app, peer) {
    if (this.browser_active == 1) {
      console.log('drawing achievements');
      try {
        if (document.querySelector(".arcade-sidebar-done")) {
          await this.app.network.sendRequestWithCallback("get achievements", this.app.wallet.returnPublicKey(), (rows) => {
            rows.forEach(row => this.renderAchievmentRow(row));
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  renderAchievmentRow(row) {
    if (typeof (row.label) != "undefined" || typeof (row.icon) != "undefined") {
      document.querySelector(".arcade-sidebar-done").innerHTML += RewardsSidebarRow(row.label, row.icon, row.count);
    }
  }


  async handlePeerRequest(app, message, peer, mycallback = null) {
    if (message.request == "get achievements") {
      var achievements = await this.returnAchievements(message.data)
      mycallback(achievements);
    }

    if (message.request == "user wallet backup") {
      this.payoutFirstInstance(message.data, message.request, this.backupPayout);
    }

    if (message.request == "update activities") {
      var completed = await this.returnEvents(message.data)
      mycallback(completed);
    }
  }

  returnEventRow(event) {
    let obj = {};
    obj.count = "";
    switch (event) {
      case 'user wallet backup':
        obj.label = "Wallet Backup";
        obj.icon = "fas fa-download";
        break;
      case 'register identifier':
        obj.label = "Name Yourself";
        obj.icon = "fas fa-user-tag"
        break;
    }
    return obj;
  }

  returnNumberBadge(x) {
    let obj = {}
    obj.count = x;
    switch (true) {
      case (x = 0):
        obj.label = "No transactions yet!";
        obj.icon = "0tx badge";
        break;
      case (x = 1):
        obj.label = "Your first Transaction!";
        obj.icon = "1tx badge";
        break;
      case (x > 1 && x <= 10):
        obj.label = x + " transactions!";
        obj.icon = "1tx badge";
        break;
      case (x > 9 && x <= 50):
        obj.label = "Multiple Transactions - cool!";
        obj.icon = "10tx badge";
        break;
      case (x > 50 && x <= 100):
        obj.label = "50 TX - a real user";
        obj.icon = "50tx badge";
        break;
      case (x > 100 && x <= 500):
        obj.label = "100 TX - a regular!";
        obj.icon = "100tx badge";
        break;
      case (x > 500 && x <= 1000):
        obj.label = "500 TX - hard core!";
        obj.icon = "500tx badge";
        break;
    }
    if (x > 1000) {
      obj.label = "Master";
      obj.badge = "master badge";
      obj.count = (Math.floor(x / 1000)).toString + "k";
    }
    return obj;
  }

  async returnAchievements(key) {
    let achievements = [];
    let rows = await this.returnEvents(key, false);
    for (let i = 0; i < rows.length; i++) {
      achievements.push(this.returnEventRow(rows[i].event));
    }
    let tx_count = await this.returnUserTxCount(key);
    achievements.push(this.returnNumberBadge(tx_count));
    return achievements;
  }

  renderEmail(app, data) {
    data.rewards = app.modules.returnModule("Rewards");
    RewardsAppspace.render(app, data);
  }
  attachEventsEmail(app, data) {
    data.rewards = app.modules.returnModule("Rewards");
    RewardsAppspace.attachEvents(app, data);
  }

  renderArcadeSidebar(app, data) {
    data.rewards = app.modules.returnModule("Rewards");
    RewardsSidebar.render(app, data);
  }

  attachEventsArcadeSidebar(app, data) {
    data.rewards = app.modules.returnModule("Rewards");
    RewardsSidebar.attachEvents(app, data);
  }

  async payoutFirstInstance(address, event, payout) {
    if (await this.checkEvent(address, event) == false) {
      this.makePayout(address, payout, event);
    }
    this.recordEvent(address, event);
  }

  async onConfirmation(blk, tx, conf, app) {
    if (app.BROWSER == 1) { return }

    if (conf == 0) {
      if (tx.transaction.type == 0) {
        if (this.app.BROWSER == 1) { return; }
        this.updateUsers(tx);
      }
      if (tx.transaction.msg.origin == "Registry") {
        this.payoutFirstInstance(tx.transaction.to[0].add, "register identifier", this.registryPayout);
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
              let rows = await this.app.storage.queryDatabase(sql, params, "rewards");
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
    var newPayout = Math.ceil(row.last_payout_amt / this.payoutRatio);
    var isGame = 0;
    if (typeof tx.transaction.msg.game_id != "undefined") { isGame = 1 };
    var gameOver = 0;
    if (tx.name == "game over") { gameOver = 1 };
    //welcome folks back if they have been reset - and give me a little somethin.
    if (row.latest_tx == -1) {
      this.makePayout(row.address, 100, "Welcome Back");
    }
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
    let resp = await this.app.storage.executeDatabase(sql, params, "rewards");


    if (payout) {
      this.makePayout(row.address, newPayout, "Usage");
    }
  }


  async addUser(tx, ii) {
    try {
      //if first transaction is an encrypt tx - the user was referred.
      //add referal info.
      //if()
      //let sql = "INSERT OR IGNORE INTO users (address, tx_count, games_finished, game_tx_count, first_tx, latest_tx, last_payout_ts, last_payout_amt, total_payout, total_spend, referer) VALUES ($address, $tx_count, $games_finished, $game_tx_count, $first_tx, $latest_tx, $last_payout_ts, $last_payout_amt, $total_payout, $total_spend, $referer);"
      var isGame = 0;
      if (typeof tx.transaction.msg.game_id != undefined) { isGame = 1 };
      var referer = ''
      if (tx.transaction.msg.module == "Encrypt") {
        referer = tx.transaction.to[ii].add;
        this.recordEvent(referer, "user add contact");
      }
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
        $referer: referer
      }
      let sql = "INSERT OR IGNORE INTO users (address, tx_count, games_finished, game_tx_count, first_tx, latest_tx, last_payout_ts, last_payout_amt, total_payout, total_spend, referer) VALUES ('" + tx.transaction.from[ii].add + "', " + 1 + ", " + 0 + ", " + isGame + ", " + tx.transaction.ts + ", " + tx.transaction.ts + ", " + tx.transaction.ts + ", " + this.initial + ", " + this.initial + ", " + Number(tx.fees_total) + ", '" + referer + "');";
      params = {};

      await this.app.storage.executeDatabase(sql, params, "rewards");

      //initial funds sent
      //this.makePayout(tx.transaction.from[ii].add, this.initial);

      return;
    } catch (err) {
      console.error(err);
    }
  }

  async recordEvent(address, event, time = new Date().getTime()) {
    let sql = "INSERT INTO events (address, event, time) VALUES ($address, $event, $time);";
    let params = {
      $address: address,
      $event: event,
      $time: time
    }
    try {
      await this.app.storage.executeDatabase(sql, params, "rewards");
    } catch (err) {
      console.error(err);
    }
  }

  async returnUserTxCount(address, counted = "tx_count") {
    let sql = "SELECT " + counted + " FROM users where address = $address limit 1";

    let params = {
      $address: address
    }

    try {
      let rows = await this.app.storage.queryDatabase(sql, params, "rewards");
      if (rows.length > 0) {
        return rows[0][counted];
      } else {
        return 0;
      }
    } catch (err) {
      console.error(err);
    }
  }

  async returnEvents(address, latest = false) {
    var sql = "";
    if (latest) {
      sql = "SELECT * FROM events where address = $address order by time asc limit 1";
    } else {
      sql = "SELECT * FROM events where address = $address group by event order by time desc";
    }

    let params = {
      $address: address
    }

    try {
      let rows = await this.app.storage.queryDatabase(sql, params, "rewards");
      return rows;
    } catch (err) {
      console.error(err);
    }
  }

  async checkEvent(address, event) {
    let sql = "SELECT * FROM events where address = $address and $event = event";
    let params = {
      $address: address,
      $event: event
    }

    try {
      let rows = await this.app.storage.queryDatabase(sql, params, "rewards");
      if (rows.length >= 1) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error(err);
    }
  }

  async returnReferer(address) {
    try {
      let sql = "SELECT referer from users where address = $address";
      let params = {
        $address: address,
      }
      let rows = await this.app.storage.queryDatabase(sql, params, "rewards");
      if (rows.length >= 1) {
        return rows[0].referer;
      } else {
        return false;
      }
    } catch (err) {
      console.error(err);
    }
  }

  makePayout(address, amount, event = "") {
    //send the user a little something.

    //work out what for:
    if (event != "") {
      activities.forEach((activity) => {
        if (event == activity.event) { event = activity.title }
      });
    }

    let wallet_balance = this.app.wallet.returnBalance();

    if (wallet_balance < amount) {
      console.log("\n\n\n *******THE REWARD SERVER IS POOR******* \n\n\n");
      return;
    }

    try {
      let total_fees = Big(amount + 2);
      let newtx = new saito.transaction();

      newtx.transaction.from = this.app.wallet.returnAdequateInputs(total_fees.toString());

      //
      // add change input
      var total_from_amt = newtx.transaction.from
        .map(slip => slip.amt)
        .reduce((a, b) => Big(a).plus(Big(b)), 0);

      //
      // generate change address(es)
      //
      var change_amount = total_from_amt.minus(total_fees);
      newtx.transaction.to = this.app.wallet.createToSlips(10, address, amount, change_amount);

      newtx.transaction.msg.module = "Email";
      if (event == "") {
        newtx.transaction.msg.title = "Saito Rewards - You have been Rewarded";
      } else {
        newtx.transaction.msg.title = "Saito Rewards: " + event;
      }
      newtx.transaction.msg.message = `
        <p>You have received <span class="boldred">${amount} tokens</span> from the Saito rewards system.</p>
        `;
      newtx = this.app.wallet.signTransaction(newtx);

      this.app.network.propagateTransaction(newtx);

      this.returnReferer(address)
        .then((referer) => {
          if (referer.length >= 40) {
            if ((amount * this.referalBonus) >= 1) {
              let referalPayment = amount * this.referalBonus;
              this.makePayout(referer, referalPayment, "Referal: " + event);
            }
          }
        });

      return;

    } catch (err) {
      console.log("ERROR CAUGHT IN rewards: ", err);
      return;
    }

  }

  shouldAffixCallbackToModule() { return 1; }

}

module.exports = Rewards;
