const saito         = require('./saito');

class Bank {

  constructor(app) {

    if (!(this instanceof Bank)) {
      return new Bank(app);
***REMOVED***

    this.app = app || {***REMOVED***;

    this.deposits = [];

    // hashmap for removing / adding deposits
    this.slip_bid_hmap = [];

    return this;

  ***REMOVED***,

  addDeposit(slip) {
  ***REMOVED***



***REMOVED***

class BankDeposit {

  constructor(slip) {

    this.status	= "pending";	// pending
				// active

    this.slip	= slip;

  ***REMOVED***

***REMOVED***



