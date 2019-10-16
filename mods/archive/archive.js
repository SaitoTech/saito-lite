const saito = require('../../lib/saito/saito.js');
const ModTemplate = require('../../lib/templates/modtemplate');


class Archive extends ModTemplate {

  constructor(app) {

    super(app);
    this.name = "Archive";
    this.events = [];

  ***REMOVED***




  saveTransaction(data=null) {
console.log("\n\n\n SAVING A TRANSACTION IN THE SERVER MODULE \n\n\n");
  ***REMOVED***



  handlePeerRequest(app, req, peer, mycallback) {

    if (req.request == null) { return; ***REMOVED***
    if (req.data == null) { return; ***REMOVED***

    //
    // only handle archive request
    //
    if (req.request == "archive") {

      if (req.data.request == "save") {
	this.saveTransaction(req.data.tx);
  ***REMOVED***

      if (req.data.request == "load") {
	
	let type = "";
	let num  = 50;

	if (req.data.num != "")  { num = req.data.num; ***REMOVED***
	if (req.data.type != "") { num = req.data.type; ***REMOVED***

	this.loadTransaction(type, num);


  ***REMOVED***

***REMOVED***
  ***REMOVED***

***REMOVED***


module.exports = Archive;

