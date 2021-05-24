const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const Big = require('big.js');

const RewardsAppSpace = require('./lib/email-appspace/rewards-appspace');
const RewardsSidebar = require('./lib/arcade-sidebar/arcade-right-sidebar');
const RewardsSidebarRow = require('./lib/arcade-sidebar/arcade-sidebar-row.template');
const activities = require('./lib/email-appspace/activities');
const { last } = require('../../lib/templates/lib/game-hammer-mobile/game-hammer-mobile');

class Rewards extends ModTemplate {

  constructor(app) {

    super(app);

    this.name = "Rewards";
    this.description = "Quick reference for earning Saito tokens from the Saito faucet.";
    this.categories = "Core Utilities Finance";
    this.INITIAL = 10;
    this.PAYOUT_RATIO = 0.95;
    this.CAP = 100;
    this.rewards_publickey = app.options.runtime.rewardsPubkey || "e1hpHsuiRPbzXdCf7smXvAFCnqpvZXcjtxZLMxcATat1";
    
    this.BACKUP_PAYOUT = 50;
    this.REGISTRY_PAYOUT = 50;
    this.FAUCET_PAYOUT = 50;
    this.SURVEY_PAYOUT = 50;
    this.SUGGEST_PAYOUT = 25;
    this.NEWSLETTER_PAYOUT = 50;
    this.REFERRAL_PAYOUT = 50;

    this.REFERRAL_BONUS = 0.1;

    this.PAYOUT_RATE_LIMIT_PER_DAY = 1000; // restarting the server will reset this!!
    this.currentRateLimitedPool = this.PAYOUT_RATE_LIMIT_PER_DAY/24; // Pretend the server has been running for 1 hour for dev purposes. May want to set this to 0 in the future.
    this.lastPayoutTS = Date.now();

    this.description = "User activity reward program module.";
    this.categories = "UI Promotions";

  }

  returnServices() {
    let services = [];
    services.push({ service: "rewards", domain: "saito" });
    return services;
  }


  respondTo(type) {
    if (type == 'email-appspace') {
      let obj = {};
      obj.render = this.renderEmail;
      obj.attachEvents = this.attachEventsEmail;
      return obj;
    }
    if (type == 'send-reward') {
      return {makePayout: this.makePayoutRateLimited.bind(this)};
    }
/***
    if (type == 'arcade-sidebar') {
      let obj = {};
      obj.render = this.renderArcadeSidebar;
      obj.attachEvents = this.attachEventsArcadeSidebar;
      return obj;
    }
    return null;
***/
  }

  async onPeerHandshakeComplete(app, peer) {

    if (app.BROWSER == 1) {
      if (typeof data == 'undefined') { var data = {} };

      this.renderBadges();
    }
  }

  renderBadges() {
    let rewards_self = this.app.modules.returnModule("Rewards");

    if (this.app.BROWSER == 1) {
      let active_mod = this.app.modules.returnActiveModule();
      if (active_mod != null) {
        if (active_mod.name == "Arcade") {
          try {
            if (document.querySelector(".arcade-sidebar-done")) {

              rewards_self.sendPeerRequestWithFilter(
                () => {
                  let msg = {};
                  msg.request = "get achievements";
                  msg.data = this.app.wallet.returnPublicKey();
                  return msg;
                },
                (rows) => {
                  document.querySelector(".arcade-sidebar-done").innerHTML = "";
                  rows.forEach(row => rewards_self.renderAchievmentRow(row));
                },
                (peer) => {
                  if (peer.peer.services) {
                    for (let z = 0; z < peer.peer.services.length; z++) {
                      if (peer.peer.services[z].service === "rewards") {
                        return 1;
                      }
                    }
                  }
                });
            }
          } catch (err) {
            console.error(err);
          }
        }
      }
    }
  }

  //              app.network.sendRequestWithCallback("get achievements", app.wallet.returnPublicKey(), 


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
    // Email rewards appspace has been deprecated and is no longer in use.
    // I'm removing the calls to payoutFirstInstance to avoid confusion
    // if (message.request == "user wallet backup") {
    //   this.payoutFirstInstance(message.data, message.request, this.BACKUP_PAYOUT);
    // }
    // 
    // if (message.request == "user survey") {
    //   this.payoutFirstInstance(message.data.key, message.request, this.SURVEY_PAYOUT);
    // }
    // 
    // if (message.request == "screen survey") {
    //   this.payoutFirstInstance(message.data.key, message.request, this.SURVEY_PAYOUT);
    // }
    // 
    // if (message.request == "user suggest") {
    //   this.payoutFirstInstance(message.data.key, message.request, this.SUGGEST_PAYOUT);
    // }
    // 
    // if (message.request == "user newsletter") {
    //   this.payoutFirstInstance(message.data.key, message.request, this.NEWSLETTER_PAYOUT);
    // }

    if (message.request == "update activities") {
      var completed = await this.returnEvents(message.data);
      mycallback(completed);
    }

    if (message.request == "user status") {
      var status = await this.returnUserStatus(message.data);
      mycallback(status);
    }

    if (message.request == "user referrals") {
      var referrals = await this.returnUserreferrals(message.data);
      mycallback(referrals);
    }
  }

  returnEventRow(event) {
    let obj = {};
    obj.count = "";
    if (event != "") {
      activities.forEach((activity) => {
        if (event == activity.event) {
          obj.label = activity.title;
          obj.icon = activity.icon;
        }
      });
    }
    return obj;
  }

  returnNumberBadge(x) {
    let obj = {}
    obj.count = x;
    switch (true) {
      case x == 0:
        obj.label = "No transactions yet!";
        obj.icon = "<i class='0tx badge'><span>" + x + "</span></i>";
        break;
      case x == 1:
        obj.label = "Your first Transaction!";
        obj.icon = "<i class='1tx badge'><span>" + x + "</span></i>";
        break;
      case x > 1 && x <= 10:
        obj.label = x + " transactions!";
        obj.icon = "<i class='1tx badge'><span>" + x + "</span></i>";
        break;
      case x > 9 && x <= 50:
        obj.label = "10+ Transactions - cool!";
        obj.icon = "<i class='10tx badge'><span>" + x + "</span></i>";
        break;
      case x > 50 && x <= 100:
        obj.label = "50+ TX - a real user";
        obj.icon = "<i class='50tx badge'><span>" + x + "</span></i>";
        break;
      case x > 100 && x <= 500:
        obj.label = "100+ TX - a regular!";
        obj.icon = "<i class='100tx badge'><span>" + x + "</span></i>";
        break;
      case x > 500 && x <= 1000:
        obj.label = "500 TX - hard core!";
        obj.icon = "<i class='500tx badge'><span>" + x + "</span></i>";
        break;
    }
    if (x > 1000) {
      obj.label = "Master";
      obj.count = (Math.floor(x / 100) / 10).toString() + "k";
      obj.icon = "<i class='master badge'><span>" + obj.count + "</span></i>";
    }
    return obj;
  }

  async returnAchievements(key) {
    let achievements = [];
    let rows = await this.returnEvents(key, false);
    if (rows) {
      for (let i = 0; i < rows.length; i++) {
        achievements.push(this.returnEventRow(rows[i].event));
      }
    } else {
      return null;
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

  async payoutDailyInstance(address, evnt, payout) {
    await this.payoutFirstInstance(address, evnt, payout, true);
  }

  async payoutFirstInstance(address, evnt, payout, daily = false) {
    let hasHappened = await this.checkEvent(address, evnt, daily);
    if (!hasHappened) {
      this.makePayout(address, payout, evnt);
      let params = {
        $address: address,
        $payout_ts: new Date().getTime(),
        $payout_amt: payout,
      }
      let sql = `UPDATE users SET last_payout_ts = $payout_ts, total_payout = total_payout + $payout_amt WHERE address = $address`;
      await this.app.storage.executeDatabase(sql, params, "rewards");
    }
    this.recordEvent(address, evnt);
  }

  async onConfirmation(blk, tx, conf, app) {
    if (app.BROWSER == 1) {
      //
      // only handle our stuff
      //
      let txmsg = tx.returnMessage();
      let rewards_self = app.modules.returnModule("Rewards");

      if (txmsg.module != rewards_self.name) { return; }

      this.renderBadges();
    } else {
      if (app.wallet.returnPublicKey() != this.rewards_publickey) { return; } 
      if (conf == 0) {
        if (tx.transaction.type == 0) {
          this.updateUsers(tx);
        }
        if (tx.returnMessage().module == "Registry") {
          this.payoutFirstInstance(tx.transaction.from[0].add, "register identifier", this.REGISTRY_PAYOUT);
        }
        if (tx.returnMessage().module == "Reward") {
          await this.payoutDailyInstance(tx.transaction.from[0].add, tx.returnMessage().action, this.FAUCET_PAYOUT);
        }
      }  
    }
    
  }

  onNewBlock(blk, lc) {
  //  if (this.app.BROWSER != 1) { return }
  //  this.renderBadges();
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
    if(row.last_payout_ts != null) {
      if (row.last_payout_ts >= tx.transaction.ts) {
        return;
      }
    }
    let sql = "";
    let params = {};
    var should_payout = ((row.total_spend / (row.total_payout + 0.01)) >= this.PAYOUT_RATIO);
    //if (row.total_spend > this.CAP) {
    //  should_payout = (row.total_spend % this.CAP) > tx.returnFees();
    //}
    

    var lastPayout = row.last_payout_amt;
    if (lastPayout > this.CAP) {
      lastPayout = this.CAP;
    }
    var newPayout = Math.ceil(lastPayout / this.PAYOUT_RATIO);
    if(newPayout > this.CAP) {
      newPayout = this.CAP;
    }
    
    var isGame = 0;
    if (typeof tx.msg.game_id != "undefined") { isGame = 1 };
    var gameOver = 0;
    if (tx.name == "game over") { gameOver = 1 };
    //welcome folks back if they have been reset - and give me a little somethin.
    if (row.latest_tx == -1) {
      this.makePayout(row.address, (row.total_payout - row.total_spend), "Welcome Back");
    }
    if (should_payout == true) {
      params = {
        $address: row.address,
        $last_payout_ts: tx.transaction.ts,
        $last_payout_amt: newPayout,
        $total_payout: row.total_payout + newPayout,
        $tx_count: row.tx_count + 1,
        $games_finished: row.games_finished + gameOver,
        $game_tx_count: row.game_tx_count + isGame,
        $latest_tx: tx.transaction.ts,
        $total_spend: row.total_spend + Number(tx.returnFees())
      }
      sql = `UPDATE users SET last_payout_ts = $last_payout_ts, last_payout_amt = $last_payout_amt, total_payout = $total_payout, tx_count = $tx_count, games_finished = $games_finished, game_tx_count = $game_tx_count, latest_tx = $latest_tx, total_spend = $total_spend WHERE address = $address`

    } else {
      params = {
        $address: row.address,
        $tx_count: row.tx_count + 1,
        $games_finished: row.games_finished + gameOver,
        $game_tx_count: row.game_tx_count + isGame,
        $latest_tx: tx.transaction.ts,
        $total_spend: row.total_spend + Number(tx.returnFees())
      }
      sql = `UPDATE users SET last_payout_ts = $last_payout_ts, tx_count = $tx_count, games_finished = $games_finished, game_tx_count = $game_tx_count, latest_tx = $latest_tx, total_spend = $total_spend WHERE address = $address`
    }
    let resp = await this.app.storage.executeDatabase(sql, params, "rewards");


    if (should_payout) {
      this.makePayout(row.address, newPayout, "Usage");
    }
  }


  async addUser(tx, ii) {
    try {
      //if first transaction is an encrypt tx - the user was referred.
      //add referral info.
      //if()
      //let sql = "INSERT OR IGNORE INTO users (address, tx_count, games_finished, game_tx_count, first_tx, latest_tx, last_payout_ts, last_payout_amt, total_payout, total_spend, referer) VALUES ($address, $tx_count, $games_finished, $game_tx_count, $first_tx, $latest_tx, $last_payout_ts, $last_payout_amt, $total_payout, $total_spend, $referer);"
      var isGame = 0;
      if (typeof tx.msg.game_id != undefined) { isGame = 1 };
      var referer = ''
      if (tx.msg.module == "Encrypt") {
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
        $last_payout_amt: this.INITIAL,
        $total_payout: this.INITIAL,
        $total_spend: Number(tx.fees_total),
        $referer: referer
      }
      let sql = "INSERT OR IGNORE INTO users (address, tx_count, games_finished, game_tx_count, first_tx, latest_tx, last_payout_ts, last_payout_amt, total_payout, total_spend, referer) VALUES ('" + tx.transaction.from[ii].add + "', " + 1 + ", " + 0 + ", " + isGame + ", " + tx.transaction.ts + ", " + tx.transaction.ts + ", " + tx.transaction.ts + ", " + this.INITIAL + ", " + this.INITIAL + ", " + Number(tx.fees_total) + ", '" + referer + "');";
      params = {};

      await this.app.storage.executeDatabase(sql, params, "rewards");

      //initial funds sent
      this.makePayout(tx.transaction.from[ii].add, this.INITIAL);
      this.makePayout(referer, this.REFERRAL_PAYOUT, "New Referral User");

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

  async returnUserStatus(address) {
    let sql = "SELECT * from users where address = $address";
    let params = {
      $address: address
    }

    try {
      let rows = await this.app.storage.queryDatabase(sql, params, "rewards");
      rows.forEach(row => {
        row.next_payout_amount = Math.ceil(row.last_payout_amt / this.PAYOUT_RATIO);
        row.next_payout_after = Math.ceil((row.total_payout * this.PAYOUT_RATIO) - row.total_spend);
      });

      return rows;
    } catch (err) {
      console.error(err);
    }
  }

  async returnUserreferrals(address) {
    let sql = "SELECT * from users where referer = $address order by total_payout desc";
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
  
  async checkEvent(address, event, daily) {
    let sql = "SELECT * FROM events where address = $address and $event = event";
    let params = {
      $address: address,
      $event: event
    }
    if (daily) {
      let time = (new Date().getTime()) - 24*60*60*1000;
      sql = "SELECT * FROM events where address = $address and $event = event and $time < time";
      params = {
        $address: address,
        $event: event,
        $time: time
      }
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

  // Will allow external callers to easily request the server to make $payouts
  // but will be rate limited. Pool of available payout will be refreshed each
  // time this function is called proportional the amount of time which has
  // passed.
  makePayoutRateLimited(address, amount, event = "") {
    let timePassed = Date.now() - this.lastPayoutTS;
    this.lastPayoutTS = Date.now();
    this.currentRateLimitedPool += this.PAYOUT_RATE_LIMIT_PER_DAY* ( timePassed / (24*60*60*1000));
    if(amount > this.currentRateLimitedPool) {
      amount = this.currentRateLimitedPool;
    }
    this.currentRateLimitedPool -= amount;
    return this.makePayout(address, amount, event = "");
  }

  makePayout(address, amount, event = "") {
    //tamping down on rewards growth
    if (amount > 100) {amount = 100}
    if (this.app.wallet.returnPublicKey() != this.rewards_publickey) { return; }
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

      newtx.msg.module = "Email";
      if (event == "") {
        newtx.msg.title = "Saito Rewards - You have been Rewarded";
      } else {
        newtx.msg.title = "Saito Rewards: " + event;
      }
      newtx.msg.message = `
        <p>You have received <span class="boldred">${amount} tokens</span> from the Saito rewards system.</p>
        `;
      newtx = this.app.wallet.signTransaction(newtx);

      this.app.network.propagateTransaction(newtx);

      this.returnReferer(address)
        .then((referer) => {
          if (referer.length >= 40) {
            if ((amount * this.REFERRAL_BONUS) >= 1) {
              let referralPayment = amount * this.REFERRAL_BONUS;
              this.makePayout(referer, referralPayment, "referral: " + event);
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
