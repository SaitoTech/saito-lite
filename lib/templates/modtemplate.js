var fs          = require('fs');
const path = require('path');
var treatment = require('../../lib/helpers/dom-treatment');


class ModTemplate {

  constructor(app, path) {

    this.app            = app || {};

    this.dirname	= "";
    this.name 		= "";
    this.slug	 	= "";	
    this.link           = "";
    this.events 	= []; // events to which i respond
    this.alerts		= 0;
    this.categories     = "";

    this.db_tables 	= [];
    this.browser_active = 0;

  }








  ////////////////////////////
  // Extend these Functions //
  ////////////////////////////
  //
  // INSTALL MODULE
  //
  // this callback is run the first time the module is loaded. You
  // can override this callback in your module if you would like, 
  // but should be a bit careful to include this line at the top:
  //
  //    super.installModule(app);
  //
  // ... if you want to keep the default functionality of auto-
  // creating a database with the necessary tables on install
  // if it does not exist.
  //

 
  async installModule(app) {

    if (this.app.BROWSER == 1) { return }

    //
    // does this require database installation
    //
    let sqldir = `${__dirname}/../../mods/${this.dirname}/sql`;
    let fs = app.storage.returnFileSystem();
    let dbname = encodeURI(this.returnSlug());

    if (fs != null) {
      if (fs.existsSync(path.normalize(sqldir))) {

        //
        // get all files in directory
        //
        let sql_files = fs.readdirSync(sqldir);

        for (let i = 0; i < sql_files.length; i++) {

          let tablename = sql_files[i].slice(0, -4);

          try {
            let filename = path.join(sqldir, sql_files[i]);
            let data = fs.readFileSync(filename, 'utf8');
console.log("Creating database for: " + dbname);
            await app.storage.executeDatabase(data, {}, dbname);
          } catch (err) {
            console.log(err);
          }
        }
      }
    }
  }








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
  initialize(app) {

    for (let i = 0; i < this.events.length; i++) {
      app.connection.on(this.events[i], (data) => {
	this.receiveEvent(this.events[i], data);
      });
    }

    //
    // create list of tables for auto-db response
    //
    let sqldir = `${__dirname}/../../mods/${this.dirname}/sql`;
    let fs = app.storage.returnFileSystem();
    if (fs != null) {
      if (fs.existsSync(path.normalize(sqldir))) {

        //
        // get all files in directory
        //
        let sql_files = fs.readdirSync(sqldir);

        for (let i = 0; i < sql_files.length; i++) {

          //
          // adding table to database
          //
          let tablename = sql_files[i].slice(0, -4);
	  this.db_tables.push(tablename);

        }
      }
    }
  }



  //
  // INITIALIZE HTML
  //
  // this callback is called whenever web applications are loaded
  //
  initializeHTML(app) {};

  //
  // ATTACH EVENTS
  //
  // this callback attaches the javascript interactive bindings to the
  // DOM, allowing us to incorporate the web applications to our own
  // internal functions and send and receive transactions natively.
  //
  attachEvents(app) {}

  //
  // LOAD FROM ARCHIVES
  //
  // this callback is run whenever our archives loads additional data
  // either from its local memory or whenever it is fetched from a
  // remote server
  //
  loadFromArchives(app, tx) {}

  implementsKeys(request) {
    let response = {};
    request.forEach(key => {
      if (this[key]) {
        response[key] = this[key];
      }
    });
    if (Object.entries(response).length != request.length) {
      return null;
    }
    return this;
  }

  //
  // ON CONFIRMATION
  //
  // this callback is run every time a block receives a confirmation.
  // this is where the most important code in your module should go,
  // listening to requests that come in over the blockchain and replying.
  //
  async onConfirmation(blk, tx, confnum, app) {}

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
  onNewBlock(blk, lc) {}

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
  onChainReorganization(block_id, block_hash, lc) {}


  //
  //
  // ON CONNECTION UNSTABLE
  //
  // this function runs when a node completes its handshake with another peer
  onConnectionUnstable(app) {}

  //
  //
  //
  // ON CONNECTION STABLE
  //
  // this function runs when a node completes its handshake with another peer
  onConnectionStable(app) {}

  //
  //
  //
  // ON PEER HANDSHAKE COMPLETE
  //
  // this function runs when a node completes its handshake with another peer
  onPeerHandshakeComplete(app, peer) {}

  //
  //
  // ON CONNECTION STABLE
  //
  // this function runs "connect" event
  onConnectionStable(app, peer) {}

  //
  //
  // ON CONNECTION UNSTABLE
  //
  // this function runs "disconnect" event
  onConnectionUnstable(app, peer) {}

  //
  // SHOULD AFFIX CALLBACK TO MODULE
  //
  // sometimes modules want to run the onConfirmation function for transactions
  // that belong to OTHER modules. An example is a server that wants to monitor
  // AUTH messages, or a module that needs to parse third-party email messages
  // for custom data processing.
  //
  shouldAffixCallbackToModule(modname) {
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
  // checkout the server.js class for an example of how to do this.
  //
  webServer(app, expressapp, express) {

    //
    // if a web directory exists, we make it browable if server
    // functionality exists on this machine. the contents of the
    // web directory will be in a subfolder under the client name
    //
    let webdir = `${__dirname}/../../mods/${this.dirname}/web}`;

    let fs = app.storage.returnFileSystem();
    if (fs != null) {
      if (!fs.existsSync(webdir)) {
        expressapp.use('/'+encodeURI(this.returnSlug()), express.static(__dirname + "/../../mods/" + this.dirname + "/web"));
      }
    }

  };

  //
  // UPDATE BALANCE
  //
  // this callback is run whenever the wallet balance is updated
  // if your web application needs to display the amount of funds
  // in the user wallet, you should hook into this to update your
  // display when it changes.
  //
  updateBalance(app) {}

  //
  // UPDATE IDENTIFIER
  //
  // this callback is run when a user registers an identifier.
  // You can use this to update parts of the application that are displaying
  // their initial hash username
  //
  updateIdentifier(app) {}


  //
  // UPDATE BLOCKCHAIN SYNC
  //
  // this callback is run to notify applications of the state of
  // blockchain syncing. It will be triggered on startup and with
  // every additional block added.
  //
  updateBlockchainSync(app, current, target) {}





  /////////////////////////
  // MODULE INTERACTIONS //
  /////////////////////////
  //
  // these functions allow your module to communicate and interact with
  // other modules. They automate issuing and listening to events and 
  // allow modules to respond to requests from other modules by returning
  // data objects that can be used to update the DOMS managed by other
  // modules.
  //

  //
  // modules may ask other modules to respond to "request_types". The
  // response that they get may or may not be suitable, but if suitable
  // can be used by the requesting module to format data or update
  // its DOM as needed. This is a basic method of providing inter-app
  // interactivity and extensibility.
  //
  respondTo(request_type="") { return null; }

  //
  // when an event to which modules are listening triggers, we push the
  // data out into this function, which can be overridden as needed in
  // order to
  //
  receiveEvent(eventname, data) {
  }

  //
  // you probably don't want to over-write this, it is basicaly just 
  // simplifying the event-emitting and receiving functionality in the 
  // connection class, so that developers can use this without worrying 
  // about their own events.
  //
  sendEvent(eventname, data) {
    this.app.connection.emit(eventname, data);
  }





  /////////////////////////////////
  // PEER-TO-PEER COMMUNICATIONS //
  /////////////////////////////////
  //
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
  async handlePeerRequest(app, message, peer, mycallback=null) {

    for (let i = 0; i < this.db_tables.length; i++) {

      let expected_request = this.name.toLowerCase() + " load " + this.db_tables[i];

      if (message.request === expected_request) {

	let select		= message.data.select;
	let dbname 		= message.data.dbname;
	let tablename 		= message.data.tablename;
	let where	 	= message.data.where;

	//
	// RICHARD -- sql sanitization
	//
	let sql = `SELECT ${select} FROM ${tablename}`;
	if (where != "") { sql += ` WHERE ${where}`; }


	let params = {};
	let rows = await this.app.storage.queryDatabase(sql, params, message.data.dbname);

	let res = {};
	    res.err = "";
	    res.rows = rows;

	mycallback(res);

      }
    }
  }


  //
  // PEER DATABASE CHECK
  //
  // this piggybacks on handlePeerRequest to provide automated database
  // row-retrieval for clients who are connected to servers that run the 
  // data silos.
  //
  async sendPeerDatabaseRequest(dbname, tablename, select="", where="", peer=null, mycallback=null) {

    var message                 = {};
    message.request         = dbname + " load " + tablename;
    message.data            = {};
    message.data.dbname     = dbname;
    message.data.tablename  = tablename;
    message.data.select     = select;
    message.data.where      = where;

    if (peer == null) {
      this.app.network.sendRequestWithCallback(message.request, message.data, function(res) {
        JSON.stringify("callback data1: " + JSON.stringify(res));
        mycallback(res);
      });
    } else {
      peer.sendRequestWithCallback(message.request, message.data, function(res) {
        JSON.stringify("callback data2: " + JSON.stringify(res));
        mycallback(res);
      });
    }

  }


  returnSlug() {
    if (this.slug != "") { return this.slug; }
    else {
      this.slug = this.name.toLowerCase();
      this.slug = this.slug.replace(/\t/g, "_");
      return this.slug;
    }
  }


  returnLink() {
    if (this.link != "") { return this.link; }
    else {
      this.link = "/"+this.returnSlug();
      return this.link;
    }
  }

  showAlert() {
    this.alerts++;
    try {
      let qs = '#'+this.returnSlug()+' > .redicon';
      document.querySelector(qs).style.display = "block";
    } catch (err) {
    }
  }

}

module.exports = ModTemplate;
