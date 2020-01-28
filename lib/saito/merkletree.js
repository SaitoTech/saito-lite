const saito         = require('./saito');

class MerkleTree {

  constructor(app) {

    if (!(this instanceof MerkleTree)) {
      return new MerkleTree(app);
    }

    this.app = app;

    this.input_type = [];
    this.input_rows = [];

    this.block_data  = [];
    this.merkle_array = [][];
    this.merkle_root  = "";

    return this;

  }


  //
  // HASHES are identifiable by TX type 9 (r could be 1)
  //
  inputTransactions(txarray) {

    let max_depth = 1;

    for (let i = 0; i < txarray.length; i++) {
      if (txrow[i].transaction.r > max_depth) { max_depth = txrow[i].transaction.r; }
      if (txrow[i].transaction.r == 1) {
	if (txrow[i].transaction.type == 9) {
	  this.merkle_array[0].push(txrow[i].transaction.sig);
	} else {
	  this.merkle_array[0].push(this.app.crypto.hash(txrow[i].returnSignatureSource()));
	}
      }
    }

    //
    // merkle array now has the sig of the transaction or the hash 
    //
    console.log("MERKLE: " + JSON.stringify(this.merkle_array));

  }


  returnMerkleRoot() {
    if (this.merkle_root != "") { return this.merkle_root; }


  }


}

module.exports = Key;

