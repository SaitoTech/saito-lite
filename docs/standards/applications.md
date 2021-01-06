# Saito Module Protocol - SMP-10

| Author  | David Lancashire  |
| Status  | Published         |
| Type    | Protocol Standard |
| Created | October 31, 2020  |


## Abstract 

The following standard allows for the implementation of a standard API for applications or modules running on Saito nodes. This standard provides basic functionality to interact with the blockchain, process messages received over the blockchain, as well as handle common user-interface requirements such as distributing data.

## Specification

Modules are distributed as .zip files. These files contain a directory structure, which forms the standard for how to organize a module at the top level. The most important elements of an application directory are as follows:

`
module.js
lib/
sql/
README.md.
`

Of these, the only necessary file is the `module.js` file. Restrictions are that the filename contains only alphanumeric characters. Additional javascript files should be packaged within the /lib directory. If the /sql directory exists it may contain optional SQLITE3 table definition file. If the Saito client supports Sqlite3 it may load them.


## Publishing

Applications may be published to the network by submitting the application data as part of a normal transaction that is broadcast into the network. The content of the transaction message field is as follows. The two user-provided elements are the module_zip (containing the zip-file above) and the name of the application):

`
  tx.msg = {
    module: "AppStore",
    request: "submit module",
    module_zip: __ZIPFILE__,
    name: __MODULE_NAME___
  };
`

AppStores running on the network will identify the publisher by , and derive the application version by hashing the timestamp and signature of the transaction containing the application payload. This ensures that every application published to the network has a unique ID, and can be verified as produced by the publisher prior to installation.


## Module.js API

NOTES:

All modules should extend from a class in the `/lib/saito/templates` directory. This standard documents the functionality available in the default `/lib/saito/templates/modtemplate` file. The most basic module possible should provide itself with a constructor and a name as follows:

`
const ModTemplate = require('../../lib/templates/modtemplate');

class ModuleName extends ModTemplate {

  constructor(app) {

    super(app);

    this.name          = "ModuleName";

  }

}

module.exports = ModuleName;
`

### Class Variables

The following variables may be defined by applications within the constructor:

| name  	| String 	| 
| description  	| String 	|
| categories   	| String 	|
| slug  	| String 	|
| events  	| Array 	| 
| db_tables 	| Array 	|



### Class Functions 











