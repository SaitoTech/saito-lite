const saito         = require('./saito');

class Bank {

  constructor(app) {

    this.app = app || {***REMOVED***;
    this.deposits 		= [];
    this.deposits_hmap		= [];
    this.depositors		= Math.floor(this.app.blockchain.genesis_period * this.app.blockchain.powsplit);
    this.reimbursement		= 0;		// amount re-imbursed during this deposit period

  ***REMOVED***


  //
  // TODO
  //
  // is parseInt safe for large numbers or should we shift to Big.js
  //
  // ? can we use a deliberate refusal to accept large numbers to force certain behavior on stakers ?
  //
  addDeposit(slip) {

    let x 		= {***REMOVED***;
	x.sig		= slip.returnSignatureSource();
	x.slip		= slip;
	x.amt		= slip.amt;
	x.pending	= 1;
	x.next_pos	= -1;

    let pos = this.binaryInsert(this.deposits, x, (a, b) => { return parseInt(a.amt) - parseInt(b.amt) ***REMOVED***);
    this.deposits_hmap[x.sig] = pos;

  ***REMOVED***


  binaryInsert(list, item, compare, search) {

    let start = 0;
    let end = list.length;

    while (start < end) {

      let pos = (start+end) >> 1;
      let cmp = compare(item, list[pos]);

      if (cmp === 0) {
	start = pos;
	end = pos;
	break;
  ***REMOVED*** else if (cmp < 0) {
	end = pos;
  ***REMOVED*** else {
	start = pos+1;
  ***REMOVED***

***REMOVED***

    if (!search) { list.splice(start, 0, item); ***REMOVED***

    return start;

  ***REMOVED***


  returnWinner(gt, already_selected_stakers=[]) {

    if (this.deposits.length == 0) {
      return { publickey : gt.publickey , updated_selected_stakers : already_selected_stakers ***REMOVED***
***REMOVED***

    //
    // random decimal between 0-1 to pick winner
    //
    let winnerHash = this.app.crypto.hash(gt.random).slice(0, 12);
    let winnerNum  = parseInt(winnerHash, 16); // 16 because number is hex
    let winner     = winnerNum % this.depositors;

    //
    // find next unpaid depositor
    //
    let starting_pos       = winner;
    let ending_pos         = winner;
    let selected_depositor = this.deposits[winner];

    //
    // find next depositor
    //    
    while (selected_depositor.pending == 0 && (!already_selected_stakers.includes(ending_pos))) {
      console.log("looping while looking for depositor...");
      if (selected_depositor.next_pos == -1) {
	ending_pos--;
	if (ending_pos < 0) { 
	  ending_pos = this.deposits.length-1; 
	***REMOVED***
  ***REMOVED*** else {
	ending_pos = selected_depositor.next_pos;
  ***REMOVED***
***REMOVED***
    if (ending_pos != starting_pos) {
      this.deposits[starting_pos].next_pos = ending_pos;
***REMOVED***


    already_selected_stakers.push(ending_pos);
    return { publickey : this.deposits[ending_pos].slip.add, updated_selected_stakers : already_selected_stakers ***REMOVED***
  ***REMOVED***


***REMOVED***


module.exports = Bank;


