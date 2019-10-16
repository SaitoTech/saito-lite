const saito    = require('./saito');


/**
 * Construtor 
 **/
function Archives(app) {

  if (!(this instanceof Archives)) {
    return new Archives();
  }

  this.app                 = app || {};
  this.messages            = [];
  this.local_storage_limit = 40;

  return this;

}
module.exports = Archives;



/**
 * fetch our messages from browser storage
 **/
Archives.prototype.initialize = function initialize() {

  //
  // load messages locally
  //
  if (this.app.BROWSER == 1) {
    if (typeof(Storage) !== "undefined") {
      let data = localStorage.getItem("messages");
      this.messages = JSON.parse(data);
      if (this.messages == null) { this.messages = []; }
    }
  }

}


/**
 * Does our archive contain a specific transaction
 **/
Archives.prototype.containsTransaction = function containsTransaction(tid) {
  for (let i = this.messages.length-1; i >= 0; i--) {
    if (this.messages[i].transaction.id == tid) { return 1; }
  }
  return 0;
}


/**
 * Return transaction by ID
 **/
Archives.prototype.returnTransactionById = function returnTransactionById(tid) {
  for (let i = this.messages.length-1; i >= 0; i--) {
    if (this.messages[i].transaction.id == tid) { return this.messages[i]; }
  }
  return null;
}

/**
 * Return transaction by SIG
 **/
Archives.prototype.returnTransactionBySig = function returnTransactionBySig(sig) {
  for (let i = this.messages.length-1; i >= 0; i--) {
    if (this.messages[i].transaction.sig == sig) { return this.messages[i]; }
  }
  return null;
}

/**
 * Return transaction by tx signature
 **/
Archives.prototype.returnTransactionBySig = function returnTransactionBySig(sig) {
  for (let i = this.messages.length-1; i >= 0; i--) {
    if (this.messages[i].transaction.sig == sig) { return this.messages[i]; }
  }
  return null;
}



/**
 * Remove a message from our archives
 **/
Archives.prototype.removeMessage = function removeMessage(sig) {

  for (let n = this.messages.length-1; n >= 0; n--) {
    if (this.messages[n].transaction.sig == sig) {
      this.messages.splice(n,1);
      this.saveArchives();
      return;
    }
  }

}




/**
 * Reset our archives to have no messages in them
 **/
Archives.prototype.resetArchives = function resetArchives() {

  this.messages = [];

  if (this.app.BROWSER == 1) {
    if (typeof(Storage) !== "undefined") {
      localStorage.setItem("messages", JSON.stringify(this.messages));
    }
  }

}



/**
 * saves our messages to the browser storage
 **/
Archives.prototype.saveArchives = function saveArchives() {
  if (this.app.BROWSER == 1) {
    if (typeof(Storage) !== "undefined") {
      localStorage.setItem("messages", JSON.stringify(this.messages));
    }
  }
  this.app.storage.saveOptions();
}





/**
 * Modules run this function to load messages. They ask us to give them
 * a certain number of messages, and we comply and submit those messages
 * to them as part of a callback.
 *
 * @params {integer} number of messages to load
 * @params {callback} callback
 *
 **/
Archives.prototype.processTransactions = function processTransactions(number, callback) {

  var txs = [];
  var err = {};

  let starting_point = this.messages.length - number;
  if (starting_point < 0) { starting_point = 0; };

  for (let n = starting_point, m = 0; n < this.messages.length; n++) {
    var t = new saito.transaction();
    try {
      if (this.messages[n].transaction != undefined) {
        t.transaction = this.messages[n].transaction;
        t.dmsg = this.messages[n].dmsg;
        txs[m] = t;
        m++;
      } else {}
    } catch (err) {}
  }
  callback(err, txs);
}




/**
 * save a transaction
 *
 * @params {saito.transaction} tx to save
 **/
Archives.prototype.saveTransaction = function saveTransaction(tx) {

  if (this.app.BROWSER == 1) {
    if (typeof(Storage) !== "undefined") {

      let data = localStorage.getItem("messages");
      this.messages = JSON.parse(data);

      if (this.messages == null) {
        //this.app.logger.logInfo("resetting Message array in Archives saveTransaction");
        this.messages = [];
      }

      // no duplicates
      for (let i = 0; i < this.messages.length; i++) {
        if (this.messages[i].transaction.mhash === tx.transaction.mhash) {
          return;
        }
      }

      // if we are at our local storage limit remove the
      // last email and add our new one to the top
      if (this.messages.length == this.local_storage_limit) {
        for (let i = 0; i < this.messages.length-1; i++) {
          this.messages[i] = this.messages[i+1];
        }
        this.messages[this.messages.length-1] = tx;
      } else {
        this.messages.push(tx);
      }
      localStorage.setItem("messages", JSON.stringify(this.messages));
    }
  }

}

