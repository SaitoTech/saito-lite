# REST API

## Table of Content

* [REST API](#REST-API)
	* [Websocket Connection](#Websocket-Connection)
	* [Peer Requests](#Peer-Requests) 
	* [Block Data Endpoints](#Block-Data-endpoints)
	* [Other RESTFUL Endpoints](#Other-RESTFUL-Endpoints)
  
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
