const ProductPageTemplate = require('./product-page.template');
const UpdateSupplier = require('./update-supplier.js');

const this_productPage = this;

module.exports = ProductPage = {

  active_category_id: 0,

  render(app, data) {

    var supplier_id = 0;
    document.querySelector(".main").innerHTML = ProductPageTemplate(app, data);

    document.querySelector(".navigation").innerHTML = '<div class="button navlink covid_back"><i class="fas fa-back"></i>back</div>';

    this.active_category_id = data.covid19.active_category_id;

    //
    // load product
    //

//    let fields = `
  
      let sql = `
        SELECT
          categories.name as 'Category',
          product_specification as 'Specification',
          product_description as 'Description', 
          product_photo as 'Product Image', 
          production_daily_capacity as 'Daily Production', 
          production_minimum_order as 'Minimum Order',
          supplier_id
        FROM
          products 
        JOIN
          categories ON products.category_id = categories.id
        WHERE
          products.id = ${data.product_id};
      `;
      data.covid19.sendPeerDatabaseRequestRaw("covid19", sql, function (res) {
    //data.covid19.sendPeerDatabaseRequest("covid19", "products", fields, "id= " + data.product_id, null, function (res) {

      if (res.rows.length > 0) {

        data.covid19.renderProduct(res.rows[0]);
        supplier_id = res.rows[0]["supplier_id"];
        document.querySelector(".product-name").innerHTML = res.rows[0]["Specification"];
        data.covid19.active_category_id = res.rows[0]["category_id"];
        data.covid19.active_category_name = res.rows[0]["Category"];
        //
        // hide useless content
        //
        data.covid19.hideEmptyContent(".product-grid div");




        if (data.covid19.isAdmin()) {
          var html = "<div></div><div class='edit-button-holder'><button id='edit-supplier'>Edit</button></div>";
          document.querySelector('.supplier-profile').innerHTML += html;
          //
          // load supplier admin
          fields = "name as 'Name', address as 'Province', phone as 'Phone', email as 'Email', wechat as 'WeChat', notes as 'Notes', publickey";
          data.covid19.sendPeerDatabaseRequest("covid19", "suppliers", fields, "id= " + supplier_id, null, function (res) {
            if (res.rows.length > 0) {
              data.covid19.renderSupplier(res.rows[0]);
              data.supplier_publickey = res.rows[0].publickey;
              document.getElementById('edit-supplier').addEventListener('click', (e) => {
                data.supplier_id = supplier_id;
                UpdateSupplier.render(app, data);
                UpdateSupplier.attachEvents(app, data);
              });

              //
              // hide useless content
              //
              data.covid19.hideEmptyContent(".supplier-grid div");

            }
          });

        } else {
          //
          // load supplier supplier
          fields = "address as 'Province'";
          data.covid19.sendPeerDatabaseRequest("covid19", "suppliers", fields, "id= " + supplier_id, null, function (res) {
            if (res.rows.length > 0) {
              data.covid19.renderSupplier(res.rows[0]);

              //
              // hide useless content
              //
              data.covid19.hideEmptyContent(".supplier-grid div");

            }
          });
        }

        /***
                //
                // load certifications
                //
                fields = "pc.product_id as 'product_id', c.name as 'Name', note, pc.id as cert_id";
                var from = "certifications as 'c' JOIN products_certifications as 'pc'";
                var where = "c.id = pc.certification_id and pc.product_id = " + data.product_id;
                data.covid19.sendPeerDatabaseRequest("covid19", from, fields, where, null, function (res) {
                  if (res.rows.length > 0) {
                    data.covid19.renderCerts(res.rows, document.querySelector('.cert-grid'));
                  }
                });
        ***/

        //
        // certifications
        //
        var sql = `
          select
            distinct(certifications.name) as Name,
            "certifications" as source,
            products_certifications.file_type,
            length(products_certifications.file) as 'file_length',
            products_certifications.id,
            'select'
          from
            certifications JOIN products_certifications
          on 
            certifications.id = products_certifications.certification_id
          where
            products_certifications.product_id = ${data.product_id}
       `;

        data.covid19.sendPeerDatabaseRequestRaw("covid19", sql, function (res) {

          if (res.rows.length > 0) {
            data.covid19.renderCerts(res.rows, document.querySelector('.cert-grid'));
          }

        });


        //
        // files
        //
        sql = `
          select
            distinct(files.file_filename) as Name,
            "files" as source,
            files.file_type,
            length(files.file_data) as 'file_length',
            files.id,
            'select'
          from
            files JOIN file_attachments
              on  files.id = file_attachments.file_id
          where
            file_attachments.object_table = 'products' and
            file_attachments.object_id = ${data.product_id}
        `;

        data.covid19.sendPeerDatabaseRequestRaw("covid19", sql, function (res) {

          if (res.rows.length > 0) {
            data.covid19.renderCerts(res.rows, document.querySelector('.cert-grid'));
          }
        });


      }
    });


    document.querySelector(".loading").style.display = "none";
    document.querySelector(".portal").style.display = "block";


  },

  attachEvents(app, data) {

    let aci = this.active_category_id;

    try {
      document.querySelector('.covid_back').addEventListener('click', (e) => {
        data.covid19.active_category_id = aci;

        if (data.covid19.active_category_id > 0) {
          data.covid19.renderPage("customer", app, data);
        } else {
          data.covid19.renderPage("home", app, data);
        }

      });
    } catch (err) { }
    

    // remove attachements button for now
    /*
    document.querySelector('.attachments-btn').addEventListener('click', (e) => {
      data.product_id = e.target.id.split("-")[1];
      Attachments.render(app, data);
      Attachments.attachEvents(app, data);
    });
    */

    document.querySelector('.buy-btn').addEventListener('click', (e) => {
      data.product_id = e.target.dataset.product_id;

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
          category: data.covid19.active_category_name,
          budget: "",
          quantity: "",
          requirements: ""
        })
      }
      localStorage.cart = JSON.stringify(cart);

      InquirePage.render(this.app, data);
      InquirePage.attachEvents(this.app, data);

    });

    
  }

}
