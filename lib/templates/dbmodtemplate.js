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

        let sql = `UPDATE ${dbtable} SET ${column}` + " = $value WHERE uuid = $id AND admin = $admin";
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

        let sql = "INSERT INTO " + dbtable + " (uuid, admin) VALUES ($id, $admin)";
        let params = {
	  $id : id ,
	  $admin : admin ,
	};
        await this.app.storage.executeDatabase(sql, params, dbname);

	return;

      }
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

