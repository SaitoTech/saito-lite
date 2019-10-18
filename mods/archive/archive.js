const saito = require('../../lib/saito/saito.js');
const ModTemplate = require('../../lib/templates/modtemplate');


class Archive extends ModTemplate {

  constructor(app) {

    super(app);
    this.name = "Archive";
    this.events = [];

  ***REMOVED***


  async installModule(app) {

    await super.installModule(app);

    let sql = 'INSERT INTO records (sig, publickey, tx, ts, type) VALUES ("sig", "publickey", "transaction", 1332, "email")';
    await app.storage.executeDatabase(sql, {***REMOVED***, "archive");

  ***REMOVED***


  async handlePeerRequest(app, req, peer, mycallback) {

console.log("HANDLE PEER REQUEST: " + JSON.stringify(req));

    if (req.request == null) { return; ***REMOVED***
    if (req.data == null) { return; ***REMOVED***

    //
    // only handle archive request
    //
    if (req.request == "archive") {
console.log(" 1. WE RECEIVED A REQUEST TO LOAD A TRANSACTION");

      if (req.data.request == "save") {
	this.saveTransaction(req.data.tx);
  ***REMOVED***


      if (req.data.request == "load") {

console.log("WE RECEIVED A REQUEST TO LOAD A TRANSACTION");

	let type = "";
	let num  = 50;

	if (req.data.num != "")  { num = req.data.num; ***REMOVED***
	if (req.data.type != "") { num = req.data.type; ***REMOVED***

	let txs = await this.loadTransactions(type, num);

console.log("AND WE FOUND THESE TRANSACTIONS: " + JSON.stringify(txs));

	let response = {***REMOVED***;
	    response.err = "";
	    response.txs = txs;

console.log("RETURNING: " + JSON.stringify(response));

	mycallback(response);

  ***REMOVED***
***REMOVED***
  ***REMOVED***



  saveTransaction(tx=null) {

console.log("\n\n\n SAVING A TRANSACTION IN THE SERVER MODULE \n\n\n");

  ***REMOVED***


  async loadTransactions(type, num) {

    let sql = "SELECT * FROM records";
    let params = {***REMOVED***;

console.log("SQL: " + sql);

    let rows = await this.app.storage.queryDatabase(sql, params, "archive");

    console.log("\n WE HAVE LOADED THE FOLLOWING ROWS FROM DB FOR RETURN TO CLIENT: " + JSON.stringify(rows));

    let txs = [];
    for (let i = 0; i < rows.length; i++) {
      txs.push(rows[i].tx);
***REMOVED***

console.log("\n\n\nRETURNING: ");
    return txs;

  ***REMOVED***


***REMOVED***


module.exports = Archive;

