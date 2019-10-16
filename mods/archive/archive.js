const saito = require('../../lib/saito/saito.js');
const ModTemplate = require('../../lib/templates/modtemplate');


class Archive extends ModTemplate {

  constructor(app) {

    super(app);
    this.name = "Archive";
    this.events = [];

  }




  saveTransaction(data=null) {
console.log("\n\n\n SAVING A TRANSACTION IN THE SERVER MODULE \n\n\n");
  }



  handlePeerRequest(app, req, peer, mycallback) {

    if (req.request == null) { return; }
    if (req.data == null) { return; }

    //
    // only handle archive request
    //
    if (req.request == "archive") {

      if (req.data.request == "save") {
	this.saveTransaction(req.data.tx);
      }

      if (req.data.request == "load") {
	
	let type = "";
	let num  = 50;

	if (req.data.num != "")  { num = req.data.num; }
	if (req.data.type != "") { num = req.data.type; }

	this.loadTransaction(type, num);


      }

    }
  }

}


module.exports = Archive;

