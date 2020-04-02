const CertificationTemplate = require('./certification.template');

module.exports = Certification = {

  render(app, data) {

    document.querySelector('.main').innerHTML += CertificationTemplate();

    var select = document.getElementById('certifications-list');

    data.covid19.sendPeerDatabaseRequest("covid19", "certifications", "*", "", null, function (res) {
      var none = document.createElement("option");
      none.text = 'Please Select';
      none.value = '';
      select.add(none);
      if (res.rows.length > 0) {
        res.rows.forEach(row => {
          var option = document.createElement("option");
          option.text = row.name;
          option.value = row.id;
          select.add(option);
        });
        var option = document.createElement("option");
        option.text = "Add New"
        option.value = res.rows.length + 1;
        select.add(option);
      }
    });

    document.getElementById("pc_product_id").value = data.id;
    select.addEventListener("change", (e) => {
      var opt = select.options[select.selectedIndex];
      document.getElementById("pc_certification_id").value = opt.value;
      if (opt.text == 'Add New') {
        document.getElementById("certification_name").value = "";
        document.getElementById("certification_name").style.display = "block";
        document.getElementById("certification_name").dataset.id = "new";
        document.getElementById("certification_name").dataset.ignore = false;
        } else {
        document.getElementById("certification_name").style.display = "none";
        document.getElementById("certification_name").dataset.ignore = true;
      }

    });

  },

  attachEvents(app, data) {
    let supplier_publickey = app.wallet.returnPublicKey();

    try {
      let pkeyobj = document.querySelector(".supplier_publickey");
      if (pkeyobj) {
        supplier_publickey = pkeyobj.value;
      }
    } catch (err) {}
      document.getElementById('save-certification').addEventListener('click', (e) => {
        let values = [];

        document.querySelector('.certification').querySelectorAll('input').forEach(input => {
          if (input.dataset.ignore != "true") {
            let field = {};
            field.table = input.dataset.table;
            field.column = input.dataset.column;
            field.value = input.value;
            field.id = input.dataset.id;
            values.push(field);
          }
        });

        //console.log("Updating Values: " + JSON.stringify(values));

        data.covid19.updateServerDatabase(values, supplier_publickey, "Table Update");

        //alert("HERE WE ARE");

        UpdateSuccess.render(app, data);
        UpdateSuccess.attachEvents(app, data);
        //document.querySelector('.certification').destroy();
      });


      document.querySelector("#certification_file").addEventListener('change', (e) => {
        var reader = new FileReader();
        var file = e.target.files[0];
        var fileEl = document.querySelector("#certification_file_data");
        reader.addEventListener("load", function () {
          var displayEl = document.querySelector("#certification_display");
          if (file.type.split("/")[0] == "image") {
            displayEl.innerHTML = "<img class='product-image' alt='certification file' src='" + reader.result + "'/>";
          } else {
            displayEl.innerHTML = file.type.split("/")[1].toUpperCase();
          }
          document.querySelector("#certification_file_data").value = reader.result;
          document.querySelector("#certification_file_name").value = file.name;
          document.querySelector("#certification_file_type").value = file.type;
        }, false);
        reader.readAsDataURL(file);
      });
      document.querySelector("#certification_display").addEventListener('click', e => {
        document.querySelector("#certification_file").click();
      });

    }
}

