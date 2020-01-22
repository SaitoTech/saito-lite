// const qrcode = require('./lib/scanner');
const ModTemplate = require('../../lib/templates/modtemplate');
const Header = require('../../lib/ui/header/header');
const QRScannerTemplate = require('./qrscanner.template');
const AddContact = require('./lib/add-contact');

const HeaderDropdownTemplate = (dropdownmods) => {
  html = dropdownmods.map(mod => {
    if (mod.returnLink() != null) {
      return `<a href="${mod.returnLink()}"><li>${mod.name}</li></a>`;
    }
  })
  return `
  <div id="modules-dropdown" class="header-dropdown">
    <ul>${html}</ul>
  </div>`;
}

class QRScanner extends ModTemplate {
  constructor(app) {
    super(app);

    this.name = "QRScanner";
    this.description = "Adds QRCode scanning functionality to Saito";
    this.categories = "Core";

    this.events = ['encrypt-key-exchange-confirm'];
    this.video = null;
    this.canvas = null;
    this.canvas_context = null;
    this.isStreamInit = false;

    this.constraints = {
      audio: false,
      video: {
          facingMode: 'environment'
      }
    };

    // quirc wasm version
    this.decoder = null;
    this.last_scanned_raw = null;
    this.last_scanned_at = null;

    // In milliseconds
    this.debounce_timeout = 750;

  }

  initialize(app) {
    super.initialize(app);
  }

  initializeHTML(app) {
    this.start(
      document.querySelector('video'),
      document.getElementById('qr-canvas')
    );
  }

  async start(video, canvas) {
    this.video = video
    this.canvas = canvas;

    this.canvas_context = this.canvas.getContext("2d");
    this.decoder = new Worker('/qrscanner/quirc_worker.js');

    this.decoder.onmessage = (msg) => { this.onDecoderMessage(msg) };

    try {
      let stream = await navigator.mediaDevices.getUserMedia(this.constraints);
      this.handleSuccess(stream);
    } catch (err) {
      this.handleError(err);
    }
    setTimeout(() => { this.attemptQRDecode() }, 500);
  }

  render() {
    document.querySelector('body').innerHTML = QRScannerTemplate();

    let header = document.getElementsById('qr-hud-header');
    header.append(
        elParser(HeaderDropdownTemplate())
    );
  }

  attachEvents() {
    // document.querySelector('.file-button')
    //      .addEventListener('click', (e) => {
    //         let inputFile  = document.getElementById('file-input');
    //          inputFile.addEventListener('change', (e) => {
    //             let file = e.target.files[0];
    //             if (!file) { return; }
    //             this.decodeFromFile(file);
    //          });
    //          inputFile.click();
    //      });

    document.querySelector('#navigator')
        .addEventListener('click', (e) => {
          let header_dropdown = document.querySelector('.header-dropdown');
          header_dropdown.style.display = header_dropdown.style.display == "none" ? "block" : "none";
        });
  }


  //
  // main loop sending messages to quirc_worker to detect qrcodes on the page
  //
  attemptQRDecode() {
    if (this.isStreamInit)  {
      try {
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        this.canvas_context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

        var imgData = this.canvas_context.getImageData(0, 0, this.canvas.width, this.canvas.height);

        if (imgData.data) {
          this.decoder.postMessage(imgData);
        }
      } catch (err) {
        if (err.name == 'NS_ERROR_NOT_AVAILABLE') setTimeout(() => { this.attemptQRDecode() }, 0);
          console.log("Error");
          console.log(err);
      }
    }
  }

  //
  // worker passes back a message either containing decoded data, 
  // or it attempts t
  //
  onDecoderMessage(msg) {
    if (msg.data != 'done') {
      var qrid = msg.data['payload_string'];
      let right_now = Date.now();
      if (qrid != this.last_scanned_raw || this.last_scanned_at < right_now - this.debounce_timeout) {
        this.last_scanned_raw = qrid;
        this.last_scanned_at = right_now;

        this.handleDecodedMessage(qrid);
      } else if (qrid == this.last_scanned_raw) {
        this.last_scanned_at = right_now;
      }
    }
    setTimeout(() => { this.attemptQRDecode() }, 0);
  }

  //
  // The default behavior of just a publickey is to created initiate a keyexchange.
  // Else, the message is broadcast for other modules to utilize
  //
  handleDecodedMessage(msg) {
    if (this.app.crypto.isPublicKey(msg)) {
      // let encrypt_mod = this.app.modules.returnModule('Encrypt');

      // this.initializing_key = true;
      // encrypt_mod.initiate_key_exchange(msg);

      // // need to add chat while this is happening
      // // window.location.assign('/chat');
      // alert(`Initiating Key Exchange with ${msg}`);

      this.decoder.terminate();

      AddContact.render(this.app, {publickey: msg, header: Header});
      AddContact.attachEvents(this.app, {publickey: msg, header: Header});
    } else {
      this.sendEvent('qrcode', a);
    }
  }

  decodeFromFile(f) {
    var reader = new FileReader();
    reader.onload = ((file) => {
         return (e) => {
            this.canvas_context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            // port to new quirc system
         };
    })(f);
    reader.readAsDataURL(f);
  }

  handleSuccess(stream) {
    window.stream = stream;
    this.video.srcObject = stream;
    this.isStreamInit = true;
  }

  handleError(error) {
    console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
  }

  receiveEvent(type, data) {
    if (type === "encrypt-key-exchange-confirm") {
        if (document.getElementById('qr-canvas') && this.initializing_key) {
          window.location.assign('/chat');
        }
    }
  }
}

module.exports = QRScanner;
