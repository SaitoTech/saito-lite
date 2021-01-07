# Saito Events Protocol - SMP-20


## Abstract 

The following document describes the major events that occur in the Saito client, along with the recommended mechanism for adding and removing events. 

| Field   | Value             |
| ------- | ----------------- |
| Author  | David Lancashire  |
| Status  | Published         |
| Type    | Protocol Standard |
| Created | January 1, 2021   |


## Sending and Receiving Events

The Saito application object (app) contains a Connector which serves as an event emitter. Any application or module may use this to broadcast events, or attach listeners to receive messages broadcast by other components in the system:

```javascript
//
// sending event
//
app.connector.emit('connection_up', peer);

//
// receiving event
//
app.connection.on('connection_up', (peer) => {
  console.log("Connected to: " + peer.peer.publickey);
});
```

Modules are invited to create and define their own events. This page serves as documentation of the core events created and respected by the main codebase as well as significant applications on the network. We encourage developers not to override these events.


## List of Important System Events


#### CONNECTION UP

```javascript
app.connection.on('connection_up', (peer) => {});
```
__peer__ - reference to the relevant Saito peer object

NOTE: This event fires whenever a connection to a peer becomes unstable due to network conditions. It is primarily used by applications to signal when connectivity drops. The peer object is defined in (`/lib/saito/peer.js`) and stored in the peers array of the network object (`/lib/saito/network.js`). 

#### CONNECTION DOWN

```javascript
app.connection.on('connection_down', (peer) => {});
```
__peer__ - reference to the relevant Saito peer object

NOTE: This event fires whenever a connection to a peer becomes stable. It is primarily used by applications to signal when connectivity is restored after a period of disconnect. The peer object is defined in (`/lib/saito/peer.js`) and stored in the peers array of the network object (`/lib/saito/network.js`). 

#### HANDSHAKE COMPLETE

```javascript
app.connection.on('handshake_complete', (peer) => {});
```
__peer__ - reference to the relevant Saito peer object

NOTE: This event fires whenever a peer has completed its handshake and has verified its publickey. Listen to this event if your module only wishes to interact with peers with a known and verified publickey. The peer object is defined in (`/lib/saito/peer.js`) and stored in the peers array of the network object (`/lib/saito/network.js`). 



## Copyright
Copyright Proclus Technologies, 2021.

## Citation
Please cite this document as:

David Lancashire, "SMP-20: Saito Module Protocol", Saito Network Documents, no, 1, October 2020 [Online serial]. Available: https://github.com/saitotech/saito-lite/docs/standard/application.md.


