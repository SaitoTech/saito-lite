class ModTemplate {

  constructor(app, path) {

    this.app             = app || {***REMOVED***;

    this.path		= path;

    this.name = "";
    this.browser_active   = 0;
    this.processRebroadcastTransactions = 0;	// 0 -- ignore rebroadcast txs
                                      ***REMOVED*** 1 -- process rebroadcast txs
    this.handlesArchiving = 0;
    this.handlesEmail     = 0;
    this.handlesDNS       = 0;
    this.emailAppName     = "Application";

    return this;

  ***REMOVED***








  ////////////////////////////
  // Extend these Functions //
  ////////////////////////////

  //
  // INSTALL MODULE
  //
  // this callback is run the first time the module is loaded
  //
  installModule(app) {

console.log("PATHNAME: " + this.path);
console.log("DIRNAME: " + this.dirname);

    //
    // does this require database installation
    //
    let sqldir = `${__dirname***REMOVED***/sql***REMOVED***`;

console.log("SQLDIR: " + sqldir);
    if (!fs.existsSync(sqldir)) {
      console.log("INSTALLING DATABASE");
***REMOVED***


  ***REMOVED***




  //
  // INITIALIZE
  //
  // this callback is run every time the module is initialized
  //
  initialize(app) {


  ***REMOVED***;


  //
  // IS BROWSER ACTIVE
  //
  // this callback returns 0 if the user is not browsing a webpage
  // from the application, and 1 if it is browsing a webpage from
  // an application. We use it to selectively disable code when
  // browsers are running.
  //
  isBrowserActive(app) { return 0; ***REMOVED***

  //
  // INITIALIZE HTML
  //
  // this callback is called whenever web applications are loaded
  //
  initializeHTML(app) {***REMOVED***;

  //
  // ATTACH EVENTS
  //
  // this callback attaches the javascript interactive bindings to the
  // DOM, allowing us to incorporate the web applications to our own
  // internal functions and send and receive transactions natively.
  //
  attachEvents(app) {***REMOVED***

  //
  // LOAD FROM ARCHIVES
  //
  // this callback is run whenever our archives loads additional data
  // either from its local memory or whenever it is fetched from a
  // remote server
  //
  loadFromArchives(app, tx) {***REMOVED***

  //
  // ON CONFIRMATION
  //
  // this callback is run every time a block receives a confirmation.
  // this is where the most important code in your module should go,
  // listening to requests that come in over the blockchain and replying.
  //
  onConfirmation(blk, tx, confnum, app) {***REMOVED***

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
  onNewBlock(blk, lc) {***REMOVED***

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
  onChainReorganization(block_id, block_hash, lc) {***REMOVED***

  //
  // SHOULD AFFIX CALLBACK TO MODULE
  //
  // sometimes modules want to run the onConfirmation function for transactions
  // that belong to OTHER modules. An example is a server that wants to monitor
  // AUTH messages, or a module that needs to parse third-party email messages
  // for custom data processing.
  //
  shouldAffixCallbackToModule(modname) {
    if (modname == this.name) { return 1; ***REMOVED***
    return 0;
  ***REMOVED***

  //
  // SERVER
  //
  // this callback allows the module to serve pages through the main application
  // server, by listening to specific route-requests and serving data from its own
  // separate web directory.
  //
  // checkout the server.js class for an example of how to do this.
  //
  webServer(app, expressapp) {***REMOVED***;

  //
  // UPDATE BALANCE
  //
  // this callback is run whenever the wallet balance is updated
  // if your web application needs to display the amount of funds
  // in the user wallet, you should hook into this to update your
  // display when it changes.
  //
  updateBalance(app) {***REMOVED***


  //
  // UPDATE BLOCKCHAIN SYNC
  //
  // this callback is run to notify applications of the state of
  // blockchain syncing. It will be triggered on startup and with
  // every additional block added.
  //
  updateBlockchainSync(app, current, target) {***REMOVED***





  /////////////////////
  // EMAIL FUNCTIONS //
  /////////////////////
  //
  // these three functions are used if you want your module to interact with
  // the default Saito email client. They allow you to format and return
  // HTML data that can be displayed in the main body of the email client
  //

  //
  // DISPLAY EMAIL FORM
  //
  // this prepares the HTML form that we use to enter the information
  // needed by our module. In the email client this is what displays
  // the title and email inputs into which the users can type their
  // email.
  //
  displayEmailForm(app) {***REMOVED***

  //
  // DISPLAY EMAIL MESSAGE
  //
  // this formats our transaction so that it can be displayed in the
  // body of an email if needed
  //
  displayEmailMessage(message_id, app) {

    // by default we just stick the JSON text field into the text element
    // and display it to the user. This assumes that the content isn't JSON
    // but modules can parse and handle JSON themselves if they really need
    // to do this.
    if (app.BROWSER == 1) {
      message_text_selector = "#" + message_id + " > .data";
      $('#lightbox_message_text').text( $(message_text_selector).text());
***REMOVED***
  ***REMOVED***

  //
  // FORMAT EMAIL TRANSACTION
  //
  // this is invoked when a user decides to send a transaction through the
  // default email client. It should grab the submitted data and structure
  // it into the transaction in a way that can be understood by other modules
  // listening on the network.
  //
  formatEmailTransaction(tx, app) {***REMOVED***;

  //
  // ATTACH EMAIL EVENTS
  //
  // mail client runs this function on the mod class to let them optionally
  // add interactivity to the emails they send (i.e. links that process data
  // in certain ways, etc.)
  //
  attachEmailEvents(app) {***REMOVED***;

  //
  // ATTACH EMAIL FORM EVENTS
  //
  // mail client runs this function on the mod class to let them optionally
  // add interactivity to the email forms that the originator of the first
  // email page uses.
  //
  attachEmailFormEvents(app) {***REMOVED***;



  /////////////////////////////////
  // PEER-TO-PEER COMMUNICATIONS //
  /////////////////////////////////

  //
  // HANDLE DOMAIN REQUEST
  //
  // this is a specialized callback for modules that want to respond to DNS
  // requests over the Saito blockchain. DNS requests are routed directly
  // to this function.
  //
  handleDomainRequest(app, message, peer, mycallback, stringify) {***REMOVED***

  //
  // this is a callback for fetching multiple DNS requests simultaneously
  //
  handleMultipleDomainRequest(app, message, peer, mycallback, stringify) {***REMOVED***

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
  handlePeerRequest(app, message, peer, mycallback=null) {***REMOVED***

***REMOVED***

module.exports = ModTemplate;
