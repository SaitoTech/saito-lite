var fs = require('fs');
const path = require('path');
const ModTemplate = require('./modtemplate');
var treatment = require('../../lib/helpers/dom-treatment');


class DBModTemplate extends ModTemplate {

  constructor(app, path) {

    super(app);

    this.app = app || {};

    this.dirname = "";
    this.name = "";
    this.slug = "";
    this.link = "";
    this.events = []; // events to which i respond
    this.alerts = 0;
    this.categories = "";

    this.db_tables = [];
    this.browser_active = 0;

  }








  //
  // ON CONFIRMATION
  //
  // this callback is run every time a block receives a confirmation.
  // this is where the most important code in your module should go,
  // listening to requests that come in over the blockchain and replying.
  //
  async onConfirmation(blk, tx, confnum, app) { 

    let txmsg = tx.returnMessage();

console.log("HERE: " + JSON.stringify(txmsg));

    if (txmsg.request == "update") {

      let values = txmsg.fields;

      for (let i = 0; i < values.length; i++) {

	let dbname  = values[i].dbname;
	let dbtable = values[i].table;
        let column  = values[i].column;
        let value   = values[i].value;
        let id      = values[i].id;

	if (!/^[a-z\-_0-9A-Z]+$/.test(dbname)) { return; }
	if (!/^[a-z\-_0-9A-Z]+$/.test(dbtable)) { return; }
	if (!/^[a-z\-_0-9A-Z]+$/.test(column)) { return; }

        let sql = `UPDATE ${dbtable} SET ${column}` + " = $value WHERE id = $id AND admin = $admin";
	let params = {
	  $value:  value ,
	  $id:     id ,
	  $admin:  tx.transaction.from[0].add ,
	};
	await this.app.storage.executeDatabase(sql, params, dbname);

	return;

      }
    }


    if (txmsg.request == "insert") {

      let values = txmsg.fields;

      for (let i = 0; i < values.length; i++) {

	let dbname  = values[i].dbname;
	let dbtable = values[i].table;
        let admin   = tx.transaction.from[0].add;
        let id      = tx.transaction.ts + '-' + tx.transaction.sig;

	if (!/^[a-z\-_0-9A-Z]+$/.test(dbname)) { return; }
	if (!/^[a-z\-_0-9A-Z]+$/.test(dbtable)) { return; }

        let sql = "INSERT INTO " + dbtable + " (id, admin) VALUES ($id, $admin)";
        let params = {
	  $id : id ,
	  $admin : admin ,
	};
        await this.app.storage.executeDatabase(sql, params, dbname);

	return;

      }
    }

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

    for (let i = 0; i < this.db_tables.length; i++) {

      let expected_request = this.name.toLowerCase() + " load " + this.db_tables[i];

console.log(expected_request);

      if (message.request === expected_request || message.request_type == 'rawSQL') {

        let select = message.data.select;
        let dbname = message.data.dbname;
        let tablename = message.data.tablename;
        let where = message.data.where;

console.log("preior to testing!");
console.log(select);
console.log(dbname);
console.log(tablename);
console.log(where);

	if (!/^[a-z*'"=_ ,.0-9A-Z]+$/.test(select)) { return; }
	if (!/^[a-z*'"=_ ,.0-9A-Z]+$/.test(dbname)) { return; }
	if (!/^[a-z*'"=_ ,.0-9A-Z]+$/.test(tablename)) { return; }
	if (!/^[a-z*'"=_ ,.0-9A-Z]+$/.test(where)) { return; }

console.log("post to testing 2!");

        let sql = `SELECT ${select} FROM ${tablename}`; if (where != "") { sql += ` WHERE ${where}`; }
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
        JSON.stringify("callback data1: " + JSON.stringify(res));
        mycallback(res);
      });
    } else {
      peer.sendRequestWithCallback(message.request, message.data, function (res) {
        JSON.stringify("callback data2: " + JSON.stringify(res));
        mycallback(res);
      });
    }

  }



  returnForm(dbname, dbtable, id, row) {
    var html = "";
    Object.entries(row).forEach(field => {
      switch (field[0]) {
	case 'id': 
	  break;
        default:
          html += "<div>"+field[0]+"</div>";
          html += "<input class='input' data-dbname='" + dbname + "' data-id='" + id + "' data-table='suppliers' type='text' data-column='" + field[0] + "' value='" + field[1] + "' />";
	  break;
      }
    });
    return html;
  }

  returnFormToArray() {

    let values = [];
    let table_id = "";

    Array.from(document.getElementsByClassName('input')).forEach(input => {
      let field = {};
          field.dbname = input.dataset.dbname;
          field.table  = input.dataset.table;
          field.column = input.dataset.column;
          field.value  = input.value;
          field.id     = input.dataset.id;
      if (input.dataset.column !== "id") {
        values.push(field);
      }
    });

    return values;

  }


  updateDatabase(values) {

    let newtx = this.app.wallet.createUnsignedTransactionWithDefaultFee(this.admin_pkey);
    newtx.transaction.msg.module = this.name;
    newtx.transaction.msg.request = "update";
    newtx.transaction.msg.fields = values;
    newtx = this.app.wallet.signTransaction(newtx);
    this.app.network.propagateTransaction(newtx);

  }

  insertDatabase(values) {

    let newtx = this.app.wallet.createUnsignedTransactionWithDefaultFee(this.admin_pkey);
    newtx.transaction.msg.module = this.name;
    newtx.transaction.msg.request = "insert";
    newtx.transaction.msg.fields = values;
    newtx = this.app.wallet.signTransaction(newtx);
    this.app.network.propagateTransaction(newtx);

    return newtx.transaction.ts + '-' + newtx.transaction.sig;

  }



}

module.exports = DBModTemplate;

