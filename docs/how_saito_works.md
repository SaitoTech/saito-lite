# Description of Network

This document is divided into four parts. The first discusses the Saito mechanism for pruning old data at market prices. The second explains how blocks are produced. The third explains how the block reward is issued. The fourth explains how to ensure attackers always lose money attacking the network.

## 1. PRUNING THE BLOCKCHAIN

Saito divides the blockchain into "epochs" of roughly 100,000 blocks. If the latest block is 500,000, the current epoch streches from block 400,001 onwards. We are launching MAINNET with a fixed "epoch length" but it is hypothetically possible to have a dynamic one, where the "epoch length" increases to keep the cost of attack at some constant.

Once a block falls out of the current epoch, its unspent transaction outputs (UTXO) are no longer spendable. Any UTXO from that block which contains enough tokens to pay a rebroadcasting fee must be re-included in the very next block. The rebroadcasting fee is twice the average fee per byte paid by new transactions over a smoothing period.

Block producers rebroadcast UTXO by creating special "automatic transaction rebroadcasting" (ATR) transactions. These ATR transactions include the original transaction in an associated message field, but have new UTXO. The rebroadcasting fee is deducted from each UTXO and added to the block reward. Any blocks not containing all necessary ATR transactions are invalid by consensus rules. After two epochs block producers may delete all block data, although the 32-byte header hash may be retained to prove the connection with the genesis block.


## 2. PRODUCING BLOCKS

Saito adds cryptographic signatures to the network layer. Each transaction contains an unforgeable record of the path it takes into the network. This allows u to measure the "routing work" provided by the nodes in the network.

The blockchain sets a "difficulty" for block production. This difficulty is met by producing a block containing adequate "routing work" in its included transactions. The amount of "work" embedded in any transaction is the value of its fee halved by each additional hop beyond the first that the transaction has taken into the network.

Consensus rules specify that nodes cannot use "routing work" from transactions that do not include them on their routing path. Any surplus value of "routing work" may be taken by the block producer in immediate payment for block production and deducted from the block reward.


## 3. THE PAYMENT LOTTERY

Each block contains a proof-of-work challenge in the form of its block hash. If a miner finds a random hash that "solves" this challenge it broadcasts it in a fee-paying transaction we call the "golden ticket".

If one valid golden ticket is included in the very next block the network will split the block reward for the previous block between the miner that found the solution and a lucky routing node. The winning routing node is selected using a random variable included in the miner solution. The "paysplit" of the network is 50-50 by default (half to miners, half to routers). Tickets are distributed so that each node has a chance of winning proportional to the amount of routing work it contributed to the block. If a solution is not found, the payment eventually falls off the chain whereupon it is returned to the network "treasury" and eventually passed into a future block reward.

Mining difficulty auto-adjusts until the network produces one golden ticket on average per block. This eliminates the fifty-one percent attack completely: unless attackers match one hundred percent of the mining and routing work done by the honest network, they either cannot produce blocks as quickly as honest nodes, or are able to produce blocks but not collect payments.


## 4. THE DEADWEIGHT LOSS MECHANISM

Saito increases attack costs further through a POWSPLIT mechanism. Mining difficulty is increased so that one solution is found every N blocks on average. When a golden ticket is found, if the previous block did not contain a golden ticket, the random variable used to select the winning routing node is hashed again to select a winning routing node from the previous (unpaid) block. This hash is used to pick a winner from a table of stakers. This process is repeated until all unsolved preceding blocks have had their payments issued. An upper limit to backwards recusion may be applied for practical purposes, beyond which point any uncollected funds are simply apportioned to the treasury.

To become stakers in the network, users broadcast a transaction containing a specially-formatted UTXO. The UTXO are added to a list of "pending stakers" on their inclusion in a block. Once the current staking table has been fully paid-out, all pending UTXO stakers are moved into the current staking table. Stakers may not withdraw or spend their UTXO until they have received payment.

The amount paid to staking nodes with each payment is the average of the amount paid into the treasury by the staking reward during the *previous* genesis period, normalized to their percentage of the staking table. Limits may be put on the size of the staking pool to induce competition between stakers if desirable. 

Block producers who rebroadcast UTXO which are in the staking table must now indicate in their ATR transactions whether the outputs are in the current or pending pool. While a hash representation of the state of the staking table is included in every block in the form of a commitment allowing initial nodes to verify the accuracy of off-chain data, this modification of the ATR rebroadcast mechanism permits all nodes to reconstruct the state of the staking pool within one genesis period at most.

In order to drive up attack costs further in case of attack, mining difficulty is adjusted upwards if two blocks containing golden tickets are found in a row and slightly downwards if two blocks without golden tickets are found in a row. A similarly punitive cost applies if two blocks without golden tickets are found consecutively, applied by withholding an ever-increasing amount of the staking revenue being paid out of the network treasury. The network treasury expands in times of attack, eliminating any economic incentives for attacking the network and ensuring that censors constantly lose money.


## 5. NETWORK CONSENSUS

Bitcoin avoids some data-flooding attacks by leveraging the difficulty of block production. In Saito this problem should be addressed as attackers can produce a unlimited number of potentially blocks at any particular block depth - the guarantee of cost-paid only happens on the production of the second block, which makes the transaction fee uncollectable. We refer to these attacks as "block-flooding" attacks, as they are primarily a form of DOS on network throughput.

Saito solves these issues by addingg "consensus rules" to routing behavior. The network specifies that nodes only forward blocks if they contain more "work" than previous blocks at any block depth. The exception to this is if the nodes become convinced that the block is part of the longest chain, a development which requires attackers to produce multiple blocks. This ensures that attackers pay a cost for block propagation similar to the role the hashing costs plays in Bitcoin.

In the event the network adopts a small-world network in which all nodes connect to all nodes, attackers can theoretically induce data-threshing attacks by targeting different peers with custom blocks using variations of the same transaction set. It is not clear if this is a practical vulnerabvility. If the network wishes to avoid it, it can be solved by adding cryptographic signatures to block propagation. This permits peers to identify nodes which are not following network policy - peers can simply avoid propagation of blocks by default.


### APPENDIX I: SAITO TERMINOLOGY

**Paysplit:** a variable between 0 and 1 that determines the percentage of the block reward that is allocated to mining nodes.

**Powspit:** a variable between 0 and 1 that determines the target percentage of blocks solved through golden tickets.

**Golden Ticket:** a transaction from a miner containing a valid solution to the computational lottery puzzle embodied in the previous block hash.

**Genesis Period:** the length of the epoch in number of blocks.


