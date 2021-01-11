# Saito Module Protocol - SMP-10


## Abstract 

The following standard allows for the implementation of a standard API for applications or modules running on Saito nodes. This standard provides basic functionality to interact with the blockchain, process messages received over the blockchain, as well as handle common user-interface requirements such as distributing data.

| Field   | Value             |
| ------- | ----------------- |
| Author  | David Lancashire  |
| Status  | Published         |
| Type    | Protocol Standard |
| Created | January 8, 2021   |

## Module File Name Conventions

Applications exist in standalone directories in the /mods directory. The name of this directory should be the lowercase, alphanumeric version of the application name. The "arcade" module is located at /mods/arcade. The AppStore module is located at /mods/appstore. All applications share the same basic directory structure:

```
appname.js
lib/
sql/
web/
README.md.
```

The only necessary file is the `appname.js` file, which should share its name with the parent directory. This should be the only javascript file in the root directory. Additional files should be installed in the relevant subdirectories according to the application standard. These subdirectories are:

__lib/__
Optional directory to place additional javascript files.

__doc/__
Optional directory for documentation and license information.

__sql/__
Optional directory for database definition files (sqlite3 format). Saito clients with database support capabilities will auto-create a module database (`/data/appname.sq3`) on installation and insert these tables in that database. Saito-clients without database support will simply skip this step.

__web/__
Optional directory for JS / HTML / CSS files. Saito clients with HTTP support will serve these files from the subdirectory of the application name (i.e. `https://appserver.com/appname`) with `index.html` as the default file to serve.

## Workflow

To build and test your Module while developing simply configure and build the "Lite Client".

In the config directory you'll find a file named modules.config.js. You'll need to add your module to the array called "lite".

Once your module is in the config file you can do *npm run compile dev* and a lite client will be bundled and copied to /web/saito/saito.js. The core code will serve this file at localhost:12101/saito/saito.js. This file should be included in the index.html file inside the web directory of your module.

The server can then be started by running *npm start* or *npm start -- env=DEV* if you wish to use the DEV flag. 

## Distribution and Publishing

Compress the contents of your application directory into a .zip file. 
Navigate into your application directory and compress the contents of your directory into a .zip file (`zip -r appname.zip .`). Applications may be submitted through the AppStore module bundled with most Saito Wallets. This creates and broadcasts a Saito transaction with this format:

```javascript
  tx.msg = {
    module: "AppStore",
    request: "submit module",
    module_zip: appname.zip,
    name: appname
  };
```

AppStores will index your application, identifying it with a unique ID created by hashing the timestamp and signature of the transaction you created containing the application payload. Users download the application by fetching the full transaction, and can verify its identity before installation.


## Building the Application (Saito API)

All modules should extend from a class in the `/lib/saito/templates` directory. The most basic module should inherit from the `/lib/saito/templates/modtemplate` file. The most basic requirement for a valid module is a constructor and name as follows:

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

### Optional Class Variables

The following variables may be defined by applications within the constructor:

| Variable Name | Variable Type | Description |
|---------------|---------------|-------------|
| name  	| String 	| the name of the application |
| description  	| String 	| a brief description of the application |
| categories   	| String 	| application categories |
| slug  	| String 	| custom slug (alphanumeric, lowercase) |
| events  	| Array 	| list of events to which this module listens |



### Application Functions 

```javascript
installModule(app) {}
```

__app__ - reference to the Saito application object.

(OPTIONAL) This function will be run the first time Saito initializes after the module is loaded. If you override this function and still wish your application to handle default on-install functionality, call the super.installModule(app) function within your own.


```javascript
  initialize(app) {}
```

__app__ - reference to the Saito application object.

(OPTIONAL) This function is run every time the module is initialized. Note that all modules are initialized every time that Saito loads, not just the module with which the user is interacting. So this function is executed every time Saito initializes.


```javascript
  initializeHTML(app) {}
```

__app__ - reference to the Saito application object.

(OPTIONAL) This function is run whenever the HTML/DOM is initialized in an application the user is seeking to interact with. It is the recommended place to manipulate the DOM and add new components.


```javascript
  attachEvents(app) {}
```

__app__ - reference to the Saito application object.

(OPTIONAL) This function is run after `initializeHTML(app)` is executed in an application that the user has loaded to interact with through a web interface. It is traditionally used to attach events to DOM objects every time the module is initialized.


```javascript
  async onConfirmation(blk, tx, conf, app) {}
```

__blk__ - the block which has just been added to the chain
__tx__ - the transaction being processed
__conf__ - the number of confirmations this transaction is receiving
__app__ - reference to the Saito application object

(OPTIONAL) This function is executed whenever a transaction receives an additional confirmation (conf). The first time it is executed conf will be provided as 0 rather than 1. The transaction is provided along with the block which contained the transaction. The block may or may not have the other transaction-level information stored depending on its depth in the chain.

```javascript
  onNewBlock(blk, lc) {}
```

__blk__ - the block which has just been added to the chain
__lc__ - is this block part of the longest chain (0 or 1) 

(OPTIONAL) This function is executed whenever a new block is added to the chain. Modules can overwrite this function to take action when blocks are received. It differs from onConfirmation in that it will be triggered by any blocks, not just those that add to the longest-chain.

```javascript
  onChainReorganization(bid, bsh, lc, pos) {}
```

__bid__ - the id / height of the block being reorganized
__bsh__ - the hash of the block being reorganized
__lc__ - 1 if being moved onto the longest chain, 0 if being moved off
__pos__ - the position of the block in the blockchain.index.blocks data-structure

(OPTIONAL) This function is executed whenever there is a chain reorganization. This means it is also executed when a block is added to the chain. The most common use-case is updating external data structures with the state of the blockchain, such as keeping an external database synced with longest-chain state.


```javascript
  shouldAffixCallbackToModule(modname, tx=null) {}
```

__modname__ - the name of the module, as identified by its name variable
__tx__ - the transaction containing the module

RETURNS boolean (1 or 0)

(OPTIONAL) This function is executed to see if a module wishes to process a specific transaction. It is handed the modname (name of the module specified in the txmsg.module field) along with the full transaction in case it wishes to apply more complicated criteria. By default this will pass through transactions that are addressed to the module.


```javascript
  webServer(app, expressapp, express) {
```
__app__ - the Saito application object
__expressapp__ - the Express Webserver object
__express__ - the Express Web Server

(OPTIONAL) You may override this function to provide custom routing for full-clients who are running Saito modules with server support. This can be done to add custom GET and POST requests to scripts running in the `web/` directory. For example, you may create a module which serves JSON objects as a RESTFUL API.




```javascript
  respondTo(type) {}
```

RETURNS Object or null

__type__ - the request-type to which our application may choose to respond

(OPTIONAL) Modules can interact by querying other modules to see if they "respondTo" specific opportunities. An example is the Saito Arcade which queries installed games which `respondTo('arcade-games')` with an object. The object returns and its protocol is defined on a module-by-module basis. Modules which implement this are responding to opportunities for interactivity created by other modules.

```javascript
  receiveEvent(evtname, data) {}
```

RETURNS Object or null

__evtname__ - the name of the event to which we respond
__data__ - the data object emitted by the event originator

(OPTIONAL) Modules can listen to events by including the names of those events in the events Array in their constructor. Implement this function to catch those events as they are triggered. You may skip this and have your module hook manually onto the `app.connector` object.




## Copyright
Copyright Proclus Technologies, 2020.


## Citation
Please cite this document as:

David Lancashire, "SMP-20: Saito Module Protocol", Saito Network Documents, no, 1, October 2020 [Online serial]. Available: https://github.com/saitotech/saito-lite/docs/standard/application.md.


