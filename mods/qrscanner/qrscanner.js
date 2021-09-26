const ModTemplate = require('../../lib/templates/modtemplate');
// This header was deprecated, use the new one in lib/saito/ui
// const Header = require('../../lib/ui/header/header');
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
    this.video = null;
    this.canvas = null;
    this.canvas_context = null;
    this.isStreamInit = false;

    this.scanner_callback = null;

    this.description = "Helper module with QR code scanning functionality."
    this.categories  = "Dev Data Utilities";

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

    this.events = ['encrypt-key-exchange-confirm'];

  }

  initialize(app) {
    super.initialize(app);
  }

  initializeHTML(app) {
  }

  attachEvents(app) {
    let scanner_self = this;
    document.querySelector('.launch-scanner').addEventListener('click', function(e) {
      scanner_self.startScanner();
    });
  }



  startQRDecoderInitializationLoop() {

    x = this.attemptQRDecode();

    if (x == 1) {
      console.log("working...");
    } else {
      console.log("wait 100....");
      setTimeout(() => {
        this.startQRDecoderInitializationLoop();
      }, 100);
    }

  }








  startScanner(mycallback=null) {

    if (this.app.BROWSER == 0) { return; }
    if (!document) { return; }
    if (document.querySelector('.qrscanner-container')) { return; }

    this.scanner_callback = null;
    if (mycallback) { this.scanner_callback = mycallback; }

    document.body.innerHTML = this.returnScannerHTML();

    let scanner_self = this;

    scanner_self.start(
      document.getElementById("qr-video"),
      document.getElementById("qr-canvas")
    );

  }

  startEmbeddedScanner(el, mycallback=null) {

    if (this.app.BROWSER == 0) { return; }
    if (!document) { return; }
    if (document.querySelector('.qrscanner-container')) { return; }

    this.scanner_callback = null;
    if (mycallback) { this.scanner_callback = mycallback; }

    el.innerHTML = this.returnScannerHTML();

    let scanner_self = this;

    scanner_self.start(
      document.getElementById("qr-video"),
      document.getElementById("qr-canvas")
    );

  }


  startQRDecoder() {

    x = this.attemptQRDecode();

    if (x == 1) {
    } else {
      setTimeout(() => {
	this.startQRDecoder();
      }, 100);
    }

  }

  returnScannerHTML() {
    return `
      <div class="qrscanner-container">
        <div id="qr-target" class="qr-target"></div>
        <div id="scanline" class="scanline"></div>
        <div class="video-container">
          <video playsinline autoplay id="qr-video" class="qr-video"></video>
        </div>
        <canvas style="display: none" id="qr-canvas"></canvas>
      </div>

    `;
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
    this.startQRDecoderInitializationLoop();
  }


  stop() {
    this.decoder.terminate();
    if (this.video)
      this.video.srcObject.getTracks().forEach(track => track.stop());
  }

  render() {
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
        if (this.canvas.width == 0) return;

        var imgData = this.canvas_context.getImageData(0, 0, this.canvas.width, this.canvas.height);

        if (imgData.data) {
          this.decoder.postMessage(imgData);
        }
        return 1;
      } catch (err) {
        return 0;
      }
    } else {
      return 0;
    }
    return 0;
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

    if (this.scanner_callback != null) {
      this.decoder.terminate();
      this.scanner_callback(msg);
      return;
    }

    if (this.app.crypto.isPublicKey(msg)) {

      // let encrypt_mod = this.app.modules.returnModule('Encrypt');
      // this.initializing_key = true;
      // encrypt_mod.initiate_key_exchange(msg);

      // // need to add chat while this is happening
      // // window.location.assign('/chat');
      // alert(`Initiating Key Exchange with ${msg}`);

      this.decoder.terminate();

      // This header was deprecated
      // AddContact.render(this.app, {publickey: msg, header: Header});
      // AddContact.attachEvents(this.app, {publickey: msg, header: Header});

    } else {
      this.sendEvent('qrcode', msg);
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
