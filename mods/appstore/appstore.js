***REMOVED***
const ModTemplate = require('../../lib/templates/modtemplate');
const AppStoreAppspace = require('./lib/email-appspace/appstore-appspace');
const AppStoreSearch = require('./lib/email-appspace/appstore-search');



class AppStore extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "AppStore";
  ***REMOVED***




  respondTo(type) {
    if (type == 'email-appspace') {
      let obj = {***REMOVED***;
	  obj.render = this.renderEmail;
	  obj.attachEvents = this.attachEventsEmail;
      return obj;
***REMOVED***
    return null;
  ***REMOVED***

  renderEmail(app, data) {
     data.appstore = app.modules.returnModule("AppStore");
     AppStoreAppspace.render(app, data);
     AppStoreSearch.render(app, data);
  ***REMOVED***

  attachEventsEmail(app, data) {
     data.appstore = app.modules.returnModule("AppStore");
     AppStoreAppspace.attachEvents(app, data);
     AppStoreSearch.attachEvents(app, data);
  ***REMOVED***



  //
  // database queries inbound here
  //
  async handlePeerRequest(app, message, peer, mycallback=null) {

    if (message.request === "appstore load modules") {

      let sql = "SELECT * FROM modules";
      let params = {***REMOVED***;
      let rows = await this.app.storage.queryDatabase(sql, params, message.data.dbname);

      let res = {***REMOVED***;
          res.err = "";
          res.rows = rows;

      mycallback(res);

***REMOVED***
  ***REMOVED***



  initialize(app) {
    super.initialize(app);

    // let sql = "INSERT INTO modules (name, description, version, publickey, unixtime, bid, bsh, tx) VALUES ($name, $description, $version, $publickey, $unixtime, $bid, $bsh, $tx)";
    // let params = {
	  // $name		:	"Application Name" ,
	  // $description	:	"Application Description" ,
	  // $version	:	1234 ,
	  // $publickey	:	"1241231" ,
	  // $unixtime	:	1234 ,
	  // $bid		:	413 ,
	  // $bsh		:	"513123" ,
	  // $tx		:	"this is the transaction"
    // ***REMOVED***
    // app.storage.executeDatabase(sql, params, "appstore");

  ***REMOVED***


  onConfirmation(blk, tx, conf, app) {
    // let appstore = app.modules.returnModule('AppStore');
    let txmsg = tx.returnMessage();
    if (conf == 0) {
      switch(txmsg.request) {
        case 'submit module':
          this.submitModule(blk, tx);
          break;
        default:
          break;
  ***REMOVED***
***REMOVED***
  ***REMOVED***

  submitModule(blk, tx) {
    console.log('PUBLISHING MODULE');
    let sql = `INSERT INTO modules (name, description, version, publickey, unixtime, bid, bsh, tx)
    VALUES ($name, $description, $version, $publickey, $unixtime, $bid, $bsh, $tx)`;
    let { from, sig, ts ***REMOVED*** = tx.transaction;
    let params = {
      $name		:	`Application ${ts***REMOVED***`,
      $description	:	`Application ${ts***REMOVED***`,
      $version	:	`${ts***REMOVED***-${sig***REMOVED***`,
      $publickey	:	from[0].add ,
      $unixtime	:	ts ,
      $bid		:	blk.block.id ,
      $bsh		:	blk.returnHash() ,
      $tx		:	JSON.stringify(tx.transaction),
***REMOVED***
    this.app.storage.executeDatabase(sql, params, "appstore");
  ***REMOVED***




  //
  // override webserver to permit module-hosting
  //
  webServer(app, expressapp, express) {

    let fs = app.storage.returnFileSystem();
    if (fs != null) {
      expressapp.use('/'+encodeURI(this.name), express.static(__dirname + "/web"));
***REMOVED***
  ***REMOVED***

***REMOVED***




module.exports = AppStore;


