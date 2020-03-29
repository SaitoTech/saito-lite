const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const SplashPage = require('./lib/splash-page');



class Covid19 extends ModTemplate {

  constructor(app) {
    super(app);

    this.app = app;
    this.name = "Covid19";
    this.description = "Open Source PPE Procurement Platform";
    this.categories = "Health NGO";

    this.db_tables.push("products JOIN suppliers");
    this.db_tables.push("products JOIN suppliers LEFT JOIN categories");
    this.db_tables.push("certifications as 'c' JOIN products_certifications as 'pc'");

    this.admin_pkey = "ke6qwkD3XB8JvWwf68RMjDAn2ByJRv3ak1eqUzTEz9cr";

    this.description = "A covid19 management framework for Saito";
    this.categories = "Admin Healthcare Productivity";
    this.definitions = {};

    return this;
  }




  async installModule(app) {

    await super.installModule(app);

    let sql = "";
    let params = {};


    sql = "INSERT INTO certifications (name) VALUES ($name)";
    params = { $name: "CE Authentication" }
    await app.storage.executeDatabase(sql, params, "covid19");

    sql = "INSERT INTO certifications (name) VALUES ($name)";
    params = { $name: "FDA Authentication" }
    await app.storage.executeDatabase(sql, params, "covid19");

    sql = "INSERT INTO certifications (name) VALUES ($name)";
    params = { $name: "Test Report" }
    await app.storage.executeDatabase(sql, params, "covid19");

    sql = "INSERT INTO certifications (name) VALUES ($name)";
    params = { $name: "Business License" }
    await app.storage.executeDatabase(sql, params, "covid19");

    sql = "INSERT INTO certifications (name) VALUES ($name)";
    params = { $name: "Medical Device Certificate" }
    await app.storage.executeDatabase(sql, params, "covid19");

    sql = "INSERT INTO categories (name) VALUES ('N95口罩 N95 Mask')";
    await app.storage.executeDatabase(sql, {}, "covid19");
    sql = "INSERT INTO categories (name) VALUES ('防护服Protection clothes')";
    await app.storage.executeDatabase(sql, {}, "covid19");
    sql = "INSERT INTO categories (name) VALUES ('外科口罩 Surgical Masks')";
    await app.storage.executeDatabase(sql, {}, "covid19");


  }
  async initialize(app) {

    await super.initialize(app);

    let sql = "";

        sql = "UPDATE products SET category_id = 1 WHERE product_name = '外科口罩 Surgical Masks'";
        await app.storage.executeDatabase(sql, {}, "covid19");
    
        sql = "UPDATE products SET category_id = 2 WHERE product_name = 'N95口罩 N95 Mask'";
        await app.storage.executeDatabase(sql, {}, "covid19");
    
        sql = "UPDATE products SET category_id = 3 WHERE product_name = '防护服Protection clothes'";
        await app.storage.executeDatabase(sql, {}, "covid19");

    sql = "PRAGMA table_info(suppliers)";
    this.definitions['suppliers'] = await app.storage.queryDatabase(sql, {}, "covid19");

    sql = "PRAGMA table_info(products)";
    this.definitions['products'] = await app.storage.queryDatabase(sql, {}, "covid19");

  }





  async onConfirmation(blk, tx, conf, app) {

    if (app.BROWSER == 1) { return; }

    let txmsg = tx.returnMessage();
    let covid19_self = app.modules.returnModule("Covid19");

    let sql = '';
    let params = {};

    if (conf == 0) {

      //
      // insert supplier if non-existent
      //
      let supplier_id = 0;

      if (txmsg.request == "Supplier Update") {

        sql = `SELECT id FROM suppliers WHERE publickey = "${tx.transaction.from[0].add}"`;
	let rows = await this.app.storage.queryDatabase(sql, {}, "covid19");
	if (rows.length == 0) { 
	  sql = `SELECT max(id) AS maxid FROM "suppliers"`;
	  let rows = await this.app.storage.queryDatabase(sql, {}, "covid19");
	  if (rows.length == 0) {
	    supplier_id = 1;
	  } else {
	    supplier_id = rows[0].maxid+1;;
	  }
        } else {
	    supplier_id = rows[0].id;
        }

        let fields = txmsg.fields;
        let id = 0;

        for (let i = 0; i < fields.length; i++) {

	  let table  = fields[i].table;
	  let column = fields[i].column;
	  let value  = fields[i].value;
	  if ( fields[i].id > 0 ) { id = fields[i].id; }

	  if (id == 0) {

	    sql = `SELECT max(id) AS maxid FROM ${table}`;
	    let rows = await this.app.storage.queryDatabase(sql, {}, "covid19");
	    if (rows.length == 0) { 
	      id = 1;
	    } else {
 	      id = rows[0].maxid+1;
	    }

	    sql = `INSERT INTO ${table} (id, supplier_id) VALUES (${id}, ${supplier_id})`;
	    await this.app.storage.executeDatabase(sql, {}, "covid19");
	  }

	  if (id > 0) {
  	    sql = `UPDATE ${table} SET ${column} = "${value}" WHERE id = ${id}`;
	    await this.app.storage.executeDatabase(sql, {}, "covid19");
	  }

        }
      }
    }
  }




  initializeHTML(app) {

    if (this.app.BROWSER == 0) { return; }

    let data = {};
    data.covid19 = this;

    SplashPage.render(app, data);
    SplashPage.attachEvents(app, data);

  }






  addProductsToTable(rows, fields, data) {

    for (let i = 0; i < rows.length; i++) {

      let html = '';
      //html += `      `;

      for (let ii = 0; ii < fields.length; ii++) {

        let added = 0;

        try {
          if (rows[i][fields[ii]] != "") {
console.log("TEST: " + rows[i][fields[ii]]);
            if (fields[ii] == "product_photo") {
              if (rows[i][fields[ii]] != null) {
                html += `<div><img style="max-width:200px;max-height:200px" src="${rows[i][fields[ii]]}" /></div>`;
                added = 1;
              }
            }

            if (fields[ii] == "edit") {
              html += `<div><div class="edit_product" id="${rows[i].id}">edit</div> | <div class="delete_product" id="${rows[i].id}">delete</div></div>`;
              added = 1;
            }

            if (fields[ii] == "fullview") {
              html += `<div><div class="fullview_product" id="${rows[i].id}">full details</div></div>`;
              added = 1;
            }

            if (fields[ii] == "admin") {
              html += `<div><div class="fullview_product" id="${rows[i].id}">full details</div> | <div class="edit_product" id="${rows[i].id}">edit</div> | <div class="delete_product" id="${rows[i].id}">delete</div></div>`;
              added = 1;
            }

            if (added == 0) {
              html += `<div>${rows[i][fields[ii]]}</div>`;
              added = 1;
            }


          } else {
          }
        } catch (err) {
          console.log("err: " + err);
        }

        if (added == 0) {
          html += `<div></div>`;
        }

      }

      document.querySelector(".products-table").innerHTML += html;

    }

  }


  //
  // array of objects with { database, column, value }
  //
  updateServerDatabase(data_array) {

    let newtx = this.app.wallet.createUnsignedTransactionWithDefaultFee(this.admin_pkey);
        newtx.transaction.msg.module = this.name;
        newtx.transaction.msg.request = "Supplier Update";
        newtx.transaction.msg.fields = data_array;
    newtx = this.app.wallet.signTransaction(newtx);
    this.app.network.propagateTransaction(newtx);

    setTimeout(function() {
      window.href = "/covid19";
    }, 500);

  }

  renderProduct(prod) {
    var html = "";
    Object.entries(prod).forEach(field => {
      switch (field[0]) {
        case 'supplier_id':
          break;
        case 'Product Image':
          html += "<div>Product Image</div>";
          html += "<div><img style='max-width:200px;max-height:200px' src=" + field[1] + " /></div>";
          break;
        default:
          html += "<div>" + field[0] + "</div>";
          html += ("<div>" + field[1] + "</div>").replace(">null<", "><");
      }
    });
    document.querySelector('.product-grid').innerHTML = html;
  }

  renderProductForm(prod) {
    var html = "";
    Object.entries(prod).forEach(field => {
      switch (field[0]) {
        case 'id':
        case 'supplier_id':
        case 'category_id':
          break;
        case 'product_name':
          html += "<input class='input category_id_input' id='products' type='hidden' name='category_id' value='1' />";
          break;
        case 'product_specification':
          html += "<div>Specification</div>";
          html += "<input class='input' id='products' type='text' name='"+field[0]+"' value='" + field[1] + "' />";
          break;
        case 'product_description':
          html += "<div>Description</div>";
          html += "<input class='input' id='products' type='text' name='"+field[0]+"' value='" + field[1] + "' />";
          break;
        case 'product_dimensions':
          html += "<div>Package Dimensions</div>";
          html += "<input class='input' id='products' type='text' name='"+field[0]+"' value='" + field[1] + "' />";
          break;
        case 'product_weight':
          html += "<div>Weight</div>";
          html += "<input class='input' id='products' type='text' name='"+field[0]+"' value='" + field[1] + "' />";
          break;
        case 'product_quantities':
          html += "<div>Package Contents</div>";
          html += "<input class='input' id='products' type='text' name='"+field[0]+"' value='" + field[1] + "' />";
          break;
        case 'product_photo':
          html += "<div>Product Image</div>";
          html += "<input class='input' id='products' type='text' name='"+field[0]+"' value='" + field[1] + "' />";
          break;
        case 'pricing_per_unit_rmb':
          html += "<div>Price (RMB)</div>";
          html += "<input class='input' id='products' type='text' name='"+field[0]+"' value='" + field[1] + "' />";
          break;
        case 'pricing_notes':
          html += "<div>Pricing Notes</div>";
          html += "<input class='input' id='products' type='text' name='"+field[0]+"' value='" + field[1] + "' />";
          break;
        case 'pricing_payment_terms':
          html += "<div>Payment Terms</div>";
          html += "<input class='input' id='products' type='text' name='"+field[0]+"' value='" + field[1] + "' />";
          break;
        case 'production_stock':
          html += "<div>Stock</div>";
          html += "<input class='input' id='products' type='text' name='"+field[0]+"' value='" + field[1] + "' />";
          break;
        case 'production_daily_capacity':
          html += "<div>Daily Production</div>";
          html += "<input class='input' id='products' type='text' name='"+field[0]+"' value='" + field[1] + "' />";
          break;
        case 'production_minimum_order':
          html += "<div>Payment Terms</div>";
          html += "<input class='input' id='products' type='text' name='"+field[0]+"' value='" + field[1] + "' />";
          break;
        default:
          break;
      }
    });
    document.querySelector('.product-grid').innerHTML = html;
    document.getElementById('select-product-type').addEventListener('change', (e) => {
      let category_id = e.currentTarget.value;
      if (category_id > 0) {

        //
        // populate table
        //
        document.querySelector('.category_id_input').value = category_id;

      }
    });



  }

  renderSupplier(supplier) {
    var html = "";
    Object.entries(supplier).forEach(field => {
      html += "<div>" + field[0] + "</div>";
      html += ("<div>" + field[1] + "</div>").replace(">null<", "><");
    });
    document.querySelector('.supplier-grid').innerHTML = html;
  }


  renderCerts(rows) {
    var html = "";
    rows.forEach(row => {
      if (row["attachment_id"] != null) {
        html += "<div class='cert'><a class='attach-" + row["attachment_id"] + "'>" + row["Name"] + "</a></div>";
      } else {
        html += "<div class='cert'>" + row["Name"] + "</div>";
      }
      document.querySelector('.cert-grid').innerHTML = html;
    });

    rows.forEach(row => {
      if (row["attachment_id"] != null) {
        document.querySelector('.attach-' + row["attachment_id"]).addEventListener('click', (e) => {
          this.returnAttachment(row["attachment_id"]);
        });
      }
    });

  }

  returnAttachment(id) {
    this.sendPeerDatabaseRequest("covid19", "attachments", "*", "id= " + id, null, function (res) {
      if (res.rows.length > 0) {
        var blob = new Blob([res.rows[0]["attachment_data"]], {type: res.rows[0]["attachment_type"]});
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = url;
        a.download = res.rows[0]["attachment_filename"];
        a.click();
        window.URL.revokeObjectURL(url);
        a.destroy();
        salert("Download attchment: " + res.rows[0]["attachment_filename"]);
      }
    });
  }

  isAdmin() {
    return 1;
    if (this.app.wallet.returnPublicKey() == this.admin_publickey) { return 1; }
    return 0;
  }

}

module.exports = Covid19;



