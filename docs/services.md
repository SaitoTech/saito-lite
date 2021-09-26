# Saito Services Protocol - SMP-30


## Abstract 

The following document describes the methods modules use to broadcast services they are running to peers and users on the network. It covers how to query a remote peer to find out what services it offers, and how to submit service requests to that peer.

| Field   | Value             |
| ------- | ----------------- |
| Author  | David Lancashire  |
| Status  | Published         |
| Type    | Protocol Standard |
| Created | January 8, 2021   |

## What Are Services

Saito access points often provide off-chain data services. These services can be as simple as running a database so that nodes can make off-chain data queries, or a relay mechanisms so that peers can transmit data off-chain, or access to infrastructure for other blockchains such as Polkadot and its parachains.

Because Saito modules exist in a peer-to-peer landscape, there is no architectural difference between connecting to one peer and the next. For this reason, the Saito platform allows peers to announce which "Services" they support. This information can be used by nodes to direct on-chain or off-chain queries to the peers that they use for specific services.

A node may connect to one peer that runs a tx-archiving service for it, paying for the service by routing transactions into the network through that node. It may use applications that connect with Polkadot applications, paying for those nodes to run Polkadot infrastructure by routing Saito transactions to their access points as well.

This document concerns how access nodes announce they are running services, and how modules can be programmed to connect to them to access remote-services.



## Defining a Service

Modules define services by overriding the `returnServices()` function in the modTemplate class file. This function is expected to return an array of associative key-value objects. In the following example, a module announces that it is running a backend "post" service -- this indexes community content for a forum managed by the Post module. 

```javascript
  //
  // defining my services
  //
  returnServices() {
    let services = [];
    services.push({ service: "post" });
    return services;
  }
```

(OPTIONAL) This function is executed whenever a new block is added to the chain. Modules can overwrite this function to take action when blocks are received. It differs from onConfirmation in that it will be triggered by any blocks, not just those that add to the longest-chain.




## Making Service Requests

Peers inform each other of the services they offer as part of the connection handshake. The services running on each peer can then be examined by examining the `peer.peer.services` object in the `/lib/saito/peer.js` class.

It is considered good etiquette to filter for peers which support the relevant services when building modules and make off-chain requests. Peers will quietly ignore unsupported requests, but if a module spams all of its connected peers with constant requests for off-chain data that can cause degraded performance with in-browser websockets and result in the user needing to pay higher fees for network access.

Off-chain peer requests may be made through the modTemplate class:


```javascript
  async sendPeerRequestWithFilter(msg_callback, success_callback, peer_filter) {}
```

__msg_callback__ - the function to execute to generate the message submitted, if received
__success_callback__ - the function to execute with the peer data response, if received
__peer_filter__ - a function that returns 0 or 1 for every peer object

This function accepts three functions as arguments. The first is executed to generate the message that is passed to peers through the off-chain websocket, the second is called when and if a response is received over that same websocket, while the third allows us to select to which peers the request is sent. Note that if multiple peers are sent the request, the success_callback will fire multiple times.

It is easier to understand how this works with a documented example:

```javascript
  mod.sendPeerRequestWithFilter(

    //
    // msg_callback
    //
    // off-chain requests are sent as an obj with two main fields, `obj.request` which
    // is a string describing the request being made, and a `obj.data` associative-
    // array which typically includes the `.module` field indicating which module should
    // handle this request.
    //
    // additional data may be affixed to the data object. it is common to send signed
    // transactions or other cryptographic sigs in these types of messages, for instance,
    // such as requests to archive nodes to archive particular transactions.
    //
    // note that the peer requesting processing by a specific module has no guarantee of 
    // which module will actually execute the data, or how they will respond. it is the 
    // responsibility of users to ensure they are using modules compatible with peers, 
    // the network preserves openness and freedom-of-choice, as with the HTML protocol.
    //
    () => {
          let obj = {};
          obj.request = 'query posts';
          obj.data = {};
          obj.data.module = "Arcade";
          obj.data.r      = "attach extra data";
    },

    //
    // success callback
    //
    // "res" is the object returned from our peer. it may be undefined. it may be null. it
    // may or may not contain the data requested by the peer and should be subject to 
    // sanity and security checks. this callback is triggered once the object has been
    // received over teh network. if there is no response (and there is no guarantee that
    // any peer will respond, then this callback is simply never executed.
    //
    (res) => {
    },

    //
    // peer filter 
    //
    // every peer to which the user is connected is passed through this filter callback. if
    // the function returns 1 the request is sent to that peer. if the function returns 0
    // then that peer is skipped.
    //
    // in this example code we check to see if the peer provided is running the "posts"
    // service and returning 1 (i.e. sending the request) if so. all peers that do not 
    // announce support for this service pass through and are skipped.
    //
    (peer) => {
      if (peer.peer.services) {
        for (let z = 0; z < peer.peer.services.length; z++) {
          if (peer.peer.services[z].service === "posts") {
            return 1;
          }
        }
      }
      return 0;
    }

  );


## Making Database Requests

One common use-case for off-chain peer requests is querying. As mentioned in our [Application protocol](application.md), modules that create an `/sql` subdirectory and place table definition files in there will automatically create tables.

The following function exists as a convenient method for peers to make SQL queries on remote databases. As with other off-chain requests, there is no guarantee that peers will provide data in response to requests or return data in the expected format. The following standard is used by core Saito applications:

```javascript
  async sendPeerDatabaseRequestWithFilter(modname="", sql="", success_callback=null, peerfilter=null) {}
```

__modname__ - the name of the module which should process this request on the remote server
__sql__ - the request SQL query to be executed
__success_callback - a callback whose first argument is the database response, if returned
__peer_filter - a callback which takes a peer as an argument and determines in boolean fashion whether to send the off-chain request to the peer.


## One Final Note

One tricky part of designing blockchain applications that run in browsers powered by independent clients is that modules and UI components may render before the client handshake with the remote peer is complete. If queries are made as part of `initialize(app)` or `initializeHTML(app, mod)` then it is possible that the DOM/UI will display before the peer-to-peer websocket is initialized and ready for use.

If your application requires making database requests to remote servers on load, we recommend avoiding this problem by starting the logic which triggers the updating of your DOM/UI interface be triggered by overriding the function `onPeerHandshakeComplete(app, peer)` in the ModTemplate class (`/lib/templates/modtemplate.js`). This function will fire when a peer completes its handshake and is ready to accept both on and off-chain requests.



## Copyright
Copyright Proclus Technologies, 2021.

## Citation
Please cite this document as:

David Lancashire, "SMP-30: Saito Module Protocol", Saito Network Documents, no, 3, January 2021 [Online serial]. Available: https://github.com/saitotech/saito-lite/docs/standard/application.md.


