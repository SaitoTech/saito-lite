# Welcome to Saito


Saito is a **Tier 1 Blockchain Protocol** which provides **high transaction and data throughput**.

Please see the documents in the /docs directory for instructions on how to 
install Saito, learn how the network works, or just get started building 
applications on the network.

If you need to get in touch with us, please reach out anytime. 

The Saito Team
info@saito.tech

# Clone Repository
```git clone https://github.com/saitotech/saito-lite ```

# System Preparation
requires node version >= 12
```
apt update
apt upgrade
apt install npm
```
# Install Dependencies and Run
```
npm install
npm run compile
npm start
```

The system will be installed in 'local' or 'development' mode with a default set of modules responding on port 12101.

# The Concensus Mechanism

Saito protocol implements a network in a similar way to other blockchains such as Bitcoin. I.E. In a similar way to other networks, a token is used to act as a reward incentivize a network of nodes to run the protocol. However, Saito acts differently from a typical Proof of Work chain in a number of ways:

## 1) Automatic Transaction Rebroadcasting

Firstly, Saito's Blockchain is not a "Permanent Ledger" in the conventional sense. For this reason, we sometimes prefer not to use the term "blockchain", however, Saito's chain is a blockchain in the sense that each block contains a pointer to the previous block's hash. However, after a number of block which we call the "genesis period", UTXOs which are below the "rebroadcast limit" can be pruned from the chain. However, the concensus mechanism dictate that any UTNO with sufficient output to pay the rebroadcast fee(double the average fee per byte over the last N blocks) *must* be included in the next block, i.e. rebroadcasted. However, it is important to note that we do not envision this mechanism actually being used to keep UTXOs on the chain, it's primary purpose is to incentives wallets to consolidate their UTXOs in a more sensible manner.

## 2) Hash Difficultly and Incentives

Similar to other new Blockchains, Saito also splits the consenus mechanism's canonicalization and finality into two separate functions. I.E. a valid block is produced under one constraint, and hash difficulty is added later by another.

Once a valid block is seen on the network(see below), Hashers can begin trying to solve the hash difficulty problem, which we refer to as the "Golden Ticket Puzzle". Any sufficiently difficult hash which is found is broadcast to the network as a special transaction type which we call a Golden Ticket Solution. The difficulty targets 1 solution every 2 blocks and is increased whenever 2 blocks are solved consecutively.

The Golden Ticket Puzzle solution is used as a source of entropy to choose the Golden Ticket winner from amongst the Routing nodes(see below) and the fees in the block are split between that winner and the node who published the Golden Ticket transaction with sufficent hash difficulty.

## 3) Burn Fee and Golden Tickets

Perhap's Saitos most valuable insight is that fee generatation, i.e. the collection of fee-paying transasctions, can be brought into the concensus mechanism and used as a form of work. Hash difficulty is still used as a mechanism to achieve finality and solve the double-spend problem as described above). The fees are split between these two sets of functionaries, i.e. what we call Routers and Hashers(we avoid the term "mining" to avoid confusion).

In order to reward the Routers, as each tranasction is routed through the network it is signed by each node along the way. Each node which routes a transaction is given a chance of winning a portion of fees in the block(currently half) when the hash difficulty is attached later(as described above), we call this the Golden Ticket chance and the portion of the block's fees which are rewarded in this way the Golden Ticket. A routing node's chance of winning from a single transaction is proportional to the fees attached to the given transaction, but *it is also halved for each hop through the network*. 

The Routing Nodes conspire to collate enough transactions to form a valid block, which is achieved when a node has enough fee-paying transactions to pay the Burn Fee. The Burn Fee's value decreases logarithmically from the previous Block Time and will eventually fall to zero, but the Burn Fee is also proportional to the amount of "Burn Work" needed to service each individual transaction in the block, which is the sum of all the Golden Ticket chances given to it's routing nodes!

This is by far the most difficult and valuable part of Saito's Concensus mechanism. Don't be discouraged if it seems confusing at first. If you have questions, feel free to reach out.

What's important to remember is that:

1) The amount of "Burn Fee Work" associated with a transaction increases as the transaction is routed(halved at each hop, same as the Golden Ticket chances).
2) A Routing Node's chance of winning the Golden Ticket is proportional to the amount of extra "Burn Fee Work" it is adding to the transaction by signing and routing it.

The "Burn Fee Work" associated with a transaction is *the sum of* the Golden Ticket chances it has imparted to it's Routers.

Stated on more way: A valid block can be formed at any time, but will only be profitable to it's routers when the total Burn Fee is offset by the amount of fees included by the transaction in the block. The contribution to "Routing Work" or "Burn Fee Work" from a transaction is it's fee. The Burn Fee Work *needed* to include that transaction is *increased* each time it is routed through the network but the *total Burn Fee* needed for a given block is *decreasing* as the previous block gets further away in the past.

If you're still confused, don't feel bad. There is a reason we've tried to explain this mechanism multiple different ways and most people have trouble reasoning through it the first time. However, we encourage you to re-read this section if you feel you need to understand it, but also feel free to simply move on knowing that *we believe this mechanism creates an economic incentive for network participants to provide block space and transaction throughput at a fair rate*.

# How To Use Saito

The Reference Implementation of Saito is written in node.js.

The easiest way to get started is to clone the repo as described above and compile a "lite client" which can be served directly do your browser.

See the "Lite Client Modules Getting Started" doc in /docs.

Alternatively, you can integrate directly with our REST API which is described below. Currently we do not provide any easy way to call this API other than by implemented a Module in the Lite Client as described in the doc mentioned above, but these tools will be coming very soon.

## REST API

The API for interacting with Saito's Core code is quite minimalistic. Additional APIs will be provided later through modules which node's can opt to install or not depending on their preferences.

### Websocket Connection

A node will keep a list of peers which connect to it via a websocket(or local socket, coming soon). 

A peer can send a "request" message through the socket with one of the following request types:
```
'handshake', 'block', 'missing block', 'blockchain', 'transaction', 'keylist', or by passing a transaction as the payload.
```

For Example:
```
var message = {};
message.request = message;
message.data = data;

this.socket.emit('request', JSON.stringify(message), function (resdata) {
	mycallback(resdata);
});
```
Within the Lite Client, helper functions are provided:
```
peer.sendRequest("chat message", tx);
//or
peer.sendRequest("transaction", tx);
// or
peer.sendRequestWithCallback("keylist", {...}, function () {...});
```
Before a node will begin to send peer request and new transaction events to a peer, the peer must complete the handshake.

```
var message = {};
message.request = "handshake";
message.data = {...};

this.socket.emit('request', JSON.stringify(message), function (resdata) {
	mycallback(resdata);
});
```

If a transaction is sent with message 

WORK IN PROGRESS, WILL BE COMPLETED IN THE NEXT 24 TO 48 HOURS

# Contact 

To connect to the Saito Network please contact us at:

* network@saito.tech
* [Discord](https://discord.gg/QjeXTC3)
* [Telegram](https://t.me/joinchat/BOSYOk_BR8HIqp-scldlEA)



