 saito = require('./saito');
const Big = require('big.js');

class Blockchain {

  constructor(app) {
    this.app                   = app || {};

    this.index		     	= {};
    this.index.blocks		= [];
    this.index.paths		= [];
    this.index.stakers          = [];

    // TODO: init these as {}
    //
    // Blockhash->LiteClient Map
    this.bsh_lc_hmap           	= [];
    // Blockhash->BlockID Map
    this.bsh_bid_hmap          	= [];
    // BlockID->Blockhash  Map
    this.bid_bsh_hmap          	= [];
    // Blockhash->Timestampe  Map
    this.bsh_ts_hmap          	= [];
    // LiteClient Proof-of-stake
    this.lc_pos_set          	= false
    this.lc_pos             	= 0;
    this.last_lc_pos		= 0;

    this.process_blocks		= 1;
    this.run_callbacks		= 1;
    this.callback_limit		= 50;
    if (this.app.BROWSER == 1) {
      this.callback_limit = 10;
    }

    this.fork_id			= "";
    this.fork_id_mod		= 10;		// regenerate every N blocks

    this.genesis_ts            	= 0;
    this.genesis_bid           	= 0;
    this.genesis_period       	= 100000;

    this.last_bsh              	= "";
    this.last_bid              	= 0;
    this.last_ts               	= 0;
    this.last_bf              	= 0.0;
    this.lowest_acceptable_ts  	= 0;
    this.lowest_acceptable_bsh 	= "";
    this.lowest_acceptable_bid	= 0;

    this.indexing_active         = 0;
    this.loading_blocks_from_disk_active = 1;

    //
    // staking vars
    //
    // these keep track of hte lowest paid staker block, so that we do not have
    // to start by searching from 0 each time if we are just building atop the
    // longest chain. TODO - optimization improvements on unroll and reroll, as
    // right now we just reset to 0 whenever the chain removes a block, which is
    // a wasteful prompt.
    //
    this.lowest_unspent_bid     = 0;
    this.lowest_unspent_pos     = 0;

    //
    // have we added a block
    //
    this.added_block  		= 0;
 
  }




  /***
   * Adds block hash to blockchain
   *
   * This is used by lite-clients who fetch the chain hash from a peer
   * and just want to insert the hash values.
   *
  ***/
  async addHashToBlockchain(hash, ts, bid, prevbsh, force=false) {

    this.indexing_active = 1;

    ////////////////////
    // insert indexes //
    ////////////////////
    let blk 			= new saito.block(this.app);
	blk.block.ts		= ts;
	blk.block.prevbsh	= prevbsh;
	blk.block.id		= bid;
	blk.hash		= hash;
	blk.ghost		= 1;

    let pos = this.binaryInsert(this.index.blocks, blk, (a, b) => { return a.block.ts - b.block.ts; });
    this.index.paths.splice(pos, 0, [])
    this.index.stakers.splice(pos, 0, [])

    /////////////////////
    // update hashmaps //
    /////////////////////
    this.bsh_lc_hmap[blk.hash]  = 0;
    this.bsh_bid_hmap[blk.hash] = bid;


    if (pos <= this.last_lc_pos && this.index.blocks.length > 1) {
      this.last_lc_pos++;
    }
    if (pos <= this.lc_pos && this.index.blocks.length > 1) {
      this.lc_pos++; 
    } else {
      if (this.bid_bsh_hmap[bid] == undefined) {
        if (this.bsh_lc_hmap[prevbsh] == 1) {
  	  this.bsh_lc_hmap[blk.hash] = 1;
	  this.lc_pos = pos;
        } else {
          if (this.last_bsh == prevbsh) {
            if (this.bid_bsh_hmap[bid] == undefined) {
	      this.bsh_lc_hmap[blk.hash] = 1;
	      this.lc_pos = pos;
	    }
	  }
	}
      }
    }

    if (this.bsh_lc_hmap[blk.hash] == 1) {
      this.bid_bsh_hmap[bid]	= blk.hash;
    }
    this.bsh_ts_hmap[blk.hash]	= ts;

    if (this.index.blocks.length == 1) {
      this.bsh_lc_hmap[blk.hash] = 1;
    }

    // update longest-chain
    this.indexing_active = 0;
    return;

  }





  async addBlockToBlockchain(blk, force=false) {

    //
    // only the active tab will process blocks
    //
    if (this.app.BROWSER == 1) {
      if (this.process_blocks == 0) {
console.log("---------------------------------------------");
console.log("-- inactive tab, bailing in blockchain.js -- ");
console.log("---------------------------------------------");
	return; 
      }
    }



    this.indexing_active = 1;

    ///////////////////
    // SANITY CHECKS //
    ///////////////////
    if (blk.is_valid == 0) {
      console.log("ERROR 178234: block is not valid when adding to chain. terminating...");
      this.indexing_active = 0;
      return;
    }


    if ((blk.block.ts < this.genesis_ts || blk.block.id < this.genesis_bid) && force != true) {
      console.log("ERROR 792837: block id precedes genesis period. terminating...");
      this.indexing_active = 0;
      return;
    }

    if (this.isHashIndexed(blk.returnHash())) {
      console.log("ERROR 582039: blockchain already contains this block hash. terminating...");
      this.indexing_active = 0;
      return;
    }


    //
    // pos --> position in header / blocks index
    //
    this.last_lc_pos = this.lc_pos;

    //
    // previous block not indexed, but acceptable
    //
    if (blk.block.ts < this.lowest_acceptable_ts) {
      this.lowest_acceptable_ts = blk.block.ts;
    }


    //
    // track first block
    //
    // if we are adding our first block, we set this as our lowest
    // acceptable ts to avoid requesting earlier blocks ad infinitum
    // into the past.
    //
    // lowest acceptable bid must be updated so that we know the
    // earliest block we need to worry about when handling full slip
    // validation.
    //
    if (this.lowest_acceptable_ts == 0) {

      this.lowest_acceptable_bid = blk.block.id;
      this.lowest_acceptable_bsh = blk.returnHash();
      this.lowest_acceptable_ts = this.last_ts;

      if (this.lowest_acceptable_ts == 0) {
        this.lowest_acceptable_ts = blk.block.ts;
      }

    } else {

      if (this.lowest_acceptable_ts > blk.block.ts) {
        if (!force) {
          this.lowest_acceptable_ts = blk.block.ts;
        }
      }

    }


    //
    // fetch missing blocks
    //
    if (blk.block.ts > this.lowest_acceptable_ts) {
      if (!this.isHashIndexed(blk.block.prevbsh))  {
        if (this.lc_pos_set == true) {
          if (blk.block.id > (this.index.blocks[this.lc_pos].block.bid - this.genesis_period)) {

            //
            // TODO - request missing block
            //
            var response            = {};
            response.request        = "missing block";
            response.data           = {};
            response.data.hash      = blk.block.prevbsh;
            response.data.last_hash = this.returnLatestBlockHash();

            this.app.network.sendRequest(response.request, JSON.stringify(response.data));

          }
        }
      }
    }




    ////////////////////
    // insert indexes //
    ////////////////////
    let pos = this.binaryInsert(this.index.blocks, blk, (a, b) => { return a.block.ts - b.block.ts; });

    if (pos <= this.last_lc_pos && this.index.blocks.length > 1) {
      this.last_lc_pos++;
    }
    if (pos <= this.lc_pos && this.index.blocks.length > 1) {
      this.lc_pos++; 
    }
    this.bsh_bid_hmap[blk.returnHash()] = blk.block.id;
    this.bsh_ts_hmap[blk.returnHash()] = blk.block.ts;

    this.index.paths.splice(pos, 0, [])
    this.index.stakers.splice(pos, 0, [])

    ////////////////////////////
    // identify longest chain //
    ////////////////////////////
    let i_am_the_longest_chain		= 0;
    let shared_ancestor_pos	  	= 0;
    let shared_ancestor_pos_found	= false;


    ///////////////////
    // wind / unwind //
    ///////////////////
    let new_chain_bsh			= [];
    let old_chain_bsh			= [];
    let new_chain_pos			= [];
    let old_chain_pos			= [];



    //
    // the following code attempts to identify whether the new block forms part of the 
    // longest-chain. it does this by rolling the existing longest-chain block and the 
    // new longest-chain block backwards and seeing which one has the most accumulated
    // work.
    //
    // the initial checks are sanity-checks on startup that allow us to start with the
    // longest chain if we are just starting to sync the chain. the longest code down 
    // below with nchain / lchain (new chain / longest chain) are the bits that do the 
    // heavy-lifting.
    //
    // the loop also creates the arrays of POS and BSH data needed for submission to 
    // validating the new (proposed) blockchain and unwinding / winding our latest
    // data.
    //
    if (this.index.blocks.length == 1) {
      i_am_the_longest_chain = 1;

      this.lc_pos = pos;

      this.last_bsh = blk.returnHash();
      this.last_bid = blk.block.id;
      this.last_bf  = blk.block.bf;
      this.last_ts  = blk.block.ts;

      new_chain_bsh.push(blk.returnHash());
      new_chain_pos.push(pos);

    }


    if (this.last_bsh == blk.block.prevbsh && this.index.blocks.length > 1) {

      //
      // last block is longest chain
      //
      if (this.bsh_lc_hmap[this.last_bsh] == 1) {

        i_am_the_longest_chain = 1;
        shared_ancestor_pos = this.last_lc_pos;
        new_chain_bsh.push(blk.returnHash());
        new_chain_pos.push(pos);

      }
    }




    //
    // trace back to find shared ancestor
    //
    if (i_am_the_longest_chain == 0) {

      if (blk.block.id >= this.index.blocks[this.lc_pos].block.id) {

        //
        // find the last shared ancestor
        //
        let lblk = this.index.blocks[this.lc_pos];
        let nblk = this.index.blocks[pos];

        if (blk.block.prevbsh == lblk.returnHash()) {

          i_am_the_longest_chain = 1;

	  new_chain_bsh.push(blk.returnHash());
	  new_chain_pos.push(pos);

        } else {

          let lchain_pos 		= this.lc_pos;
          let nchain_pos 		= pos;
          let lchain_len 		= 0;
          let nchain_len 		= 0;
          let lchain_bf  		= lblk.block.bf;
          let nchain_bf  		= nblk.block.bf;

          let lchain_ts  		= lblk.block.ts;
          let nchain_ts  		= nblk.block.ts;
          let lchain_prevbsh		= lblk.block.prevbsh;
          let nchain_prevbsh		= nblk.block.prevbsh;

          let search_pos       		= null;
          let search_bf        		= null;
          let search_ts        		= null;
          let search_bsh      		= null;
          let search_prevbsh  		= null;


          old_chain_bsh.push(lblk.returnHash());
	  old_chain_pos.push(this.lc_pos);
          new_chain_bsh.push(blk.returnHash());
	  new_chain_pos.push(pos);


          if (nchain_ts >= lchain_ts) {
            search_pos 			= nchain_pos - 1;
          } else {
            search_pos 			= lchain_pos - 1;
          }

          while (search_pos >= 0) {

            let sblk = this.index.blocks[search_pos];

            search_ts	    = sblk.block.ts;
            search_bf       = sblk.block.bf;
            search_bsh      = sblk.returnHash();
            search_prevbsh  = sblk.block.prevbsh;


            //
            // hey look, it's the common ancestor!
            //
            if (search_bsh == lchain_prevbsh && search_bsh == nchain_prevbsh) {
              shared_ancestor_pos_found = true;
              shared_ancestor_pos = search_pos;
              search_pos = -1;

            //
            // keep looking
            //
            } else {

              if (search_bsh == lchain_prevbsh) {
                lchain_len++;
                lchain_prevbsh = this.index.blocks[search_pos].block.prevbsh;
                lchain_bf = lchain_bf + this.index.blocks[search_pos].block.bf;
		old_chain_bsh.push(search_bsh);
		old_chain_pos.push(search_pos);

              }

              if (search_bsh == nchain_prevbsh) {
                nchain_prevbsh = this.index.blocks[search_pos].block.prevbsh;
                nchain_len++;
                nchain_bf = nchain_bf + this.index.blocks[search_pos].block.bf;
		new_chain_bsh.push(search_bsh);
		new_chain_pos.push(search_pos);
              }

              shared_ancestor_pos = search_pos;
              search_pos--;

              //
              // new chain completely disconnected
              //
              if (shared_ancestor_pos == 1) {
                if (nchain_prevbsh == "") {
                  await this.addBlockToBlockchainSuccess(blk, pos, 0);
                  await this.handleTransactionSlips(blk, pos);
                  this.app.mempool.removeBlockAndTransactions(blk);
		  this.indexing_active = 0;
                  return;
                }
              }
              if (shared_ancestor_pos == 0) {
                if (nchain_prevbsh != lchain_prevbsh) {
                  await this.addBlockToBlockchainSuccess(blk, pos, 0);
                  await this.handleTransactionSlips(blk, pos);
                  this.app.mempool.removeBlockAndTransactions(blk);
		  this.indexing_active = 0;
                  return;
                }
              }
            }
          }

          //
          // longest chain if more routing AND burning work
          //
          if (nchain_len > lchain_len && nchain_bf >= lchain_bf && shared_ancestor_pos_found == true) {
            i_am_the_longest_chain = 1;
          }
        }
      } else {

        //
        // this catches an edge case that happens if we ask for blocks starting from
        // id = 132, but the first block we RECEIVE is a later block in that chain,
        // such as 135 or so.
        //
        // in this case our blockchain class will treat the first block as the starting
        // point and we run into issues unless we explicitly reset the blockchain to
        // treat block 132 as the proper first block.
        //
        // so we reset this to our first block and mark it as part of the longest chain
        // the network will figure this out in time as further blocks build on it.
        //
        if (blk.block.prevbsh == this.last_bsh && blk.block.prevbsh != "") {

          //console.log("edge case with unordered blocks...");

          //
          // reset later blocks
          //
          for (let h = pos+1; h < this.index.blocks.length; h++) {

            this.bsh_lc_hmap[this.index.blocks[h].returnHash()] = i_am_the_longest_chain;
            //
            // onChainReorganization
            //
            this.onChainReorganization(this.index.blocks[h].block.id, this.index.blocks[h].returnHash(), 0, pos);
          }

          i_am_the_longest_chain = 1;
          new_chain_bsh.push(blk.returnHash());
          new_chain_pos.push(pos);
        }
      }
    }


    //
    // insert into LC hashmap
    //
    this.bsh_lc_hmap[this.index.blocks[pos].returnHash()] = i_am_the_longest_chain;

    //
    // update blockchain state variables depending
    //
    if (i_am_the_longest_chain == 1) {

      this.last_bsh  = this.index.blocks[pos].returnHash();
      this.last_bf   = this.index.blocks[pos].block.bf;
      this.last_ts   = this.index.blocks[pos].block.ts;
      this.last_bid  = this.index.blocks[pos].block.id;

      this.lc_pos = pos;
      this.lc_pos_set = true;

    }

    //
    // by now we know if our block forms part of the longest chain, or not. we
    // need to add its slips to our hashmap and staking indices, but do not 
    // necessarily need to validate them all unless this block is supposed to 
    // be part of the longest chain.
    //
    // the code below either inserts the slip data into the indices needed and
    // skips right to add-block-to-blockchain-success or (if we are dealing with
    // the longest chain and a new block there) we go through full slip validation
    // as well, kicking into the blockchain.validate() function which triggers
    // unwinding and then rewinding the chain.
    //


    //
    // first block (lc = 0, need two blocks for chain)
    //
    if (i_am_the_longest_chain == 1 && this.index.blocks.length == 1) {

      //
      // block #1 needs hashmap
      //
      for (let i = 0; i < blk.transactions.length; i++) {
        try { this.app.shashmap.insert_new_transaction(blk, blk.transactions[i]); } catch (err) {}
      }

      //
      // validate is necessary as it adds outputs to hashmap
      //
      await this.validate(blk, pos, 1, [blk.returnHash()], [], [pos], [], force);
      await this.handleTransactionSlips(blk, pos);
      this.app.mempool.removeBlockAndTransactions(blk);
      this.indexing_active = 0;
      return;

    }


    //
    // non longest-chains
    //
    if (i_am_the_longest_chain == 0) {
      await this.addBlockToBlockchainSuccess(blk, pos, 0);
      await this.handleTransactionSlips(blk, pos);
      this.app.mempool.removeBlockAndTransactions(blk);
      this.indexing_active = 0;
      return;
    }


    //
    // if we hit this point we have a chain reorganization, and need to pass
    // new and old chain information to the blockchain validation function, which
    // unwinds / winds the chain
    //
    new_chain_bsh.reverse();
    old_chain_bsh.reverse();
    new_chain_pos.reverse();
    old_chain_pos.reverse();

    await this.validate(
      blk,
      pos,
      i_am_the_longest_chain,
      new_chain_bsh,
      old_chain_bsh,
      new_chain_pos,
      old_chain_pos,
      force
    );
    await this.handleTransactionSlips(blk, pos);
    this.app.mempool.removeBlockAndTransactions(blk);
    this.indexing_active = 0;

  }



  async initialize() {

    try {

      if (this.app.options.blockchain != undefined) {
        if (this.app.options.blockchain.genesis_period != undefined) {

          this.last_bid			= this.app.options.blockchain.last_bid;
          this.last_bsh			= this.app.options.blockchain.last_bsh;
          this.last_ts			= this.app.options.blockchain.last_ts;
          this.last_bf			= this.app.options.blockchain.last_bf;
          this.genesis_ts		= this.app.options.blockchain.genesis_ts;
          this.genesis_bid		= this.app.options.blockchain.genesis_bid;
          this.genesis_period		= this.app.options.blockchain.genesis_period;

          this.lowest_acceptable_ts	= this.app.options.blockchain.lowest_acceptable_ts;
          this.lowest_acceptable_bsh 	= this.app.options.blockchain.lowest_acceptable_bsh;
          this.lowest_acceptable_bid	= this.app.options.blockchain.lowest_acceptable_bid;
        }
      }

      this.loading_blocks_from_disk_active = 1;
      await this.app.storage.loadBlocksFromDisk(this.genesis_period*2);
      this.loading_blocks_from_disk_active = 0;

    } catch (err) {
      console.log(err);
    }

  }



  isFullySynced() {
    let x = this.last_bid - this.genesis_period;
    if (x < 0) { 

      // we are if our first block on the longest chain is BID 0
      if (this.index.blocks[0].block.id == 1) { return true; }
      return false;

    }
    if (this.index.blocks.length >= this.genesis_period || x <= 0) {
      if (x > this.lowest_acceptable_bid || (x <= 0 && this.lowest_acceptable_bid == 1)) {
        return true;
      }
    }
    return false;
  }



  async handleTransactionSlips(blk, pos) {

    //
    // insert to shashmap
    //
    for (let i = 0; i < blk.transactions.length; i++) {

      //
      // add to shashmap
      //
      try { this.app.shashmap.insert_new_transaction(blk, blk.transactions[i]); } catch (err) {}

      //
      // new staking slips
      //
      if (blk.transactions[i].transaction.type == 4 || blk.transactions[i].transaction.type == 2) {
	for (let ii = 0; ii < blk.transactions[i].transaction.to.length; ii++) {
	  if (blk.transactions[i].transaction.to[ii].type == 4) {
	    let newslip = new saito.slip(
	      blk.transactions[i].transaction.to[ii].add,
	      blk.transactions[i].transaction.to[ii].amt,
	      blk.transactions[i].transaction.to[ii].type,
	      blk.transactions[i].transaction.to[ii].bid,
	      blk.transactions[i].transaction.to[ii].tid,
	      blk.transactions[i].transaction.to[ii].sid,
	      blk.transactions[i].transaction.to[ii].bsh,
	      blk.transactions[i].transaction.to[ii].lc
	    );
	    this.addStakingSlip(blk, newslip, pos);
	  }
        }
      }
    }

  }



  async validate(blk, pos, i_am_the_longest_chain, new_block_hashes, old_block_hashes, new_chain_pos, old_chain_pos, force=false) {

    //
    // unwind and wind
    //
    if (old_block_hashes.length > 0) {
      await this.unwindChain(
        blk,
        pos,
        i_am_the_longest_chain,
        new_block_hashes,
        old_block_hashes,
        force,
        0,
        old_block_hashes.length-1,
	new_chain_pos,
	old_chain_pos
      );
    } else {
      await this.windChain(
        blk,
        pos,
        i_am_the_longest_chain,
        new_block_hashes,
        old_block_hashes,
        force,
        0,
        0,
	new_chain_pos,
	old_chain_pos
      );
    }

    return;

  }

  async windChain(blk, pos, i_am_the_longest_chain, new_block_hashes, old_block_hashes, force, resetting_flag, current_wind_index, new_chain_pos, old_chain_pos) {

    let this_block_hash = new_block_hashes[current_wind_index];

    //
    // this is the last block to add
    //
    if (blk.returnHash() === this_block_hash) {

      let does_block_validate = 0;

      if (blk.validates == 1) { 
	does_block_validate = 1;
      } else {
	does_block_validate = await blk.validate();
      }

      if (does_block_validate) {

        //
        // we do not handle onChainReorganization for everything
        // here as we do for older blocks. the reason for this is
        // that the block is not yet saved to disk.
        //
        // onChainReorganization is run on addBlockToBlockchainSuccess
        //

        //
        // spend shashmap
        //
        for (let i = 0; i < blk.transactions.length; i++) {
          try { this.app.shashmap.spend_transaction(blk.transactions[i], blk.block.id); } catch (err) {}
        }

        await this.addBlockToBlockchainSuccess(blk, pos, i_am_the_longest_chain, force);
        return;

      } else {

        //
        // the block does not validate, unwind
        //
        if (current_wind_index == 0) {

          // this is the first block we have tried to add
          // and so we can just roll out the older chain
          // again as it is known good.
          //
          // note that old and new hashes are swapped
          // and the old chain is set as null because
          // we won't move back to it. we also set the
          // resetting_flag to 1 so we know to fork
          // into addBlockToBlockchainFailure
          //
          if (old_block_hashes.length > 0) {
            await this.windChain(
              blk,
              pos,
              i_am_the_longest_chain,
              old_block_hashes,
              new_block_hashes,
              force,
              1,
              0,
              old_chain_pos,
              new_chain_pos,
            );
            return;
          } else {
            await this.addBlockToBlockchainFailure(blk, pos, i_am_the_longest_chain, force);
            return;
          }

        } else {

          //
          // we need to unwind some of our previously
          // added blocks from the new chain. so we
          // swap our hashes to wind/unwind.
          //
          let chain_to_unwind_hashes = [];
          let chain_to_unwind_pos = [];

          //
          // remove previous added
          //
          for (let i = current_wind_index; i < new_block_hashes.length; i++) {
            chain_to_unwind_hashes.push(new_block_hashes[i]);
            chain_to_unwind_pos.push(new_chain_pos[i]);
          }

          //
          // unwind NEW and wind OLD with resetting flag active
          //
          await this.unwindChain(
            blk,
            pos,
            i_am_the_longest_chain,
            old_block_hashes,
            chain_to_unwind_hashes,
            force,
            1,
            chain_to_unwind_hashes.length,
            old_chain_pos,
            chain_to_unwind_pos
          );
          return;

        }
      }

    } else {

      let new_blk = await this.returnBlockByHashFromMemoryOrDisk(this_block_hash);
      if (new_blk == null) {

        //
        // check to see if we only have the hash 
        //
        console.log("ERROR 620394: block does not exist on disk that should. terminating");
        process.exit();

      }


      let does_block_validate = 0;

      if (new_blk.validates == 1) { 
	does_block_validate = 1;
      } else {
	does_block_validate = await new_blk.validate();
      }

      if (does_block_validate) {

        this.onChainReorganization(this_block_hash, new_blk.block.id, 1, new_chain_pos[current_wind_index]);

        //
        // spend in shashmap
        //
        for (let i = 0; i < new_blk.transactions.length; i++) {
          try { shashmap.spend_transaction(new_blk.transactions[i], new_blk.block.id); } catch (err) {}
        }

        if (current_wind_index == new_block_hashes.length-1) {
          if (resetting_flag == 0) {
            await this.addBlockToBlockchainSuccess(blk, pos, i_am_the_longest_chain, force);
            return;
          } else {
            await this.addBlockToBlockchainFailure(blk, pos, i_am_the_longest_chain, force);
            return;
          }
        } else {
          await this.windChain(
            blk,
            pos,
            i_am_the_longest_chain,
            new_block_hashes,
            old_block_hashes,
            force,
            resetting_flag,
            current_wind_index+1,
            new_chain_pos,
            old_chain_pos
          );
          return;
        }
      } else {
 
        if (current_wind_index == 0) {
          await this.windChain(
            blk,
            pos,
            i_am_the_longest_chain,
            old_block_hashes, // flipped
            [],
            force,
            1,     // reset as invalid
            0,
            old_chain_pos,
            []
          );

        } else {

          //
          // we need to unwind some of our previously
          // added blocks from the new chain. so we
          // swap our hashes to wind/unwind.
          //
          let chain_to_unwind_hashes = [];
          let chain_to_unwind_pos = [];

          for (let i = current_wind_index; i < new_block_hashes.length; i++) {
            chain_to_unwind_hashes.push(new_block_hashes[i]);
            chain_to_unwind_pos.push(new_chain_pos[i]);
          }


          //
          // unwind NEW and wind OLD, and set resetting_flag to 1
          //
          await this.unwindChain(
            blk,
            pos,
            i_am_the_longest_chain,
            old_block_hashes,
            chain_to_unwind_hashes,
            force,
            1,
            chain_to_unwind_hashes.length-1,
	    old_chain_pos,
	    chain_to_unwind_pos
          );
        }
      }
    }
  }


  async unwindChain(blk, pos, i_am_the_longest_chain, new_block_hashes, old_block_hashes, force, resetting_flag, current_unwind_index, new_chain_pos, old_chain_pos) {

    if (old_block_hashes.length > 0) {
      //
      // load old block
      //
      let old_blk = await this.returnBlockByHashFromMemoryOrDisk(old_block_hashes[current_unwind_index]);
      if (old_blk == null) {

        //
        // request missing block
        //
        console.log("ERROR 721058: cannot find block that should exist on disk...");
        console.log(" missing: " + old_block_hashes[current_unwind_index]);
        process.exit();

      }



      //
      // block or data is legit, so run on_chain_reorganization
      // this should update the LC index as well
      this.onChainReorganization(old_blk.returnHash(), old_blk.block.id, 0, old_chain_pos[current_unwind_index]);


      //
      // we either move on to our next block, or we hit
      // the end of the chain of blocks to unspend and
      // move on to wind the proposed new chain
      //
      if (current_unwind_index == 0) {
        await this.windChain(
          blk,
          pos,
          i_am_the_longest_chain,
          new_block_hashes,
          old_block_hashes,
          force,
          resetting_flag,
          0,
  	  new_chain_pos,
	  old_chain_pos
        );
      } else {
        await this.unwindChain(
          blk,
          pos,
          i_am_the_longest_chain,
          new_block_hashes,
          old_block_hashes,
          force,
          resetting_flag,
          current_unwind_index-1,
  	  new_chain_pos,
	  old_chain_pos
        );
      }
    } else {

      //
      // no more blocks to unwind
      //
      await this.windChain(
        blk,
        pos,
        i_am_the_longest_chain,
        new_block_hashes,
        old_block_hashes,
        force,
        resetting_flag,
        0,
        new_chain_pos,
        old_chain_pos
      );

    }
  }


  returnLastSharedBlockId(fork_id, latest_known_block_id) {

    // if there is no fork_id submitted, we backpedal 1 block to be safe
    if (fork_id == null || fork_id == "") { return 0; }
    if (fork_id.length < 2) { if (latest_known_block_id > 0) { latest_known_block_id - 1; } else { return 0; } }

    // roll back latest known block id to known fork ID measurement point
    for (let x = latest_known_block_id; x >= 0; x--) {
      if (x%this.fork_id_mod == 0) {
        latest_known_block_id = x;
        x = -1;
      }
    }

    let our_latest_bid = this.last_bid;

    // roll back until we have a match
    for (let fii = 0; fii < (fork_id.length/2); fii++) {

      var peer_fork_id_pair = fork_id.substring((2*fii),(2*fii)+2);
      var our_fork_id_pair_blockid = latest_known_block_id;

      if (fii == 0)  { our_fork_id_pair_blockid = latest_known_block_id - 0; }
      if (fii == 1)  { our_fork_id_pair_blockid = latest_known_block_id - 10; }
      if (fii == 2)  { our_fork_id_pair_blockid = latest_known_block_id - 20; }
      if (fii == 3)  { our_fork_id_pair_blockid = latest_known_block_id - 30; }
      if (fii == 4)  { our_fork_id_pair_blockid = latest_known_block_id - 40; }
      if (fii == 5)  { our_fork_id_pair_blockid = latest_known_block_id - 50; }
      if (fii == 6)  { our_fork_id_pair_blockid = latest_known_block_id - 75; }
      if (fii == 7)  { our_fork_id_pair_blockid = latest_known_block_id - 100; }
      if (fii == 8)  { our_fork_id_pair_blockid = latest_known_block_id - 200; }
      if (fii == 9)  { our_fork_id_pair_blockid = latest_known_block_id - 500; }
      if (fii == 10) { our_fork_id_pair_blockid = latest_known_block_id - 1000; }
      if (fii == 11) { our_fork_id_pair_blockid = latest_known_block_id - 5000; }
      if (fii == 12) { our_fork_id_pair_blockid = latest_known_block_id - 10000; }
      if (fii == 13) { our_fork_id_pair_blockid = latest_known_block_id - 50000; }

      if (our_latest_bid < our_fork_id_pair_blockid) {} else {

        // return hash by blockid
        var tmpklr = this.returnHashByBlockId(our_fork_id_pair_blockid);

        // if we have not found a match, return 0 since we have
        // irreconciliable forks, so we just give them everything
        // in the expectation that one of our forks will eventually
        // become the longest chain
        if (tmpklr == "") { return 0; }

        var our_fork_id_pair = tmpklr.substring(0, 2);

        // if we have a match in fork ID at a position, treat this
        // as the shared forkID
        if (our_fork_id_pair == peer_fork_id_pair) {
          return our_fork_id_pair_blockid;
        }
      }
    }
    return 0;
  }




  returnLongestChainIndexPosArray(chainlength=10) {

    if (this.index.blocks.length == 0) { return []; }
    if (this.index.blocks.length < chainlength) { chainlength = this.index.blocks.length; }
    if (chainlength == 0) { return []; }

    var bchainIndex = [];
    var chain_pos = this.lc_pos;

    bchainIndex.push(chain_pos);

    for (let z = 0; z < chainlength; z++) {

      var prev_pos = chain_pos-1;
      var prev_found = 0;

      if (prev_pos == -1) {
        z = chainlength+1;
      } else {
        while (prev_pos >= 0 && prev_found == 0) {
          if (this.index.blocks[prev_pos].returnHash() == this.index.blocks[chain_pos].block.prevbsh) {
            bchainIndex.push(prev_pos);
            prev_found = 1;
            chain_pos = prev_pos;
          } else {
            prev_pos--;
          }
        }
      }
    }
    return bchainIndex;
  }



  updateForkId(blk) {

    if (blk == null) { return this.fork_id; }

    let base_bid	= blk.block.id;
    let fork_id   = "";
    let indexpos  = this.index.blocks.length-1;

    //
    // roll back to consensus starting point for measuring
    //
    for (let x = base_bid; x >= 0; x--) {
      if (x%this.fork_id_mod == 0) {
        base_bid = x;
        x = -1;
      }
    }

    for (let i = 0, stop = 0; stop == 0 && i < this.genesis_period;) {

      let checkpointblkid = base_bid-i;
      indexpos = this.returnLongestChainIndexArray(checkpointblkid, indexpos);

      if (indexpos == -1 || checkpointblkid < 0) { stop = 1; }
      else {
        let th = this.index.hash[indexpos];
        fork_id += th.substring(0,2);
      }

      //
      // if this is edited, we have to
      // also change the function
      //
      // - returnLastSharedBlockId
      //
      if (i == 10000) { i = 50000; }
      if (i == 5000)  { i = 10000; }
      if (i == 1000)  { i = 5000; }
      if (i == 500)   { i = 1000; }
      if (i == 200)   { i = 500; }
      if (i == 100)   { i = 200; }
      if (i == 75)    { i = 100; }
      if (i == 50)    { i = 75; }
      if (i == 40)    { i = 50; }
      if (i == 30)    { i = 40; }
      if (i == 20)    { i = 30; }
      if (i == 10)    { i = 20; }
      if (i == 0)     { i = 10; }

      if (i > this.genesis_period || i == 50000) { stop = 1; }

    }

    this.fork_id = fork_id;

  }

  async addBlockToBlockchainSuccess(blk, pos, i_am_the_longest_chain, force=false) {

    //
    // decrypt transactions
    //
    blk.decryptTransactions(this.app);

    //
    // save block to disk
    //
    await this.app.storage.saveBlock(blk, i_am_the_longest_chain);


    //
    // onChain Reorganization runs for this block here
    //
    this.onChainReorganization(blk.returnHash(), blk.block.id, i_am_the_longest_chain, pos);

    //
    // reorganize THIS block
    //
    if (i_am_the_longest_chain == 1) {

      //
      // commented out April 3 when onChainReorganization was added above
      //
      //this.app.wallet.resetExistingSlips(blk.block.id, blk.returnHash(), i_am_the_longest_chain);
      //this.bsh_lc_hmap[blk.returnHash()] = 1;
      //this.bid_bsh_hmap[blk.block.id] = blk.returnHash();

      this.lc_pos_set	= true;
      this.lc_pos 	= pos;

    }


    //
    // update modules (with sync info) ?
    //
    //this.app.modules.updateBlockchainSync(blk.block.id, this.returnTargetBlockId());

    //
    // cleanup
    //
    //this.app.mempool.removeBlockAndTransactions(blk);

    //
    // propagate block
    //
    this.app.network.propagateBlock(blk);

    //
    // only now process
    //
    if (!force) {
      //
      // wallet process slips (if non forced)
      //
      this.app.wallet.processPayments(blk, i_am_the_longest_chain);

      //
      // pass control to the callback manager
      //
      if (this.run_callbacks == 1) {

        blk.affixCallbacks(0);

        if (i_am_the_longest_chain == 1 && !force) {

          let our_longest_chain = this.returnLongestChainIndexPosArray(this.callback_limit);
	  let our_longest_chain_len = our_longest_chain.length;
	  //
	  // process in reverse order so that all TXS are still done in-order when adding
	  // new entries to the end of the longest-chain during a reorg. i.e. if blocks 5
	  // and 6 are both new, we want to process 5 before 6.
	  //
	  our_longest_chain.reverse();

          for (let i = 0; i < our_longest_chain.length && i <= this.callback_limit; i++) {
	    //
	    // run callbacks with TXS
	    //
            let blk = this.index.blocks[our_longest_chain[i]];

            if (blk != null) {

	      let run_callbacks = 1;

	      //
              // if bid is less than our last-bid but it is still 
	      // the biggest BID we have, then we should avoid 
	      // running callbacks as we will have already run 
	      // them. We check TS as sanity check as well.
	      //
	      if (blk.block.id < this.last_bid) {
		if (blk.block.ts < this.last_ts) {
		  if (i_am_the_longest_chain == 1) {
		    run_callbacks = 0;
		  }
		}
	      }
              await blk.runCallbacks(our_longest_chain_len-i, run_callbacks);
    	    }
  	  }
        }

        //
        // callback
        //
	this.app.modules.onNewBlock(blk, i_am_the_longest_chain);

      }
    }

    //
    // save blockchain
    //
    if (i_am_the_longest_chain == 1) {
      this.saveBlockchain(blk);
    }


    //
    // update genesis period
    //
    this.updateGenesisBlock(blk, pos);

    if (!force) {
      this.app.miner.startMining(blk);
    }

    //
    // remember that we have added a block
    //
    this.resendPendingTransactions();

    //
    // indexing active should be reset in parent
    //
    //this.indexing_active = 0;

  }


  resendPendingTransactions() {

//    if (this.added_block == 0) {
//      if (this.app.mempool.downloads.length == 0) {
        this.app.wallet.rebroadcastPendingTransactions();
//        this.added_block = 1;
//      }
//    }

  }


  async addBlockToBlockchainFailure(blk, pos, i_am_the_longest_chain, force=no) {

    //
    // restore longest chain
    //
    this.lc_pos = this.last_lc_pos;

    this.onChainReorganization(blk.returnHash(), blk.block.id, 0, pos);

    delete this.bsh_lc_hmap[blk.returnHash()];
    delete this.bsh_bid_hmap[blk.returnHash()];
    delete this.bsh_ts_hmap[blk.returnHash()];

    //
    // reset miner
    //
    this.app.miner.stopMining();
    let oldblk = this.returnLatestBlock();
    if (oldblk != null) {
      this.app.miner.startMining(oldblk);
    }

    //
    // 
    //
    this.resendPendingTransactions();

    //
    // indexing_active reset in parent
    //

    return 1;
  }





  binaryInsert(list, item, compare, search) {

    var start = 0;
    var end = list.length;

    while (start < end) {

      var pos = (start + end) >> 1;
      var cmp = compare(item, list[pos]);

      if (cmp === 0) {
        start = pos;
        end = pos;
        break;
      } else if (cmp < 0) {
        end = pos;
      } else {
        start = pos + 1;
      }
    }

    if (!search) { list.splice(start, 0, item); }

    return start;
  }

  isHashIndexed(hash) {
    if (this.bsh_bid_hmap[hash] > 0) { return true; }
    return false;
  }


  onChainReorganization(bsh, bid, lc, pos) {

    //
    // update hashmap values
    //
    this.bsh_lc_hmap[bsh] = lc;
    if (lc == 0) {
      delete this.bid_bsh_hmap[bid];
      this.lowest_unspent_bid = 0;
      this.lowest_unspent_pos = 0;
    } else {
      this.bid_bsh_hmap[bid] = bsh;
    }

    //
    // update staking slips
    //
    let prevbsh = this.index.blocks[pos].block.prevbsh;
    let prevbid = bid-1;
    let prevpos = -1;

    for (let i = pos-1; i >= 0 && this.index.blocks[i].block.id >= prevbid; i--) {
      if (prevbsh == this.index.blocks[i].returnHash()) {
        prevpos = i;
      }
    }

    this.updateStakingSlip(pos, prevpos, lc);

    //
    // update wallet and modules
    //
    this.app.wallet.onChainReorganization(bsh, bid, lc, pos);
    this.app.modules.onChainReorganization(bsh, bid, lc, pos);


  }

  resetBlockchainOptions() {

    this.last_bid = "";
    this.last_bsh = "";
    this.last_ts = 0;
    this.last_bf = 0.0;
    this.genesis_ts = 0;
    this.genesis_bid = 0;
    this.lowest_acceptable_ts = 0;
    this.lowest_acceptable_bsh = 0;
    this.lowest_acceptable_bid = 0;

    this.saveBlockchain();

  }



  returnLatestBlock() {
    if (this.index.blocks.length == 0) { return null; }
    return this.index.blocks[this.lc_pos];
  }

  returnLatestBlockId() {
    let blk = this.returnLatestBlock();
    if (blk == null) { return ""; }
    return blk.block.id;
  }

  returnLatestBlockHash() {
    let blk = this.returnLatestBlock();
    if (blk == null) { return ""; }
    return blk.returnHash();
  }

  returnLatestBlockTimestamp() {
    let blk = this.returnLatestBlock();
    if (blk == null) { return 0; }
    if (blk.block == null) { return 0; }
    return blk.block.ts;
  }


  // TODO - optimize search
  returnBlockByHashFromBlockIndex(hash) {
    if (this.isHashIndexed(hash)) {
      for (let v = this.index.blocks.length-1; v >= 0; v-- ) {
        if (this.index.blocks[v].returnHash() == hash) {
	  return this.index.blocks[v];
        }
      }
    }
    return null;
  }
  async returnBlockByHashFromMemoryOrDisk(hash, mode=0) {
    let blk = await this.returnBlockByHash(hash, mode);
    if (blk == null) {
      blk = this.returnBlockByHashFromDisk(hash);
      return blk;
    } else {
      return blk;
    }
    return null;
  }

  // TODO - optimize search - not from last to 0
  async returnBlockByHash(hash, mode=0) {	// 0 - no txs needed (non-async)
						// 1 - txs needed
    if (this.isHashIndexed(hash)) {
      for (let v = this.index.blocks.length-1; v >= 0; v-- ) {
        if (this.index.blocks[v].returnHash() === hash) {
          switch (mode) {
            case 0:
              return this.index.blocks[v];
            case 1:
	      if (this.index.blocks[v].transactions.length == 0) {
                return await this.app.storage.loadBlockByHash(hash);
	      }
              return this.index.blocks[v];
            default:
              return this.index.blocks[v];
          }
        }
      }
    }
    return null;
  }

  async returnBlockByHashFromDisk(hash) {
    if (this.isHashIndexed(hash)) {
      for (let v = this.index.blocks.length-1; v >= 0; v-- ) {
        if (this.index.blocks[v].returnHash() == hash) {
          return await this.app.storage.loadBlockByHash(hash);
        }
      }
    }
    return null;
  }
  // TODO - optimize search
  async returnBlockById(bid, mode=0) {

    //
    // mode
    //
    // 0 -- fetch block from memory / txs not needed
    // 1 -- require transactions
    //
    let hash = this.bid_bsh_hmap[bid];
    if (hash == undefined) { return null; }

    if (this.isHashIndexed(hash)) {
      for (let v = this.index.blocks.length-1; v >= 0; v-- ) {
        if (this.index.blocks[v].returnHash() == hash) {
          switch (mode) {
            case 0:
              return this.index.blocks[v];
            case 1:
	      if (this.index.blocks[v].transactions.length == 0) {
                return await this.app.storage.loadBlockByHash(hash);
	      }
              return this.index.blocks[v];
            default:
              return this.index.blocks[v];
          }
        }
      }
    }
  }

  returnMinTxId() {
    if (this.lc_pos == null) { return 0; }
    if (this.index.blocks[this.lc_pos].mintxid == undefined) { return 0; }
    return this.index.blocks[this.lc_pos].maxtxid;
  }

  returnMaxTxId() {
    if (this.lc_pos == null) { return 0; }
    if (this.index.blocks[this.lc_pos].maxtxid == undefined) { return 0; }
    return this.index.blocks[this.lc_pos].maxtxid;
  }

  returnMinTxId() {
    if (this.lc_pos == null) { return 0; }
    if (this.index.blocks[this.lc_pos].mintxid == undefined) { return 0; }
    return this.index.blocks[this.lc_pos].maxtxid;
  }

  returnLowestValidBlock() {
    return this.last_bid - this.genesis_period + 2;
  }


  saveBlockchain(blk) {

    this.app.options.blockchain = Object.assign({}, this.app.options.blockchain);

    if (blk == null) { return; }

    this.last_bsh = blk.returnHash();
    this.last_bid = blk.block.id;
    this.last_ts  = blk.block.ts;
    this.last_bf  = blk.block.bf;

    //
    // selective updates
    //
    if (blk.block.id%this.fork_id_mod == 0) {
      this.fork_id  = this.updateForkId();
    }

    this.app.options.blockchain.last_bsh		= this.last_bsh;
    this.app.options.blockchain.last_bid		= this.last_bid;
    this.app.options.blockchain.last_ts			= this.last_ts;
    this.app.options.blockchain.last_bf			= this.last_bf;

    this.app.options.blockchain.genesis_ts		= this.genesis_ts;
    this.app.options.blockchain.genesis_bid		= this.genesis_bid;
    this.app.options.blockchain.genesis_period		= this.genesis_period;

    this.app.options.blockchain.lowest_acceptable_ts	= this.lowest_acceptable_ts;
    this.app.options.blockchain.lowest_acceptable_bsh	= this.lowest_acceptable_bsh;
    this.app.options.blockchain.lowest_acceptable_bid	= this.lowest_acceptable_bid;

    this.app.storage.saveOptions();

  }




 /**
  * when the blockchain hits a certain length we throw out all of our older blks
  * this is possible because block ids are incremental. We keep 2x the genesis 
  * period of the chain, fairly excessive:
  *
  * @params {saito.block} block
  * @params {integer} position in index
  */
  updateGenesisBlock(blk, pos) {

    //
    // we need to make sure this is not a random block that is disconnected
    // from our previous genesis_id. If there is no connection between it
    // and us, then we cannot delete anything as otherwise the provision of
    // the block may be an attack on us intended to force us to discard
    // actually useful data.
    //
    // we do this by checking that our block is the head of the
    // verified longest chain.
    //
    if (this.index.blocks[this.lc_pos].returnHash() != blk.returnHash()) { return pos; }
    if (this.index.blocks.length < (this.genesis_period*2)) { return pos; }

    if (blk.block.id >= ((this.genesis_period * 2) + 1)) {

      let purge_id = blk.block.id - (this.genesis_period*2);
      this.genesis_bid = blk.block.id - (this.genesis_period);

      //
      // in either case, we are OK to throw out everything below the
      // lowest_block_id that we have found, since even the lowest
      // fork in our guard_period will not need to access transactions
      // from before itself and the genesis period.
      //
      // we use the purge_id variable since our functions inside
      // need to delete from wallet slips, which requires genesis
      // block_id to be set properly.
      //
      return this.purgeArchivedData(purge_id, pos);
    }

    return pos;
  }


  purgeArchivedData(lowest_block_id, pos) {

//console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^");
//console.log("purging blocks before: " + lowest_block_id);
//console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^");

    let items_before_needed = 0;

    //
    // find the number of items in our blockchain before
    // we run into the lowest_block_id. Remember that blocks
    // are going to be sequential so it is only forks that
    // we really worry about
    //
    for (let x = 0; x < this.index.blocks.length; x++) {
      if (this.index.blocks[x].block.bid < lowest_block_id) {
        items_before_needed++;
      }
      else { x = this.index.blocks.length; }
    }



    for (let x = 0; x < items_before_needed; x++) {

      /////////////////////////
      // delete from hashmap //
      /////////////////////////
      let blk = this.index.blocks[x];
      let blkbsh = blk.returnHash();
      delete this.bsh_lc_hmap[blkbsh];
      delete this.bsh_bid_hmap[blkbsh];
      delete this.bsh_ts_hmap[blkbsh];
      delete this.bid_bsh_hmap[blk.block.bid];

      /////////////////////////
      // delete from storage //
      /////////////////////////
      //
      // slips / file / database
      //
      this.app.storage.deleteBlock(blk.block.bid, blk.returnHash(), this.bsh_lc_hmap[blk.returnHash()]);

    }


    ////////////////////////////////////////////////
    // delete from fast-access indexes and blocks //
    ////////////////////////////////////////////////
    this.index.blocks.splice(0, items_before_needed);
    this.index.paths.splice(0, items_before_needed);
    this.index.stakers.splice(0, items_before_needed);
    this.index.staking_reward(0, items_before_needed);

    var newpos = pos - items_before_needed;


    //////////////////
    // and clean up //
    //////////////////
    this.lowest_unspent_pos = this.lowest_unspent_pos - items_before_needed;
    this.lc_pos = this.lc_pos - items_before_needed;
    this.lc_pos = this.lc_pos - items_before_needed;
    this.app.wallet.purgeExpiredSlips();

    return newpos;


  }



  //
  // Staking slips are added as unpaid and belonging to teh current staking round.
  //
  addStakingSlip(blk, slip, pos) {

    let x               = {};
        x.slip          = slip;
        x.paid          = 0;

    this.index.stakers[pos].push(x);

  }




  updateStakingSlip(pos, prevpos, lc) {

    //
    // set as unpaid (adding)
    //
    if (lc == 1) {

      try {
        for (let i = 0; i < this.index.stakers[pos].length; i++) {
  	  this.index.stakers[pos][i].paid = 0;
        }
      } catch (err) {
      }

    //
    // set as unpaid (removing)
    //
    } else {

      try {
        for (let i = 0; i < this.index.stakers[pos].length; i++) {
 	  this.index.stakers[pos][i].paid = 0;
        }
      } catch (err) {
        console.log("ERROR 582035: error trying to unspend slip at pos: " + pos);
      }

    }

  }



  /* 
   * This picks a random block and sid given the hash provided and returns it
   * as the winning staker if it has not yet been paid out.
   * 
   * If the slip HAS been paid out, we pick the lowest unpaid slip from the 
   * current genesis period.
   * 
   */
  returnWinningStaker(gt, gtrandom=null, bid) {

   if (gtrandom == null) { gtrandom = gt.random; }

    //
    // pick winning staker
    //
    let results = {};
        results.publickey       = "";
        results.staker_bid	= -1;
        results.staker_sid	= -1;
        results.staker_pos	= -1;

    if (gt != null) { if (gt.publickey != undefined) { results.publickey = gt.publickey; } }

    //
    // how many blocks
    //
    let modlength = this.app.blockchain.genesis_period;
    if (modlength > bid) { modlength = bid; }


    //
    // pick a random block from the blockchain
    //
    let winnerHash = this.app.crypto.hash(gtrandom).slice(0, 12);
    let winnerNum  = parseInt(winnerHash, 16); // 16 because number is hex
    let winner_pos = (winnerNum % modlength);
    let winner_bid = -1;
    let winner_sid = -1;
    let winner_slip = null;


    //
    // roll down to first block on longest chain
    //
    let k = winner_bid;

    for (let z = this.index.blocks.length-1; z >= 0; z--) {
      if (this.bsh_lc_hmap[this.index.blocks[z].returnHash()] == 1 || this.index.blocks[z].block.id == bid) {
	winner_pos = z;
	z = -1;
      }
    }

    winner_bid = this.index.blocks[winner_pos].block.id;
    let is_slip_spent = 0;

    //
    // pick staker slip
    //
    let winnerHash2 = this.app.crypto.hash(winnerHash).slice(0, 12);
    let winnerNum2  = parseInt(winnerHash2, 16); // 16 because number is hex
    if (this.index.stakers[winner_pos].length > 0) {
      winner_sid = (winnerNum2 % this.index.stakers[winner_pos].length);
    }


    //
    // is winning staker already spent
    //
    if (winner_sid == -1) {
      is_slip_spent = 1;
    } else {
      if (this.index.stakers[winner_pos][winner_sid].paid == -1) {
        is_slip_spent = 1;
      }
    }

    //
    // if slip is unspent, this is it!
    //
    if (is_slip_spent == 0) {
      winner_slip = this.index.stakers[winner_pos][winner_sid];
    }

    //
    // else continue get earliest unpaid slip within genersis period
    //
    else {

      let earliest_bid = this.last_bid - this.genesis_period + 1;
      if (earliest_bid < 1) { earliest_bid = 1; }
      if (earliest_bid < this.lowest_unspent_bid) { earliest_bid = this.lowest_unspent_bid; }

      //
      //
      //
      let starting_pos = 0;
      for (let z = 0; z > this.index.blocks.length && starting_pos == 0; z++) {
	if (this.index.blocks[z].block.id == earliest_bid) {
	  if (this.bsh_lc_hmap[this.index.blocks[i].returnHash()] == 1) {
	    starting_pos = z;
	  }
	}
      }

      //
      // TODO randomized order not just first-always wins
      //
      let cont = 1;
      for (let i = starting_pos; i < this.index.stakers.length && cont == 1; i++) {
        for (let ii = 0; ii < this.index.stakers[i].length && cont == 1; ii++) {
	  if (this.index.stakers[i][ii].paid == 0) {

	    winner_bid = this.index.blocks[i].block.id;
	    winner_sid = ii;
	    winner_pos = i;
	    winner_slip = this.index.stakers[i][ii];

	    cont = 0;

	  }
        }
      }
    }

    results.publickey = this.index.stakers[winner_pos][winner_sid].slip.add;
    results.staker_bid = winner_bid;
    results.staker_sid = winner_sid;
    results.staker_pos = winner_pos;
    results.staker_slip = winner_slip.slip.returnSignatureSource();

    return results;
  } 

  resetBlockchain() {

    this.last_bsh               = "";
    this.last_bid               = 0;
    this.last_ts                = 0;
    this.last_bf                = 0.0;
    this.genesis_ts = 0;
    this.genesis_bid = 0;
    this.lowest_acceptable_ts   = 0;
    this.lowest_acceptable_bsh  = "";
    this.lowest_acceptable_bid  = 0;

    if (typeof this.app.options.blockchain == "undefined") {
      this.app.options.blockchain = {};
    }

    this.app.options.blockchain.last_bsh                = this.last_bsh;
    this.app.options.blockchain.last_bid                = this.last_bid;
    this.app.options.blockchain.last_ts                 = this.last_ts;
    this.app.options.blockchain.last_bf                 = this.last_bf;

    this.app.options.blockchain.lowest_acceptable_ts    = this.lowest_acceptable_ts;
    this.app.options.blockchain.lowest_acceptable_bsh   = this.lowest_acceptable_bsh;
    this.app.options.blockchain.lowest_acceptable_bid   = this.lowest_acceptable_bid;

    this.app.storage.saveOptions();

  }
 

  //
  // returns 1 if yes, 0 if no, -1 if unknown
  //
  hasKeylistTransactions(bsh, keylist) {

    let blk = this.returnBlockByHashFromBlockIndex(bsh); // 0 indicates we want in-memory
    if (blk === null) { console.log("Not found block"); return -1; }
    if (blk.hasKeylistTransactions(keylist)) { return 1; }

    return 0;

  }

}

module.exports = Blockchain;

