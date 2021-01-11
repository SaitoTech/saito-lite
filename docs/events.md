# Saito Events Protocol

## Abstract 

The following document describes the major events that occur in the Saito client, along with the recommended mechanism for adding and removing events. 

| Field   | Value             |
| ------- | ----------------- |
| Author  | David Lancashire  |
| Status  | Published         |
| Type    | Protocol Standard |
| Created | January 8, 2021   |

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
peer - reference to the relevant Saito peer object

NOTE: This event fires whenever a connection to a peer becomes unstable due to network conditions. It is primarily used by applications to signal when connectivity drops. The peer object is defined in (`/lib/saito/peer.js`) and stored in the peers array of the network object (`/lib/saito/network.js`). 


#### CONNECTION DOWN

```javascript
app.connection.on('connection_down', (peer) => {});
```
peer - reference to the relevant Saito peer object

NOTE: This event fires whenever a connection to a peer becomes stable. It is primarily used by applications to signal when connectivity is restored after a period of disconnect. The peer object is defined in (`/lib/saito/peer.js`) and stored in the peers array of the network object (`/lib/saito/network.js`). 

#### HANDSHAKE COMPLETE
 
```javascript
app.connection.on('handshake_complete', (peer) => {});
```
peer - reference to the relevant Saito peer object

NOTE: This event fires whenever a peer has completed its handshake and has verified its publickey. Listen to this event if your module only wishes to interact with peers with a known and verified publickey. The peer object is defined in (`/lib/saito/peer.js`) and stored in the peers array of the network object (`/lib/saito/network.js`). 


#### UPDATE BALANCE

```javascript
app.connection.on('update_balance', (wallet) => {});
```
wallet - reference to the Saito wallet object

NOTE: This event fires whenever a wallet receives or spends SAITO over the blockchain. The wallet object is defined in (`/lib/saito/wallet.js`).


#### UPDATE IDENTIFIER

```javascript
app.connection.on('update_identifier', (key) => {});
```

key - reference to the updated Saito key object

NOTE: Saito manages a keychain (`/lib/saito/keychain.js`) with a set of keys (`/lib/saito/key.js`). These keys store peer-to-peer information. The identifier is a user-readable name . This event fires when the wallet updates an identifier.


#### UPDATE EMAIL

```javascript
app.connection.on('update_email', (key) => {});
```

key - reference to the updated Saito key object

NOTE: Saito manages a keychain (`/lib/saito/keychain.js`) with a set of keys (`/lib/saito/key.js`). These keys store peer-to-peer information. The email is an optional legacy email-address associated with each key. This event fires when the wallet updates an email.

#### UPDATE TAG

```javascript
app.connection.on('update_tag', (key) => {});
```

key - reference to the updated Saito key object

NOTE: Saito manages a keychain (`/lib/saito/keychain.js`) with a set of keys (`/lib/saito/key.js`). These keys store peer-to-peer information. The tag is an array of Strings which can be added to keys to associate them with publickeys. Modules may use tags to selectively tag addresses as in need to special processing. This event fires when the wallet inserts a tag.


#### SET PREFERRED CRYPTO

```javascript
app.connection.on('set_preferred_crypto', (ticker) => {});
```

ticker - market ticker (String) of the cryptocurrency set to user default

NOTE: This event fires whenever a user changes the default crypto in their wallet (`/lib/saito/wallet.js`). It is used by the saito header (`/lib/saito/ui/saito-header/saito-header.js`) and other modules to update the UI to reflect changes in user preferences.


## Copyright
Copyright Proclus Technologies, 2021.

## Citation
Please cite this document as:

David Lancashire, "SMP-20: Saito Module Protocol", Saito Network Documents, no, 2, January 2021 [Online serial]. Available: https://github.com/saitotech/saito-lite/docs/standard/application.md.


