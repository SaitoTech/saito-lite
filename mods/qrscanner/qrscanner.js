const qrcode = require('./lib/scanner');
const ModTemplate = require('../../lib/templates/modtemplate');

const QRScannerTemplate = require('./qrscanner.template');

class QRScanner extends ModTemplate {
  constructor(app) {
    super(app);

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

    qrcode.callback = this.read;

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
  }

  attachEvents() {
    document.querySelector('.file-button')
         .addEventListener('click', (e) => {
            let inputFile  = document.getElementById('file-input');
             inputFile.addEventListener('change', (e) => {
                let file = e.target.files[0];
                if (!file) { return; }
                this.decodeFromFile(file);
             });
             inputFile.click();
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

  // default read value that we provide if a callback isn't declared in initialize
  read(a) {
    alert(a);
    setTimeout(() => { this.attemptQRDecode() }, 500);
  }
}

module.exports = QRScanner;