var fs = require('fs');
const path = require('path');
var treatment = require('../../lib/helpers/dom-treatment');


class ModTemplate {

  constructor(app, path) {

    this.app = app || {};

    this.dirname = "";
    this.appname = "";
    this.name = "";
    this.slug = "";
    this.link = "";
    this.events = []; // events to which i respond
    this.alerts = 0;
    this.categories = "";

    this.db_tables = [];

    // A module which wishes to be rendered in the client can include it's own
    // web directory which will automatically be served by the Saito Core's
    // server. However, if the author prefers, Core can also simple serve the
    // default index.html found in /lib/templates/html, which can then be
    // manipulated via initializeHTML.
    this.default_html = 0;

    // browser active will be set by Saito Client if the module name matches
    // the current path. e.g. when the user is at /chat, chat.js which has
    // this.name = "chat", will have this.browser_active = 1;
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


  //
  // onlyOnActive can be used to blacklist a module method from being run unless it is the active module.
  // For example, this might be useful for a chat module which wants to run initializedHTML only when
  // the user is at /chat, but otherwise would like to enable this.alwaysRun so all it's other methods are
  // available to other modules.
  //
  onlyOnActiveBrowser(someMethod) {
    return function () {
      if(this.app.BROWSER && this.browser_active) {
        let returnVal = someMethod.apply(this, arguments);
        return returnVal;
      }
    };
  }
  
  
  // onlyOnFrontend can be used to blacklist a module method from being run
  // on the server. Wrapping this around your methods will cause them to only
  // run in a browser environment.
  //
  onlyInBrowser(someMethod) {
    return function () {
      if(this.app.BROWSER) {
        let returnVal = someMethod.apply(this, arguments);
        return returnVal;
      }
    };
  }
  
  //
  // onlyOnFrontend can be used to blacklist a module method from being run
  // on the server. Wrapping this around your methods will cause them to only
  // run in a browser environment.
  //
  onlyOnServer(someMethod) {
    return function () {
      if(!this.app.BROWSER) {
        let returnVal = someMethod.apply(this, arguments);
        return returnVal;
      }
    };
  }
  
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
        let sql_files = fs.readdirSync(sqldir).sort();

        for (let i = 0; i < sql_files.length; i++) {

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
  async initialize(app) {


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

	  //
	  // remove digits from end, used as we sometimes
 	  // use numbers at end of sql file to order indexes
	  // or run post-processing on table create and need
	  // guaranteed order
	  //
	  tablename = tablename.replace(/\d+$/, "");

          this.db_tables.push(tablename);
        }
      }
    }

    if (this.appname == "") { this.appname = this.name; }

  }



  //
  // INITIALIZE HTML (deprecated by render(app))
  //
  // this callback is called whenever web applications are loaded
  //
  initializeHTML(app) { };

  //
  // ATTACH EVENTS (deprecated by render(app))
  //
  // this callback attaches the javascript interactive bindings to the
  // DOM, allowing us to incorporate the web applications to our own
  // internal functions and send and receive transactions natively.
  //
  attachEvents(app) { }

  //
  // RENDER
  //
  // adds elements to the DOM and then attaches events to them as needed.
  // this replaces initializeHTML and attachEvents with a single function
  //
  render(app) { }

  //
  // LOAD FROM ARCHIVES
  //
  // this callback is run whenever our archives loads additional data
  // either from its local memory or whenever it is fetched from a
  // remote server
  //
  //loadFromArchives(app, tx) { }

  // implementsKeys(request) {
  //   let response = {};
  //   request.forEach(key => {
  //     if (this[key]) {
  //       response[key] = this[key];
  //     }
  //   });
  //   if (Object.entries(response).length != request.length) {
  //     return null;
  //   }
  //   return this;
  // }

  //
  // ON CONFIRMATION
  //
  // this callback is run every time a block receives a confirmation.
  // this is where the most important code in your module should go,
  // listening to requests that come in over the blockchain and replying.
  //
  // By convention Saito Core will fire the onConfirmation for any modules
  // whose name matches tx.msg.module. Other modules which are also interested
  // in those transcations can also subscribe to those confirmations by
  // by using shouldAffixCallbackToModule.
  //
  async onConfirmation(blk, tx, confnum, app) { }



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
  // ON CONNECTION UNSTABLE
  //
  // this function runs when a node completes its handshake with another peer
  onConnectionUnstable(app) { }

  //
  //
  //
  // ON CONNECTION STABLE
  //
  // this function runs when a node completes its handshake with another peer
  onConnectionStable(app) { }

  //
  //
  //
  // ON WALLET RESET
  //
  // this function runs if the wallet is reset
  onWalletReset() { }

  //
  //
  //
  // ON PEER HANDSHAKE COMPLETE
  //
  // this function runs when a node completes its handshake with another peer
  onPeerHandshakeComplete(app, peer) { }

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
  webServer(app, expressapp, express) {
    //
    // if a web directory exists, we make it broswable if server
    // functionality exists on this machine. the contents of the
    // web directory will be in a subfolder under the client name
    //
    let webdir = `${__dirname}/../../mods/${this.dirname}/web`;
    let fs = app.storage.returnFileSystem();
    if (fs != null) {
      if (fs.existsSync(webdir)) {
        expressapp.use('/' + encodeURI(this.returnSlug()), express.static(webdir));
      } else if(this.default_html) {
        expressapp.use('/' + encodeURI(this.returnSlug()), express.static(__dirname + "/../../lib/templates/html"));
      }
    }

  };

  //
  // UPDATE BLOCKCHAIN SYNC
  //
  // this callback is run to notify applications of the state of
  // blockchain syncing. It will be triggered on startup and with
  // every additional block added.
  //
  updateBlockchainSync(app, current, target) { }





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
  respondTo(request_type = "") { return null; }

  //
  // when an event to which modules are listening triggers, we push the
  // data out into this function, which can be overridden as needed in
  // order to
  //
  receiveEvent(eventname, data) {}

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
  async handlePeerRequest(app, message, peer, mycallback = null) {

    //
    // load (legacy modules)
    //
    for (let i = 0; i < this.db_tables.length; i++) {

      let expected_request = this.name.toLowerCase() + " load " + this.db_tables[i];
      if (message.request === expected_request) {

        let select = message.data.select;
        let dbname = message.data.dbname;
        let tablename = message.data.tablename;
        let where = message.data.where;

        if (!/^[a-z"`'=_*()\.\n\t\r ,0-9A-Z]+$/.test(select)) { return; }
        if (!/^[a-z"`'=_()\. ,0-9A-Z]+$/.test(dbname)) { return; }
        if (!/^[a-z"`'=_()\. ,0-9A-Z]+$/.test(tablename)) { return; }

        let sql = `SELECT ${select} FROM ${tablename}`; if (where != "") { sql += ` WHERE ${where}`; }
        let params = {};
        let rows = await this.app.storage.queryDatabase(sql, params, message.data.dbname);

        let res = {};
        res.err = "";
        res.rows = rows;

        mycallback(res);

      }

    }


    if (message.request == 'rawSQL') {

      if (message.data.module == this.name) {

        let sql = message.data.sql;
        let params = {};

        let rows = await this.app.storage.queryDatabase(sql, params, message.data.dbname);

        let res = {};
        res.err = "";
        res.rows = rows;
        mycallback(res);
        return;

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
  async sendPeerDatabaseRequest(dbname, tablename, select = "", where = "", peer = null, mycallback = null) {

    var message = {};
    message.request = dbname + " load " + tablename;
    message.data = {};
    message.data.dbname = dbname;
    message.data.tablename = tablename;
    message.data.select = select;
    message.data.where = where;

    if (peer == null) {
      this.app.network.sendRequestWithCallback(message.request, message.data, function (res) {
        console.log("callback data1: " + JSON.stringify(res));
        mycallback(res);
      });
    } else {
      peer.sendRequestWithCallback(message.request, message.data, function (res) {
        console.log("callback data2: " + JSON.stringify(res));
        mycallback(res);
      });
    }

  }



  async sendPeerDatabaseRequestWithFilter(modname="", sql="", success_callback=null, peerfilter=null) {

    if (sql == "") { return; }
    if (modname == "")  { return; }

    let msg = {};
        msg.request = 'rawSQL';
        msg.data = {};
        msg.data.sql    = sql;
        msg.data.module = modname;
        msg.data.dbname = modname.toLowerCase();

    this.sendPeerRequestWithFilter(()=>{return msg;}, success_callback, peerfilter);

  }

  async sendPeerRequestWithServiceFilter(servicename, msg, success_callback=(res)=>{}) {
    this.sendPeerRequestWithFilter(
      () => { return msg; },
      success_callback,
      (peer) => {
        if (peer.peer.services) {
          for (let z = 0; z < peer.peer.services.length; z++) {
            if (peer.peer.services[z].service === servicename) {
              return 1;
            }
          }
        }
      }
    );
  }

  async sendPeerRequestWithFilter(msg_callback=null, success_callback=null, peerfilter=null) {

    let message = msg_callback();

    if (message == null) { return; }

    let peers = [];
    if (peerfilter == null) {
      peers = this.app.network.peers;
    } else {
      for (let i = 0; i < this.app.network.peers.length; i++) {
        if (peerfilter(this.app.network.peers[i])) { peers.push(this.app.network.peers[i]); }
      }
    }
    if (peers.length == 0) { return; }

    peers.forEach((peer) => {
      peer.sendRequestWithCallback(message.request, message.data, function (res) {
        if (success_callback != null) {
          success_callback(res);
        }
      });
    });
  }



  async sendPeerDatabaseRequestRaw(db, sql, mycallback = null) {
    var message = {};
    message.request = 'rawSQL';
    message.data = {};
    message.data.sql = sql;
    message.data.dbname = db;
    message.data.module = this.name;

    this.app.network.sendRequestWithCallback(message.request, message.data, function (res) {
      //JSON.stringify("callback data1: " + JSON.stringify(res));
      mycallback(res);
    });
  }



  returnSlug() {
    if (this.slug != "") { return this.slug; }
    else {
      if (this.appname) {
        this.slug = this.appname.toLowerCase();        
      } else {
        this.slug = this.name.toLowerCase();
      }
      this.slug = this.slug.replace(/\t/g, "_");
      return this.slug;
    }
  }


  returnLink() {
    if (this.link != "") { return this.link; }
    else {
      this.link = "/" + this.returnSlug();
      return this.link;
    }
  }

  returnServices() {
    return []; // no services by default
  }

  handleUrlParams(urlParams) {}

  showAlert() {
    this.alerts++;
    try {
      let qs = '#' + this.returnSlug() + ' > .redicon';
      document.querySelector(qs).style.display = "block";
    } catch (err) {
    }
  }


}

module.exports = ModTemplate;
