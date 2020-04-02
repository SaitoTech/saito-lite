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
    this.db_tables.push("products_certifications");
    this.db_tables.push("products JOIN suppliers LEFT JOIN categories");
    this.db_tables.push("certifications as 'c' JOIN products_certifications as 'pc'");

    this.admin_pkey = "29GH5F9HCNfWKPPXA4cPtPkaFzJat1ewCZozgyKFSVLHM";

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

    sql = `INSERT INTO categories (name) VALUES ('N95口罩 N95 Mask')`;
    app.storage.executeDatabase(sql, {}, "covid19");
    sql = `INSERT INTO categories (name) VALUES ('外科口罩 Surgical Masks')`;
    app.storage.executeDatabase(sql, {}, "covid19");
    sql = `INSERT INTO categories (name) VALUES ('防护面罩Face shield')`;
    app.storage.executeDatabase(sql, {}, "covid19");
    sql = `INSERT INTO categories (name) VALUES ('防护服Protection clothes')`;
    app.storage.executeDatabase(sql, {}, "covid19");
    sql = `INSERT INTO categories (name) VALUES ('医疗器械 medical instruments')`;
    app.storage.executeDatabase(sql, {}, "covid19");
    sql = `INSERT INTO categories (name) VALUES ('防护眼镜 goggles')`;
    app.storage.executeDatabase(sql, {}, "covid19");
    sql = `INSERT INTO categories (name) VALUES ('手套 gloves')`;
    app.storage.executeDatabase(sql, {}, "covid19");
    sql = `INSERT INTO categories (name) VALUES ('鞋套 shoe covers')`;
    app.storage.executeDatabase(sql, {}, "covid19");
    sql = `INSERT INTO categories (name) VALUES ('防护头罩 medical hoods')`;
    app.storage.executeDatabase(sql, {}, "covid19");
    sql = `INSERT INTO categories (name) VALUES ('洗手液 Sanitizers')`;
    app.storage.executeDatabase(sql, {}, "covid19");
    sql = `INSERT INTO categories (name) VALUES ('医疗垃圾袋 Clinical waste bags')`;
    app.storage.executeDatabase(sql, {}, "covid19");
    sql = `INSERT INTO categories (name) VALUES ('医疗围裙 Plastic Aprons')`;
    app.storage.executeDatabase(sql, {}, "covid19");
    sql = `INSERT INTO categories (name) VALUES ('手术服 surgical gown')`;
    app.storage.executeDatabase(sql, {}, "covid19");

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

    //
    // only handle our stuff
    //
    let txmsg = tx.returnMessage();
    if (txmsg.module != this.name) { return; }


    let covid19_self = app.modules.returnModule("Covid19");

    let sql = '';
    let params = {};


    if (conf == 0) {

      let product_id = txmsg.product_id;
      let fields = txmsg.fields;
      let supplier_id = 0;
      let supplier_publickey = txmsg.publickey;

      //
      // 
      //
      if (txmsg.request == "Product Delete") {

        sql = `SELECT id FROM suppliers WHERE publickey = "${supplier_publickey}"`;
        let rows = await this.app.storage.queryDatabase(sql, {}, "covid19");
        if (rows.length == 0) {
          return;
        } else {
          supplier_id = rows[0].id;
        }

        let table = "products";

        sql = "DELETE FROM products WHERE supplier_id = $supplier_id AND id = $product_id";
	params = {
	  $supplier_id:	supplier_id ,
	  $product_id:  product_id ,
	};

	if (tx.transaction.from[0].add == supplier_publickey || tx.transaction.from[0].add == this.admin_pkey) {
          await this.app.storage.executeDatabase(sql, params, "covid19");
	}

	return;
      }



      //
      // updating supplier or product
      //
      if (txmsg.request == "Supplier Update") {

        sql = `SELECT id FROM suppliers WHERE publickey = "${supplier_publickey}"`;
        let rows = await this.app.storage.queryDatabase(sql, {}, "covid19");
        if (rows.length == 0) { 
          sql = `SELECT max(id) AS maxid FROM "suppliers"`;
          let rows = await this.app.storage.queryDatabase(sql, {}, "covid19");
          if (rows.length == 0) {
            supplier_id = 1;
          } else {
            supplier_id = rows[0].maxid+1;;
          }

	  //
	  // insert supplier if non-existent
	  //
          sql = `SELECT id FROM suppliers WHERE publickey = "${tx.transaction.from[0].add}"`;
          let rows2 = await this.app.storage.queryDatabase(sql, {}, "covid19");
	  if (rows2.length == 0) {
            sql = `INSERT INTO suppliers (id , publickey) VALUES (${supplier_id} , '${tx.transaction.from[0].add}')`;
            await this.app.storage.executeDatabase(sql, {}, "covid19");
	  }

	  // add so things work
	  supplier_publickey = tx.transaction.from[0].add;

        } else {
          supplier_id = rows[0].id;
        }

        fields = txmsg.fields;
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

	    if (tx.transaction.from[0].add == supplier_publickey || tx.transaction.from[0].add == this.admin_pkey) {
              sql = `INSERT INTO ${table} (id, supplier_id) VALUES (${id}, ${supplier_id})`;
//console.log("HERE: " + sql);
              await this.app.storage.executeDatabase(sql, {}, "covid19");
            }
          }

          if (id > 0) {
	    if (tx.transaction.from[0].add == supplier_publickey || tx.transaction.from[0].add == this.admin_pkey) {
              sql = `UPDATE ${table} SET ${column} = "${value}" WHERE id = ${id}`;
              await this.app.storage.executeDatabase(sql, {}, "covid19");
	    }
          }
        }
      }

      if (txmsg.request == "Table Update") {

        let fields = txmsg.fields;

        //sort the incoming fields to process table by table.
        //we need to do this to differentiate the first INSERT
        //from subsequent updates as we are processing 
        fields.sort((a, b) => a.table.localeCompare(b.table));

        let table = "";
        let columns   = "";
        let values   = "";
        let sqls        = [];
        let id       = -1;
        let push       = false;
        
        let mode = "";

        for (let i = 0; i < fields.length; i++) {

          if (i == fields.length - 1) {
            push = true;
          } else if (fields[i].table != fields[i+1].table) {
            push = true;
          }

          let column = fields[i].column;
          let value  = "'" + fields[i].value + "'";
          
          //we are dealing with a new table
          if (fields[i].table != table) {
            table = fields[i].table; 
            //we don't have an id yet
            if (fields[i].id == "new") {
              sql = `SELECT max(id) AS maxid FROM ${table}`;
              let rows = await this.app.storage.queryDatabase(sql, {}, "covid19");
              if (rows.length == 0) {
                id = 1;
              } else {
                id = rows[0].maxid + 1;
              }
              mode = "INSERT";
            } else {
              mode = "UPDATE";
            }
            columns = column;
            if (value == "'new'") { value = id};
            values = value;
          } else {
            columns += ", " + column;
            if (value == "'new'") { value = id};
            values += ", " + value;
          }
          

          if (push) {
              if (mode = 'INSERT') {
                sql = `INSERT INTO ${table} (id, ${columns}) VALUES (${id}, ${values});`
              } else {
                sql = `UDATE ${table} SET (${columns}) = (${values}) WHERE id = ${id};`
              }
              sqls.push(sql);
              push = false;
            }
        }
        sqls.forEach(sql => {
          try {
            //console.log(sql);
            this.app.storage.executeDatabase(sql, {}, "covid19");
          } catch (err) {
            console.log("SQL ERROR -----------------------");
            console.log(err);
            console.log("---------------------------------");
          }
        });
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
              //quoted out check as it is meaning the admin buttons are always displayed.
              if (this.app.wallet.returnPublicKey() == this.admin_pkey) {
                html += `<div class="grid-buttons"><div class="fullview_product" id="${rows[i].product_id}">View</div><div class="edit_product" id="${rows[i].product_id}">Edit</div><div class="delete_product" id="${rows[i].product_id}">Delete</div></div>`;
                added = 1;
	      } else {
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

  deleteProduct(product_id, publickey) {

    let newtx = this.app.wallet.createUnsignedTransactionWithDefaultFee(this.admin_pkey);
    newtx.transaction.msg.module = this.name;
    newtx.transaction.msg.request = "Product Delete";
    newtx.transaction.msg.product_id = product_id;
    newtx.transaction.msg.publickey = publickey;
    newtx = this.app.wallet.signTransaction(newtx);
    this.app.network.propagateTransaction(newtx);

//console.log("SENT TO SERVER");

  }

  updateServerDatabase(data_array, publickey, type="Supplier Update") {

    let newtx = this.app.wallet.createUnsignedTransactionWithDefaultFee(this.admin_pkey);
    newtx.transaction.msg.module = this.name;
    newtx.transaction.msg.request = type;
    newtx.transaction.msg.fields = data_array;
    newtx.transaction.msg.publickey = publickey;
    newtx = this.app.wallet.signTransaction(newtx);
    this.app.network.propagateTransaction(newtx);

//console.log("SENT TO SERVER");

  }


  renderProduct(prod) {
    var html = "";
    Object.entries(prod).forEach(field => {
      switch (field[0]) {
        case 'supplier_id':
          break;
        case 'Product Image':
          if (field[1].length == 0) { field[1] = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="; }
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
          //these extra empty divs ensure that each row of the grid has four elements.
          html += "<div></div><div></div><div></div>"
          html += "<div><input class='input category_id_input products-" + field[0] + "' data-table='products' type='hidden' data-column='category_id' value='1' /></div>";
          break;
        case 'product_specification':
          html += "<div>Specification</div>";
          html += "<input class='input products-" + field[0] + "' data-table='products' type='text' data-column='" + field[0] + "' value='" + field[1] + "' />";
          break;
        case 'product_description':
          html += "<div>Description</div>";
          html += "<textarea class='input products-" + field[0] + "' data-table='products' data-column='" + field[0] + "'>"+field[1]+"</textarea>";
          break;
        case 'product_dimensions':
          html += "<div>Package Size</div>";
          html += "<input class='input products-" + field[0] + "' data-table='products' type='text' data-column='" + field[0] + "' value='" + field[1] + "' />";
          break;
        case 'product_weight':
          html += "<div>Package Weight</div>";
          html += "<input class='input products-" + field[0] + "' data-table='products' type='text' data-column='" + field[0] + "' value='" + field[1] + "' />";
          break;
        case 'product_quantities':
          html += "<div>Package Contents</div>";
          html += "<input class='input products-" + field[0] + "' data-table='products' type='text' data-column='" + field[0] + "' value='" + field[1] + "' />";
          break;
        case 'product_photo':
          html += "<div>Product Image</div>";
          html += "<div>";
          html += "<img class='product-image' id='img-" + field[0] + "' src='" + field[1] + "' />";
          html += "<input class='input products-" + field[0] + "' type='file' />";
          html += "<input style='display:none;' class='input products-text-" + field[0] + "' data-table='products' type='text' data-column='" + field[0] + "' value='" + field[1] + "' />";
          html += "</div>";
          break;
        case 'pricing_per_unit_rmb':
          html += "<div>Price (RMB)</div>";
          html += "<input class='input products-" + field[0] + "' data-table='products' type='text' data-column='" + field[0] + "' value='" + field[1] + "' />";
          break;
        case 'pricing_notes':
          html += "<div>Pricing Notes</div>";
          html += "<input class='input products-" + field[0] + "' data-table='products' type='text' data-column='" + field[0] + "' value='" + field[1] + "' />";
          break;
        case 'pricing_payment_terms':
          html += "<div>Payment Terms</div>";
          html += "<textarea class='input products-" + field[0] + "' data-table='products' data-column='" + field[0] + "'>"+field[1]+"</textarea>";
          break;
        case 'production_stock':
          html += "<div>In Stock</div>";
          html += "<input class='input products-" + field[0] + "' data-table='products' type='text' data-column='" + field[0] + "' value='" + field[1] + "' />";
          break;
        case 'production_daily_capacity':
          html += "<div>Daily Production</div>";
          html += "<input class='input products-" + field[0] + "' data-table='products' type='text' data-column='" + field[0] + "' value='" + field[1] + "' />";
          break;
        case 'production_minimum_order':
          html += "<div>Minimum Order</div>";
          html += "<input class='input products-" + field[0] + "' data-table='products' type='text' data-column='" + field[0] + "' value='" + field[1] + "' />";
          break;
        default:
          break;
      }
    });
    document.querySelector('.product-grid').innerHTML = html;
    document.getElementById('select-product-type').addEventListener('change', (e) => {
 
      try {
        document.querySelector(".update-product-btn").style.display = "block";
      } catch (err) {}
      
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
          html += "<input class='input' data-table='suppliers' type='text' data-column='" + field[0] + "' value='" + field[1] + "' />";
          break;
        case 'address':
          html += "<div>Address</div>";
          html += "<input class='input' data-table='suppliers' type='text' data-column='" + field[0] + "' value='" + field[1] + "' />";
          break;
        case 'phone':
          html += "<div>Phone</div>";
          html += "<input class='input' data-table='suppliers' type='text' data-column='" + field[0] + "' value='" + field[1] + "' />";
          break;
        case 'email':
          html += "<div>Email</div>";
          html += "<input class='input' data-table='suppliers' type='text' data-column='" + field[0] + "' value='" + field[1] + "' />";
          break;
        case 'wechat':
          html += "<div>Wechat</div>";
          html += "<input class='input' data-table='suppliers' type='text' data-column='" + field[0] + "' value='" + field[1] + "' />";
          break;
        case 'notes':
          html += "<div>Notes</div>";
          html += "<textarea class='input' data-table='suppliers' data-column='" + field[0] + "'>" + field[1] + "</textarea>";
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
    var module_self = this;
    
    fields = "pc.product_id as 'product_id', c.name as 'Name', pc.id as cert_id";
    var from = "certifications as 'c' JOIN products_certifications as 'pc'";
    var where = "c.id = pc.certification_id and pc.product_id = " + id;
    this.sendPeerDatabaseRequest("covid19", from, fields, where, null, function (res) {
  
      if (res.rows.length > 0) {
        var el = document.getElementById(prefix + res.rows[0].product_id);
        module_self.renderCerts(res.rows, el);
  
      }
    });
  }

  renderCerts(rows, el) {
    // should this be generalised to module wide?
    var module_self = this;
    var html = "";
    rows.forEach(row => {
      if (row["cert_id"] != null) {
        html += "<div class='cert'><a class='attach-" + row["cert_id"] + "'>" + row["Name"] + "</a></div>";
      } else {
        html += "<div class='cert'>" + row["Name"] + "</div>";
      }
      el.innerHTML = html;
    });

    rows.forEach(row => {
      if (row["cert_id"] != null) {
        el.querySelector('.attach-' + row["cert_id"]).addEventListener('click', (e) => {
          module_self.returnCertFile(row["cert_id"]);
        });
      }
    });
  }

  returnCertFile(id) {
    this.sendPeerDatabaseRequest("covid19", "products_certifications", "*", "id = " + id, null, function (res) {
      if (res.rows.length > 0) {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style.display = "none";
        a.href = [res.rows[0]["file"]];
        a.download = res.rows[0]["file_filename"];
        a.click();
        window.URL.revokeObjectURL(url);
        a.destroy();
        salert("Download attchment: " + res.rows[0]["file_filename"]);
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
        a.style.display = "none";
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



