const ScanCheckTemplate = require('./scan-check.template');


module.exports = ScanCheck = {

  render(app, data) {
    document.querySelector(".main").innerHTML = ScanCheckTemplate();
    //document.querySelector(".product_id").value = data.product_uuid;

    //this.generateQRCode("Hello World!");

  },

  attachEvents(app, data) {

    let scanner_self = this;
    let qrscanner = app.modules.returnModule("QRScanner");
    try {
      document.querySelector('.launch-scanner').addEventListener('click', function (e) {
        qrscanner.startEmbeddedScanner(document.querySelector(".scanner-shim"), scanner_self.handleDecodedMessage);
      });
    } catch (err) { }
    document.querySelector('.launch-scanner').click();
  },

  //
  // handle scanned message
  //
  handleDecodedMessage(msg) {

    var this_mod = this.app.modules.returnModule('Camel')

    siteMessage('Scan Successful', 1000);
    try {
      var payload = {};
      msg.split("?")[1].split("&").forEach(pair => {
        let val = pair.split("=");
        payload[val[0]] = val[1];
      });

      var sql = `
      select 
        *
      from 
        scans
      where
        target_id = '${payload.uuid}';
      `;

      var html = "";
      var scans = [];
      var product_id = "";
      var product = {};

      this_mod.sendPeerDatabaseRequestRaw("camel", sql, function (res) {
        if (res.rows.length > 0) {
          scans = res.rows;
          product_id = res.rows[0].product_id;

          sql = `
          select 
            *
          from 
            products
          where
            uuid = '${product_id}';
      `;
  
        this_mod.sendPeerDatabaseRequestRaw("camel", sql, function (res) {
          if (res.rows.length > 0) {
            product = res.rows[0];

            if (product.product_name) {
              html = `
            <div class="scan-check-product grid-2">
              <div class="table-head">Name</div>
              <div>${product.product_name}</div>
              <div class="table-head">Product Image</div>
              <div><img style='max-width:200px;max-height:200px' src='${product.product_photo}'/></div>
            </div>
            `;
            } else {
              html = `<h3>Unknown Product</h3>`;
            }
            if (product.product_name) {
              html = `
            <div class="scan-check-product grid-2">
              <div class="table-head">Name</div>
              <div>${product.product_name}</div>
              <div class="table-head">Product Image</div>
              <div><img style='max-width:200px;max-height:200px' src='${product.product_photo}'/></div>
            </div>
            `;
            } else {
              html = `<h3>Unknown Product</h3>`;
            }
      
            if (scans.length > 0) {
              html += `
            <div class="scan-history grid-2-columns">
              <div class="table-head">Type</div>
              <div class="table-head">Date</div>
          `;
              scans.forEach(row => {
                html += `
              <div>${row.scan_type}</div>
              <div>${new Date(row.scan_time).toLocaleDateString('zh-CN', { dateStyle: 'short', hour12: false })}</div>
            `;
              });
              html += `</div>`;
            } else {
              html += `<h3>No records found.</h3>`;
            }

            document.querySelector(".main").innerHTML = `
            <div>
              <h2>QR Code Check Results</h2>
              <hr />
            </div>
            ${html}
            <div class="main-form-buttons">
              <button class="scan-again">Scan Another</button>
              <button class="scan-exit">Exit</button>
            </div>
            `;

            document.querySelector('.scan-again').addEventListener('click', () => {
              document.querySelector(".main").innerHTML = ScanCheckTemplate();
            });
      
            document.querySelector('.scan-exit').addEventListener('click', () => {
              let app = this.app;
              let data = {};
              UpdateSuccess.render(app, data);
              UpdateSuccess.attachEvents(app, data);
            });

          }
        });

        }
      });


    } catch (err) {
      console.log(err);
    }
  }

}
