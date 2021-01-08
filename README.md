# Welcome to Saito


Saito is a **Tier 1 Blockchain Protocol** which provides **high transaction and data throughput**.

If you need to get in touch with us, please reach out anytime. 

The Saito Team
info@saito.tech

## Table of Content
* [Preamble](#Preamble)
* [How To Use Saito](#How-To-Use-Saito)
* [Getting Started](#Getting-Started)
* [The Concensus Mechanism](#The-Concensus-Mechanism)
* [REST API](#REST-API)
	* [Websocket Connection](#Websocket-Connection)
	* [Peer Requests](#Peer-Requests) 
	* [Block Data Endpoints](#Block-Data-endpoints)
	* [Other RESTFUL Endpoints](#Other-RESTFUL-Endpoints)
* [Contact](#Contact)

## Web3 Grant
* [Grant Application](https://github.com/SaitoTech/Open-Grants-Program/blob/master/applications/saito-game-protocol-and-engine.md)
* [Saito Open Infrastructure](docs/saitoopeninfrastructure.md)

## Other Documentation
* [Welcome To Saito(this doc)](README.md)
* [Roadmap](docs/roadmap.md)
* [Applications/Modules](docs/applications.md)
* [Saito Application Context(app)](docs/appcontext.md)
* [Services](docs/services.md)
* [Events](docs/events.md)
* [Block and Transaction Validation](docs/validation.md)
* [White Paper](docs/saito-whitepaper.pdf)
* [Lite Paper](docs/saito-litepaper.pdf)

# Preamble
Before working with this repository it may be helpful to get some perspective on the Saito roadmap and what you can expect at this point.

Firstly, a word on "complexity". At first, it may seem that Saito's consensus mechanism is overly complex. However, also note that from a DAPP developer's viewpoint, all that really needs to be understood is that the chain contains a UTXO set representing a ledger of Saito payments(similar to Bitcoin) and that this set is what end-users will be interested in. Transactions can be sent and received and arbitrarily large data can be attached to any transaction. Fees must be included for every transaction.

If you're interested in developing DAPPs on top of Saito, that's all you really need to know. However, we've included a description of the consensus mechanism here because it is an important piece of the protocol and many people reading this document will need to know the details.

If you're interested in helping to develop the core blockchain, please also see our roadmap doc and please reach out if you have any questions or suggestions.


# How To Use Saito

The Reference Implementation of Saito is written in node.js.

The easiest way to get started is to clone the repo as described below and compile a "lite client" which can be served directly to your browser.

See the [Applications readme in the /docs directory](docs/applications.md).

Alternatively, you can integrate directly with our REST API which is described further below. Currently we do not provide any easy way to call this API other than by implemented a Module in the Lite Client as described in the doc mentioned above, but these tools will be coming very soon.

# Getting Started
```git clone https://github.com/saitotech/saito-lite```

## System Preparation
requires node version >= 12
```
apt update
apt upgrade
apt install npm
```
## Install Dependencies and Run
``` 
npm install
npm run compile
npm start
```
The system will be installed in 'local' or 'development' mode with a default set of modules responding on port 12101.
## Build a Lite Client
```
npm run compile dev
```
Running this command will compile the codebase(with some subtle changes) into a javascript payload which can be delivered to browsers. The payload will be placed into the /web directory and can be loaded by any page you wish to author.

As a convenience, the Modules system which is provided as an aside to the core will automatically serve web requests if configured correctly, making it quite simple to get started making DAPPs in the browser.

Again, the [applications readme in the /docs directory](docs/applications.md).

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

## REST API

The API for interacting with Saito's Core code is quite minimalistic. Additional APIs will be provided later through modules which nodes can opt to install or not depending on their preferences. The Saito philosophy is always that nodes only provide the services which they are incentived to provide.

The API consists of a websocket which will be described below as well as to GET method endpoints for retrieving blocks:

GET /blocks/:bhash/:pkey

GET /lite-blocks/:bhash/:pkey

GET /options

### Websocket Connection

A node will keep a list of peers which connect to it via a websocket(or local socket, coming soon). 

A peer can send a "request" message through the socket with one of the following request types:
```
'handshake', 'block', 'missing block', 'blockchain', 'transaction', 'keylist', or by simply passing a transaction as the payload.
```

For Example:
```
var message = {};
message.request = requestType;
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
Before a node will begin to send peer request and new transaction events to a peer, the peer must complete a handshake.

When a client first opens a websocket to a peer, the peer will reply with a handshake request.

The server does something like this:
```
this.socket.on('connect', () => {
  // build a handshake object(described below)
  var handshakeMessage = {};
  message.request = "handshake";
  message.data = handshakeObj;

  this.socket.emit('request', JSON.stringify(message), function (resdata) {
      mycallback(resdata);
  });
 });
```
A handshake data object should look something like this:
```
{
  request: 'handshake',
  data: {
  	step: 1,
    ts: 1609917235055,
    attempts: 1,
    complete: 0,
    challenge_mine: 0.7214271616371855,
    challenge_peer: '',
    challenge_proof: '',
    challenge_verified: 0,
    peer: { 
      host: '',
      port: '',
      protocol: '',
      endpoint: {},
      publickey: 'i6VdbjoWC1F8ZUa13ZVJM26Q3eLXDLymK1cfnNu6VoMt',
      version: 3.273,
      synctype: 'lite',
      sendblks: 1,
      sendtxs: 1,
      sendgts: 1,
      receiveblks: 1,
      receivetxs: 0,
      receivegts: 0,
      keylist: [ ...]
    },
    modules: [ ... ],
    services: [ ... ],
    blockchain: {
      last_bid: 86,
      last_ts: 1608882688413,
      last_bsh: 'a91604e2ef887ead350567037b52050c1e2f53cd241365f399e99987f77e8f9c',
      last_bf: 0.540765046013423,
      fork_id: '',
      genesis_bid: 0
    }
  }
}
```
The server will set the step to 1, which begins the handshake process, which goes like this:

1) Server creates a handshake object which includes a challenge, and sends it
2) Client creates it's own handshake object which includes a challenge and a signature of the server server's challenge, and sends it.
3) Server confirms the client's signature, signs the client's challenge, sends it's handshake *and* sends a second request informing the client it is free to begin requesting blocks.
4) Client confirms the server's signature and begins requesting blocks(if it's behind).

*(Note that in a peer-to-peer blockchain context, the terminology "server" and "client" are not necessarily correct. In this case "client" refers to the peer openning the websocket connection and "server" as the peer which begins the handshake. In the wild, this will often be something which looks like a client and server, but there is no reason either peer cannot perform any particular service)*

The data fields serve the following purposes:
```
step
	Tracks the step in the handshake we are on. Should be incremented when replying.
ts
	(optional)Timestamp.
attempts
	(optional)Tracks the number of attempts the peer has used to complete the handshake.
    This is tracked by each individual peer on it's own.
complete
	(optional)
    This is tracked by each individual peer on it's own.
challenge_mine
	A random number between 0.0 and 1.0 which the other peer must sign to confirm
    it controls the pubkey it claims to own.
challenge_peer
	(optional)
    The challenge_mine of the other peer.
challenge_proof
	A signature of the challenge_mine sent by the other peer.
challenge_verified
	(optional)
    This is tracked by each individual peer on it's own.
peer.publickey
	The peer object generally represent information about the peer itself.
    The publickey is it's own publickey.
peer.host
peer.port
peer.protocol
	If the peer wishes to act like a server, this may be useful for peers in case the connection is lost.
peer.endpoint
	Another protocol, host, and port set which represents the other peer.
peer.version
	The version of the wallet this peer is running. This can be used by a client to let it know whether it needs to wipe it's wallet and create a new one. This is for testnet purposed only and will be deprecated.
peer.synctype
	Can be "none", "full", or "lite". Indicates what type of peer I am. A full client will be given full blocks, a lite client will be given lite blocks, a "none" client will not get new blocks.
peer.sendblks
	Indicates if this peer sends blocks.
peer.sendtxs
	Indicates if this peer sends transactions.
peer.sendgts
	Indicates if this peer sends golden ticket solutions.
peer.receiveblks
	Indicates if this peer receives blocks.
peer.receivetxs
	Indicates if this peer receives transactions.
peer.receivegts
	Indicates if this peer receives golden ticket solutions.
peer.keylist
	When requesting lite blocks, the serving peer will only blocks which include transactions from or to one of the pubkeys in this list.
modules
	A list of modules being run by the client. If a transaction includes a message with the field module, these transaction will automatically be routed to the relevant module by the module system. In the future, we may also have peers honor this logic for peer requests by leveraging this list, but it is currently unused.
services
	A module may act as a service. If so, it can indicate to peers that it provides this service here. For now a service is simply a name and peers must know how to interact with the given service. In the future, a new module type will allow services to automatically be disoverable and help to broadcast the form or their API to service consumers.
blockchain.last_bid
	The blockchain object is used to indicate to the other peer the state of this peers blockchain. last_bid is the last block id.
blockchain.last_ts
	Last timestamp seen by the peer.
blockchain.last_bsh
	Hash of the last block.
blockchain.last_bf
	Last Burn Fee
blockchain.fork_id
	Fork ID. This is a concise representation of the block hash which can be use to reconcile the latest common block between peers which appear to be on separate forks.
blockchain.genesis_bid
	Genesis Block ID
```
## Peer Requests
Once peers have connected the websocket and verified each other, they can begin to send other messages over the socket.

These message can serve a number of purposes, or can also simply be leveraged by a DAPP as a means of peer-to-peer communication. At the moment, there's not really a good way to discover peers, but in the future we envision this becoming a common technique. As of this moment, this mechanism is mostly used for client-server type interactions, for example, the chat module will send transaction to connected peers so they can receive messages before they are mined. Think of it as a simple mechanism for transactions which are "0-conf safe".

To leverage this capability, a transaction can simply be sent with an arbitrary message type(i.e. message.request).

Core provides helper functions for this as mentioned above: *peer.sendRequest*, *peer.sendRequestWithCallback*, and their counterparts *network.sendRequest* and  *network.sendRequestWithCallback*, which will send the message to all connected peers.
```
peer.sendRequest('myCustomMessageType', someDataObject);
// or
peer.sendRequestWithCallback('myCustomMessageType', someDataObject, (res) => {
// do something with the response
});
```
Beside being used a generate data transportation, there are some message types which have a special purpose. Beside 'handshake', this is also 'block', 'missing block', 'blockchain', 'transaction', and 'keylist', which have to following purposes:


### block
This message informs the peer that a new block has been found or that the peer should request a block for some other reason. The peer then makes a request to the appropriate GET enpoint mentiond above, i.e. /blocks/:bhash/:pkey or /lite-blocks/:bhash/:pkey.

**Message Data**:
  * bhash: the block hash
  * bid: the block id

**Example**:
```
{ bhash: block.hash, bid: block.id }
```

### missing block
This message requests a block from the peer. The peer will then reply with a 'block' message.

**Message Data**:
  * hash: from hash
  * last_hash: to hash 

**Example**:
```
{ hash: block.prevbsh, last_hash: latestBlockHash }
```

### blockchain
This message sends arrays of data which indicate to a lite client which blocks in the chain contain transactions in it's keylist.

**Message Data**:
  * start: previous block hash of starting block
  * prehash: array of hashes of block signatures
  * bid: array of block ids
  * ts: array of timestamps
  * txs: array of 0 and 1 indicating if block contains tx related to keylist 

**Example**:
```
let message = {};
    message.request = "blockchain";
    message.data = {};
    message.data.start = prevhash;
    message.data.prehash = [];
    message.data.bid = [];
    message.data.ts = [];
    message.data.txs = [];
```

### transaction

This message is used to send a transaction to a peer.

**Message Data**:
  * start: previous block hash of starting block
  * prehash: array of hashes of block signatures
  * bid: array of block ids
  * ts: array of timestamps
  * txs: array of 0 and 1 indicating if block contains tx related to keylist 

**Example**:
```
let tx = new saito.transaction({...});
peer.sendRequest("transaction, JSON.stringify(tx.transaction));
```

### keylist

**Message Data**:
  * [array of pubkeys]

**Example**:
```
peer.sendRequest(message, app.keys.returnWatchedPublicKeys());
```
## Block Data Endpoints

GET /blocks/:bhash/:pkey

GET /lite-blocks/:bhash/:pkey

TODO: Finish this section

## Other RESTFUL Endpoints

GET /options

TODO: Finish this section

# Contact 

To connect to the Saito Network please contact us at:

* network@saito.tech
* [Discord](https://discord.gg/QjeXTC3)
* [Telegram](https://t.me/joinchat/BOSYOk_BR8HIqp-scldlEA)

