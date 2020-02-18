const saito = require('./saito');
const Big = require('big.js');


/////////////////
// Constructor //
/////////////////
function GoldenTicket(app, gtjson = "") {

  if (!(this instanceof GoldenTicket)) {
    return new GoldenTicket(app, gtjson);
  }
  this.app = app || {};

  this.solution                 = {};
  this.solution.name            = "golden ticket";
  this.solution.target          = "";
  this.solution.random          = "";
  this.solution.publickey       = "";

  if (gtjson != "") {
    try {
      this.solution = JSON.parse(gtjson);
    } catch (err) {
      return null;
    }
  }


  return this;

}

module.exports = GoldenTicket;


GoldenTicket.prototype.formatSolutionForGoldenTicket = function formatSolutionForGoldenTicket(blk, r) {

  this.solution.name            = "golden ticket";
  this.solution.target          = blk.returnHash();
  this.solution.random          = r;
  this.solution.publickey       = this.app.wallet.returnPublicKey();

  return(this.solution);
}

GoldenTicket.prototype.isValidSolution = function isValidSolution(sol, blk) {

    // Set the number of digits to match - difficultyOrder
    // As our difficulty is granular to several decimal places
    // we check that the last digit in the test is within the
    // difficultyGrain - the decimal part of the difficulty
    //
    let difficultyOrder = Math.floor(blk.returnDifficulty());
    let difficultyGrain = blk.returnDifficulty() % 1;

    // We are testing our generated hash against the hash of the previous block.
    // th is the test hash.
    // ph is the previous hash.
    //
    let th = parseInt(sol.slice(0,difficultyOrder+1),16);
    let ph = parseInt(blk.returnHash().slice(0,difficultyOrder+1),16);

    if (th >= ph && (th-ph)/16 <= difficultyGrain) {
      return true;
    }
    return false;
}



GoldenTicket.prototype.validateTicket = function validateTicket(prevblk, publickey) {

  if (prevblk == null) { return 1; }
  if (this.solution.target != prevblk.returnHash()) { return 0; }
  let ticket = this.app.crypto.hash(this.solution.publickey + this.solution.random);
  if (this.isValidTicket(ticket, prevblk)) { return 1; }

  return 0;

}


/*****

GoldenTicket.prototype.calculateMonetaryPolicy = function calculateMonetaryPolicy(prevblk) {

  let prev_treasury  = prevblk.returnTreasury();
  let prev_reclaimed = prevblk.returnReclaimed();
  let prev_coinbase  = prevblk.returnCoinbase();

  let new_treasury = Big(prev_treasury).plus(Big(prev_reclaimed));
  let new_coinbase = Big(new_treasury).div(prevblk.app.blockchain.returnGenesisPeriod()).toFixed(8);
      new_treasury = Big(new_treasury).minus(Big(new_coinbase)).toFixed(8);

  var mp = [];
  mp[0]  = new_treasury;
  mp[1]  = new_coinbase;

  return mp;

}

GoldenTicket.prototype.returnGoldenTicketContenders = function returnGoldenTicketContenders(blk=null) {

  var children = [];

  if (blk == null) { return children; }
  if (blk.transactions == null) { return children; }
  if (blk.transactions.length == 0) { return children; }

  for (var v = 0; v < blk.transactions.length; v++) {

    //
    // only new paying transactions eligible
    //
    if (blk.transactions[v].transaction.type == 0) {
      if (blk.transactions[v].transaction.path.length == 0) {

        //
        // no path length, so add sender
        //
        children.push(blk.transactions[v].transaction.from[0].add);

      } else {

        // otherwise, we pick the destination node in each hop through
        // the transmission path. this eliminates the sender and keeps
        // the focus on nodes that actively transmitted the message
        //
        // NOTE: this is not weighted according to the relative value of
        // each node during the transmission process. We can add that
        // later and should to ensure that payout reflects value of the
        // txs being introduced into the network.
        //
        for (var x = 0; x < blk.transactions[v].transaction.path.length; x++) {
          children.push(blk.transactions[v].transaction.path[x].to);
        }
      }
    }
  }
  return children;

}


GoldenTicket.prototype.validateMonetaryPolicy = function validateMonetaryPolicy(adjusted_treasury, adjusted_coinbase, prevblk) {

  let mp = this.calculateMonetaryPolicy(prevblk);

  if (mp[0] != adjusted_treasury) {
    console.log(`Treasury invalid: ${adjusted_treasury} -- ${mp[0]}`);
    return 0;
  }
  if (mp[1] != adjusted_coinbase) {
    console.log(`Coinbase invalid: ${adjusted_coinbase} -- ${mp[1]}`);
    return 0;
  }

  return 1;

}


GoldenTicket.prototype.calculateDifficulty = function calculateDifficulty(prevblk) {

  if (this.solution.vote == -1) {
    return (prevblk.returnDifficulty() - 0.01);
  }
  if (this.solution.vote == 1) {
    return (prevblk.returnDifficulty() + 0.01);
  }
  return prevblk.returnDifficulty();
}


*****/





