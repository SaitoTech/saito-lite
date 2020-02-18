const saito         = require('./saito');

class Bank {

  constructor(app) {

    this.app = app || {};

    this.deposits 			= []; // array ordered by amount --> holds all deposits
    this.deposits_sig_pos_hmap		= []; // maps slip sig to pos in deposits table
    this.deposits_bsh_posarray_hmap  	= []; // maps bsh to array of pos in deposits table

    this.depositors			= Math.floor(this.app.blockchain.genesis_period * this.app.blockchain.powsplit);

    this.reimbursement_amount		= 0;  // amount re-imbursed to each staker
    this.reimbursement_loop		= 0;
    this.reimbursements_remaining	= 0;
    this.reimbursement_index		= []; // hashmap of rdeposits

  }




  onChainReorganization(bid, bsh, lc) {
/****
    if (lc == 0) {
      let posarray = this.deposits_bsh_posarray_hmap[bsh];
      for (let i = 0; i < posarray.length; i++) {
        this.deposits[posarray[i]].pending = 1;
      }
    }

    if (lc == 1) {
      let posarray = this.deposits_bsh_posarray_hmap[bsh];
      for (let i = 0; i < posarray.length; i++) {
        this.deposits[posarray[i]].pending = 0;
      }
    }
****/
  }



  //
  // inserts a slip into the deposits[] array, ordered by TX amount
  //
  addDeposit(slip) {

    let x 		= {};
	x.sig		= slip.returnSignatureSource();
	x.slip		= slip;
	x.amt		= slip.amt;
	x.pending	= 1;
	x.lc            = 0;

    let pos = this.binaryInsert(this.deposits, x, (a, b) => { return parseInt(a.amt) - parseInt(b.amt) });
    this.deposits_sig_pos_hmap[x.sig] = pos;

  }


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
      } else if (cmp < 0) {
	end = pos;
      } else {
	start = pos+1;
      }

    }

    if (!search) { list.splice(start, 0, item); }

    return start;

  }


  saveWinners(blk, already_selected_stakers) {

    let bsh = blk.returnHash();

    for (let i = 0; i < already_selected_stakers.length; i++) {

    }

    this.deposits_sig_posy_hmap	= []; // maps sigs of slip to pos of slip in deposits table
    this.deposits_bsh_posarray_hmap  	= []; // maps bsh of block to pos of slip in deposits table
  }


  returnWinningStaker(gt, stakers=[], gtrandom) {

    let results = {};
        results.publickey 	= gt.publickey;
        results.stakers		= stakers;

    //
    // no deposits on file
    //
    if (this.deposits.length == 0) {
      return results;
    }

    //
    // if we cannot pick a winner, create a new 
    // reimbursements table
    // 
    if (this.reimbursements_remaining == 0) {

    }

    //
    // random decimal between 0-1 to pick winner
    //
    let winnerHash = this.app.crypto.hash(gtrandom).slice(0, 12);
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
      ending_pos--;
      if (ending_pos < 0) { 
        ending_pos = this.deposits.length-1; 
      }
    }

    results.publickey = this.deposits[ending_pos].slip.add;
    results.stakers.push(ending_pos);
    return results;
  }


}


module.exports = Bank;


