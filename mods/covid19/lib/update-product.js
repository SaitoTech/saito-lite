const UpdateProductTemplate = require('./update-product.template');
const Certification = require('./certification');
const UpdateSuccess = require('./update-success');

module.exports = UpdateProduct = {

  render(app, data) {

    document.querySelector(".main").innerHTML = UpdateProductTemplate(app, data);
    document.querySelector(".navigation").innerHTML = '<div class="button navlink covid_back"><i class="fas fa-back"></i> Back</div>';

    //
    // load categories
    //
    data.covid19.sendPeerDatabaseRequest("covid19", "categories", "*", "", null, function (res) {

      document.querySelector(".loading").style.display = "none";
      for (let i = 0; i < res.rows.length; i++) {
        let opt = document.createElement('option');
        opt.value = res.rows[i].id;
        opt.innerHTML = res.rows[i].name;
        document.getElementById('select-product-type').appendChild(opt);
      }
      document.querySelector(".portal").style.display = "block";

      data.covid19.sendPeerDatabaseRequest("covid19", "products JOIN suppliers", "*", "products.supplier_id = suppliers.id AND products.id = " + data.product_id, null, function (res) {

        if (res.rows.length > 0) {

          try {
            //alert("SUPPLIER PUZBLICKZEY!");
            document.querySelector(".supplier_publickey").value = res.rows[0].publickey;
            //alert("SUPPLIER PUZBLICKZEY: " + res.rows[0][publickey]);
          } catch (err) { }

          data.covid19.renderProductForm(res.rows[0]);
          document.getElementById("product-grid").style.display = "grid";
          document.querySelector(".update-product-btn").style.display = "block";
          document.querySelector(".attach-cert-btn").style.display = "block";


          //
          // load certifications
          //
          //fields = "c.name as 'Name', (select id from attachments where id = pc.id ) as attachment_id";
          //var from = "certifications as 'c' JOIN products_certifications as 'pc'";
          //var where = "c.id = pc.certification_id and pc.product_id =";
          //data.covid19.sendPeerDatabaseRequest("covid19", from, fields, where + data.id, null, function (res) {
          fields = "pc.product_id as 'product_id', c.name as 'Name', pc.id as cert_id";
          var from = "certifications as 'c' JOIN products_certifications as 'pc'";
          var where = "c.id = pc.certification_id and pc.product_id = " + data.product_id;
          data.covid19.sendPeerDatabaseRequest("covid19", from, fields, where, null, function (res) {
            if (res.rows.length > 0) {

              data.covid19.renderCerts(res.rows, document.querySelector('.cert-grid'));

            }
          });


        } else {

          let row = {
            id: 0,
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
            pricing_notes: "",
            pricing_payment_terms: "",
            production_stock: "",
            production_daily_capacity: "",
            production_minimum_order: "",
          }
          data.covid19.renderProductForm(row);
        }

        document.querySelectorAll('.product-image').forEach(img => {
          document.querySelector(".products-" + img.id.split('-')[1]).addEventListener('change', (e) => {
            var reader = new FileReader();
            var file = e.target.files[0];
            var fileEl = document.querySelector(".products-text-" + img.id.split('-')[1]);
            reader.addEventListener("load", function () {
              img.src = reader.result;
              fileEl.value = reader.result;
            }, false);
            reader.readAsDataURL(file);
            //img.src = reader.result;
            //e.target.value = reader.result;
          });
          img.addEventListener('click', e => {
            //var item = e.toElement.id.split("-")[1];
            //salert(e.toElement.id);
            document.querySelector(".products-" + img.id.split('-')[1]).click();
          });
        });
      });
    });
  },

  attachEvents(app, data) {

    document.querySelector('.update-product-btn').addEventListener('click', (e) => {

      let product_id = e.currentTarget.id;
      let supplier_publickey = app.wallet.returnPublicKey();

      try {
        let pkeyobj = document.querySelector(".supplier_publickey");
        if (pkeyobj) {
          supplier_publickey = pkeyobj.value;
        }
      } catch (err) { }

      let values = [];

      Array.from(document.getElementsByClassName('input')).forEach(input => {
        let field = {};
        field.table = input.dataset.table;
        field.column = input.dataset.column;
        field.value = input.value;
        field.id = product_id;
        values.push(field);
      });
      Array.from(document.getElementsByClassName('textarea')).forEach(input => {
        let field = {};
        field.table = input.dataset.table;
        field.column = input.dataset.column;
        field.value = input.value;
        field.id = product_id;
        values.push(field);
      });

      data.covid19.updateServerDatabase(values, supplier_publickey);

      UpdateSuccess.render(app, data);
      UpdateSuccess.attachEvents(app, data);

    });

    try {
      document.querySelector('.covid_back').addEventListener('click', (e) => {
        data.covid19.renderPage("home", app, data);
      });
    } catch (err) { }

    document.querySelector('.attach-cert-btn').addEventListener('click', (e) => {
      data.id = e.toElement.id.split("-")[1];
      Certification.render(app, data);
      Certification.attachEvents(app, data);
    });



    document.getElementById('select-product-type').addEventListener('change', (e) => {
      let category_id = e.currentTarget.value;
      document.getElementById("product-grid").style.display = "grid";
      document.querySelector(".button").style.display = "block";
    });



  }

}

