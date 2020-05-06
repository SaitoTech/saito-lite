const saito = require('../../lib/saito/saito');
const DBModTemplate = require('../../lib/templates/dbmodtemplate');
const SplashPage = require('./lib/splash-page');
const CustomerPortal = require('./lib/customer-portal');
const SupplierPortal = require('./lib/supplier-portal');
const FileManager = require('./lib/file-manager');
const BundleManager = require('./lib/bundle-manager');
const CategoryManager = require('./lib/category-manager')

const InquirePage = require('./lib/inquire-page');

const Certification = require('./lib/certification');

const Header = require('./lib/header/covid_header');
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
    /*
    if (type == 'chat-render-request') {
      if (this.browser_active) {
        let chatmod = this.app.modules.returnModule("Chat");
        let uidata = {}
        uidata.chat = this;
        chatmod.respondTo('email-chat').render(this.app, uidata);
        chatmod.respondTo('email-chat').attachEvents(this.app, uidata);
      }
    }*/
  }



  async installModule(app) {

    await super.installModule(app);

  }

  async initialize(app) {

    await super.initialize(app);

    //this.generateProcurementBundle(null);


    let sql = "";

    sql = "PRAGMA table_info(suppliers)";
    this.definitions['suppliers'] = await app.storage.queryDatabase(sql, {}, "covid19");

    sql = "PRAGMA table_info(products)";
    this.definitions['products'] = await app.storage.queryDatabase(sql, {}, "covid19");

  }



  async onConfirmation(blk, tx, conf, app) {

    if (app.BROWSER == 1) { return; }
    if (conf > 0) { return; }


    //
    // only handle our stuff
    //
    let txmsg = tx.returnMessage();
    let covid19_self = app.modules.returnModule("Covid19");

    if (txmsg.module != covid19_self.name) { return; }

    //
    // add super for auto-DB update features
    //
    super.onConfirmation(blk, tx, conf, app);

  }




  initializeHTML(app) {

    if (this.app.BROWSER == 0) { return; }

    data = {};
    data.covid19 = this;

    /*
    this.app.modules.respondTo("chat-manager").forEach(mod => {
      mod.respondTo('chat-manager').render(app, this);
      mod.respondTo('chat-manager').attachEvents(app, this);
    });
    */

    let data = {};
    data.covid19 = this;

    Header.render(app, data);
    Header.attachEvents(app, data);

    /*
    let chatmod = this.app.modules.returnModule("Chat");
    if (chatmod) {
      data.chat = chatmod;
      chatmod.respondTo('email-chat').render(app, data);
      chatmod.respondTo('email-chat').attachEvents(app, data);
    }
    */

  }

  onPeerHandshakeComplete(app, peer) {

    let data = {};
    data.covid19 = this;

    if (this.browser_active == 1) {

      var urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('mode')) {
        var mode = urlParams.get('mode');
        switch (mode) {
          case 'home':
            data.covid19.renderPage("home", app, data);
            break;
          case 'customer':
            data.covid19.renderPage("customer", app, data);
            break;
          case 'supplier':
            data.covid19.renderPage("supplier", app, data);
            break;
          case 'supplier-profile':
            data.covid19.renderPage("supplier-profile", app, data);
            break;
          case 'file-manager':
            data.covid19.renderPage("file-manager", app, data);
            break;
          case 'bundle-manager':
            data.covid19.renderPage("bundle-manager", app, data);
            break;
          case 'category-manager':
            data.covid19.renderPage("category-manager", app, data);
            break;
          case 'default':
            SplashPage.render(app, data);
            SplashPage.postrender(app, data);
            SplashPage.attachEvents(app, data);
        }
      } else {
        SplashPage.render(app, data);
        SplashPage.postrender(app, data);
        SplashPage.attachEvents(app, data);
      }
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

    if (page == "supplier-profile") {
      data.covid19.active_category_id = 0;
      SupplierProfile.render(app, data);
      SupplierProfile.attachEvents(app, data);
    };

    if (page == "customer") {
      CustomerPortal.render(app, data);
      CustomerPortal.attachEvents(app, data);
    }

    if (page == "file-manager") {
      FileManager.render(app, data);
      FileManager.attachEvents(app, data);
    };

    if (page == "bundle-manager") {
      BundleManager.render(app, data);
      BundleManager.attachEvents(app, data);
    };

    if (page == "category-manager") {
      CategoryManager.render(app, data);
      CategoryManager.attachEvents(app, data);
    };

  }

  attachEvents(app) {

    let data = {};
    data.covid19 = this;

  }


  addProductsToTable(rows, fields, app, data) {

    let covid_self = this;

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
                html += `<div class="product-img-cell" id="product-img-${rows[i].product_id}"><i class="far fa-images"></i></div>`;
                added = 1;
              }
            }

            if (fields[ii] == "production_daily_capacity") {
              if (rows[i][fields[ii]] != null) {
                html += `<div class="rightj" data-table="${ii}">${s2Number(rows[i][fields[ii]])}</div>`;
                added = 1;
              }
            }

            if (fields[ii] == "edit") {
              if (this.app.wallet.returnPublicKey() == this.admin_pkey) { fields[ii] = "admin"; } else {
                html += `<div class="grid-buttons"><div class="grid-action edit_product" id="edit-${rows[i].product_id}">Edit</div><div class="delete_product" id="delete-${rows[i].uuid}">Delete</div><div class="add_cert" id="add-certs-${rows[i].product_id}">Add Cert</div></div>`;
                added = 1;
              }
            }

            if (fields[ii] == "fullview") {
              if (this.app.wallet.returnPublicKey() == this.admin_pkey) {
                html += `<div class="grid-buttons"><div class="grid-action fullview_product" id="view-${rows[i].product_id}">View</div><div class="grid-action edit_product" id="edit-${rows[i].product_id}">Edit</div><div class="grid-action delete_product" id="delete-${rows[i].product_id}">Delete</div><!--div class="grid-action add_cert" id="add-certs-${rows[i].product_id}">Add Cert</div--></div>`;
                added = 1;
              } else {
                //html += `<div class="grid-action grid-buttons"><div class="fullview_product" id="${rows[i].product_id}">View</div></div>`;

                html += `
                <div class="grid-buttons">
                  <div class="grid-action fullview_product" id="view-${rows[i].product_id}">View</div>
                  <div class="grid-action inquire_product" id="inquire-${rows[i].product_id}">Buy</div>
                </div>`;
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

          data.product_id = e.target.id.split("-")[1];
          data.covid19.sendPeerDatabaseRequest("covid19", "products", 'uuid', "id = " + data.product_id, null, function (res) {
            if (res.rows.length > 0) {

              let c = confirm("Are you sure you want to delete this product?");
              if (c) {

                let values = [];
                values[0] = {};
                values[0].dbname = "covid19";
                values[0].table = "products";
                values[0].column = "uuid";
                values[0].value = res.rows[0].uuid;

                covid_self.deleteDatabase(values);
                salert("Delete Requested - please reload in 30 seconds");

              }
            }
          });
        });
      });
    } catch (err) { }
    try {
      document.querySelectorAll('.fullview_product').forEach(el => {
        el.addEventListener('click', (e) => {
          data.product_id = e.target.id.split("-")[1];
          ProductPage.render(this.app, data);
          ProductPage.attachEvents(this.app, data);
        });
      });
    } catch (err) { }
    try {
      document.querySelectorAll('.inquire_product').forEach(el => {
        el.addEventListener('click', (e) => {
          data.product_id = e.target.id.split("-")[1];

          if (typeof localStorage.cart == 'undefined') {
            localStorage.cart = JSON.stringify({ "products": [] });
          }
          var cart = JSON.parse(localStorage.cart);
          var add = true;
          cart.products.forEach(product => {
            if (data.product_id == product.id) {
              add = false;
            }
          });

          if (add) {
            cart.products.push({
              id: data.product_id,
              category: document.getElementById('select-product-type')[document.getElementById('select-product-type').selectedIndex].text,
              budget: "",
              quantity: "",
              requirements: ""
            })
          }
          localStorage.cart = JSON.stringify(cart);

          InquirePage.render(this.app, data);
          InquirePage.attachEvents(this.app, data);
        });
      });
    } catch (err) { }
    try {
      document.querySelectorAll('.product-img-cell').forEach(el => {
        var product_id = el.id.split("-")[2];
        data.covid19.sendPeerDatabaseRequest("covid19", "products", 'product_photo', "id = " + product_id, null, function (res) {

          if (res.rows.length > 0) {
            if (res.rows[0].product_photo.length > 0) {
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
  /****
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
  
    deleteItem(id, dbtable) {
  
      let newtx = this.app.wallet.createUnsignedTransactionWithDefaultFee(this.admin_pkey);
      newtx.transaction.msg.module = this.name;
      newtx.transaction.msg.request = "Delete Item";
      newtx.transaction.msg.item_id = item_id;
      newtx = this.app.wallet.signTransaction(newtx);
      this.app.network.propagateTransaction(newtx);
  
      //console.log("SENT TO SERVER");
  
    }
  ***/

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


  returnCerts(id, prefix) {
    // should this be generalised to module wide?
    var module_self = this;

    var sql = `
      select 
        pc.product_id as 'product_id', 
        c.name as 'Name', 
        note, 
        pc.id as 'id',
        'certifications' as 'source'
      from 
        certifications as 'c' 
      JOIN 
        products_certifications as 'pc'
    where 
      c.id = pc.certification_id and pc.product_id = ${id};
     `;
    /*
    var fields = "pc.product_id as 'product_id', c.name as 'Name', note, pc.id as cert_id";
    var from = "certifications as 'c' JOIN products_certifications as 'pc'";
    var where = "c.id = pc.certification_id and pc.product_id = " + id;
    this.sendPeerDatabaseRequest("covid19", from, fields, where, null, function (res) {
    */
    this.sendPeerDatabaseRequestRaw("covid19", sql, function (res) {

      if (res.rows.length > 0) {
        var el = document.getElementById(prefix + res.rows[0].product_id);
        module_self.renderCerts(res.rows, el);
      }
    });
  }


  renderCerts(rows, el) {
    // should this be generalised to module wide?
    var module_self = this;

    rows.forEach(row => {

      var html = "";

      //
      // certifications
      //
      if (row["source"] == "certifications") {

        var note = "";
        if (row["note"]) { note = "<div class='tiptext'>" + row["note"] + "</div>"; }
        if (row["id"] != null && module_self.isAdmin()) {
          html += "<div class='cert tip'><a class='attach-cert-" + row["id"] + "'>" + row["Name"] + "</a>" + note;
          html += " <i data-id='" + row["id"] + "' id='delete-cert-" + row["id"] + "' class='fright far fa-times-circle'></i></div>";
        } else {
          //html += "<div class='cert tip'>" + row["Name"] + note + "</div>";
          html += "<div class='cert tip'>" + row["Name"] + "<div class='tiptext'> Certification available on recipet of formal purchase order. </div></div>";
        }

        el.append(elParser(html));

      }


      //
      // bundles
      // this may not work right now.
      if (row["source"] == "files") {

        console.log("FILE: " + JSON.stringify(row));

        var note = "";
        if (row["note"]) { note = "<div class='tiptext'>supplementary file</div>"; }
        if (row["product_id"] != null) {
          html += "<div class='cert tip'><a class='attach-file-" + row["id"] + "'>" + row["Name"] + "</a></div>";
        } else {
          html += "<div class='cert tip'>" + row["Name"] + "</div>";
        }
        el.append(elParser(html));
      }


    });

    //add actions - limited to admins right now
    if (module_self.isAdmin()) {
      rows.forEach(row => {
        if (row["source"] == "certifications") {
          el.querySelector('.attach-cert-' + row["id"]).addEventListener('click', (e) => {
            module_self.returnCertFile(row["id"]);
          });
          if (module_self.isAdmin()) {
            el.querySelector('#delete-cert-' + row["id"]).addEventListener('click', (e) => {
              module_self.returnCertFile(row["id"]);
            });
          }
        }
        if (row["source"] == "files") {
          el.querySelector('.attach-file-' + row["id"]).addEventListener('click', (e) => {
            module_self.returnFile(row["id"]);
          });
        }
      });
    }
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
        //window.URL.revokeObjectURL(url);
        a.destroy();
        //salert("Download certificate attachment: " + res.rows[0]["file_filename"]);
      }
    });
  }

  returnFile(id) {
    this.sendPeerDatabaseRequest("covid19", "files", "*", "id= " + id, null, function (res) {
      if (res.rows.length > 0) {
        //var blob = new Blob([res.rows[0]["file_data"]], { type: res.rows[0]["file_type"] });
        //var url = window.URL.createObjectURL(blob);

        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style.display = "none";
        a.href = res.rows[0]["file_data"];
        a.download = res.rows[0]["file_filename"];
        a.click();
        //window.URL.revokeObjectURL(url);
        a.destroy();
        //salert("Download file attachment: " + res.rows[0]["file_filename"]);
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

  treatBoolean(el) {
    let cell = el.id;
    let html = `
          <input class="check-${cell}" id="check-${cell}" type="checkbox">
          `;
    el.parentNode.innerHTML += html;
    //when rewriting the partent innerhtml - the element reference is lost.
    el = document.getElementById(el.id);
    el.classList.add('hidden');

    if (el.value == 1) {
      document.getElementById(`check-${cell}`).checked = true;
    }

    document.getElementById(`check-${cell}`).addEventListener('change', (e) => {
      if (e.target.checked) {
        el.value = 1;
      } else {
        el.value = 0;
      }
    });

  }

  treatPhoto(el) {

    let cell = el.id;
    let html = `
          <div class="product-image-holder" id="img-holder-${cell}">
            <img class="product-image" id="img-${cell}" src="${el.value}" />
          </div>
          <input class="products-${cell}" id="file-${cell}" type="file">
          `;
    el.parentNode.innerHTML += html;
    //when rewriting the partent innerhtml - the element reference is lost.
    el = document.getElementById(el.id);
    el.classList.add('hidden');

    document.getElementById(`file-${cell}`).addEventListener('change', (e) => {
      var img = document.getElementById(`img-${cell}`);
      var reader = new FileReader();
      var file = e.target.files[0];
      var original = new Image();
      original.onload = function () {
        var w = 0;
        var h = 0;
        var r = 1;

        var canvas = document.createElement('canvas');

        if (original.width > 450) {
          r = 450 / original.width;
        } if (r * original.height > 300) {
          r = 300 / original.height;
        }
        w = original.width * r;
        h = original.height * r;

        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(original, 0, 0, w, h);
        var result = canvas.toDataURL(file.type);
        img.src = result;
        el.value = result;
      }
      reader.addEventListener("load", function () {

        original.src = reader.result;

      }, false);
      reader.readAsDataURL(file);
    });

    document.getElementById(`img-holder-${cell}`).addEventListener('click', e => {
      document.getElementById(`file-${cell}`).click();
    });

  }

  treatACDropDown(el, dbtable, idcol, valuecol) {

    let cell = el.id;
    let html = "";
    var options = "";
    this.sendPeerDatabaseRequest("covid19", dbtable, idcol + " as 'id', " + valuecol + " as 'value'", "deleted <> 1", null, function (res) {
      res.rows.forEach(opt => {
        options += `<option data-value="${opt.id}" value="${opt.value}"></option>`
      });
      html += `
          <input type="text" id="${dbtable}-display" list="${dbtable}-options" placeholder="Click or type...">
          <datalist id="${dbtable}-options">${options}</datalist>
        `;
      el.parentNode.innerHTML += html;
      el = document.getElementById(el.id);
      el.classList.add('hidden');

      if (el.value.length > 0) {
        document.getElementById(`${dbtable}-display`).value = document.querySelector(`#${dbtable}-options [data-value='${el.value}']`).value;
      }

      document.getElementById(`${dbtable}-display`).addEventListener("change", (e) => {
        el.value = document.querySelector(`#${dbtable}-options [value='${e.target.value}']`).dataset.value;
      });

      document.getElementById(`${dbtable}-display`).addEventListener("focus", (e) => {
        e.target.value = "";
        e.target.click();
        e.target.click();
      });

    });

  }

  treatHide(el) {
    el.parentNode.previousSibling.classList.add('hidden');
    el.parentNode.classList.add('hidden');
  }

  treatFile(el, typeel = null, nameel = null) {
    let cell = el.id;
    let html = `
         <div id="certification_display" class="file-display">No file Selected</div>
         <input class="file-${cell}" id="file-${cell}" type="file">
          `;
    el.parentNode.innerHTML += html;
    //when rewriting the partent innerhtml - the element reference is lost.
    el = document.getElementById(el.id);
    el.classList.add('hidden');
    var displayEl = document.querySelector("#certification_display");
    if (el.value != "") {
      if (typeel.value.split("/")[0] == "image") {
        displayEl.innerHTML = "<div class='product-image-holder'><img class='product-image' alt='certification file' src='" + el.value + "'/></div>";
      } else {
        displayEl.innerHTML = typeel.split("/")[1].toUpperCase();
      }
    }

    var input = document.getElementById(`file-${cell}`);
    input.addEventListener('change', (e) => {
      var reader = new FileReader();
      var file = e.target.files[0];
      reader.addEventListener("load", function () {

        if (file.type.split("/")[0] == "image") {
          displayEl.innerHTML = "<div class='product-image-holder'><img class='product-image' alt='certification file' src='" + reader.result + "'/></div>";
        } else {
          displayEl.innerHTML = file.type.split("/")[1].toUpperCase();
        }
        el.value = reader.result;
        if (nameel) { nameel.value = file.name };
        if (typeel) { typeel.value = file.type };
      }, false);
      reader.readAsDataURL(file);
    });
    document.querySelector("#certification_display").addEventListener('click', e => {
      input.click();
    });

  };


  pdfCap(inputHTML, filename) {
    var shim = document.createElement('div');
    shim.style.width = "1120px";
    shim.style.height = "1475px";
    shim.style.padding = "100px"
    shim.style.position = "absolute";
    shim.style.top = "-2000px;"
    //shim.appendChild(targetel.cloneNode(true));
    shim.classList.add('toprint');
    shim.innerHTML = inputHTML;
    document.querySelector('.footer').appendChild(shim);
    const html2canvas = require('html2canvas');
    const jsPDF = require('jspdf');
    const domElement = shim;
    html2canvas(domElement, {
      onclone: (document) => {
        //document.getElementById('print-button').style.visibility = 'hidden';
      }
    })
      .then((canvas) => {
        console.log(canvas.width + " " + canvas.height);
        var imgData = canvas.toDataURL('image/jpeg', 1);

        // console.log('Report Image URL: ' + imgData);
        var doc = new jsPDF('p', 'mm', "a4");
        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        doc.addImage(imgData, 'jpeg', 0, 0, pdfWidth, pdfHeight);

        doc.save(filename);
        shim.destroy();
      });
  }

  isAdmin() {
    //return 1;
    if (this.app.wallet.returnPublicKey() == this.admin_pkey) { return true; }
    return false;
  }




  //
  //
  //
  async generateProcurementBundle(tx = null) {

    if (this.app.BROWSER == 1) { console.log("Non-Browser Function"); return; }

    tx = new saito.transaction();
    tx = this.app.wallet.signTransaction(tx);

    let txmsg = tx.returnMessage();
    let uuid = tx.transaction.ts + "-" + tx.transaction.sig;


    //
    // shell access
    //
    const util = require('util');
    const exec = util.promisify(require('child_process').exec);
    const fs = this.app.storage.returnFileSystem();
    const path = require('path');
    const unzipper = require('unzipper');


    let bash_script_name = "bundler/" + uuid + ".sh";
    let bash_script_create = '';

    let bash_script_del_name = "bundler/" + uuid + "_del.sh";
    let bash_script_delete = '';

    let bash_script_zip_name = 'bundler/' + uuid + "_zip.sh";
    let bash_script_zip = '';

    //
    // script that creates directories
    //
    bash_script_create += 'mkdir  ' + __dirname + "/bundler/" + uuid + "/" + "\n";
    bash_script_create += 'mkdir  ' + __dirname + "/bundler/" + uuid + "/package" + "\n";
    bash_script_create += 'mkdir  ' + __dirname + "/bundler/" + uuid + "/package/category" + "\n";
    bash_script_create += 'echo "\n\n\n\n\n\n\n\nEXECUTED IN THIS BUNDLE!!!!!\n\n\n"' + "\n";

    //
    // script that zips directory
    //
    bash_script_zip += 'zip -r "./bundler/' + uuid + '.zip" "' + __dirname + "/bundler/" + uuid + '"';
    console.log("ZIP: " + bash_script_zip);

    //
    // script to delete stuff
    //
    bash_script_delete += 'rm -f "' + __dirname + "/bundler/" + uuid + '.sh"' + "\n";
    bash_script_delete += 'rm -f "' + __dirname + "/bundler/" + uuid + '_zip.sh"' + "\n";
    bash_script_delete += 'rm -f "' + __dirname + "/bundler/" + uuid + '_del.sh"' + "\n";



    //
    // create file "bash_script_name" and then execute the 
    //
    fs.writeFileSync(path.resolve(__dirname, bash_script_name), bash_script_create, { encoding: 'binary' });
    try {
      let cwdir = __dirname;
      let createdir_command = 'sh ' + bash_script_name;
      const { stdout, stderr } = await exec(createdir_command, { cwd: cwdir, maxBuffer: 4096 * 2048 });
    } catch (err) {
      console.log(err);
    }


    //
    // write files
    //
    let sql = "SELECT * FROM products";
    let params = {};
    let rows = await this.app.storage.queryDatabase(sql, params, "covid19");
    let files = {};
    files.path = [];
    files.name = [];
    files.content = [];

    if (rows) {
      if (rows.length > 0) {
        for (let i = 0; i < rows.length; i++) {

          let product_id = rows[i].id;
          let file_content = "What a fascinating document";

          files.name.push(product_id + ".txt");
          files.path.push("bundler/" + uuid + "/package/");
          files.content.push(file_content);

        }
      }
    }

    //
    // pretend database found stuff
    //
    files.name.push("12.txt");
    files.path.push("bundler/" + uuid + "/package/");
    files.content.push("Sample Content");

    console.log("\n\n\n\n\n\n");


    //
    // now write the file array to the bundle directory
    //
    //
    for (let i = 0; i < files.path.length; i++) {

      let file_path = files.path[i] + files.name[i];
      let file_content = files.content[i];

      fs.writeFileSync(path.resolve(__dirname, file_path), file_content, { encoding: 'binary' });

    }


    //
    // basically done
    //
    console.log("This is where we can zip stuff...");


    //
    // write zip script
    //
    fs.writeFileSync(path.resolve(__dirname, bash_script_zip_name), bash_script_zip, { encoding: 'binary' });
    try {
      let cwdir = __dirname;
      let createdir_command = 'sh ' + bash_script_zip_name;
      const { stdout, stderr } = await exec(createdir_command, { cwd: cwdir, maxBuffer: 4096 * 2048 });
    } catch (err) {
      console.log(err);
    }

    //
    // now delete stuff
    //
    fs.writeFileSync(path.resolve(__dirname, bash_script_del_name), bash_script_delete, { encoding: 'binary' });
    try {
      let cwdir = __dirname;
      let createdir_command = 'sh ' + bash_script_del_name;
      const { stdout, stderr } = await exec(createdir_command, { cwd: cwdir, maxBuffer: 4096 * 2048 });
    } catch (err) {
      console.log(err);
    }

  }



  hideEmptyContent(tabledivs) {

    //
    // hide useless content
    //
    let content_fields = [];
    document.querySelectorAll(tabledivs).forEach(el => {
      content_fields.push(el);
    });

    for (let i = 1; i < content_fields.length; i += 2) {
      if (content_fields[i].innerHTML === '') {
        content_fields[i - 1].remove();
        content_fields[i].remove();
      }
    }

  }



}

module.exports = Covid19;
