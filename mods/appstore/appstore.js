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

  createBundleTX(filename) {
    let fs = app.storage.returnFileSystem();
    if (fs) {
      let bundle_base64 = fs.readFileSync('/path/to/file.jpg', { encoding: 'base64' ***REMOVED***);
      let newtx = app.wallet.createUnsignedTransactionWithDefaultFee();
      newtx.transaction.msg = { module: "AppStore", request: "submit module", bundle: bundle_base64 ***REMOVED***;
      return app.wallet.signTransaction(newtx);
***REMOVED***
    return null;
  ***REMOVED***




  //
  // override webserver to permit module-hosting
  //
  webServer(app, expressapp, express) {

    let fs = app.storage.returnFileSystem();
    if (fs != null) {
      expressapp.use('/'+encodeURI(this.name), express.static(__dirname + "/web"));

      expressapp.post('/bundle', async (req, res) => {
***REMOVED***
***REMOVED*** require inclusion of  module versions and paths for loading into the system
***REMOVED***
        let { versions, paths ***REMOVED*** = req.body;

        let ts = new Date().getTime();
        let hash = this.app.crypto.hash(versions.join(''));

        let modules_filename = `modules.config-${ts***REMOVED***-${hash***REMOVED***.json`

        await fs.writeFile(path.resolve(__dirname, `bundler/${modules_filename***REMOVED***`),
          JSON.stringify({paths***REMOVED***)
        );

        let IndexTemplate = require(index.template.js);
        let index_filename = `saito-${ts***REMOVED***-${hash***REMOVED***.js`;

        await fs.writeFile(path.resolve(__dirname, `bundler/modules.config-${ts***REMOVED***-${hash***REMOVED***.json`),
          IndexTemplate(modules_config_filename)
        );

***REMOVED***
***REMOVED*** TODO: unzip existing modules and stage them
***REMOVED***

***REMOVED***
***REMOVED*** create temp module_paths file and index.client.js\
***REMOVED***
        let webpackConfig = require('../../webpack/webpack.config');
        webpackConfig.entry = ["babel-polyfill", path.resolve(__dirname, `./bundler/index-${ts***REMOVED***-${hash***REMOVED***.js`)],
        webpackConfig.output = {
            path: path.resolve(__dirname, './bundler/dist'),
            filename: index_filename
    ***REMOVED***

***REMOVED***
***REMOVED*** write config to file
***REMOVED***
***REMOVED***
          await fs.writeFile(path.resolve(__dirname, `bundler/webpack.config-${ts***REMOVED***-${sig***REMOVED***.json`));
    ***REMOVED*** catch(err) {
          console.log(err);
    ***REMOVED***

***REMOVED***
***REMOVED*** execute bundling process
***REMOVED***
        const util = require('util');
        const exec = util.promisify(require('child_process').exec);

***REMOVED***
  ***REMOVED***
  ***REMOVED*** TODO: json
  ***REMOVED***
          const { stdout, stderr ***REMOVED*** = await exec('webpack --config ./bundler/webpack.config.json' );

  ***REMOVED***
  ***REMOVED*** if there are no errors
  ***REMOVED***
          res.send({
            payload: {
              filename
        ***REMOVED***
      ***REMOVED***);

          let newtx = this.createBundleTX(filename);

  ***REMOVED***
  ***REMOVED*** publish our bundle
  ***REMOVED***
          this.app.network.propagateTransaction(newtx);
    ***REMOVED*** catch(err) {
          console.log(err);
    ***REMOVED***
  ***REMOVED***);
***REMOVED***
  ***REMOVED***

***REMOVED***




module.exports = AppStore;


