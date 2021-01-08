# Welcome to Saito

Saito is a **Tier 1 Blockchain Protocol** that provides **high throughput**. The network accomplishes with a consensus mehanism that pays the ISPs in the network instead of miners and stakers. The technical solution unleashes a distributed, global PKI layer.

If you need to get in touch with us, please reach out anytime. 

The Saito Team
info@saito.tech


## Table of Content

* [Preamble](#Preamble)
* [How To Use Saito](#How-To-Use-Saito)
* [Getting Started](#Getting-Started)
* [The Consensus Mechanism](#The-Concensus-Mechanism)
* [REST API](#REST-API)
	* [Websocket Connection](#Websocket-Connection)
	* [Peer Requests](#Peer-Requests) 
	* [Block Data Endpoints](#Block-Data-endpoints)
	* [Other RESTFUL Endpoints](#Other-RESTFUL-Endpoints)
* [Contact](#Contact)

## Other Documentation
* [Welcome To Saito(this doc)](README.md)
* [Roadmap](docs/roadmap.md)
* [Application/Module Protocol](docs/applications.md)
* [Application/Module Events Protocol](docs/events.md)
* [Network Services](docs/services.md)
* [Saito Open Infrastructure](docs/saitoopeninfrastructure.md)
* [Block and Transaction Validation](docs/validation.md)

//
// this is how we describe a valid
//

# Preamble

Saito is a simple and elegant system. The consensus mechanism provides economic security without the need for external markets or complicated governance structures.

Building on Saito is also very simple. From the perspective of an DAPP developer, all that really needs to be understood is that the chain contains a UTXO set representing a ledger of Saito payments (similar to Bitcoin). Applications install into the wallets of end-users. These applications can attach data to transactions and broadcast them to each over over the network. The Saito application layer describes how to build applications that do this. The Saito network documentation describes the underlying mechanism that powers the application layer.

Before working with this repository it may be helpful to get some perspective on the Saito roadmap and what you can expect at this point.

If you're interested in developing DAPPs on top of Saito, that's all you really need to know. However, we've included a description of the consensus mechanism here because it is an important piece of the protocol and many people reading this document will need to know the details. If you're interested in the core advances Saito makes and in helping to develop the core blockchain, please also see our roadmap doc and reach out anytime with questions or suggestions.


# How To Use Saito

The Reference Implementation of Saito is written in NodeJS. Developers can get started by cloning the repo and running a local node which can serve applications directly to your browser. Once your application is developed you may publish it to the network. When you are ready to deploy a live application see our tutorial on [deploying applications to the network](http://org.saito.tech/tutorial-1-deploy-a-new-application/).


## System Preparation

Saito requires a rececent version of NodeJS (>= 12). You can install this as follows:

### Linux
```
apt update
apt upgrade
apt install npm
```

### Mac / Windows / Other

System-specific installation instructions are available on the [official NodeJS website](https://nodejs.org/en/).


## Install Saito and Start a Node

Clone the Saito software directory and start-up an instance of Saito as follows:

```
git clone https://github.com/saitotech/saito-lite
cd saito-lite
npm install
npm run nuke
npm start
```

The system will be started in 'local' or 'development' mode with a default set of modules responding on port 12101.

Once Saito is running you can test that it is working by visiting `http://localhost:12101/wallet` in your browser. Saito applications look and feel like websites. They are not -- applications run directly inside your browser and connect with blockchain access-points to send and receive data. Our default installation includes a default set of modules (applications). You can change which modules are installed by editing the file `/config/modules.config.js` to include them. Modules are installed by default in the `/mods` directory.


## Building Applications

A tutorial series that will get you started building applications can be found in our list of [online developer tutorials](http://org.saito.tech/introduction-to-saito-development).

Details on the API used by Saito modules can be found in our [Applications documentation in the /docs directory](docs/applications.md).

Developers may also build applications that integrate directly with the blockchain-layer REST API described below. Tools to assist with this will be coming shortly.



## Installing Applications and Running:

Once you have developed an application, see our [online developer tutorials](http://org.saito.tech/introduction-to-saito-development) for information on how to publish it into the live network and get it hosted on the Saito AppStore for other users and developers to install.

If you wish to install your module locally for testing, put it into the `/mods` directory and add it to both the `core` and `lite` sections of your `/config/modules.config.js` file. Then run this commpand:

``` 
npm run compile
```
This command will compile the codebase into a javascript payload which can be delivered to browsers. The payload will saved as the `/web/saito/saito.js` file and can be loaded by any page you wish to author. As a convenience, the Saito platform will automatically serve web requests if configured correctly, making it quite simple to get started making DAPPs in the browser.


# The Consensus Mechanism

Saito Protocol creates a network similar to Bitcoin. As an economically self-sufficient network, Saito manages a token which is collected from user fees and paid out to the nodes which run the protocol. This reward incentivize nodes to run the protocol and ensures it is always profitable to participate in the network. Saito differs from a typical Proof-of-Work chain in several ways:

## 1) Automatic Transaction Rebroadcasting

Saito's Blockchain has a pruning mechanism that charges rent to transactions which wish to stay on the blockchain. This allows the network to prune old blocks and retain only the header-hash to prove connection with the original genesis block. In addition to giving users full control over how long their data must be hosted and distributed by the network, this approach lowers the cost of using the network for most web3 applications, which no longer need to pay for long-term data persistence.

After a number of blocks which we call the Genesis Period, UTXOs which are below the Rebroadcast Limit can be pruned from the chain. However, the consensus mechanism dictates that any UTXO with sufficient output to pay the Rebroadcast Fee(double the average fee per byte over the last N blocks) must be included in the next block, i.e. rebroadcasted. However, it is important to note that we do not envision this mechanism actually being used to keep UTXOs on the chain, it's primary purpose is to incentives wallets to consolidate their UTXOs in a more sensible manner.

## 2) Burn Fee and Golden Tickets

In other blockchains a single form of work governs who produces a block and who receives payment. The fees contained in a block are handed over to the producer of a block in order to avoid economic attacks on the payment faucet and ensure that the distribution of funds is fair. 

In Saito these are split into two separate functions: the network has one algorithm for determining who has the right to produce a block, and a second algorithm for determining how much money that can collect from the publication of any block. Saito regulates both difficulty and payout to ensure the cost of producing a block is always higher than the amount of money any participant can collect from the network.

## 3) Burn Fee 

Block production is made difficult by requiring nodes to collect a critical mass of "Routing Work". Nodes accomplish this by servicing users and collecting transactions from them in return. In order to be eligible for payment they must be in the chain of routing nodes that successfully route this transaction into a valid block.

The amount of Routing Work each transaction provides to each node is algorithmically derived from the fee embedded in the transaction modified downwards according to its position in the network. User-facing nodes on the outside of a routing path get more Routing Work from the same transaction than nodes which receive that transaction after several hops. The amount of Routing Work available to each additional node falls as the routing path increases, but the total amount of Routing Work contained in that transaction increases. At this time, the amount of Routing Work provided by a transaction is halved with each hop.

To produce blocks nodes must efficiently locate themselves at critical junctures with access to high-fee, low-hop transaction inflows. We call the amount of work they must gather to produce a valid block the Burn Fee. This Burn Fee is dynamic: it decreases logarithmically from the previous Block Time and will eventually fall to zero, at which point the cost of producing a valid block will fall to zero. When a block is produced, no payment is made to the block producer. They are eligible for payment as a routing node through the Golden Ticket mechanism described below.

## 4) Golden Tickets

Once a valid block is seen on the network, hashers begin trying to solve a hashing puzzle. We call this system the "Golden Ticket System" and the hashing puzzle the "Golden Ticket Puzzle". The network auto-adjusts hashing difficulty to keep the number of tickets produced constant(Currently 1 every 2 blocks). Any sufficiently difficult hash which passes this difficulty threshold constitutes a "Golden Ticket Solution". Golden Ticket solutions are broadcast to the network as a special transaction. If this transaction is included in the very next block we say that the Golden Ticket has been solved.

The Golden Ticket included in the subsequent block is used as a source of entropy to choose a winning Routing node from the list of Routing nodes which routed transactions contained in the previous block. The fees that were burned by the block producer producing the block are then revivified and split between the winning Routing node and the Hashing node that found the Golden Ticket solution.

To ensure that attackers cannot break either the Burn Fee or Golden Ticket mechanisms, Saito adds cryptographic signatures to the network layer of the blockchain. As each transaction is passed around the network, the cost of including it in a block increases. This cost is a claim on all of the fees included in the block. Honest nodes find this acceptable as they are accepting a reduced claim on a basket of fees paid by honest users. Attackers must accept a reduced claim on recapturing their own money.

The cost of attack becomes statistically negative in all situations.

The magic happens at the confluence of these two mechanisms:

* The amount of Routing Work associated with a transaction increases as the transaction is routed(halved at each hop, same as the Golden Ticket chances).
* A Routing Node's chance of winning the Golden Ticket is proportional to the amount of extra Routing Work it is adding to the transaction by signing and routing it.

## 5) Moving Beyond Majoritarian Attacks

Those interested in a visual introduction to how "routing work" and "claims-on-payment" are calculated can see our [Introduction to Saito Consensus](http://org.saito.tech/wp-content/uploads/2020/08/Saito-2020-Consensus-Mechanisms.pdf). Diagrams in that presentation show exactly how "routing work" is generated and what percentage claim of the block reward each node gets given its position in the network.

Saito's most valuable insight is that fee processing (i.e. the collection and sharing of fee-paying transasctions) can be used as difficulty function without the need to wash those fees through external markets subject to economic attack. Accomplishing this simply requires making it impossible for attackers to collect more money from the blockchain than they need to spend to produce the longest-chain.

The Golden Ticket system is by far the most difficult and valuable part of Saito's Consensus mechanism. Part of the confusion for most people new to Saito is that the "routing work" and "claims on payment" any transaction provides any node are separate figures derived by separate algorithms from the same transaction fee. As transactions pass around the network, the value of using those transactions to produce blocks shrinks, while the cost of doing so increases. Attackers who put honest transactions to their blocks must transfer income to the honest nodes in the network.

Don't be discouraged if this mechanism seems confusing at first. If you have questions, feel free to reach out. What's important to remember is that:

1) The value of a transaction for producing a block drops the more hops a node is from a user.

2) The amount of money a routing node can expect to get paid on their share of the overall work done by all routing nodes.

The Routing Work associated with a transaction is the sum of the Golden Ticket chances it has imparted to it's Routers.

Stated on more way: A valid block can be formed at any time, but will only be profitable to it's Routers when the total Burn Fee is offset by the amount of fees included by the transaction in the block. The contribution to Routing Work from a transaction is it's fee. The Routing Work needed to include that transaction is increased each time it is routed through the network but the total Burn Fee needed for a given block is decreasing as the previous block gets further away in the past.

If you're still confused don't feel bad: most people have trouble wrapping their head around the mechanism the first time. We encourage those interested in exploring the intricacies of the mechanism to read the [Saito Whitepaper](https://saito.io/saito-whitepaper.pdf). In addition to providing more details on technical and economic implementation, our whitepaper explains how to secure this mechanism against sybil attacks, block-flooding (spam) attacks and more issues that commonly arise in POW and POS-class mechanisms.

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
