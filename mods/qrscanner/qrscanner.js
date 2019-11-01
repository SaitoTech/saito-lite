const qrcode = require('./lib/scanner');
const ModTemplate = require('../../lib/templates/modtemplate');

const HeaderDropdownTemplate = require('../../lib/ui/header/header-dropdown.template');
const QRScannerTemplate = require('./qrscanner.template');

class QRScanner extends ModTemplate {
  constructor(app) {
    super(app);

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

    qrcode.callback = (data) => { this.read(data) };

    this.name = "QRScanner";
  }

  initialize(app) {
    super.initialize(app);
  }

  async initializeHTML(app) {
    this.video = document.querySelector('video');
    this.canvas = document.getElementById('qr-canvas');

    this.canvas_context = this.canvas.getContext("2d");

    try {
      let stream = await navigator.mediaDevices.getUserMedia(this.constraints)
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

  attemptQRDecode() {
    if (this.isStreamInit)  {
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        this.canvas_context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

        try {
            qrcode.decode();
        } catch (err) {
            console.log(err);
            setTimeout(() => { this.attemptQRDecode() }, 500);
        }
    }
  }

  decodeFromFile(f) {
    var reader = new FileReader();
    reader.onload = ((file) => {
         return (e) => {
            this.canvas_context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            qrcode.decode(e.target.result);
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
        if (document.getElementById('qr-canvas')) {
          alert('sucess');
          window.location.assign('/chat');
        }
    }
  }

  // default read value that we provide if a callback isn't declared in initialize
  read(a) {
    if (this.app.crypto.isPublicKey(a)) {
      let encrypt_mod = this.app.modules.returnModule('Encrypt');
      encrypt_mod.initiate_key_exchange(a);
      alert(`Initiating Key Exchange with ${a}`);
    } else {
      this.sendEvent('qrcode', a);
    }
    setTimeout(() => { this.attemptQRDecode() }, 500);
  }
}

module.exports = QRScanner;