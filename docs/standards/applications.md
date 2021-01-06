# Saito Module Protocol - SMP-10


## Abstract 

The following standard allows for the implementation of a standard API for applications or modules running on Saito nodes. This standard provides basic functionality to interact with the blockchain, process messages received over the blockchain, as well as handle common user-interface requirements such as distributing data.

| Field   | Value             |
| ------- | ----------------- |
| Author  | David Lancashire  |
| Status  | Published_        |
| Type    | Protocol Standard |
| Created | October 31, 2020  |


## Distribution and File Format

Applications exist in standalone directories in the /mods directory. The "arcade" module will be located at /mods/arcade. The AppStore module will be located at /mods/appstore. The basic contents of this directory are:

> module.js
> lib/
> sql/
> web/
> README.md.

The only necessary file is the `module.js` file, which is the only javascript file in the root directory. The name of this file must consist only of lowercase, alphanumeric characters (i.e. slug). The additional directories are used as follows:

### /lib

Optional directory to place additional javascript files.

### /sql

Optional directory to include SQLITE3 table definition files. Saito clients with backend database support will insert these tables on installation of the module. All tables will be inserted into a database that corresponds to the application slug. The database will be stored in the `/saito-lite/data/` subdirectory.

### /web

Optional directory to contain HTML / CSS / JS files for remote serving. Files in this directory will be made available over HTTP to requests made to the main server. Complicated applications often use HTML files to create a DOM scaffold for manipulation.


## Publishing

Modules are typically distributed as .zip files. These files contain a directory structure, which influences how the application will be executed and illustrates how to organize a module. The most important elements of an application directory are as follows:

Applications may be published to the network by submitting the application data as part of a normal transaction that is broadcast into the network. The content of the transaction message field is as follows. The two user-provided elements are the module_zip (containing the zip-file above) and the name of the application):

```javascript
  tx.msg = {
    module: "AppStore",
    request: "submit module",
    module_zip: __ZIPFILE__,
    name: __MODULE_NAME___
  };
```

AppStores running on the network will identify the publisher by , and derive the application version by hashing the timestamp and signature of the transaction containing the application payload. This ensures that every application published to the network has a unique ID, and can be verified as produced by the publisher prior to installation.


## Module.js API

NOTES:

All modules should extend from a class in the `/lib/saito/templates` directory. This standard documents the functionality available in the default `/lib/saito/templates/modtemplate` file. The most basic module possible should provide itself with a constructor and a name as follows:

```javascript
const ModTemplate = require('../../lib/templates/modtemplate');

class ModuleName extends ModTemplate {

  constructor(app) {

    super(app);

    this.name          = "ModuleName";

  }
}
module.exports = ModuleName;
```

### Class Variables

The following variables may be defined by applications within the constructor:

|---------------|---------------|
| name  	| String 	| 
| description  	| String 	|
| categories   	| String 	|
| slug  	| String 	|
| events  	| Array 	| 
| db_tables 	| Array 	|



### Class Functions 

  installModule(app) {} 

  this callback is run the first time the module is loaded. You
  can override this callback in your module if you would like,
  but should be a bit careful to include this line at the top:
  
      super.installModule(app);
  
   ... if you want to keep the default functionality of auto-
   creating a database with the necessary tables on install
   if it does not exist.


  initialize(app) {}

  //
  // INITIALIZE
  //
  // this callback is run every time the module is initialized. It
  // takes care of the events to which we want to listen by default
  // so if you over-write it, be careful to include this line at
  // the top:
  //
  //    super.initialize(app);
  //
  // that will ensure default behavior appies to inherited modules
  // and the the sendEvent and receiveEvent functions will still work
  //


  initializeHTML(app) { };


  //
  // INITIALIZE HTML (deprecated by render(app))
  //
  // this callback is called whenever web applications are loaded
  //


  attachEvents(app) { }

  //
  // ATTACH EVENTS (deprecated by render(app))
  //
  // this callback attaches the javascript interactive bindings to the
  // DOM, allowing us to incorporate the web applications to our own
  // internal functions and send and receive transactions natively.
  //

  render(app) { }

  //
  // RENDER
  //
  // adds elements to the DOM and then attaches events to them as needed.
  // this replaces initializeHTML and attachEvents with a single function
  //


  //
  //
  // ON NEW BLOCK
  //
  // this callback is run every time a block is added to the longest_chain
  // it differs from the onConfirmation function in that it is not linked to
  // individual transactions -- i.e. it will only be run once per block, while
  // the onConfirmation function is run by every TRANSACTION tagged as
  // this is where the most important code in your module should go,
  // listening to requests that come in over the blockchain and replying.
  //
  onNewBlock(blk, lc) { }

  //
  //
  //
  // ON CHAIN REORGANIZATION
  //
  // this callback is run everytime the chain is reorganized, for every block
  // with a status that is changed. so it is invoked first to notify us when
  // longest_chain is set to ZERO as we unmark the previously dominant chain
  // and then it is run a second time setting the LC to 1 for all of the
  // blocks that are moved (back?) into the longest_chain
  //
  onChainReorganization(block_id, block_hash, lc, pos) { }

  //
  //
  //
  // ON WALLET RESET
  //
  // this function runs if the wallet is reset
  onWalletReset() { }



  //
  //
  // ON CONNECTION STABLE
  //
  // this function runs "connect" event
  onConnectionStable(app, peer) { }

  //
  //
  // ON CONNECTION UNSTABLE
  //
  // this function runs "disconnect" event
  onConnectionUnstable(app, peer) { }


  //
  // SHOULD AFFIX CALLBACK TO MODULE
  //
  // sometimes modules want to run the onConfirmation function for transactions
  // that belong to OTHER modules. onConfirmation will be fired automatically
  // for any module whose name matches tx.msg.module. Other modules who are
  // interested in those transactions can use this method to subscribe to those
  // onConfirmation events. See onConfirmation for more details.
  //
  // An example is a server that wants to monitor
  // AUTH messages, or a module that needs to parse third-party email messages
  // for custom data processing.
  //
  shouldAffixCallbackToModule(modname, tx=null) {
    if (modname == this.name) { return 1; }
    return 0;
  }

  //
  // SERVER
  //
  // this callback allows the module to serve pages through the main application
  // server, by listening to specific route-requests and serving data from its own
  // separate web directory.
  //
  // This can be overridden to provide advanced interfaces, for example you may
  // want to create a module which serves JSON objects as an RESTFUL API. See
  // Express.js for details.
  //


  //
  // UPDATE BALANCE
  //
  // this callback is run whenever the wallet balance is updated
  // if your web application needs to display the amount of funds
  // in the user wallet, you should hook into this to update your
  // display when it changes.
  //
  // updateBalance(app) { }

  //
  // UPDATE IDENTIFIER
  //
  // this callback is run when a user registers an identifier.
  // You can use this to update parts of the application that are displaying
  // their initial hash username
  //
  updateIdentifier(app) { }



  //
  // modules may ask other modules to respond to "request_types". The
  // response that they get may or may not be suitable, but if suitable
  // can be used by the requesting module to format data or update
  // its DOM as needed. This is a basic method of providing inter-app
  // interactivity and extensibility.
  //
  respondTo(request_type = "") { return null; }

  //
  // when an event to which modules are listening triggers, we push the
  // data out into this function, which can be overridden as needed in
  // order to
  //
  receiveEvent(eventname, data) {
  }


  // HANDLE PEER REQUEST
  //
  // not all messages sent from peer-to-peer need to be transactions. the
  // underlying software structure supports a number of alternatives,
  // including requests for transmitting blocks, transactions, etc.
  //
  // DNS messages are one example, and are treated specially because of
  // the importance of the DNS system for routing data. This is a more
  // generic way to plug into P2P routing.
  //
  // if your web application defines a lower-level massage format, it can
  // send and receive data WITHOUT the need for that data to be confirmed
  // in the blockchain. See our search module for an example of this in
  // action. This is useful for applications that are happy to pass data
  // directly between peers, but still want to use the blockchain for peer
  // discovery (i.e. "what is your IP address" requests)
  //
  async handlePeerRequest(app, message, peer, mycallback = null) {


  returnServices() {
    return []; // no services by default
  }

  handleUrlParams(urlParams) {}




## Copyright
Copyright Proclus Technologies, 2020.


## Citation
Please cite this document as:

David Lancashire, "SMP-20: Saito Module Protocol", Saito Network Documents, no, 1, October 2020 [Online serial]. Available: https://github.com/saitotech/saito-lite/docs/standard/application.md.


