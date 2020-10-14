const ScanInTemplate = require('./scan-in.template');


module.exports = ScanIn = {

  render(app, data) {
    document.querySelector(".main").innerHTML = ScanInTemplate();
    document.querySelector(".product_id").value = data.product_uuid;

    //this.generateQRCode("Hello World!");

  },

  attachEvents(app, data) {

    let scanner_self = this;
    let qrscanner = app.modules.returnModule("QRScanner");
    try {
      document.querySelector('.launch-scanner').addEventListener('click', function(e) {
        qrscanner.startEmbeddedScanner(document.querySelector(".scanner-shim"), scanner_self.handleDecodedMessage);
      });
    } catch (err) {}
    document.querySelector('.launch-scanner').click();
  },


  generateQRCode(data) {
    try {
      const QRCode = require('../../../../lib/helpers/qrcode');
      return new QRCode(
        document.getElementById("qrcode"),
        data
      );
    } catch (err) {}
  },


  //
  // handle scanned message
  //
  handleDecodedMessage(msg) {
    siteMessage('Scan Successful', 250);
  try {
    var payload = {};
    msg.split("?")[1].split("&").forEach(pair => {
      let val = pair.split("=");
      payload[val[0]] = val[1];
    });

    let fields = [];
    let values = [];
    
    fields[0] = {
      name: 'product_id',
      value: document.querySelector('.product_id').value
      }
    fields[1] = {
      name: 'target_id',
      value: payload.uuid
    }
    fields[2] = {
      name: 'scan_type',
      value: 'scan_in'
    }
    fields[3] = {
      name: 'scan_time',
      value: new Date().getTime()
    }

    fields.forEach(field => {
      let val = {}
      val.dbname = "camel";
      val.table = "scans";
      val.column = field.name,
      val.value = field.value;
      values.push(val);
    });

    this.app.modules.returnModule('Camel').submitValues(values);

    document.querySelector(".main").innerHTML = `
      <div>
        <h2>Scan QR Code</h2>
        <hr />
      </div>
      <p>ID: ${payload.uuid} scanned in.</p>
      <div class="main-form-buttons">
        <button class="scan-again">Scan Another</button>
        <button class="scan-exit">Exit</button>
      </div>
      `;

    document.querySelector('.scan-again').addEventListener('click', () => {
      document.querySelector(".main").innerHTML = ScanInTemplate();
      document.querySelector(".product_id").value = document.querySelector('.product_id').value;
    });

    document.querySelector('.scan-exit').addEventListener('click', () => {
      let data = {}
      data.mod = this;
      this.app.modules.returnModule('Camel').setRoute(this.app, data);
    });


    } catch (err) {
      console.log(err);
    }
  }

}
