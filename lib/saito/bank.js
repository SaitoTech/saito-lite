const saito         = require('./saito');

class Bank {

  constructor(app) {

    if (!(this instanceof Bank)) {
      return new Bank(app);
    }

    this.app = app || {};

    this.deposits = [];

    // hashmap for removing / adding deposits
    this.slip_bid_hmap = [];

    return this;

  },

  addDeposit(slip) {
  }



}

class BankDeposit {

  constructor(slip) {

    this.status	= "pending";	// pending
				// active

    this.slip	= slip;

  }

}



