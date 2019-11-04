// const qrcode = require('./lib/scanner');
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
  ***REMOVED***
***REMOVED***;

    // quirc wasm version
    this.decoder = null;
    this.last_scanned_raw = null;
    this.last_scanned_at = null;

    // In milliseconds
    this.debounce_timeout = 750;

    this.name = "QRScanner";
  ***REMOVED***

  initialize(app) {
    super.initialize(app);
  ***REMOVED***

  async initializeHTML(app) {
    this.video = document.querySelector('video');
    this.canvas = document.getElementById('qr-canvas');

    this.canvas_context = this.canvas.getContext("2d");
    this.decoder = new Worker('/qrscanner/quirc_worker.js');

    this.decoder.onmessage = (msg) => { this.onDecoderMessage(msg) ***REMOVED***;

    try {
      let stream = await navigator.mediaDevices.getUserMedia(this.constraints);
      this.handleSuccess(stream);
***REMOVED*** catch (err) {
      this.handleError(err);
***REMOVED***
    setTimeout(() => { this.attemptQRDecode() ***REMOVED***, 500);
  ***REMOVED***

  render() {
    document.querySelector('body').innerHTML = QRScannerTemplate();

    let header = document.getElementsById('qr-hud-header');
    header.append(
        elParser(HeaderDropdownTemplate())
    );
  ***REMOVED***

  attachEvents() {
    // document.querySelector('.file-button')
    //      .addEventListener('click', (e) => {
    //         let inputFile  = document.getElementById('file-input');
    //          inputFile.addEventListener('change', (e) => {
    //             let file = e.target.files[0];
    //             if (!file) { return; ***REMOVED***
    //             this.decodeFromFile(file);
    //      ***REMOVED***);
    //          inputFile.click();
    //  ***REMOVED***);

    document.querySelector('#navigator')
         .addEventListener('click', (e) => {
             let header_dropdown = document.querySelector('.header-dropdown');
             header_dropdown.style.display = header_dropdown.style.display == "none" ? "block" : "none";
     ***REMOVED***);
  ***REMOVED***


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
    ***REMOVED***
  ***REMOVED*** catch (err) {
        if (err.name == 'NS_ERROR_NOT_AVAILABLE') setTimeout(() => { this.attemptQRDecode() ***REMOVED***, 0);
          console.log("Error");
          console.log(err);
  ***REMOVED***
***REMOVED***
  ***REMOVED***

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
  ***REMOVED*** else if (qrid == this.last_scanned_raw) {
        this.last_scanned_at = right_now;
  ***REMOVED***
***REMOVED***
    setTimeout(() => { this.attemptQRDecode() ***REMOVED***, 0);
  ***REMOVED***

  //
  // The default behavior of just a publickey is to created initiate a keyexchange.
  // Else, the message is broadcast for other modules to utilize
  //
  handleDecodedMessage(msg) {
    if (this.app.crypto.isPublicKey(msg)) {
      let encrypt_mod = this.app.modules.returnModule('Encrypt');
      encrypt_mod.initiate_key_exchange(msg);

      // need to add chat while this is happening
      // window.location.assign('/chat');
      alert(`Initiating Key Exchange with ${msg***REMOVED***`);
***REMOVED*** else {
      this.sendEvent('qrcode', a);
***REMOVED***
  ***REMOVED***

  decodeFromFile(f) {
    var reader = new FileReader();
    reader.onload = ((file) => {
         return (e) => {
            this.canvas_context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ***REMOVED*** port to new quirc system
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

  receiveEvent(type, data) {
    if (type === "encrypt-key-exchange-confirm") {
        if (document.getElementById('qr-canvas')) {
          window.location.assign('/chat');
    ***REMOVED***
***REMOVED***
  ***REMOVED***
***REMOVED***

module.exports = QRScanner;