const qrcode = require('./lib/scanner');
const ModTemplate = require('../../lib/templates/modtemplate');

const QRScannerTemplate = require('./qrscanner.template');

class QRScanner extends ModTemplate {
  constructor(app, callback=null) {
    super(app);

    this.video = null;
    this.canvas = null;

    this.canvas_context = null;

    this.isStreamInit = false;

    this.constraints = {
      audio: false,
      video: {
          facingMode: 'environment'
  ***REMOVED***
***REMOVED***;

    this.callback = callback;

    this.name = "QRScanner";
  ***REMOVED***

  initialize(app) {
    super.initialize(app);
  ***REMOVED***

  async initializeHTML(app) {
    qrcode.callback = this.callback != null ? callback : this.read;

    this.video = document.querySelector('video');
    this.canvas = document.getElementById('qr-canvas');

    this.canvas_context = this.canvas.getContext("2d");

    try {
      let stream = await navigator.mediaDevices.getUserMedia(this.constraints)
      this.handleSuccess(stream);
***REMOVED*** catch (err) {
      this.handleError(err);
***REMOVED***
    setTimeout(() => { this.attemptQRDecode() ***REMOVED***, 500);
  ***REMOVED***

  render() {
    document.querySelector('body').innerHTML = QRScannerTemplate();
  ***REMOVED***

  attachEvents() {
    document.querySelector('.file-button')
         .addEventListener('click', (e) => {
            let inputFile  = document.getElementById('file-input');
             inputFile.addEventListener('change', (e) => {
                let file = e.target.files[0];
                if (!file) { return; ***REMOVED***
                this.decodeFromFile(file);
         ***REMOVED***);
             inputFile.click();
     ***REMOVED***);
  ***REMOVED***

  attemptQRDecode() {
    if (this.isStreamInit)  {
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        this.canvas_context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

***REMOVED***
            qrcode.decode();
    ***REMOVED*** catch (err) {
***REMOVED***
            setTimeout(() => { this.attemptQRDecode() ***REMOVED***, 500);
    ***REMOVED***
***REMOVED***
  ***REMOVED***

  decodeFromFile(f) {
    var reader = new FileReader();
    reader.onload = ((file) => {
         return (e) => {
            this.canvas_context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            qrcode.decode(e.target.result);
     ***REMOVED***;
***REMOVED***)(f);
    reader.readAsDataURL(f);
  ***REMOVED***

  handleSuccess(stream) {
    window.stream = stream;
    this.video.srcObject = stream;
    this.isStreamInit = true;
  ***REMOVED***

  handleError(error) {
    console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
  ***REMOVED***

  // default read value that we provide if a callback isn't declared in initialize
  read(a) {
    alert(a);
    setTimeout(() => { this.attemptQRDecode() ***REMOVED***, 500);
  ***REMOVED***
***REMOVED***

module.exports = QRScanner;