# Description of Network

This document is divided into four parts. The first discusses the Saito mechanism for pruning old data at market prices. The second explains how blocks are produced. The third explains how the block reward is issued. The fourth explains how to ensure attackers always lose money attacking the network.

## 1. PRUNING THE BLOCKCHAIN

Saito divides the blockchain into "epochs" of roughly 100,000 blocks. If the latest block is 500,000, the current epoch streches from block 400,001 onwards.

Once a block falls out of the current epoch, its unspent transaction outputs (UTXO) are no longer spendable. Any UTXO from that block which contains enough tokens to pay a rebroadcasting fee must be re-included in the very next block. The rebroadcasting fee is twice the average fee per byte paid by new transactions over a smoothing period.

Block producers rebroadcast UTXO by creating special "automatic transaction rebroadcasting" (ATR) transactions. These ATR transactions include the original transaction in an associated message field, but have new UTXO. The rebroadcasting fee is deducted from each UTXO and added to the block reward. Any blocks not containing all necessary ATR transactions are invalid by consensus rules. After two epochs block producers may delete all block data, although the 32-byte header hash may be retained to prove the connection with the genesis block.


## 2. PRODUCING BLOCKS

Saito adds cryptographic signatures to the network layer. Each transaction contains an unforgeable record of the path it takes into the network. This allows u to measure the "routing work" provided by the nodes in the network.

The blockchain sets a "difficulty" for block production. This difficulty is met by producing a block containing adequate "routing work" in its included transactions. The amount of "work" embedded in any transaction is the value of its fee halved by each additional hop beyond the first that the transaction has taken into the network.

Consensus rules specify that nodes cannot use "routing work" from transactions that do not include them on their routing path. Any surplus value of "routing work" may be taken by the block producer in immediate payment for block production and deducted from the block reward.


## 3. THE PAYMENT LOTTERY

Each block contains a proof-of-work challenge in the form of its block hash. If a miner finds a solution to this challenge it broadcasts it in a fee-paying transaction we call the "golden ticket".

If one valid golden ticket is included in the very next block the network will split the block reward for the previous block between the miner that found the solution and a lucky routing node. The winning routing node is selected using a random variable included in the miner solution. The "paysplit" of the network is 50-50 by default (half to miners, half to routers). Tickets are distributed so that each node has a chance of winning proportional to the amount of routing work it contributed to the block.

Mining difficulty auto-adjusts until the network produces one golden ticket on average per block.


## 4. ADDING A DEADWEIGHT LOSS MECHANISM

The above system eliminates the fifty-one percent attack. Unless attackers match one hundred percent of the mining and routing work done by the honest network, they either cannot produce blocks as quickly as honest nodes, or are able to produce blocks but not collect payments.

Saito increase costs even further by modifying the payment lottery. Once a golden ticket is included in a block, if the previous block did not contain a golden ticket, the random variable used to select the winning routing node is hashed again to select a winning routing node in the previous block, and then again to pick a winner from a table of stakers. This process is repeated until all unsolved preceding blocks have had their payments issued. An upper limit to backwards recusion may be applied for practical purposes, beyond which point any uncollected funds are simply apportioned to the treasury.

To become stakers in the network, users broadcast a transaction containing a specially-formatted UTXO. The amount of tokens staked are added to the transaction fee for the purpose of determining the "routing work" of this transaction. The UTXO are added to a list of "pending stakers" on their inclusion in a block. Once the current staking table has been fully paid-out, all pending UTXO stakers are moved into the current staking table.

We specify that users may not spend their staked UTXO until they have been paid by the network at least once. The amount paid to staking nodes each block is also set as the average of the amount paid into the treasury by the staking reward during the *previous* genesis period, normalized to their percentage of the staking table. Limits may be put on the size of the staking pool to induce competition between stakers if desirable.

Block producers who rebroadcast staking-UTXOs must indicate in their ATR transactions whether the outputs are in the current or pending pool. While a hash representation of the state of the staking table is included in every block in the form of a commitment allowing initial nodes to verify the accuracy of off-chain data, this step permits all nodes to reconstruct the state of the staking pool within one genesis period at most.

Mining difficulty is adjusted upwards if two blocks containing golden tickets are found in a row and downwards if two blocks without golden tickets are found in a row. An exponential multiplier to mining difficulty is applied if than two blocks with golden tickets are found in a row. A similarly punitive cost applies if two blocks without golden tickets are found consecutively, applied by withholding an ever-increasing amount of the staking revenue being paid out of the network treasury.


### APPENDIX I: SAITO TERMINOLOGY

**Paysplit:** a variable between 0 and 1 that determines the percentage of the block reward that is allocated to mining nodes.

**Powspit:** a variable between 0 and 1 that determines the target percentage of blocks solved through golden tickets.

**Golden Ticket:** a transaction from a miner containing a valid solution to the computational lottery puzzle embodied in the previous block hash.

**Genesis Period:** the length of the epoch in number of blocks.


