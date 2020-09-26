var fs = require('fs');
const path = require('path');
const ModTemplate = require('./modtemplate');



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

    if (this.app.BROWSER == 1) { return; };

    let txmsg = tx.returnMessage();

    //console.log("HERE: " + JSON.stringify(txmsg));

    // update and insert could be collapsed into one function using the syntax:
    // INSERT OR UPDATE INTO (id, col,...) if we make sure ID is a pkey

    // we could could also let the UI or database determine the new UUID
    // this is very useful where we want to create a new option in a reference table
    // and link to it in one user operation.
    // 'hash of tx sig?'


    if (txmsg.request == "update") {

      let values = txmsg.fields;

      for (let i = 0; i < values.length; i++) {

        let dbname = values[i].dbname;
        let dbtable = values[i].table;
        let column = values[i].column;
        let value = values[i].value;
        let id = values[i].id;

        if (!/^[a-z\-_0-9A-Z]+$/.test(dbname)) { return; }
        if (!/^[a-z\-_0-9A-Z]+$/.test(dbtable)) { return; }
        if (!/^[a-z\-_0-9A-Z]+$/.test(column)) { return; }

        let sql = `UPDATE ${dbtable} SET ${column}` + " = $value WHERE (uuid = $id OR id = $id) AND (admin = $admin OR $admin = $super)";
        let params = {
          $value: value,
          $id: id,
          $admin: tx.transaction.from[0].add,
          $super: app.modules.returnModule(txmsg.module).admin_pkey,
        };


        //
        // no updates on UUID
        //
        if (column != "uuid" && column != "deleted") {
          console.log("UPDATE: " + sql + " --- UUID: " + id);
          await this.app.storage.executeDatabase(sql, params, dbname);
        }
      }
      return;
    }


    if (txmsg.request == "delete") {

      let values = txmsg.fields;

      for (let i = 0; i < values.length; i++) {

        let dbname = values[i].dbname;
        let dbtable = values[i].table;
        let column = values[i].column;
        let value = values[i].value;

        if (!/^[a-z\-_0-9A-Z]+$/.test(dbname)) { return; }
        if (!/^[a-z\-_0-9A-Z]+$/.test(dbtable)) { return; }
        if (!/^[a-z\-_0-9A-Z]+$/.test(column)) { return; }

        let sql = `SELECT deleted FROM ${dbtable} WHERE ${column}` + " = $value AND (admin = $admin OR $admin = $super)";
        let params = {
          $value: value,
          $admin: tx.transaction.from[0].add,
          $super: app.modules.returnModule(txmsg.module).admin_pkey,
        };
        let rows = await this.app.storage.queryDatabase(sql, params, dbname);
        let deleted = 0;

        if (rows) {
          if (rows.length > 0) {
            if (typeof rows[0].deleted != 'null') {
              sql = `UPDATE ${dbtable} SET deleted = 1 WHERE ${column}` + " = $value AND (admin = $admin OR $admin = $super)";
              await this.app.storage.executeDatabase(sql, params, dbname);
              deleted = 1;

            }
          }
        }


        if (deleted == 0) {
          sql = `DELETE FROM ${dbtable} WHERE ${column}` + " = $value AND (admin = $admin OR $admin = $super)";
          await this.app.storage.executeDatabase(sql, params, dbname);
        }

      }
      return;
    }


    if (txmsg.request == "insert") {

      let values = txmsg.fields;

      let dbname = values[0].dbname;
      let dbtable = values[0].table;
      let admin = tx.transaction.from[0].add;
      let id = tx.transaction.ts + '-' + tx.transaction.sig;

      if (!/^[a-z\-_0-9A-Z]+$/.test(dbname)) { return; }
      if (!/^[a-z\-_0-9A-Z]+$/.test(dbtable)) { return; }


      let sql = "INSERT INTO " + dbtable + " (uuid, admin) VALUES ($id, $admin)";
      let params = {
        $id: id,
        $admin: admin,
      };
      await this.app.storage.executeDatabase(sql, params, dbname);

      return;

    }

  }


  // i like this as can use 'select a as `column name` type select to customise
  // both form labels and order.
  returnForm(dbname, dbtable, id, row) {
    var body = "";
    var meta = "";
    Object.entries(row).forEach(field => {
      if (field[1] == null) { field[1] = "" };
      switch (field[0]) {
        case 'id':
        case 'deleted':
        case 'uuid':
          break;
        case 'publickey':
        case 'admin':
          meta += "<div style='display:none;'><input class='input' data-dbname='" + dbname + "' data-id='" + id + "' data-table='" + dbtable + "' type='hidden' data-column='" + field[0] + "' value='" + field[1] + "' /></div>";
          break;
        default:
          body += "<div>" + field[0].replace(/_/g, " ") + "</div>";
          body += "<div><input class='input' id='" + field[0] + "' data-dbname='" + dbname + "' data-id='" + id + "' data-table='" + dbtable + "' type='text' data-column='" + field[0] + "' value='" + field[1] + "' /></div>";
          break;
      }
    });
    return body + meta;
  }

  returnFormFromPragma(dbname, dbtable, mycallback = null) {
    var html = "";
    var body = "";
    var meta = "";
    this.sendPeerDatabaseRequestRaw(dbname, "PRAGMA table_info(" + dbtable + ")", res => {

      if (res.rows.length > 0) {
        res.rows.forEach(row => {

          switch (row.name) {
            case 'id':
            case 'deleted':
            case 'admin':
              break;
            case 'uuid':
            case 'publickey':
              meta += "<div style='display:none;'><input class='input' id='" + row.name + "' data-dbname='" + dbname + "' data-id='' data-table='" + dbtable + "' type='hidden' data-column='" + row.name + "' value='' /></div>";
              break;
            default:
              body += "<div>" + row.name.replace("_id", "").replace(/_/g, " ") + "</div>";
              body += "<div><input class='input' id='" + row.name + "' data-dbname='" + dbname + "' data-id='' data-table='" + dbtable + "' type='text' data-column='" + row.name + "' value='' /></div>";
              break;
          }

        });
        html = body + meta;
        mycallback(html);
      }
    });
  };


  //suggestion - add argument 'el' for element that contains the inputs
  // then use el..getElementsByClassName('input')).forEach(input => {
  // this allows multiple forms on one page. UI event management to sort out saving each.
  // also add selects and text areas
  returnFormToArray(el = document) {

    let values = [];
    let table_id = "";

    el.querySelectorAll('.input').forEach(input => {
      let field = {};
      field.dbname = input.dataset.dbname;
      field.table = input.dataset.table;
      field.column = input.dataset.column;
      field.value = input.value;
      field.id = input.dataset.id;
      if (input.dataset.column !== "id") {
        values.push(field);
      }
    });

    return values;

  }

  submitForm(el = document) {

    let values = this.returnFormToArray(el);
    let insert = 0;
    let id = "";
    for (let i = 0; i < values.length; i++) { if (values[i].id == "") { insert = 1; } }

    if (insert == 1) {
      console.log("INSERTING");
      id = this.insertDatabase(values);
      console.log("DONE INSERTING: " + id);
    }

    for (let i = 0; i < values.length; i++) {
      if (values[i].id == "") { values[i].id = id; }
    }

    console.log("UPDATING");
    this.updateDatabase(values);
    console.log("DONE UPDATING: ");

  }

  submitValues(values) {
    let insert = 1;
    let id = "";
    for (let i = 0; i < values.length; i++) { if (typeof values[i].id != "undefined") { insert = 0; } }

    if (insert == 1) {
      console.log("INSERTING");
      id = this.insertDatabase(values);
      console.log("DONE INSERTING: " + id);

      for (let i = 0; i < values.length; i++) {
        values[i].id = id;
      }
      
    }

    console.log("UPDATING");
    this.updateDatabase(values);
    console.log("DONE UPDATING: ");

  }


  deleteDatabase(values) {

    let newtx = this.app.wallet.createUnsignedTransactionWithDefaultFee(this.admin_pkey);
    newtx.msg.module = this.name;
    newtx.msg.request = "delete";
    newtx.msg.fields = values;
    newtx = this.app.wallet.signTransaction(newtx);
    this.app.network.propagateTransaction(newtx);

  }

  updateDatabase(values) {

    let newtx = this.app.wallet.createUnsignedTransactionWithDefaultFee(this.admin_pkey);
    newtx.msg.module = this.name;
    newtx.msg.request = "update";
    newtx.msg.fields = values;
    newtx = this.app.wallet.signTransaction(newtx);
    this.app.network.propagateTransaction(newtx);

  }

  insertDatabase(values) {

    let newtx = this.app.wallet.createUnsignedTransactionWithDefaultFee(this.admin_pkey);
    newtx.msg.module = this.name;
    newtx.msg.request = "insert";
    newtx.msg.fields = values;
    newtx = this.app.wallet.signTransaction(newtx);
    this.app.network.propagateTransaction(newtx);
    return newtx.transaction.ts + '-' + newtx.transaction.sig;

  }

  webServer(app, expressapp, express) {

    super.webServer(app, expressapp, express);

  }
}

module.exports = DBModTemplate;

