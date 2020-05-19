const UpdateProductTemplate = require('./update-product.template');
const Certification = require('./certification');
const AttachFile = require('./attach-file');
const AttachBundle = require('./attach-bundle');
const Attachments = require('./attachments');
const UpdateSuccess = require('./update-success');


module.exports = UpdateProduct = {

  render(app, data) {

    document.querySelector(".main").innerHTML = UpdateProductTemplate(app, data);
    document.querySelector(".navigation").innerHTML = '<div class="button navlink covid_back"><i class="fas fa-back"></i> Back</div>';

    var html = "";
    
      data.covid19.sendPeerDatabaseRequest("covid19", "products", "*", "deleted <> 1 AND products.id = " + data.product_id, null, function (res) {

      document.querySelector(".loading").style.display = "none";
      document.querySelector(".portal").style.display = "block";

      if (res.rows.length > 0) {

        document.querySelector(".update-product-btn").style.display = "block";
        document.querySelector(".certification-space").style.display = "block";
        document.querySelector(".attach-cert-btn").style.display = "block";
        document.querySelector(".attach-file-btn").style.display = "block";
        document.querySelector(".attach-bundle-btn").style.display = "block";
        document.querySelector(".attachments-btn").style.display = "block";

        html = data.covid19.returnForm("covid19", "products", data.product_id, res.rows[0]);
        document.getElementById("product-grid").style.display = "grid";

        //
        // load certifications
        // need to add supplier?
        
        //deprecated file load
        /*
        fields = "pc.product_id as 'product_id', c.name as 'Name', note, pc.id as cert_id, 'certifications' as 'source'";
        var from = "certifications as 'c' JOIN products_certifications as 'pc'";
        var where = "c.id = pc.certification_id and pc.product_id = " + data.product_id;
        data.covid19.sendPeerDatabaseRequest("covid19", from, fields, where, null, function (res) {
          if (res.rows.length > 0) {
            data.covid19.renderCerts(res.rows, document.querySelector('.cert-grid'));
          }
        });
        */
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


      } else {

        let row = {
          product_name: "",
          supplier_id: "",
          category_id: "",
          product_specification: "",
          product_photo: "",
          product_description: "",
          product_dimensions: "",
          product_quantities: "",
          product_weight: "",
          pricing_per_unit_rmb: "",
          pricing_per_unit_public: "",
          pricing_notes: "",
          pricing_payment_terms: "",
          production_stock: "",
          production_daily_capacity: "",
          production_minimum_order: "",
          published: "",
        }

        html = data.covid19.returnForm("covid19", "products", "", row);
      }

      document.querySelector('.product-grid').innerHTML = html;
      document.querySelector('.product-grid').style.display = 'grid';
      document.querySelector('.update-product-btn').style.display = 'block';

      data.covid19.treatPhoto(document.getElementById("product_photo"));
      data.covid19.treatBoolean(document.getElementById("published"));
     
      data.covid19.treatACDropDown(document.getElementById("category_id"), "categories", "id", "name");
      if (data.covid19.isAdmin()) {
        data.covid19.treatACDropDown(document.getElementById("supplier_id"), "suppliers", "id", "name");
      }else{
        data.covid19.treatHide(document.getElementById("supplier_id"));
        document.getElementById("supplier_id").value = data.supplier_id;
      }
    });
    
  },

  attachEvents(app, data) {

    document.querySelector('.update-product-btn').addEventListener('click', (e) => {

      data.covid19.submitForm();
      UpdateSuccess.render(app, data);
      UpdateSuccess.attachEvents(app, data);

    });

    try {
      document.querySelector('.covid_back').addEventListener('click', (e) => {
        if (data.covid19.active_category_id > 0) {
          data.covid19.renderPage("customer", app, data);
        } else {
          data.covid19.renderPage("home", app, data);
        }
      });
    } catch (err) { }

    document.querySelector('.attach-cert-btn').addEventListener('click', (e) => {
      data.product_id = e.target.id.split("-")[1];
      Certification.render(app, data);
      Certification.attachEvents(app, data);
    });

    document.querySelector('.attach-file-btn').addEventListener('click', (e) => {
      data.product_id = e.target.id.split("-")[1];
      data.target_object = 'products';
      AttachFile.render(app, data);
      AttachFile.attachEvents(app, data);
    });

    document.querySelector('.attach-bundle-btn').addEventListener('click', (e) => {
      data.product_id = e.target.id.split("-")[1];
      data.target_object = 'products';
      AttachBundle.render(app, data);
      AttachBundle.attachEvents(app, data);
    });

    document.querySelector('.attachments-btn').addEventListener('click', (e) => {
      data.product_id = e.target.id.split("-")[1];
      Attachments.render(app, data);
      Attachments.attachEvents(app, data);
    });


   }

}

