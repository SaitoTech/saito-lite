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

    this.cancel_callback = null;
    this.success_callback = null;

    this.constraints = {
      audio: false,
      video: {
          facingMode: 'environment'
      }
    }

    return this;

  }

  takePhotograph(success_callback=null, cancel_callback=null) {

    this.success_callback = success_callback;
    this.cancel_callback = cancel_callback;

    document.body.innerHTML = this.returnCameraHTML();

    scanner_self.start(
      document.getElementById("qr-video"),
      document.getElementById("qr-canvas")
    );

  }


  attachEvents(app) {

    let scanner_self = this;

    document.querySelector('.take-photo-btn').addEventListener('click', (e) => {

      document.body.innerHTML = this.returnCameraHTML();

      scanner_self.start(
        document.getElementById("qr-video"),
        document.getElementById("qr-canvas")
      );

    });

  }



  async start(video, canvas) {

    this.video = video
    this.canvas = canvas;
    this.canvas_context = this.canvas.getContext("2d");

    try {
      let stream = await navigator.mediaDevices.getUserMedia(this.constraints);
      this.handleSuccess(stream);
    } catch (err) {
    }

    this.startCameraLoop();
  }



  startCameraLoop() {

    //
    // we try to write an image from the camera to the canvas
    // if it succeeds, then we attach the events to the buttons
    // that must be showing on the camera screen
    //
    x = this.attemptVideoCapture();
    if (x == 1) {
      //
      // attach event to button
      //
      document.querySelector(".capture-the-moment-btn").addEventListener('click', (e) => {
	this.captureImage();
      });

    } else {
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

        if (this.canvas.width == 0) { return 0; }
      } catch (err) {
	console.log("ERROR: " + err);
	return 0;
      }
    }

    return 1;
  }

  captureImage() {
`
    //
    // take another (refreshed) image
    //
    this.attemptVideoCapture();
    this.isStreamInit = false;

    //
    // grab image
    //
    var image = new Image();
    image.id = "pic";
    image.src = this.canvas.toDataURL();

    //
    // run callback if exists
    //
    if (this.success_callback != null) {
      this.success_callback(image);
      return;
    }

    //
    // or just display
    //
    document.body.innerHTML = "";
    document.body.appendChild(image);

    return 1;

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
	<div id="capture-the-moment-btn" class="capture-the-moment-btn" style="top:40px;left:20px;position:absolute;width:80%;height:140px;z-index:9999;background-color:white">CAPTURE THE MOMENT</div>
      </div>

    `;

  }


  returnPhotoHTML(imgdata) {

    return `
      <div class="">
      </div>
    `;

  }



}

module.exports = Photograph;

