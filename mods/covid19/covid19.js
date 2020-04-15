const saito = require('../../lib/saito/saito');
const DBModTemplate = require('../../lib/templates/dbmodtemplate');
const SplashPage = require('./lib/splash-page');
const CustomerPortal = require('./lib/customer-portal');
const SupplierPortal = require('./lib/supplier-portal');
const InquirePage = require('./lib/inquire-page'); 
const Certification = require('./lib/certification');

const Header = require('../../lib/ui/header/covid_header');
const AddressController = require('../../lib/ui/menu/address-controller');




class Covid19 extends DBModTemplate {

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

    this.active_category_id = 0;  // for back button

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

    sql = "INSERT OR IGNORE INTO certifications (id, name) VALUES (1, $name)";
    params = { $name: "CE Authentication" }
    await app.storage.executeDatabase(sql, params, "covid19");

    sql = "INSERTOR IGNORE INTO certifications (id, name) VALUES (2, $name)";
    params = { $name: "FDA Authentication" }
    await app.storage.executeDatabase(sql, params, "covid19");

    sql = "INSERT OR IGNORE INTO certifications (id, name) VALUES (3, $name)";
    params = { $name: "Test Report" }
    await app.storage.executeDatabase(sql, params, "covid19");

    sql = "INSERT OR IGNORE INTO certifications (id, name) VALUES (4, $name)";
    params = { $name: "Business License" }
    await app.storage.executeDatabase(sql, params, "covid19");

    sql = "INSERT OR IGNORE INTO certifications (id, name) VALUES (5, $name)";
    params = { $name: "Medical Device Certificate" }
    await app.storage.executeDatabase(sql, params, "covid19");

    sql = `INSERT OR IGNORE INTO categories (id, name) VALUES (1, 'N95口罩 N95 Mask')`;
    app.storage.executeDatabase(sql, {}, "covid19");
    sql = `INSERT OR IGNORE INTO categories (id, name) VALUES (2, '外科口罩 Surgical Masks')`;
    app.storage.executeDatabase(sql, {}, "covid19");
    sql = `INSERT OR IGNORE INTO categories (id, name) VALUES (3, '防护面罩Face shield')`;
    app.storage.executeDatabase(sql, {}, "covid19");
    sql = `INSERT OR IGNORE INTO categories (id, name) VALUES (4, '防护服Protection clothes')`;
    app.storage.executeDatabase(sql, {}, "covid19");
    sql = `INSERT OR IGNORE INTO categories (id, name) VALUES (5, '医疗器械 medical instruments')`;
    app.storage.executeDatabase(sql, {}, "covid19");
    sql = `INSERT OR IGNORE INTO categories (id, name) VALUES (6, '防护眼镜 goggles')`;
    app.storage.executeDatabase(sql, {}, "covid19");
    sql = `INSERT OR IGNORE INTO categories (id, name) VALUES (7, '手套 gloves')`;
    app.storage.executeDatabase(sql, {}, "covid19");
    sql = `INSERT OR IGNORE INTO categories (id, name) VALUES (8, '鞋套 shoe covers')`;
    app.storage.executeDatabase(sql, {}, "covid19");
    sql = `INSERT OR IGNORE INTO categories (id, name) VALUES (9, '防护头罩 medical hoods')`;
    app.storage.executeDatabase(sql, {}, "covid19");
    sql = `INSERT OR IGNORE INTO categories (id, name) VALUES (10, '洗手液 Sanitizers')`;
    app.storage.executeDatabase(sql, {}, "covid19");
    sql = `INSERT OR IGNORE INTO categories (id, name) VALUES (11, '医疗垃圾袋 Clinical waste bags')`;
    app.storage.executeDatabase(sql, {}, "covid19");
    sql = `INSERT OR IGNORE INTO categories (id, name) VALUES (12, '医疗围裙 Plastic Aprons')`;
    app.storage.executeDatabase(sql, {}, "covid19");
    sql = `INSERT OR IGNORE INTO categories (id, name) VALUES (13, '手术服 surgical gown')`;
    app.storage.executeDatabase(sql, {}, "covid19");
    sql = `INSERT OR IGNORE INTO categories (id, name) VALUES (14, 'KN95口罩 KN95 Mask')`;
    app.storage.executeDatabase(sql, {}, "covid19");
    sql = `INSERT OR IGNORE INTO categories (id, name) VALUES (15, 'Disposable Medical Masks')`;
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
    let covid19_self = app.modules.returnModule("Covid19");
console.log("\n\n\n\n\n\n\nHERE 1: ");
    if (txmsg.module != covid19_self.name) { return; }
console.log("\n\n\n\n\n\n\nHERE 2: ");

    //
    // add super for auto-DB update features
    //
    super.onConfirmation(blk, tx, conf, app);

  }




  initializeHTML(app) {

    if (this.app.BROWSER == 0) { return; }

    data = {};
    data.covid19 = this;

    this.app.modules.respondTo("chat-manager").forEach(mod => {
      mod.respondTo('chat-manager').render(app, this);
      mod.respondTo('chat-manager').attachEvents(app, this);
    });


    let data = {};
    data.covid19 = this;

    Header.render(app, data);
    Header.attachEvents(app, data);

    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') && urlParams.get('mode') == 'buy') {
      data.covid19.renderPage("customer", app, data);
    } else {
      SplashPage.render(app, data);
      SplashPage.attachEvents(app, data);
    }


    //
    let chatmod = this.app.modules.returnModule("Chat");
    if (chatmod) {
      data.chat = chatmod;
      chatmod.respondTo('email-chat').render(app, data);
      chatmod.respondTo('email-chat').attachEvents(app, data);
    }


  }


  renderPage(page = "home", app, data) {

    data.covid19 = this;

    if (page == "home") {
      data.covid19.active_category_id = 0;
      SplashPage.render(app, data);
      SplashPage.attachEvents(app, data);
    };

    if (page == "supplier") {
      data.covid19.active_category_id = 0;
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







  addProductsToTable(rows, fields, app, data) {

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
                //html += `<div><img style="max-width:200px;max-height:200px" src="${rows[i][fields[ii]]}" /></div>`;
                html += `<div class="product-img-cell" id="product-img-${rows[i].product_id}"><i class="far fa-images"></i></div>`;
                added = 1;
              }
            }

            if (fields[ii] == "edit") {
              if (this.app.wallet.returnPublicKey() == this.admin_pkey) { fields[ii] = "admin"; } else {
                html += `<div class="grid-buttons"><div class="grid-action edit_product" id="edit-${rows[i].product_id}">Edit</div><div class="delete_product" id="delete-${rows[i].product_id}">Delete</div><div class="add_cert" id="add-certs-${rows[i].product_id}">Add Cert</div></div>`;
                added = 1;
              }
            }

            if (fields[ii] == "fullview") {
              if (this.app.wallet.returnPublicKey() == this.admin_pkey) {
                html += `<div class="grid-buttons"><div class="grid-action fullview_product" id="view-${rows[i].product_id}">View</div><div class="grid-action edit_product" id="edit-${rows[i].product_id}">Edit</div><div class="grid-action delete_product" id="delete-${rows[i].product_id}">Delete</div><!--div class="grid-action add_cert" id="add-certs-${rows[i].product_id}">Add Cert</div--></div>`;
                added = 1;
              } else {
//                html += `<div class="grid-action grid-buttons"><div class="fullview_product" id="${rows[i].product_id}">View</div></div>`;
                html += `<div class="grid-buttons"><div class="grid-action inquire_product" id="inquire-${rows[i].product_id}">Buy</div></div>`;
                added = 1;
              }
            }

            if (fields[ii] == "admin") {
              html += `<div class="grid-buttons"><div class="grid-action edit_product" id="edit-${rows[i].product_id}">Edit</div><div class="grid-action delete_product" id="delete-${rows[i].product_id}">Delete</div><div class="grid-action add_cert" id="add-certs-${rows[i].product_id}">Add Cert</div></div>`;
              added = 1;
            }

            if (fields[ii] == "certifications") {
              html += `<div class="product_certificates" id="certsfor-${rows[i].product_id}"></div>`;
              added = 1;
            }

            if (fields[ii] == "show_id") {
              html += `<div>${rows[i].product_id}</div>`;
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

      html += "";
      document.querySelector(".products-table").innerHTML += html.replace(/null/g, "").replace(/undefined/g, "");
      this.returnCerts(rows[i].product_id, "certsfor-");
    }
    document.querySelector(".products-table").style.display = "grid";
    try {
      document.querySelectorAll('.add_cert').forEach(el => {
        el.addEventListener('click', (e) => {
          data.id = e.target.id.split("-")[2];
          Certification.render(app, data);
          Certification.attachEvents(app, data);
        });
      });
    } catch (err) { }
    try {
      document.querySelectorAll('.edit_product').forEach(el => {
        el.addEventListener('click', (e) => {
          data.product_id = e.target.id.split("-")[1];
          UpdateProduct.render(app, data);
          UpdateProduct.attachEvents(app, data);
        });
      });
    } catch (err) { }
    try {
      document.querySelectorAll('.delete_product').forEach(el => {
        el.addEventListener('click', (e) => {
          alert("Product Deletion functionality coming soon!");
        });
      });
    } catch (err) { }
    try {
      document.querySelectorAll('.fullview_product').forEach(el => {
        el.addEventListener('click', (e) => {
          data.id = e.target.id.split("-")[1];
          ProductPage.render(this.app, data);
          ProductPage.attachEvents(this.app, data);
        });
      });
    } catch (err) { }
    try {
      document.querySelectorAll('.inquire_product').forEach(el => {
        el.addEventListener('click', (e) => {
          data.product_id = e.target.id.split("-")[1];
          if(typeof localStorage.cart == 'undefined') {
            localStorage.cart = "";
          }
          if(!localStorage.cart.split("|").includes(data.product_id)){
            localStorage.cart += "|" + data.product_id;
          }

          //salert('gimme - product id:' + e.target.id)
          InquirePage.render(this.app, data);
          InquirePage.attachEvents(this.app, data);
        });
      });
    } catch (err) { }
    try {
      document.querySelectorAll('.product-img-cell').forEach(el => {
        var product_id = el.id.split("-")[2];
        data.covid19.sendPeerDatabaseRequest("covid19", "products", 'product_photo', "id = " + product_id, null, function (res) {
          if(res.rows.length > 0 ) {
            if(res.rows[0].product_photo.length > 0) {
              var html = "<img style='max-width:200px;max-height:200px' src='" + res.rows[0].product_photo + "'/>";
              document.getElementById('product-img-' + product_id).innerHTML = html;
            }
          }
        });
      }); 
    } catch (err) { }
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

  updateServerDatabase(data_array, publickey, type = "Supplier Update") {

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
        case 'product_name':
          break;
        case 'category_id':
          //these extra empty divs ensure that each row of the grid has four elements.
          html += "<div></div><div></div><div></div>"
          html += "<div><input class='input category_id_input products-" + field[0] + "' data-table='products' type='hidden' data-column='category_id' value='" + field[1] + "' /></div>";
          break;
        case 'product_specification':
          html += "<div>Specification</div>";
          html += "<input class='input products-" + field[0] + "' data-table='products' type='text' data-column='" + field[0] + "' value='" + field[1] + "' />";
          break;
        case 'product_description':
          html += "<div>Description</div>";
          html += "<textarea class='input products-" + field[0] + "' data-table='products' data-column='" + field[0] + "'>" + field[1] + "</textarea>";
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
          html += "<div class='product-image-holder'><img class='product-image' id='img-" + field[0] + "' src='" + field[1] + "' /></div>";
          html += "<input class='input products-" + field[0] + "' type='file' />";
          html += "<input style='display:none;' class='input products-text-" + field[0] + "' data-table='products' type='text' data-column='" + field[0] + "' value='" + field[1] + "' />";
          html += "</div>";
          break;
        case 'pricing_per_unit_rmb':
          html += "<div>Price (RMB)</div>";
          html += "<input class='input products-" + field[0] + "' data-table='products' type='text' data-column='" + field[0] + "' value='" + field[1] + "' />";
          break;
        case 'pricing_per_unit_public':
          if (this.isAdmin()) {
            html += "<div>Price (USD)</div>";
            html += "<input class='input products-" + field[0] + "' data-table='products' type='text' data-column='" + field[0] + "' value='" + field[1] + "' />";
          }
          break;
        case 'pricing_notes':
          html += "<div>Pricing Notes</div>";
          html += "<input class='input products-" + field[0] + "' data-table='products' type='text' data-column='" + field[0] + "' value='" + field[1] + "' />";
          break;
        case 'pricing_payment_terms':
          html += "<div>Payment Terms</div>";
          html += "<textarea class='input products-" + field[0] + "' data-table='products' data-column='" + field[0] + "'>" + field[1] + "</textarea>";
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
      } catch (err) { }

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
          if (this.isAdmin()) {
            html += "<div>Notes</div>";
            html += "<textarea class='input' data-table='suppliers' data-column='" + field[0] + "'>" + field[1] + "</textarea>";
          }
          break;
        default:
          break;
      }
    });

    document.querySelector('.supplier-grid').innerHTML = html;

  }


  returnCerts(id, prefix) {
    // should this be generalised to module wide?
    var module_self = this;

    fields = "pc.product_id as 'product_id', c.name as 'Name', note, pc.id as cert_id";
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
      var note = "";
      if (row["note"]) {
        note = "<div class='tiptext'>" + row["note"] + "</div>"
      }
      if (row["cert_id"] != null) {
        html += "<div class='cert tip'><a class='attach-" + row["cert_id"] + "'>" + row["Name"] + "</a>" + note + "</div>";
      } else {
        html += "<div class='cert tip'>" + row["Name"] + note + "</div>";
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
        salert("Download attachment: " + res.rows[0]["file_filename"]);
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
        salert("Download attachment: " + res.rows[0]["attachment_filename"]);
      }
    });
  }

  isAdmin() {
    //return 1;
    if (this.app.wallet.returnPublicKey() == this.admin_pkey) { return true; }
    return false;
  }

}

module.exports = Covid19;



