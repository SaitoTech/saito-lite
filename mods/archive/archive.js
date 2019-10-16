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

console.log(JSON.stringify(req));
    if (req.request == null) { return; ***REMOVED***
    if (req.data == null) { return; ***REMOVED***

    //
    // only handle archive request
    //
    if (req.request == "archive") {
console.log("this is an archive request...");

      if (req.data.request == "save") {
console.log("going ahead and saving this....");
this.saveTransaction(req.data.tx);
  ***REMOVED***

***REMOVED***
  ***REMOVED***

***REMOVED***


module.exports = Archive;

