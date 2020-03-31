const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const SplashPage = require('./lib/splash-page');
const CustomerPortal = require('./lib/customer-portal');
const SupplierPortal = require('./lib/supplier-portal');

const Header = require('../../lib/ui/header/covid_header');
const AddressController = require('../../lib/ui/menu/address-controller');




class Covid19 extends ModTemplate {

  constructor(app) {
    super(app);

    this.app = app;
    this.name = "Covid19";
    this.description = "Open Source PPE Procurement Platform";
    this.categories = "Health NGO";

    this.icon_fa = "fas fa-shipping-cart";

    this.db_tables.push("products JOIN suppliers");
    this.db_tables.push("products JOIN suppliers LEFT JOIN categories");
    this.db_tables.push("certifications as 'c' JOIN products_certifications as 'pc'");

    this.admin_pkey = app.wallet.returnPublicKey();
//"ke6qwkD3XB8JvWwf68RMjDAn2ByJRv3ak1eqUzTEz9cr";

    this.events['chat-render-request'];

    this.description = "A covid19 management framework for Saito";
    this.categories = "Admin Healthcare Productivity";
    this.definitions = {};

    return this;
  }




  receiveEvent(type, data) {
    if (type == 'chat-render-request') {
      if (this.browser_active) {
        let chatmod = this.app.modules.returnModule("Chat");
        let uidata = {}
            uidata.chat = this;
	chatmod.respondTo('email-chat').render(this.app, uidata);
        chatmod.respondTo('email-chat').attachEvents(this.app, uidata);
      }
    }
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

    sql = "UPDATE products SET category_id = 1 WHERE product_name = 'N95口罩 N95 Mask'";
    await app.storage.executeDatabase(sql, {}, "covid19");

    sql = "UPDATE products SET category_id = 2 WHERE product_name = '外科口罩 Surgical Masks'";
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

      let product_id = txmsg.product_id;
      let fields = txmsg.fields;
      let supplier_id = 0;

      //
      // updating supplier or product
      //
      if (txmsg.request == "Supplier Update") {

console.log("RECEIVED: " + JSON.stringify(txmsg));

        sql = `SELECT id FROM suppliers WHERE publickey = "${txmsg.publickey}"`;
        let rows = await this.app.storage.queryDatabase(sql, {}, "covid19");
        if (rows.length == 0) { 
          sql = `SELECT max(id) AS maxid FROM "suppliers"`;
          let rows = await this.app.storage.queryDatabase(sql, {}, "covid19");
          if (rows.length == 0) {
            supplier_id = 1;
          } else {
            supplier_id = rows[0].maxid+1;;
          }
          sql = `INSERT INTO suppliers (id , publickey) VALUES (${supplier_id} , '${tx.transaction.from[0].add}')`;
          await this.app.storage.executeDatabase(sql, {}, "covid19");
        } else {
          supplier_id = rows[0].id;
        }

        let fields = txmsg.fields;
        let id = 0;

        for (let i = 0; i < fields.length; i++) {

          let table = fields[i].table;
          let column = fields[i].column;
          let value = fields[i].value;
          if (fields[i].id > 0) { id = fields[i].id; }
          if (fields[i].id == "supplier") { id = supplier_id; }

          if (id == 0) {

            sql = `SELECT max(id) AS maxid FROM ${table}`;
            let rows = await this.app.storage.queryDatabase(sql, {}, "covid19");
            if (rows.length == 0) {
              id = 1;
            } else {
              id = rows[0].maxid + 1;
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

    this.app.modules.respondTo("chat-manager").forEach(mod => {
      mod.respondTo('chat-manager').render(app, this);
      mod.respondTo('chat-manager').attachEvents(app, this);
    });


    let data = {};
    data.covid19 = this;

    Header.render(app, data);
    Header.attachEvents(app, data);

    SplashPage.render(app, data);
    SplashPage.attachEvents(app, data);

    //
    let chatmod = this.app.modules.returnModule("Chat");
    if (chatmod) {
      data.chat = chatmod;
      chatmod.respondTo('email-chat').render(app, data);
      chatmod.respondTo('email-chat').attachEvents(app, data);
    }


  }


  renderPage(page="home", app, data) {

    data.covid19 = this;

    if (page == "home") {
      SplashPage.render(app, data);
      SplashPage.attachEvents(app, data);
    };

    if (page == "supplier") {
      SupplierPortal.render(app, data);
      SupplierPortal.attachEvents(app, data);
    };

    if (page == "customer") {
      CustomerPortal.render(app, data);
      CustomerPortal.attachEvents(app, data);
    }

  }

  attachEvents(app) {

    let data = {};
    data.covid19 = this;

  }



  addProductsToTable(rows, fields, data) {

    for (let i = 0; i < rows.length; i++) {

      let html = '';
      //html += `      `;

      for (let ii = 0; ii < fields.length; ii++) {

        let added = 0;

        try {


          if (rows[i][fields[ii]] != "") {

            if (fields[ii] == "id") { added = 1; }

            if (fields[ii] == "product_photo") {
              if (rows[i][fields[ii]] != null) {
                html += `<div><img style="max-width:200px;max-height:200px" src="${rows[i][fields[ii]]}" /></div>`;
                added = 1;
              }
            }

            if (fields[ii] == "edit") {
	      if (this.app.wallet.returnPublicKey() == this.admin_pkey) { fields[ii] = "admin"; } else {
                html += `<div class="grid-buttons"><div class="edit_product" id="${rows[i].product_id}">Edit</div><div class="delete_product" id="${rows[i].id}">Delete</div></div>`;
                added = 1;
	      }
            }

            if (fields[ii] == "fullview") {
	      if (this.app.wallet.returnPublicKey() == this.admin_pkey) { fields[ii] = "admin"; } else {
                html += `<div class="grid-buttons"><div class="fullview_product" id="${rows[i].product_id}">View</div></div>`;
                added = 1;
              }
            }

            if (fields[ii] == "admin") {
              html += `<div class="grid-buttons"><div class="edit_product" id="${rows[i].product_id}">Edit</div><div class="delete_product" id="${rows[i].product_id}">Delete</div></div>`;
              added = 1;
            }

            if (fields[ii] == "certifications") {
              html += `<div class="product_certificates" id="certsfor-${rows[i].product_id}"></div>`;
              added = 1;
            }            

            if (added == 0) {
              html += `<div data-table="${ii}">${rows[i][fields[ii]]}</div>`;
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

      document.querySelector(".products-table").innerHTML += html.replace(/null/g, "").replace(/undefined/g, "");
      this.returnCerts(rows[i].product_id, "certsfor-");
      
    }
    document.querySelectorAll('.fullview_product').forEach(el => {
      el.addEventListener('click', (e) => {
        data.id = e.toElement.id;
        ProductPage.render(this.app, data);
        ProductPage.attachEvents(this.app, data);
      });
    });
  }


  //
  // array of objects with { database, column, value }
  //
  updateServerDatabase(data_array, publickey) {

    let newtx = this.app.wallet.createUnsignedTransactionWithDefaultFee(this.admin_pkey);
    newtx.transaction.msg.module = this.name;
    newtx.transaction.msg.request = "Supplier Update";
    newtx.transaction.msg.fields = data_array;
    newtx.transaction.msg.publickey = publickey;
    newtx = this.app.wallet.signTransaction(newtx);
    this.app.network.propagateTransaction(newtx);

console.log("SENT TO SERVER");

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
	  break;
        case 'supplier_id':
	  break;
        case 'category_id':
          break;
        case 'product_name':
          html += "<input class='input category_id_input products-" + field[0] + "' id='products' type='hidden' name='category_id' value='1' />";
          break;
        case 'product_specification':
          html += "<div>Specification</div>";
          html += "<input class='input products-" + field[0] + "' id='products' type='text' name='" + field[0] + "' value='" + field[1] + "' />";
          break;
        case 'product_description':
          html += "<div>Description</div>";
          html += "<textarea class='input products-" + field[0] + "' id='products' name='" + field[0] + "'>"+field[1]+"</textarea>";
          break;
        case 'product_dimensions':
          html += "<div>Package Size</div>";
          html += "<input class='input products-" + field[0] + "' id='products' type='text' name='" + field[0] + "' value='" + field[1] + "' />";
          break;
        case 'product_weight':
          html += "<div>Package Weight</div>";
          html += "<input class='input products-" + field[0] + "' id='products' type='text' name='" + field[0] + "' value='" + field[1] + "' />";
          break;
        case 'product_quantities':
          html += "<div>Package Contents</div>";
          html += "<input class='input products-" + field[0] + "' id='products' type='text' name='" + field[0] + "' value='" + field[1] + "' />";
          break;
        case 'product_photo':
          html += "<div>Product Image</div>";
          html += "<div>";
          html += "<img class='product-image' id='img-" + field[0] + "' src='" + field[1] + "' />";
          html += "<input class='input products-" + field[0] + "' type='file' />";
          html += "<input style='display:none;' class='input products-text-" + field[0] + "' id='products' type='text' name='" + field[0] + "' value='" + field[1] + "' />";
          html += "</div>";
          break;
        case 'pricing_per_unit_rmb':
          html += "<div>Price (RMB)</div>";
          html += "<input class='input products-" + field[0] + "' id='products' type='text' name='" + field[0] + "' value='" + field[1] + "' />";
          break;
        case 'pricing_notes':
          html += "<div>Pricing Notes</div>";
          html += "<input class='input products-" + field[0] + "' id='products' type='text' name='" + field[0] + "' value='" + field[1] + "' />";
          break;
        case 'pricing_payment_terms':
          html += "<div>Payment Terms</div>";
          html += "<textarea class='input products-" + field[0] + "' id='products' type='text' name='" + field[0] + "'>"+field[1]+"</textarea>";
          break;
        case 'production_stock':
          html += "<div>In Stock</div>";
          html += "<input class='input products-" + field[0] + "' id='products' type='text' name='" + field[0] + "' value='" + field[1] + "' />";
          break;
        case 'production_daily_capacity':
          html += "<div>Daily Production</div>";
          html += "<input class='input products-" + field[0] + "' id='products' type='text' name='" + field[0] + "' value='" + field[1] + "' />";
          break;
        case 'production_minimum_order':
          html += "<div>Minimum Order</div>";
          html += "<input class='input products-" + field[0] + "' id='products' type='text' name='" + field[0] + "' value='" + field[1] + "' />";
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


  renderSupplierForm(prod) {
    var html = "";
    Object.entries(prod).forEach(field => {
      switch (field[0]) {
        case 'id':
          break;
        case 'name':
          html += "<div>Name</div>";
          html += "<input class='input' id='suppliers' type='text' name='" + field[0] + "' value='" + field[1] + "' />";
          break;
        case 'address':
          html += "<div>Address</div>";
          html += "<input class='input' id='suppliers' type='text' name='" + field[0] + "' value='" + field[1] + "' />";
          break;
        case 'phone':
          html += "<div>Phone</div>";
          html += "<input class='input' id='suppliers' type='text' name='" + field[0] + "' value='" + field[1] + "' />";
          break;
        case 'email':
          html += "<div>Email</div>";
          html += "<input class='input' id='suppliers' type='text' name='" + field[0] + "' value='" + field[1] + "' />";
          break;
        case 'wechat':
          html += "<div>Wechat</div>";
          html += "<input class='input' id='suppliers' type='text' name='" + field[0] + "' value='" + field[1] + "' />";
          break;
        default:
          break;
      }
    });

    document.querySelector('.supplier-grid').innerHTML = html;

  }

  /*addCertsToGrid(grid) {
     grid.querySelectorAll('.product_certificates').forEach(div => { 
       this.returnCerts(div.id.split("-")[1]);
     });
  }*/

  returnCerts(id, prefix) {
    // should this be generalised to module wide?
    var me = this;
    
    fields = "pc.product_id as 'product_id', c.name as 'Name', (select id from attachments where id = pc.id ) as attachment_id";
    var from = "certifications as 'c' JOIN products_certifications as 'pc'";
    var where = "c.id = pc.certification_id and pc.product_id = " + id;
    this.sendPeerDatabaseRequest("covid19", from, fields, where, null, function (res) {
  
      if (res.rows.length > 0) {
        var el = document.getElementById(prefix + res.rows[0].product_id);
        me.renderCerts(res.rows, el);
  
      }
    });
  }

  renderCerts(rows, el) {
    var html = "";
    rows.forEach(row => {
      if (row["attachment_id"] != null) {
        html += "<div class='cert'><a class='attach-" + row["attachment_id"] + "'>" + row["Name"] + "</a></div>";
      } else {
        html += "<div class='cert'>" + row["Name"] + "</div>";
      }
      el.innerHTML = html;
    });

    rows.forEach(row => {
      if (row["attachment_id"] != null) {
        el.querySelector('.attach-' + row["attachment_id"]).addEventListener('click', (e) => {
          this.returnAttachment(row["attachment_id"]);
        });
      }
    });
  }

  returnAttachment(id) {
    this.sendPeerDatabaseRequest("covid19", "attachments", "*", "id= " + id, null, function (res) {
      if (res.rows.length > 0) {
        var blob = new Blob([res.rows[0]["attachment_data"]], { type: res.rows[0]["attachment_type"] });
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



