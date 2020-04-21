const UpdateProductTemplate = require('./update-product.template');
const Certification = require('./certification');
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

        html = data.covid19.returnForm("covid19", "products", "", res.rows[0]);
        document.getElementById("product-grid").style.display = "grid";

        //
        // load certifications
        // need to add supplier?

        fields = "pc.product_id as 'product_id', c.name as 'Name', note, pc.id as cert_id";
        var from = "certifications as 'c' JOIN products_certifications as 'pc'";
        var where = "c.id = pc.certification_id and pc.product_id = " + data.product_id;
        data.covid19.sendPeerDatabaseRequest("covid19", from, fields, where, null, function (res) {
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
        }

        html = data.covid19.returnForm("covid19", "products", "", row);
      }

      document.querySelector('.product-grid').innerHTML = html;


      function treatPhoto(el) {

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
      treatPhoto(document.getElementById("product_photo"));

      function treatACDropDown(el, dbtable, idcol, valuecol) {

        let cell = el.id;
        let html = "";
        var options = "";
        data.covid19.sendPeerDatabaseRequest("covid19", dbtable, idcol + " as 'id', " + valuecol + " as 'value'", "deleted <> 1", null, function (res) {
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
            el.value = document.querySelector(`'#${dbtable}-options [value='${e.target.value}']`).dataset.value;
          });

          document.getElementById(`${dbtable}-display`).addEventListener("focus", (e) => {
            e.target.value = "";
            e.target.click();
            e.target.keyup();
          });

        });

      }

      treatACDropDown(document.getElementById("supplier_id"), "suppliers", "id", "name");
      treatACDropDown(document.getElementById("category_id"), "categories", "id", "name");
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
      data.id = e.target.id.split("-")[1];
      Certification.render(app, data);
      Certification.attachEvents(app, data);
    });

   }

}

