var ModTemplate = require('../../lib/templates/modtemplate');
const Header = require('../../lib/ui/header/header');


//////////////////
// CONSTRUCTOR  //
//////////////////
class Photograph extends ModTemplate {

  constructor(app) {

    super(app);

    this.name            = "Photograph";
    this.description     = "Take a photo and upload it to the Saito Blockchain";
    this.categories      = "Tutorials";

    this.video = null;
    this.canvas = null;
    this.canvas_context = null;
    this.isStreamInit = false;
    this.constraints = {
      audio: false,
      video: {
          facingMode: 'environment'
      }
    }

    return this;

  }

  initializeHTML(app) {

  }

  attachEvents(app) {

    let scanner_self = this;

    document.querySelector('.take-photo-btn').addEventListener('click', (e) => {

      document.body.innerHTML = this.returnCameraHTML();

      scanner_self.start(
        document.getElementById("qr-video"),
        document.getElementById("qr-canvas")
      );

      alert("You have clicked me!");

    });

  }


/***
        var imgData = this.canvas_context.getImageData(0, 0, this.canvas.width, this.canvas.height);

        if (imgData.data) {
          this.decoder.postMessage(imgData);
        }
        return 1;
****/


  async start(video, canvas) {

    this.video = video
    this.canvas = canvas;

    this.canvas_context = this.canvas.getContext("2d");

    try {
      let stream = await navigator.mediaDevices.getUserMedia(this.constraints);
      this.handleSuccess(stream);
    } catch (err) {
console.log("ERROR!: " + err);
    }

    this.startCameraLoop();
  }


  startCameraLoop() {

    x = this.attemptVideoCapture();

    if (x == 1) {
      console.log("working...");
    } else {
      console.log("wait 100....");
      setTimeout(() => {
        this.startCameraLoop();
      }, 100);
    }

  }


  //
  // main loop sending messages to quirc_worker to detect qrcodes on the page
  //
  attemptVideoCapture() {
    if (this.isStreamInit)  {

      try {
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        this.canvas_context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        if (this.canvas.width == 0) { return; }

        var imgData = this.canvas_context.getImageData(0, 0, this.canvas.width, this.canvas.height);

        if (imgData.data) {
console.log("DATA CAPTURED!");
//          this.decoder.postMessage(imgData);
        }

        return 1;

      } catch (err) {
        return 0;
console.log("ERROR CAPTURING DATA");
        //if (err.name == 'NS_ERROR_NOT_AVAILABLE') { setTimeout(() => { this.attemptQRDecode() }, 0); return; }
        //setTimeout(() => { this.attemptQRDecode() }, 500);
      }

    } else {
console.log("isStreamInit not initialized");
      return 0;
    }
    return 0;
  }





  
  handleSuccess(stream) {
    window.stream = stream;
    this.video.srcObject = stream;
    this.isStreamInit = true;
  }




  returnCameraHTML() {

    return `
      <div class="qrscanner-container">
        <div id="qr-target" class="qr-target"></div>
        <div id="scanline" class="scanline"></div>
        <div class="video-container">
          <video playsinline autoplay id="qr-video" style="height: 100vh;width: 100vw;"></video>
        </div>
        <canvas style="display: none" id="qr-canvas"></canvas>
	<div id="capture-the-moment-btn" class="capture-the-moment-btn" style="position:absolute; width:80%;height:140px; background-color:white">CAPTURE THE MOMENT</div>
      </div>

    `;

  }



}

module.exports = Photograph;

