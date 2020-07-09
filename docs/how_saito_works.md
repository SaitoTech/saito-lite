# Description of Network

This document is divided into four parts. The first discusses the Saito mechanism for rebroadcasting transactions to eliminate blockchain bloat. The second explains how blocks are produced. The third explains how the block reward is issued. The fourth explains how to increase the cost-of-attack far beyond 100 percent of network transaction fees.

## 1. TRANSACTION REBROADCASTING

Saito divides the blockchain into "epochs" of roughly 100,000 blocks. If the latest block is 500,000, the current epoch streches from block 400,001 onwards.

Once a block falls out of the current epoch, its unspent transaction outputs (UTXO) are no longer spendable. Any UTXO which contains enough tokens to pay a rebroadcasting fee must be re-included in the very next block however. The rebroadcasting fee is twice the average fee per byte paid by new transactions over a smoothing period.

Block producers rebroadcast UTXO by creating special "automatic transaction rebroadcasting" (ATR) transactions. These ATR transactions include the original transaction but have new UTXO. The rebroadcasting fee is deducted from these new UTXO and added to the block reward. Any blocks not containing all necessary ATR transactions are invalid by consensus rules. After two epochs block producers may delete old transactions, keeping only the 32-byte header hash to prove the connection with the genesis block.


## 2. PRODUCING BLOCKS

Saito adds cryptographic signatures to the network layer. Each transaction contains an unforgeable record of the path it takes into the network. This allows us to measure the "routing work" contained any transaction at any point in its journey. This is the value of the transaction fee halved with each additional hop beyond the first that the transaction has taken into the network.

The blockchain sets a "difficulty" for block production. This difficulty is met by including transactions containing adequate "routing work" into blocks. Consensus rules specify that nodes cannot use "routing work" from transactions if they are not included in the routing path. A bonus payment may be issued to block producers if there is more "routing work" in their blocks than required by consensus.


## 3. THE PAYMENT LOTTERY

Each block contains a NEW proof-of-work challenge in its block hash. This is not used to produce blocks since (section 2) Saito does not using hashing to produce blocks. Instead, miners solve these challenges to release payments. Once a solution is found it is broadcast into the network in the form of a normal, fee-paying transaction.
`
If a solution is not found and included by the time the next block is produced, the funds eventually fall off the chain (when they pass out of the current epoch) and are collected by the consensus layer for eventual inclusion in a future block reward. But if exactly one solution is included in the very next block the network splits the block reward between the lucky miner and a routing node selected randomly from the previous block. Each routing node has a chance of winning proportional to the amount of work it contributed to that block. 

Mining difficulty auto-adjusts until the network produces one golden ticket on average per block. 



## 4. ADVANCED SAITO

Saito eliminates the fifty-one percent attack: attackers must lock-up/burn 100 percent of all transaction fees to produce blocks. This can only be done by spending their own money. Unless they also match one hundred percent of mining they will not get that money back. This provides a quantifiable cost-of-attack that does not disappear under majoritarian conditions.

It is possible to increase attack costs beyond 100 percent by increasing mining difficulty so that one solution is found every N blocks on average. When issuing payments, if the previous block did not contain a golden ticket solution, we hash the random variable used to select the winning routing node to select a winner from a table of stakers. Repeat until all unsolved blocks have been processed. An upper limit to backwards recusion may be applied for practical purposes. Mining difficulty adjust upwards if N blocks containing golden tickets are found in a row and downwards if N blocks without golden tickets are found in a row. 

Users stake by broadcasting specially-formatted transactiona that add their UTXO to a list of "pending stakers". Once the current staking table has been fully paid-out, all pending UTXO are moved into the "current stakers" table. Stakers may not withdraw or spend their UTXO until they have received payment. The payout to stakers is the average of routing share during the *previous* genesis period, normalized to the winning UTXO's percentage of the staking table. Limits may be put on the size of the staking pool to induce competition between stakers if desirable.

This system requires modifications to Automatic Transaction Rebroadcasting. Block producers who rebroadcast UTXO must now indicate whether specific outputs are in the current or pending pool. This modification permits all nodes to reconstruct the state of both staking pools within one genesis period at most.



## 5. FINAL NOTES ON BLOCK ROUTING

There are many data-flooding attacks in POW / POS networks. The anti-sybil properties of Saito makes many of these impossible in our network. Nonetheless, we note that attackers masquarading as good citizens can hypothetically produce a unlimited number of potentially blocks at any particular block depth - the guaranteed cost of block production only applies upon the production of the second block.

In the event the network adopts a small-world form in which all nodes connect to all nodes, attackers can theoretically induce data-threshing attacks by creating custom blocks and trying to get other nodes to forward / flood the network with their data. It is not clear if this is a practical vulnerabvility, but it is possible to solve by adding cryptographic signatures to block propagation. This permits peers to identify nodes which are not following network policy - peers can not propagate subsequent blocks produced by the same creator at the same block depth.


### APPENDIX I: SAITO TERMINOLOGY

**Paysplit:** a variable between 0 and 1 that determines the percentage of the block reward that is allocated to mining nodes.

**Powspit:** a variable between 0 and 1 that determines the target percentage of blocks solved through golden tickets.

**Golden Ticket:** a transaction from a miner containing a valid solution to the computational lottery puzzle embodied in the previous block hash.

**Genesis Period:** the length of the epoch in number of blocks.


